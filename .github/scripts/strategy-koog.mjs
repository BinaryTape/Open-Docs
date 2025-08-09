import {defaultStrategy} from "./strategy.mjs";
import path from "path";
import fs from "fs-extra";
import {generateSidebar} from "./SidebarProcessor.mjs";

export const koogStrategy = {
    ...defaultStrategy,

    /**
     * @override
     */
    getDocPatterns: () => ["docs/docs/*.md"],

    /**
     * @override
     */
    postSync: async (repoPath) => {
        console.log(`  Running Koog onSyncEnd: Generate sidebar - ${repoPath}...`);
        const sidebarPath = path.join(repoPath, 'docs/mkdocs.yml');
        const docType = repoPath.replace("-repo", "");
        if (await fs.pathExists(sidebarPath)) {
            await generateSidebar(sidebarPath, docType, 'https://sqldelight.github.io/sqldelight/2.1.0/');
        }
        console.log(`  Generate sidebar finished - ${repoPath}`);
    },

    /**
     * @override
     */
    postTranslate: async (context, repoConfig) => {
        console.log(`  Handling Koog assets: Copying images - ${repoConfig.path}... `);
        const {src, dest} = repoConfig.assets;
        const srcPath = path.join(repoConfig.path, src);
        if (await fs.pathExists(srcPath)) {
            await fs.ensureDir(dest);
            await fs.copy(srcPath, dest, { overwrite: true });
            context.gitAddPaths.add(dest); // 将目标目录加入待提交列表
        } else {
            console.warn(
                `  ⚠️  Warning: Asset source directory not found: ${srcPath}`
            );
        }
    },
};