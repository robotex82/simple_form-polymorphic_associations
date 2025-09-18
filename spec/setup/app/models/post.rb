class Post < ApplicationRecord
  include SimpleForm::PolymorphicAssociations::Model::AutocompleteConcern
  autocomplete scope: ->(matcher) { where("posts.title LIKE :term", term: "%#{matcher.downcase}%") }, id_method: :id, text_method: :title

  has_many :comments, as: :resource
end
