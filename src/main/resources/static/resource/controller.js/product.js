/*START MAIN VIEW FUNCTIONS*/

/*
BROWSER ON LOAD FUNCTION
1 => CHECK USER PRIVILEGE TO THE MODULE
2 => REFRESH TABLE
3 => REFRESH FORM
*/
window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/product");
    console.log(userPrivilege);

    refreshProductTable();
    reFreshProductForm();
})

/*REFRESH PRODUCT TABLE*/
const refreshProductTable = () =>{

    // using common.js file function create fidall.
    products = ajaxGetRequest("/product/findall");

    //object count == table colum count
 //string - number/string/date
 //function
    
        const displayProperty = [                                                    
                                        
            {property:'code', datatype:'string'},
            {property:getCategory, datatype:'function'},
            {property:'name', datatype:'string'},
            {property:getGender, datatype:'function'},
            {property:getSize, datatype:'function'},          
            {property:getProductPrice, datatype:'function'},
            {property:'available_quantity', datatype:'string'},
            {property:getStatus, datatype:'function'},
       
        ]

         // {property:'image', datatype:'photoarray'},
        //    {property:'available_quantity', datatype:'string'},
        //     {property:'reorder_point', datatype:'string'},


    fillDataIntoTable(tableProduct, products ,displayProperty ,refillProductForm, deleteProduct, printProduct, true, userPrivilege);

    $("#tableProduct").dataTable({
        retrieve: true,
    responsive: true,
    scrollX: true,
    scrollY: '300px'
    });

    $("#tableProduct").dataTable();

    //disable delete button
    // products.forEach((element, index) => {
    //     if(element.product_status_id.name === "Deleted"){
    //         if (userPrivilege.delete) {
    //             tableProduct.children[1].children[index].children[11].children[1].disabled = true; //you can also use disabled
    //         }
    //     }
    // });

}

const getCategory = (rowOb) =>{
    return rowOb.product_category_id.name;
}

const getGender = (rowOb) =>{
    return rowOb.gender_id.name;
}

const getSize = (rowOb) =>{
    return rowOb.size_id.name;
}

const getMaterialcost = (rowOb) => {
    return parseFloat(rowOb.material_total_cost).toFixed(2);
}

const getProductPrice = (rowOb) => {
    return parseFloat(rowOb.unit_price).toFixed(2);
}

const getImage = (rowOb) => {
    return rowOb.image;
}

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.product_status_id.name === 'In-Stock') {
        return '<p class= "btn btn-outline-info btn-sm ">' + rowOb.product_status_id.name +'</p>';
    }
    if (rowOb.product_status_id.name === 'Out-of-Stock') {
        return '<p class = "btn btn-outline-success btn-sm ">' + rowOb.product_status_id.name +'</p>';
    }
    if (rowOb.product_status_id.name === 'Deleted') {
        return '<p class= "btn btn-outline-danger btn-sm ">' + rowOb.product_status_id.name + '</p>';
    }
}

  //define function for generate item name
 const generateItemName = ()=>{

    if(selectProductCategory != "" || selectProductCategory.value != "None" && textProductName != "" || textProductName.value != "None" && selectGender.value != "" || selectGender.value != "None" && selectSize.value !="" || selectSize.value != "None"){

        textProductName.value = textProductName.value + " " + JSON.parse(selectProductCategory.value).name + " "+ JSON.parse(selectGender.value).name +" " + JSON.parse(selectSize.value).name;
        product.name = textProductName.value;
        textProductName.style.border = "2px solid green";

    }
 }

