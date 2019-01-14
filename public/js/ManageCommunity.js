var id  = location.pathname.split('/')[3];
var userInfoForMessage = {};
$('.manageCommunity-child-btn').click(function(e){
    $(".manageCommunity-child-btn").removeClass("manageCommunity-btn-active");
    $(e.target).addClass("manageCommunity-btn-active");
});

UserList(); // initialize
//-----------------------------------------------------------------------------------------------------
function Requests(UserMode)
{
    if(UserMode){modeName='Invited';emptymsg='There are no any invitation pending';} else {modeName='Request';emptymsg='There are no any request';}
    $.ajax({
           type: 'POST',
           contentType: 'application/json',
           data: JSON.stringify({mode:UserMode}),
           url: '/community/requestedUsers/'+id,
           success: function (response) {
              var power = (response[response.length-1].power==0);
              flag=0;
              $('.allcoms').remove();
              $('.inviteBtn').remove();
              if(response.length==1){
                  $('#comlist').append("\
                  <div class='col-sm-12 allcoms well well-sm' style='margin-top:5px;font-weight:bold'>\
                  <center>"+emptymsg+"</center>\
                  </div>\
                  ");
               } else {
                     $('.allcoms').remove();
                     for(i=0;i<response.length-1;i++)
                     {
                       try {
                             fullname = response[i].RequestedUser[0].fullname;
                             uid      = response[i].RequestedUser[0]._id;
                             code="<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
                             code +="<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
                             code +="<a href='/viewprofile/"+response[i].RequestedUser[0]._id+"'><img src='/Upload/Profile/"+response[i].RequestedUser[0].profilePic+"' class='community-member-pic'>";
                             code +="</a></div>";
                             code +="<div class='col-sm-8 col-xs-6 scrollable'>";
                             code +="<a class='comusername' href='/viewprofile/"+response[i].RequestedUser[0]._id+"'>"+response[i].RequestedUser[0].fullname+"</a>";
                             code +="</div>";
                             code +="<div class='col-sm-2 col-xs-3'>";
                             if(response[i].requestedUsers.mode)
                             {
                               code +="<a class='community-user-short-btn' onclick='cancelInvitation(\""+response[i].RequestedUser[0]._id+"\",\""+response[i].RequestedUser[0].username+"\")' style='float:right'>";
                               code +="<i class='fa fa-times'></i></a>";
                             } else{
                               code +="<div class='dropdown'>";
                               code +="<div class='dropup request-btn-dropdown'><button class='btn btn-default dropdown-toggle' type='button' data-toggle='dropdown' style='float:right !important'>Option";
                               code +="</button>";
                               code +=" <ul class='dropdown-menu dropdown-menu-right'>";
                                   code +="<li><a class='request-dropdown-options' onclick='acceptRequest(\""+response[i].RequestedUser[0]._id+"\")'>";
                                   code +="Accept</a></li>";
                                   code +="<li><a class='request-dropdown-options' onclick='rejectRequest(\""+response[i].RequestedUser[0]._id+"\")'>";
                                   code +="Reject</a></li>";
                                   // code +="<li><a class='request-dropdown-options' onclick='rejectRequestWithMsg(\""+uid+"\",\""+fullname+"\")'>";
                                   // code +="Reject With Message</a></li>";
                               code +="</ul>";
                               code +="</div></div>";
                             }

                             code +="</div>";
                             code +="</div>";
                           }
                           catch(err) {
                             console.log(err);
                             code ='';
                           }
                           $('#comlist').append(code);
                     }
                     if(UserMode)
                     {
                       updateCountOnBtn('#invitedUserShowBtn','Invited Users',3,response.length-1);
                     }else{
                       updateCountOnBtn('#requestedUserShowBtn','Requests',3,response.length-1);
                     }
                }
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
           }
       });
}
function updateCountOnBtn(elmId,btntxt,flag,newUpdate){
  var btnTxt= $(elmId).text();
  btnNumCount = parseInt(btnTxt.match(/\d+/g)[0]);
  if(flag==0)
  {
    $(elmId).empty().append(btntxt+' ('+(btnNumCount-1)+')');
  }else if(flag==1){
    $(elmId).empty().append(btntxt+' ('+(btnNumCount+1)+')');
  } else if(flag==3){
    $(elmId).empty().append(btntxt+' ('+(newUpdate)+')');
  }
}
//-------------------------------------------------------------------------------------------------
function acceptRequest(user)
{
  $.ajax({
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({com:id,user:user}),
         url: '/community/acceptRequest/'+id,
         success: function (response) {

           updateCountOnBtn('#requestedUserShowBtn','Requests',0,1);
           updateCountOnBtn('#UsersShowBtn','Users',1,1);

           Requests();
         },
         error: function (err) {
             notie.alert({type: 3, text:'Something went wrong!', time: 2})
         }
     });
}
function rejectRequest(user)
{
      $.confirm({
       title: 'Reject Request !',
       content: 'Do you really want reject this user request?',
       buttons: {
          'Yes': {
              btnClass: 'btn-success',
              action: function(){
                  $.ajax({
                         type: 'POST',
                         contentType: 'application/json',
                         data: JSON.stringify({com:id,user:user}),
                         url: '/community/rejectRequest/'+id,
                         success: function (response) {
                           updateCountOnBtn('#requestedUserShowBtn','Requests',0,1);
                           Requests();
                         },
                         error: function (err) {
                             notie.alert({type: 3, text:'Something went wrong!', time: 2})
                         }
                     });
               }
             },
             'No': {btnClass: 'btn-danger',}
      }
     });
}
/*=======================Reject With Message==================================*/
// TODO: /*Will be in second version*/
function rejectRequestWithMsg(userId,fullname){
  userInfoForMessage.id = userId;
  userInfoForMessage.fullname = fullname;
  $('#fullNameMessagePop').text(fullname);
  $('#popUpManageCommunityMessage').modal('toggle');
  $('#popUpManageCommunityMessage').modal('show');
}
$('#sendButtonPop').click(()=>{
  if($('#messageBoxPop').val().trim().length != 0){
    var data = {};
    data.user2 = userInfoForMessage.id;
    data.messages = $('#messageBoxPop').val();
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/message/sendbyid',
        success: function (response) {
          //this is for reject after message sent
          $.ajax({
                 type: 'POST',
                 contentType: 'application/json',
                 data: JSON.stringify({com:id,user:userInfoForMessage.id}),
                 url: '/community/rejectRequest/'+id,
                 success: function (response) {
                   $('#popUpManageCommunityMessage').modal('toggle');
                   Requests(0);
                 },
                 error: function (err) {
                     notie.alert({type: 3, text:'Something went wrong!', time: 2})
                 }
             });
        },
        error: function (response) {
            notie.alert({type: 3, text: 'Something went wrong!', time: 2})
        }
    });
  }
});
/*============================================================================*/
function cancelInvitation(user,email)
{
    $.confirm({
     title: 'Cancel Invitation',
     content: 'Do you really want cancel invitation ?',
     buttons: {
        'Yes': {
            btnClass: 'btn-success',
            action: function(){
                $.ajax({
                       type: 'POST',
                       contentType: 'application/json',
                       data: JSON.stringify({com:id,user:user}),
                       url: '/community/cancelInvitation/'+id,
                       success: function (response) {
                         notie.alert({type: 1, text:'Invitation to '+email+' Canceled', time: 2})
                         updateCountOnBtn('#invitedUserShowBtn','Invited Users',0,1);
                         Requests(1);
                       },
                       error: function (err) {
                           notie.alert({type: 3, text:'Something went wrong!', time: 2})
                       }
                   });
             }
           },
           'No': {btnClass: 'btn-danger',}
      }
   });
}
//----------------------------------------------------------------------------
function UserList()
{
  $.ajax({
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({_id:id}),
         url: '/community/allcomusers/'+id,
         success: function (response) {
           var power = (response[response.length-1].power==0);
           $('.inviteBtn').remove();
           $('.allcoms').remove();
           if(response.length==1)
           {
                 $('#comlist').append("\
                 <div class='col-sm-12 allcoms well well-sm' style='margin-top:5px;font-weight:bold' id=''>\
                 <center>No any user</center>\
                 </div>\
                 ");
           } else {
                 for(i=0;i<response.length-1;i++)
                 {
                     var code = createUserAdminProfileDivForManageCommunity(response[i].AllUsers[0],power,2);
                     $('#comlist').append(code);
                 }
            }
            updateCountOnBtn('#UsersShowBtn','Users',3,response.length-1);
         },
         error: function (err) {
             notie.alert({type: 3, text:'Something went wrong!', time: 2})
         }
     });
}
//----------------------------------------------------------------------------
function AdminList()
{
  $.ajax({
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({_id:id}),
         url: '/community/allcomadmins/'+id,
         success: function (response) {
           var power = (response[response.length-1].power==0);
           if(response.length==1)
           {
               /* do stuff if no admin found if required */
           } else {
               for(i=0;i<response.length-1;i++)
               {
                 var code = createUserAdminProfileDivForManageCommunity(response[i].AllAdmins[0],power,1);
                 $('#comlist').append(code);
               }
               updateCountOnBtn('#AdminsShowBtn','Admins',3,response.length-1);
           }
         },
         error: function (err) {
             notie.alert({type: 3, text:'Something went wrong!', time: 2})
         }
     });
}

