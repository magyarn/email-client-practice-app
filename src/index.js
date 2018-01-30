/**
 * @flow
 */
import { getThreads } from './store';

function renderSidebar(mailboxName = 'INBOX') {
  const messageLIs = getThreads(mailboxName).reduce((html, thread) => `${html} <li>
  <button class="email-item" type="button">
      <div class="sender-details">
        <p>${thread.sender}</p>
        <span>${thread.timestamp}</span>
      </div>
      <p class="email-subject">${thread.subject}</p>
      <p class="snippet">${thread.snippet}</p>
    </button>
  </li>`, '');
  const sidebarContents = `
    <ul class="email-list">${messageLIs}</ul>
  `;
  const container = document.querySelector('.email-list');
  if (container != null) container.innerHTML = sidebarContents;
}

function renderMailbox(eventTarget) {
  const mailboxName = eventTarget.textContent;
  const activeMB = document.querySelector('.active');
  activeMB.classList.remove('active');
  eventTarget.classList.add('active');
  renderSidebar(mailboxName);
}

function addNavEventListeners() {
  const navItems = document.querySelectorAll('.client-nav-item');
  navItems.forEach(item =>
    item.addEventListener('click', e => renderMailbox(e.target)));
}

addNavEventListeners();
