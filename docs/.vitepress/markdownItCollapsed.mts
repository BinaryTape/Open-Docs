import type MarkdownIt from 'markdown-it';


/**
 * 将特定的 Markdown 折叠语法转换为 VitePress 的 details 容器格式。
 * Converts specific Markdown collapsible syntax to the VitePress details container format.
 * @param {string} text - 待处理的原始 Markdown 文本。The raw Markdown text to be processed.
 * @returns {string} - 处理后的、适用于 VitePress 的 Markdown 文本。The processed Markdown text compatible with VitePress.
 */
function formatForVitePress(text) {
    const collapsibleBlockRegex = /(###\s+(.+?)\s*\{[^{}]*\}\s*((?:(?!### |\|---\|---)[\s\S])*?)?\|---\|---\|\s*\n(```[\s\S]+?```)\s*(?:\s*\{[^{}]*\})?)|(\|---\|---\|\s*\n(```[\s\S]+?```)\s*\{[^{}]*?collapsed-title="([^"]+)"[^{}]*\})/g;
    const processedText = text.replace(collapsibleBlockRegex, (match, // Captures for the first pattern (starts with ###)
                                                               type1Match,      // The entire matched string for pattern 1
                                                               type1Title,      // The title from the '###' heading
                                                               type1Description,// The description content
                                                               type1CodeBlock,  // The code block for pattern 1
                                                               // Captures for the second pattern (starts with |---|---)
                                                               type2Match,      // The entire matched string for pattern 2
                                                               type2CodeBlock,  // The code block for pattern 2
                                                               type2Title       // The title from the 'collapsed-title' attribute
    ) => {
        // Case 1: A block that started with a '###' heading was matched.
        if (type1Match) {
            const cleanDescription = type1Description ? type1Description.trim() : '';
            // Assemble the VitePress container with a title, optional description, and code block.
            return `::: details ${type1Title.trim()}\n${cleanDescription ? cleanDescription + '\n\n' : ''}${type1CodeBlock}\n`;
        }
        // Case 2: A "solution" block that started with '|---|---' was matched.
        else if (type2Match) {
            // Assemble the VitePress container with the title from the attribute and the code block.
            return `::: details ${type2Title.trim()}\n${type2CodeBlock}\n:::`;
        }

        // Fallback, should not be reached with the current regex.
        return match;
    });

    // Clean up any remaining blank lines for a tidy output.
    return processedText.replace(/\n{3,}/g, '\n\n').trim();
}


/**
 * A markdown-it plugin to transform custom collapsible blocks into VitePress details containers.
 */
export const markdownItCollapsed: MarkdownIt.PluginSimple = (md: MarkdownIt) => {
    // 保存原始的 parse 方法
    const originalParse = md.parse;

    // 重写 parse 方法
    md.parse = function (src, env) {
        // ✨ 先用你的函数处理整个 Markdown 字符串
        const formattedSrc = formatForVitePress(src);

        // 然后调用原始的 parse方法来处理转换后的内容
        return originalParse.call(this, formattedSrc, env);
    };
};
