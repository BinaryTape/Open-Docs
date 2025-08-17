import fs from "fs";
import {
    fetchSnippet,
    getChapterTitle,
    getTopicTitle,
    processTopicContentAsync,
    replaceAsync
} from "./TopicProcessor.mjs";
import path from "node:path";

export async function processMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    let processedContent = await processTopicContentAsync(filePath, path.dirname(filePath), content);
    processedContent = await processMarkdownContent(filePath, processedContent);
    fs.writeFileSync(filePath, processedContent, "utf-8");
}

export async function processMarkdownContent(filePath, content) {
    content = await replaceAsync(
        content,
        /```([^\n`]*)\n(\s*)```(?:\s*\n)?(\s*)\{([^}]*)\}/gm,
        async (_, language, indent, endIndent, attr) => {
            if (/\bsrc=/i.test(attr)) {
                const src = /src="([^"]+)"/.exec(attr);

                const include_lines = /include-lines="([^"]+)"/.exec(attr);
                const ranges = include_lines ? include_lines[1].split(',') : [];
                const snippetsPath = path.join(filePath.split('/')[0], "codeSnippets");

                let code = await fetchSnippet(snippetsPath, src[1], ranges);
                let lines = code.split("\n");

                const minIndent = Math.min(
                    ...lines.map(line => {
                        const match = line.match(/^(\s*)/);
                        return match ? match[1].length : 0;
                    })
                );

                lines = lines.map(line => line.slice(minIndent));

                const indentedCode = lines
                    .map(line => indent + line)
                    .join("\n");

                return `\`\`\`${language}\n${indentedCode}\n${indent}\`\`\``
            }
        }
    );

    content = content.replace(
        /\[\[\[([^\|\]]+)\|([^\]]+)\]\]\]/g,
        (_, title, link) => {
            return `${title}`
        }
    );

    content = content
        .replace(/<\s*tabs\b([^>]*)>/gi, '<Tabs$1>')
        .replace(/<\s*\/\s*tabs\s*>/gi, '</Tabs>')
        .replace(/<\s*tab\b([^>]*)>/gi, '<TabItem$1>')
        .replace(/<\s*\/\s*tab\s*>/gi, '</TabItem>');

    content = content.replace(
        /<code>([\s\S]*?)(<\/code>|<\/code-block>)/g,
        (match, content, closing) => {
            const escapedContent = content.replace(/\*/g, "&#42;");
            return `<code>${escapedContent}</code>`;
        }
    );

    content = content.replace(
        /\[]\(([\s\S]*?)\)/g,
        (match, href) => {
            let title;
            if (href.startsWith('#')) {
                title = getChapterTitle(filePath, href.split('#')[1])
            } else if (href.includes('#')) {
                const targetFile = path.join(path.dirname(filePath), href.split('#')[0])
                title = getChapterTitle(targetFile, href.split('#')[1])
            } else {
                const topicPath = path.join(path.dirname(filePath), href);
                title = getTopicTitle(topicPath)
            }

            return `[${title}](${href})`
        }
    );

    content = content.replace(
        /(<tr>)([\s\S]*?)(<\/tr>)/g,
        (match, open, content, close) => {
            const normalized = content.trim();
            return `\n${open}\n${normalized}\n${close}\n`;
        }
    );

    // Special matching case
    content = content.replace(
        /\n```Console\n(--> onRequest\n--> on\(Send\)\n--> on\(SendingRequest\)\n<-- onResponse\n--> on\(SendingRequest\)\n<-- onResponse)\n```\n/mg,
        (match, content) => {
            const code = content
                .replace(/^\s*\n/, '')
                .replace(/\n\s*$/, '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/\n/g, '&#10;');
            return `<code-block lang="Console" code="${code}"/>`;
        }
    )

    return content;
}