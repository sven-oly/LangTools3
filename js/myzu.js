// Javascript to support Myanmar Zawgyi / Unicode fonts.

// GLOBALS
var myanmar_tools_detector = null;
var myanmar_tools_converter = null;

function myzu_initialize(zawgyi_detector, zawgyi_converter) {
  myanmar_tools_converter = zawgyi_converter;
  myanmar_tools_detector = zawgyi_detector;
}

function onload() {
  var fill_area = document.getElementById("TestEntry");
  if (fill_area) {
    fill_area.focus();
    var intext = fill_area.value;

    if (intext) {
      enterTestText(true);
    }
  }
}


// Toggle the region id.
function showhide(id) {
  var e = document.getElementById(id);
  e.style.display = (e.style.display == 'block') ? 'none' : 'block';
}

function compareConvert(area1,area2) {
  // Open a comparison window with the resulting text.
  var area1Elem = document.getElementById(area1);
  var area2Elem = document.getElementById(area2);
  var text1 = area1Elem.value;
  var text2 = area2Elem.value;

  compareUrl = "/compare/?text1=" + text1 + "&font1=" + area1Elem.className +
    "&text2=" + text2 + "&font2=" + area2Elem.className;
  //xmlhttp.open("GET", compareUrl, true);

  window.location=compareUrl;
}

function enterTestText(infield_id ) {
  const infield = document.getElementById(infield_id);
  const intext = infield.value;

  // Use myanmar-tools detection (https://github.com/googlei18n/myanmar-tools)

  const detField = document.getElementById("detectedZU");
  var detMsg = "Detected: ";

  var zawgyi_score = myanmar_tools_detector.getZawgyiProbability(intext);
  zawgyi_score = 0.01 * Math.round(100.0 * zawgyi_score);
  if (detField) {
    detField.innerHTML = "Zawgyi score: " + zawgyi_score;;
  }
}

 // Code to request transliteration (conversion) and handle the return.
  function convertRequest(source, type, outputId) {
    // Get the text and prepare the call to server.
    source_element = document.getElementById(source);

    text_in = source_element.value;
    var converted = false;
    var outText = "";
    if (type == "Z") {
        // Just call the javascript version.
        outText = zawgyi_converter.zawgyiToUnicode(text_in);
        converted = true;
    } else
    if (type == "U") {
        outText = zawgyi_converter.unicodeToZawgyi(text_in);
        converted = true;
    } else {
        outText = zawgyi_converter.normalizeZawgyi(text_in);
        converted = true;
    }
    if (converted) {
        var output_area = document.getElementById(outputId);
        output_area.innerHTML = output_area.value = outText;
        return;
    }
}

// Convert input string into hex string.
function textToHex(intext) {
  var outHex = "";
  if (!intext) {
    return "";
  }
  for (var i = 0; i < intext.length; i++) {
    var firstHex = fixedCharCodeAt(intext, i);
    var hexString = firstHex.toString(16);
    if (hexString != "false") {
      outHex += hexString + " ";
    }
  }
  return outHex;
}

// Convert input string into hex string.
function textToHexField(inElementName, outElementName) {
  var inElement = document.getElementById(inElementName);
  var intext = inElement.value.replace(/ +(?= )/g,'');  // Fix multiple spaces
  var outHex = textToHex(intext);

  var outElement = document.getElementById(outElementName);
  //outElement.innerHTML = outHex;
  outElement.value = outHex;
  return outHex;
}

// Take hex and put it into the fields.
function enterHex() {
  // Get the hex values, converted to Unicode.
  // Then set in the
  var inHexElem = document.getElementById("hexText");
  var textHex = intArrayFromHexString(inHexElem.value.replace(/ +(?= )/g,''));
  var uChars = fromCodePointHex(textHex);
  document.getElementById("TestEntry").value = uChars;

  enterTestText(false);  // Not quite right!
}

// Copy hex to scratch
function copyText(infield, outfield) {
  var inArea = document.getElementById(infield);
  var outArea = document.getElementById(outfield);
  var outText = inArea.value;
  outArea.value = inArea.value;
}

// Take hex and put it into the fields.
function hexToOutput(infield, outfield) {
  // Get the hex values, converted to Unicode.
  // Then set in the
  var inHexElem = document.getElementById(infield);
  var textHex = intArrayFromHexString(inHexElem.value);
  var uChars = fromCodePointHex(textHex);

  var outField = document.getElementById(outfield);
  outField.value = uChars;
}

// Input is string of hex values, separated by spaces.
// Also accept 0x, u+, and \u for each hex value.
function intArrayFromHexString(inString) {
  // Remove U+ or 0x. Split at space.
  var newString = inString.replace(/(U\+)|(u\+)|(0x)|(0X)|( 0x)|( 0X)|\\u|\\U/g, " ")
  var hStrings = newString.split(" ");
  var intList = [];
  var outIndex = 0;
  for (var i=0; i < hStrings.length; i ++) {
    if (hStrings[i] != "" && hStrings != "\u0000") {
      intList[outIndex] = parseInt(hStrings[i], 16);
      outIndex ++;
    }
  }
  return intList;
}

// returns a char's Unicode codepoint, of the char at index idx of string str
// 2013-07-16 from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/charCodeAt
function fixedCharCodeAt (str, idx) {
    // ex. fixedCharCodeAt ('\uD800\uDC00', 0); // 65536
    // ex. fixedCharCodeAt ('\uD800\uDC00', 1); // 65536
    idx = idx || 0;
    var code = str.charCodeAt(idx);
    var hi, low;
    if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
	hi = code;
	low = str.charCodeAt(idx+1);
	if (isNaN(low)) {
	    throw 'High surrogate not followed by low surrogate in fixedCharCodeAt()';
	}
	return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
	// We return false to allow loops to skip this iteration since should have already handled high surrogate above in the previous iteration
	return false;
	/*hi = str.charCodeAt(idx-1);
	low = code;
	return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;*/
    }
    return code;
}

// Create Unicode chars from array of hex characters.
function fromCodePointHex(arguments) {
  var chars = [], point, offset, units, i;
  for (i = 0; i < arguments.length; ++i) {
    point = arguments[i];
    offset = point - 0x10000;
    units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
    chars.push(String.fromCharCode.apply(null, units));
  }
  return chars.join("");
}
