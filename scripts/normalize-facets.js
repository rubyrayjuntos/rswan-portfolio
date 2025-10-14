const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, '_data', 'projects');
const MANIFEST_PATH = path.join(PROJECTS_DIR, 'manifest.json');

const CANON = {
  genre: [
    'Tarot',
    'Fantasy',
    'Science Fiction',
    'Literary Fiction',
    'Romance',
    'Comics/Graphic Novels',
    'Concept Art',
    'Interactive/Web',
    'Game',
    'Branding/Marketing',
    'Education',
    'Worldbuilding'
  ],
  style: [
    'Modern',
    'Minimalist',
    'Clean',
    'Expressive',
    'Narrative-Driven',
    'Atmospheric',
    'Theatrical',
    'Symbolic',
    'Accessible',
    'Responsive',
    'Character-Driven',
    'Epic',
    'Philosophical'
  ],
  tech: [
    'HTML5',
    'CSS3',
    'JavaScript',
    'TypeScript',
    'React',
    'React Three Fiber',
    'Three.js',
    'Vite',
    'Tailwind CSS',
    'Node.js',
    'FastAPI',
    'SQLAlchemy',
    'Docker',
    'OpenAI API',
    'CrewAI',
    'Fuse.js',
    'Python',
    'Pydantic'
  ]
};

const CANON_LC = Object.fromEntries(
  Object.entries(CANON).map(([k, vals]) => [k, vals.map(v => v.toLowerCase())])
);

