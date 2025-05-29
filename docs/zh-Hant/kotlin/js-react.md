[//]: # (title: 建立一個使用 React 和 Kotlin/JS 的 Web 應用程式 — 教程)

<no-index/>

本教程將教您如何建立一個瀏覽器應用程式，使用 Kotlin/JS 和 [React](https://reactjs.org/) 框架。您將：

* 完成與建立典型 React 應用程式相關的常見任務。
* 探索 [Kotlin 的 DSL](type-safe-builders.md) 如何被用於幫助簡潔且統一地表達概念，而不犧牲可讀性，讓您能夠完全使用 Kotlin 撰寫一個功能齊全的應用程式。
* 學習如何使用現成的 npm 元件，使用外部函式庫，以及發佈最終應用程式。

輸出將是一個 _KotlinConf Explorer_ Web 應用程式，專為 [KotlinConf](https://kotlinconf.com/) 活動而設，包含會議演講的連結。使用者將能夠在一個頁面觀看所有演講，並將它們標記為已看或未看。

本教程假設您具備 Kotlin 的先備知識以及 HTML 和 CSS 的基本知識。了解 React 的基本概念可能有助於您理解一些範例程式碼，但並非嚴格要求。

> 您可以在 [這裡](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished) 取得最終應用程式。
>
{style="note"}

## 開始之前

1.  下載並安裝最新版的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。
2.  複製 [專案範本](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle) 並在 IntelliJ IDEA 中開啟。該範本包含一個基本的 Kotlin Multiplatform Gradle 專案，其中包含所有必要的配置和依賴項

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

    當您建構 Kotlin/JS 專案時，它們會自動將您的所有程式碼及其依賴項打包成一個單一的 JavaScript 檔案，檔案名稱與專案名稱相同，即 `confexplorer.js`。依照典型的 [JavaScript 慣例](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)，`<body>` 的內容（包括 `root` 區塊）會優先載入，以確保瀏覽器在載入腳本之前載入所有頁面元素。

    *   `src/jsMain/kotlin/Main.kt` 中的程式碼片段：

    ```kotlin
    import kotlinx.browser.document

    fun main() {
        document.bgColor = "red"
    }
    ```

### 執行開發伺服器

預設情況下，Kotlin Multiplatform Gradle 外掛程式支援內嵌的 `webpack-dev-server`，讓您可以在 IDE 中執行應用程式，而無需手動設定任何伺服器。

為了測試程式是否在瀏覽器中成功執行，透過呼叫 `run` 或 `browserDevelopmentRun` 任務（可在 `other` 或 `kotlin browser` 目錄中找到）從 IntelliJ IDEA 內部的 Gradle 工具視窗中啟動開發伺服器。

![Gradle 任務清單](browser-development-run.png){width=700}

若要從終端機執行程式，請改用 `./gradlew run`。

當專案被編譯並打包後，瀏覽器視窗中將出現一個空白的紅色頁面：

![空白紅色頁面](red-page.png){width=700}

### 啟用熱重載 / 持續模式

配置 _[持續編譯](dev-server-continuous-compilation.md)_ 模式，這樣您就不必在每次更改時手動編譯和執行專案。在繼續之前，請務必停止所有正在執行的開發伺服器實例。

1.  編輯 IntelliJ IDEA 首次執行 Gradle `run` 任務後自動生成的執行配置：

    ![編輯執行配置](edit-configurations-continuous.png){width=700}

2.  在 **執行/偵錯配置** 對話方塊中，為執行配置的引數添加 `--continuous` 選項：

    ![啟用持續模式](continuous-mode.png){width=700}

    應用變更後，您可以使用 IntelliJ IDEA 內部的 **執行** 按鈕重新啟動開發伺服器。若要從終端機執行持續的 Gradle 建構，請改用 `./gradlew run --continuous`。

3.  為了測試此功能，在 Gradle 任務執行期間，在 `Main.kt` 檔案中將頁面顏色更改為藍色：

    ```kotlin
    document.bgColor = "blue"
    ```

    專案隨後會重新編譯，重新載入後，瀏覽器頁面將顯示新的顏色。

您可以在開發過程中保持開發伺服器以持續模式執行。當您進行更改時，它將自動重建並重新載入頁面。

> 您可以在 `master` 分支的 [這裡](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master) 找到此專案狀態。
>
{style="note"}

## 建立 Web 應用程式草稿

### 加入第一個帶有 React 的靜態頁面

為了讓您的應用程式顯示一個簡單的訊息，請將 `Main.kt` 檔案中的程式碼替換為以下內容：

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

*   `render()` 函數指示 [kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom) 將第一個 HTML 元素渲染到 `root` 元素內部的 [fragment](https://reactjs.org/docs/fragments.html) 中。這個元素是 `src/jsMain/resources/index.html` 中定義的容器，該容器已包含在範本中。
*   內容是一個 `<h1>` 標題，並使用型別安全的 DSL 來渲染 HTML。
*   `h1` 是一個接受 lambda 參數的函數。當您在字串常值前面添加 `+` 號時，實際上是透過[運算子重載](operator-overloading.md)呼叫了 `unaryPlus()` 函數。它會將字串附加到封閉的 HTML 元素中。

當專案重新編譯後，瀏覽器將顯示此 HTML 頁面：

![一個 HTML 頁面範例](hello-react-js.png){width=700}

### 將 HTML 轉換為 Kotlin 的型別安全 HTML DSL

React 的 Kotlin [包裝器](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README.md) 附帶一個 [領域特定語言 (DSL)](type-safe-builders.md)，使得可以用純 Kotlin 程式碼撰寫 HTML。這樣一來，它與 JavaScript 的 [JSX](https://reactjs.org/docs/introducing-jsx.html) 相似。然而，由於此標記是 Kotlin，您將獲得靜態型別語言的所有好處，例如自動完成或型別檢查。

比較您未來 Web 應用程式的經典 HTML 程式碼與其在 Kotlin 中的型別安全變體：

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

複製 Kotlin 程式碼並更新 `main()` 函數中的 `Fragment.create()` 函數呼叫，替換掉之前的 `h1` 標籤。

等待瀏覽器重新載入。頁面現在應該會像這樣：

![Web 應用程式草稿](website-draft.png){width=700}

### 使用 Kotlin 語法在標記中加入影片

使用此 DSL 在 Kotlin 中編寫 HTML 具有一些優勢。您可以使用常規的 Kotlin 語法（例如迴圈、條件、集合和字串插值）來操作您的應用程式。

您現在可以將硬編碼的影片列表替換為 Kotlin 物件列表：

1.  在 `Main.kt` 中，建立一個 `Video` [資料類別](data-classes.md) 以將所有影片屬性集中在一處：

    ```kotlin
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

2.  填入兩個列表，分別用於未觀看影片和已觀看影片。將這些宣告新增到 `Main.kt` 的檔案層級：

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

3.  若要在頁面中使用這些影片，撰寫一個 Kotlin `for` 迴圈來迭代未觀看 `Video` 物件的集合。將「待觀看影片」下方的三個 `p` 標籤替換為以下程式碼片段：

    ```kotlin
    for (video in unwatchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

4.  也對「已觀看影片」後方的單一標籤應用相同的處理過程來修改程式碼：

    ```kotlin
    for (video in watchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

等待瀏覽器重新載入。版面配置應與之前保持一致。您可以向列表中添加更多影片，以確保迴圈正常運作。

### 使用型別安全 CSS 加入樣式

[Emotion](https://emotion.sh/docs/introduction) 函式庫的 [kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/) 包裝器使得指定 CSS 屬性 – 甚至動態的屬性 – 緊鄰 HTML 與 JavaScript 成為可能。從概念上講，這使其與 [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) 相似 — 但這是針對 Kotlin。使用 DSL 的好處是，您可以使用 Kotlin 程式碼語法來表達格式化規則。

本教程的範本專案已包含使用 `kotlin-emotion` 所需的依賴項：

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

使用 `kotlin-emotion`，您可以在 HTML 元素 `div` 和 `h3` 中指定一個 `css` 區塊，在其中定義樣式。

為了將影片播放器移動到頁面的右上角，使用 CSS 並調整影片播放器的程式碼（程式碼片段中的最後一個 `div`）：

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

您可以自由嘗試其他樣式。例如，您可以更改 `fontFamily` 或為您的 UI 添加一些 `color`。

## 設計應用程式元件

React 中的基本構建塊稱為 _[元件](https://reactjs.org/docs/components-and-props.html)_。元件本身也可以由其他更小的元件組成。透過組合元件，您可以建立您的應用程式。如果您將元件設計為通用且可重複使用，您將能夠在應用程式的多個部分使用它們，而無需重複程式碼或邏輯。

`render()` 函數的內容通常描述了一個基本元件。您應用程式目前的版面配置如下所示：

![目前版面配置](current-layout.png){width=700}

如果您將應用程式分解為獨立的元件，您將得到一個更結構化的版面配置，其中每個元件處理其職責：

![帶有元件的結構化版面配置](structured-layout.png){width=700}

元件封裝了特定功能。使用元件可以縮短原始碼，並使其更易於閱讀和理解。

### 加入主要元件

為了開始建立應用程式的結構，首先明確指定 `App`，作為渲染到 `root` 元素的主要元件：

1.  在 `src/jsMain/kotlin` 資料夾中建立一個新的 `App.kt` 檔案。
2.  在此檔案中，加入以下程式碼片段並將 `Main.kt` 中的型別安全 HTML 移入其中：

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

    `FC` 函數建立一個[函數元件](https://reactjs.org/docs/components-and-props.html#function-and-class-components)。

3.  在 `Main.kt` 檔案中，將 `main()` 函數更新如下：

    ```kotlin
    fun main() {
        val container = document.getElementById("root") ?: error("Couldn't find root container!")
        createRoot(container).render(App.create())
    }
    ```

    現在程式會建立 `App` 元件的一個實例，並將其渲染到指定的容器中。

有關 React 概念的更多資訊，請參閱[文件和指南](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)。

### 提取列表元件

由於 `watchedVideos` 和 `unwatchedVideos` 列表各自包含影片列表，建立一個單一的可重複使用元件是有意義的，並且僅調整列表中顯示的內容。

`VideoList` 元件遵循與 `App` 元件相同的模式。它使用 `FC` 建構函數，並包含來自 `unwatchedVideos` 列表的程式碼。

1.  在 `src/jsMain/kotlin` 資料夾中建立一個新的 `VideoList.kt` 檔案並加入以下程式碼：

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

2.  在 `App.kt` 中，透過不帶參數呼叫 `VideoList` 元件：

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

### 加入 props 以在元件之間傳遞資料

由於您將重複使用 `VideoList` 元件，您將需要能夠用不同的內容填充它。您可以添加將項目列表作為屬性傳遞給元件的功能。在 React 中，這些屬性稱為 _props_。當元件的 props 在 React 中改變時，框架會自動重新渲染該元件。

對於 `VideoList`，您需要一個包含要顯示的影片列表的 prop。定義一個介面，用於存放可以傳遞給 `VideoList` 元件的所有 props：

1.  將以下定義加入到 `VideoList.kt` 檔案中：

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
    }
    ```
    [external](js-interop.md#external-modifier) 修飾符告訴編譯器介面的實作由外部提供，因此它不會嘗試從宣告生成 JavaScript 程式碼。

2.  調整 `VideoList` 的類別定義，以利用作為參數傳遞到 `FC` 區塊中的 props：

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

    `key` 屬性有助於 React 渲染器判斷當 `props.videos` 的值改變時如何處理。它使用 key 來決定列表的哪些部分需要重新整理，哪些部分保持不變。您可以在 [React 指南](https://reactjs.org/docs/lists-and-keys.html) 中找到有關列表和 key 的更多資訊。

3.  在 `App` 元件中，確保子元件以適當的屬性實例化。在 `App.kt` 中，將 `h3` 元素下方的兩個迴圈替換為 `VideoList` 的調用以及 `unwatchedVideos` 和 `watchedVideos` 的屬性。在 Kotlin DSL 中，您將它們分配到屬於 `VideoList` 元件的區塊內部：

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

重新載入後，瀏覽器將顯示這些列表現在已正確渲染。

### 讓列表互動

首先，新增一個彈出式警示訊息，當使用者點擊列表項目時。在 `VideoList.kt` 中，新增一個 `onClick` 處理函數，它會觸發一個包含當前影片的警示：

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

如果您在瀏覽器視窗中點擊其中一個列表項目，您將在警示視窗中看到關於影片的資訊，如下所示：

![瀏覽器警示視窗](alert-window.png){width=700}

> 直接將 `onClick` 函數定義為 lambda 簡潔明瞭，對於原型開發非常有用。然而，由於 Kotlin/JS 中[目前](https://youtrack.jetbrains.com/issue/KT-15101)相等性運作的方式，從效能角度來看，這並不是傳遞點擊處理器最優化的方式。如果您想優化渲染效能，請考慮將您的函數儲存在變數中並傳遞它們。
>
{style="tip"}

### 加入狀態以保留值

您可以新增一些功能，而不是僅僅向使用者發出警報，用 ▶ 三角形突出顯示選定的影片。為此，引入此元件特有的 _狀態_。

狀態是 React 中的核心概念之一。在現代 React（使用所謂的 _Hooks API_）中，狀態是透過 [`useState` Hook](https://reactjs.org/docs/hooks-state.html) 表達的。

1.  將以下程式碼新增到 `VideoList` 宣告的頂部：

    ```kotlin
    val VideoList = FC<VideoListProps> { props ->
        var selectedVideo: Video? by useState(null)

    // . . .
    ```
    {validate="false"}

    *   `VideoList` 函數元件保留狀態（一個獨立於當前函數調用的值）。狀態是可空型的，並且具有 `Video?` 型別。其預設值為 `null`。
    *   React 的 `useState()` 函數指示框架追蹤函數多次調用之間的狀態。例如，即使您指定了預設值，React 確保預設值只在開始時被賦值。當狀態改變時，元件將根據新狀態重新渲染。
    *   `by` 關鍵字表示 `useState()` 作為一個[委託屬性](delegated-properties.md)。就像任何其他變數一樣，您讀取和寫入值。`useState()` 背後的實作負責使狀態正常運作所需的機制。

    要了解更多關於 State Hook 的資訊，請查閱 [React 文件](https://reactjs.org/docs/hooks-state.html)。

2.  變更 `VideoList` 元件中的 `onClick` 處理器和文字，使其如下所示：

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

    *   當使用者點擊影片時，其值會被賦予 `selectedVideo` 變數。
    *   當選定的列表項目被渲染時，三角形會被前置。

您可以在 [React 常見問題](https://reactjs.org/docs/faq-state.html) 中找到有關狀態管理的更多詳細資訊。

檢查瀏覽器並點擊列表中的項目以確保一切正常運作。

## 組合元件

目前，兩個影片列表各自獨立運作，這表示每個列表都會追蹤一個選定的影片。使用者可以選擇兩部影片，一部在未觀看列表中，一部在已觀看列表中，即使只有一個播放器：

![兩個列表同時選取了兩部影片](two-videos-select.png){width=700}

列表無法同時追蹤自身內部和兄弟列表內部選定的影片。原因在於選定的影片不屬於 _列表_ 狀態，而是屬於 _應用程式_ 狀態。這表示您需要將狀態從個別元件中 _提升_ 出來。

### 提升狀態

React 確保 props 只能從父元件傳遞給其子元件。這可以防止元件被硬性耦合在一起。

如果一個元件想要改變兄弟元件的狀態，它需要透過其父元件來實現。此時，狀態也不再屬於任何子元件，而是屬於其上層的父元件。

將狀態從元件遷移到其父元件的過程稱為 _狀態提升_。對於您的應用程式，將 `currentVideo` 作為狀態添加到 `App` 元件中：

1.  在 `App.kt` 中，將以下內容加入到 `App` 元件定義的頂部：

    ```kotlin
    val App = FC<Props> {
        var currentVideo: Video? by useState(null)

        // . . .
    }
    ```
    {validate="false"}

    `VideoList` 元件不再需要追蹤狀態。它將改為接收目前影片作為 prop。

2.  移除 `VideoList.kt` 中的 `useState()` 呼叫。
3.  準備 `VideoList` 元件以接收選定的影片作為 prop。為此，擴展 `VideoListProps` 介面以包含 `selectedVideo`：

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
        var selectedVideo: Video?
    }
    ```

4.  改變三角形的條件，使其使用 `props` 而不是 `state`：

    ```kotlin
    if (video == props.selectedVideo) {
        +"▶ "
    }
    ```

### 傳遞處理器

目前，無法為 prop 賦值，因此 `onClick` 函數無法按照目前的設定運作。若要變更父元件的狀態，您需要再次提升狀態。

在 React 中，狀態總是從父級流向子級。因此，若要從其中一個子元件更改 _應用程式_ 狀態，您需要將處理使用者互動的邏輯移動到父元件，然後將該邏輯作為 prop 傳入。請記住，在 Kotlin 中，變數可以具有[函數型別](lambdas.md#function-types)。

1.  再次擴展 `VideoListProps` 介面，以使其包含一個變數 `onSelectVideo`，這是一個接受 `Video` 並返回 `Unit` 的函數：

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

3.  回到 `App` 元件，並為兩個影片列表分別傳遞 `selectedVideo` 和 `onSelectVideo` 的處理器：

    ```kotlin
    VideoList {
        videos = unwatchedVideos // and watchedVideos respectively
        selectedVideo = currentVideo
        onSelectVideo = { video ->
            currentVideo = video
        }
    }
    ```

4.  對已觀看影片列表重複上一步。

切換回您的瀏覽器，並確保在選擇影片時選取會在兩個列表之間跳轉，而不會重複。

## 加入更多元件

### 提取影片播放器元件

您現在可以建立另一個獨立的元件，一個影片播放器，它目前是一個佔位符圖片。您的影片播放器需要知道演講標題、演講者以及影片連結。此資訊已包含在每個 `Video` 物件中，因此您可以將其作為 prop 傳遞並存取其屬性。

1.  建立一個新的 `VideoPlayer.kt` 檔案並為 `VideoPlayer` 元件加入以下實作：

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

2.  因為 `VideoPlayerProps` 介面指定 `VideoPlayer` 元件接受一個非空 (non-nullable) 的 `Video`，請確保在 `App` 元件中相應地處理此情況。

    在 `App.kt` 中，將影片播放器先前的 `div` 程式碼片段替換為以下內容：

    ```kotlin
    currentVideo?.let { curr ->
        VideoPlayer {
            video = curr
        }
    }
    ```

    [`let` 作用域函數](scope-functions.md#let) 確保 `VideoPlayer` 元件僅在 `state.currentVideo` 不為空時才被加入。

現在點擊列表中的項目將會顯示影片播放器並用點擊項目的資訊填充它。

### 加入按鈕並連接

為了讓使用者能夠將影片標記為已觀看或未觀看並在兩個列表之間移動影片，在 `VideoPlayer` 元件中加入一個按鈕。

由於此按鈕將在兩個不同的列表之間移動影片，處理狀態變化的邏輯需要從 `VideoPlayer` 中 _提升_ 出來並作為 prop 從父元件傳入。按鈕的外觀應該根據影片是否已被觀看而有所不同。這也是您需要作為 prop 傳遞的資訊。

1.  擴展 `VideoPlayer.kt` 中的 `VideoPlayerProps` 介面以包含這兩種情況的屬性：

    ```kotlin
    external interface VideoPlayerProps : Props {
        var video: Video
        var onWatchedButtonPressed: (Video) -> Unit
        var unwatchedVideo: Boolean
    }
    ```

2.  您現在可以將按鈕添加到實際的元件中。將以下程式碼片段複製到 `VideoPlayer` 元件的主體中，在 `h3` 和 `img` 標籤之間：

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

    藉助 Kotlin CSS DSL 實現動態樣式更改，您可以使用基本的 Kotlin `if` 表達式來更改按鈕的顏色。

### 將影片列表移動到應用程式狀態

現在是調整 `App` 元件中 `VideoPlayer` 使用位置的時候了。當按鈕被點擊時，影片應該從未觀看列表移動到已觀看列表，反之亦然。由於這些列表現在實際上可以改變，將它們移動到應用程式狀態：

1.  在 `App.kt` 中，將以下帶有 `useState()` 呼叫的屬性加入到 `App` 元件的頂部：

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
    {validate="false"}

2.  由於所有示範資料都直接包含在 `watchedVideos` 和 `unwatchedVideos` 的預設值中，您不再需要檔案層級的宣告。在 `Main.kt` 中，刪除 `watchedVideos` 和 `unwatchedVideos` 的宣告。
3.  更改 `App` 元件中 `VideoPlayer` 的呼叫位置，屬於影片播放器的部分，使其如下所示：

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

回到瀏覽器，選擇一個影片，然後多次按下按鈕。影片將在兩個列表之間跳轉。

## 使用 npm 套件

為了讓應用程式可用，您仍然需要一個實際播放影片的影片播放器以及一些幫助人們分享內容的按鈕。

React 擁有豐富的生態系統，其中包含許多預製元件，您可以使用它們，而不必自己建構此功能。

### 加入影片播放器元件

若要用實際的 YouTube 播放器替換佔位符影片元件，請使用 npm 中的 `react-player` 套件。它能夠播放影片並允許您控制播放器的外觀。

有關元件文件和 API 描述，請參閱其 GitHub 上的 [README](https://www.npmjs.com/package/react-player)。

1.  檢查 `build.gradle.kts` 檔案。`react-player` 套件應該已經包含在內：

    ```kotlin
    dependencies {
        // ...
        // Video Player
        implementation(npm("react-player", "2.12.0"))
        // ...
    }
    ```

    如您所見，可以將 npm 依賴項添加到 Kotlin/JS 專案中，透過在建構檔案的 `dependencies` 區塊中使用 `npm()` 函數。Gradle 外掛程式隨後會負責為您下載和安裝這些依賴項。為此，它使用自己捆綁安裝的 [Yarn](https://yarnpkg.com/) 套件管理器。

2.  若要在 React 應用程式內部使用 JavaScript 套件，必須告知 Kotlin 編譯器預期什麼內容，透過向其提供[外部宣告](js-interop.md)。

    建立一個新的 `ReactYouTube.kt` 檔案並加入以下內容：

    ```kotlin
    @file:JsModule("react-player")
    @file:JsNonModule

    import react.*

    @JsName("default")
    external val ReactPlayer: ComponentClass<dynamic>
    ```

    當編譯器看到像 `ReactPlayer` 這樣的外部宣告時，它會假設相應類別的實作是由依賴項提供的，並且不會為其生成程式碼。

    最後兩行等同於 JavaScript 匯入語句，例如 `require("react-player").default;`。它們告訴編譯器，在執行時元件肯定會符合 `ComponentClass<dynamic>`。

然而，在此配置中，`ReactPlayer` 接受的 props 的泛型型別被設定為 `dynamic`。這表示編譯器將接受任何程式碼，但可能在執行時導致問題。

一個更好的替代方案是建立一個 `external interface`，它指定屬於此外部元件的 props 的屬性種類。您可以在該元件的 [README](https://www.npmjs.com/package/react-player) 中了解 props 的介面。在本例中，使用 `url` 和 `controls` props：

1.  調整 `ReactYouTube.kt` 的內容，將 `dynamic` 替換為外部介面：

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

2.  您現在可以使用新的 `ReactPlayer` 替換 `VideoPlayer` 元件中的灰色佔位矩形。在 `VideoPlayer.kt` 中，將 `img` 標籤替換為以下程式碼片段：

    ```kotlin
    ReactPlayer {
        url = props.video.videoUrl
        controls = true
    }
    ```

### 加入社群分享按鈕

分享應用程式內容的一個簡單方法是為通訊應用程式和電子郵件提供社群分享按鈕。您也可以為此使用現成的 React 元件，例如 [react-share](https://github.com/nygardk/react-share/blob/master/README.md)：

1.  檢查 `build.gradle.kts` 檔案。這個 npm 函式庫應該已經包含在內：

    ```kotlin
    dependencies {
        // ...
        // Share Buttons
        implementation(npm("react-share", "4.4.1"))
        // ...
    }
    ```

2.  若要在 Kotlin 中使用 `react-share`，您需要撰寫更基本的外部宣告。GitHub 上的[範例](https://github.com/nygardk/react-share/blob/master/demo/Demo.tsx#L61) 顯示，一個分享按鈕由兩個 React 元件組成，例如 `EmailShareButton` 和 `EmailIcon`。不同類型的分享按鈕和圖示都具有相同的介面。您將以與影片播放器相同的方式為每個元件建立外部宣告。

    將以下程式碼加入到新的 `ReactShare.kt` 檔案中：

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

3.  將新元件加入到應用程式的使用者介面中。在 `VideoPlayer.kt` 中，在 `ReactPlayer` 使用上方的一個 `div` 中加入兩個分享按鈕：

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

您現在可以檢查您的瀏覽器，看看這些按鈕是否真的有效。當點擊按鈕時，應該會出現一個帶有影片 URL 的 _分享視窗_。如果按鈕沒有顯示或無法運作，您可能需要禁用您的廣告和社群媒體攔截器。

![分享視窗](social-buttons.png){width=700}

您可以隨意針對 [react-share](https://github.com/nygardk/react-share/blob/master/README.md#features) 中提供的其他社群網路重複此步驟，加入分享按鈕。

## 使用外部 REST API

您現在可以將應用程式中硬編碼的示範資料替換為來自 REST API 的真實資料。

對於本教程，有一個[小型 API](https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/1)。它只提供一個端點 `videos`，並接受一個數字參數來存取列表中的元素。如果您使用瀏覽器訪問該 API，您將會看到從 API 返回的物件結構與 `Video` 物件的結構相同。

### 從 Kotlin 使用 JS 功能

瀏覽器本身就帶有各種各樣的 [Web API](https://developer.mozilla.org/en-US/docs/Web/API)。您也可以從 Kotlin/JS 中使用它們，因為它開箱即用地包含了這些 API 的包裝器。一個例子是 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，它用於發出 HTTP 請求。

第一個潛在問題是，像 `fetch()` 這樣的瀏覽器 API 使用[回呼](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)來執行非阻塞操作。當多個回呼需要一個接一個地執行時，它們需要被巢狀化。自然地，程式碼會被大量縮排，越來越多的功能堆疊在彼此內部，這使得閱讀變得困難。

為了克服這個問題，您可以使用 Kotlin 的協程，這是一個處理此類功能的更好方法。

第二個問題源於 JavaScript 動態型別的特性。無法保證從外部 API 返回的資料型別。為了解決這個問題，您可以使用 `kotlinx.serialization` 函式庫。

檢查 `build.gradle.kts` 檔案。相關的程式碼片段應該已經存在：

```kotlin
dependencies {
    // . . .

    // Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
}
```

### 加入序列化

當您呼叫外部 API 時，您會收到 JSON 格式的文字，仍需要將其轉換為可操作的 Kotlin 物件。

[`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization) 是一個函式庫，它使得將 JSON 字串轉換為 Kotlin 物件成為可能。

1.  檢查 `build.gradle.kts` 檔案。對應的程式碼片段應該已經存在：

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

2.  為了獲取第一個影片做準備，必須告知序列化函式庫關於 `Video` 類別的資訊。在 `Main.kt` 中，在其定義中添加 `@Serializable` 註解：

    ```kotlin
    @Serializable
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

### 取得影片

若要從 API 取得影片，請在 `App.kt`（或新檔案）中加入以下函數：

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

*   _暫停函數_ `fetch()` 從 API 取得具有給定 `id` 的影片。此響應可能需要一段時間，因此您需要 `await()` 結果。接下來，`text()` 函數（使用回呼）從響應中讀取主體。然後您 `await()` 其完成。
*   在返回函數的值之前，您將它傳遞給 `Json.decodeFromString`，這是一個來自 `kotlinx.coroutines` 的函數。它將您從請求中收到的 JSON 文字轉換為具有適當欄位的 Kotlin 物件。
*   `window.fetch` 函數呼叫會返回一個 `Promise` 物件。通常您必須定義一個回呼處理器，一旦 `Promise` 被解決並有結果可用時，它就會被呼叫。然而，有了協程，您可以 `await()` 這些 Promise。每當呼叫像 `await()` 這樣的函數時，方法會停止（暫停）其執行。一旦 `Promise` 可以被解決，其執行就會繼續。

為了向使用者提供影片選擇，定義 `fetchVideos()` 函數，它將從與上述相同的 API 獲取 25 部影片。為了同時執行所有請求，使用 Kotlin 協程提供的 [`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 功能：

1.  將以下實作加入到您的 `App.kt`：

    ```kotlin
    suspend fun fetchVideos(): List<Video> = coroutineScope {
        (1..25).map { id ->
            async {
                fetchVideo(id)
            }
        }.awaitAll()
    }
    ```

    遵循[結構化併發](https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency)的原則，實作被包裝在 `coroutineScope` 中。然後您可以啟動 25 個非同步任務（每個請求一個），並等待它們全部完成。

2.  您現在可以將資料添加到您的應用程式中。加入 `mainScope` 的定義，並更改您的 `App` 元件，使其以以下程式碼片段開頭。也別忘了將示範值替換為 `emptyLists` 實例：

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

    *   [`MainScope()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html) 是 Kotlin 結構化併發模型的一部分，並為非同步任務的運行建立作用域。
    *   `useEffectOnce` 是另一個 React _Hook_（具體來說，是 [useEffect](https://reactjs.org/docs/hooks-effect.html) Hook 的簡化版本）。它表示元件執行了 _副作用_。它不僅僅渲染自身，還透過網路進行通訊。

檢查您的瀏覽器。應用程式應顯示實際資料：

![從 API 取得的資料](website-api-data.png){width=700}

當您載入頁面時：

*   `App` 元件的程式碼將被調用。這會啟動 `useEffectOnce` 區塊中的程式碼。
*   `App` 元件會以空列表渲染，用於已觀看和未觀看影片。
*   當 API 請求完成時，`useEffectOnce` 區塊會將其賦值給 `App` 元件的狀態。這會觸發重新渲染。
*   `App` 元件的程式碼將再次被調用，但 `useEffectOnce` 區塊_不會_第二次執行。

如果您想深入了解協程如何運作，請查閱這篇[協程教程](coroutines-and-channels.md)。

## 部署到生產環境和雲端

是時候將應用程式發佈到雲端了，並使其供其他人存取。

### 打包生產建構

為了在生產模式下打包所有資產，透過 IntelliJ IDEA 中的工具視窗在 Gradle 中執行 `build` 任務或透過執行 `./gradlew build`。這會生成一個優化的專案建構，應用了各種改進，例如 DCE (dead code elimination，死碼消除)。

一旦建構完成，您可以在 `/build/dist` 中找到所有部署所需的文件。它們包含 JavaScript 檔案、HTML 檔案以及執行應用程式所需的其他資源。您可以將它們放置在靜態 HTTP 伺服器上，使用 GitHub Pages 提供服務，或將它們託管在您選擇的雲端供應商上。

### 部署到 Heroku

Heroku 使得啟動一個應用程式變得相當簡單，該應用程式可在其自己的網域下存取。他們提供的免費方案應該足以滿足開發目的。

1.  [建立帳戶](https://signup.heroku.com/)。
2.  [安裝並驗證 CLI 客戶端](https://devcenter.heroku.com/articles/heroku-cli)。
3.  在專案根目錄的終端機中執行以下命令，建立 Git 儲存庫並附加 Heroku 應用程式：

    ```bash
    git init
    heroku create
    git add .
    git commit -m "initial commit"
    ```

4.  不同於會在 Heroku 上運行的常規 JVM 應用程式（例如，使用 Ktor 或 Spring Boot 編寫的應用程式），您的應用程式生成靜態 HTML 頁面和 JavaScript 檔案，需要相應地提供服務。您可以調整所需的 buildpacks 以正確提供程式服務：

    ```bash
    heroku buildpacks:set heroku/gradle
    heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
    ```

5.  為了讓 `heroku/gradle` buildpack 正常運行，`build.gradle.kts` 檔案中需要有一個 `stage` 任務。這個任務等同於 `build` 任務，且相應的別名已包含在檔案底部：

    ```kotlin
    // Heroku Deployment
    tasks.register("stage") {
        dependsOn("build")
    }
    ```

6.  在專案根目錄中新增一個新的 `static.json` 檔案以配置 `buildpack-static`。
7.  在檔案中加入 `root` 屬性：

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

> 如果您從非 `main` 分支推送，請調整命令以推送到 `main` 遠端，例如，`git push heroku feature-branch:main`。
>
{style="tip"}

如果部署成功，您將看到人們可以用來在網際網路上訪問應用程式的 URL。

![Web 應用程式部署到生產環境](deployment-to-production.png){width=700}

> 您可以在 `finished` 分支的 [這裡](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished) 找到此專案狀態。
>
{style="note"}

## 接下來

### 加入更多功能 {initial-collapse-state="collapsed" collapsible="true"}

您可以使用這個最終應用程式作為起點，探索 React、Kotlin/JS 等領域更進階的主題。

*   **搜尋**。您可以新增一個搜尋欄位來篩選演講列表 — 例如，依標題或依作者。了解 [React 中的 HTML 表單元素](https://reactjs.org/docs/forms.html) 如何運作。
*   **持久性**。目前，每次頁面重新載入時，應用程式都會失去對觀看者觀看列表的追蹤。考慮建構您自己的後端，使用 Kotlin 可用的 Web 框架之一（例如 [Ktor](https://ktor.io/)）。或者，研究如何在[用戶端儲存資訊](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)。
*   **複雜 API**。有許多資料集和 API 可供使用。您可以將各種資料提取到您的應用程式中。例如，您可以為[貓咪照片](https://thecatapi.com/)或[免版稅圖庫照片 API](https://unsplash.com/developers) 建立一個視覺化工具。

### 改善樣式：響應式設計和網格 {initial-collapse-state="collapsed" collapsible="true"}

應用程式設計仍然非常簡單，在行動裝置或窄視窗中不會看起來很好。探索更多 CSS DSL 以提高應用程式的可訪問性。

### 加入社群並取得協助 {initial-collapse-state="collapsed" collapsible="true"}

報告問題和獲得幫助的最佳方式是使用 [kotlin-wrappers 問題追蹤器](https://github.com/JetBrains/kotlin-wrappers/issues)。如果您找不到您問題的票證，請隨時提交一個新票證。您也可以加入官方的 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。其中有 `#javascript` 和 `#react` 頻道。

### 了解更多關於協程 {initial-collapse-state="collapsed" collapsible="true"}

如果您有興趣了解更多關於如何編寫併發程式碼的資訊，請查閱關於[協程](coroutines-and-channels.md)的教程。

### 了解更多關於 React {initial-collapse-state="collapsed" collapsible="true"}

既然您已了解基本的 React 概念以及它們如何轉化為 Kotlin，您可以將 [React 文件](https://react.dev/learn) 中概述的其他一些概念轉換為 Kotlin。