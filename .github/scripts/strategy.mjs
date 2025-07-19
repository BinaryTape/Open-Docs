export const defaultStrategy = {
  /**
   * Gets the glob patterns for the document files to be processed.
   * @returns {string[]}
   */
  getDocPatterns: () => ["docs/**/*.md"],

  /**
   * On Sync finished.
   * @param {string} repoPath - Path to the cloned repository
   */
  onSyncEnd: async (repoPath) => {},

  /**
   * On Translate finished.
   * @param {object} context - Stage context
   * @param {object} repoConfig - Configuration of the current repository
   */
  onTranslateEnd: async (context, repoConfig) => {},
};
