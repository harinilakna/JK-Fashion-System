//Acess rowser onload event
window.addEventListener('load',()=>{
     
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/supplierpayment");
    console.log(userPrivilege);

    //call table refresh function
    refreshSupplierPaymentTable();

    //call form refresh function
    refreshSupplierPaymentForm();
   
})

//create function for refresh table record
const refreshSupplierPaymentTable = () =>{
  

 //  ..................using common.js file function create post.........................
 supPayments = ajaxGetRequest("/supplierpayment/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function
 const displayProperty = [
                         {property: getSupplier, datatype:'function'}, 
                         {property:'bill_no', datatype:'string'} ,
                         {property:getTotal, datatype:'function'} ,
                         {property:getTotalPaidAmount, datatype:'function'} ,
                         {property: getTotalBalanceAmount, datatype:'function'} ,
                         {property:'cheque_no', datatype:'string'} ,
                         {property:'payment_date', datatype:'string'} ,
                        {property:'transfer_reference_id', datatype:'string'} ,
                         {property: getPaymentType, datatype:'function'}, 
                          {property:'description', datatype:'string'} ,
                         {property:getPaymentStatus, datatype:'function'},
                    
                        
                        ];
                        
         //call fill data into table function
         //fillDataIntoTable(tableid, dataList, display property list, refillfunctionname, deletefunctionname, printfunctionname,button visibility)
         fillDataIntoTable(tableSupPayment, supPayments ,displayProperty,refillSuppaymentForm,deleteSuppayment, printSupPayment, true,userPrivilege); //true use to display button
 

$('#tableSupPayment').dataTable({
     retrieve: true,
    responsive: true,
    scrollX: true,
    scrollY: '300px'
});

}


const getSupplier = (rowOb) =>{

   return rowOb.supplier_id.name;   
 }

 const getTotal = (rowOb) =>{

    return parseFloat(rowOb.total_amount).toFixed(2);

  }

  const getTotalPaidAmount = (rowOb) =>{

    return parseFloat(rowOb.total_paid_amount).toFixed(2);

  }

  const getTotalBalanceAmount = (rowOb) =>{

    return parseFloat(rowOb.total_balance_amount).toFixed(2);

  }




 const getPaymentStatus = (rowOb) =>{
       console.log('status')
    if (rowOb.payment_status_id.name == 'Pending') {
        return '<p class= "btn btn-sm btn-outline-success mt-2">' + rowOb.payment_status_id.name +'</p>';
    }
    if (rowOb.payment_status_id.name == 'Done') {
        return '<p class = "btn btn-sm btn-outline-danger mt-2">' + rowOb.payment_status_id.name +'</p>';
    }
    
    }

     const getPaymentType = (rowOb) =>{
       console.log('status')
    if (rowOb.payment_type_id.name == 'Cash') {
        return  rowOb.payment_type_id.name;
    }
    if (rowOb.payment_type_id.name == 'Cheque') {
        return  rowOb.payment_type_id.name ;
    }
     if (rowOb.payment_type_id.name == 'Online_transfer') {
        return rowOb.payment_type_id.name;
    }
    
    }


 
     const filterGrn  = () =>{

        grnBySupplier = ajaxGetRequest("/grn/listgrnbysupplier/" + JSON.parse(selectSupplier.value).id );
        fillDataIntoSelect( selectGRN, 'Select Grn', grnBySupplier, 'grn_no','');
    
    }



     const refreshSupplierPaymentForm =() =>{
        //create empty object
        supplierpayment = {};
    
        supplierpayment.supplierPaymentHasGrnList = [];


        suppliers = ajaxGetRequest("/supplier/findall");
        fillDataIntoSelect( selectSupplier, 'Select Supplier', suppliers, 'name');
        selectSupplier.disabled = false;

        // fillDataIntoSelect( selectPaymentType, 'Select Payment Type', [], 'payment_type_id', 'name');

        // selectPaymentType.disabled = false;

        paymenttype = ajaxGetRequest("/paymentType/findall");
        fillDataIntoSelect( selectPaymentType, 'Select Payment type', paymenttype, 'name');
        selectPaymentType.disabled = false;

        paymentstatus = ajaxGetRequest("/paymentstatus/findall");
        fillDataIntoSelect(selectPaymentStatus, 'Select Status', paymentstatus, 'name', "Pending" );

        supplierpayment.payment_status_id = JSON.parse(selectPaymentStatus.value); 


        selectPaymentStatus.style.border = "2px solid green";

       
        textBillNo.value = '';
      
        textChequeNo.value = '';
        textTransferReferenceId.value = '';
        textPaymentDate.value = '';
        textDescription.value = '';

        textBillNo.style.border = '1px solid #ced4da';
        textChequeNo.style.border = '1px solid #ced4da';
        textTransferReferenceId.style.border = '1px solid #ced4da';
        textPaymentDate.style.border = '1px solid #ced4da';
        textDescription.style.border = '1px solid #ced4da';




// -------------------------------------------------------------------------------------------------------------------
        //  //set min value and max value
        // let currentDate = new Date();
        // let maxDate = new Date();
        // // let minDate = new Date();don't have to put max and min date both can choose one
       
        //  let minMonth = currentDate.getMonth() + 1;
        //  if (minMonth < 10) {
        //     minMonth = '0' +  minMonth;
        //  }

        // let minDay = currentDate.getDate();
        // if (minDay < 10)
        // {
        //     minDay ='0' + minDay;
        // }   
     
        // textRequiredDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;
        
       
        
        // maxDate.setDate(maxDate.getDate() + 30);

        // let maxDay = maxDate.getDate();
        // if (maxDay < 10) {
        //     maxDay ='0' + maxDay;
        // } 

        // let maxMonth = maxDate.getMonth() + 1;
        // if (maxMonth < 10) {
        //     maxMonth = '0' + maxMonth;
        // } 
       
        // textRequiredDate.max = maxDate.getFullYear()+ '-' + maxMonth + '-' + maxDay;

        // // ---------------------------------------------------------------

     

        btnUpdateSupPayment.disabled = true;
         $("#btnUpdateSupPayment").css("cursor","not-allowed");

        if(userPrivilege.insert) {
            btnAddSupPayment.disabled = "";
         $("#btnAddSupPayment").css("cursor","pointer");
        }else{
            btnAddSupPayment.disabled = true;
            $("#btnAddSupPayment").css("cursor","not-allowed");  
        }


        //call refresh innerform it need to be refresh with the form
        refreshInnerGrnFormAndTable();


             


    }


     // create function for check form Error
     const checkError = () => {
       
        //need to check all required property or field
        let errors = '';
    
        if (supplierpayment.bill_no == null) {
            errors = errors + 'please add bill number..! \n';       
        }


        if (supplierpayment.supplier_id == null) {
            errors = errors + 'please select supplier...! \n';     
        }


        if ( supplierpayment.supplierPaymentHasGrnList.length == 0) {
            errors = errors + 'please Add order Material...! \n';           
        }
         
       return errors;

}
 //create function for add button
 const buttonSupPaymentAdd = () =>{
    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {
    // alert('No Errors');
    //2.need to get user confirmation
    let userConfirm = window.confirm('Are you sure to add this supplier payment?\n'
    + '\n Supplier payment bill No is : ' + supplierpayment.bill_no);

    if(userConfirm){
    //3.pass data into backend
        // call ajaxRequestBody Function
        //ajaxRequestBody("/url" , "METHOD", object)
    let serverResponse = ajaxRequestBody("/supplierpayment", "POST", supplierpayment);

    //4.check backend response
    if (serverResponse == 'OK') {
    // if (new RegExp ('^[0-9]{8}$').test(serverResponse)) {
        alert('Save Successfully......!' );
        //need to refresh table and form
        
        refreshSupplierPaymentTable();
        refreshSupplierPaymentForm();
        formSupplierPayment.reset();

        //need to hide modal
        $('#modalSupPaymentForm').modal('hide');

    } else {
        alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
    }
}  
    } else {
        alert('form has some errors \n' + formErrors)
    }
}



const refillSuppaymentForm =(rowOb,rowInd) =>{
    $('#modalSupPaymentForm').modal('show');
   

    supplierpayment = JSON.parse(JSON.stringify(rowOb));
    oldsupplierpayment = JSON.parse(JSON.stringify(rowOb));

   
    fillDataIntoSelect( selectSupplier, 'Select Supplier*', suppliers, 'name', supplierpayment.supplier_id.name);
    selectSupplier.disabled = true;

    //   paymenttype = ajaxGetRequest("/paymentType/findall");
        fillDataIntoSelect( selectPaymentType, 'Select Payment type', paymenttype, 'name');
        selectPaymentType.disabled = false;

        // paymentstatus = ajaxGetRequest("/paymentstatus/findall");
        fillDataIntoSelect(selectPaymentStatus, 'Select Status', paymentstatus, 'name', supplierpayment.payment_status_id.name );

 //need to set default color
        textBillNo.value = supplierpayment.bill_no;
        textTotalAmount.value =  supplierpayment.total_amount;
        textPaidAmount.value =  supplierpayment.total_paid_amount;

        textBalanceAmount.value = supplierpayment.total_balance_amount;

         textPaymentDate.value = supplierpayment.payment_date;


         if(supplierpayment.cheque_no != null)
            textChequeNo.value = supplierpayment.cheque_no ; else textChequeNo.value = ""; 

          if(supplierpayment.description != null)
            textDescription.value = supplierpayment.description ; else textDescription.value = ""; 
          
          if(supplierpayment.transfer_reference_id != null)
            textTransferReferenceId.value = supplierpayment.transfer_reference_id ; else textTransferReferenceId.value = ""; 


   
    //set valid color for element  


    btnAddGrnMaterial.disabled = true;
     $("#btnAddGrnMaterial").css("cursor","not-allowed");
     

     if(userPrivilege.update) {
        btnUpdateGrnMaterial.disabled = "";
     $("#btnUpdateGrnMaterial").css("cursor","pointer");
       }else{
        btnUpdateGrnMaterial.disabled = true;
           $("#btnUpdateGrnMaterial").css("cursor","not-allowed");  
       }


       refreshInnerGrnFormAndTable();
}


    //define method for check updates
    const checkUpdate = ()=>{
        let updates = "";

        
        if(supplierpayment.supplier_id.name != oldsupplierpayment.supplier_id.name){
            updates = updates + "supplier is change \n";
        }

    
        if(supplierpayment.payment_date != oldsupplierpayment.payment_date){
            updates = updates + "payment date is change \n";
        }
    
    
        if(supplierpayment.description != oldsupplierpayment.description){
            updates = updates + "Note is change \n";
        }
    
        if(supplierpayment.total_amount != oldsupplierpayment.total_amount){
            updates = updates + "Total is change \n";
        }
    
        
        if(supplierpayment.payment_status_id.name != oldsupplierpayment.payment_status_id.name){
            updates = updates + "status is change \n";
        }
    
    
 
        if(supplierpayment.supplierPaymentHasGrnList.length != oldsupplierpayment.supplierPaymentHasGrnList.length){
            updates = updates + "Purchase order material is change \n";
        }else{
            let extMaterialcount = 0;
            for(const newOrderitem of supplierpayment.supplierPaymentHasGrnList){
                for(const oldOrderitem of oldsupplierpayment.supplierPaymentHasGrnList){
    
                    if(newOrderitem.grn_id.id == oldOrderitem.grn_id.id  && newOrderitem.total_amount == oldOrderitem.paid_amount && newOrderitem.balance_amount == oldOrderitem.line_cost){
                        extMaterialcount = extMaterialcount + 1;
    
                    }
    
                }
            }
    
            if(extMaterialcount != supplierpayment.supplierPaymentHasGrnList.length ){
    
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
                        let updateServicesResponses = ajaxRequestBody("/supplierpayment","PUT", supplierpayment);
                        if (updateServicesResponses == "OK") {
                            alert('Update Successfully......!' );
                            //need to refresh table and form
                           refreshSupplierPaymentTable();
        refreshSupplierPaymentForm();
        formSupplierPayment.reset();

        //need to hide modal
        $('#modalSupPaymentForm').modal('hide');
    
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
    


    const deleteSuppayment =(rowOb) =>{
        const userConfirm = confirm('Do you want to delete this Purchase order \n' + rowOb.bill_no);
    
        if (userConfirm) {
            let serverResponse = ajaxRequestBody("/supplierpayment", "DELETE", rowOb);
            if (serverResponse == "OK") {
                alert('Delete Successfully......!' );
                //need to refresh table and form
                refreshSupplierPaymentTable();
    
    
            } else {
                alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
            }
        }
    }
    const printSupPayment =() =>{
        return "print SupplierPayment";
    }
   


    //define function for refresh inner form and table
    const refreshInnerGrnFormAndTable = () =>{
     
        // innerform
       grnpayment= {};


        
        if (selectSupplier.value != "" ) {
            grnBySupplier = ajaxGetRequest("/grn/listgrnbysupplier/" + JSON.parse(selectSupplier.value).id );
            fillDataIntoSelect( selectGRN, 'Select GRN', grnBySupplier, 'grn_no');     
        } else {
            fillDataIntoSelect( selectGRN, 'Select GRN', [], 'grn_no');
        }
        selectGRN.disabled = false;

       
         textGrnTotalPrice.value = '';
         textGrnPaidPrice.value = '';
         textGrnBalance.value = '';
         
        
         textGrnTotalPrice.style.border = '1px solid #ced4da';
         textGrnPaidPrice.style.border = '1px solid #ced4da';
         textGrnBalance.style.border = '1px solid #ced4da';

         //innerform end

        //  inner table start
 
        let tablecol = [{property: getGrnNumber, datatype:'function'} ,
        {property:getGrnTotalPrice, datatype:'function'},
        {property:getGrnPaidPrice, datatype:'function'},
        {property:getGrnBalance, datatype:'function'},
        ];

         //need to refresh inner table
         fillDataIntoInnerTable(tableGrnPayment,supplierpayment.supplierPaymentHasGrnList, tablecol, refillInnerGrnForm,deleteInnerGrnPayment, true);
         
        //  inner table end

 
     } 
     
     

const getGrnNumber = (ob) =>{
    return ob.grn_id.grn_no;
}

const getGrnTotalPrice = (ob) =>{getGrnTotalPrice
    return parseFloat(ob.total_amount).toFixed(2);
}

const getGrnPaidPrice = (ob) =>{
    return parseFloat(ob.paid_amount).toFixed(2);
}

const getGrnBalance = (ob) =>{
    return ob.balance_amount;
}
 

// ------------------------------------------------------

       
const refillInnerGrnForm =(rowob , rowid) =>{
    

        innerRowid = rowid

        $('#modalSupPaymentForm').modal('show');

        if (selectSupplier.value != "" ) {
            grnBySupplier = ajaxGetRequest("/grn/listbysuppliergrn/" + JSON.parse(selectSupplier.value).id );
            fillDataIntoSelect( selectGRN, 'Select GRN', grnBySupplier, 'grn_no',rowob.grn_id.grn_no);     
        } else {
            fillDataIntoSelect( selectGRN, 'Select GRN', [], 'grn_no',rowob.grn_id.grn_no);   
        }
        selectGRN.disabled = true;


         textGrnTotalPrice.value = rowob.total_amount
         textGrnPaidPrice.value = parseFloat(rowob.paid_amount).toFixed(2);
         textGrnBalance.value = parseFloat(rowob.balance_amount).toFixed(2);
       
    }


    //  check material is already exists
    const generateGrnPrice = () => {
    console.log("call generate total price");

    let selectedGRN = JSON.parse(selectGRN.value);

        let extIndex = supplierpayment.supplierPaymentHasGrnList.map(supgrn => supgrn.grn_id.id).indexOf(selectedGRN.id);


    if (extIndex != -1) {
        alert("Grn Already exist....");
        btnAddSupPayment.disabled = true;
    } else if (selectedGRN != null) {
        console.log(selectedGRN);

        // VALIDATE AND ASSIGN TOTAL AMOUNT TO OBJECT
        textGrnTotalPrice.value = parseFloat(selectedGRN.net_amount).toFixed(2);
        console.log("grn value: " + textGrnTotalPrice.value);
        if (/^[1-9][0-9]{0,7}[.][0-9]{2}$/.test(textGrnTotalPrice.value)) {
            grnpayment.total_amount = textGrnTotalPrice.value;
            textGrnTotalPrice.style.border = '2px solid green';
        }

        // VALIDATE AND ASSIGN BALANCE AMOUNT TO OBJECT
        textGrnBalance.value = parseFloat(selectedGRN.balance_amount).toFixed(2);
        console.log("balance: " + textGrnBalance.value);
        if (/^[0-9][0-9]{0,7}[.][0-9]{2}$/.test(textGrnBalance.value)) {
            textGrnBalance.style.border = '2px solid green';
        }

        // VALIDATE AND ASSIGN PAYMENT AMOUNT TO OBJECT
        textGrnPaidPrice.value = parseFloat(textGrnBalance.value).toFixed(2);
        if (/^[1-9][0-9]{0,7}[.][0-9]{2}$/.test(textGrnPaidPrice.value)) {
            grnpayment.paid_amount = textGrnPaidPrice.value;
            textGrnPaidPrice.style.border = '2px solid green';

            grnpayment.balance_amount = parseFloat(textGrnBalance.value - textGrnPaidPrice.value).toFixed(2);
        }
    }
};


const checkPaymentValue = () => {

    const payingAmount = parseFloat(textGrnPaidPrice.value);
    const balance = parseFloat(textGrnBalance.value);

    console.log("calling check payment method " + typeof(payingAmount) + payingAmount +" < "+ typeof(balance) + balance )

    if (payingAmount > balance){
        alert("please check the balance amount..!");
        textGrnPaidPrice.style.border = '2px solid green';
        textGrnPaidPrice.value = balance.toFixed(2);
         grnpayment.paid_amount  = textGrnPaidPrice.value;
        generateNewBalance();
    }
    else{
        if(new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(textGrnPaidPrice.value)){
            textGrnPaidPrice.value = payingAmount.toFixed(2);
             grnpayment.paid_amount = textGrnPaidPrice.value;
            textGrnPaidPrice.style.border = '2px solid green';
            generateNewBalance();
        }
        else{
            textGrnPaidPrice.style.border = '2px solid red';
            grnpayment.paid_amount = null;
            grnpayment.balance_amount = null;
        }
    }
}



    const generateNewBalance = () => {

    newPaymentValue = parseFloat(textGrnPaidPrice.value);
    currentBalance = parseFloat(textGrnBalance.value);

    newBalance  = currentBalance - newPaymentValue;
    grnpayment.balance_amount = newBalance.toFixed(2);
    console.log("generate new balance method :" + newBalance)

    return grnpayment.balance_amount;

}



    const checkInnerGrnFormError = () =>{

        let errors = "";

        if(grnpayment.grn_id == null){
            errors = errors + "Please Select GRN..!\n";
         }

         if(grnpayment.total_amount == null){
            errors = errors + "Please add total price..!\n";
         }

        if(grnpayment.paid_amount == null){
            errors = errors + "Please add paid price..!\n";
         }

        return errors;

    }


    const buttonGrnAdd = () =>{

        console.log("add inner item");
        //need to check errors
        let errors  = checkInnerGrnFormError();

        if(errors == ""){

            let userConfirm = confirm("Are you sure to add following Grn order?\n" + "\nGrn No" + grnpayment.grn_id.grn_no +"\n Total Price : " + grnpayment.total_amount +"\n Paid price : " + grnpayment.paid_amount +"\n Balance Amount : " + grnpayment.balance_amount );
            if(userConfirm){
                alert ("Grn Payment Added Successfully..!");
               
                supplierpayment.supplierPaymentHasGrnList.push(grnpayment);
                console.log("Grn ADD button:" + grnpayment)
                refreshInnerGrnFormAndTable();
                updateAllGrnAmount();
            }


        }else{

            alert ("Grn payment Not Successfully Added..!\n" + errors); 
           

        }      

    }


    

   const updateAllGrnAmount = () => {
    let totalAmount = 0.00;
    let totalBalanceAmount = 0.00;
    let totalPaidAmount = 0.00;

    supplierpayment.supplierPaymentHasGrnList.forEach(element => {
        totalAmount += parseFloat(element.total_amount);
        totalBalanceAmount += parseFloat(element.balance_amount);
        totalPaidAmount += parseFloat(element.paid_amount);
    });

    if (totalAmount === 0.00) {
        textTotalAmount.value = 'Bill Total';
        textTotalAmount.style.border = '1px solid #ced4da';
        textTotalAmount.disabled = true;
        supplierpayment.total_amount = null;
        supplierpayment.total_paid_amount = null;
        supplierpayment.total_balance_amount = null;
    } else {
        textTotalAmount.disabled = false;
        textTotalAmount.value = totalAmount.toFixed(2);
        textTotalAmount.style.border = '2px solid green';
         supplierpayment.total_amount  = totalAmount.toFixed(2);

        // Set paid and balance amounts
         supplierpayment.total_paid_amount = totalPaidAmount.toFixed(2);
        supplierpayment.total_balance_amount = totalBalanceAmount.toFixed(2);
    }

    // Optionally update UI elements for paid and balance if they exist
    if (textPaidAmount) {
        textPaidAmount.value = totalPaidAmount.toFixed(2);
    }
    if (textBalanceAmount) {
        textBalanceAmount.value = totalBalanceAmount.toFixed(2);
    }
};


    

    
    const buttonGrnUpdate = () =>{
       
        if(textGrnPaidPrice.value !=  supplierpayment.supplierPaymentHasGrnList[innerRowid].paid_amount){

            let userConfirm = confirm("are you sure to update...?");

            if(userConfirm){
                supplierpayment.supplierPaymentHasGrnList[innerRowid].paid_amount = textGrnPaidPrice.value;

                refreshInnerGrnFormAndTable();
            }

        }else{
            alert("Nothing updated.....!")
        }
        

       }
   

       const deleteInnerGrnPayment = (rowob , rowind) =>{

        console.log("deleted inner grn");

       let userConfirm = confirm('Are you sure to remove this?\n' + "Material Name :" + rowob.grn_id.grn_no);


       if(userConfirm){
        supplierpayment.supplierPaymentHasGrnList.splice(rowind, 1);
        alert("remove Successfly..!");
        refreshInnerGrnFormAndTable();
       }


    }



