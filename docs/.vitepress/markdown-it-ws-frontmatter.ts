// Process Writerside flavored Frontmatter

export default function markdownItWsFrontmatter(md) {

  const originalRender = md.render.bind(md);
  const commentRegex = /^\[\/\/\]: # \(([^:]+):\s*(.*?)\)\s*$/;

  md.render = function(src: string, env?: any): any[] {
    const lines = src.split(/\r?\n/); // Split source into lines
    const frontmatterData = {};
    let linesConsumed = 0;
    let processingFrontmatter = true;

    // Skip initial empty lines
    while (linesConsumed < lines.length && lines[linesConsumed].trim() === '') {
      linesConsumed++;
    }

    // Process frontmatter comments
    while (processingFrontmatter && linesConsumed < lines.length) {
      const line = lines[linesConsumed];
      const match = line.match(commentRegex);

      if (match) {
        // Found a frontmatter comment
        const key = match[1].trim();
        const value = match[2].trim();
        if (key) {
          frontmatterData[key] = value;
        }
        linesConsumed++;
      } else if (line.trim() === '') {
        // Empty line after frontmatter
        linesConsumed++;
        processingFrontmatter = false;
      } else {
        // Non-empty, non-frontmatter line - stop processing
        processingFrontmatter = false;
      }
    }

    // If any frontmatter key-value pairs were extracted
    if (Object.keys(frontmatterData).length > 0) {
      let frontmatterString = '---\n';
      for (const key in frontmatterData) {
        // Proper string escaping for YAML format
        const escapedValue = frontmatterData[key].replace(/"/g, '\\"');
        frontmatterString += `${key}: "${escapedValue}"\n`;
      }
      frontmatterString += '---\n\n';

      // Reconstruct the source: frontmatter + rest of the document
      const remainingLines = lines.slice(linesConsumed);
      return originalRender(frontmatterString + remainingLines.join('\n'), env);
    }

    // No frontmatter found, process the original source
    return originalRender(src, env);
  };
}