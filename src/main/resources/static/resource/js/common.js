//define function for ajax get request
const ajaxGetRequest = (url) =>{
    let serverResponse;

    $.ajax(url,{
        async:false,
        dataType : 'json',
        success:function(data,status,ahr){
            console.log("Success"+ url + " " + status + " " + ahr);
            serverResponse = data;
        },
        error : function(ahr,status,errormsg){
            console.log("failed"+ url + " " + errormsg + status +" " + ahr);

            serverResponse = [];
        }
    });

    return serverResponse;
}

//define function for ajax request(POST,PUT, DELETE)

const ajaxRequestBody = (url, method, object)=>{

    let serverResponse;
    $.ajax(url , {
        async: false,
        type: method,
        data: JSON.stringify(object),
        contentType: 'application/json',
        success: function (data, status, ahr) {
            console.log(url + "\n" +"Success" + status + " " + ahr);
            serverResponse = data;
        },
        error: function (ahr, status, errormsg) {
            console.log(url + "\n failed" + errormsg + status + " " + ahr);

            serverResponse = errormsg;
        }
    });
    return serverResponse;
}



const fillDataIntoSelect = (feildId, message,dataList,property, selectedValue) =>{
    feildId.innerHTML = '';
    let optionMessage = document.createElement('option');
    optionMessage.value = '';
    optionMessage.selected = 'selected';
    optionMessage.disabled = 'disabled';
    optionMessage.innerText = message;

    feildId.appendChild(optionMessage);

    for (const ob of dataList) {
    let option = document.createElement('option');
    option.value = JSON.stringify(ob); // convert into json string
    option.innerText = ob[property];
    if(selectedValue == ob[property] ){
       option.selected = 'selected';
    }
    feildId.appendChild(option);
        
    }
}

//set default element color
const resetIntoDefult = (elementArray) => {
    elementArray.forEach(element => {
    element.value = "";
    element.style.border = "1px solid #ced4da";
    
    }); 
}


const fillDataIntoDataList = (feildId,dataList,property, propertyTwo) =>{
    feildId.innerHTML = '';
    
    
    for (const ob of dataList) {
    let option = document.createElement('option');
    option.value = ob[property] +" " + ob[propertyTwo];
    
    feildId.appendChild(option);
        
    }}

