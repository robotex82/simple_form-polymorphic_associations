FactoryBot.define do
  factory :comment do
    association :resource, factory: :post
    body { "MyText" }
  end
end
