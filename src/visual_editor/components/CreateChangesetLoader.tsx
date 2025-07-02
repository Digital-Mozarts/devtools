import React from "react";

interface CreateChangesetLoaderProps {
  isCreating: boolean;
  error: string | null;
}

export default function CreateChangesetLoader({ isCreating, error }: CreateChangesetLoaderProps) {
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.href = window.location.origin}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div>
              <h2 className="text-xl font-bold">Creating Visual Changeset</h2>
              <p className="text-gray-600 dark:text-gray-400">Setting up visual editor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}