import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

console.log('--- TESTING LUXE NIA THEME TOGGLE & PERSISTENCE ---');

const distDir = path.resolve('dist');
const htmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
const assetsDir = path.join(distDir, 'assets');
const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'));
const jsCode = fs.readFileSync(path.join(assetsDir, jsFiles[0]), 'utf-8');

async function runTest() {
  const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:5173/'
  });

  const { window } = dom;

  window.matchMedia = window.matchMedia || function() {
    return { matches: false, addListener: function() {}, removeListener: function() {} };
  };
  window.scrollTo = function() {};

  window.eval(jsCode);

  // Wait for React to mount
  await new Promise(r => setTimeout(r, 1200));

  const doc = window.document;
  const toggleBtn = doc.getElementById('header-theme-toggle');

  console.log('1. Checking Toggle Button in Header:');
  if (!toggleBtn) {
    console.error('❌ Toggle button #header-theme-toggle not found in DOM!');
    process.exit(1);
  }
  console.log('✅ Found theme toggle button in header!');
  console.log('Button innerHTML:', toggleBtn.innerHTML);
  console.log('Initial document data-theme:', doc.documentElement.getAttribute('data-theme'));
  console.log('Initial body classes:', doc.body.className);
  console.log('Initial localStorage theme:', window.localStorage.getItem('luxenia_customer_theme'));

  if (doc.documentElement.getAttribute('data-theme') !== 'dark') {
    console.error('❌ Expected initial theme to be dark, got:', doc.documentElement.getAttribute('data-theme'));
    process.exit(1);
  }
  if (!toggleBtn.innerHTML.includes('☀️')) {
    console.error('❌ Expected ☀️ icon in dark mode button!');
    process.exit(1);
  }
  console.log('✅ Default Dark Mode correctly rendered with ☀️ icon!');

  // 2. Click to toggle to Light Mode
  console.log('\n2. Testing click on #header-theme-toggle:');
  toggleBtn.click();
  await new Promise(r => setTimeout(r, 300));

  console.log('After click data-theme:', doc.documentElement.getAttribute('data-theme'));
  console.log('After click body classes:', doc.body.className);
  console.log('After click localStorage theme:', window.localStorage.getItem('luxenia_customer_theme'));
  console.log('After click button innerHTML:', toggleBtn.innerHTML);

  if (doc.documentElement.getAttribute('data-theme') !== 'light') {
    console.error('❌ Expected data-theme to be light after toggle!');
    process.exit(1);
  }
  if (!doc.body.classList.contains('light-mode')) {
    console.error('❌ Expected body to have light-mode class!');
    process.exit(1);
  }
  if (window.localStorage.getItem('luxenia_customer_theme') !== 'light') {
    console.error('❌ Expected localStorage to store "light"!');
    process.exit(1);
  }
  if (!toggleBtn.innerHTML.includes('🌙')) {
    console.error('❌ Expected 🌙 icon in light mode button!');
    process.exit(1);
  }
  console.log('✅ Switched instantly to Light Mode with 🌙 icon and localStorage saved!');

  // 3. Click again to toggle back to Dark Mode
  console.log('\n3. Testing click again to return to Dark Mode:');
  toggleBtn.click();
  await new Promise(r => setTimeout(r, 300));

  console.log('After 2nd click data-theme:', doc.documentElement.getAttribute('data-theme'));
  console.log('After 2nd click body classes:', doc.body.className);
  console.log('After 2nd click localStorage theme:', window.localStorage.getItem('luxenia_customer_theme'));
  console.log('After 2nd click button innerHTML:', toggleBtn.innerHTML);

  if (doc.documentElement.getAttribute('data-theme') !== 'dark') {
    console.error('❌ Expected data-theme to be dark after 2nd toggle!');
    process.exit(1);
  }
  if (window.localStorage.getItem('luxenia_customer_theme') !== 'dark') {
    console.error('❌ Expected localStorage to store "dark"!');
    process.exit(1);
  }
  if (!toggleBtn.innerHTML.includes('☀️')) {
    console.error('❌ Expected ☀️ icon in dark mode button!');
    process.exit(1);
  }
  console.log('✅ Switched instantly back to Dark Mode with ☀️ icon!');

  // 4. Test Persistence on Page Load
  console.log('\n4. Testing localStorage persistence across fresh page load:');
  const dom2 = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:5173/'
  });
  dom2.window.localStorage.setItem('luxenia_customer_theme', 'light');
  dom2.window.matchMedia = function() { return { matches: false, addListener: () => {}, removeListener: () => {} }; };
  dom2.window.scrollTo = function() {};
  dom2.window.eval(jsCode);

  await new Promise(r => setTimeout(r, 1200));

  const doc2 = dom2.window.document;
  console.log('Persisted load data-theme:', doc2.documentElement.getAttribute('data-theme'));
  console.log('Persisted load body classes:', doc2.body.className);
  const toggleBtn2 = doc2.getElementById('header-theme-toggle');
  console.log('Persisted load button innerHTML:', toggleBtn2?.innerHTML);

  if (doc2.documentElement.getAttribute('data-theme') !== 'light') {
    console.error('❌ Expected restored theme to be light from localStorage!');
    process.exit(1);
  }
  if (!doc2.body.classList.contains('light-mode')) {
    console.error('❌ Expected body to have light-mode class on restored load!');
    process.exit(1);
  }
  if (!toggleBtn2?.innerHTML.includes('🌙')) {
    console.error('❌ Expected 🌙 icon when loaded with light mode preference!');
    process.exit(1);
  }
  console.log('✅ Customer preference successfully persisted from localStorage on page refresh!');

  // 5. Test Admin Login Page Theme Toggle
  console.log('\n5. Testing Admin Login Page Theme Toggle:');
  const domAdmin = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:5173/admin-login'
  });
  domAdmin.window.matchMedia = function() { return { matches: false, addListener: () => {}, removeListener: () => {} }; };
  domAdmin.window.scrollTo = function() {};
  domAdmin.window.eval(jsCode);

  await new Promise(r => setTimeout(r, 1200));
  const adminDoc = domAdmin.window.document;
  const adminLoginToggleBtn = adminDoc.getElementById('admin-login-theme-toggle');

  if (!adminLoginToggleBtn) {
    console.error('❌ Admin login theme toggle button #admin-login-theme-toggle not found!');
    process.exit(1);
  }
  console.log('✅ Found admin login theme toggle button!');
  console.log('Initial admin login button innerHTML:', adminLoginToggleBtn.innerHTML);

  adminLoginToggleBtn.click();
  await new Promise(r => setTimeout(r, 300));
  console.log('After admin login click data-theme:', adminDoc.documentElement.getAttribute('data-theme'));
  console.log('After admin login click localStorage:', domAdmin.window.localStorage.getItem('luxenia_customer_theme'));
  console.log('After admin login click button innerHTML:', adminLoginToggleBtn.innerHTML);

  if (adminDoc.documentElement.getAttribute('data-theme') !== 'light') {
    console.error('❌ Expected admin page to switch to light theme!');
    process.exit(1);
  }
  console.log('✅ Admin login theme toggle switched to Light Mode successfully!');

  console.log('\n🎉 ALL STOREFRONT & ADMIN THEME TOGGLE TESTS PASSED PERFECTLY!');
  process.exit(0);
}

runTest().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

