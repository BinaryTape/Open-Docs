# 總覽

Koog 是一個開源的 JetBrains 框架，用於建立 AI 代理，它採用慣用、型別安全的 Kotlin DSL，專為 JVM 和 Kotlin 開發者設計。它讓您能夠建立可與工具互動、處理複雜工作流程並與使用者溝通的代理。

您可以透過模組化功能系統自訂代理功能，並使用 Kotlin Multiplatform 將您的代理部署到 JVM、JS、WasmJS、Android 和 iOS 目標。

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**開始使用**](getting-started.md)

    ---

    建立並執行您的第一個 AI 代理

-   :material-book-open-variant:{ .lg .middle } [**術語表**](glossary.md)

    ---

    了解基本術語

</div>

## 代理類型

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**基本代理**](basic-agents.md)

    ---

    建立並執行處理單一輸入並提供回應的代理

-   :material-script-text-outline:{ .lg .middle } [**功能型代理**](functional-agents.md)

    ---

    建立並執行具有自訂邏輯的輕量級代理，以純 Kotlin 編寫

-   :material-graph-outline:{ .lg .middle } [**複雜工作流程代理**](complex-workflow-agents.md)

    ---

    建立並執行使用自訂策略處理複雜工作流程的代理

</div>

## 核心功能

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**提示**](prompt-api.md)

    ---

    建立提示、使用 LLM 用戶端或提示執行器執行它們、在 LLM 和提供者之間切換，並透過內建重試處理故障

-   :material-wrench:{ .lg .middle } [**工具**](tools-overview.md)

    ---

    使用內建、基於註解或基於類別的工具來增強您的代理，這些工具可以存取外部系統和 API

-   :material-share-variant-outline:{ .lg .middle } [**策略**](predefined-agent-strategies.md)

    ---

    使用直觀的圖形化工作流程設計複雜的代理行為

-   :material-bell-outline:{ .lg .middle } [**事件**](agent-events.md)

    ---

    使用預定義的處理器監控並處理代理生命週期、策略、節點、LLM 呼叫和工具呼叫事件

</div>

## 進階用法

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**歷史壓縮**](history-compression.md)

    ---

    使用先進技術優化令牌使用，同時在長期對話中保持上下文

-   :material-state-machine:{ .lg .middle } [**代理持久化**](agent-persistence.md)

    ---

    在執行期間的特定點恢復代理狀態
        

-   :material-code-braces:{ .lg .middle } [**結構化輸出**](structured-output.md)

    ---

    以結構化格式生成回應

-   :material-waves:{ .lg .middle } [**串流 API**](streaming-api.md)

    ---

    透過串流支援和平行工具呼叫，即時處理回應

-   :material-database-search:{ .lg .middle } [**知識檢索**](embeddings.md)

    ---

    使用 [向量嵌入](embeddings.md)、[分級文件儲存](ranked-document-storage.md) 和 [共享代理記憶體](agent-memory.md) 在對話中保留和檢索知識

-   :material-timeline-text:{ .lg .middle } [**追蹤**](tracing.md)

    ---

    透過詳細且可設定的追蹤，偵錯並監控代理執行

</div>

## 整合

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**Model Context Protocol (MCP)**](model-context-protocol.md)

    ---

    直接在 AI 代理中使用 MCP 工具

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md)

    ---

    將 Koog 加入您的 Spring 應用程式

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md)

    ---

    將 Koog 與 Ktor 伺服器整合

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](opentelemetry-support.md)

    ---

    使用流行的可觀察性工具追蹤、記錄和衡量您的代理

-   :material-lan:{ .lg .middle } [**A2A Protocol**](a2a-protocol-overview.md)

    ---

    透過共享協定連接代理和服務

</div>