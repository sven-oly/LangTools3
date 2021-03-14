// Javascript to request XHTML and receive results.

function requestTransliterate(inputarea, outputarea, rulearea, messagearea, summaryarea, translit_selection) {
    // Prepare for the call to the backendvar xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    } else { // code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    // Deal with the results
    xmlhttp.onreadystatechange=function() {
      if(xmlhttp.readyState==4) {
        var returned_json = xmlhttp.responseText;
        try {
            var json_obj = JSON.parse(returned_json);

            var outputObj = document.getElementById(outputarea);
            var messageObj = document.getElementById(messagearea);
            var transliteratorSummaryObj = document.getElementById(summaryarea);
        }
        catch (error) {
          var messageObj = document.getElementById(messagearea);
          messageObj.innerHTML = messageObj.value = error;
          alert(error);
          return;
        }
        if (json_obj.error) {
          // Warn, and don't change values.
          alert(json_obj.error);
          return;
        }
        messageObj.value = messageObj.innerHTML = json_obj.message;
        outputObj.value = outputObj.innerHTML = json_obj.outText;
        transliteratorSummaryObj.value = json_obj.summary;
        transliteratorSummaryObj.style.display = "block";  // Show it
      }
    }

    // Set up the call
    var inputObj = document.getElementById(inputarea);
    var inputtext = escape(inputObj.value);
    var encodedInput = encodeURIComponent(inputObj.value);
    var ruleObj = document.getElementById(rulearea);
    ruletext = encodeURIComponent(ruleObj.value);
    var rules_length = ruletext.length;
    var translit_type = translit_selection;
    var args = "input=" + encodedInput + "&rules=" + ruletext +
                     "&translit_type=" + translit_type + "&rules_length=" + rules_length;
    var url_head = "/my/dotranslit/";
    var target = "/my/dotranslit/?input=" + encodedInput + "&rules=" + ruletext +
      "&translit_type=" + translit_type + "&rules_length=" + rules_length;
    //xmlhttp.open("GET", target, true);
    var size = target.length;
    xmlhttp.open("POST", url_head, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(args);
}

// Javascript to request translit rules.
function requestTransliterateRules(rulearea, messagearea, translit_selection) {
    // Prepare for the call to the backendvar xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    } else { // code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    // Deal with the results
    xmlhttp.onreadystatechange=function() {
      if(xmlhttp.readyState==4) {
        var returned_json = xmlhttp.responseText;
        var json_obj = JSON.parse(returned_json);

        var messageObj = document.getElementById(messagearea);
        var rulearea_obj = document.getElementById(rulearea);

        if (json_obj.error) {
          // Warn, and don't change values.
          alert(json_obj.error);
          return;
        }
        messageObj.value = messageObj.innerHTML = json_obj.message;
        rulearea_obj.value = rulearea_obj.innerHTML = json_obj.rulesText;
      }
    }

    // Set up the call
    var translit_type = translit_selection;

    var target = "/my/getrules/?translit_type=" + translit_type;
    xmlhttp.open("GET", target, true);
    var size = target.length;
    xmlhttp.send(null);
}