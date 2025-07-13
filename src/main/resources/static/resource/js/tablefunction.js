//create function for fill data into table

const fillDataIntoTable= (tableId, dataList, propertyList,editButtonFunction, deleteButtonFunction, printButtonFunction, buttonVisibility = true, privilegeOb = null)=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
    const tr = document.createElement('tr');


    const tdIndex = document.createElement('td');
    tdIndex.innerText = parseInt(ind) + 1;
    tr.appendChild(tdIndex);
    
    for (const itemob of propertyList) {
       const td = document.createElement('td');
     
       if (itemob.datatype == 'string') {
           td.innerText =  dataList[ind][itemob.property];
       }

       if (itemob.datatype == 'function') {
           td.innerHTML = itemob.property(dataList[ind]);
       }

       else if (itemob.datatype === 'photoarray') {
        let img = document.createElement("img");
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.padding = "5px";

        if (dataList[ind][itemob.property] == null) {
            img.src = "resource/images/No_Image_Available.png";
        } else {
            img.src = atob(dataList[ind][itemob.property]);
        }

        td.appendChild(img);
    }

       
    //    if (itemob.datatype == 'photoarray') {
    //     let img = document.createElement("img");
    //     img.style.width = "50px";
    //     img.style.height = "50px";
    //      img.style.padding = "10px";
    //     if(dataList[ind][itemob.property] == null){
    //       img.src = "resource/images/No_Image_Available.png"
    //     }else{
    //         img.src = atob(dataList[ind][itemob.property]);
    //     }

    //     tr.appendChild(img); 
       
    // }

       tr.appendChild(td); 
   
    }
   
    const tdButton = document.createElement('td');
    tdButton.className = 'modify-button';// for print


    const  buttonEdit = document.createElement('button');
    buttonEdit.className = 'btn btn-warning btn-sm me-1';
 
    buttonEdit.innerHTML = 'Edit';

    buttonEdit.onclick = () =>{
        console.log("Edit event" + item.id);
        editButtonFunction(item,ind);
    }


    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'btn btn-danger btn-sm me-1';
    buttonDelete.innerHTML = 'Delete';
    buttonDelete.onclick = () =>{
        console.log("Delete event "+ item.id);
        deleteButtonFunction(item,ind);
    }

    const buttonPrint = document.createElement('button');
    buttonPrint.className = 'btn btn-info btn-sm';
    buttonPrint.innerHTML = 'Print';
    buttonPrint.onclick = () =>{
        console.log("Print event" + item.id);
        printButtonFunction(item,ind);
    }
    if (buttonVisibility) {
       if (privilegeOb != null && privilegeOb.update) {
           tdButton.appendChild(buttonEdit);
       } 
       if (privilegeOb != null && privilegeOb.delete) {
           tdButton.appendChild(buttonDelete);
       }
      
       tdButton.appendChild(buttonPrint);
       tr.appendChild(tdButton);
      
    }
   
    tableBody.appendChild(tr);
                    
    });

}

const fillDataIntoSelectInnerForm = (feildId, message,dataList,property, propertyTwo,selectedValue) =>{
    feildId.innerHTML = '';
    if(message !=''){
        let optionMessage = document.createElement('option');
        optionMessage.value = '';
        optionMessage.selected = 'selected';
        optionMessage.disabled = 'disabled';
        optionMessage.innerText = message;
        feildId.appendChild(optionMessage); 
    }
    
    for (const ob of dataList) {
    let option = document.createElement('option');
    option.value = JSON.stringify(ob); // convert into json string
    option.innerText = "(" + ob[property] +")" + ob[propertyTwo];
    if(selectedValue == ob[property] ){
       option.selected = 'selected';
    }
    feildId.appendChild(option);
        
    }}

    //create function for fill data into table

