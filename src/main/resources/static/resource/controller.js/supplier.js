//Acess rowser onload event
window.addEventListener('load',()=>{
     
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/supplier");
    console.log(userPrivilege);

    //call table refresh function
    refreshSupplierTable();

    //call form refresh function
    refreshSupplierForm();
   
})

//create function for refresh table record
const refreshSupplierTable = () =>{
  

 //  ..................using common.js file function create post.........................
suppliers = ajaxGetRequest("/supplier/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function
 const displayProperty = [
                         {property:'supno', datatype:'string'} ,
                         {property:'brn', datatype:'string'},
                         {property:'name', datatype:'string'},
                         {property:'address', datatype:'string'},
                         {property:'contact_person', datatype:'string'},
                         {property:'contact_no', datatype:'string'},
                         {property:'email', datatype:'string'},
                         {property:getSupplyMaterials, datatype:'function'},
                         {property: 'bank_name', datatype:'string'},
                        //  {property: 'account_no', dtatype:'string'},
                         {property: 'branch_name', datatype:'string'},
                         {property: 'account_name', datatype:'string'},
                         {property: getSupStatus, datatype:'function'}
                        ];
                        
         //call fill data into table function
         //fillDataIntoTable(tableid, dataList, display property list, refillfunctionname, deletefunctionname, printfunctionname,button visibility)
         fillDataIntoTable(tableSupplier, suppliers ,displayProperty,refillSupplierForm,deleteSupplier, printSupplier, true,userPrivilege); //true use to display button
 
      
       

      //disable delete button after deleting record
      suppliers.forEach((element, index) => {
        if(element.supplier_status_id.name == 'In-Active'){

                tableSupplier.children[1].children[index].children[13].children[1].disabled = true; //you can also use disabled
    
            
        }
       
    }); 

     //calljQuery data table
     $('#tableSupplier').dataTable({
        destroy: true,
        responsive: true,
        scrollX : true,
        scrollY : 300 ,
   });
}



 const getSupStatus = (rowOb) =>{
       console.log('status')
    if (rowOb.supplier_status_id.name == 'Active') {
        return '<p class= "btn btn-sm btn-outline-success mt-2">' + rowOb.supplier_status_id.name +'</p>';
    }
    if (rowOb.supplier_status_id.name == 'In-Active') {
        return '<p class = "btn btn-sm btn-outline-danger mt-2">' + rowOb.supplier_status_id.name +'</p>';
    }
  
   
    }

    const getSupplyMaterials = (rowOb) =>{
        console.log('Materials')

        let SupMaterial = "";
        rowOb.material.forEach((element,index) =>{
            if (rowOb.material.length-1 == index) {
                SupMaterial = SupMaterial + element.name;
            } else {
                SupMaterial = SupMaterial + element.name + ", <br>";
            }
            
        });
        return SupMaterial;
   
    
     }

// end of display table record


    // create function for refresh form area
    const refreshSupplierForm = () => {

        //create empty object
        supplier = {};

        
        supplier.material = [];

         //left side
        //get data list for select element
        AvailableMaterialList = ajaxGetRequest("/material/availablelist")
        fillDataIntoSelectInnerForm( selectAllMaterial, '', AvailableMaterialList,'code','name');

        //right side
        fillDataIntoSelectInnerForm( selectSupplierMaterial, '', supplier.material,'code','name');


         //set status
        supplierstatus = ajaxGetRequest("/supplierstatus/findall")
        fillDataIntoSelect( selectSupplierStatus, 'Select Status*',supplierstatus,'name');


        //  resetIntoDefult = () =>{
        //     textbrn,
        //     textSupplierName,
        //     textSupAddress,
        //     textEmail, 
        //     textContactPerson,
        //     textContactNo,
        //     textCompanyContact,
        //     selectSupplierStatus,
        //     textNote,
        //     textBankName,
        //     textBankNo,
        //     textBranchName,
        //     textAccountName};


        btnUpdateSupplier.disabled = "true";
        $("#btnUpdateSupplier").css("cursor","not-allowed");

        if(userPrivilege.insert) {
        btnAddSupplier.disabled = "";
        $("#btnAddSupplier").css("cursor","pointer");
        }else{
        btnAddSupplier.disabled = "true";
        $("#btnAddSupplier").css("cursor","not-allowed");  
        }

      
    }

    
 //add selected items
   function btnAddOneMaterial(){
    
    if(selectAllMaterial.value == ""){
        alert("Please Select Material");

    }else{

        let selectedMaterial = JSON.parse(selectAllMaterial.value);
        supplier.material.push(selectedMaterial);
        fillDataIntoSelectInnerForm( selectSupplierMaterial, '', supplier.material,'code', 'name');
    
       let extIndex = AvailableMaterialList.map(material => material.name).indexOf(selectedMaterial.name);
       if(extIndex != -1){
        AvailableMaterialList.splice(extIndex,1)
       }
       fillDataIntoSelectInnerForm( selectAllMaterial, '', AvailableMaterialList,'code', 'name');

    }

   

  }

  function btnAddAllMaterial(){

    AvailableMaterialList.forEach(material => {
        supplier.material.push(material);
    })

    fillDataIntoSelectInnerForm(selectSupplierMaterial, '', supplier.material,'code', 'name');
    

    AvailableMaterialList = [];

    fillDataIntoSelectInnerForm( selectAllMaterial, '', AvailableMaterialList,'code', 'name');
  }

  function btnRemoveOneMaterial(){
    let selectedRemoveMaterial = JSON.parse(selectSupplierMaterial.value);
    AvailableMaterialList.push(selectedRemoveMaterial);
    fillDataIntoSelectInnerForm( selectAllMaterial, '', AvailableMaterialList,'code', 'name');

   let extIndex = supplier.material.map(material => material.name).indexOf(selectedRemoveMaterial.name);
   if(extIndex != -1){
    supplier.material.splice(extIndex,1)
   }
    
   fillDataIntoSelectInnerForm( selectSupplierMaterial, '', supplier.material,'code', 'name');
  }

  function btnRemoveAllMaterial(){
    supplier.material.forEach(material => {
        AvailableMaterialList.push(material);
    })

   
    fillDataIntoSelectInnerForm( selectAllMaterial, '', AvailableMaterialList,'code', 'name');
    

    supplier.material = [];
    fillDataIntoSelectInnerForm( selectSupplierMaterial, '', supplier.material,'code', 'name');

  }

    // create function for check form Error
    const checkError = () => {
        // console.log(employee);
        //need to check all required property or field
        let errors = '';

        if (supplier.name == null) {
            errors = errors + 'please Enter Valid Supplier Name...! \n';  
        }

        if (supplier.address == null) {
            errors = errors + 'please Enter Valid Address...! \n';    
        }
        if (supplier.contact_person == null) {
            errors = errors + 'please Enter Valid Contact Person Name...! \n';
               
        }
        if (supplier.contact_no == null) {
            errors = errors + 'please Enter Valid Contact Number...! \n';      
        }

        if (supplier.email == null) {
            errors = errors + 'please Enter Valid Email...! \n';      
        }
       
        if (supplier.supplier_status_id == null) {
            errors = errors + 'please Enter Valid Status...! \n';      
        }
       
       return errors;

}

    //create function for add button
    const buttonSupplierAdd = () =>{
      
        //1.need to check form errors --> checkError()
        let formErrors = checkError()
        if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this supplier?\n'
        + '\n Supplier Name is : ' + supplier.name  + '\n email is : ' + supplier.email  +'\n Contact person is : ' + supplier.contact_person + '\n Contact No is : ' + supplier.contact_no);

        if(userConfirm){
        //3.pass data into backend
        // call ajaxRequestBody Function
        //ajaxRequestBody("/url" , "METHOD", object)
        let serverResponse = ajaxRequestBody("/supplier", "POST", supplier);
          
        //4.check backend response
        if (serverResponse == 'OK') {
            alert('Save Successfully......!' );
            //need to refresh table and form
            refreshSupplierTable();
            formSupplier.reset();
            refreshSupplierForm();
            //need to hide modal
            $('#modalSupplierAddForm').modal('hide');

        } else {
            alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
        }
        }
      
            
        } else {
            alert('form has some errors \n' + formErrors)
        }
    }

    //create refill function
    const refillSupplierForm =(rowOb,rowInd)=>{
        $('#modalSupplierAddForm').modal('show');

        supplier = JSON.parse(JSON.stringify(rowOb));
        oldsupplier = JSON.parse(JSON.stringify(rowOb));

        console.log(supplier);
        console.log(oldsupplier);

       
        textSupplierName.value = supplier.name;
        textSupAddress.value = supplier.address;
        textEmail.value =supplier.email;
        textContactPerson.value =supplier.contact_person;
        textContactNo.value =supplier.contact_no;
        selectSupplierStatus.value =supplier.supplier_status_id.name;
       

        if(supplier.brn != null)
            textbrn.value = supplier.brn;
        else   textbrn.value = "";

        if(supplier.company_contact != null)
            textCompanyContact.value = supplier.company_contact; else textCompanyContact.value = ""; 

        if(supplier.note != null)
            textNote.value = supplier.note; else textNote.value = ""; 

        if(supplier.bank_name != null)
            textBankName.value  = supplier.bank_name; else textBankName.value = ""; 

        if(supplier.account_no != null)
            textBankNo.value   = supplier.account_no; else textBankNo.value  = ""; 

        if(supplier.branch_name != null)
            textBranchName.value   = supplier.branch_name; else  textBranchName.value  = ""; 

        if(supplier.account_name != null)
            textAccountName.value   = supplier.account_name; else  textAccountName.value  = ""; 

        // left side
        AvailableMaterialList = ajaxGetRequest("/material/availablelistwithoutsupplier/" + supplier.id)
        fillDataIntoSelectInnerForm( selectAllMaterial, '', AvailableMaterialList,'code', 'name');

        //right side
        fillDataIntoSelectInnerForm( selectSupplierMaterial, '', supplier.material,'code', 'name');

        // employeestatues = [{id:1, name:'Working'},{id:2, name:'Resign'},{id:3, name:'Deleted'}];
        supplierstatus = ajaxGetRequest("/supplierstatus/findall")
        fillDataIntoSelect( selectSupplierStatus, 'Select Status*', supplierstatus, 'name', supplier.supplier_status_id.name);
        //disable add button when click update button
        // userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/employee");
       

         btnAddSupplier.disabled = "true";
         $("#btnAddSupplier").css("cursor","not-allowed");

         if(userPrivilege.update) {
            btnUpdateSupplier.disabled = "";
         $("#btnUpdateSupplier").css("cursor","pointer");
           }else{
            btnUpdateEmployee.disabled = "true";
               $("#btnUpdateSupplier").css("cursor","not-allowed");  
           }
    }

    //define method for check updates
