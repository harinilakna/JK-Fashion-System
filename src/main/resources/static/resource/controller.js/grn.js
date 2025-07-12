//Acess rowser onload event
window.addEventListener('load',()=>{
     
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/purchase_order");
    console.log(userPrivilege);

    //call table refresh function
    refreshGrnTable();

    //call form refresh function
    refreshGrnForm();
   
})

//create function for refresh table record
const refreshGrnTable = () =>{
  

 //  ..................using common.js file function create post.........................
 allGrn = ajaxGetRequest("/grn/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function
 const displayProperty = [
                         {property:'grn_no', datatype:'string'} ,
                         {property: getSupplier, datatype:'function'},
                         {property:'supplier_billno', datatype:'string'} ,                       
                         {property:getPurchaseNo, datatype:'function'},
                         {property:getMaterials,datatype:'function'},
                         {property:'recieved_date',datatype:'string'},
                         {property:getDiscount,datatype:'function'},
                         {property:getNetAmount,datatype:'function'},
                         {property:getTotalAmount,datatype:'function'},
                         {property:getPaidAmount,datatype:'function'},
                         {property: getGrnStatus, datatype:'function'}
                        ];
                        
         //call fill data into table function
         //fillDataIntoTable(tableid, dataList, display property list, refillfunctionname, deletefunctionname, printfunctionname,button visibility)
         fillDataIntoTable(tableGrn, allGrn ,displayProperty,refillGrn,deleteGrn, printGrn, true,userPrivilege); //true use to display button
 
      
      

      //disable delete button after deleting record
      allGrn.forEach((element, index) => {
        if(element.grn_status_id.name == 'Canceled'){
            tableGrn.children[1].children[index].children[11].children[1].disabled = true; //you can also use disabled
            
        }
       
    }); 


      //calljQuery data table
      $('#tableGrn').dataTable({
        "responsive": true,
       "scrollX": true, // Enable horizontal scrollbar
       "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
   });
}

const getSupplier = (rowOb) =>{

   return rowOb.supplier_id.name;   
 }


const getPurchaseNo = (rowOb) =>{

   return rowOb.purchase_order_id.code;   
 }



 const getGrnStatus = (rowOb) =>{
       console.log('status')
    if (rowOb.grn_status_id.name == 'Received') {
        return '<p class= "btn btn-sm btn-outline-success mt-2">' + rowOb.grn_status_id.name +'</p>';
    }
    if (rowOb.grn_status_id.name == 'Canceled') {
        return '<p class = "btn btn-sm btn-outline-danger mt-2">' + rowOb.grn_status_id.name +'</p>';
    }
    
    }


     const getMaterials = (rowOb) =>{
        console.log('Materials');

        let SupMaterial = "";
        rowOb.grnHasMaterialList.forEach((element,index) =>{
            if (rowOb.grnHasMaterialList.length-1 == index) {
                SupMaterial = SupMaterial + element.material_id.name;
            } else {
                SupMaterial = SupMaterial + element.material_id.name + ", <br>";
            }
            
        });
        return SupMaterial;
   
    
     }


     const getDiscount = (rowOb) =>{
    
      return parseFloat(rowOb.discount_rate).toFixed(2);
    
     }

     const getTotalAmount = (rowOb) =>{
        console.log("getTotalAmount: " + parseFloat(rowOb.grandtotal).toFixed(2));
        return parseFloat(rowOb.grandtotal).toFixed(2);

      }

       const getNetAmount = (rowOb) =>{
        console.log("getNetAmount: " + parseFloat(rowOb.net_amount).toFixed(2));
        return parseFloat(rowOb.net_amount).toFixed(2); 
      
       }

       const getPaidAmount = (rowOb) =>{
    
        return parseFloat(rowOb.paid_amount).toFixed(2); 
      
       }

    
 
     const filterpurchaseorder = () =>{
        PurchaseOrderBySupplier = ajaxGetRequest("/purchaseorder/listPObysupplier/" + JSON.parse(selectSupplier.value).id );
        fillDataIntoSelect( selectPorder, 'Select Purchase order', PurchaseOrderBySupplier, 'code','');    
    }

     const filterMaterial  = () =>{

        materialsByPorder = ajaxGetRequest("/material/listbypurchaseorder/" + JSON.parse(selectPorder.value).id );
        fillDataIntoSelect( selectGrnMaterial, 'Select Material', materialsByPorder, 'name','');

    }
    

     const refreshGrnForm =() =>{
        //create empty object
        grn = {};
    
        grn.grnHasMaterialList = [];


        suppliers = ajaxGetRequest("/supplier/findall");
        fillDataIntoSelect( selectSupplier, 'Select Supplier*', suppliers, 'name');
        selectSupplier.disabled = false;

        fillDataIntoSelect( selectPorder, 'Select Purchase order*', [], 'purchase_order_id.code','');
        selectPorder.disabled = false;

        Grnstatus = ajaxGetRequest("/grnstatus/findall");
        fillDataIntoSelect(selectStatus, 'Select Status*', Grnstatus, 'name', "Received" );

        grn.grn_status_id = JSON.parse(selectStatus.value); 


        selectStatus.style.border = "2px solid green";

       

        textSupBillNo.value = '';
        textRecievedDate.value = '';
        textGrandtotal.value = '';
        textNetAmount.value = '';
        textPaidAmount.value = '';
        textNote.value = '';
            

        textSupBillNo.style.border = '1px solid #ced4da';
        textRecievedDate.style.border = '1px solid #ced4da';
        textGrandtotal.style.border = '1px solid #ced4da';
        textNetAmount.style.border = '1px solid #ced4da';
        textPaidAmount.style.border = '1px solid #ced4da';
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
     
        textRecievedDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;
        
       
        
        maxDate.setDate(maxDate.getDate() + 30);

        let maxDay = maxDate.getDate();
        if (maxDay < 10) {
            maxDay ='0' + maxDay;
        } 

        let maxMonth = maxDate.getMonth() + 1;
        if (maxMonth < 10) {
            maxMonth = '0' + maxMonth;
        } 
       
        textRecievedDate.max = maxDate.getFullYear()+ '-' + maxMonth + '-' + maxDay;

        // ---------------------------------------------------------------

     

        btnUpdateGrn.disabled = true;
         $("#btnUpdateGrn").css("cursor","not-allowed");

        if(userPrivilege.insert) {
            btnAddGrn.disabled = "";
         $("#btnAddGrn").css("cursor","pointer");
        }else{
            btnAddGrn.disabled = true;
            $("#btnAddGrn").css("cursor","not-allowed");  
        }


        //call refresh innerform it need to be refresh with the form
         refreshInnerMaterialFormAndTable();


    }


     // create function for check form Error
     const checkError = () => {
       
        //need to check all required property or field
        let errors = '';
    
        if (grn.supplier_billno == null) {
            errors = errors + 'please add bill no..! \n';       
        }

        if (grn.recieved_date == null) {
            errors = errors + 'please select Reuired date..! \n';     
        }

        if (grn.supplier_id == null) {
            errors = errors + 'please select supplier...! \n';     
        }

        if (grn.grn_status_id == null) {
            errors = errors + 'please select Status...! \n';     
        }

        
        if (grn.grandtotal == null) {
            errors = errors + 'please select gran total..! \n';     
        }

        // if (grn.net_amount == null) {
        //     errors = errors + 'please select net amount...! \n';     
        // }

        //  if (grn.paid_amount == null) {
        //     errors = errors + 'please select paid amount..! \n';     
        // }

          if (grn.purchase_order_id == null) {
            errors = errors + 'please select purchase order...! \n';     
        }


        if ( grn.grnHasMaterialList.length == 0) {
            errors = errors + 'please Add order Material...! \n';           
        }
         
       return errors;

}
 //create function for add button
 const buttonGrnAdd = () =>{
    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {
    // alert('No Errors');
    //2.need to get user confirmation
    let userConfirm = window.confirm('Are you sure to add this Good recieve Note?\n'
    + '\n GRN No is : ' + grn.grn_no);

    if(userConfirm){
    //3.pass data into backend
        // call ajaxRequestBody Function
        //ajaxRequestBody("/url" , "METHOD", object)
    let serverResponse = ajaxRequestBody("/grn", "POST", grn);

    //4.check backend response
    if (serverResponse == 'OK') {
    // if (new RegExp ('^[0-9]{8}$').test(serverResponse)) {
        alert('Save Successfully......!' );
        //need to refresh table and form
        refreshGrnForm();
        refreshGrnTable();
        formGrn.reset();

        //need to hide modal
        $('#modalGrnForm').modal('hide');

    } else {
        alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
    }
}  
    } else {
        alert('form has some errors \n' + formErrors)
    }
}



const refillGrn =(rowOb,rowInd) =>{
    $('#modalGrnForm').modal('show');
    // employee = rowOb;
    // oldemployee = rowOb;

    grn = JSON.parse(JSON.stringify(rowOb));
    oldgrn = JSON.parse(JSON.stringify(rowOb));

   
    fillDataIntoSelect( selectSupplier, 'Select Supplier', suppliers, 'name', grn.supplier_id.name);
    selectSupplier.disabled = true;

    PoBySupplier = ajaxGetRequest("/purchaseorder/listPObysupplier/" + JSON.parse(selectSupplier.value).id );
    fillDataIntoSelect( selectPorder, 'Select purchase order', PoBySupplier, 'purchase_order_id',grn.purchase_order_id.code);

   grnstatus = ajaxGetRequest("/postatus/findall");
    fillDataIntoSelect(selectStatus, 'Select Status', grnstatus, 'name', grn.grn_status_id.name );

    //need to set default color
    textSupBillNo.value = grn.supplier_billno;
    textGrnNo.value = grn.grn_no
    textRecievedDate.value = grn.required_date;
    textGrandtotal.value =  grn.grandtotal;
    textNetAmount.value =  grn.net_amount;
    textPaidAmount.value =  grn.paid_amount;
    textDiscount.value = grn.discount_rate;                  
 
    //set valid color for element  


    buttonGrnAdd.disabled = true;
     $("#buttonGrnAdd").css("cursor","not-allowed");
     

     if(userPrivilege.update) {
        buttonGrnUpdate.disabled = "";
     $("#buttonGrnUpdate").css("cursor","pointer");
       }else{
        btnUpdateGrn.disabled = true;
           $("#buttonGrnUpdate").css("cursor","not-allowed");  
       }


       refreshInnerMaterialFormAndTable();
}


    //define method for check updates
    const checkUpdate = ()=>{
        let updates = "";

        
        if(grn.supplier_id.name != oldgrn.supplier_id.name){
            updates = updates + "supplier is change \n";
        }

        if(grn.purchase_order_id.code != oldgrn.purchase_order_id.code){
            updates = updates + "purcharse is change \n";
        }
    
        if(grn.recieved_date != oldgrn.recieved_date){
            updates = updates + "Required date is change \n";
        }
    
    
        if(grn.description != oldgrn.description){
            updates = updates + "Note is change \n";
        }
    
        if(grn.total_cost != oldgrn.total_cost){
            updates = updates + "Total is change \n";
        }
    
        
        if(grn.grn_status_id.name != oldgrn.grn_status_id.name){
            updates = updates + "status is change \n";
        }
    
    
 
        if(grn.grnHasMaterialList.length != oldgrn.grnHasMaterialList.length){
            updates = updates + "Grn material is change \n";
        }else{
            let extMaterialcount = 0;
            for(const newGrnitem of grn.grnHasMaterialList){
                for(const oldGrnitem of oldgrn.grnHasMaterialList){
    
                    if(newGrnitem.material_id.id == oldGrnitem.material_id.id  && newGrnitem.quantity == oldGrnitem.quantity && newGrnitem.line_cost == oldGrnitem.line_cost && newGrnitem.unit_price == oldGrnitem.unit_price ){
                        extMaterialcount = extMaterialcount + 1;
    
                    }
    
                }
            }
    
            if(extMaterialcount != grn.grnHasMaterialList.length ){
    
         updates = updates + "Material is change \n";
    
            }
        }
    
    
        return updates;
    }
    
       
        const buttonGrnUpdate = () =>{
       
        //check from error
            let error = checkError();
            if(error == ""){
                //check form update
                let updates = checkUpdate();
                if(updates != ""){
                    //cell put service
                    let userConfirm = confirm("Are you sure following changer...? \n" + updates);
                    if(userConfirm){
                        let updateServicesResponses = ajaxRequestBody("/grn","PUT", grn);
                        if (updateServicesResponses == "OK") {
                            alert('Update Successfully......!' );
                            //need to refresh table and form
                             //need to refresh table and form
                        refreshGrnForm();
                        refreshGrnTable();
                        formGrn.reset();
                            //need to hide modal
                            $('#modalGrnForm').modal('hide');
    
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
    


    const deleteGrn =(rowOb) =>{
        const userConfirm = confirm('Do you want to delete this Purchase order \n' + rowOb.code);
    
        if (userConfirm) {
            let serverResponse = ajaxRequestBody("/purchaseorder", "DELETE", rowOb);
            if (serverResponse == "OK") {
                alert('Delete Successfully......!' );
                //need to refresh table and form
                refreshGrnTable();
    
    
            } else {
                alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
            }
        }
    }
    const printGrn =() =>{
        return "print GRN";
    }
   


    //define function for refresh inner form and table
    const refreshInnerMaterialFormAndTable = () =>{
     
        // innerform
      grnitem = {};
        
        if (selectPorder.value != "" ) {
            materialsByPurchaseOrder = ajaxGetRequest("/material/listbypurchaseorder/" + JSON.parse(selectPorder.value).id );
            fillDataIntoSelect( selectGrnMaterial, 'Select Material', materialsByPurchaseOrder, 'name');     
        } else {
            fillDataIntoSelect( selectGrnMaterial, 'Select Material', [], 'name');
        }
        selectGrnMaterial.disabled = false;

       
         textUnitPrice.value = '';
         textMaterialQuantity.value = '';
         textLineCost.value = '';

        
         textMaterialQuantity.style.border = '1px solid #ced4da';
         textUnitPrice.style.border = '1px solid #ced4da';
         textLineCost.style.border = '1px solid #ced4da';

         //innerform end

        //  inner table start
 
        let tablecol = [{property: getMaterialname, datatype:'function'} ,
        {property:getGrnQuantity, datatype:'function'},
        {property:getGrnUnitPrice, datatype:'function'},
        {property:getGrnLinePrice, datatype:'function'},
        ];

         //need to refresh inner table
         fillDataIntoInnerTable(tableGrnMaterial,grn.grnHasMaterialList, tablecol, refillInnerMaterialForm,deleteInnerMaterial, true);
         
        //  inner table end


        //get total amount
          
        // let totalAmount = 0.00;

        // grn.grnHasMaterialList.forEach(element =>{
        //    grandtotal = parseFloat(grandtotal) + parseFloat(element.line_cost);
        // })
      
        // textTotalAmount.value = parseFloat(totalAmount).toFixed(2);

        // if(totalAmount == 0.00){
        //     porder.total_cost = null;
        //     textTotalAmount.style.border = '1px solid #ced4da';

        // }else{
          
        //    textTotalAmount.style.border = '2px solid green';
        //    porder.total_cost = textTotalAmount.value;

        // }

        let totalAmount = 0.00;

        grn.grnHasMaterialList.forEach(element => {
            totalAmount += parseFloat(element.line_cost);
        });

        grn.grandtotal = totalAmount; 
        textGrandtotal.value = totalAmount.toFixed(2);

        // Ensure discount and totalAmount are numbers
        let discount = parseFloat(textDiscount.value) || 0;
        let discountedPrice = totalAmount * discount / 100;

        // Set net amount
        let netAmount = totalAmount - discountedPrice;
        textNetAmount.value = netAmount.toFixed(2);


 
     } 
     

const getMaterialname = (ob) =>{
    return ob.material_id.name;
}

const getGrnUnitPrice = (ob) =>{
    return parseFloat(ob.unit_price).toFixed(2);
}

const getGrnLinePrice = (ob) =>{
    return parseFloat(ob.line_cost).toFixed(2);
}

const getGrnQuantity = (ob) =>{
    return ob.quantity;
}
 

// ------------------------------------------------------

       
const refillInnerMaterialForm =(rowob , rowid) =>{
    

        innerRowid = rowid

        $('#modalGrnForm').modal('show');

       
        if (selectPorder.value != "") {
            materialsByPorder = ajaxGetRequest("/material/listbypurchaseorder/" + JSON.parse(selectPorder.value).id );
            fillDataIntoSelect( selectGrnMaterial, 'Select Material', materialsByPorder, 'name',rowob.material_id.name);
        } else {
            fillDataIntoSelect( selectGrnMaterial, 'Select Material', [], 'name',rowob.material_id.name);
            
        }


         selectGrnMaterial.disabled = true;

         textMaterialQuantity.value = rowob.quantity
         textUnitPrice.value = parseFloat(rowob.unit_price).toFixed(2);
         textLineCost.value = parseFloat(rowob.line_cost).toFixed(2);
       
    }


    //  check material is already exists
    const generateUnitPrice=()=>{

        let selectedMaterial = JSON.parse(selectGrnMaterial.value);
        console.log("Material Details" + selectedMaterial)

        let extIndex = grn.grnHasMaterialList.map(grnmaterial => grnmaterial.material_id.id).indexOf(selectedMaterial.id);

        if (extIndex != -1){
            alert("Material Already exist....");
            btnAddGrn.disabled = true;
        } else{

            textUnitPrice.value = parseFloat(selectedMaterial.unit_price).toFixed(2);
            grnitem.unit_price = textUnitPrice.value;
            textUnitPrice.style.border = '2px solid green';
            textUnitPrice.disabled = true;
            
            textMaterialQuantity.value  = "";
            grnitem.quantity = null ;
            textMaterialQuantity.style.border = "1px solid #ced4da";

        textLineCost.value  = "";
        grnitem.line_cost = null ;
        textLineCost.style.border = "1px solid #ced4da";

        btnAddGrn.disabled = false;

        }

        
    }

    const calculateLinePrice = () =>{
       console.log("calculate line price")
       let qyt = textMaterialQuantity.value;
       console.log("qyt: " + qyt)

       if(new RegExp("^[1-9][0-9]{0,3}$").test(qyt)){
        textLineCost.value =(parseFloat(textUnitPrice.value) * parseFloat(qyt)).toFixed(2);
        grnitem.line_cost = textLineCost.value;
        console.log("line cost: " + textLineCost.value)
        textLineCost.style.border = '2px solid green';
       }
    }

    const calculateNetAmount = () => {
        totalAmount = grn.grandtotal;
        // Ensure discount and totalAmount are numbers
        let discount = parseFloat(textDiscount.value) || 0;
        let discountedPrice = totalAmount * discount / 100;

        // Set net amount
        let netAmount = totalAmount - discountedPrice;
        textNetAmount.value = netAmount.toFixed(2);
    }



    const checkInnerFormError = () =>{

        let errors = "";

        if(grnitem.material_id == null){
            errors = errors + "Please Select material..!\n";
         }

         if(grnitem.quantity == null){
            errors = errors + "Please add material quantity..!\n";
         }

         
         if(grnitem.unit_price == null){
            errors = errors + "Please add material unit price..!\n";
         }

         
         if(grnitem.line_cost == null){
            errors = errors + "Please add material line cost..!\n";
         }

        return errors;

    }


    const buttonGrnMaterilAdd = () =>{

        console.log("add inner item");
        //need to check errors
        let errors  = checkInnerFormError();

        if(errors == ""){

            let userConfirm = confirm("Are you sure to add following Good recive note?\n" + "\nMaterial name" + grnitem.material_id.name +"\n Quantity : " + grnitem.quantity +"\n Unit price : " + grnitem.unit_price +"\n Line price : " + grnitem.line_cost );
            if(userConfirm){
                alert ("purchase order Added Successfully..!");
               
                grn.grnHasMaterialList.push(grnitem);
                console.log("Material button:" + grnitem)
                refreshInnerMaterialFormAndTable();
            }


        }else{

            alert ("GRN Not Successfully Added..!\n" + errors); 
           

        }      

    }

    

    
    const buttonGrnMaterialUpdate = () =>{
       
        let innerUpdates = "";
        
    if (textMaterialQuantity.value != grn.grnHasMaterialList[innerRowid].quantity){

        innerUpdates = innerUpdates + 'Order Quantity changed...! \n';
    }

    if (innerUpdates != ""){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the ?" + innerUpdates);
        if (userConfirmToUpdateInnerForm){
              grn.grnHasMaterialList[innerRowid].quantity = textMaterialQuantity.value;
             grn.grnHasMaterialList[innerRowid].line_cost = textLineCost.value;
              grn.grnHasMaterialList[innerRowid].unit_price = textUnitPrice.value;
            refreshInnerMaterialFormAndTable();
//             let totalAmount = 0.00;

//  grn.grnHasMaterialList.forEach(element => {
//     totalAmount += parseFloat(element.line_cost);
// });

// grn.total_cost = totalAmount; 
// textGrandtotal.value = totalAmount.toFixed(2);
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
        grn.grnHasMaterialList.splice(rowind, 1);
        alert("remove Successfly..!");
        refreshInnerMaterialFormAndTable();
       }


    }



