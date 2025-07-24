import fs from "fs-extra";
import path from "path";
import { defaultStrategy } from "./strategy.mjs";

export const sqlDelightStrategy = {
  ...defaultStrategy,

  /**
   * @override
   */
  getDocPatterns: () => ["docs/**/*.md"],

  /**
   * @override
   */
  postSync: async (repoPath) => {
    console.log(
      "  Running SQLDelight postSync: Copying root markdown files..."
    );
    const docsDir = path.join(repoPath, "docs");
    const filesToCopy = {
      "CHANGELOG.md": "changelog.md",
      "CONTRIBUTING.md": "contributing.md",
    };
    for (const [src, dest] of Object.entries(filesToCopy)) {
      const srcPath = path.join(repoPath, src);
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, path.join(docsDir, dest));
      }
    }
  },
  
  /**
   * @override
   */
  postTranslate: async (context, repoConfig) => {
    console.log("  Handling SQLDelight assets: Copying images...");
    const { src, dest } = repoConfig.assets;
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
