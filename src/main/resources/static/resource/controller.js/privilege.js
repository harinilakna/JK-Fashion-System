//Acess rowser onload event
window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/user_and_privilege");
    console.log(userPrivilege);
    
    $('[data-bs-toggle="tooltip"]').tooltip();
 
    
     //call table refresh function
     refreshPrivilegeTable();
     //call form refresh function
     refreshPrivilegeForm();
 })
 
 //create function for refresh table record
 const refreshPrivilegeTable = () =>{
 
     //  ..................using common.js file function create post.........................
    privileges = ajaxGetRequest("/privilege/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function
 const displayProperty = [{property: getRole, datatype:'function'} ,
                         {property: getModule, datatype:'function'},
                         {property:getSelect, datatype:'function'},
                         {property:getInsert, datatype:'function'},
                         {property: getUpdate, datatype:'function'},
                         {property: getDelete, datatype:'function'}];
         //call fill data into table function
         fillDataIntoTable(tablePrivilege,  privileges,displayProperty ,refillPrivilegeForm, deletePrivilege, printPrivilege, true,userPrivilege); //true use to display button
 
         $('#tablePrivilege').dataTable({
             retrieve: true,
    responsive: true,
    scrollX: true,
    scrollY: '300px'
        });
  
 
     }
 
     //get role value
     const getRole =(ob) =>{
     return ob.role_id.name;
     }
 
     //get select module value
     const getModule =(ob) =>{
         return ob.module_id.name;
     }
 
     //get select privilege value
     const getSelect =(ob) => {
         if (ob.sel) {
            return "Granted";
         } else{
             return "Not Granted"
             }
     }
 
     //get insert privilege value
     const getInsert =(ob) =>{
         if (ob.inst) {
             return "Granted";
         } else{
             return "Not Granted"
         }
     }
 
     //get update privilege value
     const getUpdate =(ob) =>{
         if (ob.upd) {
             return "Granted";
         } else{
             return "Not Granted"
         }
     }
 
     //get delete privilege value
     const getDelete =(ob) =>{
         if (ob.del) {
             return "Granted";
         } else{
             return "Not Granted"
         }
     }
 
 
 
     //delete privilege record
     const deletePrivilege =(rowOb, rowInd) =>{

     const userConfirm = confirm('Are you sure to delete following privilege \n' +
         "Role:" + rowOb.role_id.name +
         "\n Module :" + rowOb.module_id.name);
 
     if (userConfirm) {
         let serverResponse = ajaxRequestBody("/privilege", "DELETE", rowOb);
         if (serverResponse == "OK") {
             alert('Delete Successfully......!' );
             //need to refresh table and form
             refreshPrivilegeTable();
             formPrivilege.reset();
             refreshPrivilegeForm();


         } else {
             alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
         }
     }
 }
 
     //define function for filter module list by given role id
    const generateModuleList = () =>{
        modulesByRole = ajaxGetRequest("/module/listbyrole?roleid=" + JSON.parse(selectRole.value).id);
        fillDataIntoSelect(selectModule, 'Select Module', modulesByRole, 'name');
        selectModule.disabled = false;
    }
 
 
     // create function for refresh form area
     const refreshPrivilegeForm = () => {
 
         //create empty object
         privilege = {};
 
         //get data list for select element
 
         roles = ajaxGetRequest("/role/list")
         fillDataIntoSelect(selectRole, 'Select Role', roles, 'name');
         selectRole.disabled = false;
 
         modules = ajaxGetRequest("/module/list")
         fillDataIntoSelect( selectModule, 'Select Module', modules, 'name');
         selectModule.disabled = true;

         selectRole.style.border = " 1px solid #ced4da";
         selectModule.style.border = " 1px solid #ced4da";

        
         privilege.sel = false;
         privilege.inst = false;
         privilege.upd = false;
         privilege.del = false;

        labelCBSelect.innerText = "Not-Granted";
        labelCBInsert.innerText = "Not-Granted";
        labelCBUpdate.innerText = "Not-Granted";
        labelCBDelete.innerText = "Not-Granted";

        //disable form button according to privileges

        btnUpdatePrivilege.disabled = "true";
        $("#btnUpdatePrivilege").css("cursor","not-allowed");

        if(userPrivilege.insert) {
        btnAddPrivilege.disabled = "";
        $("#btnAddPrivilege").css("cursor","pointer");
        }else{
        btnAddPrivilege.disabled = "true";
        $("#btnAddPrivilege").css("cursor","not-allowed");  
        }


     }
 
     // create function for check form Error
     const checkError = () => {
         // console.log(employee);
         //need to check all required property or field
         let errors = '';
         // if (textFullName.value == '') {
         if (privilege.role_id == null) {
             errors = errors + 'please select role...! \n'
         }
         if (privilege.module_id == null) {
             errors = errors + 'please select module...! \n'
         }
         if (privilege.sel == null) {
             errors = errors + 'please select privilege...! \n';
         }
 
         if (privilege.inst == null) {
             errors = errors + 'please insert privilege...! \n';
         }
 
         if (privilege.upd == null) {
             errors = errors + 'please update privilege...! \n';
         }
         if (privilege.del == null) {
             errors = errors + 'please delete privilege...! \n';
         }
        
        return errors;
 
 
 
 }
 
     //create function for add button
     const buttonPrivilegeAdd = () =>{
         // console.log('Add button Click event');
         //1.need to check form errors --> checkError()
         let formErrors = checkError()
         if (formErrors == '') {
         // alert('No Errors');
         //2.need to get user confirmation
         let userConfirm = window.confirm('Are you sure to add following privilege record..?\n'
         + '\n Role : ' + privilege.role_id.name
             + '\n Module : ' + privilege.module_id.name
         );
 
         if(userConfirm){
         //3.pass data into backend
             // call ajaxRequestBody Function
             //ajaxRequestBody("/url" , "METHOD", object)
         let serverResponse = ajaxRequestBody("/privilege", "POST", privilege);
 
 
         //4.check backend response
         if (serverResponse == 'OK') {
         // if (new RegExp ('^[0-9]{8}$').test(serverResponse)) {
             alert('Save Successfully......!');
             //need to refresh table and form
             refreshPrivilegeTable();
             formPrivilege.reset();
             refreshPrivilegeForm();
             //need to hide modal
             $('#modalPrivilegeAddForm').modal('hide');
 
         } else {
             alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
         }
         }
       
             
         } else {
             alert('form has some errors \n' + formErrors)
         }
     }
 
     //create refill function
     const refillPrivilegeForm =(rowOb,rowInd)=>{
         $('#modalPrivilegeAddForm').modal('show');
         // employee = rowOb;
         // oldemployee = rowOb;
 
         privilege = JSON.parse(JSON.stringify(rowOb));
         oldprivilege = JSON.parse(JSON.stringify(rowOb));
 
         console.log(privilege);
         console.log(oldprivilege);
 
         roles = ajaxGetRequest("/role/list")
         fillDataIntoSelect(selectRole, 'Select Role', roles, 'name',privilege.role_id.name);
         selectRole.disabled = true;
 
         modules = ajaxGetRequest("/module/list")
         fillDataIntoSelect( selectModule, 'Select Module', modules, 'name',privilege.module_id.name);
         selectModule.disabled = true;
 
        if(privilege.sel){
            checkBoxSelect.checked = true;
            labelCBSelect.innerText = "Granted";
        }else{
            checkBoxSelect.checked = false;
            labelCBSelect.innerText = "Not-Granted";
        }
         if(privilege.inst){
             checkBoxInsert.checked = true;
             labelCBInsert.innerText = "Granted";
         }else{
             checkBoxInsert.checked = false;
             labelCBInsert.innerText = "Not-Granted";
         }
         if(privilege.upd){
             checkBoxUpdate.checked = true;
             labelCBUpdate.innerText = "Granted";
         }else{
             checkBoxUpdate.checked = false;
             labelCBUpdate.innerText = "Not-Granted";
         }
         if(privilege.del){
             checkBoxDelete.checked = true;
             labelCBDelete.innerText = "Granted";
         }else{
             checkBoxDelete.checked = false;
             labelCBDelete.innerText = "Not-Granted";
         }

        //disable add button when click update button
        // userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/employee");

        btnAddPrivilege.disabled = "true";
        $("#btnAddPrivilege").css("cursor","not-allowed");

        if(userPrivilege.update) {
           btnUpdatePrivilege.disabled = "";
        $("#btnUpdatePrivilege").css("cursor","pointer");
          }else{
           btnUpdatePrivilege.disabled = "true";
              $("#btnUpdatePrivilege").css("cursor","not-allowed");  
          }
     }
 
     //define method for check updates
 const checkUpdate = ()=>{
     let updates = "";

     if(privilege.sel != oldprivilege.sel){
         updates = updates + "Select Privilege is change \n";
     }
     if(privilege.inst != oldprivilege.inst){
         updates = updates + "Insert Privilege is change \n";
     }
     if(privilege.upd != oldprivilege.upd){
         updates = updates + "Update Privilege is change \n";
     }
     if(privilege.del != oldprivilege.del){
         updates = updates + "delete Privilege is change \n";
     }
 
     if(privilege.role_id.name != oldprivilege.role_id.name){
         updates = updates + "Role is change \n";
     }
 
     if(privilege.module_id.name != oldprivilege.module_id.name){
         updates = updates + "module is change \n";
     }
     return updates;
 }
 
     //define function for employee update
     const buttonPrivilegeUpdate = () =>{
     console.log("Update button");
     console.log(privilege);
         console.log(oldprivilege);

     //check from error
         let error = checkError();
         if(error == ""){
             //check form update
             let updates = checkUpdate();
             if(updates != ""){
                 //cell put service
                 let userConfirm = confirm("Are you sure following changer...? \n" + updates);
                 if(userConfirm){
                     let updateServicesResponses = ajaxRequestBody("/privilege","PUT", privilege);
                     if (updateServicesResponses == "OK") {
                         alert('Update Successfully......!' );
                         //need to refresh table and form
                         refreshPrivilegeTable();
                         formPrivilege.reset();
                         refreshPrivilegeForm();
                         //need to hide modal
                         $('#modalPrivilegeAddForm').modal('hide');
 
                     } else {
                         alert(' Not Updates....! Have Some Errors \n' + updateServicesResponses);
                     }
                 }
             }else{
                 alert("Nothing to update....!")
             }
 
         }else{
             alert("form has following errors \n" + errors)
         }
 
 
     }
    
      //create print function and option 1
     const printPrivilege =(ob,rowInd)=>{
         
         //need to get full object
         const employeePrint = ob;
 
         for(let i=0; i < tableEmployee.children[1].children.length; i++){
         tableEmployee.children[1].children[i].style.backgroundColor =  'rgba(239, 239, 33, 0.726)';
     }
 
         tableEmployee.children[1].children[rowInd].style.backgroundColor = 'red';
 
         //option 1
         tdFullName.innerText = employeePrint.fullName
         tdEmail.innerText = employeePrint.email;
         tdMobile.innerText = employeePrint.mobile;
         tdStatus.innerText = employeePrint.emploeestatus_id.name;
 
 
 
          //option 2
          $('#modalPrintEmployee').modal('show');
         
     }
 
 
    