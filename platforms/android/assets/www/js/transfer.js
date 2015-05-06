$( document ).on( "pageshow", "#transfer", function() {
    var userdet = getCurrentUserDetails();
    $('#transferaccno').html("");
    $.each(userdet.account.accounts, function(i, val) {   
        var accstr = val[0] + " - Account No: " + val[1];
        $('#transferaccno')
          .append("<option value='"+accstr+"'>"+accstr+"</option>");
    });
    $("#transferaccno").val($("#transferaccno option:first").val());
    $("#transferaccno").selectmenu();
    $("#transferaccno").selectmenu('refresh', true);
    $("#transfersubmit").click(function() {
        var amount = parseInt($("#transferamount").val());
        if (isNaN(amount) || amount <= 0) {
            $("#transfer .required").html("Enter a positive number for amount");
            return;
        }
        var userdet = getCurrentUserDetails();
        if ($("#transfermode")[0].selectedIndex == 0) {
            userdet.account.cash += amount;
            userdet.account.history.push([Date(), "Transferred from "+$("#transferaccno").val(), amount]);
        } else {
            if (amount > userdet.account.cash) {
                $("#transfer .required").html("Not enough amount in your Stock Account");
                return;
            }
            userdet.account.cash -= amount;
            userdet.account.history.push([Date(), "Transferred to "+$("#transferaccno").val(), -amount]);
        }
        saveUserDetails(userdet);
        $.mobile.navigate("#account");
        return false;
    });
});