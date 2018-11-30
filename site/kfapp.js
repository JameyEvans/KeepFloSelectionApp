var dataObject;
dataObject = distributorLibrary;

var fmDistType, fmInletType, fmInletSize, fmCircuitCt;
var fmStrCircuitSize, fmFloatCircuitSize, fmOrificeSize, fmStrOrificeSize, fmNozzleType, fmHasSidePort;
var fmRefrgt, fmCapacity, fmSuctionTemp, fmLiquidTemp;
var fmTubeLength, fmSelectBtn, fmDistPartNumber;
isCollapsed = false;
var isAllShown = true;
var fields = [];
var requiredForms, isValid;
var testItem = "This is a test";
var tableSelector, tableHTML;
var tableArr = [];
var tableArrIndex;
var emptyTableString = "Submit form to populate table with distributor recommendations.";
var printTableHeadersHTML;
var isFirstClick = true;
var minNzLoad = 50;
var maxNzLoad = 200;
refreshTable();

// ----------------------------------------------------------------------------------------
// test functions go here:

$("#selectKnownDist button").on("click", function () {
    updateFormValues();
    //alert("distPartNumber = " + fmDistPartNumber);
    var tempObject = getDistType(fmDistPartNumber);
    if (typeof tempObject == "object") {
        genHTMLFormData(tempObject);
        if (tableArr.length == 0) {
            alert("'" + fmDistPartNumber + "' is not a recognized part number.");
        }
        return;
    } else {
        alert("'" + fmDistPartNumber + "' is not a recognized part number.");
    }

});



// ----------------------------------------------------------------------------------------



// set minNozzleLoad
$("#fmMinNozzleLoading").on("change", function () {
    let val = parseFloat($(this)[0].value);
    if (isNaN(val)) {
        let message = "'" + $(this)[0].value + "' is not a number.";
        alert(message);
        $(this)[0].value = minNzLoad;
    }
    else {
        minNzLoad = parseFloat($(this)[0].value);
    }
});

// set maxNzLoad
$("#fmMaxNozzleLoading").on("change", function () {
    let val = parseFloat($(this)[0].value);
    if (isNaN(val)) {
        let message = "'" + $(this)[0].value + "' is not a number.";
        alert(message);
        $(this)[0].value = maxNzLoad;
    }
    else {
        maxNzLoad = parseFloat($(this)[0].value);
    }
});






// Allows for select boxes to allow user input
$(".taggable").select2({
    tags: true,
    width: "100%",
    height: "34px",
    createTag: function (params) {
        var term = $.trim(params.term);
        //console.log(term);
        if (isNaN(term)) {
            console.log(term + "is not a number");
            return null;
        }
        return {
            id: term,
            text: term,
            newTag: true
        };
    }
});

// disable form boxes when certain options are selected
// if distributor type = venturi then set to default values and disable nozzle orifice, nozzle type, and side port
$("#distType").on("change", function () {
    if ($(this)[0].value === "venturi") {
        // set nozzle orifice to default "select" option amd disable
        $("#nozzleSize")[0].selectedIndex = 0;
        $("#nozzleSize").prop("disabled", true);
        // set nozzle type to default and disable
        $("#nozzleType")[0].selectedIndex = 0;
        $("#nozzleType").prop("disabled", true);
        // set side port to default and disable
        $("#sidePort")[0].selectedIndex = 0;
        $("#sidePort").prop("disabled", true);
    } else {
        $("#nozzleSize, #nozzleType, #sidePort").prop("disabled", false);
    }
});
// 

// Distributor selection mode tabs

$("#selectionModeTab button").on("click", function () {
    $("#selectionModeTab button").removeClass("selectedMode");
    $(this).addClass("selectedMode");
    if ($(this)[0].id === "rateKnownBtn") {
        $("div.distContainer").addClass("hidden");
        $("#selectKnownDist").removeClass("hidden");
        $("#distPartNumberInputDiv").removeClass("hidden");
        $("div.perfContainer").removeClass("col-xs-6");
    } else {
        $("div.distContainer").removeClass("hidden");
        $("#selectKnownDist").addClass("hidden");
        $("#distPartNumberInputDiv").addClass("hidden");
        $("div.perfContainer").addClass("col-xs-6");
    }
});

