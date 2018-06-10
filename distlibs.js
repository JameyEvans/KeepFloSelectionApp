//functions for distributor selection program
//.ts files can be compiled into javascript with
//cmd line: tsc distlibs.ts and then "node distlibs.js"


//distributor library module
// var partNo;
// var keepFloModel;
// var sporlanModel;
// var isSporlan;
// var style; // nozzle or venturi
// var connectionType;
// var sidePort;
// var sideConnection; //number and size of possible connections
// var nozzleSize; // (P)ermanent, L, J, E, C, A
// var inletNumber;
// var outletNumber;
// var numberCircuits;
// var orificeNumber;
// var refrgt;
// var q = 0;
// var qt; // tube capacity; wasn't global in c++ version
// var qn; // nozzle capacity; wasn't global in c++ version
// var tSuct;
// var tLiq;
// var length;
// var dp;
// var dpn;
// var dpt;
// var pln; // percent loading nozzle (or body)
// var plt; // percent loading tubes
// var orificeSize;
// var inletSize;
// var outletSize;
function ErrorText(e) {
    var c = null;
    switch (e) {
        case 100:
            c = "Number of circuits can not be less than 2. (dist::rate_nozzleL)";
            break;
        case 101:
            c = "Tubing load is less than 50 percent of rated capacity. (dist::rate_nozzle)";
            break;
        case 102:
            c = "Tubing load is more than 200 percent of rated capacity. (dist::rate_nozzle)";
            break;
        case 103:
            c = "Nozzle load is less than 0 percent of rated capacity. (dist::rate_nozzle)";
            break;
        case 104:
            c = "Nozzle load is more than 200 percent of rated capacity. (dist::rate_nozzle)";
            break;
        case 105:
            c = "Liquid temperature is less than 10°F (-12.2°C). (dist::StdTubeRating)";
            break;
        case 106:
            c = "Liquid temperature is more than 130°F (54.4°C). (dist::StdTubeRating)";
            break;
        case 107:
            c = "Distributor tube length is less than 12 inches (305 mm). (dist::StdTubeRating)";
            break;
        case 108:
            c = "Distributor tube length is more than 72 inches (1829 mm). (dist:: StdTubeRating)";
            break;
        case 109:
            c = "Invalid outlet size. (dist::StdTubeRating)";
            break;
        case 110:
            c = "Invalid outlet size. (dist::StdTubeRating)";
            break;
        case 111:
            c = "Liquid temperature is less than 10°F (-12.2°C). (dist::StdNozzleRating)";
            break;
        case 112:
            c = "Liquid temperature is more than 120°F (48.9°C). (dist::StdNozzleRating)";
            break;
        case 113:
            c = "vflo.csv does not exist";
            break;
        case 114:
            c = "nflo.csv does not exist";
            break;
        case 115:
            c = "Invalid model.";
            break;
        case 116:
            c = "Inlet Size is invalid. (getInletSize)";
            break;
        case 117:
            c = "Invalid inlet size. (getInletNumber)";
            break;
        case 118:
            c = "Outlet Size is invalid. (getOutletSize)";
            break;
        case 119:
            c = "Outlet Size is invalid. (sgetOutletSize)";
            break;
        case 120:
            c = "Invalid outlet size. (getOutletNumber)";
            break;
        case 121:
            c = "Nozzle Size is invalid. (sgetOrificeSize)";
            break;
        case 122:
            c = "Nozzle Size is invalid. (getOrificeSize)";
            break;
        case 123:
            c = "Invalid orifice number. (getOrificeNumber)";
            break;
        case 124:
            c = "Unknown nozzle size. (getOrificeRange)";
            break;
        case 125:
            c = "Must enter number of circuits or capacity, or both. (KeepFloData::findModel)";
            break;
        case 126:
            c = "Must either select a distributor tube size or enter both capacity and number of circuits. (KeepFloData::findModel)";
            break;
        case 127:
            c = "Must enter both number of circuits and capacity. (KeepFloData::findModel)";
            break;
        case 99101:
            c = "Refrigerant not detected (StdNozzleRating)";
        default:
            c = "Unknown error code.";
    }
    console.log("Error encountered: " + c);
}
exports.ErrorText = ErrorText;
function StdTubeRating(qt, tLiq, length, style, refrgt, outletSize,tSuct) {
    // function assigns value to qt = standard tube rating (circuits) in tons
    // returns 0 if no errors else returns error code
    // outputs tube rating.  Following variables need to be assigned before calling:
    // tLiq, tSuct, length, refrgt, outletSize, style.  qt must be initialized
    var qStd; // std rating (tons) at 40°F evap, 100°F liquid
    var kLiq, kLength, kEvap; //multipliers
    if (tLiq < 10)
        return 105;
    if (tLiq > 130)
        return 106;
    if (length < 12)
        return 107;
    if (length > 72)
        return 108;
    // pressure drop factor for liquid temperatures between 10° and 120°F
    // original data Sporlan Bulletin 20-10 data between 50° and 120°F
    kLiq = 3.7791071 + tLiq * (-0.039410714 + tLiq * 1.1607143E-4);
    if (style == "N") {
        // tubing pressure drop factor for tubing length between 12 and 72 inches
        kLength = 3.0971 * Math.pow(length, -0.33353);
        // tubing pressure drop
        if (refrgt == "R-22" || refrgt == "R-12" ||
            refrgt == "R-134a" || refrgt == "R-401A" ||
            refrgt == "R-407C" || refrgt == "R-410A") {
            // tubing capacity at 40°F
            qStd = 64.94034 * Math.pow(outletSize, 2.9194);
            //tubing capacity for temperatures between 40°F and -40°F
            kEvap = 0.60758064 + tSuct * (8.1076916e-03 + tSuct * 4.6342592e-05);
        }
        else if (refrgt == "R-502" || refrgt == "R-402A" ||
            refrgt == "R-404A" || refrgt == "R-507") {
            qStd = 43.51153 * Math.pow(outletSize, 2.91);
            kEvap = .57194756 + tSuct * 8.6468732e-03 + tSuct * (5.0839548e-05);
        }
    }
    else {
        // tubing pressure drop factor for tubing length between 12 and 72 inches
        kLength = 1; // apply this factor to pressure drop //3.6674*length ** -.33446
        // tubing capacity at 40°F
        if (refrgt == "R-22" ||
            refrgt == "R-12" ||
            refrgt == "R-134a" ||
            refrgt == "R-401A" ||
            refrgt == "R-407C" ||
            refrgt == "R-410A") {
            if (outletSize == 5 / 32.)
                qStd = 0.44;
            else if (outletSize == 3 / 16.)
                qStd = 0.90;
            else if (outletSize == 1 / 4.)
                qStd = 1.75;
            else if (outletSize == 5 / 16.)
                qStd = 3.5;
            else if (outletSize == 3 / 8.)
                qStd = 6.125;
            else if (outletSize == 1 / 2.)
                qStd = 8.75;
            else
                return 109;
            kEvap = 0.45259728 + tSuct * (0.0098863610 + tSuct * 9.334425E-5);
        }
        else if (refrgt == "R-502" ||
            refrgt == "R-402A" ||
            refrgt == "R-404A" ||
            refrgt == "R-507") {
            if (outletSize == 5 / 32.)
                qStd = 0.225;
            else if (outletSize == 3 / 16.)
                qStd = 0.45;
            else if (outletSize == 1 / 4.)
                qStd = 0.9;
            else if (outletSize == 5 / 16.)
                qStd = 1.8;
            else if (outletSize == 3 / 8.)
                qStd = 3.15;
            else if (outletSize == 1 / 2.)
                qStd = 4.5;
            else
                return 110;
            kEvap = 0.42984171 + tSuct * (0.010111100 + tSuct * 1.0714286E-4);
        }
    }
    var kRef = 1.0;
    if (refrgt == "R-12")
        kRef = 0.56;
    if (refrgt == "R-134a")
        kRef = 0.77; // was 1.09
    if (refrgt == "R-401A")
        kRef = 0.65; // was 0.95// was 1.01
    if (refrgt == "R-402A")
        kRef = 1.07; // was 1.02
    if (refrgt == "R-404A")
        kRef = 1.076; // was 1.06
    if (refrgt == "R-407C")
        kRef = 1.01;
    if (refrgt == "R-410A")
        kRef = 1.01; // was 1.19
    if (refrgt == "R-507")
        kRef = 1.08;
    // tubing capacity at actual suction & liquid temperature and tubing length
    qt = qStd * kLiq * kLength * kEvap * kRef;
    return qt;
}