const MAP = {
  genre: {
    'tarot art': 'Tarot',
    'tarot education': 'Tarot',
    'tarot-inspired': 'Tarot',
    'symbolic performance': 'Tarot',
    'symbolism': 'Tarot',

    'science fantasy': 'Science Fiction',
    'speculative': 'Science Fiction',
    'science fiction': 'Science Fiction',

    'literary fiction': 'Literary Fiction',
    'philosophical fiction': 'Literary Fiction',

    'romance': 'Romance',
    'love story': 'Romance',
    'cross-cultural': 'Romance',
    'contemporary fiction': 'Literary Fiction',

    'comic book': 'Comics/Graphic Novels',
    'graphic novel': 'Comics/Graphic Novels',

    'character design': 'Concept Art',
    'concept art': 'Concept Art',
    'visual development': 'Concept Art',
    'art education': 'Concept Art',

    'web development': 'Interactive/Web',
    'web application': 'Interactive/Web',
    'single page application': 'Interactive/Web',
    'storytelling platform': 'Interactive/Web',
    'interactive gallery': 'Interactive/Web',
    'portfolio system': 'Interactive/Web',
    'content management': 'Interactive/Web',
    'data-driven architecture': 'Interactive/Web',
    'interactive art': 'Interactive/Web',
    'creative platform': 'Interactive/Web',
    'full stack web': 'Interactive/Web',

    'mobile game': 'Game',
    'arcade': 'Game',
    'space shooter': 'Game',

    'brand design': 'Branding/Marketing',
    'marketing': 'Branding/Marketing',

    'educational content': 'Education',
    'video series': 'Education',
    'spiritual teaching': 'Education',

    'world building': 'Worldbuilding',
    'fictional universe': 'Worldbuilding',
    'ip development': 'Worldbuilding',

    'ai': 'Interactive/Web',
    'ai/ml': 'Interactive/Web',
    'agentic workflow': 'Interactive/Web',
    'multi-agent system': 'Interactive/Web',
    'tools': 'Interactive/Web',
    'productivity': 'Interactive/Web',
    'narrative tech': 'Interactive/Web',

    'character-driven': 'Literary Fiction',
    'archetypal fiction': 'Fantasy',
    "hero's journey": 'Fantasy',
    'cosmic drama': 'Fantasy',
    'cosmic journey': 'Fantasy',
    'spiritual fiction': 'Fantasy',
    'tarot': 'Tarot',
    'digital art': 'Concept Art',
    'sticker design': 'Concept Art',
    'astrology art': 'Concept Art',
    'commercial art': 'Branding/Marketing',
    'creative writing': 'Literary Fiction',
    'process documentation': 'Education',
    'digital media': 'Interactive/Web',
    'writing aid': 'Education',
    'ui/ux design': 'Interactive/Web'
  },
  style: {
    'narrative': 'Narrative-Driven',
    'character development': 'Character-Driven',
    'character-driven': 'Character-Driven',
    'comic book art': 'Expressive',
    'dynamic composition': 'Expressive',
    'expressive characters': 'Expressive',
    'atmospheric lighting': 'Atmospheric',
    'contemporary mysticism': 'Symbolic',
    'visual storytelling': 'Narrative-Driven',
    'process documentation': null,
    'vanilla javascript': null,
    'cross-platform': null,
    'performance-optimized': null,
    'component-based': null,
    'mobile-optimized': null,
    'responsive': 'Responsive',
    'clean': 'Clean',
    'minimalist': 'Minimalist',
    'modern': 'Modern',
    'accessible': 'Accessible',
    'epic': 'Epic',
    'symbolic': 'Symbolic',
    'theatrical': 'Theatrical',
    'intimate': 'Expressive',
    'emotional': 'Expressive',
    'lyrical': 'Expressive',
    'poetic': 'Expressive',
    'philosophical': 'Philosophical',
    'spiritual': 'Symbolic',
    'calming dark-grays': 'Modern',
    'vibrant blues': 'Modern'
  },
  tech: {
    'html/css/javascript': ['HTML5','CSS3','JavaScript'],
    'html5': 'HTML5',
    'css3': 'CSS3',
    'javascript': 'JavaScript',
    'react 18': 'React',
    'react three fiber': 'React Three Fiber',
    'three.js': 'Three.js',
    'vite': 'Vite',
    'tailwind css': 'Tailwind CSS',
    'node.js': 'Node.js',
    'fastapi': 'FastAPI',
    'sqlalchemy': 'SQLAlchemy',
    'docker': 'Docker',
    'openai api': 'OpenAI API',
    'openai gpt': 'OpenAI API',
    'openai gpt-4': 'OpenAI API',
    'crewai': 'CrewAI',
    'fuse.js': 'Fuse.js',
    'python 3.11+': 'Python',
    'python': 'Python',
    'pydantic': 'Pydantic',

    // drop/ignore domain/skill-like entries
    'creative writing': null,
    'world building': null,
    'character development': null,
    'digital illustration': null,
    'composition': null,
    'color theory': null,
    'visual storytelling': null,
    'mobile development': null,
    'game development': null,
    'touch controls': null,
    'responsive design': null,
    'lazy léon ui': null,
    'json': null,
    'concept art': null,
    'visual development': null,
    'process documentation': null,
    'spiritual research': null,
    'narrative structure': null,
    'comic book layout': null,
    'storyboarding': null,
    'sequential art': null,
    'dialogue': null,
    'cultural research': null,
    'story structure': null,
    'react query': null,
    'socket.io': null,
    'react router': null,
    'jwt': null,
    'pinecone': null,
    'serperdev': null,
    'postgresql': null,
    'redis': null,
    'celery': null,
    'markdown': null,
    'git': null,
    'http server': null,
    'css grid': null,
    'css flexbox': null,
    'local storage': null,
    'session storage': null,
    'dom manipulation': null,
    'event handling': null,
    'async/await': null,
    'es6+ features': null,
    'vector art': null,
    'sticker design': null,
    'digital optimization': null,
    'commercial art': null,
    'video production': null,
    'content creation': null,
    'educational design': null,
    'digital media': null,
    'social media': null,
    'digital painting': null,
    'staged symbolism': null,
    'tarot research': null,
    'narrative composition': null,
    'philosophical themes': null,
    'research': null,
    'documentation': null,
    'creative process': null,
    'react': 'React'
  }
};

