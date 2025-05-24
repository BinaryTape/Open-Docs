---
title: "常見問題 (FAQ)"
description: "Kotlin 是一種由 JetBrains 開發的簡潔多平台程式語言。"
---
### 什麼是 Kotlin？

Kotlin 是一種開放原始碼的靜態型別程式語言，目標是 JVM、Android、JavaScript、Wasm 和 Native。
它由 [JetBrains](https://www.jetbrains.com) 開發。該專案於 2010 年啟動，並且從一開始就是開放原始碼。
第一個官方 1.0 版本於 2016 年 2 月發布。

### Kotlin 目前的版本是什麼？

目前發布的版本是 2.1.20，於 2025 年 3 月 20 日發布。
您可以在 [GitHub](https://github.com/jetbrains/kotlin) 上找到更多資訊。

### Kotlin 是免費的嗎？

是的。Kotlin 是免費的，一直是免費的，並且將保持免費。它是在 Apache 2.0 許可證下開發的，並且原始碼可在 [GitHub](https://github.com/jetbrains/kotlin) 上取得。

### Kotlin 是一種物件導向語言還是函數式語言？

Kotlin 兼具物件導向和函數式結構。您可以在 OO 和 FP 樣式中使用它，或者混合兩者的元素。
憑藉對高階函數、函數型別和 Lambda 等功能的一流支援，如果您正在進行或探索函數式程式設計，Kotlin 是一個絕佳的選擇。

### 與 Java 程式語言相比，Kotlin 給我帶來什麼優勢？

Kotlin 更簡潔。粗略估計表明程式碼行數減少約 40%。
它也更具型別安全性 – 例如，對不可為空 (non-nullable) 型別的支援使應用程式更不易發生 NPE。
其他功能，包括智慧型轉換 (smart casting)、高階函數、擴充函數 (extension functions) 和帶接收器的 Lambda (lambdas with receivers)，提供了編寫具有表現力的程式碼的能力，並有助於建立 DSL。

### Kotlin 與 Java 程式語言相容嗎？

是的。Kotlin 與 Java 程式語言 100% 可互通，並且非常重視確保您現有的程式碼庫可以與 Kotlin 正確互動。您可以輕鬆地從 [Java 呼叫 Kotlin 程式碼](java-to-kotlin-interop) 和從 [Kotlin 呼叫 Java 程式碼](java-interop)。這使得採用更容易且風險更低。IDE 中還內建了一個自動化的 [Java 到 Kotlin 轉換器](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)，可簡化現有程式碼的遷移。

### 我可以使用 Kotlin 做什麼？

Kotlin 可用於任何類型的開發，無論是伺服器端、客戶端 Web、Android 還是多平台函式庫。
隨著 Kotlin/Native 目前的開發，支援其他平台，例如嵌入式系統、macOS 和 iOS。
人們正在使用 Kotlin 進行行動和伺服器端應用程式、使用 JavaScript 或 JavaFX 的客戶端以及資料科學，僅舉幾例可能性。

### 我可以使用 Kotlin 進行 Android 開發嗎？

是的。Kotlin 在 Android 上作為一流語言受到支援。已經有數百個應用程式使用 Kotlin 進行 Android 開發，例如 Basecamp、Pinterest 等。有關更多資訊，請查看 [Android 開發資源](android-overview)。

### 我可以使用 Kotlin 進行伺服器端開發嗎？

是的。Kotlin 與 JVM 100% 相容，因此您可以使用任何現有框架，例如 Spring Boot、vert.x 或 JSF。此外，還有用 Kotlin 編寫的特定框架，例如 [Ktor](https://github.com/kotlin/ktor)。有關更多資訊，請查看 [伺服器端開發資源](server-overview)。

### 我可以使用 Kotlin 進行 Web 開發嗎？

是的。對於後端 Web 開發，Kotlin 可以與 [Ktor](https://ktor.io/) 和 [Spring](https://spring.io/) 等框架很好地協同工作，使您能夠高效地建構伺服器端應用程式。此外，您可以使用 Kotlin/Wasm 進行客戶端 Web 開發。
了解如何 [開始使用 Kotlin/Wasm](wasm-get-started)。

### 我可以使用 Kotlin 進行桌面開發嗎？

是的。您可以使用任何 Java UI 框架，例如 JavaFx、Swing 或其他框架。
此外，還有特定於 Kotlin 的框架，例如 [TornadoFX](https://github.com/edvin/tornadofx)。

### 我可以使用 Kotlin 進行原生開發嗎？

是的。Kotlin/Native 作為 Kotlin 的一部分提供。它將 Kotlin 編譯為可在沒有 VM 的情況下執行的原生程式碼。
您可以在流行的桌面和行動平台上，甚至在某些 IoT 裝置上嘗試它。
有關更多資訊，請查看 [Kotlin/Native 文件](native-overview)。

### 哪些 IDE 支援 Kotlin？

Kotlin 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/kotlin/get-started) 中提供完整的開箱即用支援，並帶有 JetBrains 開發的官方 Kotlin 外掛程式。

其他 IDE 和程式碼編輯器只有 Kotlin 社群支援的外掛程式。

您還可以嘗試 [Kotlin Playground](https://play.kotlinlang.org)，用於在瀏覽器中編寫、執行和共用 Kotlin 程式碼。

此外，還提供了一個 [命令列編譯器](command-line)，它為編譯和執行應用程式提供了直接的支援。

### 哪些建構工具支援 Kotlin？

在 JVM 方面，主要的建構工具包括 [Gradle](gradle)、[Maven](maven)、[Ant](ant) 和 [Kobalt](https://beust.com/kobalt/home/index.html)。還有一些建構工具可用於目標客戶端 JavaScript。

### Kotlin 編譯成什麼？

當以 JVM 為目標時，Kotlin 會產生與 Java 相容的位元組碼 (bytecode)。

當以 JavaScript 為目標時，Kotlin 會轉譯為 ES5.1 並產生與包括 AMD 和 CommonJS 在內的模組系統相容的程式碼。

當以 native 為目標時，Kotlin 將產生平台特定的程式碼（透過 LLVM）。

### Kotlin 目標 JVM 的哪些版本？

Kotlin 讓您可以選擇用於執行的 JVM 版本。預設情況下，Kotlin/JVM 編譯器會產生與 Java 8 相容的位元組碼。
如果您想利用較新版本的 Java 中提供的最佳化，您可以明確指定從 9 到 23 的目標 Java 版本。請注意，在這種情況下，產生的位元組碼可能無法在較低版本上執行。
從 [Kotlin 1.5](whatsnew15#new-default-jvm-target-1-8) 開始，編譯器不支援產生與低於 8 的 Java 版本相容的位元組碼。

### Kotlin 難學嗎？

Kotlin 的靈感來自現有語言，例如 Java、C#、JavaScript、Scala 和 Groovy。我們已盡力確保 Kotlin 易於學習，以便人們可以輕鬆上手，在幾天之內閱讀和編寫 Kotlin。學習慣用的 Kotlin 並使用其一些更進階的功能可能需要更長的時間，但總體而言，它不是一種複雜的語言。
有關更多資訊，請查看 [我們的學習資料](learning-materials-overview)。

### 哪些公司正在使用 Kotlin？

有太多公司使用 Kotlin，無法一一列出，但一些更知名的公司已公開宣布使用 Kotlin，無論是透過部落格文章、GitHub 儲存庫還是演講，包括 [Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/) 和 [Corda](https://corda.net/blog/kotlin/)。

### 誰開發 Kotlin？

Kotlin 由 [JetBrains 的一個工程師團隊開發（目前團隊規模為 100 多人）](https://www.jetbrains.com/)。
首席語言設計師是 Michail Zarečenskij。除了核心團隊之外，GitHub 上還有 250 多名外部貢獻者。

### 在哪裡可以了解更多關於 Kotlin 的資訊？

最好的起點是 [我們的網站](https://kotlinlang.org)。
要開始使用 Kotlin，您可以安裝其中一個 [官方 IDE](kotlin-ide) 或 [在線上試用](https://play.kotlinlang.org)。

### 有沒有關於 Kotlin 的書籍？

有很多關於 Kotlin 的書籍可供選擇。我們已經審閱了其中一些書籍，並且可以推薦從它們開始。它們列在 [書籍](books) 頁面上。如需更多書籍，請參閱社群維護的清單 [kotlin.link](https://kotlin.link/)。

### 是否有適用於 Kotlin 的線上課程？

您可以透過 JetBrains Academy 的 [Kotlin Core 軌道](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)，在建立工作應用程式的同時學習所有 Kotlin 基礎知識。

您可以選修的其他一些課程：
* [Pluralsight 課程：Kotlin 入門](https://www.pluralsight.com/courses/kotlin-getting-started)，作者：Kevin Jones
* [O'Reilly 課程：Kotlin 程式設計簡介](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)，作者：Hadi Hariri
* [Udemy 課程：10 個適用於初學者的 Kotlin 教學課程](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)，作者：Peter Sommerhoff

您也可以查看我們的 [YouTube 頻道](https://www.youtube.com/c/Kotlin) 上的其他教學課程和內容。

### Kotlin 有社群嗎？

有！Kotlin 有一個非常活躍的社群。Kotlin 開發人員在 [Kotlin 論壇](https://discuss.kotlinlang.org)、[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin) 上閒逛，並且在 [Kotlin Slack](https://slack.kotlinlang.org) 上更為活躍（截至 2020 年 4 月，擁有近 30000 名成員）。

### 有 Kotlin 活動嗎？

有！現在有許多使用者群組和聚會專門關注 Kotlin。您可以在 [網站上找到清單](https://kotlinlang.org/user-groups/user-group-list.html)。
此外，世界各地還有社群組織的 [Kotlin 之夜](https://kotlinlang.org/community/events.html) 活動。

### 有 Kotlin 會議嗎？

有！[KotlinConf](https://kotlinconf.com/) 是 JetBrains 主辦的年度會議，匯集了來自世界各地的開發人員、愛好者和專家，分享他們在 Kotlin 方面的知識和經驗。

除了技術講座和工作坊之外，KotlinConf 還提供交流機會、社群互動和社交活動，與會者可以在此與其他 Kotliner 建立聯繫並交流想法。
它作為在 Kotlin 生態系統內促進協作和社群建設的平台。

Kotlin 也在世界各地的不同會議上被報導。您可以在 [網站上找到即將舉行的演講清單](https://kotlinlang.org/community/talks.html?time=upcoming)。

### Kotlin 在社群媒體上嗎？

是的。
訂閱 [Kotlin YouTube 頻道](https://www.youtube.com/c/Kotlin) 並在 [Twitter](https://twitter.com/kotlin) 或 [Bluesky](https://bsky.app/profile/kotlinlang.org) 上關注 Kotlin。

### 還有其他線上 Kotlin 資源嗎？

該網站擁有一堆 [線上資源](https://kotlinlang.org/community/)，包括社群成員的 [Kotlin Digests](https://kotlin.link)、[新聞通訊](http://kotlinweekly.net)、[podcast](https://talkingkotlin.com) 等。

### 在哪裡可以獲得高清 Kotlin 標誌？

可以從 [這裡](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip) 下載標誌。
使用標誌時，請遵循歸檔檔案內 `guidelines.pdf` 中的簡單規則以及 [Kotlin 品牌使用指南](https://kotlinfoundation.org/guidelines/)。

有關更多資訊，請查看關於 [Kotlin 品牌資產](kotlin-brand-assets) 的頁面。