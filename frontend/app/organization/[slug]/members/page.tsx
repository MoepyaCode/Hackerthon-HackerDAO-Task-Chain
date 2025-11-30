import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface MembersPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { userId, orgId } = await auth();
  const { slug } = await params;

  if (!userId || !orgId) {
    redirect('/sign-in');
  }

  // Fetch organization and members data
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({
    organizationId: orgId,
  });

  const { data: memberships } = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  // Fetch user details for each member
  const membersWithDetails = await Promise.all(
    memberships.map(async (membership) => {
      const user = await client.users.getUser(membership.publicUserData?.userId || '');
      return {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Unknown',
        email: user.emailAddresses[0]?.emailAddress || '',
        imageUrl: user.imageUrl,
        role: membership.role,
        createdAt: new Date(membership.createdAt),
        githubUsername: user.externalAccounts?.find(acc => acc.provider === 'github')?.username || null,
      };
    })
  );

  return (
    <>
      <Breadcrumbs />
      <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">
            Team Members
          </h1>
          <p className="text-slate-400">
            {organization.name} has {membersWithDetails.length} member{membersWithDetails.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {membersWithDetails.map((member) => (
            <Card key={member.id} className="p-6 bg-slate-900/50 border-sky-500/20 hover:border-sky-500/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-100 truncate">{member.name}</h3>
                    <Badge 
                      variant={member.role === 'org:admin' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        member.role === 'org:admin' 
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' 
                          : 'bg-slate-700/50 text-slate-300 border-slate-600/30'
                      }`}
                    >
                      {member.role === 'org:admin' ? 'Admin' : 'Member'}
                    </Badge>
                  </div>
                  {member.email && (
                    <p className="text-xs text-slate-400 truncate mb-2">{member.email}</p>
                  )}
                  {member.githubUsername && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">@{member.githubUsername}</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    Joined {member.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {membersWithDetails.length === 0 && (
          <div className="text-center py-12 bg-slate-900/50 border border-sky-500/20 rounded-lg">
            <p className="text-slate-400">No members found</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
