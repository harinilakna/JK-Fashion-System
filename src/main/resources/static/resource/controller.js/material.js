//Acess rowser onload event
window.addEventListener('load',()=>{
     
    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/material_and_inventory");
    console.log(userPrivilege);

    //call table refresh function
    refreshMaterialTable();

    //call form refresh function
    refreshMaterialForm();
   
})

//create function for refresh table record
const refreshMaterialTable = () =>{
  

 //  ..................using common.js file function create post.........................
 materials = ajaxGetRequest("/material/findall");
 
 //object count == table colum count
 //string - number/string/date
 //function
 const displayProperty = [{property:'code', datatype:'string'} ,
                         {property:'name', datatype:'string'},
                         {property:'reorder_point', datatype:'string'},
                         {property:'photo', datatype:'photoarray'},
                         {property: getAvailableQty, datatype:'function'},
                         {property: getCategory, datatype:'function'},
                         {property: getColor, datatype:'function'},
                         {property: getSize, datatype:'function'},
                         {property: getStatus, datatype:'function'},
                        ];
                        
         //call fill data into table function
         //fillDataIntoTable(tableid, dataList, display property list, refillfunctionname, deletefunctionname, printfunctionname,button visibility)
         fillDataIntoTable(tableMaterial, materials ,displayProperty ,refillMaterialForm,deleteMaterial, printMaterial, true,userPrivilege); //true use to display button
 
      
      

        //disable delete button after deleting record
        materials.forEach((element, index) => {
            if(element.material_status_id.name == 'Out of stock'){
             
                    tableMaterial.children[1].children[index].children[10].children[1].disabled = true; //you can also use disabled
              
                
            }
           
        });

          //call jQuery data table
          $('#tableMaterial').dataTable({
            retrieve: true,
    responsive: true,
    scrollX: true,
    scrollY: '300px'
       });
       
 
 
 }

 const getStatus = (rowOb) =>{
       console.log('status')
    if (rowOb.material_status_id.name == 'In-stock') {
        return '<p class= "btn btn-sm btn-outline-success mt-2">' + rowOb.material_status_id.name +'</p>';
    }
    if (rowOb.material_status_id.name == 'Out of stock') {
        return '<p class = "btn btn-sm btn-outline-danger mt-2">' + rowOb.material_status_id.name +'</p>';
    }
    
    }

    const getCategory = (rowOb) => {
        return rowOb.material_sub_category_id.material_category_id.name;
    };

 const getColor = (rowOb) =>{
    return rowOb.material_color_id.name;
       
 }

 const getSize = (rowOb) =>{
    return rowOb.material_size_id.name;
       
 }

 const getAvailableQty = (rowOb) =>{
    
      return rowOb.available_quantity;
    
     }

// end of display table record

