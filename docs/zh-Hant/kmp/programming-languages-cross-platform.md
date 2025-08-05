# 開發跨平台應用程式的流行程式語言

<web-summary>探索選擇跨平台開發語言的關鍵考量、流行技術的比較以及實際案例研究。</web-summary>

您可能已經注意到，[跨平台開發](cross-platform-mobile-development.md)這個術語在現今越來越常出現。確實，跨平台程式設計在軟體開發領域中日益普及。它在行動應用程式領域尤為普遍，但其用途絕不僅限於這些類型的應用程式。隨著企業努力透過多種裝置和作業系統觸及更廣泛的受眾，開發人員正轉向多功能語言和框架，以消除平台障礙。

如果您想知道哪種程式語言最能幫助您開始進行跨平台開發，這篇概述文章將為您指明方向，提供見解和實際使用案例。

## 理解跨平台開發

跨平台應用程式開發是指一種開發方法，其中單一程式碼庫可用於建立可在多個平台（例如 iOS、Android、Windows、macOS 和網頁瀏覽器等）上運行的軟體。近年來，由於行動應用程式需求的增長，這種方法已獲得普及。行動工程師可以在 iOS 和 Android 之間共用部分或全部原始碼，而無需為每個平台開發單獨的應用程式。

我們有一份專門指南，您可以在其中閱讀更多關於 [原生和跨平台開發](native-and-cross-platform.md) 的優點和限制，以及如何在這兩種方法之間進行選擇。跨平台開發的一些主要優點包括：

1.  **成本效益。** 為每個平台建立單獨的應用程式，在時間和資源方面都可能成本高昂。透過跨平台開發，開發人員可以編寫一次程式碼並將其部署到多個平台，從而降低開發成本。

2.  **更快的開發速度。** 這種方法透過讓開發人員只需編寫和維護單一程式碼庫，有助於加速開發過程。

3.  **高效且靈活的程式碼共用。** 現代跨平台技術使開發人員能夠在多個平台之間重用程式碼，同時保留原生程式設計的優勢。

4.  **跨平台一致的使用者體驗。** 跨平台開發確保關鍵行為（例如計算或工作流程）在需要時能在不同平台上提供相同的結果。這有助於保持一致性，無論使用者是使用 iOS、Android 或其他裝置和作業系統，都能獲得相同的體驗。

在本文中，我們將討論一些最受歡迎的跨平台開發程式語言。

## 流行跨平台程式語言、框架和技術

本文著重於適合跨平台開發的成熟程式語言。儘管有許多為各種目的設計的語言，但本節將簡要概述一些最受歡迎的跨平台開發程式語言，並提供相關統計資料和支援它們的框架。

<table style="header-row">
    <tr>
        <td>語言</td>
        <td>首次出現</td>
        <td>最流行技術 (<a href="https://survey.stackoverflow.co/2024/technology#most-popular-technologies">Stack Overflow, 2024</a>)</td>
        <td>最流行技術 (<a href="https://www.jetbrains.com/lp/devecosystem-2024/">開發者生態系統報告 2024</a>)</td>
        <td>生態系統/工具鏈</td>
        <td>技術/框架</td>
    </tr>
    <tr>
        <td>JavaScript</td>
        <td>1995</td>
        <td>#1 (62.3%)</td>
        <td>#1 (61%)</td>
        <td>豐富的生態系統、眾多函式庫、活躍的社群</td>
        <td>React Native, Ionic</td>
    </tr>
    <tr>
        <td>Dart</td>
        <td>2011</td>
        <td>#17 (6%)</td>
        <td>#15 (8%)</td>
        <td>成長中的生態系統，由 Google 支援</td>
        <td>Flutter</td>
    </tr>
    <tr>
        <td>Kotlin</td>
        <td>2011</td>
        <td>#15 (9.04%)</td>
        <td>#13 (14%)</td>
        <td>擴展中的生態系統，JetBrains 工具的一流支援</td>
        <td>Kotlin Multiplatform</td>
    </tr>
    <tr>
        <td>C#</td>
        <td>2000</td>
        <td>#8 (27.1%)</td>
        <td>9 (22%)</td>
        <td>Microsoft 的強大支援，龐大的生態系統</td>
        <td>.NET MAUI</td>
    </tr>
    <tr>
        <td>C++</td>
        <td>1985</td>
        <td>#9 (23%)</td>
        <td>8 (25%)</td>
        <td>成熟但第三方函式庫少於其他語言</td>
        <td>Qt</td>
    </tr>
</table>

**JavaScript**

