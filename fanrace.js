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
        fontSize = 100, tries = 0;

    do {
      fontSize++;

      $(".likes span").css("fontSize", fontSize);

      divWidth = $(".likes").width();
      spanWidth = Math.max($(".likes .fancount").eq(0).width(), $(".likes .fancount").eq(1).width());

      tries++;
    } while (divWidth > spanWidth || tries > 1000);

    $("body").css("fontSize", Math.round(fontSize / 4));

    verticalCenter();
  };

  DOTHIS = function() {
    var
    we = params.we || "diesocialisten",
    theOthers = params.vs || "limesoda.at",
    partySong = params.party || "7UCm6uyzNE8",
    nohelp = params.nohelp || false;

    if (!nohelp) {
      $(".footer").show();
    }

    $.ajax({
      url: "https://graph.facebook.com/" + we + "?fields=likes,name&locale=en_US",
      dataType: "json",
      success: function(res) {
        var ourLikes = parseInt(res.likes, 10), linkText;

        $(".ourLikes .fancount").text(ourLikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

        if (!initComplete) {
          if (!isNaN(we) || ("" + we.length) + 3 >= res.name.length) {
            linkText = res.name;
          } else {
            linkText = we;
          }

          $(".ourLikes a").text(linkText);
          $(".ourLikes a").attr("href", "https://www.facebook.com/" + we);
        }

        $.ajax({
          url: "https://graph.facebook.com/" + theOthers + "?fields=likes,name&locale=en_US",
          dataType: "json",
          success: function(res) {
            if (!initComplete) {
              if (!isNaN(theOthers) || ("" + theOthers.length) >= res.name.length) {
                linkText = res.name;
              } else {
                linkText = theOthers;
              }

              $(".otherLikes a").text(linkText);
              $(".otherLikes a").attr("href", "https://www.facebook.com/" + theOthers);

              $(".allContainer").fadeIn(3000);

              setTimeout(resizeText, 0);

              setTimeout(function() {
                $(".footer").css("height", 40);
              }, 5000);
              

              initComplete = true;
            }

            var otherLikes = parseInt(res.likes, 10);
            $(".otherLikes .fancount").text(otherLikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

            $(".missingLikes").text((otherLikes - ourLikes).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

            if (!$("iframe.celebration").attr("src").length) {
              if (ourLikes > otherLikes) {
                $("iframe.celebration").attr("src", "https://www.youtube-nocookie.com/embed/" + partySong + "?rel=0&amp;autoplay=1");
              }
            }
          },
          error: function(e) {
            clearInterval(interval);

            if (!initComplete) {
              $(".allContainer").html("The <strong>" + theOthers + "</strong> fan page was not found. Try another value for the vs parameter!").show();
            }
          }
        });
      },
      error: function(e) {
        clearInterval(interval);

        if (!initComplete) {
          $(".allContainer").html("The <strong>" + we + "</strong> fan page was not found. Try another value for the we parameter!").show();
        }
        
      }
    });
  };

  $(window).on("resize", resizeText);

  $(document).on("click", "#showInstructionsLink", function() {
    var $footer = $(".footer"), infoHeight = $footer.find(".infos").outerHeight();

    if ($footer.height() === infoHeight) {
      $footer.css("height", 40);
    } else {
      $footer.css("height", infoHeight);
    }

    return false;
  });

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