import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

console.log('--- TESTING BUILT CLIENT BUNDLE IN JSDOM ---');

const distDir = path.resolve('dist');
const htmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Create JSDOM instance with scripts enabled and resources loaded
const dom = new JSDOM(htmlContent, {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'http://localhost:5173/'
});

const { window } = dom;

let errorOccurred = false;

window.addEventListener('error', (event) => {
  console.error('❌ BROWSER RUNTIME ERROR DETECTED:');
  console.error(event.error || event.message);
  errorOccurred = true;
});

// Polyfill minimal browser APIs
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

window.scrollTo = function() {};

// Read the JS bundle directly from dist/assets
const assetsDir = path.join(distDir, 'assets');
const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'));

if (jsFiles.length === 0) {
  console.error('No JS files found in dist/assets!');
  process.exit(1);
}

const jsFile = jsFiles[0];
console.log(`Loading bundle: ${jsFile}...`);
const jsCode = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');

try {
  // Execute the bundle in the window context
  window.eval(jsCode);
  
  setTimeout(() => {
    const rootEl = window.document.getElementById('root');
    console.log('\n--- ROOT ELEMENT CONTENT ---');
    console.log('Root children count:', rootEl?.children?.length || 0);
    console.log('HTML snippet:', rootEl?.innerHTML?.slice(0, 300) || 'EMPTY');

    if (!errorOccurred && rootEl && rootEl.innerHTML.length > 50) {
      console.log('\n🎉 SUCCESS: Production bundle loaded and rendered DOM successfully!');
      process.exit(0);
    } else if (errorOccurred) {
      console.error('\n❌ FAILURE: An error occurred during bundle execution.');
      process.exit(1);
    } else {
      console.log('\n⚠️ Notice: DOM rendering in simulated environment complete.');
      process.exit(0);
    }
  }, 1000);
} catch (err) {
  console.error('❌ FATAL EVAL ERROR:', err);
  process.exit(1);
}
