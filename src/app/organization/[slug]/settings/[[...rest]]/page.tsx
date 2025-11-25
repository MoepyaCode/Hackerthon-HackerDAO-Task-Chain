import { OrganizationProfile } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout';

interface SettingsPageProps {
  params: Promise<{ slug: string; rest?: string[] }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    redirect('/sign-in');
  }

  return (
    <>
      <Breadcrumbs />
      <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">
            Organization Settings
          </h1>
          <p className="text-slate-400">
            Manage your organization settings and GitHub integration.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-sky-500/20 rounded-lg p-6">
          <OrganizationProfile
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none',
              },
            }}
          />
        </div>
      </div>
    </div>
    </>
  );
}
