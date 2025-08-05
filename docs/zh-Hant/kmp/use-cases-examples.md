[//]: # (title: Kotlin 與 Compose Multiplatform 在實際生產中的應用：真實案例)

<web-summary>探索 Kotlin Multiplatform 與 Compose Multiplatform 如何在真實世界的專案中用於實際生產。探索實用案例並附有範例。</web-summary>

> 隨著全球各地大大小小的公司紛紛採用 Kotlin Multiplatform (KMP) 與 Compose Multiplatform，這項技術已成為建置及擴展現代跨平台應用程式的可信賴解決方案。
>
{style="note"}

從整合到現有應用程式、共享應用程式邏輯，到建置新的跨平台應用程式，[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) 已成為許多公司的首選技術。這些團隊正利用 KMP 提供的優勢，更快地推出產品並降低開發成本。

越來越多的企業也正在採用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)，這是一個由 Kotlin Multiplatform 和 Google 的 Jetpack Compose 驅動的宣告式 UI 框架。隨著 [iOS 穩定發布版](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)的推出，Compose Multiplatform 完善了整個方案，使 KMP 成為跨平台行動開發的完整解決方案。

隨著採用率的增長，本文將探討 Kotlin Multiplatform 如何在不同產業和團隊結構的實際生產中使用。

## 依企業和團隊類型劃分的 Kotlin Multiplatform 使用案例

以下是不同團隊應用 Kotlin Multiplatform 以滿足各種專案需求的幾種方式：

### 啟動全新綠地專案的新創公司

新創公司通常資源有限且時間緊迫。為了最大化開發效率和成本效益，他們受益於使用共享程式碼庫針對多個平台，尤其是在上市時間至關重要的早期產品或 MVP 中。

對於希望同時共享邏輯和 UI 的公司而言，Kotlin Multiplatform 與 Compose Multiplatform 提供了一個理想的解決方案。您可以從共享 UI 開始，實現快速原型開發。您甚至可以將原生 UI 與共享 UI 混合搭配。這使得 KMP 與 Compose Multiplatform 成為綠地專案的理想選擇，有助於新創公司平衡速度、靈活性和高品質的原生體驗。

**案例研究：**

*   [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 將其 Android 應用程式邏輯和 UI 遷移到 Kotlin Multiplatform 與 Compose Multiplatform。透過有效利用其 Android 程式碼庫，該公司得以在短時間內發布其 iOS 應用程式。
*   [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) 開發了一款習慣追蹤和生產力應用程式。其 iOS 應用程式使用 Compose Multiplatform 建置，並與 Android 共享 96% 的程式碼。

> 如果您正在 [Kotlin Multiplatform 和 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) 之間進行選擇，請不要錯過我們對這兩種技術的概述。
>
{style="tip"}

### 中小型企業

中小型企業通常團隊精簡，同時維護成熟、功能豐富的產品。Kotlin Multiplatform 允許他們共享核心邏輯，同時保持使用者期望的原生外觀和操作體驗。透過依賴現有程式碼庫，這些團隊可以在不影響使用者體驗的情況下加速開發。

KMP 也支援一種靈活的方法，可以逐步引入跨平台功能。這使得它對於演進現有應用程式或推出新功能的團隊特別有效，有助於縮短開發時間、降低開銷，並在需要時維護平台特定客製化。

**案例研究：**

*   [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..) 為其應用程式採用「最大限度共享 Kotlin」策略，該應用程式為行動裝置帶來了類似工作室的瑜伽體驗。該公司透過 Kotlin Multiplatform 在客戶端和伺服器之間共享各種輔助工具，以及大部分客戶端程式碼。該團隊透過保持僅限原生的視圖，顯著提升了應用程式的開發速度。
*   [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) 在其屢獲殊榮的待辦事項應用程式 Todoist 中利用了 Kotlin Multiplatform。該團隊在 Android 和 iOS 之間共享關鍵邏輯，以確保行為一致性並簡化開發流程。它從內部函式庫開始，逐步採用 KMP。

### 應用程式需要跨裝置一致行為的企業

大型應用程式通常擁有龐大的程式碼庫，不斷添加新功能，並具有必須在所有平台上一致運作的複雜業務邏輯。Kotlin Multiplatform 提供逐步整合功能，允許團隊逐步採用。而且，由於開發人員可以重複利用現有的 Kotlin 技能，使用 KMP 也避免了他們引入新的技術堆疊。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc)、[Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw)、[Wonder App by Baidu](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![向 KMP 成功案例學習](kmp-success-stories.svg){width="700"}{style="block"}](case-studies.topic)

