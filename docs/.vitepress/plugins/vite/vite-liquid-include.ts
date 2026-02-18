// Vite plugin to process Liquid includes before markdown-it processing
import { Plugin } from 'vite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

export default function liquidIncludePlugin(): Plugin {
  return {
    name: 'vite-plugin-liquid-include',
    enforce: 'pre',
    // Transform hook runs before any other processing
    transform(code, id) {
      // Only process markdown files
      if (!id.endsWith('.md')) {
        return null;
      }

      // Process includes recursively
      return processIncludes(code, id);
    }
  };
}

/**
 * Process includes recursively
 * @param {string} content - The content to process
 * @param {string} currentFilePath - The path of the current file being processed
 * @returns {string} - The processed content with all includes replaced
 */
function processIncludes(content: string, currentFilePath: string): string {
  // Use regular expression to find {% include '...' %} format
  // Handle both single and double quotes cases
  const includeRegex = /{%\s*include\s+['"]([^'"]+)['"]\s*%}/g;

  // Replace all includes in the content
  return content.replace(includeRegex, (match, includePath) => {
    // Convert to VitePress include syntax
    const vitepressInclude = `<!--@include: ../${includePath}-->`;
    // If we want to also process the included file for nested includes
    try {
      // Resolve the path of the included file relative to the current file
      const baseDir = currentFilePath ? dirname(currentFilePath) : process.cwd();
      const fullPath = resolve(baseDir, '..', includePath);

      // Check if the file exists
      if (existsSync(fullPath)) {
        // Read the included file
        const includedContent = readFileSync(fullPath, 'utf-8');

        // Process the included content for nested includes
        const processedContent = processIncludes(includedContent, fullPath);

        // If the included content has includes, process them and return the result
        // Otherwise, return the VitePress include syntax
        if (includeRegex.test(includedContent)) {
          return processedContent;
        }
      }
    } catch (error) {
      console.error(`Error processing include ${includePath}:`, error);
    }

    // Return the VitePress include syntax
    return vitepressInclude;
  });
}