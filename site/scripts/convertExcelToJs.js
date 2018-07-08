// Uses excel-as-json package to create json from .xlsx file
// https://www.npmjs.com/package/excel-as-json


convertExcel = require('excel-as-json').processFile;
 
convertExcel('distObjects.xlsx', 'data.js');

// You need to add variable to new data.js file.  In data.js add var nozzleLibrary = [<object goes here>]