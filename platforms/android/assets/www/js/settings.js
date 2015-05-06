$( document ).on( "pageshow", "#settings", function() {
    function refreshsettings() {
        var username = getCurrentUser();
        var userdet = getCurrentUserDetails();
        console.log(userdet);
        console.log(userdet.photo);
        $("#settingsusername").html(username);
        $("#settingsaccountlist").html("");
        $.each(userdet.account.accounts, function(i, val) {
            $("#settingsaccountlist").append("<table width='100%'><tr><td><h5>"+val[0] + "</h5>Account no: "+val[1]+"</td>"+
                "<td><a id=\"settingsdeleteaccount-"+i+"\" href=\"#settings\" class=\"ui-btn ui-btn-inline ui-btn-icon-notext ui-icon-delete\"></a></td>");
            $("#settingsdeleteaccount-"+i).click(function() {
                var userdet = getCurrentUserDetails();
                userdet.account.history.push([Date(), "Bank account '"+userdet.account.accounts[i][0]+"' Account No:"+userdet.account.accounts[1]+" deleted", ""]);
                userdet.account.accounts.splice(i,1);
                saveUserDetails(userdet);
                refreshsettings();
            });
        });
        $("#settingsphoto").attr('src', userdet.photo);
    }
    refreshsettings();
    $("#settingschangephoto").click(function() {
        navigator.camera.getPicture(signupPhotoOnSuccess, signupPhotoOnFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI });

        function signupPhotoOnSuccess(imageURI) {
            $("#settingsphoto").attr('src', imageURI);
            var userdet = getCurrentUserDetails();
            userdet.photo = imageURI;
            saveUserDetails(userdet);
        }

        function signupPhotoOnFail(message) {
            alert('Failed because: ' + message);
        }
    });
});
$( document ).ready(function() {
$("#formaccountsubmit").click(function() {
    var bank = $("#formaccountbank").val();
    var no = $("#formaccountno").val();
    var userdet = getCurrentUserDetails();
    console.log(userdet.account);
    userdet.account.accounts.push([bank, no]);
    userdet.account.history.push([Date(), "New Bank account '"+bank+"' Account No:"+no+" added", ""]);
    saveUserDetails(userdet);
    $.mobile.navigate("#settings");
});
});
