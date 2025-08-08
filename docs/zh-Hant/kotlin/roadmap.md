[//]: # (title: Kotlin 路線圖)

<table>
    <tr>
        <td><strong>最後修改於</strong></td>
        <td><strong>2025 年 2 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td><strong>2025 年 8 月</strong></td>
    </tr>
</table>

歡迎來到 Kotlin 路線圖！搶先一睹 JetBrains 團隊的優先事項。

## 主要優先事項

本路線圖的目標是為您呈現整體概況。
以下是我們主要關注的領域清單 – 我們致力於實現的最重要方向：

*   **語言演進**：更高效的資料處理、提升抽象化能力、透過清晰的程式碼提升效能。
*   **Kotlin Multiplatform**：發佈 Kotlin 到 Swift 的直接匯出功能、簡化建置設定，以及簡化多平台函式庫的建立。
*   **第三方生態系統作者的體驗**：簡化 Kotlin 函式庫、工具和框架的開發與發佈流程。

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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">最終確定對 JSpecify 的支援</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">棄用 K1 編譯器</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">將 Kotlin/Wasm（<code>wasm-js</code> 目標）提升為 Beta 版</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm：將函式庫的 <code>wasm-wasi</code> 目標切換到 WASI Preview 2</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm：支援 Component Model</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift Export 的首次公開發布</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">預設啟用 Concurrent Mark and Sweep (CMS) GC</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71290">穩定不同平台上的 klib 跨平台編譯</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71281">實作下一代多平台函式庫的發佈格式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71289">支援在專案層級宣告 Kotlin 多平台依賴</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">統一所有 Kotlin 目標之間的內聯語義</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">預設啟用 klib artifacts 的增量編譯</a></li>
            </list>
            <tip><p><a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin 多平台開發路線圖</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">改善 IntelliJ IDEA 中 Kotlin/Wasm 專案的開發體驗</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">改善匯入的效能</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">支援 XCFrameworks 中的資源</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook：更流暢的存取與更佳的體驗</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 模式完整發布</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">設計 Build Tools API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">支援宣告式 Gradle 的 Kotlin 生態系統外掛</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">支援 Gradle 專案隔離</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">改善 Kotlin/Native 工具鏈與 Gradle 的整合</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">改善 Kotlin 建置報告</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">在 Gradle DSL 中公開穩定的編譯器參數</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改善 Kotlin 腳本編寫及 <code>.gradle.kts</code> 使用體驗</a></li>
            </list>
         </td>
    </tr>
    <tr id="library-ecosystem">
        <td><strong>函式庫生態系統</strong></td>
        <td>
            <p><b>函式庫生態系統路線圖項目：</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">改進 Dokka HTML 輸出使用者介面</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">引入針對未使用且返回非單元值的 Kotlin 函式的預設警告/錯誤</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準函式庫的新多平台 API：支援 Unicode 和字碼點</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">穩定 kotlinx-io 函式庫</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改善 Kotlin 發佈使用者體驗：新增程式碼覆蓋率和二進位相容性驗證</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">將 kotlinx-datetime 提升為 Beta 版</a></li>
            </list>
            <p><b>Ktor：</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">為 Ktor 新增 gRPC 支援，附帶生成器外掛和教學</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">簡化後端應用程式的專案結構</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">將 CLI 生成器發佈到 SNAP</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">建立 Kubernetes 生成器外掛</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">簡化依賴注入的使用</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">支援 HTTP/3</a></li>
            </list>
            <p><b>Exposed：</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">發布 1.0.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">新增 R2DBC 支援</a></li>
            </list>
         </td>
    </tr>
</table>

> * 本路線圖並非團隊所有工作內容的詳盡清單，僅包含最大型的專案。
> * 我們不承諾在特定版本中交付特定功能或修復。
> * 我們將隨時調整優先事項，並大約每六個月更新一次路線圖。
> 
{style="note"}

## 自 2024 年 9 月以來的變化

### 已完成項目

我們已**完成**先前路線圖中的以下項目：

*   ✅ 編譯器：[支援 Android 上內聯函式的偵錯](https://youtrack.jetbrains.com/issue/KT-60276)
*   ✅ 編譯器：[改善編譯器診斷的品質](https://youtrack.jetbrains.com/issue/KT-71275)
*   ✅ 多平台：[在 Kotlin 中支援 Xcode 16](https://youtrack.jetbrains.com/issue/KT-71287)
*   ✅ 多平台：[發布 Kotlin Gradle Plugin 的公開可用 API 參考](https://youtrack.jetbrains.com/issue/KT-71288)
*   ✅ 工具：[為 Kotlin/Wasm 目標提供開箱即用的偵錯體驗](https://youtrack.jetbrains.com/issue/KT-71276)
*   ✅ 函式庫生態系統：[實作基於 Dokkatoo 的新 Dokka Gradle 外掛](https://youtrack.jetbrains.com/issue/KT-71293)
*   ✅ 函式庫生態系統：[標準函式庫的新多平台 API：Atomics](https://youtrack.jetbrains.com/issue/KT-62423)
*   ✅ 函式庫生態系統：[擴展函式庫作者指南](https://youtrack.jetbrains.com/issue/KT-71299)

### 新增項目

我們已將以下項目**新增**至路線圖：

*   🆕 編譯器：[最終確定對 JSpecify 的支援](https://youtrack.jetbrains.com/issue/KT-75371)
*   🆕 編譯器：[棄用 K1 編譯器](https://youtrack.jetbrains.com/issue/KT-75372)
*   🆕 編譯器：[將 Kotlin/Wasm（<code>wasm-js</code> 目標）提升為 Beta 版](https://youtrack.jetbrains.com/issue/KT-75370)
*   🆕 工具：[改善 IntelliJ IDEA 中 Kotlin/Wasm 專案的開發體驗](https://youtrack.jetbrains.com/issue/KT-75374)
*   🆕 工具：[改善匯入的效能](https://youtrack.jetbrains.com/issue/KT-75376)
*   🆕 工具：[支援 XCFrameworks 中的資源](https://youtrack.jetbrains.com/issue/KT-75377)
*   🆕 工具：[Kotlin Notebook：更流暢的存取與更佳的體驗](https://youtrack.jetbrains.com/issue/KTNB-898)
*   🆕 Ktor：[為 Ktor 新增 gRPC 支援，附帶生成器外掛和教學](https://youtrack.com/issue/KTOR-1501)
*   🆕 Ktor：[簡化後端應用程式的專案結構](https://youtrack.com/issue/KTOR-7158)
*   🆕 Ktor：[將 CLI 生成器發佈到 SNAP](https://youtrack.com/issue/KTOR-3937)
*   🆕 Ktor：[建立 Kubernetes 生成器外掛](https://youtrack.com/issue/KTOR-6026)
*   🆕 Ktor：[簡化依賴注入的使用](https://youtrack.com/issue/KTOR-6621)
*   🆕 Ktor：[支援 HTTP/3](https://youtrack.com/issue/KTOR-7938)
*   🆕 Exposed：[發布 1.0.0](https://youtrack.com/issue/EXPOSED-444)
*   🆕 Exposed：[新增 R2DBC 支援](https://youtrack.com/issue/EXPOSED-74)

<!--
### Removed items

We've **removed** the following items from the roadmap:

* ❌ Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{style="note"}
-->

### 進行中項目

所有其他先前確定的路線圖項目都在進行中。您可以查看它們的 [YouTrack 票證](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 以獲取更新。