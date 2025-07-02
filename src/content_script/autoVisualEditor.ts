// This file handles automatic visual editor initialization
// when API credentials are available on the page

interface PageAPICredentials {
  apiKey: string;
  apiHost: string;
  autoCreateVisualEditor?: boolean;
}

// Check if the page has exposed API credentials
export function checkPageAPICredentials(): PageAPICredentials | null {
  // Check for credentials in various places
  // 1. Window object
  if ((window as any).__GB_API_CREDENTIALS) {
    return (window as any).__GB_API_CREDENTIALS;
  }
  
  // 2. Meta tags
  const apiKeyMeta = document.querySelector('meta[name="gb-api-key"]');
  const apiHostMeta = document.querySelector('meta[name="gb-api-host"]');
  
  if (apiKeyMeta && apiHostMeta) {
    return {
      apiKey: apiKeyMeta.getAttribute('content') || '',
      apiHost: apiHostMeta.getAttribute('content') || '',
      autoCreateVisualEditor: document.querySelector('meta[name="gb-auto-visual-editor"]')?.getAttribute('content') === 'true'
    };
  }
  
  // 3. Data attributes on body
  const body = document.body;
  if (body.dataset.gbApiKey && body.dataset.gbApiHost) {
    return {
      apiKey: body.dataset.gbApiKey,
      apiHost: body.dataset.gbApiHost,
      autoCreateVisualEditor: body.dataset.gbAutoVisualEditor === 'true'
    };
  }
  
  return null;
}

// Initialize visual editor with auto-creation support
export async function initializeAutoVisualEditor(): Promise<void> {
  const credentials = checkPageAPICredentials();
  
  if (!credentials || !credentials.autoCreateVisualEditor) {
    return;
  }
  
  // Save credentials to extension storage
  const { saveApiKey, saveApiHost } = await import('@/app/storage');
  await saveApiKey(credentials.apiKey);
  await saveApiHost(credentials.apiHost);
  
  // Check if vc-id already exists in URL
  const urlParams = new URLSearchParams(window.location.search);
  const vcId = urlParams.get('vc-id');
  
  if (!vcId) {
    // Trigger visual editor creation
    // The visual editor will auto-create a changeset when it loads
    const script = document.createElement('script');
    script.id = 'visual-editor-script-auto';
    script.async = true;
    script.charset = 'utf-8';
    script.src = chrome.runtime.getURL('js/visual_editor.js');
    document.body.appendChild(script);
  }
}