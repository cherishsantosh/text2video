$(function() {
    var fistOfFirst='', articleNumber='', firstPara='';
  if ("speechSynthesis" in window) {
    speechSynthesis.onvoiceschanged = function() {
      var $voicelist = $("#voices");

      if ($voicelist.find("option").length == 0) {
        speechSynthesis.getVoices().forEach(function(voice, index) {
          var $option = $("<option>")
            .val(index)
            .html(voice.name + (voice.default ? " (default)" : ""));

          $voicelist.append($option);
        });

        $voicelist.material_select();
      }
    };
    $("#speak").click(function() {
      $(".modal").closeModal()
      var text = $("#message").val();
      var msg = new SpeechSynthesisUtterance();
      var voices = window.speechSynthesis.getVoices();
      console.log("Text ::::", $("#voices").val());
      msg.voice = voices[$("#voices").val()];
      msg.rate = $("#rate").val() / 10;
      msg.pitch = $("#pitch").val();
      msg.text = text;

      msg.onend = function(e) {
        console.log("Finished in " + event.elapsedTime + " seconds.");
      };

      speechSynthesis.speak(msg);

      $(".ml2").each(function() {
        $(this).html(
          $(this)
            .text()
            .replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>")
        );
      });
  
      anime.timeline({ loop: true }).add({
          targets: ".ml2 .letter",
          scale: [4, 1],
          opacity: [0, 1],
          translateZ: 0,
          easing: "easeOutExpo",
          duration: 950,
          delay: function(el, i) {
            return 70 * i;
          }
        })
        .add({
          targets: ".ml2",
          opacity: 0,
          duration: 1000,
          easing: "easeOutExpo",
          delay: 1000
        });

    });

    $("#searchFor").autocomplete({
      source: function(request, response) {
        $.ajax({
          url: "http://en.wikipedia.org/w/api.php",
          dataType: "jsonp",
          data: {
            action: "opensearch",
            format: "json",
            search: request.term
          },
          success: function(data) {
            response(data[1]);
            console.log(">>>>>>>", data[1]);
          }
        });
      },
      select: function(event, ui) {
        fistOfFirst = ui.item.label;
        console.log(fistOfFirst);
        $("#mainDisp").empty();
        $( "#wikiText" ).empty();
        console.log("Called serchFx");
        searchFx();
      }
    });

    $("#searchBtn").on("click", function(event) {
      $("#mainDisp").empty();
      searchFx();
    });

    function searchFx() {
      console.log("Inside serchFx");
      var searchInput = fistOfFirst;
      $(message).empty();
      console.log("Inside serchFx >>>", searchInput);
      var tgtSite =
        "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=1&explaintext=1&titles=" +
        searchInput;
      sendRequest(tgtSite);
    }

    function sendRequest(tgtSite) {
      $.ajax({
        url: tgtSite,
        dataType: "jsonp",
        data: {
          q: {},
          format: "json"
        },
        success: organizeData
      });
    }

    function organizeData(data) {
      if (typeof data != "object") {
        updateView("Please retry term");
      }
      var title, snippet, hLink, replyLength, singleReply;
      
      for(key in data.query.pages){
        articleNumber=key;
        console.log(">>",key);//for key name in your case it will be bar
     }
      $(message).append(data.query.pages[articleNumber].extract);
      console.log("ALL RESPONCE:: ", data.query.pages[articleNumber].extract);
      firstPara=data.query.pages[articleNumber].extract;
      $( "#wikiText" ).empty();
      $( "#wikiText" ).append(firstPara);
      title = data[1];
      snippet = data[2];
      hLink = data[3];
      //replyLength = title.length;
      singleReply = [];

      // for (var i = 0; i < replyLength; i++) {
      //   singleReply.push(title[i]);
      //   singleReply.push(snippet[i]);
      //   singleReply.push(hLink[i]);
      //   //updateView(singleReply);
      //   updateView(title[i], snippet[i], hLink[i])
      //   singleReply = [];
      // }
    }

    function updateView(queryReply) {
      var mainDisp = document.getElementById("mainDisp");

      var titleMessageElement = document.createElement("p");
      var titleDisp = document.createTextNode(queryReply[0]);
      titleMessageElement.className = "retTitle";

      var snippetMessageElement = document.createElement("p");
      var snippetDisp = document.createTextNode(queryReply[1]);

      var linkMessageElement = document.createElement("a");
      linkMessageElement.setAttribute("href", queryReply[2]);
      linkMessageElement.innerHTML = queryReply[2];
      linkMessageElement.className = "linkFormat";

      var outShell = document.createElement("div");
      var innShell = document.createElement("div");
      outShell.className = "outerShell";
      innShell.className = "innerShell";

      titleMessageElement.appendChild(titleDisp);
      snippetMessageElement.appendChild(snippetDisp);

      innShell.appendChild(titleMessageElement);
      innShell.appendChild(snippetMessageElement);
      innShell.appendChild(linkMessageElement);

      outShell.appendChild(innShell);

      mainDisp.appendChild(outShell);
    }
  } else {
    $("#modal1").openModal();
  }
});
