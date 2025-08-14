[//]: # (title: Ktor 發行版)

<show-structure for="chapter" depth="2"/>

Ktor 遵循 [語意化版本控制](https://semver.org/)：

- _主要版本_ (x.0.0) 包含不相容的 API 變更。
- _次要版本_ (x.y.0) 提供向下相容的新功能。
- _修補程式版本_ (x.y.z) 包含向下相容的修正。

對於每個主要和次要發行版，我們還提供多個預覽 (EAP) 版本，供您在新功能發佈前搶先體驗。有關更多詳細資訊，請參閱 [搶先體驗計畫](https://ktor.io/eap/)。

## Gradle 外掛程式 {id="gradle"}

[Gradle Ktor 外掛程式](https://github.com/ktorio/ktor-build-plugins) 與框架處於相同的發行週期。您可以在 [Gradle 外掛程式入口](https://plugins.gradle.org/plugin/io.ktor.plugin)上找到所有外掛程式發行版。

## IntelliJ Ultimate 外掛程式 {id="intellij"}

[IntelliJ Ktor 外掛程式](https://www.jetbrains.com/help/idea/ktor.html) 獨立於 Ktor 框架發行，並使用與 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html) 相同的發行週期。

### 更新到新發行版 {id="update"}

IntelliJ Ktor 外掛程式允許您將 Ktor 專案遷移到最新版本。您可以從[遷移專案](https://www.jetbrains.com/help/idea/ktor.html#migrate)部分了解更多資訊。

## 發行詳細資訊 {id="release-details"}

下表列出了最新 Ktor 發行版的詳細資訊。

<table>
<tr><td>版本</td><td>發行日期</td><td>重點</td></tr>
<tr><td>3.2.3</td><td>July 29, 2025</td><td>
<p>
一個修補程式發行版，引入了 YAML 設定處理、DI 解析和 Wasm/JS 穩定性的改進，同時修正了多部分解析、CIO <code>100 Continue</code> 回應格式化、<code>ByteReadChannel</code> 中的無限讀取迴圈以及伺服器關閉問題。
</p>
<var name="version" value="3.2.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.2.2</td><td>July 14, 2025</td><td>
<p>
一個修補程式發行版，改進了 SSE 欄位序列化順序並解決了多個問題，包括 CORS 預檢處理、測試應用程式串流、設定反序列化錯誤以及跨平台缺少標頭的問題，包括 3.2.1 引起的影響 wasmJs 和 Darwin 目標的回歸問題。
</p>
<var name="version" value="3.2.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.2.1</td><td>July 4, 2025</td><td>
<p>
一個修補程式發行版，包含了時間 API、模板化和發佈的改進，以及針對外掛程式行為、Netty、OkHttp 和 3.2.0 中引入的啟動問題的關鍵錯誤修正。
</p>
<var name="version" value="3.2.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.2.0</td><td>June 12, 2025</td><td>
<p>
一個次要發行版，引入了類型化設定反序列化、新的依賴注入和 HTMX 模組、Gradle 版本目錄支援以及暫停模組支援。有關更多資訊，請參閱<Links href="/ktor/whats-new-320" summary="undefined">Ktor 3.2.0 的新功能</Links>。
</p>
<var name="version" value="3.2.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.1.3</td><td>May 5, 2025</td><td><p>
一個修補程式發行版，包括性能改進，例如更快的位元組操作和多部分處理，以及更安全的權杖刷新處理。它還修正了指標中的記憶體問題，改進了標頭行為，並解決了 WebSockets、OkHttp、Apache5 和 Netty 中的錯誤，並更新了 JTE 以支援 Kotlin 2.1.0。
</p>
<var name="version" value="3.1.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.1.2</td><td>March 27, 2025</td><td><p>
一個修補程式發行版，將 Kotlin 更新到 2.1.20 並修正了各種問題，包括 Base64 解碼、身份驗證權杖清除、Android 伺服器啟動錯誤、WebSocket 標頭格式化和 SSE 工作階段取消。
</p>
<var name="version" value="3.1.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.1.1</td><td>February 24, 2025</td><td><p>
一個修補程式發行版，改進了日誌記錄並修正了 WebSocket 逾時處理。它修正了多個錯誤，包括 HTTP 快取不一致、表單資料複製錯誤、gzip 處理崩潰以及導致區段池損壞的併發問題。
</p>
<var name="version" value="3.1.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.1.0</td><td>February 11, 2025</td><td><p>
一個次要發行版，引入了各種 SSE 功能以及擴展的 CIO 引擎和 WebSocket 支援。它增強了平台相容性、日誌記錄和身份驗證，同時修正了與位元組通道處理、HTTP 請求失敗和併發問題相關的關鍵錯誤。
</p>
<var name="version" value="3.1.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.0.3</td><td>December 18, 2024</td><td><p>
一個修補程式發行版，包含各種錯誤修正，包括修正 <code>browserProductionWebpack</code> 中的構建錯誤、gzipped 內容處理和 <code>FormFieldLimit</code> 設定覆蓋。此發行版還包括核心性能改進和正確的測試應用程式關閉。
</p>
<var name="version" value="3.0.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.0.2</td><td>December 4, 2024</td><td><p>
一個修補程式發行版，解決了與回應損壞、截斷的主體、連線處理和不正確的標頭相關的多個錯誤，同時擴展了二進位編碼支援並改進了 Android 的性能。
</p>
<var name="version" value="3.0.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.13</td><td>November 20, 2024</td><td><p>
一個修補程式發行版，包含錯誤修正、安全修補程式和改進，包括增加了對 <code>watchosDeviceArm64</code> 目標的支援。
</p>
<var name="version" value="2.3.13"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.0.1</td><td>October 29, 2024</td><td><p>
一個修補程式發行版，包括用戶端和伺服器日誌記錄的改進，以及各種錯誤修正。
</p>
<var name="version" value="3.0.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.0.0</td><td>October 9, 2024</td><td><p>
一個主要發行版，包含改進和錯誤修正，包括增加了對 Android Native 目標的支援。有關破壞性變更的更多資訊，請參閱<Links href="/ktor/migrating-3" summary="undefined">遷移指南</Links>。
</p>
<var name="version" value="3.0.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-rc-2</td><td>October 2, 2024</td><td><p>
一個主要發行候選版，包含各種帶有破壞性變更的改進、錯誤修正和功能，例如 XML 的多平台支援。
</p>
<var name="version" value="3.0.0-rc-2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-rc-1</td><td>September 9, 2024</td><td><p>
一個主要發行候選版，包含顯著的改進和錯誤修正。此更新增強了向下相容性並具備擴展的 <code>staticZip</code> 支援。
</p>
<var name="version" value="3.0.0-rc-1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-beta-2</td><td>July 15, 2024</td><td><p>
一個主要的預發行版本，包含各種改進和錯誤修正，包括 SSE 支援改進和適用於 Kotlin/Wasm 的 Ktor 用戶端。
</p>
<var name="version" value="3.0.0-beta-2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.12</td><td>June 20, 2024</td><td><p>
一個修補程式發行版，包含 Ktor Core 和 Ktor Server 中的錯誤修正，以及 Netty 和 OpenAPI 的版本更新。
</p>
<var name="version" value="2.3.12"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.11</td><td>May 9, 2024</td><td><p>
一個修補程式發行版，包含一個錯誤修正，用於將 socket 逾時應用於測試用戶端的引擎。
</p>
<var name="version" value="2.3.11"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.10</td><td>April 8, 2024</td><td><p>
一個修補程式發行版，包括針對 CallLogging 和 SSE 伺服器外掛程式的各種錯誤修正，改進了 Android 用戶端日誌記錄等。
</p>
<var name="version" value="2.3.10"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.9</td><td>March 4, 2024</td><td><p>
一個修補程式發行版，包括 ContentNegotiation 用戶端外掛程式的錯誤修正，以及增加了透過 HTTP 傳送安全 Cookie 的支援。
</p>
<var name="version" value="2.3.9"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.8</td><td>January 31, 2024</td><td><p>
一個修補程式發行版，包括針對 URLBuilder、CORS 和 WebSocket 外掛程式的各種錯誤修正。
</p>
<var name="version" value="2.3.8"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.7</td><td>December 7, 2023</td><td>
<p>
一個修補程式發行版，包括 ContentNegotiation、WebSockets 中的錯誤修正，以及 Native Server 中的記憶體使用。
</p>
<var name="version" value="2.3.7"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-beta-1</td><td>November 23, 2023</td><td>
<p>
一個主要預發行版本，包含各種改進和錯誤修正，包括用戶端和伺服器 SSE 支援。
</p>
<var name="version" value="3.0.0-beta-1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.6</td><td>November 7, 2023</td><td>
<p>
一個修補程式發行版，包含對 2.3.5 中破壞性變更的修正以及各種其他錯誤修正。
</p>
<var name="version" value="2.3.6"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.5</td><td>October 5, 2023</td><td>
<p>
一個修補程式發行版，包括 Darwin 和 Apache5 引擎設定中的修正。
</p>
<var name="version" value="2.3.5"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.4</td><td>August 31, 2023</td><td>
<p>
一個修補程式發行版，包括 HTTP Cookie 標頭和 NoTransformationFoundException 錯誤的錯誤修正。
</p>
<var name="version" value="2.3.4"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.3</td><td>August 1, 2023</td><td>
<p>
一個修補程式發行版，包括對 <code>linuxArm64</code> 的用戶端和伺服器支援以及各種錯誤修正。
</p>
<var name="version" value="2.3.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.2</td><td>June 28, 2023</td><td>
<p>
一個修補程式發行版，將 Kotlin 版本升級到 <code>1.8.22</code> 並修正了各種錯誤。
</p>
<var name="version" value="2.3.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.1</td><td>May 31, 2023</td><td>
<p>
一個修補程式發行版，包括伺服器設定的改進和各種錯誤修正。
</p>
<var name="version" value="2.3.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.3.0</td><td>April 19, 2023</td><td>
<p>
一個功能發行版，增加了對多個設定檔、路由中的正規表達式模式等的支援。
</p>
<var name="version" value="2.3.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.2.4</td><td>February 28, 2023</td><td>
<p>
一個修補程式發行版，包含 HTTP 用戶端、路由和 ContentNegotiation 中的各種錯誤修正。
</p>
<var name="version" value="2.2.4"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.2.3</td><td>January 31, 2023</td><td>
<p>
一個修補程式發行版，包括 OAuth2 的多平台功能和各種錯誤修正。
</p>
<var name="version" value="2.2.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.2.2</td><td>January 3, 2023</td><td>
<p>
一個修補程式發行版，包括對 <code>2.2.1</code> 的錯誤修正、Swagger 外掛程式中的改進和修正等。
</p>
<var name="version" value="2.2.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.2.1</td><td>December 7, 2022</td><td>
<p>
針對 <code>2.2.0</code> 中 <code>java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU</code> 錯誤的修補程式發行版。
</p>
<var name="version" value="2.2.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.2.0</td><td>December 7, 2022</td><td>
<p>
一個多功能發行版，包括 Swagger UI 託管、新的外掛程式 API、Session 的多平台支援等。有關更多資訊，請參閱<Links href="/ktor/migration-to-22x" summary="undefined">從 2.0.x 遷移到 2.2.x</Links>指南。
</p>
<var name="version" value="2.2.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.1.3</td><td>October 26, 2022</td><td>
<p>
一個修補程式發行版，包含各種錯誤修正。
</p>
<var name="version" value="2.1.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.1.2</td><td>September 29, 2022</td><td>
<p>
一個修補程式發行版，包括 Routing、Testing engine 和 Ktor 用戶端中的錯誤修正。
</p>
<var name="version" value="2.1.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.1.1</td><td>September 6, 2022</td><td>
<p>
一個修補程式發行版，包含 Ktor 用戶端和伺服器中的各種錯誤修正。
</p>
<var name="version" value="2.1.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.1.0</td><td>August 11, 2022</td><td>
<p>
一個次要發行版，增加了對 YAML 設定的支援以及各種其他改進和錯誤修正。
</p>
<var name="version" value="2.1.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.0.3</td><td>June 28, 2022</td><td>
<p>
一個修補程式發行版，包含錯誤修正並將 <code>kotlinx.coroutines</code> 版本升級到 <code>1.6.2</code>。
</p>
<var name="version" value="2.0.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.0.2</td><td>May 27, 2022</td><td>
<p>
一個修補程式發行版，包含各種改進、錯誤修正和依賴項版本升級。
</p>
<var name="version" value="2.0.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.0.1</td><td>April 28, 2022</td><td>
<p>
一個修補程式發行版，包含各種錯誤修正並將 Kotlin 版本更新到 <code>1.6.21</code>。
</p>
<var name="version" value="2.0.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>2.0.0</td><td>April 11, 2022</td><td>
<p>
一個主要發行版，更新了 API 文件並包含了各種新功能。有關破壞性變更以及如何從 <code>1.x.x</code> 遷移的更多資訊，請參閱<Links href="/ktor/migration-to-20x" summary="undefined">遷移指南</Links>。
</p>
<var name="version" value="2.0.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
<tr><td>1.6.8</td><td>March 15, 2022</td><td>
<p>
一個修補程式發行版，包含依賴項版本升級。
</p>
<var name="version" value="1.6.8"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看變更日誌</a>
    </p>
    
</td></tr>
</table>