const reFreshProductForm = () => {

    product = {};
    oldProduct = null;

    // create new array to add to the product object
    product.productMaterialList = [];

    // GET PRODUCT CATEGORY LIST
    productCategoryList = ajaxGetRequest("/productcategory/findall");
    fillDataIntoSelect( selectProductCategory, 'Select Category*', productCategoryList, 'name');

    // GET PRODUCT STATUS LIST
    productStatusList = ajaxGetRequest("/productstatus/findall");
    fillDataIntoSelect(selectStatus, 'Select Status *', productStatusList, 'name','Out-of-Stock');

     // Bind selected status to product
    product.product_status_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = '2px solid green';

    // GET GENDER LIST
   genderList = ajaxGetRequest("/gender/findall");
    fillDataIntoSelect(selectGender, 'Select Gender*', genderList, 'name');

   //GET SIZE LIST
   sizeList = ajaxGetRequest("/productsize/findall");
   fillDataIntoSelect(selectSize, 'Select Size*', sizeList, 'name');



    //need to empty all element
    // productImage.value = '';
    // productImage.style.border = '1px solid #ced4da';

    product.image = null;
    imgProductphoto.files = null;
    imgProductphoto.src = "/resource/Images/No_Image_Available.png";
    textProductphoto.value= "";

    textTotalCost.value = 'Total Material Cost';
    textTotalCost.disabled = true;
    textTotalCost.style.border = '1px solid #ced4da';

    textNote.value = '';
    textNote.style.border ='1px solid #ced4da';

    textProductName.value = '';
    textProductName.style.border ='1px solid #ced4da';

    productPrice.value = '';
    productPrice.style.border ='1px solid #ced4da';

    textRop.value = '';
    textRop.style.border ='1px solid #ced4da';

    btnUpdateProduct.disabled = true;
    $("#btnUpdateProduct").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        btnAddProduct.disabled = "";
        $("#btnAddProduct").css("cursor","pointer");
    }else{
        btnAddProduct.disabled = "true";
        $("#btnAddProduct").css("cursor","not-allowed");
    }

    // Refresh Inner GRN form and table
    refreshInnerMaterialFormAndTable();


}



//create refill function
const refillProductForm =(rowOb,rowInd)=>{
    $('#modalProductAddForm').modal('show');

    product = JSON.parse(JSON.stringify(rowOb));
    oldProduct = JSON.parse(JSON.stringify(rowOb));

    // refill image
    if(product.image == null){
        imgProductphoto.src = "/resource/Images/No_Image_Available.png";
        textProductphoto.value = "";
    }else{
        imgProductphoto.src = atob(product.image);
        textProductphoto.value = product.imagePath;
    }

    // productImage.value = product.image;
    textTotalCost.value = product.material_total_cost;
    textProductName.value = product.name;
    productPrice.value = product.unit_price;
    textRop.value = product.reorder_point;

    if(product.note != null)
        textNote.value = product.note; else textNote.value = "";

    // select Category
    fillDataIntoSelect( selectProductCategory, 'Select Category *', productCategoryList,'name', product.product_category_id.name);

    // select status
    fillDataIntoSelect( selectStatus, 'Select Status *', productStatusList, 'name', product.product_status_id.name);

       // GET Gender list
    fillDataIntoSelect(selectGender, 'Select Gender*', genderList, 'name',product.gender_id.name );

     // GET Size
     fillDataIntoSelect(selectSize, 'Select Size*', sizeList,'name',product.size_id.name );

    //set valid color for element
    console.log(userPrivilege);

    btnAddProduct.disabled = "true";
    $("#btnAddProduct").css("cursor","not-allowed");

    if(userPrivilege.update) {
        btnUpdateProduct.disabled = false;
        $("#btnUpdateProduct").css("cursor","pointer");
    }else{
        btnUpdateProduct.disabled = true;
        $("#btnUpdateProduct").css("cursor","not-allowed");
    }

    refreshInnerMaterialFormAndTable();
}

// create function for check form Error
const checkError = () => {

    //need to check all required property or field
    let errors = '';

    if (product.product_category_id == null) {
        errors = errors + 'please Select Category...! \n';
    }

    if (product.product_status_id == null) {
        errors = errors + 'please Select Product Status...! \n';
    }

    if (product.size_id == null) {
        errors = errors + 'please add product size...! \n';
    }

     if (product.gender_id == null) {
        errors = errors + 'please add grnder..! \n';
    }

    if (product.name == null) {
        errors = errors + 'please Enter Product Name...! \n';
    }

    if (product.unit_price == null){
        errors = errors + 'please Enter Product Price...! \n';
    }

    if (product.reorder_point == null){
        errors = errors + 'please Enter Product Reorder Point...! \n';
    }

    return errors;

}

