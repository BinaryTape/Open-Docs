import {DefaultTheme, defineConfig} from 'vitepress'
import markdownItContainer from 'markdown-it-container'
import markdownItWsContainer from "./markdown-it-ws-container";
import markdownItWsFrontmatter from "./markdown-it-ws-frontmatter";
import markdownItWsCodeClean from "./markdown-it-ws-code-clean";
import markdownItWsAssets from "./markdown-it-ws-assets";
import markdownItWsVars from "./markdown-it-ws-vars";
import markdownItMKVars from "./markdown-it-mk-vars";
import markdownItMkHlLines from "./markdown-it-mk-hl-lines";
import markdownItMkLiquidCondition from "./markdown-it-mk-liquid-condition";
import markdownItMkAdmonition from "./markdown-it-mk-admonitions";
import markdownItMkCodeTabs from "./markdown-it-mk-code-tabs";
import markdownItMkLinks from "./markdown-it-mk-links";
import {DOCS_TYPES, DocsTypeConfig} from './docs.config';
import {markdownItRewriteLinks} from './markdown-it-ws-inline-link';
import {SiteLocaleConfig} from './locales.config';
import generateSidebarItems from './config/sidebar.config';
import markdownItDiffTitleWrapper from "./markdown-it-mk-diff-code-block";
import {getSidebarTitle} from './utils/sidebar-utils';
import {readFileSync, existsSync} from 'node:fs'
import {resolve, dirname} from 'node:path'
import shikiRemoveDiffMarker from "./shiki-remove-diff-marker";
import liquidIncludePlugin from "./vite-liquid-include";
import markdownItMKInclude from "./markdown-it-mk-Include";
import markdownItRemoveScript from "./markdown-it-remove-script";
import markdownItRemoveContributeUrl from "./markdown-it-remove-contribute-url";
import markdownItWsClassstyles from "./markdown-it-ws-classstyles";
import markdownItWsRenderInline from "./markdown-it-ws-render-inline";
import {markdownItCollapsed} from "./markdownItCollapsed.mts";
import markdownItWsRename from "./markdown-it-ws-rename";
import markdownItWsTopicTitle from "./markdown-it-ws-topicTitle";

const mkDiffGrammarPath = resolve(__dirname, './shiki-mk-diff.json')
const mkDiffGrammar = JSON.parse(readFileSync(mkDiffGrammarPath, 'utf-8'))

const baseAlgoliaSearchOptions = {
    provider: 'algolia',
    options: {
        appId: 'KKPT76EMFG',
        apiKey: '4aa380b300f9018dd16ecfc112c8a786',
        indexName: 'openaiorg',
    }
};

/**
 * Creates a custom markdown-it container.
 * @param {object} md - The markdown-it instance.
 * @param {string} name - The name of the container (e.g., 'note', 'caution').
 * @param {string} className - The CSS class to apply to the container div.
 * @param {string} defaultTitle - The default title for the container.
 */
function createContainer(md, name, className, defaultTitle) {
    md.use(markdownItContainer, name, {
        render: function (tokens, idx) {
            const token = tokens[idx];
            const info = token.info.trim().slice(name.length).trim();
            if (token.nesting === 1) {
                const title = md.utils.escapeHtml(info || defaultTitle);
                return `<div class="${className} custom-block"><p class="custom-block-title">${title}</p>\n`;
            } else {
                return '</div>\n';
            }
        }
    });
}


