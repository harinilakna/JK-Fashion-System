//browswer onload even
window.onload = () => {

    console.log('on load');

    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/user_and_privilege");
    console.log(userPrivilege);

    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshUserTable();

    //call form refresh function
    refreshUserForm();

    // set auto binding
    user.status = true;
}

//Create function refresh table
const refreshUserTable = () =>{

    const users = ajaxGetRequest("/user/findall");

    //column count = object count
    //string- number/string/date
    //function- object/array/boolean
    const displayProprtyList = [
     {property: getEmployee, datatype:'function'},
     {property:'username', datatype:'string'},
     {property:'photo', datatype:'photoarray'},
     {property:'email', datatype:'string'},
     {property: getRole, datatype:'function'},
     {property:getUserStatus, datatype:'function'},

    ];

    //call fill Data into table
    //(tableid, dataList, propertyList)
    fillDataIntoTable(tableUser , users , displayProprtyList, userformRefill , userDelete, userPrint, true,userPrivilege);

 
    

        users.forEach((element, index) => {
            if(element.status == false){
              
                tableUser.children[1].children[index].children[7].children[1].disabled = true; //you can also use disabled
                
            }
           
        });

      //calljQuery data table
    
 
    $('#tableUser').DataTable({
        retrieve: true,
    responsive: true,
    scrollX: true,
    scrollY: '300px'
    });



 }

 
 const getEmployee = (ob) =>{
      return ob.employee_id.fullname;
 }

//  const getRole= (ob) =>{
//      let userRoles = "";
//      ob.roles.forEach(element,index =>{
//       if (ob.roles.length-1 == index) {
//         userRoles = userRoles + element.name;
//     } else {
//         userRoles = userRoles + element.name + ", <br>";
//     }
//      });
//      return userRoles;
//  }

const getRole= (ob) =>{
    let userRoles = "";
    ob.roles.forEach((element,index) =>{
        if (ob.roles.length-1 == index) {
     userRoles = userRoles + element.name;
    }else{
        userRoles = userRoles + element.name +" , <br>";
    }
    });
    return userRoles;
}





 const getUserStatus= (ob) =>{
     if(ob.status){
         return '<p class= "btn btn-sm btn-outline-success mt-2">Active</p>';
     }else{
         return '<p class= "btn btn-sm btn-outline-danger mt-2">In-Active</p>';
     }
 }

//end of user table


//define function for check user errors for add data
const checkUserError =() =>{
    let errors = "";

    if(user.employee_id == null){
        errors = errors + "Please Select Employee..! \n";
    }
    if(user.username == null){
        errors = errors + "Please Enter User Name..! \n";
    }
    if(user.password == null){
        errors = errors + "Please Enter password..! \n";
    }
    
    if(user.email == null){
        errors = errors + "Please select Role..! \n";
    }

    if(user.roles == null){
        errors = errors + "Please select role..! \n";
    }

    return errors;


}

//define function for submit
const buttonUserSubmit = () => {
    console.log("buttonUserSubmit function called");
    console.log("user object:", user);
   
    let errors = checkUserError();

    if (errors == "") {
        // Get user confirmation
        const userResponse = confirm("Are you sure to add the following user \n" + "\n User name:" + user.username +
            "\n Email:" + user.email + "\n Employee:" + user.employee_id.fullname);

        if (userResponse) {
            console.log("Data to be sent:", user);
            // Call post service
            const userPostServiceResponse = ajaxRequestBody("/user", "POST", user);

            console.log("userPostServiceResponse:", userPostServiceResponse);

            if (userPostServiceResponse == "OK") {
                alert("Save Successfully........");

                refreshUserTable();
                FormUser.reset();
                refreshUserForm();
                
                
                //need to hide modal
                $('#modalUserAddForm').modal('hide');


            } else {
                alert("Form has some errors....!\n" + userPostServiceResponse);
            }
        }
    } else {
        alert("Form has some errors....!\n" + errors);
    }
}


