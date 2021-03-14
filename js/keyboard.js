  // For loading keyboard.
  var k = { loadme: Object};
  k.loadme.prototype = function(a) {
  return a;
  }
  var e = {keyboard: k};
  var google = {elements: e};

  var diff_list = [];  // needed for utils.js

  // For the keyboard.
  var kb_controller, kb_visible = true;
  function initializeKeyboard(input_area, kb_list, font_list) {
    // The returned
    kb_controller = controller = new i18n.input.keyboard.Keyboard();

    var x = i18n.input.keyboard.Controller;

    onSizeSelected(document.getElementById("sizeSelector").value, 't1');
    for (kb in kb_list) {
      controller.loadLayout(kb);
    }
    controller.reposition(input_area, 3, 4, [5, 0, 0, 0]);
    controller.activateLayout('kb_list[0].shortName');
    controller.register(input_area);
    controller.addEventListener(
        'kc',
        function() { visible = false; });

    controller.addEventListener(
        'lat',
        function () {
            setFontFamily(input_area, font_list[0]);
        });
    input_area.focus();

    var selector = document.getElementById("setLayout");
    onLayoutSelected(selector.value);

    // setFontFamily(document.getElementById("fontSelector").value);
    setFontFamily(input_area, document.getElementById("fontSelector").value);
    return controller;
  }

function onLayoutSelected(layoutCode) {
  kb_controller.activateLayout(layoutCode);
    var info = kb_info[layoutCode];
    if (info != null) {
        var area = document.getElementById("kb_instructions");
        if (area) {
            area.innerHTML = area.value = info[1];
        }
    }
}

function toggle() {
  if (kb_controller) {
    kb_controller.setVisible(kb_visible = !kb_visible);
  }
}
