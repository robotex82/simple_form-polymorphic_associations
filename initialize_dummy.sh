#!/bin/bash

# Delete old dummy app
rm -rf spec/dummy

# Generate new dummy app
CURRENT_DIR=$(pwd)
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR
rails --version
rails new dummy \
  --skip-git \
  --skip-bundle \
  -T \
  --javascript=importmap
mv dummy $CURRENT_DIR/spec/dummy
cd $CURRENT_DIR
rm -rf $TEMP_DIR

# Abort unless the dummy app was created successfully
if [ ! -d "spec/dummy" ]; then
  echo "Dummy app was not created successfully"
  exit 1
fi

# Proceed in the dummy app
cd spec/dummy

# Remove .ruby-version
rm .ruby-version

# Use the correct Gemfile
sed -i 's|../Gemfile|../../../Gemfile|' config/boot.rb
rm Gemfile*

# Load dependencies in application.rb after Bundler.require(*Rails.groups)
sed -i '/Bundler.require\*\(\*Rails\.groups\)/a\\nrequire "simple_form"\nrequire "simple_form-polymorphic_associations"' config/application.rb

# Install simple_form
bin/rails g simple_form:install --bootstrap

# install importmaps
bin/rails importmap:install

# install turbo-rails
bin/rails turbo:install

# Install dependencies
bundle install

# Install simple_form-polymorphic_associations
bin/rails g simple_form:polymorphic_associations:install

# Add example models to test polymorphic associations
rails g scaffold Post title:string body:text published_at:timestamp
rails g scaffold Comment resource:references{polymorphic} body:text

# Copy files from spec/setup to the dummy app
cp -r $CURRENT_DIR/spec/setup/* .
mv db/migrate/99991231235959_make_resources_optional_on_comments.rb db/migrate/$(date +%Y%m%d%H%M%S)_make_resources_optional_on_comments.rb

# Cleanup automatically generated specs
rm -rf spec/controllers
rm -rf spec/helpers
rm -rf spec/models
rm -rf spec/views
rm -rf spec/requests
rm -rf spec/routing

# Setup database
rails db:migrate db:test:prepare

# Create posts
bin/rails runner "require 'factory_bot_rails'; FactoryBot.create_list(:post, 10)"

# Create comments
bin/rails runner "require 'factory_bot_rails'; FactoryBot.create_list(:comment, 3, resource: Post.first)"
