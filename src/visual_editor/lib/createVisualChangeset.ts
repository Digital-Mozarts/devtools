import { APIVisualChangeset, APIExperiment } from "devtools";

interface CreateVisualChangesetParams {
  apiHost: string;
  apiKey: string;
  targetUrl: string;
  experimentName?: string;
}

export async function checkVisualChangesetExists(
  vcId: string,
  apiHost: string,
  apiKey: string
): Promise<boolean> {
  try {
    console.log("[GrowthBook API] Checking changeset:", vcId);
    const response = await fetch(
      `${apiHost}/api/v1/visual-changesets/${vcId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("[GrowthBook API] Check changeset response:", response.status);
    return response.status === 200;
  } catch (error) {
    console.error("[GrowthBook API] Error checking changeset:", error);
    return false;
  }
}

export async function createVisualChangeset({
  apiHost,
  apiKey,
  targetUrl,
  experimentName = "Visual Editor Experiment"
}: CreateVisualChangesetParams): Promise<{
  visualChangeset: APIVisualChangeset | null;
  experiment: APIExperiment | null;
  error: string | null;
}> {
  try {
    console.log("[GrowthBook API] Creating new experiment and changeset...");
    
    // First create an experiment
    const experimentPayload = {
      name: experimentName,
      hypothesis: "Created by Visual Editor Extension",
      variations: [
        { name: "Control", key: "0", description: "Original" },
        { name: "Variation 1", key: "1", description: "Modified" }
      ],
      hashAttribute: "id",
      trackingKey: `exp_${Date.now()}`,
      status: "draft"
    };
    
    console.log("[GrowthBook API] Creating experiment with payload:", experimentPayload);
    
    const experimentResponse = await fetch(
      `${apiHost}/api/v1/experiments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(experimentPayload)
      }
    );

    console.log("[GrowthBook API] Experiment creation response:", experimentResponse.status);

    if (!experimentResponse.ok) {
      const errorText = await experimentResponse.text();
      console.error("[GrowthBook API] Experiment creation failed:", errorText);
      throw new Error(`Failed to create experiment: ${experimentResponse.statusText}`);
    }

    const experiment = await experimentResponse.json();
    console.log("[GrowthBook API] Created experiment:", experiment.id);

    // Then create a visual changeset
    const visualChangesetPayload = {
      experiment: experiment.id,
      editorUrl: targetUrl,
      urlPatterns: [
        {
          type: "simple",
          pattern: new URL(targetUrl).pathname
        }
      ],
      visualChanges: experiment.variations.map((v: any, i: number) => ({
        variation: v.key,
        name: v.name,
        description: v.description,
        css: "",
        js: "",
        domMutations: []
      }))
    };
    
    console.log("[GrowthBook API] Creating visual changeset with payload:", visualChangesetPayload);
    
    const visualChangesetResponse = await fetch(
      `${apiHost}/api/v1/visual-changesets`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visualChangesetPayload)
      }
    );

    console.log("[GrowthBook API] Visual changeset creation response:", visualChangesetResponse.status);

    if (!visualChangesetResponse.ok) {
      const errorText = await visualChangesetResponse.text();
      console.error("[GrowthBook API] Visual changeset creation failed:", errorText);
      throw new Error(`Failed to create visual changeset: ${visualChangesetResponse.statusText}`);
    }

    const visualChangeset = await visualChangesetResponse.json();
    console.log("[GrowthBook API] Created visual changeset:", visualChangeset.id);

    return {
      visualChangeset,
      experiment,
      error: null
    };
  } catch (error) {
    return {
      visualChangeset: null,
      experiment: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function getOrCreateVcId(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('vc-id');
}

export function updateUrlWithVcId(vcId: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('vc-id', vcId);
  window.history.replaceState(null, '', url.toString());
}