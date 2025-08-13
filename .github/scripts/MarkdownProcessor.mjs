import fs from "fs";
import {fetchSnippet, processTopicContent} from "./TopicProcessor.mjs";
import path from "node:path";

export function processMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    let processedContent = processTopicContent(path.dirname(filePath), content);
    processedContent = processMarkdownContent(filePath, processedContent);
    fs.writeFileSync(filePath, processedContent, "utf-8");
}

export function processMarkdownContent(filePath, content) {
    content = content.replace(
        /```([^\n`]*)\n(\s*)```(?:\s*\n)?(\s*)\{([^}]*)\}/gm,
        (_, language, indent, endIndent, attr) => {
            if (/\bsrc=/i.test(attr)) {
                const src = /src="([^"]+)"/.exec(attr);

                const include_lines = /include-lines="([^"]+)"/.exec(attr);
                const ranges = include_lines ? include_lines[1].split(',') : [];
                const snippetsPath = path.join(filePath.split('/')[0], "codeSnippets");

                let code = fetchSnippet(snippetsPath, src[1], ranges);
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
    )

    return content;
}