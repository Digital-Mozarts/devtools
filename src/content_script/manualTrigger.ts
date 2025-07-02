// Manual trigger for testing visual editor creation
// This can be called from the browser console

export function setupManualTrigger() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setupManualTrigger());
    return;
  }

  console.log("[GrowthBook Content Script] Setting up manual trigger...");

  // Create a script that will run in the page context
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      window.__GB_CREATE_VISUAL_EDITOR = function(apiKey, apiHost) {
        console.log("[GrowthBook Manual Trigger] Starting visual editor creation...");
        
        const defaultApiHost = apiHost || "https://api.growthbook.io";
        
        if (!apiKey) {
          console.error("[GrowthBook Manual Trigger] API key is required!");
          console.log("Usage: __GB_CREATE_VISUAL_EDITOR('your-api-key', 'optional-api-host')");
          return;
        }
        
        // Send message to content script
        window.postMessage({
          type: 'GB_MANUAL_CREATE_VISUAL_EDITOR',
          apiKey: apiKey,
          apiHost: defaultApiHost
        }, window.location.origin);
      };
      
      console.log("[GrowthBook Page] Manual trigger function injected. Use __GB_CREATE_VISUAL_EDITOR('your-api-key') to test");
    })();
  `;
  
  // Inject into page
  const target = document.head || document.documentElement;
  target.appendChild(script);
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
  
  console.log("[GrowthBook Content Script] Script injected into page");
  
  // Also try a different approach - set directly after a timeout
  setTimeout(() => {
    try {
      (window as any).__GB_CREATE_VISUAL_EDITOR_TEST = function() {
        console.log("[GrowthBook Test] Direct function works!");
        return true;
      };
      console.log("[GrowthBook Content Script] Test function set directly");
    } catch (e) {
      console.error("[GrowthBook Content Script] Could not set test function:", e);
    }
  }, 100);
  
  // Listen for the manual trigger message
  window.addEventListener('message', async (event) => {
    if (event.data.type === 'GB_MANUAL_CREATE_VISUAL_EDITOR') {
      console.log("[GrowthBook Content Script] Received manual trigger");
      
      const { apiKey, apiHost } = event.data;
      
      // Save credentials using storage adapter
      const { saveApiKey, saveApiHost } = await import('@/visual_editor/lib/storageAdapter');
      await saveApiKey(apiKey);
      await saveApiHost(apiHost);
      
      console.log("[GrowthBook Content Script] Saved credentials");
      
      // Check if vc-id already exists
      const urlParams = new URLSearchParams(window.location.search);
      const existingVcId = urlParams.get('vc-id');
      
      if (existingVcId) {
        console.log("[GrowthBook Content Script] vc-id already exists:", existingVcId);
        console.log("Reloading to trigger visual editor...");
        window.location.reload();
      } else {
        console.log("[GrowthBook Content Script] No vc-id found, forcing visual editor load...");
        
        // Force inject the visual editor script
        const script = document.createElement('script');
        script.id = 'visual-editor-script-manual';
        script.async = true;
        script.src = chrome.runtime.getURL('js/visual_editor.js');
        
        script.onload = () => {
          console.log("[GrowthBook Content Script] Visual editor script loaded");
        };
        
        script.onerror = (error) => {
          console.error("[GrowthBook Content Script] Failed to load visual editor:", error);
        };
        
        document.body.appendChild(script);
      }
    }
  });
}