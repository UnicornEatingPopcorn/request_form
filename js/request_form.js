
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
    let form = this
    xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 201) {
        let serverResponse = JSON.parse(xhr.response);
        form.displayCreatedRequest(serverResponse);
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

  displayCreatedRequest(request) {
    var requestsList = document.querySelectorAll("tbody")[0];
    var createdRequest = document.createElement("tr");

    createdRequest.innerHTML = `<td class='id' scope="row">${request.id}</td>
    <td><span class='budgetText'>${request.budget}</span><input type="text" class="form-control editBudgetInput" value="${request.budget}"></td>
    <td>${request.city_from}</td>
    <td><a href="#" class="btn btn-primary editBudget">Edit budget</a><a href="#" class="btn btn-success submitBudget">OK</a></td>
    <td><a href="#" class="delete">X</a></td>`

    requestsList.appendChild(createdRequest);

    return true
  }

  displayCreatedRequests() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:3000/user_requests', true);

    //Передает правильный заголовок в запросе
    xhr.setRequestHeader("Content-type", "application/json");
    let form = this
    xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        var createdRequests = JSON.parse(xhr.response)
        createdRequests.forEach(function(element) {
          form.displayCreatedRequest(element);
        })

        // Запрос завершен. Здесь можно обрабатывать результат.
      }
    }
    xhr.send();
  }

  destroyRequest(id, requestRow) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:3000/user_requests/${id}`, true);

    //Передает правильный заголовок в запросе
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 204) {
        requestRow.remove()
      }
    }
    xhr.send();
  }

  updateRequest(request) {
    var xhr = new XMLHttpRequest();
    xhr.open("PATCH", `http://localhost:3000/user_requests/${request.id}`, true);

    //Передает правильный заголовок в запросе
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        let updatedRequest = JSON.parse(xhr.response);
      }
    }

    xhr.send(JSON.stringify(request));
  }

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

document.addEventListener('DOMContentLoaded', function(){ // Аналог $(document).ready(function(){
  let requestForm = new RequestForm();
  requestForm.displayCreatedRequests();

});

let submitButton = document.getElementById('submitButton');
submitButton.onclick = function() {
  let requestForm = new RequestForm();
  requestForm.sendUserRequestForm();
}

document.querySelector('table').addEventListener('click', function(event){
  event.preventDefault();
  if (event.target.classList.contains('editBudget')){
    event.target.style.display = 'none';
    let requestRow = event.target.parentElement.parentElement
    requestRow.querySelector('.editBudgetInput').style.display = 'block'
    requestRow.querySelector('.submitBudget').style.display = 'inline-block'
    requestRow.querySelector('.budgetText').style.display = 'none'
  }

  if (event.target.classList.contains('submitBudget')){
    event.target.style.display = 'none';

    let requestRow = event.target.parentElement.parentElement
    let requestForm = new RequestForm();
    let id = requestRow.querySelector('.id').innerText
    let budget = requestRow.querySelector('.editBudgetInput').value
    let request = { id: id, budget: budget };

    requestRow.querySelector('.editBudgetInput').style.display = 'none'
    requestRow.querySelector('.editBudget').style.display = 'inline-block'
    requestRow.querySelector('.budgetText').style.display = 'block'
    requestRow.querySelector('.budgetText').innerText = budget


    requestForm.updateRequest(request)

  }

  if (event.target.classList.contains('delete')){
    let requestRow = event.target.parentElement.parentElement
    let id = requestRow.querySelector('.id').innerText

    let requestForm = new RequestForm();
    requestForm.destroyRequest(id, requestRow)
  }


});


//при клике эдит, эта же строка должна увеличиваться по высоте и в ней должен появлятся инупт для бюджета и кнопка окей.
//при клике по окей, инпут и кнопка окей скрываются а на бэкенд уходит запрос типа patch
// если запрос проходит успешно, то мы парсим ответ сервета JSON.parse и обновляем в нужной строке значение бюджета, взяв его с сервера. Сервер вернет объект обновленный, я беру из него бюджет и обновляю строку.
