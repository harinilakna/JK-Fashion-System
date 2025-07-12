const submitUserSetting = () =>{

    let updateServiceResponses =  ajaxRequestBody("/changeuser", "PUT", employe, logedUser);

    if (updateServicesResponces == 'OK'){
        alert('User Profile Change Sucessfuly...! \n');
        winow.location.assign("/logout");
    }else{
        alert('User profile! have some errors \n' + updateServiceResponses);
    }
}


const refreshProfileEditForm =() =>{

    logedUser = ajaxGetRequest("/loggedUser");

    textUserName.value= logedUser.username;
    textEmail.value = logedUser.email;

    if(user.note != null)
        textNote.value =user.note;else textNote.value = "";

    
    if(logedUser.status){
        chkUserStatus.checked = true;
        chkLblUserStatus.innerText = 'User account is Active';
    }else{
        chkUserStatus.checked = false;
        chkLblUserStatus.innerText = 'User account is Not-Active' ;
    }


     // refill image
     if(logedUser.photo == null){
        imgUserphoto.src = "resource/images/profile image.png";
        textUserphoto.value = "";
      }else{
        imgUserphoto.src = atob(logedUser.photo);
        textUserphoto.value = logedUser.photopath;
      }
     
      if(age > 18){

        textage.required = true;
        divSample.style.display 
        "block";
      }else{
        divSample.style.display ="block";

      }

}


