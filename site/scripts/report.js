/*REPORT HANDLING*/

function submitForm(){
    var form = document.getElementById("customerForm");
    var project = form[0].value;
    var customer = form[1].value;
    var version = 'Keepflo Version 2.0.1';
    var location = 'Fenton, Missouri';
    var phone = '636-349-2626';
    var email = 'keepflo@aol.com';
    var page = 1;
    var date = new Date();
    var shortDate = date.getDate();
    var headingFontSize = 18;
    var bodyFontSize = 13;


    var doc = new jsPDF();
    doc.setFontSize(bodyFontSize);
    doc.text(version, 20, 20);

    doc.setFontSize(headingFontSize);
    doc.setFontStyle('bold');
    doc.text('KeepFlo, Inc.', 110,20,'center');
    doc.setFontStyle('normal');
    /*doc.text(shortDate, 200, 20,'right');*/

    doc.setFontSize(bodyFontSize);
    doc.text(location, 110, 27,'center');
    doc.text('Page: ' + page, 200,20, 'right');

    doc.text(phone, 110, 34, 'center');
    doc.text(email, 110, 41, 'center');

    doc.text('Customer:', 20, 50);
    doc.text(customer, 50, 50);
    doc.text('Project:', 20, 60);
    doc.text(project, 50,60);
    doc.save('kfReport.pdf');
}


function generateReport() {
    var doc = new jsPDF();

    var customer = $('#customer').text();

    doc.text(customer.toString(), 10, 10);
    doc.save('a4.pdf');
}