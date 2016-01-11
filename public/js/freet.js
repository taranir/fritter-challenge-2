$(function() {

    // Post new freet
    $(document).on("click", "#freet-button", function(e) {
        e.preventDefault();
        var freet = $("#freet-input").val();
        $.post(
            '/freets/add',
            { freet: freet }
        ).done(function(response) {
            loadPage();
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#freet-error",response.err);
        });
    });

    // Refreet a freet
    $(document).on("click", ".rf-button", function(e) {
        var id = $(e.target).attr("freet");
        $.post(
            '/freets/rf',
            { freetId: id }
        ).done(function(response) {
            loadPage();
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#freet-error",response.err);
        });
    });

    // Delete a freet
    $(document).on("click", ".delete-button", function(e) {
        var id = $(e.target).attr("freet");
        $.post(
            '/freets/delete',
            { freetId: id }
        ).done(function(response) {
            loadPage();
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#freet-error",response.err);
        });
    });

});