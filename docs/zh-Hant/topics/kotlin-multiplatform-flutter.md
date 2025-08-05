# Kotlin Multiplatform 與 Flutter：跨平台開發解決方案

<web-summary>本文探索 Kotlin Multiplatform 與 Flutter，協助您了解它們的功能，並為您的跨平台專案選擇最合適的方案。</web-summary> 

在快速發展的科技世界中，開發者不斷尋求高效的框架與工具來建構高品質應用程式。然而，在眾多可用的選項中進行選擇時，重要的是要避免過度強調尋找所謂的最佳選項，因為這種方法可能不總是能導向最合適的選擇。

每個專案都是獨特的，並有其特定的需求。本文旨在幫助您在選擇時進行導航，更好地理解哪種技術（例如 Kotlin Multiplatform 或 Flutter）最適合您的專案，以便您能做出明智的決策。

## 跨平台開發：現代應用程式建構的統一方法

跨平台開發提供了一種方法，可使用單一程式碼庫建構能在多個平台執行的應用程式，無需為每個系統重新撰寫相同的功能。儘管常與[行動開發](cross-platform-mobile-development.md)相關聯（目標為 Android 和 iOS），但這種方法遠不止於行動裝置，還涵蓋了網路、桌面，甚至是伺服器端環境。

其核心思想是最大化程式碼重用，同時確保在必要時仍可實作平台特定的功能，從而簡化開發流程並減少維護工作。團隊可以加速開發週期、降低成本並確保跨平台的一致性，這使得跨平台開發在當今日益多樣化的應用程式環境中成為一個明智的選擇。

## Kotlin Multiplatform 與 Flutter：簡化跨平台開發

Flutter 和 Kotlin Multiplatform 是兩種流行的跨平台技術，可簡化在不同平台上的應用程式開發。

### Flutter

