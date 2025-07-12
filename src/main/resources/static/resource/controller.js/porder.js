//Acess browser onload event
window.addEventListener('load',()=>{
     
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/purchase_order");
    console.log(userPrivilege);

    //call table refresh function
    refreshPOrderTable();

    //call form refresh function
    refreshPOrderForm();
   
})

//create function for refresh table record
const refreshPOrderTable = () =>{
  

 //  ..................using common.js file function create post.........................
 purchaseorders = ajaxGetRequest("/purchaseorder/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function
 const displayProperty = [
                         {property:'code', datatype:'string'} ,
                         {property: getSupplier, datatype:'function'}, 
                         {property:getMaterials,datatype:'function'},
                         {property:'required_date', datatype:'string'} ,
                         {property:getTotal, datatype:'function'} ,
                         {property: getPOStatus, datatype:'function'}
                        ];
                        
         //call fill data into table function
         //fillDataIntoTable(tableid, dataList, display property list, refillfunctionname, deletefunctionname, printfunctionname,button visibility)
         fillDataIntoTable(tablePOrder, purchaseorders ,displayProperty,refillPOForm,deletePOrder, printPOrder, true,userPrivilege); //true use to display button
 
      
      

      //disable delete button after deleting record
      purchaseorders.forEach((element, index) => {
        if(element.purchase_order_status_id.name == 'Cancel'){
            tablePOrder.children[1].children[index].children[8].children[1].disabled = true; //you can also use disabled
            
        }
       
    }); 


      //calljQuery data table
      $('#tablePOrder').dataTable({
        "responsive": true,
       "scrollX": true, // Enable horizontal scrollbar
       "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
   });
}


const getSupplier = (rowOb) =>{

   return rowOb.supplier_id.name;   
 }

 const getTotal = (rowOb) =>{

    return parseFloat(rowOb.total_cost).toFixed(2);

  }



 const getPOStatus = (rowOb) =>{
       console.log('status')
    if (rowOb.purchase_order_status_id.name == 'Requested') {
        return '<p class= "btn btn-sm btn-outline-success mt-2">' + rowOb.purchase_order_status_id.name +'</p>';
    }
    if (rowOb.purchase_order_status_id.name == 'Canceled') {
        return '<p class = "btn btn-sm btn-outline-danger mt-2">' + rowOb.purchase_order_status_id.name +'</p>';
    }
    
    }


     const getMaterials = (rowOb) =>{
        console.log('Materials')

        let SupMaterial = "";
        rowOb.porderHasMaterialList.forEach((element,index) =>{
            if (rowOb.porderHasMaterialList.length-1 == index) {
                SupMaterial = SupMaterial + element.material_id.name;
            } else {
                SupMaterial = SupMaterial + element.material_id.name + ", <br>";
            }
            
        });
        return SupMaterial;
   
    
     }



     const filterMaterial  = () =>{

        materialsBySupplier = ajaxGetRequest("/material/listbysupplier/" + JSON.parse(selectSupplier.value).id );
        fillDataIntoSelect( selectPoMaterial, 'Select Material', materialsBySupplier, 'name','');
    
    }


     const refreshPOrderForm =() =>{
        //create empty object
        porder = {};
    
        porder.porderHasMaterialList = [];


        suppliers = ajaxGetRequest("/supplier/findall");
        fillDataIntoSelect( selectSupplier, 'Select Supplier', suppliers, 'name');
        selectSupplier.disabled = false;


        POstatus = ajaxGetRequest("/postatus/findall");
        fillDataIntoSelect(selectStatus, 'Select Status', POstatus, 'name', "Requested" );

        porder.purchase_order_status_id = JSON.parse(selectStatus.value); 


        selectStatus.style.border = "2px solid green";

       
        textTotalAmount.value = 'Auomatical update';
         textTotalAmount.disabled = true;
        textRequiredDate.value = '';
        textNote.value = '';
     

        textTotalAmount.style.border = '1px solid #ced4da';
        textRequiredDate.style.border = '1px solid #ced4da';
        textNote.style.border = '1px solid #ced4da';



// -------------------------------------------------------------------------------------------------------------------
         //set min value and max value
        let currentDate = new Date();
        let maxDate = new Date();
        // let minDate = new Date();don't have to put max and min date both can choose one
       
         let minMonth = currentDate.getMonth() + 1;
         if (minMonth < 10) {
            minMonth = '0' +  minMonth;
         }

        let minDay = currentDate.getDate();
        if (minDay < 10)
        {
            minDay ='0' + minDay;
        }   
     
        textRequiredDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;
        
       
        
        maxDate.setDate(maxDate.getDate() + 30);

        let maxDay = maxDate.getDate();
        if (maxDay < 10) {
            maxDay ='0' + maxDay;
        } 

        let maxMonth = maxDate.getMonth() + 1;
        if (maxMonth < 10) {
            maxMonth = '0' + maxMonth;
        } 
       
        textRequiredDate.max = maxDate.getFullYear()+ '-' + maxMonth + '-' + maxDay;

        // ---------------------------------------------------------------

     

        btnUpdatePorder.disabled = "true";
         $("#btnUpdatePorder").css("cursor","not-allowed");

        if(userPrivilege.insert) {
            btnAddPorder.disabled = "";
         $("#btnAddPorder").css("cursor","pointer");
        }else{
            btnAddPorder.disabled = "true";
            $("#btnAddPorder").css("cursor","not-allowed");  
        }


        //call refresh innerform it need to be refresh with the form
        refreshInnerMaterialFormAndTable();


    }


     // create function for check form Error
     const checkError = () => {
       
        //need to check all required property or field
        let errors = '';
    
        if (porder.required_date == null) {
            errors = errors + 'please select Reuired date..! \n';       
        }

        if (porder.total_cost == null) {
            errors = errors + 'please add total amount..! \n';     
        }

        if (porder.supplier_id == null) {
            errors = errors + 'please select supplier...! \n';     
        }

        if (porder.purchase_order_status_id == null) {
            errors = errors + 'please select Status...! \n';     
        }

        // if ( porder.porderHasMaterialList.length == 0) {
        //     errors = errors + 'please Add order Material...! \n';           
        // }
         
       return errors;

}
 //create function for add button
 const buttonPoAdd = () =>{
    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {
    // alert('No Errors');
    //2.need to get user confirmation
    let userConfirm = window.confirm('Are you sure to add this purchase order?\n'
    + '\n Purchase order No is : ' + porder.code +  + '\n Supplier is : ' + porder.supplier_id.name  + '\n Total Amount is; ' + porder.total_cost);

    if(userConfirm){
    //3.pass data into backend
        // call ajaxRequestBody Function
        //ajaxRequestBody("/url" , "METHOD", object)
    let serverResponse = ajaxRequestBody("/purchaseorder", "POST", porder);

    //4.check backend response
    if (serverResponse == 'OK') {
    // if (new RegExp ('^[0-9]{8}$').test(serverResponse)) {
        alert('Save Successfully......!' );
        //need to refresh table and form
        refreshPOrderForm();
        refreshPOrderTable();
        formPOrder.reset();

        //need to hide modal
        $('#modalPOrderForm').modal('hide');

    } else {
        alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
    }
}  
    } else {
        alert('form has some errors \n' + formErrors)
    }
}



const refillPOForm =(rowOb,rowInd) =>{
    $('#modalPOrderForm').modal('show');
   

    porder = JSON.parse(JSON.stringify(rowOb));
    oldporder = JSON.parse(JSON.stringify(rowOb));

   
    fillDataIntoSelect( selectSupplier, 'Select Supplier*', suppliers, 'name', porder.supplier_id.name);
    selectSupplier.disabled = true;

    POstatus = ajaxGetRequest("/postatus/findall");
    fillDataIntoSelect(selectStatus, 'Select Status', POstatus, 'name', porder.purchase_order_status_id.name );

 //need to set default color
        textTotalAmount.value = porder.total_cost;
        textRequiredDate.value =  porder.required_date;
        textNote.value =  porder.note;
        
    //set valid color for element  


    btnAddPorder.disabled = "true";
     $("#btnAddPorder").css("cursor","not-allowed");
     

     if(userPrivilege.update) {
        btnUpdatePorder.disabled = "";
     $("#btnUpdatePorder").css("cursor","pointer");
       }else{
        btnUpdatePoMaterial.disabled = "true";
           $("#btnUpdatePorder").css("cursor","not-allowed");  
       }


       refreshInnerMaterialFormAndTable();
      
}


    //define method for check updates
    const checkUpdate = ()=>{
        let updates = "";

        
        if(porder.supplier_id.name != oldporder.supplier_id.name){
            updates = updates + "supplier is change \n";
        }

    
        if(porder.required_date != oldporder.required_date){
            updates = updates + "Required date is change \n";
        }
    
    
        if(porder.note != oldporder.note){
            updates = updates + "Note is change \n";
        }
    
        if(porder.total_cost != oldporder.total_cost){
            updates = updates + "Total is change \n";
        }
    
        
        if(porder.purchase_order_status_id.name != oldporder.purchase_order_status_id.name){
            updates = updates + "status is change \n";
        }
    
    
 
        if(porder.porderHasMaterialList.length != oldporder.porderHasMaterialList.length){
            updates = updates + "Purchase order material is change \n";
        }else{
            let extMaterialcount = 0;
            for(const newOrderitem of porder.porderHasMaterialList){
                for(const oldOrderitem of oldporder.porderHasMaterialList){
    
                    if(newOrderitem.material_id.id == oldOrderitem.material_id.id  && newOrderitem.quantity == oldOrderitem.quantity && newOrderitem.line_cost == oldOrderitem.line_cost){
                        extMaterialcount = extMaterialcount + 1;
    
                    }
    
                }
            }
    
            if(extMaterialcount != porder.porderHasMaterialList.length ){
    
         updates = updates + "Material is change \n";
    
            }
        }
    
    
        return updates;
    }
    
       
        const buttonPoUpdate = () =>{
       
        //check from error
            let error = checkError();
            if(error == ""){
                //check form update
                let updates = checkUpdate();
                if(updates != ""){
                    //cell put service
                    let userConfirm = confirm("Are you sure following changer...? \n" + updates);
                    if(userConfirm){
                        let updateServicesResponses = ajaxRequestBody("/purchaseorder","PUT", porder);
                        if (updateServicesResponses == "OK") {
                            alert('Update Successfully......!' );
                            //need to refresh table and form
                            refreshPOrderForm();
                            refreshPOrderTable();
                            formPOrder.reset();
                            //need to hide modal
                            $('#modalPOrderForm').modal('hide');
    
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
    


    const deletePOrder =(rowOb) =>{
        const userConfirm = confirm('Do you want to delete this Purchase order \n' + rowOb.code);
    
        if (userConfirm) {
            let serverResponse = ajaxRequestBody("/purchaseorder", "DELETE", rowOb);
            if (serverResponse == "OK") {
                alert('Delete Successfully......!' );
                //need to refresh table and form
                refreshPOrderTable();
    
    
            } else {
                alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
            }
        }
    }
    const printPOrder =() =>{
        return "printPOrder";
    }
   


    //define function for refresh inner form and table
    const refreshInnerMaterialFormAndTable = () =>{
     
        // innerform
        porderitem = {};
        
        if (selectSupplier.value != "" ) {
            materialsBySupplier = ajaxGetRequest("/material/listbysupplier/" + JSON.parse(selectSupplier.value).id );
            fillDataIntoSelect( selectPoMaterial, 'Select Material', materialsBySupplier, 'name');     
        } else {
            fillDataIntoSelect( selectPoMaterial, 'Select Material', [], 'name');
        }
        selectPoMaterial.disabled = false;

       
         textMaterialQuantity.value = '';
         textUnitPrice.value = '';
         textLineCost.value = '';
         
        
         textMaterialQuantity.style.border = '1px solid #ced4da';
         textUnitPrice.style.border = '1px solid #ced4da';
         textLineCost.style.border = '1px solid #ced4da';

        //innerform end

        //  inner table start
 
        let tablecol = [{property: getMaterialname, datatype:'function'} ,
        {property:getPoQuantity, datatype:'function'},
        {property:getPoUnitPrice, datatype:'function'},
        {property:getPoLinePrice, datatype:'function'},
        ];

         //need to refresh inner table
         fillDataIntoInnerTable(tablePOrderMaterial,porder.porderHasMaterialList, tablecol, refillInnerMaterialForm,deleteInnerMaterial, true);
         
        //  inner table end


        //get total amount
          
       let totalAmount = 0.00;

porder.porderHasMaterialList.forEach(element => {
    totalAmount += parseFloat(element.line_cost);
});

porder.total_cost = totalAmount; 
textTotalAmount.value = totalAmount.toFixed(2);

 
     } 
     
     

const getMaterialname = (ob) =>{
    return ob.material_id.name;
}

const getPoUnitPrice = (ob) =>{
    return parseFloat(ob.unit_price).toFixed(2);
}

const getPoLinePrice = (ob) =>{
    return parseFloat(ob.line_cost).toFixed(2);
}

const getPoQuantity = (ob) =>{
    return ob.quantity;
}
 

// ------------------------------------------------------

       
const refillInnerMaterialForm =(rowob , rowid) =>{
    

        innerRowid = rowid

        $('#modalPOrderForm').modal('show');

       
        if (selectSupplier.value != "") {
            materialsBySupplier = ajaxGetRequest("/material/listbysupplier/" + JSON.parse(selectSupplier.value).id );
            fillDataIntoSelect( selectPoMaterial, 'Select Material', materialsBySupplier, 'name',rowob.material_id.name);
        } else {
            fillDataIntoSelect( selectPoMaterial, 'Select Material', [], 'name',rowob.material_id.name);
            
        }

         selectPoMaterial.disabled = true;

         textMaterialQuantity.value = rowob.quantity
         textUnitPrice.value = parseFloat(rowob.unit_price).toFixed(2);
         textLineCost.value = parseFloat(rowob.line_cost).toFixed(2);
       
    }


    //  check material is already exists
    const generateUnitPrice=()=>{
        console.log("call generate unit price")
        let selectedMaterial = JSON.parse(selectPoMaterial.value);

        let extIndex = porder.porderHasMaterialList.map(pomaterial => pomaterial.material_id.id).indexOf(selectedMaterial.id);

        if (extIndex != -1){
            alert("Material Already exist....");
            btnAddPorder.disabled = true;
        } else{

            textUnitPrice.value = parseFloat(selectedMaterial.unit_price).toFixed(2);
            console.log("material value" + selectPoMaterial.value)
            porderitem.unit_price = textUnitPrice.value;
            textUnitPrice.style.border = '2px solid green';
  
            
            textMaterialQuantity.value  = "";
            porderitem.quantity = null ;
            textMaterialQuantity.style.border = "1px solid #ced4da";

        textLineCost.value  = "";
        porderitem.line_cost = null ;
        textLineCost.style.border = "1px solid #ced4da";

        btnAddPorder.disabled = false;

        }

        
    }

    const calculateLinePrice = () =>{
       let qyt = textMaterialQuantity.value;

       if(new RegExp("^[1-9][0-9]{0,3}$").test(qyt)){
        textLineCost.value =(parseFloat(textUnitPrice.value) * parseFloat(qyt)).toFixed(2);

        porderitem.line_cost = textLineCost.value;

        textLineCost.style.border = '2px solid green';
       }


    }



    const checkInnerFormError = () =>{

        let errors = "";

        if(porderitem.material_id == null){
            errors = errors + "Please Select material..!\n";
         }

         if(porderitem.quantity == null){
            errors = errors + "Please add material quantity..!\n";
         }

         
         if(porderitem.unit_price == null){
            errors = errors + "Please add material unit price..!\n";
         }

         
         if(porderitem.line_cost == null){
            errors = errors + "Please add material line cost..!\n";
         }

        return errors;

    }


    const buttonPoMaterilAdd = () =>{

        console.log("add inner item");
        //need to check errors
        let errors  = checkInnerFormError();

        if(errors == ""){

            let userConfirm = confirm("Are you sure to add following purchase order?\n" + "\nMaterial name" + porderitem.material_id.name +"\n Quantity : " + porderitem.quantity +"\n Unit price : " + porderitem.unit_price +"\n Line price : " + porderitem.line_cost );
            if(userConfirm){
                alert ("purchase order Added Successfully..!");
               
                porder.porderHasMaterialList.push(porderitem);
                console.log("Material button:" + porderitem)
                refreshInnerMaterialFormAndTable();
            }


        }else{

            alert ("Purchase order Not Successfully Added..!\n" + errors); 
           

        }      

    }

    

    
    // const buttonPoMaterialUpdate = (rowob , rowind) =>{

    //     if(textMaterialQuantity.value !=  porder.porderHasMaterialList[innerRowid].quantity){


    //         if(userConfirm){
    //             porder.porderHasMaterialList[rowind].quantity = textMaterialQuantity.value;

                

    //             refreshInnerMaterialFormAndTable();
               
    //         }
    //     }
    

    //    }

    const buttonPoMaterialUpdate = () => {

    let innerUpdates = "";

    if (textMaterialQuantity.value != porder.porderHasMaterialList[innerRowid].quantity){

        innerUpdates = innerUpdates + 'Order Quantity changed...! \n';
    }

    if (innerUpdates != ""){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the ?" + innerUpdates);
        if (userConfirmToUpdateInnerForm){
             porder.porderHasMaterialList[innerRowid].quantity = textMaterialQuantity.value;
             porder.porderHasMaterialList[innerRowid].line_cost = textLineCost.value;
             porder.porderHasMaterialList[innerRowid].unit_price = textUnitPrice.value;
            refreshInnerMaterialFormAndTable();
            let totalAmount = 0.00;

porder.porderHasMaterialList.forEach(element => {
    totalAmount += parseFloat(element.line_cost);
});

porder.total_cost = totalAmount; 
textTotalAmount.value = totalAmount.toFixed(2);
        }
    }
    else {
        alert("Noting to Update! ")
    }


}


  
       const deleteInnerMaterial = (rowob , rowind) =>{

        console.log("deleted inner item");

       let userConfirm = confirm('Are you sure to remove this?\n' + "Material Name :" + rowob.material_id.name);


       if(userConfirm){
        porder.porderHasMaterialList.splice(rowind, 1);
        alert("remove Successfly..!");
        refreshInnerMaterialFormAndTable();
       }


    }



