# 總覽

Koog 是一個專為 JVM 生態系統設計，用於建置 AI agent 的開源 JetBrains 架構。
它為 Kotlin 與 Java 開發人員提供了一流的開發體驗，具備慣用且型別安全 (type-safe) 的 Kotlin DSL 以及流暢的產生器樣式 (builder-style) Java API。

雖然 Java 開發人員可以在 JVM 上利用慣用 API 發揮 Koog 的完整功能，但 Kotlin 開發人員還可以使用 Kotlin Multiplatform 將 agent 部署到 JS、WasmJS、Android 與 iOS 目標。

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**快速入門**](quickstart.md)

    ---

    建置並執行您的第一個 AI agent

-   :material-book-open-variant:{ .lg .middle } [**術語表**](glossary.md)

    ---

    了解基本術語

-   :material-shield-check-outline:{ .lg .middle } [**模組版本控制**](module-versioning.md)

    ---

    了解穩定與 beta 模組以及 API 保證

</div>

## Agent

進一步了解 [agent 概覽](agents/index.md) 以及如何使用 Koog 建立不同類型的 agent：

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**基礎 agent**](agents/basic-agents.md)

    ---

    使用適用於大多數常見使用案例的預定義策略

-   :material-function:{ .lg .middle } [**功能型 agent**](agents/functional-agents.md)

    ---

    使用純 Kotlin 或 Java 將自訂邏輯定義為 Lambda 函式

-   :material-state-machine:{ .lg .middle } [**基於圖形的 agent**](agents/graph-based-agents.md)

    ---

    將自訂工作流程實作為策略圖

-   :material-list-status:{ .lg .middle } [**規劃型 agent**](agents/planner-agents/index.md) <span class="beta-badge" title="Beta — API may change">beta</span>

    ---

    反覆建置與執行計畫，直到狀態符合期望的條件

</div>

## 核心元件

詳細了解 Koog agent 的核心元件：

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**提示 (Prompts)**](prompts/index.md)

    ---

    建立、管理並執行驅動 agent 與 LLM 互動的提示

-   :material-strategy:{ .lg .middle } [**策略**](predefined-agent-strategies.md)

    ---

    將 agent 預定的工作流程設計為有向圖

-   :material-tools:{ .lg .middle } [**工具**](tools/index.md)

    ---

    讓 agent 能夠與外部資料來源和服務互動

-   :material-toy-brick-outline:{ .lg .middle } [**功能**](features/index.md)

    ---

    擴充並強化 AI agent 的功能性

</div>

## 進階用法

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**歷程記錄壓縮**](history-compression.md)

    ---

    使用進階技術在長時間對話中保持內容關聯，同時最佳化語彙單元 (token) 使用量

-   :material-floppy:{ .lg .middle } [**Agent 持久化**](features/agent-persistence.md)

    ---

    在執行期間的特定點還原 agent 狀態
        

-   :material-code-braces:{ .lg .middle } [**結構化輸出**](structured-output.md)

    ---

    產生結構化格式的回應

-   :material-waves:{ .lg .middle } [**串流 API**](streaming-api.md)

    ---

    透過串流支援與平行工具呼叫即時處理回應

-   :material-database-search:{ .lg .middle } [**知識檢索**](embeddings.md) <span class="beta-badge" title="Beta — API may change">beta</span>

    ---

    使用 [向量嵌入 (vector embeddings)](embeddings.md) 與 [RAG](retrieval-augmented-generation.md) 在對話之間保留與檢索知識

-   :material-timeline-text:{ .lg .middle } [**追蹤**](features/tracing.md)

    ---

    透過詳細且可配置的追蹤功能來偵錯與監控 agent 執行

-   :material-timeline-text:{ .lg .middle } [**長期記憶**](features/long-term-memory.md) <span class="beta-badge" title="Beta — API may change">beta</span>

    ---

    為 RAG 與持久性記憶體整合向量資料庫與記憶體供應商。

</div>

## 整合

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**模型上下文協定 (MCP)**](model-context-protocol.md) <span class="beta-badge" title="Beta — API may change">beta</span>

    ---

    直接在 AI agent 中使用 MCP 工具

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md) <span class="beta-badge" title="Beta — API may change">beta</span>

    ---

    將 Koog 新增到您的 Spring 應用程式

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md) <span class="beta-badge" title="Beta — API may change">beta</span>

    ---

    將 Koog 與 Ktor 伺服器整合

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](features/open-telemetry/index.md)

    ---

    使用流行的觀測工具來追蹤、記錄並測量您的 agent

-   :material-lan:{ .lg .middle } [**A2A 協定**](a2a/index.md) <span class="beta-badge" title="Beta — API may change">beta</span>

    ---

    透過共享協定連接 agent 與服務

</div>