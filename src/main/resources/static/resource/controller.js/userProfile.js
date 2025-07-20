window.onload = () => {

    console.log('on load');

    $('[data-bs-toggle="tooltip"]').tooltip();

    //call form refresh function
    refreshProfileEditForm();

    
    let loggedUser = {}; 


}



// const submitUserSetting = () => {
//     // Set employee_id wrapper if not present
//     if (logedUser.employee_id === undefined || logedUser.employee_id === null) {
//         logedUser.employee_id = {};
//     }

//     // Set just the ID (grab it from hidden field or keep it from original load)
//     logedUser.employee_id.id = logedUser.employee_id?.id || logedUser.id; // fallback if needed

//     // Also update with form values
//     logedUser.username = textUserName.value;
//     logedUser.email = textEmail.value;
//     logedUser.note = textNote.value;

//     // logedUser.password is already set via passwordRTValidator()

//     let updateServiceResponses = ajaxRequestBody("/changeuser", "PUT", logedUser);

//     if (updateServiceResponses === 'OK') {
//         alert('User Profile Changed Successfully!');
//         window.location.assign("/logout");
//     } else {
//         alert('User profile has errors:\n' + updateServiceResponses);
//     }
// };



// const refreshProfileEditForm =() =>{

//     logedUser = ajaxGetRequest("/loggedUser");
    

//     textUserName.value= logedUser.username;
//     textEmail.value = logedUser.email;
//     textPassword.value= logedUser.password;


//     if(logedUser.note != null)
//         textNote.value =logedUser.note;else textNote.value = "";


//      // refill image
//      if(logedUser.photo == null){
//         imgUserphoto.src = "resource/images/profile_image.png";
//         textUserphoto.value = "";
//       }else{
//         imgUserphoto.src = atob(logedUser.photo);
//         textUserphoto.value = logedUser.photopath;
//       }
     
//     //   if(age > 18){

//     //     textage.required = true;
//     //    divSample.style.display = "block";
//     //   }else{
//     //     divSample.style.display ="block";

//     //   }

//      // if(logedUser.status){
//     //     chkUserStatus.checked = true;
//     //     chkLblUserStatus.innerText = 'User account is Active';
//     // }else{
//     //     chkUserStatus.checked = false;
//     //     chkLblUserStatus.innerText = 'User account is Not-Active' ;
//     // }

// }

const refreshProfileEditForm = () => {
    loggedUser = ajaxGetRequest("/loggedUser");

    textUserName.value = loggedUser.username;
    textEmail.value = loggedUser.email;

    //for image
    if(loggedUser.photo == null){
        imgUserphoto.src = "resource/images/profile_image.png";
        textUserphoto.value = "";
      }else{
        imgUserphoto.src = atob(loggedUser.photo);
        textUserphoto.value = loggedUser.photopath;
      }
}

//define function for check user form error
const checkUserChangeFormError = () => {
    let errors = "";

    if (textPassword.value != textRTPassword.value) {
        if (loggedUser.password == null) {
            errors = errors + "Please Enter Password \n"
        }
        if (txtRetypePassword.value == "") {
            errors = errors + "Retype Password \n"
        }
    }

    return errors;
}

//Function to submit user settings

const submitUserSetting = () => {

    let errors = checkUserChangeFormError();

    if (errors == "") {
        //get user confirmation
        let userConfirm = confirm("Are you sure you want to make the changes? \n");

        if (userConfirm) {
            // call post service
            let putServiceResponse = ajaxRequestBody("/changeuser", "PUT", loggedUser);
            if (putServiceResponse == "OK") {
                alert("Profile updated Successfully");
                window.location.assign("/logout"); //successfully change unama logout krnwa
            } else {
                alert("Failed to update changes\n" + putServiceResponse);
            }
        }
    } else {
        alert("Form has following errors\n" + errors);
    }


}

//define function for password retype
const passwordRTValidator = () =>{

    if(textPassword.value != ""){
        if(textPassword.value == textRTPassword.value){
            textPassword.style.border ="2px solid green";
            textRTPassword.style.border ="2px solid green";
            loggedUser.password = textPassword.value;
        }else{
            textPassword.style.border ="2px solid red";
            textRTPassword.style.border ="2px solid red";
            loggedUser.password =null;
        }
    }else{
        alert("Please fill password field");
        textPassword.style.border ="2px solid red";
        textRTPassword.style.border ="2px solid red";
        loggedUser.password =null;
    }



}

