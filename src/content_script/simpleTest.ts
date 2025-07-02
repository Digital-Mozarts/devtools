// Simple test for visual editor creation

export function createSimpleTest() {
  // Create a test function that directly creates credentials and loads visual editor
  const script = document.createElement('script');
  script.textContent = `
    window.__GB_SIMPLE_TEST = function(apiKey) {
      console.log("[GrowthBook Simple Test] Starting...");
      
      // Add credentials directly to URL and reload
      const url = new URL(window.location.href);
      url.searchParams.set('gb-api-key', apiKey);
      url.searchParams.set('gb-api-host', 'https://api.growthbook.io');
      
      // Also set in localStorage as backup
      localStorage.setItem('devtools-v1-api-key', apiKey);
      localStorage.setItem('devtools-v1-api-host', 'https://api.growthbook.io');
      
      console.log("[GrowthBook Simple Test] Credentials set, reloading...");
      window.location.href = url.toString();
    };
    
    console.log("[GrowthBook Simple Test] Function ready: __GB_SIMPLE_TEST('your-api-key')");
  `;
  
  document.documentElement.appendChild(script);
  script.remove();
}