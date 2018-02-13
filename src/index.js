/**
 * @flow
 */
import { getThreads, getMailboxes, getMessage } from './store';

/* Called once at the beginning of pageload. In the function, call
getMailboxes() to find out which ones to render based on what's in the JSON
file. And since INBOX is the default mailbox to render, start with applying the
"active" class to that li for styling purposes  */
function oneTimeNavRender() {
  const mailboxNames = getMailboxes();
  const navigationUL = document.querySelector('.client-nav-items');
  const navItems = mailboxNames.map(name =>
    name === 'INBOX' ? `<li class="client-nav-item"><button class="nav-btn active">${name}</button></li>` :
      `<li class="client-nav-item"><button class="nav-btn">${name}</button></li>`).join('');
  navigationUL.innerHTML = navItems;
}

function displayMessage(e) {
  const threadID = e.currentTarget.id;
  const htmlContent = getMessage(threadID);
  document.querySelector('.email-show-container').innerHTML = htmlContent;
}

/* Pass a mailboxName parameter to the function to decide which threads to show.
INBOX is the default, so it will show inbox threads on pageload.
This function is called by renderMailbox() */
function renderSidebar(mailboxName = 'INBOX') {
  const messageLIs = getThreads(mailboxName).reduce((html, thread) => `
    ${html} <li>
  <button class="email-item" type="button" id="${thread.id}">
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
  const emailItems = document.querySelectorAll('.email-item');
  emailItems.forEach(item =>
    item.addEventListener('click', e => displayMessage(e)))
}

/* Called by addNavEventListeners(), this function invokes the renderSidebar
function and toggles the "active" class for styling purposes */
function renderMailbox(eventTarget) {
  const mailboxName = eventTarget.textContent;
  const activeMB = document.querySelector('.active');
  activeMB.classList.remove('active');
  eventTarget.classList.add('active');
  renderSidebar(mailboxName);
}

/* Called on pageload and applied to all items in the navigation that was just
rendered by oneTimeNavRender() */
function addNavEventListeners() {
  const navItems = document.querySelectorAll('.client-nav-item');
  navItems.forEach(item =>
    item.addEventListener('click', e => renderMailbox(e.target)));
}

/* Invoke the above functions to render elements and add event listeners */
oneTimeNavRender();
renderSidebar();
addNavEventListeners();
