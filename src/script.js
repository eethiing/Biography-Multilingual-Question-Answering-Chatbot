const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_IMG = "BOT_IMG.jpg";
const PERSON_IMG = "PERSON_IMG.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "User";
var ngrokLink = null;

const settingButton = get('.setting');

settingButton.addEventListener('click', function() {

  const overlay = get(".overlay")
  overlay.style.visibility = 'visible';
  overlay.style.opacity = 1;

  const settingForm = get('.msger-inputarea', overlay);
  const linkInput = get('.msger-input', overlay);
  linkInput.focus();
  function innerClickHandler(event) {
    event.preventDefault();
    ngrokLink = linkInput.value;
    if (ngrokLink === '') {
      return;
    }

    settingForm.removeEventListener('submit', innerClickHandler);
    
    fetch(ngrokLink + '/check')
    .then(response => {
      if (!response.ok) {
        appendMessageElement(BOT_NAME, BOT_IMG, 'Network response was not OK','bot');
      }
      return response.json();
    })
    .then(data => {
      if (data == 'connected'){
        appendMessageElement(BOT_NAME, BOT_IMG, 'Congratulations, I am connected to API. Go ahead and send me a message. 😄','bot');
      }
    })
    .catch(error => {
      appendMessageElement(BOT_NAME, BOT_IMG, String(error),'bot')
    });

    overlay.style.opacity = 0;
    setTimeout(function() {
      overlay.style.visibility = 'hidden';
    }, 500);
  }
  settingForm.addEventListener('submit', innerClickHandler);
});

msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessageElement(PERSON_NAME, PERSON_IMG, msgText,'user');
  msgerInput.value = "";

  botResponse(msgText);
});

appendMessageElement(BOT_NAME, BOT_IMG, 'Hi, welcome to Biography Chatbot! Please click 🔧 at the upper left coner to configure the Chatbot API! 😉', 'bot');

function botResponse(msgText) {

  if (ngrokLink){
    const url = ngrokLink + '/get_answer/' + msgText;
    const dotHTML = `<span class="jumping-dots">
    <span class="dot-1"></span>
    <span class="dot-2"></span>
    <span class="dot-3"></span>
    </span>`
    appendMessageElement(BOT_NAME, BOT_IMG, dotHTML,'bot');
    const newMsgElement = msgerChat.lastElementChild;
    const newMsgContent = newMsgElement.getElementsByClassName("msg-text")[0];
  
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
      
    })
    .then(data => {
      appendMessageElement(BOT_NAME, BOT_IMG, data, 'bot', newMsgContent);
    })
    .catch(error => {
      appendMessageElement(BOT_NAME, BOT_IMG, String(error), 'bot', newMsgContent);
    });
  }else{
    appendMessageElement(BOT_NAME, BOT_IMG, 'I am not connected to any API. 😥 Please click on the 🔧 in the upper left corner to configure the chatbot API.', 'bot');
  }
}

function appendMessageElement(name, img, text, type, newMsgContent=null, speed=100) {
  const msgerSendBtn = get('.msger-send-btn', msgerForm);
  msgerSendBtn.disabled = true;
  const isBot = type === "bot";
  
  const msgHTML = `
    <div class="msg ${isBot ? "left-msg" : "right-msg"}">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text"></div>
      </div>
    </div>
  `;

  
  if (newMsgContent === null){
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTo(0, msgerChat.scrollHeight);
    const newMsgElement = msgerChat.lastElementChild;
    newMsgContent = newMsgElement.getElementsByClassName("msg-text")[0];
  }

  if (isBot) {
    // Check if text contains a <span> element
    if (/\<span.*\>.*\<\/span\>/i.test(text)) {
      newMsgContent.innerHTML = text; // Set inner HTML directly
      msgerChat.scrollTo(0, msgerChat.scrollHeight);
    } else {
      const spanElements = newMsgContent.querySelectorAll("span");
      if (spanElements.length > 0) {
        spanElements.forEach((span) => {
          span.remove();
        });
      }
      const words = text.split(" ");
      let i = 0;
      
      const appendWord = () => {
        if (i < words.length) {
          msgerChat.scrollTo(0, msgerChat.scrollHeight);
          newMsgContent.textContent += words[i] + " ";
          i++;
          setTimeout(appendWord, speed);
        } else {
          enableSendButton();
        }
      };

      appendWord();
    }
  } else {
    newMsgContent.textContent = text;
    enableSendButton();
  }

  function enableSendButton() {
    msgerSendBtn.disabled = false;
  }
  
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}