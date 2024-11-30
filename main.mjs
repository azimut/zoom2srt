import { readFileSync } from "fs";

const TXTFILE = "/home/sendai/Videos/clases/Chat de la Clase 13.txt";
const emojiRegex = /^\p{Emoji}$/u;

let input = readFileSync(TXTFILE, {encoding: 'utf-8'});

function parseChat(chat) {
  let result = [];
  const lines = chat.split('\r\n').map((s) => s.split('\t'))
  for(const [time,author,msg] of lines) {
    let newMsg = msg;
    if (!time || !author || !msg) continue
    if (msg.startsWith("Reacted to ")) continue
    if (msg.startsWith("Se ha reaccionado a ")) continue
    if (msg.startsWith("Replying to "))
      newMsg = msg.split('\n')[2];
    if (emojiRegex.test(newMsg)) continue
    result.push({time: time, author: author, msg: newMsg});
  }
  return result;
}

function offsetMessages(messages, offset) {
  let result = []
  return result
}

function printMessages(messages) {
  let idx = 0
  for(const {time, author, msg} of messages) {
    console.log(++idx)
    console.log(time,"-->",time)
    console.log(author, msg)
    console.log()
  }
}

console.log(printMessages(parseChat(input)))
