$(function() {

     // Show home page
    $(document).on("click", "#go-home", function(e) {
        e.preventDefault();
        loadPage();
    });

    // Show user page
    $(document).on("click", ".freet-user", function(e) {
        e.preventDefault();
        var user = $(e.target).attr("user");
        loadUserPage(user);
    });

    // Show follows
    $(document).on("click", "#view-follows", function(e) {
        e.preventDefault();
        loadFollowsPage();
    });

    // Follow a user
    $(document).on("click", "#follow-user", function(e) {
        e.preventDefault();
        var user = $(e.target).attr("user");
        $.post('/users/follow', {username: user}).done(function(response) {
            loadUserPage(user);
        })
    });

});