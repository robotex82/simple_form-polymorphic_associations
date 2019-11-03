module SimpleFormPolymorphicAssociations
  module Controller
    # Example:
    #
    #     # app/controllers/people_controller.rb
    #     class PeopleController < ApplicationController
    #       include SimpleFormPolymorphicAssociations::AutocompleteConcern
    #     end
    #
    module AutocompleteConcern
      extend ActiveSupport::Concern

      def autocomplete
        @collection = if params[:term].present?
          load_collection_scope.autocomplete(params[:term])
        else
          []
        end

        respond_to do |format|
          format.json { render json: { results: @collection.map { |q| q.as_autocomplete_json } } }
        end
      end
    end
  end
end