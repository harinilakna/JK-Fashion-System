window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/production_order");
    console.log(userPrivilege);

    refreshDailyProductionTable();
    reFreshDailyProductionForm();
})

// get data into table
const refreshDailyProductionTable = () =>{

    dailyProductionList = ajaxGetRequest("/dailyproduction/findall");

    const displayProperty = [
        {property:getProductionOrder, datatype:'function'},
        {property:getProduct, datatype:'function'},
        {property:'quantity', datatype:'string'},
         {property:getStatus, datatype:'function'}
    ]

    fillDataIntoDailyProduction(tableDailyProduction, dailyProductionList ,displayProperty , reFillProduction, true, userPrivilege);

    $("#tableDailyProduction").dataTable({
        retrieve: true,
    responsive: true,
    scrollX: true,
    scrollY: '300px'
    });

   
}

const getProductionOrder = (rowOb) => {
    return rowOb.production_order_id.code;
}

const getProduct = (rowOb) => {
    return rowOb.product_id.name;
}

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.production_order_id.production_order_status_id.name === 'Submitted') {
        return '<p class= "btn btn-outline-primary btn-sm ">' + rowOb.production_order_id.production_order_status_id.name +'</p>';
    }
    if (rowOb.production_order_id.production_order_status_id.name === 'Processing') {
        return '<p class = "btn btn-outline-info btn-sm ">' + rowOb.production_order_id.production_order_status_id.name +'</p>';
    }
    if (rowOb.production_order_id.production_order_status_id.name === 'Approved') {
        return '<p class= "btn btn-light btn-outline-dark btn-sm ">' + rowOb.production_order_id.production_order_status_id.name + '</p>';
    }
    if (rowOb.production_order_id.production_order_status_id.name === 'Not-Approved') {
        return '<p class= "btn btn-outline-danger btn-sm ">' + rowOb.production_order_id.production_order_status_id.name + '</p>';
    }
    if (rowOb.production_order_id.production_order_status_id.name === 'On-Hold') {
        return '<p class= "btn btn-outline-warning btn-sm ">' + rowOb.production_order_id.production_order_status_id.name + '</p>';
    }
    if (rowOb.production_order_id.production_order_status_id.name === 'Completed') {
        return '<p class= "btn btn-outline-success btn-sm ">' + rowOb.production_order_id.production_order_status_id.name + '</p>';
    }
    if (rowOb.production_order_id.production_order_status_id.name === 'Deleted') {
        return '<p class= "btn btn-outline-dark btn-sm ">' + rowOb.production_order_id.production_order_status_id.name + '</p>';
    }
}



const reFreshDailyProductionForm = () => {

    dailyProduct = {};
    olddailyProduct = null;

    //dropdown for production order select(for statuses processing, approved and on hold - 2,3, and 4)
    OrderFromStatus = ajaxGetRequest("/production-order/productionOrderByApproved");
    fillDataIntoSelect( selectProductionOrder, 'Select Production Order *', OrderFromStatus, 'code');

    //need to empty all element
    selectProductionOrder.value = '';
    selectProductionOrder.style.border = '1px solid #ced4da';

    selectProduct.value = '';
    selectProduct.style.border ='1px solid #ced4da';

    productionQty.value = '';
    productionQty.style.border ='1px solid #ced4da';

}

const filterProduct = () => {
    console.log("filterProduct called");
    products = ajaxGetRequest("/product/listproductbyproductionorder/" + JSON.parse(selectProductionOrder.value).id);
    fillDataIntoSelect(selectProduct, 'Select Product', products, 'name');

    console.log("products selected: " + selectProduct.value);
}

const filterQuantity = () => {
    console.log("filterQuantity called");
    let qty = ajaxGetRequest("/production-has-product/quantity?poId=" + JSON.parse(selectProductionOrder.value).id + "&itemId=" + JSON.parse(selectProduct.value).id);

    console.log("qty: " + qty);
    let requiredqty = qty.order_quantity;
    let completedqty = qty.completed_quantity;
    console.log("qty required: " + requiredqty);
    productionQty.value = parseInt(requiredqty) - parseInt(completedqty);

    dailyProduct.quantity = productionQty.value;
    if(new RegExp("^[1-9][0-9]{0,5}$").test(productionQty.value)){
        productionQty.style.border = '2px solid green'
    }

    dailyProduct.product = qty.product_id;
}

const checkQty = () => {

    let qty = ajaxGetRequest("/production-has-product/quantity?poId=" + JSON.parse(selectProductionOrder.value).id + "&itemId=" + JSON.parse(selectProduct.value).id);
    let requiredqty = qty.order_quantity;
    let completedqty = qty.completed_quantity;
    let enteredqty = productionQty.value;

    let balanceqty = parseInt(requiredqty) - parseInt(completedqty);

    if (parseInt(enteredqty) > (parseInt(balanceqty))) {
        alert("Amount is exceeded");
        productionQty.value = null;
    } else {
        dailyProduct.quantity = productionQty.value;
    }
}


