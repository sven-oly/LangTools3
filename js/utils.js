// Utility functions for HTML and JavaScript
function toggleDiv(id, toggle) {
    var obj = document.getElementById(id);
    var checkBox = document.getElementById(toggle);
    var showIt = checkBox.checked;
    if (showIt)
      obj.style.display = 'block';
    else
      obj.style.display = 'none';
}

function toggleVisible(id) {
    var obj = document.getElementById(id);
    if (obj.style.display == 'none')
      obj.style.display = 'block';
    else
      obj.style.display = 'none';
}

// Clears and sets focus for text area.
function clearText(text_id) {
  var field = document.getElementById(text_id);
  field.value = '';
  document.getElementById(text_id).focus();
}

// Copy text contents from area1 to area2.
function copyText(area1Id, area2Id) {
  var obj1 = document.getElementById(area1Id);
  var obj2 = document.getElementById(area2Id);
  obj2.innerHTML = obj2.value = obj1.value;
}

// Shows codepoints for textarea in other textarea.
function showCodePoints(text_id, codepoints_id) {
  var src_field = document.getElementById(text_id);
  var code_text = uplus(src_field.value);
  var dest_field = document.getElementById(codepoints_id);
  dest_field.value = code_text;
  src_field.focus();
}

// Set language and font size
function onLanguageSelected(newLangTag, textArea) {
  var t1_element = document.getElementById(textArea);
  t1_element.lang = newLangTag;
}

function onSizeSelected(newSize, textArea) {
  var t1_element = document.getElementById(textArea);
  t1_element.style.fontSize = newSize;
}

// Sets font for a text area.
function setFontFamily(output_area, newFontFamily) {
  setKeyCapsFont(newFontFamily);
  output_area.className = newFontFamily;
  output_area.style.fontFamily = newFontFamily; //  + ",Arial";
}

function utf16common(text, prefix, suffix, asciitoo, highlight_list)
{
  var res = "";
  for(var i=0;i<text.length;i++)
  {
    var ccode = text.charCodeAt(i);
    const orig_code = ccode;
    if (!asciitoo && (ccode == 0x005c)) {
      res += "\\\\";
    } else if ((ccode >= 0xd800) && (ccode < 0xdc00)) {
      // high surrogate
	if ( i+1 >= text.length ) {
	  res += "[error Surrogate High only]";
	} else {
	  i++;
	  var nextcode = text.charCodeAt(i);
	  if ((nextcode >= 0xdc00) && (nextcode < 0xe000)) {
	    var ucs4 = ((ccode - 0xd800) << 10) + ((nextcode - 0xdc00)) + 0x10000;
	    var tmp = "";
	    for (var j = 0; j < 6; j++) {
	      var cur = ucs4 & 0x000f;
	      if (cur > 9) {
		tmp = "ABCDEF".charAt(cur-10) + tmp;
	      } else {
		tmp = "0123456789".charAt(cur) + tmp;
	      }
	      ucs4 >>= 4;
	    }
	    if (i < highlight_list.length && highlight_list[i]) {
	      res += prefix + tmp + suffix;
	    } else {
	      res += prefix + tmp + suffix;
	    }
	  } else {
	    res += "[error Surrogate High only]";
	    i--;
	  }
       }
    } else if ((ccode >= 0xdc00) && (ccode < 0xe000)) {
      res += "[error Surrogate Low only]";
    } else if (asciitoo || (ccode > 0x007F) || (ccode < 0x0020)) {
      var tmp = "";
      for (var j = 0; j < 4; j++) {
	    var cur = ccode & 0x000f;
	    if (cur > 9) {
	      tmp = "ABCDEF".charAt(cur-10) + tmp;
	    } else {
	      tmp = "0123456789".charAt(cur) + tmp;
    	}
	      ccode >>= 4;
        }
        if (i < highlight_list.length && highlight_list[i]) {
          res += "<b>" + prefix + tmp + suffix + "</b>";
        } else {
          res += prefix + tmp + suffix;
        }
        if (orig_code == 0x0a) {
          res += "\n";  // Put Newline in the output
        }
      } else  {
      res += text.charAt(i);
    }
  }
  return res;
}

  function uplus(text)
  {
    return utf16common(text, "", " ", true, diff_list);
  }

  // Burmese
  function isConsonant(num) {
    return (0x1000 <= num && num <= 0x102a) || num == 0x103f || num == 0x104e;
  }

  function isSubscriptConsonant(num) {
    return (0x1000 <= num && num <= 0x1019) || num == 0x101c || num == 0x101e ||
	    num == 0x1020 || num == 0x1021;
  }

  function isMedial(num) {
    return (0x103b <= num && num <= 0x103e);
  }

  function isVowelSign(num) {
    return (0x102b <= num && num <= 0x1030) || num == 0x1032;
  }

// Constants
var nondigits = "[^\u1040-\u1049]";
var consonant = "[\u1000-\u1021]";
var vowelsign = "[\u102d, \u102e, \u1032, \u102f, \u1030, \u102b, \u102c]";

function charsToHexString(text) {
  var nums = "";
  for (i = 0; i < text.length; i++) {
    v = text.charCodeAt(i);
    var xout = v.toString(16)
    nums = nums + xout + " ";
  }
  return nums;
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
    if (hStrings[i] != "" && hStrings[i] != "\u0000") {
      intList[outIndex] = parseInt(hStrings[i], 16);
      outIndex ++;
    }
  }
  return intList;
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
