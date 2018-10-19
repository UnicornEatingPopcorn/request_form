console.log('Лапулечки-пупунечки в сети');

class RequestForm {
  constructor(formID){
    this.formID = formID;
    this.form = $(formID)
  }
  checkEmptyInputs() {
    return inputs().forEach(function(input) {
      var parser = new InputParser('#' + input.id);
      input.style.backgroundColor = parser.inputColor();
    });
  }

  allValues() {
    var request = {};
    this.inputs().forEach(function(input) {
      var parser = new InputParser('#' + input.id);
      request[input.id] = parser.value();
    })
    return request;
  }
  inputs() { return Array.from(document.getElementsByTagName('input')) };
}



class InputParser {
  constructor(cssSelector) {
    this.cssSelector = cssSelector;
    this.element = $(cssSelector)
  }
  value() {
    if (this.element.attr('type') == 'checkbox') {
      return this.element.is(":checked");
    } else {
      return this.element.val();
    }
  }
  inputColor() {
    if (this.value() == '') {
      return "red";
    } else {
      return "white"
    }
  }
}
