const roomAdjectives = [
  "Midnight",
  "Cosmic",
  "Neon",
  "Moonlight",
  "Velvet",
  "Electric",
  "Dreamy",
  "Silent",
  "Golden",
  "Chill",
];

const roomNouns = [
  "Vibes",
  "Beats",
  "Frequencies",
  "Sessions",
  "Echoes",
  "Waves",
  "Melodies",
  "Grooves",
  "Tunes",
  "Rhythms",
];

export function generateRoomName() {
  const adjective =
    roomAdjectives[Math.floor(Math.random() * roomAdjectives.length)];

  const noun =
    roomNouns[Math.floor(Math.random() * roomNouns.length)];

  return `${adjective} ${noun}`;
}