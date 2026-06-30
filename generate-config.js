const fs = require('fs');

// Carrega .env manualmente se existir (desenvolvimento local)
if (fs.existsSync('.env')) {
  const lines = fs.readFileSync('.env', 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const key = trimmed.slice(0, eqIndex).trim();
      const val = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Erro: SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios.');
  console.error('Copie .env.example para .env e preencha os valores.');
  process.exit(1);
}

fs.writeFileSync(
  'js/config.js',
  `window.SUPABASE_URL = '${url}';\nwindow.SUPABASE_ANON_KEY = '${anonKey}';\n`
);

console.log('js/config.js gerado com sucesso.');
