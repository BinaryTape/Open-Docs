[//]: # (title: 設定 viewport)
<show-structure for="none"/>

Compose Multiplatform for web 使用 `ComposeViewport` 函式將您的 UI 渲染到 HTML 畫布上。它不會插入全域 CSS 樣式，讓您能完全控制應用程式如何與 HTML 結構整合。

為了使內容正確適應瀏覽器視窗，請對宿主容器套用明確的 CSS。如果未指定 CSS，畫布可能無法正確調整大小或填滿預期空間。

以下是一個標準的 `styles.css` 範例，可讓內容填滿整個螢幕：

```css
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
```

接著，在您 web 原始碼集的 `main` 函式中初始化入口點：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(viewportContainerId = "webApp") {
        App()
    }
}
```

> 之前使用的 `CanvasBasedWindow` 目前已棄用。它會自動將 CSS 樣式直接插入頁面的 HTML 元素中，以強制畫布填滿瀏覽器視窗。雖然這對於獨立應用程式來說較為簡單，但這種做法會導致難以將 Compose 嵌入至現有的網頁配置中。`ComposeViewport` 是更靈活的方法，它依賴於標準的 CSS 版面配置管理。

## 下一步

* 了解如何[處理 Web 特定資源](compose-web-resources.md)。
* 閱讀更多關於 [Kotlin/Wasm 和 Compose Multiplatform](https://kotlinlang.org/docs/wasm-get-started.html) 的內容。