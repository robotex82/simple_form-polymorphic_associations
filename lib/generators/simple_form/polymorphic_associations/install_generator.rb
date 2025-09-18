module SimpleForm
  module PolymorphicAssociations
    module Generators
      class InstallGenerator < Rails::Generators::Base
        desc 'Install SimpleForm Polymorphic Associations by adding importmap pins and JavaScript imports'

        source_root File.expand_path('../templates', __FILE__)

        def generate_initializer
          template 'initializer.rb', 'config/initializers/simple_form-polymorphic_associations.rb'
        end

        # Add importmap pin
        def add_importmap_pin
          append_to_file "config/importmap.rb", "pin \"simple_form/polymorphic_associations\", to: \"simple_form/polymorphic_associations/application.js\"\n"
        end

        # Add simple_form-polymorphic_associations import to application.js
        def add_import_to_application_js
          append_to_file "app/javascript/application.js", "import \"simple_form/polymorphic_associations\"\n"
        end
      end
    end
  end
end
