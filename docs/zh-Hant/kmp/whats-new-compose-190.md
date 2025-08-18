[//]: # (title: Compose Multiplatform %org.jetbrains.compose-eap% 的新功能)

以下是此 EAP 功能發行版的重要亮點：

*   [Material 3 表達性主題](#new-material-3-expressive-theme)
*   [可自訂陰影](#customizable-shadows)
*   [@Preview 註解的參數](#parameters-for-the-preview-annotation)
*   [iOS 上的畫面更新率配置](#frame-rate-configuration)
*   [網頁目標上的輔助功能支援](#accessibility-support)
*   [用於嵌入 HTML 內容的新 API](#new-api-for-embedding-html-content)

請參閱 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.9.0-beta01) 上此發行版的完整變更列表。

## 相依性

*   Gradle 外掛程式 `org.jetbrains.compose`，版本 `%org.jetbrains.compose-eap%`。基於 Jetpack Compose 函式庫：
    *   [Runtime 1.9.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.9.0-rc01)
    *   [UI 1.9.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.9.0-rc01)
    *   [Foundation 1.9.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.9.0-rc01)
    *   [Material 1.9.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-material#1.9.0-rc01)
    *   [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
*   Compose Material3 函式庫 `org.jetbrains.compose.material3:1.9.0-beta03`。基於 [Jetpack Material3 1.4.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-beta01)。

    通用 Material3 函式庫的穩定版本基於 Jetpack Compose Material3 1.3.2，但由於 Compose Multiplatform 和 Material3 的[解耦版本控制](#decoupled-material3-versioning)，您可以為專案選擇較新的預發行版本。
*   Compose Material3 Adaptive 函式庫 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha05`。基於 [Jetpack Material3 Adaptive 1.2.0-alpha10](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.2.0-alpha10)
*   Lifecycle 函式庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.2`。基於 [Jetpack Lifecycle 2.9.2](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.2)
*   Navigation 函式庫 `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta05`。基於 [Jetpack Navigation 2.9.1](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.1)
*   Savedstate 函式庫 `org.jetbrains.androidx.savedstate:savedstate:1.3.2`。基於 [Jetpack Savedstate 1.3.1](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.1)
*   WindowManager Core 函式庫 `org.jetbrains.androidx.window:window-core:1.4.0-beta01`。基於 [Jetpack WindowManager 1.4.0](https://developer.android.com/jetpack/androidx/releases/window#1.4.0)

## 破壞性變更

為與 Jetpack Material3 [1.4.0-beta01 發行版](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-beta01)保持一致，Compose Multiplatform 已移除所有標記為 `ExperimentalMaterial3ExpressiveApi` 和 `ExperimentalMaterial3ComponentOverrideApi` 的公共 API。

如果您想繼續使用這些實驗性功能，可以明確地包含先前的 Material3 Alpha 版本：

```kotlin
implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
```

## 跨平台

### @Preview 註解的參數

Compose Multiplatform 中的 `@Preview` 註解現在包含額外參數，用於設定 `@Composable` 函式在設計時預覽中的渲染方式：

*   `name`：預覽的顯示名稱。
*   `group`：預覽的群組名稱，可實現相關預覽的邏輯組織和選擇性顯示。
*   `widthDp`：最大寬度 (單位為 dp)。
*   `heightDp`：最大高度 (單位為 dp)。
*   `locale`：應用程式目前的語系。
*   `showBackground`：一個旗標，用於將預設背景顏色應用於預覽。
*   `backgroundColor`：一個 32 位元 ARGB 色彩整數，定義預覽的背景顏色。

這些新的預覽參數在 IntelliJ IDEA 和 Android Studio 中均可辨識並運作。

### 可自訂陰影

在 Compose Multiplatform %org.jetbrains.compose-eap% 中，我們引入了可自訂陰影，採用了 Jetpack Compose 的新陰影原始物件和 API。除了先前支援的 `shadow` 修飾符外，您現在可以使用新的 API 來創建更進階和靈活的陰影效果。

有兩個新的原始物件可用於創建不同類型的陰影：`DropShadowPainter()` 和 `InnerShadowPainter()`。

若要將這些新陰影套用於 UI 元件，請使用 `dropShadow` 或 `innerShadow` 修飾符配置陰影效果：

<list columns="2">
   <li><code-block lang="kotlin" code="        Box(&#10;            Modifier.size(120.dp)&#10;                .dropShadow(&#10;                    RectangleShape,&#10;                    DropShadow(12.dp)&#10;                )&#10;                .background(Color.White)&#10;        )&#10;        Box(&#10;            Modifier.size(120.dp)&#10;                .innerShadow(&#10;                    RectangleShape,&#10;                    InnerShadow(12.dp)&#10;                )&#10;        )"/></li>
   <li><img src="compose-advanced-shadows.png" type="inline" alt="Customizable shadows" width="200"/></li>
</list>

您可以繪製任何形狀和顏色的陰影，甚至可以使用陰影幾何圖形作為遮罩來創建內部漸層填充陰影：

<img src="compose-expressive-shadows.png" alt="Expressive shadows" width="244"/>

詳情請參閱 [陰影 API 參考資料](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/shadow/package-summary.html)。

### 新增 Material 3 表達性主題
<secondary-label ref="Experimental"/>

Compose Multiplatform 現在支援 Material 3 函式庫中的實驗性 [`MaterialExpressiveTheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary?hl=en#MaterialExpressiveTheme(androidx.compose.material3.ColorScheme,androidx.compose.material3.MotionScheme,androidx.compose.material3.Shapes,androidx.compose.material3.Typography,kotlin.Function0))。表達性主題設計允許您自訂 Material Design 應用程式以獲得更個人化的體驗。

若要使用表達性主題：

1.  包含最新版本的 Material 3：

    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
    ```

2.  使用 `MaterialExpressiveTheme()` 函式與 `@OptIn(ExperimentalMaterial3ExpressiveApi::class)` 選擇啟用，透過設定 `colorScheme`、`motionScheme`、`shapes` 和 `typography` 參數來配置 UI 元素的整體主題。

然後，Material 元件，例如 [`Button()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-button.html) 和 [`Checkbox()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-checkbox.html)，將自動使用您提供的值。

<img src="compose_expressive_theme.animated.gif" alt="Material 3 Expressive" width="250" preview-src="compose_expressive_theme.png"/>

### `androidx.compose.runtime:runtime` 中的多平台目標

為改善 Compose Multiplatform 與 Jetpack Compose 的一致性，我們已將所有目標支援直接新增到 `androidx.compose.runtime:runtime` 構件中。

`org.jetbrains.compose.runtime:runtime` 構件保持完全相容，現在作為別名使用。

### 帶 `suspend` lambda 的 `runComposeUiTest()`

`runComposeUiTest()` 函式現在接受 `suspend` lambda，允許您使用 `awaitIdle()` 等暫停函式。

新的 API 保證了所有支援平台上的正確測試執行，包括網頁環境的適當非同步處理：

*   對於 JVM 和原生目標，`runComposeUiTest()` 的功能類似於 `runBlocking()`，但會跳過延遲。
*   對於網頁目標 (Wasm 和 JS)，它會回傳 `Promise` 並在跳過延遲的情況下執行測試主體。

## iOS

### 畫面更新率配置

Compose Multiplatform for iOS 現在支援配置渲染可組合項的首選畫面更新率。如果動畫卡頓，您可能需要提高畫面更新率。另一方面，如果動畫緩慢或靜態，您可能希望以較低的畫面更新率運行以減少功耗。

您可以設定首選畫面更新率類別如下：

```kotlin
Modifier.preferredFrameRate(FrameRateCategory.High)
```

或者，如果您需要特定畫面更新率的可組合項，可以使用非負數定義每秒影格數的首選畫面更新率：

```kotlin
Modifier.preferredFrameRate(30f)
```

## 網頁

### 輔助功能支援

Compose Multiplatform 現在為網頁目標提供初始輔助功能支援。此版本允許螢幕閱讀器存取描述標籤，並允許使用者在輔助功能導航模式下導航和點擊按鈕。

在此版本中，以下功能尚未支援：

*   互操作和帶捲軸和滑桿的容器檢視的輔助功能。
*   遍歷索引。

您可以定義元件的[語義屬性](compose-accessibility.md#semantic-properties)以向輔助功能服務提供各種詳細資訊，例如元件的文字描述、功能類型、目前狀態或唯一識別碼。

例如，透過在可組合項上設定 `Modifier.semantics { heading() }`，您可以通知輔助功能服務此元素作為標題，類似於文件中的章節或小節標題。螢幕閱讀器隨後可以使用此資訊進行內容導航，允許使用者直接在標題之間跳轉。

```kotlin
Text(
    text = "This is heading", 
    modifier = Modifier.semantics { heading() }
)
```

輔助功能支援現在預設啟用，但您可以隨時透過調整 `isA11YEnabled` 來停用它：

```kotlin
ComposeViewport(
    viewportContainer = document.body!!,
    configure = { isA11YEnabled = false }
) {
    Text("Hello, Compose Multiplatform for web")
}
```

### 用於嵌入 HTML 內容的新 API

透過新的 `WebElementView()` 可組合函式，您可以將 HTML 元素無縫整合到您的網頁應用程式中。

嵌入的 HTML 元素會根據 Compose 程式碼中定義的大小覆蓋畫布區域。它會攔截該區域內的輸入事件，阻止 Compose Multiplatform 接收這些事件。

以下是 `WebElementView()` 用於創建和嵌入 HTML 元素的一個範例，該元素在 Compose 應用程式中顯示互動式地圖檢視：

```kotlin
private val ttOSM =
    "https://www.openstreetmap.org/export/embed.html?bbox=4.890965223312379%2C52.33722052818563%2C4.893990755081177%2C52.33860862450587&amp;layer=mapnik"

@Composable
fun Map() {
    Box(
        modifier = Modifier.fillMaxWidth().fillMaxHeight()
    ) {
        WebElementView(
            factory = {
                (document.createElement("iframe")
                        as HTMLIFrameElement)
                    .apply { src = ttOSM }
            },
            modifier = Modifier.fillMaxSize(),
            update = { iframe -> iframe.src = iframe.src }
        )
    }
}
```

請注意，您只能將此函式與 `ComposeViewport` 進入點一起使用，因為 `CanvasBasedWindow` 已棄用。

### 環境選單

Compose Multiplatform %org.jetbrains.compose-eap% 為網頁環境選單帶來了以下更新：

*   文字環境選單：標準 Compose 文字環境選單現在完全支援行動裝置和桌面模式。
*   新增可自訂環境選單：我們採用了 Jetpack Compose 的新 API 用於自訂網頁環境選單。目前，它僅在桌面模式下可用。

    若要啟用此新 API，請在應用程式進入點中使用以下設定：

    ```kotlin
    ComposeFoundationFlags.isNewContextMenuEnabled = true
    ```

### 簡化綁定導航圖的 API

Compose Multiplatform 引入了一個新的 API，用於將瀏覽器的導航狀態綁定到 `NavController`：

```kotlin
suspend fun NavController.bindToBrowserNavigation()
```

新函式不再需要直接與 `window` API 互動，簡化了 Kotlin/Wasm 和 Kotlin/JS 原始碼集。

先前使用的 `Window.bindToNavigation()` 函式已棄用，並由新的 `NavController.bindToBrowserNavigation()` 函式取代。

之前：

```kotlin
LaunchedEffect(Unit) {
    // Directly interacts with the window object
    window.bindToNavigation(navController)
}
```

之後：

```kotlin
LaunchedEffect(Unit) {
    // Implicitly accesses the window object
    navController.bindToBrowserNavigation()
}
```

## Gradle 外掛程式

### Material3 版本解耦

Material3 函式庫和 Compose Multiplatform Gradle 外掛程式的版本和穩定性等級不再需要保持一致。`compose.material3` DSL 別名現在參考來自 Jetpack Compose 先前穩定發行版的 Material3 1.8.2。

如果您想使用支援表達性設計的較新 Material3 版本，請將 `build.gradle.kts` 中的 Material 3 相依性替換為以下內容：

```kotlin
implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
```