[Flutter](https://flutter.dev/) 是一個開源框架，用於從單一程式碼庫建構原生編譯的、多平台應用程式。它允許您在 Android、iOS、網路、桌面（Windows、macOS、Linux）和嵌入式系統上建立豐富的應用程式體驗——所有這些都來自一個共享的應用程式程式碼庫。Flutter 應用程式使用 Dart 程式語言撰寫。Flutter 由 Google 支援和使用。

Flutter 最初於 2014 年以 Sky 的名稱推出，[Flutter 1.0](https://developers.googleblog.com/en/flutter-10-googles-portable-ui-toolkit/) 則在 2018 年 12 月的 Flutter Live 活動中正式發布。

Flutter 開發者社群龐大且高度活躍，持續提供改進和支援。Flutter 允許使用 Flutter 和 Dart 生態系統中開發者貢獻的共享套件。

### Kotlin Multiplatform

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是 JetBrains 建構的一項開源技術，它允許開發者為 Android、iOS、網路、桌面（Windows、macOS、Linux）和伺服器端建立應用程式，使其能夠在這些平台之間高效地重用 Kotlin 程式碼，同時保留原生程式設計的優勢。

使用 Kotlin Multiplatform，您有多種選擇：您可以共享除應用程式進入點之外的所有程式碼，共享單一邏輯片段（例如網路或資料庫模組），或共享業務邏輯同時保持 UI 原生。

![Kotlin Multiplatform 是一種可重用高達 100% 程式碼的技術](kmp-logic-and-ui.svg){ width="700" }

Kotlin Multiplatform 最初於 2017 年作為 Kotlin 1.2 的一部分推出。2023 年 11 月，Kotlin Multiplatform 變得[穩定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)。在 Google I/O 2024 期間，Google 宣布其在 Android 上[支援 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)，用於在 Android 和 iOS 之間共享業務邏輯。

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="500"}](https://www.jetbrains.com/kotlin-multiplatform/)

#### Compose Multiplatform

您可以使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 在多個平台撰寫共享的 UI 程式碼，這是一個由 JetBrains 開發的現代聲明式框架，它基於 Kotlin Multiplatform 和 Google 的 Jetpack Compose 建構。

Compose Multiplatform 目前在 iOS、Android 和桌面端已[穩定](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)，在網路端則處於 Alpha 階段。

[![探索 Compose Multiplatform](explore-compose.svg){width="500"}](https://www.jetbrains.com/compose-multiplatform/)

我們的專屬文章概述了 [Compose Multiplatform 和 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md) 之間的關係，並強調了主要差異。

### Kotlin Multiplatform 與 Flutter：概述

<table style="both">
    <tr>
        <td></td>
        <td><b>Kotlin Multiplatform</b></td>
        <td><b>Flutter</b></td>
    </tr>
    <tr>
        <td><b>建立者</b></td>
        <td>JetBrains</td>
        <td>Google</td>
    </tr>
    <tr>
        <td><b>語言</b></td>
        <td>Kotlin</td>
        <td>Dart</td>
    </tr>
    <tr>
        <td><b>靈活性與程式碼重用</b></td>
        <td>共享您程式碼庫的任何部分，包括業務邏輯和/或 UI，從 1% 到 100%。</td>
        <td>控制應用程式的每個像素，以建立客製化和自適應的設計，並在所有平台實現 100% 的程式碼共享。</td>
    </tr>
    <tr>
        <td><b>套件、依賴項與生態系統</b></td>
        <td>套件可從 <a href="https://central.sonatype.com/">Maven Central</a> 及其他儲存庫取得，包括
            <p><a href="http://klibs.io">klibs.io</a> (Alpha 版本)，旨在簡化 KMP 函式庫的搜尋。</p>
            <p>此<a href="https://github.com/terrakok/kmp-awesome">列表</a>包含一些最流行的 KMP 函式庫和工具。</p> </td>
        <td>套件可從 <a href="https://pub.dev/">Pub.dev.</a> 取得。</td>
    </tr>
    <tr>
        <td><b>建置工具</b></td>
        <td>Gradle（加上 Xcode 用於針對 Apple 裝置的應用程式）。</td>
        <td>Flutter 命令列工具（底層使用 Gradle 和 Xcode）。</td>
    </tr>
    <tr>
        <td><b>程式碼共享</b></td>
        <td>Android、iOS、網路、桌面和伺服器端。</td>
        <td>Android、iOS、網路、桌面和嵌入式裝置。</td>
    </tr>
    <tr>
        <td><b>編譯</b></td>
        <td>編譯為桌面和 Android 的 JVM 位元組碼，網路上的 JavaScript 或 Wasm，以及原生平台的平台特定二進位檔。</td>
        <td>除錯版本在虛擬機器中執行 Dart 程式碼。
        <p>發行版本輸出原生平台的平台特定二進位檔，以及網路的 JavaScript/Wasm。</p>
        </td>
    </tr>
    <tr>
        <td><b>與原生 API 的通訊</b></td>
        <td>原生 API 可直接從 Kotlin 程式碼使用 <a href="multiplatform-expect-actual.md">expect/actual 宣告</a>存取。</td>
        <td>可透過<a href="https://docs.flutter.dev/platform-integration/platform-channels">平台通道</a>與主機平台通訊。</td>
    </tr>
    <tr>
        <td><b>UI 渲染</b></td>
        <td>可使用 <a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a> 在多個平台共享 UI，其基於 Google 的 Jetpack Compose，並使用相容於 OpenGL、ANGLE（將 OpenGL ES 2 或 3 呼叫轉換為原生 API）、Vulkan 和 Metal 的 Skia 引擎。</td>
        <td>Flutter 小工具使用自訂的 <a href="https://docs.flutter.dev/perf/impeller">Impeller 引擎</a>在螢幕上渲染，該引擎直接使用 Metal、Vulkan 或 OpenGL 與 GPU 通訊，具體取決於平台和裝置。</td>
    </tr>
    <tr>
        <td><b>UI 開發迭代</b></td>
        <td>UI 預覽即使在通用程式碼中也可用。
        <p>透過 <a href="compose-hot-reload.md">Compose Hot Reload</a>，您可以立即看到 UI 變更，無需重新啟動應用程式或丟失其狀態。</p></td>
        <td>IDE 外掛程式適用於 VS Code 和 Android Studio。</td>
    </tr>
    <tr>
        <td><b>使用該技術的公司</b></td>
        <td>[Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[Todoist](https://www.youtube.com/watch?v=z-o9MqN86eE)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc)、[Google Workspace](https://www.youtube.com/watch?v=5sOXv-X43vc)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[9gag](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[Baidu](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)、[Autodesk](https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/)、[TouchLab](https://touchlab.co/)、[Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 等更多公司列於我們的 [KMP 案例研究](case-studies.topic)中。</td>
        <td>[Xiaomi](https://flutter.dev/showcase/xiaomi)、[Wolt](https://flutter.dev/showcase/wolt)、[Universal Studios](https://flutter.dev/showcase/universal-studios)、[Alibaba Group](https://flutter.dev/showcase/alibaba-group)、[ByteDance](https://flutter.dev/showcase/bytedance)、[Geico](https://www.geico.com/techblog/flutter-as-the-multi-channel-ux-framework/)、[eBay Motors](https://flutter.dev/showcase/ebay)、[Google Pay](https://flutter.dev/showcase/google-pay)、[So Vegan](https://flutter.dev/showcase/so-vegan) 等更多公司列於 [Flutter 展示案例](https://flutter.dev/showcase)中。</td>
    </tr>
</table>

[![探索全球公司利用 Kotlin Multiplatform 進行跨平台開發的實際應用案例。](kmp-use-cases-1.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

您也可以查看 Google 的部落格文章：[Making Development Across Platforms Easier for Developers](https://developers.googleblog.com/en/making-development-across-platforms-easier-for-developers/)，該文章提供了為您的專案選擇正確技術堆疊的指導。

如果您正在尋找 Kotlin Multiplatform 和 Flutter 之間的額外比較，您也可以觀看 Philipp Lackner 製作的 [KMP vs. Flutter 影片](https://www.youtube.com/watch?v=dzog64ENKG0)。在這部影片中，他分享了關於這些技術在程式碼共享、UI 渲染、效能以及兩者未來方面的一些有趣觀察。

透過仔細評估您特定的業務需求、目標和任務，您可以找出最符合您需求的跨平台解決方案。