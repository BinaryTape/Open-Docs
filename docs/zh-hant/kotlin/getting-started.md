---
title: "Kotlin 入門"
slug: /
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 是一種現代但已相當成熟的程式語言，旨在讓開發人員更愉快。
它簡潔、安全、可與 Java 和其他語言互通，並提供多種方式來重複使用多個平台之間的程式碼，以實現高效的程式設計。

首先，何不參加我們的 Kotlin 導覽？本導覽涵蓋 Kotlin 程式語言的基礎知識，並且可以完全在您的瀏覽器中完成。

<a href="kotlin-tour-welcome"><img src="/img/start-kotlin-tour.svg" width="700" alt="Start the Kotlin tour" /></a>

## 安裝 Kotlin

每個 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 版本都包含 Kotlin。
下載並安裝其中一個 IDE 以開始使用 Kotlin。

## 選擇您的 Kotlin 使用案例

<Tabs>

<TabItem value="console" label="Console">

在這裡，您將學習如何開發主控台應用程式並使用 Kotlin 建立單元測試。

1. **[使用 IntelliJ IDEA 專案精靈建立基本的 JVM 應用程式](jvm-get-started)。**

2. **[編寫您的第一個單元測試](jvm-test-using-junit)。**

3. **加入 Kotlin 社群：**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow：訂閱 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 標籤。

4. **追蹤 Kotlin**：
   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

如果您遇到任何困難或問題，請在我們的 [issue tracker](https://youtrack.jetbrains.com/issues/KT) 中回報問題。

</TabItem>

<TabItem value="backend" label="Backend">

在這裡，您將學習如何使用 Kotlin 伺服器端開發後端應用程式。

1. **建立您的第一個後端應用程式：**

     * [使用 Spring Boot 建立 RESTful Web 服務](jvm-get-started-spring-boot)
     * [使用 Ktor 建立 HTTP API](https://ktor.io/docs/creating-http-apis.html)

2. **[學習如何在您的應用程式中混合使用 Kotlin 和 Java 程式碼](mixing-java-kotlin-intellij)。**

3. **加入 Kotlin 伺服器端社群：**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow：訂閱 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 標籤。

4. **追蹤 Kotlin**：

   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

如果您遇到任何困難或問題，請在我們的 [issue tracker](https://youtrack.jetbrains.com/issues/KT) 中回報問題。

</TabItem>

<TabItem value="cross-platform-mobile" label="Cross-platform">

在這裡，您將學習如何使用 [Kotlin Multiplatform](multiplatform-intro) 開發跨平台應用程式。

1. **[設定您的跨平台開發環境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html)。**

2. **為 iOS 和 Android 建立您的第一個應用程式：**

   * 從頭開始建立跨平台應用程式，並：
     * [共享業務邏輯，同時保持 UI 的原生性](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
     * [共享業務邏輯和 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
   * [讓您現有的 Android 應用程式在 iOS 上運行](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)
   * [使用 Ktor 和 SQLdelight 建立跨平台應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)

3. **探索[範例專案](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html)**。

4. **加入 Kotlin Multiplatform 社群：**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) 和 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow：訂閱 ["kotlin-multiplatform" tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)。

5. **追蹤 Kotlin**：

   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

如果您遇到任何困難或問題，請在我們的 [issue tracker](https://youtrack.jetbrains.com/issues/KT) 中回報問題。

</TabItem>

<TabItem value="android" label="Android">

要開始將 Kotlin 用於 Android 開發，請閱讀 [Google 關於開始使用 Kotlin on Android 的建議](https://developer.android.com/kotlin/get-started)。

在 <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack 上加入 Android 社群：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#android](https://kotlinlang.slack.com/archives/C0B8M7BUY) 頻道。

在 <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin), <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org), 以及 <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/) 上追蹤 Kotlin，並且不要錯過任何重要的生態系統更新。

</TabItem>

<TabItem value="data-analysis" label="Data analysis">

從建立資料管道到生產化機器學習模型，Kotlin 是處理資料並充分利用資料的絕佳選擇。

1. **在 IDE 中無縫地建立和編輯 Notebook：**

   * [開始使用 Kotlin Notebook](get-started-with-kotlin-notebooks)

2. **探索和實驗您的資料：**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – 用於資料分析和操作的函式庫。
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – 用於資料視覺化的繪圖工具。

3. **獲取有關 Kotlin for Data Analysis 的最新更新：**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#datascience](https://kotlinlang.slack.com/archives/C4W52CFEZ) 頻道。
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> Twitter：追蹤 [KotlinForData](http://twitter.com/KotlinForData)。

4. **追蹤 Kotlin**：
   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

</TabItem>

</Tabs>

## 是否有任何遺漏？

如果此頁面上有任何遺漏或令人困惑的地方，請[分享您的意見反應](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df)。