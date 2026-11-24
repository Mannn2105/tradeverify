import { NextRequest } from 'next/server';
import mongoose, { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Verification from '@/models/Verification';
import { verificationSubmitSchema } from '@/lib/validators';
import { requireSession, AuthError } from '@/lib/auth';
import { handleRoute, created, fail, ok } from '@/lib/apiResponse';

// Submit a new document. The record creation and provider status change are
// atomic so a concurrent admin review cannot overwrite a newer submission.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Provider not found', 404);
    const input = verificationSubmitSchema.parse(await req.json());

    const dbSession = await mongoose.startSession();
    let verification: Awaited<ReturnType<typeof Verification.create>>[number] | undefined;

    try {
      await dbSession.withTransaction(async () => {
        const provider = await Provider.findById(id).session(dbSession);
        if (!provider) throw new Error('Provider not found');
        if (provider.userId.toString() !== session.userId) {
          throw new AuthError('You can only submit verification for your own profile', 403);
        }

        const [createdVerification] = await Verification.create(
          [{
            providerId: provider._id,
            type: input.type,
            documentUrl: input.documentUrl,
            notes: input.notes,
            status: 'pending',
          }],
          { session: dbSession }
        );

        provider.verificationStatus = 'pending';
        provider.verifiedAt = undefined;
        await provider.save({ session: dbSession });
        verification = createdVerification;
      });
    } finally {
      await dbSession.endSession();
    }

    if (!verification) throw new Error('Verification submission completed without creating a record');
    return created(verification);
  });
}

// List verification submissions for a provider (owner or admin only).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Provider not found', 404);
    const provider = await Provider.findById(id);
    if (!provider) return fail('Provider not found', 404);
    if (provider.userId.toString() !== session.userId && session.role !== 'admin') {
      throw new AuthError('Not authorized to view these records', 403);
    }

    const records = await Verification.find({ providerId: provider._id }).sort({ createdAt: -1 });
    return ok(records);
  });
}
