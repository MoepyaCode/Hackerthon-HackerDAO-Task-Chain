# Clerk Organization Setup & GitHub API Integration Guide

This guide provides step-by-step instructions for setting up Clerk with organization support, GitHub OAuth, and accessing the GitHub API after authentication.

---

## Table of Contents

1. [Clerk Setup with Organizations](#1-clerk-setup-with-organizations)
2. [GitHub OAuth Configuration](#2-github-oauth-configuration)
3. [Organization Tracking & Management](#3-organization-tracking--management)
4. [GitHub API Integration After Sign-In](#4-github-api-integration-after-sign-in)
5. [Code Implementation Examples](#5-code-implementation-examples)

---

## 1. Clerk Setup with Organizations

### Step 1.1: Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click **"Create Application"**
3. Name your application (e.g., "TaskChain")
4. Select **"Next.js"** as the framework
5. Click **"Create Application"**

### Step 1.2: Enable Organizations Feature

1. In Clerk Dashboard, navigate to **"Configure"** → **"Organizations"**
2. Toggle **"Enable Organizations"** to ON
3. Configure organization settings:
   - **Organization Name**: Required
   - **Organization Slug**: Auto-generated or custom
   - **Max Allowed Memberships**: Set limit or unlimited
   - **Roles**: Configure custom roles (Admin, Member, etc.)
4. Click **"Save Changes"**

### Step 1.3: Install Clerk SDK

```bash
npm install @clerk/nextjs
```

### Step 1.4: Configure Environment Variables

Create or update `.env.local`:

```env
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# GitHub OAuth (will be added in Step 2)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Step 1.5: Wrap Application with ClerkProvider

Update your root layout:

```typescript
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## 2. GitHub OAuth Configuration

### Step 2.1: Create GitHub OAuth App

1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: TaskChain
   - **Homepage URL**: `http://localhost:3000` (dev) or your production URL
   - **Authorization callback URL**: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

### Step 2.2: Add GitHub OAuth to Clerk

1. In Clerk Dashboard, go to **"Configure"** → **"SSO Connections"**
2. Click **"Add connection"** → **"GitHub"**
3. Enter your GitHub OAuth credentials:
   - **Client ID**: Paste from GitHub
   - **Client Secret**: Paste from GitHub
4. Configure scopes (required for API access):
   - `user:email` - Access user email
   - `read:user` - Read user profile
   - `read:org` - Read organization membership
   - `repo` - Access repositories (read and write)
   - `admin:org` - For organization management
5. Click **"Add connection"**

### Step 2.3: Update GitHub OAuth Callback URL

After adding the connection, Clerk provides a specific callback URL:

1. Copy the callback URL from Clerk (e.g., `https://your-app.clerk.accounts.dev/v1/oauth_callback`)
2. Go back to GitHub OAuth App settings
3. Update the **Authorization callback URL** with the Clerk URL
4. Click **"Update application"**

---

## 3. Organization Tracking & Management

### Step 3.1: Create Organization Setup Page

```typescript
// src/app/organization/create/page.tsx
import { OrganizationSwitcher, OrganizationProfile } from '@clerk/nextjs';

export default function CreateOrganizationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Organization</h1>
      <OrganizationProfile />
    </div>
  );
}
```

### Step 3.2: Organization Switcher Component

Add to your header/navigation:

```typescript
// src/components/layout/header.tsx
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <h1>TaskChain</h1>
          <OrganizationSwitcher
            hidePersonal={false}
            afterCreateOrganizationUrl="/organization/:slug"
            afterSelectOrganizationUrl="/organization/:slug"
            afterSelectPersonalUrl="/dashboard"
          />
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
```

### Step 3.3: Protect Organization Routes

```typescript
// src/middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/'],
  ignoredRoutes: ['/api/webhook'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### Step 3.4: Track Organization Data in Database

Create a webhook handler to sync organization data:

```typescript
// src/app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  // Handle different event types
  const eventType = evt.type;

  switch (eventType) {
    case 'organization.created':
      // Save organization to your database
      const { id, name, slug, created_by } = evt.data;
      // await db.organization.create({ clerkId: id, name, slug, ownerId: created_by });
      break;

    case 'organization.updated':
      // Update organization in database
      break;

    case 'organizationMembership.created':
      // Track new member
      break;

    case 'organizationMembership.deleted':
      // Remove member tracking
      break;
  }

  return new Response('', { status: 200 });
}
```

---

## 4. GitHub API Integration After Sign-In

### Step 4.1: Store GitHub Access Token

When a user signs in with GitHub via Clerk, the OAuth token is automatically stored. Access it server-side:

```typescript
// src/lib/github.ts
import { auth, clerkClient } from '@clerk/nextjs';

export async function getGitHubToken() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Get the OAuth access token for GitHub
  const provider = 'oauth_github';
  
  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
    userId,
    provider
  );

  if (!clerkResponse || clerkResponse.length === 0) {
    throw new Error('GitHub not connected');
  }

  return clerkResponse[0].token;
}
```

### Step 4.2: Create GitHub API Client

```typescript
// src/lib/github-client.ts
import { Octokit } from '@octokit/rest';
import { getGitHubToken } from './github';

export async function createGitHubClient() {
  const token = await getGitHubToken();
  
  return new Octokit({
    auth: token,
  });
}

// Install Octokit
// npm install @octokit/rest
```

### Step 4.3: Fetch User's GitHub Organizations

```typescript
// src/services/github-org.service.ts
import { createGitHubClient } from '@/lib/github-client';

export async function getUserGitHubOrganizations() {
  const octokit = await createGitHubClient();
  
  try {
    const { data: orgs } = await octokit.rest.orgs.listForAuthenticatedUser({
      per_page: 100,
    });

    return orgs.map(org => ({
      id: org.id,
      login: org.login,
      name: org.name || org.login,
      avatarUrl: org.avatar_url,
      description: org.description,
    }));
  } catch (error) {
    console.error('Error fetching GitHub organizations:', error);
    throw error;
  }
}
```

### Step 4.4: Fetch Organization Repositories

```typescript
// src/services/github-repo.service.ts
import { createGitHubClient } from '@/lib/github-client';

export async function getOrganizationRepositories(orgName: string) {
  const octokit = await createGitHubClient();
  
  try {
    const { data: repos } = await octokit.rest.repos.listForOrg({
      org: orgName,
      type: 'all',
      per_page: 100,
    });

    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      htmlUrl: repo.html_url,
      defaultBranch: repo.default_branch,
      language: repo.language,
    }));
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}
```

### Step 4.5: Track Contributions (Issues, PRs, Commits)

```typescript
// src/services/github-contributions.service.ts
import { createGitHubClient } from '@/lib/github-client';

