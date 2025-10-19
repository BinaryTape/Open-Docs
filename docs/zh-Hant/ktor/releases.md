[//]: # (title: Ktor 發行版本)

<show-structure for="chapter" depth="2"/>

Ktor 遵循 [語義化版本控制](https://semver.org/)：

- _主要版本_ (x.0.0) 包含不相容的 API 變更。
- _次要版本_ (x.y.0) 提供向後相容的新功能。
- _修補程式版本_ (x.y.z) 包含向後相容的修正。

對於每個主要和次要發行版本，我們還會發布多個預覽 (EAP) 版本，供您在發布前試用新功能。欲了解更多詳情，請參閱 [搶先體驗計劃](https://ktor.io/eap/)。

## Gradle 外掛程式 {id="gradle"}

[Gradle Ktor 外掛程式](https://github.com/ktorio/ktor-build-plugins) 和框架處於相同的發行週期。您可以在 [Gradle 外掛程式入口網站](https://plugins.gradle.org/plugin/io.ktor.plugin) 上找到所有外掛程式發行版本。

## IntelliJ Ultimate 外掛程式 {id="intellij"}

[IntelliJ Ktor 外掛程式](https://www.jetbrains.com/help/idea/ktor.html) 獨立於 Ktor 框架發行，並與 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html) 使用相同的發行週期。

### 更新至新發行版本 {id="update"}

IntelliJ Ktor 外掛程式允許您將 Ktor 專案遷移到最新版本。您可以從 [遷移專案](https://www.jetbrains.com/help/idea/ktor.html#migrate) 部分了解更多資訊。

## 發行詳情 {id="release-details"}

下表列出了最新 Ktor 發行版本的詳細資訊。

<table>

<tr>
<td>版本</td><td>發行日期</td><td>重點</td>
</tr>

<tr>
<td>3.3.1</td><td>October 8, 2025</td><td>
<p>
一個修補程式版本，將 Kotlin 更新至 2.2.20，並修正了多個問題，包括 Content-Length parsing errors、<code>ClientSSESession</code> 缺少 serializers、Netty configuration 和 shutdown bugs，並增加了對在 bootJar 中提供 static resources 的支援。
</p>
<var name="version" value="3.3.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.3.0</td><td>September 11, 2025</td><td>
<p>
一個次要版本，引入了實驗性的 OpenAPI 生成預覽、改進的靜態內容處理、適用於 Android 和 JS/Wasm 的 WebRTC 用戶端等主要功能，並升級至 Jetty、OkHttp 和 Kotlin 2.2。欲了解更多資訊，請參閱 <Links href="/ktor/whats-new-330" summary="undefined">Ktor 3.3.0 中的新功能</Links>。
</p>
<var name="version" value="3.3.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.2.3</td><td>July 29, 2025</td><td>
<p>
一個修補程式版本，引入了對 YAML config 處理、DI resolution 和 Wasm/JS stability 的改進，以及對 multipart parsing、CIO <code>100 Continue</code> response formatting、<code>ByteReadChannel</code> 中的無限讀取迴圈，以及伺服器關閉問題的修正。
</p>
<var name="version" value="3.2.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.2.2</td><td>July 14, 2025</td><td>
<p>
一個修補程式版本，改進了 SSE field serialization order，並解決了多個問題，包括 CORS preflight handling、test application streaming、configuration deserialization bugs，以及跨平台缺少標頭的問題——包括來自 3.2.1 影響 wasmJs 和 Darwin targets 的迴歸。
</p>
<var name="version" value="3.2.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.2.1</td><td>July 4, 2025</td><td>
<p>
一個修補程式版本，包括對 time APIs、templating 和 publishing 的改進，以及對 plugin behavior、Netty、OkHttp 和 3.2.0 中引入的 startup issues 的關鍵錯誤修正。
</p>
<var name="version" value="3.2.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.2.0</td><td>June 12, 2025</td><td>
<p>
一個次要版本，引入了 typed configuration deserialization、新的 dependency injection 和 HTMX modules、Gradle version catalog support 和 suspend module support。欲了解更多資訊，請參閱 <Links href="/ktor/whats-new-320" summary="undefined">Ktor 3.2.0 中的新功能</Links>。
</p>
<var name="version" value="3.2.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.1.3</td><td>May 5, 2025</td><td><p>
一個修補程式版本，包括性能改進，例如更快的 byte operations 和 multipart handling，以及更安全的 token refresh handling。它還修正了 metrics 中的 memory issues，改進了 header behavior，並解決了 WebSockets、OkHttp、Apache5 和 Netty 中的 bugs，此外還更新了 JTE 以支援 Kotlin 2.1.0。
</p>
<var name="version" value="3.1.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.1.2</td><td>March 27, 2025</td><td><p>
一個修補程式版本，將 Kotlin 更新至 2.1.20，並修正了各種問題，包括 Base64 decoding、auth token clearing、Android server startup errors、WebSocket header formatting 和 SSE session cancellation。
</p>
<var name="version" value="3.1.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.1.1</td><td>February 24, 2025</td><td><p>
一個修補程式版本，改進了 logging 並修正了 WebSocket timeout handling。它修正了多個 bugs，包括 HTTP cache inconsistencies、form data copying errors、gzip handling crashes 以及導致 segment pool corruption 的 concurrency issues。
</p>
<var name="version" value="3.1.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.1.0</td><td>February 11, 2025</td><td><p>
一個次要版本，引入了各種 SSE features 以及 extended CIO engine 和 WebSocket support。它增強了 platform compatibility、logging 和 authentication，同時修正了與 byte channel handling、HTTP request failures 和 concurrency issues 相關的 critical bugs。
</p>
<var name="version" value="3.1.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.0.3</td><td>December 18, 2024</td><td><p>
一個修補程式版本，包含各種 bug fixes，包括修正 <code>browserProductionWebpack</code> 中的 build errors、gzipped content handling 和 <code>FormFieldLimit</code> configuration overwrites。此版本還包括 core performance improvements 和 proper test application shutdown。
</p>
<var name="version" value="3.0.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.0.2</td><td>December 4, 2024</td><td><p>
一個修補程式版本，解決了與 response corruption、truncated bodies、connection handling 和 incorrect headers 相關的多個 bug fixes，以及 extended binary encoding support 和 Android 的 performance enhancements。
</p>
<var name="version" value="3.0.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.13</td><td>November 20, 2024</td><td><p>
一個修補程式版本，包含 bug fixes、security patches 和 improvements，包括對 <code>watchosDeviceArm64</code> target 的支援。
</p>
<var name="version" value="2.3.13"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.0.1</td><td>October 29, 2024</td><td><p>
一個修補程式版本，包括 client 和 server logging 的 improvements，以及各種 bug fixes。
</p>
<var name="version" value="3.0.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0</td><td>October 9, 2024</td><td><p>
一個主要版本，包含 improvements 和 bug fixes，包括對 Android Native targets 的支援。有關破壞性變更的更多資訊，請參閱 <Links href="/ktor/migrating-3" summary="undefined">遷移指南</Links>。
</p>
<var name="version" value="3.0.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-rc-2</td><td>October 2, 2024</td><td><p>
一個主要 release candidate，包含各種帶有破壞性變更、bug fixes 和 features 的 improvements，例如針對 XML 的 multiplatform support。
</p>
<var name="version" value="3.0.0-rc-2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-rc-1</td><td>September 9, 2024</td><td><p>
一個主要 release candidate，包含 significant improvements 和 bug fixes。此更新增強了 backward compatibility 並具有 extended <code>staticZip</code> support。
</p>
<var name="version" value="3.0.0-rc-1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-beta-2</td><td>July 15, 2024</td><td><p>
一個主要 pre-release version，包含各種 improvements 和 bug fixes，包括 SSE support improvements 和適用於 Kotlin/Wasm 的 Ktor client。
</p>
<var name="version" value="3.0.0-beta-2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.12</td><td>June 20, 2024</td><td><p>
一個修補程式版本，包括 Ktor Core 和 Ktor Server 中的 bug fixes，以及 Netty 和 OpenAPI 的 version updates。
</p>
<var name="version" value="2.3.12"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.11</td><td>May 9, 2024</td><td><p>
一個修補程式版本，包括一個用於將 socket timeout 應用於 Test Client 的 engine 的 bug fix。
</p>
<var name="version" value="2.3.11"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.10</td><td>April 8, 2024</td><td><p>
一個修補程式版本，包括 CallLogging 和 SSE server plugins 的各種 bug fixes，improved Android client logging 等。
</p>
<var name="version" value="2.3.10"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.9</td><td>March 4, 2024</td><td><p>
一個修補程式版本，包括 ContentNegotiation client plugin 的一個 bug fix，以及對透過 HTTP 傳送 secure cookies 的支援。
</p>
<var name="version" value="2.3.9"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.8</td><td>January 31, 2024</td><td><p>
一個修補程式版本，包括 URLBuilder、CORS 和 WebSocket plugins 的各種 bug fixes。
</p>
<var name="version" value="2.3.8"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.7</td><td>December 7, 2023</td><td>
<p>
一個修補程式版本，包括 ContentNegotiation、WebSockets 中的 bug fixes，以及 Native Server 中的 memory usage。
</p>
<var name="version" value="2.3.7"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-beta-1</td><td>November 23, 2023</td><td>
<p>
一個主要 pre-release version，包含各種 improvements 和 bug fixes，包括 client 和 server SSE support。
</p>
<var name="version" value="3.0.0-beta-1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.6</td><td>November 7, 2023</td><td>
<p>
一個修補程式版本，包括對 2.3.5 中破壞性變更的 fix 以及各種其他 bug fixes。
</p>
<var name="version" value="2.3.6"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.5</td><td>October 5, 2023</td><td>
<p>
一個修補程式版本，包括 Darwin 和 Apache5 engine configurations 中的 fixes。
</p>
<var name="version" value="2.3.5"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.4</td><td>August 31, 2023</td><td>
<p>
一個修補程式版本，包括 HTTP Cookie header 中的 bug fix 和 NoTransformationFoundException error。
</p>
<var name="version" value="2.3.4"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.3</td><td>August 1, 2023</td><td>
<p>
一個修補程式版本，包括對 <code>linuxArm64</code> 的 client 和 server support 以及各種 bug fixes。
</p>
<var name="version" value="2.3.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.2</td><td>June 28, 2023</td><td>
<p>
一個修補程式版本，將 Kotlin version 升級到 <code>1.8.22</code>，並包含各種 bug fixes。
</p>
<var name="version" value="2.3.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.1</td><td>May 31, 2023</td><td>
<p>
一個修補程式版本，包括 server configurations 的 improvements 以及各種 bug fixes。
</p>
<var name="version" value="2.3.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.3.0</td><td>April 19, 2023</td><td>
<p>
一個 feature release，增加了對 multiple configuration files、Routing 中的 regex patterns 等的 support。
</p>
<var name="version" value="2.3.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.2.4</td><td>February 28, 2023</td><td>
<p>
一個修補程式版本，包含 HTTP client、Routing 和 ContentNegotiation 中的各種 bug fixes。
</p>
<var name="version" value="2.2.4"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.2.3</td><td>January 31, 2023</td><td>
<p>
一個修補程式版本，包括針對 OAuth2 的 multiplatform functionality 以及各種 bug fixes。
</p>
<var name="version" value="2.2.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.2.2</td><td>January 3, 2023</td><td>
<p>
一個修補程式版本，包括對 <code>2.2.1</code> 的 bug fix、Swagger plugin 中的 improvements 和 fixes 等。
</p>
<var name="version" value="2.2.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.2.1</td><td>December 7, 2022</td><td>
<p>
一個修補程式版本，用於解決 <code>2.2.0</code> 中的 <code>java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU</code> error。
</p>
<var name="version" value="2.2.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.2.0</td><td>December 7, 2022</td><td>
<p>
一個 multiple feature release，包括 Swagger UI hosting、new plugins API、針對 Sessions 的 multiplatform support 等。欲了解更多資訊，請參閱 <Links href="/ktor/migration-to-22x" summary="undefined">從 2.0.x 遷移到 2.2.x</Links> 指南。
</p>
<var name="version" value="2.2.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.1.3</td><td>October 26, 2022</td><td>
<p>
一個修補程式版本，包含各種 bug fixes。
</p>
<var name="version" value="2.1.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.1.2</td><td>September 29, 2022</td><td>
<p>
一個修補程式版本，包括 Routing、Testing engine 和 Ktor client 中的 bug fixes。
</p>
<var name="version" value="2.1.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.1.1</td><td>September 6, 2022</td><td>
<p>
一個修補程式版本，包含 Ktor client 和 server 中的各種 bug fixes。
</p>
<var name="version" value="2.1.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.1.0</td><td>August 11, 2022</td><td>
<p>
一個次要版本，增加了對 YAML configuration 的 support 以及各種其他 improvements 和 bug fixes。
</p>
<var name="version" value="2.1.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.0.3</td><td>June 28, 2022</td><td>
<p>
一個修補程式版本，包含 bug fixes 並將 <code>kotlinx.coroutines</code> version 升級到 <code>1.6.2</code>。
</p>
<var name="version" value="2.0.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.0.2</td><td>May 27, 2022</td><td>
<p>
一個修補程式版本，包含各種 improvements、bug fixes 和 dependencies version upgrades。
</p>
<var name="version" value="2.0.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.0.1</td><td>April 28, 2022</td><td>
<p>
一個修補程式版本，包含各種 bug fixes 並將 Kotlin version 更新到 <code>1.6.21</code>。
</p>
<var name="version" value="2.0.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>2.0.0</td><td>April 11, 2022</td><td>
<p>
一個主要版本，帶有 updated API docs 和各種 new features。有關破壞性變更以及如何從 <code>1.x.x</code> 遷移的更多資訊，請參閱 <Links href="/ktor/migration-to-20x" summary="undefined">遷移指南</Links>。
</p>
<var name="version" value="2.0.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

<tr>
<td>1.6.8</td><td>March 15, 2022</td><td>
<p>
一個修補程式版本，包含 dependencies version upgrades。
</p>
<var name="version" value="1.6.8"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
</p>
</td>
</tr>

</table>