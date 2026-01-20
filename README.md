# Plaid Flash

A lightweight Next.js application for testing Plaid integrations in Plaid's Sandbox environment. Built with Next.js 16 App Router, TypeScript, and designed to run in Docker for consistent development environments.

## 🐳 Quick Start

Run the app using Docker - no Node.js installation required!

### Step 1: Get Plaid Credentials & Configure Link Customization

1. Sign up at [dashboard.plaid.com/signup](https://dashboard.plaid.com/signup)
2. Navigate to **Team Settings → Keys**
3. Copy your **Client ID** and **Sandbox secret**
4. Ensure you have a Link customization named `flash`

### Step 2: Get ngrok authtoken (Optional - Development Only)

**Note:** Webhooks and ngrok are only available for local development. They are automatically disabled in production deployments (e.g., Vercel).

1. [Sign up](https://dashboard.ngrok.com/signup) for a free ngrok user account
2. Copy your [authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)

**What this enables:**
- Real-time webhook notifications for CRA (Consumer Reporting Agency) products
- Transaction updates and sync events
- Webhook testing panel in the UI

**Skip this step if:**
- You're only testing non-webhook products (Auth, Identity, Balance, etc.)
- You're deploying to production (webhooks won't be available anyway)

### Step 2: Clone this repo
`git clone https://github.com/only-devices/plaid-flash-docker.git`

### Step 3: Install Docker

- Download and install [Docker](https://docs.docker.com/get-docker/)
  - 🍎 Install on Mac using [Homebrew](https://brew.sh): `brew install --cask docker-desktop`

### Step 3: Configure Environment

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# Plaid API Configuration
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_sandbox_secret_here
PLAID_ENV=sandbox

# ngrok Webhook Tunnel (optional - development only)
# Enables webhook testing for CRA and Transaction products
# Get your free token at: https://dashboard.ngrok.com/get-started/your-authtoken
# Note: Webhooks are automatically disabled in production
NGROK_AUTHTOKEN=your_ngrok_authtoken
```

### Step 3: Run with Docker Compose

```bash
# Build and start the container
docker compose up --build

# Or run in detached mode (background)
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Commands

```bash
# Stop the container
docker compose down

# Rebuild after code changes
docker compose up --build

# View logs
docker compose logs -f

# Stop and remove everything
docker compose down -v
```

## ⚙️ Configuration Options

### Alternative Credentials

Test with multiple Plaid accounts by adding ALT credentials to `.env`:

```bash
ALT_PLAID_CLIENT_ID=your_second_client_id
ALT_PLAID_SECRET=your_second_secret
```

Toggle between accounts in **Settings** without restarting.

### CRA Legacy Mode

For Consumer Report (CRA) products, toggle between:
- **user_id mode** (default): Uses `user_id` with `identity` object
- **user_token mode**: Uses `user_token` with `consumer_report_user_identity` object

Access in **Settings** before creating a user.

## 📁 Project Structure

```
plaid-flash/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page (client component)
│   ├── globals.css             # Global styles
│   └── api/                    # API routes
│       ├── create-link-token/  # Link token creation
│       ├── user-create/        # CRA user creation
│       ├── exchange-public-token/ # Token exchange
│       ├── cra-*/              # CRA product endpoints
│       ├── webhook/            # Webhook receiver
│       └── ...                 # Product endpoints
├── components/
│   ├── LinkButton.tsx          # Launch button
│   ├── Modal.tsx               # Modal component
│   ├── ProductSelector.tsx     # Product catalog
│   ├── SettingsToggle.tsx      # Settings controls
│   └── WebhookPanel.tsx        # Webhook display
├── lib/
│   ├── ngrokManager.ts         # ngrok tunnel management
│   ├── productConfig.ts        # Product definitions
│   └── webhookStore.ts         # Webhook state management
├── .env.example                # Environment template
├── docker-compose.yml          # Docker configuration
├── Dockerfile                  # Docker build instructions
└── package.json                # Dependencies
```

## 🛠 Technologies

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **react-plaid-link** - Official Plaid Link React hook
- **CSS3** - Animations and modern styling

### Backend
- **Next.js API Routes** - Serverless endpoints
- **plaid-fetch** - Edge-compatible Plaid client
- **@ngrok/ngrok** - Webhook tunnel SDK (development only)

## 🌐 Deployment

### Vercel / Production

This app can be deployed to Vercel or other platforms. Webhook functionality (ngrok tunnel) is automatically disabled in production environments.

**What works in production:**
- All Plaid Link flows (Auth, Identity, Balance, Investments, etc.)
- Token exchange and API calls
- Product testing without webhooks

**What's disabled in production:**
- Ngrok tunnel
- Webhook receiver endpoints
- Webhook panel UI elements
- Real-time webhook notifications

**To deploy to Vercel:**

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables:
   - `PLAID_CLIENT_ID`
   - `PLAID_SECRET`
   - `PLAID_ENV`
4. Deploy!

Note: Do not add `NGROK_AUTHTOKEN` to production environment variables.

## 🧪 Sandbox Test Credentials

Plaid provides test users for different scenarios:

- [Full list of test credentials](https://plaid.com/docs/sandbox/test-credentials/)
```

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker compose logs

# Verify environment variables
docker compose config

# Ensure .env file exists
ls -la .env
```

### Port already in use
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

### ngrok tunnel not starting (Development)
- Check `NGROK_AUTHTOKEN` is set in `.env`
- Verify token is valid at [dashboard.ngrok.com](https://dashboard.ngrok.com)
- Check Docker logs: `docker compose logs -f`
- Note: Webhooks only work in development mode (`NODE_ENV=development`)

### Alt credentials not working
- Verify both `ALT_PLAID_CLIENT_ID` and `ALT_PLAID_SECRET` are set
- Create a fresh user after enabling the toggle
- Check logs for credential selection

### Webhook events not appearing (Development)
- Ensure ngrok tunnel is running (check logs for "ngrok tunnel ready")
- Verify webhook URL is set in Link Token config
- Check webhook panel is visible in UI
- Webhooks only work when `NODE_ENV=development` and `NGROK_AUTHTOKEN` is set
- In production environments, webhooks are disabled

## 📜 License

MIT

## 🔗 Resources

- [Plaid Documentation](https://plaid.com/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [plaid-fetch GitHub](https://github.com/heysanil/plaid-fetch)
- [ngrok Documentation](https://ngrok.com/docs)