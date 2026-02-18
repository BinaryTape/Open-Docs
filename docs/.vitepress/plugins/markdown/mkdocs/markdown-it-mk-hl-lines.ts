// Process Material MKDocs flavored code highlight
export default function markdownItMkHlLines(md) {
  // Cache the original fence renderer
  const originalFenceRenderer = md.renderer.rules.fence;

  // Replace fence rules
  md.renderer.rules.fence = function(tokens, idx, options, env, slf) {
    const token = tokens[idx];
    const info = token.info;
    
    // Check if the info string contains the hl_lines="X" format
    const hlLinesMatch = info.match(/hl_lines="([^"]+)"/);
    
    if (hlLinesMatch) {
      // Extract the highlighted lines list
      const hlLines = hlLinesMatch[1];
      
      // Remove the hl_lines="X" part from the info string
      const newInfo = info.replace(/\s*hl_lines="[^"]+"\s*/, ' ');
      
      // Add the {X} format highlight marker
      token.info = newInfo.trim() + ' {' + hlLines + '}';
    }
    
    // Call the original renderer
    return originalFenceRenderer(tokens, idx, options, env, slf);
  };
  
  // Process source code with the ```lang hl_lines="X" format
  function processSourceCode(state) {
    let currentSrc = state.src;
    
    // Use regex to find the ```lang hl_lines="X" format
    const codeBlockRegex = /```(\w+)\s+hl_lines="([^"]+)"/g;
    
    // Replace with ```lang {X} format
    currentSrc = currentSrc.replace(codeBlockRegex, '```$1 {$2}');

    state.src = currentSrc;
  }

  // Add the processor to the core ruler
  md.core.ruler.before('block', 'hl_lines_replacer', processSourceCode);
}
