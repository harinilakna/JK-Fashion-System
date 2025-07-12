window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/production_order");
    console.log(userPrivilege);

    refreshProductionOrderConfirmTable();
  
})

// get data into table
const refreshProductionOrderConfirmTable = () =>{

    productionOrderList = ajaxGetRequest("/production-order/findall");

    const displayProperty = [
        {property:'code', datatype:'string'},
        {property:getProductAndQuantity, datatype:'function'},
        {property:'required_date', datatype:'string'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoOrderConfirmation(tableProductionConfirm, productionOrderList ,displayProperty ,refillConfirmForm, true, userPrivilege);

    $("#tableProductionConfirm").dataTable({
        destroy:true,
        responsive: true,
        // scrollX: true,// Enable horizontal scrollbar
        scrollY: 300 // Enable vertical scrollbar with a height of 200 pixels
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

 
//create refill function
const refillConfirmForm =(rowOb,rowInd)=>{
    $('#modalProductionConfirmForm').modal('show');

    productionOrder = JSON.parse(JSON.stringify(rowOb));
    console.log("production order: " + productionOrder);
    oldProductionOrder = JSON.parse(JSON.stringify(rowOb));

    textRequiredDate.value = productionOrder.required_date;
    selectStatus.value = productionOrder.production_order_status_id.name;

    if(productionOrder.note != null)
        textNote.value = productionOrder.note; else textNote.value = "";


    productionOrderStatusList = ajaxGetRequest("/productionorderstatus/findall");
    // select status
    fillDataIntoSelect( selectStatus, 'Select Status *', productionOrderStatusList, 'name', productionOrder.production_order_status_id.name);

    let columnsProducts = [
        {property: getProductName, datatype: 'function'},
        {property: 'order_quantity', datatype: 'string'},
    ]
    // refresh inner Table
    fillDataIntoInnerTable(productionOrderItemInnerTable, productionOrder.productionOrderProductList, columnsProducts, innerTableRefill, innerTableDelete, false, userPrivilege )

    //all materials list array ekak hadagannwa
    allMaterialList = [];
    for (const oitem of productionOrder.productionOrderProductList) {
        //for every item, gets the materials in them and add to allMaterialList
        for (const itemmaterial of oitem['product_id']['productMaterialList']) {
            let allMat = new Object();
            allMat.material_id = itemmaterial.material_id;
            allMat.qty = itemmaterial.quantity * oitem.order_quantity;
            allMaterialList.push(allMat);
        }
    }

    productionOrder.productionOrderMaterialtList = [];

    for (const allMatObj of allMaterialList) {
        let extIndex = productionOrder.productionOrderMaterialtList.map(itm => itm.material_id.id).indexOf(allMatObj.material_id.id);
        console.log("material list check for allMatobj loop + "  + productionOrder.productionOrderMaterialtList)
        if (extIndex != -1) {
//            productionOrder.productionOrderMaterialtList[extIndex].required_quantity = productionOrder.prodOrderMaterialtList[extIndex].required_quantity + allMatObj.qty;
                productionOrder.productionOrderMaterialtList[extIndex].required_quantity = productionOrder.productionOrderMaterialtList[extIndex].required_quantity + allMatObj.qty;

        } else {
            let proOHm = new Object();
            proOHm.material_id = allMatObj.material_id;
            proOHm.required_quantity = parseFloat(allMatObj.qty);
            proOHm.available_quantity = 0;
            productionOrder.productionOrderMaterialtList.push(proOHm);
        }
    }

    for (const index in productionOrder.productionOrderMaterialtList) {
        materialInventory = ajaxGetRequest("/material/listbyproduct/" + productionOrder.productionOrderMaterialtList[index].material_id.id);

        if (materialInventory != "") {
            productionOrder.productionOrderMaterialtList[index].available_quantity = materialInventory.available_quantity;
        }
    }

    let columnsMaterials = [
        {property: getMaterailName, datatype: 'function'},
        {property: 'required_quantity', datatype: 'string'},
        {property: 'available_quantity', datatype: 'string'},
    ]
    // refresh inner Table
    fillDataIntoInnerTable(productionOrderMaterialInnerTable, productionOrder.productionOrderMaterialtList, columnsMaterials, innerTableRefill, innerTableDelete, false, userPrivilege )

    console.log("material list check for table + "  + productionOrder.productionOrderMaterialtList)

    let confirmedStatus = true;
    productionOrder.productionOrderMaterialtList.forEach((element, index) => {
        // Accessing the relevant row in the table
        const row = productionOrderMaterialInnerTable.children[1].children[index];

        // Assuming `required_quantity` and `available_quantity` are properties of `element`
        const requiredQuantity = parseFloat(element.required_quantity);
        const availableQuantity = parseFloat(element.available_quantity);

        // Check the quantity condition
        if (requiredQuantity <= availableQuantity) {
            // means required quantity is available, so turns green
            row.style.backgroundColor = "green";
        } else {
            // means required quantity is not available, so turns red
            row.style.backgroundColor = "red";
            confirmedStatus = false;
        }
    });

    if (confirmedStatus) {
        fillDataIntoSelect(selectStatus, 'Select Status', productionOrderStatusList, 'name', "Approved");
        textNote.value = "";
    } else {
        fillDataIntoSelect(selectStatus, 'Select Status', productionOrderStatusList, 'name', "Not-Approved");
        textNote.value = "Not enough material to confirm production";
    }
    selectStatus.classList.add("is-valid");
    productionOrder.production_order_status_id = JSON.parse(selectStatus.value);
    // FIX: Assign the status object directly
//        productionOrder.production_order_status_id = productionOrderStatusList.find(
//            status => status.name === selectStatus.value
//        );
    productionOrder.note = textNote.value;

}


const getProductName = (ob) =>{
    return ob.product_id.name;
}

const getMaterailName = (ob) =>{
    return ob.material_id.name;
}

const innerTableRefill = (rowOb, index) => {
    innerRowInd = index;

    fillDataIntoSelect( SelectProduct, 'Select Product *', productList, 'name', rowOb[product_id][name]);

    ProOrderProductQty.value = parseFloat(rowOb.orderQty).toFixed(2);
}


const innerTableDelete = (rowOb, index) => {
    // get user Confirmation
    let userConfirm = confirm("Are you sure to delete Product..? \n" +
        "Product Name : " + rowOb.product_d.name);

    if (userConfirm){
        productionOrder.prodOrderProductList.splice(index, 1);
        alert("Remove Successfully..!");
        refreshInnerProductionOrder();
    }
}


const buttonProConfirmAdd = () => {
     console.log("production order: " + productionOrder.production_order_status_id.id);
    //If status is Not Approved
    if (productionOrder.production_order_status_id.id == 4) {

        productionOrder.productionOrderMaterialtList = [];
    }

    //user confirmation
    let userConfirm = confirm("\n Are you sure you want to confirm Production Order?");
    if (userConfirm) {
        //call put service

        //method2
        let putServiceResponse = ajaxRequestBody("/productionorderconfirm", "PUT", productionOrder);

        //check putservice responses
        if (putServiceResponse == "OK") {
            alert("Production Order Confirmed Successfully");

            // hide modal
            $("#modalProductionConfirmForm").modal("hide");

            refreshProductionOrderTable(); //Refresh the pr order table

            //Refresh static elements
            formProductionConfirm.reset();

        } else {
            alert("Failed to update changes \n" + putServiceResponse);
        }
    }


}