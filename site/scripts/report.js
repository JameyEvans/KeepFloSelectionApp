/*REPORT HANDLING*/

function submitForm(){
    var logo = 'http://www.cdivalve.com/images/styles/control_devices__logo_rgb.svg';
    var form = document.getElementById("customerForm");
    var project = form[0].value;
    var customer = form[1].value;
    var version = 'Keepflo Version 2.0.1';
    var location = 'Fenton, Missouri';
    var phone = '636-349-2626';
    var email = 'keepflo@aol.com';
    var page = 1;
    var date = new Date();
    var shortDate = date.toLocaleDateString();
    var headingFontSize = 18;
    var bodyFontSize = 13;
    var center = 105;
    var right = 190;
    var left = 20;

    //printTable();

    var doc = new jsPDF();
    doc.setFontSize(bodyFontSize);
    doc.text(version, left, 20);

    doc.setFontSize(headingFontSize);
    doc.setFontStyle('bold');
    doc.text('KeepFlo, Inc.', center,20,'center');
    doc.setFontStyle('normal');

    doc.setFontSize(bodyFontSize);
    doc.text(location, center, 27,'center');
    doc.text(shortDate, right, 20,'right');
    doc.text('Page: ' + page, right,27, 'right');

    doc.text(phone, center, 34, 'center');
    doc.text(email, center, 40, 'center');

    doc.text('Customer:', left, 50);
    doc.text(customer, left+30, 50);
    doc.text('Project:', left, 57);
    doc.text(project, left+30,57);
    doc.save('kfReport.pdf');
}


function generateReport() {
    $('#customerSubmit').click();
}

function printTable() {
    var table = $('#dataTableExample').DataTable();
    var columns = getColumns();
    var rows = table.rows();

    var doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows);
    doc.save('table.pdf');
}


//handle print on ctrl + p
jQuery(document).bind("keyup keydown", function(e){
    if(e.ctrlKey && e.keyCode === 80){
        $('')
    }
});