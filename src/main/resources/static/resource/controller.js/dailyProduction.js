window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/production_order");
    console.log(userPrivilege);

    refreshDailyProductionTable();
    reFreshDailyProductionForm();
})

// get data into table
const refreshDailyProductionTable = () =>{

    dailyProductionList = ajaxGetRequest("/daily-production/findall");

    const displayProperty = [
        {property:getProductionOrder, datatype:'function'},
        {property:getProduct, datatype:'function'},
        {property:'quantity', datatype:'string'}]

    fillDataIntoDailyProduction(tableDailyProduction, dailyProductionList ,displayProperty , printDailyProduction, true, userPrivilege);

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

const printDailyProduction = (rowOb, rowInd) => {
    console.log("print Daily production");
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

    products = ajaxGetRequest("/product/listproductbyproductionorder/" + JSON.parse(selectProductionOrder.value).id);
    fillDataIntoSelect(selectProduct, 'Select Product', products, 'name');
}

const filterQuantity = () => {

    let qty = ajaxGetRequest("/production-has-product/quantity?poId=" + JSON.parse(selectProductionOrder.value).id + "&itemId=" + JSON.parse(selectProduct.value).id);
    let requiredqty = qty.order_quantity;
    let completedqty = qty.completed_quantity;

    productionQty.value = parseInt(order_quantity) - parseInt(completed_quantity);

    dailyProduct.quantity = productionQty.value;
    if(new RegExp("^[1-9][0-9]{0,5}$").test(productionQty.value)){
        productionQty.style.border = '2px solid green'
    }
}

const checkQty = () => {

    let qty = ajaxGetRequest("/production-has-product/quantity?poId=" + JSON.parse(selectProductionOrder.value).id + "&itemId=" + JSON.parse(selectProduct.value).id);
    let requiredqty = qty.order_quantity;
    let completedqty = qty.completed_quantity;
    let enteredqty = productionQty.value;

    let balanceqty = parseInt(order_quantity) - parseInt(completed_quantity);

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
            + '\n Production Order is : ' + dailyProduct.quantity
            );

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/dailyproduction", "POST", dailyProduct);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                // refreshPOderTable();
                $('#modalDailyProductionForm').modal('hide');
                formDailyProduction.reset();
                 refreshDailyProductionTable();
    reFreshDailyProductionForm();
                //need to hide modal
            } else {
                alert('Save Not Successful....! Have Some Errors \n' + serverResponse);
            }
        }
    } else {
        alert('form has some errors \n' + formErrors)
    }
}



