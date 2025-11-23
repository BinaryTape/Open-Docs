# 適用於開發跨平台應用程式的熱門程式語言

<web-summary>探索選擇跨平台開發語言的關鍵考量、流行技術的比較以及真實案例研究。</web-summary>

您可能已經開始注意到「[跨平台開發](cross-platform-mobile-development.md)」這個術語在近來頻繁出現。事實上，在軟體開發的背景下，跨平台程式設計正變得越來越受歡迎。它在行動應用程式領域尤為普遍，但其用途絕不僅限於這類應用程式。隨著企業努力觸及跨多種裝置和作業系統的更廣泛受眾，開發者正轉向多功能語言和框架，以消除平台障礙。

如果您想知道哪種程式語言最能讓您開始進行跨平台開發，這篇概述文章將為您指明方向，提供見解和真實的使用案例。

## 了解跨平台開發

跨平台應用程式開發指的是一種開發方法，其中單一程式碼庫可用於建立可在多個平台（例如 iOS、Android、Windows、macOS 和網頁瀏覽器等）上運行的軟體。由於行動應用程式需求的增長，這種方法在近年來廣受歡迎。行動工程師可以在 iOS 和 Android 之間共享部分或全部原始碼，而無需為每個平台開發單獨的應用程式。

我們有一份專門的指南，您可以在其中了解更多關於[原生和跨平台開發](native-and-cross-platform.md)的優點和限制，以及如何在這兩種方法之間進行選擇。跨平台開發的一些主要優點包括：

1.  **成本效益。** 為每個平台建立單獨的應用程式，無論是時間還是資源，都可能非常昂貴。透過跨平台開發，開發者可以編寫一次程式碼並將其部署到多個平台，從而降低開發成本。

2.  **更快的開發速度。** 這種方法透過讓開發者只需編寫和維護單一程式碼庫，從而加速開發過程。

3.  **高效靈活的程式碼共享。** 現代跨平台技術使開發者能夠在多個平台之間重用程式碼，同時保持原生程式設計的優勢。

4.  **跨平台一致的使用者體驗。** 跨平台開發確保關鍵行為，例如計算或工作流程，在需要時於不同平台上提供相同的結果。這有助於保持一致性，無論使用者是在 iOS、Android 還是其他裝置和作業系統上，都能提供相同的體驗。

在本文中，我們將討論一些最受歡迎的跨平台開發程式語言。

## 流行的跨平台程式語言、框架和技術

本文重點介紹適合跨平台開發的成熟程式語言。雖然有許多為各種目的設計的語言，本節將簡要概述一些最受歡迎的跨平台開發程式語言，以及相關統計數據和支援它們的框架。

<table style="header-row">
    
<tr>
<td>語言</td>
        <td>首次亮相</td>
        <td>最受歡迎的技術 (<a href="https://survey.stackoverflow.co/2024/technology#most-popular-technologies">Stack Overflow, 2024</a>)</td>
        <td>最受歡迎的技術 (<a href="https://www.jetbrains.com/lp/devecosystem-2024/">開發者生態系統報告 2024</a>)</td>
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
        <td>不斷發展的生態系統，由 Google 支援</td>
        <td>Flutter</td>
</tr>

    
<tr>
<td>Kotlin</td>
        <td>2011</td>
        <td>#15 (9.04%)</td>
        <td>#13 (14%)</td>
        <td>不斷擴展的生態系統，對 JetBrains 工具提供一流支援</td>
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
        <td>成熟但第三方函式庫少於其他語言</td>
        <td>Qt</td>
</tr>

</table>

**JavaScript**

JavaScript 是一種廣泛使用的程式語言，讓使用者能在網頁上實現複雜的功能。隨著 React Native 和 Ionic 等框架的推出，它已成為跨平台應用程式開發的熱門選擇。根據 JetBrains 進行的最新[開發者生態系統調查](https://www.jetbrains.com/lp/devecosystem-2024/)，61% 的開發者使用 JavaScript，使其成為最受歡迎的程式語言。

**Dart**

Dart 是一種物件導向、基於類別的程式語言，由 Google 於 2011 年推出。Dart 構成了 Flutter 的基礎，Flutter 是 Google 建立的開源框架，用於從單一程式碼庫建構多平台應用程式。Dart 提供驅動 Flutter 應用程式的語言和執行時。

**Kotlin**

Kotlin 是一種由 JetBrains 開發的現代、成熟的多平台程式語言。根據 [Octoverse 報告](https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages)，它是 2024 年增長速度排名第五的語言。它簡潔、安全、可與 Java 和其他語言互通，並且是 Google 開發 Android 應用程式的首選語言。

[Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/) 是 JetBrains 的一項技術，它允許您為各種平台建立應用程式，並在這些平台間重複使用 Kotlin 程式碼，同時保留原生程式設計的優勢。此外，JetBrains 還提供了 Compose Multiplatform，這是一個基於 KMP 和 Jetpack Compose 的宣告式框架，用於跨多平台共享使用者介面 (UI)。2024 年 5 月，Google 宣布正式[支援 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)，以在 Android 和 iOS 之間共享業務邏輯。

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)