//define function for filter subcategory by category
const filterSubCategory = () =>{
    console.log(JSON.parse(selectCategory.value));

    subcategoriesByCategory = ajaxGetRequest("/materialsubcategory/listbycategory?categoryid=" + JSON.parse(selectCategory.value).id);
    fillDataIntoSelect( selectSubCategory, 'Select Sub category',subcategoriesByCategory, 'name','');

}


    // create function for refresh form area
    const refreshMaterialForm = () => {

        //create empty object
        material = {};


        //get data list for select element
        // designations = [{id:1, name:'Manager'},{id:2, name:'Cashier'},{id:3, name:'Stock keeper'}];
        categories= ajaxGetRequest("/category/findall")
        fillDataIntoSelect( selectCategory, 'Select Material Catogory*', categories, 'name');

        unittype= ajaxGetRequest("/unittype/findall")
        fillDataIntoSelect( selectUnitType, 'Select Material Unit type*', unittype, 'name');

        subcategories = ajaxGetRequest("/subcategory/findall")
        fillDataIntoSelect( selectSubCategory, 'Select Sub Category*', subcategories, 'name','');

        // employeestatues = [{id:1, name:'Working'},{id:2, name:'Resign'},{id:3, name:'Deleted'}];
        colors = ajaxGetRequest("/color/findall")
        fillDataIntoSelect( selectColor, 'Select Color*', colors, 'name');

        size = ajaxGetRequest("/size/findall")
        fillDataIntoSelect( selectSize, 'Select Size*', size, 'name');

        Materialstatus = ajaxGetRequest("/materialstatus/findall")
        fillDataIntoSelect( selectStatus, 'Select Status', Materialstatus, 'name',"Out of stock");
        //bind data into item object
        material.material_status_id = JSON.parse(selectStatus.value);
    
        //set valid color
        selectStatus.style.border = "2px solid green";



       
            textRop.value ="";
            textUnitPrice.value ="";

             material.photo = null;
            fileuserphoto.files = null;
            imgUserphoto.src = "resource/images/No_Image_Available.png";
            textUserphoto.value = "";


            textRop.style.border = '1px solid #ced4da';

            textUnitPrice.style.border = '1px solid #ced4da';
      
          



                btnUpdateMaterial.disabled = "true";
                $("#btnUpdateMaterial").css("cursor","not-allowed");

                if(userPrivilege.insert) {
                btnAddMaterial.disabled = "";
                $("#btnAddMaterial").css("cursor","pointer");
                }else{
                btnAddMaterial.disabled = "true";
                $("#btnAddMaterial").css("cursor","not-allowed");  
                }

      
    }

    //define function for generate item name
 const generateItemName = ()=>{

    if(selectSubCategory != "" || selectSubCategory.value != "None" && selectColor.value != "" || selectColor.value != "None" && selectSize.value !="" || selectSize.value != "None" && SelectUnitType.value !="" || SelectUnitType.value != "None" ){

        textMaterialName.value = JSON.parse(selectSubCategory.value).name + " " + JSON.parse(selectColor.value).name +" " + JSON.parse(selectSize.value).name + " " + JSON.parse(selectUnitType.value).name +" ";
        material.name = textMaterialName.value;
        textMaterialName.style.border = "2px solid green";

    }
 }

    // create function for check form Error
    const checkError = () => {
        console.log(material);
        //need to check all required property or field
        let errors = '';

        if (material.name == null) {
            errors = errors + 'please Enter Valid Material Name...! \n';  
        }
        
        if (material.reorder_point == null) {
             errors = errors + 'please Enter Valid Material Re-order point...! \n';
        }
       


       if (material.unit_type_id == null) {
        errors = errors + 'please Enter Valid Material Unit Price...! \n';
       }

        if (material.material_sub_category_id.material_category_id == null) {
            errors = errors + 'please Select Valid Material Category...! \n';
               
        }
        if (material.material_sub_category_id == null) {
            errors = errors + 'please Select Valid Material Category...! \n';
               
        }
        if (material.material_status_id == null) {
            errors = errors + 'please Select Valid Material Status...! \n';      
        }

        if (material.material_color_id == null) {
            errors = errors + 'please Select Valid Material Color...! \n';      
        }
       
        if (material.material_size_id == null) {
            errors = errors + 'please Select Valid Material width...! \n';      
        }

       return errors;

}

    //create function for add button
    const buttonMaterialAdd = () =>{
        console.log ("Add button")
        //1.need to check form errors --> checkError()
        let formErrors = checkError()
        if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this material?\n'
        + '\n Material Name is : ' + material.name  + '\n Category is : ' + material.material_category_id.name + '\n Status is : ' + material.material_status_id.name +'  \n Size is : ' + material.material_size_id.name);

        if(userConfirm){
        //3.pass data into backend
        // call ajaxRequestBody Function
        //ajaxRequestBody("/url" , "METHOD", object)
        let serverResponse = ajaxRequestBody("/material", "POST", material);

        console.log(serverResponse)
          
        //4.check backend response
        if (serverResponse == 'OK') {
            alert('Save Successfully......!' );
            //need to refresh table and form
            refreshMaterialTable();
            formMaterial.reset();
            refreshMaterialForm();
            //need to hide modal
            $('#modalMaterialAddForm').modal('hide');

        } else {
            alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
        }
        }
      
            
        } else {
            alert('form has some errors \n' + formErrors);
        }
    }

   
    

    //create refill function
    const refillMaterialForm =(rowOb,rowInd)=>{
        $('#modalMaterialAddForm').modal('show');

        material = JSON.parse(JSON.stringify(rowOb));
        oldmaterial = JSON.parse(JSON.stringify(rowOb));

        console.log(material);
        console.log(oldmaterial);

        textMaterialName.value = material.name;
        textRop.value = material.reorder_point;
        
      //get data list for select element
        // designations = [{id:1, name:'Manager'},{id:2, name:'Cashier'},{id:3, name:'Stock keeper'}];
        categories= ajaxGetRequest("/category/findall")
        fillDataIntoSelect( selectCategory, 'Select Material Catogory*', categories, 'name',material.material_sub_category_id.material_category_id.name);


        subcategories = ajaxGetRequest("/subcategory/findall")
        fillDataIntoSelect( selectSubCategory, 'Select Sub Category*', subcategories, 'name',material.material_sub_category_id.name);

        // employeestatues = [{id:1, name:'Working'},{id:2, name:'Resign'},{id:3, name:'Deleted'}];
        colors = ajaxGetRequest("/color/findall")
        fillDataIntoSelect( selectColor, 'Select Color*', colors, 'name', material.material_color_id.name);

        size = ajaxGetRequest("/size/findall")
        fillDataIntoSelect( selectSize, 'Select Size*', size, 'name', material.material_size_id.name);

        fillDataIntoSelect( selectStatus, 'Select Status', Materialstatus, 'name', material.material_status_id.name);

        unittype= ajaxGetRequest("/unittype/findall")
        fillDataIntoSelect( selectUnitType, 'Select Material Unit type*', unittype, 'name', material.unit_type_id.name);
        
        

        // if(material.reorder_quantity != null)
        // textROQ.value = material.reorder_quantity;
        // else textROQ.value = "";


        if(material.unit_price != null)
            textUnitPrice.value = material.unit_price;
                else textUnitPrice.value = "";

    

          // refill image
    if(material.photo == null){
        imgUserphoto.src = "resource/images/No_Image_Available.png";
        textUserphoto.value = "";
      }else{
        imgUserphoto.src = atob(material.photo);
        textUserphoto.value = material.photopath;
      }
     

       
        //disable add button when click update button

        btnAddMaterial.disabled = "true";
        $("#btnAddMaterial").css("cursor","not-allowed");

        if(userPrivilege.insert) {
            btnUpdateMaterial.disabled = "";
        $("#btnUpdateMaterial").css("cursor","pointer");
        }else{
            btnUpdateMaterial.disabled = "true";
        $("#btnUpdateMaterial").css("cursor","not-allowed");  
        }

    }

    //define method for check updates