var testVariable;

function refreshTable() {
    const startTime = performance.now();
    if ($.fn.DataTable.isDataTable("#dataTableExample")) {
        //$("#dataTableExample").DataTable().clear().destroy();
        $("#dataTableExample").DataTable().clear().rows.add(tableArr).draw();
        return;
    }
    
    $('#dataTableExample').DataTable({
        responsive: true,
        data: tableArr,
        paging: false,
        scrollY: 400,
        scrollX: true,
        dom: 'Bfrtip',
        buttons: [

            {
                extend: 'print',
                messageTop: function () {
                    return $("#printTableHeaderData")[0].innerHTML;
                },
                messageBottom: '<p>&copy;2018 Control Devices LLC.</p>',
                pageSize: 'Letter',
                customize: function(win){
                    $(win.document.body).find('table').addClass('display').css('font-size', '13px');
                    $(win.document.body).find('table').css('text-align','center');
                    $(win.document.body).find('table').css('border','10pt');
                    /*$(win.document.body).find('tr:nth-child(odd) td').each(function(index){
                        $(this).css('background-color', '#D0D0D0');
                    });*/
                    /*$(win.document.body).find('th').css('background-color', '#0278BE'); todo: color table header*/
                    $(win.document.body).find('th').css('background-color', '#F8F8F8');
                    $(win.document.body).find('h1').css('text-align','left');
                },
                text: 'Print Table',
                title:'',
                exportOptions: {
                    columns: ':not(.noVis)'
                },
                orientation: 'landscape',
                footer: true
            },
            {
                text: 'Export To PDF',
                extend: 'pdfHtml5',

                message: function () {
                    return $("#printTableHeaderData")[0].innerHTML;
                },

                exportOptions:{
                  columns: ':not(.noVis)'
                },
                orientation: 'landscape',
                pageSize: 'LEGAL'
            },
            {
                text: 'Export to Excel',
                exportOptions:{
                    //columns: ':visible'
                    //columns: ':not(.noVis)'
                    columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]                 
                        
                },
                extend: 'excel'
            },
            {
                extend: 'copy',
                exportOptions:{
                    columns: ':not(.noVis)'
                }
            },
            {
                extend: 'csv',
                exportOptions:{
                    columns: ':not(.noVis)'
                }
            }
        ],
        fixedHeader: {
            header: true
        },
        language: {
            emptyTable: function () {
                if (isFirstClick) {
                    isFirstClick = false;
                    return "Complete form to populate table with distributor selection.";
                }
                else {
                    return "No suitable distributors were found for this application.";
                }
            }
        },
        searching: false,
        order: [[18, "asc"]], //sort ascending by perfIndex
        columnDefs: [
            {
                "min-width": "110px",
                targets: 1
            },
            {
                targets: [11, 12, 13, 14, 17, 18],
                className: "noVis"
            }],
        columns: [
            { data: "style"},
            { data: "partNumber" },
            { data: "dpTubes" },
            { data: "pctTubeLoading" },
            { data: "dpNozzle" },
            { data: "pctDistLoading" },
            { data: "dpTotal" },
            { data: "inletSize" },
            { data: "outletSize" },
            { data: "orificeSize" },
            { data: "refrigerant" },
            { data: "capacity" },
            { data: "suctionTemp" },
            { data: "liquidTemp" },
            { data: "tubeLength" },
            { data: "circuitCount" },
            { data: "orificeType" },
            { data: "tableArrIndex", visible: false },
            { data: "perfIndex", visible: false}
        ]
    });
}

