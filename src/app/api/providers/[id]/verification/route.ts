import { NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Verification from '@/models/Verification';
import { verificationSubmitSchema } from '@/lib/validators';
import { requireSession, AuthError } from '@/lib/auth';
import { handleRoute, created, fail, ok } from '@/lib/apiResponse';

// Submit a new document. A newer submission supersedes older decisions for
// the same document type and puts the provider back into the review queue.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Provider not found', 404);
    const provider = await Provider.findById(id);
    if (!provider) return fail('Provider not found', 404);
    if (provider.userId.toString() !== session.userId) {
      throw new AuthError('You can only submit verification for your own profile', 403);
    }

    const input = verificationSubmitSchema.parse(await req.json());

    const verification = await Verification.create({
      providerId: provider._id,
      type: input.type,
      documentUrl: input.documentUrl,
      notes: input.notes,
      status: 'pending',
    });

    provider.verificationStatus = 'pending';
    provider.verifiedAt = undefined;
    await provider.save();

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
