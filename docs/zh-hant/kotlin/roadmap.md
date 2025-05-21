---
title: "Kotlin 路線圖"
---
<table>
<tr>
<td>
<strong>上次修改於</strong>
</td>
<td>
<strong>2025 年 2 月</strong>
</td>
</tr>
<tr>
<td>
<strong>下次更新</strong>
</td>
<td>
<strong>2025 年 8 月</strong>
</td>
</tr>
</table>

歡迎來到 Kotlin 路線圖！搶先了解 JetBrains 團隊的優先事項。

## 主要優先事項

此路線圖的目標是讓您了解全局。
以下是我們主要關注領域的列表 - 我們致力於實現的最重要方向：

*   **語言演進 (Language evolution)**：更有效率的資料處理、更高的抽象化、透過清晰的程式碼提升效能。
*   **Kotlin Multiplatform**：發布直接 Kotlin 到 Swift 匯出 (Kotlin to Swift Export)、簡化建置設定，以及簡化多平台函式庫的建立。
*   **第三方生態系統作者的體驗 (Experience of third-party ecosystem authors)**：簡化 Kotlin 函式庫、工具和框架的開發和發布流程。

## Kotlin 依子系統劃分的路線圖

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

如果您對路線圖或其中的項目有任何問題或意見，請隨時將其發佈到 [YouTrack 票證](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 或 Kotlin Slack 的 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 頻道（[請求邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->
<table>
<tr>
        <th>子系統 (Subsystem)</th>
        <th>目前重點</th>
</tr>
<tr id="language">
<td>
<strong>語言 (Language)</strong>
</td>
<td>

<p>
   <a href="kotlin-language-features-and-proposals">查看 Kotlin 語言功能和提案的完整清單</a> 或追蹤 <a href="https://youtrack.jetbrains.com/issue/KT-54620">YouTrack issue 了解即將推出的語言功能</a>
</p>
</td>
</tr>
<tr id="compiler">
<td>
<strong>編譯器 (Compiler)</strong>
</td>
<td>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">完成 JSpecify 支援</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">棄用 K1 編譯器</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">將 Kotlin/Wasm (`wasm-js` target) 提升至 Beta</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm：將函式庫的 `wasm-wasi` 目標切換到 WASI Preview 2</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm：支援元件模型 (Component Model)</a></li>
</list>
</td>
</tr>
<tr id="multiplatform">
<td>
<strong>Multiplatform</strong>
</td>
<td>
<list>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift 匯出 (Swift Export) 的首次公開發布</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71278">預設啟用並行標記清除 (Concurrent Mark and Sweep, CMS) GC</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71290">在不同平台上穩定 klib 交叉編譯</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71281">實作新一代多平台函式庫發布格式</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71289">支援在專案層級宣告 Kotlin Multiplatform 相依性</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">統一所有 Kotlin 目標之間的 inline 語義</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">預設啟用 klib 成品的增量編譯</a></li>
</list>
            <tip><p>
   <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform 開發路線圖</a>
</p></tip>
</td>
</tr>
<tr id="tooling">
<td>
<strong>工具 (Tooling)</strong>
</td>
<td>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">改善 IntelliJ IDEA 中 Kotlin/Wasm 專案的開發體驗</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">提升導入 (imports) 效能</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">支援 XCFrameworks 中的資源</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook：更流暢的存取和改善的體驗</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 模式完整發布</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">設計建置工具 API (Build Tools API)</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">Kotlin 生態系統外掛程式 (Kotlin Ecosystem Plugin) 支援宣告式 Gradle</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">支援 Gradle 專案隔離</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">改善 Kotlin/Native 工具鏈與 Gradle 的整合</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">改善 Kotlin 建置報告</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">在 Gradle DSL 中公開穩定的編譯器引數</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改善 Kotlin 腳本和使用 `.gradle.kts` 的體驗</a></li>
</list>
</td>
</tr>
<tr id="library-ecosystem">
<td>
<strong>函式庫生態系統 (Library ecosystem)</strong>
</td>
<td>

<p>
   <b>函式庫生態系統路線圖項目：</b>
</p>
<list>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">改進 Dokka HTML 輸出 UI</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">為返回未使用之非 Unit 值的 Kotlin 函數引入預設警告/錯誤</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準函式庫的新多平台 API：支援 Unicode 和程式碼點</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">穩定 `kotlinx-io` 函式庫</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改善 Kotlin 發布 UX：新增程式碼覆蓋率和二進位檔相容性驗證</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">將 `kotlinx-datetime` 提升至 Beta</a></li>
</list>
<p>
   <b>Ktor：</b>
</p>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">透過產生器外掛程式和教學課程將 gRPC 支援新增至 Ktor</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">簡化後端應用程式的專案結構</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">將 CLI 產生器發布到 SNAP</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">建立 Kubernetes 產生器外掛程式</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">簡化依賴注入的使用</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 支援</a></li>
</list>
<p>
   <b>Exposed：</b>
</p>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">發布 1.0.0</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">新增 R2DBC 支援</a></li>
</list>
</td>
</tr>
</table>
:::note
*   此路線圖並非團隊正在處理的所有事項的完整清單，僅包含最大的專案。
*   不保證在特定版本中交付特定功能或修復。
*   我們將隨著進度調整優先順序，並大約每六個月更新一次路線圖。

:::

## 自 2024 年 9 月以來的變更

### 已完成項目

我們**已完成**先前路線圖中的以下項目：

*   ✅ 編譯器 (Compiler)：[支援在 Android 上偵錯 inline 函數](https://youtrack.jetbrains.com/issue/KT-60276)
*   ✅ 編譯器 (Compiler)：[提升編譯器診斷的品質](https://youtrack.jetbrains.com/issue/KT-71275)
*   ✅ Multiplatform：[在 Kotlin 中支援 Xcode 16](https://youtrack.jetbrains.com/issue/KT-71287)
*   ✅ Multiplatform：[發布 Kotlin Gradle Plugin 的公開可用 API 參考](https://youtrack.jetbrains.com/issue/KT-71288)
*   ✅ 工具 (Tooling)：[為 Kotlin/Wasm 目標提供開箱即用的偵錯體驗](https://youtrack.jetbrains.com/issue/KT-71276)
*   ✅ 函式庫生態系統 (Library ecosystem)：[實作基於 Dokkatoo 的新 Dokka Gradle 外掛程式](https://youtrack.jetbrains.com/issue/KT-71293)
*   ✅ 函式庫生態系統 (Library ecosystem)：[標準函式庫的新多平台 API：原子操作](https://youtrack.jetbrains.com/issue/KT-62423)
*   ✅ 函式庫生態系統 (Library ecosystem)：[擴充函式庫作者指南](https://youtrack.jetbrains.com/issue/KT-71299)

### 新增項目

我們已將以下項目**新增**至路線圖：

*   🆕 編譯器 (Compiler)：[完成 JSpecify 支援](https://youtrack.jetbrains.com/issue/KT-75371)
*   🆕 編譯器 (Compiler)：[棄用 K1 編譯器](https://youtrack.jetbrains.com/issue/KT-75372)
*   🆕 編譯器 (Compiler)：[將 Kotlin/Wasm (`wasm-js` target) 提升至 Beta](https://youtrack.jetbrains.com/issue/KT-75370)
*   🆕 工具 (Tooling)：[改善 IntelliJ IDEA 中 Kotlin/Wasm 專案的開發體驗](https://youtrack.jetbrains.com/issue/KT-75374)
*   🆕 工具 (Tooling)：[提升導入 (imports) 效能](https://youtrack.jetbrains.com/issue/KT-75376)
*   🆕 工具 (Tooling)：[支援 XCFrameworks 中的資源](https://youtrack.jetbrains.com/issue/KT-75377)
*   🆕 工具 (Tooling)：[Kotlin Notebook 中更流暢的存取和改善的體驗](https://youtrack.jetbrains.com/issue/KTNB-898)
*   🆕 Ktor：[透過產生器外掛程式和教學課程將 gRPC 支援新增至 Ktor](https://youtrack.jetbrains.com/issue/KTOR-1501)
*   🆕 Ktor：[簡化後端應用程式的專案結構](https://youtrack.jetbrains.com/issue/KTOR-7158)
*   🆕 Ktor：[將 CLI 產生器發布到 SNAP](https://youtrack.jetbrains.com/issue/KTOR-3937)
*   🆕 Ktor：[建立 Kubernetes 產生器外掛程式](https://youtrack.jetbrains.com/issue/KTOR-6026)
*   🆕 Ktor：[簡化依賴注入的使用](https://youtrack.jetbrains.com/issue/KTOR-6621)
*   🆕 Ktor：[HTTP/3 支援](https://youtrack.jetbrains.com/issue/KTOR-7938)
*   🆕 Exposed：[發布 1.0.0](https://youtrack.jetbrains.com/issue/EXPOSED-444)
*   🆕 Exposed：[新增 R2DBC 支援](https://youtrack.jetbrains.com/issue/EXPOSED-74)

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

所有其他先前識別的路線圖項目都在進行中。您可以查看其 [YouTrack 票證](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
以取得更新。