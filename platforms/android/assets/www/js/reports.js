$( document ).on( "pageshow", "#reports", function() {
    $( "#reportstartdate" ).datepicker({
         onClose: function( selectedDate ) {
            $( "#reportenddate" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    $( "#reportenddate" ).datepicker({
         onClose: function( selectedDate ) {
            $( "#reportstartdate" ).datepicker( "option", "maxDate", selectedDate );
        }
    });
    function updateReport() {
        var fromstr = $("#reportstartdate").val();
        var tostr   = $("#reportenddate").val();
        if (fromstr === "" || tostr === "")
            return;
        var from = new Date(fromstr);
        var to   = new Date(tostr);
        if (!from || !to)
            return;
        to.setDate(to.getDate()+1);
        var userdet = getCurrentUserDetails();
        $("#reportlist").html("");
        $.each(userdet.account.history, function(i, val) {
            var d = new Date(val[0]);
            if (from <= d && to >= d) {
                var val3 = val[2];
                if (val3 != "")val3 = val3.toFixed(2);
                $("#reportlist").append("<tr><td>"+val[0]+"</td><td>"+val[1]+"</td><td>"+val3+"</td></tr>");
            }
        });
    }
    $("#reportstartdate").change(updateReport);
    $("#reportenddate").change(updateReport);
    updateReport();
});
