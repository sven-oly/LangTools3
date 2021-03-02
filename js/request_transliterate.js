// Javascript to request XHTML and receive results.

function requestTransliterate(inputarea, outputarea, rulearea, messagearea, summaryarea, translit_selector) {
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

    var outputObj = document.getElementById(outputarea);
    var messageObj = document.getElementById(messagearea);
    var transliteratorSummaryObj = document.getElementById(summaryarea);

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
var ruletext = escape(ruleObj.value);
var translit_type = document.getElementById(translit_selector).value;

var target = "/my/dotranslit/?input=" + encodedInput + "&rules=" + ruletext +
  "&translit_type=" + translit_type ;
//xmlhttp.open("POST", target, true);
xmlhttp.open("GET", target, true);
var size = target.length;
xmlhttp.send(null);
}