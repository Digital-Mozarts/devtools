# Visual Editor Documentation

## Overview
The Visual Editor is a powerful tool for creating and editing visual experiments in GrowthBook. It allows users to modify DOM elements, CSS, and JavaScript to create A/B test variations.

## File Structure

### Main Entry Point
- **`src/visual_editor/index.tsx`** - Main component that orchestrates the entire visual editor
  - Manages all hooks and state
  - Renders the main UI layout
  - Handles DOM mutations and page synchronization
  - Coordinates between different editor modes

### Core Components

#### UI Layout Components
- **`src/visual_editor/components/VisualEditorPane.tsx`** - Main container wrapper for the editor
- **`src/visual_editor/components/VisualEditorHeader.tsx`** - Header with title and basic controls
- **`src/visual_editor/components/VisualEditorSection.tsx`** - Collapsible section wrapper for organizing content
- **`src/visual_editor/components/Toolbar.tsx`** - Main toolbar with mode switching (edit, js, css, changes, debug)
- **`src/visual_editor/components/VariationSelector.tsx`** - Dropdown to select between different variations

#### Element Selection & Interaction
- **`src/visual_editor/components/FloatingFrame.tsx`** - Visual overlay that highlights selected elements
- **`src/visual_editor/components/SelectorDisplay.tsx`** - Shows CSS selector for the selected element
- **`src/visual_editor/components/MoveElementHandle.tsx`** - Drag handle for moving elements around the page
- **`src/visual_editor/components/BreadcrumbsView.tsx`** - Shows element hierarchy path

#### Element Editing Components
- **`src/visual_editor/components/ElementDetails/index.tsx`** - Main container for element editing interface
- **`src/visual_editor/components/ElementDetails/DetailsRow.tsx`** - Individual row component for element properties
- **`src/visual_editor/components/AttributeEdit.tsx`** - Interface for editing HTML attributes
- **`src/visual_editor/components/ClassNamesEdit.tsx`** - Interface for adding/removing CSS classes
- **`src/visual_editor/components/CSSAttributeEditor/index.tsx`** - Main CSS editing interface
- **`src/visual_editor/components/CSSAttributeEditor/CSSTextInput.tsx`** - Text input for CSS properties

#### Content & Style Editing
- **`src/visual_editor/components/GlobalCSSEditor.tsx`** - Editor for global CSS rules
- **`src/visual_editor/components/CustomJSEditor.tsx`** - Editor for custom JavaScript code
- **`src/visual_editor/components/DOMMutationList.tsx`** - List of all DOM mutations applied
- **`src/visual_editor/components/DOMMutationEditor.tsx`** - Editor for individual DOM mutations

#### AI Features
- **`src/visual_editor/components/AIEditorSection.tsx`** - Container for AI-powered features
- **`src/visual_editor/components/AICopySuggestor.tsx`** - AI-powered copy suggestion tool

#### Utility Components
- **`src/visual_editor/components/Tooltip.tsx`** - Reusable tooltip component
- **`src/visual_editor/components/ErrorDisplay.tsx`** - Displays error messages
- **`src/visual_editor/components/DebugPanel.tsx`** - Debug information and diagnostics
- **`src/visual_editor/components/FloatingUndoButton.tsx`** - Floating undo button for quick actions
- **`src/visual_editor/components/ReloadPageButton.tsx`** - Button to reload the page with current changes
- **`src/visual_editor/components/BackToGBButton.tsx`** - Button to return to GrowthBook dashboard
- **`src/visual_editor/components/IDrop.tsx`** - Drop zone component for drag and drop operations

### Custom Hooks (src/visual_editor/lib/hooks/)

#### Core Functionality Hooks
- **`useEditMode.ts`** - Manages element selection, editing state, and DOM mutations
  - Handles element selection and highlighting
  - Manages inline editing mode
  - Tracks DOM mutations and changes
  - Provides methods for modifying elements

- **`useVisualChangeset.ts`** - Manages visual experiment data and variations
  - Loads experiment data from GrowthBook API
  - Manages variations and their changes
  - Handles saving and updating variations

- **`useDragAndDrop.ts`** - Handles drag and drop functionality for moving elements
  - Manages drag state and interactions
  - Handles element positioning during drag
  - Creates DOM mutations for moved elements

#### UI State Hooks
- **`useFixedPositioning.ts`** - Manages the positioning of the visual editor panel
- **`useQueryParams.ts`** - Handles URL parameters for experiment configuration
- **`useGlobalCSS.ts`** - Manages global CSS editing state
- **`useCustomJs.ts`** - Manages custom JavaScript editing state

#### Feature Hooks
- **`useAiCopySuggestion.ts`** - Manages AI-powered copy suggestions
- **`useSDKDiagnostics.ts`** - Provides SDK version and compatibility information
- **`useFloatingAnchor.ts`** - Manages floating element positioning
- **`useGhostElement.ts`** - Creates ghost elements for drag preview

