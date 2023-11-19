module SimpleFormPolymorphicAssociations
  module SpecHelpers
    # Usage:
    #
    #   # spec/support/simple_form-polymorphic_associations.rb
    #   require "simple_form-polymorphic_associations/spec_helpers/system"
    #
    #   RSpec.configure do |config|
    #     config.include SimpleFormPolymorphicAssociations::SpecHelpers::System, type: :system
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
        select record.class.model_name.human, from: options[:from].gsub(/_id]$/, "_type]")
        first(".select2-container", minimum: 1).click
        find(".select2-search--dropdown input.select2-search__field").send_keys(record.send(label_method))
        sleep(1)
        find(".select2-search--dropdown input.select2-search__field").send_keys(:enter)
      end
    end
  end
end
