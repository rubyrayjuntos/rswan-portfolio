const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '_data');
const FIELD = process.argv[2]; // e.g. "style", "tech", "mood", "genre", "role"

if (!FIELD) {
  console.error('Usage: node unique-values.js <field>');
  process.exit(1);
}

const unique = new Set();

fs.readdirSync(DATA_DIR).forEach(file => {
  if (!file.endsWith('.json')) return;
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (Array.isArray(data[FIELD])) {
    data[FIELD].forEach(v => unique.add(v));
  } else if (typeof data[FIELD] === 'string') {
    unique.add(data[FIELD]);
  }
});

console.log(`Unique values for "${FIELD}":`);
console.log([...unique].sort()); 