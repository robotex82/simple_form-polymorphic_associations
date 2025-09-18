# frozen_string_literal: true

$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "simple_form/polymorphic_associations/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "simple_form-polymorphic_associations"
  s.version     = SimpleForm::PolymorphicAssociations::VERSION
  s.authors     = ["BeeGood IT"]
  s.email       = ["info@beegoodit.de"]
  s.summary     = "Simple Form polymorphic associations."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "simple_form"
end