//create function for add employee
const buttonProductAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this Product?\n'
            + '\n Product name is : ' + product.name  + '\n Category is : ' + product.product_category_id.name
        + '\n Product Price is: ' + product.unit_price  + '\n Product Price is: ' + product.size_id.name);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/product", "POST", product);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form 
                


                refreshProductTable();
                formProduct.reset();
                reFreshProductForm();
                $('#modalProductAddForm').modal('hide');
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

    if (product.product_category_id != oldProduct.product_category_id){
        updates = updates + "Product Category is change " + oldProduct.product_category_id.name + " into " + product.product_category_id.name + "\n";
    }

    if(product.product_status_id != oldProduct.product_status_id){
        updates = updates + "Product Status is change " + oldProduct.product_status_id.name + " into " + product.product_status_id.name + "\n";
    }

    if(product.image != oldProduct.image){
        updates = updates + "Product Image is change " + oldProduct.image + " into " + product.image + "\n";
    }

    if(product.note != oldProduct.note){
        updates = updates + " Note is change \n";
    }

    if (product.material_total_cost != oldProduct.material_total_cost){
        updates = updates + " Material Cost is change " + oldProduct.material_total_cost + " into " + product.material_total_cost +"\n";
    }

    if (product.name != oldProduct.name){
        updates = updates + " Product Name is change " + oldProduct.name + " into " + product.name +"\n";
    }

    if (product.unit_price != oldProduct.unit_price){
        updates = updates + " Product Price is change " + oldProduct.unit_price + " into " + product.unit_price +"\n";
    }

    if (product.reorder_point != oldProduct.reorder_point){
        updates = updates + " Product Reorder Level is change " + oldProduct.reorder_point + " into " + product.reorder_point +"\n";
    }

    if (product.productMaterialList.length != oldProduct.productMaterialList.length){
        updates = updates + "Product Materials are change \n";
    }
    else {
        let extMCount = 0;
        for (const newOrderMaterial of product.productMaterialList) {
            for (const oldOrderMaterial of oldProduct.productMaterialList) {
                if (newOrderMaterial.material_id.id == oldOrderMaterial.material_id.id) {
                    extMCount = extMCount + 1;
                }
            }
        }
        if (extMCount != product.productMaterialList.length) {
            updates = updates + "Product Materials are change \n";
        }
    }

    return updates;
}

