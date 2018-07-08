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

    if (missingValues.length == 0) {
        // if no errors then populate table containing distributor selections
        genHTMLFormData();
        toggleAllFields();
    } else {
        alert("The following required fields are missing data: " + missingValues);
    }

  });
function generateNozzlePartNumber(bodyStyle, circuitCt, strCircuitSize, strOrificeSize){
    return bodyStyle + "-" + circuitCt + "-" + strCircuitSize + "-" + strOrificeSize;

};
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
  				//console.log(element[0] + " does not equal " + element[1]);
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

function genValidOrificeSizes(sysCapacity, refrgt, tLiq, tSuct, length, minNzLoad = 75, maxNzLoad = 125){
	// returns array of valid orifice sizes for given performance characteristics.	
    // min/maxNzLoad = percent nozzle loading for given specs.

	var keyList = Object.keys(orificeList);
	var validKeys = [];
	var pctLoading, nzlRating;

    if (fmStrOrificeSize.toLowerCase() !== "select") {
        nzlRating = StdNozzleRating(refrgt, orificeList[keyList[fmStrOrificeSize]], tLiq, tSuct, length);
        pctLoading = (sysCapacity / nzlRating) * 100;
		validKeys.push([fmStrOrificeSize, nzlRating, pctLoading]);  // was push(fmStrOrificeSize); 07.06.18
	} else{
		for (var i = 0; i < keyList.length; i++) {
			nzlRating = StdNozzleRating(refrgt, orificeList[keyList[i]], tLiq, tSuct, length);
			//console.log("Nozzle Rating (" + keyList[i] + ") = " + nzlRating);
			pctLoading = (sysCapacity / nzlRating) * 100;
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

	var objArr = genValidDistObjects();
	var HTMLStr = "";
	var partNumber;
    var arrValidNozzle = [["N/A",,]];
    var nzlRating, pctNzLoading, dpNozzle;
	//clear html in table body
	tableSelector.innerHtml = ""

	if(fmDistType != "venturi"){
		arrValidNozzle = genValidOrificeSizes(fmCapacity, fmRefrgt, fmLiquidTemp, fmSuctionTemp, fmTubeLength, minNzLoad = 50, maxNzLoad = 150);
	}



	objArr.forEach(function(el){

		for (var i = 0; i < arrValidNozzle.length; i++) {

			if(el.type === "nozzle"){
                partNumber = generateNozzlePartNumber(el.bodyStyle, fmCircuitCt, el.circuitSize, arrValidNozzle[i][0]);
                nzlRating = arrValidNozzle[i][1]; //nozzle rating in tons
                pctNzLoading = arrValidNozzle[i][2]; // percent loading of nozzle
                dpNozzle = pctLoadToDP(fmRefrgt, pctNzLoading);  // pressure drop across nozzle
                

			} else{
                partNumber = el.bodyStyle;
                pctNzLoading = "venturi";  // this will need to be updated
                dpNozzle = "venturi"; // this will need to be updated
			}
			var percentTubeLoading = ((fmCapacity / fmCircuitCt) / StdTubeRating(fmLiquidTemp, fmTubeLength, el.type, fmRefrgt, el.circuitSize,fmSuctionTemp))*100;
			// pressure drop across tubes assuming 10 psi is 100% loading
            var dpTubes = percentTubeLoading / 10;
            



			HTMLStr = HTMLStr + "<tr>" +
					"<td class=\"style\">" + el.type + "</td>" +
					"<td class=\"partNumber \">" + partNumber + "</td>" +
					"<td class=\"refrigerant\">" + fmRefrgt + "</td>" +
					"<td class=\"capacity hideMyShit\">" + fmCapacity + "</td>" +
					"<td class=\"suctionTemp hideMyShit\">" + fmSuctionTemp + "</td>" +
					"<td class=\"liquidTemp hideMyShit\">" + fmLiquidTemp + "</td>" +
					"<td class=\"tubeLength hideMyShit\">" + fmTubeLength + "</td>" +
					"<td class=\"dpTotal\">" + (dpNozzle + dpTubes).toFixed(1) + "</td>" + 
					"<td class=\"dpTubes\">" + dpTubes.toFixed(1) + "</td>" +
					"<td class=\"pctTubeLoading\">" + percentTubeLoading.toFixed(1) + "%</td>" +
					"<td class=\"dpNozzle\">" + dpNozzle.toFixed(1) + "</td>" +
					"<td class=\"pctDistLoading\">" + pctNzLoading.toFixed(1) + "%</td>" +
					"<td class=\"inletSize hideMyShit\">" + el.inletDiameter + "</td>" +
					"<td class=\"outletSize\">" + fmStrCircuitSize + "</td>" +
					"<td class=\"circuitCount hideMyShit\">" + fmCircuitCt + "</td>" +
					"<td class=\"orificeSize hideMyShit\">" + arrValidNozzle[i][0] + "</td>" +
					"<td class=\"orificeType hideMyShit\">" + el.nozzleType +  "</td>" +
				"</tr>";
			}
	});
    if (objArr.length === 0) {
        HTMLStr = "<tr><td colspan = \"17\" > No suitable distributors were detected</td></tr>";
    }
	tableSelector.innerHTML = HTMLStr;
};