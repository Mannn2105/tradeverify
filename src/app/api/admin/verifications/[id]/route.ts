import { NextRequest } from 'next/server';
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

    // Compare-and-set makes the review decision atomic: two administrators
    // cannot both approve/reject the same pending submission concurrently.
    const update: Record<string, unknown> = {
      status: input.status,
      reviewedBy: session.userId,
      reviewedAt: new Date(),
    };
    if (input.notes !== undefined) update.notes = input.notes;

    const verification = await Verification.findOneAndUpdate(
      { _id: id, status: 'pending' },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!verification) {
      const exists = await Verification.exists({ _id: id });
      return exists
        ? fail('This verification submission has already been reviewed', 409)
        : fail('Verification record not found', 404);
    }

    // Only the newest submission for each document type represents its
    // current state. Older rejected records remain as audit history but do
    // not permanently block a provider who has submitted a replacement.
    const submissions = await Verification.find({ providerId: verification.providerId })
      .sort({ createdAt: -1, _id: -1 });

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

    const provider = await Provider.findById(verification.providerId);
    if (provider) {
      provider.verificationStatus = nextProviderStatus;
      provider.verifiedAt = nextProviderStatus === 'verified' ? new Date() : undefined;
      await provider.save();
    }

    return ok(verification);
  });
}
