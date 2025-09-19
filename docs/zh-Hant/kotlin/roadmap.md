[//]: # (title: Kotlin 路線圖)

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

歡迎來到 Kotlin 路線圖！搶先一睹 JetBrains 團隊的優先事項。

## 主要優先事項

本路線圖的目標是為您呈現整體概況。
以下是我們主要關注的領域清單 – 我們致力於實現的最重要方向：

*   **語言演進**：透過著重語義而非語法變化的有意義語言改進，讓 Kotlin 保持務實且富有表達力。
*   **多平台**：為現代多平台應用程式奠定基礎，提供穩固的 iOS 支援、成熟的 Web 目標和可靠的 IDE 工具。
*   **保持中立**：無論開發者使用何種工具或目標，都能提供支援。
*   **生態系統支援**：簡化 Kotlin 函式庫、工具和框架的開發與發佈流程。

## Kotlin 各子系統路線圖

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

如果您對路線圖或其中的項目有任何疑問或回饋，請隨時將它們發佈到 [YouTrack 票證](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 或 Kotlin Slack 的 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 頻道（[請求邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>子系統</th>
        <th>目前關注的項目</th>
    </tr>
    <tr id="language">
        <td><strong>語言</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">查看 Kotlin 語言功能與提案的完整列表</a> 或追蹤 <a href="https://youtrack.jetbrains.com/issue/KT-54620">即將推出的語言功能的 YouTrack 問題</a></p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>編譯器</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80304">Kotlin/Wasm：使用新的執行緒提案來原型化多執行緒支援</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75371">最終確定對 JSpecify 的支援</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75372">棄用 K1 編譯器</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75370">將 Kotlin/Wasm（<code>wasm-js</code> 目標）提升為 Beta 版</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305">在 Swift Export 中支援協程</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80308">Kotlin/JS：編譯為現代 JavaScript</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80310">Kotlin/JS：擴展將 Kotlin 宣告匯出到 JavaScript 的可能性</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80307">Kotlin/JS：改善 Kotlin/JS 的入門教學資料</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">預設啟用 Concurrent Mark and Sweep (CMS) GC</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323">實作下一代多平台函式庫的發佈格式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">統一所有 Kotlin 目標之間的內聯語義</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">預設啟用 klib artifacts 的增量編譯</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin 多平台開發路線圖</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">支援 Kotlin LSP 和 VS Code</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-35208" target="_blank">改善 Kotlin + JPA 體驗</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">在 Gradle 專案隔離中支援 Kotlin JS\WASM</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-1133" target="_blank">Kotlin Notebooks：支援新的使用情境</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">改善 IntelliJ IDEA 中 Kotlin/Wasm 專案的開發體驗</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">改善匯入的效能</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 模式完整發布</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">設計 Build Tools API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">發布支援宣告式 Gradle 的 Kotlin 生態系統外掛</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改善 Kotlin 腳本編寫及 <code>.gradle.kts</code> 使用體驗</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>生態系統</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80323">實作 KDoc 機器可讀表示</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80324">穩定 Kotlin Notebooks</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80327">發布 Kotlin DataFrame 1.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80328">發布 Kandy 0.9</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">引入針對未使用且返回非單元值的 Kotlin 函式的預設警告/錯誤</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準函式庫的新多平台 API：支援 Unicode 和字碼點</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">穩定 <code>kotlinx-io</code> 函式庫</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改善 Kotlin 發佈使用者體驗：新增程式碼覆蓋率和二進位相容性驗證</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">將 <code>kotlinx-datetime</code> 提升為 Beta 版</a></li>
            </list>
            <p><b>Ktor：</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-8316">為 Ktor 客戶端和伺服器應用程式支援 OpenAPI 規範</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6622">改善 Ktor 管理與可觀察性</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7958">WebRTC 客戶端</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501">為 Ktor 新增 gRPC 支援，附帶生成器外掛和教學</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026">建立 Kubernetes 生成器外掛</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6621">簡化依賴注入的使用</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938">支援 HTTP/3</a></li>
            </list>
            <p><b>Exposed：</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">發布 1.0.0</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">新增 R2DBC 支援</a></li>
            </list>
         </td>
    </tr>
</table>

> * 本路線圖並非團隊所有工作內容的詳盡清單，僅包含最大型的專案。
> * 我們不承諾在特定版本中交付特定功能或修復。
> * 我們將隨時調整優先事項，並大約每六個月更新一次路線圖。
> 
{style="note"}

## 自 2025 年 2 月以來的變化

### 已完成項目

我們已**完成**先前路線圖中的以下項目：

*   ✅ 多平台：[Swift Export 的首次公開發布](https://youtrack.jetbrains.com/issue/KT-64572)
*   ✅ 多平台：[支援在專案層級宣告 Kotlin 多平台依賴](https://youtrack.jetbrains.com/issue/KT-71289)
*   ✅ 多平台：[穩定不同平台上的 klib 跨平台編譯](https://youtrack.jetbrains.com/issue/KT-71290)
*   ✅ 多平台：[Kotlin/JS：支援 WasmJS 和 JS 之間的通用原始碼以實現 Compose 回退模式](https://youtrack.jetbrains.com/issue/KT-79394)
*   ✅ 工具：[改善 Kotlin 建置報告](https://youtrack.jetbrains.com/issue/KT-60279)
*   ✅ 工具：[在 Gradle DSL 中公開穩定的編譯器參數](https://youtrack.jetbrains.com/issue/KT-55515)
*   ✅ 工具：[支援 Gradle 專案隔離](https://youtrack.jetbrains.com/issue/KT-54105)
*   ✅ 工具：[改善 Kotlin/Native 工具鏈與 Gradle 的整合](https://youtrack.jetbrains.com/issue/KT-64577)
*   ✅ 工具：[Kotlin Notebook：更流暢的存取與更佳的體驗](https://youtrack.jetbrains.com/issue/KTNB-898)
*   ✅ 工具：[支援 XCFrameworks 中的資源](https://youtrack.jetbrains.com/issue/KT-75377)
*   ✅ 生態系統：[改進 Dokka HTML 輸出使用者介面](https://youtrack.jetbrains.com/issue/KT-71295)
*   ✅ 生態系統：[簡化後端應用程式的專案結構](https://youtrack.jetbrains.com/issue/KTOR-7158)
*   ✅ 生態系統：[將 CLI 生成器發佈到 SNAP](https://youtrack.jetbrains.com/issue/KTOR-3937)
*   ✅ 生態系統：[簡化依賴注入的使用](https://youtrack.jetbrains.com/issue/KTOR-6621)

### 新增項目

我們已將以下項目**新增**至路線圖：

*   🆕 編譯器：[Kotlin/Wasm：使用新的執行緒提案來原型化多執行緒支援](https://youtrack.jetbrains.com/issue/KT-80304)
*   🆕 多平台：[在 Swift Export 中支援協程](https://youtrack.jetbrains.com/issue/KT-80305)
*   🆕 多平台：[Kotlin/JS：編譯為現代 JavaScript](https://youtrack.jetbrains.com/issue/KT-80308)
*   🆕 多平台：[Kotlin/JS：擴展將 Kotlin 宣告匯出到 JavaScript 的可能性](https://youtrack.jetbrains.com/issue/KT-80310)
*   🆕 多平台：[Kotlin/JS：改善 Kotlin/JS 的入門教學資料](https://youtrack.jetbrains.com/issue/KT-80307)
*   🆕 工具：[支援 Kotlin LSP 和 VS Code](https://youtrack.jetbrains.com/issue/KT-80322)
*   🆕 工具：[改善 Kotlin + JPA 體驗](https://youtrack.jetbrains.com/issue/KTIJ-35208)
*   🆕 工具：[在 Gradle 專案隔離中支援 Kotlin JS\WASM](https://youtrack.jetbrains.com/issue/KT-80311)
*   🆕 工具：[Kotlin Notebooks：支援新的使用情境](https://youtrack.jetbrains.com/issue/KTNB-1133)
*   🆕 生態系統：[實作 KDoc 機器可讀表示](https://youtrack.jetbrains.com/issue/KT-80323)
*   🆕 生態系統：[穩定 Kotlin Notebooks](https://youtrack.jetbrains.com/issue/KT-80324)
*   🆕 生態系統：[發布 Kotlin DataFrame 1.0](https://youtrack.jetbrains.com/issue/KT-80327)
*   🆕 生態系統：[發布 Kandy 0.9](https://youtrack.jetbrains.com/issue/KT-80328)
*   🆕 生態系統：[為 Ktor 客戶端和伺服器應用程式支援 OpenAPI 規範](https://youtrack.jetbrains.com/issue/KTOR-8316)
*   🆕 生態系統：[改善 Ktor 管理與可觀察性](https://youtrack.jetbrains.com/issue/KTOR-6622)
*   🆕 生態系統：[WebRTC 客戶端](https://youtrack.jetbrains.com/issue/KTOR-7958)

### 已移除項目

我們已從路線圖中**移除**以下項目：

*   ❌ 編譯器：[Kotlin/Wasm：將函式庫的 `wasm-wasi` 目標切換到 WASI Preview 2](https://youtrack.jetbrains.com/issue/KT-64568)
*   ❌ 編譯器：[Kotlin/Wasm：支援 Component Model](https://youtrack.jetbrains.com/issue/KT-64569)
*   ❌ 生態系統：[發佈到 Snap](https://youtrack.jetbrains.com/issue/KTOR-3937)

> * 有些項目已從路線圖中移除，但並未完全放棄。
> * 在某些情況下，我們已將先前的路線圖項目與當前項目合併。
> 
{style="note"}