//define function for employee update
const buttonProductUpdate = () =>{
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
                let updateServicesResponses = ajaxRequestBody("/product","PUT", product);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                refreshProductTable();
                formProduct.reset();
                reFreshProductForm();
                $('#modalProductAddForm').modal('hide');

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

const deleteProduct =(rowOb, rowInd) => {
    const userConfirm = confirm('Do you want to delete this Product  \n' + rowOb.code);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/product", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!');
            //need to refresh table and form
            refreshProductTable();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}

const buttonClearImage =() =>{
    if(product.image != null){
        const userConfirm = confirm("Are you sure to clear product photo...?");

        if(userConfirm){
            product.image = null;
            fileproductphoto.files = null;
            imgProductphoto.src = "/resource/Images/No_Image_Available.png";
            textProductphoto.value = "";

        }
    }else{
        product.image = null;
        imgUserphoto.src = "/resource/Images/No_Image_Available.png";
        textProductphoto.value="";

    }
}

const printProduct = (rowOb, rowInd) => {
    console.log("print");
}

const refreshInnerMaterialFormAndTable = () =>{

    promaterial = {};
    oldpromaterial = null;

    availableMaterials = ajaxGetRequest("/material/availablelist");
    fillDataIntoSelect( selectProMaterial, 'Select Material *', availableMaterials, 'name');

    // set values to empty and set input field default colors
    selectProMaterial.value = '';
    selectProMaterial.style.border = '1px solid #ced4da';

    textMaterialQuantity.value = '';
    textMaterialQuantity.style.border = '1px solid #ced4da';

    textUnitPrice.value = '';
    textUnitPrice.style.border = '1px solid #ced4da';

    textLineCost.value = '';
    textLineCost.style.border = '1px solid #ced4da';

    let columns = [
        {property: getMaterialName, datatype: 'function'},
        {property: getUnitPrice, datatype: 'function'},
        {property: 'quantity', datatype: 'string'},
        {property: getLinePrice, datatype: 'function'},
    ]

    // refresh inner Table
    fillDataIntoInnerTable(tableProductMaterial, product.productMaterialList, columns, innerTableRefill, innerTableDelete, true, userPrivilege )

      // get material cost total
        
       let totalAmount = 0.00;

product.productMaterialList.forEach(element => {
    totalAmount += parseFloat(element.line_cost);
});

product.material_total_cost = totalAmount; 
textTotalCost.value = totalAmount.toFixed(2);
}


const getMaterialName = (ob) =>{
    return ob.material_id.name;
}

const getUnitPrice = (ob) => {
    return parseFloat(ob.unit_price).toFixed(2);
}

const getLinePrice = (ob) => {
    return parseFloat(ob.line_cost).toFixed(2);
}


const innerTableRefill = (rowOb, index) => {
    innerRowInd = index;
    availableMaterials = ajaxGetRequest("/material/availablelist");

    fillDataIntoSelect( selectProMaterial, 'Select Material *', availableMaterials, 'name', rowOb.material_id.name);

    textUnitPrice.value = parseFloat(rowOb.unit_price).toFixed(2);

    textMaterialQuantity.value = rowOb.quantity

    textLineCost.value = parseFloat(rowOb.line_cost).toFixed(2);


  
}

const buttonProMaterialUpdate = () => {

     let innerUpdates = "";

    // if (textUnitPrice.value != product.productMaterialList[innerRowInd].unit_price){
    //     innerUpdates = innerUpdates + 'Material Unit Price changed...! \n';
    // }

    if (textMaterialQuantity.value != product.productMaterialList[innerRowInd].quantity){

        innerUpdates = innerUpdates + 'Material Quantity changed...! \n';
    }

    if (textLineCost.value != product.productMaterialList[innerRowInd].line_cost){

        innerUpdates = innerUpdates + 'Material Line Cost changed...! \n';
    }

    if (innerUpdates != ""){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the ?" + innerUpdates);
        if (userConfirmToUpdateInnerForm){
            product.productMaterialList[innerRowInd].quantity = textMaterialQuantity.value;
            product.productMaterialList[innerRowInd].line_cost = textLineCost.value;
            product.productMaterialList[innerRowInd].unit_price = textUnitPrice.value;
            refreshInnerMaterialFormAndTable();
            
        }
    }
    else {
        alert("Noting to Update! ")
    }

  
}

const innerTableDelete = (rowOb, index) => {
    // get user Confirmation
    let userConfirm = confirm("Are you sure to delete Material..? \n" +
    "Material Name : " + rowOb.material_id.name);

    if (userConfirm){
        product.productMaterialList.splice(index, 1);
        alert("Remove Successfully..!");
        refreshInnerMaterialFormAndTable();
    }
}

const checkInnerFormError = () => {

    let errors = "";

    if(promaterial.material_id == null){
        errors = errors + 'please Select Valid Material name...! \n';
    }

    if(promaterial.quantity == null){
        errors = errors + 'please Enter Valid Order Quantity...! \n';
    }

    if(promaterial.unit_price == null){
        errors = errors + 'please Enter Valid Unit Price...! \n';
    }

    if(promaterial.line_cost == null){
        errors = errors + 'please Enter Valid Line Price...! \n';
    }

    return errors;
}

const buttonProMaterilAdd = () => {
    console.log("add inner item check")

    // need to check errors
    let errors = checkInnerFormError();
    if (errors == ""){

        let userConfirm = confirm("Are you Sure to add materials \n"
            + "Material name : " + promaterial.material_id.name + "\n"
            + "Material qty : "  + promaterial.quantity + "\n"
            + "Material qty : "  + promaterial.unit_price + "\n"
            + "Material qty : "  + promaterial.line_cost + "\n");

        if (userConfirm){
            alert("Order Item Added Successfully!")
            // add object into array
            product.productMaterialList.push(promaterial);
            refreshInnerMaterialFormAndTable();

        }
    }else{
        alert("Form has some errors \n"+ errors)
    }
}

const generateUnitPrice = () => {

    
    let selectedItem = JSON.parse(selectProMaterial.value);

    console.log("unit price check" + selectedItem.name);

    let existIndex = product.productMaterialList.map(item => item.material_id.id).indexOf(selectedItem.id);

    if (existIndex != -1){
        alert("Material already exist")
        btnAddProMaterial.disabled = true;
    }
    else{
        textUnitPrice.value = parseFloat(selectedItem.unit_price).toFixed(2);
        promaterial.unit_price = textUnitPrice.value;
        textUnitPrice.style.border = '2px solid green';

       
        textMaterialQuantity.value = '';
        promaterial.quantity = null;
        textMaterialQuantity.style.border = '1px solid #ced4da';

        
        textLineCost.value = '';
        promaterial.line_cost = null;
        textLineCost.style.border = '1px solid #ced4da';
        

         btnAddProduct.disabled = false;
    }
}


 const generateLinePrice = () =>{
       let qyt = textMaterialQuantity.value;

       if(new RegExp("^[1-9][0-9]{0,3}$").test(qyt)){
        textLineCost.value =(parseFloat(textUnitPrice.value) * parseFloat(qyt)).toFixed(2);

       promaterial.line_cost = textLineCost.value;

        textLineCost.style.border = '2px solid green';
       }


    }