JavaScript 是一種廣泛使用的程式語言，允許使用者在網頁上實作複雜的功能。隨著 React Native 和 Ionic 等框架的引入，它已成為跨平台應用程式開發的熱門選擇。根據 JetBrains 進行的最新 [開發者生態系統調查](https://www.jetbrains.com/lp/devecosystem-2024/)，61% 的開發者使用 JavaScript，使其成為最受歡迎的程式語言。

**Dart**

Dart 是一種物件導向、基於類別的程式語言，由 Google 於 2011 年推出。Dart 構成了 Flutter 的基礎，Flutter 是由 Google 建立的開源框架，用於從單一程式碼庫建構多平台應用程式。Dart 提供了驅動 Flutter 應用程式的語言和執行時環境。

**Kotlin**

Kotlin 是由 JetBrains 開發的一種現代、成熟的多平台程式語言。根據 [Octoverse 報告](https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages)，它是 2024 年成長速度第五快的語言。它簡潔、安全、可與 Java 及其他語言互通，並且是 Google 推薦的 Android 應用程式開發語言。

[Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/) 是 JetBrains 的一項技術，它允許您為各種平台建立應用程式，並在這些平台之間重用 Kotlin 程式碼，同時保留原生程式設計的優勢。此外，JetBrains 提供 Compose Multiplatform，這是一個基於 KMP 和 Jetpack Compose 的宣告式框架，用於在多個平台之間共用使用者介面 (UI)。2024 年 5 月，Google 宣布他們官方 [支援 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)，以在 Android 和 iOS 之間共用業務邏輯。

[![Discover Kotlin Multiplatform](discover-kmp.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)

**C#**

C# 是由 Microsoft 開發的一種跨平台通用程式語言。C# 是 .NET Framework 最受歡迎的語言。.NET MAUI 是一個框架，用於從單一 C# 程式碼庫為 Android、iOS、Mac 和 Windows 建構原生、跨平台的桌面和行動應用程式。

**C++**

C++ 是一種通用程式語言，於 1985 年首次發布，作為 C 程式語言的擴展。Qt 是一個跨平台軟體開發框架，包含一組模組化的 C++ 函式庫類別，並提供一系列 API 用於應用程式開發。Qt 提供了一個 C++ 類別函式庫，其中包含用於 C++ 開發的應用程式建構區塊。

## 選擇跨平台程式語言的關鍵因素

如今有這麼多可用的語言、技術和工具，要選擇合適的可能會讓人感到不知所措，特別是如果您剛踏入跨平台開發的世界。各種跨平台技術都有其獨特的優缺點，但最終，這一切都取決於您想要建構的軟體的目標和要求。

為您的專案選擇語言或框架時，您應該牢記幾個重要因素。這些包括您的應用程式類型、其效能和使用者體驗 (UX) 要求、相關工具以及下面詳細描述的各種其他考量。

**1. 應用程式的類型**

不同的程式語言和框架在不同的平台（例如 Windows、macOS、Linux、iOS、Android 和網頁瀏覽器）上獲得更好的支援。某些語言自然更適合特定的平台和專案。

**2. 效能和使用者體驗 (UX) 要求**

某些類型的應用程式具有特定的效能和使用者體驗 (UX) 要求，這些要求可以透過不同的標準來衡量，例如速度、響應能力、記憶體使用量以及它們對中央處理器 (CPU) 和圖形處理器 (GPU) 的消耗。考慮您未來應用程式需要實現的功能以及您對上述標準的期望參數。

> 例如，圖形密集型遊戲應用程式可能會受益於能夠高效利用 GPU 的語言。同時，商業應用程式可能會優先考慮資料庫整合和網路通訊的便利性。
>
{style="tip"}

**3. 現有技能組合和學習曲線**

在為下一個專案選擇技術時，開發團隊應考慮他們之前的經驗。引入新的語言或工具需要時間進行培訓，這有時可能會延遲專案。學習曲線越陡峭，團隊掌握所需的時間就越長。

> 例如，如果您的團隊由精通 JavaScript 的開發者組成，並且您缺乏採用新技術的資源，那麼選擇利用 JavaScript 的框架（例如 React Native）可能會有所助益。
>
{style="tip"}

**4. 現有使用案例**

另一個要考慮的重要因素是該技術的實際應用。審查已成功實施特定跨平台語言或框架的公司案例研究，可以提供關於這些技術在生產環境中表現的寶貴見解。這可以幫助您評估特定技術是否適合您專案的目標。例如，您可以探索利用 Kotlin Multiplatform 開發跨多個平台的生產就緒應用程式的公司案例研究。

![Kotlin Multiplatform Case Studies](kmp-case-studies.png){width="700"}

[![Explore Real-World Kotlin Multiplatform Use Cases](kmp-use-cases-1.svg){width="500" style="block"}](case-studies.topic)

**5. 語言生態系統**

另一個重要因素是語言生態系統的成熟度。請注意支援多平台開發的工具和函式庫的可用性和品質。例如，JavaScript 擁有大量的函式庫，支援前端框架（React、Angular、Vue.js）、後端開發（Express、NestJS）以及各種其他功能。

同樣地，Flutter 擁有大量且快速增長的函式庫，也稱為套件或外掛程式。儘管 Kotlin Multiplatform 目前的函式庫數量較少，但其生態系統正在迅速增長，並且該語言正在全球許多 Kotlin 開發人員的努力下不斷增強。下方的資訊圖表顯示了 Kotlin Multiplatform 函式庫數量多年來的增長情況。

![Kotlin Multiplatform Libraries Over Years](kmp-libs-over-years.png){width="700"}

**6. 流行度與社群支援**

值得仔細審視程式語言及相關技術的流行度和社群支援。這不僅僅是使用者和函式庫的數量。請注意該語言社群的活躍度和支持程度，包括其使用者和貢獻者。尋找可用的部落格、播客、論壇及其他資源。

## 跨平台開發的未來

隨著跨平台開發的不斷演進，我們可以預期支援它的工具和語言將帶來更高的效率、效能和靈活性。隨著對多裝置間流暢使用者體驗的需求不斷增長，越來越多的公司正在投資於允許開發人員共用程式碼而又不影響原生效能的框架。跨平台技術的未來充滿希望，其進步很可能減少限制並進一步簡化各種應用程式的開發流程。

[![See Kotlin Multiplatform in Action](see-kmp-in-action.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)