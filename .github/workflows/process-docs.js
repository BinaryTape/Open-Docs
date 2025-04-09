const fs = require('fs');
const path = require('path');

// Get file list from environment variables
const repoPath = process.env.REPO_PATH || 'kotlin-repo';
const changedFiles = process.env.KOTLIN_CHANGED_FILES ? process.env.KOTLIN_CHANGED_FILES.split(' ') : [];
const files = changedFiles.map(file => path.join(repoPath, file));
const varsFilePath = 'kotlin-repo/docs/v.list';

if (files.length > 0) {
    console.log(`Starting to process ${files.length} files...`);
    processFiles(files, varsFilePath);
} else {
    console.log('No files detected for processing');
}

// Process file list
function processFiles(files, varsFilePath) {
    let processed = 0;

    files.forEach(file => {
        if (!file || !file.trim()) return;

        try {
            // Directly process original file
            processFile(file, varsFilePath);
            processed++;
        } catch (error) {
            console.error(`Error processing file ${file}: ${error.message}`);
        }
    });

    console.log(`Processing complete! Processed ${processed} files`);
}

// Process a single file
function processFile(filePath, varsFilePath) {
    console.log(`Processing: ${filePath}`);

    // Ensure file exists
    if (!fs.existsSync(filePath)) {
        console.error(`File does not exist: ${filePath}`);
        return;
    }

    // Read input file
    const content = fs.readFileSync(filePath, 'utf8');

    // First process HTML comments, protecting them from being modified by other transformations
    let transformedContent = protectHtmlComments(content);

    // Apply all transformations
    transformedContent = convertFrontmatter(transformedContent, filePath); // Step 1
    transformedContent = convertAdmonitions(transformedContent); // Step 2
    transformedContent = convertDeflistToList(transformedContent); // Step 5
    transformedContent = convertIncludes(transformedContent); // Step 6 - Process include and snippet tags
    transformedContent = convertTabs(transformedContent); // Step 7
    transformedContent = removeKotlinRunnable(transformedContent); // Step 8
    transformedContent = formatHtmlTags(transformedContent); // Step 9
    transformedContent = convertImages(transformedContent); // Step 3 - Image processing
    transformedContent = convertVideos(transformedContent); // Step 4 - Video processing

    // Finally, clean up content that might cause MDX compilation errors
    transformedContent = sanitizeMdxContent(transformedContent);

    // Restore protected HTML comments
    transformedContent = restoreHtmlComments(transformedContent);

    // If a variables file was provided, apply variable replacements
    if (varsFilePath && fs.existsSync(varsFilePath)) {
        transformedContent = replaceVariables(transformedContent, varsFilePath); // Step 10
    }

    // Write directly back to original file
    fs.writeFileSync(filePath, transformedContent, 'utf8');
    console.log(`Processed file: ${filePath}`);
}

