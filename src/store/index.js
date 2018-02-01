/**
 * @flow
 */

import type { Data, Message } from './types';

const store: Data = require('./emails.json');

/* If a message was sent sometime today, show the time. If it was sent anytime
before that, show the date. Called in getHeaderValue() */
function formatTimestamp(timestamp) {
  const now = Date.now();
  const midnightToday = new Date().setUTCHours(0, 0, 0, 0);
  const timestampMilliseconds = Date.parse(timestamp);
  const justDate = new Date(timestamp).toLocaleDateString();
  const justTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (timestampMilliseconds < now && timestampMilliseconds > midnightToday) {
    return justTime;
  }
  return justDate;
}

/* Show only the name of a sender and not any garbage that follows. Called in
getHeaderValue() */
function formatSender(sender) {
  return sender.match(/.+?(?=\\u003)/)[0];
}

/* Shorten message snippets. Called in getThreads() */
function formatSnippet(snippet) {
  return `${snippet.substr(0, 60)}...`;
}

/* Called in getThreads() to abstractly return a message attribute (which
sometimes needs extra formatting depending on the type/name) */
function getHeaderValue(headers, name) {
  const { value } = headers.filter(header => header.name === name)[0];
  if (name === 'Date') {
    return formatTimestamp(value);
  }
  if (name === 'From') {
    return formatSender(value);
  }
  return value;
}

/* Returns a chronological array of message objects for a given mailbox. Called
in renderSidebar() in src/index.js */
export function getThreads(mailboxName) {
  const mailboxKey = Object.keys(allMailboxes).find(key => allMailboxes[key] === mailboxName);
  const { mailboxes, threads } = store;
  const mailbox = mailboxes[mailboxKey];
  const threadObjects = mailbox.threadIds.map((id) => {
    const [newestMessage] = threads[id].messages.slice(-1);
    const message = store.messages[newestMessage.id];
    const { headers } = message.payload;
    return {
      sender: getHeaderValue(headers, 'From'),
      timestamp: getHeaderValue(headers, 'Date'),
      subject: getHeaderValue(headers, 'Subject') || '(No Subject)',
      snippet: formatSnippet(message.snippet),
      rawTimestamp: message.internalDate,
    };
  });
  return threadObjects.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
}

/* Object of possible mailbox names as defined by the gmail API, with values
in my preferred format. Used to convert ugly mailbox names to pretty ones in
getMailboxes() */
const allMailboxes = {
  INBOX: 'INBOX',
  SPAM: 'SPAM',
  TRASH: 'TRASH',
  UNREAD: 'UNREAD',
  STARRED: 'STARRED',
  IMPORTANT: 'IMPORTANT',
  SENT: 'SENT',
  DRAFT: 'DRAFT',
  CATEGORY_PERSONAL: 'PERSONAL',
  CATEGORY_SOCIAL: 'SOCIAL',
  CATEGORY_PROMOTIONS: 'PROMOTIONS',
  CATEGORY_UPDATES: 'UPDATES',
  CATEGORY_FORUMS: 'FORUMS',
};

/* Gets all the mailbox names from a given JSON store, and converts it to the
pretty version of that name, if it exists in allMailboxes. Called in
renderNavigation() of src/index.js */
export function getMailboxes() {
  const { mailboxes } = store;
  const mbNames = Object.keys(mailboxes);
  return mbNames.map(name => allMailboxes[name] || name);
}

export default store;
