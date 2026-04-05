[//]: # (title: 學習資源)

<web-summary>選擇最符合您 KMP 經驗程度的學習教材。</web-summary>

我們收集了超過 30 份必備的 Kotlin Multiplatform (KMP) 與 Compose Multiplatform 學習教材。依據技術程度瀏覽，找出適合您經驗的教學、課程與文章：

🌱 **初學者**。透過 JetBrains 與 Google 官方教學學習 KMP 與 Compose 基礎。使用核心程式庫（如 Room、Ktor 與 SQLDelight）組建簡單的應用程式。

🌿 **中階**。使用共享 ViewModel、基於 Koin 的相依注入與整潔架構開發實務應用程式。透過 JetBrains 與社群講師提供的課程學習。

🌳 **進階**。進階到後端與遊戲開發的全規模 KMP 工程，包含擴展架構以及大型多團隊專案導入的指南。

🧩 **程式庫作者**。建立並發佈可重複使用的 KMP 程式庫。透過 JetBrains 官方工具與範本學習 API 設計、Dokka 文件製作以及 Maven 發佈。

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

**資源 /**

**類型**

</th>
<th>

**建立者 /**
**平台**

</th>

<th>

**您將學到**

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

[Kotlin Multiplatform 概覽](kmp-overview.md)

文章

</td>
<td>
JetBrains
</td>

<td>
KMP 的核心價值、實務使用案例，以及選擇正確學習路徑的指引。
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

[建立您的第一個 KMP 應用程式](multiplatform-create-first-app.md)

教學

</td>
<td>
JetBrains
</td>

<td>
如何設定 KMP 專案，並在保持 UI 完全原生的同時，在 Android 與 iOS 之間共享簡單的商業邏輯。
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

[Kotlin Multiplatform 快速入門 (Google Codelab)](https://developer.android.com/codelabs/kmp-get-started)

教學

</td>
<td>
Google

Android
</td>

<td>
如何將共享的 KMP 模組新增至現有的 Android 專案並與 iOS 整合，使用 SKIE 外掛程式從 Kotlin 程式碼產生符合 Swift 慣例的 API。
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

[建立您的第一個 Compose Multiplatform 應用程式](compose-multiplatform-create-first-app.md)

教學

</td>
<td>
JetBrains
</td>

<td>
如何從頭開始組建完整的 Compose Multiplatform 應用程式，涵蓋必備的 UI 元件、狀態管理與資源處理，從簡單的範本進階到可在 Android、iOS、桌面與 Web 執行的功能性時區應用程式。
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

[使用 Ktor 與 SQLDelight 建立多平台應用程式](multiplatform-ktor-sqldelight.md)

教學

</td>
<td>
JetBrains
</td>

<td>
如何使用 Ktor 進行網路連線並使用 SQLDelight 作為本機資料庫來組建共享資料層，並將其連接至在 Android 上使用 Jetpack Compose、在 iOS 上使用 SwiftUI 組建的原生 UI。
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

[Expected 與 Actual 宣告](multiplatform-expect-actual.md)

文章

</td>
<td>
JetBrains
</td>

<td>
核心的 expect/actual 機制，用於從共同程式碼存取平台專屬 API，涵蓋使用函式、屬性與類別等不同策略。
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

[在 KMP 應用程式中使用平台專屬 API](https://www.youtube.com/watch?v=bSNumV04y_w)

影片教學

</td>
<td>
JetBrains

YouTube
</td>

<td>
在 KMP 應用程式中使用平台專屬程式碼的最佳實務。
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

[給 Android 開發者的 KMP 課程](https://nsmirosh.gumroad.com/l/tmmqwa)

影片課程

</td>
<td>
Mykola Miroshnychenko

Gumroad
</td>

<td>
如何透過掌握 KMP 基礎（如 expect/actual 與原始碼集），以及使用 Ktor 進行網路連線與 Room 進行持續性等現代化程式庫組建完整的應用程式堆疊，將現有的 Android 開發技能擴展至 iOS。
</td>
<td>
約 60 美元
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

[Kotlin Multiplatform 大師班](https://www.udemy.com/course/kotlin-multiplatform-masterclass/)

影片課程

</td>
<td>
Petros Efthymiou

Udemy
</td>

<td>
如何從頭開始套用整潔架構與 MVI 來組建完整的 KMP 應用程式，將核心程式庫（Ktor、SQLDelight 與 Koin）的全堆疊與原生的 Jetpack Compose 與 SwiftUI UI 整合。
</td>
<td>
10–20 歐元
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

[Compose Multiplatform 完整課程 2025 | 從零到專家](https://www.youtube.com/watch?v=Z92zJzL-6z0&list=PL0pXjGnY7PORAoIX2q7YG2sotapCp4hyl)

影片課程

</td>
<td>
Code with FK

YouTube
</td>

<td>
如何完全使用 Compose Multiplatform 組建功能完整且豐富的應用程式，從基礎進階到實務的高階功能，例如 Firebase Authentication、使用 SQLDelight 的離線支援以及即時更新。
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

[Kotlin Multiplatform 開發](https://www.linkedin.com/learning/kotlin-multiplatform-development)

影片課程

</td>
<td>
Colin Lee

LinkedIn Learning
</td>

<td>
Compose Multiplatform 與原生 UI 之間的架構選擇、Swift 互通性基礎，以及用於網路連線、持續性與相依注入之必備 KMP 生態系統的完整概覽。
</td>
<td>
約 30–40 美元/月
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

[Kotlin Multiplatform 實作教學 (第三版)](https://www.kodeco.com/books/kotlin-multiplatform-by-tutorials/v3.0)

書籍

</td>
<td>
Kodeco 團隊 (Kevin D. Moore, Carlos Mota, Saeed Taheri)
</td>

<td>
透過將原生 UI 連接到用於網路連線、序列化與持續性的 KMP 共享模組來共享程式碼的基礎。您還將了解如何套用相依注入、測試與現代架構，以組建具備可維護性與可擴展性的實務應用程式。
</td>
<td>
約 60 美元
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

[讓您的 Android 應用程式在 iOS 上執行](multiplatform-integrate-in-existing-app.md)

教學

</td>
<td>
JetBrains
</td>

<td>
將現有 Android 應用程式遷移至 KMP 的實際步驟，透過將商業邏輯擷取到一個可供原始 Android 應用程式與新的原生 iOS 專案共同使用的共享模組中。
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

[將現有應用程式遷移至 Room KMP (Google Codelab)](https://developer.android.com/codelabs/kmp-migrate-room)

教學

</td>
<td>
Google

Android
</td>

<td>
如何將現有的 Android Room 資料庫遷移到共享的 KMP 模組中，讓您在 Android 與 iOS 上都能重複使用熟悉的 DAO 與實體。
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

[如何在 Compose Multiplatform 中共享 ViewModel (包含相依注入！)](https://www.youtube.com/watch?v=O85qOS7U3XQ)

影片教學

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
如何在 Compose Multiplatform 專案中使用 Koin 進行相依注入來實作共享 ViewModel，讓您只需編寫一次狀態管理邏輯。
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

[Compose Multiplatform 速成課程 2025](https://www.youtube.com/watch?v=WT9-4DXUqsM)

影片課程

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
如何使用整潔架構從頭開始組建完整的生產級閱讀應用程式，涵蓋現代化 KMP 堆疊，包括用於網路連線的 Ktor、用於本機資料庫的 Room、用於相依注入的 Koin 以及多平台導覽。
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

[使用 KMP 組建工業級多平台應用程式](https://pl-coding.com/kmp/)

影片課程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何透過在原生 UI（Jetpack Compose 與 SwiftUI）之間共享 ViewModel 與商業邏輯來組建實務的翻譯應用程式，涵蓋從整潔架構到雙平台的單元測試、UI 測試與端對端測試的完整開發生命週期。
</td>
<td>
約 99 歐元
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

[組建工業級 Compose Multiplatform Android 與 iOS 應用程式](https://pl-coding.com/cmp-mobile)

影片課程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何使用完整的 Compose Multiplatform 堆疊從頭開始組建大規模、離線優先的聊天應用程式，包括用於即時 WebSocket 的 Ktor、用於本機持續性的 Room，以及用於多模組相依注入的 Koin。
</td>
<td>
約 199 歐元
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

[終極 Compose Multiplatform：Android/iOS 與測試](https://www.udemy.com/course/ultimate-compose-multiplatform-androidios-testing-kotlin/)

影片課程

</td>
<td>
Hamidreza Sahraei

Udemy

</td>

<td>
如何完全使用 Compose Multiplatform 組建功能豐富的虛擬加密貨幣錢包應用程式，不僅涵蓋核心堆疊（Ktor、Room、Koin），還包含穩健的單元/UI 測試以及進階的平台整合（如生物辨識驗證）。
</td>
<td>
約 20 歐元
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

[Kotlin/Swift 互通性百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)

文章

</td>
<td>
JetBrains

GitHub
</td>

<td>
與 iOS (Obj-C/Swift) 的互通性、SKIE、KMP-NativeCoroutines、語言特性落差的解決方案、Swift 匯出以及雙向互通性。
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

[適用於 Android 與 iOS 的多模組電子商務應用程式 (KMP)](https://www.udemy.com/course/multi-modular-ecommerce-app-for-android-ios-kmp/)

影片課程

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
完整產品生命週期，從在 Figma 中設計電子商務應用程式的 UI，到使用 Compose Multiplatform 將其組建為具備共享 UI 的完整多模組應用程式，同時建立並整合包含 Firebase 驗證、資料庫與自動化雲端函式的完整後端。
</td>
<td>
約 50 歐元
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

[使用 Kotlin Multiplatform 與 Compose 探索 Ktor](https://www.linkedin.com/learning/exploring-ktor-with-kotlin-multiplatform-and-compose)

影片課程

</td>
<td>
Troy Miles

LinkedIn Learning
</td>

<td>
如何組建全端 Kotlin 應用程式：首先建立並將安全的 Ktor 後端部署至 AWS，然後使用 Kotlin Multiplatform 搭配共享程式碼來組建呼叫該 API 的原生用戶端。
</td>
<td>
約 30–40 美元/月
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

[全端遊戲開發 - Kotlin 與 Compose Multiplatform](https://www.udemy.com/course/full-stack-game-development-kotlin-compose-multiplatform/)

影片課程

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
如何使用 Compose Multiplatform 組建完整的 2D 遊戲，涵蓋物理、碰撞偵測與精靈圖動畫，以及如何將其部署至 Android、iOS、桌面與 Web（透過 Kotlin/Wasm）。
</td>
<td>
約 99 歐元
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

[Philipp Lackner 全端組合包：KMP 與 Spring Boot](https://pl-coding.com/full-stack-bundle)

影片課程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何架構、組建並部署完整的全端聊天應用程式，涵蓋從使用 WebSocket 的多模組 Spring Boot 後端，到離線優先的 Compose Multiplatform 用戶端（Android、iOS、桌面、Web）以及完整的 CI/CD 管線。
</td>
<td>
約 429 歐元
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

[給原生行動開發團隊的 KMP 指南](https://touchlab.co/kmp-teams-intro)

文章系列

</td>
<td>
Touchlab
</td>

<td>
如何在既有的原生行動團隊中引導完整的 KMP 導入流程，從獲得初步支持與執行技術試點，到使用永續的實務工作流擴展共享程式碼庫。
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

[多平台程式庫組建 API 準則](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)

文件

</td>
<td>
JetBrains
</td>

<td>
如何遵循最大化程式碼重複使用與確保廣泛平台相容性的必備最佳實務，來設計多平台程式庫的公用 API。
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

[建立您的 Kotlin Multiplatform 程式庫](create-kotlin-multiplatform-library.md)

教學

</td>
<td>
JetBrains
</td>

<td>
如何使用官方入門範本、設定本機 Maven 發佈、組建程式庫結構以及配置發佈。
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

[使用 Dokka 製作文件](https://kotlinlang.org/docs/dokka-introduction.html)

文件

</td>
<td>
JetBrains
</td>

<td>
如何使用 Dokka 為您的 KMP 程式庫自動產生多種格式的專業 API 文件，並支援 Kotlin/Java 混合專案。
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

[KMP 程式庫範本](https://github.com/Kotlin/multiplatform-library-template)

GitHub 範本

</td>
<td>
JetBrains

GitHub
</td>

<td>
如何使用官方範本快速啟動新的 KMP 程式庫專案，該範本已預先配置了組建設定與發佈的最佳實務。
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

[發佈至 Maven Central](multiplatform-publish-libraries-to-maven.md)

教學

</td>
<td>
JetBrains
</td>

<td>
將您的 KMP 程式庫發佈到 Maven Central 的完整逐步流程，包括設定憑據、配置發佈外掛程式，以及使用 CI 自動化流程。
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

[Kotlin Multiplatform 程式庫](https://www.linkedin.com/learning/kotlin-multiplatform-libraries)

影片課程

</td>
<td>
LinkedIn Learning
</td>

<td>
建立 KMP 程式庫的完整生命週期，從有效的 API 設計與程式碼共享策略，到最終發佈與最佳實務。
</td>
<td>
約 30–40 美元/月
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

<TabItem id="intermediate" title="🌿 中階">

<include element-id="source" use-filter="empty,intermediate" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="advanced" title="🌳 進階">

<include element-id="source" use-filter="empty,advanced" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="lib-authors" title="🧩 程式庫作者">

<include element-id="source" use-filter="empty,lib-authors" from="kmp-learning-resources.md"/>

</TabItem>

</Tabs>