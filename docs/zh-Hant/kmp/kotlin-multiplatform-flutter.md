# Kotlin Multiplatform 和 Flutter：跨平台開發解決方案

<web-summary>本文探討 Kotlin Multiplatform 和 Flutter，協助您瞭解它們的功能，並為您的跨平台專案選擇最適合的方案。</web-summary>

在快速發展的科技世界中，開發人員不斷尋求高效的框架和工具以協助他們建構高品質的應用程式。然而，在眾多可能性中進行選擇時，重要的是要避免過度強調尋找所謂的「最佳」選項，因為這種方法不一定總能帶來最合適的選擇。

每個專案都是獨特的，並有其特定需求。本文旨在協助您評估您的選擇，並更好地理解哪種技術（例如 Kotlin Multiplatform 或 Flutter）最適合您的專案，以便您做出明智的決策。

## 跨平台開發：現代應用程式建構的統一方法

跨平台開發提供了一種方法，可透過單一程式碼庫建構能在多個平台上執行的應用程式，消除了為每個系統重寫相同功能的需要。雖然通常與 [行動開發](cross-platform-mobile-development.md)（針對 Android 和 iOS）相關聯，但這種方法遠不止於行動裝置，還涵蓋了網路、桌面，甚至是伺服器端環境。

其核心理念是最大限度地提高程式碼重用性，同時確保在必要時仍可實作平台特定功能，從而簡化開發流程並減少維護工作。團隊可以加快開發週期、降低成本並確保跨平台的一致性，這使得跨平台開發在當今日益多樣化的應用程式生態系統中成為明智的選擇。

## Kotlin Multiplatform 和 Flutter：簡化跨平台開發

Flutter 和 Kotlin Multiplatform 是兩種流行的跨平台技術，簡化了在不同平台上開發應用程式的過程。

### Flutter

