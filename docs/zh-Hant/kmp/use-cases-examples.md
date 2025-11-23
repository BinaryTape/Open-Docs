[//]: # (title: Kotlin 和 Compose Multiplatform 的實際應用：真實世界案例)

<web-summary>探索 Kotlin Multiplatform 搭配 Compose Multiplatform 如何在真實世界的專案中用於生產環境。探索實用的使用案例及範例。</web-summary>

> 隨著全球大大小小的公司採用 Kotlin Multiplatform (KMP) 搭配 Compose Multiplatform，這項技術已成為建構和擴展現代化跨平台應用程式的可靠解決方案。
> 
{style="note"}

從整合現有應用程式和共享應用程式邏輯，到建構全新的跨平台應用程式，[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) 已成為許多公司的首選技術。這些團隊正利用 KMP 所提供的優勢，更快地推出產品並降低開發成本。

越來越多的企業也採用了 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)，這是一個由 Kotlin Multiplatform 和 Google 的 Jetpack Compose 驅動的宣告式 UI 框架。隨著 [iOS 穩定版本](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)的發布，Compose Multiplatform 完善了整個圖景，使 KMP 成為跨平台行動開發的完整解決方案。

隨著採用率的增長，本文探討了 Kotlin Multiplatform 如何在不同產業和團隊結構中實際用於生產環境。

## Kotlin Multiplatform 的使用案例：按業務和團隊類型劃分

以下是不同團隊應用 Kotlin Multiplatform 以滿足各種專案需求的幾種方式：

### 新創公司啟動全新綠地專案

新創公司通常在資源有限和時間緊迫的情況下運作。為了最大限度地提高開發效率和成本效益，他們受益於使用共享程式碼庫來針對多個平台——特別是在早期產品或 MVP（最小可行產品）中，時間上市速度至關重要。

對於希望共享邏輯和 UI 的公司而言，Kotlin Multiplatform 搭配 Compose Multiplatform 提供了一個理想的解決方案。您可以從共享 UI 開始，實現快速原型設計。您甚至可以將原生 UI 與共享 UI 混合搭配使用。這使得 KMP 搭配 Compose Multiplatform 成為綠地專案的理想選擇，有助於新創公司平衡速度、靈活性和高品質的原生體驗。

**案例研究：**

