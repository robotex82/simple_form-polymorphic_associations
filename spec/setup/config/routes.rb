Rails.application.routes.draw do
  resources :comments
  resources :posts do
    get :autocomplete, on: :collection
  end
end
