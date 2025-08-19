import MarkdownIt from 'markdown-it';

// 自定义 MarkdownIt 插件来去除不必要的空行
export const markdownItTrimBrSpaces: MarkdownIt.PluginSimple = (md: MarkdownIt) => {
    const originalParse = md.parse;

    md.parse = function (src, env) {
        // 移除 <br/> 后面的多余空格
        const formattedSrc = src.replace(/<br\/>\s+/g, '<br/>');

        return originalParse.call(this, formattedSrc, env);
    };
};
