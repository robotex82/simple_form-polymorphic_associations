# SimpleForm - Polymorphic Associations

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'simple_form-polymorphic_associations'
```

And then execute:
```bash
$ bundle
```

Or install it yourself as:
```bash
$ gem install simple_form-polymorphic_associations
```

### Automatic Setup (Recommended)

Run the install generator to automatically configure your application:

```bash
$ rails generate simple_form-polymorphic_associations:install
```

This will:
- Add the importmap pin to `config/importmap.rb`
- Add the import to `app/javascript/application.js`
- Generate a configuration initializer with helpful comments

After running the generator, your application will automatically have:
- Vanilla JavaScript autocomplete functionality
- Modern CSS styling automatically injected
- Polymorphic association functionality ready to use with zero dependencies

### Manual Setup

If you prefer to set up manually, see the setup section below.

## Prerequisites

This gem uses **vanilla JavaScript** with **zero dependencies**! It's compatible with **importmaps** and **propshaft** for modern Rails applications. **No external libraries required** - everything is handled with pure JavaScript and CSS!

### Key Features

- ✅ **Zero Dependencies**: No jQuery, no select2, no external libraries
- ✅ **Modern JavaScript**: Uses ES6+ features and vanilla DOM APIs
- ✅ **Lightweight**: Significantly smaller bundle size
- ✅ **Accessible**: Built with accessibility best practices
- ✅ **Bootstrap Compatible**: Works seamlessly with Bootstrap 4 and 5
- ✅ **Auto-styling**: CSS is automatically injected, no manual setup required


## Setup

### For Rails 7+ with Importmaps (Recommended)

If you used the generator, you're all set! If not, simply import the JavaScript module in your application:

```javascript
// app/javascript/application.js
import "simple_form-polymorphic_associations"
```

And add the importmap pin to your `config/importmap.rb`:

```ruby
# config/importmap.rb
pin "simple_form-polymorphic_associations", to: "simple_form-polymorphic_associations/application.js"
```

The gem will automatically:
- Load pure vanilla JavaScript autocomplete functionality
- Inject modern CSS styling into your page
- Initialize the polymorphic association functionality on DOM load and Turbo navigation
- Provide keyboard navigation and accessibility features

### For Legacy Applications (Sprockets)

Include the javascript to the head section of your layout:

with erb:

    # app/views/layouts/application.html.erb
    <%= javascript_include_tag "simple_form-polymorphic_associations" %>

with haml:

    # app/views/layouts/application.html.haml
    = javascript_include_tag "simple_form-polymorphic_associations"

## Usage

See the documentation on app/inputs/polymorphic_association_input.rb

## Advanced Configuration

### Preventing Automatic CSS Injection

If you want to manage the styling yourself, you can prevent automatic injection by adding this to your application before importing the gem:

```javascript
// app/javascript/application.js
// Prevent automatic CSS injection
window.SimpleFormPolymorphicAssociations = { 
  skipAutoCSS: true 
};

import "simple_form-polymorphic_associations"
```

Then you can provide your own custom styling for the vanilla autocomplete elements:

```css
/* Custom styling for vanilla autocomplete */
.vanilla-autocomplete-wrapper { /* your styles */ }
.vanilla-autocomplete-input { /* your styles */ }
.vanilla-autocomplete-dropdown { /* your styles */ }
.vanilla-autocomplete-option { /* your styles */ }
```

### Performance Benefits

By switching to vanilla JavaScript, you get:

- **Reduced Bundle Size**: No more jQuery (~85KB) or select2 (~67KB)
- **Faster Load Times**: Fewer HTTP requests and smaller total payload
- **Better Performance**: Native DOM APIs are faster than library abstractions
- **Modern Features**: Uses modern JavaScript features like async/await and fetch

### Migration from select2

If you're migrating from a version that used select2, the vanilla JavaScript implementation provides the same functionality with these benefits:

- **Smaller footprint**: ~15KB total vs ~150KB+ for jQuery + select2
- **Better accessibility**: Built-in ARIA support and keyboard navigation
- **Modern standards**: Uses fetch API, ES6+ features, and semantic HTML
- **No conflicts**: Won't interfere with other JavaScript libraries

The API remains the same - your forms and Ruby code don't need to change!

### Using with Propshaft

This gem is fully compatible with Propshaft (Rails 8's new asset pipeline). The importmap configuration and CSS injection work seamlessly with Propshaft's asset serving.

### Dynamic Initialization

When dynamically adding polymorphic associations, you can still use the exposed constructor:

```javascript
// In your application JavaScript
import { Autocomplete } from "simple_form-polymorphic_associations"

// Initialize on new elements (vanilla JS - no jQuery required!)
const resourceSelect = document.querySelector("#some-form .polymorphic-association-resource-select")
if (resourceSelect) {
  new Autocomplete(resourceSelect);
}
```

## License

This project rocks and uses MIT-LICENSE.