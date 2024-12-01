const STARTOFFSET = '00:00:00';
const emojiRegex = /^\p{Emoji}$/u; // only an emoji

function processChat(chat, duration) {
  return format(offset(parse(chat, parseInt(duration)), STARTOFFSET));
}

function parse(chat, duration) {
  let messages = [];
  const lines = chat.split('\r\n').map((s) => s.split('\t'))
  for (const [time, author, msg] of lines) {
    let newMsg = msg;
    if (!time || !author || !msg) continue
    if (msg.startsWith("Reacted to ")) continue
    if (msg.startsWith("Se ha reaccionado a ")) continue
    if (msg.startsWith("Replying to "))
      newMsg = msg.split('\n')[2];
    if (emojiRegex.test(newMsg)) continue
    messages.push({
      startTime: toUTCPosix(time),
      endTime: toUTCPosix(time) + duration,
      author: author,
      msg: newMsg
    });
  }
  return messages;
}

function offset(messages, rawOffset) {
  let result = []
  const offset = toUTCPosix(rawOffset)
  for (const { startTime, endTime, author, msg } of messages) {
    result.push({
      startTime: startTime + offset,
      endTime: endTime + offset,
      author: author,
      msg: msg
    })
  }
  return result
}

function format(messages) {
  let idx = 0
  let result = ""
  for (const { startTime, endTime, author, msg } of messages) {
    result += `${++idx}\n`
    result += `${toTimestamp(startTime)} --> ${toTimestamp(endTime)}\n`
    result += `${author} ${msg}\n`
    result += '\n'
  }
  return result
  function toTimestamp(posix) {
    const date = new Date(posix * 1000) // to milliseconds
    return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}`
    function pad2(s) {
      return s.toString().padStart(2, '0')
    }
  }
}

function toUTCPosix(timestamp) {
  const [hour, min, sec] = timestamp.split(':')
  return (parseInt(hour) * 60 * 60 + parseInt(min) * 60 + parseInt(sec))
}
