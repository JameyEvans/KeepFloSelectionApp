//$(document).ready(function () {
//    $('#example').DataTable({
//        responsive: true
//    });
//});

$(document).ready(function () {
    $('#example').DataTable({
        select: {
            style: 'single',
            items: 'cell'
        }
    });
});