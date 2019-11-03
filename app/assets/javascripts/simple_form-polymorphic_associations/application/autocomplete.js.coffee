$ ->
  $('.polymorphic-association-resource-select').select2 ajax:
    url: ->
      klass = $(@.siblings('.polymorphic-association-class-select')[0]).val()
      $(@).parent().find(".polymorphic-association-autocomplete-link[data-class='#{klass}']").attr('href')
    dataType: 'json',
    delay: 500
