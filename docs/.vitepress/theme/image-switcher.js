// .vitepress/theme/image-switcher.js

// 定义一个正则表达式来匹配所有 'ktor' 相关的页面路径
// /\/ktor\// 会匹配 /ktor/、/zh-Hant/ktor/ 等路径
const ktorPathRegex = /\/ktor\//;

/**
 * [带日志和路径判断版] 根据当前颜色主题，更新页面上所有被标记的图片的 src 属性。
 * @param {boolean} isDark - 当前是否为暗色模式。
 */
function updateImageSources(isDark) {
  // [新增逻辑] 在执行任何操作前，先检查当前页面的路径
  // window.location.pathname 获取的是 URL 中域名之后的部分 (例如 /zh-Hant/ktor/...)
  if (!ktorPathRegex.test(window.location.pathname)) {
    // 如果不是 ktor 页面，则不执行任何操作，直接返回
    return;
  }

  console.log(`[ImageSwitcher] Ktor page detected. Calling updateImageSources. isDark: ${isDark}`);

  const images = document.querySelectorAll('img.themed-image[data-dark-src]');
  console.log(`[ImageSwitcher] Found ${images.length} themed images to update.`);

  images.forEach((img, index) => {
    const lightSrc = img.dataset.lightSrc;
    const darkSrc = img.dataset.darkSrc;

    // ... (后续的图片处理逻辑保持不变)
    if (isDark) {
      if (img.src === darkSrc) return;

      const imageChecker = new Image();
      imageChecker.src = darkSrc;
      imageChecker.onload = () => img.src = darkSrc;
      imageChecker.onerror = () => {
        console.error(`[ImageSwitcher] Dark image FAILED to load at path: ${darkSrc}. Falling back to light source.`);
        if (img.src !== lightSrc) img.src = lightSrc;
      };
    } else {
      if (img.src !== lightSrc) img.src = lightSrc;
    }
  });
}

/**
 * [带日志版] 设置一个观察器来监听 VitePress 的主题切换。
 */
function setupThemeObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        // updateImageSources 函数内部会自己判断路径，所以这里直接调用即可
        updateImageSources(isDark);
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
}

/**
 * [带日志版] 这是需要导出的主函数。
 */
export function installImageSwitcher() {
  if (typeof window === 'undefined') return;

  window.requestAnimationFrame(() => {
    console.log('[ImageSwitcher] Client script installed.');

    // 1. 初始加载时立即检查并更新一次
    const isInitiallyDark = document.documentElement.classList.contains('dark');
    updateImageSources(isInitiallyDark);

    // 2. 监听主题切换
    setupThemeObserver();

    // 3. 监听 VitePress 页面导航 (SPA 切换)
    const appElement = document.getElementById('app');
    if (appElement) {
        const pageObserver = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            // 页面切换后，同样调用 updateImageSources，它会自己判断新页面的路径
            updateImageSources(isDark);
        });
        pageObserver.observe(appElement, { childList: true, subtree: true });
    }
  });
}
