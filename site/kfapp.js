var dataObject;
dataObject = distributorLibrary;

var fmDistType, fmInletType, fmInletSize, fmCircuitCt;
var fmStrCircuitSize, fmFloatCircuitSize, fmOrificeSize, fmStrOrificeSize, fmNozzleType, fmHasSidePort;
var fmRefrgt, fmCapacity, fmSuctionTemp, fmLiquidTemp;
var fmTubeLength, fmSelectBtn;
isCollapsed = false;
var isAllShown = true;
var fields = [];
var requiredForms, isValid;
var testItem = "This is a test";
var tableSelector, tableHTML;
var tableArr = [];
var tableArrIndex;
var emptyTableString = "Submit form to populate table with distributor recommendations.";
refreshTable();

//handle print
/*$(document).bind("keyup keydown", function(e){
    if(e.ctrlKey && e.keyCode === 80){
        printTable();
        return false;
    }
});*/



// Allows for select boxes to allow user input
$(".taggable").select2({
    tags: true,
    width: "100%",
    height: "34px",
    createTag: function (params) {
        var term = $.trim(params.term);
        console.log(term);
        if (isNaN(term)) {
            console.log(term + "is not a number");
            return null;
        }
        return {
            id: term,
            text: term,
            newTag: true
        }
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

function refreshTable(){
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
                messageTop: '<p><strong>KeepFlo, Inc.</strong><br/>Fenton, Missouri<br/>636-349-2626<br/><emphasis>keepflo@aol.com</emphasis></p>',
                messageBottom: '<p>&copy;2018 Control Devices LLC.</p>',
                pageSize: 'A4',
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
                title:'KeepFlo Distributor Selection',
                exportOptions: {
                    columns: ':visible'
                },
                orientation: 'landscape',
                footer: true,
            },
            {
                text: 'Export To PDF',
                extend: 'pdfHtml5',
                exportOptions:{
                  columns: ':visible'
                },
                orientation: 'landscape',
                pageSize: 'LEGAL'
            },
            {
                text: 'Export to Excel',
                exportOptions:{
                    columns: ':visible'
                },
                extend: 'excel'
            },
            {
                extend: 'copy',
                exportOptions:{
                    columns: ':visible'
                }
            },
            {
                extend: 'csv',
                exportOptions:{
                    columns: ':visible'
                }
            }
        ],
        fixedHeader: {
            header: true
        },
        "language": {
            "emptyTable": "Table is empty."
        },
        "searching": false,
        "order": [[18, "asc"]], //sort ascending by perfIndex
        "columnDefs": [
            { "min-width": "110px", "targets": 1 }],
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
					"1/2" : 0.5, "3/4" : 0.75,
					"1" : 1, "1-1/2" : 1.5,
					"2" : 2, "2-1/2" : 2.5,
					"3" : 3, "4" : 4,
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
tableSelector = document.querySelector("#distContents");

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
}


// required form entries: fmCircuitCt, fmRefrgt, fmCapacity, fmSuctionTemp, 
//						  fmLiquidTemp, fmTubeLength
// optional: fmDistType, fmInletType, fmInletSize, fmCircuitSize, fmNozzleType,
//			 fmOrificeSize, fmNozzleType, fmHasSidePort
filterTest = function(el) {
	// callback function for filter.  Assigns criteria to sort data objects.
	arr = [[fmDistType, el.type], [fmInletType, el.inletType], [fmInletSize, el.inletDiameter], 
	    [fmStrCircuitSize, el.circuitSize], [fmNozzleType, el.nozzleType], [fmHasSidePort, el.hasSidePort]];

	// if circuit count is outside of min and max conditions return false
	if(fmCircuitCt < el.minCircuit || fmCircuitCt > el.maxCircuit){
			// console.log("element " + cnt + " returned false for tube condition.")
            return false;
 	}
    // Check each element in array to compare if it meets criteria.
    var isValid = true;
    arr.forEach(function(element){
    	// console.log("el2 = " + element[0]);
    	if(element[0] !== null && element[0] !== undefined  && element[0] !== "any" && element[0].toLowerCase() !== "select"){
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
    if(isValid){
    	return true;
    }else{
    	return false;
    }
};

function genValidDistObjects(){
	// returns array containing all valid distributor objects
	return dataObject.filter(filterTest);
}

function genValidOrificeSizes(sysCapacity, refrgt, tLiq, tSuct, length){
	// returns array of valid orifice sizes for given performance characteristics.	
    // min/maxNzLoad = percent nozzle loading for given specs.
    var minNzLoad = 75;
    var maxNzLoad = 125;
	var keyList = Object.keys(orificeList);
	var validKeys = [];
	var pctLoading, nzlRating;

    if (fmStrOrificeSize.toLowerCase() !== "select") {
        nzlRating = StdNozzleRating(refrgt, orificeList[keyList[fmStrOrificeSize]], tLiq, tSuct, length);
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

function genHTMLFormData(){
	if(fmStrCircuitSize === "Select"){
		fmStrCircuitSize = SelectTubeSize(fmLiquidTemp, fmTubeLength, "nozzle", fmRefrgt, fmSuctionTemp, fmCapacity, fmCircuitCt);
	}
    // delete data from tableArr
    this.tableArr = [];
    this.tableArrIndex = 0;
	var objArr = genValidDistObjects();
	var HTMLStr = "";
	var partNumber;
    var arrValidNozzle = [["N/A",null,null]];
    var nzlRating, pctNzLoading, dpNozzle;
	//clear html in table body
    tableSelector.innerHtml = "";

	if(fmDistType !== "venturi"){
		arrValidNozzle = genValidOrificeSizes(fmCapacity, fmRefrgt, fmLiquidTemp, fmSuctionTemp, fmTubeLength, minNzLoad = 50, maxNzLoad = 150);
	}



	objArr.forEach(function(el){
        var iLength;
        if (el.type.toLowerCase() === "venturi") {
            iLength = 1;
        } else {
            iLength = arrValidNozzle.length;
        }
        for (var i = 0; i < iLength; i++) {
            var tempObject = [];

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
                pctNzLoading = 999;  // this will need to be updated
                tempObject.pctNzLoading = pctNzLoading.toFixed(1);
                dpNozzle = 999; // this will need to be updated
                tempObject.dpNozzle = dpNozzle.toFixed(1);
                tempObject.orificeSize = "N/A";
			}
            var percentTubeLoading = ((fmCapacity / fmCircuitCt) / StdTubeRating(fmLiquidTemp, fmTubeLength, el.type, fmRefrgt, el.circuitSize, fmSuctionTemp)) * 100;
            tempObject.percentTubeLoading = ((fmCapacity / fmCircuitCt) / StdTubeRating(fmLiquidTemp, fmTubeLength, el.type, fmRefrgt, el.circuitSize, fmSuctionTemp)) * 100;
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
            tempObject.pctDistLoading = pctNzLoading.toFixed(1) + "%";
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



            tableArr.push(tempObject);
            tableArrIndex++;
        }
	});
    refreshTable();  

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
    var imgArr = ["./images/dickbutt.jpg",
        "./images/standardDistributor.png",
        "./images/hgbDistributor.png",
        "./images/flareInlet.png",
        "./images/stubInlet.png"
    ];

    var dimObj = {
        "modalDistOAL": tableArr[tableArrIndex].oal,
        "modalDistOD": tableArr[tableArrIndex].od,
        "modalDistInletOD": tableArr[tableArrIndex].inletTol,
        "modalDistInletLg": tableArr[tableArrIndex].inletLength,
        "modalDistFlare": tableArr[tableArrIndex].flareAnnot,
        "modalDistSideHoleLoc": tableArr[tableArrIndex].sideHoleLoc
    };
    distType = tableArr[tableArrIndex].drawingType;
    // set appropriate image corresponding to radio button
    var i;
    // remove any .hiddenModal classes from modal
    $(".modal-body div").removeClass("hiddenModal");
    switch (distType) {
        case "std":
            i = 1;
            $("#modalDistFlare, #modalDistSideHoleLoc").addClass("hiddenModal");
            setModalDimLocations([47, 9.5], [9, 46.5], [49, 81.5], [17.5, 62.2], [0, 0], [0, 0]);
            break;
        case "hgb":
            i = 2;
            setModalDimLocations([58, 12], [20, 49.3], [59.5, 83.9], [35, 68.3], [0, 0], [26.2, 63.6]);
            $("#modalDistFlare").addClass("hiddenModal");
            break;
        case "flare":
            i = 3;
            $("#modalDistSideHoleLoc, #modalDistInletOD, #modalDistInletLg").addClass("hiddenModal");
            setModalDimLocations([56.5, 16], [18.5, 52], [0, 0], [0, 0], [73.8, 83], [0, 0]);
            break;
        case "stub":
            i = 4;
            $("#modalDistFlare, #modalDistSideHoleLoc").addClass("hiddenModal");
            setModalDimLocations([57, 12.3], [20.2, 48.5], [59, 83.8], [35.8, 70.7], [0, 0], [0, 0]);
            break;
        default:
            i = 0;
    }
    $("#modalDistImg").attr('src', imgArr[i]);
    console.log("distType = " + distType);
    $("#drawingModal").modal("show");

    function setModalDimLocations(distOD, distOAL, distInletOD/*distInletLg = [0, 0], distFlare = [0, 0], distSideHoleLoc = [0, 0]*/) {
        // function sets css values for each dimensions position.  
        // each input variable is array containing [<top %>, <left %>].  No need to include % sign in value.  
        // setModalDimLocations([12, 11], ....)

        var distInletLg = [0,0];
        var distFlare=[0,0];
        var distSideHoleLoc=[0,0];

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

// to show modal use $('#myModal').modal('toggle'); or $('#myModal').modal('show'); or $('#myModal').modal('hide');