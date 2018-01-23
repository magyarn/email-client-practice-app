/**
 * @flow
 */
import * as emails from './store/emails.json';

// example of generating HTML with js
function renderNewMessage(sender, timestamp, subject, snippet) {
  const sidebar = document.querySelector('.email-list');
  const newMessage = document.createElement('li');
  newMessage.innerHTML = `<button class="email-item" type="button">
                            <div class="sender-details">
                              <p>${sender}</p>
                              <span>${timestamp}</span>
                            </div>
                            <p class="email-subject">${subject}</p>
                            <p>${snippet}</p>
                          </button>`;
  sidebar.appendChild(newMessage);
}


function formatTimestamp(datestring) {
  const d = new Date(datestring);
  const month = d.getMonth() + 1;
  const day = d.getDay();
  const year = String(d.getFullYear()).substring(2);
  const timestamp = `${month}/${day}/${year}`;
  return timestamp;
}

function formatSubject (subject) {
  return subject.length > 33 ? subject.substring(0, 33) + '...' : subject;
}

function formatSnippet (snippet) {
  return snippet.length > 77 ? snippet.substring(0, 77) + '...' : snippet;
}

function renderSidebar() {
  const sidebarContents = `
    <ul class="email-list"></ul>
  `;

  const container = document.querySelector('.email-list');
  if (container != null) container.innerHTML += sidebarContents;

  const newMessageIDs = emails.mailboxes.INBOX.threadIds;
  const allMessages = emails.messages;

  for (const m of newMessageIDs) {
    const payloadHeaders = allMessages[m].payload.headers;
    const snippet = formatSnippet(allMessages[m].snippet);
    const timestamp = formatTimestamp(payloadHeaders[0].value);
    const sender = payloadHeaders[1].value.match(/([A-Z])\w+/g).join(' ');
    const subject = formatSubject(payloadHeaders[3].value);
    renderNewMessage(sender, timestamp, subject, snippet);
  }
}

renderSidebar();
