import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Verification from '@/models/Verification';
import Provider from '@/models/Provider';
import { verificationReviewSchema } from '@/lib/validators';
import { requireRole } from '@/lib/auth';
import { handleRoute, ok, fail } from '@/lib/apiResponse';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireRole('admin');
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Verification record not found', 404);
    const input = verificationReviewSchema.parse(await req.json());

    // Review the submission and update the provider's aggregate status in one
    // transaction. This prevents a concurrent review or replacement submission
    // from leaving the provider status out of sync with the latest documents.
    const dbSession = await mongoose.startSession();
    let outcome:
      | { kind: 'reviewed'; verification: NonNullable<Awaited<ReturnType<typeof Verification.findById>>> }
      | { kind: 'already-reviewed' }
      | { kind: 'not-found' }
      | undefined;

    try {
      await dbSession.withTransaction(async () => {
        const update: Record<string, unknown> = {
          status: input.status,
          reviewedBy: session.userId,
          reviewedAt: new Date(),
        };
        if (input.notes !== undefined) update.notes = input.notes;

        const verification = await Verification.findOneAndUpdate(
          { _id: id, status: 'pending' },
          { $set: update },
          { new: true, runValidators: true, session: dbSession }
        );

        if (!verification) {
          const exists = await Verification.exists({ _id: id }).session(dbSession);
          outcome = exists ? { kind: 'already-reviewed' } : { kind: 'not-found' };
          return;
        }

        const submissions = await Verification.find({ providerId: verification.providerId })
          .sort({ createdAt: -1, _id: -1 })
          .session(dbSession);

        // The newest submission for each document type is authoritative.
        const latestByType = new Map<string, (typeof submissions)[number]>();
        for (const submission of submissions) {
          if (!latestByType.has(submission.type)) {
            latestByType.set(submission.type, submission);
          }
        }

        const latestStatuses = Array.from(latestByType.values()).map((item) => item.status);
        let nextProviderStatus: 'unverified' | 'pending' | 'verified' | 'rejected';

        if (latestStatuses.includes('pending')) {
          nextProviderStatus = 'pending';
        } else if (latestStatuses.includes('rejected')) {
          nextProviderStatus = 'rejected';
        } else if (latestStatuses.includes('verified')) {
          nextProviderStatus = 'verified';
        } else {
          nextProviderStatus = 'unverified';
        }

        const provider = await Provider.findById(verification.providerId).session(dbSession);
        if (provider) {
          provider.verificationStatus = nextProviderStatus;
          provider.verifiedAt = nextProviderStatus === 'verified' ? new Date() : undefined;
          await provider.save({ session: dbSession });
        }

        outcome = { kind: 'reviewed', verification };
      });
    } finally {
      await dbSession.endSession();
    }

    if (!outcome || outcome.kind === 'not-found') {
      return fail('Verification record not found', 404);
    }
    if (outcome.kind === 'already-reviewed') {
      return fail('This verification submission has already been reviewed', 409);
    }

    return ok(outcome.verification);
  });
}