const fillDataIntoInnerTable = (tableId, dataList, propertyList,editButtonFunction,deleteButtonFunction,buttonVisibility = true)=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
    const tr = document.createElement('tr');


    const tdIndex = document.createElement('td');
    tdIndex.innerText = parseInt(ind) + 1;
    tr.appendChild(tdIndex);
    
    for (const itemob of propertyList) {
       const td = document.createElement('td');
       // td.innerText =item.number;
       if (itemob.datatype == 'string') {
        if(dataList[ind][itemob.property] == null){
           td.innerText = '-';
        }else{
           td.innerText =  dataList[ind][itemob.property];
        }
           
       }

       if (itemob.datatype == 'amount') {
           if(dataList[ind][itemob.property] == null){
              td.innerText = '-';
           }else{
              td.innerHTML =  "<b>Rs.</b>" + parseFloat( dataList[ind][itemob.property]).toFixed(2);
           }
              
          }

       if (itemob.datatype == 'function') {
           td.innerHTML = itemob.property(dataList[ind]);
       }

       tr.appendChild(td); 
   
    }
   
    
    const tdButton = document.createElement('td');

    const buttonEdit = document.createElement('button');
    buttonEdit.type = 'button';
    buttonEdit.className = 'btn btn-warning btn-sm  me-1';
    buttonEdit.innerHTML = 'update';

    buttonEdit.onclick = () =>{
        console.log("Edit event" + item.id);
        editButtonFunction(item,ind);
    }


    const buttonDelete = document.createElement('button');
    buttonDelete.type = 'button';
    buttonDelete.className = 'btn btn-danger btn-sm me-1';
    buttonDelete.innerHTML = 'delete';
    buttonDelete.onclick = () =>{
        deleteButtonFunction(item,ind);
    }

  
    if (buttonVisibility) {
      
           tdButton.appendChild(buttonEdit);
           tdButton.appendChild(buttonDelete);

           tr.appendChild(tdButton);

       } 
      
      
      
     
    tableBody.appendChild(tr);
                    
    });

}

const fillDataIntoOrderConfirmation = (tableId, dataList, propertyList, editButtonFunction, buttonVisibility = true, privilegeOb  )=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = parseInt(ind) + 1;
        tr.appendChild(tdIndex);

        for (const itemob of propertyList) {
            const td = document.createElement('td');
            // td.innerText =item.number;
            if (itemob.datatype == 'string') {
                td.innerText =  dataList[ind][itemob.property];
            }

            if (itemob.datatype == 'function') {
                td.innerHTML = itemob.property(dataList[ind]);
            }

            if (itemob.datatype == 'number'){
                td.innerText = dataList[ind][itemob.property];
            }
            tr.appendChild(td);
        }

        // Edit button
        const tdButton = document.createElement('td');
        const buttonEdit = document.createElement('button');
        buttonEdit.className = 'btn me-1';
        buttonEdit.type = 'button'
        buttonEdit.innerHTML = '<i class = "fa-solid fa-edit"></i>';

        buttonEdit.onclick = () =>{
            console.log("Edit event" + item.id);
            editButtonFunction(item,ind);
        }

       

        if(buttonVisibility){

            if (privilegeOb != null && privilegeOb.update) {
                tdButton.appendChild(buttonEdit);
            }
           

            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);
    });

}


const fillDataIntoDailyProduction = (tableId, dataList, propertyList, printButtonFunction, buttonVisibility = true, privilegeOb  )=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = parseInt(ind) + 1;
        tr.appendChild(tdIndex);

        for (const itemob of propertyList) {
            const td = document.createElement('td');
            // td.innerText =item.number;
            if (itemob.datatype == 'string') {
                td.innerText =  dataList[ind][itemob.property];
            }

            if (itemob.datatype == 'function') {
                td.innerHTML = itemob.property(dataList[ind]);
            }

            if (itemob.datatype == 'number'){
                td.innerText = dataList[ind][itemob.property];
            }
            tr.appendChild(td);
        }

        // Print button
        const tdButton = document.createElement('td');
        const buttonPrint = document.createElement('button');
        buttonPrint.className = 'btn me-1';
        buttonPrint.type = 'button'
        buttonPrint.innerHTML = '<i class = "fa-solid fa-edit"></i>';

        buttonPrint.onclick = () =>{
            console.log("Edit event" + item.id);
            printButtonFunction(item,ind);
        }

        if(buttonVisibility){

            if (privilegeOb != null && privilegeOb.update) {
                tdButton.appendChild(buttonPrint);
            }
            tr.appendChild(tdButton);
        }
        tableBody.appendChild(tr);
    });

}

const fillDataIntoPaymentTable= (tableId, dataList, propertyList)=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = parseInt(ind) + 1;
        tr.appendChild(tdIndex);

        for (const itemob of propertyList) {
            const td = document.createElement('td');
            // td.innerText =item.number;
            if (itemob.datatype == 'string') {
                td.innerText =  dataList[ind][itemob.property];
            }

            if (itemob.datatype == 'function') {
                td.innerHTML = itemob.property(dataList[ind]);
            }

            if (itemob.datatype == 'number'){
                td.innerText = dataList[ind][itemob.property];
            }
            tr.appendChild(td);

        }
        tableBody.appendChild(tr);

    });

}







