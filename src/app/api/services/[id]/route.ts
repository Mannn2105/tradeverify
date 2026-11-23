import { NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Service from '@/models/Service';
import { serviceSchema } from '@/lib/validators';
import { requireRole, AuthError } from '@/lib/auth';
import { handleRoute, ok, fail } from '@/lib/apiResponse';

async function assertOwnership(serviceId: string, userId: string) {
  const service = await Service.findById(serviceId);
  if (!service) throw new Error('__NOT_FOUND__');
  const provider = await Provider.findById(service.providerId);
  if (!provider || provider.userId.toString() !== userId) {
    throw new AuthError('You can only modify your own services', 403);
  }
  return service;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireRole('provider');
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Service not found', 404);
    let service;
    try {
      service = await assertOwnership(id, session.userId);
    } catch (e) {
      if ((e as Error).message === '__NOT_FOUND__') return fail('Service not found', 404);
      throw e;
    }

    const input = serviceSchema.partial().parse(await req.json());
    Object.assign(service, input);
    await service.save();
    return ok(service);
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireRole('provider');
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Service not found', 404);
    let service;
    try {
      service = await assertOwnership(id, session.userId);
    } catch (e) {
      if ((e as Error).message === '__NOT_FOUND__') return fail('Service not found', 404);
      throw e;
    }

    service.active = false;
    await service.save();
    return ok({ deactivated: true });
  });
}
