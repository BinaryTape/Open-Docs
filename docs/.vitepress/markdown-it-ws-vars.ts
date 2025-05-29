import fs from 'node:fs';
import path from 'node:path';

export default function markdownItWsVars(md, options = {}) {
  let xmlVarsString = ''; // Initialize with an empty string, no default XML

  // Try to read from file if xmlFilePath is provided
  if (options.xmlFilePath) {
    try {
      const resolvedPath = path.resolve(options.xmlFilePath); // Resolve to absolute path
      if (fs.existsSync(resolvedPath)) {
        xmlVarsString = fs.readFileSync(resolvedPath, 'utf-8');
        console.log(`Successfully read variables from: ${resolvedPath}`);
      } else {
        console.warn(`XML variable file not found at: ${resolvedPath}. No variables will be loaded unless a defaultXmlVarsString was provided.`);
      }
    } catch (error) {
      console.error(`Error reading XML variable file from ${options.xmlFilePath}:`, error);
      console.warn('No variables will be loaded from file unless a defaultXmlVarsString was provided.');
    }
  }

  const variables = {};
  // Simple regex to parse <var name="..." value="..."/> tags from the XML string.
  // This will only proceed if xmlVarsString has content.
  if (xmlVarsString) {
    const varRegex = /<var\s+name="(?<name>[^"]+)"\s+value="(?<value>[^"]+)"[^>]*>/gi;
    let match;
    while ((match = varRegex.exec(xmlVarsString)) !== null) {
      if (match.groups) {
        variables[match.groups.name] = match.groups.value;
      }
    }
  }

  /**
   * Core rule function to perform global variable substitution on state.src.
   * @param {any} state The Markdown-it state object.
   */
  function substituteGlobalVariables(state) {
    if (Object.keys(variables).length > 0) { // Only substitute if variables were loaded
      let currentSrc = state.src;
      for (const varName in variables) {
        // Ensure placeholder is properly escaped for use in a RegExp
        // and use 'g' flag for global replacement.
        const placeholder = `%${varName}%`;
        const placeholderRegex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        currentSrc = currentSrc.replace(placeholderRegex, variables[varName]);
      }
      state.src = currentSrc; // Update the source string
    }
  }

  // Add the rule to the core ruler.
  // This runs before block tokenization, modifying the raw source string.
  md.core.ruler.before('block', 'global_variable_replacer', substituteGlobalVariables);
}