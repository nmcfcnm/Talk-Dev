/* link is for discussion external link here */
var previewLink = null;
var previewLinkLogo = null;
var previewLinkDescription = null;
var previewLinkTitle = null;
var sitePreviewResult = {};
var validR1 =/^((http|https):\/\/)/;
var validR2 =/^((http|https):\/\/www)/;
var base64reg = /^data:image.*$/;

/*------------------------------------------Image And YoutubeVideo Popup Of Discussion------------------------------*/
var ytCode = '';
ytOptions = 'allowfullscreen="allowfullscreen"';
ytOptions += ' mozallowfullscreen="mozallowfullscreen"';
ytOptions += ' msallowfullscreen="msallowfullscreen"';
ytOptions += ' oallowfullscreen="oallowfullscreen"';
ytOptions += ' webkitallowfullscreen="webkitallowfullscreen"';
ytCode += '<iframe src="" class="pop-up-video-preview" '+ytOptions+'>';
ytCode += '</iframe>'
var imgPopCode = '<img src="" class="pop-up-image-preview" />';

$('body').append('<div class="image-pop-overlay"><span class="image-pop-overlay-close">x</span>'+imgPopCode+ytCode+'</div>');

var previewContainer = $('.image-pop-overlay');
var previewOverlayImage = $('.image-pop-overlay img');
var previewOverlayVideo = $('.image-pop-overlay iframe');

$(document).on('dblclick','.show-discussion-image',(e)=>{
    var previewImageSource = $(e.currentTarget).attr('src');
    previewOverlayImage.attr('src', previewImageSource);
    $('.pop-up-image-preview').css('display','block');
    previewContainer.fadeIn(100);
    $('body').css('overflow', 'hidden');
})

