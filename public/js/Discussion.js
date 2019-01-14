var ScrollResponseWait = true;
var id  = location.pathname.split('/')[3];
var dis_limit = 3;
var dis_skip = 0;
var dis_wait = false;
var discussionUrl = '';
var isFeaturedGeted = false;
var isImageSelected = false; /* we can upload image || link one of these only*/
function waitingFlag()
{
  dis_wait = false;
}
function initDiscussion(){
  if(!dis_wait){
      $.ajax({
           type: 'POST',
           contentType: 'application/json',
           data: JSON.stringify({com:id,limit:dis_limit,skip:dis_skip,featuredFlag:isFeaturedGeted}),
           url: '/community/showdiscussion/'+id,
           success: function (response) {
             response.f1 ? resLen1 = response.f1.length : resLen1 = 0;
             response.f0 ? resLen0 = response.f0.length : resLen0 = 0;
             featured1 = response.f1;
             featured0 = response.f0;
             me = response.user;
             dis_skip += resLen0;
             ScrollResponseWait = true;
             isFeaturedGeted = true;

             for(var i=0 ; i<resLen1 ; i++)
             {
               $('#FeaturedParentDiv').append(createDiscussionHtml(featured1[i],me,id));
               if(featured1[i].externalUrl)
               {
                 var meta = {};
                 meta.logo = featured1[i].externalUrlLogo;
                 meta.description = featured1[i].externalUrlDescription;
                 meta.title = featured1[i].externalUrlTitle;
                 getWebsiteDetail(featured1[i].externalUrl,'#discussionLinkPreview'+featured1[i]._id,true,0,true);
               }
               // if(featured1[i].images){
               //   if(featured1[i].images.length){
               //     fillReleventColorInDiv('/Upload/DiscussionImages/'+featured1[i].images[0],'#discussionImageDiv'+featured1[i]._id);
               //  }
               // }
             }

             for(var i=0 ; i<resLen0 ; i++)
             {
               $('#discussionsList').append(createDiscussionHtml(featured0[i],me,id));
               if(featured0[i].externalUrl)
               {
                 var meta = {};
                 meta.logo = featured0[i].externalUrlLogo;
                 meta.description = featured0[i].externalUrlDescription;
                 meta.title = featured0[i].externalUrlTitle;
                 getWebsiteDetail(featured0[i].externalUrl,'#discussionLinkPreview'+featured0[i]._id,true,0,true);
               }
               // if(featured0[i].images){
               //   if(featured0[i].images.length){
               //     fillReleventColorInDiv('/Upload/DiscussionImages/'+featured0[i].images[0],'#discussionImageDiv'+featured0[i]._id);
               //  }
               // }
             }
             if(resLen0==0)
             {
               dis_wait = true;
               setTimeout(waitingFlag, 2000);
             }
             $('.loading').css('display','none');
           },
           error: function (err) {
               ScrollResponseWait = true;
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
           }
       });
  }
}

function toggleFeature(discussionId,flag)
{
  $.ajax({
       type: 'POST',
       contentType: 'application/json',
       data: JSON.stringify({com:id,id:discussionId,featured:flag}),
       url: '/community/toggleFeature/'+id,
       success: function (response) {
         flag == 1 ? featuredPresence = 'featuredContainer' : featuredPresence = '';
         fetHead = '<div class="container discussion-container '+featuredPresence+'" id="'+discussionId+'">';
         function removeFeatured(dis_id,flag)
         {
             $('#featured'+dis_id).remove(); //badge
             $('#featuredBtn'+dis_id).remove();
             code ='<a class="request-dropdown-options" onclick="toggleFeature(\''+dis_id+'\',1)" id="featuredBtn'+dis_id+'">Feature</a>';
             $('#featuredBtnLi'+dis_id).append(code);
             if(flag)
             {
               fetHead1 = '<div class="container discussion-container" id="'+dis_id+'">';
             } else
             {
               fetHead1 = '<div class="container discussion-container '+featuredPresence+'" id="'+dis_id+'">';
             }
             $('#discussionsList').prepend(fetHead1 + $('#'+dis_id).html() + '</div>');
             $('#'+dis_id).remove();
         }
         if(flag==0)
         {
             removeFeatured(discussionId,flag);
         }
         else {
           $('#featuredBtn'+discussionId).remove();
           $('#panel-default'+discussionId).prepend('<span class="badge featured-label" id="featured'+discussionId+'">Featured</span>');
           $('#featured'+discussionId).css('display','block');
           fetBtns ='<a class="request-dropdown-options" onclick="toggleFeature(\''+discussionId+'\',0)" id="featuredBtn'+discussionId+'">Unfeature</a>';
           $('#featuredBtnLi'+discussionId).append(fetBtns);
           fetCode = fetHead + $('#'+discussionId).html() + '</div>';
           $('#'+discussionId).remove();
           $('#FeaturedParentDiv').append(fetCode);

         }
       },
       error: function (err) {
           notie.alert({type: 3, text:err.responseText, time: 4})
       }
   });
}

