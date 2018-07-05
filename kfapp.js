var dataObject;
dataObject = nozzleLibrary;




var fmDistType, fmInletType, fmInletSize, fmCircuitCt;
var fmStrCircuitSize, fmFloatCircuitSize, fmOrificeSize, fmStrOrificeSize, fmNozzleType, fmHasSidePort;
var fmRefrgt, fmCapacity, fmSuctionTemp, fmLiquidTemp;
var fmTubeLength, fmSelectBtn;
var requiredForms, isValid;
var tableSelector, tableHTML;

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

fmSelectBtn = document.querySelector("#distSelectBtn");
tableSelector = document.querySelector("#distContents");



fmSelectBtn.addEventListener("click", function (event) {
    //not sure why the preventDefault works but it prevents errors.
  	event.preventDefault();
	// when event button is clicked then assign values to variables.
	updateFormValues();

    // determine if any required forms are missing data.
    requiredForms = [[fmCircuitCt, "Circuit Count"], [fmRefrgt, "Refrigerant Type"],
        [fmCapacity, "Capacity"], [fmSuctionTemp, "Suction Temperature"],
        [fmLiquidTemp, "Liquid Temperature"], [fmTubeLength, "Distributor Tube Length"]];

    var missingValues = ""
	for (var i = 0; i < requiredForms.length; i++) {
        if (requiredForms[i][0] == "") {
            if (i == 0) {
                missingValues = requiredForms[i][1];
            } else {
                missingValues += ", " + requiredForms[i][1];
            }
        }
    }

    if (missingValues.length == 0) {
        // if no errors then populate table containing distributor selections
        genHTMLFormData();
    } else {
        alert("The following required fields are missing data: " + missingValues);
    }

  });

function generateNozzlePartNumber(bodyStyle, circuitCt, strCircuitSize, strOrificeSize){
	return bodyStyle + "-" + circuitCt + "-" + strCircuitSize + "-" + strOrificeSize;
};

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
		fmSuctionTemp = document.querySelector("#suctionTemp").selectedOptions[0].value;
		fmLiquidTemp = document.querySelector("#liquidTemp").selectedOptions[0].value;
		fmTubeLength = document.querySelector("#tubeLength").selectedOptions[0].value;
};


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
  	var isValid = true
  	arr.forEach(function(element){
  		// console.log("el2 = " + element[0]);
  		if(element[0] != null && element[0] != undefined  && element[0] != "any" && element[0].toLowerCase() != "select"){
  			// console.log(element[0] + " does not equal 'any'");

  			if(element[0] != element[1]){
  				console.log(element[0] + " does not equal " + element[1]);
  				isValid = false
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

function genValidOrificeSizes(sysCapacity, refrgt, tLiq, tSuct, length, minNzLoad = 50, maxNzLoad = 150){
	// returns array of valid orifice sizes	

	var keyList = Object.keys(orificeList);
	var validKeys = [];
	var pctLoading, nzlRating;

	if(fmStrOrificeSize.toLowerCase() != "select"){
		validKeys.push(fmStrOrificeSize);
	} else{
		for (var i = 0; i < keyList.length; i++) {
			nzlRating = StdNozzleRating(refrgt, orificeList[keyList[i]], tLiq, tSuct, length);
			console.log("Nozzle Rating (" + keyList[i] + ") = " + nzlRating);
			pctLoading = (sysCapacity / nzlRating) * 100;
			console.log("Percent loading = " + pctLoading + "%");

			if(pctLoading >= minNzLoad && pctLoading <= maxNzLoad){
				validKeys.push(keyList[i]);
			}
		}
	}
	return validKeys;
}

function genHTMLFormData(){
	if(fmStrCircuitSize == "Select"){
		fmStrCircuitSize = SelectTubeSize(fmLiquidTemp, fmTubeLength, "nozzle", fmRefrgt, fmSuctionTemp, fmCapacity, fmCircuitCt);
	}

	var objArr = genValidDistObjects();
	var HTMLStr = "";
	var partNumber;
	var arrValidNozzle = ["N/A"];
	//clear html in table body
	tableSelector.innerHtml = ""

	if(fmDistType != "venturi"){
		arrValidNozzle = genValidOrificeSizes(fmCapacity, fmRefrgt, fmLiquidTemp, fmSuctionTemp, fmTubeLength, minNzLoad = 50, maxNzLoad = 150);
	}



	objArr.forEach(function(el){

		for (var i = 0; i < arrValidNozzle.length; i++) {

			if(el.type == "nozzle"){
				partNumber = generateNozzlePartNumber(el.bodyStyle, fmCircuitCt, el.circuitSize, arrValidNozzle[i]);

			} else{
				partNumber = el.bodyStyle;
			}
			var percentTubeLoading = ((fmCapacity / fmCircuitCt) / StdTubeRating(fmLiquidTemp, fmTubeLength, el.type, fmRefrgt, el.circuitSize,fmSuctionTemp))*100;
			// pressure drop across tubes assuming 10 psi is 100% loading
			var dpTubes = percentTubeLoading / 10;



			HTMLStr = HTMLStr + "<tr>" + 
					"<td class=\"style\">" + el.type + "</td>" +
					"<td class=\"partNumber>\">" + partNumber + "</td>" +
					"<td class=\"refrigerant>\">" + fmRefrgt + "</td>" +
					"<td class=\"capacity>\">" + fmCapacity + "</td>" +
					"<td class=\"suctionTemp>\">" + fmSuctionTemp + "</td>" +
					"<td class=\"liquidTemp>\">" + fmLiquidTemp + "</td>" +
					"<td class=\"tubeLength>\">" + fmTubeLength + "</td>" +
					"<td class=\"dpTotal>\">dP(total)</td>" + 
					"<td class=\"dpTubes>\">" + dpTubes.toFixed(2) + "</td>" +
					"<td class=\"pctTubeLoading>\">" + percentTubeLoading.toFixed(1) + "</td>" +
					"<td class=\"dpNozzle\">dP (nozzle/body)</td>" +
					"<td class=\"pctDistLoading\">% Dist Loading</td>" +
					"<td class=\"inletSize\">" + el.inletDiameter + "</td>" +
					"<td class=\"outletSize\">" + fmStrCircuitSize + "</td>" +
					"<td class=\"circuitCount\">" + fmCircuitCt + "</td>" +
					"<td class=\"orificeSize\">" + arrValidNozzle[i] + "</td>" +
					"<td class=\"orificeType\">Orifice Type</td>" +
				"</tr>";				
			}
	});

	tableSelector.innerHTML = HTMLStr;
};

// -----------------------------------------------------
// -----------------------------------------------------
// fix header bar position once it reaches certain point
// sort of like freeze-pane in Excel

// // When the user scrolls the page, execute freezePane function 
// window.onscroll = function() {freezePane()};

// // Get the header
// var header = document.getElementById("myHeader");

// // Get the offset position of the navbar
// var sticky = header.getBoundingClientRect().top;

// // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
// function freezePane() {
//   if (window.pageYOffset > sticky) {
//     header.classList.add("sticky");
//     console.log("add sticky");
//   } else {
//     header.classList.remove("sticky");
//     console.log("remove sticky");
//   }
//}

//configure table with fixed header and scrolling rows
//$('#dataTable').DataTable({
//    scrollY: 400,
//    scrollCollapse: true,
//    paging: false,
//    searching: false,
//    ordering: false,
//    info: false
//});