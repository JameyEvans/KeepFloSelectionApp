// Get checked distributor type
var radDistType;
var imgArr = ["./dickbutt.jpg",
    "./images/standardDistributor.png",
    "./images/hgbDistributor.png",
    "./images/flareInlet.png",
    "./images/stubInlet.png"
];

var dimObj = {
    "modalDistOAL": "10A",
    "modalDistOD": "20B",
    "modalDistInletOD": "30C",
    "modalDistInletLg": "40D",
    "modalDistFlare": "1/2 Flare Nut",
    "modalDistSideHoleLoc": "50E"
};
radioCallback();

$('#options input').on('change', function () {
    radioCallback()
});

function radioCallback() {
    radDistType = $('input[name=distTypeRadio]:checked').val();
    // set appropriate image corresponding to radio button
    var i;
    // remove any .hiddenModal classes from modal
    $(".modal-body div").removeClass("hiddenModal");
    switch (radDistType) {
        case "std":
            i = 1;
            $("#modalDistFlare, #modalDistSideHoleLoc").addClass("hiddenModal");
            setModalDimLocations([47, 9.5], [9, 46.5], [49, 81.5], [17.5, 62.2], [0, 0], [0, 0]);
            break;
        case "hgb":
            i = 2;
            setModalDimLocations([58, 12], [20, 49.3], [59.5, 83.9], [35, 68.3], [0, 0], [26.2, 63.6])
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
    console.log("radDistType = " + radDistType);
};

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

// to show modal use $('#myModal').modal('toggle'); or $('#myModal').modal('show'); or $('#myModal').modal('hide');