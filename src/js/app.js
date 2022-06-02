import createDOMFromHTML from './utils.js';


const getElements = () => {
  domElements.barWrapper = document.querySelector('.bar');
  domElements.list = domElements.barWrapper.querySelector('ul');
  domElements.tags = domElements.barWrapper.querySelector('.tags');
  domElements.form = domElements.barWrapper.querySelector('form');
  domElements.input = domElements.form.querySelector('input');
};

const addTag = tag => {
  if(tag != ''){
    const generateHTML = `<div class="tag" id=${tag}><p>${tag}<i class="fa-solid fa-x"></i></p></div>`;
    domElements.tags.appendChild(createDOMFromHTML(generateHTML));
    tags.push(tag);
  }
};

const matchedSuggestions = (data, value) => {
  const matched = data.filter(x => x.toLowerCase().includes(value.toLowerCase()));
  return matched;
};

const inputChange = data => {

  domElements.input.addEventListener('keyup', e =>{
    const valueOfInput = domElements.input.value;
    
    if(valueOfInput.length > 0){
      domElements.list.classList.add('active');
      const suggestions = matchedSuggestions(data, valueOfInput);
      
      if(suggestions.length > 0){
        const arrayOfLists = suggestions.map(x => `<li id=${x}>${x}</li>`);
        domElements.list.innerHTML = arrayOfLists.join('');
        suggestionsFunctionality(e.keyCode);
      } else {
        domElements.list.innerHTML = '<li>No matches<li>';
      }
    } else {
      domElements.list.classList.remove('active');
    }
  });
};

const submitInput = () => {
  domElements.form.addEventListener('submit', e => {
    e.preventDefault();
    if(pickedSuggestion != ''){
      addTag(pickedSuggestion);
      pickedSuggestion = '';
      domElements.input.value = '';
    } else {
      const valueOfInput = domElements.input.value;
      addTag(valueOfInput);
      domElements.input.value = '';
    }
  });
};

const suggestionsFunctionality = key => {
  const suggestions = domElements.list.children;
  const suggestionsIndexAmount = suggestions.length - 1;

  if(key != 38 && key != 40 && key!= 13){
    activeSuggestion = 0; 
  }

  if(key == 40){
    suggestions[activeSuggestion].classList.add('active');
    console.log('dodalem');
  }

  if(key != 13){
    if(activeSuggestion == 0 && key == 38){
      suggestions[activeSuggestion].classList.remove('active');
      console.log('usunalem');
    } else if(activeSuggestion > 0 && key == 38){
      suggestions[activeSuggestion].classList.remove('active');
      activeSuggestion -= 1;
    } else if(activeSuggestion == suggestionsIndexAmount && key == 40){
      activeSuggestion = suggestionsIndexAmount;
    } else if(activeSuggestion < suggestionsIndexAmount && key == 40){
      suggestions[activeSuggestion].classList.remove('active');
      activeSuggestion += 1; 
    }
    suggestions[activeSuggestion].classList.add('active');
  }
  pickedSuggestion = suggestions[activeSuggestion].textContent;
};

const deleteTag = () => {
  domElements.tags.addEventListener('click', e => {
    if(e.target.tagName == 'I'){
      const divOfElement = e.target.closest('div');
      const id = e.target.closest('div').id;
      const indexOfId = tags.indexOf(id);
      tags.splice(indexOfId, 1);
      divOfElement.remove();
    }
  });
};

const tags = [];
let activeSuggestion = 0;
let pickedSuggestion = '';
const domElements = {};


getElements();

fetch('http://localhost:3131/sugestions')
  .then(function(response){
    return response.json();
  })
  .then(function(parsedResponse){
    inputChange(parsedResponse);
    submitInput();
  });
  
deleteTag();