function normalizeValue(field, value) {
  if (!value) return null;
  const v = String(value).trim();
  if (!v) return null;
  const vLC = v.toLowerCase();

  // direct canonical match
  const canonIdx = CANON_LC[field].indexOf(vLC);
  if (canonIdx !== -1) return CANON[field][canonIdx];

  // mapping
  const mapped = MAP[field] && MAP[field][vLC];
  if (Array.isArray(mapped)) return mapped;
  if (mapped === null) return null;
  if (mapped) return mapped;

  // heuristic mapping by keywords
  if (field === 'genre') {
    if (/tarot/i.test(v)) return 'Tarot';
    if (/graphic|comic/i.test(v)) return 'Comics/Graphic Novels';
    if (/web|interactive|application|platform|gallery|ui\/ux|uiux/i.test(v)) return 'Interactive/Web';
    if (/game|arcade|shooter/i.test(v)) return 'Game';
    if (/brand|marketing/i.test(v)) return 'Branding/Marketing';
    if (/educat|teaching|lesson|course|video/i.test(v)) return 'Education';
    if (/world build|universe|ip/i.test(v)) return 'Worldbuilding';
    if (/fantasy|archetypal|myth|cosmic/i.test(v)) return 'Fantasy';
    if (/sci|speculative/i.test(v)) return 'Science Fiction';
    if (/romance|love/i.test(v)) return 'Romance';
    if (/fiction|literary/i.test(v)) return 'Literary Fiction';
    if (/concept|character|visual development|art/i.test(v)) return 'Concept Art';
  }
  if (field === 'style') {
    if (/narrative/i.test(v)) return 'Narrative-Driven';
    if (/character/i.test(v)) return 'Character-Driven';
    if (/atmospher/i.test(v)) return 'Atmospheric';
    if (/symbol/i.test(v)) return 'Symbolic';
    if (/modern|contemporary/i.test(v)) return 'Modern';
    if (/minimal/i.test(v)) return 'Minimalist';
    if (/clean/i.test(v)) return 'Clean';
    if (/epic/i.test(v)) return 'Epic';
    if (/theatr/i.test(v)) return 'Theatrical';
    if (/philosoph/i.test(v)) return 'Philosophical';
    if (/responsive/i.test(v)) return 'Responsive';
    if (/access/i.test(v)) return 'Accessible';
    if (/express/i.test(v)) return 'Expressive';
  }
  if (field === 'tech') {
    if (/html\/?css\/?javascript/i.test(v)) return ['HTML5','CSS3','JavaScript'];
    if (/html/i.test(v)) return 'HTML5';
    if (/css/i.test(v)) return 'CSS3';
    if (/javascript|js\b/i.test(v)) return 'JavaScript';
    if (/typescript|ts\b/i.test(v)) return 'TypeScript';
    if (/react three fiber/i.test(v)) return 'React Three Fiber';
    if (/three\.js|threejs/i.test(v)) return 'Three.js';
    if (/react/i.test(v)) return 'React';
    if (/vite/i.test(v)) return 'Vite';
    if (/tailwind/i.test(v)) return 'Tailwind CSS';
    if (/node/i.test(v)) return 'Node.js';
    if (/fastapi/i.test(v)) return 'FastAPI';
    if (/sqlalchemy/i.test(v)) return 'SQLAlchemy';
    if (/docker/i.test(v)) return 'Docker';
    if (/openai|gpt/i.test(v)) return 'OpenAI API';
    if (/crewai/i.test(v)) return 'CrewAI';
    if (/fuse\.js|fusejs|fuse/i.test(v)) return 'Fuse.js';
    if (/pydantic/i.test(v)) return 'Pydantic';
    if (/python/i.test(v)) return 'Python';
  }

  return null; // drop if unknown to keep taxonomy tight
}

function normalizeArray(field, arr) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  arr.forEach(val => {
    const norm = normalizeValue(field, val);
    if (Array.isArray(norm)) norm.forEach(x => out.push(x));
    else if (typeof norm === 'string') out.push(norm);
  });
  // dedupe while preserving canonical order
  const seen = new Set();
  return out.filter(v => {
    if (seen.has(v)) return false;
    seen.add(v);
    return true;
  });
}

function run() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const report = [];
  manifest.forEach(rel => {
    const filePath = path.join(ROOT, rel);
    if (!fs.existsSync(filePath)) return;
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const before = {
      genre: Array.isArray(json.genre) ? json.genre.slice() : [],
      style: Array.isArray(json.style) ? json.style.slice() : [],
      tech: Array.isArray(json.tech) ? json.tech.slice() : []
    };

    const after = {
      genre: normalizeArray('genre', before.genre),
      style: normalizeArray('style', before.style),
      tech: normalizeArray('tech', before.tech)
    };

    json.genre = after.genre;
    json.style = after.style;
    json.tech = after.tech;

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');

    report.push({ file: rel, before, after });
  });

  // Aggregate counts after normalization
  const counts = { genre: {}, style: {}, tech: {} };
  report.forEach(r => {
    ['genre','style','tech'].forEach(k => {
      r.after[k].forEach(v => { counts[k][v] = (counts[k][v] || 0) + 1; });
    });
  });

  console.log('Normalization complete. New counts:');
  console.log(JSON.stringify(counts, null, 2));
}

if (require.main === module) run();
