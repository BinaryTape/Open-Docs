import {defaultStrategy} from "./strategy.mjs";
import { copyFlatten } from "./fsUtils.mjs";
import path from "path";
import fs from "fs-extra";
import {processTopicFileAsync} from "./TopicProcessor.mjs";
import {generateSidebar} from "./SidebarProcessor.mjs";
import {processMarkdownFile} from "./MarkdownProcessor.mjs";

export const ktorStrategy = {
    ...defaultStrategy,

    /**
     * @override
     */
    getDocPatterns: () => ["topics/*.md"],

    postSync: async (repoPath) => {},

    /**
     * @override
     */
    postDetect: async (repoConfig, task) => {
        const repoPath = repoConfig.path;
        const docsPath = path.join(repoPath, "topics");
        const docs = await fs.readdir(docsPath);

        console.log(` Running Ktor postSync: Process markdown files - ${repoPath}`);
        const mdFiles = docs.filter(doc => doc.endsWith(".md"));
        for (const md in mdFiles) {
            const mdPath = path.join(docsPath, mdFiles[md]);
            await processMarkdownFile(mdPath);
        }
        console.log(`  Process markdown files finished - ${repoPath}`);

        console.log(` Running Ktor postSync: Convert topic files - ${repoPath}`);
        const topicFiles = docs.filter(doc => doc.endsWith(".topic") && !doc.startsWith('lib'));
        for (const topic in topicFiles) {
            const topicPath = path.join(docsPath, topicFiles[topic]);
            await processTopicFileAsync(topicPath, docsPath, true)
        }
        console.log(`  Convert topic files finished - ${repoPath}`);

        console.log(` Running Ktor postDetect: Change file extension - ${repoPath}`);
        // Map to flattened doc path, convert .topic -> .md
        task.files = await Promise.all(
            task.files.map(async (file) => {
                if (file.endsWith('.topic')) {
                    file = file.replace('.topic', '.md');
                }
                return file;
            })
        );
        console.log(`  Mapped files: ${task.files.join("\n")}`);
        console.log(`  Change file extension finished - ${repoPath}`);

        console.log(`  Running Ktor postSync: Generate sidebar - ${repoPath}...`);
        const sidebarPath = path.join(repoPath, "ktor.tree");
        const docType = repoPath.replace("-repo", "");
        if (await fs.pathExists(sidebarPath)) {
            await generateSidebar(sidebarPath, docType);
        }
        console.log(`  Generate sidebar finished - ${repoPath}`);
    },

    /**
     * @override
     */
    postTranslate: async (context, repoConfig) => {
        console.log(`  Copying Ktor version file... `);
        const versionFile = `${repoConfig.path}/v.list`;
        if (await fs.pathExists(versionFile)) {
            await fs.copy(versionFile, "docs/.vitepress/ktor.v.list", { overwrite: true });
            context.gitAddPaths.add("docs/.vitepress/ktor.v.list")
            console.log(`  Copying Ktor version file finished - ${repoConfig.path}`);
        }

        console.log(`  Handling Ktor assets: Copying images - ${repoConfig.path}... `);
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