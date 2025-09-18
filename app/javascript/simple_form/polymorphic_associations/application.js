// Import individual components
import PolymorphicAssociationAutocomplete from "simple_form/polymorphic_associations/autocomplete";
import StylesManager from "simple_form/polymorphic_associations/styles";

class SimpleFormPolymorphicAssociationsApplication {
  constructor() {
    this.initialized = false;
    this.initializeComponents();
  }
  
  initializeComponents() {
    // Prevent double initialization
    if (this.initialized) {
      console.log("SimpleFormPolymorphicAssociations already initialized, skipping");
      return;
    }
    
    // Initialize CSS injection first
    this.stylesManager = StylesManager.initialize();
    
    // Initialize autocomplete functionality
    this.autocomplete = PolymorphicAssociationAutocomplete.initialize();
    
    this.initialized = true;
    console.log("SimpleFormPolymorphicAssociations application initialized with vanilla JavaScript - no dependencies!");
  }
  
  static initialize() {
    // Use singleton pattern to prevent multiple instances
    if (!window.SimpleFormPolymorphicAssociationsInstance) {
      window.SimpleFormPolymorphicAssociationsInstance = new SimpleFormPolymorphicAssociationsApplication();
    }
    return window.SimpleFormPolymorphicAssociationsInstance;
  }
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  SimpleFormPolymorphicAssociationsApplication.initialize();
});

// Also initialize on Turbo load for Rails apps
document.addEventListener('turbo:load', function() {
  SimpleFormPolymorphicAssociationsApplication.initialize();
});

// Export for global access (maintaining backward compatibility)
if (typeof window !== 'undefined') {
  window.SimpleFormPolymorphicAssociations = window.SimpleFormPolymorphicAssociations || {};
  window.SimpleFormPolymorphicAssociations.Application = SimpleFormPolymorphicAssociationsApplication;
}

// Export the main application class as default
export default SimpleFormPolymorphicAssociationsApplication;

// Also export individual components for advanced usage
export { PolymorphicAssociationAutocomplete, StylesManager };

// Export the vanilla Autocomplete class for backward compatibility  
export { VanillaAutocompleteInstance as Autocomplete } from 'simple_form/polymorphic_associations/autocomplete';
