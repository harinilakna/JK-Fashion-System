// browser onload event
window.addEventListener('load', () => {

    userPrivilege = ajaxGetRequest("/privilege/bylogedusermodule/employee");
    console.log(userPrivilege);

});

//******** INCOME REPORT **********

const generateIncomeReport = () => {
    console.log("Generating Income Report...");

    //start date and ned date thamai parameters
    incomereport = ajaxGetRequest("/report/data/income?startdate="+dateStartDate.value+"&enddate="+dateEndDate.value + "&type="+selectType.value);
    // porderMaterials = ajaxGetRequestMapping("/reportdatapordermaterial");
    
    const displayPropertyList = [
        { datatype: 'string', property: 'count' }, //column full name
        { datatype: 'string', property: 'sum' },
        { datatype: 'string', property: 'day' }
    ];
    //call filldataintotable function 
    //(tableid, dataList,displayPropertyList,editFunctionName,deleteFunctionName,printFunctionName,buttonVisibility)
    // fillDataIntoTable2(tableEmployee , employees,displayPropertyList,refillEmployeeForm,deleteEmployee,printEmployee,true);

    fillDataIntoPaymentTable(tableIncomeReport, incomereport, displayPropertyList);

    labelArray = new Array(); 
    dataArray = new Array();

    for (let index in incomereport ) {
        labelArray.push(incomereport[index].day);
        dataArray.push(incomereport[index].sum);

    }

    colorArray = new Array();
    for (let index = 0; index < dataArray.length; index++) {
        colorArray.push(getRandomColor());
        
    }

    //refresh chart with data
    const ctx = document.getElementById('myChart');

    mychartView = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelArray, //methana enne material names tika
            datasets: [{
                label: 'Amount',
                data: dataArray, //methana enne quantities tika
                borderWidth: 1,
                backgroundColor: colorArray
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ******* EXPENSE REPORT *******

// const generateExpenseReport = () => {
//     //start date and ned date thamai parameters
//     expensereport = ajaxGetRequestMapping("/reportdailyexpense?startdate="+dateStartDate.value+"&enddate="+dateEndDate.value + "&type="+selectType.value);
//     // porderMaterials = ajaxGetRequestMapping("/reportdatapordermaterial");
//
//     const displayPropertyList = [
//         { dataType: 'text', propertyName: 'count' }, //column full name
//         { dataType: 'text', propertyName: 'sum' },
//         { dataType: 'text', propertyName: 'day' }
//     ];
//     //call filldataintotable function
//     //(tableid, dataList,displayPropertyList,editFunctionName,deleteFunctionName,printFunctionName,buttonVisibility)
//     // fillDataIntoTable2(tableEmployee , employees,displayPropertyList,refillEmployeeForm,deleteEmployee,printEmployee,true);
//
//     fillDataIntoTablePrint(tableExpenseReport, expensereport, displayPropertyList);
//
//     labelArray = new Array();
//     dataArray = new Array();
//
//     for (let index in expensereport ) {
//         labelArray.push(expensereport[index].day);
//         dataArray.push(expensereport[index].sum);
//
//     }
//
//     colorArray = new Array();
//     for (let index = 0; index < dataArray.length; index++) {
//         colorArray.push(getRandomColor());
//
//     }
//
//     //refresh chart with data
//     const ctx = document.getElementById('myChart');
//
//     mychartView = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: labelArray, //methana enne material names tika
//             datasets: [{
//                 label: 'Amount',
//                 data: dataArray, //methana enne quantities tika
//                 borderWidth: 1,
//                 backgroundColor: colorArray
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

const clearChart = () => {
    if (mychartView != undefined) {
        mychartView.destroy();
    }
}

// *To make the end date always --> startdate + 1 (For validation)

let startDatePicker = document.getElementById('dateStartDate');
let endDatePicker = document.getElementById('dateEndDate');

// Event listener for when the start date is picked
startDatePicker.addEventListener('change', function() {
    let startDate = new Date(startDatePicker.value);
    
    // Set the minimum date for the end date picker to be one day after the start date
    let minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);
    
    let minMonth = minEndDate.getMonth() + 1;
    if (minMonth < 10) {
        minMonth = '0' + minMonth;
    }
    
    let minDay = minEndDate.getDate();
    if (minDay < 10) {
        minDay = '0' + minDay;
    }
    
    endDatePicker.min = minEndDate.getFullYear() + '-' + minMonth + '-' + minDay;

    // Optionally reset the end date if it's before the new minimum
    if (new Date(endDatePicker.value) < minEndDate) {
        endDatePicker.value = '';
    }
});

// -------- create table refresh function --------
const refreshPaymentTable = () => {

    //text ----> string,number , data
    // function ---> object , array , boolean
    const displayPropertyList = [
        { dataType: 'text', propertyName: 'count' }, //column full name
        { dataType: 'text', propertyName: 'sum' }
    ];

    fillDataIntoPaymentTable(tableIncomeReport, porderMaterials, displayPropertyList);

}

const printChart = () => {

    viewChart.src = mychartView.toBase64Image();
    let newWindow = window.open();

    newWindow.document.write(viewChart.outerHTML + tablePorderMaterialReport.outerHTML + "<script>viewChart.style.removeProperty('display');</script>")

    //print the table after 1000 milliseconds of new window opening
    setTimeout(function (){
        newWindow.print();
    },1000);
}

//To get random colours in the chart
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

