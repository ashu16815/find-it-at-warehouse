#!/bin/bash
echo "Setting up Azure OpenAI environment variables..."

# Create .env.local file
cat > apps/web/.env.local << 'ENVEOF'
AOAI_ENDPOINT=https://your-resource.openai.azure.com
AOAI_API_VERSION=2025-04-01-preview
AOAI_API_KEY=<your-azure-openai-api-key>
AOAI_GPT5_DEPLOYMENT=your-gpt5-deployment-name
DATABASE_URL=file:./dev.db
SKIMLINKS_SITE_ID=<your-skimlinks-site-id>
ENVEOF

echo "✅ Created apps/web/.env.local"
echo "📋 Environment variables set:"
echo "   - AOAI_ENDPOINT: https://your-resource.openai.azure.com"
echo "   - AOAI_API_KEY: [PLACEHOLDER - UPDATE WITH YOUR KEY]"
echo "   - AOAI_GPT5_DEPLOYMENT: your-gpt5-deployment-name"
echo ""
echo "🔧 Please edit apps/web/.env.local with your actual values"
echo "🔄 Then restart your dev server: npm run dev"