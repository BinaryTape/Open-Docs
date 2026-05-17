[//]: # (title: 處理 Web 資源)

在這裡，您可以找到有關使用瀏覽器特性和 `preload` API 預載資源，以及快取 Web 資源的資訊。
  
## Web 目標的資源預載

字型和圖片等 Web 資源是使用 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 非同步載入的。在初始載入期間或網路連線較慢時，資源擷取可能會導致視覺瑕疵，例如 [FOUT](https://fonts.google.com/knowledge/glossary/fout) 或顯示預留位置而非圖片。

此問題的一個典型範例是 `Text()` 組件包含自訂字型的文字，但包含必要字符（glyph）的字型仍在載入中。在這種情況下，使用者可能會暫時看到預設字型的文字，甚至是看到空白方框和問號而非字元。同樣地，對於圖片或可繪製資源（drawable），使用者在資源完全載入前可能會觀察到預留位置，例如空白或黑色方框。

為了防止視覺瑕疵，您可以使用內建的瀏覽器特性來預載資源、使用 Compose Multiplatform 預載 API，或是結合兩者。

### 使用瀏覽器特性預載資源

在現代瀏覽器中，您可以使用帶有 [`rel="preload"` 屬性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) 的 `<link>` 標籤來預載資源。此屬性會指示瀏覽器在應用程式啟動前優先下載並快取字型和圖片等資源，確保這些資源能及早可用。

例如，要在瀏覽器中啟用字型預載：

1. 組建應用程式的 Web 發行版本：

```console
   ./gradlew :shared:wasmJsBrowserDistribution
```

2. 在產生的 `dist` 目錄中找到所需的資源並儲存路徑。
3. 開啟 `wasmJsMain/resources/index.html` 檔案並在 `<head>` 元素中新增一個 `<link>` 標籤。
4. 將 `href` 屬性設定為資源路徑：

```html
<link rel="preload" href="./composeResources/username.shared.generated.resources/font/FiraMono-Regular.ttf" as="fetch" type="font/ttf" crossorigin/>
```

### 使用 Compose Multiplatform 預載 API
<primary-label ref="Experimental"/>

即使您已在瀏覽器中預載資源，它們仍是以原始位元組的形式快取，仍需要轉換為適合渲染的格式，例如 `FontResource` 和 `DrawableResource`。當應用程式首次請求資源時，轉換是非同步進行的，這可能再次導致閃爍。為了進一步優化體驗，Compose Multiplatform 資源針對高階資源表示形式擁有自己的內部快取，這些資源也可以被預載。

Compose Multiplatform 1.8.0 引入了用於在 Web 目標上預載字型和圖片資源的實驗性 API：`preloadFont()`、`preloadImageBitmap()` 和 `preloadImageVector()`。

此外，如果您需要表情符號（emoji）等特殊字元，可以設定與預設組合（bundled）選項不同的備用字型。要指定備用字型，請使用 `FontFamily.Resolver.preload()` 方法。

以下範例展示了如何使用預載和備用字型：

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
        // 覆寫資源位置
        resourcePathMapping { path -> "./$path" }
    }
    ComposeViewport(viewportContainerId = "composeApplication") {
        val font1 by preloadFont(Res.font.Workbench_Regular)
        val font2 by preloadFont(Res.font.font_awesome, FontWeight.Normal, FontStyle.Normal)
        val emojiFont = preloadFont(Res.font.NotoColorEmoji).value
        var fontsFallbackInitialized by remember { mutableStateOf(false) }

        // 為應用程式內容使用預載資源
        UseResources()

        if (font1 != null && font2 != null && emojiFont != null && fontsFallbackInitialized) {
            println("Fonts are ready")
        } else {
            // 顯示進度指示器，以解決 FOUT 或應用程式在載入期間暫時無法使用的問題
            Box(modifier = Modifier.fillMaxSize().background(Color.White.copy(alpha = 0.8f)).clickable {  }) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }
            println("Fonts are not ready yet")
        }

        val fontFamilyResolver = LocalFontFamilyResolver.current
        LaunchedEffect(fontFamilyResolver, emojiFont) {
            if (emojiFont != null) {
                // 預載包含表情符號的備用字型，以渲染組合字型不支援的缺失字符
                fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))
                fontsFallbackInitialized = true
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))"}

## 快取 Web 資源
<primary-label ref="Experimental"/>

Compose Multiplatform 使用 [Web Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) 來快取成功的快取回應，並避免瀏覽器預設快取機制通常會執行的冗餘 HTTP 重新驗證。

快取在每次應用程式啟動和頁面重新整理時都會全域清除。在此階段重設快取可確保資源一致性，因為在多個工作階段中重複使用快取可能會導致資源過時或不相容，進而導致應用程式當機或邏輯不一致。

為了防止對同一資源進行冗餘的並行擷取，實作中使用了資源特定鎖定。每個請求都由每個資源的互斥鎖（mutex）保護，在允許對不同資源進行平行請求的同時，對相同路徑的重複請求進行序列化處理。這種設計最小化了不必要的網路流量，並消除了快取填充期間的競爭條件。

## 接續步驟

* 進一步了解 [設定資源](compose-multiplatform-resources-setup.md) 以及 [在應用程式中使用資源](compose-multiplatform-resources-usage.md)。
* 了解如何管理應用程式的 [資源環境](compose-resource-environment.md)，例如應用程式內的主題和語言。