function toggleGlobal(discussionId,flag)
{
  $.ajax({
       type: 'POST',
       contentType: 'application/json',
       data: JSON.stringify({com:id,id:discussionId,global:flag}),
       url: '/community/toggleGlobal/'+id,
       success: function (response) {
         function removeGlobal(dis_id,flag)
         {
             $('#global'+dis_id).remove(); //badge
             $('#globalBtn'+dis_id).remove();
             code ='<a class="request-dropdown-options" onclick="toggleGlobal(\''+dis_id+'\',1)" id="globalBtn'+dis_id+'">Publish to oneness</a>';
             $('#globalBtnLi'+dis_id).append(code);
         }
         if(flag==0)
         {
             removeGlobal(discussionId,flag);
         }
         else {
           $('#globalBtn'+discussionId).remove();
           $('#panel-default'+discussionId).prepend('<span class="badge global-label" id="global'+discussionId+'">Global</span>');
           $('#global'+discussionId).css('display','block');
           gloBtns ='<a class="request-dropdown-options" onclick="toggleGlobal(\''+discussionId+'\',0)" id="globalBtn'+discussionId+'">Unpublish to oneness</a>';
           $('#globalBtnLi'+discussionId).append(gloBtns);
         }
       },
       error: function (err) {
           notie.alert({type: 3, text:err.responseText, time: 4})
       }
   });
}