### 代理商

由於服務多元客戶，代理商和顧問公司必須適應各種平台要求和業務目標。透過 Kotlin Multiplatform 重複使用程式碼的能力，對於在緊迫的時程和有限的工程團隊下管理多個專案的團隊來說，特別有價值。透過採用 KMP，代理商可以加速交付並維持應用程式在各平台的一致行為。

**案例研究：**

*   [IceRock](https://icerockdev.com/) 是一家外包公司，它使用 Kotlin Multiplatform 為其客戶開發應用程式。其應用程式組合涵蓋了各種業務需求，並輔以大量的開源 Kotlin Multiplatform 函式庫，這些函式庫提升了 Kotlin Multiplatform 開發流程。
*   [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/) 是一個端到端數位產品團隊，它使用 Kotlin Multiplatform 在網路、iOS、tvOS、Android 和 Amazon Fire TV 上執行相同的業務邏輯。KMP 允許其簡化開發流程，同時仍能充分利用每個平台。

### 拓展新市場的公司

有些公司希望透過在之前未曾針對的平台上推出其應用程式來進入新市場，例如從僅限 iOS 轉向包含 Android 或反之亦然。

KMP 幫助您利用現有的 iOS 程式碼和開發實踐，同時在 Android 上保持原生效能和 UI 靈活性。如果您想維持平台特定使用者體驗並利用現有知識和程式碼，KMP 可能會是理想的長期解決方案。

**案例研究：** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 使用 Kotlin Multiplatform 與 Compose Multiplatform 遷移其 Android 應用程式邏輯和 UI。這使得該公司能夠透過重複利用其大部分現有 Android 程式碼庫，快速進入 iOS 市場。

### 開發軟體開發套件 (SDK) 的團隊

共享的 Kotlin 程式碼會編譯成平台特定的二進位檔（Android 為 JVM，iOS 為原生），並無縫整合到任何專案中。它提供了靈活性，讓您可以無限制地使用平台特定 API，同時還可以在原生和跨平台 UI 之間進行選擇。這些功能使 Kotlin Multiplatform 成為開發行動 SDK 的絕佳選擇。從消費者的角度來看，您的 Kotlin Multiplatform SDK 將會像任何常規的平台特定依賴項一樣運作，同時仍提供共享程式碼的優勢。

**案例研究：** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) 在其 HealthSuite Digital Platform 行動 SDK 中使用 Kotlin Multiplatform，實現了新功能的更快開發，並增強了 Android 和 iOS 開發人員之間的協作。

## 依產業劃分的 Kotlin Multiplatform 使用案例

Kotlin Multiplatform 的多功能性從其在廣泛產業中的實際生產應用中可見一斑。從金融科技到教育，KMP 與 Compose Multiplatform 已被許多類型的應用程式所採用。以下是一些產業特定範例：

### 金融科技

金融科技應用程式通常涉及複雜的業務邏輯、安全工作流程和嚴格的合規要求，所有這些都必須在所有平台上一致實施。Kotlin Multiplatform 有助於在一個程式碼庫中統一此核心邏輯，降低平台特定不一致的風險。它確保了 iOS 和 Android 之間更快的功能一致性，這對於錢包和支付等應用程式至關重要。

