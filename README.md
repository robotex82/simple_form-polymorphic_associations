# SimpleForm - Polymorphic Associations

## Prerequisites

You will need select2 in your applicaiton. We don't automatically require it as
we don't want to impose a way to add it. If you don't have it in your application
yet the simplest way is to add it from a cdn:

with erb:

    # app/views/layouts/application.html.erb
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet">/</link>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>

with haml:

    # app/views/layouts/application.html.haml
    %link{:href => "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css", :rel => "stylesheet"}/
    %script{:src => "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"}


## Setup

Include the javascript to the head section of your layout:

with erb:

    # app/views/layouts/application.html.erb
    <%= javascript_include_tag "simple_form-polymorphic_associations" %>

with haml:

    # app/views/layouts/application.html.haml
    = javascript_include_tag "simple_form-polymorphic_associations"

## Usage

See the documentation on app/inputs/polymorphic_association_input.rb

## License

This project rocks and uses MIT-LICENSE.