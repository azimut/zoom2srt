const DEFAULT_DURATION = 5;
const DEFAULT_NICKSTYLE = "none";
const DEFAULT_OFFSET = "00:00:00";

function processChat(chat, opts) {
  const { duration, offset, nickStyle } = opts;
  return formatIt(offsetIt(parseIt(chat, duration), offset), nickStyle);
}

function parseIt(chat, duration = DEFAULT_DURATION) {
  let messages = [];
  const lines = chat.split("\r\n").map((s) => s.split("\t"));
  const emojiRegex = /^\p{Emoji}$/u; // only an emoji
  for (const [time, author, msg] of lines) {
    let newMsg = msg;
    if (!time || !author || !msg) continue;
    if (msg.startsWith("Reacted to ")) continue;
    if (msg.startsWith("Se ha reaccionado a ")) continue;
    if (msg.startsWith("Replying to ")) newMsg = msg.split("\n")[2];
    if (emojiRegex.test(newMsg)) continue;
    let startTime = inSeconds(time);
    messages.push({
      startTime: startTime,
      endTime: startTime + duration,
      author: author,
      msg: newMsg,
    });
  }
  return messages;
}

function offsetIt(messages, rawOffset = DEFAULT_OFFSET) {
  let result = [];
  const offset = inSeconds(rawOffset);
  for (const { startTime, endTime, author, msg } of messages) {
    let finalStartTime = startTime - offset;
    if (finalStartTime < 0) continue;
    result.push({
      startTime: finalStartTime,
      endTime: endTime - offset,
      author: author,
      msg: msg,
    });
  }
  return result;
}

function formatIt(messages, nickStyle = DEFAULT_NICKSTYLE) {
  let iColor = 0;
  let colorMap = new Map();
  const colors = [
    "#e6194B",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#42d4f4",
    "#f032e6",
    "#bfef45",
    "#fabed4",
    "#469990",
    "#dcbeff",
    "#9A6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#a9a9a9",
    "#ffffff",
    "#000000",
  ];
  const getColor = (nick) => {
    if (!colorMap.get(nick))
      colorMap.set(nick, colors[iColor++ % colors.length]);
    return colorMap.get(nick);
  };
  let idx = 0;
  let result = "";
  for (const { startTime, endTime, author, msg } of messages) {
    result += `${++idx}\n`;
    result += `${toTimestamp(startTime)},000 --> ${toTimestamp(endTime)},000\n`;
    switch (nickStyle) {
      case "bold":
        result += `<b>${author}</b> ${msg}\n`;
        break;
      case "colors":
        result += `<font color=${getColor(author)}>${author}</font> ${msg}\n`;
        break;
      default:
        result += `${author} ${msg}\n`;
    }
    result += "\n";
  }
  return result;
  function toTimestamp(seconds) {
    const date = new Date(seconds * 1000); // to milliseconds
    return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}`;
    function pad2(s) {
      return s.toString().padStart(2, "0");
    }
  }
}

function inSeconds(timestamp) {
  const [hour, min, sec] = timestamp.split(":");
  return parseInt(hour) * 60 * 60 + parseInt(min) * 60 + parseInt(sec);
}