function getColumns(){
    return [
        { data: "style"},
        { data: "partNumber" },
        { data: "dpTubes" },
        { data: "pctTubeLoading" },
        { data: "dpNozzle" },
        { data: "pctDistLoading" },
        { data: "dpTotal" },
        { data: "inletSize" },
        { data: "outletSize" },
        { data: "orificeSize" },
        { data: "refrigerant" },
        { data: "capacity" },
        { data: "suctionTemp" },
        { data: "liquidTemp" },
        { data: "tubeLength" },
        { data: "circuitCount" },
        { data: "orificeType" },
        { data: "tableArrIndex", visible: false },
        { data: "perfIndex", visible: false}
    ]
}

function exportToPdf(){
    $('.buttons-pdf').click();
}

function exportToExcel(){
    $('.buttons-excel').click();
}

function copyTable(){
    $('.buttons-copy').click();
}

function exportToCsv(){
    $('.buttons-csv').click();
}

function printTable(){
    $('.buttons-print').click();
}


var orificeList = {"1/9" : 0.1111, "1/6" : 0.1667,
					"1/4" : 0.25, "1/3" : 0.3333,
					"1/2" : 0.5, "2/3" : 0.666667, "3/4" : 0.75,
					"1" : 1, "1-1/2" : 1.5,
					"2" : 2, "2-1/2" : 2.5,
					"3" : 3, "4" : 4, "4.5":4.5,
					"5" : 5, "6" : 6,
					"8" : 8, "10" : 10,
					"12" : 12, "15" : 15,
					"17" : 17, "20" : 20,
					"25" : 25, "30" : 30,
					"35" : 35, "40" : 40,
					"50" : 50, "68" : 68,
					"120" : 120
};

//initialize selectors
fmSelectBtn = document.querySelector("#distSelectBtn");
//tableSelector = document.querySelector("#distContents");

fmSelectBtn.addEventListener("click", function (event) {
    //not sure why the preventDefault works but it prevents errors.
  	event.preventDefault();
	// when event button is clicked then assign values to variables.

    // get most recent data from form
	updateFormValues();

    // determine if any required forms are missing data.
    requiredForms = [[fmCircuitCt, "Circuit Count"], [fmRefrgt, "Refrigerant Type"],
        [fmCapacity, "Capacity"], [fmSuctionTemp, "Suction Temperature"],
        [fmLiquidTemp, "Liquid Temperature"], [fmTubeLength, "Distributor Tube Length"]];

    var missingValues = "";
	for (var i = 0; i < requiredForms.length; i++) {
        if (requiredForms[i][0] === "") {
            if (i === 0) {
                missingValues = requiredForms[i][1];
            } else {
                missingValues += ", " + requiredForms[i][1];
            }
        }
    }

    if (missingValues.length === 0) {
        // if no errors then populate table containing distributor selections
        genHTMLFormData();
        //toggleAllFields();
    } else {
        alert("The following required fields are missing data: " + missingValues);
    }
});

function generateNozzlePartNumber(bodyStyle, circuitCt, strCircuitSize, strOrificeSize){
    return bodyStyle + "-" + circuitCt + "-" + strCircuitSize + "-" + strOrificeSize;
}

function collapseTable(){
    this.isCollapsed =! this.isCollapsed;
    var element = document.getElementById("collapseIconForDataTable");
    if(this.isCollapsed){
        /*var temp = document.getElementById("collapseTable");
        temp.classList.remove("show");*/
        this.isAllShown =! this.isAllShown;
        element.classList.remove("glyphicon-plus");
        element.classList.add("glyphicon-minus");
        toggleAllFields();
    } else {
        this.isAllShown =! this.isAllShown;
        toggleAllFields();
        element.classList.remove("glyphicon-minus");
        element.classList.add("glyphicon-plus");
    }

}

function toggleAllFields(){
	/*this.isAllShown =! this.isAllShown;*/
	$(".hideMyShit").toggleClass("toggleable", this.isAllShown);
}

