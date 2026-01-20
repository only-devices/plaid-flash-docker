// Feature flags for conditional functionality
// Webhooks and ngrok are development-only features

/**
 * Server-side check for webhook functionality
 * Requires both development mode AND ngrok authtoken
 */
export const isWebhooksEnabled = () => {
  return process.env.NODE_ENV === 'development' && 
         !!process.env.NGROK_AUTHTOKEN;
};

/**
 * Client-side check for webhook UI
 * Only checks NODE_ENV since NGROK_AUTHTOKEN isn't exposed to client
 */
export const isWebhooksEnabledClient = () => {
  return process.env.NODE_ENV === 'development';
};
