import {DocsItemConfig} from "../docs.config";
import {SideLocaleConfig} from "../locales.config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function generateSidebar(localeConfig: SideLocaleConfig, docsConfig: DocsItemConfig) {
    let sidebarPrefixDir = localeConfig.lang === "zh-Hans" ? docsConfig.path : path.posix.join(localeConfig.lang, docsConfig.path);
    const relativePrefixDir = path.posix.join("docs", sidebarPrefixDir);
    sidebarPrefixDir = path.posix.join("/", sidebarPrefixDir);
    return generateSidebarNode(localeConfig.lang, docsConfig.framework, docsConfig.type, sidebarPrefixDir, relativePrefixDir);
}

function generateSidebarNode(lang: string, framework: string, type: string, sidebarPrefixDir: string, relativePrefixDir: string) {
    const sidebar = JSON.parse(fs.readFileSync(`docs/.vitepress/sidebar/${type}.sidebar.json`, 'utf8'));
    const locale: Record<string, string> = JSON.parse(fs.readFileSync(`docs/.vitepress/locales/${lang}.json`, 'utf8'));

    const localizeNode = (node): any => {
        const localizedText =
            (node.text && locale[node.text]) ??
            (node.link ? getTitleFromMarkdown(framework, relativePrefixDir, node.link) : node.text);

        const out = {
            ...node,
            text: localizedText,
            link: node.link ? `${sidebarPrefixDir}${node.link}` : node.href ? node.href : undefined,
            collapsed: node.collapsed ?? undefined,
        };

        if (node.include) {
            out.items = generateSidebarNode(lang, framework, node.include, sidebarPrefixDir, relativePrefixDir);
        } else if (Array.isArray(node.items)) {
            out.items = node.items.map(localizeNode);
        } else {
            delete out.items;
        }

        return out;
    };

    return sidebar.map(localizeNode);
}

function getTitleFromMarkdown(framework: string, rootDir: string, filePath: string) {
    const fullPath = path.join(rootDir, `${filePath}.md`);
    if (!fs.existsSync(fullPath)) return null;
    const content = fs.readFileSync(fullPath, "utf-8");

    switch (framework) {
        case 'Docusaurus' : const { data } = matter(content); return data.title || null;
        case 'Writerside' : return getWritersideTitle(content) || null;
        default : break;
    }
}

function getWritersideTitle(content: string) {
    const topicMatch = content.match(/<topic\s*([^>]*)>([\s\S]*?)<\/topic>/)
    if (topicMatch && topicMatch[1]) {
        const topicTitleMatch = topicMatch[1].match(/title="([^"]+)"/)
        return topicTitleMatch ? topicTitleMatch[1] : null;
    }
    const markdownTitleMatch = content.match(/\[\/\/\]: # \(title:\s*(.*?)\)/i)
    return markdownTitleMatch ? markdownTitleMatch[1] : null;
}