function updateFormValues(){
		fmDistType = document.querySelector("#distType").selectedOptions[0].value;
		fmInletType = document.querySelector("#inletType").selectedOptions[0].value;
		fmInletSize = document.querySelector("#inletSize").selectedOptions[0].value;
		fmCircuitCt = document.querySelector("#numberCircuits").value;
		fmStrCircuitSize = document.querySelector("#tubingOD").selectedOptions[0].label;
		fmFloatCircuitSize = document.querySelector("#tubingOD").selectedOptions[0].value;
		fmOrificeSize = document.querySelector("#nozzleSize").selectedOptions[0].value;
		fmStrOrificeSize = document.querySelector("#nozzleSize").selectedOptions[0].label;
		fmNozzleType = document.querySelector("#nozzleType").selectedOptions[0].value;
		fmHasSidePort = document.querySelector("#sidePort").selectedOptions[0].value;
		fmRefrgt = document.querySelector("#refrgType").selectedOptions[0].value;
		fmCapacity = document.querySelector("#capacity").value;
		fmSuctionTemp = document.querySelector("#suctionTempOld").selectedOptions[0].value;
		fmLiquidTemp = document.querySelector("#liquidTemp").selectedOptions[0].value;
        fmTubeLength = document.querySelector("#tubeLength").selectedOptions[0].value;
        fmDistPartNumber = document.querySelector("#distPartNumber").value;
        updatePrintTableHeaderData();
}

function updatePrintTableHeaderData() {
    $("#refrgtSpan")[0].innerText = fmRefrgt;
    $("#suctionTempSpan")[0].innerText = fmSuctionTemp;
    $("#liquidTempSpan")[0].innerText = fmLiquidTemp;
    $("#circuitCtSpan")[0].innerText = fmCircuitCt;
    $("#tubeLengthSpan")[0].innerText = fmTubeLength;
    $("#capacitySpan")[0].innerText = fmCapacity;
}

// required form entries: fmCircuitCt, fmRefrgt, fmCapacity, fmSuctionTemp, 
//						  fmLiquidTemp, fmTubeLength
// optional: fmDistType, fmInletType, fmInletSize, fmCircuitSize, fmNozzleType,
//			 fmOrificeSize, fmNozzleType, fmHasSidePort


function genValidDistObjects(dataArr = dataObject) {
    filterTest = function (el) {
        // callback function for filter.  Assigns criteria to sort data objects.
        arr = [[fmDistType, el.type], [fmInletType, el.inletType], [fmInletSize, el.inletDiameter],
        [fmStrCircuitSize, el.circuitSize], [fmNozzleType, el.nozzleType], [fmHasSidePort, el.hasSidePort]];

        // if circuit count is outside of min and max conditions return false
        if (fmCircuitCt < el.minCircuit || fmCircuitCt > el.maxCircuit) {
            // console.log("element " + cnt + " returned false for tube condition.")
            return false;
        }
        // Check each element in array to compare if it meets criteria.
        var isValid = true;
        arr.forEach(function (element) {
            // console.log("el2 = " + element[0]);
            if (element[0] !== null && element[0] !== undefined && element[0] !== "any" && element[0].toLowerCase() !== "unknown") {
                // console.log(element[0] + " does not equal 'any'");

                // Zach, don't change this to !==.
                if (element[0] != element[1]) {
                    //console.log(element[0] + " does not equal " + element[1]);
                    isValid = false;
                }
            }
        });

        // if element hasn't returned false already then it is a valid object
        // console.log(el + " returned true.");
        if (isValid) {
            return true;
        } else {
            return false;
        }
    };

	// returns array containing all valid distributor objects
	return dataArr.filter(filterTest);
}

