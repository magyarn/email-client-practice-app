/**
 * The data store is currently a JSON file, but its schema mirrors the Gmail
 * API so we can feed it from your own inbox at a later date.
 *
 * @flow
 */

import type { Data, Message } from './types';

const store: Data = require('./emails.json');

function getNewMessageIds() {
  return store.mailboxes.INBOX.threadIds;
}

function getNewMessages(newMessageIds) {
  let newMessages = [];
  for (let id = 0; id < newMessageIds.length; id += 1) {
    const rawMessageObj = store.messages[newMessageIds[id]];
    const refinedMessageObj = {
      Snippet: rawMessageObj.snippet,
      Date: '',
      From: '',
      To: '',
      Subject: '',
    };
    for (let header of rawMessageObj.payload.headers) {
      refinedMessageObj[header.name] = header.value;
    };
    newMessages.push(refinedMessageObj);
  }
  return newMessages;
}

function formatNewMessage(newMessage) {
  const formattedRecipients = newMessage.To;
  const formattedDate = formatTimestamp(newMessage.Date);
  const formattedSender = newMessage.From.match(/([A-Z])\w+/g).join(' ');
  const formattedSubject = formatSubject(newMessage.Subject);
  const formattedSnippet = formatSnippet(newMessage.Snippet);
  const formattedMessage = {
    recipients: formattedRecipients,
    sender: formattedSender,
    subject: formattedSubject,
    snippet: formattedSnippet,
    date: formattedDate
  }
  return formattedMessage;
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

const newMessageIds = getNewMessageIds();
const newMessages = getNewMessages(newMessageIds);
export const formattedMessages = newMessages.map(newMessage => formatNewMessage(newMessage));