const checkUpdate = ()=>{
    let updates = "";
    
    if(material.name != oldmaterial.name){
        updates = updates + "Material Name is change \n";
    }

     if(material.photo != oldmaterial.photo){
        updates = updates + "Photo is changed" + olduser.photo + "into" + user.photo + "\n" ;
    }


    if(material.reorder_point != oldmaterial.reorder_point){
        updates = updates + "Re-Order Point is change \n";
    }

    if(material.unit_type_id != oldmaterial.unit_type_id){
        updates = updates + "Re-Order Point is change \n";
    }

    if(material.unit_price != oldmaterial.unit_price){
        updates = updates + "Unit price Point is change \n";
    }

    if(material.material_sub_category_id.material_category_id.name != oldmaterial.material_sub_category_id.material_category_id.name){
        updates =  updates + "Material Category is change \n";
    }
    
    if(material.material_sub_category_id.name != oldmaterial.material_sub_category_id.name){
        updates =  updates + "Material Sub Category is change \n";
    }

    if(material.material_status_id.name != oldmaterial.material_status_id.name){
        updates = updates + "Material Status is change \n";
    }

    if(material.material_color_id.name != oldmaterial.material_color_id.name){
        updates = updates + "Material Color is change \n";
    }

    if(material.material_size_id.name != oldmaterial.material_size_id.name){
        updates = updates + "Material width is change " + oldmaterial.material_size_id.name + "into" + oldmaterial.material_size_id.name + "\n";
    }

   

    return updates;
}

    //define function for employee update
    const buttonMaterialUpdate = () =>{
    console.log("Update button");

       // Generate the name based on latest form selections
    generateItemName();  // <-- ADD THIS LINE
    //check from error
        let error = checkError();
        if(error == ""){
            //check form update
            let updates = checkUpdate();
            if(updates != ""){
                //cell put service
                let userConfirm = confirm("Are you sure following changer...? \n" + updates);
                if(userConfirm){
                    let updateServicesResponses = ajaxRequestBody("/material","PUT", material);
                    if (updateServicesResponses == "OK") {
                        alert('Update Successfully......!' );
                        //need to refresh table and form
                        refreshMaterialTable();
                        formMaterial.reset();
                        refreshMaterialForm();
                        //need to hide modal
                        $('#modalMaterialAddForm').modal('hide');

                    } else {
                        alert(' Not Updates....! Have Some Errors \n' + updateServicesResponses);
                    }
                }
            }else{
                alert("Nothing to update....!")
            }

        }else{
            alert("form has following errors \n" + error)
        }


    } 

    const printMaterial =() =>{
        return "print";
    }

    const deleteMaterial =(rowOb, rowInd) =>{
        const userConfirm = confirm('Do you want to delete this Material \n' + rowOb.name);
    
        if (userConfirm) {
            let serverResponse = ajaxRequestBody("/material", "DELETE", rowOb);
            if (serverResponse == "OK") {
                alert('Delete Successfully......!' );
                //need to refresh table and form
                refreshMaterialTable();
    
    
            } else {
                alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
            }
        }
    }


    const buttonClearImage =() =>{
    if(user.photo != null){
        const userConfirm = confirm("Are you sure to reset user photo...?");

        if(userConfirm){
            user.photo = null;
            fileuserphoto.files = null;
            imgUserphoto.src = "resource/images/logojk.png";
            textUserphoto.value = "";

        }
    }else{
        user.photo = null;
        imgUserphoto.src = "resource/images/logojk.png";
        textUserphoto.value = "";

    }
 }

   