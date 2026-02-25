# 開發跨平台應用程式的熱門程式語言

<web-summary>探索選擇跨平台開發語言時的核心考量因素、熱門技術比較以及真實案例研究。</web-summary>

您可能已經注意到「[跨平台開發](cross-platform-mobile-development.md)」這個詞最近出現得越來越頻繁。的確，跨平台程式設計在軟體開發領域正變得日益普及。這在行動應用程式領域尤為普遍，但其用途絕不僅限於此類應用程式。隨著企業致力於在多種裝置和作業系統上觸及更廣泛的受眾，開發人員正轉向使用能消除平台障礙的多功能語言和架構。

如果您想知道哪種程式語言最能助您開啟跨平台開發之旅，這篇總覽文章將為您指引正確的方向，提供深入見解與真實的使用案例。

## 了解跨平台開發

跨平台應用程式開發是指一種開發方法，其中單一程式碼庫可用於建立在多個平台上執行的軟體，例如 iOS、Android、Windows、macOS 和網頁瀏覽器等。這種方法近年來大受歡迎，很大程度上歸功於對行動應用程式日益增長的需求。行動工程師可以在 iOS 和 Android 之間共用部分或全部原始碼，而無需為每個平台開發單獨的應用程式。

我們有一份專門的指南，您可以在其中閱讀更多關於[原生與跨平台開發](native-and-cross-platform.md)的優缺點，以及如何在二者之間做出選擇。跨平台開發的一些主要優點包括：

1. **成本效益。** 為每個平台建置單獨的應用程式，在時間和資源方面都可能非常昂貴。透過跨平台開發，開發人員可以編寫一次程式碼並將其部署到多個平台，從而降低開發成本。

2. **開發速度更快。** 這種方法有助於加速開發過程，因為開發人員只需要編寫和維護單一程式碼庫。

3. **高效且靈活的程式碼共用。** 現代跨平台技術使開發人員能夠在多個平台之間重複使用程式碼，同時保持原生程式設計的優勢。

4. **跨平台一致的使用者體驗。** 跨平台開發可確保關鍵行為（例如計算或工作流程）在需要時在不同平台上提供相同的結果。這有助於保持一致性，無論使用者是在 iOS、Android 還是其他裝置與作業系統上，都能提供相同的體驗。

在本文中，我們將討論一些最受歡迎的跨平台開發程式語言。

## 熱門跨平台程式語言、架構與技術

本文重點介紹適合跨平台開發且發展成熟的程式語言。雖然有許多為各種目的設計的語言，但本節將簡要介紹一些最受歡迎的跨平台開發程式語言，以及相關統計數據和支援它們的架構。

<table style="header-row">
    
<tr>
<td>語言</td>
        <td>首次出現</td>
        <td>最受歡迎的技術 (<a href="https://survey.stackoverflow.co/2024/technology#most-popular-technologies">Stack Overflow, 2024</a>)</td>
        <td>最受歡迎的技術 (<a href="https://www.jetbrains.com/lp/devecosystem-2024/">開發者生態系統報告 2024</a>)</td>
        <td>生態系統／工具集</td>
        <td>技術／架構</td>
</tr>

    
<tr>
<td>JavaScript</td>
        <td>1995</td>
        <td>#1 (62.3%)</td>
        <td>#1 (61%)</td>
        <td>豐富的生態系統、眾多的程式庫、活躍的社群</td>
        <td>React Native, Ionic</td>
</tr>

    
<tr>
<td>Dart</td>
        <td>2011</td>
        <td>#17 (6%)</td>
        <td>#15 (8%)</td>
        <td>不斷成長的生態系統，由 Google 支援</td>
        <td>Flutter</td>
</tr>

    
<tr>
<td>Kotlin</td>
        <td>2011</td>
        <td>#15 (9.04%)</td>
        <td>#13 (14%)</td>
        <td>擴張中的生態系統，對 JetBrains 工具的一等支援</td>
        <td>Kotlin Multiplatform</td>
</tr>

    
<tr>
<td>C#</td>
        <td>2000</td>
        <td>#8 (27.1%)</td>
        <td>9 (22%)</td>
        <td>來自 Microsoft 的強大支援，龐大的生態系統</td>
        <td>.NET MAUI</td>
</tr>

    
<tr>
<td>C++</td>
        <td>1985</td>
        <td>#9 (23%)</td>
        <td>8 (25%)</td>
        <td>成熟但第三方程式庫少於其他語言</td>
        <td>Qt</td>
</tr>

</table>

**JavaScript**

JavaScript 是一種廣泛使用的程式語言，允許使用者在網頁上實作複雜的功能。隨著 React Native 和 Ionic 等架構的引入，它已成為跨平台應用程式開發的熱門選擇。根據 JetBrains 進行的最新[開發者生態系統調查](https://www.jetbrains.com/lp/devecosystem-2024/)，61% 的開發人員使用 JavaScript，這使其成為最受歡迎的程式語言。

**Dart**

Dart 是一種物件導向、基於類別的程式語言，由 Google 於 2011 年推出。Dart 是 Flutter 的基礎，Flutter 是由 Google 建立的開源架構，用於從單一程式碼庫建置多平台應用程式。Dart 提供了驅動 Flutter 應用程式的語言和執行階段。

**Kotlin**

Kotlin 是一種由 JetBrains 開發的現代、成熟的多平台程式語言。根據 [Octoverse 報告](https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages)，它是 2024 年成長速度第五快的語言。它簡潔、安全、可與 Java 及其他語言互操作，並且是 Google 偏好的 Android 應用程式開發語言。

[Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/) 是 JetBrains 的一項技術，允許您為各種平台建立應用程式並跨平台重複使用 Kotlin 程式碼，同時保留原生程式設計的優點。此外，JetBrains 還提供了 Compose Multiplatform，這是一個基於 KMP 和 Jetpack Compose 的宣告式架構，用於跨多個平台共用 UI。2024 年 5 月，Google 宣布正式[支援 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)，用於在 Android 和 iOS 之間共用商業邏輯。

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)

