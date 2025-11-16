[//]: # (title: 學習資源)

<web-summary>選擇最符合您 KMP 經驗水準的學習材料。</web-summary>

我們彙整了超過 30 份重要的 Kotlin Multiplatform (KMP) 和 Compose Multiplatform 學習材料。您可以依技能水準瀏覽，尋找適合您經驗的教學、課程和文章：

🌱 **初學者**。透過 JetBrains 和 Google 的官方教學，學習 KMP 和 Compose 的基礎知識。使用 Room、Ktor 和 SQLDelight 等核心函式庫建構簡單的應用程式。

🌿 **中級**。使用共享 ViewModels、基於 Koin 的依賴注入和整潔架構開發實際應用程式。透過 JetBrains 和社群教育者的課程學習。

🌳 **進階者**。深入全面的 KMP 工程，涵蓋後端和遊戲開發使用案例，並提供大型、多團隊專案的擴展架構和採用指南。

🧩 **函式庫作者**。建立並發布可重複使用的 KMP 函式庫。學習 API 設計、Dokka 文件和使用官方 JetBrains 工具與範本進行 Maven 發布。

<Tabs>
<TabItem id="all-resources" title="全部">

<snippet id="source">
<table>

<!-- BEGINNER BLOCK -->
<thead>

<tr>
<th>

**🎚**

</th>
<th>

**資源/**

**類型**

</th>
<th>

**建立者/**
**平台**

</th>

<th>

**您將學習**

</th>
<th>

**價格**

</th>
<th>

**預估時間**

</th>
</tr>

</thead>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform Overview](kmp-overview.md)

文章

</td>
<td>
JetBrains
</td>

<td>
KMP 的核心價值、實際使用案例，以及選擇正確學習路徑的指南。
</td>
<td>
免費
</td>
<td>
30 分鐘
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Create Your First KMP App](multiplatform-create-first-app.md)

教學

</td>
<td>
JetBrains
</td>

<td>
如何設定 KMP 專案，並在 Android 和 iOS 之間共享簡單的業務邏輯，同時保持 UI 完全原生。
</td>
<td>
免費
</td>
<td>
1–2 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Get Started With Kotlin Multiplatform (Google Codelab)](https://developer.android.com/codelabs/kmp-get-started)

教學

</td>
<td>
Google

Android
</td>

<td>
如何將共享的 KMP 模組新增至現有的 Android 專案，並將其與 iOS 整合，使用 SKIE 外掛程式從您的 Kotlin 程式碼產生慣用的 Swift API。
</td>
<td>
免費
</td>
<td>
1–2 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Create Your First Compose Multiplatform App](compose-multiplatform-create-first-app.md)

教學

</td>
<td>
JetBrains
</td>

<td>
如何從零開始建構一個完整的 Compose Multiplatform 應用程式，涵蓋必要的 UI 元件、狀態管理和資源處理，從一個簡單的範本逐步發展為一個可在 Android、iOS、桌面和網頁上執行的功能性時區應用程式。
</td>
<td>
免費
</td>
<td>
2–3 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Create a Multiplatform App Using Ktor and SQLDelight](multiplatform-ktor-sqldelight.md)

教學

</td>
<td>
JetBrains
</td>

<td>
如何使用 Ktor 建立用於網路的共享資料層，以及 SQLDelight 作為本機資料庫，並將其連接到使用 Jetpack Compose (Android) 和 SwiftUI (iOS) 建構的原生 UI。
</td>
<td>
免費
</td>
<td>
4–6 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Expected and Actual Declarations](multiplatform-expect-actual.md)

文章

</td>
<td>
JetBrains
</td>

<td>
用於從通用程式碼存取平台專屬 API 的核心 expect/actual 機制，涵蓋了使用函式、屬性和類別等不同策略。
</td>
<td>
免費
</td>
<td>
1–2 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Using Platform-Specific APIs in KMP Apps](https://www.youtube.com/watch?v=bSNumV04y_w)

影音教學

</td>
<td>
JetBrains

YouTube
</td>

<td>
在您的 KMP 應用程式中使用平台專屬程式碼的最佳實踐。
</td>
<td>
免費
</td>
<td>
15 分鐘
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[KMP for Android Developers](https://nsmirosh.gumroad.com/l/tmmqwa)

影音課程

</td>
<td>
Mykola Miroshnychenko

Gumroad
</td>

<td>
如何透過掌握 expect/actual 和原始碼集等 KMP 基礎知識，將您現有的 Android 開發技能擴展到 iOS，然後使用 Ktor 進行網路和 Room 進行持久性等現代函式庫建構完整的應用程式堆疊。
</td>
<td>
~$60
</td>
<td>
8–12 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform Masterclass](https://www.udemy.com/course/kotlin-multiplatform-masterclass/)

影音課程

</td>
<td>
Petros Efthymiou

Udemy
</td>

<td>
如何從零開始應用整潔架構和 MVI 來建構一個完整的 KMP 應用程式，整合 Ktor、SQLDelight 和 Koin 等一系列基本函式庫，並搭配原生 Jetpack Compose 和 SwiftUI UI。
</td>
<td>
€10–€20
</td>
<td>
6 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Compose Multiplatform Full Course 2025 | Zero to Hero](https://www.youtube.com/watch?v=Z92zJzL-6z0&list=PL0pXjGnY7PORAoIX2q7YG2sotapCp4hyl)

影音課程

</td>
<td>
Code with FK

YouTube
</td>

<td>
如何完全使用 Compose Multiplatform 建構一個完整、功能豐富的應用程式，從基礎知識進階到如 Firebase Authentication、使用 SQLDelight 離線支援和即時更新等進階、實際的功能。
</td>
<td>
免費
</td>
<td>
20 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform Development](https://www.linkedin.com/learning/kotlin-multiplatform-development)

影音課程

</td>
<td>
Colin Lee

LinkedIn Learning
</td>

<td>
如何在 Compose Multiplatform 和原生 UI 之間做出架構選擇，理解 Swift 互通性的基礎知識，並全面概觀 KMP 生態系統中用於網路、持久性和依賴注入的必備元素。
</td>
<td>
~$30–$40/月)
</td>
<td>
3 小時
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform by Tutorials (Third Edition)](https://www.kodeco.com/books/kotlin-multiplatform-by-tutorials/v3.0)

書籍

</td>
<td>
Kodeco Team (Kevin D. Moore, Carlos Mota, Saeed Taheri)
</td>

<td>
透過將原生 UI 連接到 KMP 共享模組，以實現網路、序列化和持久性，學習程式碼共享的基礎知識。您還將看到如何應用依賴注入、測試和現代架構來建構可維護和可擴展的實際應用程式。
</td>
<td>
~$60
</td>
<td>
40–60 小時
</td>
</tr>

<!-- END OF BEGINNER BLOCK -->

<!-- INTERMEDIATE BLOCK -->

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Make Your Android Application Work on iOS](multiplatform-integrate-in-existing-app.md)

教學

</td>
<td>
JetBrains
</td>

<td>
將現有 Android 應用程式遷移到 KMP 的實際步驟，透過將其業務邏輯提取到一個共享模組中，該模組可供原始 Android 應用程式和新的原生 iOS 專案使用。
</td>
<td>
免費
</td>
<td>
2 小時
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Migrate Existing Apps to Room KMP (Google Codelab)](https://developer.android.com/codelabs/kmp-migrate-room)

教學

</td>
<td>
Google

Android
</td>

<td>
如何將現有的 Android Room 資料庫遷移到共享的 KMP 模組中，讓您可以在 Android 和 iOS 上重用您熟悉的 DAO 和實體。
</td>
<td>
免費
</td>
<td>
2 小時
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[How to Share ViewModels in Compose Multiplatform (with Dependency Injection!)](https://www.youtube.com/watch?v=O85qOS7U3XQ)

影音教學

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
如何使用 Koin 進行依賴注入，在 Compose Multiplatform 專案中實作共享 ViewModel，讓您只需編寫一次狀態管理邏輯。
</td>
<td>
免費
</td>
<td>
30 分鐘
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[The Compose Multiplatform Crash Course 2025](https://www.youtube.com/watch?v=WT9-4DXUqsM)

影音課程

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
如何從零開始使用整潔架構建構一個完整、可投入生產的書籍應用程式，涵蓋現代 KMP 堆疊，包括 Ktor 用於網路、Room 用於本機資料庫、Koin 用於依賴注入，以及多平台導航。
</td>
<td>
免費
</td>
<td>
5 小時
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Building Industry-Level Multiplatform Apps With KMP](https://pl-coding.com/kmp/)

影音課程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何透過在原生 UI (Jetpack Compose 和 SwiftUI) 之間共享 ViewModel 和業務邏輯，建構一個實際的翻譯應用程式，涵蓋從整潔架構到單元測試、UI 測試和端到端測試的完整開發生命週期。
</td>
<td>
~€99
</td>
<td>
20 小時
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Building Industry-Level Compose Multiplatform Android and iOS Apps](https://pl-coding.com/cmp-mobile)

影音課程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何從零開始使用完整的 Compose Multiplatform 堆疊建構一個大規模、離線優先的聊天應用程式，包括 Ktor 用於即時 WebSocket、Room 用於本機持久性，以及 Koin 用於多模組依賴注入。
</td>
<td>
~€199
</td>
<td>
34 小時
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Ultimate Compose Multiplatform: Android/iOS and Testing](https://www.udemy.com/course/ultimate-compose-multiplatform-androidios-testing-kotlin/)

影音課程

</td>
<td>
Hamidreza Sahraei

Udemy

</td>

<td>
如何完全使用 Compose Multiplatform 建構一個功能豐富的虛擬加密錢包應用程式，不僅涵蓋核心堆疊 (Ktor、Room、Koin)，還包括穩固的單元/UI 測試和生物識別驗證等進階平台整合。
</td>
<td>
~€20
</td>
<td>
8 小時
</td>
</tr>
<!-- END OF INTERMEDIATE BLOCK -->

<!-- ADVANCED BLOCK -->

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Kotlin/Swift Interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)

文章

</td>
<td>
JetBrains

GitHub
</td>

<td>
與 iOS (Obj-C/Swift) 的互操作性、SKIE、KMP-NativeCoroutines、語言功能差距的解決方法、Swift 匯出，以及雙向互操作。
</td>
<td>
免費
</td>
<td>
2 小時
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Multi-Modular Ecommerce App for Android and iOS (KMP)](https://www.udemy.com/course/multi-modular-ecommerce-app-for-android-ios-kmp/)

影音課程

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
從設計電子商務應用程式的 Figma UI 到使用 Compose Multiplatform 將其建構為一個完整的、具有共享 UI 的多模組應用程式，同時也使用 Firebase 服務（用於身份驗證、資料庫和自動化 Cloud Functions）建立並整合完整的後端。
</td>
<td>
~€50
</td>
<td>
30 小時
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Exploring Ktor with Kotlin Multiplatform and Compose](https://www.linkedin.com/learning/exploring-ktor-with-kotlin-multiplatform-and-compose)

影音課程

</td>
<td>
Troy Miles

LinkedIn Learning
</td>

<td>
如何建構一個全端 Kotlin 應用程式，首先建立並部署安全的 Ktor 後端到 AWS，然後使用 Kotlin Multiplatform 建構具有共享程式碼的原生用戶端，這些用戶端將消耗您的 API。
</td>
<td>
~$30–$40/月
</td>
<td>
2-3 小時
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Full-Stack Game Development - Kotlin and Compose Multiplatform](https://www.udemy.com/course/full-stack-game-development-kotlin-compose-multiplatform/)

影音課程

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
如何使用 Compose Multiplatform 建構一個完整的 2D 遊戲，涵蓋物理、碰撞偵測、精靈表動畫，並將其部署到 Android、iOS、桌面和網頁 (透過 Kotlin/Wasm)。
</td>
<td>
~€99
</td>
<td>
8–10 小時
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Philipp Lackner Full-Stack Bundle: KMP and Spring Boot](https://pl-coding.com/full-stack-bundle)

影音課程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何架構、建構和部署一個完整的全端聊天應用程式，涵蓋從帶有 WebSocket 的多模組 Spring Boot 後端，到離線優先的 Compose Multiplatform 用戶端 (Android、iOS、桌面、網頁)，以及完整的 CI/CD 管線。
</td>
<td>
~€429
</td>
<td>
55 小時
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[KMP for Native Mobile Teams](https://touchlab.co/kmp-teams-intro)

系列文章

</td>
<td>
Touchlab
</td>

<td>
如何在既有的原生行動團隊中，引導完整的 KMP 採用流程，從確保初始認同、執行技術試點，到使用可持續、實際的工作流程擴展共享程式碼庫。
</td>
<td>
免費
</td>
<td>
6–8 小時
</td>
</tr>

<!-- END OF ADVANCED BLOCK -->

<!-- LIB-AUTHORS BLOCK -->

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[API Guidelines for Multiplatform Library Building](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)

文件

</td>
<td>
JetBrains
</td>

<td>
如何設計您的多平台函式庫的公共 API，遵循最大化程式碼重用和確保廣泛平台相容性的基本最佳實踐。
</td>
<td>
免費
</td>
<td>
1–2 小時
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Create Your Kotlin Multiplatform Library](create-kotlin-multiplatform-library.md)

教學

</td>
<td>
JetBrains
</td>

<td>
如何使用官方入門範本、設定本機 Maven 發布、組織您的函式庫，以及配置發布。
</td>
<td>
免費
</td>
<td>
2–3 小時
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Documentation with Dokka](https://kotlinlang.org/docs/dokka-introduction.html)

文件

</td>
<td>
JetBrains
</td>

<td>
如何使用 Dokka 自動為您的 KMP 函式庫產生多種格式的專業 API 文件，並支援混合 Kotlin/Java 專案。
</td>
<td>
免費
</td>
<td>
2–3 小時
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[KMP Library Template](https://github.com/Kotlin/multiplatform-library-template)

GitHub 範本

</td>
<td>
JetBrains

GitHub
</td>

<td>
如何使用官方範本快速啟動一個新的 KMP 函式庫專案，該範本預先配置了建置設定和發布的最佳實踐。
</td>
<td>
免費
</td>
<td>
1 小時
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Publish to Maven Central](multiplatform-publish-libraries.md)

教學

</td>
<td>
JetBrains
</td>

<td>
將您的 KMP 函式庫發布到 Maven Central 的完整、逐步流程，包括設定憑證、配置發布外掛程式，以及使用 CI 自動化該流程。
</td>
<td>
免費
</td>
<td>
3–4 小時
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatform Libraries](https://www.linkedin.com/learning/kotlin-multiplatform-libraries)

影音課程

</td>
<td>
LinkedIn Learning
</td>

<td>
建立 KMP 函式庫的完整生命週期，從有效的 API 設計和程式碼共享策略，到最終發布和最佳實踐。
</td>
<td>
~$30–$40/月
</td>
<td>
2-3 小時
</td>
</tr>

<!-- END OF LIB-AUTHORS BLOCK -->

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem id="beginner" title="🌱 初學者">

<include element-id="source" use-filter="empty,beginner" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="intermediate" title="🌿 中級">

<include element-id="source" use-filter="empty,intermediate" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="advanced" title="🌳 進階者">

<include element-id="source" use-filter="empty,advanced" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="lib-authors" title="🧩 函式庫作者">

<include element-id="source" use-filter="empty,lib-authors" from="kmp-learning-resources.md"/>

</TabItem>

</Tabs>