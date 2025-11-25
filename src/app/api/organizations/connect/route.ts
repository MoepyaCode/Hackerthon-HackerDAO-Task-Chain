import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { githubOrgLogin, githubOrgName } = await req.json();

    if (!githubOrgLogin || !githubOrgName) {
      return NextResponse.json(
        { error: 'GitHub organization login and name are required' },
        { status: 400 }
      );
    }

    const client = await clerkClient();

    // Create Clerk organization based on GitHub org
    // Note: slug is optional - Clerk will auto-generate if slugs are enabled
    const organization = await client.organizations.createOrganization({
      name: githubOrgName,
      createdBy: userId,
      publicMetadata: {
        githubOrg: githubOrgLogin,
        connectedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        slug: organization.slug || organization.id,
        name: organization.name,
      },
    });
  } catch (error: any) {
    console.error('Error connecting GitHub organization:', error);
    console.error('Error details:', {
      message: error?.message,
      errors: error?.errors,
      clerkError: error?.clerkError,
      status: error?.status,
    });
    
    // Handle specific errors
    if (error?.message?.includes('already exists') || error?.errors?.[0]?.message?.includes('already taken')) {
      return NextResponse.json(
        { error: 'This organization is already connected to TaskChain' },
        { status: 409 }
      );
    }

    if (error?.message?.includes('Organizations feature') || error?.status === 403) {
      return NextResponse.json(
        { error: 'Organizations feature not enabled. Please enable it in your Clerk dashboard.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to connect organization' },
      { status: 500 }
    );
  }
}