const refreshUserForm =() => {

    //create new object call user
    user= new Object();

    olduser = null;
    // user.roles = new Array();
    user.roles = [];

    //employee list without user account
    employeeListWithoutUserAccount = ajaxGetRequest("/employee/listwithoutuseraccount");
    fillDataIntoSelect(selectEmployee,'Select Employee', employeeListWithoutUserAccount,'fullname');

    //need to empty all element

    textUserName.value = '';
    textPassword.value = '';
    textRTPassword.value = '';
    textEmail.value = '';
    textNote.value = '';

    //set default color
    selectEmployee.style.border = "2px solid #ced4da";
    textUserName.style.border = "2px solid #ced4da";
    textPassword.style.border = "2px solid #ced4da";
    textRTPassword.style.border = "2px solid #ced4da";
    textEmail.style.border = "2px solid #ced4da";
    textNote.style.border = "2px solid #ced4da";
    user.photo = null;
    fileuserphoto.files = null;
    imgUserphoto.src = "resource/images/profile image.png";
    textUserphoto.value = "";


    //need to get role list
    roles = ajaxGetRequest("/role/list");
    divRoles.innerHTML = "";

    roles.forEach(element => {

        const div = document.createElement('div');
        div.className = "form-check form-check-inline";

        const inputCHK = document.createElement('input');
        inputCHK.type = "checkbox";
        inputCHK.className = "form-check-input";
        inputCHK.id = "chk" + element.name;

        inputCHK.onchange = function (){

            if(this.checked){
                user.roles.push(element);
            }else{

                let extIndex = user.roles.map(item => item.name).indexOf(element.name);
                if(extIndex != -1){
                    user.roles.splice(extIndex,1);
                }
            }
        }

        const label = document.createElement('label');
        label.className = "form-check-label fw-bold";
        label.for = inputCHK.id;
        label.innerText = element.name;

        div.appendChild(inputCHK);
        div.appendChild(label);
        divRoles.appendChild(div);

    });

     //disable form button according to privileges

     btnUpdateUser.disabled = "true";
     $("#btnUpdateUser").css("cursor","not-allowed");

     if(userPrivilege.insert) {
     btnAddUser.disabled = "";
     $("#btnAddUser").css("cursor","pointer");
     }else{
     btnAddUser.disabled = "true";
     $("#btnAddUser").css("cursor","not-allowed");  
     }

}

//define function for password retype
const passwordRTValidator = () =>{

    if(textPassword.value != ""){
        if(textPassword.value == textRTPassword.value){
            textPassword.style.border ="2px solid green";
            textRTPassword.style.border ="2px solid green";
            user.password = textPassword.value;
        }else{
            textPassword.style.border ="2px solid red";
            textRTPassword.style.border ="2px solid red";
            user.password =null;
        }
    }else{
        alert("Please fill password field");
        textPassword.style.border ="2px solid red";
        textRTPassword.style.border ="2px solid red";
        user.password =null;
    }



}
//end of function for check user errors for add data
 
 //User form refill function Start update function
 const userformRefill = (ob,rowIndex) =>{
    $('#modalUserAddForm').modal('show');
    console.log("Refill");

    user = JSON.parse(JSON.stringify(ob));
    olduser = JSON.parse(JSON.stringify(ob));

    textUserName.value= user.username;
    textEmail.value = user.email;

    if(user.note != null)
    textNote.value =user.note;else textNote.value = "";

    textPassword.disabled = true;
    textRTPassword.disabled = true;


    if(user.status){
        chkUserStatus.checked = true;
        chkLblUserStatus.innerText = 'User account is Active';
    }else{
        chkUserStatus.checked = false;
        chkLblUserStatus.innerText = 'User account is Not-Active' ;
    }

    // refill image
    if(user.photo == null){
        imgUserphoto.src = "resource/images/profile image.png";
        textUserphoto.value = "";
      }else{
        imgUserphoto.src = atob(user.photo);
        textUserphoto.value = user.photopath;
      }
     

     employeeListWithoutUserAccount.push(user.employee_id);
     fillDataIntoSelect(selectEmployee,'Select Employee*', employeeListWithoutUserAccount,'fullname',user.employee_id.fullname);


      //need to get role list
      roles = ajaxGetRequest("/role/list");
      divRoles.innerHTML = "";
 
      roles.forEach(element => {
 
          const div = document.createElement('div');
          div.className = "form-check form-check-inline row";
 
          const inputCHK = document.createElement('input');
          inputCHK.type = "checkbox";
          inputCHK.className = "form-check-input";
          inputCHK.id = "chk" + element.name;
 
          inputCHK.onchange = function (){
 
              if(this.checked){
                  user.roles.push(element);
              }else{
 
                  let extIndex = user.roles.map(item => item.name).indexOf(element.name);
                  if(extIndex != -1){
                      user.roles.splice(extIndex,1);
                  }
              }
          }
 
          const label = document.createElement('label');
          label.className = "form-check-label";
          label.for = inputCHK.id;
          label.innerText = element.name;
 
          div.appendChild(inputCHK);
          div.appendChild(label);
          divRoles.appendChild(div);
 
          let extURoleIndex = user.roles.map(item => item.name).indexOf(element.name);
 
          if(extURoleIndex != -1 ){
             inputCHK.checked = true;
          }
 
      });

      //disable add button when click update button
        // userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/user")

        btnAddUser.disabled = "true";
        $("#btnAddUser").css("cursor","not-allowed");

        if(userPrivilege.update) {
           btnUpdateUser.disabled = "";
        $("#btnUpdateUser").css("cursor","pointer");
          }else{
           btnUpdateUser.disabled = "true";
              $("#btnUpdateUser").css("cursor","not-allowed");  
          }

 }

 //define function for  generate user email automatically
