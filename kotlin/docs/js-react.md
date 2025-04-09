---
title: "使用 React 和 Kotlin/JS 构建 Web 应用程序 — 教程"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>

本教程将教你如何使用 Kotlin/JS 和 [React](https://reactjs.org/) 框架构建浏览器应用程序。你将：

*   完成与构建典型 React 应用程序相关的常见任务。
*   探索如何使用 [Kotlin 的 DSL](type-safe-builders) 以简洁统一的方式表达概念，而不会牺牲可读性，从而允许你完全使用 Kotlin 编写一个功能完善的应用程序。
*   学习如何使用现成的 npm 组件、使用外部库并发布最终应用程序。

最终会得到一个 _KotlinConf Explorer_ Web 应用程序，它专门用于 [KotlinConf](https://kotlinconf.com/) 活动，其中包含指向会议讲座的链接。用户可以在一个页面上观看所有讲座，并将其标记为已观看或未观看。

本教程假定你事先了解 Kotlin，并且具备 HTML 和 CSS 的基本知识。 了解 React 背后的基本概念可能有助于你理解一些示例代码，但不是硬性要求。

:::note
你可以在[这里](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)获取最终应用程序。

:::

## 开始之前

1.  下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。
2.  克隆 [项目模板](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle) 并在 IntelliJ IDEA 中打开它。 该模板包含一个基本的 Kotlin Multiplatform Gradle 项目，其中包含所有必需的配置和依赖项

    *   `build.gradle.kts` 文件中的依赖项和任务：

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

    *   `src/jsMain/resources/index.html` 中的 HTML 模板页面，用于插入你将在本教程中使用的 JavaScript 代码：

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

    构建 Kotlin/JS 项目时，会自动将你的所有代码及其依赖项捆绑到一个 JavaScript 文件中，该文件的名称与项目名称相同，即 `confexplorer.js`。按照典型的 [JavaScript 约定](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)，首先加载 body 的内容（包括 `root` div），以确保浏览器在加载脚本之前加载所有页面元素。

*   `src/jsMain/kotlin/Main.kt` 中的代码片段：

    ```kotlin
    import kotlinx.browser.document
    
    fun main() {
        document.bgColor = "red"
    }
    ```

### 运行开发服务器

默认情况下，Kotlin Multiplatform Gradle 插件支持嵌入式 `webpack-dev-server`，允许你从 IDE 运行应用程序，而无需手动设置任何服务器。

要测试程序是否在浏览器中成功运行，请通过从 IntelliJ IDEA 中的 Gradle 工具窗口调用 `run` 或 `browserDevelopmentRun` 任务（位于 `other` 或 `kotlin browser` 目录中）来启动开发服务器：

<img src="/img/browser-development-run.png" alt="Gradle tasks list" width="700" style={{verticalAlign: 'middle'}}/>

要从终端运行程序，请改用 `./gradlew run`。

当项目被编译和打包后，浏览器窗口中将出现一个空白的红色页面：

<img src="/img/red-page.png" alt="Blank red page" width="700" style={{verticalAlign: 'middle'}}/>

### 启用热重载 / 持续模式

配置 _[continuous compilation](dev-server-continuous-compilation)_ 模式，这样你就不必每次更改时都手动编译和执行项目。在继续操作之前，请确保停止所有正在运行的开发服务器实例。

1.  编辑 IntelliJ IDEA 在首次运行 Gradle `run` 任务后自动生成的运行配置：

    <img src="/img/edit-configurations-continuous.png" alt="Edit a run configuration" width="700" style={{verticalAlign: 'middle'}}/>

2.  在“**Run/Debug Configurations**”对话框中，将 `--continuous` 选项添加到运行配置的参数中：

    <img src="/img/continuous-mode.png" alt="Enable continuous mode" width="700" style={{verticalAlign: 'middle'}}/>

    应用更改后，你可以使用 IntelliJ IDEA 中的“**Run**”按钮重新启动开发服务器。要从终端运行持续 Gradle 构建，请改用 `./gradlew run --continuous`。

3.  要测试此功能，请在 Gradle 任务运行时，在 `Main.kt` 文件中将页面颜色更改为蓝色：

    ```kotlin
    document.bgColor = "blue"
    ```

    然后，项目将重新编译，并且在重新加载后，浏览器页面将变为新的颜色。

你可以在开发过程中保持开发服务器以持续模式运行。 当你进行更改时，它将自动重建并重新加载页面。

:::note
你可以在 `master` 分支上的[此处](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)找到项目的此状态。

:::

## 创建 Web 应用程序草稿

### 使用 React 添加第一个静态页面

要使你的应用程序显示一条简单的消息，请将 `Main.kt` 文件中的代码替换为以下内容：

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

*   `render()` 函数指示 [kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom) 将第一个 HTML 元素呈现到 [fragment (片段)](https://reactjs.org/docs/fragments.html) 内的 `root` 元素。 此元素是在 `src/jsMain/resources/index.html` 中定义的容器，已包含在模板中。
*   内容是一个 `<h1>` 标题，并使用类型安全的 DSL 呈现 HTML。
*   `h1` 是一个采用 lambda 参数的函数。 当你在字符串文字前面添加 `+` 符号时，实际上是使用 [运算符重载](operator-overloading) 调用 `unaryPlus()` 函数。 它将字符串附加到封闭的 HTML 元素。

当项目重新编译时，浏览器将显示此 HTML 页面：

<img src="/img/hello-react-js.png" alt="An HTML page example" width="700" style={{verticalAlign: 'middle'}}/>

### 将 HTML 转换为 Kotlin 的类型安全 HTML DSL

React 的 Kotlin [wrapper (封装器)](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README) 附带一个 [domain-specific language (DSL) (领域特定语言)](type-safe-builders)，可以让你用纯 Kotlin 代码编写 HTML。 这样，它类似于 JavaScript 中的 [JSX](https://reactjs.org/docs/introducing-jsx.html)。 但是，由于此标记是 Kotlin，因此你可以获得静态类型语言的所有好处，例如自动完成或类型检查。

比较一下你的未来 Web 应用程序的经典 HTML 代码和 Kotlin 中类型安全的变体：

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

复制 Kotlin 代码并更新 `main()` 函数内的 `Fragment.create()` 函数调用，替换之前的 `h1` 标签。

等待浏览器重新加载。 页面现在应该如下所示：

<img src="/img/website-draft.png" alt="The web app draft" width="700" style={{verticalAlign: 'middle'}}/>

### 使用 Kotlin 构造在标记中添加视频

使用此 DSL 在 Kotlin 中编写 HTML 有一些优点。 你可以使用常规 Kotlin 构造来操作你的应用程序，例如循环、条件、集合和字符串插值。

你现在可以将硬编码的视频列表替换为 Kotlin 对象列表：

1.  在 `Main.kt` 中，创建一个 `Video` [data class (数据类)](data-classes) 以将所有视频属性保存在一个位置：

    ```kotlin
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

2.  分别填充两个列表，用于未观看的视频和已观看的视频。 在 `Main.kt` 中以文件级别添加这些声明：

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

3.  要在页面上使用这些视频，请编写一个 Kotlin `for` 循环来迭代未观看的 `Video` 对象的集合。 将“Videos to watch”下的三个 `p` 标签替换为以下代码段：

    ```kotlin
    for (video in unwatchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

4.  应用相同的过程来修改代码，以修改“Videos watched”后的单个标签：

    ```kotlin
    for (video in watchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

等待浏览器重新加载。 布局应与之前保持不变。 你可以向列表中添加更多视频，以确保循环正常工作。

### 使用类型安全的 CSS 添加样式

用于 [Emotion](https://emotion.sh/docs/introduction) 库的 [kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/) wrapper (封装器) 允许你指定 CSS 属性（甚至是动态属性），以及 JavaScript 中的 HTML。 从概念上讲，它类似于 [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) – 但对于 Kotlin 而言。 使用 DSL 的好处是，你可以使用 Kotlin 代码构造来表达格式规则。

本教程的模板项目已经包含使用 `kotlin-emotion` 所需的依赖项：

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

使用 `kotlin-emotion`，你可以在 HTML 元素 `div` 和 `h3` 中指定一个 `css` 块，你可以在其中定义样式。

要将视频播放器移动到页面的右上角，请使用 CSS 并调整视频播放器的代码（代码段中的最后一个 `div`）：

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

你可以随意试验其他样式。 例如，你可以更改 `fontFamily` 或向 UI 添加一些 `color`。

## 设计应用程序组件

React 中的基本构建块称为 _[components (组件)](https://reactjs.org/docs/components-and-props.html) _。 组件本身也可以由其他更小的组件组成。 通过组合组件，你可以构建你的应用程序。 如果你将组件构造为通用且可重用的组件，则可以在应用程序的多个部分中使用它们，而无需复制代码或逻辑。

`render()` 函数的内容通常描述一个基本组件。 你的应用程序的当前布局如下所示：

<img src="/img/current-layout.png" alt="Current layout" width="700" style={{verticalAlign: 'middle'}}/>

如果你将应用程序分解为各个组件，你将最终获得一个更结构化的布局，其中每个组件都处理其职责：

<img src="/img/structured-layout.png" alt="Structured layout with components" width="700" style={{verticalAlign: 'middle'}}/>

组件封装了特定的功能。 使用组件可以缩短源代码，并使其更易于阅读和理解。

### 添加主组件

要开始创建应用程序的结构，首先显式指定 `App`，这是呈现到 `root` 元素的主组件：

1.  在 `src/jsMain/kotlin` 文件夹中创建一个新的 `App.kt` 文件。
2.  在此文件中，添加以下代码段并将类型安全的 HTML 从 `Main.kt` 移入其中：

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

    `FC` 函数创建一个 [function component (函数组件)](https://reactjs.org/docs/components-and-props.html#function-and-class-components)。

3.  在 `Main.kt` 文件中，按如下所示更新 `main()` 函数：

    ```kotlin
    fun main() {
        val container = document.getElementById("root") ?: error("Couldn't find root container!")
        createRoot(container).render(App.create())
    }
    ```

    现在，该程序将创建一个 `App` 组件的实例，并将其呈现到指定的容器。

有关 React 概念的更多信息，请参见 [文档和指南](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)。

### 提取列表组件

由于 `watchedVideos` 和 `unwatchedVideos` 列表都包含视频列表，因此创建单个可重用组件，并且仅调整列表中显示的内容是有意义的。

`VideoList` 组件遵循与 `App` 组件相同的模式。 它使用 `FC` 构建器函数，并包含来自 `unwatchedVideos` 列表的代码。

1.  在 `src/jsMain/kotlin` 文件夹中创建一个新的 `VideoList.kt` 文件，并添加以下代码：

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

2.  在 `App.kt` 中，通过不带参数地调用 `VideoList` 组件来使用它：

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

    目前，`App` 组件无法控制 `VideoList` 组件显示的内容。 它是硬编码的，因此你会看到两次相同的列表。

### 添加 props 以在组件之间传递数据

由于你要重用 `VideoList` 组件，因此你需要能够使用不同的内容填充它。 你可以添加将项目列表作为属性传递给组件的功能。 在 React 中，这些属性称为 _props_。 当 React 中组件的 props 发生更改时，框架会自动重新呈现该组件。

对于 `VideoList`，你需要一个包含要显示的视频列表的 prop。 定义一个接口，该接口保存可以传递给 `VideoList` 组件的所有 props：

1.  将以下定义添加到 `VideoList.kt` 文件：

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
    }
    ```

    [external (外部)](js-interop#external-modifier) 修饰符告诉编译器该接口的实现是在外部提供的，因此它不会尝试从该声明生成 JavaScript 代码。

2.  调整 `VideoList` 的类定义，以使用作为参数传递到 `FC` 块中的 props：

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

    `key` 属性可帮助 React 渲染器确定在 `props.videos` 的值更改时该怎么办。 它使用 key 来确定列表的哪些部分需要刷新，哪些部分保持不变。 你可以在 [React 指南](https://reactjs.org/docs/lists-and-keys.html)中找到有关列表和 key 的更多信息。

3.  在 `App` 组件中，请确保使用正确的属性实例化子组件。 在 `App.kt` 中，将 `h3` 元素下的两个循环替换为 `VideoList` 的调用以及 `unwatchedVideos` 和 `watchedVideos` 的属性。 在 Kotlin DSL 中，你可以在属于 `VideoList` 组件的块中分配它们：

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

重新加载后，浏览器将显示列表现在正确呈现。

### 使列表具有交互性

首先，添加一个警报消息，当用户单击列表条目时会弹出该消息。 在 `VideoList.kt` 中，添加一个 `onClick` 处理函数，该函数会触发一个带有当前视频的警报：

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

如果单击浏览器窗口中的列表项之一，你将在警报窗口中获得有关该视频的信息，如下所示：

<img src="/img/alert-window.png" alt="Browser alert window" width="700" style={{verticalAlign: 'middle'}}/>
:::note
直接将 `onClick` 函数定义为 lambda 既简洁又非常有用，适用于原型设计。 但是，由于 Kotlin/JS 中相等性的 [当前工作方式](https://youtrack.jetbrains.com/issue/KT-15101)，就性能而言，它并不是传递单击处理程序的最优化方式。 如果要优化渲染性能，请考虑将函数存储在变量中并传递它们。

### 添加状态以保留值

除了仅向用户发出警报之外，你还可以添加一些功能来使用 ▶ 三角形突出显示所选视频。 为此，请为此组件引入一些特定的 _state (状态)_。

状态是 React 中的核心概念之一。 在现代 React 中（它使用所谓的 _Hooks API_），状态使用 [`useState` hook (钩子)](https://reactjs.org/docs/hooks-state.html) 表示。

1.  将以下代码添加到 `VideoList` 声明的顶部：

    ```kotlin
    val VideoList = FC<VideoListProps> { props `->`
        var selectedVideo: Video? by useState(null)

    // . . .
    ```

    *   `VideoList` 函数组件保持状态（独立于当前函数调用的值）。 状态是可空的，并且具有 `Video?` 类型。 其默认值为 `null`。
    *   React 中的 `useState()` 函数指示框架跨函数的多次调用跟踪状态。 例如，即使你指定了默认值，React 也会确保仅在开始时分配默认值。 当状态更改时，组件将基于新状态重新呈现。
    *   `by` 关键字指示 `useState()` 充当 [delegated property (委托属性)](delegated-properties)。 与任何其他变量一样，你可以读取和写入值。 `useState()` 后面的实现负责使状态正常工作所需的机制。

    要了解有关 State Hook 的更多信息，请查看 [React 文档](https://reactjs.org/docs/hooks-state.html)。

2.  更改 `onClick` 处理程序和 `VideoList` 组件中的文本，使其如下所示：

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

    *   当用户单击视频时，其值将被分配给 `selectedVideo` 变量。
    *   当呈现选定的列表条目时，三角形将被添加到前面。

你可以在 [React FAQ](https://reactjs.org/docs/faq-state.html) 中找到有关状态管理的更多详细信息。

检查浏览器并单击列表中的一个项目，以确保一切正常。

## 组合组件

当前，这两个视频列表可以独立工作，这意味着每个列表都会跟踪所选视频。 用户可以选择两个视频，一个在未观看的列表中，一个在已观看的列表中，即使只有一个播放器：

<img src="/img/two-videos-select.png" alt="Two videos are selected in both lists simultaneously" width="700" style={{verticalAlign: 'middle'}}/>

列表无法同时在自身内部和同级列表内部跟踪选择了哪个视频。 原因是所选视频不是 _列表_ 状态的一部分，而是 _应用程序_ 状态的一部分。 这意味着你需要从各个组件中 _提升_ 状态。

### 提升状态

React 确保 props 只能从父组件传递到其子组件。 这样可以防止组件硬连接在一起。

如果组件想要更改同级组件的状态，则需要通过其父组件来执行此操作。 此时，状态也不再属于任何子组件，而是属于总体的父组件。

将状态从组件迁移到其父组件的过程称为 _lifting state (提升状态)_。 对于你的应用程序，请将 `currentVideo` 作为状态添加到 `App` 组件：

1.  在 `App.kt` 中，将以下内容添加到 `App` 组件定义的顶部：

    ```kotlin
    val App = FC<Props> {
        var currentVideo: Video? by useState(null)
    
        // . . .
    }
    ```

    `VideoList` 组件不再需要跟踪状态。 相反，它将收到作为 prop 的当前视频。

2.  删除 `VideoList.kt` 中的 `useState()` 调用。
3.  准备好 `VideoList` 组件以接收所选视频作为 prop。 为此，请展开 `VideoListProps` 接口以包含 `selectedVideo`：

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
        var selectedVideo: Video?
    }
    ```

4.  更改三角形的条件，使其使用 `props` 而不是 `state`：

    ```kotlin
    if (video == props.selectedVideo) {
        +"▶ "
    }
    ```

### 传递处理程序

目前，没有办法为 prop 分配一个值，因此 `onClick` 函数将无法按当前设置的方式工作。 要更改父组件的状态，你需要再次提升状态。

在 React 中，状态始终从父组件流向子组件。 因此，要从其中一个子组件更改 _应用程序_ 状态，你需要将用于处理用户交互的逻辑移到父组件，然后将该逻辑作为 prop 传入。 请记住，在 Kotlin 中，变量可以具有 [函数的类型](lambdas#function-types)。

1.  再次展开 `VideoListProps` 接口，使其包含一个变量 `onSelectVideo`，这是一个接受 `Video` 并返回 `Unit` 的函数：

    ```kotlin
    external interface VideoListProps : Props {
        // ...
        var onSelectVideo: (Video) `->` Unit
    }
    ```

2.  在 `VideoList` 组件中，在 `onClick` 处理程序中使用新的 prop：

    ```kotlin
    onClick = {
        props.onSelectVideo(video)
    }
    ```

    你现在可以从 `VideoList` 组件中删除 `selectedVideo` 变量。

3.  返回到 `App` 组件并为两个视频列表中的每一个传递 `selectedVideo` 和 `onSelectVideo` 的处理程序：

    ```kotlin
    VideoList {
        videos = unwatchedVideos // and watchedVideos respectively
        selectedVideo = currentVideo
        onSelectVideo = { video `->`
            currentVideo = video
        }
    }
    ```

4.  对已观看的视频列表重复上一步。

切换回你的浏览器，并确保在选择视频时，所选内容会在两个列表之间跳转，而不会重复。

## 添加更多组件

### 提取视频播放器组件

你现在可以创建另一个独立的组件，即视频播放器，它当前是一个占位符图像。 你的视频播放器需要知道讲座标题、讲座作者以及视频链接。 此信息已经包含在每个 `Video` 对象中，因此你可以将其作为 prop 传递并访问其属性。

1.  创建一个新的 `VideoPlayer.kt` 文件，并为 `VideoPlayer` 组件添加以下实现：

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

2.  由于 `VideoPlayerProps` 接口指定 `VideoPlayer` 组件采用不可为空的 `Video`，请确保在 `App` 组件中相应地处理它。

    在 `App.kt` 中，将先前用于视频播放器的 `div` 代码段替换为以下内容：

    ```kotlin
    currentVideo?.let { curr `->`
        VideoPlayer {
            video = curr
        }
    }
    ```

    [`let` 作用域函数](scope-functions#let) 确保仅当 `state.currentVideo` 不为 null 时才添加 `VideoPlayer` 组件。

现在，单击列表中的条目将调出视频播放器，并使用单击的条目中的信息填充它。

### 添加按钮并连接它

为了使用户可以将视频标记为已观看或未观看，并在两个列表之间移动它，请将一个按钮添加到 `VideoPlayer` 组件。

由于此按钮将在两个不同的列表之间移动视频，因此处理状态更改的逻辑需要从 `VideoPlayer` 中 _提升_ 出来，并从父组件作为 prop 传入。 该按钮的外观应根据视频是否已被观看而有所不同。 这也是你需要作为 prop 传递的信息。

1.  在 `VideoPlayer.kt` 中展开 `VideoPlayerProps` 接口以包含这两个案例的属性：

    ```kotlin
    external interface VideoPlayerProps : Props {
        var video: Video
        var onWatchedButtonPressed: (Video) `->` Unit
        var unwatchedVideo: Boolean
    }
    ```

2.  你现在可以将按钮添加到实际组件。 将以下代码段复制到 `VideoPlayer` 组件的主体中，位于 `h3` 和 `img` 标签之间：

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

    借助 Kotlin CSS DSL，它可以动态更改样式，你可以使用基本的 Kotlin `if` 表达式来更改按钮的颜色。

### 将视频列表移到应用程序状态

现在是时候调整 `App` 组件中 `VideoPlayer` 的用法了。 单击按钮后，应将视频从未观看的列表移动到已观看的列表，反之亦然。 由于这些列表现在实际上可以更改，请将它们移动到应用程序状态：

1.  在 `App.kt` 中，使用 `useState()` 调用将以下属性添加到 `App` 组件的顶部：

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

2.  由于所有演示数据都直接包含在 `watchedVideos` 和 `unwatchedVideos` 的默认值中，因此你不再需要文件级别的声明。 在 `Main.kt` 中，删除 `watchedVideos` 和 `unwatchedVideos` 的声明。
3.  更改属于视频播放器的 `App` 组件中 `VideoPlayer` 的调用站点，使其如下所示：

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

返回到浏览器，选择一个视频，然后按几次按钮。 视频将在两个列表之间跳转。

## 使用来自 npm 的包

要使应用程序可用，你仍然需要一个实际播放视频的视频播放器和一些按钮来帮助人们共享内容。

React 拥有一个丰富的生态系统，其中包含许多你可以使用的预制组件，而无需自己构建此功能。

### 添加视频播放器组件

要使用实际的 YouTube 播放器替换占位符视频组件，请使用来自 npm 的 `react-player` 包。 它可以播放视频，并允许你控制播放器的外观。

有关组件文档和 API 描述，请参见 GitHub 中的 [README](https://www.npmjs.com/package/react-player)。

1.  检查 `build.gradle.kts` 文件。 应该已经包含 `react-player` 包：

    ```kotlin
    dependencies {