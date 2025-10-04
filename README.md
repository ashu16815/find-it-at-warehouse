# Find it @ Warehouse

AI-powered shopping assistant that prioritizes The Warehouse Group brands with conversational interface, analytics dashboard, and monetization.

## 🚀 Features

- **Conversational Shopping**: Natural language interface powered by Azure OpenAI
- **TWG Brand Priority**: Always prioritizes The Warehouse → Warehouse Stationery → Noel Leeming
- **Analytics Dashboard**: Real-time tracking of redirects, coverage, and revenue estimates
- **Monetization**: Skimlinks integration for external product links
- **Google-Style Interface**: Clean, centered search experience
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI**: Azure OpenAI (GPT-5) with tool-driven search
- **Database**: SQLite with Prisma ORM
- **Analytics**: Real-time charts with Recharts
- **Monetization**: Skimlinks affiliate links

## 📁 Project Structure

```
apps/web/
├── app/                    # Next.js App Router pages
│   ├── chat/              # Conversational interface
│   ├── admin/dashboard/    # Analytics dashboard
│   ├── api/               # API routes
│   └── legal/             # Privacy & Terms pages
├── components/            # React components
│   ├── Chat/             # Chat interface components
│   ├── Layout/           # Header, Footer
│   ├── Product/          # Product display components
│   └── admin/            # Dashboard charts
├── lib/                  # Utility libraries
│   ├── aoai.ts          # Azure OpenAI integration
│   ├── tools-server.ts  # AI tool implementations
│   ├── db.ts            # Database client
│   └── monetise.ts      # Skimlinks integration
└── styles/              # Global CSS
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- Azure OpenAI service access
- (Optional) Bing Custom Search API key
- (Optional) Skimlinks account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashu16815/find-it-at-warehouse.git
   cd find-it-at-warehouse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy example environment file
   cp env.example apps/web/.env.local
   
   # Edit with your Azure OpenAI credentials
   nano apps/web/.env.local
   ```

4. **Set up database:**
   ```bash
   npx prisma migrate dev --name init
   npx ts-node scripts/seed.ts
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Visit the application:**
   - Home: http://localhost:3000
   - Chat: http://localhost:3000/chat
   - Analytics: http://localhost:3000/admin/dashboard

## 🔧 Configuration

### Required Environment Variables

```bash
AOAI_ENDPOINT=https://your-resource.openai.azure.com
AOAI_API_VERSION=2025-04-01-preview
AOAI_API_KEY=your-azure-openai-api-key
AOAI_GPT5_DEPLOYMENT=your-gpt5-deployment-name
DATABASE_URL=file:./dev.db
```

### Optional Environment Variables

```bash
BING_SUBSCRIPTION_KEY=your-bing-search-key
SKIMLINKS_SITE_ID=your-skimlinks-site-id
```

## 📊 Analytics

The analytics dashboard provides insights into:

- **Redirect Tracking**: All product clicks are logged
- **TWG Coverage**: Percentage of TWG vs external clicks
- **Revenue Estimates**: Projected earnings from external links
- **Top Domains**: Most clicked domains
- **Time Series**: Daily redirect trends

## 🔗 API Endpoints

- `POST /api/ai/chat` - Conversational AI interface
- `GET /api/redirect` - Tracked redirect service
- `POST /api/redirect/log` - Redirect event logging
- `GET /.well-known/sitemap.json` - JSON sitemap

## 🎨 Design System

The application uses a custom design system with:

- **Brand Colors**: TWG red (#D32F2F) as primary
- **Typography**: Inter font family with clear hierarchy
- **Spacing**: Consistent 4px base unit system
- **Components**: Reusable UI components with Tailwind CSS

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- Create an issue in this repository
- Check the [Azure OpenAI Setup Guide](AZURE_SETUP.md)
- Review the [API Documentation](/.well-known/sitemap.json)

## 🏪 About The Warehouse Group

This application prioritizes products from The Warehouse Group brands:
- **The Warehouse**: General merchandise and home goods
- **Warehouse Stationery**: Office supplies and technology
- **Noel Leeming**: Premium technology and appliances

---

Built with ❤️ for smarter shopping experiences.