function StdNozzleRating(refrgt, orificeSize, tLiq, tSuct, length, outletStyle, style) {
    // returns nozzle rating in tons of refrigeration
    // following variable need to be assigned values before calling function:
    // refrgt, orificeSize, tLiq, tSuct, length, refrgt, outletStyle, style
    // qt needs to be defined but doesn't need a value
    var n1, kEvap, f1, qt;
    if (tLiq < 10) {
        ErrorText(111);
        return 111;
    }
    if (tLiq > 120) {
        ErrorText(111);
        return 112; //liquid temp needs to be between 10 and 120
    }
    // pressure drop factor for liquid temperatures between 10°F and 120°F
    f1 = 3.7791071 + tLiq * (-0.039410714 + tLiq * 1.1607143E-4);
    // tubing pressure drop
    if (refrgt == "R-22" || //R-22 is baseline
        refrgt == "R-12" ||
        refrgt == "R-134a" ||
        refrgt == "R-401A" ||
        refrgt == "R-407C" ||
        refrgt == "R-410A") {
        //nozzle capacity at 40°
        n1 = 0.07141 + 1.16503 * orificeSize;
        // nozzle capacity factor for temperatures between 40°F and -40°F
        kEvap = 0.62341652 + tSuct * (7.6445782e-03 + tSuct * 4.5039127e-5);
    }
    else if (refrgt == "R-502" || // 502 is baseline
        refrgt == "R-402A" ||
        refrgt == "R-404A" ||
        refrgt == "R-507") {
        //nozzle capacity at 40°F
        n1 = -0.11829 + .82385 * orificeSize;
        kEvap = 0.59407239 + tSuct * (8.2015174e-03 + tSuct * 5.1758559e-05);
    }
    var kRef = 1.0;
    switch (refrgt) {
        case "R-22":
            kRef = 1.0;
            break;
        case "R-12":
            kRef = 0.56;
            break;
        case "R-134a":
            kRef = 0.77;
            break; // changed 12-2005
        case "R-401A":
            kRef = 0.65;
            break; // was 1.01
        case "R-402A":
            kRef = 1.07;
            break;
        case "R-404A":
            kRef = 1.076;
            break;
        case "R-407C":
            kRef = 1.21;
            break;
        case "R-410A":
            kRef = 1.015;
            break; // was 1.19
        case "R-507":
            kRef = 0.98;
            break;
        default:
            ErrorText(99101);
            return 99101; // refrigerant not found
    }
    // rated capacity at actual suction and liquid temperature
    qn = n1 * kEvap * f1 * kRef;
    return qn;
}
function RateVenturi(tLiq, tSuct, length, refrgt, outletSize, style, q=0, qt) {
    // assigns values to q (capacity), plt (percent tube loading), pln (percent nozzle loading)
    // dpn (pressure drop nozzle), dpt (pressure drop tubes), and dp (total pressure drop)
    // returns 0 if no errors, else returns error code
    //Following variables need to be assigned before calling:
    // tLiq, tSuct, length, refrgt, outletSize, style.  qt must be initialized
    var kLoad;
    var n;
    //check for errors in StdTubeRating()
    // n = StdTubeRating();
    // if (n > 0)
    //     return n;
    // if capacity is not defined
    if (q == 0)
        q = qt * numberCircuits;
    plt = pln = q / numberCircuits / qt; //percent tube loading = percent nozzle loading
    kLoad = 0.24545455 + plt * (0.261358528 + plt * 0.48173160);
    dpn = 5 * kLoad;
    dpt = 20 * kLoad * length / 36;
    dp = dpn + dpt;
    return q;
}

