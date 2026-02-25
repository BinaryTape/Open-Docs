# 總覽

Koog 是一個開源的 JetBrains 架構，專為 JVM 與 Kotlin 開發人員設計，用於透過慣用且型別安全 (type-safe) 的 Kotlin DSL 建置 AI agent。
它讓您可以建立能與工具互動、處理複雜工作流程並與使用者溝通的 agent。

您可以使用模組化功能系統自訂 agent 能力，並使用 Kotlin Multiplatform 將您的 agent 部署到 JVM、JS、WasmJS、Android 與 iOS 目標。

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**快速入門**](getting-started.md)

    ---

    建置並執行您的第一個 AI agent

-   :material-book-open-variant:{ .lg .middle } [**術語表**](glossary.md)

    ---

    了解基本術語

</div>

## Agent 類型

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**基礎 agent**](basic-agents.md)

    ---

    建立並執行處理單一輸入並提供回應的 agent

-   :material-script-text-outline:{ .lg .middle } [**功能型 agent**](functional-agents.md)

    ---

    使用純 Kotlin 自訂邏輯來建立並執行輕量級 agent

-   :material-graph-outline:{ .lg .middle } [**複雜工作流程 agent**](complex-workflow-agents.md)

    ---

    建立並執行使用自訂策略處理複雜工作流程的 agent

-   :material-state-machine:{ .lg .middle } [**規劃型 agent**](planner-agents.md)

    ---

    建立並執行反覆建置與執行計畫的 agent

</div>

## 核心功能

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**提示 (Prompts)**](prompts/index.md)

    ---

    建立提示，使用 LLM 用戶端或提示執行器執行它們，
    在 LLM 與供應商之間切換，並透過內建重試機制處理失敗

-   :material-wrench:{ .lg .middle } [**工具**](tools-overview.md)

    ---

    使用內建、基於註解或基於類別且能存取外部系統與 API 的工具來強化您的 agent

-   :material-share-variant-outline:{ .lg .middle } [**策略**](predefined-agent-strategies.md)

    ---

    使用直觀的基於圖形的工作流程設計複雜的 agent 行為

-   :material-bell-outline:{ .lg .middle } [**事件**](agent-events.md)

    ---

    使用預定義處理常式來監控與處理 agent 生命周期、策略、節點、LLM 呼叫及工具呼叫事件

</div>

## 進階用法

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**歷程記錄壓縮**](history-compression.md)

    ---

    使用進階技術在長時間對話中保持內容關聯，同時最佳化語彙單元 (token) 使用量

-   :material-state-machine:{ .lg .middle } [**Agent 持久化**](agent-persistence.md)

    ---

    在執行期間的特定點還原 agent 狀態
        

-   :material-code-braces:{ .lg .middle } [**結構化輸出**](structured-output.md)

    ---

    產生結構化格式的回應

-   :material-waves:{ .lg .middle } [**串流 API**](streaming-api.md)

    ---

    透過串流支援與平行工具呼叫即時處理回應

-   :material-database-search:{ .lg .middle } [**知識檢索**](embeddings.md)

    ---

    使用 [向量嵌入 (vector embeddings)](embeddings.md)、[排序文件存儲](ranked-document-storage.md) 以及 [共享 agent 記憶體](agent-memory.md) 在對話之間保留與檢索知識

-   :material-timeline-text:{ .lg .middle } [**追蹤**](tracing.md)

    ---

    透過詳細且可配置的追蹤功能來偵錯與監控 agent 執行

</div>

## 整合

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**模型上下文協定 (MCP)**](model-context-protocol.md)

    ---

    直接在 AI agent 中使用 MCP 工具

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md)

    ---

    將 Koog 新增到您的 Spring 應用程式

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md)

    ---

    將 Koog 與 Ktor 伺服器整合

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](opentelemetry-support.md)

    ---

    使用流行的觀測工具來追蹤、記錄並測量您的 agent

-   :material-lan:{ .lg .middle } [**A2A 協定**](a2a-protocol-overview.md)

    ---

    透過共享協定連接 agent 與服務

</div>