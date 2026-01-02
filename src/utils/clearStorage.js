/**
 * Utility functions to clear client-side storage
 * Useful for fixing issues with stale/dummy data persisting in the browser
 */

export const clearAllStorage = () => {
  console.log('🧹 Clearing all client-side storage...');

  try {
    // 1. Clear LocalStorage (keeping auth tokens if needed, but usually safer to clear all for a full reset)
    // If you want to keep the user logged in, comment out the next line and use the selective clear below
    localStorage.clear();

    /* Selective Clear Example:
    const token = localStorage.getItem('token');
    localStorage.clear();
    if (token) localStorage.setItem('token', token);
    */

    // 2. Clear SessionStorage
    sessionStorage.clear();

    // 3. Clear Cookies (simple implementation)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // 4. Clear Cache Storage (Service Workers)
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    console.log('✅ Storage cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear storage:', error);
    return false;
  }
};

export const hardReload = () => {
  // Force reload from server, ignoring cache
  window.location.reload(true);
};

export const resetApp = () => {
  clearAllStorage();
  hardReload();
};

export default {
  clearAllStorage,
  hardReload,
  resetApp
};