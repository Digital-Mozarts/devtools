// Debug helper that works around content script isolation

export function createDebugHelper() {
  console.log("[GrowthBook Debug] Creating debug helper...");
  
  // Method 1: Message listener for direct testing
  window.addEventListener('message', async (event) => {
    if (event.data.type === 'GB_DEBUG_CREATE_VC') {
      console.log("[GrowthBook Debug] Received debug create vc message");
      
      const { apiKey, apiHost = 'https://api.growthbook.io' } = event.data;
      
      if (!apiKey) {
        console.error("[GrowthBook Debug] No API key provided");
        return;
      }
      
      try {
        // Import and save credentials using storage adapter
        const { saveApiKey, saveApiHost } = await import('@/visual_editor/lib/storageAdapter');
        await saveApiKey(apiKey);
        await saveApiHost(apiHost);
        console.log("[GrowthBook Debug] Credentials saved");
        
        // Add credentials to URL for visual editor to pick up
        const url = new URL(window.location.href);
        url.searchParams.set('gb-api-key', apiKey);
        url.searchParams.set('gb-api-host', apiHost);
        window.history.replaceState(null, '', url.toString());
        
        console.log("[GrowthBook Debug] Added credentials to URL");
        
        // Directly trigger visual editor load
        const script = document.createElement('script');
        script.id = 'visual-editor-debug';
        script.src = chrome.runtime.getURL('js/visual_editor.js');
        script.onload = () => console.log("[GrowthBook Debug] Visual editor loaded");
        script.onerror = (e) => console.error("[GrowthBook Debug] Failed to load:", e);
        
        document.body.appendChild(script);
        
      } catch (error) {
        console.error("[GrowthBook Debug] Error:", error);
      }
    }
  });
  
  // Method 2: Create a more reliable function injector
  const createTriggerFunction = () => {
    const script = document.createElement('script');
    script.textContent = `
      console.log("[GrowthBook Debug] Injecting trigger functions...");
      
      // Method 1: Standard function
      window.__GB_CREATE_VC = function(apiKey, apiHost) {
        console.log("[GrowthBook Page] Creating VC with:", apiKey, apiHost);
        window.postMessage({
          type: 'GB_DEBUG_CREATE_VC',
          apiKey: apiKey,
          apiHost: apiHost || 'https://api.growthbook.io'
        }, '*');
      };
      
      // Method 2: Alternative name
      window.gbCreateVC = window.__GB_CREATE_VC;
      
      // Method 3: Add to a namespace
      window.GrowthBook = window.GrowthBook || {};
      window.GrowthBook.createVC = window.__GB_CREATE_VC;
      
      console.log("[GrowthBook Page] Functions available:");
      console.log("- __GB_CREATE_VC('your-api-key')");
      console.log("- gbCreateVC('your-api-key')"); 
      console.log("- GrowthBook.createVC('your-api-key')");
    `;
    
    document.documentElement.appendChild(script);
    script.remove();
  };
  
  // Try to inject immediately and also after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTriggerFunction);
  } else {
    createTriggerFunction();
  }
  
  // Also try after a short delay
  setTimeout(createTriggerFunction, 500);
  
  console.log("[GrowthBook Debug] Debug helper setup complete");
}