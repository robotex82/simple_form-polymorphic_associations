require "rails_helper"

RSpec.describe "/comments/edit", type: :feature, js: true do
  let(:base_path) { "/comments" }
  let(:edit_path) { "#{base_path}/#{comment.to_param}/edit" }
  let(:original_resource) { create(:post) }
  let(:comment) { create(:comment, resource: original_resource) }

  describe "UI" do
    let(:resource_id_autocomplete) { find("input[name='comment[resource_id_autocomplete]']") }
    before do
      comment
      visit(edit_path)
    end

    it { expect(page).to have_css("form[action='#{base_path}/#{comment.to_param}']") }
    it { expect(page).to have_css("select[name='comment[resource_type]']") }
    it { expect(resource_id_autocomplete.value).to eq(comment.resource.title) }
  end

  describe "Not changing the resource" do
    let(:submit_button) { find("input[type='submit']") }
    
    before do
      visit(edit_path)
    end
    
    it { expect{ submit_button.click }.not_to change { comment.reload.resource.id } }
  end

  describe "Setting the resource to nil" do
    let(:resource_id_autocomplete) { find("input[name='comment[resource_id_autocomplete]']") }
    let(:submit_button) { find("input[type='submit']") }
    
    before do
      visit(edit_path)
      resource_id_autocomplete.click
      find("div.vanilla-autocomplete-clear", text: "— Clear selection —").click
    end

    it { expect{ submit_button.click }.to change { comment.reload.resource }.from(original_resource).to(nil) }
  end

  describe "Changing the resource" do
    let(:resource_id_autocomplete) { find("input[name='comment[resource_id_autocomplete]']") }
    let(:submit_button) { find("input[type='submit']") }
    let(:other_post) { create(:post, title: "Other Post") }
    
    before do
      other_post
      visit(edit_path)
      resource_id_autocomplete.click
      resource_id_autocomplete.fill_in(with: other_post.title[0..2])
      find("div.vanilla-autocomplete-option", text: other_post.title).click
    end

    it { expect{ submit_button.click }.to change { comment.reload.resource.id }.from(comment.resource.id).to(other_post.id) }
  end
end