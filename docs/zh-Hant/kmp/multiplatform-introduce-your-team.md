[//]: # (title: 如何向團隊介紹多平台行動應用開發)

<web-summary>學習如何向您的團隊介紹多平台行動應用開發，這些六項建議能助您順利高效地採用。</web-summary>

在組織中實施新技術和工具會面臨挑戰。您該如何幫助團隊採用行動應用開發的[多平台方法](cross-platform-mobile-development.md)來最佳化並簡化工作流程？以下是一些建議和最佳實踐，可幫助您有效地向團隊介紹 [Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)，這是一項由 JetBrains 構建的開源技術，它允許開發者在保留原生程式設計優勢的同時，跨平台共享程式碼。

* [從同理心開始](#start-with-empathy)
* [解釋 Kotlin Multiplatform 的運作方式](#explain-how-kotlin-multiplatform-works)
* [使用案例研究展示多平台開發的價值](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
* [透過建立範例專案提供證明](#offer-proof-by-creating-a-sample-project)
* [準備回答團隊關於多平台開發的問題](#prepare-for-questions-about-multiplatform-development-from-your-team)
* [在適應期間支援您的團隊](#support-your-team-during-the-adaptation-period)

## 從同理心開始

軟體開發是團隊合作的遊戲，每個關鍵決策都需要所有團隊成員的批准。整合任何跨平台技術都會顯著影響行動應用程式的開發流程。因此，在您開始將 Kotlin Multiplatform 整合到您的專案中之前，您需要向團隊介紹這項技術，並溫和地引導他們認識到其值得採用。

了解專案中的工作人員是成功整合的第一步。您的主管負責在最短時間內交付最高品質的功能。對他們來說，任何新技術都是一種風險。您的同事也有不同的觀點。他們擁有使用「原生」技術堆疊建構應用程式的經驗。他們知道如何在 IDE 中編寫 UI 和業務邏輯，處理依賴項，測試和偵錯程式碼，並且他們已經熟悉該語言。轉換到不同的生態系統總是不便的，因為這總是意味著離開您的舒適區。

鑑於此，在倡導轉向 Kotlin Multiplatform 時，請準備好面對許多偏見並回答大量問題。在此過程中，切勿忘記團隊的需求。以下的一些建議可能對您準備演講有所幫助。

## 解釋 Kotlin Multiplatform 的運作方式

在此階段，您需要展示使用 Kotlin Multiplatform 可以為您的專案帶來價值，並消除您的團隊可能對跨平台行動應用程式抱持的任何偏見和疑慮。

KMP 自 Alpha 版本發布以來已廣泛用於生產環境。因此，JetBrains 已經能夠收集大量回饋，並在[穩定版](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)中提供更佳的開發體驗。

*   **能夠使用所有 iOS 和 Android 功能** – 每當共用程式碼無法完成某項任務，或者您想要使用特定的原生功能時，您可以使用 [expect/actual](multiplatform-expect-actual.md) 模式來無縫編寫平台專屬程式碼。
*   **無縫效能** – 以 Kotlin 編寫的共用程式碼會針對不同的目標編譯成不同的輸出格式：Android 為 Java 位元組碼，iOS 為原生二進位檔。因此，在平台上執行此程式碼時沒有額外的執行時開銷，效能與[原生應用程式](native-and-cross-platform.md)相當。
*   **與舊版程式碼的相容性** – 無論您的專案有多大，您現有的程式碼都不會妨礙您整合 Kotlin Multiplatform。您可以隨時開始編寫跨平台程式碼，並將其作為常規依賴項連接到您的 iOS 和 Android 應用程式，或者您可以使用已編寫的程式碼並修改它以與 iOS 相容。

能夠解釋一項技術的_運作方式_至關重要，因為沒有人喜歡討論似乎依賴於魔法。如果他們有任何不清楚的地方，人們可能會往最壞的方向想，所以要小心不要犯下認為某事太過明顯而無需解釋的錯誤。相反地，請嘗試在進入下一階段之前解釋所有基本概念。這份關於[多平台程式設計](get-started.topic)的文件可以幫助您系統化您的知識，為這段經歷做準備。

## 使用案例研究展示多平台開發的價值

了解多平台技術的運作方式是必要的，但這還不夠。您的團隊需要看到使用它所帶來的好處，而且您展示這些好處的方式應與您的產品相關。

在此階段，您需要解釋在您的產品中使用 Kotlin Multiplatform 的主要好處。一種方法是分享其他已經從跨平台行動應用開發中受益的公司的故事。這些團隊的成功經驗，尤其是那些具有相似產品目標的團隊，可能成為最終決策的關鍵因素。

引用已在生產環境中使用 Kotlin Multiplatform 的不同公司的案例研究，可以顯著幫助您提出有說服力的論點：

*   **McDonald's** – 麥當勞透過為全球行動應用程式利用 Kotlin Multiplatform，建立了一個可以在不同平台之間共用的程式碼庫，消除了程式碼冗餘的需求。
*   **Netflix** – 藉助 Kotlin Multiplatform，Netflix 優化了產品的可靠性和交付速度，這對於滿足客戶需求至關重要。
*   **Forbes** – 透過在 iOS 和 Android 之間共用超過 80% 的邏輯，Forbes 現在可以同時在兩個平台上推出新功能，同時保留了平台專屬客製化的靈活性。
*   **9GAG** – 在嘗試了 Flutter 和 React Native 之後，9GAG 逐漸採用了 Kotlin Multiplatform，這現在幫助他們更快地交付功能，同時為其使用者提供一致的體驗。

[![從 Kotlin Multiplatform 成功案例中學習](kmp-success-stories.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

## 透過建立範例專案提供證明

理論雖好，但最終付諸實踐才是最重要的。作為使您的論點更具說服力並展示多平台行動應用開發潛力的一種選擇，您可以投入一些時間使用 Kotlin Multiplatform 建立一些東西，然後將成果帶給您的團隊討論。您的原型可以是某種測試專案，您將從頭開始編寫，並展示應用程式中需要的功能。
[使用 Ktor 和 SQLDelight 建立多平台應用程式 – 教學課程](multiplatform-ktor-sqldelight.md)能很好地指導您完成這個過程。

您可以透過試驗您目前的專案來產生更多相關範例。
您可以將一個現有的 Kotlin 實作功能轉換為跨平台，
甚至可以在現有專案中建立一個新的 Multiplatform Module，
從待辦事項清單中取一個非優先級功能，並在共用模組中實作它。
[讓您的 Android 應用程式在 iOS 上運作 – 教學課程](multiplatform-integrate-in-existing-app.md)提供了一個基於範例專案的逐步指南。

## 準備回答團隊關於多平台開發的問題

無論您的演講多麼詳細，您的團隊都會有很多問題。請仔細聆聽並耐心回答所有問題。您可能會預期大部分問題來自 iOS 團隊，因為他們是不習慣在日常開發工作中看到 Kotlin 的開發者。以下列出了一些最常見的問題，可能對您有所幫助：

### Q: 我聽說基於跨平台技術的應用程式可能會被 App Store 拒絕。冒這個風險值得嗎？

A: Apple Store 對於發布應用程式有嚴格的指南。其中一項限制是應用程式不得下載、安裝或執行引入或更改應用程式任何特性或功能的程式碼（[App Store 審核指南 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)）。這對於某些跨平台技術是相關的，但對於 Kotlin Multiplatform 則不然。共用的 Kotlin 程式碼透過 Kotlin/Native 編譯為原生二進位檔，將常規的 iOS 框架捆綁到您的應用程式中，並且不提供動態程式碼執行的能力。

### Q: 多平台專案使用 Gradle 建置，而 Gradle 的學習曲線極其陡峭。這是否意味著我現在需要花費大量時間來配置我的專案？ {id="gradle-time-spent"}

A: 實際上沒有這個必要。組織圍繞建構 Kotlin 行動應用程式的工作流程有多種方式。首先，只有 Android 開發者可以負責建置，在這種情況下，iOS 團隊只負責編寫程式碼，甚至只消耗產生的構件。您也可以組織一些研討會或練習結對程式設計，處理需要使用 Gradle 的任務，這將提高團隊的 Gradle 技能。您可以探索組織多平台專案團隊合作的不同方式，並選擇最適合您團隊的方式。

當只有團隊的 Android 部分處理共用程式碼時，iOS 開發者甚至不需要學習 Kotlin。但是，當您準備好讓您的團隊進入下一階段，即每個人都為共用程式碼貢獻時，轉換不會花費太多時間。Swift 和 Kotlin 在語法和功能上的相似之處大大減少了學習如何讀寫共用 Kotlin 程式碼所需的工作量。[透過 Kotlin Koans 親自嘗試](https://play.kotlinlang.org/koans/overview)，這是一系列練習，可幫助您熟悉 Kotlin 語法和一些慣用語。

2023 年底，JetBrains 推出了 [Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/)，這是一款新的實驗性專案配置工具，專注於易用性、入門和 IDE 支援。要深入了解 Amper 的功能，請參閱其[教學課程](amper.md)。

### Q: Kotlin Multiplatform 是否已準備好用於生產環境？

A: 2023 年 11 月，我們宣布 Kotlin Multiplatform 現已[穩定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，這意味著它現在已完全準備好供您在生產環境中使用。

### Q: 沒有足夠的多平台函式庫來實作我的應用程式業務邏輯，而且找到原生替代方案要容易得多。為什麼我應該選擇 Kotlin Multiplatform？ {id="not-enough-libraries"}

A: Kotlin Multiplatform 生態系統正在蓬勃發展，並由全球眾多 Kotlin 開發者共同培育。看看多年來 KMP 函式庫的數量增長速度就知道了。

![多年來 Kotlin Multiplatform 函式庫的數量](kmp-libraries-over-years.png){width=700}

對於 Kotlin Multiplatform 開源社群中的 iOS 開發者來說，這也是一個大好時機，因為 iOS 經驗需求量大，並且有許多機會獲得對 iOS 專屬貢獻的認可。

您的團隊對多平台行動應用開發鑽研得越深，他們的問題就會越有趣和複雜。如果您沒有答案也不用擔心——Kotlin Multiplatform 在 Kotlin Slack 中有一個龐大且支援的社群，其中有一個專門的 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) 頻道，許多已經使用它的開發者可以幫助您。如果您能[與我們分享](mailto:kotlin.multiplatform.feedback@kotlinlang.org)您的團隊所提出最受歡迎的問題，我們將非常感激。這些資訊將幫助我們了解文件需要涵蓋哪些主題。

## 在適應期間支援您的團隊

在您決定使用 Kotlin Multiplatform 之後，您的團隊在試驗這項技術時會有一段適應期。而您的任務尚未結束！透過為您的隊友提供持續支援，您將縮短團隊深入了解技術並取得初步成果所需的時間。

以下是一些在此階段您可以如何支援團隊的提示：

*   將您在上一階段被問到的問題收集到一個「Kotlin Multiplatform：常見問題」Wiki 頁面上，並與您的團隊分享。
*   建立一個 _#kotlin-multiplatform-support_ Slack 頻道，並成為其中最活躍的使用者。
*   組織一個非正式的團隊建立活動，準備爆米花和披薩，一起觀看關於 Kotlin Multiplatform 的教育性或勵志影片。以下是一些不錯的影片選擇：
    *   [KMP 入門：使用共用邏輯和原生 UI 建構 iOS 和 Android 應用程式](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu)
    *   [使用 Compose Multiplatform 建構適用於 iOS、Android 和桌面的應用程式](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97)
    *   [使用 Kotlin Multiplatform 進行 iOS 開發：提示與技巧](https://www.youtube.com/watch?v=eFzy1BRtHps)
    *   [Kevin Galligan 談為團隊使用 Kotlin Multiplatform](https://www.youtube.com/watch?v=-tJvCOfJesk)

現實是，您可能無法在一兩天甚至一週內改變人們的心思。但耐心和對同事需求的細心關注無疑會帶來成果。

JetBrains 團隊期待聽到您[關於 Kotlin Multiplatform 體驗的故事](mailto:kotlin.multiplatform.feedback@kotlinlang.org)。

_我們要感謝 [Touchlab 團隊](https://touchlab.co)協助撰寫本文。_