//---commuity profile page------------------------------------------------------------------
var TotalUserCountForProfilePage = 1;
//------------------------------------------------------------------------------------------
/* createadmindetaildivCommunityProfile function return html of admin and owner and fill
* admin list and user small list(for joined user)
* flag(1) specify user is already part of community that mean show the short users detail div
* on community profile page and flag(0) mean user not part of community (user->who called this function)
*/
function createadmindetaildivCommunityProfile(response,flag){
  var code;
  try{
    code = '<div class="col-sm-12 col-md-12 col-lg-12 adminInfo">';
    code +='  <div class="col-sm-6 col-md-6 col-lg-4 col-xs-4 center-all">';
    code +='      <a href="/viewprofile/'+response._id+'"><img src="/Upload/Profile/'+response.profilePic+'" class="adminPic allSides" /></a>';
    code +='  </div>';
    code +='<div  class="col-sm-6 col-md-6 col-lg-8 col-xs-8 adminContent" style="padding:0">';
    code +='  <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12" style="padding:0">';
    if(flag)
    {
      //----------for joined user also to show small member list----------------
      if(vali.existDecument($('#membersDiv-4joinedUser')) && TotalUserCountForProfilePage<4)
      {
      var pcode = '<div class="col-sm-6 col-xs-3 col-md-3 col-lg-3 center-all" style="padding:0;">';
          pcode += '  <a href="/viewprofile/'+response._id+'" class="communityProfileUserImage">';
          pcode += '    <img class="communityProfileUserImage allSidesSoft" src="/Upload/Profile/'+response.profilePic+'" />';
          pcode += '  </a>';
          pcode += '</div>';
          $('#membersDiv-4joinedUser').append(pcode);
          TotalUserCountForProfilePage ++;
      }
      //------------------------------------------------------------------------
      code +='    <span class="label label-warning" style="margin-top:10px;">Admin</span>';
    }else{
      code +='    <span class="label label-success" style="margin-top:10px;">Owner</span>';
    }
    code +='  </div>';
    code +='   <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12" style="overflow:scroll;padding:0;">';
    code +='     <a href="/viewprofile/'+response._id+'">'+response.fullname+'</a>';
    code +='   </div>';
    code +='</div>';
    code +='</div>';
  }catch(err){code = ''};
  return code;
}

//---manage commuity page-------------------------------------------------------------------
//------------------------------------------------------------------------------------------
/* createUserAdminProfileDivForManageCommunity function create html for manage community users
* this function can called by community owner and community admin
* In this function flag(0) for owner, flag(1) for admin and flag(2)
* the variable power specify the power of user who call this function i.e. position in commuity
*/
function createUserAdminProfileDivForManageCommunity(response,power,flag){
  var code;
  code="<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
  code +="<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
  code +="<a href='/viewprofile/"+response._id+"'><img src='/Upload/Profile/"+response.profilePic+"' class='community-member-pic'>";
  code +="</a></div>";
  code +="<div class='col-sm-8 col-xs-6 scrollable'>";
  code +="<a class='comusername' href='/viewprofile/"+response._id+"'>"+response.fullname+"</a>";
  code +="</div>";
  code +="<div class='col-sm-2 col-xs-3'>";
  if(power)
  {
    if(flag==1)
    {
      code +="<a class='community-user-short-btn' onclick='update(\""+response._id+"\",0)' style='float:left'>"
      code +="<i class='fa fa-chevron-down'></i>";
      code +="</a>";
      code +="<a class='community-user-short-btn' style='float:right' onclick='removeUser(\""+response._id+"\",0)'>";
      code +="<i class='fa fa-times'></i></a>";
    }else if(flag==2){
      code +="<a class='community-user-short-btn' onclick='update(\""+response._id+"\",1)' style='float:left'>"
      code +="<i class='fa fa-chevron-up'></i>";
      code +="</a>";
    }
  }else{
    if(flag==1){
      code +="<span class='label label-warning' style='margin-top:25px;float:right'>Admin</span>";
    }
  }
  if(flag==0){
    code +="<span class='label label-success' style='margin-top:25px;float:right'>Owner</span>";
  }
  if(flag==2){
    code +="<a class='community-user-short-btn' style='float:right' onclick='removeUser(\""+response._id+"\",1)'>";
    code +="<i class='fa fa-times'></i></a>";
  }
  code +="</div>";
  code +="</div>";
  return code;
}