function genValidOrificeSizes(sysCapacity, refrgt, tLiq, tSuct, length){
	// returns array of valid orifice sizes for given performance characteristics.	
    // min/maxNzLoad = percent nozzle loading for given specs.
    //minNzLoad = 75;
    //maxNzLoad = 125;
	var keyList = Object.keys(orificeList);
	var validKeys = [];
	var pctLoading, nzlRating;

    if (fmStrOrificeSize.toLowerCase() !== "unknown") {
        nzlRating = StdNozzleRating(refrgt, orificeList[fmStrOrificeSize], tLiq, tSuct, length);
        pctLoading = sysCapacity / nzlRating * 100;
		validKeys.push([fmStrOrificeSize, nzlRating, pctLoading]);  // was push(fmStrOrificeSize); 07.06.18
	} else{
		for (var i = 0; i < keyList.length; i++) {
			nzlRating = StdNozzleRating(refrgt, orificeList[keyList[i]], tLiq, tSuct, length);
			//console.log("Nozzle Rating (" + keyList[i] + ") = " + nzlRating);
			pctLoading = sysCapacity / nzlRating * 100;
			//console.log("Percent loading = " + pctLoading + "%");

			if(pctLoading >= minNzLoad && pctLoading <= maxNzLoad){
				validKeys.push([keyList[i], nzlRating, pctLoading]);  // was push(keyList[i]); 07.06.18
			}
		}
	}
	return validKeys;
}

