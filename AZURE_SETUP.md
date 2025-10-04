# Azure OpenAI Setup Guide

This guide will help you set up Azure OpenAI for the TWG Conversational Shopping Assistant.

## Prerequisites

1. Azure subscription with OpenAI service access
2. Azure OpenAI resource created
3. GPT-5 deployment created

## Environment Variables

Create a `.env.local` file in the `apps/web/` directory with the following variables:

```bash
# Azure OpenAI Configuration
AOAI_ENDPOINT=https://your-resource.openai.azure.com
AOAI_API_VERSION=2025-04-01-preview
AOAI_API_KEY=<your-azure-openai-api-key>
AOAI_GPT5_DEPLOYMENT=your-gpt5-deployment-name

# Optional: External Search & Analytics
BING_SUBSCRIPTION_KEY=<your-bing-search-key>
SKIMLINKS_SITE_ID=<your-skimlinks-site-id>

# Database
DATABASE_URL=file:./dev.db
```

## Setup Steps

1. **Get your Azure OpenAI endpoint and API key:**
   - Go to Azure Portal → Your OpenAI resource
   - Copy the endpoint URL
   - Generate an API key from Keys and Endpoint section

2. **Create GPT-5 deployment:**
   - Go to Azure OpenAI Studio
   - Navigate to Deployments
   - Create a new deployment with GPT-5 model
   - Note the deployment name

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp env.example apps/web/.env.local
   
   # Edit with your values
   nano apps/web/.env.local
   ```

4. **Test the connection:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/chat
   ```

## Troubleshooting

- **401 Unauthorized**: Check your API key
- **404 Not Found**: Verify your endpoint URL and deployment name
- **Rate limiting**: Check your Azure OpenAI quotas

## Security Notes

- Never commit `.env.local` files to version control
- Use Azure Key Vault for production deployments
- Rotate API keys regularly