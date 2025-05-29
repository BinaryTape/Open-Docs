[//]: # (title: 使用 React 和 Kotlin/JS 构建 Web 应用程序 — 教程)

<no-index/>

本教程将教你如何使用 Kotlin/JS 和 [React](https://reactjs.org/) 框架构建一个浏览器应用程序。你将：

* 完成构建典型 React 应用程序的常见任务。
* 探索如何使用 [Kotlin 的领域特定语言 (DSL)](type-safe-builders.md) 来简洁统一地表达概念，同时不牺牲可读性，从而让你完全使用 Kotlin 编写一个功能完备的应用程序。
* 学习如何使用现成的 npm 组件、使用外部库以及发布最终应用程序。

最终输出将是一个 _KotlinConf Explorer_ Web 应用程序，专门用于 [KotlinConf](https://kotlinconf.com/) 大会，其中包含大会演讲链接。用户将能够在同一页面观看所有演讲并将其标记为已看或未看。

本教程假设你已具备 Kotlin 的先验知识以及 HTML 和 CSS 的基础知识。了解 React 的基本概念可能有助于你理解一些示例代码，但并非严格要求。

> 你可以在[此处](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)获取最终应用程序。
>
{style="note"}

## 开始之前

1. 下载并安装最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。
2. 克隆[项目模板](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle)并在 IntelliJ IDEA 中打开它。该模板包含一个基本的 Kotlin Multiplatform Gradle 项目，其中包含所有必需的配置和依赖项

   * `build.gradle.kts` 文件中的依赖项和任务：

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

   * `src/jsMain/resources/index.html` 中的 HTML 模板页面，用于插入本教程中将使用的 JavaScript 代码：

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

   构建 Kotlin/JS 项目时，它们会自动将你的所有代码及其依赖项打包成一个 JavaScript 文件，该文件与项目同名，即 `confexplorer.js`。根据典型的 [JavaScript 约定](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)，正文内容（包括 `root` div）会先加载，以确保浏览器在加载脚本之前加载所有页面元素。

* `src/jsMain/kotlin/Main.kt` 中的代码片段：

   ```kotlin
   import kotlinx.browser.document
   
   fun main() {
       document.bgColor = "red"
   }
   ```

### 运行开发服务器

默认情况下，Kotlin Multiplatform Gradle 插件支持嵌入式 `webpack-dev-server`，让你无需手动设置任何服务器即可从 IDE 运行应用程序。

为了测试程序是否在浏览器中成功运行，通过调用 `run` 或 `browserDevelopmentRun` 任务（在 `other` 或 `kotlin browser` 目录中可用）从 IntelliJ IDEA 内的 Gradle 工具窗口中启动开发服务器：

![Gradle tasks list](browser-development-run.png){width=700}

若要从终端运行程序，请改用 `./gradlew run`。

项目编译并打包后，浏览器窗口中将出现一个空白的红色页面：

![Blank red page](red-page.png){width=700}

### 启用热重载 / 持续模式

配置 _[持续编译](dev-server-continuous-compilation.md)_ 模式，这样你就不必每次更改代码时都手动编译和执行项目了。请务必在继续之前停止所有正在运行的开发服务器实例。

1. 编辑 IntelliJ IDEA 在首次运行 Gradle `run` 任务后自动生成的运行配置：

   ![Edit a run configuration](edit-configurations-continuous.png){width=700}

2. 在 **运行/调试配置** 对话框中，为运行配置的参数添加 `--continuous` 选项：

   ![Enable continuous mode](continuous-mode.png){width=700}

   应用更改后，你可以使用 IntelliJ IDEA 中的 **运行** 按钮重新启动开发服务器。若要从终端运行持续的 Gradle 构建，请改用 `./gradlew run --continuous`。

3. 为了测试此功能，在 Gradle 任务运行时，在 `Main.kt` 文件中将页面颜色更改为蓝色：

   ```kotlin
   document.bgColor = "blue"
   ```

   项目随后会重新编译，并且重新加载后，浏览器页面将显示新颜色。

你可以在开发过程中保持开发服务器以持续模式运行。当你进行更改时，它会自动重新构建并重新加载页面。

> 你可以在 `master` 分支的[此处](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)找到此项目状态。
>
{style="note"}

## 创建 Web 应用程序草稿

### 使用 React 添加第一个静态页面

为了让你的应用程序显示一条简单消息，请将 `Main.kt` 文件中的代码替换为以下内容：

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

* `render()` 函数指示 [kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom) 将 [fragment](https://reactjs.org/docs/fragments.html) 中的第一个 HTML 元素渲染到 `root` 元素。此元素是 `src/jsMain/resources/index.html` 中定义的容器，该容器已包含在模板中。
* 内容是一个 `<h1>` 标题，并使用类型安全的 DSL 来渲染 HTML。
* `h1` 是一个接受 lambda 参数的函数。当你在字符串字面量前面添加 `+` 符号时，实际上是使用[运算符重载](operator-overloading.md)调用了 `unaryPlus()` 函数。它将字符串附加到封闭的 HTML 元素中。

项目重新编译后，浏览器将显示此 HTML 页面：

![An HTML page example](hello-react-js.png){width=700}

### 将 HTML 转换为 Kotlin 的类型安全 HTML DSL

React 的 Kotlin [封装](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README.md) 提供了一种[领域特定语言 (DSL)](type-safe-builders.md)，使你能够纯粹使用 Kotlin 代码编写 HTML。通过这种方式，它类似于 JavaScript 中的 [JSX](https://reactjs.org/docs/introducing-jsx.html)。然而，由于这种标记是 Kotlin，你将获得静态类型语言的所有好处，例如自动补全或类型检查。

比较未来 Web 应用程序的经典 HTML 代码及其在 Kotlin 中的类型安全变体：

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

复制 Kotlin 代码，并更新 `main()` 函数中的 `Fragment.create()` 函数调用，替换之前的 `h1` 标签。

等待浏览器重新加载。页面现在应该如下所示：

![The web app draft](website-draft.png){width=700}

### 在标记中使用 Kotlin 结构添加视频

使用这种 DSL 在 Kotlin 中编写 HTML 有一些优点。你可以使用常规的 Kotlin 结构来操作你的应用程序，例如循环、条件、集合和字符串插值。

现在你可以将硬编码的视频列表替换为 Kotlin 对象列表：

1. 在 `Main.kt` 中，创建一个 `Video` [数据类](data-classes.md) 用于将所有视频属性集中存储：

   ```kotlin
   data class Video(
       val id: Int,
       val title: String,
       val speaker: String,
       val videoUrl: String
   )
   ```

2. 分别填充两个列表：未观看视频和已观看视频。将这些声明添加到 `Main.kt` 的文件级别：

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

3. 若要在页面上使用这些视频，编写一个 Kotlin `for` 循环来遍历未观看 `Video` 对象的集合。将“待观看视频”下的三个 `p` 标签替换为以下代码片段：

   ```kotlin
   for (video in unwatchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```
   
4. 将相同的过程应用于修改“已观看视频”后的单个标签的代码：

   ```kotlin
   for (video in watchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```

等待浏览器重新加载。布局应保持不变。你可以向列表中添加更多视频，以确保循环正常工作。

### 使用类型安全 CSS 添加样式

[kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/) 是 [Emotion](https://emotion.sh/docs/introduction) 库的封装，它允许你在 HTML 旁边通过 JavaScript 指定 CSS 属性，甚至是动态属性。从概念上讲，这使得它类似于 [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) —— 但针对 Kotlin。使用 DSL 的好处是你可以使用 Kotlin 代码结构来表达格式规则。

本教程的模板项目已包含使用 `kotlin-emotion` 所需的依赖项：

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

借助 `kotlin-emotion`，你可以在 HTML 元素 `div` 和 `h3` 内部指定一个 `css` 块，在其中定义样式。

要将视频播放器移动到页面的右上角，使用 CSS 并调整视频播放器的代码（代码片段中的最后一个 `div`）：

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

你可以随意尝试其他样式。例如，你可以更改 `fontFamily` 或为 UI 添加一些 `color`。

## 设计应用程序组件

React 中的基本构建块称为 _[组件](https://reactjs.org/docs/components-and-props.html)_。组件本身也可以由其他更小的组件组成。通过组合组件，你可以构建应用程序。如果你将组件设计为通用且可重用的，你将能够在应用程序的多个部分中使用它们，而无需复制代码或逻辑。

`render()` 函数的内容通常描述一个基本组件。你的应用程序当前布局如下：

![Current layout](current-layout.png){width=700}

如果你将应用程序分解为独立的组件，你将得到一个更结构化的布局，其中每个组件都处理其职责：

![Structured layout with components](structured-layout.png){width=700}

组件封装了特定的功能。使用组件可以缩短源代码，使其更易于阅读和理解。

### 添加主组件

要开始创建应用程序的结构，首先明确指定 `App`，它是渲染到 `root` 元素的主组件：

1. 在 `src/jsMain/kotlin` 文件夹中创建一个新的 `App.kt` 文件。
2. 在此文件中，添加以下代码片段并将 `Main.kt` 中的类型安全 HTML 移入其中：

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
   
   `FC` 函数创建了一个[函数组件](https://reactjs.org/docs/components-and-props.html#function-and-class-components)。

3. 在 `Main.kt` 文件中，按如下方式更新 `main()` 函数：

   ```kotlin
   fun main() {
       val container = document.getElementById("root") ?: error("Couldn't find root container!")
       createRoot(container).render(App.create())
   }
   ```

   现在程序将创建 `App` 组件的一个实例并将其渲染到指定的容器。

有关 React 概念的更多信息，请参阅[文档和指南](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)。

### 提取列表组件

由于 `watchedVideos` 和 `unwatchedVideos` 列表都包含一个视频列表，因此创建一个可重用的组件是合理的，并且只需调整列表中显示的内容即可。

`VideoList` 组件遵循与 `App` 组件相同的模式。它使用 `FC` 构建器函数，并包含 `unwatchedVideos` 列表中的代码。

1. 在 `src/jsMain/kotlin` 文件夹中创建一个新的 `VideoList.kt` 文件，并添加以下代码：

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

2. 在 `App.kt` 中，不带参数地调用 `VideoList` 组件：

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

   目前，`App` 组件无法控制 `VideoList` 组件显示的内容。它是硬编码的，所以你会看到相同的列表两次。

### 添加 props 以在组件之间传递数据

由于你将重用 `VideoList` 组件，因此你需要能够用不同的内容填充它。你可以添加将项目列表作为属性传递给组件的功能。在 React 中，这些属性称为 _props_。当 React 中组件的 props 发生更改时，框架会自动重新渲染该组件。

对于 `VideoList`，你需要一个包含要显示视频列表的 prop。定义一个接口来保存可以传递给 `VideoList` 组件的所有 props：

1. 将以下定义添加到 `VideoList.kt` 文件中：

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
   }
   ```
   [external](js-interop.md#external-modifier) 修饰符告诉编译器该接口的实现由外部提供，因此它不会尝试从声明生成 JavaScript 代码。

2. 调整 `VideoList` 的类定义，以利用作为参数传递到 `FC` 块中的 props：

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

   `key` 属性有助于 React 渲染器弄清楚当 `props.videos` 的值发生变化时该怎么做。它使用 key 来确定列表的哪些部分需要刷新，哪些部分保持不变。你可以在 [React 指南](https://reactjs.org/docs/lists-and-keys.html)中找到有关列表和 key 的更多信息。

3. 在 `App` 组件中，确保子组件使用正确的属性实例化。在 `App.kt` 中，将 `h3` 元素下的两个循环替换为 `VideoList` 的调用，并带上 `unwatchedVideos` 和 `watchedVideos` 的属性。在 Kotlin DSL 中，你在属于 `VideoList` 组件的代码块内为它们赋值：

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

重新加载后，浏览器将显示列表现在已正确渲染。

### 使列表可交互

首先，添加一个当用户点击列表条目时弹出的警告消息。在 `VideoList.kt` 中，添加一个 `onClick` 处理函数，该函数会触发一个包含当前视频的警告：

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

如果你点击浏览器窗口中的一个列表项，你将在警告窗口中看到有关该视频的信息，如下所示：

![Browser alert window](alert-window.png){width=700}

> 直接将 `onClick` 函数定义为 lambda 简洁明了，对于原型设计非常有用。然而，由于 Kotlin/JS 中相等性[目前的工作方式](https://youtrack.jetbrains.com/issue/KT-15101)，从性能角度来看，它并不是传递点击处理程序的最优化方式。如果你想优化渲染性能，请考虑将函数存储在变量中并传递它们。
>
{style="tip"}

### 添加状态以保留值

除了仅仅向用户发出警告外，你还可以添加一些功能，用 ▶ 三角形高亮显示所选视频。为此，请引入此组件特有的 _状态_。

状态是 React 中的核心概念之一。在现代 React 中（它使用所谓的 _Hooks API_），状态是使用 [`useState` hook](https://reactjs.org/docs/hooks-state.html) 表达的。

1. 将以下代码添加到 `VideoList` 声明的顶部：

   ```kotlin
   val VideoList = FC<VideoListProps> { props ->
       var selectedVideo: Video? by useState(null)

   // . . .
   ```
   {validate="false"}

   * `VideoList` 函数组件保持状态（一个独立于当前函数调用的值）。状态是可空的，类型为 `Video?`。其默认值为 `null`。
   * React 中的 `useState()` 函数指示框架跟踪函数多次调用中的状态。例如，即使你指定了默认值，React 也会确保默认值只在开始时赋值。当状态改变时，组件将根据新状态重新渲染。
   * `by` 关键字表示 `useState()` 充当[委托属性](delegated-properties.md)。与任何其他变量一样，你可以读取和写入值。`useState()` 背后的实现负责处理使状态工作所需的机制。

   要了解有关 State Hook 的更多信息，请查阅 [React 文档](https://reactjs.org/docs/hooks-state.html)。

2. 将 `VideoList` 组件中的 `onClick` 处理程序和文本更改为如下所示：

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

   * 当用户点击视频时，其值会分配给 `selectedVideo` 变量。
   * 渲染选定的列表条目时，会预置三角形。

你可以在 [React FAQ](https://reactjs.org/docs/faq-state.html) 中找到有关状态管理的更多详细信息。

检查浏览器并点击列表中的一个项目，以确保一切正常。

## 组合组件

目前，这两个视频列表各自独立工作，这意味着每个列表都跟踪一个选定的视频。用户可以在未观看列表和已观看列表中各选择一个视频，即使只有一个播放器：

![Two videos are selected in both lists simultaneously](two-videos-select.png){width=700}

列表无法同时跟踪自身内部和兄弟列表内部所选的视频。原因是所选视频不是 _列表_ 状态的一部分，而是 _应用程序_ 状态的一部分。这意味着你需要将状态从各个组件中 _提升_ 出来。

### 状态提升

React 确保 props 只能从父组件传递给其子组件。这可以防止组件之间被硬编码连接起来。

如果一个组件想要改变兄弟组件的状态，它需要通过其父组件来完成。此时，状态也不再属于任何子组件，而是属于其顶层父组件。

将状态从组件迁移到其父组件的过程称为 _状态提升_。对于你的应用程序，将 `currentVideo` 作为状态添加到 `App` 组件中：

1. 在 `App.kt` 中，将以下内容添加到 `App` 组件定义的顶部：

   ```kotlin
   val App = FC<Props> {
       var currentVideo: Video? by useState(null)
   
       // . . .
   }
   ```

   `VideoList` 组件不再需要跟踪状态。它将改为通过 prop 接收当前视频。

2. 删除 `VideoList.kt` 中的 `useState()` 调用。
3. 准备 `VideoList` 组件以接收所选视频作为 prop。为此，扩展 `VideoListProps` 接口以包含 `selectedVideo`：

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
       var selectedVideo: Video?
   }
   ```

4. 更改三角形的条件，使其使用 `props` 而不是 `state`：

   ```kotlin
   if (video == props.selectedVideo) {
       +"▶ "
   }
   ```

### 传递处理程序

目前，无法为 prop 赋值，因此 `onClick` 函数将无法按当前设置的方式工作。若要更改父组件的状态，你需要再次提升状态。

在 React 中，状态始终从父级流向子级。因此，要从其中一个子组件更改 _应用程序_ 状态，你需要将处理用户交互的逻辑移至父组件，然后将其作为 prop 传递。请记住，在 Kotlin 中，变量可以具有[函数类型](lambdas.md#function-types)。

1. 再次扩展 `VideoListProps` 接口，使其包含一个变量 `onSelectVideo`，这是一个接受 `Video` 并返回 `Unit` 的函数：

   ```kotlin
   external interface VideoListProps : Props {
       // ...
       var onSelectVideo: (Video) -> Unit
   }
   ```

2. 在 `VideoList` 组件中，在 `onClick` 处理程序中使用新的 prop：

   ```kotlin
   onClick = {
       props.onSelectVideo(video)
   }
   ```
   
   你现在可以从 `VideoList` 组件中删除 `selectedVideo` 变量了。

3. 返回 `App` 组件，为两个视频列表分别传递 `selectedVideo` 和 `onSelectVideo` 的处理程序：

   ```kotlin
   VideoList {
       videos = unwatchedVideos // and watchedVideos respectively
       selectedVideo = currentVideo
       onSelectVideo = { video ->
           currentVideo = video
       }
   }
   ```

4. 对已观看视频列表重复上一步。

切换回浏览器，确保选择视频时，选中状态在两个列表之间跳转而没有重复。

## 添加更多组件

### 提取视频播放器组件

现在你可以创建另一个自包含组件——视频播放器，它目前是一个占位符图像。你的视频播放器需要知道演讲标题、演讲者以及视频链接。此信息已包含在每个 `Video` 对象中，因此你可以将其作为 prop 传递并访问其属性。

1. 创建一个新的 `VideoPlayer.kt` 文件，并添加 `VideoPlayer` 组件的以下实现：

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

2. 由于 `VideoPlayerProps` 接口指定 `VideoPlayer` 组件接受一个非空 `Video`，请确保在 `App` 组件中相应地处理此问题。

   在 `App.kt` 中，将视频播放器之前的 `div` 片段替换为以下内容：

   ```kotlin
   currentVideo?.let { curr ->
       VideoPlayer {
           video = curr
       }
   }
   ```

   [`let` 作用域函数](scope-functions.md#let) 确保仅当 `state.currentVideo` 不为 null 时才添加 `VideoPlayer` 组件。

现在，点击列表中的一个条目将显示视频播放器，并用点击条目中的信息填充它。

### 添加按钮并连接它

为了让用户能够将视频标记为已观看或未观看，并在两个列表之间移动它，请向 `VideoPlayer` 组件添加一个按钮。

由于此按钮将在两个不同的列表之间移动视频，因此处理状态更改的逻辑需要从 `VideoPlayer` 中 _提升_ 出来并作为 prop 从父级传入。按钮的外观应根据视频是否已观看而有所不同。这也是你需要作为 prop 传递的信息。

1. 扩展 `VideoPlayerProps` 接口在 `VideoPlayer.kt` 中，以包含这两种情况的属性：

   ```kotlin
   external interface VideoPlayerProps : Props {
       var video: Video
       var onWatchedButtonPressed: (Video) -> Unit
       var unwatchedVideo: Boolean
   }
   ```

2. 现在你可以将按钮添加到实际组件中。将以下代码片段复制到 `VideoPlayer` 组件的主体中，在 `h3` 和 `img` 标签之间：

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

   借助 Kotlin CSS DSL，可以动态更改样式，你可以使用基本的 Kotlin `if` 表达式更改按钮的颜色。

### 将视频列表移动到应用程序状态

现在是时候调整 `App` 组件中 `VideoPlayer` 的使用位置了。当点击按钮时，视频应该从未观看列表移动到已观看列表，反之亦然。由于这些列表现在可以实际更改，请将它们移动到应用程序状态：

1. 在 `App.kt` 中，使用 `useState()` 调用将以下属性添加到 `App` 组件的顶部：

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

2. 由于所有演示数据都直接包含在 `watchedVideos` 和 `unwatchedVideos` 的默认值中，你不再需要文件级声明了。在 `Main.kt` 中，删除 `watchedVideos` 和 `unwatchedVideos` 的声明。
3. 将 `App` 组件中属于视频播放器的 `VideoPlayer` 调用位置更改为如下所示：

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

回到浏览器，选择一个视频，然后多次按下按钮。视频将在两个列表之间跳转。

## 使用 npm 包

为了使应用程序可用，你仍然需要一个实际播放视频的视频播放器以及一些帮助人们分享内容的按钮。

React 拥有一个丰富的生态系统，其中包含许多预制组件，你可以直接使用它们，而不必自己构建此功能。

### 添加视频播放器组件

要将占位视频组件替换为实际的 YouTube 播放器，请使用 npm 中的 `react-player` 包。它可以播放视频并允许你控制播放器的外观。

有关组件文档和 API 描述，请参阅 GitHub 中的 [README](https://www.npmjs.com/package/react-player)。

1. 检查 `build.gradle.kts` 文件。`react-player` 包应该已经包含在内：

   ```kotlin
   dependencies {
       // ...
       // Video Player
       implementation(npm("react-player", "2.12.0"))
       // ...
   }
   ```

   如你所见，可以通过在构建文件的 `dependencies` 块中使用 `npm()` 函数将 npm 依赖项添加到 Kotlin/JS 项目中。Gradle 插件会为你下载和安装这些依赖项。为此，它使用其自带的 [Yarn](https://yarnpkg.com/) 包管理器安装。

2. 若要在 React 应用程序内部使用 JavaScript 包，需要通过提供[外部声明](js-interop.md)来告知 Kotlin 编译器预期内容。

   创建一个新的 `ReactYouTube.kt` 文件，并添加以下内容：

   ```kotlin
   @file:JsModule("react-player")
   @file:JsNonModule
   
   import react.*
   
   @JsName("default")
   external val ReactPlayer: ComponentClass<dynamic>
   ```

   当编译器看到像 `ReactPlayer` 这样的外部声明时，它会假定相应类的实现由依赖项提供并且不会为其生成代码。

   最后两行等同于 JavaScript 导入语句，例如 `require("react-player").default;`。它们告诉编译器，在运行时组件肯定会符合 `ComponentClass<dynamic>`。

然而，在此配置中，`ReactPlayer` 接受的 props 的泛型类型设置为 `dynamic`。这意味着编译器将接受任何代码，但存在运行时中断的风险。

一个更好的替代方案是创建一个 `external interface`，它指定属于此外部组件的 props 的属性类型。你可以在组件的 [README](https://www.npmjs.com/package/react-player) 中了解 props 的接口。在本例中，使用 `url` 和 `controls` props：

1. 通过将 `dynamic` 替换为外部接口来调整 `ReactYouTube.kt` 的内容：

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

2. 现在你可以使用新的 `ReactPlayer` 替换 `VideoPlayer` 组件中的灰色占位符矩形。在 `VideoPlayer.kt` 中，将 `img` 标签替换为以下代码片段：

   ```kotlin
   ReactPlayer {
       url = props.video.videoUrl
       controls = true
   }
   ```

### 添加社交分享按钮

分享应用程序内容的简单方法是为即时通讯工具和电子邮件提供社交分享按钮。你也可以为此使用现成的 React 组件，例如 [react-share](https://github.com/nygardk/react-share/blob/master/README.md)：

1. 检查 `build.gradle.kts` 文件。此 npm 库应该已经包含在内：

   ```kotlin
   dependencies {
       // ...
       // Share Buttons
       implementation(npm("react-share", "4.4.1"))
       // ...
   }
   ```

2. 若要从 Kotlin 使用 `react-share`，你需要编写更多基本的外部声明。[GitHub 上的示例](https://github.com/nygardk/react-share/blob/master/demo/Demo.tsx#L61) 表明，一个分享按钮由两个 React 组件组成：例如 `EmailShareButton` 和 `EmailIcon`。不同类型的分享按钮和图标都具有相同的接口。你将以与视频播放器相同的方式为每个组件创建外部声明。

   将以下代码添加到新的 `ReactShare.kt` 文件中：

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

3. 将新组件添加到应用程序的用户界面中。在 `VideoPlayer.kt` 中，在 `ReactPlayer` 的使用位置上方添加两个分享按钮，放入一个 `div` 中：

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

你现在可以检查浏览器，看看按钮是否真的有效。点击按钮时，应该会出现一个 _分享窗口_，其中包含视频的 URL。如果按钮没有显示或不起作用，你可能需要禁用你的广告和社交媒体拦截器。

![Share window](social-buttons.png){width=700}

你可以随意重复此步骤，为 [react-share](https://github.com/nygardk/react-share/blob/master/README.md#features) 中提供的其他社交网络添加分享按钮。

## 使用外部 REST API

现在你可以在应用程序中用 REST API 的真实数据替换硬编码的演示数据了。

对于本教程，有一个[小型 API](https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/1)。它只提供一个 `videos` 端点，并接受一个数字参数来访问列表中的元素。如果你用浏览器访问该 API，你会看到 API 返回的对象与 `Video` 对象的结构相同。

### 从 Kotlin 使用 JS 功能

浏览器已经自带了各种各样的 [Web API](https://developer.mozilla.org/en-US/docs/Web/API)。你也可以从 Kotlin/JS 中使用它们，因为它开箱即用地包含了这些 API 的封装。一个例子是 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，它用于发出 HTTP 请求。

第一个潜在问题是，像 `fetch()` 这样的浏览器 API 使用[回调](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) 来执行非阻塞操作。当多个回调需要依次运行时，它们需要嵌套。很自然地，代码会严重缩进，越来越多的功能块相互堆叠，这使得代码难以阅读。

为了克服这个问题，你可以使用 Kotlin 的协程，这是一种更好的实现此类功能的方法。

第二个问题源于 JavaScript 的动态类型特性。外部 API 返回的数据类型没有保证。为了解决这个问题，你可以使用 `kotlinx.serialization` 库。

检查 `build.gradle.kts` 文件。相关代码片段应该已经存在：

```kotlin
dependencies {
    // . . .

    // Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
}
```

### 添加序列化

当你调用外部 API 时，你会得到 JSON 格式的文本，它仍然需要转换为可操作的 Kotlin 对象。

[`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization) 是一个库，它使得将 JSON 字符串转换为 Kotlin 对象成为可能。

1. 检查 `build.gradle.kts` 文件。相应的代码片段应该已经存在：

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

2. 作为获取第一个视频的准备，有必要告知序列化库关于 `Video` 类的信息。在 `Main.kt` 中，为其定义添加 `@Serializable` 注解：

   ```kotlin
   @Serializable
   data class Video(
       val id: Int,
       val title: String,
       val speaker: String,
       val videoUrl: String
   )
   ```

### 获取视频

若要从 API 获取视频，请在 `App.kt`（或新文件）中添加以下函数：

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

* _挂起函数_ `fetch()` 从 API 获取具有给定 `id` 的视频。此响应可能需要一段时间，因此你 `await()` 结果。接下来，使用回调的 `text()` 从响应中读取正文。然后你 `await()` 它的完成。
* 在返回函数的值之前，你将其传递给 `Json.decodeFromString`，这是 `kotlinx.coroutines` 中的一个函数。它将你从请求中接收到的 JSON 文本转换为具有相应字段的 Kotlin 对象。
* `window.fetch` 函数调用返回一个 `Promise` 对象。通常，你必须定义一个回调处理程序，一旦 `Promise` 被解析并获得结果，该处理程序就会被调用。然而，使用协程，你可以 `await()` 这些 promise。每当调用像 `await()` 这样的函数时，该方法就会停止（挂起）其执行。一旦 `Promise` 可以解析，它的执行就会继续。

为了给用户提供视频选择，定义 `fetchVideos()` 函数，它将从与上面相同的 API 中获取 25 个视频。若要并发运行所有请求，请使用 Kotlin 协程提供的 [`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 功能：

1. 将以下实现添加到你的 `App.kt` 中：

   ```kotlin
   suspend fun fetchVideos(): List<Video> = coroutineScope {
       (1..25).map { id ->
           async {
               fetchVideo(id)
           }
       }.awaitAll()
   }
   ```

   遵循[结构化并发](https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency)的原则，实现被封装在 `coroutineScope` 中。然后你可以启动 25 个异步任务（每个请求一个）并等待它们全部完成。

2. 现在你可以向应用程序添加数据了。添加 `mainScope` 的定义，并更改 `App` 组件，使其以以下代码片段开头。别忘了将演示值替换为 `emptyLists` 实例：

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

   * [`MainScope()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html) 是 Kotlin 结构化并发模型的一部分，并创建异步任务运行的范围。
   * `useEffectOnce` 是另一个 React _hook_（具体来说，是 [useEffect](https://reactjs.org/docs/hooks-effect.html) hook 的简化版本）。它表明组件执行了 _副作用_。它不仅渲染自身，还通过网络进行通信。

检查你的浏览器。应用程序应该显示实际数据：

![Fetched data from API](website-api-data.png){width=700}

当你加载页面时：

* `App` 组件的代码将被调用。这将启动 `useEffectOnce` 块中的代码。
* `App` 组件将使用已观看和未观看视频的空列表进行渲染。
* 当 API 请求完成后，`useEffectOnce` 块将其分配给 `App` 组件的状态。这将触发重新渲染。
* `App` 组件的代码将再次被调用，但 `useEffectOnce` 块 _不会_ 第二次运行。

如果你想深入了解协程的工作原理，请查阅这篇[协程教程](coroutines-and-channels.md)。

## 部署到生产环境和云端

是时候将应用程序发布到云端并让其他人访问了。

### 打包生产版本

若要在生产模式下打包所有资源，请通过 IntelliJ IDEA 中的工具窗口或运行 `./gradlew build` 来运行 Gradle 中的 `build` 任务。这将生成一个优化后的项目构建，应用了各种改进，例如 DCE（死代码消除）。

构建完成后，你可以在 `/build/dist` 中找到部署所需的所有文件。它们包括 JavaScript 文件、HTML 文件和运行应用程序所需的其他资源。你可以将它们放在静态 HTTP 服务器上、使用 GitHub Pages 提供服务，或者将其托管在你选择的云提供商上。

### 部署到 Heroku

Heroku 使启动可在其自己的域名下访问的应用程序变得相当简单。他们的免费套餐应该足以满足开发目的。

1. [创建帐户](https://signup.heroku.com/)。
2. [安装并认证 CLI 客户端](https://devcenter.heroku.com/articles/heroku-cli)。
3. 在项目根目录中的终端运行以下命令，创建一个 Git 仓库并附加一个 Heroku 应用程序：

   ```bash
   git init
   heroku create
   git add .
   git commit -m "initial commit"
   ```

4. 与通常在 Heroku 上运行的常规 JVM 应用程序（例如使用 Ktor 或 Spring Boot 编写的应用程序）不同，你的应用程序生成静态 HTML 页面和 JavaScript 文件，需要相应地提供服务。你可以调整所需的 buildpack 以正确地提供程序服务：

   ```bash
   heroku buildpacks:set heroku/gradle
   heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
   ```

5. 为了让 `heroku/gradle` buildpack 正常运行，`build.gradle.kts` 文件中需要有一个 `stage` 任务。此任务等同于 `build` 任务，相应的别名已包含在文件底部：

   ```kotlin
   // Heroku Deployment
   tasks.register("stage") {
       dependsOn("build")
   }
   ```

6. 在项目根目录中添加一个新的 `static.json` 文件以配置 `buildpack-static`。
7. 在文件中添加 `root` 属性：

   ```xml
   {
       "root": "build/distributions"
   }
   ```
   {validate="false"}

8. 你现在可以触发部署，例如，通过运行以下命令：

   ```bash
   git add -A
   git commit -m "add stage task and static content root configuration"
   git push heroku master
   ```

> 如果你从非主分支推送，请调整命令以推送到 `main` 远程仓库，例如 `git push heroku feature-branch:main`。
>
{style="tip"}

如果部署成功，你将看到人们可以在互联网上访问该应用程序的 URL。

![Web app deployment to production](deployment-to-production.png){width=700}

> 你可以在 `finished` 分支的[此处](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)找到此项目状态。
>
{style="note"}

## 接下来

### 添加更多功能 {initial-collapse-state="collapsed" collapsible="true"}

你可以使用生成的应用程序作为起点，探索 React、Kotlin/JS 等领域更高级的主题。

* **搜索**。你可以添加一个搜索字段来过滤演讲列表——例如，按标题或按作者过滤。了解 [React 中的 HTML 表单元素如何工作](https://reactjs.org/docs/forms.html)。
* **持久化**。目前，每次页面重新加载时，应用程序都会丢失观看者的观看列表跟踪。考虑构建你自己的后端，使用 Kotlin 可用的 Web 框架之一（例如 [Ktor](https://ktor.io/)）。或者，研究[在客户端存储信息](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)的方法。
* **复杂 API**。有许多数据集和 API 可用。你可以将各种数据拉入你的应用程序。例如，你可以为[猫照片](https://thecatapi.com/)或[免版税图库照片 API](https://unsplash.com/developers) 构建一个可视化工具。

### 改进样式：响应式和网格 {initial-collapse-state="collapsed" collapsible="true"}

应用程序设计仍然非常简单，在移动设备或窄窗口中看起来不会很好。探索更多 CSS DSL 以使应用程序更具可访问性。

### 加入社区并获得帮助 {initial-collapse-state="collapsed" collapsible="true"}

报告问题和获得帮助的最佳方式是 [kotlin-wrappers 问题跟踪器](https://github.com/JetBrains/kotlin-wrappers/issues)。如果你找不到针对你问题的工单，请随时提交一个新工单。你也可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。有 `#javascript` 和 `#react` 频道。

### 了解更多关于协程的信息 {initial-collapse-state="collapsed" collapsible="true"}

如果你有兴趣了解更多关于如何编写并发代码的信息，请查阅[协程](coroutines-and-channels.md)教程。

### 了解更多关于 React 的信息 {initial-collapse-state="collapsed" collapsible="true"}

既然你已经了解了 React 的基本概念以及它们如何转换为 Kotlin，你就可以将 [React 文档](https://react.dev/learn)中概述的其他一些概念转换为 Kotlin。