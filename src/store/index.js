/**
 * The data store is currently a JSON file, but its schema mirrors the Gmail
 * API so we can feed it from your own inbox at a later date.
 *
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
  console.log(threads);
  const threadObjects = inbox.threadIds.map((id) => {
    const [newestMessage] = threads[id].messages.slice(-1);
    const message = store.messages[newestMessage.id];
    const { headers } = message.payload;
    const sender = getHeaderValue(headers, 'From');
    const timestamp = getHeaderValue(headers, 'Date');
    const subject = getHeaderValue(headers, 'Subject') || '(No Subject)';
    const { snippet } = message;
    return {
      sender,
      timestamp,
      subject,
      snippet,
    };
  });
  return threadObjects;
}

// function getNewMessageIds() {
//   return store.mailboxes.INBOX.threadIds;
// }
//
// function getNewMessages(newMessageIds) {
//   const newMessages = [];
//   for (let id = 0; id < newMessageIds.length; id += 1) {
//     const rawMessageObj = store.messages[newMessageIds[id]];
//     const refinedMessageObj = {
//       Snippet: rawMessageObj.snippet,
//       Date: '',
//       From: '',
//       To: '',
//       Subject: '',
//     };
//     for (const header of rawMessageObj.payload.headers) {
//       refinedMessageObj[header.name] = header.value;
//     }
//     newMessages.push(refinedMessageObj);
//   }
//   return newMessages;
// }
//
// function formatTimestamp(datestring) {
//   const d = new Date(datestring);
//   const month = d.getMonth() + 1;
//   const day = d.getDay();
//   const year = String(d.getFullYear()).substring(2);
//   const timestamp = `${month}/${day}/${year}`;
//   return timestamp;
// }
//
// function formatSubject (subject) {
//   return subject.length > 25 ? subject.substring(0, 25) + '...' : subject;
// }
//
// function formatSnippet (snippet) {
//   return snippet.length > 70 ? snippet.substring(0, 70) + '...' : snippet;
// }
//
// function formatNewMessage(newMessage) {
//   const formattedRecipients = newMessage.To;
//   const formattedDate = formatTimestamp(newMessage.Date);
//   const formattedSender = newMessage.From.match(/([A-Z])\w+/g).join(' ');
//   const formattedSubject = formatSubject(newMessage.Subject);
//   const formattedSnippet = formatSnippet(newMessage.Snippet);
//   const formattedMessage = {
//     recipients: formattedRecipients,
//     sender: formattedSender,
//     subject: formattedSubject,
//     snippet: formattedSnippet,
//     date: formattedDate
//   }
//   return formattedMessage;
// }
//
// const newMessageIds = getNewMessageIds();
// const newMessages = getNewMessages(newMessageIds);
// export const formattedMessages = newMessages.map(newMessage =>
// formatNewMessage(newMessage));

export default store;
