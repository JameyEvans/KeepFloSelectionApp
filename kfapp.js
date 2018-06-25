var dataObject;
dataObject = nozzleLibrary;




var fmDistType, fmInletType, fmInletSize, fmCircuitCt;
var fmStrCircuitSize, fmFloatCircuitSize, fmOrificeSize, fmNozzleType, fmHasSidePort;
var fmRefrgt, fmCapacity, fmSuctionTemp, fmLiquidTemp;
var fmTubeLength, fmSelectBtn;
var requiredForms, isValid;
var tableSelector, tableHTML;

fmSelectBtn = document.querySelector("#distSelectBtn");
tableSelector = document.querySelector("#distContents");



  fmSelectBtn.addEventListener("click", function(event) {

  		event.preventDefault();
	    // when event button is clicked then assign values to variables.
	    updateFormValues();
		console.log("button was clicked");
		requiredForms = [fmCircuitCt, fmRefrgt, fmCapacity, fmSuctionTemp, fmLiquidTemp, fmTubeLength];
		isValid = true;
		for (var i = 0; i < requiredForms.length; i++) {
			if(requiredForms[i] == ""){
				isValid = false;
				alert("Missing required values");
			}
		};
		genHTMLFormData();

  });

function generateNozzlePartNumber(bodyStyle, circuitCt, strCircuitSize){
	return bodyStyle + "-" + circuitCt + "-" + strCircuitSize;
};

function updateFormValues(){
		fmDistType = document.querySelector("#distType").selectedOptions[0].value;
		fmInletType = document.querySelector("#inletType").selectedOptions[0].value;
		fmInletSize = document.querySelector("#inletSize").selectedOptions[0].value;
		fmCircuitCt = document.querySelector("#numberCircuits").value;
		fmStrCircuitSize = document.querySelector("#tubingOD").selectedOptions[0].label;
		fmFloatCircuitSize = document.querySelector("#tubingOD").selectedOptions[0].value;
		fmOrificeSize = document.querySelector("#nozzleSize").selectedOptions[0].value;
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

function genHTMLFormData(){
	var objArr = genValidDistObjects();
	var HTMLStr = "";
	var partNumber;
	//clear html in table body
	tableSelector.innerHtml = ""

	objArr.forEach(function(el){
		if(el.type == "nozzle"){
			partNumber = generateNozzlePartNumber(el.bodyStyle, fmCircuitCt, fmStrCircuitSize);
		} else{
			partNumber = el.bodyStyle;
		}
		
		HTMLStr = HTMLStr + "<tr>" + 
				"<td>" + el.type + "</td>" +
				"<td>" + partNumber + "</td>" +
				"<td>" + fmRefrgt + "</td>" +
				"<td>" + fmCapacity + "</td>" +
				"<td>" + fmSuctionTemp + "</td>" +
				"<td>" + fmLiquidTemp + "</td>" +
				"<td>" + fmTubeLength + "</td>" +
				"<td>dP(total)</td>" + 
				"<td>dP(tubes)</td>" +
				"<td>" + StdTubeRating(fmLiquidTemp, fmTubeLength, el.bodyStyle, fmRefrgt, el.circuitSize, fmSuctionTemp) + "</td>" +
				"<td>dP (nozzle/body)</td>" +
				"<td>% Dist Loading</td>" +
				"<td>" + el.inletDiameter + "</td>" +
				"<td>" + fmStrCircuitSize + "</td>" +
				"<td>" + fmCircuitCt + "</td>" +
				"<td>Orifice Size</td>" +
				"<td>Orifice Type</td>" +
			"</tr>";
	});

	tableSelector.innerHTML = HTMLStr;
};