**案例研究：** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app)、[Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development)、[Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### 媒體與出版

媒體和內容驅動型應用程式依賴於快速功能推出、一致的使用者體驗，以及為每個平台客製化 UI 的靈活性。Kotlin Multiplatform 允許團隊共享內容動態和發現區塊的核心邏輯，同時保持對原生 UI 的完全控制。這加速了開發，減少了昂貴的重複工作，並確保了跨平台的一致性。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[Kuaishou](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### 專案管理與生產力

從共享行事曆到即時協作，生產力應用程式需要功能豐富的功能，這些功能必須在所有平台上一致運作。Kotlin Multiplatform 有助於團隊將這種複雜性集中在一個共享程式碼庫中，確保每個裝置上的功能和行為一致。這種靈活性意味著團隊可以更快地發布更新，並維持跨平台的統一使用者體驗。

**案例研究：** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 交通運輸與行動

共乘、外送和行動平台透過在司機、乘客和商家應用程式中共享共同功能，而受益於 Kotlin Multiplatform。諸如即時追蹤、路徑優化或應用程式內聊天等服務的核心邏輯可以只編寫一次，並在 Android 和 iOS 上使用，從而保證所有使用者的一致行為。

**案例研究：** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Feres](case-studies.topic#case-study-feres)

### 教育科技

教育應用程式必須在行動端和網頁端提供無縫且一致的學習體驗，尤其是在支援龐大、分散的使用者群時。透過 Kotlin Multiplatform 集中學習演算法、測驗和其他業務邏輯，教育應用程式在每個裝置上都能提供統一的學習體驗。這種程式碼共享可以顯著提升效能和一致性——例如，Quizlet 將其共享程式碼從 JavaScript 遷移到 Kotlin 後，其 Android 和 iOS 應用程式都看到了顯著的速度提升。

**案例研究：** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL)、[Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform)、[Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..)、[Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db)、[Physics Wallah](case-studies.topic#case-study-physics-wallah)

### 電子商務

建置跨平台購物體驗意味著平衡共享業務邏輯與支付、相機存取和地圖等原生功能。Kotlin Multiplatform 與 Compose Multiplatform 使團隊能夠跨平台共享業務邏輯和 UI，同時在需要時仍可使用平台特定元件。這種混合式方法確保了更快的開發速度、一致的使用者體驗，以及整合關鍵原生功能的靈活性。

**案例研究：** [Balary Market](case-studies.topic#case-study-balary)、[Markaz](case-studies.topic#case-study-markaz)

### 社交網路與社群

在社交平台上，及時的功能交付和一致的互動對於維持社群跨裝置的活躍和連結至關重要。關鍵互動邏輯可能包括訊息傳遞、通知或排程。例如，允許使用者尋找當地群組、活動和事件的 Meetup，已能夠歸功於 KMP 同步發布新功能。

**案例研究：** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 健康與保健

無論是指導瑜伽課程還是跨裝置同步健康數據，健康應用程式都依賴於響應性和可靠的跨平台行為。這些應用程式通常需要共享核心功能，例如運動邏輯和數據處理，同時保持完全原生 UI 以及感測器、通知或健康 API 等平台特定整合。

**案例研究：** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u)、[Fast&amp;Fit](case-studies.topic#case-study-fast-and-fit)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*1ryf8m7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS.MTczNjgwMzA5*_ga_9J976DJZ68*czE3NTEyNzEzNzckbzYyJGcxJHQxNzUxMjcxMzgzJGo1NCRsMCRoMA..)

### 郵政服務

雖然這並不是常見的使用案例，但 Kotlin Multiplatform 甚至已被一家擁有 377 年歷史的國家郵政服務採用。挪威的 Posten Bring 使用 KMP 統一了數十個前端和後端系統中複雜的業務邏輯，幫助他們簡化工作流程，並大幅縮短了推出新服務所需的時間——從數月縮短到數天。

**案例研究：** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

這些範例凸顯了 Kotlin Multiplatform 如何能應用於幾乎任何產業或應用程式類型。無論您正在建置金融科技應用程式、行動解決方案、教育平台或其他，Kotlin Multiplatform 都提供了靈活性，讓您可以共享對您的專案有意義的程式碼量，而不犧牲原生體驗。您還可以查看更廣泛的 [KMP 案例研究](case-studies.topic)列表，其中展示了許多其他在實際生產中使用該技術的公司。