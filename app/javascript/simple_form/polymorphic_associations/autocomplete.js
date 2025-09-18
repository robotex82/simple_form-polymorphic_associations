// Polymorphic Association Autocomplete functionality
// Pure vanilla JavaScript implementation - no dependencies

class PolymorphicAssociationAutocomplete {
  constructor() {
    this.elements = new Map();
    this.initializeAutocomplete();
  }

  initializeAutocomplete() {
    const elements = document.querySelectorAll('.polymorphic-association-resource-select');
    
    elements.forEach((element) => {
      this.attachAutocomplete(element);
    });
    
    console.log(`Initialized vanilla JS autocomplete on ${elements.length} polymorphic association elements`);
  }

  attachAutocomplete(element) {
    // Skip if already initialized
    if (this.elements.has(element)) {
      return;
    }

    const autocompleteInstance = new VanillaAutocompleteInstance(element);
    this.elements.set(element, autocompleteInstance);
    
    console.log('Attached vanilla autocomplete to element:', element);
  }

  static initialize() {
    return new PolymorphicAssociationAutocomplete();
  }
}

class VanillaAutocompleteInstance {
  constructor(element) {
    this.element = element;
    this.searchTimeout = null;
    this.isOpen = false;
    this.currentFocus = -1;
    this.options = [];
    
    this.setupAutocomplete();
    this.bindEvents();
  }

  setupAutocomplete() {
    // Check if wrapper already exists (prevents duplicate initialization)
    const existingWrapper = this.element.parentNode.querySelector('.vanilla-autocomplete-wrapper');
    if (existingWrapper) {
      console.log('Autocomplete wrapper already exists, reusing existing setup');
      this.wrapper = existingWrapper;
      this.input = existingWrapper.querySelector('.vanilla-autocomplete-input');
      this.dropdown = existingWrapper.querySelector('.vanilla-autocomplete-dropdown');
      return;
    }
    
    // Hide the original select and create our custom autocomplete
    this.element.style.display = 'none';
    
    // Create wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'vanilla-autocomplete-wrapper';
    this.wrapper.style.position = 'relative';
    
    // Create input field
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = this.element.className.replace('polymorphic-association-resource-select', 'vanilla-autocomplete-input');
    this.input.placeholder = 'Type to search...';
    this.input.autocomplete = 'off';
    
    // Set ID and name based on original select element
    if (this.element.id) {
      this.input.id = this.element.id + '_autocomplete';
    }
    if (this.element.name) {
      // Handle both simple names and Rails-style nested names
      if (this.element.name.includes('[') && this.element.name.includes(']')) {
        // For names like "comment[resource_id]", convert to "comment[resource_id_autocomplete]"
        this.input.name = this.element.name.replace(/\]$/, '_autocomplete]');
      } else {
        // For simple names, just append _autocomplete
        this.input.name = this.element.name + '_autocomplete';
      }
    }
    
    // Create dropdown
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'vanilla-autocomplete-dropdown';
    this.dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ccc;
      border-top: none;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
    `;
    
    // Insert after the original select
    this.element.parentNode.insertBefore(this.wrapper, this.element.nextSibling);
    this.wrapper.appendChild(this.input);
    this.wrapper.appendChild(this.dropdown);
    
    // Set initial value if select has a selected option
    const selectedOption = this.element.querySelector('option[selected]');
    if (selectedOption && selectedOption.value) {
      this.input.value = selectedOption.textContent;
    }
  }

  bindEvents() {
    // Skip if events are already bound (prevents duplicate listeners)
    if (this.input.dataset.eventsAttached === 'true') {
      console.log('Events already attached to input, skipping');
      return;
    }
    
    // Input events
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('focus', (e) => this.handleFocus(e));
    this.input.addEventListener('blur', (e) => this.handleBlur(e));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Listen for resource type changes to clear cached options
    const classSelect = this.element.parentNode.querySelector('.polymorphic-association-class-select');
    if (classSelect && !classSelect.dataset.changeListenerAttached) {
      classSelect.addEventListener('change', () => {
        this.options = []; // Clear cached options when resource type changes
        this.input.value = ''; // Clear input value
        this.closeDropdown();
      });
      classSelect.dataset.changeListenerAttached = 'true';
    }
    
    // Mark events as attached
    this.input.dataset.eventsAttached = 'true';
    
    // Click outside to close (use a unique handler to avoid duplicates)
    if (!this.documentClickHandler) {
      this.documentClickHandler = (e) => {
        if (!this.wrapper.contains(e.target)) {
          this.closeDropdown();
        }
      };
      document.addEventListener('click', this.documentClickHandler);
    }
  }

  handleInput(e) {
    const value = e.target.value;
    
    clearTimeout(this.searchTimeout);
    
    if (value.length < 2) {
      this.closeDropdown();
      return;
    }
    
    this.searchTimeout = setTimeout(() => {
      this.performSearch(value);
    }, 500);
  }

  handleFocus(e) {
    // If we already have options loaded, just open the dropdown
    if (this.options.length > 0) {
      this.openDropdown();
      return;
    }
    
    // For edit forms with existing values, trigger a search to load available resources
    const url = this.getUrl();
    if (url && this.input.value.trim().length > 0) {
      // Perform an empty search to load all available resources for the current type
      this.performSearch('');
    }
  }

  handleBlur(e) {
    // Delay closing to allow for option clicks
    setTimeout(() => {
      if (!this.wrapper.querySelector(':hover')) {
        this.closeDropdown();
      }
    }, 150);
  }

  handleKeydown(e) {
    if (!this.isOpen) return;
    
    const items = this.dropdown.querySelectorAll('.vanilla-autocomplete-option');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.currentFocus = Math.min(this.currentFocus + 1, items.length - 1);
        this.updateFocus(items);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.currentFocus = Math.max(this.currentFocus - 1, -1);
        this.updateFocus(items);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (this.currentFocus >= 0 && items[this.currentFocus]) {
          this.selectOption(items[this.currentFocus]);
        }
        break;
        
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  updateFocus(items) {
    items.forEach((item, index) => {
      item.classList.toggle('focused', index === this.currentFocus);
    });
  }

  async performSearch(term) {
    const url = this.getUrl();
    if (!url) {
      console.warn('No URL found for autocomplete search');
      return;
    }
    
    // Show loading state
    this.showLoading();
    
    try {
      const searchUrl = `${url}${url.includes('?') ? '&' : '?'}term=${encodeURIComponent(term)}`;
      const response = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.displayResults(data);
    } catch (error) {
      console.error('Autocomplete search failed:', error);
      this.showError('Search failed. Please try again.');
    }
  }

  displayResults(data) {
    // Handle server response format - extract results array if wrapped in object
    const results = data.results || data;
    
    this.options = results;
    this.dropdown.innerHTML = '';
    this.currentFocus = -1;
    
    // Always add a "Clear" option at the top for edit forms
    const clearOption = document.createElement('div');
    clearOption.className = 'vanilla-autocomplete-option vanilla-autocomplete-clear';
    clearOption.textContent = '— Clear selection —';
    clearOption.dataset.value = '';
    clearOption.dataset.isClear = 'true';
    clearOption.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      color: #666;
      font-style: italic;
      background-color: #f9f9f9;
    `;
    
