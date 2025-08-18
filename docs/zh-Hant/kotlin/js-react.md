[//]: # (title: 使用 React 和 Kotlin/JS 建置網路應用程式 — 教程)

<no-index/>

本教程將教您如何使用 Kotlin/JS 和 [React](https://reactjs.org/) 框架建置瀏覽器應用程式。您將：

* 完成與建置典型 React 應用程式相關的常見任務。
* 探索 [Kotlin 的 DSLs](type-safe-builders.md) 如何幫助簡潔一致地表達概念，而無需犧牲可讀性，讓您能夠完全使用 Kotlin 編寫一個功能完整的應用程式。
* 學習如何使用現成的 npm 元件、使用外部函式庫並發佈最終應用程式。

輸出結果將是一個專為 [KotlinConf](https://kotlinconf.com/) 活動打造的 _KotlinConf Explorer_ 網路應用程式，其中包含會議演講的連結。使用者將能夠在一個頁面上觀看所有演講並將它們標記為已看或未看。

本教程假設您對 Kotlin 有先前的知識，並對 HTML 和 CSS 有基本了解。了解 React 背後的基本概念可能會有助於您理解一些範例程式碼，但並非嚴格要求。

> 您可以在此處取得最終應用程式：[here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)。
>
{style="note"}

## 開始之前

1.  下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。
2.  複製 [專案範本](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle) 並在 IntelliJ IDEA 中開啟它。此範本包含一個基本的 Kotlin 多平台 Gradle 專案，其中包含所有必要的配置和依賴項。

    *   `build.gradle.kts` 檔案中的依賴項和任務：

    ```kotlin
    dependencies {
        // React, React DOM + Wrappers
        implementation(enforcedPlatform("org.jetbrains.kotlin-wrappers:kotlin-wrappers-bom:1.0.0-pre.430"))
        implementation("org.jetbrains.kotlin-wrappers:kotlin-react")
        implementation("org.jetbrains.kotlin-wrappers:kotlin-react-dom")

        // Kotlin React Emotion (CSS)
        implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")

        // Video Player
        implementation(npm("react-player", "2.12.0"))

        // Share Buttons
        implementation(npm("react-share", "4.4.1"))

        // Coroutines & serialization
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
    }
    ```

    *   `src/jsMain/resources/index.html` 中的 HTML 範本頁面，用於插入您將在本教程中使用的 JavaScript 程式碼：

    ```html
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Hello, Kotlin/JS!</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="confexplorer.js"></script>
    </body>
    </html>
    ```
    {validate="false"}

    Kotlin/JS 專案在建置時會自動將所有程式碼及其依賴項捆綁到一個單一的 JavaScript 檔案中，該檔案與專案同名，即 `confexplorer.js`。作為一個典型的 [JavaScript 慣例](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)，`body` 的內容（包括 `root` div）會優先載入，以確保瀏覽器在腳本之前載入所有頁面元素。

*   `src/jsMain/kotlin/Main.kt` 中的程式碼片段：

    ```kotlin
    import kotlinx.browser.document

    fun main() {
        document.bgColor = "red"
    }
    ```

### 執行開發伺服器

預設情況下，Kotlin Multiplatform Gradle 插件支援嵌入式 `webpack-dev-server`，允許您從 IDE 執行應用程式，而無需手動設定任何伺服器。

若要測試程式是否成功在瀏覽器中執行，請從 IntelliJ IDEA 內的 Gradle 工具視窗呼叫 `run` 或 `browserDevelopmentRun` 任務（可在 `other` 或 `kotlin browser` 目錄中找到）來啟動開發伺服器：

![Gradle 任務列表](browser-development-run.png){width=700}

若要從終端機執行程式，請改用 `./gradlew run`。

當專案編譯並捆綁後，瀏覽器視窗中將會出現一個空白的紅色頁面：

![空白紅色頁面](red-page.png){width=700}

### 啟用熱重載 / 持續模式

配置 [_持續編譯_](dev-server-continuous-compilation.md) 模式，這樣您就不必在每次更改後手動編譯和執行您的專案。請務必在繼續之前停止所有正在執行的開發伺服器實例。

1.  編輯 IntelliJ IDEA 在首次執行 Gradle `run` 任務後自動生成的執行配置：

    ![編輯執行配置](edit-configurations-continuous.png){width=700}

2.  在 **Run/Debug Configurations**（執行/偵錯配置）對話框中，為執行配置的引數新增 `--continuous` 選項：

    ![啟用持續模式](continuous-mode.png){width=700}

    應用變更後，您可以使用 IntelliJ IDEA 中的 **Run**（執行）按鈕重新啟動開發伺服器。若要從終端機執行持續的 Gradle 建置，請改用 `./gradlew run --continuous`。

3.  若要測試此功能，請在 Gradle 任務執行期間更改 `Main.kt` 檔案中的頁面顏色為藍色：

    ```kotlin
    document.bgColor = "blue"
    ```

    專案隨後會重新編譯，重新載入後瀏覽器頁面將顯示新顏色。

您可以在開發過程中讓開發伺服器保持持續模式執行。當您進行更改時，它將自動重新建置並重新載入頁面。

> 您可以在 `master` 分支的此處找到該專案的狀態：[here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)。
>
{style="note"}

## 建立網頁應用程式草稿

### 使用 React 新增第一個靜態頁面

若要讓您的應用程式顯示一條簡單訊息，請將 `Main.kt` 檔案中的程式碼替換為以下內容：

```kotlin
import kotlinx.browser.document
import react.*
import emotion.react.css
import csstype.Position
import csstype.px
import react.dom.html.ReactHTML.h1
import react.dom.html.ReactHTML.h3
import react.dom.html.ReactHTML.div
import react.dom.html.ReactHTML.p
import react.dom.html.ReactHTML.img
import react.dom.client.createRoot
import kotlinx.serialization.Serializable

fun main() {
    val container = document.getElementById("root") ?: error("Couldn't find root container!")
    createRoot(container).render(Fragment.create {
        h1 {
            +"Hello, React+Kotlin/JS!"
        }
    })
}
```
{validate="false"}

*   `render()` 函數指示 [kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom) 將片段中的第一個 HTML 元素渲染到 `root` 元素。此元素是範本中包含的 `src/jsMain/resources/index.html` 中定義的容器。
*   內容是一個 `<h1>` 標頭，並使用型別安全 DSL 渲染 HTML。
*   `h1` 是一個接受 lambda 參數的函數。當您在字串常值前加上 `+` 符號時，實際上是透過 [運算子多載](operator-overloading.md) 呼叫了 `unaryPlus()` 函數。它將字串附加到封裝的 HTML 元素。

當專案重新編譯時，瀏覽器會顯示此 HTML 頁面：

![HTML 頁面範例](hello-react-js.png){width=700}

### 將 HTML 轉換為 Kotlin 的型別安全 HTML DSL

React 的 Kotlin [封裝器 (wrappers)](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README.md) 帶有一個 [領域特定語言 (DSL)](type-safe-builders.md)，可以完全在 Kotlin 程式碼中編寫 HTML。這樣一來，它就類似於 JavaScript 中的 [JSX](https://reactjs.org/docs/introducing-jsx.html)。然而，由於這種標記是 Kotlin，您將獲得靜態型別語言的所有優勢，例如自動完成或型別檢查。

比較您未來網路應用程式的傳統 HTML 程式碼及其在 Kotlin 中的型別安全變體：

<tabs>
<tab title="HTML">

```html
<h1>KotlinConf Explorer</h1>
<div>
    <h3>Videos to watch</h3>
    <p>John Doe: Building and breaking things</p>
    <p>Jane Smith: The development process</p>
    <p>Matt Miller: The Web 7.0</p>
    <h3>Videos watched</h3>
    <p>Tom Jerry: Mouseless development</p>
</div>
<div>
    <h3>John Doe: Building and breaking things</h3>
    <img src="https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder">
</div>
```

</tab>
<tab title="Kotlin">

```kotlin
h1 {
    +"KotlinConf Explorer"
}
div {
    h3 {
        +"Videos to watch"
    }
    p {
        + "John Doe: Building and breaking things"
    }
    p {
        +"Jane Smith: The development process"
    }
    p {
        +"Matt Miller: The Web 7.0"
    }
    h3 {
        +"Videos watched"
    }
    p {
        +"Tom Jerry: Mouseless development"
    }
}
div {
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
       src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"
    }
}
```

</tab>
</tabs>

複製 Kotlin 程式碼並更新 `main()` 函數內部對 `Fragment.create()` 函數的呼叫，替換掉之前的 `h1` 標籤。

等待瀏覽器重新載入。頁面現在應該看起來像這樣：

![網路應用程式草稿](website-draft.png){width=700}

### 在標記中使用 Kotlin 建構來新增影片

使用此 DSL 在 Kotlin 中編寫 HTML 有一些優勢。您可以使用常規 Kotlin 建構（例如迴圈、條件、集合和字串插值）來操作您的應用程式。

您現在可以用 Kotlin 物件列表來取代硬編碼的影片列表：

1.  在 `Main.kt` 中，建立一個 `Video` [資料類別](data-classes.md) 以將所有影片屬性集中存放在一個位置：

    ```kotlin
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

2.  分別填入兩個列表，一個用於未觀看影片，一個用於已觀看影片。將這些宣告新增到 `Main.kt` 的檔案層級：

    ```kotlin
    val unwatchedVideos = listOf(
        Video(1, "Opening Keynote", "Andrey Breslav", "https://youtu.be/PsaFVLr8t4E"),
        Video(2, "Dissecting the stdlib", "Huyen Tue Dao", "https://youtu.be/Fzt_9I733Yg"),
        Video(3, "Kotlin and Spring Boot", "Nicolas Frankel", "https://youtu.be/pSiZVAeReeg")
    )

    val watchedVideos = listOf(
        Video(4, "Creating Internal DSLs in Kotlin", "Venkat Subramaniam", "https://youtu.be/JzTeAM8N1-o")
    )
    ```

3.  若要在頁面上使用這些影片，請編寫一個 Kotlin `for` 迴圈來疊代未觀看 `Video` 物件的集合。將「Videos to watch」下的三個 `p` 標籤替換為以下程式碼片段：

    ```kotlin
    for (video in unwatchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

4.  對「Videos watched」後面的單個標籤應用相同的流程來修改程式碼：

    ```kotlin
    for (video in watchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

等待瀏覽器重新載入。版面配置應保持不變。您可以為列表新增更多影片，以確保迴圈正常運作。

### 使用型別安全 CSS 新增樣式

[kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/) 是 [Emotion](https://emotion.sh/docs/introduction) 函式庫的封裝器，它使得在 HTML 旁邊使用 JavaScript 指定 CSS 屬性（甚至是動態屬性）成為可能。從概念上講，這使得它與 [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) 類似——但適用於 Kotlin。使用 DSL 的好處是您可以使用 Kotlin 程式碼建構來表達格式化規則。

本教程的範本專案已經包含了使用 `kotlin-emotion` 所需的依賴項：

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

使用 `kotlin-emotion`，您可以在 HTML 元素 `div` 和 `h3` 內部指定一個 `css` 區塊，您可以在其中定義樣式。

若要將影片播放器移動到頁面的右上角，請使用 CSS 並調整影片播放器的程式碼（片段中的最後一個 `div`）：

```kotlin
div {
    css {
        position = Position.absolute
        top = 10.px
        right = 10.px
    }
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
        src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"              
    }
}
```

您可以隨意嘗試一些其他樣式。例如，您可以更改 `fontFamily` 或為您的 UI 添加一些 `color`。

## 設計應用程式元件

React 中的基本建構塊稱為 _[元件](https://reactjs.org/docs/components-and-props.html)_。元件本身也可以由其他更小的元件組成。透過組合元件，您可以建置應用程式。如果您將元件結構化為通用且可重複使用，您將能夠在應用程式的多個部分中使用它們，而無需重複程式碼或邏輯。

`render()` 函數的內容通常描述一個基本元件。您的應用程式目前的版面配置如下：

![目前版面配置](current-layout.png){width=700}

如果您將應用程式分解為單個元件，您將會得到一個更結構化的版面配置，其中每個元件負責其職責：

![帶有元件的結構化版面配置](structured-layout.png){width=700}

元件封裝特定功能。使用元件可以縮短原始碼，並使其更容易閱讀和理解。

### 新增主要元件

若要開始建立應用程式的結構，首先明確指定 `App`，即用於渲染到 `root` 元素的主要元件：

1.  在 `src/jsMain/kotlin` 資料夾中建立一個新的 `App.kt` 檔案。
2.  在此檔案中，新增以下程式碼片段，並將 `Main.kt` 中的型別安全 HTML 移動到其中：

    ```kotlin
    import kotlinx.coroutines.async
    import react.*
    import react.dom.*
    import kotlinx.browser.window
    import kotlinx.coroutines.*
    import kotlinx.serialization.decodeFromString
    import kotlinx.serialization.json.Json
    import emotion.react.css
    import csstype.Position
    import csstype.px
    import react.dom.html.ReactHTML.h1
    import react.dom.html.ReactHTML.h3
    import react.dom.html.ReactHTML.div
    import react.dom.html.ReactHTML.p
    import react.dom.html.ReactHTML.img

    val App = FC<Props> {
        // typesafe HTML goes here, starting with the first h1 tag!
    }
    ```

    `FC` 函數建立一個 [函數式元件](https://reactjs.org/docs/components-and-props.html#function-and-class-components)。

3.  在 `Main.kt` 檔案中，更新 `main()` 函數如下：

    ```kotlin
    fun main() {
        val container = document.getElementById("root") ?: error("Couldn't find root container!")
        createRoot(container).render(App.create())
    }
    ```

    現在程式會建立 `App` 元件的實例並將其渲染到指定的容器。

有關 React 概念的更多資訊，請參閱 [文件和指南](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)。

### 提取列表元件

由於 `watchedVideos` 和 `unwatchedVideos` 列表各自包含一個影片列表，因此建立一個單一的可重複使用元件並僅調整列表中顯示的內容是合理的。

`VideoList` 元件遵循與 `App` 元件相同的模式。它使用 `FC` 建構函數，並包含來自 `unwatchedVideos` 列表的程式碼。

1.  在 `src/jsMain/kotlin` 資料夾中建立一個新的 `VideoList.kt` 檔案並新增以下程式碼：

    ```kotlin
    import kotlinx.browser.window
    import react.*
    import react.dom.*
    import react.dom.html.ReactHTML.p

    val VideoList = FC<Props> {
        for (video in unwatchedVideos) {
            p {
                +"${video.speaker}: ${video.title}"
            }
        }
    }
    ```

2.  在 `App.kt` 中，透過不帶參數呼叫來使用 `VideoList` 元件：

    ```kotlin
    // . . .

    div {
        h3 {
            +"Videos to watch"
        }
        VideoList()

        h3 {
            +"Videos watched"
        }
        VideoList()
    }

    // . . .
    ```

    目前，`App` 元件無法控制 `VideoList` 元件顯示的內容。它是硬編碼的，因此您會看到相同的列表兩次。

### 新增 props 以在元件之間傳遞資料

由於您將重複使用 `VideoList` 元件，因此您需要能夠用不同的內容填充它。您可以新增將項目列表作為屬性傳遞給元件的功能。在 React 中，這些屬性稱為 _props_。當元件的 props 在 React 中發生改變時，框架會自動重新渲染該元件。

對於 `VideoList`，您需要一個包含要顯示的影片列表的 prop。定義一個包含可以傳遞給 `VideoList` 元件的所有 props 的介面：

1.  將以下定義新增到 `VideoList.kt` 檔案：

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
    }
    ```
    `external` 修飾符告訴編譯器該介面的實作由外部提供，因此它不會嘗試從宣告中生成 JavaScript 程式碼。

2.  調整 `VideoList` 的類別定義，以便使用作為參數傳遞到 `FC` 區塊中的 props：

    ```kotlin
    val VideoList = FC<VideoListProps> { props ->
        for (video in props.videos) {
            p {
                key = video.id.toString()
                +"${video.speaker}: ${video.title}"
            }
        }
    }
    ```

    `key` 屬性有助於 React 渲染器弄清楚當 `props.videos` 的值改變時該怎麼辦。它使用 key 來確定列表的哪些部分需要重新整理，哪些保持不變。您可以在 [React 指南](https://reactjs.org/docs/lists-and-keys.html) 中找到有關列表和 key 的更多資訊。

3.  在 `App` 元件中，確保子元件使用正確的屬性實例化。在 `App.kt` 中，將 `h3` 元素下方的兩個迴圈替換為對 `VideoList` 的呼叫，並附帶 `unwatchedVideos` 和 `watchedVideos` 的屬性。
    在 Kotlin DSL 中，您將它們指派在屬於 `VideoList` 元件的區塊內：

    ```kotlin
    h3 {
        +"Videos to watch"
    }
    VideoList {
        videos = unwatchedVideos
    }
    h3 {
        +"Videos watched"
    }
    VideoList {
        videos = watchedVideos
    }
    ```

重新載入後，瀏覽器將顯示列表現在已正確渲染。

### 使列表具有互動性

首先，新增一個警報訊息，當使用者點擊列表條目時會彈出。在 `VideoList.kt` 中，新增一個 `onClick` 處理器函數，該函數會觸發一個包含當前影片的警報：

```kotlin
// . . .

p {
    key = video.id.toString()
    onClick = {
        window.alert("Clicked $video!")
    }
    +"${video.speaker}: ${video.title}"
}

// . . .
```

如果您點擊瀏覽器視窗中其中一個列表項目，您將在警報視窗中獲得有關影片的資訊，如下所示：

![瀏覽器警報視窗](alert-window.png){width=700}

> 將 `onClick` 函數直接定義為 lambda 簡潔且非常適合原型設計。然而，由於 Kotlin/JS 中相等性 [目前的工作方式](https://youtrack.jetbrains.com/issue/KT-15101)，從性能角度來看，這不是傳遞點擊處理器最優化的方式。如果您想優化渲染性能，請考慮將您的函數儲存在變數中並傳遞它們。
>
{style="tip"}

### 新增狀態以保留值

您可以不只警示使用者，還可以新增一些功能，使用 ▶ 三角形標示選定的影片。為此，請引入一些特定於此元件的 _狀態_。

狀態是 React 中的核心概念之一。在現代 React（使用所謂的 _Hooks API_）中，狀態使用 [`useState` hook](https://reactjs.org/docs/hooks-state.html) 表達。

1.  將以下程式碼新增到 `VideoList` 宣告的頂部：

    ```kotlin
    val VideoList = FC<VideoListProps> { props ->
        var selectedVideo: Video? by useState(null)

    // . . .
    ```
    {validate="false"}

    *   `VideoList` 函數式元件維護狀態（獨立於當前函數調用的值）。狀態可為空，並且具有 `Video?` 型別。其預設值為 `null`。
    *   來自 React 的 `useState()` 函數指示框架追蹤多次調用之間的狀態。例如，即使您指定了預設值，React 也會確保預設值僅在開始時分配。當狀態改變時，元件將根據新狀態重新渲染。
    *   `by` 關鍵字表示 `useState()` 作為 [委託屬性](delegated-properties.md) 運作。與任何其他變數一樣，您可以讀寫值。`useState()` 背後的實作負責處理使狀態運作所需的機制。

    若要了解更多關於狀態 Hook 的資訊，請查閱 [React 文件](https://reactjs.org/docs/hooks-state.html)。

2.  更改 `onClick` 處理器和 `VideoList` 元件中的文本，使其看起來如下：

    ```kotlin
    val VideoList = FC<VideoListProps> { props ->
        var selectedVideo: Video? by useState(null)
        for (video in props.videos) {
            p {
                key = video.id.toString()
                onClick = {
                    selectedVideo = video
                }
                if (video == selectedVideo) {
                    +"▶ "
                }
                +"${video.speaker}: ${video.title}"
            }
        }
    }
    ```

    *   當使用者點擊影片時，其值會被指派給 `selectedVideo` 變數。
    *   當選定的列表條目被渲染時，三角形會預先附加。

您可以在 [React 常見問題](https://reactjs.org/docs/faq-state.html) 中找到有關狀態管理的更多詳細資訊。

檢查瀏覽器並點擊列表中的項目，以確保一切正常運作。

## 組合元件

目前，兩個影片列表獨立運作，這意味著每個列表都追蹤一個選定的影片。使用者可以選擇兩個影片，一個在未觀看列表中，一個在已觀看列表中，即使只有一個播放器：

![兩個影片同時在兩個列表中被選中](two-videos-select.png){width=700}

一個列表不能同時在內部和同級列表中追蹤哪個影片被選中。原因是選定的影片不屬於 _列表_ 狀態，而是屬於 _應用程式_ 狀態。這意味著您需要將狀態從單個元件中 _提升_ 出來。

### 提升狀態

React 確保 props 只能從父元件傳遞給其子元件。這可以防止元件硬連接在一起。

如果一個元件想要改變同級元件的狀態，它需要透過其父級來完成。此時，狀態也不再屬於任何子元件，而是屬於上層的父元件。

將狀態從元件遷移到其父元件的過程稱為 _狀態提升_。對於您的應用程式，將 `currentVideo` 作為狀態新增到 `App` 元件：

1.  在 `App.kt` 中，將以下內容新增到 `App` 元件定義的頂部：

    ```kotlin
    val App = FC<Props> {
        var currentVideo: Video? by useState(null)

        // . . .
    }
    ```

    `VideoList` 元件不再需要追蹤狀態。它將改為接收當前影片作為 prop。

2.  刪除 `VideoList.kt` 中的 `useState()` 呼叫。
3.  準備 `VideoList` 元件以接收選定的影片作為 prop。為此，請擴展 `VideoListProps` 介面以包含 `selectedVideo`：

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
        var selectedVideo: Video?
    }
    ```

4.  更改三角形的條件，使其使用 `props` 而不是 `state`：

    ```kotlin
    if (video == props.selectedVideo) {
        +"▶ "
    }
    ```

### 傳遞處理器

目前，沒有辦法為 prop 指派值，因此 `onClick` 函數將無法按目前設定的方式運作。若要改變父元件的狀態，您需要再次提升狀態。

在 React 中，狀態總是從父級流向子級。因此，若要從其中一個子元件改變 _應用程式_ 狀態，您需要將處理使用者互動的邏輯移動到父元件，然後將該邏輯作為 prop 傳遞。請記住，在 Kotlin 中，變數可以具有 [函數的型別](lambdas.md#function-types)。

1.  再次擴展 `VideoListProps` 介面，使其包含一個變數 `onSelectVideo`，該變數是一個接受 `Video` 並返回 `Unit` 的函數：

    ```kotlin
    external interface VideoListProps : Props {
        // ...
        var onSelectVideo: (Video) -> Unit
    }
    ```

2.  在 `VideoList` 元件中，在 `onClick` 處理器中使用新的 prop：

    ```kotlin
    onClick = {
        props.onSelectVideo(video)
    }
    ```

    您現在可以從 `VideoList` 元件中刪除 `selectedVideo` 變數。

3.  回到 `App` 元件，並為兩個影片列表中的每一個傳遞 `selectedVideo` 和一個 `onSelectVideo` 的處理器：

    ```kotlin
    VideoList {
        videos = unwatchedVideos // and watchedVideos respectively
        selectedVideo = currentVideo
        onSelectVideo = { video ->
            currentVideo = video
        }
    }
    ```

4.  對已觀看影片列表重複上一步驟。

切換回瀏覽器，並確保當選擇一個影片時，選擇在兩個列表之間跳轉而沒有重複。

## 新增更多元件

### 提取影片播放器元件

您現在可以建立另一個獨立的元件，一個影片播放器，它目前是一個佔位符圖片。您的影片播放器需要知道演講標題、演講作者以及影片連結。這些資訊已經包含在每個 `Video` 物件中，因此您可以將其作為 prop 傳遞並存取其屬性。

1.  建立一個新的 `VideoPlayer.kt` 檔案並新增以下 `VideoPlayer` 元件的實作：

    ```kotlin
    import csstype.*
    import react.*
    import emotion.react.css
    import react.dom.html.ReactHTML.button
    import react.dom.html.ReactHTML.div
    import react.dom.html.ReactHTML.h3
    import react.dom.html.ReactHTML.img

    external interface VideoPlayerProps : Props {
        var video: Video
    }

    val VideoPlayer = FC<VideoPlayerProps> { props ->
        div {
            css {
                position = Position.absolute
                top = 10.px
                right = 10.px
            }
            h3 {
                +"${props.video.speaker}: ${props.video.title}"
            }
            img {
                src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"              
            }
        }
    }
    ```

2.  由於 `VideoPlayerProps` 介面指定 `VideoPlayer` 元件接受一個非空的 `Video`，請確保在 `App` 元件中相應地處理此問題。

    在 `App.kt` 中，將先前用於影片播放器的 `div` 片段替換為以下內容：

    ```kotlin
    currentVideo?.let { curr ->
        VideoPlayer {
            video = curr
        }
    }
    ```

    [`let` 作用域函數](scope-functions.md#let) 確保 `VideoPlayer` 元件僅在 `state.currentVideo` 不為空時才新增。

現在，點擊列表中的條目將會顯示影片播放器，並用點擊條目中的資訊填充它。

### 新增按鈕並連接它

若要讓使用者能夠將影片標記為已觀看或未觀看，並在兩個列表之間移動影片，請在 `VideoPlayer` 元件中新增一個按鈕。

由於此按鈕將在兩個不同的列表之間移動影片，因此處理狀態改變的邏輯需要從 `VideoPlayer` 中 _提升_ 出來，並作為 prop 從父級傳入。按鈕的外觀應根據影片是否已觀看而有所不同。這也是您需要作為 prop 傳遞的資訊。

1.  擴展 `VideoPlayerProps` 介面在 `VideoPlayer.kt` 中，以包含這兩種情況的屬性：

    ```kotlin
    external interface VideoPlayerProps : Props {
        var video: Video
        var onWatchedButtonPressed: (Video) -> Unit
        var unwatchedVideo: Boolean
    }
    ```

2.  您現在可以將按鈕新增到實際元件中。將以下程式碼片段複製到 `VideoPlayer` 元件的主體中，介於 `h3` 和 `img` 標籤之間：

    ```kotlin
    button {
        css {
            display = Display.block
            backgroundColor = if (props.unwatchedVideo) NamedColor.lightgreen else NamedColor.red
        }
        onClick = {
            props.onWatchedButtonPressed(props.video)
        }
        if (props.unwatchedVideo) {
            +"Mark as watched"
        } else {
            +"Mark as unwatched"
        }
    }
    ```

    在 Kotlin CSS DSL 的幫助下，您可以動態更改樣式，並使用基本的 Kotlin `if` 表達式來更改按鈕的顏色。

### 將影片列表移動到應用程式狀態

現在是時候調整 `App` 元件中 `VideoPlayer` 的使用位置了。當按鈕被點擊時，影片應該從未觀看列表移動到已觀看列表，反之亦然。由於這些列表現在確實可以改變，請將它們移動到應用程式狀態：

1.  在 `App.kt` 中，將以下屬性與 `useState()` 呼叫新增到 `App` 元件的頂部：

    ```kotlin
    val App = FC<Props> {
        var currentVideo: Video? by useState(null)
        var unwatchedVideos: List<Video> by useState(listOf(
            Video(1, "Opening Keynote", "Andrey Breslav", "https://youtu.be/PsaFVLr8t4E"),
            Video(2, "Dissecting the stdlib", "Huyen Tue Dao", "https://youtu.be/Fzt_9I733Yg"),
            Video(3, "Kotlin and Spring Boot", "Nicolas Frankel", "https://youtu.be/pSiZVAeReeg")
        ))
        var watchedVideos: List<Video> by useState(listOf(
            Video(4, "Creating Internal DSLs in Kotlin", "Venkat Subramaniam", "https://youtu.be/JzTeAM8N1-o")
        ))

        // . . .
    }
    ```

2.  由於所有演示資料都直接包含在 `watchedVideos` 和 `unwatchedVideos` 的預設值中，您不再需要檔案層級宣告。在 `Main.kt` 中，刪除 `watchedVideos` 和 `unwatchedVideos` 的宣告。
3.  更改 `App` 元件中屬於影片播放器的 `VideoPlayer` 呼叫位置，使其看起來如下：

    ```kotlin
    VideoPlayer {
        video = curr
        unwatchedVideo = curr in unwatchedVideos
        onWatchedButtonPressed = {
            if (video in unwatchedVideos) {
                unwatchedVideos = unwatchedVideos - video
                watchedVideos = watchedVideos + video
            } else {
                watchedVideos = watchedVideos - video
                unwatchedVideos = unwatchedVideos + video
            }
        }
    }
    ```

回到瀏覽器，選擇一個影片，然後按幾次按鈕。影片將在兩個列表之間跳轉。

## 使用 npm 套件

若要使應用程式可用，您仍然需要一個實際播放影片的影片播放器以及一些幫助人們分享內容的按鈕。

React 擁有豐富的生態系統，其中包含許多預製元件，您可以使用它們，而無需自己建置此功能。

### 新增影片播放器元件

若要將佔位符影片元件替換為實際的 YouTube 播放器，請使用 npm 中的 `react-player` 套件。它可以播放影片並允許您控制播放器的外觀。

有關元件文件和 API 描述，請參閱其在 GitHub 中的 [README](https://www.npmjs.com/package/react-player)。

1.  檢查 `build.gradle.kts` 檔案。`react-player` 套件應該已經包含在內：

    ```kotlin
    dependencies {
        // ...
        // Video Player
        implementation(npm("react-player", "2.12.0"))
        // ...
    }
    ```

    如您所見，npm 依賴項可以透過在建置檔案的 `dependencies` 區塊中使用 `npm()` 函數新增到 Kotlin/JS 專案中。Gradle 插件隨後會負責為您下載並安裝這些依賴項。為此，它使用自己捆綁的 [Yarn](https://yarnpkg.com/) 套件管理器安裝。

2.  若要從 React 應用程式內部使用 JavaScript 套件，必須透過提供 [外部宣告](js-interop.md) 來告知 Kotlin 編譯器預期什麼。

    建立一個新的 `ReactYouTube.kt` 檔案並新增以下內容：

    ```kotlin
    @file:JsModule("react-player")
    @file:JsNonModule

    import react.*

    @JsName("default")
    external val ReactPlayer: ComponentClass<dynamic>
    ```

    當編譯器看到像 `ReactPlayer` 這樣的外部宣告時，它會假定相應類別的實作由依賴項提供，並且不會為其生成程式碼。

    最後兩行等同於 `require("react-player").default;` 這樣的 JavaScript 導入。它們告訴編譯器，在執行時元件肯定會符合 `ComponentClass<dynamic>`。

然而，在此配置中，`ReactPlayer` 接受的 props 的通用型別設定為 `dynamic`。這意味著編譯器將接受任何程式碼，但存在在執行時破壞事物的風險。

更好的替代方案是建立一個 `external interface`，它指定哪些屬性屬於此外部元件的 props。您可以在元件的 [README](https://www.npmjs.com/package/react-player) 中了解 props 的介面。在這種情況下，使用 `url` 和 `controls` props：

1.  透過將 `dynamic` 替換為外部介面來調整 `ReactYouTube.kt` 的內容：

    ```kotlin
    @file:JsModule("react-player")
    @file:JsNonModule

    import react.*

    @JsName("default")
    external val ReactPlayer: ComponentClass<ReactPlayerProps>

    external interface ReactPlayerProps : Props {
        var url: String
        var controls: Boolean
    }
    ```

2.  您現在可以使用新的 `ReactPlayer` 來替換 `VideoPlayer` 元件中的灰色佔位符矩形。在 `VideoPlayer.kt` 中，將 `img` 標籤替換為以下程式碼片段：

    ```kotlin
    ReactPlayer {
        url = props.video.videoUrl
        controls = true
    }
    ```

### 新增社群分享按鈕

分享應用程式內容的簡單方法是為即時通訊軟體和電子郵件提供社群分享按鈕。您也可以為此使用現成的 React 元件，例如 [react-share](https://github.com/nygardk/react-share/blob/master/README.md)：

1.  檢查 `build.gradle.kts` 檔案。此 npm 函式庫應該已包含在內：

    ```kotlin
    dependencies {
        // ...
        // Share Buttons
        implementation(npm("react-share", "4.4.1"))
        // ...
    }
    ```

2.  若要從 Kotlin 使用 `react-share`，您需要編寫更多基本的外部宣告。 [GitHub 上的範例](https://github.com/nygardk/react-share/blob/master/demo/Demo.tsx#L61) 顯示分享按鈕由兩個 React 元件組成：例如 `EmailShareButton` 和 `EmailIcon`。不同類型的分享按鈕和圖標都具有相同的介面。您將以與影片播放器相同的方式為每個元件建立外部宣告。

    將以下程式碼新增到新的 `ReactShare.kt` 檔案：

    ```kotlin
    @file:JsModule("react-share")
    @file:JsNonModule

    import react.ComponentClass
    import react.Props

    @JsName("EmailIcon")
    external val EmailIcon: ComponentClass<IconProps>

    @JsName("EmailShareButton")
    external val EmailShareButton: ComponentClass<ShareButtonProps>

    @JsName("TelegramIcon")
    external val TelegramIcon: ComponentClass<IconProps>

    @JsName("TelegramShareButton")
    external val TelegramShareButton: ComponentClass<ShareButtonProps>

    external interface ShareButtonProps : Props {
        var url: String
    }

    external interface IconProps : Props {
        var size: Int
        var round: Boolean
    }
    ```

3.  將新元件新增到應用程式的使用者介面中。在 `VideoPlayer.kt` 中，在 `ReactPlayer` 使用上方的一個 `div` 中新增兩個分享按鈕：

    ```kotlin
    // . . .

    div {
        css {
             position = Position.absolute
             top = 10.px
             right = 10.px
         }
        EmailShareButton {
            url = props.video.videoUrl
            EmailIcon {
                size = 32
                round = true
            }
        }
        TelegramShareButton {
            url = props.video.videoUrl
            TelegramIcon {
                size = 32
                round = true
            }
        }
    }

    // . . .
    ```

您現在可以檢查您的瀏覽器，看看按鈕是否實際運作。點擊按鈕時，應該會出現一個帶有影片 URL 的「分享視窗」。如果按鈕沒有顯示或無法運作，您可能需要禁用您的廣告和社群媒體阻擋器。

![分享視窗](social-buttons.png){width=700}

您可以隨意為 [react-share](https://github.com/nygardk/react-share/blob/master/README.md#features) 中可用的其他社群網路重複此步驟，新增分享按鈕。

## 使用外部 REST API

您現在可以用應用程式中來自 REST API 的真實資料取代硬編碼的演示資料。

本教程提供了一個 [小型 API](https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/1)。它只提供一個單一端點 `videos`，並接受一個數字參數來存取列表中的元素。如果您使用瀏覽器訪問該 API，您將會看到從 API 返回的物件與 `Video` 物件具有相同的結構。

### 從 Kotlin 使用 JS 功能

瀏覽器已經內建了各種各樣的 [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)。您也可以從 Kotlin/JS 中使用它們，因為它開箱即用就包含了這些 API 的封裝器。一個範例是 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，它用於發出 HTTP 請求。

第一個潛在問題是，像 `fetch()` 這樣的瀏覽器 API 使用 [回呼函數](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) 來執行非阻塞操作。當多個回呼函數應該一個接一個地執行時，它們需要被巢狀化。自然地，程式碼會嚴重縮排，越來越多的功能片段堆疊在一起，這使得閱讀變得更加困難。

為了解決這個問題，您可以使用 Kotlin 的協程，這是一種針對此類功能的更好方法。

第二個問題源於 JavaScript 動態型別的本質。無法保證從外部 API 返回的資料的型別。為了解決這個問題，您可以使用 `kotlinx.serialization` 函式庫。

檢查 `build.gradle.kts` 檔案。相關片段應該已經存在：

```kotlin
dependencies {
    // . . .

    // Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
}
```

### 新增序列化

當您呼叫外部 API 時，您會獲得 JSON 格式的文本，仍需要將其轉換為可處理的 Kotlin 物件。

[`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization) 是一個函式庫，它使得將這些型別的轉換從 JSON 字串寫入 Kotlin 物件成為可能。

1.  檢查 `build.gradle.kts` 檔案。對應的片段應該已經存在：

    ```kotlin
    plugins {
        // . . .
        kotlin("plugin.serialization") version "%kotlinVersion%"
    }

    dependencies {
        // . . .

        // Serialization
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
    }
    ```

2.  為準備抓取第一個影片，需要告知序列化函式庫有關 `Video` 類別的資訊。在 `Main.kt` 中，為其定義新增 `@Serializable` 註解：

    ```kotlin
    @Serializable
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

### 抓取影片

若要從 API 抓取影片，請在 `App.kt` 中（或新檔案中）新增以下函數：

```kotlin
suspend fun fetchVideo(id: Int): Video {
    val response = window
        .fetch("https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/$id")
        .await()
        .text()
        .await()
    return Json.decodeFromString(response)
}
```

*   _暫停函數_ `fetch()` 會從 API 抓取具有給定 `id` 的影片。此響應可能需要一段時間，因此您會 `await()` 結果。接下來，使用回呼函數的 `text()` 從響應中讀取主體。然後您 `await()` 其完成。
*   在返回函數的值之前，您會將其傳遞給 `Json.decodeFromString`，這是 `kotlinx.coroutines` 中的一個函數。它將您從請求中收到的 JSON 文本轉換為具有適當欄位的 Kotlin 物件。
*   `window.fetch` 函數呼叫會返回一個 `Promise` 物件。您通常必須定義一個回呼處理器，該處理器會在 `Promise` 解析且結果可用時被呼叫。然而，使用協程，您可以 `await()` 這些 Promise。每當呼叫像 `await()` 這樣的函數時，方法會停止（暫停）其執行。一旦 `Promise` 可以被解析，其執行就會繼續。

若要為使用者提供影片選擇，請定義 `fetchVideos()` 函數，它將從與上方相同的 API 抓取 25 個影片。若要同步執行所有請求，請使用 Kotlin 協程提供的 [`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 功能：

1.  將以下實作新增到您的 `App.kt`：

    ```kotlin
    suspend fun fetchVideos(): List<Video> = coroutineScope {
        (1..25).map { id ->
            async {
                fetchVideo(id)
            }
        }.awaitAll()
    }
    ```

    遵循 [結構化併發](https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency) 的原則，實作被包裝在 `coroutineScope` 中。然後您可以啟動 25 個非同步任務（每個請求一個）並等待它們全部完成。

2.  您現在可以將資料新增到您的應用程式。為 `mainScope` 新增定義，並更改您的 `App` 元件，使其以以下程式碼片段開頭。也別忘了用 `emptyLists` 實例取代演示值：

    ```kotlin
    val mainScope = MainScope()

    val App = FC<Props> {
        var currentVideo: Video? by useState(null)
        var unwatchedVideos: List<Video> by useState(emptyList())
        var watchedVideos: List<Video> by useState(emptyList())

        useEffectOnce {
            mainScope.launch {
                unwatchedVideos = fetchVideos()
            }
        }

    // . . .
    ```
    {validate="false"}

    *   [`MainScope()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html) 是 Kotlin 結構化併發模型的一部分，它為非同步任務建立執行作用域。
    *   `useEffectOnce` 是另一個 React _hook_（特別是 [useEffect](https://reactjs.org/docs/hooks-effect.html) hook 的簡化版本）。它表示元件執行 _副作用_。它不僅渲染自身，還透過網路進行通訊。

檢查您的瀏覽器。應用程式應該顯示實際資料：

![從 API 抓取的資料](website-api-data.png){width=700}

當您載入頁面時：

*   `App` 元件的程式碼將被呼叫。這會啟動 `useEffectOnce` 區塊中的程式碼。
*   `App` 元件會以空的已觀看和未觀看影片列表渲染。
*   當 API 請求完成時，`useEffectOnce` 區塊將其指派給 `App` 元件的狀態。這會觸發重新渲染。
*   `App` 元件的程式碼將再次被呼叫，但 `useEffectOnce` 區塊 _不會_ 第二次執行。

如果您想深入了解協程的工作原理，請查閱此 [協程教程](coroutines-and-channels.md)。

## 部署到生產環境和雲端

現在是時候將應用程式發佈到雲端並讓其他人可以存取了。

### 打包生產版本

若要以生產模式打包所有資產，請透過 IntelliJ IDEA 中的工具視窗或執行 `./gradlew build` 來執行 Gradle 中的 `build` 任務。這將生成一個最佳化的專案建置，應用各種改進，例如 DCE（無用程式碼消除）。

建置完成後，您可以在 `/build/dist` 中找到部署所需的所有檔案。它們包括執行應用程式所需的 JavaScript 檔案、HTML 檔案和其他資源。您可以將它們放在靜態 HTTP 伺服器上、使用 GitHub Pages 提供服務，或將它們託管在您選擇的雲端服務供應商上。

### 部署到 Heroku

Heroku 使得啟動一個可在其自有網域下訪問的應用程式變得相當簡單。其免費方案應足以滿足開發目的。

1.  [建立帳戶](https://signup.heroku.com/)。
2.  [安裝並驗證 CLI 用戶端](https://devcenter.heroku.com/articles/heroku-cli)。
3.  在專案根目錄中的終端機中執行以下命令，建立 Git 儲存庫並附加 Heroku 應用程式：

    ```bash
    git init
    heroku create
    git add .
    git commit -m "initial commit"
    ```

4.  與在 Heroku 上運行的常規 JVM 應用程式（例如使用 Ktor 或 Spring Boot 編寫的應用程式）不同，您的應用程式生成靜態 HTML 頁面和 JavaScript 檔案，需要相應地提供服務。您可以調整所需的 buildpacks 以正確提供程式服務：

    ```bash
    heroku buildpacks:set heroku/gradle
    heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
    ```

5.  若要允許 `heroku/gradle` buildpack 正確執行，`build.gradle.kts` 檔案中需要有一個 `stage` 任務。此任務等同於 `build` 任務，並且對應的別名已包含在檔案底部：

    ```kotlin
    // Heroku Deployment
    tasks.register("stage") {
        dependsOn("build")
    }
    ```

6.  在專案根目錄中新增一個新的 `static.json` 檔案以配置 `buildpack-static`。
7.  在檔案內部新增 `root` 屬性：

    ```xml
    {
        "root": "build/distributions"
    }
    ```
    {validate="false"}

8.  您現在可以觸發部署，例如，透過執行以下命令：

    ```bash
    git add -A
    git commit -m "add stage task and static content root configuration"
    git push heroku master
    ```

> 如果您從非 `main` 分支推送，請調整命令以推送到 `main` 遠端，例如 `git push heroku feature-branch:main`。
>
{style="tip"}

如果部署成功，您將會看到人們可以用來在網際網路上存取應用程式的 URL。

![網路應用程式部署到生產環境](deployment-to-production.png){width=700}

> 您可以在 `finished` 分支的此處找到該專案的狀態：[here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)。
>
{style="note"}

## 接下來

### 新增更多功能 {initial-collapse-state="collapsed" collapsible="true"}

您可以將結果應用程式作為起點，探索 React、Kotlin/JS 等領域中更進階的主題。

*   **搜尋**。您可以新增一個搜尋欄位來篩選演講列表——例如，按標題或作者。了解 [HTML 表單元素在 React 中的運作方式](https://reactjs.org/docs/forms.html)。
*   **持久化**。目前，每次頁面重新載入時，應用程式都會丟失觀看者的觀看列表追蹤。考慮建置自己的後端，使用 Kotlin 可用的網路框架之一（例如 [Ktor](https://ktor.io/)）。或者，研究在 [客戶端儲存資訊的方法](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)。
*   **複雜 API**。有許多資料集和 API 可用。您可以將各種資料拉入您的應用程式。例如，您可以為 [貓咪照片](https://thecatapi.com/) 或 [免版稅圖庫 API](https://unsplash.com/developers) 建置一個視覺化工具。

### 改善樣式：響應式和網格 {initial-collapse-state="collapsed" collapsible="true"}

應用程式設計仍然非常簡單，在行動裝置或窄視窗中看起來不會很好。探索更多 CSS DSL，使應用程式更易於存取。

### 加入社群並獲得幫助 {initial-collapse-state="collapsed" collapsible="true"}

報告問題和獲得幫助的最佳方式是 [kotlin-wrappers 問題追蹤器](https://github.com/JetBrains/kotlin-wrappers/issues)。如果您找不到有關您問題的票證，請隨時提交新的。您也可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。有 `#javascript` 和 `#react` 頻道。

### 了解更多關於協程 {initial-collapse-state="collapsed" collapsible="true"}

如果您有興趣了解更多關於如何編寫併發程式碼，請查閱 [協程教程](coroutines-and-channels.md)。

### 了解更多關於 React {initial-collapse-state="collapsed" collapsible="true"}

既然您了解了基本的 React 概念以及它們如何轉換為 Kotlin，您就可以將 [React 文件](https://react.dev/learn) 中概述的其他一些概念轉換為 Kotlin。