function genHTMLFormData(objArr = 0) {   
   
    // delete data from tableArr
    this.tableArr = [];
    this.tableArrIndex = 0;
    if (objArr === 0) {
        if (fmStrCircuitSize === "Unknown") {
            fmStrCircuitSize = SelectTubeSize(fmLiquidTemp, fmTubeLength, "nozzle", fmRefrgt, fmSuctionTemp, fmCapacity, fmCircuitCt);
        }
        objArr = genValidDistObjects();

    } else {
        objArr = genValidDistObjects([objArr]);
    }

	//var objArr = genValidDistObjects();
	var HTMLStr = "";
	var partNumber;
    var arrValidNozzle = [["N/A",null,null]];
    var nzlRating, pctNzLoading, dpNozzle;
	//clear html in table body
    //tableSelector.innerHtml = "";

    // if distributor has potential to be nozzle type then determine all valid nozzle combinations and capacities and store in arrValidNozzle
	if(fmDistType !== "venturi"){
        arrValidNozzle = genValidOrificeSizes(fmCapacity, fmRefrgt, fmLiquidTemp, fmSuctionTemp, fmTubeLength, minNzLoad, maxNzLoad);
        console.log(arrValidNozzle);
	}


    // loop through each element in objArr of valid distributors
	objArr.forEach(function(el){
        var iLength;
        if (el.type.toLowerCase() === "venturi") {
            iLength = 1;
        } else {
            iLength = arrValidNozzle.length;
        }
        for (var i = 0; i < iLength; i++) {
            var tempObject = [];
            var qt = StdTubeRating(fmLiquidTemp, fmTubeLength, el.type, fmRefrgt, el.circuitSize, fmSuctionTemp);
            var percentTubeLoading = fmCapacity / fmCircuitCt / qt * 100;
            var isValid = true;

            if (el.type.toLowerCase() === "nozzle") {
                partNumber = generateNozzlePartNumber(el.bodyStyle, fmCircuitCt, el.circuitSize, arrValidNozzle[i][0]);
                tempObject.partNumber = generateNozzlePartNumber(el.bodyStyle, fmCircuitCt, el.circuitSize, arrValidNozzle[i][0]);
                nzlRating = arrValidNozzle[i][1]; //nozzle rating in tons
                tempObject.nzlRating = nzlRating.toFixed(1); //nozzle rating in tons
                pctNzLoading = arrValidNozzle[i][2]; // percent loading of nozzle
                tempObject.pctNzLoading = pctNzLoading.toFixed(1); // percent loading of nozzle
                dpNozzle = pctLoadToDP(fmRefrgt, pctNzLoading);  // pressure drop across nozzle
                tempObject.dpNozzle = pctLoadToDP(fmRefrgt, pctNzLoading).toFixed(1);  // pressure drop across nozzle
                tempObject.orificeSize = arrValidNozzle[i][0];
                

            } else {
                // if venturi
                partNumber = el.bodyStyle;
                tempObject.partNumber = partNumber;
                // RateVenturi returns object containing {"q", "dpn", "dpt", "dp"}
                var venturiStats = {};
                venturiStats = RateVenturi(fmTubeLength, fmCircuitCt, fmCapacity, qt);
                dpNozzle = venturiStats.dpn;
                pctNzLoading = (dpNozzle / 5) * 100;
                if (pctNzLoading <= minNzLoad || pctNzLoading >= maxNzLoad) {
                    isValid = false;
                }
                tempObject.pctNzLoading = pctNzLoading.toFixed(1);           
                tempObject.dpNozzle = dpNozzle.toFixed(1);
                tempObject.orificeSize = "N/A";
			}
            
            tempObject.percentTubeLoading = percentTubeLoading;
			// pressure drop across tubes assuming 10 psi is 100% loading
            tempObject.perfIndex = getPerfIndex(pctNzLoading, percentTubeLoading);
            //console.log("pn: " + tempObject.partNumber + "pctNzLoading = " + pctNzLoading + "; percentTubeLoading = " + percentTubeLoading + "; perfIndex = " + tempObject.perfIndex);
            var dpTubes = percentTubeLoading / 10;
            tempObject.dpTubes = percentTubeLoading / 10;
            tempObject.style = el.type;
            tempObject.refrigerant = fmRefrgt;
            tempObject.capacity = fmCapacity;
            tempObject.suctionTemp = fmSuctionTemp;
            tempObject.liquidTemp = fmLiquidTemp;
            tempObject.tubeLength = fmTubeLength;
            tempObject.dpTotal = (dpNozzle + dpTubes).toFixed(1);
            tempObject.dpTubes = dpTubes.toFixed(1);
            tempObject.pctTubeLoading = percentTubeLoading.toFixed(1) + "%";
            try {
                tempObject.pctDistLoading = pctNzLoading.toFixed(1) + "%";
            }
            catch (err) {
                tempObject.pctDistLoading = pctNzLoading + "%";
            }
            //removed .toFixed(1) temporarily, throwing error
            tempObject.inletSize = el.inletDiameter;
            tempObject.outletSize = fmStrCircuitSize;
            tempObject.circuitCount = fmCircuitCt;
            
            tempObject.orificeType = el.nozzleType;
            tempObject.tableArrIndex = tableArrIndex;
            tempObject.drawingType = el.drawingType;
            tempObject.oal = el.oal;
            tempObject.od = el.od;
            tempObject.inletTol = el.inletTol;
            tempObject.inletLength = el.inletLength;
            tempObject.flareAnnot = el.flareAnnot;
            tempObject.sideHoleLoc = el.sideHoleLoc;


            if (isValid) {
                tableArr.push(tempObject);
                tableArrIndex++;
            }
        }
    });
    // for debugging purposes
    //const duration = performance.now() - startTime;   
    //console.log(`genHTMLFormData took ${duration}ms before refreshTable()`);
    // -------------
    refreshTable();  
    // -------------
    // debug
    //const newDuration = performance.now() - startTime;
    //console.log(`genHTMLFormData took ${newDuration}ms after refreshTable()`);
    //

}



// ---------------------------------------------------------------------------------
// drawing modal javascript
// ---------------------------------------------------------------------------------
$("#dataTableExample").on("click", "tr[role='row'] td:nth-child(2)", function () {
    var table = $("#dataTableExample").DataTable();
    var modalDataObj = table.row($(this).closest('tr')).data();
    // assign part number to modal span
    $("#modalPartNumber")[0].innerText = modalDataObj.partNumber;
    viewDrawingModal(modalDataObj.tableArrIndex);
});


