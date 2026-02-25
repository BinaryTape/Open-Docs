[//]: # (title: Kotlin 與 Compose 多平台在正式環境中的應用：真實世界的使用案例)

<web-summary>探索 Kotlin 多平台與 Compose 多平台如何在真實專案的正式環境中被運用。透過範例深入了解實用的使用案例。</web-summary>

> 隨著全球大大小小的公司採用 Kotlin 多平台 (KMP) 與 Compose 多平台，這項技術已成為建置與擴充現代跨平台應用程式值得信賴的解決方案。
> 
{style="note"}

從整合到現有應用程式、共用應用程式邏輯到建置新的跨平台應用程式，[Kotlin 多平台](https://www.jetbrains.com/kotlin-multiplatform/) 已成為許多公司的技術首選。這些團隊正利用 KMP 提供的優勢來更快地推出產品並降低開發成本。

越來越多的企業也開始採用 [Compose 多平台](https://www.jetbrains.com/compose-multiplatform/)，這是一個由 Kotlin 多平台與 Google 的 Jetpack Compose 提供支援的宣告式 UI 架構。隨著 [iOS 穩定版發佈](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)，Compose 多平台完善了整體版圖，使 KMP 成為跨平台行動開發的完整解決方案。

隨著採用率的增長，本文將探討 Kotlin 多平台如何在不同行業和團隊結構的正式環境中被使用。

## 依業務類型和團隊劃分的 Kotlin 多平台使用案例

以下是不同團隊應用 Kotlin 多平台以滿足各種專案需求的幾種方式：

### 啟動全新專案的新創公司

新創公司通常在資源有限且時程緊迫的情況下運作。為了最大化開發效率與成本效益，他們能從使用共用程式碼庫鎖定多個平台中獲益——特別是在產品早期階段或 MVP 中，產品上市時間至關重要。

對於想要同時共用邏輯與 UI 的公司，Kotlin 多平台結合 Compose 多平台提供了理想的解決方案。你可以從共用 UI 開始，實現快速的原型製作。你甚至可以將原生 UI 與共用 UI 混合搭配。這使得 KMP 搭配 Compose 多平台成為全新專案的理想選擇，幫助新創公司在速度、靈活性和高品質原生體驗之間取得平衡。

**案例研究：**

* [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 將其 Android 應用程式邏輯與 UI 遷移到 Kotlin 多平台與 Compose 多平台。透過有效地利用 Android 程式碼庫，該公司能夠在短時間內發佈其 iOS 應用程式。
* [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) 開發了一款習慣追蹤與生產力應用程式。其 iOS 應用程式使用 Compose 多平台建置，與 Android 共用了 96% 的程式碼。

> 如果你在 [Kotlin 多平台與 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) 之間做選擇，不要錯過我們對這兩項技術的總覽。
> 
{style="tip"}

### 中小型企業

中小型企業通常擁有精簡的團隊，同時維護著成熟且功能豐富的產品。Kotlin 多平台允許他們共用核心邏輯，同時保持使用者期待的原生外觀與感受。透過依賴現有的程式碼庫，這些團隊可以加速開發而不犧牲使用者體驗。

KMP 還支援靈活的方法來逐步導入跨平台能力。這對於演進現有應用程式或發佈新功能的團隊特別有效，有助於減少開發時間、降低開銷，並在需要時保持平台特定的自訂。

**案例研究：**

* [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..) 對其應用程式使用「最大化共用 Kotlin」策略，將錄音室等級的瑜伽體驗帶到行動裝置。該公司透過 Kotlin 多平台在用戶端與伺服器之間共用各種幫助程式，以及大部分的用戶端程式碼。該團隊透過保留僅限原生的視圖，成功顯著提升了應用程式的開發速度。
* [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) 在其屢獲殊榮的待辦事項應用程式 Todoist 中使用了 Kotlin 多平台。團隊在 Android 與 iOS 之間共用關鍵邏輯，以確保行為一致並簡化開發。它從內部程式庫開始，逐步採用 KMP。

### 需要在裝置間保持一致行為的大型企業應用程式

大型應用程式通常擁有龐大的程式碼庫，不斷加入新功能，且複雜的商業邏輯必須在所有平台上以相同的方式運作。Kotlin 多平台提供漸進式整合，允許團隊逐步採用。由於開發人員可以重用其現有的 Kotlin 技能，使用 KMP 還能避免引入新的技術堆疊。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc)、[Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw)、[百度 Wonder App](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![從 KMP 成功案例中學習](kmp-success-stories.svg){width="700"}{style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

### 代理商

面對多樣化的客戶，代理商與諮詢公司必須適應廣泛的平台需求與商業目標。對於在緊迫時程和有限工程團隊下管理多個專案的團隊來說，使用 Kotlin 多平台重用程式碼的能力尤其珍貴。透過採用 KMP，代理商可以加速交付並在平台間保持一致的應用程式行為。

**案例研究：**

* [Touchlab](https://touchlab.co/) 專注於 Kotlin 多平台的跨平台開發與諮詢工作。Touchlab 還建立了改進 iOS 開發體驗的工具，例如增強從 Kotlin 發佈的 Swift API 的 [SKIE](https://github.com/touchlab/SKIE)，以及 [Xcode 的 Kotlin 外掛程式](https://github.com/touchlab/xcode-kotlin)。
* [IceRock](https://icerockdev.com/) 是一間委外公司，使用 Kotlin 多平台為其客戶開發應用程式。其應用程式組合涵蓋各種業務需求，並輔以大量的開源 Kotlin 多平台庫，提升了 Kotlin 多平台開發流程。
* [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/) 是一支端對端數位產品團隊，使用 Kotlin 多平台在 Web、iOS、tvOS、Android 與 Amazon Fire TV 上執行相同的商業邏輯。KMP 讓他們在精簡開發的同時，仍能充分發揮各平台的優勢。

### 擴展至新市場的公司

有些公司希望透過在先前未鎖定的平台上推出應用程式來進入新市場，例如從僅限 iOS 轉向包含 Android，反之亦然。

KMP 幫助你利用現有的 iOS 程式碼與開發實務，同時在 Android 上保持原生效能與 UI 靈活性。如果你想保持平台特定的使用者體驗並利用現有的知識與程式碼，KMP 可能是理想的長期解決方案。

**案例研究：** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 使用 Kotlin 多平台搭配 Compose 多平台來遷移其 Android 應用程式邏輯與 UI。這讓該公司能透過重用大量現有的 Android 程式碼庫，快速進入 iOS 市場。

### 開發軟體開發套件 (SDK) 的團隊

共用的 Kotlin 程式碼會編譯為平台特定的二進位檔案（Android 為 JVM，iOS 為原生），並能無縫整合到任何專案中。它提供了靈活性，讓你可以無限制地使用平台特定的 API，同時讓你能在原生與跨平台 UI 之間做出選擇。這些特性使得 Kotlin 多平台成為開發行動 SDK 的絕佳選擇。從消費者的角度來看，你的 Kotlin 多平台 SDK 表現起來就像任何普通平台特定的相依項，同時仍提供共用程式碼的好處。

**案例研究：** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) 在其 HealthSuite 數位平台行動 SDK 中使用 Kotlin 多平台，實現了新功能的更快開發，並增強了 Android 與 iOS 開發人員之間的協作。

## 依行業劃分的 Kotlin 多平台使用案例

Kotlin 多平台的多功能性從其應用的廣泛行業中顯而易見。從金融科技到教育，KMP 搭配 Compose 多平台已被應用於多種類型的應用程式。以下是一些特定行業的範例：

### 金融科技

金融科技應用程式通常涉及複雜的商業邏輯、安全的工作流與嚴格的合規要求，所有這些都必須在各平台間一致地實作。Kotlin 多平台有助於將這些核心邏輯統一在一個程式碼庫中，減少平台特定不一致的風險。它確保了 iOS 與 Android 之間更快的功能對等，這對於電子錢包與支付等應用程式至關重要。

**案例研究：** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app)、[Block 的 Bitkey](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development)、[Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### 媒體與出版

媒體與內容驅動的應用程式依賴於快速的功能推行、一致的使用者體驗以及為各平台自訂 UI 的靈活性。Kotlin 多平台允許團隊在共用內容餵送與探索區塊的核心邏輯時，仍能完全掌控原生 UI。這加速了開發、減少了昂貴的重複工作，並確保了平台間的對等。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[快手](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### 專案管理與生產力

從共用行事曆到即時協作，生產力應用程式需要功能豐富的功能性，且在所有平台上必須運作完全相同。Kotlin 多平台幫助團隊將這種複雜性集中在一個共用的程式碼庫中，確保在每台裝置上都有一致的功能與行為。這種靈活性意味著團隊可以更快發佈更新，並在各平台間保持統一的使用者體驗。

**案例研究：** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 交通與運輸

叫車、配送與運輸平台透過在其駕駛員、乘客與商家應用程式中共用常見功能，從 Kotlin 多平台中獲益。即時追蹤、路徑優化或應用程式內聊天等服務的核心邏輯可以只編寫一次並同時用於 Android 與 iOS，保證所有使用者都有一致的行為。

**案例研究：** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Feres](https://kotlinlang.org/case-studies/#case-study-feres)

### 教育科技

教育應用程式必須在行動端與 Web 端提供無縫且一致的學習體驗，尤其是在支援大規模的分散式受眾時。透過使用 Kotlin 多平台集中處理學習演算法、測驗與其他商業邏輯，教育應用程式在每台裝置上都能提供一致的學習體驗。這種程式碼共用可以顯著提升效能與一致性——例如，Quizlet 將其共用程式碼從 JavaScript 遷移到 Kotlin，並在其 Android 與 iOS 應用程式中都看到了顯著的速度提升。

**案例研究：** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL)、[Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform)、[Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..)、[Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db)、[Physics Wallah](https://kotlinlang.org/case-studies/#case-study-physics-wallah)

### 電子商務

建置跨平台購物體驗意味著要在共用的商業邏輯與原生功能（如支付、相機存取與地圖）之間取得平衡。Kotlin 多平台搭配 Compose 多平台使團隊能夠在各平台間共用商業邏輯與 UI，同時在需要時仍能使用平台特定的組件。這種混合方法確保了更快的開發、一致的使用者體驗，以及整合關鍵原生功能的靈活性。

**案例研究：** [Balary Market](https://kotlinlang.org/case-studies/#case-study-balary)、[Markaz](https://kotlinlang.org/case-studies/#case-study-markaz)

### 社群網路與社群

在社群平台上，及時的功能交付與一致的互動對於保持社群活躍及裝置間的連結至關重要。關鍵互動邏輯可能包括訊息傳送、通知或排程。例如，讓使用者尋找在地群組、活動與活動的 Meetup，得益於 KMP 而能夠同時發佈新功能。

**案例研究：** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 健康與健身

無論是引導瑜伽課程還是跨裝置同步健康數據，健身應用程式都依賴於回應性與可靠的跨平台行為。這些應用程式通常需要共用核心功能，例如運動邏輯與數據處理，同時保持完全原生的 UI 以及平台特定的整合（如感測器、通知或健康 API）。

**案例研究：** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u)、[Fast&amp;Fit](https://kotlinlang.org/case-studies/#case-study-fast-and-fit)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog)

### 郵政服務

雖然這不是一個常見的使用案例，但 Kotlin 多平台甚至被一家有 377 年歷史的國家郵政服務採用。挪威的 Posten Bring 使用 KMP 統一了數十個前端與後端系統中複雜的商業邏輯，幫助他們簡化工作流並大幅縮短推出新服務所需的時間——從數月縮短到數天。

**案例研究：** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

這些範例凸顯了 Kotlin 多平台幾乎可以用於任何行業或類型的應用程式。無論你是在建置金融科技應用程式、運輸解決方案、教育平台或其他產品，Kotlin 多平台都提供了靈活性，讓你在不犧牲原生體驗的情況下，根據專案需求盡可能多地共用程式碼。你也可以查看詳盡的 [KMP 案例研究](https://kotlinlang.org/case-studies/?type=multiplatform) 清單，其中展示了許多其他在正式環境中使用該技術的公司。