const generateUserEmail = () =>{

    console.log(selectEmployee.value);
    console.log(JSON.parse(selectEmployee.value));

    textEmail.value = JSON.parse(selectEmployee.value).email;//set value
    user.email = textEmail.value; //bind value
    textEmail.style.border = "2px solid green";

}


 //define function for check from updates
const checkUserFormUpdate = () => {

    let updates = "";

    if(user.username != olduser.username){
        updates = updates + "Username is changed";
    }

    if(user.email != olduser.email){
        updates = updates + "User email is changed" + olduser.email + "into" + user.email + "\n" ;
    } 

    if(user.note != olduser.note){
        updates = updates + "Note is changed" + olduser.note + "into" + user.note + "\n" ;
    }


    if(user.photo != olduser.photo){
        updates = updates + "Photo is changed" + olduser.photo + "into" + user.photo + "\n" ;
    }

    if(user.employee_id.id != olduser.employee_id.id){
        updates = updates + "Employee is changed \n" ;
    }

    if(user.roles.length != olduser.roles.length){
        updates = updates + "Roles is changed \n";
    }else{
        for(let element of user.roles){
            let extRoleCount = olduser.roles.map(item => item.id).indexOf(element.id);

            if(extRoleCount == -1){
                updates = updates + "Roles is changed \n";
                break;
            }
        }
    }

    return updates;
}

 //define user update function
const buttonUpdateUser = () =>{

    console.log(user);
    console.log(olduser);
    console.log("Update button");
    //check form error
    let errors = checkUserError();

    if(errors == ""){
        //check update availability
         let updates = checkUserFormUpdate();
         if(updates == ""){
             alert("Nothing updated...!");
         }else{
             //need to et user confirmation
             let userConfirm = confirm("Are you sure to update following changes.? \n" + updates);
             if(userConfirm){
                 //call PUT services
                 const putServiceResponse = ajaxRequestBody("/user", "PUT", user);
                 if(putServiceResponse == "OK"){
                     alert("Update Successfully....!");
                     refreshUserTable();
                     FormUser.reset();
                     refreshUserForm();
                     //need to hide modal
                     $('#modalUserAddForm').modal('hide');
                 }else{
                     alert("faild to update changers... \n" + putServiceResponse);
                 }
             }
         }
    }else{
        alert("form has following errors..please check again \n" + errors);
    }

}

// end of update function

 //User delete function
 const userDelete = (ob,rowIndex) =>{
    const userConfirm = confirm('Are you sure to delete following user account \n' +
    '\n Employee is:'+ ob.employee_id.fullname +
     '\n User Name is:'+ ob.username + '\n email is:' + ob.email);

     if(userConfirm){
           //request delete service
           const deleteServerResponse = ajaxRequestBody("/user" , "DELETE", ob);

           if (deleteServerResponse =='OK') {
            alert('user delete successfully');
            refreshUserTable();
           } else {
            alert('user delete not success you have following errors \n + deleteServerResponse ')
           }
     } else{
        refreshUserTable();
     }
 }
 
 
 //User print function
 const userPrint = () =>{
    const newTab = window.open();
        newTab.document.write(
            '<head><title>Print User</title>' +
            '<script src="resource\js\jquery.js"></script>' +
            '<link rel="stylesheet" href="resource\bootstrap-5.2.3-dist\css\bootstrap.min.css"> ' +
            '</head>' +
            '<h2 style="margin-top:100px;">User Details</h2>'+
            tableUser.outerHTML +
            '<script>$(".modify-button").css("display","none")</script>'          
        );

        setTimeout(
            function(){
                newTab.print();

            },1000
        )
 }

 const buttonClearImage =() =>{
    if(material.photo != null){
        const userConfirm = confirm("Are you sure to reset user photo...?");

        if(userConfirm){
            material.photo = null;
            fileuserphoto.files = null;
            imgUserphoto.src = "resource/images/profile image.png";
            textUserphoto.value = "";

        }
    }else{
        material.photo = null;
        imgUserphoto.src = "resource/images/profile image.png";
        textUserphoto.value = "";

    }
 }








