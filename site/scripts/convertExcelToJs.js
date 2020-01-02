// Uses excel-as-json package to create json from .xlsx file
// https://www.npmjs.com/package/excel-as-json
// As of 4/1/19 excel-as-json does not work with Node 10.  


//convertExcel = require('excel-as-json').processFile; 
//convertExcel('../data/distObjects.xlsx', '../data/data.js');
////convertExcel('./testXL.xlsx', '../data/data.js', null, function (err, data) {
////    console.log("entered callback");
////    console.log(data);
////    console.log(err);
////    if (err) {
////        console.log("JSON conversion failure: #{err}");
////    }
////});

// --------------------------------------------------------------------------------------------
// -------------------- New Version 04/01/19 --------------------------------------------------

// Using convert-excel-to-json package, version 1.6.1
// https://www.npmjs.com/package/convert-excel-to-json
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

const result = excelToJson({
    sourceFile: '../data/distObjects.xlsx',
    header: {
        // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
        rows: 1 // 2, 3, 4, etc.
    },
    columnToKey: {
        A: 'bodyStyle',
        B: 'sporlanStyle',
        C: 'type',
        D: 'inletType',
        E: 'minCircuit',
        F: 'maxCircuit',
        G: 'circuitSize',
        H: 'nozzleSize',
        I: 'nozzleType',
        J: 'hasSidePort',
        K: 'oal',
        L: 'od',
        M: 'inletTol',
        N: 'inletDiameter',
        O: 'inletLength',
        P: 'drawingType',
        Q: 'flareAnnot',
        R: 'sideHoleLoc',
        S: 'id'
    }
});
console.log(result);
var output = JSON.stringify(result, null, 2);
fs.writeFileSync('../data/output.js', output, 'utf-8');
