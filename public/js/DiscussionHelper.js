function createDiscussionHtml(response,me,id){
  try{
        time1 = new Date();
        time2 = new Date(response.createDate);
        var time = NumberOfDays(time1,time2);
        if(!(valid_time_reg.test(time)))
        {
          time2 = time2.toString();
          time = time2.substring(3,15);
          time = 'on '+time;
        }else{
          time = 'at '+time;
        }

        discussionOwner = me.me==response.UserDetail[0]._id;
        myPowers        = (me.power==0) || (me.power==1);
        dis_id = response._id;
        f_flag = 1;
        f_text = 'Feature';
        g_flag = 1;
        g_text = 'Publish to oneness';
        var PostedByImage = response.UserDetail[0].profilePic;
        var CreatedBy =response.UserDetail[0].fullname;
        var title =response.title;
        if(!title){title = '';}
        var Content =response.details;
        var UserProfilePic =$('.profilePic').attr('src');

        code = '';
        featuredPresence = '';
        if(response.featured)
        {
          featuredPresence = 'featuredContainer';
        }
        code +='  <div class="container discussion-container '+featuredPresence+'" id="'+dis_id+'">';
        code +='  <div class="panel panel-default allSidesSoft" style="background:white;" id="panel-default'+dis_id+'">';
            if(response.featured)
            {
              code += '<span class="badge featured-label" id="featured'+dis_id+'">Featured</span>';
              f_flag = 0;
              f_text = 'Unfeature';
            }
            if(response.global && (discussionOwner || myPowers))
            {
              code += '<span class="badge global-label" id="global'+dis_id+'">Global</span>';
              g_flag = 0;
              g_text = 'Unpublish to oneness';
            }

            if(discussionOwner || myPowers)
            {
                code += '       <div class="dropup">';
                code += '         <a class="discussion-dropdown-menu" data-toggle="dropdown" style="float:right !important">';
                code += '           <i class="fa fa-ellipsis-h"></i>';
                code += '         </a>';
                code += '        <ul class="dropdown-menu dropdown-menu-right dropdown-menu-discussion">';
                code += '           <li><a class="request-dropdown-options" onclick="deleteDiscussion(\''+dis_id+'\')">Delete</a></li>';
                if(myPowers)
                {
                  code += '           <li id="featuredBtnLi'+dis_id+'">';
                  code +='               <a class="request-dropdown-options" onclick="toggleFeature(\''+dis_id+'\','+f_flag+')" id="featuredBtn'+dis_id+'">'+f_text+'</a>';
                  code +='            </li>';
                  code += '           <li id="globalBtnLi'+dis_id+'">';
                  code +='               <a class="request-dropdown-options" onclick="toggleGlobal(\''+dis_id+'\','+g_flag+')" id="globalBtn'+dis_id+'">'+g_text+'</a>';
                  code +='            </li>';
                }
                code += '         </ul>';
                code += '       </div>';
            }

        code +='  <div class="panel-body" style="padding:0;padding-top:10px">';
        code +='    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-title">';
        code +='       <a class="discussion-title" href="/community/selecteddiscussion/'+id+'/'+response._id+'" target="_blank">'+title+'</a>';
        code +='    </div>';
        code +='    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-head">';
        code +='      posted by <a href="/viewprofile/'+response.createdBy+'">'+CreatedBy+'</a> '+time;
        code +='    </div>';
        code +='  </div>';

        /*--------Tag Maker---------*/
        try{
          if(response.tags && response.tags.length)
          {
            code += '   <div class="panel-body" style="padding:0">';
            code += '     <div class="col-sm-12 col-xs-12 tagMainDiv" style="border-top: 1px solid white;padding:0">';
            code += '       <div class="col-sm-12">';
            for(var tagi=0 ; tagi<response.tags.length ; tagi++)
            {
              code += '<span class="tag-still">'+response.tags[tagi]+'</span>';
            }
            code += '       </div>';
            code += '     </div>';
            code += '   </div>';
          }
        } catch(err){ code +=''; }
        /*--------------------------*/

        code +='  <div class="panel-body" style="padding:0;padding-top:10px;">';
        code +='    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-content" style="font-size:16px">';
        code +=      Content;
        code +='    </div>';
        code +='  </div>';

          if(response.externalUrl && response.externalUrl.length)
          {
            code += '       <div class="col-sm-12">';
            code += '          <div id="discussionLinkPreview'+dis_id+'"></div>';
            code += '       </div>';
          }
          if(response.images.length)
          {
            code += '       <div class="col-sm-12">';
            code += '          <div class="discussionImageDiv" id="discussionImageDiv'+dis_id+'">';
            for(var img=0 ; img<response.images.length ; img++){
              code += '<img src="/Upload/DiscussionImages/'+response.images[img]+'" class="allSides show-discussion-image">';
            }
            code += '          </div>';
            code += '       </div>';
          }
      code +='    <div class="panel-body" style="padding:0;padding-top:10px;">';
      code +='      <div class="col-sm-4 col-md-3 col-lg-2 col-xs-8">';
      code +='        <a class="comment-btn-discussion" onclick="showCommentsAction(\''+dis_id+'\',0)" id="showComments'+dis_id+'">';
      code +='          <i class="fa fa-comment-alt"></i> '+response.childCount+' <mobileNone>comments</mobileNone>';
      code +='        </a>';
      code +='<a class="show-comment-btn show-hide-comments comment-btn-discussion" onclick="hideCommentsAction(\''+dis_id+'\')" id="ShowHideComments'+dis_id+'">Hide</a>';
      code +='      </div>';
      code +='    </div>';
      code +='      <br />';
      code += '<ul class="panel-body all-comments-box" id="allCommentsContainer'+dis_id+'">';
      code += '</ul>';
      code +='      <div class="panel-body comment-panel" style="border:0;padding:0">';
      code +='          <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 comment-box comment-compose-div-css" style="border-top: 1px solid #DFDFDF;" id="composeCommentDiv'+dis_id+'">';
      code +='              <div class="col-sm-1 col-md-1 col-xs-2"> <img src="'+UserProfilePic+'" class="discussion-comment-user"> </div>';
      code +='              <div class="col-sm-11 col-md-11 col-xs-10">';
      code +='                  <div class="input-group reply-input">';
      code +='                      <textarea type="text" autocomplete="off" class="form-control input-md comment-textarea" id="textarea'+dis_id+'" placeholder="reply to this discussion..." rows="1" maxlength="1500"></textarea>';
      code +='                      <span class="input-group-btn">';
      code +='                        <button class="btn btn-warning btn-md post-discussion-btn" onclick="postComment(\''+dis_id+'\')">Post</button>';
      code +='                      </span>';
      code +='                    </div>';
      code +='              </div>';
      code +='          </div>';
      code +='      </div>';
      code +='    </div>';
      code +='    </div>';
  }
  catch(err){
    code = '';
  }
  return code;
}

