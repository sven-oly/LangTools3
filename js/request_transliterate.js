// Javascript to request XHTML and receive results.

function requestTransliterate(inputarea, outputarea, rule_text, messagearea, summaryarea, translit_selection) {
    // Prepare for the call to the backendvar xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    } else { // code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    // Deal with the results
    xmlhttp.onreadystatechange=function() {
      if(xmlhttp.readyState==4) {
        const returned_json = xmlhttp.responseText;
        try {
            var json_obj = JSON.parse(returned_json);

            var outputObj = document.getElementById(outputarea);
            var messageObj = document.getElementById(messagearea);
            var transliteratorSummaryObj = document.getElementById(summaryarea);
        }
        catch (error) {
          const messageObj = document.getElementById(messagearea);
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
    const inputObj = document.getElementById(inputarea);
    const inputtext = escape(inputObj.value);
    const encodedInput = encodeURIComponent(inputObj.value);
    const rules_to_send = encodeURIComponent(rule_text);
    const translit_type = translit_selection;

    const args = "input=" + encodedInput + "&rules=" + rules_to_send +
                     "&translit_type=" + translit_type;
    const url_head = "/my/dotranslit/";
    // var target = "/my/dotranslit/" + args;
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
        prepareRuleEditZones(json_obj.rulesText, "editDiv");
      }
    }

    // Set up the call
    var translit_type = translit_selection;

    var target = "/my/getrules/?translit_type=" + translit_type;
    xmlhttp.open("GET", target, true);
    var size = target.length;
    xmlhttp.send(null);
}

// Create a separate text are for each phase of rule list
function prepareRuleEditZones(intext, div_id) {
    var phases = intext.split("::Null;");
    var div = document.getElementById(div_id);
    // Clear existing items in this div.
    var areas = div.getElementsByTagName('textarea');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for (phase in phases) {
        // To use scoped valuesi in the closure
      let input = document.createElement("textarea");
      let button = document.createElement("button");
      // put parts of the text in each
      input.name = "Phase " + phase;
      input.maxLength = "5000";
      input.innerHTML = input.value = phases[phase];
      input.className = 'textareas';
      input.cols = "100";
      input.rows = "40";
      button.innerHTML = button.value = "Phase " + phase;
      button.onclick = makePhaseClosure(input, phase);
      div.appendChild(input); //appendChild
      div.appendChild(button);
    }
}

// This creates a properly bound closure for the onclick.
function makePhaseClosure(input, phase) {
    return function() {
      handlePhaseButton(input, phase);
    };
}

function handlePhaseButton(area, phase) {
  // What to do?
  // Count lines and expand the area.
  var t = area.value;
  var r = area.rows;
  var fsize = area.fontsize;
  var line_count = t.split('\n').length;
  area.height = line_count * 20;
  area.rows = line_count;
}