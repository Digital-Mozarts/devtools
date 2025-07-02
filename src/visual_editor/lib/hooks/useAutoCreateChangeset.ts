import { useEffect, useState } from "react";
import { createVisualChangeset, checkVisualChangesetExists, updateUrlWithVcId } from "../createVisualChangeset";
import { loadApiHost, loadApiKey } from "../storageAdapter";

interface UseAutoCreateChangesetResult {
  isCreating: boolean;
  error: string | null;
  vcId: string | null;
}

export default function useAutoCreateChangeset(
  initialVcId: string | null
): UseAutoCreateChangesetResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vcId, setVcId] = useState<string | null>(initialVcId);

  useEffect(() => {
    async function handleMissingVcId() {
      console.log("[GrowthBook Visual Editor] Checking vc-id:", initialVcId);
      
      // If we already have a vcId, check if it exists
      if (initialVcId) {
        const [apiHost, apiKey] = await Promise.all([loadApiHost(), loadApiKey()]);
        
        console.log("[GrowthBook Visual Editor] API credentials:", { apiHost, hasApiKey: !!apiKey });
        
        if (!apiHost || !apiKey) {
          const errorMsg = "Missing API credentials. Please configure the extension.";
          console.error("[GrowthBook Visual Editor]", errorMsg);
          setError(errorMsg);
          return;
        }

        console.log("[GrowthBook Visual Editor] Checking if changeset exists:", initialVcId);
        const exists = await checkVisualChangesetExists(initialVcId, apiHost, apiKey);
        
        if (!exists) {
          const errorMsg = `Visual changeset ${initialVcId} not found`;
          console.error("[GrowthBook Visual Editor]", errorMsg);
          setError(errorMsg);
        } else {
          console.log("[GrowthBook Visual Editor] Changeset exists:", initialVcId);
        }
        return;
      }

      // No vcId provided, create a new one
      console.log("[GrowthBook Visual Editor] No vc-id found, creating new changeset...");
      setIsCreating(true);
      
      try {
        const [apiHost, apiKey] = await Promise.all([loadApiHost(), loadApiKey()]);
        
        console.log("[GrowthBook Visual Editor] API credentials for creation:", { apiHost, hasApiKey: !!apiKey });
        
        if (!apiHost || !apiKey) {
          throw new Error("Missing API credentials. Please configure the extension.");
        }

        const targetUrl = window.location.origin + window.location.pathname;
        console.log("[GrowthBook Visual Editor] Creating changeset for URL:", targetUrl);

        const result = await createVisualChangeset({
          apiHost,
          apiKey,
          targetUrl,
          experimentName: `Visual Editor - ${new Date().toLocaleDateString()}`
        });

        console.log("[GrowthBook Visual Editor] Create changeset result:", result);

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.visualChangeset) {
          const newVcId = result.visualChangeset.id;
          console.log("[GrowthBook Visual Editor] Successfully created changeset:", newVcId);
          setVcId(newVcId);
          updateUrlWithVcId(newVcId);
          
          console.log("[GrowthBook Visual Editor] Reloading page with new vc-id...");
          // Reload the page with the new vc-id
          window.location.reload();
        }
      } catch (err) {
        console.error("[GrowthBook Visual Editor] Failed to create changeset:", err);
        setError(err instanceof Error ? err.message : "Failed to create visual changeset");
      } finally {
        setIsCreating(false);
      }
    }

    handleMissingVcId();
  }, [initialVcId]);

  return { isCreating, error, vcId };
}