// input-daemon.js -- i'll explain later

const express = require('express');
const { spawn } = require('child_process');
const robot = require('robotjs'); // or xdotool via spawn
const fs = require('fs');

let keyMap = JSON.parse(fs.readFileSync('./cec-map.json', 'utf8'));

const app = express();
app.use(express.json());
app.use(express.static('public')); // serves config UI

// REST endpoint to get/update mappings
app.get('/mappings', (req, res) => res.json(keyMap));
app.post('/mappings', (req, res) => {
  keyMap = req.body;
  fs.writeFileSync('./cec-map.json', JSON.stringify(keyMap, null, 2));
  res.json({ success: true });
});

// Start CEC listener
const cec = spawn('cec-client', ['-d', '1']);
cec.stdout.on('data', (data) => {
  const line = data.toString();
  const match = line.match(/key pressed: (.+?) \(/);
  if (match) {
    const cecKey = match[1];
    const mapped = keyMap[cecKey];
    if (mapped) {
      console.log(`Mapped ${cecKey} → ${mapped}`);
      robot.keyTap(mapped.toLowerCase());
    }
  }
});

app.listen(3000, () => console.log('CEC config server running on http://localhost:3000'));