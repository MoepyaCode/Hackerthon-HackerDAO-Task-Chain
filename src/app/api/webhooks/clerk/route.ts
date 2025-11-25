import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  console.log(`Webhook received: ${eventType}`);

  switch (eventType) {
    case 'organization.created':
      console.log('Organization created:', evt.data);
      // TODO: Save organization to your database
      // const { id, name, slug, created_by } = evt.data;
      // await db.organization.create({ clerkId: id, name, slug, ownerId: created_by });
      break;

    case 'organization.updated':
      console.log('Organization updated:', evt.data);
      // TODO: Update organization in database
      break;

    case 'organization.deleted':
      console.log('Organization deleted:', evt.data);
      // TODO: Remove organization from database
      break;

    case 'organizationMembership.created':
      console.log('Organization membership created:', evt.data);
      // TODO: Track new member
      break;

    case 'organizationMembership.updated':
      console.log('Organization membership updated:', evt.data);
      // TODO: Update member role or status
      break;

    case 'organizationMembership.deleted':
      console.log('Organization membership deleted:', evt.data);
      // TODO: Remove member tracking
      break;

    case 'user.created':
      console.log('User created:', evt.data);
      // TODO: Create user in database
      break;

    case 'user.updated':
      console.log('User updated:', evt.data);
      // TODO: Update user in database
      break;

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}
