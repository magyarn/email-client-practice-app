/**
 * @flow
 */
import { getThreads, getMailboxes } from './store';

function renderNavigation() {
  const mailboxNames = getMailboxes();
  const navigationUL = document.querySelector('.client-nav-items');
  const navItems = mailboxNames.map(name =>
    name === 'INBOX' ? `<li class="client-nav-item active">${name}</li>` :
      `<li class="client-nav-item">${name}</li>`).join('');
  navigationUL.innerHTML = navItems;
}

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

renderNavigation();
renderSidebar();
addNavEventListeners();
