module SimpleFormPolymorphicAssociations
  module Model
    # Example:
    #
    #     # app/models/person.rb
    #     class Person < ActiveRecord::Base
    #       include SimpleFormPolymorphicAssociations::AutocompleteConcern
    #       autocomplete scope: ->(matcher) { where("people.firstname LIKE :term", term: "%#{matcher.downcase}%") }, id_method: :id, text_method: :human
    #     end
    #
    module AutocompleteConcern
      extend ActiveSupport::Concern

      class_methods do
        def autocomplete(options)
          self.send(:scope, :autocomplete, options[:scope])
          @autocomplete_options = options
        end

        def autocomplete_options
          @autocomplete_options
        end
      end

      def as_autocomplete_json
        { id: send(self.class.autocomplete_options[:id_method]), text: send(self.class.autocomplete_options[:text_method]) }
      end
    end
  end
end