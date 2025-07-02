// Storage adapter that works in visual editor context (content script or page context)

const NAMESPACE = "devtools";
const VERSION = "v1";
const API_HOST = `${NAMESPACE}-${VERSION}-api-host`;
const API_KEY = `${NAMESPACE}-${VERSION}-api-key`;
const APP_ORIGIN = `${NAMESPACE}-${VERSION}-app-origin`;

// Check if we're in an extension context with chrome APIs
const hasExtensionAPIs = typeof chrome !== 'undefined' && chrome.storage;

export const loadApiKey = async (): Promise<string | null> => {
  try {
    // First check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlApiKey = urlParams.get('gb-api-key');
    if (urlApiKey) {
      console.log("[Storage] API key found in URL");
      return urlApiKey;
    }
    
    if (hasExtensionAPIs) {
      const result = await chrome.storage.sync.get([API_KEY]);
      return result[API_KEY] || null;
    } else {
      // Fallback to localStorage
      return localStorage.getItem(API_KEY);
    }
  } catch (error) {
    console.error("[Storage] Error loading API key:", error);
    return localStorage.getItem(API_KEY);
  }
};

export const saveApiKey = async (apiKey: string): Promise<string> => {
  try {
    if (hasExtensionAPIs) {
      await chrome.storage.sync.set({ [API_KEY]: apiKey });
      const result = await chrome.storage.sync.get([API_KEY]);
      return result[API_KEY];
    } else {
      // Fallback to localStorage
      localStorage.setItem(API_KEY, apiKey);
      return apiKey;
    }
  } catch (error) {
    console.error("[Storage] Error saving API key:", error);
    localStorage.setItem(API_KEY, apiKey);
    return apiKey;
  }
};

export const loadApiHost = async (): Promise<string | null> => {
  try {
    // First check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlApiHost = urlParams.get('gb-api-host');
    if (urlApiHost) {
      console.log("[Storage] API host found in URL");
      return urlApiHost;
    }
    
    if (hasExtensionAPIs) {
      const result = await chrome.storage.sync.get([API_HOST]);
      return result[API_HOST] || null;
    } else {
      // Fallback to localStorage
      return localStorage.getItem(API_HOST);
    }
  } catch (error) {
    console.error("[Storage] Error loading API host:", error);
    return localStorage.getItem(API_HOST);
  }
};

export const saveApiHost = async (apiHost: string): Promise<string> => {
  try {
    if (hasExtensionAPIs) {
      await chrome.storage.sync.set({ [API_HOST]: apiHost });
      const result = await chrome.storage.sync.get([API_HOST]);
      return result[API_HOST];
    } else {
      // Fallback to localStorage
      localStorage.setItem(API_HOST, apiHost);
      return apiHost;
    }
  } catch (error) {
    console.error("[Storage] Error saving API host:", error);
    localStorage.setItem(API_HOST, apiHost);
    return apiHost;
  }
};

export const loadAppOrigin = async (): Promise<string | null> => {
  try {
    if (hasExtensionAPIs) {
      const result = await chrome.storage.sync.get([APP_ORIGIN]);
      return result[APP_ORIGIN] || null;
    } else {
      return localStorage.getItem(APP_ORIGIN);
    }
  } catch (error) {
    console.error("[Storage] Error loading app origin:", error);
    return localStorage.getItem(APP_ORIGIN);
  }
};

export const saveAppOrigin = async (appOrigin: string): Promise<string> => {
  try {
    if (hasExtensionAPIs) {
      await chrome.storage.sync.set({ [APP_ORIGIN]: appOrigin });
      const result = await chrome.storage.sync.get([APP_ORIGIN]);
      return result[APP_ORIGIN];
    } else {
      localStorage.setItem(APP_ORIGIN, appOrigin);
      return appOrigin;
    }
  } catch (error) {
    console.error("[Storage] Error saving app origin:", error);
    localStorage.setItem(APP_ORIGIN, appOrigin);
    return appOrigin;
  }
};