function viewDrawingModal(tableArrIndex) {
    var distType;
    var imgArr = ["./site/images/dickbutt.jpg",
        "./site/images/standardDistributor.png",
        "./site/images/hgbDistributor.png",
        "./site/images/flareInlet.png",
        "./site/images/stubInlet.png"
    ];

    var dimObj = {
        "modalDistOAL": tableArr[tableArrIndex].oal,
        "modalDistOD": tableArr[tableArrIndex].od,
        "modalDistInletOD": tableArr[tableArrIndex].inletTol,
        "modalDistInletLg": tableArr[tableArrIndex].inletLength,
        "modalDistFlare": tableArr[tableArrIndex].flareAnnot,
        "modalDistSideHoleLoc": tableArr[tableArrIndex].sideHoleLoc
    };

    for (var key in dimObj) {
        if (!isNaN(dimObj[key])) {
            // if is a number
            dimObj[key] = parseFloat(dimObj[key]).toFixed(3);
        }
        else {
            console.log(dimObj[key] + " - NOT a num");
        }        
    }
    distType = tableArr[tableArrIndex].drawingType;
    // set appropriate image corresponding to radio button
    var i;
    // remove any .hiddenModal classes from modal
    $(".modal-body div").removeClass("hiddenModal");
    switch (distType) {
        case "std":
            i = 1;
            $("#modalDistFlare, #modalDistSideHoleLoc").addClass("hiddenModal");
            setModalDimLocations([47, 14], [9, 47.8], [49, 76], [17.3, 59.1], [0, 0], [0, 0]);
            break;
        case "hgb":
            i = 2;
            setModalDimLocations([58, 16], [20, 48.5], [59, 79], [34, 66.3], [0, 0], [25.5, 62]);
            $("#modalDistFlare").addClass("hiddenModal");
            break;
        case "flare":
            i = 3;
            $("#modalDistSideHoleLoc, #modalDistInletOD, #modalDistInletLg").addClass("hiddenModal");
            setModalDimLocations([56.5, 19], [18, 50.7], [0, 0], [0, 0], [73, 79.5], [0, 0]);
            break;
        case "stub":
            i = 4;
            $("#modalDistFlare, #modalDistSideHoleLoc").addClass("hiddenModal");
            setModalDimLocations([57, 16], [20.2, 47.5], [58.5, 78], [35, 68.2], [0, 0], [0, 0]);
            break;
        default:
            i = 0;
    }
    $("#modalDistImg").attr('src', imgArr[i]);
    console.log("distType = " + distType);
    $("#drawingModal").modal("show");

    function setModalDimLocations(distOD, distOAL, distInletOD, distInletLg = [0, 0], distFlare = [0, 0], distSideHoleLoc = [0, 0]) {
        // function sets css values for each dimensions position.  
        // each input variable is array containing [<top %>, <left %>].  No need to include % sign in value.  
        // setModalDimLocations([12, 11], ....)

        var idObj = {
            "#modalDistOD": distOD,
            "#modalDistOAL": distOAL,
            "#modalDistInletOD": distInletOD,
            "#modalDistInletLg": distInletLg,
            "#modalDistFlare": distFlare,
            "#modalDistSideHoleLoc": distSideHoleLoc
        };

        for (var key in idObj) {
            $(key).css({ "top": idObj[key][0] + "%", "left": idObj[key][1] + "%" });
            document.querySelector(key).innerText = dimObj[key.replace("#", "")];
        };

    };
};

function getPerfIndex(pctNzLoading, pctTubeLoading) {
    var x = 100 - pctNzLoading;
    if (x < 0) {
        // slightly favor 100+ percent loading
        pctNzLoading = pctNzLoading - .1*(pctNzLoading - 100);
    }
    return Math.abs(100 - pctNzLoading) + Math.abs(100 - pctTubeLoading);
}

