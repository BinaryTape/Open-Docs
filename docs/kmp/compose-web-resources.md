[//]: # (title: 处理 Web 资源)

在这里，您可以找到有关使用浏览器功能和 `preload` API 预加载资源以及缓存 Web 资源的信息。
  
## Web 目标的资源预加载

字体和图片等 Web 资源是使用 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 异步加载的。在初始加载期间或网络连接较慢的情况下，提取资源可能会导致视觉瑕疵，例如 [FOUT](https://fonts.google.com/knowledge/glossary/fout) 或显示占位符而非图片。

此问题的一个典型示例是：当 `Text()` 组件包含使用自定义字体的文本，但包含必要字形的字体仍在加载时。在这种情况下，用户可能会暂时看到默认字体的文本，甚至看到空框和问号而非字符。类似地，对于图片或可绘制资源，用户可能会观察到诸如空白或黑色方块之类的占位符，直到资源完全加载。

为了防止视觉瑕疵，您可以使用内置的浏览器功能来预加载资源、使用 Compose Multiplatform 的预加载 API，或者将两者结合使用。

### 使用浏览器功能预加载资源

在现代浏览器中，您可以使用带有 [`rel="preload"` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) 的 `<link>` 标签来预加载资源。此属性指示浏览器在应用程序启动之前优先下载并缓存字体和图片等资源，从而确保这些资源能够尽早可用。

例如，要在浏览器中启用字体的预加载：

1. 构建应用程序的 Web 分发：

```console
   ./gradlew :composeApp:wasmJsBrowserDistribution
```

2. 在生成的 `dist` 目录中找到所需的资源并保存路径。
3. 打开 `wasmJsMain/resources/index.html` 文件，并在 `<head>` 元素内添加一个 `<link>` 标签。
4. 将 `href` 属性设置为资源路径：

```html
<link rel="preload" href="./composeResources/username.composeapp.generated.resources/font/FiraMono-Regular.ttf" as="fetch" type="font/ttf" crossorigin/>
```

### 使用 Compose Multiplatform 预加载 API 预加载资源
<primary-label ref="Experimental"/>

即使您在浏览器中预加载了资源，它们也会被缓存为原始字节，仍需要转换为适合渲染的格式，例如 `FontResource` 和 `DrawableResource`。当应用程序第一次请求该资源时，转换是异步完成的，这可能再次导致闪烁。为了进一步优化体验，Compose Multiplatform 资源拥有自己的内部缓存，用于存储资源的高层表示，这些表示也可以被预加载。

Compose Multiplatform 1.8.0 引入了一个实验性 API，用于在 Web 目标上预加载字体和图片资源：`preloadFont()`、`preloadImageBitmap()` 和 `preloadImageVector()`。

此外，如果您需要表情符号等特殊字符，可以设置不同于默认捆绑选项的回退字体。要指定回退字体，请使用 `FontFamily.Resolver.preload()` 方法。

以下示例演示了如何使用预加载和回退字体：

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFontFamilyResolver
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.window.ComposeViewport
import components.resources.demo.shared.generated.resources.*
import components.resources.demo.shared.generated.resources.NotoColorEmoji
import components.resources.demo.shared.generated.resources.Res
import components.resources.demo.shared.generated.resources.Workbench_Regular
import components.resources.demo.shared.generated.resources.font_awesome
import org.jetbrains.compose.resources.ExperimentalResourceApi
import org.jetbrains.compose.resources.configureWebResources
import org.jetbrains.compose.resources.demo.shared.UseResources
import org.jetbrains.compose.resources.preloadFont

@OptIn(ExperimentalComposeUiApi::class, ExperimentalResourceApi::class, InternalComposeUiApi::class)
fun main() {
    configureWebResources {
        // 替代资源位置
        resourcePathMapping { path -> "./$path" }
    }
    ComposeViewport(viewportContainerId = "composeApplication") {
        val font1 by preloadFont(Res.font.Workbench_Regular)
        val font2 by preloadFont(Res.font.font_awesome, FontWeight.Normal, FontStyle.Normal)
        val emojiFont = preloadFont(Res.font.NotoColorEmoji).value
        var fontsFallbackInitialized by remember { mutableStateOf(false) }

        // 为应用内容使用预加载的资源
        UseResources()

        if (font1 != null && font2 != null && emojiFont != null && fontsFallbackInitialized) {
            println("Fonts are ready")
        } else {
            // 显示进度指示器以解决 FOUT 或应用在加载期间暂时无法正常运行的问题
            Box(modifier = Modifier.fillMaxSize().background(Color.White.copy(alpha = 0.8f)).clickable {  }) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }
            println("Fonts are not ready yet")
        }

        val fontFamilyResolver = LocalFontFamilyResolver.current
        LaunchedEffect(fontFamilyResolver, emojiFont) {
            if (emojiFont != null) {
                // 预加载带有表情符号的回退字体，以渲染捆绑字体不支持的缺失字形
                fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))
                fontsFallbackInitialized = true
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))"}

## 缓存 Web 资源
<primary-label ref="Experimental"/>

Compose Multiplatform 使用 [Web Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) 来缓存成功的响应，并避免浏览器默认缓存机制通常执行的冗余 HTTP 重新验证。

缓存会在每次应用启动和页面刷新时全局清除。在此阶段重置缓存可确保资源的一致性，因为跨多个会话重用缓存可能会导致资源过时或不兼容，从而可能引发应用程序崩溃或逻辑不一致。

为了防止针对同一资源的冗余并发提取，该实现使用了资源特定的锁。每个请求都由每个资源的互斥锁 (mutex) 保护，允许对不同资源进行并行请求，同时对指向同一路径的重复请求进行序列化。这种设计最大限度地减少了不必要的网络流量，并消除了缓存填充过程中的竞态条件。

## 下一步？

* 详细了解[设置资源](compose-multiplatform-resources-setup.md)以及[在应用中使用它们](compose-multiplatform-resources-usage.md)。
* 了解如何管理应用程序的[资源环境](compose-resource-environment.md)，例如应用内主题和语言。