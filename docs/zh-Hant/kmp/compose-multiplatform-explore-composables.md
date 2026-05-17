[//]: # (title: 探索 composable 程式碼)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行 —— 兩款 IDE 共享相同的核心功能與 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是<strong>「使用共享邏輯與 UI 建立 Compose Multiplatform 應用程式」</strong>教學的第二部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行 —— 兩款 IDE 共享相同的核心功能與 Kotlin Multiplatform 支援。這是「使用共享邏輯與 UI 建立 Compose Multiplatform 應用程式」教學的第一部分。建立您的 Compose Multiplatform 應用程式 探索 composable 程式碼 修改專案 建立您自己的應用程式">建立您的 Compose Multiplatform 應用程式</Links><br/>
      <img src="icon-2.svg" width="20" alt="第二步"/> <strong>探索 composable 程式碼</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="第三步"/> 修改專案<br/>      
      <img src="icon-4-todo.svg" width="20" alt="第四步"/> 建立您自己的應用程式<br/>
    </p>
</tldr>

讓我們仔細檢查由 Kotlin Multiplatform 精靈建立的範例 composable。首先，有一個實作通用 UI 並可在所有平台上使用的 composable `App()` 函式。其次，有在各個平台上啟動此 UI 的平台特定程式碼。

## 實作 composable 函式

在 `shared/src/commonMain/kotlin/App.kt` 檔案中，查看 `App()` 函式：

undefined

`App()` 函式是一個帶有 `@Composable` 註解的正規 Kotlin 函式。這類函式被稱為 _composable 函式_ 或簡稱為 _composables_。它們是基於 Jetpack Compose 或 Compose Multiplatform 的 UI 構建區塊。

此 `App()` 函式被用作應用程式 UI 架構的基礎，具有以下結構：

* `MaterialTheme()` 設定應用程式的外觀。預設設定可以自訂。例如，您可以選擇顏色、形狀與排版。
* `Column()` composable 控制應用程式的配置。在這裡，它在 `AnimatedVisibility()` composable 之上顯示一個 `Button`。
* `Button()` 包含 `Text` composable，用於在按鈕上方呈現文字。
* `AnimatedVisibility()` 呼叫被設定為在按下按鈕時，使用動畫顯示和隱藏 `Image`。
* `painterResource()` 載入儲存為 XML 檔案的向量圖示。

`Column()` 函式的 `horizontalAlignment` 參數會將 column 的內容居中。為了使其產生效果，該 column 應該佔滿其容器的完整寬度。您可以透過使用 `modifier` 參數來實現此目的。

Modifier 是 Jetpack Compose 與 Compose Multiplatform 的關鍵組建。它們提供了調整 UI 中 composable 外觀或行為的主要機制。Modifier 是使用 `Modifier` 型別的方法建立的。當您鏈結這些方法時，每次呼叫都可以更改前一次呼叫傳回的 `Modifier`，這使得順序變得非常重要。請參閱 [Compose Multiplatform modifier 介紹](https://kotlinlang.org/docs/multiplatform/compose-layout-modifiers.html#built-in-modifiers)與詳盡的 [Jetpack Compose modifier 文件](https://developer.android.com/jetpack/compose/modifiers)以了解更多詳細資訊。

## 管理狀態

載入的圖片具有持久性：除非使用者點擊按鈕，否則它應該在重組 (recomposition) 過程中始終保持顯示或隱藏。`App()` composable 中的 `showContent` 屬性是使用 `mutableStateOf()` 函式建構的，這意味著它是一個可以被觀察的狀態物件：

```kotlin
var showContent by remember { mutableStateOf(false) }
```

狀態物件被包裝在 `remember()` 呼叫中，這意味著它僅建構一次，然後由架構保留。透過這種方式，`showContent` 屬性具有一個值，該值是包含布林值的狀態物件。架構會快取此狀態物件，允許 composable 觀察它。

當狀態的值發生變化時，任何觀察它的 composable 都會被重新叫用。這使得它們產生的任何小工具都能夠被重新繪製。這被稱為 _重組 (recomposition)_。

唯一改變狀態的地方是在 `Button()` 呼叫的 `onClick` 參數中。事件處理常式會反轉 `showContent` 屬性的值。因此，由於父層 `AnimatedVisibility()` composable 觀察了 `showContent`，圖片會隨著 `Greeting().greet()` 呼叫一起顯示或隱藏。

## 在不同平台啟動 UI

每個平台的 `App()` 函式執行方式都不同：

* 在 Android 上，它由 activity 管理。
* 在 iOS 上，由 view controller 管理。
* 在桌面上，由視窗管理。
* 在 web 上，由容器管理。

讓我們逐一檢查。

### 在 Android 上

對於 Android，開啟 `androidApp/src/main/kotlin` 中的 `MainActivity.kt` 檔案：

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

這是一個名為 `MainActivity` 的 [Android activity](https://developer.android.com/guide/components/activities/intro-activities)，它會叫用宣告在共用程式碼中的 `App()` composable。

### 在 iOS 上

對於 iOS，開啟 `shared/src/iosMain/kotlin` 中的 `MainViewController.kt` 檔案：

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

這是一個 [view controller](https://developer.apple.com/documentation/uikit/view_controllers)，其扮演的角色與 Android 上的 activity 相同。請注意，iOS 和 Android 型別都只是單純地叫用共用程式碼中的 `App()` composable。

### 在桌面上

對於桌面，在 `desktopApp/src/main/kotlin` 中尋找 `main.kt` 檔案：

```kotlin
fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "ComposeDemo"
    ) {
        App()
    }
}
```

* 在這裡，`application()` 函式啟動一個新的桌面應用程式。此函式接受一個 lambda，用於初始化 UI。
* 通常，在 `application()` 函式內，您會建立一個 `Window` 並指定其屬性，以及程式在視窗關閉時應執行的指令 (`onCloseRequest`)。在預設專案中，整個應用程式會關閉 (`::exitApplication`)。
* 在視窗內，您可以放置內容。與 Android 和 iOS 一樣，唯一的內容是 `App()` composable 提供的 UI 配置。

在此範例中，`App()` 函式不接受任何參數。在較大的應用程式中，您通常會將參數傳遞給平台特定的相依性。這些相依性可以手動編寫，或使用相依注入程式庫傳遞。

### 在 web 上

在 `webApp/src/webMain/kotlin/` 目錄下的 `main.kt` 檔案中，查看 `main()` 函式：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport {
        App()
    }
}
```

* `@OptIn(ExperimentalComposeUiApi::class)` 註解告訴編譯器，您正在使用被標記為實驗性的 Compose API，且可能會在未來版本中發生變化。
* `ComposeViewport{}` 函式為應用程式設定 Compose 環境。
* web 應用程式會插入到作為 `ComposeViewport` 函式參數指定的容器中。
* `App()` 函式負責使用 Jetpack Compose 建構應用程式的 UI 組建。

## 下一步

在教學的下一部分中，您將在專案中加入相依性並修改使用者介面。

**[繼續前往下一部分](compose-multiplatform-modify-project.md)**

## 獲取幫助

* **Kotlin Slack**。獲取[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。