**C#**

C# 是由 Microsoft 開發的一種跨平台通用程式語言。C# 是 .NET Framework 最受歡迎的語言。.NET MAUI 是一個框架，用於從單一 C# 程式碼庫為 Android、iOS、Mac 和 Windows 建構原生跨平台桌面和行動應用程式。

**C++**

C++ 是一種通用程式語言，於 1985 年首次發布，是 C 程式語言的擴展。Qt 是一個跨平台軟體開發框架，包含一組模組化的 C++ 函式庫類別，並提供一系列應用程式介面 (API) 用於應用程式開發。Qt 提供了一個 C++ 類別函式庫，其中包含用於 C++ 開發的應用程式建構區塊。

## 選擇跨平台程式語言的關鍵因素

在當今所有可用的語言、技術和工具中，要選擇正確的語言可能會讓人不知所措，特別是當您剛踏入跨平台開發領域時。各種跨平台技術都有其獨特的優點和缺點，但最終，這一切都取決於您希望建立的軟體的目標和要求。

在為您的專案選擇語言或框架時，您應該牢記幾個重要因素。這些因素包括您的應用程式類型、其效能和使用者體驗 (UX) 要求、相關工具鏈，以及下面詳述的各種其他考量。

**1. 應用程式類型**

不同的程式語言和框架在不同的平台（例如 Windows、macOS、Linux、iOS、Android 和網頁瀏覽器）上獲得更好的支援。某些語言自然更適合特定的平台和專案。

**2. 效能和 UX 要求**

某些類型的應用程式對效能和使用者體驗 (UX) 有特定要求，這些要求可以透過不同的標準來衡量，例如速度、響應能力、記憶體使用情況以及它們對中央處理器 (CPU) 和圖形處理器 (GPU) 的消耗。考量您未來應用程式需要實現的功能以及您對上述標準的期望參數。

> 例如，一個圖形密集型的遊戲應用程式可能會受益於能夠高效利用 GPU 的語言。同時，一個商業應用程式可能會優先考慮資料庫整合和網路通訊的便捷性。
>
{style="tip'}

**3. 現有技能組合和學習曲線**

在為他們的下一個專案選擇技術時，開發團隊應該考量他們先前的經驗。引入新的語言或工具需要時間進行培訓，這有時可能會延遲專案。學習曲線越陡峭，團隊掌握熟練所需的時間就越長。

> 例如，如果您的團隊由精通 JavaScript 的開發者組成，並且您缺乏採用新技術的資源，那麼選擇利用 JavaScript 的框架（如 React Native）可能會更有益。
>
{style="tip'}

**4. 現有使用案例**

另一個重要考量因素是該技術的實際應用。審查成功實施特定跨平台語言或框架的公司的案例研究，可以為這些技術在生產環境中的表現提供寶貴見解。這有助於您評估特定技術是否適合您專案的目標。例如，您可以探索利用 Kotlin Multiplatform 在各種平台上開發可投入生產應用程式的公司的案例研究。

![Kotlin Multiplatform 案例研究](kmp-case-studies.png){width="700"}

[![探索真實世界的 Kotlin Multiplatform 使用案例](kmp-use-cases-1.svg){width="500" style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

**5. 語言生態系統**

另一個重要因素是語言生態系統的成熟度。請注意支援多平台開發的工具和函式庫的可用性和品質。例如，JavaScript 擁有大量的函式庫，這些函式庫支援前端框架 (React、Angular、Vue.js)、後端開發 (Express、NestJS) 以及各種其他功能。

同樣，Flutter 擁有一組龐大且快速增長的函式庫，也稱為套件或外掛程式。儘管 Kotlin Multiplatform 目前的函式庫數量較少，但其生態系統正在迅速發展，並且該語言正在由世界各地的許多 Kotlin 開發者進行增強。以下資訊圖表顯示了 Kotlin Multiplatform 函式庫數量多年來的增長情況。

![Kotlin Multiplatform 多年來函式庫數量](kmp-libs-over-years.png){width="700"}

**6. 流行度和社群支援**

值得密切關注程式語言和相關技術的流行度及社群支援。這不僅僅是使用者和函式庫的數量。請注意該語言的社群，包括其使用者和貢獻者，有多活躍和支持。尋找可用的部落格、播客、論壇和其他資源。

## 跨平台開發的未來

隨著跨平台開發的不斷演進，我們可以期待支援它的工具和語言將帶來更高的效率、效能和靈活性。由於對跨多裝置流暢使用者體驗的需求不斷增長，越來越多的公司正在投資於框架，這些框架允許開發者共享程式碼而不會犧牲原生效能。跨平台技術的未來看起來充滿希望，進步可能會減少限制並進一步簡化各種應用程式的開發過程。

[![查看 Kotlin Multiplatform 的實際應用](see-kmp-in-action.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)