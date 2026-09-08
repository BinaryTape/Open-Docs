[//]: # (title: Kotlin 發展藍圖)

<table>
    <tr>
        <td><strong>最後修改於</strong></td>
        <td><strong>2026 年 8 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td><strong>2027 年 2 月</strong></td>
    </tr>
</table>

歡迎來到 Kotlin 發展藍圖！在此您可以搶先了解 JetBrains 團隊的優先事項。

## 關鍵優先事項 {id="key-priorities"}

此發展藍圖的目標是為您提供整體概觀。
以下是我們的關鍵關注領域——我們致力於交付的最重要方向：

* **語言演進**：讓 Kotlin 保持簡潔且具表現力，優先考慮人體工學與安全性，而非形式。
* **Kotlin 多平台**：透過穩固的 iOS 體驗、成熟的 Web 目標平台以及可靠的 IDE 工具支援，成為現代跨平台應用程式的基礎。
* **保持中立**：不論開發人員使用的工具或目標平台為何，皆提供支援。
* **第三方生態系統作者的體驗**：簡化 Kotlin 程式庫、工具與架構的開發與發佈流程。

## 依子系統劃分的 Kotlin 發展藍圖 {id="kotlin-roadmap-by-subsystem"}

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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88663" target="_blank">將 Kotlin/Wasm 提升至穩定版</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88664" target="_blank">改善 KAPT 效能使其足以與 Java APT 媲美</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-51107" target="_blank">穩定依據 Lambda 傳回型別進行的多載解析</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84567" target="_blank">支援共通程式碼的 K2 多平台增量編譯</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">新 JVM 反射：調查、原型製作與實作</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm：將程式庫的 <code>wasm-wasi</code> 目標切換至 WASI Preview 2</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm：支援元件模型 (Component Model)</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/SKIKO-982" target="_blank">透過 Skiko 中的 Graphite 改進繪圖可靠性與具未來性的 GPU 支援</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KMT-2910" target="_blank">為 Kotlin/Native 偵錯工具整合 Xcode</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-86791" target="_blank">Swift Export：從 Alpha 邁向 Beta</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/CMP-10598" target="_blank">在 iOS 的 Compose Multiplatform 中將原生文字輸入設為預設</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-86492" target="_blank">Release 模式下的原生編譯器快取</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">統一穩定 Kotlin 目標之間的內嵌語意</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS：改進 Kotlin/JS 的入門教材</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS：編譯為現代 JavaScript</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS：擴展將 Kotlin 宣告匯出至 JavaScript 的可能性</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">預設啟用 klib 產物的增量編譯</a></li>
            </list>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具支援</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88545" target="_blank">透過統一的編譯器外掛程式套件 (bundle) 簡化 Maven 上的 Kotlin 入門流程</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KMT-2910" target="_blank">為 Kotlin/Native 偵錯工具整合 Xcode</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88546" target="_blank">在未啟用配置快取 (configuration cache) 的情況下允許 Native 任務平行化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTC-5718" target="_blank">Kotlin 工具鏈：進入 Kotlin 的單一入口點</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84572" target="_blank">Kotlin/Native 偵錯工具健康度與效能改進</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-53877" target="_blank">支援在 Kotlin 中匯入 Swift Package Manager 套件</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-66897" target="_blank">以非棄用的替代方案取代 Karma 執行器</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">在 Gradle 專案隔離中支援 Kotlin/JS 與 Kotlin/Wasm</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">設計建置工具 API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">支援 Kotlin LSP 與 VS Code</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>生態系統</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88665" target="_blank">為 Kotlin 標準程式庫 (stdlib) 型別實作一等公民等級的 JPA/Hibernate 支援</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84574" target="_blank">穩定實驗性的 <code>kotlinx.serialization</code> API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84576" target="_blank">改善伺服器端 Kotlin 使用 Lombok 編譯器外掛程式的體驗</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84575" target="_blank">穩定 <code>kotlinx.collections.immutable</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">將 <code>kotlinx-datetime</code> 提升至 Beta 階段</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">實作 KDoc 機器可讀表示法</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準程式庫的新多平台 API：支援 Unicode 與碼點</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">穩定 <code>kotlinx-io</code> 程式庫</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">針對回傳非 Unit 值且未被使用的 Kotlin 函式，引入預設的警告/錯誤</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">發佈 Kotlin 資料框 1.0</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">發佈 Kandy 0.9</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">改善 Ktor 中的驗證機制</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-9498" target="_blank">支援 HTTP/3</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">透過產生器外掛程式與教學為 Ktor 增加 gRPC 支援</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">改善 Ktor 管理與可觀測性</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-819" target="_blank">發佈 Exposed DAO 2.0</a></li>
            </list>
         </td>
    </tr>
</table>

> * 此發展藍圖並非團隊正在進行的所有工作的詳盡清單，僅包含最大的專案。
> * 我們不承諾在特定版本中交付特定的特性或修正。
> * 我們將根據實際情況調整優先事項，並大約每六個月更新一次發展藍圖。
> 
{style="note"}

## 自 2026 年 2 月以來的變更 {id="what-s-changed-since-february-2026"}

### 已完成項目 {id="completed-items"}

我們已**完成**上一個發展藍圖中的以下項目：

* ✅ 編譯器：[演進 Power-assert 外掛程式](https://youtrack.jetbrains.com/issue/KT-84568)
* ✅ 編譯器：[Kotlin/Wasm：支援多模組編譯](https://youtrack.jetbrains.com/issue/KT-82064)
* ✅ 多平台：[Swift Export：Alpha 版本發佈](https://youtrack.jetbrains.com/issue/KT-64572)
* ✅ 多平台：[在 iOS 上為 Compose Multiplatform 實作新的 `TextInputService`](https://youtrack.jetbrains.com/issue/KT-84569)
* ✅ 多平台：[支援 Swift 6.3](https://youtrack.jetbrains.com/issue/KT-84570)
* ✅ 多平台：[穩定 Compose Multiplatform 的 Navigation3](https://youtrack.jetbrains.com/issue/KT-84571)
* ✅ 工具支援：[Maven 上 Kotlin 的智慧預設設定（混合 Java + Kotlin）](https://youtrack.jetbrains.com/issue/KT-84573)
* ✅ 工具支援：[發佈支援宣告式 Gradle 的 Kotlin 生態系統外掛程式](https://youtrack.jetbrains.com/issue/KT-71292)
* ✅ 生態系統：[改善 Kotlin 發佈使用者體驗：增加程式碼涵蓋率與二進位相容性驗證](https://youtrack.jetbrains.com/issue/KT-71297)
* ✅ 生態系統：[為標準程式庫的安全性修正引入 18 個月的支援週期](https://youtrack.jetbrains.com/issue/KT-83525)
* ✅ 生態系統：[為 Exposed 建立遷移 Gradle 外掛程式](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### 新增項目 {id="new-items"}

我們已在發展藍圖中**新增**以下項目：

* 🆕 編譯器：[將 Kotlin/Wasm 提升至穩定版](https://youtrack.jetbrains.com/issue/KT-88663)
* 🆕 編譯器：[改善 KAPT 效能使其足以與 Java APT 媲美](https://youtrack.jetbrains.com/issue/KT-88664)
* 🆕 多平台：[透過 Skiko 中的 Graphite 改進繪圖可靠性與具未來性的 GPU 支援](https://youtrack.jetbrains.com/issue/SKIKO-982)
* 🆕 多平台：[Swift Export：從 Alpha 邁向 Beta](https://youtrack.jetbrains.com/issue/KT-86791)
* 🆕 多平台：[在 iOS 的 Compose Multiplatform 中將原生文字輸入設為預設](https://youtrack.jetbrains.com/issue/CMP-10598)
* 🆕 多平台：[Release 模式下的原生編譯器快取](https://youtrack.jetbrains.com/issue/KT-86492)
* 🆕 工具支援：[透過統一的編譯器外掛程式套件 (bundle) 簡化 Maven 上的 Kotlin 入門流程](https://youtrack.jetbrains.com/issue/KT-88545)
* 🆕 工具支援：[為 Kotlin/Native 偵錯工具整合 Xcode](https://youtrack.jetbrains.com/issue/KMT-2910)
* 🆕 工具支援：[在未啟用配置快取 (configuration cache) 的情況下允許 Native 任務平行化](https://youtrack.jetbrains.com/issue/KT-88546)
* 🆕 工具支援：[Kotlin 工具鏈：進入 Kotlin 的單一入口點](https://youtrack.jetbrains.com/issue/KTC-5718)
* 🆕 生態系統：[為 Kotlin 標準程式庫 (stdlib) 型別實作一等公民等級的 JPA/Hibernate 支援](https://youtrack.jetbrains.com/issue/KT-88665)

### 已移除項目 {id="removed-items"}

我們已從發展藍圖中**移除**以下項目：

* ❌ 多平台：[實作下一代多平台程式庫的發佈格式](https://youtrack.jetbrains.com/issue/KT-68323)
* ❌ 工具支援：[改善 Kotlin 指令碼編寫與 `.gradle.kts` 的使用體驗](https://youtrack.jetbrains.com/issue/KT-49511)
* ❌ 生態系統：[穩定 Kotlin Notebooks](https://youtrack.jetbrains.com/issue/KT-80324)