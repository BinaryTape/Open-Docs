import type MarkdownIt from 'markdown-it';

/**
 * 将特定的 Markdown 语法转换为 VitePress 的标准容器格式。
 * 此函数会执行以下转换：
 * 1. 定位到 "### Title ... |---|--- ... ```code```" 格式的练习块，并捕获其后所有的解决方案块。
 * 2. 在练习块内部，将自定义的 "> ... {style="tip"}" 块引用提示，转换为 "::: tip ... :::" 容器。
 * 3. 将整个练习块（标题、描述、初始代码）的主体转换为一个外层的 "::: details Title ... :::" 容器。
 * 4. 遍历所有捕获到的解决方案块，将它们分别转换为内嵌的 "::: details ... :::" 容器。
 * 5. 对“最后一个解决方案”进行特殊处理（在示例中，我们在其标题后添加了 “[Last Solution]” 标记，您可以根据需要自定义此逻辑）。
 * * @param {string} text - 待处理的原始 Markdown 文本。
 * @returns {string} - 处理后的、适用于 VitePress 的 Markdown 文本。
 */
function formatForVitePress(text) {
    // 新的正则表达式：匹配从练习标题开始，直到最后一个解决方案结束的整个块。
    // 使用正向先行断言 (?=\n###\s|$) 来确保匹配在下一个练习块开始前或文本末尾结束，但不会消耗它。
    const exerciseBlockRegex = /(###\s+(.+?)\s*\{[^{}]*\})\s*((?:(?!###|\|---\|---)[\s\S])*?)?\|---\|---\|\s*\n(```[\s\S]+?```)\s*([\s\S]*?)(?=\n###\s|$)/g;

    const processedText = text.replace(exerciseBlockRegex, (
        match,
        headerLine,       // (p1) 捕获的完整标题行, e.g., "### Title {...}"
        title,            // (p2) 捕获的标题文本, e.g., "Title"
        description,      // (p3) 练习的描述部分
        exerciseCodeBlock,// (p4) 练习的初始代码块
        solutionsString   // (p5) 包含所有解决方案的原始字符串
    ) => {
        // 步骤 1: 处理练习描述中的自定义提示块
        let processedDescription = description ? description : '';
        const tipRegex = /> ([\s\S]+?)\n(?:>\s*)?\n\{style="tip"\}/g;
        processedDescription = processedDescription.replace(tipRegex, (tipMatch, content) => {
            const cleanedContent = content.replace(/^> /gm, '').trim();
            // 转换为标准的 VitePress 提示容器格式
            return `::: tip\n${cleanedContent}\n`;
        });

        const cleanDescription = processedDescription.trim();

        // 步骤 2: 组装练习部分的 VitePress 容器（最外层容器）
        let result = `::: details ${title.trim()}\n\n${cleanDescription ? cleanDescription + '\n\n' : ''}${exerciseCodeBlock}\n`;

        // 步骤 3: 处理所有解决方案
        // 定义一个辅助正则，用于从 solutionsString 中单独匹配每个解决方案
        const solutionRegex = /\|---\|---\|\s*\n(```[\s\S]+?```)\s*\{[^{}]*?collapsed-title="([^"]+)"[^{}]*\}/g;

        // 使用 matchAll 获取所有解决方案的匹配项数组，以便我们能识别最后一个
        const allSolutions = [...solutionsString.matchAll(solutionRegex)];

        allSolutions.forEach((solutionMatch, index) => {
            const isLastSolution = index === allSolutions.length - 1;
            const solutionCodeBlock = solutionMatch[1]; // 代码块
            const solutionTitle = solutionMatch[2];     // 解决方案的标题

            if (isLastSolution) {
                // 对最后一个解决方案的特殊处理 因 VitePresss 自身问题 无法完美处理多层嵌套，仅在最后加关闭标签
                result += `\n::: details ${solutionTitle.trim()}\n${solutionCodeBlock}\n:::\n`;
            } else {
                // 处理普通的、非最后的解决方案
                result += `\n::: details ${solutionTitle.trim()}\n${solutionCodeBlock}\n\n`;
            }
        });

        // 步骤 4: 关闭最外层的练习容器 因 VitePresss 自身问题 无法完美处理多层嵌套，目前不需要添加容器关闭标签
        // result += `\n:::`;

        return result;
    });
    // 清理多余的空行，保持格式整洁。
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