// https://vitepress.dev/reference/site-config
export default defineConfig({
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: true,
    lang: 'zh-Hans',
    title: 'Open AIDoc',
    head: [
        ['link', {rel: 'icon', href: '/img/favicon.ico'}],
        [
            'script',
            {async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-HLCXSW4HH1'}
        ],
        [
            'script',
            {},
            `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HLCXSW4HH1');`
        ]
    ],
    vite: {
        plugins: [
            liquidIncludePlugin()
        ]
    },
    themeConfig: {
        outline: [2, 3],
        logo: '/img/logo.png',
        lastUpdated: {
            text: '上次更新'
        },
        editLink: {
            pattern: 'https://github.com/BinaryTape/Open-Docs/blob/main/docs/:path',
            text: '编辑此页'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/BinaryTape/Open-Docs'}
        ],
        footer: {
            copyright: 'Copyright © 2025 Open AIDoc.'
        },
        // Root search config (Applied to zh-Hans)
        search: {
            ...baseAlgoliaSearchOptions,
            options: {
                ...baseAlgoliaSearchOptions.options,
                placeholder: '搜索文档',
                translations: {
                    button: {buttonText: '搜索', buttonAriaLabel: '搜索'},
                    modal: {
                        noResultsText: '没有找到相关结果',
                        resetButtonTitle: '清除查询',
                        resetButtonAriaLabel: '清除查询',
                        cancelButtonText: '取消',
                        cancelButtonAriaLabel: '取消',
                        footer: {selectText: '选择', navigateText: '切换', closeText: '关闭'},
                        startScreen: {
                            recentSearchesTitle: '最近搜索',
                            noRecentSearchesText: '无最近搜索',
                            saveRecentSearchButtonTitle: '保存本次搜索',
                            removeRecentSearchButtonTitle: '从历史中移除',
                            favoriteSearchesTitle: '收藏的搜索',
                            removeFavoriteSearchButtonTitle: '从收藏中移除'
                        }
                    }
                }
            }
        },
    },
    locales: {
        root: {
            ...SiteLocaleConfig['zh-Hans'],
            themeConfig: {
                nav: [
                    {text: 'Koin', link: '/koin/setup/koin'},
                    {text: 'Kotlin', link: '/kotlin/getting-started'},
                    {text: 'SQLDelight', link: '/sqldelight/index'}
                ],
                sidebar: {
                    "/koin/": generateSidebarItems(SiteLocaleConfig['zh-Hans'], DocsTypeConfig.koin),
                    "/kotlin/": generateSidebarItems(SiteLocaleConfig['zh-Hans'], DocsTypeConfig.kotlin),
                    "/sqldelight/": generateSidebarItems(SiteLocaleConfig['zh-Hans'], DocsTypeConfig.sqldelight),
                },
            },
        },
        "zh-Hant": {
            link: "/zh-Hant/",
            ...SiteLocaleConfig['zh-Hant'],
            themeConfig: {
                nav: [
                    {text: 'Koin', link: '/zh-Hant/koin/setup/koin'},
                    {text: 'Kotlin', link: '/zh-Hant/kotlin/getting-started'},
                    {text: 'SQLDelight', link: '/zh-Hant/sqldelight/index'}
                ],
                sidebar: {
                    "/zh-Hant/koin/": generateSidebarItems(SiteLocaleConfig['zh-Hant'], DocsTypeConfig.koin),
                    "/zh-Hant/kotlin/": generateSidebarItems(SiteLocaleConfig['zh-Hant'], DocsTypeConfig.kotlin),
                    "/zh-Hant/sqldelight/": generateSidebarItems(SiteLocaleConfig['zh-Hant'], DocsTypeConfig.sqldelight),
                },
                lastUpdated: {text: '最後更新'},
                editLink: {
                    pattern: 'https://github.com/BinaryTape/Open-Docs/blob/main/docs/zh-Hant/:path',
                    text: '編輯此頁'
                },
                docFooter: {prev: '上一頁', next: '下一頁'},
                search: {
                    ...baseAlgoliaSearchOptions,
                    options: {
                        ...baseAlgoliaSearchOptions.options,
                        placeholder: '搜尋文檔',
                        translations: {
                            button: {buttonText: '搜尋', buttonAriaLabel: '搜尋'},
                            modal: {
                                noResultsText: '未找到相關結果',
                                resetButtonTitle: '清除查詢',
                                cancelButtonText: '取消',
                                footer: {selectText: '選擇', navigateText: '切換', closeText: '關閉'},
                                startScreen: {recentSearchesTitle: '最近搜尋', noRecentSearchesText: '無最近搜尋'}
                            }
                        }
                    }
                },
            },
        },
        ja: {
            ...SiteLocaleConfig['ja'],
            themeConfig: {
                nav: [
                    {text: 'Koin', link: '/ja/koin/setup/koin'},
                    {text: 'Kotlin', link: '/ja/kotlin/getting-started'},
                    {text: 'SQLDelight', link: '/ja/sqldelight/index'}
                ],
                sidebar: {
                    "/ja/koin/": generateSidebarItems(SiteLocaleConfig['ja'], DocsTypeConfig.koin),
                    "/ja/kotlin/": generateSidebarItems(SiteLocaleConfig['ja'], DocsTypeConfig.kotlin),
                    "/ja/sqldelight/": generateSidebarItems(SiteLocaleConfig['ja'], DocsTypeConfig.sqldelight),
                },
                lastUpdated: {text: '最終更新日'},
                editLink: {
                    pattern: 'https://github.com/BinaryTape/Open-Docs/blob/main/docs/ja/:path',
                    text: 'このページを編集'
                },
                docFooter: {prev: '前のページ', next: '次のページ'},
                search: {
                    ...baseAlgoliaSearchOptions,
                    options: {
                        ...baseAlgoliaSearchOptions.options,
                        placeholder: 'ドキュメントを検索',
                        translations: {
                            button: {buttonText: '検索', buttonAriaLabel: '検索'},
                            modal: {
                                noResultsText: '関連する結果が見つかりませんでした',
                                resetButtonTitle: 'クエリをクリア',
                                cancelButtonText: 'キャンセル',
                                footer: {selectText: '選択', navigateText: '切り替え', closeText: '閉じる'},
                                startScreen: {
                                    recentSearchesTitle: '最近の検索',
                                    noRecentSearchesText: '最近の検索はありません'
                                }
                            }
                        }
                    }
                },
            },
        },
        ko: {
            ...SiteLocaleConfig['ko'],
            themeConfig: {
                nav: [
                    {text: 'Koin', link: '/ko/koin/setup/koin'},
                    {text: 'Kotlin', link: '/ko/kotlin/getting-started'},
                    {text: 'SQLDelight', link: '/ko/sqldelight/index'}
                ],
                sidebar: {
                    "/ko/koin/": generateSidebarItems(SiteLocaleConfig['ko'], DocsTypeConfig.koin),
                    "/ko/kotlin/": generateSidebarItems(SiteLocaleConfig['ko'], DocsTypeConfig.kotlin),
                    "/ko/sqldelight/": generateSidebarItems(SiteLocaleConfig['ko'], DocsTypeConfig.sqldelight),
                },
                lastUpdated: {text: '마지막 업데이트'},
                editLink: {
                    pattern: 'https://github.com/BinaryTape/Open-Docs/blob/main/docs/ko/:path',
                    text: '이 페이지 편집'
                },
                docFooter: {prev: '이전 페이지', next: '다음 페이지'},
                search: {
                    ...baseAlgoliaSearchOptions,
                    options: {
                        ...baseAlgoliaSearchOptions.options,
                        placeholder: '문서 검색',
                        translations: {
                            button: {buttonText: '검색', buttonAriaLabel: '검색'},
                            modal: {
                                noResultsText: '관련 결과를 찾을 수 없습니다',
                                resetButtonTitle: '쿼리 지우기',
                                cancelButtonText: '취소',
                                footer: {selectText: '선택', navigateText: '전환', closeText: '닫기'},
                                startScreen: {recentSearchesTitle: '최근 검색', noRecentSearchesText: '최근 검색 없음'}
                            }
                        }
                    }
                },
            }
        }
    },
    markdown: {
        attrs: {
            leftDelimiter: '{',
            rightDelimiter: '}',
            allowedAttributes: []
        },
        preConfig: (md) => {
            md.use(markdownItMkLiquidCondition)
        },
        shikiSetup: (shiki) => {
            shiki.loadLanguage(mkDiffGrammar)
        },
        codeTransformers: [
            shikiRemoveDiffMarker()
        ],
        config: (md) => {
            // Register all markdown-it plugins
            md.use(markdownItWsClassstyles)
            md.use(markdownItRewriteLinks)
            md.use(markdownItRemoveContributeUrl)
            md.use(markdownItRemoveScript)
            md.use(markdownItMKInclude)
            md.use(markdownItWsCodeClean)
            md.use(markdownItWsFrontmatter)
            md.use(markdownItWsRenderInline)
            md.use(markdownItWsContainer)
            md.use(markdownItWsAssets)
            md.use(markdownItMkAdmonition)
            md.use(markdownItMkHlLines)
            md.use(markdownItMkCodeTabs)
            md.use(markdownItMkLinks)
            md.use(markdownItDiffTitleWrapper)
            md.use(markdownItCollapsed)
            md.use(markdownItWsVars, {xmlFilePath: 'docs/.vitepress/v.list'});
            md.use(markdownItMKVars);

            md.use(markdownItWsRename)
            md.use(markdownItWsTopicTitle)


            // Use the helper function to create containers cleanly
            createContainer(md, 'note', 'note', 'NOTE');
            createContainer(md, 'caution', 'warning', 'CAUTION');
            createContainer(md, 'warning', 'danger', 'WARNING'); // Assumes 'warning' should be danger, as in original
            // OPTIMIZATION 3: Corrected 'example' to render an 'info' block instead of 'danger'
            createContainer(md, 'example', 'info', 'EXAMPLE');


            // --- `md.parse` override with improved comments for clarity ---
            const originalParse = md.parse;
            md.parse = function (src, env) {
                // Pre-process step: remove liquid conditional blocks so they don't interfere with parsing logic.
                let modifiedSrc = src.replace(/{%\s*if\s+.*?%}[\s\S]*?{%\s*endif\s*%}/g, '');

                const parts = env.relativePath.split('/');
                const docType = parts.find(p => DOCS_TYPES.includes(p));

                // The auto-titling logic is skipped for the 'kotlin' documentation type.
                if (docType === 'kotlin') {
                    return originalParse.call(this, modifiedSrc, env);
                }

                const lines = modifiedSrc.trim().split(/\r?\n/);
                let hasH1 = false;

                // Check if the document already contains a level-1 heading (e.g., '# Title').
                for (const line of lines) {
                    if (line.trim().startsWith('# ')) {
                        hasH1 = true;
                        break;
                    }
                }

                // If no H1 heading is found, prepend one automatically.
                if (!hasH1) {
                    let title = '';
                    // Priority 1: Use the title from the page's frontmatter.
                    if (env.frontmatter && env.frontmatter.title) {
                        title = env.frontmatter.title;
                    } else {
                        // Priority 2: Fallback to a title derived from the sidebar configuration.
                        title = getSidebarTitle(env.relativePath);
                    }

                    if (title) {
                        modifiedSrc = `# ${title}\n\n${modifiedSrc}`;
                    }
                }

                // Call the original `parse` method with the (potentially modified) source.
                return originalParse.call(this, modifiedSrc, env);
            }
        },
    },
})
