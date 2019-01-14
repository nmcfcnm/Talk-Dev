/* dependency helper validation.js file add this file after that any where you want */

if(vali.existDecument($('#createTagForm')))
{
  $('#createTagForm').submit(function(e){
       e.preventDefault();
       data = {};
       data.tagName = $('#tagInputField').val();
       $.ajax({
            type: 'POST',
            data : data,
            url: '/tag/createTagAdmin/',
            success: function (response) {
              $('#tagInputField').val('');
              if(response)
              {
                notie.alert({type: 1, text:'Saved', time: 2})
              }else{
                notie.alert({type: 3, text:'Tag already exist', time: 2})
              }

            },
            error: function (err) {
                notie.alert({type: 3, text:'Something went wrong!', time: 2})
            }
        });
  });
}
if(vali.existDecument($('#tagEditor')))
{
  $( "#tagEditor" ).select2({
    theme: "bootstrap",
    tags: true,
    placeholder: "Enter tag...",
    tokenSeparators: [',', ' '],
    containerCssClass: ':all:'
  });
}
$('.select2-search__field').css('width','100%')