export async function getRepositoryContributions(
  owner: string,
  repo: string,
  since?: Date
) {
  const octokit = await createGitHubClient();
  const sinceDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  try {
    // Fetch Pull Requests
    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'all',
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
    });

    // Fetch Issues (excluding PRs)
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      since: sinceDate.toISOString(),
      per_page: 100,
    });

    // Fetch Commits
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      since: sinceDate.toISOString(),
      per_page: 100,
    });

    return {
      pullRequests: pullRequests.map(pr => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.user?.login,
        createdAt: pr.created_at,
        mergedAt: pr.merged_at,
        closedAt: pr.closed_at,
      })),
      issues: issues
        .filter(issue => !issue.pull_request) // Exclude PRs from issues
        .map(issue => ({
          id: issue.id,
          number: issue.number,
          title: issue.title,
          state: issue.state,
          author: issue.user?.login,
          createdAt: issue.created_at,
          closedAt: issue.closed_at,
        })),
      commits: commits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name,
        authorLogin: commit.author?.login,
        date: commit.commit.author?.date,
      })),
    };
  } catch (error) {
    console.error('Error fetching contributions:', error);
    throw error;
  }
}
```

### Step 4.6: Get Repository Contributors

```typescript
// src/services/github-contributors.service.ts
import { createGitHubClient } from '@/lib/github-client';

export async function getRepositoryContributors(owner: string, repo: string) {
  const octokit = await createGitHubClient();
  
  try {
    const { data: contributors } = await octokit.rest.repos.listContributors({
      owner,
      repo,
      per_page: 100,
    });

    return contributors.map(contributor => ({
      login: contributor.login,
      id: contributor.id,
      avatarUrl: contributor.avatar_url,
      contributions: contributor.contributions,
      type: contributor.type,
    }));
  } catch (error) {
    console.error('Error fetching contributors:', error);
    throw error;
  }
}
```

---

## 5. Code Implementation Examples

### Example 5.1: Dashboard Page with Organization Context

```typescript
// src/app/dashboard/page.tsx
import { auth } from '@clerk/nextjs';
import { getUserGitHubOrganizations } from '@/services/github-org.service';

