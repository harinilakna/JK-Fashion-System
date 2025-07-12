//Acess rowser onload event
window.addEventListener('load',()=>{
     
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/sales");
    console.log(userPrivilege);

    //call table refresh function
    refreshSaleTable();

    //call form refresh function
    refreshSaleForm();
   
})

//create function for refresh table record
const refreshSaleTable = () =>{
  

 //  ..................using common.js file function create post.........................
 allSales = ajaxGetRequest("/sales/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function
 const displayProperty = [
                         {property:'invoice_no', datatype:'string'} ,
                         {property: getCustomer, datatype:'function'},
                         {property: getProducts,datatype:'function'} ,
                         {property:'expected_date',datatype:'string'},
                         {property:getTotalAmount,datatype:'function'},
                         {property:getPaidAmount,datatype:'function'},
                         {property:getBalance,datatype:'function'},
                         {property:getDiscount,datatype:'function'},
                         {property:getNetAmount,datatype:'function'},
                         {property:'vehicle_no',datatype:'string'},
                         {property:'delivery_date',datatype:'string'},  
                         {property: getSaleStatus, datatype:'function'}
                        ];
                        
         //call fill data into table function
         //fillDataIntoTable(tableid, dataList, display property list, refillfunctionname, deletefunctionname, printfunctionname,button visibility)
         fillDataIntoTable(tableSales, allSales ,displayProperty,refillSale,deleteSale, printSale, true,userPrivilege); //true use to display button
 
      
      

      //disable delete button after deleting record
      allSales.forEach((element, index) => {
        if(element.sales_status_id.name == 'Deleted'){
            tableGrn.children[1].children[index].children[12].children[1].disabled = true; //you can also use disabled
            
        }
       
    }); 


      //calljQuery data table
      $('#tableSales').dataTable({
         retrieve: true,
    responsive: true,
    scrollX: true,
    scrollY: '300px'
   });
}

const getCustomer = (rowOb) =>{

   return rowOb.customer_id.name;   
 }

 const getProducts = (rowOb) =>{
        console.log('Products');

        let SaleProduct = "";
        rowOb.saleHasProductList.forEach((element,index) =>{
            if (rowOb.saleHasProductList.length-1 == index) {
                SaleProduct = SaleProduct + element.product_id.name;
            } else {
                SaleProduct = SaleProduct + element.product_id.name + ", <br>";
            }
            
        });
        return SaleProduct;
   
    
     }


 const getSaleStatus = (rowOb) =>{
       console.log('status')
    if (rowOb.sales_status_id.name == 'Pending') {
        return '<p class= "btn btn-sm btn-outline-success mt-2">' + rowOb.sales_status_id.name +'</p>';
    }
    if (rowOb.sales_status_id.name == 'Completed') {
        return '<p class = "btn btn-sm btn-outline-warning mt-2">' + rowOb.sales_status_id.name +'</p>';
    }
      if (rowOb.sales_status_id.name == 'Deleted') {
        return '<p class = "btn btn-sm btn-outline-danger mt-2">' + rowOb.sales_status_id.name +'</p>';
    }
    
    }



     const getDiscount = (rowOb) =>{

             return parseFloat(rowOb.discount).toFixed(2);
        }
    

     
     const getBalance = (rowOb) =>{
    
      return parseFloat(rowOb.balance_amount).toFixed(2);
    
     }

     const getTotalAmount = (rowOb) =>{
    
        return parseFloat(rowOb.grand_total).toFixed(2); 
      
       }

       const getNetAmount = (rowOb) =>{
    
        return parseFloat(rowOb.net_amount).toFixed(2); 
      
       }

       const getPaidAmount = (rowOb) =>{
    
        return parseFloat(rowOb.paid_amount).toFixed(2); 
      
       }


     const refreshSaleForm =() =>{
        //create empty object
        sales = {};
    
        sales.saleHasProductList = [];


        customers = ajaxGetRequest("/customer/findall");
        fillDataIntoSelect( selectCustomer, 'Select Customer*', customers, 'name');
        selectCustomer.disabled = false;

        saleStatus = ajaxGetRequest("/salestatus/findall");
        fillDataIntoSelect(selectStatus, 'Select Status*', saleStatus, 'name', "Pending" );

        sales.sales_status_id = JSON.parse(selectStatus.value); 


        selectStatus.style.border = "2px solid green";
        

        textGrandtotal.value = '';
        textOrderDate.value = '';
        textDiscount.value = '';
        textNetAmount.value = '';
        textPaidAmount.value = '';
        textBalance.value = '';
        textDeliveryDate.value = '';
        textVehicleNo.value = '';
        textNote.value = '';
       
        textGrandtotal.style.border = '1px solid #ced4da';
        textOrderDate.style.border = '1px solid #ced4da';
        textDiscount.style.border = '1px solid #ced4da';
        textNetAmount.style.border = '1px solid #ced4da';
        textPaidAmount.style.border = '1px solid #ced4da';
        textBalance.style.border = '1px solid #ced4da';
        textDeliveryDate.style.border = '1px solid #ced4da';
        textVehicleNo.style.border = '1px solid #ced4da';
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
     
        textOrderDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;
        
       
        
        maxDate.setDate(maxDate.getDate() + 30);

        let maxDay = maxDate.getDate();
        if (maxDay < 10) {
            maxDay ='0' + maxDay;
        } 

        let maxMonth = maxDate.getMonth() + 1;
        if (maxMonth < 10) {
            maxMonth = '0' + maxMonth;
        } 
       
        textOrderDate.max = maxDate.getFullYear()+ '-' + maxMonth + '-' + maxDay;

        // ---------------------------------------------------------------

     

        btnUpdateSale.disabled = true;
         $("#btnUpdateSale").css("cursor","not-allowed");

        if(userPrivilege.insert) {
            btnAddSale.disabled = "";
         $("#btnAddSale").css("cursor","pointer");
        }else{
            btnAddSale.disabled = true;
            $("#btnAddSale").css("cursor","not-allowed");  
        }


        //call refresh innerform it need to be refresh with the form
         refreshInnerProductFormAndTable();


    }


     // create function for check form Error
     const checkError = () => {
       
        //need to check all required property or field
        let errors = '';
    
        if (sales.expected_date == null) {
            errors = errors + 'please add Order date..! \n';       
        }

        if (sales.customer_id == null) {
            errors = errors + 'please enter customer name...! \n';     
        }

        if (sales.sales_status_id == null) {
            errors = errors + 'please select Status...! \n';     
        }

        
        if (sales.grand_total == null) {
            errors = errors + 'please select grand total..! \n';     
        }

        if (sales.net_amount == null) {
            errors = errors + 'please select net amount...! \n';     
        }

         if (sales.balance_amount == null) {
            errors = errors + 'please select balance amount...! \n';     
        }

         if (sales.paid_amount == null) {
            errors = errors + 'please select paid amount..! \n';     
        }


        // if ( sales.saleHasProductList.length == 0) {
        //     errors = errors + 'please Add order Material...! \n';           
        // }
         
       return errors;

}
 //create function for add button
 const buttonSaleAdd = () =>{
   console.log("Net amount" + sales.net_amount);
    console.log("Products" + sales.saleHasProductList);
    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {
    // alert('No Errors');
    //2.need to get user confirmation
    let userConfirm = window.confirm('Are you sure to add this customer sale?\n'
    + '\n customer is : ' + sales.customer_id.name);

    if(userConfirm){
    //3.pass data into backend
        // call ajaxRequestBody Function
        //ajaxRequestBody("/url" , "METHOD", object)
    let serverResponse = ajaxRequestBody("/sales", "POST", sales);

    //4.check backend response
    if (serverResponse == 'OK') {
    // if (new RegExp ('^[0-9]{8}$').test(serverResponse)) {
        alert('Save Successfully......!' );
        //need to refresh table and form
        refreshSaleTable();
        refreshSaleForm();
        formSale.reset();

        //need to hide modal
        $('#modalSalesForm').modal('hide');

    } else {
        alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
    }
}  
    } else {
        alert('form has some errors \n' + formErrors)
    }
}



const refillSale =(rowOb,rowInd) =>{
    $('#modalSalesForm').modal('show');
    // employee = rowOb;
    // oldemployee = rowOb;

    sales = JSON.parse(JSON.stringify(rowOb));
    oldsales = JSON.parse(JSON.stringify(rowOb));

   
    fillDataIntoSelect( selectCustomer, 'Select Customer', customers, 'name', sales.customer_id.name);
    selectCustomer.disabled = true;

    saleStatus = ajaxGetRequest("/salestatus/findall");
    fillDataIntoSelect(selectStatus, 'Select Status*', saleStatus, 'name', "Pending" );


    //need to set default color
    
    textGrandtotal.value = sales.grand_total;
    textOrderDate.value =  sales.expected_date;
    textDiscount.value = sales.discount;
    textNetAmount.value = sales.net_amount;
    textPaidAmount.value = sales.paid_amount;
    textBalance.value = sales.balance_amount;
   

      if( sales.note != null)
        textNote.value = sales.note;else  textNote.value  = "";

       if( sales.vehicle_no != null)
         textVehicleNo.value = sales.vehicle_no ;else textVehicleNo.value  = "";

         if( sales.vehicle_no != null)
         textDeliveryDate.value = sales.delivery_date ;else textDeliveryDate.value  = "";
       
       
 
    //set valid color for element  


    btnAddSale.disabled = true;
     $("#btnAddSale").css("cursor","not-allowed");
     

     if(userPrivilege.update) {
        btnUpdateSale.disabled = "";
     $("#btnUpdateSale").css("cursor","pointer");
       }else{
        btnUpdateSale.disabled = true;
           $("#btnUpdateSale").css("cursor","not-allowed");  
       }


       refreshInnerProductFormAndTable();
}


    //define method for check updates
    const checkUpdate = ()=>{
        let updates = "";
        
        if(sales.customer_id.name != oldsales.customer_id.name){
            updates = updates + "Cutomer is change \n";
        }

        if(sales.delivery_date != oldsales.delivery_date){
            updates = updates + "Delivery date is change \n";
        }

         if(sales.expected_date != oldsales.expected_date){
            updates = updates + "Order date is change \n";
        }
    
        if(sales.balance_amount != oldsales.balance_amount){
            updates = updates + "Balance Amount is change \n";
        }
    
    
        if(sales.note != oldsales.note){
            updates = updates + "Note is change \n";
        }
    
        if(sales.grand_total != oldsales.grand_total){
            updates = updates + "Total is change \n";
        }
    
        
        if(sales.sales_status_id.name != oldsales.sales_status_id.name){
            updates = updates + "status is change \n";
        }
    
    
 
        if(sales.saleHasProductList.length != oldsales.saleHasProductList.length){
            updates = updates + "Sales Product is change \n";
        }else{
            let extProductcount = 0;
            for(const newitem of sales.saleHasProductList){
                for(const olditem of oldsales.saleHasProductList){
    
                    if(newitem.product_id.id == olditem.product_id.id  && newitem.quantity == olditem.quantity && newitem.line_cost == olditem.line_cost && newitem.product_price == olditem.product_price ){
                        extProductcount = extProductcount + 1;
    
                    }
    
                }
            }
    
            if(extMaterialcount != grn.saleHasProductList.length ){
    
         updates = updates + "Product is change \n";
    
            }
        }
    
    
        return updates;
    }
    
       
        const buttonSaleUpdate = () =>{
       
        //check from error
            let error = checkError();
            if(error == ""){
                //check form update
                let updates = checkUpdate();
                if(updates != ""){
                    //cell put service
                    let userConfirm = confirm("Are you sure following changer...? \n" + updates);
                    if(userConfirm){
                        let updateServicesResponses = ajaxRequestBody("/sales","PUT", grn);
                        if (updateServicesResponses == "OK") {
                            alert('Update Successfully......!' );
                            //need to refresh table and form
                             //need to refresh table and form
                       refreshSaleTable();
                        refreshSaleForm();
                        formSale.reset();

                        //need to hide modal
                        $('#modalSalesForm').modal('hide');

    
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
    


    const deleteSale =(rowOb) =>{
        const userConfirm = confirm('Do you want to delete this Sale order \n' + rowOb.invoice_no);
    
        if (userConfirm) {
            let serverResponse = ajaxRequestBody("/sales", "DELETE", rowOb);
            if (serverResponse == "OK") {
                alert('Delete Successfully......!' );
                //need to refresh table and form
                refreshGrnTable();
    
    
            } else {
                alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
            }
        }
    }
    const printSale =() =>{
        return "print Sale";
    }
   


    //define function for refresh inner form and table
    const refreshInnerProductFormAndTable = () =>{
     
        // innerform
        saleitem = {};
         oldsaleitem = null;

         ProductList = ajaxGetRequest("/product/availableproductlist");
        fillDataIntoSelect( selectProduct, 'Select Product *', ProductList, 'name');

        //set values to empty and set input field default colors
        selectProduct.value = ''; 
         textUnitPrice.value = '';
         textProductQuantity.value = '';
         textLineCost.value = '';

        
        //  textProductQuantity.style.border = '1px solid #ced4da';
        //  textUnitPrice.style.border = '1px solid #ced4da';
        //  textLineCost.style.border = '1px solid #ced4da';
        //  selectProduct.style.border = '1px solid #ced4da';

         //innerform end

        //  inner table start
 
        let tablecol = [{property: getProductName, datatype:'function'} ,
        {property:getQuantity, datatype:'function'},
        {property:getUnitPrice, datatype:'function'},
        {property:getLinePrice, datatype:'function'},
        ];

         //need to refresh inner table
         fillDataIntoInnerTable(tableSaleProduct,sales.saleHasProductList, tablecol, refillInnerProductForm,deleteInnerProduct, true);
         
        //  inner table end


        let totalAmount = 0.00;

        sales.saleHasProductList.forEach(element => {
            totalAmount += parseFloat(element.line_cost);
        });

        sales.grand_total = totalAmount; 
        textGrandtotal.value = totalAmount.toFixed(2);

        // Ensure discount and totalAmount are numbers
        let discount = parseFloat(textDiscount.value) || 0;
        let discountedPrice = totalAmount * discount / 100;

        // Set net amount
        let netAmount = totalAmount - discountedPrice;
        textNetAmount.value = netAmount.toFixed(2);
        sales.net_amount =   textNetAmount.value;


 
     } 
     

const getProductName = (ob) =>{
    return ob.product_id.name;
}

const getUnitPrice = (ob) =>{
    return parseFloat(ob.product_price).toFixed(2);
}

const getLinePrice = (ob) =>{
    return parseFloat(ob.line_cost).toFixed(2);
}

const getQuantity = (ob) =>{
    return ob.quantity;
}
 

// ------------------------------------------------------

       
const refillInnerProductForm =(rowob , rowid) =>{
    

        innerRowid = rowid

        $('#modalSalesForm').modal('show');

        fillDataIntoSelect( selectProduct, 'Select Product', [], 'name',rowOb.product_id.name);
            
    

         selectProduct.disabled = true;

         textProductQuantity.value = rowob.quantity
         textUnitPrice.value = parseFloat(rowob.product_price).toFixed(2);
         textLineCost.value = parseFloat(rowob.line_cost).toFixed(2);
       
    }


    //  check material is already exists
    const generateUnitPrice=()=>{

        let selectedProduct = JSON.parse(selectProduct.value);
        console.log("Product Details" + selectedProduct)

        let extIndex =  sales.saleHasProductList.map(salematerial => salematerial.product_id.id).indexOf(selectedProduct.id);

        if (extIndex != -1){
            alert("Product Already exist....");
            btnAddSale.disabled = true;
        } else{

            textUnitPrice.value = parseFloat(selectedProduct.unit_price).toFixed(2);
            saleitem.product_price = textUnitPrice.value;
            textUnitPrice.style.border = '2px solid green';
            textUnitPrice.disabled = true;
            
            textProductQuantity.value  = "";
            saleitem.quantity = null ;
            textProductQuantity.style.border = "1px solid #ced4da";

        textLineCost.value  = "";
        saleitem.line_cost = null ;
        textLineCost.style.border = "1px solid #ced4da";

        btnAddSale.disabled = false;

        }

        
    }

    const calculateLinePrice = () =>{
       console.log("calculate line price")
       let qyt = textProductQuantity.value;
       console.log("qyt: " + qyt)

       if(new RegExp("^[1-9][0-9]{0,3}$").test(qyt)){
        textLineCost.value =(parseFloat(textUnitPrice.value) * parseFloat(qyt)).toFixed(2);
        saleitem.line_cost = textLineCost.value;
        console.log("line cost: " + textLineCost.value)
        textLineCost.style.border = '2px solid green';
       }
    }

    const calculateNetAmount = () => {
        totalAmount = sales.grand_total;
        // Ensure discount and totalAmount are numbers
        let discount = parseFloat(textDiscount.value) || 0;
        let discountedPrice = totalAmount * discount / 100;

        // Set net amount
        let netAmount = totalAmount - discountedPrice;
        textNetAmount.value = netAmount.toFixed(2);

        sales.net_amount =   textNetAmount.value;
    }

    const generateBalanceAmount = () => {
    let pay = parseFloat(textPaidAmount.value).toFixed(2);

    console.log(new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(pay))
    console.log("valie :" + pay )

    //quantity eke pattern eken check krlama gnnwa
    // pattern allows 0,0.0,0.00,9,99,99.9,99.99
    if (new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(pay)) {
        textBalance.value = parseFloat(textNetAmount.value) - pay;
        sales.balance_amount = parseFloat(textBalance.value).toFixed(2);
        textBalance.style.border = '2px solid green'
        textPaidAmount.style.border = '2px solid green'
        pay = sales.paid_amount;
    }
}




    const checkInnerFormError = () =>{

        let errors = "";

        if(saleitem.product_id == null){
            errors = errors + "Please Select material..!\n";
         }

         if(saleitem.quantity == null){
            errors = errors + "Please add material quantity..!\n";
         }

         
         if(saleitem.product_price == null){
            errors = errors + "Please add material unit price..!\n";
         }

         
         if(saleitem.line_cost == null){
            errors = errors + "Please add material line cost..!\n";
         }

        return errors;

    }


    const buttonSaleProductAdd = () =>{

        console.log("add inner item");
        //need to check errors
        let errors  = checkInnerFormError();

        if(errors == ""){

            let userConfirm = confirm("Are you sure to add following Sale product?\n" + "\nProduct name" + saleitem.product_id.name +"\n Quantity : " + saleitem.quantity +"\n Unit price : " + saleitem.product_price +"\n Line price : " + saleitem.line_cost );
            if(userConfirm){
                alert ("purchase order Added Successfully..!");
               
                 sales.saleHasProductList.push(saleitem);
                console.log("Product button:" + saleitem)
                refreshInnerProductFormAndTable();
            }


        }else{

            alert ("Sale product Not Successfully Added..!\n" + errors); 
           

        }      

    }

    

    
    const buttonSaleProductUpdate = () =>{
       
        let innerUpdates = "";
        
    if (textProductQuantity.value != sales.saleHasProductList[innerRowid].quantity){

        innerUpdates = innerUpdates + 'Order Quantity changed...! \n';
    }

    if (innerUpdates != ""){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the ?" + innerUpdates);
        if (userConfirmToUpdateInnerForm){
             sales.saleHasProductList[innerRowid].quantity = textProductQuantity.value;
            sales.saleHasProductList[innerRowid].line_cost = textLineCost.value;
              sales.saleHasProductList[innerRowid].unit_price = textUnitPrice.value;
             refreshInnerProductFormAndTable();
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
   

       const deleteInnerProduct = (rowob , rowind) =>{

        console.log("deleted inner item");

       let userConfirm = confirm('Are you sure to remove this?\n' + "Product Name :" + rowob.product_id.name);


       if(userConfirm){
        sales.saleHasProductList.splice(rowind, 1);
        alert("remove Successfly..!");
         refreshInnerProductFormAndTable();
       }


    }



