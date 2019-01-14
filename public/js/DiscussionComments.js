var commentSkip = 0;
var ChildCommentSkip = 0;
var commentLimit = 5;
var ChildCommentLimit = 3;
var commentCount;
var childCommentCount;
var historyClickedParent={};
var commentGettingOnce = false; // TODO: change will done latter
historyClickedParent.commentParent = null;
historyClickedParent.count = null;
var open = false;

var tempDiscussionId,tempCommentParent='0'; //its for reset commentSkip & ChildCommentSkip

var id  = location.pathname.split('/')[3];
var this_page_link  = location.pathname.split('/')[2];
var did = location.pathname.split('/')[4]; //(Discussion Id from link)
function postComment(discussionId,parent){
  var comment = $('#textarea'+discussionId).val().trim();
  if(!parent)
  {
    parent = discussionId;
  }
  if(comment.length){
    var data = {};
    data.community = id;
    data.disId = discussionId;
    data.parentId = parent;
    data.comment = comment;
    $.ajax({
           type: 'POST',
           contentType: 'application/json',
           data: JSON.stringify(data),
           url: '/community/commentdiscussion/'+id,
           success: function (response) {
             me = response[response.length-1];
             if(response.length>1)
             {
               commentSkip += 1;
               //--------------------------------------------------------------
               var tempbtnText = $('#showComments'+discussionId).text();
               tempCommentCountOnPost = parseInt(tempbtnText.match(/\d+/g)[0])+1;
               tempcommentLeftText = $('#showComments'+discussionId).html().replace(/\d+/g, tempCommentCountOnPost);
               $('#showComments'+discussionId).html(tempcommentLeftText);
               //--------------------------------------------------------------
               $('#ShowHideComments'+discussionId).css('visibility','visible');
               $('#textarea'+discussionId).val('');
               $('#allCommentsContainer'+discussionId).css('display','block');
               $('#allCommentsContainer'+discussionId).append(createParentCommentHtml(response[0],me,id));
             }
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
           }
       });
  }
}
function getComments(discussionId,parent,user_flag){
  if(!parent)
  {
    parent = discussionId;
  }
  var data = {};
  data.community = id;
  data.disId = discussionId;
  data.parentId = parent;
  data.limit = 9999999;
  data.skip = 0;
  if(user_flag)
  {
    var comment_url = 'getcommentsdiscussionnonuser';
  }else{
    var comment_url = 'getcommentsdiscussion';
  }
  $.ajax({
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(data),
         url: '/community/'+comment_url+'/'+id,
         success: function (response) {
           // commentSkip += response.length-1;
           // commentsLeft = commentCount-(response.length-1);
           // commentLeftText = $('#showComments'+discussionId).text().replace(/\d+/g, commentsLeft);
           // $('#showComments'+discussionId).text(commentLeftText);
           me = response[response.length-1];
           if(response.length>1)
           {
             $('#allCommentsContainer'+discussionId).css('display','block');
             $('#ShowHideComments'+discussionId).css('visibility','visible');
           }
           for(i=0;i<response.length-1;i++)
           {
             $('#allCommentsContainer'+discussionId).prepend(createParentCommentHtml(response[i],me,id));
           }
         },
         error: function (err) {
             notie.alert({type: 3, text:'Something went wrong!', time: 2})
         }
     });
}
function showCommentsAction(discussionId,user_flag) // it will use to show comments
{
  $("#composeCommentDiv"+discussionId).css('display','inline');
  var btnText = $('#showComments'+discussionId).text();
  commentCount = parseInt(btnText.match(/\d+/g)[0]);
  if(tempDiscussionId!=discussionId)
  {
    if(commentCount)
    {
      commentSkip = 0;
      tempDiscussionId = discussionId;
      $('.comment-li').remove();
      $('.all-comments-box').css('display','none');
      $('.show-hide-comments').css('visibility','hidden');
      commentGettingOnce = false;
    }
  }
  if((user_flag==0)||(user_flag && (commentCount != 0)))
  {
    if(!commentGettingOnce)
    {
      getComments(discussionId,null,user_flag);
    }
    if(!commentGettingOnce)
    {
      commentGettingOnce = true;
    }
  }
}

function hideCommentsAction(discussionId){
  ShowHideBtnText = $('#ShowHideComments'+discussionId).text();
  if(ShowHideBtnText=='Hide')
  {
    $('#allCommentsContainer'+discussionId).css('display','none');
    $('#ShowHideComments'+discussionId).text('Show');
  } else {
    $('#allCommentsContainer'+discussionId).css('display','block');
    $('#ShowHideComments'+discussionId).text('Hide');
  }
}

