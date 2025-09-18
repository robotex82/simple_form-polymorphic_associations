// Styles Manager - Vanilla JavaScript autocomplete styling
// Pure CSS approach - no external dependencies

class StylesManager {
  constructor() {
    this.cssInjected = false;
    this.injectVanillaStyles();
  }

  injectVanillaStyles() {
    // Check if auto-injection is disabled
    if (typeof window !== 'undefined' && 
        window.SimpleFormPolymorphicAssociations && 
        window.SimpleFormPolymorphicAssociations.skipAutoCSS) {
      console.log('[SimpleFormPolymorphicAssociations] Auto CSS injection disabled by configuration');
      return;
    }

    // Check if vanilla autocomplete CSS is already loaded
    if (this.isVanillaCSSLoaded()) {
      console.log('[SimpleFormPolymorphicAssociations] Vanilla autocomplete CSS already loaded');
      return;
    }

    this.injectVanillaCSSStyles();
  }

  isVanillaCSSLoaded() {
    return document.querySelector('style[data-simple-form-polymorphic-associations="vanilla"]') || 
           document.querySelector('link[data-simple-form-polymorphic-associations="vanilla"]');
  }

  injectVanillaCSSStyles() {
    const style = document.createElement('style');
    style.setAttribute('data-simple-form-polymorphic-associations', 'vanilla');
    style.setAttribute('data-turbo-track', 'reload'); // For Turbo compatibility
    
    style.textContent = `
      /* Vanilla Autocomplete Styles for Simple Form Polymorphic Associations */
      .vanilla-autocomplete-wrapper {
        position: relative;
        display: inline-block;
        width: 100%;
      }
      
      .vanilla-autocomplete-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.5;
        background-color: #fff;
        background-image: none;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }
      
      .vanilla-autocomplete-input:focus {
        outline: 0;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
      
      .vanilla-autocomplete-input:disabled {
        background-color: #e9ecef;
        opacity: 1;
      }
      
      .vanilla-autocomplete-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #ced4da;
        border-top: none;
        border-radius: 0 0 4px 4px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .vanilla-autocomplete-option {
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
        transition: background-color 0.15s ease-in-out;
      }
      
      .vanilla-autocomplete-option:last-child {
        border-bottom: none;
      }
      
      .vanilla-autocomplete-option:hover,
      .vanilla-autocomplete-option.focused {
        background-color: #f8f9fa;
        color: #495057;
      }
      
      .vanilla-autocomplete-option.selected {
        background-color: #007bff;
        color: #fff;
      }
      
      .vanilla-autocomplete-no-results {
        padding: 8px 12px;
        color: #6c757d;
        font-style: italic;
        text-align: center;
      }
      
      .vanilla-autocomplete-error {
        padding: 8px 12px;
        color: #721c24;
        background-color: #f8d7da;
        border-color: #f5c6cb;
      }
      
      .vanilla-autocomplete-loading {
        padding: 8px 12px;
        color: #6c757d;
        text-align: center;
      }
      
      .vanilla-autocomplete-loading::after {
        content: '...';
        animation: dots 1.5s steps(5, end) infinite;
      }
      
      @keyframes dots {
        0%, 20% {
          color: rgba(0,0,0,0);
          text-shadow:
            .25em 0 0 rgba(0,0,0,0),
            .5em 0 0 rgba(0,0,0,0);
        }
        40% {
          color: #6c757d;
          text-shadow:
            .25em 0 0 rgba(0,0,0,0),
            .5em 0 0 rgba(0,0,0,0);
        }
        60% {
          text-shadow:
            .25em 0 0 #6c757d,
            .5em 0 0 rgba(0,0,0,0);
        }
        80%, 100% {
          text-shadow:
            .25em 0 0 #6c757d,
            .5em 0 0 #6c757d;
        }
      }
      
      /* Bootstrap 4/5 compatibility */
      .form-control.vanilla-autocomplete-input {
        display: block;
        width: 100%;
        height: calc(1.5em + 0.75rem + 2px);
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }
      
      /* Focus states for accessibility */
      .vanilla-autocomplete-option:focus {
        outline: 2px solid #007bff;
        outline-offset: -2px;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .vanilla-autocomplete-input {
          border-color: #000;
        }
        
        .vanilla-autocomplete-option.focused {
          background-color: #000;
          color: #fff;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .vanilla-autocomplete-input,
        .vanilla-autocomplete-option {
          transition: none;
        }
        
        .vanilla-autocomplete-loading::after {
          animation: none;
        }
      }
    `;
    
    // Insert at the beginning of head to allow user overrides
    document.head.insertBefore(style, document.head.firstChild);
    this.cssInjected = true;
    
    console.log('[SimpleFormPolymorphicAssociations] Auto-injected vanilla autocomplete CSS');
  }

  static initialize() {
    return new StylesManager();
  }
}

export default StylesManager;
