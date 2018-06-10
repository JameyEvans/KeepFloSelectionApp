var dataObject;
dataObject = nozzleLibrary;

for (var i = 0; i < dataObject.length; i++) {
 console.log(dataObject[i]);
};


var fmDistType, fmInletType, fmInletSize, fmCircuitCt;
var fmCircuitSize, fmOrificeSize, fmNozzleType, fmHasSidePort;
var fmRefrgt, fmCapacity, fmSuctionTemp, fmLiquidTemp;
var fmTubeLength, fmSelectBtn;

fmDistType = document.querySelector("#distType")


//on button click

	fmDistType = document.querySelector("#distType").selectedOptions[0].value;
	fmInletType = document.querySelector("#inletType").selectedOptions[0].value;
	fmInletSize = document.querySelector("#inletSize").selectedOptions[0].value;
	fmCircuitCt = document.querySelector("#numberCircuits").value;
	fmCircuitSize = document.querySelector("#tubingOD").selectedOptions[0].value;
	fmOrificeSize = document.querySelector("#nozzleSize").selectedOptions[0].value;
	fmNozzleType = document.querySelector("#nozzleType").selectedOptions[0].value;
	fmHasSidePort = document.querySelector("#sidePort").selectedOptions[0].value;
	fmRefrgt = document.querySelector("#refrgType").selectedOptions[0].value;
	fmCapacity = document.querySelector("#capacity").value;
	fmSuctionTemp = document.querySelector("#suctionTemp").selectedOptions[0].value;
	fm = document.querySelector("").selectedOptions[0].value;
	fm = document.querySelector("").selectedOptions[0].value;
	fm = document.querySelector("").selectedOptions[0].value;
	fm = document.querySelector("").selectedOptions[0].value;
	fm = document.querySelector("").selectedOptions[0].value;
	