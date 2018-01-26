/**
 * @flow
 */
import { getThreads } from './store';

function renderSidebar() {
  const messageLIs = getThreads().reduce((html, thread) => `${html} <li>
  <button class="email-item" type="button">
      <div class="sender-details">
        <p>${thread.sender}</p>
        <span>${thread.timestamp}</span>
      </div>
      <p class="email-subject">${thread.subject}</p>
      <p>${thread.snippet}</p>
    </button>
  </li>`, '');
  const sidebarContents = `
    <ul class="email-list">${messageLIs}</ul>
  `;
  const container = document.querySelector('.email-list');
  if (container != null) container.innerHTML += sidebarContents;
}

renderSidebar();
