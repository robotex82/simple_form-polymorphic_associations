window.SimpleFormPolymorphicAssociations = window.SimpleFormPolymorphicAssociations ? {}

# When dynamically adding a new polymorphic association, we need to rebind the
# autocomplete to the new select2 element. This is done by calling the constructor
# on the new element.
#
# Example:
#
#  :javascript
#    var resourceSelect = $("#some-form").find(".polymorphic-association-resource-select")
#    if (window.SimpleFormPolymorphicAssociations) {
#      new window.SimpleFormPolymorphicAssociations.Autocomplete(resourceSelect);
#    } else {
#      console.error('window.SimpleFormPolymorphicAssociations.Autocomplete is not defined');
#    }
#
class SimpleFormPolymorphicAssociations.Autocomplete
  constructor: (@element) ->
    @getUrl = @getUrl.bind(this)
    @element.select2 ajax: @getAjaxOptions()

  getAjaxOptions: ->
    url: @getUrl
    dataType: 'json'
    delay: 500

  getUrl: ->
    klass = @element.siblings('.polymorphic-association-class-select').first().val()
    @element.parent().find(".polymorphic-association-autocomplete-link[data-class='#{klass}']").attr('href')

$ ->
  new SimpleFormPolymorphicAssociations.Autocomplete($('.polymorphic-association-resource-select'))
