[//]: # (title: 探索可組合程式碼)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教程 – 這兩個 IDE 共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是 **使用共享邏輯和 UI 建立 Compose Multiplatform 應用程式** 教程的第二部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">建立您的 Compose Multiplatform 應用程式</Links><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>探索可組合程式碼</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> 修改專案<br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 建立您自己的應用程式<br/>
    </p>
</tldr>

讓我們仔細檢查由 Kotlin Multiplatform 精靈建立的範例 composable (可組合項)。首先，有一個實作通用使用者介面並可在所有平台上使用的可組合函式 `App()`。其次，有在每個平台上啟動此 UI 的平台專屬程式碼。

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

`App()` 函式是一個常規的 Kotlin 函式，並使用 `@Composable` 進行註解。這類函式被稱為 _可組合函式_ 或簡稱為 _composables_ (可組合項)。它們是基於 Compose Multiplatform 的 UI 的建構區塊。

可組合函式具有以下一般結構：

*   `MaterialTheme` 設定應用程式的外觀。預設設定可以自訂。例如，您可以選擇顏色、形狀和排版。
*   `Column` composable 控制應用程式的佈局。在這裡，它顯示一個 `Button` 在 `AnimatedVisibility` composable 的上方。
*   `Button` 包含 `Text` composable，後者渲染一些文字。
*   `AnimatedVisibility` 使用動畫顯示和隱藏 `Image`。
*   `painterResource` 從 XML 資源中載入向量圖示。

`Column` 的 `horizontalAlignment` 參數將其內容置中。但為了使其生效，該 column 應佔據其容器的全部寬度。這可透過使用 `modifier` 參數來實現。

`Modifier` 是 Compose Multiplatform 的關鍵組件。這是您用來調整 UI 中 composable 的外觀或行為的主要機制。`Modifier` 是使用 `Modifier` 類型的方法建立的。當您將這些方法串聯起來時，每次呼叫都可以改變從上一次呼叫返回的 `Modifier`，這使得順序很重要。有關更多詳情，請參閱 [JetPack Compose 文件](https://developer.android.com/jetpack/compose/modifiers)。

### 管理狀態

範例 composable 的最後一個方面是如何管理狀態。`App` composable 中的 `showContent` 屬性是使用 `mutableStateOf()` 函式建立的，這意味著它是一個可以被觀察的狀態物件：

```kotlin
var showContent by remember { mutableStateOf(false) }
```

狀態物件被包裝在對 `remember()` 函式的呼叫中，這意味著它會被建立一次，然後由框架保留。透過執行此操作，您會建立一個其值為包含布林值的狀態物件的屬性。框架會快取此狀態物件，允許 composable 觀察它。

當狀態值改變時，任何觀察它的 composable 都會被重新叫用。這允許它們產生的任何小工具被重新繪製。這被稱為 _重組_。

在您的應用程式中，唯一改變狀態的地方是按鈕的點擊事件。`onClick` 事件處理器會翻轉 `showContent` 屬性的值。因此，圖像會隨著 `Greeting().greet()` 呼叫一起顯示或隱藏，因為父級 `AnimatedVisibility` composable 觀察 `showContent`。

## 在不同平台上啟動 UI

`App()` 函式的執行方式因平台而異。在 Android 上，它由 activity 管理；在 iOS 上，由 view controller 管理；在桌面端，由 window 管理；在網頁上，由 container 管理。讓我們逐一檢視它們。

### 在 Android 上

對於 Android，開啟 `composeApp/src/androidMain/kotlin` 中的 `MainActivity.kt` 檔案：

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

這是一個名為 `MainActivity` 的 [Android activity](https://developer.android.com/guide/components/activities/intro-activities)，它會叫用 `App` composable。

### 在 iOS 上

對於 iOS，開啟 `composeApp/src/iosMain/kotlin` 中的 `MainViewController.kt` 檔案：

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

這是一個 [view controller](https://developer.apple.com/documentation/uikit/view_controllers)，其作用與 Android 上的 activity 相同。請注意，iOS 和 Android 類型都只是簡單地叫用 `App` composable。

### 在桌面端

對於桌面端，請查看 `composeApp/src/jvmMain/kotlin` 中的 `main()` 函式：

```kotlin
fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "ComposeDemo") {
        App()
    }
}
```

*   在這裡，`application()` 函式會啟動一個新的桌面應用程式。
*   此函式接受一個 lambda，您可以在其中初始化 UI。通常，您會建立一個 `Window` 並指定屬性和指令，以決定程式在視窗關閉時應如何反應。在這種情況下，整個應用程式會關閉。
*   在此視窗內，您可以放置您的內容。與 Android 和 iOS 一樣，唯一的內容是 `App()` 函式。

目前，`App` 函式未宣告任何參數。在較大型的應用程式中，您通常會將參數傳遞給平台專屬的依賴項。這些依賴項可以手動建立，或使用依賴注入庫。

### 在網頁上

在 `composeApp/src/wasmJsMain/kotlin/main.kt` 檔案中，查看 `main()` 函式：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(document.body!!) { App() }
}
```

*   `@OptIn(ExperimentalComposeUiApi::class)` 註解告訴編譯器您正在使用一個標記為實驗性並可能在未來版本中變更的 API。
*   `ComposeViewport()` 函式為應用程式設定 Compose 環境。
*   網頁應用程式會插入到作為 `ComposeViewport` 函式參數指定的容器中。在此範例中，整個文件的主體作為容器。
*   `App()` 函式負責使用 Jetpack Compose 建立應用程式的 UI 組件。

## 下一步

在教程的下一部分，您將向專案新增依賴項並修改使用者介面。

**[繼續前往下一部分](compose-multiplatform-modify-project.md)**

## 取得協助

*   **Kotlin Slack**。取得 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
*   **Kotlin 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。