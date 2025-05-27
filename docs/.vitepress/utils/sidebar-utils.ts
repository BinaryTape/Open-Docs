import { DocsTypeConfig } from '../docs.config';
import { SiteLocaleConfig } from '../locales.config';
import generateSidebarItems from '../config/sidebar.config';
import { resolve } from 'path';

/**
 * 根据相对路径获取侧栏标题
 * @param relativePath 文档的相对路径
 * @returns 侧栏标题或undefined
 */
export function getSidebarTitle(relativePath: string): string | undefined {
  if (!relativePath) return undefined;

  // 确定当前文档所属的区域和语言
  let locale = 'zh-hans';
  let section = '';
  let pathWithoutExt = relativePath.replace(/\.md$/, '');

  const parts = pathWithoutExt.split('/');
  
  // 确定语言区域
  if (parts.length > 0) {
    if (Object.keys(SiteLocaleConfig).includes(parts[0])) {
      locale = parts[0];
      parts.shift(); // 移除语言部分
      pathWithoutExt = parts.join('/');
    }
  }

  // 确定文档区域（koin、kotlin或sqldelight）
  if (parts.length > 0) {
    if (['koin', 'kotlin', 'sqldelight'].includes(parts[0])) {
      section = parts[0];
    }
  }

  if (!section) return undefined;

  // 根据区域选择对应的DocsTypeConfig
  let docType;
  switch (section) {
    case 'koin':
      docType = DocsTypeConfig.koin;
      break;
    case 'kotlin':
      docType = DocsTypeConfig.kotlin;
      break;
    case 'sqldelight':
      docType = DocsTypeConfig.sqldelight;
      break;
    default:
      return undefined;
  }

  // 获取对应语言和区域的侧栏配置
  const sidebarConfig = generateSidebarItems(SiteLocaleConfig[locale], docType);
  
  // 在侧栏配置中查找匹配的项
  return findTitleInSidebar(sidebarConfig, pathWithoutExt.substring(section.length + 1));
}

/**
 * 在侧栏配置中递归查找标题
 * @param items 侧栏项目
 * @param path 查找路径
 * @returns 找到的标题或undefined
 */
function findTitleInSidebar(items: any[], path: string): string | undefined {
  if (!items || !Array.isArray(items)) return undefined;

  for (const item of items) {
    // 直接匹配当前项
    if (item.link && item.link.endsWith(path)) {
      return item.text;
    }

    // 检查子项
    if (item.items && Array.isArray(item.items)) {
      const foundInChild = findTitleInSidebar(item.items, path);
      if (foundInChild) return foundInChild;
    }
  }

  return undefined;
}
