[//]: # (title: 设置视口)
<show-structure for="none"/>

Compose Multiplatform for web 使用 `ComposeViewport` 函数将 UI 渲染到 HTML canvas 上。
它不会注入全局 CSS 样式，让您可以完全控制应用程序如何与 HTML 结构集成。

为了使内容正确适配浏览器窗口，请对宿主容器应用显式 CSS。
如果未指定 CSS，canvas 可能无法正确调整大小或填满预期空间。

以下是一个标准的 `styles.css` 示例，用于使内容充满整个屏幕：

```css
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
```

然后，在 Web 源集的 `main` 函数中初始化入口点：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(viewportContainerId = "composeApp") {
        App()
    }
}
```

> 之前使用的 `CanvasBasedWindow` 现已弃用。它曾会自动将 CSS 样式直接插入页面的 HTML 元素中，以强制 canvas 填满浏览器窗口。 
> 虽然对于独立应用来说更简单，但这种方法使得将 Compose 嵌入现有 Web 布局变得困难。 
> `ComposeViewport` 是一种更灵活的方法，它依赖于标准的基于 CSS 的布局管理。

## 下一步

* 了解如何[处理 Web 特定资源](compose-web-resources.md)。
* 详细了解 [Kotlin/Wasm 与 Compose Multiplatform](https://kotlinlang.org/docs/wasm-get-started.html)。