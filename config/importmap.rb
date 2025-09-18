# frozen_string_literal: true

# Importmap configuration for simple_form-polymorphic_associations gem
pin "simple_form/polymorphic_associations", to: "simple_form/polymorphic_associations/application.js"

# Pin all JavaScript files from the simple_form-polymorphic_associations directory
pin_all_from SimpleForm::PolymorphicAssociations::Engine.root.join("app/javascript/simple_form/polymorphic_associations"), under: "simple_form/polymorphic_associations"

# No external dependencies required - pure vanilla JavaScript implementation