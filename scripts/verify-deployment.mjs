async function checkUrl(url) {
  try {
    const res = await fetch(url);
    const ct = res.headers.get('content-type') || '';
    const body = await res.text();
    console.log(`[${res.status}] ${url} (${ct}) - ${body.length} bytes`);
    return { ok: res.ok, status: res.status, body, ct };
  } catch (e) {
    console.error(`[ERROR] ${url}:`, e.message);
    return { ok: false, error: e.message };
  }
}

async function run() {
  console.log('--- Testing Vercel Production URLs ---');
  const base = 'https://luxenia.vercel.app';
  
  // 1. Home
  const home = await checkUrl(base);
  
  // 2. Extract scripts and stylesheets
  const scriptMatch = home.body.match(/src="(\/assets\/[^"]+\.js)"/);
  if (scriptMatch) {
    await checkUrl(base + scriptMatch[1]);
  }
  
  const cssMatch = home.body.match(/href="(\/assets\/[^"]+\.css)"/);
  if (cssMatch) {
    await checkUrl(base + cssMatch[1]);
  }
  
  // 3. Test Deep Routes
  await checkUrl(`${base}/shop`);
  await checkUrl(`${base}/product/prod-001`);
  await checkUrl(`${base}/cart`);
  await checkUrl(`${base}/checkout`);
  
  // 4. Test Images
  await checkUrl(`${base}/images/products/luxe-baguette-noir-black.jpg`);
  await checkUrl(`${base}/images/products/luxe-baguette-sahara-brown.jpg`);
  await checkUrl(`${base}/images/products/luxe-baguette-ivory-cream.jpg`);

  // 5. Test custom domain if resolving
  console.log('\n--- Testing Custom Domain: https://luxenia.com ---');
  await checkUrl('https://luxenia.com');
  await checkUrl('http://luxenia.com');
  await checkUrl('https://www.luxenia.com');
}

run();