// Step 1: Convert Frontmatter
function convertFrontmatter(content, inputFile) {
    // Extract title from comments - using more precise pattern matching
    // This regex uses non-greedy mode and avoids early termination within parentheses
    const titleMatch = content.match(/\[\/\/\]: # \(title: ([\s\S]*?)\)(?:\n|$)/);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(inputFile, path.extname(inputFile));

    // Extract description from comments - using more precise pattern matching
    const descriptionMatch = content.match(/\[\/\/\]: # \(description: ([\s\S]*?)\)(?:\n|$)/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    // Process escape characters in title
    let processedTitle = title;
    if (processedTitle) {
        // Parse escape sequences, like \( to (, \) to ), \" to " etc.
        processedTitle = processedTitle.replace(/\\(.)/g, '$1');

        console.log(`Processing title: "${title}" -> "${processedTitle}"`);
    }

    // Remove original title comments - using more precise pattern matching
    let newContent = content.replace(/\[\/\/\]: # \(title: [\s\S]*?\)(?:\n|$)/, '');

    // Remove original description comments - using more precise pattern matching
    newContent = newContent.replace(/\[\/\/\]: # \(description: [\s\S]*?\)(?:\n|$)/, '');

    // Check if title contains special characters (colon, comma, question mark, etc.)
    const hasSpecialChars = /[:!?#,[\]{}|><%@()]/.test(processedTitle);
    // Format title, if it contains special characters, wrap it in double quotes
    const formattedTitle = hasSpecialChars ? `"${processedTitle}"` : processedTitle;

    // Get START_PAGE environment variable, default to getting-started.md
    const startPage = process.env.START_PAGE || 'getting-started.md';

    // Check if current file is START_PAGE
    const isStartPage = inputFile.endsWith(startPage);

    // Add Docusaurus frontmatter, including description (if any)
    if (isStartPage) {
        console.log(`Adding slug: / property for start page ${inputFile}`);
        let frontmatter = `---\ntitle: ${formattedTitle}\nslug: /\n`;
        if (description) {
            frontmatter += `description: ${description}\n`;
        }
        frontmatter += `---\n\n`;
        newContent = frontmatter + newContent;
    } else {
        let frontmatter = `---\ntitle: ${formattedTitle}\n`;
        if (description) {
            frontmatter += `description: ${description}\n`;
        }
        frontmatter += `---\n\n`;
        newContent = frontmatter + newContent;
    }

    return newContent;
}

// Create a shared function to handle ">" symbols in all admonition content
function cleanMarkdownReferences(content) {
    let cleanedContent = content;

    // Use more precise methods to replace Markdown reference symbols
    // 1. Single ">" on a line
    cleanedContent = cleanedContent.replace(/^>$/gm, '');

    // 2. "> " (with space) at the beginning of a line
    cleanedContent = cleanedContent.replace(/^> /gm, '');

    // 3. ">" (without space) at the beginning of a line
    cleanedContent = cleanedContent.replace(/^>/gm, '');

    // 4. "\n> " in the middle of a line
    cleanedContent = cleanedContent.replace(/\n> /g, '\n');

    // 5. "\n>" in the middle of a line
    cleanedContent = cleanedContent.replace(/\n>/g, '\n');

    // 6. Indented spaces followed by ">" at the beginning of a line
    cleanedContent = cleanedContent.replace(/^(\s+)>/gm, '$1');

    // 7. Indented spaces followed by "> " at the beginning of a line
    cleanedContent = cleanedContent.replace(/^(\s+)> /gm, '$1');

    // 8. Handle newline followed by indented spaces then ">"
    cleanedContent = cleanedContent.replace(/\n(\s+)>/g, '\n$1');

    // 9. Handle newline followed by indented spaces then "> "
    cleanedContent = cleanedContent.replace(/\n(\s+)> /g, '\n$1');

    return cleanedContent;
}

// Step 2: Convert Admonitions
function convertAdmonitions(content) {
    // Use new more efficient processing function to replace original complex logic
    let newContent = convertAllAdmonitions(content);

    // Convert tldr to info
    newContent = newContent.replace(
        /<tldr>([\s\S]*?)<\/tldr>/g,
        ':::info\n$1\n:::'
    );

    // Convert primary-label
    newContent = newContent.replace(/<primary-label ref="[^"]*"\/>/g, '');

    // Remove remaining {style="xxx"} markers in the document
    newContent = newContent.replace(/\{style="[^"]*"\s*\}/g, '');

    // Handle ">" symbols in admonition content
    // Identify all admonition blocks and clean internal formatting
    newContent = newContent.replace(
        /:::(tip|caution|note|info|warning)([\s\S]*?):::/g,
        (match, type, content) => {
            // Use shared function to clean content
            const cleanedContent = cleanMarkdownReferences(content);
            return `:::${type}${cleanedContent}:::`;
        }
    );

    // Fix incorrectly identified admonition markers
    newContent = fixIncorrectAdmonitionTags(newContent);

    return newContent;
}

// Fix incorrectly identified admonition markers
function fixIncorrectAdmonitionTags(content) {
    // Fix patterns like "/:::note", "-:::tip", "</:::caution"
    // Look for patterns like letter or symbol+::: and add space between to prevent misidentification
    return content.replace(
        /([^\s:])(:::(tip|caution|note|info|warning))/g,
        '$1 $2'
    );
}

// More comprehensive admonition conversion function - efficiently handles different types of admonitions
function convertAllAdmonitions(content) {
    const admonitionTypes = {
        "note": "note",
        "tip": "tip",
        "warning": "caution",
        "info": "info"
    };

    let result = content;

    // 1. First process standard {style="xxx"} admonitions
    for (const [styleType, docusaurusType] of Object.entries(admonitionTypes)) {
        // Handle patterns like > content {style="note"}
        const stylePattern = new RegExp(
            `((?:^|\\n)>([\\s\\S]*?))\\n\\{style="${styleType}"\\}`,
            'gm'
        );

        result = result.replace(stylePattern, (match, blockContent) => {
            // Clean > symbols
            const cleanedContent = blockContent
                .split('\n')
                .map(line => line.replace(/^>\s?/, ''))
                .join('\n');

            return `:::${docusaurusType}\n${cleanedContent.trim()}\n:::`;
        });

        // Handle multiline patterns like > content\n> \n> {style="note"}
        const longStylePattern = new RegExp(
            `> ([\\s\\S]*?)\\n> \\n> \\{style="${styleType}"\\}`,
            'g'
        );

        result = result.replace(longStylePattern, (match, content) => {
            const cleanedContent = cleanMarkdownReferences(content);
            return `:::${docusaurusType}\n${cleanedContent}\n:::`;
        });
    }

    // 2. Process admonitions with type attribute
    result = result.replace(
        />([\s\S]*?)(?:\n|$)(?:\n\{\s*type\s*=?\s*["'](\w+)["']\s*\})/g,
        (match, content, type) => {
            // Determine admonition type
            let admonitionType = 'note'; // Default type
            if (type) {
                switch (type.toLowerCase()) {
                    case 'tip':
                        admonitionType = 'tip';
                        break;
                    case 'warning':
                        admonitionType = 'caution';
                        break;
                    case 'note':
                        admonitionType = 'note';
                        break;
                    case 'info':
                        admonitionType = 'info';
                        break;
                }
            }

            // Clean content
            const cleanedContent = cleanMarkdownReferences(content);
            return `:::${admonitionType}\n${cleanedContent}\n:::`;
        }
    );

    return result;
}

// Step 6: Format HTML Tags
function formatHtmlTags(content) {
    let result = content;

    // Remove non-standard style attributes from all elements
    result = result.replace(
        /<([a-z]+)([^>]*?)style="[^"]*?"([^>]*?)>/g,
        '<$1$2$3>'
    );

    // Remove non-standard style attributes (unquoted) from all elements
    result = result.replace(
        /<([a-z]+)([^>]*?)style=[^"\s>]*([^>]*?)>/g,
        '<$1$2$3>'
    );

    // Ensure <p> is followed by a newline
    result = result.replace(/<p>\s*/g, '<p>\n   ');

    // Ensure </p> is preceded by a newline
    result = result.replace(/\s*<\/p>/g, '\n   </p>');

    // Only remove indent spaces before tags, keep newlines
    // Handle <ul> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<ul>/gm, '<ul>');

    // Handle <td> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<td([^>]*)>/gm, '<td$2>\n');

    // Handle </td> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<\/td>/gm, '</td>');

    // Handle </td> tags at the end of a line, add newline before
    result = result.replace(/([^\s])<\/td>/g, "$1\n</td>");

    // Handle <tr> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<tr([^>]*)>/gm, '<tr$2>');

    // Handle </tr> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<\/tr>/gm, '</tr>');

    // Handle <table> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<table([^>]*)>/gm, '<table$2>');

    // Handle </table> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<\/table>/gm, '</table>');

    // Handle </p> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<\/p>/gm, '</p>');

    // Handle <list> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<list>/gm, '<list>');

    // Handle <list type> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<list type/gm, '<list type');

    // Handle </list> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<\/list>/gm, '</list>');

    // Handle <li> tags at the beginning of a line, remove indent spaces
    result = result.replace(/^(\s+)<li>/gm, '<li>');

    return result;
}

// Step 3: Convert Image Tags
function convertImages(content) {
    // Fix incorrect image tag closing symbols
    let newContent = content.replace(
        /<img([^>]*?)\/\/>/g,
        '<img$1/>'
    );

    // Step 1: Convert Markdown format images to HTML format, special handling for attributes in curly braces
    newContent = newContent.replace(
            /!\[(.*?)\]\((.*?)\)(\{.*?\})?/g,
            (match, alt, src, attrs) => {
                // Build basic image tag
                let imgTag = `<img src="${src.startsWith('http') ? src : `/img/${src}`}" alt="${alt}"`;
            
                // Parse possible attributes
                if (attrs) {
                    // Handle width attribute
                    const widthMatch = attrs.match(/width=["']?(\d+)["']?/);
                    if (widthMatch && widthMatch[1]) {
                        imgTag += ` width="${widthMatch[1]}"`;
                    }
                }
                
                // Add default style and closing tag
                imgTag += ` style={{verticalAlign: 'middle'}}/>`;
                
                return imgTag;
            }
    );
    
    // Step 2: Process curly brace attributes after HTML image tags - handle format like width="350"
    newContent = newContent.replace(
        /(<img[^>]*?)(\/?>)\s*\{([^{}]*?)width=["']?(\d+)["']?([^{}]*?)\}/g,
        (match, imgTag, closing, attrsBefore, width, attrsAfter) => {
            // Check if the image tag already has a width attribute
            if (imgTag.includes('width=')) {
                return `${imgTag}${closing}`;
            } else {
                return `${imgTag} width="${width}"${closing}`;
            }
        }
    );
    
    // Step 3: Process curly brace attributes after HTML image tags - handle format like width=350
    newContent = newContent.replace(
        /(<img[^>]*?)(\/?>)\s*\{([^{}]*?)width=(\d+)([^{}]*?)\}/g,
        (match, imgTag, closing, attrsBefore, width, attrsAfter) => {
            // Check if the image tag already has a width attribute
            if (imgTag.includes('width=')) {
                return `${imgTag}${closing}`;
            } else {
                return `${imgTag} width="${width}"${closing}`;
            }
        }
    );
    
    // Step 4: Remove all remaining curly braces after image tags
    newContent = newContent.replace(
        /(<img[^>]*?\/?>)\s*\{[^{}]*?\}/g,
        '$1'
    );
    
    // Step 5: Ensure all image tags are properly closed
    newContent = newContent.replace(
        /<img([^>]*?)>(?!\s*\/)/g,
        '<img$1/>'
    );
    
    // Step 6: Fix double slash closing issue - special handling for possible extra slashes
    newContent = newContent.replace(
        /<img([^>]*?)\/{2,}>/g,
        '<img$1/>'
    );
    
    // Handle existing HTML image tags but missing /img/ prefix
    newContent = newContent.replace(
        /<img([^>]*?)src=["']([^"'\/][^"':]*?\.(svg|png|jpg|jpeg|gif))["']([^>]*?)(?:\/>|>)/g,
        (match, beforeSrc, src, ext, afterSrc, closing) => {
            // If the image is an http or https link, or already has /img/ prefix, don't modify
            if (src.startsWith('http') || src.startsWith('/img/')) {
                return match;
            }
            // Otherwise add /img/ prefix, keep original closing format
            return match.replace(`src="${src}"`, `src="/img/${src}"`);
        }
    );

    // Check and fix broken image tags
    newContent = newContent.replace(
        /<img([^>]*?)src=["']([^"']*)["']([^>]*?)(\d+\s*<)/g,
        (match, beforeSrc, src, afterSrc, corrupted) => {
            // Extract incorrectly inserted number
            const fixedTag = `<img${beforeSrc}src="${src}"${afterSrc}/>`;
            // Separate incorrectly merged tag
            const nextTag = `<${corrupted.substring(corrupted.indexOf('<')+1)}`;
            return fixedTag + ' ' + nextTag;
        }
    );

    return newContent;
}

// Step 4: Convert Video Tags
function convertVideos(content) {
    let newContent = content;

    // Fix incorrect src paths in video tags (remove /img/ prefix from http links)
    newContent = newContent.replace(
        /<video([^>]*?)src="\/img\/(https?:\/\/[^"]+)"([^>]*?)>/g,
        '<video$1src="$2"$3>'
    );

    // Fix incorrect src paths in self-closing video tags
    newContent = newContent.replace(
        /<video([^>]*?)src="\/img\/(https?:\/\/[^"]+)"([^>]*?)\/>/g,
        '<video$1src="$2"$3/>'
    );

    // Special handling for ::: markers after video tags, add space between tag and :::
    newContent = newContent.replace(
        /(<\/video>|<video[^>]*?\/>)(:::(tip|caution|note|info|warning))/g,
        '$1 $2'
    );

    return newContent;
}

// Step 7: Convert Tabs Component
function convertTabs(content) {
    // Check if file contains tabs tags (case insensitive)
    if (content.match(/<tabs|<tab |<Tabs|<Tab /i)) {
        // Determine if frontmatter already exists
        const hasFrontmatter = content.startsWith('---\n');

        if (hasFrontmatter) {
            // If frontmatter exists, insert import statements after frontmatter
            const frontmatterEnd = content.indexOf('---', 3) + 3;
            const beforeFrontmatter = content.substring(0, frontmatterEnd);
            const afterFrontmatter = content.substring(frontmatterEnd);
            content =
                beforeFrontmatter +
                "\n\nimport Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';\n\n" +
                afterFrontmatter;
        } else {
            // If no frontmatter exists, add to beginning (this shouldn't happen as we already added frontmatter)
            content = `import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';\n\n${content}`;
        }

        // Convert various formats of tabs and tab tags

        // Convert <tabs> tags (lowercase) - with group attribute
        content = content.replace(/<tabs\s+group\s*=\s*["']([^"']*)["']\s*>/g, '<Tabs groupId="$1">');
        
        // Convert <tabs> tags (lowercase) - without attributes
        content = content.replace(/<tabs>/g, '<Tabs>');
        content = content.replace(/<\/tabs>/g, '</Tabs>');

        // Convert already capitalized <Tabs> tags but possibly with group attribute
        content = content.replace(/<Tabs\s+group\s*=\s*["']([^"']*)["']\s*>/g, '<Tabs groupId="$1">');

        // Convert <tab> tags (lowercase) - with id, title and group-key attributes
        content = content.replace(
            /<tab\s+id\s*=\s*["']([^"']*)["']\s+title\s*=\s*["']([^"']*)["']\s+group-key\s*=\s*["']([^"']*)["']\s*>/g,
            '<TabItem value="$1" label="$2" default>'
        );

        // Convert <tab> tags (lowercase) - with title and group-key attributes
        content = content.replace(
            /<tab\s+title\s*=\s*["']([^"']*)["']\s+group-key\s*=\s*["']([^"']*)["']\s*>/g,
            '<TabItem value="$2" label="$1" default>'
        );

        // Convert <tab> tags (lowercase) - with id and title
        content = content.replace(
            /<tab\s+id\s*=\s*["']([^"']*)["']\s+title\s*=\s*["']([^"']*)["']\s*>/g,
            '<TabItem value="$1" label="$2">'
        );

        // Convert simple <tab> tags (lowercase) - with only title
        content = content.replace(
            /<tab\s+title\s*=\s*["']([^"']*)["']\s*>/g,
            '<TabItem value="$1" label="$1">'
        );

        // Convert all </tab> closing tags
        content = content.replace(/<\/tab>/g, '</TabItem>');

        // Remove Tabs tags in blockquotes
        content = content.replace(/\n>\s*<Tabs>/gm, '');
        content = content.replace(/\n>\s*<\/Tabs>/gm, '');
    }

    return content;
}

// Step 8: Remove kotlin-runnable related markers and other special attribute markers
function removeKotlinRunnable(content) {
    let result = content;

    // Match all possible Kotlin code block marker combinations
    // This regex can match attributes in any order, as long as the curly braces contain kotlin-runnable or validate attributes
    result = result.replace(/\{(?:[a-zA-Z-]+="[^"]*"(?:\s+|))+\}/g, (match) => {
        // Check if it's a Kotlin-related marker
        if (match.includes('kotlin-runnable') ||
            match.includes('kotlin-min-compiler-version') ||
            match.includes('validate=')) {
            return ''; // Remove the entire marker
        }
        // Check if it's a collapsible-related marker
        if (match.includes('initial-collapse-state=') && 
            match.includes('collapsible=')) {
            return ''; // Remove the entire marker
        }
        return match; // Keep non-related markers unchanged
    });

    // Remove CSS class curly braces after Markdown links, e.g., {:.typo-float-right.kto-button.kto-button_size_m.kto-button_mode_outline}
    result = result.replace(/\]\([^)]+\)\{:[.a-zA-Z0-9_-]+\}/g, (match) => {
        // Extract link part, remove CSS class curly braces
        return match.replace(/\{:[.a-zA-Z0-9_-]+\}/, '');
    });

    // Remove collapsible markers on a line by themselves
    result = result.replace(/^\{initial-collapse-state="[^"]*"\s+collapsible="[^"]*"\}\s*$/gm, '');

    // Remove {kotlin-runnable...} markers on a line by themselves
    result = result.replace(/^\{kotlin-runnable.*?\}\s*$/gm, '');

    // Remove {kotlin-...} similar markers on a line by themselves (more generic handling)
    result = result.replace(/^\{kotlin-.*?\}\s*$/gm, '');

    // Remove inline kotlin markers
    result = result.replace(/\{kotlin-[^{}]*\}/g, '');

    // Remove //sampleStart and //sampleEnd comments in Kotlin code examples
    result = result.replace(/^\s*\/\/sampleStart\s*$/gm, '');
    result = result.replace(/^\s*\/\/sampleEnd\s*$/gm, '');

    return result;
}

// Step 9: Handle variable replacements
function replaceVariables(content, varsFilePath) {
    // If no variable file path is provided, return original content
    if (!varsFilePath) {
        return content;
    }

    try {
        // Read variables file
        const varsContent = fs.readFileSync(varsFilePath, 'utf8');
        const variables = {};

        // Extract variable definitions
        const varRegex = /<var name="([^"]+)" value="([^"]+)"/g;
        let match;

        while ((match = varRegex.exec(varsContent)) !== null) {
            const [, name, value] = match;
            variables[name] = value;
        }

        // Replace variable placeholders in content
        let result = content;

        // Find all %varName% format placeholders
        const placeholderRegex = /%([^%]+)%/g;
        result = result.replace(placeholderRegex, (match, varName) => {
            // If variable is found, replace with its value; otherwise keep original
            return variables[varName] || match;
        });

        return result;
    } catch (error) {
        console.error(`Error processing variable replacements: ${error.message}`);
        return content; // Return original content on error
    }
}
// convertDeflistToList
// Step 10: Convert deflist to standard lists
function convertDeflistToList(htmlContent) {
  // Remove deflist start and end tags
  let result = htmlContent.replace(/<deflist.*?>/g, '');
  result = result.replace(/<\/deflist>/g, '');
  
  // Convert def tag title attribute content to h3 headings, keep content within def
  result = result.replace(/<def title="(.*?)".*?>([\s\S]*?)<\/def>/g, (match, title, content) => {
    return `<h3>${title}</h3>${content}`;
  });
  
  // Handle <h3> tags at line beginnings, remove indent spaces
  result = result.replace(/^(\s+)<h3([^>]*)>/gm, '<h3$2>');

  result = result.replace(/^(\s+)<p([^>]*)>/gm, '<p$2>');
  // Handle </p> tags at line beginnings, remove indent spaces
  result = result.replace(/^(\s+)<\/p>/gm, '</p>');

  return result;
}

// Step 11: Handle include and snippet tags
function convertIncludes(content) {
    let result = content;

    // Step 1: Process snippet tags, keep content but remove tags
    result = result.replace(
        /<snippet\s+id="([^"]+)">([\s\S]*?)<\/snippet>/g,
        (match, id, snippetContent) => {
            // Keep snippet content but mark start and end with comments for future reference
            return `{/* START_SNIPPET: ${id} */}\n${snippetContent}\n{/* END_SNIPPET: ${id} */}`;
        }
    );

    // Step 2: Process include tags, keep content, remove tags
    result = result.replace(
        /<include\s+element-id="([^"]+)"(?:\s+use-filter="([^"]+)")?\s+from="([^"]+)"\/>/g,
        (match, elementId, useFilter, fromFile) => {
            // In Docusaurus, we don't perform actual includes, but add a comment indicating there was an include
            return `{/* Note: This is an included content from ${fromFile}, element ${elementId}, with filters: ${useFilter || 'none'} */}`;
        }
    );

    // Step 3: Process commented-out include tags
    result = result.replace(
        /<!--\s*<include(?:[^>]*)>\s*-->/g,
        '{/* Commented out include tag */}'
    );

    return result;
}

// Add a post-processing function to handle various error conditions after all conversions
function sanitizeMdxContent(content) {
    let result = content;

    // First protect React components from being modified by other rules
    result = protectReactComponents(result);

    // Remove document ID markers, e.g., {id="get-length-of-null-java"}
    result = result.replace(/\{id="[^"]*"\}/g, '');

    // Replace <code> tags with backticks
    result = result.replace(/<code>(.*?)<\/code>/g, '`$1`');
    
    // Remove document nullable markers, e.g., {nullable="true"}
    result = result.replace(/\{nullable="[^"]*"\}/g, '');

    // Handle "<" symbol followed by numbers, e.g., <1.3: replace with &lt;1.3:
    result = result.replace(
        /([^\w`]|^)<(\d+(?:\.\d+)*)/g,
        (match, prefix, version) => {
            // Skip content already in code blocks
            if (prefix.includes('`') || prefix.includes('code')) {
                return match;
            }
            return `${prefix}&lt;${version}`;
        }
    );
    
    // Handle arrow symbols -> and <-, add backticks around them
    result = result.replace(
        /([^\w`]|^)(->|<-)([^\w`]|$)/g,
        (match, before, arrow, after) => {
            // Skip content already in code blocks or with backticks
            if (before.includes('`') || after.includes('`')) {
                return match;
            }
            
            // Check if it's part of an HTML comment
            if (
                // Exclude <!-- case
                (arrow === '<-' && before.trim().endsWith('<')) || 
                // Exclude --> case
                (arrow === '->' && after.trim().startsWith('>')) ||
                // Match more complete HTML comment pattern
                before.includes('<!--') || 
                after.includes('-->')
            ) {
                return match;
            }
            
            return `${before}\`${arrow}\`${after}`;
        }
    );

    // Remove various type markers, supporting multiple formats
    // Format 1: {type="note"}, {type = "note"}, { type="note" }, { type = "note" }
    result = result.replace(/\{\s*type\s*=?\s*["'](\w+)["']\s*\}/g, '');
    // Format 2: {type=note}, {type note}, { type=note }, { type note }
    result = result.replace(/\{\s*type\s*=?\s*(\w+)\s*\}/g, '');
    
    // Escape curly braces in command line arguments and options
    
    // 1. Handle patterns like -xxx {options}, including cases without pipe symbols
    result = result.replace(/([-]\w+)\s+\{([^{}]+)\}/g, '$1 _{$2}_');
    
    // 2. Handle standalone multiple option braces, like {a|b|c|d}, regardless of number of pipe symbols
    result = result.replace(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g, '\\{$1\\}');
    

    // Handle <code-block> tags, convert to Markdown code blocks
    result = result.replace(
        /<code-block\s+lang="([^"]+)">\s*([\s\S]*?)\s*<\/code-block>/g,
        (match, language, code) => {
            // Clean potentially problematic characters in code
            const cleanedCode = code
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .trim();
            
            // Convert to Markdown code block format
            return `\`\`\`${language}\n${cleanedCode}\n\`\`\``;
        }
    );

    // Handle {<b>xxx</b>yyy} format in tables - convert to plain text
    result = result.replace(
        /\{<b>(.*?)<\/b>(.*?)\}/g,
        (match, boldPart, normalPart) => {
            // Convert to **bold part**normal part format
            return `**${boldPart}**${normalPart}`;
        }
    );

    // Handle email addresses, wrap in code blocks to prevent @ symbol from being parsed as JSX
    result = result.replace(
        /(<|&lt;)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(&gt;|>)/g,
        '`$1$2$3`'
    );

    // Special handling for <=number format in list items, e.g., <=1.9.0: 
    result = result.replace(
        /([^\w`]|^)(<=)(\d+(?:\.\d+)*)/g,
        (match, before, operator, version) => {
            // Skip React component placeholders
            if (before.includes('__REACT_') || before.includes('__HTML_COMMENT_')) {
                return match;
            }
            return `${before}&lt;=${version}`;
        }
    );

    // Special handling for list items starting with * <=number
    result = result.replace(
        /^(\s*[*-]\s+)(<=)(\d+(?:\.\d+)*)/gm,
        (match, listMarker, operator, version) => {
            return `${listMarker}&lt;=${version}`;
        }
    );

    // Fix potentially incorrect ::: marker identification in code
    result = fixAdmonitionsInCode(result);

    // Fix various HTML and special tag issues followed by :::
    result = fixTagsFollowedByAdmonitions(result);

    // Restore protected React components
    result = restoreReactComponents(result);

    result = result.replace(/\:\:\:/g, '\n:::')

    // Remove .md extension from Markdown links, including links with anchors
    result = result.replace(/\]\(([^)]+)\.md(#[^)]+)?\)/g, ']($1$2)');
    
    // Remove .md extension from HTML <a> tag links, including links with anchors
    result = result.replace(/<a\s+href=["']([^"']+)\.md(#[^"']*)?["']/g, '<a href="$1$2"');

    return result;
}

// Fix ::: marker issues in code blocks
function fixAdmonitionsInCode(content) {
    const codeBlockRegex = /```[\s\S]*?```/g;
    return content.replace(codeBlockRegex, (codeBlock) => {
        // Add a space or escape before ::: in code blocks to prevent identification as admonition
        return codeBlock.replace(
            /(^|\s):::(tip|caution|note|info|warning)/gm,
            '$1 :::$2'
        );
    });
}

// Fix issues with various HTML tags and special characters followed by :::
function fixTagsFollowedByAdmonitions(content) {
    let result = content;
    
    // Fix conditional statement issues with ::: (e.g., hostOs == "Mac OS X" && isArm64 -:::tip)
    result = result.replace(
        /([=!<>&|+-])\s*(:::(tip|caution|note|info|warning))/g,
        '$1$2'
    );
    
    // Fix other symbols followed by :::
    result = result.replace(
        /([/\\])\s*(:::(tip|caution|note|info|warning))/g,
        '$1>'
    );
    
    return result;
}

// New function: Protect HTML comments
function protectHtmlComments(content) {
    const commentPlaceholders = {};
    let placeholderIndex = 0;
    
    // Replace each HTML comment with a unique placeholder
    const result = content.replace(/<!--[\s\S]*?-->/g, (match) => {
        const placeholder = `__HTML_COMMENT_${placeholderIndex}__`;
        commentPlaceholders[placeholder] = match;
        placeholderIndex++;
        return placeholder;
    });
    
    // Store placeholder mapping to global variable for later restoration
    global.commentPlaceholders = commentPlaceholders;
    
    return result;
}

// New function: Restore HTML comments
function restoreHtmlComments(content) {
    let result = content;
    
    // Get previously stored placeholder mapping
    const commentPlaceholders = global.commentPlaceholders || {};
    
    // Restore all HTML comments
    Object.keys(commentPlaceholders).forEach(placeholder => {
        const comment = commentPlaceholders[placeholder];
        // Use global replacement to ensure all placeholders are replaced
        const regex = new RegExp(placeholder, 'g');
        result = result.replace(regex, comment);
    });
    
    // Convert MDX comments to HTML comments (if needed)
    result = result.replace(/\{\/\*\s*Commented out include tag\s*\*\/\}/g, '<!-- Commented out include tag -->');
    
    return result;
}

// New function: Protect React components from being modified by other rules
function protectReactComponents(content) {
    const componentPlaceholders = {};
    let placeholderIndex = 0;
    
    // Protect Tabs and TabItem components
    const result = content.replace(/<(Tabs|TabItem)([^>]*?)>|<\/(Tabs|TabItem)>/g, (match) => {
        const placeholder = `__REACT_COMPONENT_${placeholderIndex}__`;
        componentPlaceholders[placeholder] = match;
        placeholderIndex++;
        return placeholder;
    });
    
    // Protect JSX expressions {...}
    const withJsxProtected = result.replace(/default=\{([^}]*?)\}/g, (match) => {
        const placeholder = `__REACT_JSX_${placeholderIndex}__`;
        componentPlaceholders[placeholder] = match;
        placeholderIndex++;
        return placeholder;
    });
    
    // Store placeholder mapping to global variable
    global.reactComponentPlaceholders = componentPlaceholders;
    
    return withJsxProtected;
}

// New function: Restore protected React components
function restoreReactComponents(content) {
    let result = content;
    
    // Get previously stored placeholder mapping
    const componentPlaceholders = global.reactComponentPlaceholders || {};
    
    // Restore all React components
    Object.keys(componentPlaceholders).forEach(placeholder => {
        const component = componentPlaceholders[placeholder];
        // Use global replacement to ensure all placeholders are replaced
        const regex = new RegExp(placeholder, 'g');
        result = result.replace(regex, component);
    });
    
    return result;
}