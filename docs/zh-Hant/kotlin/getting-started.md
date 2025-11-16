[//]: # (title: Kotlin 入門)

<tldr>
<p>最新 Kotlin 發佈版本：<b> <a href="%kotlinLatestWhatsnew%">%kotlinVersion%</a></b></p>
</tldr>

Kotlin 是一種現代但已成熟的程式語言，旨在讓開發者更快樂。
它簡潔、安全、可與 Java 及其他語言互通，並提供多種方式在多個平台之間重複使用程式碼，以實現高效開發。

首先，何不體驗一下我們的 Kotlin 之旅？本次旅程涵蓋了 Kotlin 程式語言的基礎知識，並且可以完全在您的瀏覽器中完成。

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="開始 Kotlin 之旅" style="block"/></a>

## 安裝 Kotlin

Kotlin 已包含在每個 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 發佈版本中。
下載並安裝其中一個 IDE 即可開始使用 Kotlin。

## 選擇您的 Kotlin 使用案例
 
<tabs>

<tab id="console" title="主控台">

在這裡您將學習如何使用 Kotlin 開發主控台應用程式並建立單元測試。

1. **[使用 IntelliJ IDEA 專案精靈建立基本的 JVM 應用程式](jvm-get-started.md)。**

2. **[編寫您的第一個單元測試](jvm-test-using-junit.md)。**

</tab>

<tab id="backend" title="後端">

在這裡您將學習如何使用 Kotlin 開發伺服器端後端應用程式。

* **將 Kotlin 引入您的 Java 專案：**

  * [設定 Java 專案以使用 Kotlin](mixing-java-kotlin-intellij.md)
  * [將 Kotlin 測試新增至您的 Java Maven 專案](jvm-test-using-junit.md)

* **使用 Kotlin 從頭開始建立後端應用程式：**

  * [使用 Spring Boot 建立 RESTful Web 服務](jvm-get-started-spring-boot.md)
  * [使用 Ktor 建立 HTTP API](https://ktor.io/docs/creating-http-apis.html)

</tab>

<tab id="cross-platform-mobile" title="跨平台">

在這裡您將學習如何使用 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 開發跨平台應用程式。

1. **[設定您的跨平台開發環境](https://kotlinlang.org/docs/multiplatform/quickstart.html)。**

2. **建立您的第一個 iOS 和 Android 應用程式：**

   * 從頭開始建立一個跨平台應用程式，並：
     * [在保持原生 UI 的同時共用業務邏輯](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)
     * [共用業務邏輯和 UI](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
   * [讓您現有的 Android 應用程式在 iOS 上運行](https://kotlinlang.org/docs/multiplatform/multiplatform-integrate-in-existing-app.html)
   * [使用 Ktor 和 SQLdelight 建立跨平台應用程式](https://kotlinlang.org/docs/multiplatform/multiplatform-ktor-sqldelight.html)

3. **探索 [範例專案](https://kotlinlang.org/docs/multiplatform/multiplatform-samples.html)**。

</tab>

<tab id="android" title="Android">

若要開始使用 Kotlin 進行 Android 開發，請閱讀 [Google 關於在 Android 上開始使用 Kotlin 的建議](https://developer.android.com/kotlin/get-started)。

</tab>

<tab id="data-analysis" title="資料分析">

從建立資料管線到將機器學習模型投入生產，Kotlin 是處理資料並充分利用資料的絕佳選擇。

1. **在 IDE 內無縫建立和編輯筆記本：**

   * [開始使用 Kotlin Notebook](get-started-with-kotlin-notebooks.md)

2. **探索和實驗您的資料：**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – 一個用於資料分析和處理的程式庫。
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – 一個用於資料視覺化的繪圖工具。

3. **在 Twitter 上關注 Kotlin for Data Analysis：** [KotlinForData](http://twitter.com/KotlinForData)。

</tab>

</tabs>

## 加入 Kotlin 社群

隨時了解 Kotlin 生態系統的最新動態並分享您的經驗。

* 加入我們：
  * ![Slack](slack.svg){width=25}{type="joined"} Slack：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
  * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow：訂閱 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 標籤。
* 在 ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)、![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)、![Bluesky](bsky.app/profile/kotlinlang.org){width=18}{type="joined"} [Bluesky](https://bsky.app/profile/kotlinlang.org) 和 ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/) 上關注 Kotlin。
* 訂閱 [Kotlin 新聞](https://info.jetbrains.com/kotlin-communication-center.html)。

如果您遇到任何困難或問題，請在我們的 [問題追蹤器](https://youtrack.jetbrains.com/issues/KT) 中回報。

## 是否有遺漏之處？

如果本頁面有任何遺漏或令人困惑之處，請[分享您的意見回饋](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df)。