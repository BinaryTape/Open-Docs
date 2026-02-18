import fs from 'node:fs';
import path from 'node:path';

// Process Material MKDocs Liquid variable
export default function markdownItMKVars(md) {
  let jsonData = {};

  // Try to read data from file
    try {
      const resolvedPath = path.resolve("docs/.vitepress/variables/sqldelightVer.json");
      if (fs.existsSync(resolvedPath)) {
        const jsonContent = fs.readFileSync(resolvedPath, 'utf-8');
        jsonData = JSON.parse(jsonContent);
      } else {
        console.warn(`JSON variable file not found at ${resolvedPath}. Unable to load variables.`);
      }
    } catch (error) {
      console.error(`Error reading JSON variable file from docs/.vitepress/variables/sqldelightVer.json:`, error);
      console.warn('Unable to load variables from file.');
    }

  /**
   * Core rule function that performs global variable substitution on state.src
   * @param {any} state Markdown-it state object
   */
  function substituteJsonVariables(state) {
    let currentSrc = state.src;
    
    // Use regular expression to find {{ versions.xxx }} pattern
    const placeholderRegex = /\{\{\s*versions\.([a-zA-Z0-9_]+)\s*\}\}/g;
    
    currentSrc = currentSrc.replace(placeholderRegex, (match, varName) => {
      // Check if versions object exists and contains the requested variable
      if (jsonData.versions && jsonData.versions[varName] !== undefined) {
        return jsonData.versions[varName];
      }
      // If variable not found, keep the original placeholder
      return match;
    });
    
    state.src = currentSrc; // Update source string
  }

  // Add rule to the core ruler
  // Run before block tokenization, modifying the original source string
  md.core.ruler.before('block', 'json_variable_replacer', substituteJsonVariables);
}