$('.image-pop-overlay-close').click(function () {
    previewContainer.fadeOut(100);
    $('.pop-up-image-preview').css('display','none');
    $('.pop-up-video-preview').css('display','none');
    previewOverlayVideo.attr('src', '');
    $('body').css('overflow', 'auto');
});
/*---------------------------For Links------------------------------------------------------*/
$(document).on('dblclick','.link-preview-image-div-added',(e)=>{
    var bgCss = e.currentTarget.style.background;
    var mainUrl = $(e.currentTarget).attr('alt');
    var imageUrl = bgCss.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
    var utFlag = youtubeReg.test(mainUrl);
    var yt_id = '';
    var videoLink = '';
    if(utFlag)
    {
        try{
          yt_id = mainUrl.match(youtubeIdReg)[3];
          videoLink = 'https://www.youtube.com/embed/'+yt_id;
        }catch(err){
          yt_id = null;
        }
        if(!yt_id)
        {
          utFlag = false;
        }
    }
    if(utFlag) // if any youtube video
    {
        previewOverlayVideo.attr('src', videoLink);
        $('.pop-up-video-preview').css('display','block');
        previewContainer.fadeIn(100);
        $('body').css('overflow', 'hidden');
    } else {
        previewOverlayImage.attr('src', imageUrl);
        $('.pop-up-image-preview').css('display','block');
        previewContainer.fadeIn(100);
        $('body').css('overflow', 'hidden');
    }

})
/*---------------------For clear linkpreview on typing----------------------*/
function clearThePreview()
{
  $('.link-preview-container').remove();
  $('.discussion-image-btn').css('display','block');
  sitePreviewResult = {};
  previewLink = null;
  previewLinkLogo = null;
  previewLinkDescription = null;
  previewLinkTitle = null;
}
/*-------------------------------------------------------------------------*/
function createTheSitePreviewHtml(sitePreviewResult,idForPreviewHtml,idForPreviewContainer,state)
{
        /* state 1 for typing preview
        * state 0 for show discussion preview
        */
  try{
        isYoutubeVideo = youtubeReg.test('http://'+sitePreviewResult.sitename);
        isHaveYtId = isYoutubeVideo ? ('http://'+sitePreviewResult.sitename).match(youtubeIdReg)[3] : null;
        isValidYtVideo = (isYoutubeVideo && isHaveYtId);
        sitePreviewCode = '';
        curserState = (state==0) ? 'cursor:pointer' : '';
        sitePreviewCode +='<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 '+idForPreviewContainer+'" style="padding:0;border-top: 1px solid white;'+curserState+'">';
        sitePreviewCode +='  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 allSidesSoft link-preview-outer-div">';
        if(sitePreviewResult.logo)
        {
          if(state)
          {
            if(sitePreviewResult.db){
              sitePreviewResult.logo = (!base64reg.test(sitePreviewResult.logo)) ? '/Upload/UrlImage/'+sitePreviewResult.logo : sitePreviewResult.logo;
            }
            sitePreviewCode +='   <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 center-all link-preview-image" alt="'+sitePreviewResult.sitename+'" style="background: url('+sitePreviewResult.logo+') no-repeat center,#cdcdcd !important">';
            sitePreviewCode +='       <div class="auto-resize-image-main-div">';
            sitePreviewCode +='         <img src="'+sitePreviewResult.logo+'" class="link-preview-thumb-img" />';
            sitePreviewCode +='       </div>';
            sitePreviewCode +='   </div>';
            sitePreviewCode +='   <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 link-preview-content url-container-body">';
          } else {
              if(sitePreviewResult.db)
              {
                  sitePreviewResult.logo = (!base64reg.test(sitePreviewResult.logo)) ? '/Upload/UrlImage/'+sitePreviewResult.logo : sitePreviewResult.logo;
              }
              linkpreviewCode = isValidYtVideo ? 'link-preview-image-div-added' : '';
              sitePreviewCode += (!isValidYtVideo && (state==0)) ? '<a href="http://'+sitePreviewResult.sitename+'" target="_blank">' : '';
              sitePreviewCode +='   <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 '+linkpreviewCode+' center-all link-preview-image" alt="'+sitePreviewResult.sitename+'" style="background: url('+sitePreviewResult.logo+') no-repeat center,#cdcdcd !important">';
              sitePreviewCode += (isValidYtVideo && (state==0)) ? '<a class="video-btn-onlink-image"><i class="fas fa-play-circle"></i></a>' : '';
              sitePreviewCode +='       <div class="auto-resize-image-main-div">';
              sitePreviewCode +='         <img src="'+sitePreviewResult.logo+'" class="link-preview-thumb-img" />';
              sitePreviewCode +='       </div>';
              sitePreviewCode +='   </div>';
              sitePreviewCode += (!isValidYtVideo && (state==0)) ? '</a>' : '';
              sitePreviewCode +='   <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 link-preview-content url-container-body">';
          }
        }
        if(sitePreviewResult.title)
        {
          var moreDot = '';
          var freeSpace = '';
          if(sitePreviewResult.description)
          {
            moreDot = sitePreviewResult.description.length>160 ? '.....' : '';
          }
          sitePreviewCode +='   <div class="col-sm-12" style="padding:5px 0 0 0;">';
          sitePreviewCode +='     <a class="site-title pc" href="http://'+sitePreviewResult.sitename+'" target="_blank">';
          sitePreviewCode += sitePreviewResult.title.substring(0,160)+moreDot;
          sitePreviewCode +='     </a>';
          sitePreviewCode +='     <a class="site-title mobile" href="http://'+sitePreviewResult.sitename+'" target="_blank">';
          sitePreviewCode += sitePreviewResult.title;
          sitePreviewCode +='     </a>';
          sitePreviewCode +='   </div>';
        }
        if(sitePreviewResult.description)
        {
          moreDot = sitePreviewResult.description>165 ? '......' : '';
          sitePreviewCode +='   <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding:5px 0 5px 0;word-wrap: break-word;">';
          sitePreviewCode +='     <a href="http://'+sitePreviewResult.sitename+'" target="_blank" style="word-wrap: break-word;color:black">';
          sitePreviewCode += sitePreviewResult.description.substring(0,165)+moreDot;
          sitePreviewCode +='     </a>';
          sitePreviewCode +='   </div>';
        }
        sitePreviewCode +='   <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pc" style="padding:5px 0 5px 0;">';
        sitePreviewCode +='     <a class="site-name" href="http://'+sitePreviewResult.sitename+'" target="_blank">';
        sitePreviewCode +=sitePreviewResult.sitename;
        sitePreviewCode +='     </a>';
        sitePreviewCode +='   </div>';

        sitePreviewCode +='   <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mobile" style="padding:5px 0 5px 0;bottom:0">';
        sitePreviewCode +='     <a class="site-name" href="http://'+sitePreviewResult.sitename+'" target="_blank">';
        sitePreviewCode +=sitePreviewResult.sitename;
        sitePreviewCode +='     </a>';
        sitePreviewCode +='   </div>';
        if(!sitePreviewResult.logo && state)
        {
          sitePreviewCode +='<a class="close-site-preview fa fa-window-close" onClick="clearThePreview()"></a>';
        }
        sitePreviewCode +='   </div>';
        sitePreviewCode +='  </div>';
        sitePreviewCode +='</div>';
        return sitePreviewCode;
  }catch(err){
    console.log('error:-',err);
    return '';
  }
}
/*-------------------------------------------------------------------------*/
function getWebsiteDetail(url,divIdLink,container,state,db){
  idForPreviewHtml = divIdLink.replace(/^\./, "").replace(/^\#/, "");
  if(url){
    if(!validR1.test(url)){
      url = 'http://'+url;
    }
    if(container){
      container = '';
    } else {
      container = 'link-preview-container';
    }
    $.ajax({
        'url' : '/community/api/getWebsiteInfo/?url='+url+'&db='+db,
        success: function (response) {
            previewLinkLogo = response.data.logo;
            previewLinkDescription = response.data.description;
            previewLinkTitle = response.data.title;
            if (response.data)
            {
              if(state)
              {
                $('.link-preview-container').remove();
                $('#discussionImageClickBtn').css('display','none');
              }
              sitePreviewResult = response.data;
              sitePreviewResult.sitename = url.replace(/^https?:\/\//,'');
              $(divIdLink).append(createTheSitePreviewHtml(sitePreviewResult,idForPreviewHtml,container,state));
            }
        },
        error: function (err) {
          console.log('searched url may be null or invalid');
        }
    })
  }
}
