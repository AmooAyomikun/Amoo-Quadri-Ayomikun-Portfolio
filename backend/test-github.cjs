const fetch = require('node-fetch');

async function test() {
  try {
    const response = await fetch('https://github.com/users/AmooAyomikun/contributions');
    const html = await response.text();

    const totalMatch = html.match(/([\d,]+)\s+contributions/i);
    console.log('Total Match:', totalMatch ? totalMatch[1] : 'null');

    const dayRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d)"[^>]*>[\s\S]*?(?:<tool-tip[^>]*>([^<]+)<\/tool-tip>)?/gi;
    const days = [];
    let match;
    while ((match = dayRegex.exec(html)) !== null) {
      days.push(match[1]);
    }
    console.log('Days found:', days.length);
  } catch (e) {
    console.error(e);
  }
}

test();
