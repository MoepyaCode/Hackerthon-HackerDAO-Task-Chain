import { OrganizationProfile } from '@clerk/nextjs';
import { Breadcrumbs } from '@/components/layout';

export default function CreateOrganizationPage() {
  return (
    <>
      <Breadcrumbs />
      <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">
          Create Organization
        </h1>
        <p className="text-slate-400 mb-8">
          Set up a new organization to track team contributions and manage rewards.
        </p>
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
