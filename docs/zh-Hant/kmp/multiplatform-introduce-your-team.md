[//]: # (title: 如何將跨平台行動開發引入您的團隊)

<web-summary>瞭解如何將跨平台行動應用程式開發引入您的團隊，並參考這六項建議，以實現順暢高效的採用。</web-summary>

在組織中實施新技術和工具會面臨挑戰。您如何幫助您的團隊採用[跨平台行動應用程式開發](cross-platform-mobile-development.md)方法，以優化和簡化您的工作流程？以下是一些建議和最佳實踐，可幫助您有效地向團隊介紹 [Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)，這是一項由 JetBrains 建立的開源技術，它允許開發人員跨平台共用程式碼，同時保留原生程式設計的優勢。

* [從同理心開始](#start-with-empathy)
* [解釋 Kotlin Multiplatform 如何運作](#explain-how-kotlin-multiplatform-works)
* [使用案例研究來證明跨平台開發的價值](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
* [透過建立範例專案提供證明](#offer-proof-by-creating-a-sample-project)
* [準備好應對團隊關於跨平台開發的提問](#prepare-for-questions-about-multiplatform-development-from-your-team)
* [在適應期間支援您的團隊](#support-your-team-during-the-adaptation-period)

## 從同理心開始

軟體開發是一場團隊合作，每個關鍵決策都需要所有團隊成員的批准。整合任何跨平台技術都將顯著影響您行動應用程式的開發過程。因此，在您開始將 Kotlin Multiplatform 整合到您的專案中之前，您需要向團隊介紹這項技術，並溫和地引導他們認識到這項技術值得採用。

瞭解在您的專案中工作的人員是成功整合的第一步。您的老闆負責在最短的時間內交付最優質的功能。對他們來說，任何新技術都是一種風險。您的同事們也有不同的看法。他們有使用「原生」技術堆疊建置應用程式的經驗。他們知道如何在 IDE 中編寫 UI 和業務邏輯、處理相依性、測試和偵錯程式碼，並且他們已經熟悉該語言。轉換到不同的生態系統總是不方便的，因為這總是意味著離開您的舒適圈。

鑑於以上種種，在提倡轉向 Kotlin Multiplatform 時，請準備好面對大量的偏見並回答許多問題。在您這樣做的同時，永遠不要忘記您的團隊需要什麼。下面的一些建議可能對您準備推銷有所幫助。

## 解釋 Kotlin Multiplatform 如何運作

在這個階段，您需要展示使用 Kotlin Multiplatform 如何為您的專案帶來價值，並消除您的團隊可能對跨平台行動應用程式持有的任何偏見和疑慮。

KMP 自 Alpha 發布以來已廣泛用於實際生產環境中。因此，JetBrains 能夠收集大量回饋，並在[穩定版本](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)中提供更好的開發體驗。

*   **能夠使用所有 iOS 和 Android 功能** – 無論何時共享程式碼無法完成任務，或者您想要使用特定的原生功能時，您都可以使用 [expect/actual](multiplatform-expect-actual.md) 模式來無縫編寫平台特定程式碼。
*   **流暢的效能** – 使用 Kotlin 編寫的共用程式碼會針對不同的目標編譯成不同的輸出格式：Android 的 Java bytecode 和 iOS 的原生二進位檔。因此，在平台上執行此程式碼時沒有額外的執行時期開銷，且效能與[原生應用程式](native-and-cross-platform.md)相當。
*   **與舊有程式碼的相容性** – 無論您的專案有多大，您現有的程式碼都不會阻止您整合 Kotlin Multiplatform。您可以隨時開始編寫跨平台程式碼，並將其作為常規相依性連接到您的 iOS 和 Android 應用程式，或者您可以使用您已經編寫的程式碼並修改它以與 iOS 相容。

能夠解釋技術「如何」運作至關重要，因為沒有人喜歡討論似乎依賴魔法。如果任何事情對他們來說不清楚，人們可能會想到最壞的情況，因此請務必小心，不要犯錯認為有些事情太明顯而無需解釋。相反，請嘗試在進入下一個階段之前解釋所有基本概念。這份關於[跨平台程式設計](get-started.topic)的文件可以幫助您系統化您的知識，為此體驗做好準備。

## 使用案例研究來證明跨平台開發的價值

瞭解跨平台技術如何運作是必要的，但還不夠。您的團隊需要看到使用它的好處，而您呈現這些好處的方式應該與您的產品相關。

在這個階段，您需要解釋在您的產品中使用 Kotlin Multiplatform 的主要好處。一種方法是分享其他公司已經從跨平台行動開發中受益的故事。這些團隊的成功經驗，特別是那些具有相似產品目標的團隊，可能成為最終決策的關鍵因素。

引用已經在實際生產環境中使用 Kotlin Multiplatform 的不同公司的案例研究，可以顯著幫助您提出令人信服的論點：

*   **McDonald's** – 透過利用 Kotlin Multiplatform 用於全球行動應用程式，McDonald's 建立了一個可以跨平台共用的程式碼庫，消除了程式碼重複的需求。
*   **Netflix** – 在 Kotlin Multiplatform 的幫助下，Netflix 優化了產品可靠性和交付速度，這對於滿足客戶需求至關重要。
*   **Forbes** – 透過在 iOS 和 Android 之間共享超過 80% 的邏輯，Forbes 現在可以在兩個平台上同時推出新功能，同時保留平台特定自訂的靈活性。
*   **9GAG** – 在嘗試了 Flutter 和 React Native 之後，9GAG 逐漸採用了 Kotlin Multiplatform，這現在幫助他們更快地交付功能，同時為其使用者提供一致的體驗。

[![從 Kotlin Multiplatform 成功故事中學習](kmp-success-stories.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

## 透過建立範例專案提供證明

理論很好，但付諸實踐最終最重要。作為一個選項，為了使您的論點更具說服力並展示跨平台行動應用程式開發的潛力，您可以投入一些時間使用 Kotlin Multiplatform 建立一些東西，然後將結果帶給您的團隊討論。您的原型可以是某種測試專案，您將從頭開始編寫，並演示您的應用程式所需的功能。[使用 Ktor 和 SQLDelight 建立跨平台應用程式 – 教程](multiplatform-ktor-sqldelight.md) 可以很好地指導您完成此過程。

您可以透過試驗您目前的專案來產生更多相關範例。您可以將現有的一個用 Kotlin 實作的功能變為跨平台，或者您甚至可以在您現有的專案中建立一個新的 Multiplatform Module，從待辦事項清單的底部取出一個非優先功能，並在共享模組中實作它。[讓您的 Android 應用程式在 iOS 上運作 – 教程](multiplatform-integrate-in-existing-app.md) 根據範例專案提供了逐步指南。

## 準備好應對團隊關於跨平台開發的提問

無論您的推銷多麼詳細，您的團隊都會有很多問題。仔細聆聽並耐心嘗試回答所有問題。您可能會預計大部分問題來自團隊的 iOS 部分，因為他們是那些不習慣在日常開發工作中看到 Kotlin 的開發人員。以下是一些最常見問題的列表，可以幫助您：

### Q: 我聽說基於跨平台技術的應用程式可能會被 App Store 拒絕。冒這個風險值得嗎？

A: Apple Store 對於發布應用程式有嚴格的準則。其中一項限制是應用程式不得下載、安裝或執行會引入或更改應用程式任何特性或功能的程式碼 ([App Store Review Guideline 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements))。這對於某些跨平台技術是相關的，但對於 Kotlin Multiplatform 則不然。共用 Kotlin 程式碼會透過 Kotlin/Native 編譯為原生二進位檔，將常規 iOS 框架捆綁到您的應用程式中，並且不提供動態程式碼執行的能力。

### Q: 跨平台專案是使用 Gradle 建置的，而 Gradle 的學習曲線極其陡峭。這是否意味著我現在需要花費大量時間來配置我的專案？ {id="gradle-time-spent"}

A: 實際上沒有這個必要。有許多方法可以圍繞建置 Kotlin 行動應用程式來組織工作流程。首先，只有 Android 開發人員可以負責建置，在這種情況下，iOS 團隊只會編寫程式碼甚至只會使用產生的構件。您還可以組織一些工作坊或在處理需要使用 Gradle 的任務時練習結對程式設計，這將提高您團隊的 Gradle 技能。您可以探索組織跨平台專案團隊合作的不同方式，並選擇最適合您團隊的方式。

當只有團隊的 Android 部分與共用程式碼協作時，iOS 開發人員甚至不需要學習 Kotlin。但是當您準備好讓您的團隊進入下一個階段，即每個人都為共用程式碼貢獻時，轉換不會花費太多時間。Swift 和 Kotlin 在語法和功能上的相似之處大大減少了學習如何讀寫共用 Kotlin 程式碼所需的工作量。[透過 Kotlin Koans 親自嘗試](https://play.kotlinlang.org/koans/overview)，這是一系列練習，可讓您熟悉 Kotlin 語法和一些慣用語。

在 2023 年底，JetBrains 推出了 [Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/)，這是一款新的實驗性專案配置工具，專注於可用性、新手上路和 IDE 支援。要深入瞭解 Amper 的功能，請參閱其[教程](amper.md)。

### Q: Kotlin Multiplatform 準備好投入生產環境了嗎？

A: 在 2023 年 11 月，我們宣布 Kotlin Multiplatform 現在已[穩定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，這意味著它現在已完全準備好供您在實際生產環境中使用。

### Q: 沒有足夠的跨平台函式庫來實作我的應用程式業務邏輯，而且更容易找到原生替代方案。我為什麼要選擇 Kotlin Multiplatform？ {id="not-enough-libraries"}

A: Kotlin Multiplatform 生態系統正在蓬勃發展，並由全球許多 Kotlin 開發人員共同培養。只需看看多年來 KMP 函式庫的數量增長速度有多快。

![多年來 Kotlin Multiplatform 函式庫的數量](kmp-libraries-over-years.png){width=700}

對於 Kotlin Multiplatform 開源社群中的 iOS 開發人員來說，這也是一個很好的時機，因為對 iOS 經驗的需求量很大，而且有很多機會因對 iOS 的特定貢獻而獲得認可。

您的團隊越深入研究跨平台行動開發，他們的問題就會越有趣和複雜。如果您沒有答案也無需擔心 – Kotlin Multiplatform 在 Kotlin Slack 中擁有龐大且支援的社群，其中有一個專門的 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) 頻道，許多已經使用它的開發人員可以在那裡為您提供幫助。如果您能[與我們分享](mailto:kotlin.multiplatform.feedback@kotlinlang.org)您團隊提出最受歡迎的問題，我們將不勝感激。此資訊將幫助我們瞭解哪些主題需要在文件中涵蓋。

## 在適應期間支援您的團隊

在您決定使用 Kotlin Multiplatform 後，您的團隊將會有一段時間的適應期，因為他們會嘗試這項技術。而您的任務還沒有結束！透過為您的隊友提供持續支援，您將縮短您的團隊深入瞭解這項技術並取得初步成果所需的時間。

以下是一些關於您在此階段如何支援您的團隊的提示：

*   將您在上一階段被問到的問題收集在「Kotlin Multiplatform：常見問題」wiki 頁面上，並與您的團隊分享。
*   建立一個 `_#kotlin-multiplatform-support_` Slack 頻道，並成為那裡最活躍的使用者。
*   組織一個非正式的團隊建設活動，準備爆米花和披薩，一起觀看關於 Kotlin Multiplatform 的教育或啟發性影片。以下是一些不錯的影片選擇：
    *   [Kotlin Multiplatform 入門：使用共用邏輯和原生 UI 建置 iOS 和 Android 應用程式](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu)
    *   [使用 Compose Multiplatform 建置 iOS、Android 和桌面應用程式](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97)
    *   [使用 Kotlin Multiplatform 進行 iOS 開發：秘訣與技巧](https://www.youtube.com/watch?v=eFzy1BRtHps)
    *   [Kevin Galligan 的 Kotlin Multiplatform 團隊實踐](https://www.youtube.com/watch?v=-tJvCOfJesk)

現實是您可能無法在一天甚至一週內改變人們的想法和態度。但耐心和對同事需求的細心無疑會帶來成果。

JetBrains 團隊期待聽到您[關於 Kotlin Multiplatform 經驗的故事](mailto:kotlin.multiplatform.feedback@kotlinlang.org)。

_我們要感謝 [Touchlab 團隊](https://touchlab.co) 為撰寫本文提供的幫助。_