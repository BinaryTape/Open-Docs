import {defaultStrategy} from "./strategy.mjs";
import { copyFlatten } from "./fsUtils.mjs";
import path from "path";
import fs from "fs-extra";
import {processTopicFileAsync} from "./TopicProcessor.mjs";
import {generateSidebar} from "./SidebarProcessor.mjs";

export const kotlinStrategy = {
    ...defaultStrategy,

    /**
     * @override
     */
    getDocPatterns: () => ["docs/*.md"],

    /**
     * @override
     */
    postSync: async (repoPath) => {
        console.log(`  Running Kotlin postSync: Flattening directory - ${repoPath}...`);
        const originDocsPath = path.join(repoPath, "docs/topics");
        const docsPath = path.join(repoPath, "docs");
        if (await fs.pathExists(originDocsPath)) {
            await copyFlatten(originDocsPath, docsPath);
        }
        console.log(`  Flattening finished - ${repoPath}`);

        console.log(`  Running Kotlin postSync: Remove redundant files - ${repoPath}...`);
        const redundantFiles = ["kotlin-mascot.md", "debugging.md"];
        for (const file of redundantFiles) {
            const filePath = path.join(docsPath, file);
            if (await fs.pathExists(filePath)) {
                await fs.remove(filePath);
            }
        }
        console.log(`  Remove redundant files finished - ${repoPath}`);

        console.log(` Running Kotlin postSync: Convert topic files - ${repoPath}`);
        const docs = await fs.readdir(docsPath);
        const topicFiles = docs.filter(doc => doc.endsWith(".topic"));
        for (const topic in topicFiles) {
            const topicPath = path.join(docsPath, topicFiles[topic]);
            await processTopicFileAsync(topicPath, docsPath)
            await fs.remove(topicPath);
        }
        console.log(`  Convert topic files finished - ${repoPath}`);

        console.log(`  Running Kotlin postSync: Generate sidebar - ${repoPath}...`);
        const sidebarFile = docs.filter(doc => doc.endsWith(".tree"));
        const sidebarPath = path.join(docsPath, sidebarFile[0]);
        const docType = repoPath.replace("-repo", "");
        if (await fs.pathExists(sidebarPath)) {
            await generateSidebar(sidebarPath, docType);
        }
        console.log(`  Generate sidebar finished - ${repoPath}`);

        if (repoPath === "kotlin-repo") {
            console.log(`  Running Kotlin postSync: Resolve includes`);
            const includeMD = path.join(docsPath, "kotlin-language-features-and-proposals.md");
            let content = await fs.readFile(includeMD, "utf8");
            const includeFilterRe = /<include\s+element-id="([^"]+)"\s+use-filter="([^"]+)"\s+from="([^"]+)"\s*\/?>/g;

            content = content.replace(includeFilterRe, (match, elementId, filterMatch, from) => {
                const filter = filterMatch.split(',')[1]
                const trMatch = content.match(new RegExp(`<tr\\s+filter="${filter}">([\\s\\S]*?)<\\/tr>`, 'g'));
                if (!trMatch) return '';

                const tr = trMatch.join('\n\n');
                return `<table>\n${tr}\n</table>`
            })

            await fs.writeFile(includeMD, content, "utf8");
            console.log(`  Resolve includes finished - ${repoPath}`);
        }
    },

    /**
     * @override
     */
    postTranslate: async (context, repoConfig) => {
        if (repoConfig.path === "kotlin-repo") {
            console.log(`  Copying Kotlin version file... `);
            const versionFile = "kotlin-repo/docs/v.list";
            if (await fs.pathExists(versionFile)) {
                await fs.copy(versionFile, "docs/.vitepress/kotlin.v.list", { overwrite: true });
                context.gitAddPaths.add("docs/.vitepress/kotlin.v.list")
                console.log(`  Copying Kotlin version file finished - ${repoConfig.path}`);
            }
        }

        console.log(`  Handling Kotlin assets: Copying images - ${repoConfig.path}... `);
        const { src, dest } = repoConfig.assets;
        const srcPath = path.join(repoConfig.path, src);
        if (await fs.pathExists(srcPath)) {
            await fs.ensureDir(dest);
            await copyFlatten(srcPath, dest);
            context.gitAddPaths.add(dest); // 将目标目录加入待提交列表
        } else {
            console.warn(
                `  ⚠️  Warning: Asset source directory not found: ${srcPath}`
            );
        }
    },
};