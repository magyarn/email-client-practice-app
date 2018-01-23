/**
 * @flow
 */
import * as emails from './store/emails.json';
import { formattedMessages } from './store';

// example of generating HTML with js
function renderNewMessage(newMessage) {
  const sidebar = document.querySelector('.email-list');
  const newMessageLI = document.createElement('li');
  newMessageLI.innerHTML = `<button class="email-item" type="button">
                            <div class="sender-details">
                              <p>${newMessage.sender}</p>
                              <span>${newMessage.date}</span>
                            </div>
                            <p class="email-subject">${newMessage.subject}</p>
                            <p>${newMessage.snippet}</p>
                          </button>`;
  sidebar.appendChild(newMessageLI);
}

function renderSidebar() {
  const sidebarContents = `
    <ul class="email-list"></ul>
  `;

  const container = document.querySelector('.email-list');
  if (container != null) container.innerHTML += sidebarContents;

  for (const m of formattedMessages) {
    renderNewMessage(m);
  }
}

renderSidebar();