function deleteDisComment(discussionId,commentId,parent)
{
  $.confirm({
     title: 'Confirm Logout!',
     content: 'Do you really want delete this comment?',
     buttons: {
        'Yes': {
            btnClass: 'btn-success',
            action: function(){
              //---------------------------
              var data = {};
              data.commentId =  commentId;
              data.discussionId = discussionId;
              data.parentId = parent;
              $.ajax({
                     type: 'POST',
                     contentType: 'application/json',
                     data: JSON.stringify(data),
                     url: '/community/deletediscussioncomment/'+id,
                     success: function (response) {
                        commentSkip = commentSkip-1;
                        if(discussionId==parent)
                        {
                          var btnTxt= $('#showComments'+discussionId).html();
                          btnNumCount = parseInt(btnTxt.match(/\d+/g)[0]);
                          if(btnNumCount)
                          {
                            btnTxt=btnTxt.replace(/\d+/g,btnNumCount-1);
                          }
                        }
                        $('#showComments'+discussionId).html(btnTxt);
                        $('#commentLi'+commentId).css('display','none');
                        notie.alert({type: 1, text:'Comment Successfully deleted', time: 2})
                     },
                     error: function (err) {
                         notie.alert({type: 3, text:'Something went wrong!', time: 2})
                     }
                 });
                 //---------------------------
             }
           },
           'No': {btnClass: 'btn-danger',}
    }
   });
}




function getChildComments(discussionId,parent)
{
  if(!parent)
  {
    parent = discussionId;
  }
  var totalLeftComment = $('#showChildComments'+parent).text();
  leftComments = parseInt(totalLeftComment.match(/\d+/g)[0]);

  var data = {};
  data.community = id;
  data.disId = discussionId;
  data.parentId = parent;
  if(leftComments<=3)
  {
    data.limit = leftComments;
  } else {
    data.limit = ChildCommentLimit;
  }
  data.skip = ChildCommentSkip;
  if(this_page_link == 'communityprofile')
  {
    var comment_url = 'getcommentsdiscussionnonuser';
  }else{
    var comment_url = 'getcommentsdiscussion';
  }
  $.ajax({
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(data),
         url: '/community/'+comment_url+'/'+id,
         success: function (response) {
           $('.comment-child-li').not('.child'+parent).each(function(){
                $(this).remove();
           });
           ChildCommentSkip += response.length-1;
           childCommentsLeft = childCommentCount-(response.length-1);
           commentLeftText = $('#showChildComments'+parent).text().replace(/\d+/g, childCommentsLeft);
           $('#showChildComments'+parent).text(commentLeftText);
           me = response[response.length-1];
           for(i=0;i<response.length-1;i++)
           {
             $('#child-reply'+parent).prepend(createChildCommentHtml(response[i],me,id));
           }
         },
         error: function (err) {
             notie.alert({type: 3, text:'Something went wrong!', time: 2})
         }
     });
}
// function ChildReplyInputOrShowReply(discussionId,parent){
//   $('.child-reply-input').css('display','none');
//   $('#childReply'+parent).css('display','table');

//   var btnText = $('#showChildComments'+parent).text();
  // childCommentCount = parseInt(btnText.match(/\d+/g)[0]);
  // if(tempCommentParent!=parent)
  // {
  //   if(childCommentCount)
  //   {
  //     ChildCommentSkip = 0;
  //     tempCommentParent = parent;
  //   }
  //   if(historyClickedParent.commentParent)
  //   {
  //     commentLeftText = $('#showChildComments'+parent).text().replace(/\d+/g, historyClickedParent.count);
  //     $('#showChildComments'+historyClickedParent.commentParent).text(commentLeftText);
  //   }
  //   historyClickedParent.commentParent = parent;
  //   historyClickedParent.count = childCommentCount;
  // }
  // if(childCommentCount)
  // {
  //   getChildComments(discussionId,parent);
  // }
}

function postChildComment(discussionId,parent){
  // ChildBtnText = $('#showChildComments'+parent).text();
  // currentChildCount = parseInt(ChildBtnText.match(/\d+/g)[0]);
  // lastClickedChild = '#showChildComments'+parent;
  var comment = $('#textareaChild'+parent).val();
  if(!parent)
  {
    parent = id;
  }
  if(comment.length){
    var data = {};
    data.community = id;
    data.disId = discussionId;
    data.parentId = parent;
    data.comment = comment;
    $.ajax({
           type: 'POST',
           contentType: 'application/json',
           data: JSON.stringify(data),
           url: '/community/commentdiscussion/'+id,
           success: function (response) {
             me = response[response.length-1];
             if(response.length>1)
             {
               //--------------------------------------------------------------
               //$('#ShowHideChildComments'+parent).css('visibility','visible');
               $('#textareaChild'+parent).val('');
               $('#child-reply'+parent).append(createChildCommentHtml(response[0],me,id));
             }
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
           }
       });
  }
}
/*-------------------------------For Selected Discussion---------------------------------*/
/*--By default all parent comments will open in this part--*/
function initSelectedDiscussion(){
  // $('#showComments'+did).css('display','none');
  commentLimit = 999999;
  commentSkip = 0;
  showCommentsAction(did);
}
