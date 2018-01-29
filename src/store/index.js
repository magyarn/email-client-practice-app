/**
 * @flow
 */

import type { Data, Message } from './types';

const store: Data = require('./emails.json');

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

function formatSender(sender) {
  return sender.match(/.+?(?=\\u003)/)[0];
}

function formatSnippet(snippet) {
  return `${snippet.substr(0, 60)}...`;
}

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

export function getThreads() {
  const { mailboxes, threads } = store;
  const inbox = mailboxes.INBOX;
  const threadObjects = inbox.threadIds.map((id) => {
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

export default store;
