import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function triggerChunked(pusher, channel, event, data) {
  const chunkSize = 9000;  //  Set it to more like 9000
  const str = JSON.stringify(data);
  const msgId = Math.random() + '';
  for (var i = 0; i * chunkSize < str.length; i++) {
    // TODO: use pusher.triggerBatch for better performance
    pusher.trigger(channel, "chunked-" + event, {
      id: msgId,
      index: i,
      chunk: str.substr(i * chunkSize, chunkSize),
      final: chunkSize * (i + 1) >= str.length
    });
  }
}

export function bindWithChunking(channel, event: string, callback) {
  channel.bind(event, callback); // Allow normal unchunked events.

  // Now the chunked variation. Allows arbitrarily long messages.
  let events = {};
  channel.bind("chunked-" + event, (data) => {
    if (!events.hasOwnProperty(data.id)) {
      events[data.id] = { chunks: [], receivedFinal: false };
    }
    let ev = events[data.id];
    ev.chunks[data.index] = data.chunk;
    if (data.final) ev.receivedFinal = true;
    if (
      ev.receivedFinal &&
      ev.chunks.length === Object.keys(ev.chunks).length
    ) {
      callback(JSON.parse(ev.chunks.join("")));
      delete events[data.id];
    }
  });
}