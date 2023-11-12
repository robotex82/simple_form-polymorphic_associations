# frozen_string_literal: true

class PolymorphicAssociationInput < SimpleForm::Inputs::Base
  # Example:
  #
  # In this example an achievement belongs to an achiever (polymorphic). To make this
  # work you will need four things:
  #
  # 1. A controller action for models that are candidates for the polymorphic association.
  # 2. Routing for these controllers
  # 3. Properly configured models that the controller will query.
  # 4. The form input in the form of the model on the belongs_to side of the polymorphic association.
  #
  # First, setup the controller:
  #
  #     # app/controllers/people_controller.rb
  #     class PeopleController < ApplicationController
  #       include SimpleFormPolymorphicAssociations::AutocompleteConcern
  #     end
  #
  # Then add the routing:
  #
  #     # config/routes.rb
  #     Rails.application.routes.draw do
  #       resources :people do
  #         get :autocomplete, on: :collection
  #       end
  #     end
  #
  # Configure your model to support autocompletion:
  #
  #     # app/models/person.rb
  #     class Person < ActiveRecord::Base
  #       include SimpleFormPolymorphicAssociations::AutocompleteConcern
  #       autocomplete scope: ->(matcher) { where("people.firstname LIKE :term", term: "%#{matcher.downcase}%") }, id_method: :id, text_method: :human
  #     end
  #
  # Yo will need to repeat these first three steps for every model that the can
  # be attached to the polymorphic association.
  #
  # Finally add the input field to the form:
  #
  #     # app/views/achievements/form.html.haml
  #     = form.input :achiever, as: :polymorphic_association, classes: { Person => url_for([:autocomplete, Person]), SomeOtherModel => url_for([:autocomplete, SomeOtherModel]) }
  #
  def input(wrapper_options = nil)
    ActiveSupport::SafeBuffer.new.tap do |o|
      collection = options[:classes].keys.collect { |c| [c.model_name.human, c] }
      instance_label_method = options.delete(:instance_label_method) || :to_s
      o << @builder.select("#{attribute_name}_type", collection, { include_blank: true }, { class: 'form-control select required polymorphic-association-class-select' })
      options[:classes].each do |klass, url|
        o << "<a class=\"polymorphic-association-autocomplete-link\" data-class=\"#{klass}\" href=\"#{url}\" ></a>".html_safe
      end
      id_select_collection = []
      if selected_record = object.send(attribute_name).presence
        id_select_collection << [selected_record.send(instance_label_method), selected_record.id]
      end
      o << @builder.select("#{attribute_name}_id", id_select_collection, {}, { class: 'form-control select required polymorphic-association-resource-select' })
    end
  end
end