tLiq = 100;
tSuct = 40;
length = 30;
refrgt = "R-22";
outletSize = 1 / 4.;
style = "V";
orificeSize = 8;
numberCircuits = 6;
RateVenturi();
console.log("Q = " + q);
//function TestPrintEntries() {
//  var stdTubeRatingValue = StdTubeRating();
//  csvArr.push([refrgt, outletSize, tSuct, stdTubeRatingValue]);
//  console.log("tSuct = " + tSuct + "; outletSize = " + outletSize);
//  console.log("standardTubeRating = " + stdTubeRatingValue + "\n");
//  return 0;
//}
//var csvArr:any = [["Refrigerant", "Circuit Size", "Temp", "Capacity"]];
//function TestAllStdTubeRating() {
//  var tSuctArray = [40, 20, 0, -20, -40];
//  var outletSizeArray = [3 / 16., 1 / 4., 5 / 16., 3 / 8.];
//  for (let i = 0, outletSizeArray_1 = outletSizeArray; i < outletSizeArray_1.length; _i++) {
//    var circuitSizeEntry = outletSizeArray_1[_i];
//    outletSize = circuitSizeEntry;
//    for (var _a = 0, tSuctArray_1 = tSuctArray; _a < tSuctArray_1.length; _a++) {
//      var tSuctEntry = tSuctArray_1[_a];
//      tSuct = tSuctEntry;
//      TestPrintEntries();
//    }
//  }
