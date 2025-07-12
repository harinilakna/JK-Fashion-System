//Acess rowser onload event
window.addEventListener('load',()=>{
     
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/employee");
    console.log(userPrivilege);

    //call table refresh function
    refreshEmployeeTable();

    //call form refresh function
    refreshEmployeeForm();

    //call form designation refresh form
    refreshDesignationForm();
   
})

//create function for refresh table record
const refreshEmployeeTable = () =>{
  

 //  ..................using common.js file function create post.........................
 employees = ajaxGetRequest("/employee/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function
 const displayProperty = [
                         {property:'empno', datatype:'string'} ,
                         {property:'fullname', datatype:'string'},
                         {property:'nic', datatype:'string'},
                         {property:'email', datatype:'string'},
                         {property:'contactno', datatype:'string'},
                         {property: getEmployeeDesignation, datatype:'function'},
                         {property: getEmployeeStatus, datatype:'function'}];
                        
         //call fill data into table function
         //fillDataIntoTable(tableid, dataList, display property list, refillfunctionname, deletefunctionname, printfunctionname,button visibility)
         fillDataIntoTable(
        tableEmployee, 
        employees, 
        displayProperty, 
        refillEmployeeForm, 
        deleteEmployee, 
        printEmployee, 
        true, 
        userPrivilege
    ); //true use to display button
 
    

        employees.forEach((element, index) => {
            if(element.employee_status_id.name == 'Deleted'){
              
                tableEmployee.children[1].children[index].children[8].children[1].disabled = true; //you can also use disabled
              
                
            }
           
        });
        

   if ($.fn.DataTable.isDataTable('#tableEmployee')) {
        $('#tableEmployee').DataTable().destroy();
    }

    $('#tableEmployee').DataTable();

 
}

 const getEmployeeStatus = (rowOb) =>{
       console.log('status')
    if (rowOb.employee_status_id.name == 'Working') {
        return '<p class= "btn btn-sm btn-outline-success mt-2">' + rowOb.employee_status_id.name +'</p>';
    }
    if (rowOb.employee_status_id.name == 'Resigned') {
        return '<p class = "btn btn-sm btn-outline-dark mt-2">' + rowOb.employee_status_id.name +'</p>';
    }
    if (rowOb.employee_status_id.name == 'Deleted') {
        return '<p class= "btn btn-sm btn-outline-danger mt-2">' + rowOb.employee_status_id.name +'</p>';
    }
   
    }

const getEmployeeDesignation = (rowOb) =>{
        console.log('designation')
        if (rowOb.designation_id.name == 'Admin') {
            return '<p class = "designation">' + rowOb.designation_id.name +'</p>';
        }
        if (rowOb.designation_id.name == 'Manager') {
            return '<p class = "designation">' + rowOb.designation_id.name +'</p>';
        }
        if (rowOb.designation_id.name == 'Production_Manager') {
            return '<p class = "designation">' + rowOb.designation_id.name +'</p>';
        }
        if (rowOb.designation_id.name == 'StoreKeeper') {
            return '<p class = "designation">' + rowOb.designation_id.name +'</p>';
        }
        if (rowOb.designation_id.name == 'Financial_Manager') {
            return '<p class = "designation">' + rowOb.designation_id.name +'</p>';
        }
        if (rowOb.designation_id.name == 'Sales_Agent') {
            return '<p class = "designation">' + rowOb.designation_id.name +'</p>';
        }
       
 }

// end of display table record


// function for generate calling name values
const generateCallingNameValues = () =>{
    const callingnames = document.querySelector('#callingnames');
    callingnames.innerHTML = '';

    callingNamePartList = textFullName.value.split(' ');
    callingNamePartList .forEach(item =>{
        const option = document.createElement('option');
        option.value = item;
        callingnames.appendChild(option);
    });
}

 // create function for validate Calling Name / can use map function
 const textCallingNameValidator = (field) =>{
    const callingNameValue = field.value;
    let cNameExt = false;

    for (let element of callingNamePartList) {
       if(element == callingNameValue)  {
         cNameExt = true;
         break;  
       }
    }

    //0 -//-1
   //  let extIndex = callingNamePartList.map(cname => cname).indexOf(callingNameValue);
   if(cNameExt){
       //valid
       field.style.border = '2px solid green';
       employee.callingname = callingNameValue;
   }else{
       //invalid
       field.style.border = '2px solid red';
       employee.callingname = null;
   }
  
   }

    // create function for refresh form area
    const refreshEmployeeForm = () => {

        //create empty object
        employee = {};
        oldemployee = null;

        //get data list for select element
        // designations = [{id:1, name:'Manager'},{id:2, name:'Cashier'},{id:3, name:'Stock keeper'}];
        designations = ajaxGetRequest("/designation/findall")
        fillDataIntoSelect( selectDesignation, 'Select Designation*', designations, 'name');

        // employeestatues = [{id:1, name:'Working'},{id:2, name:'Resign'},{id:3, name:'Deleted'}];
        employeestatues = ajaxGetRequest("/employeestatus/findall")
        fillDataIntoSelect( selectEmployeeStatus, 'Select Status*', employeestatues, 'name');


        //need to empty all element
        textFullName.value = '';
        textCallingName.value = '';
        textNic.value = '';
        dateDOB.value = '';
        textContactNo.value = '';
        textEmail.value = '';
        textAddress.value = '';
        selectGender.value = '';
        textLandNo.value = '';
        textNote.value = '';
        selectDesignation.value = '';
        selectEmployeeStatus.value = '';


         //need to set default color

        textFullName.style.border = '1px solid #ced4da';
        textCallingName.style.border = '1px solid #ced4da';
        textNic.style.border = '1px solid #ced4da';
        dateDOB.style.border = '1px solid #ced4da';
        textContactNo.style.border = '1px solid #ced4da';
        textEmail.style.border = '1px solid #ced4da';
        textAddress.style.border = '1px solid #ced4da';
        selectGender.style.border = '1px solid #ced4da';
        textLandNo.style.border = '1px solid #ced4da';
        textNote.style.border = '1px solid #ced4da';
        selectDesignation.style.border = '1px solid #ced4da';
        selectEmployeeStatus.style.border = '1px solid #ced4da';



        btnUpdateEmployee.disabled = "true";
        $("#btnUpdateEmployee").css("cursor","not-allowed");

        if(userPrivilege.insert) {
        btnAddEmployee.disabled = "";
        $("#btnAddEmployee").css("cursor","pointer");
        }else{
        btnAddEmployee.disabled = "true";
        $("#btnAddEmployee").css("cursor","not-allowed");  
        }

      
    }

    // create function for check form Error
    const checkError = () => {
        // console.log(employee);
        //need to check all required property or field
        let errors = '';

        if (employee.fullname == null) {
            errors = errors + 'please Enter Valid Full Name...! \n';  
        }

        if (employee.callingname == null) {
             errors = errors + 'please Enter Valid calling Name...! \n';
        }

        if (employee.nic == null) {
            errors = errors + 'please Enter Valid NIC...! \n';    
        }
        if (employee.contactno == null) {
            errors = errors + 'please Enter Valid Mobile...! \n';
               
        }
        if (employee.email == null) {
            errors = errors + 'please Enter Valid Email...! \n';      
        }

        if (employee.date_of_birth == null) {
            errors = errors + 'please Enter Valid Birth date...! \n';      
        }

        if (employee.address == null) {
            errors = errors + 'please Enter Valid Address...! \n';      
        }

        if (employee.gender == null) {
            errors = errors + 'please Enter Valid Gender...! \n';      
        }

        if (employee.designation_id == null) {
            errors = errors + 'please Enter Valid Designation...! \n';      
        }
       
        if (employee.employee_status_id == null) {
            errors = errors + 'please Enter Valid Status...! \n';      
        }
       
       return errors;

}

    //create function for add button
    const buttonEmployeeAdd = () =>{
      
        //1.need to check form errors --> checkError()
        let formErrors = checkError()
        if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this employee?\n'
        + '\n Full Name is : ' + employee.fullname  + '\n NIC is : ' + employee.nic  +'\n Gender is : ' + employee.gender + '\n Email is : ' + employee.email);

        if(userConfirm){
        //3.pass data into backend
        // call ajaxRequestBody Function
        //ajaxRequestBody("/url" , "METHOD", object)
        let serverResponse = ajaxRequestBody("/employee", "POST", employee);
          
        //4.check backend response
        if (serverResponse == 'OK') {
            alert('Save Successfully......!' );
            //need to refresh table and form
          
            formEmployee.reset();
            refreshEmployeeForm();
            refreshEmployeeTable();
            //need to hide modal
            $('#modalEmloyeeAddForm').modal('hide');
             

        } else {
            alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
        }
        }
      
            
        } else {
            alert('form has some errors \n' + formErrors)
        }
    }

    //create refill function
    const refillEmployeeForm =(rowOb,rowInd)=>{
        $('#modalEmloyeeAddForm').modal('show');

        employee = JSON.parse(JSON.stringify(rowOb));
        oldemployee = JSON.parse(JSON.stringify(rowOb));

        console.log(employee);
        console.log(oldemployee);

        
        textFullName.value = employee.fullname;
        textCallingName.value = employee.callingname;
        textNic.value = employee.nic;
        dateDOB.value = employee.date_of_birth;
        textContactNo.value = employee.contactno;
        textEmail.value = employee.email;
        textAddress.value = employee.address; 
        selectGender.value = employee.gender;

        if(employee.landno != null)
        textLandNo.value = employee.landno;else textLandNo.value = "";

        if(employee.note != null)
        textNote.value = employee.note; else textNote.value = ""; 

        // selectDesignation
        fillDataIntoSelect( selectDesignation, 'Select Designation', designations, 'name',employee.designation_id.name);

        // selectEmployeeStatus
        fillDataIntoSelect( selectEmployeeStatus, 'Select Status', employeestatues, 'name',employee.employee_status_id.name);

        //disable add button when click update button
        // userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/employee");
       

         btnAddEmployee.disabled = "true";
         $("#btnAddEmployee").css("cursor","not-allowed");

         if(userPrivilege.update) {
            btnUpdateEmployee.disabled = "";
         $("#btnUpdateEmployee").css("cursor","pointer");
           }else{
            btnUpdateEmployee.disabled = "true";
               $("#btnUpdateEmployee").css("cursor","not-allowed");  
           }


           textFullName.style.border = '1px solid green';
           textCallingName.style.border = '1px solid green';
           textNic.style.border = '1px solid green';
           dateDOB.style.border = '1px solid green';
           textContactNo.style.border = '1px solid green';
           textEmail.style.border = '1px solid green';
           textAddress.style.border ='1px solid green';
           selectGender.style.border = '1px solid green';
           textLandNo.style.border = '1px solid green';
           textNote.style.border = '1px solid green';
           selectDesignation.style.border = '1px solid green';
           selectEmployeeStatus.style.border = '1px solid green';
    }

    //define method for check updates
