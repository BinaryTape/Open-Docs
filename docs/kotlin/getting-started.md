[//]: # (title: Kotlin 入门)

<tldr>
<p>最新 Kotlin 版本:<b> <a href="%kotlinLatestWhatsnew%">%kotlinVersion%</a></b></p>
</tldr>

Kotlin 是一种现代但已成熟的编程语言，旨在让开发者更愉快。
它简洁、安全，并可与 Java 及其他语言互操作，提供了多种在多个平台间复用代码的方式，以实现高效编程。

要开始使用，何不参加我们的 Kotlin 之旅？本趟旅程涵盖了 Kotlin 编程语言的基础知识，可完全在浏览器中完成。

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="开启 Kotlin 之旅" style="block"/></a>

## 安装 Kotlin

Kotlin 包含在每个 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 版本中。
下载并安装其中一个 IDE 即可开始使用 Kotlin。

## 选择你的 Kotlin 用例
 
<tabs>

<tab id="console" title="控制台">

在这里，你将学习如何开发控制台应用程序，并使用 Kotlin 创建单元测试。

1. **[使用 IntelliJ IDEA 项目向导创建基本的 JVM 应用程序](jvm-get-started.md)。**

2. **[编写你的第一个单元测试](jvm-test-using-junit.md)。**

</tab>

<tab id="backend" title="后端">

在这里，你将学习如何使用 Kotlin 服务端开发后端应用程序。

* **将 Kotlin 引入你的 Java 项目：**

  * [配置 Java 项目以使用 Kotlin](mixing-java-kotlin-intellij.md)
  * [为你的 Java Maven 项目添加 Kotlin 测试](jvm-test-using-junit.md)

* **使用 Kotlin 从头开始创建后端应用：**

  * [使用 Spring Boot 创建 RESTful Web 服务](jvm-get-started-spring-boot.md)
  * [使用 Ktor 创建 HTTP API](https://ktor.io/docs/creating-http-apis.html)

</tab>

<tab id="cross-platform-mobile" title="跨平台">

在这里，你将学习如何使用 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 开发跨平台应用程序。

1. **[设置跨平台开发环境](https://kotlinlang.org/docs/multiplatform/quickstart.html)。**

2. **创建你的第一个 iOS 和 Android 应用程序：**

   * 从头开始创建跨平台应用程序并：
     * [共享业务逻辑，同时保持 UI 原生](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)
     * [共享业务逻辑和 UI](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
   * [使你现有的 Android 应用程序在 iOS 上运行](https://kotlinlang.org/docs/multiplatform/multiplatform-integrate-in-existing-app.html)
   * [使用 Ktor 和 SQLdelight 创建跨平台应用程序](https://kotlinlang.org/docs/multiplatform/multiplatform-ktor-sqldelight.html)

3. **[探索示例项目](https://kotlinlang.org/docs/multiplatform/multiplatform-samples.html)**。

</tab>

<tab id="android" title="Android">

要开始使用 Kotlin 进行 Android 开发，请阅读 [Google 关于 Android 上 Kotlin 入门的建议](https://developer.android.com/kotlin/get-started)。

</tab>

<tab id="data-analysis" title="数据分析">

从构建数据管道到将机器学习模型投入生产，Kotlin 都是处理数据和充分利用数据的绝佳选择。

1. **在 IDE 中无缝创建和编辑 Notebook：**

   * [Kotlin Notebook 入门](get-started-with-kotlin-notebooks.md)

2. **探索和试验你的数据：**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – 一个用于数据分析和操作的库。
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – 一个用于数据可视化的绘图工具。

3. **在 Twitter 上关注 Kotlin for Data Analysis：**[KotlinForData](http://twitter.com/KotlinForData)。

</tab>

</tabs>

## 加入 Kotlin 社区

及时了解 Kotlin 生态系统的最新更新并分享你的经验。

* 加入我们：
  * ![Slack](slack.svg){width=25}{type="joined"} Slack：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
  * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow：订阅“["kotlin"](https://stackoverflow.com/questions/tagged/kotlin)”标签。
* 在 ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)、 ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)、 ![Bluesky](bsky.svg){width=18}{type="joined"} [Bluesky](https://bsky.app/profile/kotlinlang.org) 和 ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/) 上关注 Kotlin。
* 订阅 [Kotlin 新闻](https://info.jetbrains.com/kotlin-communication-center.html)。

如果你遇到任何困难或问题，请在我们的[问题跟踪器](https://youtrack.jetbrains.com/issues/KT)中报告问题。

## 是否有遗漏？

如果本页有任何遗漏或内容令人困惑，请[分享你的反馈](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df)。