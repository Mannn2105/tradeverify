import { NextRequest } from 'next/server';
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
    const verification = await Verification.findById(id);
    if (!verification) return fail('Verification record not found', 404);

    // A decision is final for this submission. Providers must upload a new
    // document to request another review after rejection.
    if (verification.status !== 'pending') {
      return fail('This verification submission has already been reviewed', 409);
    }

    const input = verificationReviewSchema.parse(await req.json());

    verification.status = input.status;
    verification.notes = input.notes ?? verification.notes;
    verification.reviewedBy = session.userId as unknown as typeof verification.reviewedBy;
    verification.reviewedAt = new Date();
    await verification.save();

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
