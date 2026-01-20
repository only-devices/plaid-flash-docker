import { NextResponse } from 'next/server';
import { isWebhooksEnabled } from '@/lib/featureFlags';

export async function GET() {
  // Only provide webhook URLs in development mode
  if (!isWebhooksEnabled()) {
    return NextResponse.json({ 
      webhookUrl: null,
      environment: process.env.NODE_ENV || 'unknown',
      status: 'disabled',
      message: 'Webhooks are only available in development mode with NGROK_AUTHTOKEN configured'
    });
  }

  try {
    // In development, try to start ngrok tunnel
    if (process.env.NODE_ENV === 'development') {
      // Check if authtoken is configured
      if (!process.env.NGROK_AUTHTOKEN) {
        return NextResponse.json({ 
          webhookUrl: null,
          environment: 'development',
          status: 'no_authtoken',
          message: 'NGROK_AUTHTOKEN not set. Set it in your .env.local file to enable webhooks.',
          help: 'Get your free authtoken at: https://dashboard.ngrok.com/get-started/your-authtoken'
        });
      }

      try {
        // Dynamically import to avoid issues in production builds
        const { startTunnel } = await import('@/lib/ngrokManager');
        const tunnelUrl = await startTunnel(3000);
        
        if (tunnelUrl) {
          const webhookUrl = `${tunnelUrl}/api/webhook`;
          return NextResponse.json({ 
            webhookUrl,
            environment: 'development',
            status: 'ready',
            tunnelUrl
          });
        } else {
          return NextResponse.json({ 
            webhookUrl: null,
            environment: 'development',
            status: 'tunnel_failed',
            message: 'Failed to start ngrok tunnel. Check console for details.'
          });
        }
      } catch (error: any) {
        console.error('Error starting ngrok tunnel:', error);
        return NextResponse.json({ 
          webhookUrl: null,
          environment: 'development',
          status: 'error',
          message: error.message || 'Unknown error starting tunnel'
        });
      }
    }
  } catch (error: any) {
    console.error('Error getting webhook URL:', error);
    return NextResponse.json({ 
      webhookUrl: null,
      status: 'error',
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
