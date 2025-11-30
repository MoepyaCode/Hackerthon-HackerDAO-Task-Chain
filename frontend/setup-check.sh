#!/bin/bash

echo "🚀 TaskChain - Clerk & GitHub Integration Setup"
echo "================================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "Please create .env.local and add your Clerk credentials."
    echo "See .env.local.example for reference."
    exit 1
fi

# Check for required environment variables
echo "🔍 Checking environment variables..."

if ! grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.local || grep -q "your_publishable_key_here" .env.local; then
    echo "⚠️  Please update NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in .env.local"
fi

if ! grep -q "CLERK_SECRET_KEY" .env.local || grep -q "your_secret_key_here" .env.local; then
    echo "⚠️  Please update CLERK_SECRET_KEY in .env.local"
fi

echo ""
echo "📚 Setup Checklist:"
echo "==================="
echo ""
echo "1. ✅ Dependencies installed (@clerk/nextjs, @octokit/rest, svix)"
echo ""
echo "2. 🔐 Clerk Configuration:"
echo "   - Create application at https://dashboard.clerk.com"
echo "   - Enable Organizations feature"
echo "   - Add credentials to .env.local"
echo ""
echo "3. 🐙 GitHub OAuth:"
echo "   - Create OAuth App at https://github.com/settings/developers"
echo "   - Add GitHub connection in Clerk Dashboard"
echo "   - Configure required scopes: user:email, read:user, read:org, repo"
echo ""
echo "4. 🔗 Webhooks:"
echo "   - Add webhook endpoint: /api/webhooks/clerk"
echo "   - Select organization events"
echo "   - Add CLERK_WEBHOOK_SECRET to .env.local"
echo ""
echo "5. 🎯 Next Steps:"
echo "   - Run 'npm run dev' to start the development server"
echo "   - Visit http://localhost:3000"
echo "   - Sign in with GitHub"
echo "   - Test the integration!"
echo ""
echo "📖 For detailed setup instructions, see:"
echo "   - IMPLEMENTATION.md"
echo "   - docs/clerk-github-setup.md"
echo ""
echo "Happy coding! 🎉"