function getDistType(distPartNo) {

    var knownDistObj = {};
    fmDistType = "any";
    fmInletType = "any";
    fmInletSize = "any";
    fmOrificeSize = "any";
    fmStrOrificeSize = "Unknown";
    fmNozzleType = "any";
    fmHasSidePort = "no";



    // venturi starts FXX-, SXX-, X-, or XX-
    // inletSize/8 - circuitSize / 16 - circuitCount

    // nozzle starts SXXX-, FXXX-, XXX-, XXXX-
    // body style starting with inletSize / 8 - circuitCount - circuitSize (ex. 3/16) - nozzleNumber - circuitLength

    // if no "-" then not valid part number
    var result = distPartNo.split("-");
    var len = result.length;
    if ((len - 1) == 0) {
        console.log("distPartNo does not contain '-' and is not a valid part number");
        return -1;
    }


    // if first character = s or f then drop character and set type = stub/flare
    var firstChar = distPartNo[0].toLowerCase();
    var evalString = distPartNo;

    if (firstChar == "s") {
        fmInletType = "solderIDM";
        //evalString = distPartNo.substring(1);

    } else if (firstChar == "f") {
        fmInletType = "flare";
        //evalString = distPartNo.substring(1);
    }
    else {
        fmInletType = "solderODM";
    }

    // if next characters up to "-" has length < 3 then venturi

    var index;
    if (result[0].length < 3) {
        fmDistType = "venturi";
        fmStrCircuitSize = getFractionalSize(result[1]);
        fmCircuitCt = result[2];
        index = findWithAttr(dataObject, "bodyStyle", distPartNo);
        if (index >= 0) {
            return dataObject[index];
        } else {
            return -1;
        }
    }
    // if next characters up to "-" has length >=3 then nozzle
    else {
        fmDistType = "nozzle";
        fmStrCircuitSize = result[2];
        fmCircuitCt = result[1];
    }
    index = findWithAttr(dataObject, "bodyStyle", result[0], "circuitSize", fmStrCircuitSize);
    if (index < 0) {
        // if its not a keepflo body style then maybe they entered a sporlan style
        index = findWithAttr(dataObject, "sporlanStyle", result[0], "circuitSize", fmStrCircuitSize);
    }
    if (index >= 0) {
        if (len > 3) {
            if (dataObject[index].hasSidePort == "no") {
                fmStrOrificeSize = result[3];
                fmOrificeSize = eval(fmStrOrificeSize);

            } else {
                fmHasSidePort = "yes";
                fmStrOrificeSize = result[4];
                fmOrificeSize = eval(fmStrOrificeSize);
            }
        }
        knownDistObj = dataObject[index];
        //if (["5/32", "3/16", "1/4", "5/16", "3/8", "1/2"].includes(fmStrCircuitSize)) {
        //    knownDistObj.circuitSize = fmStrCircuitSize;
        //}
        //else {
        //    alert("Circuit size: '" + fmStrCircuitSize + "' was not recognized.");
        //}
        return knownDistObj;
    } else {
        return -1;
    }

}


function findWithAttr(array, attr1, value1, attr2 = null, value2=null) {
    // returns index of object in array, with attribute = value
    // ex.  var Data = [
    // { id_list: 2, name: 'John', token: '123123' },
    // { id_list: 1, name: 'Nick', token: '312312' }];
    // findWithAttr(Data, 'name', 'John'); // returns 0
    // findWithAttr(Data, 'token', '312312'); // returns 1
    // findWithAttr(Data, 'id_list', '10'); // returns -1

    if (attr2 === null) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr1] == value1) {
                return i;
            }
        }
    } else {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr1] == value1 && array[i][attr2] == value2) {
                return i;
            }
        }

    }
    
    return -1;
}

function getFractionalSize(numer, denom = 16.) {
    // numerator = float
    var fraction = numer / denom;
    var len = fraction.toString().length - 2;
    // return string with reduced fraction / 16
    var gcd = function (a, b) {
        if (b < 0.0000001) return a;
        return gcd(b, Math.floor(a % b))
    };
    var denominator = Math.pow(10, len);
    var numerator = fraction * denominator;
    var divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;
    return Math.floor(numerator) + "/" + Math.floor(denominator);
}

// to show modal use $('#myModal').modal('toggle'); or $('#myModal').modal('show'); or $('#myModal').modal('hide');