function createParentCommentHtml(response,me,id){
  try{
    discussionOwner = me.me==response.commentByDetails[0]._id;
    dis_id = response._id;
    time1 = new Date();
    time2 = new Date(response.time);
    var time = NumberOfDays(time1,time2);
    code ='<li class="col-sm-12 col-xs-12 comment-li comment-box" id="commentLi'+response._id+'">';
    code +='  <div class="col-sm-1 col-xs-2">';
    code +='    <img src="/Upload/Profile/'+response.commentByDetails[0].profilePic+'" class="comment-by-pic" />';
    code +='  </div>';
    code +='  <div class="col-sm-10 col-xs-10">';
    code +='    <div class="comment-container">';
    code +='      <a href="/viewprofile/'+response.commentByDetails[0]._id+'" class="comment-by-user-name">'+response.commentByDetails[0].fullname+'</a>';
    code +='      <span class="dis-comment-time">'+time+'</span>';
    replyToTxt = (response.commentByDetails[0]._id==me) ? 'this comment...' : response.commentByDetails[0].fullname;
    if((response.commentByDetails[0]._id==me) || (response.discussionDetails[0].createdBy==me))
    {
      if(response.discussionDetails[0].createdBy==me)
      {
        code +='<i class="fa fa-trash commentOptionButton delComOwner" onclick="deleteDisComment(\''+response.discussionId+'\',\''+response._id+'\',\''+response.parent+'\')"></i>';
      } else {
        code +='<i class="fa fa-trash commentOptionButton" onclick="deleteDisComment(\''+response.discussionId+'\',\''+response._id+'\',\''+response.parent+'\')"></i>';
      }
    }
    if(response.childCount)
    {
      code +='<a class="show-reply-btn fa fa-reply commentOptionButton" onclick="ChildReplyInputOrShowReply(\''+response.discussionId+'\',\''+response._id+'\')" id="showChildComments'+response._id+'"> ('+response.childCount+')</a>'
    } else {
      code +='<a class="show-reply-btn fa fa-reply commentOptionButton" onclick="ChildReplyInputOrShowReply(\''+response.discussionId+'\',\''+response._id+'\')" id="showChildComments'+response._id+'"> (0)</a>';
    }
    code +='      <p class="comment-div">';
    code += response.comment;
    code +='      </p>';
    code +='    </div>';
    code +='</div>';

//---------------------------------------------------------------------------------------------------------
    code +='<div class="col-sm-8 col-xs-10 col-sm-push-1 col-xs-push-2" id="child-reply'+response._id+'">';

    //For Child

    code +='</div>';
//-----------------------------------------------------------------------------------------------------

    code +='<div class="col-sm-8 col-xs-8 col-sm-push-2 col-xs-push-3 input-group child-reply-input" id="childReply'+response._id+'">';
    code +='<div class="col-sm-12">';
    code +='<textarea type="text" autocomplete="off" class="form-control input-sm comment-textarea" id="textareaChild'+response._id+'" placeholder="reply to '+replyToTxt+'" maxlength="1500" style="width:100%" /></textarea>';
    code +='</div>';
    code +='<div class="col-sm-12 center-all">';
    code +='    <button class="btn btn-primary btn-sm post-discussion-btn" onclick="postChildComment(\''+response.discussionId+'\',\''+response._id+'\')" style="border-radius:0;margin-top:2px;width:100%">Reply</button>';
    code +='</div>';
    code +='</div>';

    code +='</li>';
  } catch(err){
    code = '';
  }
  return code;
}
function createChildCommentHtml(response,me,id){
  try{
    discussionOwner = me.me==response.commentByDetails[0]._id;
    dis_id = response._id;
    time1 = new Date();
    time2 = new Date(response.time);
    var time = NumberOfDays(time1,time2);

    code ='<li class="col-sm-12 col-xs-12 comment-child-li comment-box child'+response.parent+'" id="commentLi'+response._id+'">';
    code +='  <div class="col-sm-1 col-xs-2">';
    code +='    <img src="/Upload/Profile/'+response.commentByDetails[0].profilePic+'" class="comment-by-pic-child" />';
    code +='  </div>';
    code +='  <div class="col-sm-10 col-xs-10">';
    code +='    <div class="comment-container">';
    code +='      <a href="/viewprofile/'+response.commentByDetails[0]._id+'" class="comment-by-user-name">'+response.commentByDetails[0].fullname+'</a>';
    code +='      <span class="dis-comment-time">'+time+'</span>';
    if((response.commentByDetails[0]._id==me) || (response.discussionDetails[0].createdBy==me))
    {
      if(response.discussionDetails[0].createdBy==me)
      {
        code +='<i class="fa fa-trash commentOptionButton delComOwner" onclick="deleteDisComment(\''+response.discussionId+'\',\''+response._id+'\',\''+response.parent+'\')"></i>';
      } else {
        code +='<i class="fa fa-trash commentOptionButton" onclick="deleteDisComment(\''+response.discussionId+'\',\''+response._id+'\',\''+response.parent+'\')"></i>';
      }
    }
    code +='      <p class="comment-div-child">';
    code += response.comment;
    code +='      </p>';
    code +='    </div>';
    code +='  </div>';
    code +='</li>';
  } catch(err) {
    code ='';
  }
  return code;
}


