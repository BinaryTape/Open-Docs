[//]: # (title: Kotlin 發展藍圖)

<table>
    <tr>
        <td><strong>最後修改於</strong></td>
        <td><strong>2026 年 2 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td><strong>2026 年 8 月</strong></td>
    </tr>
</table>

歡迎來到 Kotlin 發展藍圖！在此您可以搶先了解 JetBrains 團隊的優先事項。

## 關鍵優先事項

此發展藍圖的目標是為您提供整體概觀。
以下是我們的關鍵關注領域——我們致力於交付的最重要方向：

* **語言演進**：讓 Kotlin 保持簡潔且具表現力，優先考慮具備意義的語意而非形式。
* **多平台**：透過強大的 iOS 體驗、成熟的 Web 目標平台以及可靠的 IDE 工具支援，成為現代跨平台應用程式的基礎。
* **保持中立**：不論開發者使用的工具或目標平台為何，皆提供支援。
* **生態系統支援**：簡化 Kotlin 程式庫、工具與架構的開發與發佈流程。

## 依子系統劃分的 Kotlin 發展藍圖

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

如果您對發展藍圖或其中的項目有任何疑問或回饋，歡迎發佈至 [YouTrack 票證](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 或在 Kotlin Slack 的 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 頻道中討論（[申請加入邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>子系統</th>
        <th>目前焦點</th>
    </tr>
    <tr id="language">
        <td><strong>語言</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">參閱完整清單</a> 以了解 Kotlin 語言特性與提案，或追蹤 <a href="https://youtrack.jetbrains.com/issue/KT-54620">即將推出的語言特性的 YouTrack 問題</a></p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>編譯器</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-51107" target="_blank">穩定依據 Lambda 傳回型別進行的多載解析</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84567" target="_blank">支援共通程式碼的 K2 多平台增量編譯</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">新 JVM 反射：調查、原型製作與實作</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84568" target="_blank">演進 Power-assert 外掛程式</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm：將程式庫的 <code>wasm-wasi</code> 目標切換至 WASI Preview 2</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm：支援元件模型 (Component Model)</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-82064" target="_blank">Kotlin/Wasm：支援多模組編譯</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305" target="_blank">Swift Export：Alpha 版本發佈</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84569" target="_blank">在 iOS 上為 Compose Multiplatform 實作新的 <code>TextInputService</code></a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84570" target="_blank">支援 Swift 6.3</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84571" target="_blank">穩定 Compose Multiplatform 的 Navigation3</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323" target="_blank">實作下一代多平台程式庫的發佈格式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">統一穩定 Kotlin 目標之間的內嵌語意</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS：改進 Kotlin/JS 的入門教材</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS：編譯為現代 JavaScript</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS：擴展將 Kotlin 宣告匯出至 JavaScript 的可能性</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">預設啟用 klib 產物的增量編譯</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin 多平台開發發展藍圖</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具支援</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84572" target="_blank">Kotlin/Native 偵錯工具健康度與效能改進</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84573" target="_blank">Maven 上 Kotlin 的智慧預設設定（混合 Java + Kotlin）</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-53877" target="_blank">支援在 Kotlin 中匯入 Swift Package Manager 套件</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-66897" target="_blank">以非棄用的替代方案取代 Karma 執行器</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改善 Kotlin 指令碼編寫與 <code>.gradle.kts</code> 的使用體驗</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">在 Gradle 專案隔離中支援 Kotlin/JS 與 Kotlin/Wasm</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">設計建置工具 API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">發佈支援宣告式 Gradle 的 Kotlin 生態系統外掛程式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">支援 Kotlin LSP 與 VS Code</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>生態系統</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-83525" target="_blank">為標準程式庫的安全性修正引入 18 個月的支援週期</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84574" target="_blank">穩定實驗性的 <code>kotlinx.serialization</code> API</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84575" target="_blank">穩定 <code>kotlinx.collections.immutable</code></a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84576" target="_blank">改善伺服器端 Kotlin 使用 Lombok 編譯器外掛程式的體驗</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">將 <code>kotlinx-datetime</code> 提升至 Beta 階段</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">實作 KDoc 機器可讀表示法</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改善 Kotlin 發佈使用者體驗：增加程式碼涵蓋率與二進位相容性驗證</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準程式庫的新多平台 API：支援 Unicode 與碼點</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">穩定 <code>kotlinx-io</code> 程式庫</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">針對回傳非 Unit 值且未被使用的 Kotlin 函式，引入預設的警告/錯誤</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80324" target="_blank">穩定 Kotlin Notebooks</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">發佈 Kotlin 資料框 1.0</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">發佈 Kandy 0.9</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">改善 Ktor 中的驗證機制</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938" target="_blank">支援 HTTP/3</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026" target="_blank">建立 Kubernetes 產生器外掛程式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">透過產生器外掛程式與教學為 Ktor 增加 gRPC 支援</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">改善 Ktor 管理與可觀測性</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-778" target="_blank">發佈 Exposed DAO 2.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-755" target="_blank">建立遷移 Gradle 外掛程式</a></li>
            </list>
         </td>
    </tr>
</table>

> * 此發展藍圖並非團隊正在進行的所有工作的詳盡清單，僅包含最大的專案。
> * 我們不承諾在特定版本中交付特定的特性或修正。
> * 我們將根據實際情況調整優先事項，並大約每六個月更新一次發展藍圖。
> 
{style="note"}

## 自 2025 年 8 月以來的變更

### 已完成項目

我們已**完成**上一個發展藍圖中的以下項目：

* ✅ 編譯器：[完成 JSpecify 支援](https://youtrack.jetbrains.com/issue/KT-75371)
* ✅ 編譯器：[棄用 K1 編譯器](https://youtrack.jetbrains.com/issue/KT-75372)
* ✅ 編譯器：[將 Kotlin/Wasm（<code>wasm-js</code> 目標）提升至 Beta 階段](https://youtrack.jetbrains.com/issue/KT-75370)
* ✅ 多平台：[預設啟用並行標記清除 (CMS) GC](https://youtrack.jetbrains.com/issue/KT-71278)
* ✅ 多平台：[在 Kotlin Multiplatform IDE 外掛程式中支援 Windows 與 Linux](https://youtrack.jetbrains.com/issue/KMT-789)
* ✅ 多平台：[發佈 Compose Multiplatform for Web Beta 版](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)
* ✅ 多平台：[發佈 Compose 熱重載 (Hot Reload) 穩定版](https://blog.jetbrains.com/kotlin/2026/01/compose-multiplatform-1-10-0/)
* ✅ 工具支援：[改善 Kotlin + JPA 體驗](https://youtrack.jetbrains.com/issue/KTIJ-35208)
* ✅ 工具支援：[Kotlin Notebooks：支援新的使用案例](https://youtrack.jetbrains.com/issue/KTNB-1133)
* ✅ 工具支援：[改善 IntelliJ IDEA 中 Kotlin/Wasm 專案的開發體驗](https://youtrack.jetbrains.com/issue/KT-75374)
* ✅ 工具支援：[為 JS/Wasm 產物增加 NPM 發佈功能](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.npm-publish)
* ✅ 工具支援：[IntelliJ IDEA K2 模式完整發佈](https://youtrack.jetbrains.com/issue/KTIJ-31316)
* ✅ 工具支援：[改善匯入效能](https://youtrack.jetbrains.com/issue/KT-75376)
* ✅ 生態系統：[為 Ktor 用戶端與伺服器應用程式支援 OpenAPI 規範](https://youtrack.jetbrains.com/issue/KTOR-8316)
* ✅ 生態系統：[Ktor WebRTC 用戶端](https://youtrack.jetbrains.com/issue/KTOR-7958)
* ✅ 生態系統：[簡化 Ktor 中的相依注入使用](https://youtrack.jetbrains.com/issue/KTOR-6621)
* ✅ 生態系統：[發佈 Exposed 1.0.0](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* ✅ 生態系統：[為 Exposed 增加 R2DBC 支援](https://youtrack.jetbrains.com/issue/EXPOSED-74)

### 新增項目

我們已在發展藍圖中**新增**以下項目：

* 🆕 編譯器：[Kotlin/Wasm：支援多模組編譯](https://youtrack.jetbrains.com/issue/KT-82064)
* 🆕 編譯器：[Kotlin/Wasm：將程式庫的 `wasm-wasi` 目標切換至 WASI Preview 2](https://youtrack.jetbrains.com/issue/KT-64568)
* 🆕 編譯器：[Kotlin/Wasm：支援元件模型 (Component Model)](https://youtrack.jetbrains.com/issue/KT-64569)
* 🆕 編譯器：[穩定依據 Lambda 傳回型別進行的多載解析](https://youtrack.jetbrains.com/issue/KT-51107)
* 🆕 編譯器：[支援共通程式碼的 K2 多平台增量編譯](https://youtrack.jetbrains.com/issue/KT-84567)
* 🆕 編譯器：[新 JVM 反射：調查、原型製作與實作](https://youtrack.jetbrains.com/issue/KT-75463)
* 🆕 編譯器：[演進 Power-assert 外掛程式](https://youtrack.jetbrains.com/issue/KT-84568)
* 🆕 多平台：[Swift Export：Alpha 版本發佈](https://youtrack.jetbrains.com/issue/KT-80305)
* 🆕 多平台：[在 iOS 上為 Compose Multiplatform 實作新的 `TextInputService`](https://youtrack.jetbrains.com/issue/KT-84569)
* 🆕 多平台：[支援 Swift 6.3](https://youtrack.jetbrains.com/issue/KT-84570)
* 🆕 多平台：[穩定 Compose Multiplatform 的 Navigation3](https://youtrack.jetbrains.com/issue/KT-84571)
* 🆕 工具支援：[Kotlin/Native 偵錯工具健康度與效能改進](https://youtrack.jetbrains.com/issue/KT-84572)
* 🆕 工具支援：[Maven 上 Kotlin 的智慧預設設定（混合 Java + Kotlin）](https://youtrack.jetbrains.com/issue/KT-84573)
* 🆕 工具支援：[支援在 Kotlin 中匯入 Swift Package Manager 套件](https://youtrack.jetbrains.com/issue/KT-53877)
* 🆕 工具支援：[以非棄用的替代方案取代 Karma 執行器](https://youtrack.jetbrains.com/issue/KT-66897)
* 🆕 生態系統：[為標準程式庫的安全性修正引入 18 個月的支援週期](https://youtrack.jetbrains.com/issue/KT-83525)
* 🆕 生態系統：[穩定實驗性的 `kotlinx.serialization` API](https://youtrack.jetbrains.com/issue/KT-84574)
* 🆕 生態系統：[穩定 `kotlinx.collections.immutable`](https://youtrack.jetbrains.com/issue/KT-84575)
* 🆕 生態系統：[改善伺服器端 Kotlin 使用 Lombok 編譯器外掛程式的體驗](https://youtrack.jetbrains.com/issue/KT-84576)
* 🆕 生態系統：[改善 Ktor 中的驗證機制](https://youtrack.jetbrains.com/issue/KTOR-9266)
* 🆕 生態系統：[發佈 Exposed DAO 2.0](https://youtrack.jetbrains.com/issue/EXPOSED-778)
* 🆕 生態系統：[為 Exposed 建立遷移 Gradle 外掛程式](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### 已移除項目

我們已從發展藍圖中**移除**以下項目：

* ❌ 編譯器：[Kotlin/Wasm：使用新的執行緒提案製作多執行緒支援原型](https://youtrack.jetbrains.com/issue/KT-80304)

> 雖然某些項目已從發展藍圖中移除，但並非完全停止開發。在某些情況下，我們將先前的項目與目前的項目進行了合併。
>
{style="note"}