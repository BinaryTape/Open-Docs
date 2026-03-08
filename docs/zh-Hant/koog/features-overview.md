# 總覽

Agent 功能提供了一種擴充與增強 AI Agent 功能性的方式。功能可以：

- 為 Agent 增加新能力
- 攔截並修改 Agent 行為
- 記錄並監控 Agent 執行
- 在單一功能中為同一個事件類型註冊多個處理常式

Koog 架構實作了開箱即用的功能，並允許您實作自己的自訂功能。現成的功能包括：

- [事件處理常式](agent-event-handlers.md)
- [執行緒](tracing.md)
- [對話記憶體](chat-memory.md)
- [Agent 記憶體](agent-memory.md)
- [OpenTelemetry](opentelemetry-support.md)
- [Agent 持久化 (快照)](agent-persistence.md)
- 偵錯工具
- Tokenizer
- SQL 持久化提供者

若要了解如何實作您自己的功能，請參閱 [自訂功能](custom-features.md)。