export default async function DashboardPage() {
  const { userId, orgId } = auth();

  if (!userId) {
    return <div>Please sign in</div>;
  }

  // Get GitHub organizations
  const githubOrgs = await getUserGitHubOrganizations();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {orgId ? (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Current Organization: {orgId}
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <p className="text-sm text-gray-600">Personal Account</p>
        </div>
      )}

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your GitHub Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {githubOrgs.map(org => (
              <div key={org.id} className="border rounded-lg p-4">
                <img
                  src={org.avatarUrl}
                  alt={org.name}
                  className="w-12 h-12 rounded-full mb-2"
                />
                <h3 className="font-semibold">{org.name}</h3>
                <p className="text-sm text-gray-600">@{org.login}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Example 5.2: Repository Selection Page

```typescript
// src/app/organization/[slug]/repos/page.tsx
import { auth } from '@clerk/nextjs';
import { getOrganizationRepositories } from '@/services/github-repo.service';

export default async function RepositoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return <div>Please sign in and select an organization</div>;
  }

  // Fetch repositories for the GitHub organization
  // Note: You'll need to map Clerk org to GitHub org in your DB
  const githubOrgName = params.slug; // Or fetch from your database
  const repos = await getOrganizationRepositories(githubOrgName);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Select Repositories to Track</h1>
      
      <div className="space-y-4">
        {repos.map(repo => (
          <div
            key={repo.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">{repo.name}</h3>
              <p className="text-sm text-gray-600">{repo.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {repo.language}
                </span>
                {repo.private && (
                  <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                    Private
                  </span>
                )}
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Track
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 5.3: API Route for Syncing Contributions

```typescript
// src/app/api/sync/contributions/route.ts
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { getRepositoryContributions } from '@/services/github-contributions.service';

export async function POST(req: Request) {
  const { userId, orgId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { owner, repo } = await req.json();

    // Fetch contributions
    const contributions = await getRepositoryContributions(owner, repo);

    // Process and save to database
    // await processContributions(orgId, contributions);

    return NextResponse.json({
      success: true,
      data: {
        pullRequests: contributions.pullRequests.length,
        issues: contributions.issues.length,
        commits: contributions.commits.length,
      },
    });
  } catch (error) {
    console.error('Error syncing contributions:', error);
    return NextResponse.json(
      { error: 'Failed to sync contributions' },
      { status: 500 }
    );
  }
}
```

---

## Additional Configuration

### Install Required Dependencies

```bash
npm install @clerk/nextjs @octokit/rest svix
```

### Configure Clerk Webhooks

1. In Clerk Dashboard, go to **"Webhooks"**
2. Click **"Add Endpoint"**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/clerk`
4. Select events to listen for:
   - `organization.created`
   - `organization.updated`
   - `organization.deleted`
   - `organizationMembership.created`
   - `organizationMembership.updated`
   - `organizationMembership.deleted`
5. Copy the **Signing Secret** and add to `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

### Environment Variables Checklist

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# GitHub OAuth (from Clerk Dashboard)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## Testing the Integration

1. **Sign in with GitHub**: Navigate to `/sign-in` and click "Continue with GitHub"
2. **Authorize the app**: Grant permissions for GitHub OAuth scopes
3. **Create/Select Organization**: Use the OrganizationSwitcher component
4. **Test GitHub API**: Navigate to `/dashboard` to see GitHub organizations
5. **Select Repositories**: Go to repository selection page to track repos
6. **Verify Webhooks**: Check that organization events are being received

---

## Troubleshooting

### GitHub OAuth Not Working

- Verify callback URL matches between GitHub OAuth app and Clerk
- Check that required scopes are enabled in Clerk
- Ensure GitHub OAuth app is not suspended

### Token Not Found

- User needs to reconnect GitHub account
- Check if OAuth token has expired (refresh token needed)
- Verify Clerk OAuth connection is active

### API Rate Limits

- GitHub API has rate limits (5,000 requests/hour for authenticated requests)
- Implement caching for frequently accessed data
- Use webhooks instead of polling where possible
- Consider GitHub GraphQL API for more efficient queries

---

## Next Steps

1. Implement cron job for periodic contribution syncing
2. Set up GitHub webhooks for real-time updates
3. Create database schema for storing contributions
4. Build points calculation system
5. Implement leaderboard aggregation
6. Set up smart contracts for rewards distribution

---

## Resources

- [Clerk Organizations Documentation](https://clerk.com/docs/organizations/overview)
- [Clerk GitHub OAuth](https://clerk.com/docs/authentication/social-connections/github)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Octokit.js Documentation](https://github.com/octokit/octokit.js)
- [Next.js App Router](https://nextjs.org/docs/app)
