/**
 * @flow
 */
import * as emails from './store/emails.json';

// example of generating HTML with js
function renderNewMessage(sender, timestamp, subject, snippet) {
  const sidebar = document.querySelector('.email-list');
  const newMessage = document.createElement('li');
  newMessage.innerHTMl = `<button class="email-item" type="button">
                            <div class="sender-details">
                              <p>${sender}</p>
                              <span>${timestamp}</span>
                            </div>
                            <p class="email-subject">${subject}</p>
                            <p>${snippet}</p>
                          </button>`;
  sidebar.appendChild(newMessage);
  console.log(newMessage);
}

function renderSidebar() {
  const sidebarContents = `
    <h2 class="email-header">Inbox</h2>
    <ul class="email-list"></ul>
  `;

  const container = document.querySelector('.email-list-container');
  if (container != null) container.innerHTML = sidebarContents;

  const newMessageIDs = emails.mailboxes.INBOX.threadIds;
  const allMessages = emails.messages;
  console.log(allMessages);

  for (let m of newMessageIDs) {
    const payloadHeaders = allMessages[m].payload.headers;
    const snippet = allMessages[m].snippet;
    const timestamp = payloadHeaders[0].value;
    const sender = payloadHeaders[1].value;
    const subject = payloadHeaders[3].value;
    renderNewMessage(sender, timestamp, subject, snippet);
  }
}

renderSidebar();