const checkUpdate = ()=>{
    let updates = "";
    
    if(employee.fullname != oldemployee.fullname){
        updates = updates + "FullName is change \n";
    }

    if(employee.callingname != oldemployee.callingname){
        updates = updates + "Calling Name is change \n";
    }

    if(employee.address != oldemployee.address){
        updates = updates + "Address is change \n";
    }

    if(employee.note != oldemployee.note){
        updates =  updates + "Note is change \n";
    }
    
    if(employee.landno != oldemployee.landno){
        updates =  updates + "Land Number is change \n";
    }

    if(employee.nic != oldemployee.nic){
        updates = updates + "NIC is change \n";
    }

    if(employee.date_of_birth != oldemployee.date_of_birth){
        updates = updates + "DOB is change \n";
    }

    if(employee.contactno != oldemployee.contactno){
        updates = updates + "mobile is change " + oldemployee.contactno + "into" + employee.contactno + "\n";
    }

    if(employee.email != oldemployee.email){
        updates = updates + "Email is change " + oldemployee.email + "into" + employee.email + "\n";
    }

    if(employee.gender != oldemployee.gender){
        updates = updates + "Gender is change " + oldemployee.gender + "into" + employee.gender + "\n";
    }

    if(employee.designation_id.name != oldemployee.designation_id.name){
        updates = updates + "designation is change \n";
    }

    if(employee.employee_status_id.name != oldemployee.employee_status_id.name){
        updates = updates + "status is change \n";
    }
    return updates;
}

    //define function for employee update
    const buttonEmployeeUpdate = () =>{
    console.log("Update button");
    //check from error
        let error = checkError();
        if(error == ""){
            //check form update
            let updates = checkUpdate();
            if(updates != ""){
                //cell put service
                let userConfirm = confirm("Are you sure following changer...? \n" + updates);
                if(userConfirm){
                    let updateServicesResponses = ajaxRequestBody("/employee","PUT", employee);
                    if (updateServicesResponses == "OK") {
                        alert('Update Successfully......!' );
                        //need to refresh table and form
                        refreshEmployeeTable();
                        formEmployee.reset();
                        refreshEmployeeForm();
                        //need to hide modal
                        $('#modalEmloyeeAddForm').modal('hide');

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

    const printEmployee =() =>{
        return "print";
    }

    const deleteEmployee =(rowOb, rowInd) =>{
        const userConfirm = confirm('Do you want to delete this Employee \n' + rowOb.fullname);
    
        if (userConfirm) {
            let serverResponse = ajaxRequestBody("/employee", "DELETE", rowOb);
            if (serverResponse == "OK") {
                alert('Delete Successfully......!' );
                //need to refresh table and form
                refreshEmployeeTable();
    
    
            } else {
                alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
            }
        }
    }


    //create function for generate age

    const generateAge = (element) =>{

        let dob =  element.value;

        let currentDate = new Date();
        let dateDOB = new Date(dob);

        console.log(currentDate);
        console.log(dateDOB);

        let difTime = currentDate.getTime() - dateDOB.getTime();
        let difDate = new Date(diffTime);

        let age = Math.abs(difDate.getFullYear() - 1970);
        console.log("Age is:" + age)
    }
   
//     // generate geder and dob

// const generateGenderDOB = (element) =>{

//     let nicValue = element.value;

//     let year;

//     let days;

//     let dob;

//     if(new RegExp ("^(([0-9]{9}[vVXxSs])|([0-9]{12}))$").test(nicValue)) {

//         if(nicValue == 10){

//             year = nicValue.substring(0,2);
//             days = nicValue.substring(2,5);
    
//         } 
//         if(nicValue == 12){
    
//             year = nicValue.substring(0,2);
//             days = nicValue.substring(2,5);
            
//         }

//         console.log(year);
//         console.log(days);
        
//     } else {
        
//     }
   
// }

// designation form refresh

const refreshDesignationForm = ()=>{

    designationOb = new Object();
 
    textDesignation.value = "";
    textDesignation.style.border = '1px solid #ced4da';
}


const buttonDesignationSubmit = () =>{

 console.log("submit designation form");

 if(designationOb.name != null){
    let userConfirm = confirm("Are you sure to add" + designationOb.name + "Designation value...?");
    if (userConfirm) {
        let postResponce =  ajaxRequestBody("/designation", "POST", designationOb);
        if (postResponce == "OK") {
             
            alert("Save successfully.....!");

            designations = ajaxGetRequest("/designation/findall")
            fillDataIntoSelect( selectDesignation, 'Select Designation*', designations, 'name',textDesignation.value );
            employee.designation_id = JSON.parse(selectDesignation.value);
            refreshDesignationForm();

            $('#designationForm').modal('hide');

        } else {
            alert("Save Not Successfully , form has following errors..!\n" + postResponce);  
        }
    } else {
      alert("Please Enter designation Name..!");  
    }
}
}