/*--------------------------------For delete the discussion-----------------------------*/
function actionDeleteDiscussion(discussionId){
  $.ajax({
       type: 'POST',
       contentType: 'application/json',
       data: JSON.stringify({_id:discussionId}),
       url: '/community/deletediscussion/'+id,
       success: function (response) {
         $('#'+discussionId).remove();
         if(location.pathname.split('/')[2]=='selecteddiscussion')
         {
           window.location.replace("/community/discussion/"+id);
         }
       },
       error: function (err) {
           notie.alert({type: 3, text:'Something went wrong!', time: 2})
       }
   });
}
function deleteDiscussion(discussionId)
{
  $.confirm({
    title: 'Confirm!',
    content: 'Do you really want delete this discussion?',
    buttons: {
       'Yes': {
           btnClass: 'btn-success',
           action: function(){
              actionDeleteDiscussion(discussionId);
            }
          },
          'No': {btnClass: 'btn-danger',}
   }
  });
}
/*------------------------------------------------------------------------------------*/
$('.discussion-body-textarea').val('');
$('.discussion-panel-body').click(()=>{
  $('.discussion-body').css('display','block');
})
//---------------------------------Post New Discussion-----------------------------------------
function updatePostedDiscussion()
{
  $.ajax({
       type: 'POST',
       contentType: 'application/json',
       data: JSON.stringify({com:id,limit:1,skip:0,featuredFlag:isFeaturedGeted}),
       url: '/community/showdiscussion/'+id,
       success: function (response) {
         me = response.user;
         response = response.f0;
         for(i=0;i<response.length;i++)
         {
           $('#discussionsList').prepend(createDiscussionHtml(response[i],me,id));
           if(response[0].externalUrl && response[0].externalUrl.length )
           {
             getWebsiteDetail(response[0].externalUrl,'#discussionLinkPreview'+response[0]._id,true,0,false);
           }
           if(response[i].images.length){
             fillReleventColorInDiv('/Upload/DiscussionImages/'+response[i].images[0],'#discussionImageDiv'+response[i]._id);
           }
         }
       },
       error: function (err) {
           notie.alert({type: 3, text:'Something went wrong!', time: 2})
       }
   });
}
$('#discussionPostForm').submit(function(e){
     e.preventDefault();
});
$("#discussion-post").click(()=>{
  disTitle = $('#discussion-title').val();
  disDetail = $('#discussion-details').val();
  $('.discussion-post-btn-txt').css('display','none');
  $('.discussion-post-spinner').css('display','block');
  $('#discussion-post').attr('disabled','true');
  if(disTitle.trim().length && disDetail.trim().length)
  {
      data = new FormData($('#discussionPostForm')[0]);

      data.append('community',id);
      data.append('externalUrl',previewLink);
      data.append('externalUrllogo',previewLinkLogo);
      data.append('externalUrlTitle',previewLinkTitle);
      data.append('externalUrldescription',previewLinkDescription);
      $.ajax({
           type: 'POST',
           data : data,
           url: '/community/creatediscussion/'+id,
           enctype: 'multipart/form-data',
           processData: false,
           contentType: false,
           success: function (response) {
             $('#discussion-title').val('');
             $('#discussion-details').val('');
             $('#discussionImageFile').val('');
             $("#tagEditor").val(null).trigger('change');
             clearImagePreview();
             dis_skip += 1;
             updatePostedDiscussion();
             $('.link-preview-container').remove();
             previewLink = null;
             previewLinkLogo = null;
             previewLinkDescription = null;
             previewLinkTitle = null;
             isImageSelected = false;
             $('.discussion-post-spinner').css('display','none');
             $('.discussion-post-btn-txt').css('display','block');
             $('#discussion-post').removeAttr("disabled");
             notie.alert({type: 1, text:'Discussion successfully posted.', time: 2});
           },
           error: function (err) {
             $('.discussion-post-spinner').css('display','none');
             $('.discussion-post-btn-txt').css('display','block');
             $('#discussion-post').removeAttr("disabled");
             notie.alert({type: 3, text:'Something went wrong!', time: 2})
           }
       });
  }
  else
  {
    $('.discussion-post-spinner').css('display','none');
    $('.discussion-post-btn-txt').css('display','block');
    $('#discussion-post').removeAttr("disabled");
    notie.alert({type: 3, text:'All fields are required', time: 2})
  }
});
//---------------------Image Upload Code Discussion-----------------------------
function showImagePreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          $('#previewImage').attr('src',e.target.result);
          $('.image-preview-main').css('display','block');
          $('#closeImgPreviewBtn').css('display','block');
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$('#discussionImageFile').change(function(){
   isImageSelected = true;
   showImagePreview(this);
});
$('#discussionImageClickBtn').click(()=>{
  $('#discussionImageFile').click();
})
function clearImagePreview(){
  $('#previewImage').attr('src','');
  $('.image-preview-main').css('display','none');
  $('#closeImgPreviewBtn').css('display','none');
  $('#discussionImageFile').val('');
}
$('#closeImgPreviewBtn').click(()=>{
  isImageSelected = false;
  clearImagePreview();
  changeDiscussionDetails();
});
//------------------------------------------------------------------------------
$(function() {
  $('.discussion-body-textarea').on('keyup paste', function() {
    var $el = $(this);
    offset = $el.innerHeight() - $el.height();
    if ($el.innerHeight < this.scrollHeight) {
      $el.height(this.scrollHeight - offset);
    } else {
      $el.height(1);
      $el.height(this.scrollHeight - offset);
    }
  });
});
$('.comment-btn').on('click',function(){
  $('.comment-textarea').focus();
});
$(function() {
  $('.comment-textarea').on('keyup paste', function(event) {
      var $el = $(this);
      offset = $el.innerHeight() - $el.height();
      if ($el.innerHeight < this.scrollHeight) {
        $el.height(this.scrollHeight - offset);
      } else {
        $el.height(1);
        $el.height(this.scrollHeight - offset);
        $('html, body').animate({scrollTop:$(document).height()}, 'normal');
      }
  });
});
/* its for show the website details */
function changeDiscussionDetails(){
  if(!isImageSelected){
      previewLink = vali.isUrlPresent($('#discussion-details').val().trim());
      if(previewLink)
      {
        previewLink = previewLink.trim().replace(/\/$/, "");
        if(previewLink && previewLink != discussionUrl)
        {
          $('.link-preview-container').remove(); //if link changed by user
          discussionUrl = previewLink;
          getWebsiteDetail(discussionUrl,'.link-preview-main',null,1,true);
        }
      } else {
        discussionUrl = '';
        clearThePreview(); // if no any link present
      }
  }
}
$('.discussion-body-textarea').on('keyup paste change', function() {
  changeDiscussionDetails();
});
/*--------------------------Tag Editor---------------------------------*/
// $(document).on('keyup', '.select2-search__field', function (e) {
function initAllTags()
{
  //var data = {"tagString" : $('.select2-search__field').val()};
  var data = {"tagString" : ''}
  //if(data.tagString.trim().length)
  //{
    $.ajax({
         type: 'POST',
         data : data,
         url: '/tag/getTags',
         success: function (response) {
           for(var i=0 ; i<response.length ; i++)
           {
             code = '<option class="tagSuggestInput">'+response[i].tagName+'</option>'
             $('#tagEditor').append(code);
           }
         },
         error: function (err) {
             notie.alert({type: 3, text:'Something went wrong!', time: 2})
         }
     });
   //}
 }
//})
initAllTags();
/*---------------------------------------------------------------------*/
