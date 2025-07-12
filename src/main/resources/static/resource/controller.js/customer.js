//Acess rowser onload event
window.addEventListener('load',()=>{
     
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/customer");
    console.log(userPrivilege);
    
    //call table refresh function
    refreshCustomerTable();

    //call form refresh function
    refreshCustomerForm();

    customer.status = true;

    
   
})

//create function for refresh table record
const refreshCustomerTable = () =>{
  

 //  ..................using common.js file function create post.........................
 customers = ajaxGetRequest("/customer/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function               
 const displayProperty = [{property:'code', datatype:'string'} ,
                         {property:'name', datatype:'string'},
                         {property:'address', datatype:'string'},
                         {property:'contact_no', datatype:'string'},
                         {property:'email', datatype:'string'},
                          {property:getStatus, datatype:'function'}
                        ];
                        
         //call fill data into table function
         //fillDataIntoTable(tableid, dataList, display property list, refillfunctionname, deletefunctionname, printfunctionname,button visibility)
         fillDataIntoTable(tableCustomer,customers ,displayProperty ,refillCustomerForm,deleteCustomer,printCustomer, true, userPrivilege); //true use to display button
 
      

         //disable delete button after deleting record
        customers.forEach((element, index) => {
        if(element.status === false){
            if (userPrivilege.delete) {
                tableShop.children[1].children[index].children[7].children[1].disabled = true; //you can also use disabled
            }
            
        }
       
    });

    
        //calljQuery data table
        $('#tableCustomer').dataTable({
            "responsive": true,
            "scrollX": true, // Enable horizontal scrollbar
            "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
        });
 
 }

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.status === true) {
        return '<p class= "btn btn-outline-success btn-sm">' + "Active" +'</p>';
    }
    if (rowOb.status === false) {
        return '<p class = "btn btn-outline-dark btn-sm">' + "In-Active" +'</p>';
    }
}

// end of display table record


    // create function for refresh form area
    const refreshCustomerForm = () => {

        //create empty object
        customer = {};   

        //set default color
        textCode.style.border = "2px solid #ced4da";
        textCustomerName.style.border = "2px solid #ced4da";
        textAddress.style.border = "2px solid #ced4da";
        textContact.style.border = "2px solid #ced4da";
        textEmail.style.border = "2px solid #ced4da";
       textNote.style.border = "2px solid #ced4da";

        textCode.value = '';
        textCustomerName.value = '';
        textAddress.value = '';
        textContact.value = '';
        textEmail.value = '';
        textNote.value = '';


        //disable form button according to privilege

        btnUpdateCustomer.disabled = "true";
        $("#btnUpdateCustomer").css("cursor","not-allowed");

        if(userPrivilege.insert) {
        btnAddCustomer.disabled = "";
        $("#btnAddCustomer").css("cursor","pointer");
        }else{
        btnAddCustomer.disabled = "true";
        $("#btnAddCustomer").css("cursor","not-allowed");  
        }

        
      
    }

    // create function for check form Error
    const checkError = () => {
        //need to check all required property or field
        let errors = '';
        
        if (customer.name == null) {
            errors = errors + 'please Enter Valid Shop Name...! \n';  
        }

        if (customer.contact_no == null) {
             errors = errors + 'please Enter Valid Contact...! \n';
        }

        if (customer.email == null) {
            errors = errors + 'please Enter Valid Email...! \n';    
        }
        if (customer.address == null) {
            errors = errors + 'please Enter Valid Address..! \n';
               
        }
       return errors;

}

    //create function for add button
    const buttonCustomerAdd = () =>{
        // console.log('Add button Click event');
        //1.need to check form errors --> checkError()
        let formErrors = checkError()
        if (formErrors == '') {
        // alert('No Errors');
        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this customer details?\n'
        + '\n customer Name is : ' + customer.name  + '\n Email is : ' + customer.email);

        if(userConfirm){
        //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
        let serverResponse = ajaxRequestBody("/customer", "POST", customer);
          
        //4.check backend response
        if (serverResponse == 'OK') {
            alert('Save Successfully......!' );
            //need to refresh table and form
            refreshCustomerTable();
                formCustomer.reset();
                refreshCustomerForm();
            //need to hide modal
            $('#modalCustomerAddForm').modal('hide');

        } else {
            alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
        }
        }
      
            
        } else {
            alert('form has some errors \n' + formErrors)
        }
    }



    //create refill function
    const refillCustomerForm =(rowOb,rowInd)=>{
        $('#modalCustomerAddForm').modal('show');
        // employee = rowOb;
        // oldemployee = rowOb;

        customer = JSON.parse(JSON.stringify(rowOb));
        oldcustomer = JSON.parse(JSON.stringify(rowOb));

        console.log(customer);
        console.log(oldcustomer);

        textCode.value = customer.code
        textCustomerName.value = customer.name
        textAddress.value = customer.address
        textContact.value = customer.contact_no
        textEmail.value = customer.email
        customerStatus.value = customer.status

          if(customer.status){  
        customerStatus.checked = true;
        chkLblCustomerStatus.innerText = 'Status is Active';
    }else{
        customerStatus.checked = false;
        chkLblCustomerStatus.innerText = 'Status is Not-Active' ;
    }

      
       
        if(customer.note != null)
        textNote.value = customer.note ;
       
        else textNote.value = "";
        
       
       

        btnAddCustomer.disabled = "true";
        $("#btnAddCustomer").css("cursor","not-allowed");

        if(userPrivilege.update) {
           btnUpdateCustomer.disabled = "";
        $("#btnUpdateCustomer").css("cursor","pointer");
          }else{
           btnUpdateCustomer.disabled = "true";
              $("#btnUpdateCustomer").css("cursor","not-allowed");  
          }
        
    }

    //define method for check updates
   const checkUpdate = ()=>{
    let updates = "";
    if( customer.name != oldcustomer.name){
        updates = updates + " customer Name is change \n";
    }

    if(shop.address != oldcustomer.address){
        updates = updates + " customer Address is change \n";
    }

    if( customer.email != oldcustomer.email){
        updates = updates + " customer Email is change \n";
    }

    if( customer.contact_no != oldcustomer.contact_no){
        updates = updates + "Contact No is change " + oldcustomer.contact_no + "into" + customer.contact_no + "\n";
    }

    if(customer.note != oldcustomer.note){
        updates = updates + "Note is change \n";
    }

    if(customer.status != oldCustomer.status){
        updates = updates + "status is change \n";
    }

    return updates;
}

    //define function for employee update
    const buttonCustomerUpdate = () =>{
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
                    let updateServicesResponses = ajaxRequestBody("/customer","PUT", customer);
                    if (updateServicesResponses == "OK") {
                        alert('Update Successfully......!' );
                          //4.check backend response
        if (serverResponse == 'OK') {
            alert('Save Successfully......!' );
            //need to refresh table and form
            refreshCustomerTable();
                formCustomer.reset();
                refreshCustomerForm();
            //need to hide modal
            $('#modalCustomerAddForm').modal('hide');

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


    } }
 
       const printCustomer =() =>{
        return "print";
    }
//define delete shop
    const deleteCustomer =(rowOb, rowInd) =>{
        const userConfirm = confirm('Do you want to delete this Employee \n' + rowOb.name);
    
        if (userConfirm) {
            let serverResponse = ajaxRequestBody("/customer", "DELETE", rowOb);
            if (serverResponse == "OK") {
                alert('Delete Successfully......!' );
                //need to refresh table and form
                refreshCustomerTable();
    
    
            } else {
                alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
            }
        }
    }

 
