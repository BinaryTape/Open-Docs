[//]: # (title: Ktor 版本)

<show-structure for="chapter" depth="2"/>

Ktor 遵循 [語義化版本控制](https://semver.org/)：

- _主要版本_ (x.0.0) 包含不相容的 API 變更。
- _次要版本_ (x.y.0) 提供向後相容的新功能。
- _修補版本_ (x.y.z) 包含向後相容的修正。

對於每個主要和次要版本，我們也提供多個預覽 (EAP) 版本，供您在功能發佈前試用新功能。更多詳細資訊，請參閱[搶先體驗計劃](https://ktor.io/eap/)。

## Gradle 外掛程式 {id="gradle"}

[Gradle Ktor 外掛程式](https://github.com/ktorio/ktor-build-plugins) 與框架處於相同的發佈週期。您可以在 [Gradle 外掛程式入口網站](https://plugins.gradle.org/plugin/io.ktor.plugin) 上找到所有外掛程式版本。

## IntelliJ Ultimate 外掛程式 {id="intellij"}

[IntelliJ Ktor 外掛程式](https://www.jetbrains.com/help/idea/ktor.html) 獨立於 Ktor 框架發佈，並使用與 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html) 相同的發佈週期。

### 更新至新版本 {id="update"}

IntelliJ Ktor 外掛程式允許您將 Ktor 專案遷移至最新版本。您可以從[遷移專案](https://www.jetbrains.com/help/idea/ktor.html#migrate)部分了解更多資訊。

## 版本詳細資訊 {id="release-details"}

下表列出了最新 Ktor 版本的詳細資訊。

<table>
<tr><td>版本</td><td>發佈日期</td><td>重點</td></tr>
<tr><td>3.1.3</td><td>May 5, 2025</td><td><p>
修補版本，包含效能改進，例如更快的
<a href="https://youtrack.jetbrains.com/issue/KTOR-8412">
位元組操作
</a>
和
<a href="https://youtrack.jetbrains.com/issue/KTOR-8407">
多部分處理
</a>
，以及
<a href="https://youtrack.jetbrains.com/issue/KTOR-8107">
更安全的令牌刷新處理
</a>。它還修復了
<a href="https://youtrack.jetbrains.com/issue/KTOR-8276">
指標中的記憶體問題
</a>，
<a href="https://youtrack.jetbrains.com/issue/KTOR-8326">
改進了標頭行為
</a>，並解決了 WebSocket、OkHttp、Apache5 和 Netty 中的錯誤，並
<a href="https://youtrack.jetbrains.com/issue/KTOR-8030">
更新了 JTE 以支援 Kotlin 2.1.0
</a>。
</p>
<var name="version" value="3.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.2</td><td>March 27, 2025</td><td><p>
修補版本，將 Kotlin 更新至 2.1.20 並修復了多個問題，包括 Base64 解碼、授權令牌清除、Android 伺服器啟動錯誤、WebSocket 標頭格式設定和 SSE 會話取消。
</p>
<var name="version" value="3.1.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.1</td><td>February 24, 2025</td><td><p>
修補版本，改進了日誌記錄並修復了 WebSocket 超時處理。它修復了多個錯誤，包括 HTTP 快取不一致、表單資料複製錯誤、gzip 處理崩潰以及導致區段池損壞的並發問題。
</p>
<var name="version" value="3.1.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.0</td><td>February 11, 2025</td><td><p>
次要版本，引入了各種 SSE 功能以及擴展的 CIO 引擎和 WebSocket 支援。它增強了平台相容性、日誌記錄和身份驗證，同時修復了與位元組通道處理、HTTP 請求失敗和並發問題相關的關鍵錯誤。
</p>
<var name="version" value="3.1.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.3</td><td>December 18, 2024</td><td><p>
修補版本，包含各種錯誤修正，包括修復 `browserProductionWebpack` 中的建置錯誤、gzipped 內容處理和 `FormFieldLimit` 配置覆寫。此版本還包括核心效能改進和正確的測試應用程式關閉。
</p>
<var name="version" value="3.0.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.2</td><td>December 4, 2024</td><td><p>
修補版本，解決了與響應損壞、截斷的主體、連接處理和不正確標頭相關的多個錯誤修正，同時擴展了二進位編碼支援和 Android 的效能增強。
</p>
<var name="version" value="3.0.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.13</td><td>November 20, 2024</td><td><p>
修補版本，包含錯誤修正、安全修補程式和改進，包括新增了對 `watchosDeviceArm64` 目標的支援。
</p>
<var name="version" value="2.3.13"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.1</td><td>October 29, 2024</td><td><p>
修補版本，包含客戶端和伺服器日誌記錄的改進，以及各種錯誤修正。
</p>
<var name="version" value="3.0.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0</td><td>October 9, 2024</td><td><p>
主要版本，包含改進和錯誤修正，包括新增了對 Android 原生目標的支援。有關破壞性變更的更多資訊，請參閱<a href="https://ktor.io/docs/migrating-3.html">遷移指南</a>。
</p>
<var name="version" value="3.0.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-rc-2</td><td>October 2, 2024</td><td><p>
主要發佈候選版本，包含各種改進（附帶破壞性變更）、錯誤修正和功能，例如 XML 的多平台支援。
</p>
<var name="version" value="3.0.0-rc-2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-rc-1</td><td>September 9, 2024</td><td><p>
主要發佈候選版本，包含顯著改進和錯誤修正。此更新增強了向後相容性並支援擴展的 `staticZip`。有關破壞性變更的更多資訊，請參閱<a href="https://ktor.io/docs/eap/migrating-3.html">遷移指南</a>。
</p>
<var name="version" value="3.0.0-rc-1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-beta-2</td><td>July 15, 2024</td><td><p>
主要預發佈版本，包含各種改進和錯誤修正，包括 SSE 支援改進和用於 Kotlin/Wasm 的 Ktor 客戶端。有關破壞性變更的更多資訊，請參閱<a href="https://ktor.io/docs/3.0.0-beta-2/migrating-3.html">遷移指南</a>。
</p>
<var name="version" value="3.0.0-beta-2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.12</td><td>June 20, 2024</td><td><p>
修補版本，包含 Ktor Core 和 Ktor Server 中的錯誤修正，以及 Netty 和 OpenAPI 的版本更新。
</p>
<var name="version" value="2.3.12"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.11</td><td>May 9, 2024</td><td><p>
修補版本，包含一個錯誤修正，用於將 Socket 超時應用於測試客戶端的引擎。
</p>
<var name="version" value="2.3.11"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.10</td><td>April 8, 2024</td><td><p>
修補版本，包含 CallLogging 和 SSE 伺服器外掛程式的各種錯誤修正，改進了 Android 客戶端日誌記錄等。
</p>
<var name="version" value="2.3.10"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.9</td><td>March 4, 2024</td><td><p>
修補版本，包含 ContentNegotiation 客戶端外掛程式的一個錯誤修正，並新增了透過 HTTP 發送安全 Cookie 的支援。
</p>
<var name="version" value="2.3.9"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.8</td><td>January 31, 2024</td><td><p>
修補版本，包含 URLBuilder、CORS 和 WebSocket 外掛程式的各種錯誤修正。
</p>
<var name="version" value="2.3.8"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.7</td><td>December 7, 2023</td><td>
<p>
修補版本，包含 ContentNegotiation、WebSockets 和原生伺服器中記憶體使用情況的錯誤修正。
</p>
<var name="version" value="2.3.7"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-beta-1</td><td>November 23, 2023</td><td>
<p>
主要預發佈版本，包含各種改進和錯誤修正，包括客戶端和伺服器 SSE 支援。
</p>
<var name="version" value="3.0.0-beta-1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.6</td><td>November 7, 2023</td><td>
<p>
修補版本，包含對 `2.3.5` 中破壞性變更的修正以及各種其他錯誤修正。
</p>
<var name="version" value="2.3.6"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.5</td><td>October 5, 2023</td><td>
<p>
修補版本，包含 Darwin 和 Apache5 引擎配置中的修正。
</p>
<var name="version" value="2.3.5"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.4</td><td>August 31, 2023</td><td>
<p>
修補版本，包含 HTTP Cookie 標頭中的錯誤修正以及 NoTransformationFoundException 錯誤。
</p>
<var name="version" value="2.3.4"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.3</td><td>August 1, 2023</td><td>
<p>
修補版本，包含客戶端和伺服器對 `linuxArm64` 的支援以及各種錯誤修正。
</p>
<var name="version" value="2.3.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.2</td><td>June 28, 2023</td><td>
<p>
修補版本，將 Kotlin 版本升級至 `1.8.22` 並包含各種錯誤修正。
</p>
<var name="version" value="2.3.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.1</td><td>May 31, 2023</td><td>
<p>
修補版本，包含伺服器配置的改進以及各種錯誤修正。
</p>
<var name="version" value="2.3.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.0</td><td>April 19, 2023</td><td>
<p>
功能發佈版本，新增了對多個配置文件、路由中的正規表達式模式等的支援。
</p>
<var name="version" value="2.3.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.4</td><td>February 28, 2023</td><td>
<p>
修補版本，包含 HTTP 客戶端、路由和 ContentNegotiation 中的各種錯誤修正。
</p>
<var name="version" value="2.2.4"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.3</td><td>January 31, 2023</td><td>
<p>
修補版本，包含 OAuth2 的多平台功能以及各種錯誤修正。
</p>
<var name="version" value="2.2.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.2</td><td>January 3, 2023</td><td>
<p>
修補版本，包含對 `2.2.1` 的錯誤修正、Swagger 外掛程式中的改進和修正等。
</p>
<var name="version" value="2.2.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.1</td><td>December 7, 2022</td><td>
<p>
修補版本，針對 `2.2.0` 中的 `java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU` 錯誤。
</p>
<var name="version" value="2.2.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.0</td><td>December 7, 2022</td><td>
<p>
多功能發佈版本，包括 Swagger UI 託管、新的外掛程式 API、Sessions 的多平台支援等。更多資訊請參閱<a href="migration-to-22x.md">從 2.0.x 遷移至 2.2.x</a> 指南。
</p>
<var name="version" value="2.2.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.3</td><td>October 26, 2022</td><td>
<p>
修補版本，包含各種錯誤修正。
</p>
<var name="version" value="2.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.2</td><td>September 29, 2022</td><td>
<p>
修補版本，包含路由、測試引擎和 Ktor 客戶端的錯誤修正。
</p>
<var name="version" value="2.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.1</td><td>September 6, 2022</td><td>
<p>
修補版本，包含 Ktor 客戶端和伺服器中的各種錯誤修正。
</p>
<var name="version" value="2.1.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.0</td><td>August 11, 2022</td><td>
<p>
次要版本，新增了對 YAML 配置的支援以及各種其他改進和錯誤修正。
</p>
<var name="version" value="2.1.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.3</td><td>June 28, 2022</td><td>
<p>
修補版本，包含錯誤修正並將 `kotlinx.coroutines` 版本升級至 `1.6.2`。
</p>
<var name="version" value="2.0.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.2</td><td>May 27, 2022</td><td>
<p>
修補版本，包含各種改進、錯誤修正和依賴項版本升級。
</p>
<var name="version" value="2.0.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.1</td><td>April 28, 2022</td><td>
<p>
修補版本，包含各種錯誤修正並將 Kotlin 版本更新至 `1.6.21`。
</p>
<var name="version" value="2.0.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.0</td><td>April 11, 2022</td><td>
<p>
主要版本，更新了 API 文件並包含了各種新功能。有關破壞性變更以及如何從 `1.x.x` 遷移的更多資訊，請參閱<a href="migration-to-20x.md">遷移指南</a>。
</p>
<var name="version" value="2.0.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>1.6.8</td><td>March 15, 2022</td><td>
<p>
修補版本，包含依賴項版本升級。
</p>
<var name="version" value="1.6.8"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
</table>