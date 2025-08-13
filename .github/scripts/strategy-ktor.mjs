import {defaultStrategy} from "./strategy.mjs";
import { copyFlatten } from "./fsUtils.mjs";
import path from "path";
import fs from "fs-extra";
import {processTopicFile} from "./TopicProcessor.mjs";
import {generateSidebar} from "./SidebarProcessor.mjs";

export const ktorStrategy = {
    ...defaultStrategy,

    /**
     * @override
     */
    getDocPatterns: () => ["topics/*.md"],

    /**
     * @override
     */
    onSyncEnd: async (repoPath) => {
        console.log(` Running Ktor onSyncEnd: Convert topic files - ${repoPath}`);
        const docsPath = path.join(repoPath, "topics");
        const docs = await fs.readdir(docsPath);
        const topicFiles = docs.filter(doc => doc.endsWith(".topic"));
        for (const topic in topicFiles) {
            const topicPath = path.join(docsPath, topicFiles[topic]);
            await processTopicFile(topicPath, docsPath, true)
            await fs.remove(topicPath);
        }
        console.log(`  Convert topic files finished - ${repoPath}`);

        console.log(`  Running Ktor onSyncEnd: Generate sidebar - ${repoPath}...`);
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
    onTranslateEnd: async (context, repoConfig) => {
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