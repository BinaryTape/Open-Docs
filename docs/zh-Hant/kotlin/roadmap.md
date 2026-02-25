[//]: # (title: Kotlin 發展藍圖)

<table>
    <tr>
        <td><strong>最後修改於</strong></td>
        <td><strong>2025 年 8 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td><strong>2026 年 2 月</strong></td>
    </tr>
</table>

歡迎來到 Kotlin 發展藍圖！在此您可以搶先了解 JetBrains 團隊的優先事項。

## 關鍵優先事項

此發展藍圖的目標是為您提供整體概觀。
以下是我們的關鍵關注領域——我們致力於交付的最重要方向：

* **語言演進**：讓 Kotlin 兼具實用性與表現力，透過具備意義的語言改進，強調語意而非僅僅是語法變更。
* **多平台**：為現代多平台應用程式奠定基礎，提供強大的 iOS 支援、成熟的 Web 目標平台以及可靠的 IDE 工具支援。
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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80304">Kotlin/Wasm：使用新的執行緒提案製作多執行緒支援原型</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75371">完成 JSpecify 支援</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75372">棄用 K1 編譯器</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75370">將 Kotlin/Wasm（<code>wasm-js</code> 目標）提升至 Beta 階段</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305">在 Swift Export 中支援協同程式</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80308">Kotlin/JS：編譯為現代 JavaScript</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80310">Kotlin/JS：擴展將 Kotlin 宣告匯出至 JavaScript 的可能性</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80307">Kotlin/JS：改進 Kotlin/JS 的入門教材</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">預設啟用並行標記清除 (CMS) GC</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323">實作下一代多平台程式庫的發佈格式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">統一所有 Kotlin 目標之間的內嵌語意</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">預設啟用 klib 產物的增量編譯</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin 多平台開發發展藍圖</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具支援</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">支援 Kotlin LSP (語言伺服器協定) 與 VS Code</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-35208" target="_blank">改善 Kotlin + JPA 體驗</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">在 Gradle 專案隔離中支援 Kotlin JS\WASM</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-1133" target="_blank">Kotlin Notebooks：支援新的使用案例</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">改善 IntelliJ IDEA 中 Kotlin/Wasm 專案的開發體驗</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">改善匯入效能</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 模式完整發佈</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">設計建置工具 API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">發佈支援宣告式 Gradle 的 Kotlin 生態系統外掛程式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改善 Kotlin 指令碼編寫與 <code>.gradle.kts</code> 的使用體驗</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>生態系統</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80323">實作 KDoc 機器可讀表示法</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80324">穩定 Kotlin Notebooks</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80327">發佈 Kotlin 資料框 1.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80328">發佈 Kandy 0.9</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">針對回傳非 Unit 值且未被使用的 Kotlin 函式，引入預設的警告/錯誤</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準程式庫的新多平台 API：支援 Unicode 與碼點</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">穩定 <code>kotlinx-io</code> 程式庫</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改善 Kotlin 發佈使用者體驗：增加程式碼涵蓋率與二進位相容性驗證</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">將 <code>kotlinx-datetime</code> 提升至 Beta 階段</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-8316">為 Ktor 用戶端與伺服器應用程式支援 OpenAPI 規範</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6622">改善 Ktor 管理與可觀測性</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7958">WebRTC 用戶端</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501">透過產生器外掛程式與教學為 Ktor 增加 gRPC 支援</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026">建立 Kubernetes 產生器外掛程式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6621">簡化相依注入使用</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 支援</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">發佈 1.0.0</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">增加 R2DBC 支援</a></li>
            </list>
         </td>
    </tr>
</table>

> * 此發展藍圖並非團隊正在進行的所有工作的詳盡清單，僅包含最大的專案。
> * 我們不承諾在特定版本中交付特定的特性或修正。
> * 我們將根據實際情況調整優先事項，並大約每六個月更新一次發展藍圖。
> 
{style="note"}

## 自 2025 年 2 月以來的變更

### 已完成項目

我們已**完成**上一個發展藍圖中的以下項目：

* ✅ 多平台：[Swift Export 的首次公開發佈](https://youtrack.jetbrains.com/issue/KT-64572)
* ✅ 多平台：[支援在專案層級宣告 Kotlin 多平台相依性](https://youtrack.jetbrains.com/issue/KT-71289)
* ✅ 多平台：[穩定跨不同平台的 klib 交叉編譯](https://youtrack.jetbrains.com/issue/KT-71290)
* ✅ 多平台：[Kotlin/JS：支援 WasmJS 與 JS 之間的共通原始碼，用於 Compose 備援模式](https://youtrack.jetbrains.com/issue/KT-79394)
* ✅ 工具支援：[改善 Kotlin 建置報告](https://youtrack.jetbrains.com/issue/KT-60279)
* ✅ 工具支援：[在 Gradle DSL 中公開穩定的編譯器引數](https://youtrack.jetbrains.com/issue/KT-55515)
* ✅ 工具支援：[支援 Gradle 專案隔離](https://youtrack.jetbrains.com/issue/KT-54105)
* ✅ 工具支援：[改善 Kotlin/Native 工具鏈與 Gradle 的整合](https://youtrack.jetbrains.com/issue/KT-64577)
* ✅ 工具支援：[Kotlin Notebook：更流暢的存取與改進的體驗](https://youtrack.jetbrains.com/issue/KTNB-898)
* ✅ 工具支援：[在 XCFrameworks 中支援資源](https://youtrack.jetbrains.com/issue/KT-75377)
* ✅ 生態系統：[優化 Dokka HTML 輸出介面](https://youtrack.jetbrains.com/issue/KT-71295)
* ✅ 生態系統：[簡化後端應用程式的專案結構定義](https://youtrack.jetbrains.com/issue/KTOR-7158)
* ✅ 生態系統：[將指令列產生器發佈至 SNAP](https://youtrack.jetbrains.com/issue/KTOR-3937)
* ✅ 生態系統：[簡化相依注入使用](https://youtrack.jetbrains.com/issue/KTOR-6621)

### 新增項目

我們已在發展藍圖中**新增**以下項目：

* 🆕 編譯器：[Kotlin/Wasm：使用新的執行緒提案製作多執行緒支援原型](https://youtrack.jetbrains.com/issue/KT-80304)
* 🆕 多平台：[在 Swift Export 中支援協同程式](https://youtrack.jetbrains.com/issue/KT-80305)
* 🆕 多平台：[Kotlin/JS：編譯為現代 JavaScript](https://youtrack.jetbrains.com/issue/KT-80308)
* 🆕 多平台：[Kotlin/JS：擴展將 Kotlin 宣告匯出至 JavaScript 的可能性](https://youtrack.jetbrains.com/issue/KT-80310)
* 🆕 多平台：[Kotlin/JS：改進 Kotlin/JS 的入門教材](https://youtrack.jetbrains.com/issue/KT-80307)
* 🆕 工具支援：[支援 Kotlin LSP (語言伺服器協定) 與 VS Code](https://youtrack.jetbrains.com/issue/KT-80322)
* 🆕 工具支援：[改善 Kotlin + JPA 體驗](https://youtrack.jetbrains.com/issue/KTIJ-35208)
* 🆕 工具支援：[在 Gradle 專案隔離中支援 Kotlin JS\WASM](https://youtrack.jetbrains.com/issue/KT-80311)
* 🆕 工具支援：[Kotlin Notebooks：支援新的使用案例](https://youtrack.jetbrains.com/issue/KTNB-1133)
* 🆕 生態系統：[實作 KDoc 機器可讀表示法](https://youtrack.jetbrains.com/issue/KT-80323)
* 🆕 生態系統：[穩定 Kotlin Notebooks](https://youtrack.jetbrains.com/issue/KT-80324)
* 🆕 生態系統：[發佈 Kotlin 資料框 1.0](https://youtrack.jetbrains.com/issue/KT-80327)
* 🆕 生態系統：[發佈 Kandy 0.9](https://youtrack.jetbrains.com/issue/KT-80328)
* 🆕 生態系統：[為 Ktor 用戶端與伺服器應用程式支援 OpenAPI 規範](https://youtrack.jetbrains.com/issue/KTOR-8316)
* 🆕 生態系統：[改善 Ktor 管理與可觀測性](https://youtrack.jetbrains.com/issue/KTOR-6622)
* 🆕 生態系統：[WebRTC 用戶端](https://youtrack.jetbrains.com/issue/KTOR-7958)

### 已移除項目

我們已從發展藍圖中**移除**以下項目：

* ❌ 編譯器：[Kotlin/Wasm：將程式庫的 `wasm-wasi` 目標切換至 WASI Preview 2](https://youtrack.jetbrains.com/issue/KT-64568)
* ❌ 編譯器：[Kotlin/Wasm：支援元件模型 (Component Model)](https://youtrack.jetbrains.com/issue/KT-64569)
* ❌ 生態系統：[發佈至 Snap](https://youtrack.jetbrains.com/issue/KTOR-3937)

> 雖然某些項目已從發展藍圖中移除，但並非完全停止開發。在某些情況下，我們將先前的項目與目前的項目進行了合併。
>
{style="note"}