**C#**

C# 是由 Microsoft 開發的跨平台通用程式語言。C# 是 .NET Framework 最受歡迎的語言。.NET MAUI 是一個用於從單一 C# 程式碼庫為 Android、iOS、Mac 和 Windows 建置原生跨平台桌面與行動應用程式的架構。

**C++**

C++ 是一種通用程式語言，最初於 1985 年作為 C 程式語言的擴充發佈。Qt 是一個跨平台軟體開發架構，包含一組模組化的 C++ 程式庫類別，並為應用程式開發提供了一系列 API。Qt 為 C++ 開發提供了帶有應用程式構建塊的 C++ 類別庫。

## 選擇跨平台程式語言的關鍵因素

面對現今所有可用的語言、技術和工具，嘗試選擇正確的一個可能會讓人不知所措，尤其是如果您才剛踏入跨平台開發的世界。各種跨平台技術都有其獨特的優缺點，但最終，這一切都取決於您要建置的軟體的目標和需求。

在為您的專案選擇語言或架構時，應牢記幾個重要因素。這些因素包括應用程式類型、其效能與使用者體驗（UX）需求、相關工具集以及下文詳述的其他各種考量。

**1. 應用程式類型**

不同的程式語言和架構在 Windows、macOS、Linux、iOS、Android 和網頁瀏覽器等不同平台上的支援程度不同。某些語言天生更適合特定的平台和專案。

**2. 效能與 UX 需求**

某些類型的應用程式具有特定的效能和使用者體驗（UX）需求，這些需求可以透過不同的標準來衡量，例如速度、回應性、記憶體使用量，以及對中央處理器（CPU）和圖形處理器（GPU）的消耗。考量您未來的應用程式需要實現的功能，以及您對上述標準的期望參數。

> 例如，圖形密集型的遊戲應用程式可能會受益於能高效利用 GPU 的語言。與此同時，商務應用程式可能會優先考慮資料庫整合與網路通訊的便利性。
>
{style="tip"}

**3. 現有的技能組合與學習曲線**

在為下一個專案選擇技術時，開發團隊應考慮到先前的經驗。引入新語言或工具需要時間進行培訓，有時可能會延誤專案。學習曲線越陡峭，團隊達到熟練程度所需的時間就越長。

> 例如，如果您的團隊由精通 JavaScript 的開發人員組成，且您缺乏採用新技術的資源，那麼選擇使用 JavaScript 的架構（如 React Native）可能會更有利。
>
{style="tip"}

**4. 現有的使用案例**

另一個要考慮的重要因素是該技術在現實世界中的使用情況。查看成功實作特定跨平台語言或架構的公司的案例研究，可以為這些技術在生產環境中的表現提供寶貴的見解。這可以幫助您評估特定技術是否適合您的專案目標。例如，您可以探索企業利用 Kotlin Multiplatform 開發跨多平台、準備好用於生產環境應用程式的案例研究。

![Kotlin Multiplatform 案例研究](kmp-case-studies.png){width="700"}

[![探索真實世界的 Kotlin Multiplatform 使用案例](kmp-use-cases-1.svg){width="500" style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

**5. 語言生態系統**

另一個重要因素是該語言生態系統的成熟度。請注意支援多平台開發的工具和程式庫的可用性與品質。例如，JavaScript 擁有龐大數量的程式庫，支援前端架構（React、Angular、Vue.js）、後端開發（Express, NestJS）以及廣泛的其他功能。

同樣地，Flutter 擁有數量龐大且快速增長的程式庫，也稱為套件（package）或外掛程式（plugin）。雖然 Kotlin Multiplatform 目前的程式庫較少，但其生態系統正在迅速發展，並且該語言正受到全球眾多 Kotlin 開發人員的強化。下面的資訊圖表顯示了 Kotlin Multiplatform 程式庫數量多年來的增長情況。

![Kotlin Multiplatform 程式庫歷年增長](kmp-libs-over-years.png){width="700"}

**6. 普及度與社群支援**

程式語言及相關技術的普及度和社群支援值得仔細研究。這不僅僅取決於使用者和程式庫的數量。請注意該語言社群（包括其使用者和貢獻者）的活躍程度和支援程度。尋找可用的部落格、播客、論壇和其他資源。

## 跨平台開發的未來

隨著跨平台開發的不斷演進，我們可以期待支援它的工具和語言會具備更高的效率、效能和靈活性。隨著對多個裝置間無縫使用者體驗的需求日益增長，更多公司正在投資那些允許開發人員在不犧牲原生效能的情況下共用程式碼的架構。跨平台技術的前景看好，進步很可能會減少限制，並進一步簡化各種應用程式的開發流程。

[![查看 Kotlin Multiplatform 實際運作情況](see-kmp-in-action.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)