[//]: # (title: 採用 Kotlin Multiplatform 讓你的專案效能飆升的十大理由)

<web-summary>探索在你的專案中使用 Kotlin Multiplatform 的十大理由。參閱來自企業的實際案例，並開始在你的多平台開發中運用這項技術。</web-summary>

在現今多元的技術版圖中，開發者面臨著建立能夠在多種平台上無縫運作，同時最佳化開發時間並提升使用者生產力的應用程式的挑戰。Kotlin Multiplatform (KMP) 提供了一種解決方案，讓你能夠為多個平台建立應用程式，促進跨平台程式碼的重用，同時保留原生程式設計的優勢。

在本文中，我們將探討開發者應考慮在其現有或新專案中使用 Kotlin Multiplatform 的十大理由，以及為何 KMP 持續獲得大量關注。

## 為何你應該在專案中嘗試 Kotlin Multiplatform

無論你是在追求效率提升，還是渴望探索新技術，本文將解釋 Kotlin Multiplatform 帶來的一些實際益處，從其簡化開發工作的能力，到廣泛的平台支援和強大的工具生態系統，並輔以真實企業的案例研究。

* [Kotlin Multiplatform 讓你避免程式碼重複](#1-kotlin-multiplatform-allows-you-to-avoid-code-duplication)
* [Kotlin Multiplatform 支援廣泛的平台列表](#2-kotlin-multiplatform-supports-an-extensive-list-of-platforms)
* [Kotlin 提供簡化的程式碼共用機制](#3-kotlin-provides-simplified-code-sharing-mechanisms)
* [Kotlin Multiplatform 允許靈活的多平台開發](#4-kotlin-multiplatform-allows-for-flexible-multiplatform-development)
* [藉助 Kotlin Multiplatform 解決方案，你可以共用 UI 程式碼](#5-with-the-kotlin-multiplatform-solution-you-can-share-ui-code)
* [你可以在現有和新專案中使用 Kotlin Multiplatform](#6-you-can-use-kotlin-multiplatform-in-existing-and-new-projects)
* [藉助 Kotlin Multiplatform，你可以逐步開始共用你的程式碼](#7-with-kotlin-multiplatform-you-can-start-sharing-your-code-gradually)
* [Kotlin Multiplatform 已被全球公司使用](#8-kotlin-multiplatform-is-already-used-by-global-companies)
* [Kotlin Multiplatform 提供強大的工具支援](#9-kotlin-multiplatform-provides-powerful-tooling-support)
* [Kotlin Multiplatform 擁有龐大且支持活躍的社群](#10-kotlin-multiplatform-boasts-a-large-and-supportive-community)

### 1. Kotlin Multiplatform 讓你避免程式碼重複

百度，最大的中文搜尋引擎，推出了針對年輕受眾的應用程式《Wonder App》。以下是他們在傳統應用程式開發中面臨的一些問題：

* 應用程式體驗不一致：Android 應用程式與 iOS 應用程式運作方式不同。
* 驗證業務邏輯成本高昂：使用相同業務邏輯的 iOS 和 Android 開發者工作需要獨立檢查，導致成本高昂。
* 高昂的升級和維護成本：重複業務邏輯既複雜又耗時，增加了應用程式的升級和維護成本。

百度團隊決定試驗 Kotlin Multiplatform，首先從統一資料層開始：資料模型、RESTful API 請求、JSON 資料解析和快取邏輯。

接著，他們決定採用 Model-View-Intent (MVI) 使用者介面模式，該模式允許你使用 Kotlin Multiplatform 統一介面邏輯。他們還共用了底層資料、處理邏輯和 UI 處理邏輯。

這項實驗結果非常成功，帶來了以下成果：

* Android 和 iOS 應用程式之間提供一致的體驗。
* 降低了維護和測試成本。
* 大幅提升了團隊內部的生產力。

[![探索真實世界的 Kotlin Multiplatform 使用案例](kmp-use-cases-1.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

### 2. Kotlin Multiplatform 支援廣泛的平台列表

Kotlin Multiplatform 的主要優勢之一是它對多種平台的廣泛支援，使其成為開發者的多功能選擇。這些平台包括 Android、iOS、桌面、網頁 (JavaScript 和 WebAssembly) 和伺服器 (Java Virtual Machine)。

《Quizlet》是一個透過測驗輔助學習和練習的流行教育平台，它作為另一個案例研究，突顯了 Kotlin Multiplatform 的優勢。該平台每月約有 5,000 萬活躍使用者，其中 1,000 萬在 Android 上。該應用程式在 Apple App Store 的教育類別中排名前 10 位。

Quizlet 團隊實驗了 JavaScript、React Native、C++、Rust 和 Go 等技術，但面臨了各種挑戰，包括效能、穩定性以及跨平台實作上的差異。最終，他們選擇了針對 Android、iOS 和網頁的 Kotlin Multiplatform。以下是使用 KMP 如何使 Quizlet 團隊受益：

* 編組物件時有更型別安全的 API。
* iOS 上的評分演算法比 JavaScript 快 25%。
* Android 應用程式大小從 18 MB 減少到 10 MB。
* 增強了開發者體驗。
* 團隊成員（包括 Android、iOS、後端和網頁開發者）對編寫共用程式碼的興趣增加。

> [探索 Kotlin Multiplatform 提供的所有功能](https://www.jetbrains.com/kotlin-multiplatform/)
> 
{style="tip"}

### 3. Kotlin 提供簡化的程式碼共用機制

在程式語言的世界中，Kotlin 以其務實的方法脫穎而出，這意味著它優先考慮以下特性：

* **可讀性優於簡潔性**。雖然簡潔的程式碼很吸引人，但 Kotlin 理解清晰度至關重要。目標不僅是縮短程式碼，更是要消除不必要的樣板程式碼，從而提高可讀性和可維護性。

* **程式碼重用優於純粹的表達性**。這不僅僅是解決許多問題，而是關於識別模式並建立可重用的函式庫。透過利用現有解決方案並提取共同點，Kotlin 使開發者能夠最大限度地提高程式碼效率。

* **互通性優於原創性**。Kotlin 不會重新發明輪子，而是擁抱與 Java 等既有語言的相容性。這種互通性不僅允許與龐大的 Java 生態系統無縫整合，還有助於採用經過驗證的實踐和從過往經驗中學到的教訓。

* **安全性與工具優於嚴謹性**。Kotlin 使開發者能夠及早發現錯誤，確保你的程式不會陷入無效狀態。透過在編譯期間或在 IDE 中編寫程式碼時偵測問題，Kotlin 增強了軟體可靠性，最大限度地降低了執行時錯誤的風險。

我們每年都會進行 Kotlin 調查，以幫助我們了解使用者對該語言的體驗。今年，92% 的受訪者表示擁有正面的體驗，比一年前的 86% 有顯著提升。

![2023 年和 2024 年的 Kotlin 滿意度](kotlin-satisfaction-rate.png){width=700}

關鍵的啟示是，Kotlin 對可讀性、重用性、互通性和安全性的重視，使其成為開發者的引人注目的選擇，並提升了他們的生產力。

### 4. Kotlin Multiplatform 允許靈活的多平台開發

使用 Kotlin Multiplatform，開發者不再需要在原生開發和跨平台開發之間做選擇。他們可以決定共用什麼以及原生編寫什麼。

在 Kotlin Multiplatform 之前，開發者必須原生編寫所有內容。

![Kotlin Multiplatform 之前：原生編寫所有程式碼](before-kotlin-multiplatform.svg){width=700}

藉助 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，Kotlin Multiplatform 允許開發者共用業務邏輯、展示邏輯，甚至 UI 邏輯。

![使用 Kotlin Multiplatform 和 Compose Multiplatform：開發者可以共用業務邏輯、展示邏輯，甚至 UI 邏輯](with-compose-multiplatform.svg){width="700"}

現在，你幾乎可以共用任何東西，除了平台特定的程式碼。

### 5. 藉助 Kotlin Multiplatform 解決方案，你可以共用 UI 程式碼

JetBrains 提供了 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，這是一個基於 Kotlin 和 Jetpack Compose 的宣告式框架，用於在多個平台（包括 Android (透過 Jetpack Compose)、iOS、桌面和網頁 (Alpha)）上共用使用者介面。

《Instabee》是一個專為電子商務企業設計的「最後一哩」物流平台，即使該技術仍處於 Alpha 階段，他們也開始在其 Android 和 iOS 應用程式中使用 Compose Multiplatform，共用 UI 邏輯。

有一個 Compose Multiplatform 的官方範例，名為 [ImageViewer App](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)，它可以在 Android、iOS、桌面和網頁上運行，並與地圖和相機等原生元件整合。還有一個社群範例，即 [New York Times App](https://github.com/xxfast/NYTimes-KMP) 的複製專案，它甚至可以在手錶的 Wear OS（智慧手錶作業系統）上運行。查看這個 [Kotlin Multiplatform 和 Compose Multiplatform 範例](multiplatform-samples.md) 列表以查看更多範例。

[![探索 Compose Multiplatform](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

### 6. 你可以在現有和新專案中使用 Kotlin Multiplatform

讓我們看看以下兩種情境：

* **在現有專案中使用 KMP**

  百度提供的 Wonder App 再次成為一個範例。該團隊已經擁有 Android 和 iOS 應用程式，他們只是統一了邏輯。他們開始逐步統一更多函式庫和更多邏輯，然後實現了跨平台共用的統一程式碼庫。

* **在新專案中使用 KMP**

  《9GAG》這個線上平台和社群媒體網站，嘗試了 Flutter 和 React Native 等不同技術，但最終選擇了 Kotlin Multiplatform，這使他們能夠在其應用程式在兩個平台上的行為保持一致。他們首先建立了 Android 應用程式。然後，他們將 Kotlin Multiplatform 專案作為 iOS 上的依賴項來使用。

### 7. 藉助 Kotlin Multiplatform，你可以逐步開始共用你的程式碼

你可以逐步開始，從常數等簡單元素開始，然後逐步遷移電子郵件驗證等通用公用程式。你也可以編寫或遷移你的業務邏輯，例如交易流程或使用者身份驗證。

在 JetBrains，我們經常進行 Kotlin Multiplatform 調查，並詢問社群他們在不同平台之間共用哪些部分的程式碼。這些調查顯示，資料模型、資料序列化、網路、分析和內部公用程式是這項技術產生重大影響的關鍵領域之一。

![使用者能夠透過 Kotlin Multiplatform 在平台之間共用的程式碼部分：調查結果](parts-of-code-share.png){width=700}

### 8. Kotlin Multiplatform 已被全球公司使用

KMP 已經被全球許多大型公司使用，包括 Forbes、Philips、Cash App、Meetup、Autodesk 等等。你可以在 [案例研究頁面](case-studies.topic) 閱讀他們所有的故事。

2023 年 11 月，JetBrains 宣布 Kotlin Multiplatform 現已 [穩定版](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，吸引了更多公司和團隊對這項技術的興趣。

### 9. Kotlin Multiplatform 提供強大的工具支援

當處理 Kotlin Multiplatform 專案時，你擁有觸手可及的強大工具。

* **Android Studio**。這個整合開發環境 (IDE) 建立在 IntelliJ Community Edition 之上，被廣泛認為是 Android 開發的業界標準。Android Studio 提供了一套全面的功能，用於程式碼編寫、偵錯和效能監控。
* **Xcode**。Apple 的 IDE 可用於建立 Kotlin Multiplatform 應用程式的 iOS 部分。Xcode 是 iOS 應用程式開發的標準，提供了豐富的工具，用於程式碼編寫、偵錯和配置。然而，Xcode 僅限於 Mac。

### 10. Kotlin Multiplatform 擁有龐大且支持活躍的社群

Kotlin 和 Kotlin Multiplatform 擁有一個非常支持活躍的社群。以下是一些你可以找到任何問題答案的地方。

* [Kotlinlang Slack 工作區](https://slack-chats.kotlinlang.org/)。此工作區約有 6 萬名成員，並有幾個與跨平台開發相關的頻道，例如 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform)、[#compose](https://slack-chats.kotlinlang.org/c/compose) 和 [#compose-ios](https://slack-chats.kotlinlang.org/c/compose-ios)。
* [Kotlin X](https://twitter.com/kotlin)。在這裡，你會找到快速的專家見解和最新消息，包括無數的多平台提示。
* [Kotlin YouTube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)。我們的 YouTube 頻道提供實用的教學課程、與專家的直播，以及其他適合視覺學習者的優質教育內容。
* [Kotlin Roundup](https://lp.jetbrains.com/subscribe-to-kotlin-news/)。如果你想隨時掌握不斷變化的 Kotlin 和 Kotlin Multiplatform 生態系統的最新動態，請訂閱我們的定期電子報！

Kotlin Multiplatform 生態系統正在蓬勃發展。它受到全球眾多 Kotlin 開發者的熱情培育。以下是顯示每年建立的 Kotlin Multiplatform 函式庫數量的圖表：

![多年來 Kotlin Multiplatform 函式庫的數量。](kmp-libs-over-years.png){width="700"}

如你所見，2021 年明顯出現了上升趨勢，自那以後函式庫數量持續增長。

## 為何選擇 Kotlin Multiplatform 而非其他跨平台技術？

在 [不同的跨平台解決方案](cross-platform-frameworks.md) 之間做出選擇時，權衡其優缺點至關重要。以下是 Kotlin Multiplatform 可能成為你正確選擇的關鍵原因細分：

* **出色的工具，易於使用**。Kotlin Multiplatform 利用 Kotlin，為開發者提供了出色的工具和易用性。
* **原生程式設計**。很容易原生編寫內容。藉助 [預期和實際聲明](multiplatform-expect-actual.md)，你可以使你的多平台應用程式能夠存取平台特定的 API。
* **出色的跨平台效能**。用 Kotlin 編寫的共用程式碼會針對不同的目標編譯成不同的輸出格式：Android 的 Java 位元組碼和 iOS 的原生二進位檔，確保所有平台都具有良好的效能。

如果你已經決定嘗試 Kotlin Multiplatform，以下是一些幫助你入門的提示：

* **從小處著手**。從小的共用元件或常數開始，讓團隊熟悉 Kotlin Multiplatform 的工作流程和優勢。
* **制定計畫**。制定清晰的實驗計畫，假設預期的結果以及實作和分析的方法。定義對共用程式碼做出貢獻的角色，並建立有效分發變更的工作流程。
* **評估並舉行回顧會議**。與你的團隊舉行回顧會議，評估實驗的成功與否，並找出任何挑戰或需要改進的領域。如果它對你有效，你可能希望擴大範圍並共用更多程式碼。如果沒有，你需要了解這次實驗沒有成功的原因。

[![立即行動，親身體驗 Kotlin Multiplatform！現在開始](kmp-get-started-action.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

對於那些想要幫助其團隊開始使用 Kotlin Multiplatform 的人，我們準備了一份包含實用提示的 [詳細指南](multiplatform-introduce-your-team.md)。

如你所見，Kotlin Multiplatform 已經被許多大型公司成功用於建立具有原生外觀 UI 的高效能跨平台應用程式，在它們之間有效重用程式碼，同時保留了原生程式設計的優勢。