### Utility Files (src/visual_editor/lib/)

- **`constants.ts`** - Defines constants used throughout the visual editor
- **`getSelector.ts`** - Utility for generating CSS selectors for elements
- **`moveElement.ts`** - Core logic for moving elements on the page
- **`normalizeVariations.ts`** - Utility for normalizing variation data

### Styling Files

- **`src/visual_editor/shadowDom.css`** - Styles for the visual editor panel (runs in shadow DOM)
- **`src/visual_editor/targetPage.css`** - Styles injected into the target page for visual feedback

## Key Functionality Areas

### 1. Element Selection & Highlighting
**Files involved:**
- `FloatingFrame.tsx` - Visual overlay
- `SelectorDisplay.tsx` - Shows element selector
- `useEditMode.ts` - Manages selection state
- `BreadcrumbsView.tsx` - Shows element hierarchy

### 2. Element Editing
**Files involved:**
- `ElementDetails/` - Main editing interface
- `AttributeEdit.tsx` - HTML attributes
- `ClassNamesEdit.tsx` - CSS classes
- `CSSAttributeEditor/` - CSS properties
- `useEditMode.ts` - Editing logic

### 3. Drag & Drop
**Files involved:**
- `MoveElementHandle.tsx` - Drag handle
- `useDragAndDrop.ts` - Drag logic
- `moveElement.ts` - Element movement calculations
- `IDrop.tsx` - Drop zones

### 4. Content Editing
**Files involved:**
- `DOMMutationList.tsx` - Lists all changes
- `DOMMutationEditor.tsx` - Individual mutation editing
- `GlobalCSSEditor.tsx` - Global CSS
- `CustomJSEditor.tsx` - Custom JavaScript

### 5. AI Features
**Files involved:**
- `AIEditorSection.tsx` - AI feature container
- `AICopySuggestor.tsx` - Copy suggestions
- `useAiCopySuggestion.ts` - AI logic

### 6. Debug & Diagnostics
**Files involved:**
- `DebugPanel.tsx` - Debug information
- `useSDKDiagnostics.ts` - SDK diagnostics
- `ErrorDisplay.tsx` - Error messages

## UI Customization Guide

### Modifying the Main Layout
- Edit `VisualEditorPane.tsx` for the main container structure
- Modify `VisualEditorHeader.tsx` for header changes
- Update `Toolbar.tsx` for toolbar modifications

### Adding New Editor Modes
1. Add new mode to `VisualEditorMode` type in `Toolbar.tsx`
2. Add mode button to toolbar
3. Create corresponding section in main `index.tsx`
4. Add any necessary hooks for the new functionality

### Styling Changes
- Modify `shadowDom.css` for editor panel styles
- Update `targetPage.css` for page-level visual feedback
- Component-specific styles are typically inline or in component files

### Adding New Element Properties
1. Extend `ElementDetails/DetailsRow.tsx` for new property types
2. Update `AttributeEdit.tsx` for new attribute types
3. Modify `useEditMode.ts` if new editing logic is needed

## Common UI Patterns

### Section Organization
```tsx
<VisualEditorSection title="Section Title" isCollapsible>
  <YourComponent />
</VisualEditorSection>
```

### Element Selection
```tsx
const { elementUnderEdit, setElementUnderEdit } = useEditMode({
  isEnabled: mode === "edit",
  variation: selectedVariation,
  updateVariation: updateSelectedVariation,
});
```

### DOM Mutations
```tsx
const { addDomMutation, removeDomMutation } = useEditMode({
  // ... config
});
```

### Floating Elements
```tsx
<FloatingFrame parentElement={elementUnderEdit} />
```

## Best Practices

1. **State Management**: Use the provided hooks for state management rather than creating new state
2. **DOM Mutations**: Always use the mutation system rather than directly modifying DOM
3. **Styling**: Use the shadow DOM styles for editor UI, target page styles for page feedback
4. **Error Handling**: Use `ErrorDisplay.tsx` for consistent error presentation
5. **Accessibility**: Maintain keyboard navigation and screen reader support

## Troubleshooting

### Common Issues
1. **Element not highlighting**: Check `useEditMode.ts` and `FloatingFrame.tsx`
2. **Changes not saving**: Verify `useVisualChangeset.ts` and mutation handling
3. **Drag not working**: Check `useDragAndDrop.ts` and `moveElement.ts`
4. **Styling issues**: Verify `shadowDom.css` and component-specific styles

### Debug Tools
- Use `DebugPanel.tsx` for SDK diagnostics
- Check browser console for JavaScript errors
- Use `ErrorDisplay.tsx` for user-facing error messages 