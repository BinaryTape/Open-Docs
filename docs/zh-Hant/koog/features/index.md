# 功能

Agent 功能提供了一種擴展和增強 AI Agent 功能的方法。
透過功能，您可以：

- 為 Agent 增加新能力
- 攔截並修改 Agent 行為
- 記錄並監控 Agent 執行
- 在單個功能中為相同的事件類型註冊多個處理常式

Koog 架構提供了以下開箱即用的功能：

<div class="grid cards" markdown>

-   :material-flash:{ .lg .middle } [事件處理](agent-event-handlers.md)

    ---

    在 Agent 執行期間監控並回應特定事件

-   :material-routes:{ .lg .middle } [追蹤](tracing.md)

    ---

    擷取 Agent 執行的詳細資訊

-   :material-message-text-clock:{ .lg .middle } [聊天記憶](chat-memory/index.md)

    ---

    在 Agent 執行之間儲存並檢索聊天訊息歷程記錄

-   :material-chip:{ .lg .middle } [Agent 記憶](agent-memory.md)

    ---

    在 Agent 執行期間和執行之間儲存、檢索並使用任意資料

-   :material-database-clock:{ .lg .middle } [長期記憶](long-term-memory.md)

    ---

    為 AI Agent 增加持久性記憶

-   :material-content-save-cog:{ .lg .middle } [Agent 持久化](agent-persistence.md)

    ---

    在執行期間的特定點儲存並還原 Agent 的狀態

-   :simple-opentelemetry:{ .lg .middle } [OpenTelemetry](open-telemetry/index.md)

    ---

    從您的 Agent 產生、收集並匯出遙測資料 (trace)

</div>

若要了解如何實作您自己的功能，請參閱 [自訂功能](custom-features.md)。