*   [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 將其 Android 應用程式邏輯和 UI 遷移到 Kotlin Multiplatform 搭配 Compose Multiplatform。透過有效利用 Android 程式碼庫，該公司得以在短時間內發布其 iOS 應用程式。
*   [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) 開發了一款習慣追蹤和生產力應用程式。其 iOS 應用程式使用 Compose Multiplatform 建構，與 Android 共享了 96% 的程式碼。

> 如果您正在 [Kotlin Multiplatform 和 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) 之間做選擇，請不要錯過我們對這兩項技術的概述。
> 
{style="tip"}

### 中小型企業

中小型企業通常擁有精簡的團隊，同時維護著成熟、功能豐富的產品。Kotlin Multiplatform 允許他們共享核心邏輯，同時保留使用者期望的原生外觀和感受。透過依賴現有的程式碼庫，這些團隊可以加速開發，而不會損害使用者體驗。

KMP 也支援一種彈性方法，可以逐步引入跨平台功能。這使得它對於發展現有應用程式或推出新功能的團隊特別有效，有助於減少開發時間、降低營運成本，並在需要時維護特定平台的自訂功能。

**案例研究：**

*   [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS.MTcyNzg1MTQzNC41Ni4wLjA..) 對其應用程式採用「最大化共享 Kotlin」策略，為行動裝置帶來了工作室般的瑜伽體驗。該公司透過 Kotlin Multiplatform 在客戶端和伺服器之間共享各種輔助工具，以及大部分的客戶端程式碼。該團隊透過保留僅原生視圖，成功顯著提高了應用程式的開發速度。
*   [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) 在其屢獲殊榮的待辦事項應用程式 Todoist 中使用了 Kotlin Multiplatform。該團隊在 Android 和 iOS 之間共享了關鍵邏輯，以確保一致的行為並簡化開發。他們逐步採用 KMP，從內部函式庫開始。

### 需要應用程式在不同裝置上行為一致的企業

大型應用程式通常擁有龐大的程式碼庫，不斷有新功能加入，並且複雜的業務邏輯必須在所有平台上以相同的方式運作。Kotlin Multiplatform 提供漸進式整合，允許團隊逐步採用。由於開發人員可以重複使用其現有的 Kotlin 技能，使用 KMP 也使他們免於引入新的技術棧。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/), [McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc), [Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks), [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8), [VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0), [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw), 
[Wonder App by Baidu](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![從 KMP 成功案例中學習](kmp-success-stories.svg){width="700"}{style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

### 代理商

與多元客戶合作時，代理商和顧問公司必須適應廣泛的平台要求和業務目標。使用 Kotlin Multiplatform 重複使用程式碼的能力，對於在緊迫時間表和有限工程團隊下管理多個專案的團隊來說尤其寶貴。透過採用 KMP，代理商可以加速交付並在各平台間保持應用程式行為一致。

**案例研究：**

*   [IceRock](https://icerockdev.com/) 是一家外包公司，使用 Kotlin Multiplatform 為其客戶開發應用程式。其應用程式組合涵蓋了各種業務需求，並輔以大量的開源 Kotlin Multiplatform 函式庫，這些函式庫可增強 Kotlin Multiplatform 的開發流程。
*   [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/) 是一個端到端數位產品團隊，使用 Kotlin Multiplatform 在網路、iOS、tvOS、Android 和 Amazon Fire TV 上運行相同的業務邏輯。KMP 允許其簡化開發，同時仍能充分利用每個平台。

### 拓展新市場的公司

有些公司希望透過在他們以前未曾針對的平台上發布應用程式來進入新市場，例如從僅限 iOS 轉向包含 Android，反之亦然。

KMP 協助您利用現有的 iOS 程式碼和開發實踐，同時在 Android 上保持原生效能和 UI 靈活性。如果您希望維護特定平台的使用者體驗，並利用現有知識和程式碼，KMP 可能會是理想的長期解決方案。

**案例研究：** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 使用 Kotlin Multiplatform 搭配 Compose Multiplatform 遷移其 Android 應用程式邏輯和 UI。這使得該公司能夠透過重複使用其大部分現有的 Android 程式碼庫，快速進入 iOS 市場。

### 開發軟體開發套件 (SDK) 的團隊

共享的 Kotlin 程式碼會編譯成特定平台的二進位檔案 (Android 為 JVM，iOS 為原生)，並無縫整合到任何專案中。它提供了靈活性，讓您可以不受限制地使用特定平台的 API，同時也讓您可以在原生和跨平台 UI 之間進行選擇。這些功能使 Kotlin Multiplatform 成為開發行動 SDK 的絕佳選擇。從消費者的角度來看，您的 Kotlin Multiplatform SDK 將會像任何常規的特定平台依賴項一樣運作，同時仍提供共享程式碼的優勢。

**案例研究：** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) 在其 HealthSuite Digital Platform 行動 SDK 中使用了 Kotlin Multiplatform，從而加快了新功能的開發，並增強了 Android 和 iOS 開發人員之間的協作。

## Kotlin Multiplatform 的使用案例：按產業劃分

Kotlin Multiplatform 的多功能性從其在各行各業中廣泛用於生產環境可見一斑。從金融科技到教育，KMP 搭配 Compose Multiplatform 已被多種類型的應用程式所採用。以下是一些特定產業的範例：

### 金融科技

金融科技應用程式通常涉及複雜的業務邏輯、安全的流程和嚴格的合規要求，所有這些都必須在各平台間一致地實現。Kotlin Multiplatform 有助於將這些核心邏輯統一到一個程式碼庫中，從而降低特定平台不一致的風險。它確保 iOS 和 Android 之間更快的功能對等，這對於錢包和支付等應用程式至關重要。

**案例研究：** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app), [Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development), [Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### 媒體與出版

媒體和內容驅動型應用程式依賴於快速的功能推出、一致的使用者體驗，以及為每個平台自訂 UI 的靈活性。Kotlin Multiplatform 允許團隊共享內容動態和發現區塊的核心邏輯，同時保持對原生 UI 的完全控制。這加速了開發，減少了昂貴的重複工作，並確保了各平台間的對等性。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/), [9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04), [Kuaishou](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### 專案管理與生產力

從共享日曆到即時協作，生產力應用程式需要功能豐富且必須在所有平台上完全相同地運作。Kotlin Multiplatform 協助團隊將這種複雜性集中到一個共享程式碼庫中，確保每個裝置上的功能和行為一致。這種靈活性意味著團隊可以更快地發布更新，並在各平台間保持統一的使用者體驗。

**案例研究：** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg), [VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 交通與出行

叫車、外送和出行平台透過在他們的司機、乘客和商家應用程式中共享共同功能，從 Kotlin Multiplatform 中受益。像即時追蹤、路線最佳化或應用程式內聊天等服務的核心邏輯可以編寫一次，並在 Android 和 iOS 上使用，從而保證所有使用者的一致行為。

**案例研究：** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0), 
[Feres](https://kotlinlang.org/case-studies/#case-study-feres)

### 教育科技

教育應用程式必須在行動和網路平台上提供無縫且一致的學習體驗，尤其是在支援龐大、分散的使用者群時。透過使用 Kotlin Multiplatform 集中學習演算法、測驗和其他業務邏輯，教育應用程式在每個裝置上都能提供統一的學習體驗。這種程式碼共享可以顯著提升效能和一致性——例如，Quizlet 將其共享程式碼從 JavaScript 遷移到 Kotlin 後，其 Android 和 iOS 應用程式都看到了顯著的速度提升。

**案例研究：** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL), [Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform), [Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..), [Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db), 
[Physics Wallah](https://kotlinlang.org/case-studies/#case-study-physics-wallah)

### 電子商務

建構跨平台購物體驗意味著平衡共享業務邏輯與原生功能，例如支付、相機存取和地圖。Kotlin Multiplatform 搭配 Compose Multiplatform 使團隊能夠在各平台間共享業務邏輯和 UI，同時在需要時仍可使用特定平台的組件。這種混合方法確保了更快的開發速度、一致的使用者體驗，以及整合關鍵原生功能的靈活性。

**案例研究：** [Balary Market](https://kotlinlang.org/case-studies/#case-study-balary), [Markaz](https://kotlinlang.org/case-studies/#case-study-markaz)

### 社群網路與社區

在社群平台上，及時的功能交付和一致的互動對於保持社群活躍並跨裝置連接至關重要。關鍵的互動邏輯可能包括訊息、通知或排程。例如，Meetup 允許使用者尋找當地群組、活動和事件，已能夠借助 KMP 同步發布新功能。

**案例研究：** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 健康與保健

無論是引導瑜伽課程還是跨裝置同步健康數據，健康應用程式都依賴於響應能力和可靠的跨平台行為。這些應用程式通常需要共享核心功能，例如運動邏輯和數據處理，同時保持完全原生的 UI 和特定平台的整合，例如感測器、通知或健康 API。

**案例研究：** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u), [Fast&amp;Fit](https://kotlinlang.org/case-studies/#case-study-fast-and-fit), [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8), [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog)

### 郵政服務

儘管不是常見的使用案例，但 Kotlin Multiplatform 甚至被一個擁有 377 年歷史的國家郵政服務所採用。挪威的 Posten Bring 使用 KMP 統一數十個前端和後端系統中的複雜業務邏輯，協助他們簡化工作流程，並大幅縮短推出新服務所需的時間——從數月縮短到數天。

**案例研究：** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

這些範例突顯了 Kotlin Multiplatform 如何在幾乎任何產業或應用程式類型中使用。無論您是在建構金融科技應用程式、出行解決方案、教育平台還是其他什麼，Kotlin Multiplatform 都提供了靈活性，讓您可以根據專案需求共享盡可能多的程式碼，而不會犧牲原生體驗。您還可以查閱 [KMP 案例研究](https://kotlinlang.org/case-studies/?type=multiplatform) 的完整列表，其中展示了許多其他在生產環境中使用該技術的公司。