window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/production_order");
    console.log(userPrivilege);

    refreshProductionOrderTable();
    reFreshProductionOrderForm();
})

// get data into table
const refreshProductionOrderTable = () =>{

    productionOrderList = ajaxGetRequest("/production-order/findall");

    const displayProperty = [
        {property:'code', datatype:'string'},
        {property:getProductAndQuantity, datatype:'function'},
        {property:'required_date', datatype:'string'},
        {property:getCompletedQuantity, datatype:'function'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoTable(tableProduction, productionOrderList ,displayProperty ,refillProductionForm, deleteProductionOrder, printProduction, true, userPrivilege);

    // $("#ProductionOrderTable").dataTable({
    //     destroy:true,
    //     responsive: true,
    //     // scrollX: true,// Enable horizontal scrollbar
    //     scrollY: 300 // Enable vertical scrollbar with a height of 200 pixels
    // });

    $("#tableProduction").dataTable();

    //disable delete button
    productionOrderList.forEach((element, index) => {
        if(element.production_order_status_id.name === "Deleted"){
            if (userPrivilege.delete) {
                grnTable.children[1].children[index].children[5].children[1].disabled = true; //you can also use disabled
            }
        }
    });

}



const getProductAndQuantity = (ob) => {
    let productAndQuantity = "";
    for (const item of ob.productionOrderProductList) {
        productAndQuantity = productAndQuantity + item.product_id.name + "- " + item.order_quantity + ", ";
    }
    return productAndQuantity;
}

const getCompletedQuantity = (ob) => {
    let completedQuantity = "";
    for (const item of ob.productionOrderProductList) {
        completedQuantity = item.completed_quantity ;
    }
    return completedQuantity;
}

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.production_order_status_id.name === 'Submitted') {
        return '<p class= "btn btn-outline-primary btn-sm ">' + rowOb.production_order_status_id.name +'</p>';
    }
    if (rowOb.production_order_status_id.name === 'Processing') {
        return '<p class = "btn btn-outline-info btn-sm ">' + rowOb.production_order_status_id.name +'</p>';
    }
    if (rowOb.production_order_status_id.name === 'Approved') {
        return '<p class= "btn btn-light btn-outline-dark btn-sm ">' + rowOb.production_order_status_id.name + '</p>';
    }
    if (rowOb.production_order_status_id.name === 'Not-Approved') {
        return '<p class= "btn btn-outline-danger btn-sm ">' + rowOb.production_order_status_id.name + '</p>';
    }
    if (rowOb.production_order_status_id.name === 'On-Hold') {
        return '<p class= "btn btn-outline-warning btn-sm ">' + rowOb.production_order_status_id.name + '</p>';
    }
    if (rowOb.production_order_status_id.name === 'Completed') {
        return '<p class= "btn btn-outline-success btn-sm ">' + rowOb.production_order_status_id.name + '</p>';
    }
    if (rowOb.production_order_status_id.name === 'Deleted') {
        return '<p class= "btn btn-outline-dark btn-sm ">' + rowOb.production_order_status_id.name + '</p>';
    }
}

 const reFreshProductionOrderForm = () => {

    productionOrder = {};
    oldProductionOrder = null;

    // create new array to save production order product list
    productionOrder.productionOrderProductList = [];

    // create new array to save production order MAterial list
    productionOrder.productionOrderMaterialtList = [];

    // get active Product list
    productList = ajaxGetRequest("/product/availablelist");
    fillDataIntoSelect( selectProduct, 'Select Product *', productList, 'name');

    // Submitted is Initial State
    productionOrderStatusList = ajaxGetRequest("/productionorderstatus/findall");
    fillDataIntoSelect( selectStatus, 'Select Production Status *', productionOrderStatusList, 'name', 'Submitted' );

    // Bind selected status to grn
    productionOrder.production_order_status_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = '2px solid green';

    //need to empty all element
    textRequiredDate.value = '';
    textRequiredDate.style.border = '1px solid #ced4da';

    textNote.value = '';
    textNote.style.border ='1px solid #ced4da';

    btnUpdateProrder.disabled = true;
    $("#btnUpdateProrder").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        btnAddProrder.disabled = "";
        $("#btnAddProrder").css("cursor","pointer");
    }else{
        btnAddProrder.disabled = "true";
        $("#btnAddProrder").css("cursor","not-allowed");
    }

    // Refresh Inner Production order form and table
    refreshInnerProductionOrder();

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
    textRequiredDate.max = maxDate.getFullYear()+ '-' + maxMonth+ '-' + maxDay;
 }