const checkUpdate = ()=>{
    let updates = "";
    
    if(supplier.name != oldsupplier.name){
        updates = updates + "Supplier Name is change \n";
    }

    if(supplier.brn !=  oldsupplier.brn){
        updates = updates + "BRN is change \n";
    }

    if(supplier.address != oldsupplier.address){
        updates = updates + "Address is change \n";
    }

    if(supplier.email !=  oldsupplier.email){
        updates =  updates + "Email is change \n";
    }
    
    if(supplier.contact_person !=  oldsupplier.contact_person){
        updates =  updates + "Contact person name is change \n";
    }

    if(supplier.contact_no !=  oldsupplier.contact_no){
        updates = updates + "Contact number is change \n";
    }

    if(supplier.supplier_status_id.name !=  oldsupplier.supplier_status_id.name){
        updates = updates + "Status is change \n";
    }

    if(supplier.company_contact!=  oldsupplier.contactno){
        updates = updates + "Company contact is change " +  oldsupplier.company_contact + "into" + supplier.company_contact + "\n";
    }

    if(supplier.note !=  oldsupplier.note){
        updates = updates + "Note is change " +  oldsupplier.note + "into" + supplier.note + "\n";
    }

    if(supplier.account_no !=  oldsupplier.account_no){
        updates = updates + "Account Number is change " +  oldsupplier.account_no + "into" + employee.account_no + "\n";
    }

    if(supplier.branch_name !=  oldsupplier.branch_name){
        updates = updates + "Branch name is change \n";
    }

    if(supplier.account_name !=  oldsupplier.account_name){
        updates = updates + "Account name is change \n";
    }

    if(supplier.bank_name !=  oldsupplier.bank_name){
        updates = updates + "Bank name is change \n";
    }

    if(supplier.material.length != oldsupplier.material.length){
        updates = updates + "Supplier materials are changed \n";
    }else{
        for(let element of supplier.material){
            let extMaterialCount = olduser.material.map(material => material.id).indexOf(element.id);

            if(extMaterialCount == -1){
                updates = updates + "Materials are changed \n";
                break;
            }
        }
    }
    return updates;


}


    //define function for employee update
    const buttonSupplierUpdate = () =>{
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
                    let updateServicesResponses = ajaxRequestBody("/supplier","PUT", supplier);
                    if (updateServicesResponses == "OK") {
                        alert('Update Successfully......!' );
                        //need to refresh table and form
                        refreshSupplierTable();
                        formSupplier.reset();
                        refreshSupplierForm();
                        //need to hide modal
                        $('#modalSupplierAddForm').modal('hide');

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

    const printSupplier =() =>{
        return "print";
    }

    const deleteSupplier =(rowOb, rowInd) =>{
        const userConfirm = confirm('Do you want to delete this Supplier \n' + rowOb.name);
    
        if (userConfirm) {
            let serverResponse = ajaxRequestBody("/supplier", "DELETE", rowOb);
            if (serverResponse == "OK") {
                alert('Delete Successfully......!' );
                //need to refresh table and form
                refreshSupplierTable();
    
    
            } else {
                alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
            }
        }
    }

   