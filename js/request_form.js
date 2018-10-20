console.log('Лапулечки-пупунечки в сети');

$('.dropdown-toggle').dropdown()

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
    return { user_request: request };
  }

  sendUserRequestForm() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:3000/user_requests', true);

    //Передает правильный заголовок в запросе
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        debugger;
        // Запрос завершен. Здесь можно обрабатывать результат.
      }
    }
    xhr.send(JSON.stringify(this.allValues()));
    // xhr.send('string');
    // xhr.send(new Blob());
    // xhr.send(new Int8Array());
    // xhr.send({ form: 'data' });
    // xhr.send(document);
  }

  inputs() { return Array.from(document.querySelectorAll('input, select')) };
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