// //create refill function
const refillProductionForm =(rowOb,rowInd)=>{


    $('#modalProductionForm').modal('show');

    productionOrder = JSON.parse(JSON.stringify(rowOb));
    oldProductionOrder = JSON.parse(JSON.stringify(rowOb));

    textRequiredDate.value = productionOrder.required_date;


    if(productionOrder.note != null)
        textNote.value = productionOrder.note; else textNote.value = "";

    // select status
   fillDataIntoSelect(selectStatus, 'Select Status', productionOrderStatusList, 'name', productionOrder.production_order_status_id.name );

    //set valid color for element
    console.log(userPrivilege);

    btnAddProrder.disabled = "true";
    $("#btnAddProrder").css("cursor","not-allowed");

    if(userPrivilege.update) {
        btnUpdateProrder.disabled = false;
        $("#btnUpdateProrder").css("cursor","pointer");
    }else{
        btnUpdateProrder.disabled = true;
        $("#btnUpdateProrder").css("cursor","not-allowed");
    }

    refreshInnerProductionOrder();

 }

 // create function for check form Error
const checkError = () => {

    //need to check all required property or field
    let errors = '';

    if (productionOrder.required_date == null) {
        errors = errors + 'please Select required Date...! \n';
    }

    // if ( productionOrder.productionOrderProductList.length == 0) {
    //         errors = errors + 'please Add Product...! \n';           
    //     }



    return errors;

}


 //create function for add Production order
const buttonProAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError();

    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this Production Order?\n'
            + '\n Production order date is : ' + productionOrder.required_date
            );

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/production-order", "POST", productionOrder);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                refreshProductionOrderTable();
                formProduction.reset();
                reFreshProductionOrderForm();
                $('#modalProductionForm').modal('hide');
                //need to hide modal


            } else {
                alert('Save Not Successful....! Have Some Errors \n' + serverResponse);
            }
        }
    } else {
        alert('form has some errors \n' + formErrors)
    }
}

//define method for check updates
const checkUpdate = ()=>{
    let updates = "";

    if (productionOrder.required_date != oldProductionOrder.required_date){
        updates = updates + "Create date is change " + oldProductionOrder.required_date + " into " + productionOrder.required_date + "\n";
    }


    if (productionOrder.productionOrderProductList.length != oldProductionOrder.productionOrderProductList.length){
        updates = updates + "Prodction order products are changed \n";
    }
    else{
        let extMCount = 0;
        for(const newOrderProduct of productionOrder.productionOrderProductList ){
            for (const oldOrderProduct of oldProductionOrder.productionOrderProductList){
                if(newOrderProduct.product_id.id == oldOrderProduct.product_id.id ){
                    extMCount = extMCount+1;
                }
            }
        }
        if (extMCount != productionOrder.productionOrderProductList.length){
            updates = updates + "Production products are changed \n";
        }
    }

    return updates;
}

//define function for employee update
const buttonProUpdate = () =>{
    console.log("Update button");``
    //check from error
    let error = checkError();
    if(error == ""){
        //check form update
        let updates = checkUpdate();
        if(updates != ""){
            //cell put service
            let userConfirm = confirm("Are you sure following changer...? \n" + updates);
            if(userConfirm){
                let updateServicesResponses = ajaxRequestBody("/production-order","PUT", productionOrder);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                     refreshProductionOrderTable();
                formProduction.reset();
                reFreshProductionOrderForm();
                $('#modalProductionForm').modal('hide');
                    //need to hide modal
                    $('#modalProductionForm').modal('hide');

                } else {
                    alert(' Not Updates....! Have Some Errors \n' + updateServicesResponses);
                }
            }
        }else{
            alert("Nothing to update....!");
        }

    }else{
        alert("form has following errors \n" + errors);
    }
}

