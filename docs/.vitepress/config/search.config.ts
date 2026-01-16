import type { DefaultTheme } from 'vitepress'

/**
 * Algolia search base configuration
 */
const BASE_ALGOLIA_OPTIONS = {
  appId: 'KKPT76EMFG',
  apiKey: '4aa380b300f9018dd16ecfc112c8a786',
  indexName: 'openaiorg',
}

/**
 * Search UI translations for each language
 */
const SEARCH_TRANSLATIONS: Record<string, {
  placeholder: string
  button: { buttonText: string; buttonAriaLabel: string }
  modal: {
    noResultsText: string
    resetButtonTitle: string
    cancelButtonText: string
    footer: { selectText: string; navigateText: string; closeText: string }
    startScreen: { recentSearchesTitle: string; noRecentSearchesText: string }
  }
}> = {
  'zh-Hans': {
    placeholder: '搜索文档',
    button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
    modal: {
      noResultsText: '没有找到相关结果',
      resetButtonTitle: '清除查询',
      cancelButtonText: '取消',
      footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
      startScreen: { recentSearchesTitle: '最近搜索', noRecentSearchesText: '无最近搜索' }
    }
  },
  'zh-Hant': {
    placeholder: '搜尋文檔',
    button: { buttonText: '搜尋', buttonAriaLabel: '搜尋' },
    modal: {
      noResultsText: '未找到相關結果',
      resetButtonTitle: '清除查詢',
      cancelButtonText: '取消',
      footer: { selectText: '選擇', navigateText: '切換', closeText: '關閉' },
      startScreen: { recentSearchesTitle: '最近搜尋', noRecentSearchesText: '無最近搜尋' }
    }
  },
  'ja': {
    placeholder: 'ドキュメントを検索',
    button: { buttonText: '検索', buttonAriaLabel: '検索' },
    modal: {
      noResultsText: '関連する結果が見つかりませんでした',
      resetButtonTitle: 'クエリをクリア',
      cancelButtonText: 'キャンセル',
      footer: { selectText: '選択', navigateText: '切り替え', closeText: '閉じる' },
      startScreen: { recentSearchesTitle: '最近の検索', noRecentSearchesText: '最近の検索はありません' }
    }
  },
  'ko': {
    placeholder: '문서 검색',
    button: { buttonText: '검색', buttonAriaLabel: '검색' },
    modal: {
      noResultsText: '관련 결과를 찾을 수 없습니다',
      resetButtonTitle: '쿼리 지우기',
      cancelButtonText: '취소',
      footer: { selectText: '선택', navigateText: '전환', closeText: '닫기' },
      startScreen: { recentSearchesTitle: '최근 검색', noRecentSearchesText: '최근 검색 없음' }
    }
  }
}

/**
 * Generate Algolia search configuration for a specific language
 * @param localeKey - Language key
 * @returns Complete Algolia search options with translations
 */
export function generateSearchConfig(localeKey: string): DefaultTheme.AlgoliaSearchOptions {
  const translations = SEARCH_TRANSLATIONS[localeKey] || SEARCH_TRANSLATIONS['zh-Hans']

  return {
    ...BASE_ALGOLIA_OPTIONS,
    placeholder: translations.placeholder,
    translations: {
      button: translations.button,
      modal: {
        ...translations.modal,
        resetButtonAriaLabel: translations.modal.resetButtonTitle,
        cancelButtonAriaLabel: translations.modal.cancelButtonText,
      }
    }
  }
}