// create function for check form Error
const checkError = () => {

    //need to check all required property or field
    let errors = '';

    if (dailyProduct.production_order_id == null) {
        errors = errors + 'please Select Production Order...! \n';
    }

    if (dailyProduct.product_id == null) {
        errors = errors + 'please Select Product...! \n';
    }

    if (dailyProduct.quantity == null) {
        errors = errors + 'please Enter valid Qty...! \n';
    }

    return errors;

}

//create function for add employee
const dailyProductionAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this Production?\n'
            + '\n Production Order is : ' + dailyProduct.production_order_id.code
            + '\n Product  is : ' + dailyProduct.product_id.name
            + '\n Production Quantity is : ' + dailyProduct.quantity
            );

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/dailyproduction", "POST", dailyProduct);
            console.log("serverResponse method calling: " + serverResponse);
            console.log("request send daily product: " + dailyProduct);
            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                // refreshPOderTable();
                refreshDailyProductionTable();
                formDailyProduction.reset();
                reFreshDailyProductionForm();
                $('#modalDailyProductionForm').modal('hide');
                  
                //need to hide modal
            } else {
                alert('Save Not Successful....! Have Some Errors \n' + serverResponse);
            }
        }
    } else {
        alert('form has some errors \n' + formErrors)
    }
}


//create refill function
     const reFillProduction =(rowOb,rowInd)=>{
         $('#modalDailyProductionForm').modal('show');
         // employee = rowOb;
         // oldemployee = rowOb;
 
         dailyProduct = JSON.parse(JSON.stringify(rowOb));
         olddailyProduct = JSON.parse(JSON.stringify(rowOb));
 
         console.log(dailyProduct);
         console.log(olddailyProduct);

    // OrderFromStatus = ajaxGetRequest("/production-order/productionOrderByApproved");
    fillDataIntoSelect( selectProductionOrder, 'Select Production Order *', OrderFromStatus, 'code', dailyProduct.production_order_id.code);
    selectProductionOrder.disabled = true;

     products = ajaxGetRequest("/product/listproductbyproductionorder/" + JSON.parse(selectProductionOrder.value).id);
    fillDataIntoSelect(selectProduct, 'Select Product', products, 'name', dailyProduct.product_id.name);
    selectProduct.disabled = true;


    productionQty.value = dailyProduct.quantity;

        //disable add button when click update button
        // userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/employee");

        btnAddDailyProduction.disabled = "true";
        $("#btnAddDailyProduction").css("cursor","not-allowed");

        if(userPrivilege.update) {
           btnUpDailyProduction.disabled = "";
        $("#btnUpdatePrivilege").css("cursor","pointer");
          }else{
           btnUpDailyProduction.disabled = "true";
              $("#btnUpDailyProduction").css("cursor","not-allowed");  
          }
     }

const checkUpdate = ()=>{
     let updates = "";

     if(dailyProduct.quantity != olddailyProduct.quantity){
         updates = updates + "quantity is change \n";
     }
   
     return updates;
 }
 
     //define function for employee update
     const dailyProductionUpdate = () =>{
     console.log("Update button");
     console.log(dailyProduct);
         console.log(olddailyProduct);

     //check from error
         let error = checkError();
         if(error == ""){
             //check form update
             let updates = checkUpdate();
             if(updates != ""){
                 //cell put service
                 let userConfirm = confirm("Are you sure following changer...? \n" + updates);
                 if(userConfirm){
                     let updateServicesResponses = ajaxRequestBody("/dailyproduction","PUT", dailyProduct);
                     if (updateServicesResponses == "OK") {
                         alert('Update Successfully......!' );
                         //need to refresh table and form
                        refreshDailyProductionTable();
                formDailyProduction.reset();
                reFreshDailyProductionForm();
                $('#modalDailyProductionForm').modal('hide');
                  
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





const updateQty = () => {

    let qty = ajaxGetRequest("/production-has-product/quantity?poId=" + JSON.parse(selectProductionOrder.value).id + "&itemId=" + JSON.parse(selectProduct.value).id);
    let requiredqty = qty.order_quantity;
    let completedqty = qty.completed_quantity;
    let enteredqty = productionQty.value;

    let balanceqty = parseInt(requiredqty) - parseInt(completedqty);

    if (parseInt(enteredqty) > (parseInt(balanceqty))) {
        alert("Amount is exceeded");
        productionQty.value = null;
    } else {
        dailyProduct.quantity = productionQty.value;
    }
}








