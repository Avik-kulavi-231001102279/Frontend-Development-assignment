const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'node_modules', 'rollup', 'dist', 'native.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  if (!content.includes('@rollup/wasm-node/dist/native.js')) {
    content = content.replace(
      /const requireWithFriendlyError = id => \{[\s\S]*?try \{[\s\S]*?return require\(id\);[\s\S]*?\} catch \(error\) \{/,
      `const requireWithFriendlyError = id => {
\ttry {
\t\treturn require(id);
\t} catch (error) {
\t\ttry {
\t\t\treturn require('@rollup/wasm-node/dist/native.js');
\t\t} catch (wasmErr) {}`
    );
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('Successfully patched Rollup to support wasm fallback on Windows AppLocker environments.');
  }
}

