import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getRepositoryContributions } from '@/services/github-contributions.service';

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owner, repo, since } = await req.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required fields: owner, repo' },
        { status: 400 }
      );
    }

    // Parse since date if provided
    const sinceDate = since ? new Date(since) : undefined;

    // Fetch contributions
    const contributions = await getRepositoryContributions(owner, repo, sinceDate);

    // TODO: Process and save to database
    // This is where you would:
    // 1. Parse the contributions
    // 2. Calculate points based on your points system
    // 3. Save to your database
    // 4. Update user/org leaderboard

    return NextResponse.json({
      success: true,
      message: 'Contributions synced successfully',
      data: {
        pullRequests: contributions.pullRequests.length,
        issues: contributions.issues.length,
        commits: contributions.commits.length,
      },
      organizationId: orgId,
    });
  } catch (error) {
    console.error('Error syncing contributions:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Failed to sync contributions', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const since = searchParams.get('since');

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required query params: owner, repo' },
        { status: 400 }
      );
    }

    const sinceDate = since ? new Date(since) : undefined;

    const contributions = await getRepositoryContributions(owner, repo, sinceDate);

    return NextResponse.json({
      success: true,
      data: contributions,
    });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Failed to fetch contributions', details: errorMessage },
      { status: 500 }
    );
  }
}
