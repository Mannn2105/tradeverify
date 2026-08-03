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

    const input = verificationReviewSchema.parse(await req.json());

    verification.status = input.status;
    verification.notes = input.notes ?? verification.notes;
    verification.reviewedBy = session.userId as unknown as typeof verification.reviewedBy;
    verification.reviewedAt = new Date();
    await verification.save();

    // Approving a document promotes the provider to 'verified' — but only if
    // no other submitted check is currently rejected and blocking them.
    // Approval is the single path that makes a provider visible in search.
    if (input.status === 'verified') {
      const outstandingRejections = await Verification.exists({
        providerId: verification.providerId,
        status: 'rejected',
      });
      if (!outstandingRejections) {
        await Provider.findByIdAndUpdate(verification.providerId, {
          verificationStatus: 'verified',
          verifiedAt: new Date(),
        });
      }
    } else if (input.status === 'rejected') {
      await Provider.findByIdAndUpdate(verification.providerId, {
        verificationStatus: 'rejected',
      });
    }

    return ok(verification);
  });
}
