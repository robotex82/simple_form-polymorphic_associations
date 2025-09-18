module SimpleForm
  module PolymorphicAssociations
    module SpecHelpers
      # Usage:
      #
      #   # spec/support/simple_form-polymorphic_associations.rb
      #   require "simple_form/polymorphic_associations/spec_helpers/system"
      #
      #   RSpec.configure do |config|
      #     config.include SimpleForm::PolymorphicAssociations::SpecHelpers::System, type: :system
      #   end
      #
      module System
        # Usage:
        #
        #   # spec/system/projects_spec.rb
        #   require "rails_helper"
        #
        #   RSpec.describe "Projects", type: :system, js: true do
        #     let(:user) { create(:user) }
        #
        #     before(:each) { user }
        #
        #     it do
        #       visit "/projects/new"
        #       polymorphic_select(user, :name, from: "project[owner_id]")
        #       find("input[type='submit']").click
        #     end
        #   end
        #
        def polymorphic_select(record, label_method, options)
          # Select the class type first
          select record.class.model_name.human, from: options[:from].gsub(/_id]$/, "_type]")
          
          # Wait for the autocomplete input to appear and interact with it
          within(".vanilla-autocomplete-wrapper") do
            input_field = find(".vanilla-autocomplete-input")
            input_field.click
            input_field.fill_in(with: record.send(label_method))
            
            # Wait for search results to appear
            sleep(1)
            
            # Click on the matching option in the dropdown
            find(".vanilla-autocomplete-option", text: record.send(label_method)).click
          end
        end
      end
    end
  end
end
