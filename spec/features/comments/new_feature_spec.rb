require "rails_helper"

RSpec.describe "/comments/new", type: :feature, js: true do
  let(:base_path) { "/comments" }
  let(:new_path) { "#{base_path}/new" }
  let(:resource) { create(:post) }
  
  describe "UI" do
    before do
      resource
      visit(new_path)
    end

    it { expect(page).to have_css("form[action='#{base_path}']") }
    # it { expect(page).to have_css("select[name='comment[resource_id]']") }
    it { expect(page).to have_css("input[name='comment[resource_id_autocomplete]']") }
    it { expect(page).to have_css("select[name='comment[resource_type]']") }
    it { expect(page).to have_css("textarea[name='comment[body]']") }

    describe "Selecting a resource" do
      let(:resource_type_select) { find("select[name='comment[resource_type]']") }
      let(:resource_id_input) { find("input[name='comment[resource_id_autocomplete]']") }
      let(:resource_option) { find("div.vanilla-autocomplete-option", text: resource.title) }

      before do
        resource_type_select.click
        resource_type_select.find("option", text: resource.class.model_name.human).click
        resource_id_input.click
        resource_id_input.fill_in(with: resource.title[0..2])
        resource_option.click
      end

      describe "Persistence changes" do
        let(:post_with_associated_comment_scope) { Post.includes(:comments).where(comments: { resource_id: resource.id }) }
        let(:submit_button) { find("input[type='submit']") }

        it { expect{ submit_button.click }.to change(post_with_associated_comment_scope, :count).from(0).to(1) }
      end
    end
  end
end