function createGlobalDiscussionForNonUser(response,me,id){
  try{
        myPowers  = (me.power==0) || (me.power==1);
        isUser = (me.power==2);
        time1 = new Date();
        time2 = new Date(response.createDate);
        dis_id = response._id;
        var PostedByImage = response.UserDetail[0].profilePic;
        var CreatedBy =response.UserDetail[0].fullname;
        var title =response.title;
        var Content =response.details;
        var time = NumberOfDays(time1,time2);
        if(!(valid_time_reg.test(time)))
        {
          time2 = time2.toString();
          time = time2.substring(3,15);
          time = 'on '+time;
        }else{
          time = 'at '+time;
        }
        code = '';
        code += '<div class="container discussion-container" style="width:100%;padding:0">';
        code += ' <div class="panel panel-default discussion-body-main allSides">';

        code +='  <div class="panel-body" style="padding:0;padding-top:10px">';
        code +='    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-title">';
        if(isUser || myPowers)
        {
          code +='       <a class="discussion-title" href="/community/selecteddiscussion/'+id+'/'+response._id+'" target="_blank">'+title+'</a>';
        } else {
          code +='       <p class="discussion-title" style="margin:0">'+title+'</p>';
        }
        code +='    </div>';
        code +='    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-head">';
        code +='      posted by <a href="/viewprofile/'+response.createdBy+'">'+CreatedBy+'</a> '+time;
        code +='    </div>';
        code +='  </div>';

        /*--------Tag Maker---------*/
        try{
          if(response.tags && response.tags.length)
          {
            code += '   <div class="panel-body" style="padding:0">';
            code += '     <div class="col-sm-12 col-xs-12 tagMainDiv" style="border-top: 1px solid white;padding:0">';
            code += '       <div class="col-sm-12">';
            for(var tagi=0 ; tagi<response.tags.length ; tagi++)
            {
              code += '<span class="tag-still">'+response.tags[tagi]+'</span>';
            }
            code += '       </div>';
            code += '     </div>';
            code += '   </div>';
          }
        } catch(err){ code +=''; }
        /*--------------------------*/

        code +='  <div class="panel-body" style="padding:0;padding-top:10px;">';
        code +='    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-content" style="font-size:16px">';
        code +=      Content;
        code +='    </div>';
        code +='  </div>';

        if(response.externalUrl && response.externalUrl.length)
        {
          code += '       <div class="col-sm-12">';
          code += '          <div id="discussionLinkPreview'+dis_id+'"></div>';
          code += '       </div>';
        }

        if(response.images.length)
        {
          code += '       <div class="col-sm-12">';
          code += '          <div class="discussionImageDiv" id="discussionImageDiv'+dis_id+'">';
          for(img=0;img<response.images.length;img++){
            code += '<img src="/Upload/DiscussionImages/'+response.images[img]+'" class="allSides show-discussion-image">';
          }
          code += '          </div>';
          code += '       </div>';
        }
        code +='    <div class="panel-body" style="padding:10px 0 15px 0">';
        code +='      <div class="col-sm-4 col-md-3 col-lg-2 col-xs-8">';
        code +='        <a class="comment-btn-discussion" onclick="showCommentsAction(\''+dis_id+'\',1)" id="showComments'+dis_id+'">';
        code +='          <i class="fa fa-comment-alt"></i> '+response.childCount+' <mobileNone>comments</mobileNone>';
        code +='        </a>';
        code +='      </div>';
        code +='    </div>';
        code += '<ul class="panel-body all-comments-box" id="allCommentsContainer'+dis_id+'">';
        code += '</ul>';
        code += ' </div>';
        code += '</div>';
  }
  catch(err){
    code = '';
  }
  return code;
}
