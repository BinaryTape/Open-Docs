[//]: # (title: 常見問題)
[//]: # (description: Kotlin 是一種由 JetBrains 開發的簡潔多平台程式語言。)

### 什麼是 Kotlin？

Kotlin 是一種開源 (open-source) 靜態型別 (statically typed) 程式語言，目標是 JVM、Android、JavaScript、Wasm 和 Native。它由 [JetBrains](https://www.jetbrains.com) 開發。該專案始於 2010 年，並在很早期就開源。第一個正式的 1.0 版本於 2016 年 2 月發布。

### Kotlin 的當前版本是什麼？

當前發佈版本是 %kotlinVersion%，於 %kotlinReleaseDate% 發布。
你可以在 [GitHub 上](https://github.com/jetbrains.com) 找到更多資訊。

### Kotlin 是免費的嗎？

是的。Kotlin 是免費的，一直免費且將保持免費。它是在 Apache 2.0 授權下開發的，原始碼可在 [GitHub 上](https://github.com/jetbrains.com) 獲取。

### Kotlin 是物件導向語言還是函數式語言？

Kotlin 兼具物件導向 (object-oriented) 和函數式 (functional) 結構。你可以在物件導向 (OO) 和函數式程式設計 (FP) 風格中使用它，或者混合兩者的元素。由於對高階函數 (higher-order functions)、函數型別 (function types) 和 Lambda (lambdas) 等功能提供一流的支援，如果你正在進行或探索函數式程式設計，Kotlin 是個絕佳選擇。

### Kotlin 相較於 Java 程式語言有何優勢？

Kotlin 更簡潔。大致估計可減少約 40% 的程式碼行數。它也更型別安全 (type-safe)——例如，對非空型別 (non-nullable types) 的支援使應用程式較不易發生空指針異常 (NullPointerException，簡稱 NPE)。其他功能包括智慧型轉型 (smart casting)、高階函數 (higher-order functions)、擴展函數 (extension functions) 和帶接收者的 Lambda (lambdas with receivers)，這些都提供了編寫表達性程式碼的能力，並促進了領域特定語言 (DSL) 的創建。

### Kotlin 與 Java 程式語言相容嗎？

是的。Kotlin 與 Java 程式語言 100% 互通 (interoperable)，並且主要重點已放在確保你現有的程式碼庫能與 Kotlin 正確互動。你可以輕鬆地 [從 Java 呼叫 Kotlin 程式碼](java-to-kotlin-interop.md) 和 [從 Kotlin 呼叫 Java 程式碼](java-interop.md)。這使得採用更容易且風險較低。IDE (整合開發環境) 中還內建了一個自動化的 [Java-to-Kotlin 轉換器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)，簡化了現有程式碼的遷移。

### 我可以使用 Kotlin 來做什麼？

Kotlin 可用於任何類型的開發，無論是伺服器端 (server-side)、客戶端網頁 (client-side web)、Android，還是多平台函式庫 (multiplatform library)。隨著 Kotlin/Native 目前正在開發中，它還將支援嵌入式系統 (embedded systems)、macOS 和 iOS 等其他平台。人們正在使用 Kotlin 進行行動和伺服器端應用程式開發、使用 JavaScript 或 JavaFX 進行客戶端開發，以及資料科學 (data science)，這僅列舉了部分可能性。

### 我可以用 Kotlin 進行 Android 開發嗎？

是的。Kotlin 在 Android 上被支援為一流語言 (first-class language)。已有數百個應用程式在 Android 上使用 Kotlin，例如 Basecamp、Pinterest 等。欲了解更多資訊，請查看 [Android 開發資源](android-overview.md)。

### 我可以用 Kotlin 進行伺服器端開發嗎？

是的。Kotlin 與 JVM 100% 相容，因此你可以使用任何現有的框架，例如 Spring Boot、vert.x 或 JSF。此外，還有一些用 Kotlin 編寫的特定框架，例如 [Ktor](https://github.com/kotlin/ktor)。欲了解更多資訊，請查看 [伺服器端開發資源](server-overview.md)。

### 我可以用 Kotlin 進行網頁開發嗎？

是的。對於後端網頁開發，Kotlin 與 [Ktor](https://ktor.io/) 和 [Spring](https://spring.io/) 等框架配合良好，使你能有效率地建構伺服器端應用程式。此外，你可以使用 Kotlin/Wasm 進行客戶端網頁開發。
了解如何 [開始使用 Kotlin/Wasm](wasm-get-started.md)。

### 我可以用 Kotlin 進行桌面開發嗎？

是的。你可以使用任何 Java UI 框架，例如 JavaFx、Swing 或其他。
此外，還有 Kotlin 特有的框架，例如 [TornadoFX](https://github.com/edvin/tornadofx)。

### 我可以用 Kotlin 進行原生開發嗎？

是的。Kotlin/Native 作為 Kotlin 的一部分提供。它將 Kotlin 編譯為可在沒有虛擬機器 (VM) 的情況下執行的原生程式碼。你可以在流行的桌面和行動平台，甚至某些物聯網 (IoT) 設備上嘗試它。欲了解更多資訊，請查看 [Kotlin/Native 文件](native-overview.md)。

### 哪些 IDE 支援 Kotlin？

Kotlin 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/kotlin/get-started) 中提供完整的開箱即用支援，並配備由 JetBrains 開發的官方 Kotlin 外掛程式 (plugin)。

其他 IDE (整合開發環境) 和程式碼編輯器僅有社群支援的 Kotlin 外掛程式 (plugin)。

你還可以嘗試 [Kotlin Playground](https://play.kotlinlang.org)，在瀏覽器中編寫、執行和分享 Kotlin 程式碼。

此外，還提供了 [命令列編譯器](command-line.md)，它為編譯和執行應用程式提供了直接支援。

### 哪些建置工具支援 Kotlin？

在 JVM 端，主要的建置工具包括 [Gradle](gradle.md)、[Maven](maven.md)、[Ant](ant.md) 和 [Kobalt](https://beust.com/kobalt/home/index.html)。還有一些針對客戶端 JavaScript 的建置工具。

### Kotlin 會被編譯成什麼？

當目標是 JVM 時，Kotlin 會產生與 Java 相容的位元碼 (bytecode)。

當目標是 JavaScript 時，Kotlin 會轉譯 (transpile) 為 ES5.1 並產生與包括 AMD 和 CommonJS 在內的模組系統相容的程式碼。

當目標是原生平台時，Kotlin 會產生特定於平台 (透過 LLVM) 的程式碼。

### Kotlin 支援哪些版本的 JVM？

Kotlin 讓你選擇要執行的 JVM 版本。預設情況下，Kotlin/JVM 編譯器會產生與 Java 8 相容的位元碼。如果你想利用 Java 新版本中可用的最佳化，你可以明確指定目標 Java 版本為 9 到 23。請注意，在這種情況下，結果位元碼可能無法在較低版本上執行。從 [Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8) 開始，編譯器不再支援產生與 Java 8 以下版本相容的位元碼。

### Kotlin 難嗎？

Kotlin 受現有語言如 Java、C#、JavaScript、Scala 和 Groovy 的啟發。我們努力確保 Kotlin 易於學習，以便人們可以在幾天內輕鬆上手，閱讀和編寫 Kotlin。學習慣用語法的 Kotlin (idiomatic Kotlin) 並使用其一些更進階的功能可能需要更長的時間，但總體而言，它不是一種複雜的語言。
欲了解更多資訊，請查看 [我們的學習材料](learning-materials-overview.md)。

### 哪些公司正在使用 Kotlin？

使用 Kotlin 的公司不勝枚舉，但一些公開宣佈使用 Kotlin 的知名公司（透過部落格文章、GitHub 儲存庫或演講）包括 [Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/) 和 [Corda](https://corda.net/blog/kotlin/)。

### 誰開發 Kotlin？

Kotlin 由 [JetBrains](https://www.jetbrains.com/) 的工程師團隊開發（目前團隊規模超過 100 人）。首席語言設計師是 Michail Zarečenskij。除了核心團隊，GitHub 上還有超過 250 名外部貢獻者。

### 我可以在哪裡了解更多關於 Kotlin 的資訊？

最佳起點是 [我們的網站](https://kotlinlang.org)。
要開始使用 Kotlin，你可以安裝其中一個 [官方 IDE](kotlin-ide.md) 或 [線上試用](https://play.kotlinlang.org)。

### 有沒有關於 Kotlin 的書籍？

有許多關於 Kotlin 的書籍。其中一些我們已審閱並推薦作為入門書籍。它們列在「[書籍](books.md)」頁面上。欲了解更多書籍，請查看 [kotlin.link](https://kotlin.link/) 上社群維護的列表。

### 有沒有關於 Kotlin 的線上課程？

你可以透過 JetBrains Academy 的 [Kotlin 核心軌道](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 學習所有 Kotlin 的基本知識，同時創建實際應用程式。

你還可以參加其他一些課程：
*   [Pluralsight 課程：Kotlin 入門](https://www.pluralsight.com/courses/kotlin-getting-started) by Kevin Jones
*   [O'Reilly 課程：Kotlin 程式設計導論](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/) by Hadi Hariri
*   [Udemy 課程：10 個 Kotlin 初學者教學](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/) by Peter Sommerhoff

你還可以查看我們 [YouTube 頻道](https://www.youtube.com/c/Kotlin) 上的其他教學和內容。

### Kotlin 有社群嗎？

是的！Kotlin 有一個非常活躍的社群。Kotlin 開發者聚集在 [Kotlin 論壇](https://discuss.kotlinlang.org)、[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin)，並更活躍於 [Kotlin Slack](https://slack.kotlinlang.org)（截至 2020 年 4 月，成員接近 30000 人）。

### 有 Kotlin 活動嗎？

是的！現在有許多使用者群組 (User Groups) 和聚會 (Meetups) 專門圍繞 Kotlin。你可以在 [網站上找到列表](https://kotlinlang.org/user-groups/user-group-list.html)。
此外，全球還有社群組織的 [Kotlin 之夜](https://kotlinlang.org/community/events.html) 活動。

### 有 Kotlin 會議嗎？

是的！[KotlinConf](https://kotlinconf.com/) 是由 JetBrains 主辦的年度會議，匯集了來自世界各地的開發者、愛好者和專家，分享他們關於 Kotlin 的知識和經驗。

除了技術講座和工作坊 (workshops)，KotlinConf 還提供交流機會 (networking opportunities)、社群互動和社交活動，與會者可以與其他 Kotlin 愛好者建立聯繫並交流想法。
它作為一個平台，促進了 Kotlin 生態系統內的協作和社群建設。

Kotlin 也在全球各地的不同會議中被涵蓋。你可以在 [網站上找到即將進行的演講列表](https://kotlinlang.org/community/talks.html?time=upcoming)。

### Kotlin 有社群媒體嗎？

是的。
訂閱 [Kotlin YouTube 頻道](https://www.youtube.com/c/Kotlin) 並在 [Twitter](https://twitter.com/kotlin) 或 [Bluesky](https://bsky.app/profile/kotlinlang.org) 上追蹤 Kotlin。

### 還有其他 Kotlin 線上資源嗎？

網站上有大量 [線上資源](https://kotlinlang.org/community/)，包括社群成員的 [Kotlin 摘要](https://kotlin.link)、[電子報](http://kotlinweekly.net)、[播客](https://talkingkotlin.com) 等。

### 我可以在哪裡獲取高清 Kotlin 標誌？

標誌可在此 [下載](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)。
使用標誌時，請遵循壓縮檔內 `guidelines.pdf` 中的簡單規則以及 [Kotlin 品牌使用指南](https://kotlinfoundation.org/guidelines/)。

欲了解更多資訊，請查看有關 [Kotlin 品牌資產](kotlin-brand-assets.md) 的頁面。