    // Hover effects for clear option
    clearOption.addEventListener('mouseenter', () => {
      this.currentFocus = 0;
      this.updateFocus(this.dropdown.querySelectorAll('.vanilla-autocomplete-option'));
    });
    
    clearOption.addEventListener('click', () => {
      this.selectOption(clearOption);
    });
    
    this.dropdown.appendChild(clearOption);
    
    if (!results || results.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'vanilla-autocomplete-no-results';
      noResults.textContent = 'No results found';
      noResults.style.cssText = 'padding: 8px 12px; color: #666; font-style: italic;';
      this.dropdown.appendChild(noResults);
    } else {
      results.forEach((result, index) => {
        const option = document.createElement('div');
        option.className = 'vanilla-autocomplete-option';
        option.textContent = result.text || result.label || result.name;
        option.dataset.value = result.id || result.value;
        option.style.cssText = `
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
        `;
        
        // Hover effects (index + 1 because clear option is at index 0)
        option.addEventListener('mouseenter', () => {
          this.currentFocus = index + 1;
          this.updateFocus(this.dropdown.querySelectorAll('.vanilla-autocomplete-option'));
        });
        
        option.addEventListener('click', () => {
          this.selectOption(option);
        });
        
        this.dropdown.appendChild(option);
      });
    }
    
    this.openDropdown();
  }

  selectOption(optionElement) {
    const value = optionElement.dataset.value;
    const text = optionElement.textContent;
    const isClear = optionElement.dataset.isClear === 'true';
    
    if (isClear) {
      // Handle clear selection
      this.input.value = '';
      this.element.innerHTML = '<option value="" selected></option>';
      this.element.value = '';
      
      // Also clear the resource type select
      const classSelect = this.element.parentNode.querySelector('.polymorphic-association-class-select');
      if (classSelect) {
        classSelect.value = '';
        // Trigger change event on class select as well
        const classChangeEvent = new Event('change', { bubbles: true });
        classSelect.dispatchEvent(classChangeEvent);
      }
    } else {
      // Handle normal selection
      this.input.value = text;
      this.element.innerHTML = `<option value="${value}" selected>${text}</option>`;
      this.element.value = value;
    }
    
    // Trigger change event on original select for form compatibility
    const changeEvent = new Event('change', { bubbles: true });
    this.element.dispatchEvent(changeEvent);
    
    this.closeDropdown();
  }

  showError(message) {
    this.dropdown.innerHTML = '';
    const error = document.createElement('div');
    error.className = 'vanilla-autocomplete-error';
    error.textContent = message;
    this.dropdown.appendChild(error);
    this.openDropdown();
  }

  showLoading() {
    this.dropdown.innerHTML = '';
    const loading = document.createElement('div');
    loading.className = 'vanilla-autocomplete-loading';
    loading.textContent = 'Searching';
    this.dropdown.appendChild(loading);
    this.openDropdown();
  }

  openDropdown() {
    this.dropdown.style.display = 'block';
    this.isOpen = true;
  }

  closeDropdown() {
    this.dropdown.style.display = 'none';
    this.isOpen = false;
    this.currentFocus = -1;
  }

  getUrl() {
    const classSelect = this.element.parentNode.querySelector('.polymorphic-association-class-select');
    if (!classSelect || !classSelect.value) {
      return null;
    }
    
    const klass = classSelect.value;
    const link = this.element.parentNode.querySelector(`.polymorphic-association-autocomplete-link[data-class='${klass}']`);
    return link ? link.getAttribute('href') : null;
  }
}

// Export for global access (maintaining backward compatibility)
if (typeof window !== 'undefined') {
  window.SimpleFormPolymorphicAssociations = window.SimpleFormPolymorphicAssociations || {};
  window.SimpleFormPolymorphicAssociations.Autocomplete = VanillaAutocompleteInstance;
  window.SimpleFormPolymorphicAssociations.PolymorphicAssociationAutocomplete = PolymorphicAssociationAutocomplete;
}

export { VanillaAutocompleteInstance };
export default PolymorphicAssociationAutocomplete;