[Flutter](https://flutter.dev/) 是一個開源框架，用於從單一程式碼庫建構原生編譯的多平台應用程式。它讓您能夠在 Android、iOS、網路、桌面（Windows、macOS、Linux）和嵌入式系統上建立豐富的應用程式體驗——所有這些都來自單一、共用的應用程式程式碼庫。Flutter 應用程式是使用 Dart 程式語言編寫的。Flutter 受到 Google 的支援和使用。

最初於 2014 年以 Sky 的名稱推出，[Flutter 1.0](https://developers.googleblog.com/en/flutter-10-googles-portable-ui-toolkit/) 於 2018 年 12 月在 Flutter Live 期間正式發布。

Flutter 開發者社群龐大且高度活躍，提供持續的改進和支援。Flutter 允許使用由 Flutter 和 Dart 生態系統中的開發人員貢獻的共用套件。

### Kotlin Multiplatform

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是一種由 JetBrains 開發的開源技術，讓開發人員能夠為 Android、iOS、網路、桌面（Windows、macOS、Linux）和伺服器端建立應用程式，使他們能夠在這些平台上高效地重用 Kotlin 程式碼，同時保留原生程式設計的優勢。

透過 Kotlin Multiplatform，您有多種選擇：您可以共用所有程式碼，除了應用程式進入點之外；共用單一邏輯片段（例如網路或資料庫模組）；或共用業務邏輯，同時保持 UI 原生。

![Kotlin Multiplatform 是一種可重用高達 100% 程式碼的技術](kmp-logic-and-ui.svg){ width="700" }

Kotlin Multiplatform 最初於 2017 年作為 Kotlin 1.2 的一部分推出。2023 年 11 月，Kotlin Multiplatform 變得 [穩定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)。在 Google I/O 2024 期間，Google 宣布其 [對 Kotlin Multiplatform 的支援](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)，用於在 Android 上共用 Android 和 iOS 之間的業務邏輯。

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="500"}](https://www.jetbrains.com/kotlin-multiplatform/)

#### Compose Multiplatform

您可以使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 在多個平台上編寫共用 UI 程式碼，這是一個由 JetBrains 開發的現代宣告式框架，該框架建構於 Kotlin Multiplatform 和 Google 的 Jetpack Compose 之上。

Compose Multiplatform 目前在 [iOS](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)、Android 和桌面端已趨於穩定，網路端則處於 Alpha 階段。

[![探索 Compose Multiplatform](explore-compose.svg){width="500"}](https://www.jetbrains.com/compose-multiplatform/)

我們的專門文章概述了 [Compose Multiplatform 和 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md) 之間的關係，並強調了主要差異。

### Kotlin Multiplatform 和 Flutter：概述

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
<td><b>靈活性和程式碼重用</b></td>
        <td>您可以共用程式碼庫的任何部分，包括業務邏輯和/或 UI，從 1% 到 100%。</td>
        <td>控制應用程式的每個像素，以建立客製化和適應性設計，並在所有平台之間實現 100% 的程式碼共用。</td>
</tr>

    
<tr>
<td><b>套件、依賴項和生態系統</b></td>
        <td>套件可從 <a href="https://central.sonatype.com/">Maven Central</a> 和其他儲存庫取得，包括
            <p><a href="http://klibs.io">klibs.io</a> (Alpha 版本)，旨在簡化 KMP 函式庫的搜尋。</p>
            <p>此 <a href="https://github.com/terrakok/kmp-awesome">清單</a> 包含一些最流行的 KMP 函式庫和工具。</p> </td>
        <td>套件可從 <a href="https://pub.dev/">Pub.dev.</a> 取得。</td>
</tr>

    
<tr>
<td><b>建構工具</b></td>
        <td>Gradle (針對 Apple 裝置的應用程式還需 Xcode)。</td>
        <td>Flutter 命令列工具 (內部使用 Gradle 和 Xcode)。</td>
</tr>

    
<tr>
<td><b>程式碼共用</b></td>
        <td>Android、iOS、網路、桌面和伺服器端。</td>
        <td>Android、iOS、網路、桌面和嵌入式裝置。</td>
</tr>

    
<tr>
<td><b>編譯</b></td>
        <td>針對桌面和 Android 編譯為 JVM 位元組碼，針對網路編譯為 JavaScript 或 Wasm，針對原生平台編譯為平台特定二進位檔。</td>
        <td>偵錯建構在虛擬機中執行 Dart 程式碼。
        <p>發行建構為原生平台輸出平台特定二進位檔，為網路輸出 JavaScript/Wasm。</p>
        </td>
</tr>

    
<tr>
<td><b>與原生 API 的通訊</b></td>
        <td>原生 API 可直接從 Kotlin 程式碼中存取，使用 <Links href="/kmp/multiplatform-expect-actual" summary="undefined">expect/actual 宣告。</Links></td>
        <td>與主機平台的通訊可透過 <a href="https://docs.flutter.dev/platform-integration/platform-channels">平台通道</a> 實現。</td>
</tr>

    
<tr>
<td><b>UI 渲染</b></td>
        <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a> 可用於跨平台共用 UI，基於 Google 的 Jetpack Compose，使用與 OpenGL、ANGLE（將 OpenGL ES 2 或 3 呼叫轉換為原生 API）、Vulkan 和 Metal 相容的 Skia 引擎。</td>
        <td>Flutter 小工具使用客製化的 <a href="https://docs.flutter.dev/perf/impeller">Impeller 引擎</a> 在螢幕上渲染，該引擎根據平台和裝置的不同，直接使用 Metal、Vulkan 或 OpenGL 與 GPU 通訊。</td>
</tr>

    
<tr>
<td><b>UI 開發迭代</b></td>
        <td>即使是通用程式碼，也可以使用 UI 預覽。
        <p>透過 <Links href="/kmp/compose-hot-reload" summary="undefined">Compose 熱重載</Links>，您可以即時看到 UI 變更，而無需重新啟動應用程式或丟失其狀態。</p></td>
        <td>VS Code 和 Android Studio 均提供 IDE 外掛程式。</td>
</tr>

    
<tr>
<td><b>使用該技術的公司</b></td>
        <td><a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>、<a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>、<a href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald’s</a>、<a href="https://www.youtube.com/watch?v=5sOXv-X43vc">Google Workspace</a>、<a href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>、<a href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>、<a href="https://touchlab.co/">TouchLab</a>、<a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a>，以及更多公司列在我們的 <Links href="/kmp/case-studies" summary="undefined">KMP 案例研究</Links> 中。</td>
        <td><a href="https://flutter.dev/showcase/xiaomi">小米</a>、<a href="https://flutter.dev/showcase/wolt">Wolt</a>、<a href="https://flutter.dev/showcase/universal-studios">環球影城</a>、<a href="https://flutter.dev/showcase/alibaba-group">阿里巴巴集團</a>、<a href="https://flutter.dev/showcase/bytedance">字節跳動</a>、<a href="https://www.geico.com/techblog/flutter-as-the-multi-channel-ux-framework/">Geico</a>、<a href="https://flutter.dev/showcase/ebay">eBay Motors</a>、<a href="https://flutter.dev/showcase/google-pay">Google Pay</a>、<a href="https://flutter.dev/showcase/so-vegan">So Vegan</a>，以及更多公司列在 <a href="https://flutter.dev/showcase">Flutter 展示</a> 中。</td>
</tr>

</table>

[![探索全球公司利用 Kotlin Multiplatform 進行跨平台開發的實際用例。](kmp-use-cases-1.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

您還可以查看 Google 的部落格文章，[讓開發人員更輕鬆地進行跨平台開發](https://developers.googleblog.com/en/making-development-across-platforms-easier-for-developers/)，其中提供了關於為您的專案選擇正確技術堆疊的指導。

如果您正在尋找 Kotlin Multiplatform 和 Flutter 之間的額外比較，您還可以觀看 Philipp Lackner 製作的 [KMP 與 Flutter 影片](https://www.youtube.com/watch?v=dzog64ENKG0)。在這部影片中，他分享了一些關於這些技術的有趣觀察，包括程式碼共用、UI 渲染、效能以及這兩種技術的未來。

透過仔細評估您的特定業務需求、目標和任務，您可以確定最符合您需求的跨平台解決方案。