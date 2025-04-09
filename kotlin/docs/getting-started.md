---
title: "Kotlin 入门"
slug: /
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 是一种现代但已经成熟的编程语言，旨在让开发者更快乐。
它简洁、安全，可以与 Java 和其他语言互操作，并提供了多种在多个平台之间重用代码的方式，从而实现高效的编程。

首先，不妨来一次 Kotlin 之旅？ 本次旅程涵盖了 Kotlin 编程语言的基础知识，并且可以在浏览器中完全完成。

<a href="kotlin-tour-welcome"><img src="/img/start-kotlin-tour.svg" width="700" alt="Start the Kotlin tour" /></a>

## 安装 Kotlin

每个 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 版本都包含 Kotlin。
下载并安装其中一个 IDE 即可开始使用 Kotlin。

## 选择你的 Kotlin 用例

<Tabs>

<TabItem value="console" label="Console">

在这里，你将学习如何开发控制台应用程序并使用 Kotlin 创建单元测试。

1. **[使用 IntelliJ IDEA 项目向导创建一个基本的 JVM 应用程序](jvm-get-started)。**

2. **[编写你的第一个单元测试](jvm-test-using-junit)。**

3. **加入 Kotlin 社区：**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow：订阅 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 标签。

4. **关注 Kotlin** 在：
   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

如果你遇到任何困难或问题，请在我们的 [issue tracker](https://youtrack.jetbrains.com/issues/KT) 中报告问题。

</TabItem>

<TabItem value="backend" label="Backend">

在这里，你将学习如何使用 Kotlin 服务器端开发后端应用程序。

1. **创建你的第一个后端应用程序：**

     * [使用 Spring Boot 创建 RESTful Web 服务](jvm-get-started-spring-boot)
     * [使用 Ktor 创建 HTTP API](https://ktor.io/docs/creating-http-apis.html)

2. **[学习如何在你的应用程序中混合使用 Kotlin 和 Java 代码](mixing-java-kotlin-intellij)。**

3. **加入 Kotlin 服务器端社区：**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow：订阅 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 标签。

4. **关注 Kotlin** 在：

   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

如果你遇到任何困难或问题，请在我们的 [issue tracker](https://youtrack.jetbrains.com/issues/KT) 中报告问题。

</TabItem>

<TabItem value="cross-platform-mobile" label="Cross-platform">

在这里，你将学习如何使用 [Kotlin Multiplatform](multiplatform-intro) 开发跨平台应用程序。

1. **[设置你的跨平台开发环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html)。**

2. **为 iOS 和 Android 创建你的第一个应用程序：**

   * 从头开始创建一个跨平台应用程序并：
     * [共享业务逻辑，同时保持 UI 原生](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
     * [共享业务逻辑和 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
   * [使你现有的 Android 应用程序在 iOS 上工作](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)
   * [使用 Ktor 和 SQLdelight 创建一个跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)

3. **浏览 [示例项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html)**。

4. **加入 Kotlin Multiplatform 社区：**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) 和 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow：订阅 ["kotlin-multiplatform" tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)。

5. **关注 Kotlin** 在：

   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

如果你遇到任何困难或问题，请向我们的 [issue tracker](https://youtrack.jetbrains.com/issues/KT) 报告问题。

</TabItem>

<TabItem value="android" label="Android">

要开始使用 Kotlin 进行 Android 开发，请阅读 [Google 关于开始在 Android 上使用 Kotlin 的建议](https://developer.android.com/kotlin/get-started)。

在 <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack 上加入 Android 社区：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#android](https://kotlinlang.slack.com/archives/C0B8M7BUY) 频道。

在 <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)，<img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)，<img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org) 和 <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/) 上关注 Kotlin，不要错过任何重要的生态系统更新。

</TabItem>

<TabItem value="data-analysis" label="Data analysis">

从构建数据管道到生产化机器学习模型，Kotlin 是处理数据并充分利用数据的绝佳选择。

1. **在 IDE 中无缝创建和编辑 notebooks：**

   * [Kotlin Notebook 入门](get-started-with-kotlin-notebooks)

2. **探索和试验你的数据：**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – 一个用于数据分析和操作的库。
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – 一个用于数据可视化的绘图工具。

3. **获取有关 Kotlin for Data Analysis 的最新更新：**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#datascience](https://kotlinlang.slack.com/archives/C4W52CFEZ) 频道。
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> Twitter：关注 [KotlinForData](http://twitter.com/KotlinForData)。

4. **关注 Kotlin** 在：
   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

</TabItem>

</Tabs>

## 有什么遗漏了吗？

如果此页面上有任何遗漏或令人困惑的地方，请[分享你的反馈](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df)。