const deleteProductionOrder =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this GRN Order \n' + rowOb.code);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/production-order", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
             refreshProductionOrderTable();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}



const printProduction = (rowOb, rowInd) => {
    console.log("print POrder");
}




const refreshInnerProductionOrder = () =>{

    proproduct = {};
    oldproproduct = null;

    productList = ajaxGetRequest("/product/availablelist");
            fillDataIntoSelect( selectProduct, 'Select Product', productList, 'name');

    // productList = ajaxGetRequest("/product/availableproductlist");
    // fillDataIntoSelect( selectProduct, 'Select Product', [], 'name');

    textProductQuantity.value = '';
    textProductQuantity.style.border = '1px solid #ced4da';

    let columns = [
        {property: getProductName, datatype: 'function'},
        {property: 'order_quantity', datatype: 'string'},
    ]

    // refresh inner Table
    fillDataIntoInnerTable(tableProProduct, productionOrder.productionOrderProductList, columns, innerTableRefill, innerTableDelete, true, userPrivilege )
}

const getProductName = (ob) =>{
    return ob.product_id.name;
}



const innerTableRefill = (rowOb, index) => {

    innerRowInd = index;

     $('#modalProductionForm').modal('show');

   

       if (selectProduct.value != "") {
              productList = ajaxGetRequest("/product/availableproductlist");
            fillDataIntoSelect( selectProduct, 'Select Product', productList, 'name',rowOb.product_id.name);
        } else {
            fillDataIntoSelect( selectProduct, 'Select Product', [], 'name',rowOb.product_id.name);
            
        }

         selectProduct.disabled = true;

         textProductQuantity.value = rowOb.order_quantity

}

const buttonProProductUpdate = () => {

    let innerUpdates = "";

    if (textProductQuantity.value != productionOrder.productionOrderProductList[innerRowInd].order_quantity){

        innerUpdates = innerUpdates + 'Order Quantity changed...! \n';
    }

    if (innerUpdates != ""){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the ?" + innerUpdates);
        if (userConfirmToUpdateInnerForm){
            productionOrder.productionOrderProductList[innerRowInd].order_quantity = textProductQuantity.value;
            refreshInnerProductionOrder();
        }
    }
    else {
        alert("Noting to Update! ")
    }

}

const innerTableDelete = (rowOb, index) => {
    // get user Confirmation
    let userConfirm = confirm("Are you sure to delete Product..? \n" +
        "Product Name : " + rowOb.product_id.name);

    if (userConfirm){
        productionOrder.productionOrderProductList.splice(index, 1);
        alert("Remove Successfully..!");
        refreshInnerProductionOrder();
    }
}

const checkInnerFormError = () => {

    let errors = "";

    if(proproduct.product_id == null){
        errors = errors + 'please Select Valid Material name...! \n';
    }

    if(proproduct.order_quantity == null){
        errors = errors + 'please Enter Valid Order Quantity...! \n';
    }

    return errors;
}

const buttonProProductAdd = () => {
    console.log("add inner item check")

    // need to check errors
    let errors = checkInnerFormError();
    if (errors == ""){

        let userConfirm = confirm("Are you Sure to add materials \n"
            + "Product name : " + proproduct.product_id.name + "\n"
            + "Product qty : "  + proproduct.order_quantity + "\n");

        if (userConfirm){
            alert("Order Item Added Successfully!")
            // add object into array
            productionOrder.productionOrderProductList.push(proproduct);
            refreshInnerProductionOrder();
        }
    }else{
        alert("Form has some errors \n"+ errors)
    }
}







