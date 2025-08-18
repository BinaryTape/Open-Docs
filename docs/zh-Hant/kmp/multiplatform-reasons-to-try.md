[//]: # (title: 採用 Kotlin Multiplatform 並為您的專案增壓的十大理由)

<web-summary>探索為何您應該在專案中使用 Kotlin Multiplatform 的十大理由。了解企業的實際案例，並開始在您的多平台開發中運用這項技術。</web-summary>

在當今多元的技術環境中，
開發人員面臨著建立能夠跨越多個平台無縫運作的應用程式的挑戰，
同時還需優化開發時間並提升使用者生產力。
Kotlin Multiplatform (KMP) 提供了一種解決方案，讓您能夠為多個平台建立應用程式，
促進程式碼在這些平台之間的重用，同時保留原生程式設計的優勢。

在本文中，我們將探討開發人員為何應該考慮在現有或新專案中使用
Kotlin Multiplatform 的十大理由，以及為何 KMP 持續獲得廣泛關注。

## 為何您應該在專案中嘗試 Kotlin Multiplatform

無論您是尋求效率提升，還是渴望探索新技術，
本文都將解釋 Kotlin Multiplatform 帶來的一些實際好處，
從其簡化開發工作的能力，到其廣泛的平台支援和強大的工具生態系統，
並附有真實企業的案例研究。

* [Kotlin Multiplatform 讓您避免程式碼重複](#1-kotlin-multiplatform-allows-you-to-avoid-code-duplication)
* [Kotlin Multiplatform 支援廣泛的平台列表](#2-kotlin-multiplatform-supports-an-extensive-list-of-platforms)
* [Kotlin 提供簡化的程式碼共享機制](#3-kotlin-provides-simplified-code-sharing-mechanisms)
* [Kotlin Multiplatform 允許靈活的多平台開發](#4-kotlin-multiplatform-allows-for-flexible-multiplatform-development)
* [使用 Kotlin Multiplatform 解決方案，您可以共享 UI 程式碼](#5-with-the-kotlin-multiplatform-solution-you-can-share-ui-code)
* [您可以在現有和新專案中使用 Kotlin Multiplatform](#6-you-can-use-kotlin-multiplatform-in-existing-and-new-projects)
* [使用 Kotlin Multiplatform，您可以逐漸開始共享程式碼](#7-with-kotlin-multiplatform-you-can-start-sharing-your-code-gradually)
* [Kotlin Multiplatform 已被全球公司採用](#8-kotlin-multiplatform-is-already-used-by-global-companies)
* [Kotlin Multiplatform 提供強大的工具支援](#9-kotlin-multiplatform-provides-powerful-tooling-support)
* [Kotlin Multiplatform 擁有龐大且支援度高的社群](#10-kotlin-multiplatform-boasts-a-large-and-supportive-community)

### 1. Kotlin Multiplatform 讓您避免程式碼重複

中國最大的中文搜尋引擎百度，推出了針對年輕受眾的應用程式 _Wonder App_。
他們在傳統應用程式開發中遇到的一些問題如下：

* 應用程式體驗的不一致：Android 應用程式與 iOS 應用程式運作方式不同。
* 驗證業務邏輯的高成本：iOS 和 Android 開發人員使用相同業務邏輯的工作需要獨立檢查，這導致了高成本。
* 高昂的升級和維護成本：重複業務邏輯既複雜又耗時，增加了應用程式的升級和維護成本。

百度團隊決定試驗 Kotlin Multiplatform，首先統一了資料層：
資料模型、RESTful API 請求、JSON 資料解析和快取邏輯。

然後他們決定採用 Model-View-Intent (MVI) 使用者介面模式，
這讓他們能夠利用 Kotlin Multiplatform 統一介面邏輯。
他們也共享了低階資料、處理邏輯和 UI 處理邏輯。

實驗結果非常成功，帶來了以下成果：

* Android 和 iOS 應用程式之間的一致體驗。
* 維護和測試成本的降低。
* 團隊內部生產力的顯著提升。

[![探索真實世界的 Kotlin Multiplatform 使用案例](kmp-use-cases-1.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

### 2. Kotlin Multiplatform 支援廣泛的平台列表

Kotlin Multiplatform 的主要優勢之一是其對各種平台的廣泛支援，
使其成為開發人員的多功能選擇。
這些平台包括 Android、iOS、桌面、網頁 (JavaScript 和 WebAssembly) 和伺服器 (Java Virtual Machine)。

_Quizlet_ 是一個透過測驗輔助學習和練習的流行教育平台，
它作為另一個案例研究，突顯了 Kotlin Multiplatform 的優勢。
該平台每月約有 5000 萬活躍用戶，其中 1000 萬在 Android 上。
該應用程式在 Apple App Store 的教育類別中排名前 10。

Quizlet 團隊試驗了 JavaScript、React Native、C++、Rust 和 Go 等技術，
但面臨各種挑戰，包括效能、穩定性以及跨平台實作上的差異。
最終，他們選擇了針對 Android、iOS 和網頁的 Kotlin Multiplatform。
以下是使用 KMP 如何使 Quizlet 團隊受益：

* 在封送處理物件時提供更多型別安全的 API。
* iOS 上的評分演算法比 JavaScript 快 25%。
* 將 Android 應用程式大小從 18 MB 減少到 10 MB。
* 增強的開發人員體驗。
* 團隊成員 (包括 Android、iOS、後端和網頁開發人員) 對編寫共享程式碼的興趣增加。

> [探索 Kotlin Multiplatform 提供的全部功能](https://www.jetbrains.com/kotlin-multiplatform/)
>
{style="tip"}

### 3. Kotlin 提供簡化的程式碼共享機制

在程式語言的世界中，Kotlin 以其實用主義方法脫穎而出，
這意味著它優先考慮以下特性：

* **可讀性優於簡潔性**。雖然簡潔的程式碼很吸引人，但 Kotlin 明白清晰度至關重要。
  其目標不僅是縮短程式碼，而是消除不必要的樣板程式碼，這能增強可讀性和可維護性。

* **程式碼重用優於純粹的表達性**。這不僅是關於解決許多問題，更是關於識別
  模式並建立可重用的函式庫。透過利用現有解決方案和提取共性，
  Kotlin 使開發人員能夠最大限度地提高程式碼的效率。

* **互通性優於原創性**。Kotlin 不會重新發明輪子，
  而是擁抱與 Java 等既有語言的相容性。
  這種互通性不僅允許與龐大的 Java 生態系統無縫整合，還促進了
  經證實的最佳實踐和從過往經驗中學到的教訓的採用。

* **安全性與工具支援優於健全性**。Kotlin 使開發人員能夠及早捕捉錯誤，
  確保您的程式不會進入無效狀態。
  透過在編譯期間或在 IDE 中編寫程式碼時檢測問題，
  Kotlin 增強了軟體可靠性，最大限度地降低了執行時錯誤的風險。

我們每年都會進行 Kotlin 調查，以幫助我們了解使用者對該語言的體驗。
今年，92% 的受訪者表示有正面體驗，比一年前的 86% 顯著增加。

![2023 年和 2024 年 Kotlin 滿意度](kotlin-satisfaction-rate.png){width=700}

主要結論是，Kotlin 強調可讀性、重用性、互通性和安全性，
使其成為開發人員的一個引人注目的選擇，並提高了他們的生產力。

### 4. Kotlin Multiplatform 允許靈活的多平台開發

有了 Kotlin Multiplatform，開發人員不再需要決定是選擇原生還是跨平台開發。
他們可以選擇要共享的內容和要原生編寫的內容。

在 Kotlin Multiplatform 之前，開發人員必須原生編寫所有程式碼。

![在 Kotlin Multiplatform 之前：所有程式碼都原生編寫](before-kotlin-multiplatform.svg){width="700"}

Kotlin Multiplatform 允許開發人員共享業務邏輯、呈現邏輯，甚至 UI 邏輯，
這要歸功於 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)。

![使用 Kotlin Multiplatform 和 Compose Multiplatform：開發人員可以共享業務邏輯、呈現邏輯，甚至 UI 邏輯](with-compose-multiplatform.svg){width="700"}

現在，您可以共享幾乎所有內容，除了特定於平台的程式碼。

### 5. 使用 Kotlin Multiplatform 解決方案，您可以共享 UI 程式碼

JetBrains 提供了 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，這是一個宣告式框架，用於在多個平台之間共享使用者介面，
包括 Android (透過 Jetpack Compose)、iOS、桌面和網頁 (Alpha)，基於 Kotlin 和 Jetpack Compose。

_Instabee_ 是一個專為電子商務企業提供最後一哩物流服務的平台，
他們在技術仍處於 Alpha 階段時，就開始在其 Android 和 iOS 應用程式中使用 Compose Multiplatform，
共享 UI 邏輯。

Compose Multiplatform 還有一個官方範例，名為 [ImageViewer App](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)，
它在 Android、iOS、桌面和網頁上運行，並與地圖和相機等原生元件整合。
還有一個社群範例，是 [New York Times App](https://github.com/xxfast/NYTimes-KMP) 的克隆版，
它甚至可以在適用於手錶的 Wear OS（智慧手錶作業系統）上運行。
查看此 [Kotlin Multiplatform 和 Compose Multiplatform 範例](multiplatform-samples.md)列表以查看更多範例。

[![探索 Compose Multiplatform](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

### 6. 您可以在現有和新專案中使用 Kotlin Multiplatform

讓我們看看以下兩種情境：

* **在現有專案中使用 KMP**

  再次以百度旗下的 Wonder App 為例。
  該團隊已經擁有 Android 和 iOS 應用程式，他們只是統一了邏輯。
  他們開始逐漸統一更多函式庫和邏輯，最終實現了跨平台共享的統一程式碼庫。

* **在新專案中使用 KMP**

  _9GAG_ 是一個線上平台和社群媒體網站，他們嘗試了 Flutter 和 React Native 等不同技術，
  但最終選擇了 Kotlin Multiplatform，這使他們能夠使應用程式在兩個平台上的行為保持一致。
  他們首先建立了 Android 應用程式。然後，他們將 Kotlin Multiplatform 專案作為 iOS 上的依賴項使用。

### 7. 使用 Kotlin Multiplatform，您可以逐漸開始共享程式碼

您可以逐步開始，從常數等簡單元素入手，並逐漸遷移像電子郵件驗證這樣的通用工具程式。
您也可以編寫或遷移您的業務邏輯，例如交易流程或使用者驗證。

在 JetBrains，我們經常進行 Kotlin Multiplatform 調查，並詢問我們的社群他們在不同平台之間共享哪些程式碼部分。
這些調查顯示，資料模型、資料序列化、網路連線、分析
和內部工具程式是這項技術產生重大影響的關鍵領域。

![使用者能夠透過 Kotlin Multiplatform 在平台之間共享的程式碼部分：調查結果](parts-of-code-share.png){width="700"}

### 8. Kotlin Multiplatform 已被全球公司採用

KMP 已經被全球許多大型公司使用，包括 Forbes、Philips、Cash App、Meetup、Autodesk，
以及許多其他公司。您可以在[案例研究頁面](case-studies.topic)上閱讀他們的所有故事。

2023 年 11 月，JetBrains 宣布 Kotlin Multiplatform 現已 [穩定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，
吸引了更多公司和團隊對這項技術的興趣。

### 9. Kotlin Multiplatform 提供強大的工具支援

當您使用 Kotlin Multiplatform 專案時，強大的工具支援觸手可及。

* **Android Studio**。這個整合式開發環境 (IDE) 建立在 IntelliJ Community Edition
  之上，被廣泛認為是 Android 開發的行業標準。
  Android Studio 提供了一套全面的功能，用於程式碼編寫、偵錯和效能監控。
* **Xcode**。Apple 的 IDE 可用於建立 Kotlin Multiplatform 應用程式的 iOS 部分。
  Xcode 是 iOS 應用程式開發的標準，提供了豐富的工具，用於程式碼編寫、偵錯和配置。
  然而，Xcode 僅適用於 Mac。

### 10. Kotlin Multiplatform 擁有龐大且支援度高的社群

Kotlin 和 Kotlin Multiplatform 擁有一個非常支援度高的社群。以下是您可以找到任何問題答案的一些地方。

* [Kotlinlang Slack 工作區](https://slack-chats.kotlinlang.org/)。
  這個工作區約有 60,000 名成員，並有幾個與跨平台開發相關的頻道，
  例如 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform)、
  [#compose](https://slack-chats.kotlinlang.org/c/compose) 和 [#compose-ios](https://slack-chats.kotlinlang.org/c/compose-ios)。
* [Kotlin X](https://twitter.com/kotlin)。在這裡，您將找到快速的專家見解和最新消息，包括無數多平台技巧。
* [Kotlin YouTube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)。
  我們的 YouTube 頻道提供實用的教學、與專家的直播以及其他適合視覺學習者的優秀教育內容。
* [Kotlin Roundup](https://lp.jetbrains.com/subscribe-to-kotlin-news/)。
  如果您想隨時了解不斷變化的 Kotlin 和 Kotlin Multiplatform 生態系統的最新動態，
  請訂閱我們的定期電子報！

Kotlin Multiplatform 生態系統正在蓬勃發展。它受到全球眾多 Kotlin 開發人員的熱情培育。
以下是顯示每年建立的 Kotlin Multiplatform 函式庫數量的圖表：

![歷年來 Kotlin Multiplatform 函式庫的數量。](kmp-libs-over-years.png){width="700"}

如您所見，2021 年明顯增加，此後函式庫數量不斷增長。

## 為何選擇 Kotlin Multiplatform 而非其他跨平台技術？

在選擇[不同的跨平台解決方案](cross-platform-frameworks.md)時，
權衡其優缺點至關重要。
以下是 Kotlin Multiplatform 可能成為您的正確選擇的關鍵原因細分：

* **出色的工具支援，易於使用**。Kotlin Multiplatform 利用 Kotlin，為開發人員提供了出色的工具支援和易用性。
* **原生程式設計**。很容易原生編寫程式碼。
  多虧了 [expected 和 actual 宣告](multiplatform-expect-actual.md)，
  您可以讓您的多平台應用程式存取特定於平台的 API。
* **出色的跨平台效能**。以 Kotlin 編寫的共享程式碼會編譯成針對不同目標的不同輸出格式：
  Android 的 Java 位元碼和 iOS 的原生二進位檔，確保所有平台上的良好效能。

如果您已經決定嘗試 Kotlin Multiplatform，這裡有一些技巧可以幫助您入門：

* **從小處著手**。從小的共享元件或常數開始，讓團隊熟悉 Kotlin Multiplatform 的工作流程和好處。
* **制定計畫**。制定清晰的實驗計畫，假設預期的結果以及實作和分析的方法。
  定義貢獻共享程式碼的角色，並建立有效分發變更的工作流程。
* **評估並進行回顧**。與您的團隊舉行回顧會議，評估實驗的成功與否，
  並找出任何挑戰或需要改進的領域。
  如果它對您有效，您可能希望擴大範圍並共享更多程式碼。
  如果無效，您需要了解該實驗失敗的原因。

[![親身感受 Kotlin Multiplatform 的強大！立即開始](kmp-get-started-action.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

對於那些希望幫助其團隊開始使用 Kotlin Multiplatform 的人，我們準備了一份包含實用技巧的[詳細指南](multiplatform-introduce-your-team.md)。

如您所見，Kotlin Multiplatform 已經被許多大型公司成功用於建立
高效能的跨平台應用程式，這些應用程式具有原生外觀的 UI，有效重用程式碼，
同時保持原生程式設計的優勢。