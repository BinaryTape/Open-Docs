import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { sidebarsConfig, sidebarI18nConfig } from "./sidebar.config";
import { DocsItemConfig } from "../docs.config";

function applyI18nToSidebar(sidebars, sidebarI18nConfig, locale) {
  const i18nLabels = sidebarI18nConfig[locale];

  if (!i18nLabels || i18nLabels.length !== sidebars.length) {
    throw new Error(`i18n configuration and sidebars items are inconsistent or missing: ${locale}`);
  }

  return sidebars.map((group, index) => ({
    ...group,
    text: i18nLabels[index].text ?? group.text,
  }));
}

/**
 * Extracts the title from a markdown file
 * @param rootDir - The root directory path where markdown files are located
 * @param filePath - The relative path to the markdown file (without extension)
 * @returns The title from the markdown frontmatter, or null if not found
 */
function getTitleFromMarkdownFile(rootDir: string, filePath: string) {
  const fullPath = path.join(rootDir, `${filePath}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const content = fs.readFileSync(fullPath, "utf-8");
  const { data } = matter(content);
  return data.title || null;
}

/**
 * Generates sidebar items for documentation navigation
 * @param locale - The locale code for internationalization (default: "zh-hans")
 * @param docsConfig - Configuration object containing documentation settings
 * @returns An array of sidebar items with localized text and links
 */
export default function generateSidebarItems(locale = "zh-hans", docsConfig: DocsItemConfig) {
  let sidebarPrefixDir = docsConfig.path
  if (locale !== "zh-hans") {
    sidebarPrefixDir = path.posix.join(locale, sidebarPrefixDir);
  }
  const relativePrefixDir = path.posix.join("docs", sidebarPrefixDir);
  console.log("dir", sidebarPrefixDir);
  const sidebars = sidebarsConfig.map((group) => ({
    ...group,
    text: group.text,
    items: group.items.map((item) => ({
      text: getTitleFromMarkdownFile(relativePrefixDir, item) || item.split("/").pop(),
      link: `${sidebarPrefixDir}${item}`,
    })),
  }));
  const result = applyI18nToSidebar(sidebars, sidebarI18nConfig, locale);
  return result;
}