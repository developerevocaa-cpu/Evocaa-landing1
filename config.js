/**
 * Evocaa Project - Environment Configuration
 * 
 * This file loads environment variables from Render
 * and makes them available globally in the browser
 * 
 * In development: reads from .env.local
 * In production: reads from Render environment variables (Vite build-time)
 */

// Load environment variables
window.CONFIG = (function () {
  // Vite-injected environment object (import.meta.env). Reference it inside
  // a guarded helper so this file also works when served directly in a
  // browser without a bundler (import.meta.env would otherwise be undefined).
  var viteEnv = null;
  try {
    viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : null;
  } catch (e) {
    viteEnv = null;
  }

  function get(name) {
    if (viteEnv && viteEnv[name]) return viteEnv[name];
    // Optional fallback: allows the value to be injected without the env pipeline
    if (window.__EVOCAA_ENV__ && window.__EVOCAA_ENV__[name]) return window.__EVOCAA_ENV__[name];
    return '';
  }

  return {
    // Google Apps Script Web App URL
    GOOGLE_SCRIPT_URL: get('VITE_GOOGLE_SCRIPT_URL'),

    // Google Sheet ID (informational only — the Apps Script auto-detects the
    // spreadsheet it is bound to, so this is not used by the form)
    GOOGLE_SHEET_ID: get('VITE_GOOGLE_SHEET_ID'),

    // Owner email (informational only — the Apps Script auto-detects the
    // account running it, or reads a "OWNER_EMAIL" Script Property)
    OWNER_EMAIL: get('VITE_OWNER_EMAIL'),

    // Environment
    ENV: get('VITE_APP_ENV') || (viteEnv && viteEnv.MODE) || 'development'
  };
})();

// Validate required variables
if (!window.CONFIG.GOOGLE_SCRIPT_URL) {
  console.warn('⚠️ Warning: VITE_GOOGLE_SCRIPT_URL is not set. Form submission may fail.');
}

// Log configuration (remove SCRIPT_URL for security in production)
console.log('📋 Configuration loaded:', {
  ENV: window.CONFIG.ENV,
  GOOGLE_SHEET_ID: window.CONFIG.GOOGLE_SHEET_ID,
  OWNER_EMAIL: window.CONFIG.OWNER_EMAIL,
  SCRIPT_URL_SET: !!window.CONFIG.GOOGLE_SCRIPT_URL
});
