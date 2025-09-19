[//]: # (title: 常見問題)

<web-summary>Kotlin 是一種由 JetBrains 開發的簡潔多平台程式語言。</web-summary>

### 什麼是 Kotlin？

Kotlin 是一種開源的靜態型別程式語言，目標平台為 JVM、Android、JavaScript、Wasm 和 Native。它由 [JetBrains](https://www.jetbrains.com) 開發。該專案於 2010 年啟動，並很早就開放原始碼。首個官方 1.0 版本於 2016 年 2 月發佈。

### Kotlin 目前的版本是什麼？

目前發佈的版本是 %kotlinVersion%，發佈於 %kotlinReleaseDate%。您可以在 [GitHub](https://github.com/jetbrains/kotlin) 上找到更多資訊。

### Kotlin 是免費的嗎？

是的。Kotlin 是免費的，一直都是免費的，並且將來也將保持免費。它在 Apache 2.0 授權條款下開發，原始碼可從 [GitHub](https://github.com/jetbrains/kotlin) 取得。

### Kotlin 是物件導向語言還是函數式語言？

Kotlin 兼具物件導向和函數式結構。您可以用 OO 和 FP 風格使用它，或混合兩者的元素。由於對高階函數、函數型別和 Lambda 表達式等特性提供一流支援，如果您正在進行或探索函數式程式設計，Kotlin 是個絕佳選擇。

### 相較於 Java 程式語言，Kotlin 帶給我哪些優勢？

Kotlin 更簡潔。粗略估計，程式碼行數約可減少 40%。它也更型別安全 —— 例如，對非空型別的支援讓應用程式較不容易發生 NPE (空指標例外)。其他特性包括智慧型轉型 (smart casting)、高階函數、擴充函數 (extension functions) 和帶接收者的 Lambda (lambdas with receivers)，提供了編寫表達性程式碼的能力，並有助於建立 DSL (領域特定語言)。
 
### Kotlin 與 Java 程式語言相容嗎？

是的。Kotlin 與 Java 程式語言 100% 互通，並且主要重點是確保您現有的程式碼庫能與 Kotlin 正確互動。您可以輕鬆地從 [Java 呼叫 Kotlin 程式碼](java-to-kotlin-interop.md) 以及從 [Kotlin 呼叫 Java 程式碼](java-interop.md)。這使得採用更容易、風險更低。IDE 中也內建了自動化的 [Java 轉 Kotlin 轉換器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)，簡化了現有程式碼的遷移。

### Kotlin 可以用來做什麼？

Kotlin 可用於任何類型的開發，無論是伺服器端、用戶端網頁、Android，還是多平台函式庫。隨著 Kotlin/Native 目前正在開發中，將支援其他平台，例如嵌入式系統、macOS 和 iOS。人們正在將 Kotlin 用於行動和伺服器端應用程式、用戶端搭配 JavaScript 或 JavaFX，以及資料科學等，這僅是其中幾種可能性。

### 我可以用 Kotlin 進行 Android 開發嗎？

是的。Kotlin 在 Android 上作為一流語言受到支援。已有數百個應用程式在 Android 上使用 Kotlin，例如 Basecamp、Pinterest 等。欲了解更多資訊，請查看 [Android 開發相關資源](android-overview.md)。

### 我可以用 Kotlin 進行伺服器端開發嗎？

是的。Kotlin 與 JVM 100% 相容，因此您可以使用任何現有的框架，例如 Spring Boot、vert.x 或 JSF。此外，還有一些用 Kotlin 編寫的特定框架，例如 [Ktor](https://github.com/kotlin/ktor)。欲了解更多資訊，請查看 [伺服器端開發相關資源](server-overview.md)。

### 我可以用 Kotlin 進行網頁開發嗎？

是的。對於後端網頁開發，Kotlin 與 [Ktor](https://ktor.io/) 和 [Spring](https://spring.io/) 等框架配合良好，讓您能高效地建立伺服器端應用程式。此外，您還可以使用 Kotlin/Wasm 進行用戶端網頁開發。了解如何[開始使用 Kotlin/Wasm](wasm-get-started.md)。

### 我可以用 Kotlin 進行桌面開發嗎？

是的。您可以使用任何 Java UI 框架，例如 JavaFx、Swing 或其他。此外，還有一些 Kotlin 特定的框架，例如 [TornadoFX](https://github.com/edvin/tornadofx)。

### 我可以用 Kotlin 進行原生開發嗎？

是的。Kotlin/Native 作為 Kotlin 的一部分提供。它將 Kotlin 編譯為可在沒有 VM (虛擬機器) 的情況下執行的原生程式碼。您可以在流行的桌面和行動平台，甚至是一些 IoT (物聯網) 裝置上試用它。欲了解更多資訊，請查看 [Kotlin/Native 文件](native-overview.md)。

### 哪些 IDE 支援 Kotlin？

Kotlin 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/kotlin/get-started) 中提供完整的開箱即用支援，並配有由 JetBrains 開發的官方 Kotlin 插件。

其他 IDE 和程式碼編輯器僅有社群支援的 Kotlin 插件。

您也可以嘗試使用 [Kotlin Playground](https://play.kotlinlang.org) 在瀏覽器中編寫、執行和分享 Kotlin 程式碼。

此外，還提供[命令列編譯器](command-line.md)，它為應用程式的編譯和執行提供了直接的支援。
  
### 哪些建構工具支援 Kotlin？

在 JVM 方面，主要的建構工具包括 [Gradle](gradle.md) 和 [Maven](maven.md)。還有一些針對用戶端 JavaScript 的建構工具可用。

### Kotlin 會編譯成什麼？

當目標為 JVM 時，Kotlin 會產生與 Java 相容的位元組碼 (bytecode)。

當目標為 JavaScript 時，Kotlin 會轉譯為 ES5.1，並產生與包括 AMD 和 CommonJS 在內的模組系統相容的程式碼。

當目標為原生平台時，Kotlin 將會產生平台特定的程式碼 (透過 LLVM)。

### Kotlin 目標支援哪些 JVM 版本？

Kotlin 讓您可以選擇用於執行的 JVM 版本。預設情況下，Kotlin/JVM 編譯器會產生與 Java 8 相容的位元組碼。如果您想利用 Java 新版本中可用的優化，可以明確指定目標 Java 版本從 9 到 24。請注意，在這種情況下，所產生的位元組碼可能無法在較低版本上執行。從 [Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8) 開始，編譯器不支援產生與 Java 8 以下版本相容的位元組碼。

### Kotlin 難學嗎？

Kotlin 受現有語言啟發，例如 Java、C#、JavaScript、Scala 和 Groovy。我們已努力確保 Kotlin 易於學習，讓大家能在數天內輕鬆上手，閱讀和編寫 Kotlin 程式碼。學習慣用 (idiomatic) 的 Kotlin 並使用更多其進階功能可能需要更長的時間，但總體而言，它並不是一門複雜的語言。欲了解更多資訊，請查看[我們的學習資料](learning-materials-overview.md)。
 
### 哪些公司正在使用 Kotlin？
 
使用 Kotlin 的公司不勝枚舉，但一些已透過部落格文章、GitHub 儲存庫或演講公開聲明使用 Kotlin 的知名公司包括 [Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/) 和 [Corda](https://corda.net/blog/kotlin/)。
 
### 誰開發了 Kotlin？

Kotlin 由 [JetBrains 的工程師團隊](https://www.jetbrains.com/)開發 (目前團隊規模超過 100 人)。首席語言設計師是 Michail Zarečenskij。除了核心團隊之外，GitHub 上還有超過 250 名的外部貢獻者。

### 我可以在哪裡了解更多關於 Kotlin 的資訊？

最好的起點是[我們的網站](https://kotlinlang.org)。要開始使用 Kotlin，您可以安裝其中一個[官方 IDE](kotlin-ide.md) 或[在線上試用](https://play.kotlinlang.org)。

### 有沒有關於 Kotlin 的書籍？

有許多關於 Kotlin 的書籍可供選擇。我們已審閱其中一些，並推薦給初學者。它們列在[書籍](books.md)頁面上。如需更多書籍，請參閱 [kotlin.link](https://kotlin.link/) 上社群維護的清單。

### 有沒有關於 Kotlin 的線上課程？

您可以透過 JetBrains Academy 的 [Kotlin 核心學習路徑](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)，在建立實際應用程式的同時學習所有 Kotlin 要點。

您還可以參加以下幾個課程：
* [Pluralsight 課程：Kotlin 入門](https://www.pluralsight.com/courses/kotlin-getting-started)，作者 Kevin Jones
* [O'Reilly 課程：Kotlin 程式設計導論](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)，作者 Hadi Hariri
* [Udemy 課程：10 個 Kotlin 初學者教程](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)，作者 Peter Sommerhoff

您也可以查看[我們的 YouTube 頻道](https://www.youtube.com/c/Kotlin)上的其他教學和內容。

### Kotlin 有社群嗎？

是的！Kotlin 有一個非常活躍的社群。Kotlin 開發者活躍於 [Kotlin 論壇](https://discuss.kotlinlang.org)、[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin) 以及更活躍地在 [Kotlin Slack](https://slack.kotlinlang.org) 上 (截至 2020 年 4 月，成員接近 30000 人)。

### 有沒有 Kotlin 活動？
 
是的！現在有許多[使用者群組和聚會](https://kotlinlang.org/user-groups/user-group-list.html)專注於 Kotlin。此外，世界各地還有社群組織的 [Kotlin 之夜](https://kotlinlang.org/community/events.html)活動。

### 有沒有 Kotlin 大會？

是的！[KotlinConf](https://kotlinconf.com/) 是由 JetBrains 主辦的年度大會，它匯集了來自世界各地的開發者、愛好者和專家，分享他們關於 Kotlin 的知識和經驗。

除了技術演講和研討會，KotlinConf 還提供交流機會、社群互動和社交活動，讓與會者可以與其他 Kotlin 愛好者聯繫並交流想法。
它作為一個平台，旨在促進 Kotlin 生態系統內的協作和社群建立。

Kotlin 也在世界各地的不同會議中被介紹。您可以在[網站上找到即將舉行的演講清單](https://kotlinlang.org/community/talks.html?time=upcoming)。

### Kotlin 有社群媒體帳號嗎？

是的。訂閱[Kotlin YouTube 頻道](https://www.youtube.com/c/Kotlin)並在 [Twitter](https://twitter.com/kotlin) 或 [Bluesky](https://bsky.app/profile/kotlinlang.org) 上關注 Kotlin。

### 還有其他線上 Kotlin 資源嗎？

網站上有許多[線上資源](https://kotlinlang.org/community/)，包括社群成員的 [Kotlin 摘要](https://kotlin.link)、[電子報](http://kotlinweekly.net)、[播客](https://talkingkotlin.com)等。

### 我可以在哪裡取得高清 Kotlin 標誌？

標誌可在此[下載](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)。使用標誌時，請遵循壓縮檔內 `guidelines.pdf` 中的簡單規則以及 [Kotlin 品牌使用指南](https://kotlinfoundation.org/guidelines/)。

欲了解更多資訊，請查看關於 [Kotlin 品牌資產](kotlin-brand-assets.md)的頁面。