import { readFileSync } from "fs";

const TXTFILE = "/home/sendai/Videos/clases/Chat de la Clase 13.txt";
const DURATION = 5 // in seconds
const STARTOFFSET = '00:00:00';
const emojiRegex = /^\p{Emoji}$/u; // only an emoji

const input = readFileSync(TXTFILE, { encoding: 'utf-8' });

function parseChat(chat) {
  let result = [];
  const lines = chat.split('\r\n').map((s) => s.split('\t'))
  for (const [time, author, msg] of lines) {
    let newMsg = msg;
    if (!time || !author || !msg) continue
    if (msg.startsWith("Reacted to ")) continue
    if (msg.startsWith("Se ha reaccionado a ")) continue
    if (msg.startsWith("Replying to "))
      newMsg = msg.split('\n')[2];
    if (emojiRegex.test(newMsg)) continue
    result.push({
      startTime: toUTCPosix(time),
      endTime: toUTCPosix(time) + DURATION,
      author: author,
      msg: newMsg
    });
  }
  return result;
}

function offsetMessages(messages, offset) {
  let result = []
  return result
}

function printMessages(messages) {
  let idx = 0
  for (const { startTime, endTime, author, msg } of messages) {
    console.log(++idx)
    console.log(`${toTimestamp(startTime)} --> ${toTimestamp(endTime)}`)
    console.log(author, msg)
    console.log()
  }
}

function toTimestamp(posix) {
  const date = new Date(posix * 1000) // to milliseconds
  return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}`
  function pad2(s) {
    return s.toString().padStart(2, '0')
  }
}

function toUTCPosix(timestamp) {
  const [hour, min, sec] = timestamp.split(':')
  return (parseInt(hour) * 60 * 60 + parseInt(min) * 60 + parseInt(sec))
}

console.log(printMessages(parseChat(input)))
