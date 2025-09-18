# frozen_string_literal: true

module SimpleForm
  module PolymorphicAssociations
    class Engine < ::Rails::Engine
      isolate_namespace SimpleForm::PolymorphicAssociations

      initializer "simple_form-polymorphic_associations.importmap", before: "importmap" do |app|
        if defined?(Importmap)
          puts "[SimpleForm::PolymorphicAssociations] Adding importmap paths"
          app.config.importmap.paths << root.join("config/importmap.rb")
          app.config.importmap.cache_sweepers << root.join("app/javascript")
        end
      end

      # Ensure asset server (Propshaft/Sprockets) can find JS files
      initializer "simple_form-polymorphic_associations.assets" do |app|
        puts "[SimpleForm::PolymorphicAssociations] Adding asset paths"
        app.config.assets.paths << root.join("app/javascript")
      end
    end
  end
end