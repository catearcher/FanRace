(function() {
  var
  verticalCenter, resizeText, DOTHIS,
  initComplete = false, params = {}, temp, interval;

  verticalCenter = function() {
    $(".allContainer").css("marginTop", ($(window).height() - $(".allContainer").height()) / 2);
  };

  resizeText = function() {
    if (!initComplete) {
      return;
    }

    var divWidth = $(".likes").width(),
        spanWidth = Math.max($(".likes .fancount").eq(0).width(), $(".likes .fancount").eq(1).width()),
        fontSize = 100;

    do {
      fontSize++;

      $(".likes span").css("fontSize", fontSize);

      divWidth = $(".likes").width();
      spanWidth = Math.max($(".likes .fancount").eq(0).width(), $(".likes .fancount").eq(1).width());
    } while (divWidth > spanWidth);

    $("body").css("fontSize", Math.round(fontSize / 4));

    verticalCenter();
  };

  DOTHIS = function() {
    var
    we = params.we || "diesocialisten",
    theOthers = params.vs || "limesoda.at",
    partySong = params.party || "kDwZAtE6yWY";

    $.ajax({
      url: "https://graph.facebook.com/" + we + "?fields=likes",
      dataType: "json",
      success: function(res) {
        var ourLikes = parseInt(res.likes, 10);
        $("#ourLikes .fancount").text(ourLikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

        if (!initComplete) {
          $("#ourLikes a").text(we);
          $("#ourLikes a").attr("href", "https://www.facebook.com/" + we);
        }

        $.ajax({
          url: "https://graph.facebook.com/" + theOthers + "?fields=likes",
          dataType: "json",
          success: function(res) {
            if (!initComplete) {
              $("#otherLikes a").text(theOthers);
              $("#otherLikes a").attr("href", "https://www.facebook.com/" + theOthers);

              $(".allContainer").fadeIn(3000);

              setTimeout(resizeText, 0);

              initComplete = true;
            }

            var otherLikes = parseInt(res.likes, 10);
            $("#otherLikes .fancount").text(otherLikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

            $("#missingLikes").text((otherLikes - ourLikes).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

            if (!$("iframe").attr("src").length) {
              if (ourLikes > otherLikes) {
                $("iframe").attr("src", "https://www.youtube-nocookie.com/embed/" + partySong + "?rel=0&amp;autoplay=1");
              }
            }
          },
          error: function(e) {
            clearInterval(interval);
            $(".allContainer").html("The <strong>" + theOthers + "</strong> fan page was not found. Try another value for the vs parameter!").show();
          }
        });
      },
      error: function(e) {
        clearInterval(interval);
        $(".allContainer").html("The <strong>" + we + "</strong> fan page was not found. Try another value for the we parameter!").show();
      }
    });
  };

  $(window).on("resize", resizeText);

  interval = setInterval(function() {
    DOTHIS();
  }, 5000);

  temp = location.search.replace(/\?/, "").split("&");
    
  $.each(temp, function() {
    var key = this.split("=")[0], value = this.split("=")[1];
    params[key] = value;
  });


  DOTHIS();
}());