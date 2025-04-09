---
title: "使用 React 和 Kotlin/JS 構建 Web 應用程式 — 教學"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>

本教學將教您如何使用 Kotlin/JS 和 [React](https://reactjs.org/) 框架建構一個瀏覽器應用程式。您將會：

*   完成與建構典型 React 應用程式相關的常見任務。
*   探索如何使用 [Kotlin 的 DSL (領域特定語言)](type-safe-builders) 以簡潔且一致的方式表達概念，而不會犧牲可讀性，讓您完全以 Kotlin 編寫一個完整的應用程式。
*   學習如何使用現成的 npm 元件、使用外部函式庫，並發布最終應用程式。

輸出將會是一個 _KotlinConf Explorer_ 網頁應用程式，專為 [KotlinConf](https://kotlinconf.com/) 活動而設，提供會議演講的連結。使用者將能夠在一個頁面上觀看所有演講，並將其標記為已看或未看。

本教學假設您事先具備 Kotlin 的知識，以及 HTML 和 CSS 的基本知識。理解 React 背後的基本概念可能有助於您理解一些範例程式碼，但並非絕對必要。

:::note
您可以在[此處](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)取得最終的應用程式。

:::

## 開始之前

1.  下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。
2.  複製 [專案範本](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle) 並在 IntelliJ IDEA 中開啟它。該範本包含一個基本的 Kotlin Multiplatform Gradle 專案，其中包含所有必要的設定和依賴項

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

    *   `src/jsMain/resources/index.html` 中的 HTML 範本頁面，用於插入您將在本教學中使用的 JavaScript 程式碼：

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

    當您建構 Kotlin/JS 專案時，會自動將您的所有程式碼及其依賴項捆綁到一個 JavaScript 檔案中，該檔案的名稱與專案名稱相同，即 `confexplorer.js`。作為典型的 [JavaScript 慣例](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)，會先載入 body 的內容 (包括 `root` div)，以確保瀏覽器在載入指令碼之前載入所有頁面元素。

*   `src/jsMain/kotlin/Main.kt` 中的程式碼片段：

    ```kotlin
    import kotlinx.browser.document
    
    fun main() {
        document.bgColor = "red"
    }
    ```

### 執行開發伺服器

預設情況下，Kotlin Multiplatform Gradle 外掛程式支援嵌入式 `webpack-dev-server`，讓您可以從 IDE 執行應用程式，而無需手動設定任何伺服器。

為了測試程式是否成功在瀏覽器中執行，請從 IntelliJ IDEA 內的 Gradle 工具視窗中呼叫 `run` 或 `browserDevelopmentRun` 任務 (可在 `other` 或 `kotlin browser` 目錄中找到)，以啟動開發伺服器：

<img src="/img/browser-development-run.png" alt="Gradle tasks list" width="700" style={{verticalAlign: 'middle'}}/>

若要從終端機執行程式，請改用 `./gradlew run`。

當專案編譯並捆綁後，瀏覽器視窗中會出現一個空白的紅色頁面：

<img src="/img/red-page.png" alt="Blank red page" width="700" style={{verticalAlign: 'middle'}}/>

### 啟用熱重載/持續模式

設定 _[持續編譯](dev-server-continuous-compilation)_ 模式，這樣您就不必在每次進行變更時都手動編譯和執行專案。在繼續之前，請務必停止所有正在執行的開發伺服器執行個體。

1.  編輯 IntelliJ IDEA 在第一次執行 Gradle `run` 任務後自動產生的執行設定：

    <img src="/img/edit-configurations-continuous.png" alt="Edit a run configuration" width="700" style={{verticalAlign: 'middle'}}/>

2.  在 **Run/Debug Configurations (執行/除錯設定)** 對話方塊中，將 `--continuous` 選項新增至執行設定的引數：

    <img src="/img/continuous-mode.png" alt="Enable continuous mode" width="700" style={{verticalAlign: 'middle'}}/>

    套用變更後，您可以使用 IntelliJ IDEA 內的 **Run (執行)** 按鈕來重新啟動開發伺服器。若要從終端機執行持續 Gradle 建置，請改用 `./gradlew run --continuous`。

3.  為了測試此功能，請在 Gradle 任務執行時，將 `Main.kt` 檔案中的頁面顏色變更為藍色：

    ```kotlin
    document.bgColor = "blue"
    ```

    然後專案會重新編譯，並且重新載入後，瀏覽器頁面將會是新的顏色。

您可以讓開發伺服器在開發過程中以持續模式執行。當您進行變更時，它會自動重新建置並重新載入頁面。

:::note
您可以在 `master` 分支上的[此處](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)找到此專案狀態。

:::

## 建立網頁應用程式草稿

### 新增第一個帶有 React 的靜態頁面

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

*   `render()` 函數指示 [kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom) 將第一個 HTML 元素呈現在 [fragment (片段)](https://reactjs.org/docs/fragments.html) 內，並放入 `root` 元素中。此元素是在 `src/jsMain/resources/index.html` 中定義的容器，該檔案包含在範本中。
*   內容是一個 `<h1>` 標頭，並使用型別安全的 DSL 來呈現 HTML。
*   `h1` 是一個採用 lambda 參數的函數。當您在字串文字前面新增 `+` 符號時，實際上會使用 [運算子多載](operator-overloading) 來呼叫 `unaryPlus()` 函數。它會將字串附加到封閉的 HTML 元素。

當專案重新編譯時，瀏覽器會顯示此 HTML 頁面：

<img src="/img/hello-react-js.png" alt="An HTML page example" width="700" style={{verticalAlign: 'middle'}}/>

### 將 HTML 轉換為 Kotlin 的型別安全 HTML DSL

React 的 Kotlin [wrappers (封裝器)](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README) 隨附了一個 [domain-specific language (DSL，領域特定語言)](type-safe-builders)，可用於編寫純 Kotlin 程式碼中的 HTML。這樣，它就類似於 JavaScript 中的 [JSX](https://reactjs.org/docs/introducing-jsx.html)。然而，由於此標記是 Kotlin，因此您可以獲得靜態型別語言的所有好處，例如自動完成或型別檢查。

比較您未來網頁應用程式的經典 HTML 程式碼及其在 Kotlin 中的型別安全變體：

<Tabs>
<TabItem value="HTML" label="HTML">

```html
<h1>KotlinConf Explorer</h1>
<div>
<h3>Videos to watch</h3>
<p>
   John Doe: Building and breaking things
</p>
<p>
   Jane Smith: The development process
</p>
<p>
   Matt Miller: The Web 7.0
</p>
<h3>Videos watched</h3>
<p>
   Tom Jerry: Mouseless development
</p>
</div>
<div>
<h3>John Doe: Building and breaking things</h3>
    <img src="https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"/>
</div>
```

</TabItem>
<TabItem value="Kotlin" label="Kotlin">

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

</TabItem>
</Tabs>

複製 Kotlin 程式碼並更新 `main()` 函數內的 `Fragment.create()` 函數呼叫，以替換先前的 `h1` 標籤。

等待瀏覽器重新載入。頁面現在應該如下所示：

<img src="/img/website-draft.png" alt="The web app draft" width="700" style={{verticalAlign: 'middle'}}/>

### 使用標記中的 Kotlin 建構新增影片

使用此 DSL 在 Kotlin 中編寫 HTML 有一些優點。您可以使用常規的 Kotlin 建構來操作您的應用程式，例如迴圈、條件、集合和字串插值。

您現在可以使用 Kotlin 物件清單替換硬式編碼的影片清單：

1.  在 `Main.kt` 中，建立一個 `Video` [data class (資料類別)](data-classes) 以將所有影片屬性保存在一個位置：

    ```kotlin
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

2.  分別填寫兩個清單，一個用於未觀看的影片，另一個用於已觀看的影片。在 `Main.kt` 中以檔案層級新增這些宣告：

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

3.  為了在頁面上使用這些影片，請編寫一個 Kotlin `for` 迴圈來疊代未觀看的 `Video` 物件集合。將「Videos to watch」下的三個 `p` 標籤替換為以下程式碼片段：

    ```kotlin
    for (video in unwatchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

4.  套用相同的流程來修改程式碼，以處理「Videos watched」之後的單個標籤：

    ```kotlin
    for (video in watchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

等待瀏覽器重新載入。版面配置應該與之前保持不變。您可以向清單中新增更多影片，以確保迴圈正常運作。

### 使用型別安全 CSS 新增樣式

[kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/) 對於 [Emotion](https://emotion.sh/docs/introduction) 函式庫的封裝器，可用於指定 CSS 屬性 (甚至是動態屬性)，並將其與 JavaScript 中的 HTML 並列。從概念上講，這使其類似於 [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) – 但適用於 Kotlin。使用 DSL 的好處是，您可以使用 Kotlin 程式碼建構來表達格式規則。

本教學的範本專案已包含使用 `kotlin-emotion` 所需的依賴項：

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

使用 `kotlin-emotion`，您可以在 HTML 元素 `div` 和 `h3` 內指定一個 `css` 區塊，您可以在其中定義樣式。

若要將影片播放器移至頁面的右上角，請使用 CSS 並調整影片播放器的程式碼 (程式碼片段中的最後一個 `div`)：

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

請隨意嘗試其他樣式。例如，您可以變更 `fontFamily` 或向 UI 新增一些 `color`。

## 設計應用程式元件

React 中的基本建構區塊稱為 _[components (元件)](https://reactjs.org/docs/components-and-props.html) _。元件本身也可以由其他較小的元件組成。透過組合元件，您可以建構您的應用程式。如果您將元件建構為通用且可重複使用，您就可以在應用程式的多個部分中使用它們，而無需重複程式碼或邏輯。

`render()` 函數的內容通常描述一個基本元件。您應用程式的目前版面配置如下所示：

<img src="/img/current-layout.png" alt="Current layout" width="700" style={{verticalAlign: 'middle'}}/>

如果您將您的應用程式分解為單獨的元件，您最終會得到一個更結構化的版面配置，其中每個元件處理其職責：

<img src="/img/structured-layout.png" alt="Structured layout with components" width="700" style={{verticalAlign: 'middle'}}/>

元件封裝了特定的功能。使用元件可以縮短原始碼，並使其更易於閱讀和理解。

### 新增主要元件

若要開始建立應用程式的結構，首先明確指定 `App`，這是呈現給 `root` 元素的主要元件：

1.  在 `src/jsMain/kotlin` 資料夾中建立一個新的 `App.kt` 檔案。
2.  在此檔案中，新增以下程式碼片段，並將型別安全的 HTML 從 `Main.kt` 移至其中：

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

    `FC` 函數建立一個 [function component (函數元件)](https://reactjs.org/docs/components-and-props.html#function-and-class-components)。

3.  在 `Main.kt` 檔案中，更新 `main()` 函數，如下所示：

    ```kotlin
    fun main() {
        val container = document.getElementById("root") ?: error("Couldn't find root container!")
        createRoot(container).render(App.create())
    }
    ```

    現在程式會建立 `App` 元件的執行個體，並將其呈現到指定的容器。

如需有關 React 概念的更多資訊，請參閱 [documentation and guides (文件和指南)](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)。

### 擷取清單元件

由於 `watchedVideos` 和 `unwatchedVideos` 清單各自包含一個影片清單，因此建立一個可重複使用的單個元件是有意義的，並且僅調整清單中顯示的內容。

`VideoList` 元件遵循與 `App` 元件相同的模式。它使用 `FC` 建構器函數，並包含來自 `unwatchedVideos` 清單的程式碼。

1.  在 `src/jsMain/kotlin` 資料夾中建立一個新的 `VideoList.kt` 檔案，並新增以下程式碼：

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

2.  在 `App.kt` 中，透過在不帶參數的情況下呼叫它來使用 `VideoList` 元件：

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

    目前，`App` 元件無法控制 `VideoList` 元件所顯示的內容。它是硬式編碼的，因此您會看到相同的清單兩次。

### 新增 props (屬性) 以在元件之間傳遞資料

由於您將重複使用 `VideoList` 元件，因此您需要能夠使用不同的內容來填寫它。您可以新增將項目清單作為屬性傳遞給元件的功能。在 React 中，這些屬性稱為 _props (屬性)_。當 React 中元件的屬性變更時，框架會自動重新呈現該元件。

對於 `VideoList`，您需要一個包含要顯示的影片清單的屬性。定義一個介面，該介面保存可以傳遞給 `VideoList` 元件的所有屬性：

1.  將以下定義新增到 `VideoList.kt` 檔案：

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
    }
    ```

    [external (外部)](js-interop#external-modifier) 修飾詞告訴編譯器該介面的實作是從外部提供的，因此它不會嘗試從宣告產生 JavaScript 程式碼。

2.  調整 `VideoList` 的類別定義，以使用作為參數傳遞到 `FC` 區塊中的屬性：

    ```kotlin
    val VideoList = FC<VideoListProps> { props `->`
        for (video in props.videos) {
            p {
                key = video.id.toString()
                +"${video.speaker}: ${video.title}"
            }
        }
    }
    ```

    `key` 屬性可協助 React 呈現器確定在 `props.videos` 的值變更時該怎麼做。它使用 key 來確定清單的哪些部分需要重新整理，哪些部分保持不變。您可以在 [React guide (React 指南)](https://reactjs.org/docs/lists-and-keys.html) 中找到有關清單和 key 的更多資訊。

3.  在 `App` 元件中，請確保使用適當的屬性來實例化子元件。在 `App.kt` 中，將 `h3` 元素下的兩個迴圈替換為 `VideoList` 的呼叫，以及 `unwatchedVideos` 和 `watchedVideos` 的屬性。在 Kotlin DSL 中，您可以在屬於 `VideoList` 元件的區塊內分配它們：

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

重新載入後，瀏覽器會顯示清單現在已正確呈現。

### 使清單具有互動性

首先，新增一個警示訊息，當使用者按一下清單項目時會彈出該訊息。在 `VideoList.kt` 中，新增一個 `onClick` 處理常式函數，該函數會使用目前的影片觸發警示：

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

如果您在瀏覽器視窗中按一下其中一個清單項目，您將在警示視窗中收到有關該影片的資訊，如下所示：

<img src="/img/alert-window.png" alt="Browser alert window" width="700" style={{verticalAlign: 'middle'}}/>
:::note
將 `onClick` 函數直接定義為 lambda 簡潔且對於原型設計非常有用。但是，由於等式目前在 Kotlin/JS 中的 [運作方式](https://youtrack.jetbrains.com/issue/KT-15101)，就效能而言，這不是傳遞按一下處理常式的最佳方式。如果您想要最佳化呈現效能，請考慮將您的函數儲存在變數中並傳遞它們。

### 新增狀態以保留值

您可以新增一些功能，以使用 ▶ 三角形醒目提示所選影片，而不是僅僅警示使用者。為此，請引入特定於此元件的一些 _state (狀態)_。

狀態是 React 中的核心概念之一。在現代 React 中 (使用所謂的 _Hooks API (鉤子 API)_)，狀態是使用 [`useState` hook (鉤子)](https://reactjs.org/docs/hooks-state.html) 表示的。

1.  將以下程式碼新增到 `VideoList` 宣告的頂部：

    ```kotlin
    val VideoList = FC<VideoListProps> { props `->`
        var selectedVideo: Video? by useState(null)

    // . . .
    ```

    *   `VideoList` 函數元件會保留狀態 (獨立於目前函數呼叫的值)。狀態是可為 null 的，並且具有 `Video?` 型別。其預設值為 `null`。
    *   React 中的 `useState()` 函數指示框架在函數的多個呼叫中追蹤狀態。例如，即使您指定預設值，React 也會確保僅在開始時分配預設值。當狀態變更時，元件將根據新狀態重新呈現。
    *   `by` 關鍵字表示 `useState()` 充當 [delegated property (委派屬性)](delegated-properties)。與任何其他變數一樣，您可以讀取和寫入值。`useState()` 後面的實作負責使狀態運作所需的機制。

    若要瞭解有關 State Hook (狀態鉤子) 的更多資訊，請查看 [React documentation (React 文件)](https://reactjs.org/docs/hooks-state.html)。

2.  變更 `onClick` 處理常式和 `VideoList` 元件中的文字，使其如下所示：

    ```kotlin
    val VideoList = FC<VideoListProps> { props `->`
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

    *   當使用者按一下影片時，其值會分配給 `selectedVideo` 變數。
    *   當呈現所選清單項目時，會預先新增三角形。

您可以在 [React FAQ (React 常見問題)](https://reactjs.org/docs/faq-state.html) 中找到有關狀態管理的更多詳細資訊。

檢查瀏覽器並按一下清單中的項目，以確保一切正常運作。

## 組成元件

目前，這兩個影片清單各自運作，這表示每個清單都會追蹤所選影片。使用者可以選取兩個影片，一個在未觀看的清單中，一個在已觀看的清單中，即使只有一個播放器：

<img src="/img/two-videos-select.png" alt="Two videos are selected in both lists simultaneously" width="700" style={{verticalAlign: 'middle'}}/>

一個清單無法同時在其自身內部和兄弟清單內部追蹤所選取的影片。原因是所選取的影片不是 _list (清單)_ 狀態的一部分，而是 _application (應用程式)_ 狀態的一部分。這表示您需要從各個元件中 _lift (提升)_ 狀態。

### 提升狀態

React 確保只能將屬性從父元件傳遞到其子元件。這可以防止元件被硬連線在一起。

如果一個元件想要變更兄弟元件的狀態，它需要透過其父元件來執行此操作。在該時間點，狀態也不再屬於任何子元件，而是屬於總括的父元件。

將狀態從元件移轉到其父元件的過程稱為 _lifting state (提升狀態)_。對於您的應用程式，請將 `currentVideo` 作為狀態新增到 `App` 元件：

1.  在 `App.kt` 中，將以下內容新增到 `App` 元件定義的頂部：

    ```kotlin
    val App = FC<Props> {
        var currentVideo: Video? by useState(null)
    
        // . . .
    }
    ```

    `VideoList` 元件不再需要追蹤狀態。它將改為接收目前的影片作為屬性。

2.  移除 `VideoList.kt` 中的 `useState()` 呼叫。
3.  準備 `VideoList` 元件以接收所選影片作為屬性。為此，請擴展 `VideoListProps` 介面以包含 `selectedVideo`：

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
        var selectedVideo: Video?
    }
    ```

4.  變更三角形的條件，使其使用 `props` 而不是 `state`：

    ```kotlin
    if (video == props.selectedVideo) {
        +"▶ "
    }
    ```

### 傳遞處理常式

目前，沒有任何方法可以為屬性分配值，因此 `onClick` 函數將無法以目前設定的方式運作。若要變更父元件的狀態，您需要再次提升狀態。

在 React 中，狀態始終從父元件流向子元件。因此，若要從其中一個子元件變更 _application (應用程式)_ 狀態，您需要將處理使用者互動的邏輯移至父元件，然後將該邏輯作為屬性傳遞進來。請記住，在 Kotlin 中，變數可以具有 [type of a function (函數的型別)](lambdas#function-types)。

1.  再次擴展 `VideoListProps` 介面，使其包含一個變數 `onSelectVideo`，該變數是一個採用 `Video` 並傳回 `Unit` 的函數：

    ```kotlin
    external interface VideoListProps : Props {
        // ...
        var onSelectVideo: (Video) `->` Unit
    }
    ```

2.  在 `VideoList` 元件中，在 `onClick` 處理常式中使用新的屬性：

    ```kotlin
    onClick = {
        props.onSelectVideo(video)
    }
    ```

    您現在可以從 `VideoList` 元件中刪除 `selectedVideo` 變數。

3.  返回 `App` 元件並為兩個影片清單分別傳遞 `selectedVideo` 和 `onSelectVideo` 的處理常式：

    ```kotlin
    VideoList {
        videos = unwatchedVideos // and watchedVideos respectively
        selectedVideo = currentVideo
        onSelectVideo = { video `->`
            currentVideo = video
        }
    }
    ```

4.  對已觀看的影片清單重複上一個步驟。

切換回您的瀏覽器並確保在選取影片時，選取會在兩個清單之間跳轉而不會重複。

## 新增更多元件

### 擷取影片播放器元件

您現在可以建立另一個獨立的元件，即影片播放器，目前該元件是一個預留位置影像。您的影片播放器需要知道演講標題、演講作者以及影片的連結。此資訊已包含在每個 `Video` 物件中，因此您可以將其作為屬性傳遞並存取其屬性。

1.  建立一個新的 `VideoPlayer.kt` 檔案，並為 `VideoPlayer` 元件新增以下實作：

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
    
    val VideoPlayer = FC<VideoPlayerProps> { props `->`
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

2.  由於 `VideoPlayerProps` 介面指定 `VideoPlayer` 元件採用不可為 null 的 `Video`，因此請確保在 `App` 元件中相應地處理此問題。

    在 `App.kt` 中，將先前的影片播放器 `div` 程式碼片段替換為以下內容：

    ```kotlin
    currentVideo?.let { curr `->`
        VideoPlayer {
            video = curr
        }
    }
    ```

    [`let` scope function (範圍函數)](scope-functions#let) 確保僅在 `state.currentVideo` 不為 null 時才新增 `VideoPlayer` 元件。

現在按一下清單中的項目會調出影片播放器，並使用來自所按項目的資訊來填寫它。

### 新增按鈕並連接它

為了讓使用者可以將影片標記為已觀看或未觀看，並在兩個清單之間移動它，請將一個按鈕新增到 `VideoPlayer` 元件。

由於此按鈕將在兩個不同的清單之間移動影片，因此處理狀態變更的邏輯需要從 `VideoPlayer` 中 _lifted (提升)_ 出來，並從父元件中作為屬性傳遞進來。按鈕的外觀應根據影片是否已觀看而有所不同。這也是您需要作為屬性傳遞的資訊。

1.  展開 `VideoPlayerProps` 介面 (位於 `VideoPlayer.kt` 中) 以包含這兩種情況的屬性：

    ```kotlin
    external interface VideoPlayerProps : Props {
        var video: Video
        var onWatchedButtonPressed: (Video) `->` Unit
        var unwatchedVideo: Boolean
    }
    ```

2.  您現在可以將按鈕新增到實際元件。將以下程式碼片段複製到 `VideoPlayer` 元件的主體中，位於 `h3` 和 `img` 標籤之間：

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

    借助於 Kotlin CSS DSL，它可以動態變更樣式，您可以使用基本的 Kotlin `if` 運算式來變更按鈕的顏色。

### 將影片清單移至應用程式狀態

現在是時候調整 `App` 元件中 `VideoPlayer` 的使用位置了。當按一下按鈕時，影片應該從未觀看的清單移動