//---------------------------OwnerInfo----------------------------------------
function AllAdmins()
{
  $.ajax({
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({_id:id}),
         url: '/community/communityOwner/'+id,
         success: function (response) {
           $('.inviteBtn').remove();
           $('.allcoms').remove();

           if(response.length==0)
           {
                 $('#comlist').append("\
                 <div class='col-sm-12 allcoms well well-sm' style='margin-top:5px;font-weight:bold'>\
                 <center>Something Went Worng No Owner Info</center>\
                 </div>\
                 ");
           } else {
               var code = createUserAdminProfileDivForManageCommunity(response[0],null,0);
               $('#comlist').append(code);
               AdminList();
           }
         },
         error: function (err) {
             notie.alert({type: 3, text:'Something went wrong!', time: 2})
         }
     });
}
//--------------------------------------------Remove User-------------------------------------------------------------------
function removeUser(user,status){
    $.confirm({
     title: 'Really want remove ?',
     content: 'Do you really want remove this user?',
     buttons: {
        'Yes': {
            btnClass: 'btn-success',
            action: function(){
              $.ajax({
                  type: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify({com:id,user:user}),
                  url: '/community/removeUser/'+id,
                  success: function (response) {
                    if(status) {
                      updateCountOnBtn('#UsersShowBtn','Users',0,1);
                      UserList();
                    } else {
                      updateCountOnBtn('#AdminsShowBtn','Admins',0,1);
                      AllAdmins();
                    }
                  },
                  error: function (err) {
                      notie.alert({type: 3, text:'Something went wrong!', time: 2})
                  }
              });
             }
           },
           'No': {btnClass: 'btn-danger',}
    }
   });
}
//--------------------------------------------Promote/Demote-------------------------------------------------------------------
function update(user,mode){
    mode==1 ? con = 'promote' : con = 'demote';
    $.confirm({
     title: 'Confirm '+con+'!',
     content: 'Do you really want '+con+' this user?',
     buttons: {
        'Yes': {
            btnClass: 'btn-success',
            action: function(){
              $.ajax({
                  type: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify({com:id,user:user,mode:mode}),
                  url: '/community/communityUserRole/'+id,
                  success: function (response) {
                    if(mode)
                    {
                      updateCountOnBtn('#UsersShowBtn','Users',0,1);
                      updateCountOnBtn('#AdminsShowBtn','Admins',1,1);
                    }else{
                      updateCountOnBtn('#UsersShowBtn','Users',1,1);
                      updateCountOnBtn('#AdminsShowBtn','Admins',0,1);
                    }
                    mode == 1 ? UserList() : AllAdmins();
                  },
                  error: function (err) {
                      notie.alert({type: 3, text:'Something went wrong!', time: 2})
                  }
              });
             }
           },
           'No': {btnClass: 'btn-danger',}
    }
   });
}
