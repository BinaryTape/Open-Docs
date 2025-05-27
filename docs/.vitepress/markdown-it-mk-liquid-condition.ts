// Process Material MKDocs Liquid condition
export default function markdownItMkLiquidCondition(md) {
  /**
   * Remove Liquid condition statements and their wrapped content
   * For example: {% if xxx %}xxx{% endif %} 
   */
  function removeLiquidConditions(state) {
    let currentSrc = state.src;
    
    // Match condition statements in {% if xxx %}xxx{% endif %} format
    // Including multi-line content and nested conditions
    const liquidConditionRegex = /{%\s*if\s+.*?%}[\s\S]*?{%\s*endif\s*%}/g;
    
    // Delete matched condition statements and their content
    currentSrc = currentSrc.replace(liquidConditionRegex, '');
    
    // Apply changes
    state.src = currentSrc;
  }

  // Process at the earliest stage by overriding the parse method
  const originalParse = md.parse;
  md.parse = function(src, env) {
    // Remove condition statements before parsing
    src = src.replace(/{%\s*if\s+.*?%}[\s\S]*?{%\s*endif\s*%}/g, '');
    
    // Call the original parse function
    return originalParse.call(this, src, env);
  };
  
  // Add the processor to the core ruler as an extra safeguard
  md.core.ruler.push('liquid_condition_remover', removeLiquidConditions);
}
