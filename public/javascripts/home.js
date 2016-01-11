$(document).ready(function() {

  //Click handler for edit button. Shows edit box and submit button while hiding post content.
  //Attaches handler to submit edit button.
  $(".fritter-edit-btn").click(function() {
    var post = $(this).parent();
    var id = post.data("post-id");
    var originalMessage = post.find(".fritter-text").text();
    var text = post.find(".fritter-text");
    var deleteBtn = post.find(".fritter-delete-btn");
    var editBtn = post.find(".fritter-edit-btn");
    var editSection = post.find(".fritter-edit");
    var textArea = post.find(".fritter-edit-textarea");
    var submitBtn = post.find(".fritter-edit-submit");
    text.hide();
    deleteBtn.hide();
    editBtn.hide();

    editSection.show(function() {
      textArea.val(originalMessage);
      submitBtn.one("click", function() {
        var message = textArea.val();
        if (message.length < 1) {
          console.log("empty message");
          editSection.fadeOut(function() {
            text.fadeIn();
            deleteBtn.fadeIn();
            editBtn.fadeIn();
          });          
        }
        else {
          $.post("/posts/edit", {postID: id, text: message}, function() {
            text.text(message);
            editSection.fadeOut(function() {
              text.fadeIn();
              deleteBtn.fadeIn();
              editBtn.fadeIn();
            }); //editSection.fadeOut
          }); //post
        } //else
      }); //submitBtn.one
    });//editSection.show
  });

  //Click handler for delete button. 
  $(".fritter-delete-btn").click(function() {
    var post = $(this).parent();
    var id = post.data("post-id");
    $.post("/posts/delete", {postID: id}, function() {
      post.slideUp(function() {
        post.remove();
      });
      
    });
  });

  $("#fritter-fav-btn").click(function() {
    var post = $(this).parent();
    var btn = $(this);
    var id = post.data("post-id");
    $.post("/posts/fav", {postID: id}, function() {
      btn.fadeOut(function() {
        post.find(".fritter-unfav-btn").fadeIn();
      });
    });
  });

  $("#fritter-unfav-btn").click(function() {
    var post = $(this).parent();
    var btn = $(this);
    var id = post.data("post-id");
    $.post("/posts/unfav", {postID: id}, function() {
      btn.fadeOut(function() {
        post.find(".fritter-fav-btn").fadeIn();
      });
    });
  });

});
