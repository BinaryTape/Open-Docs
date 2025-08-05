[//]: # (title: 探索可組合的程式碼)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教學 – 這兩個 IDE 共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是**使用共享邏輯和 UI 建立 Compose Multiplatform 應用程式**教學的第二部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="compose-multiplatform-create-first-app.md">建立您的 Compose Multiplatform 應用程式</a><br/>
      <img src="icon-2.svg" width="20" alt="第二步"/> <strong>探索可組合的程式碼</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="第三步"/> 修改專案<br/>      
      <img src="icon-4-todo.svg" width="20" alt="第四步"/> 建立您自己的應用程式<br/>
    </p>
</tldr>

讓我們仔細檢查 Kotlin Multiplatform 精靈建立的範例 composable。首先，有一個可組合的 `App()` 函式，它實作了通用 UI 並可在所有平台上使用。其次，有平台特定的程式碼，用於在每個平台上啟動此 UI。

## 實作可組合函式

在 `composeApp/src/commonMain/kotlin/App.kt` 檔案中，查看 `App()` 函式：

```kotlin
@Composable
@Preview
fun App() {
  MaterialTheme {
    var showContent by remember { mutableStateOf(false) }
    Column(
      modifier = Modifier
        .safeContentPadding()
        .fillMaxSize(),
      horizontalAlignment = Alignment.CenterHorizontally,
    ) {
      Button(onClick = { showContent = !showContent }) {
        Text("Click me!")
      }
      AnimatedVisibility(showContent) {
        val greeting = remember { Greeting().greet() }
        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
          Image(painterResource(Res.drawable.compose_multiplatform), null)
          Text("Compose: $greeting")
        }
      }
    }
  }
}
```

`App()` 函式是一個常規的 Kotlin 函式，並帶有 `@Composable` 註解。這類函式被稱為 _composable 函式_ 或簡稱為 _composables_。它們是基於 Compose Multiplatform 的 UI 的組成單元。

一個 composable 函式具有以下通用結構：

*   `MaterialTheme` 設定應用程式的外觀。預設設定可以自訂。例如，您可以選擇顏色、形狀和排版。
*   `Column` composable 控制應用程式的佈局。在這裡，它在 `AnimatedVisibility` composable 上方顯示一個 `Button`。
*   `Button` 包含 `Text` composable，它呈現一些文字。
*   `AnimatedVisibility` 使用動畫顯示和隱藏 `Image`。
*   `painterResource` 加載儲存在 XML 資源中的向量圖示。

`Column` 的 `horizontalAlignment` 參數將其內容置中。但要使其產生任何效果，該欄位應佔據其容器的全部寬度。這是透過使用 `modifier` 參數來實現的。

Modifier 是 Compose Multiplatform 的關鍵組件。這是您用於調整 UI 中 composables 外觀或行為的主要機制。Modifier 是使用 `Modifier` 類型的方法建立的。當您鏈接這些方法時，每次呼叫都可以更改從上次呼叫返回的 `Modifier`，這使得順序很重要。有關更多詳細資訊，請參閱 [JetPack Compose 文件](https://developer.android.com/jetpack/compose/modifiers)。

### 管理狀態

範例 composable 的最後一個方面是如何管理狀態。`App` composable 中的 `showContent` 屬性是使用 `mutableStateOf()` 函式建立的，這意味著它是一個可以被觀察的狀態物件：

```kotlin
var showContent by remember { mutableStateOf(false) }
```

狀態物件包裝在 `remember()` 函式呼叫中，這意味著它只建立一次，然後由框架保留。透過執行此操作，您可以建立一個屬性，其值是一個包含布林值的狀態物件。框架會快取此狀態物件，允許 composables 觀察它。

當狀態的值改變時，任何觀察它的 composables 都會被重新呼叫。這允許它們產生的任何小工具被重新繪製。這稱為 _重組_。

在您的應用程式中，狀態唯一改變的地方是按鈕的點擊事件中。`onClick` 事件處理程式會翻轉 `showContent` 屬性的值。因此，圖像會隨 `Greeting().greet()` 呼叫一起顯示或隱藏，因為父級 `AnimatedVisibility` composable 觀察 `showContent`。

## 在不同平台上啟動 UI

`App()` 函式的執行在每個平台上都不同。在 Android 上，它由 activity 管理；在 iOS 上，由 view controller 管理；在桌面版上，由視窗管理；在網頁版上，由容器管理。讓我們逐一檢查它們。

### 在 Android 上

對於 Android，請在 `composeApp/src/androidMain/kotlin` 中開啟 `MainActivity.kt` 檔案：

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            App()
        }
    }
}
```

這是一個名為 `MainActivity` 的 [Android activity](https://developer.android.com/guide/components/activities/intro-activities)，它會呼叫 `App` composable。

### 在 iOS 上

對於 iOS，請在 `composeApp/src/iosMain/kotlin` 中開啟 `MainViewController.kt` 檔案：

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

這是一個 [view controller](https://developer.apple.com/documentation/uikit/view_controllers)，它扮演著與 Android 上的 activity 相同的角色。請注意，iOS 和 Android 類型都只是呼叫 `App` composable。

### 在桌面版上

對於桌面版，請查看 `composeApp/src/desktopMain/kotlin` 中的 `main()` 函式：

```kotlin
fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "ComposeDemo") {
        App()
    }
}
```

*   在這裡，`application()` 函式會啟動一個新的桌面應用程式。
*   此函式接受一個 lambda，您可以在其中初始化 UI。通常，您會建立一個 `Window` 並指定屬性和指令，以規定程式在視窗關閉時應如何反應。在這種情況下，整個應用程式都會關閉。
*   在這個視窗內，您可以放置您的內容。與 Android 和 iOS 一樣，唯一的內容是 `App()` 函式。

目前，`App` 函式沒有宣告任何參數。在一個較大的應用程式中，您通常會將參數傳遞給平台特定的依賴項。這些依賴項可以手動建立，也可以使用依賴注入函式庫。

### 在網頁版上

在 `composeApp/src/wasmJsMain/kotlin/main.kt` 檔案中，查看 `main()` 函式：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(document.body!!) { App() }
}
```

*   `@OptIn(ExperimentalComposeUiApi::class)` 註解告訴編譯器，您正在使用一個標記為實驗性且可能在未來版本中更改的 API。
*   `ComposeViewport()` 函式會為應用程式設定 Compose 環境。
*   Web 應用程式會插入到作為 `ComposeViewport` 函式參數指定的容器中。在此範例中，整個文件的主體作為容器。
*   `App()` 函式負責使用 Jetpack Compose 建立應用程式的 UI 組件。

## 下一步

在教學的下一部分中，您將為專案新增一個依賴項並修改使用者介面。

**[繼續下一部分](compose-multiplatform-modify-project.md)**

## 取得協助

*   **Kotlin Slack**。取得 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
*   **Kotlin 問題追蹤器**。[回報新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。