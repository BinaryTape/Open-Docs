# 概览

Agent 功能提供了一种扩展和增强 AI Agent 功能的方式。功能可以：

- 为 Agent 添加新能力
- 拦截并修改 Agent 行为
- 记录并监控 Agent 执行
- 在单个功能中为同一种事件类型注册多个处理程序

Koog 框架既实现了开箱即用的功能，也允许您实现自己的自定义功能。现成可用的功能包括：

- [事件处理程序](agent-event-handlers.md)
- [跟踪](tracing.md)
- [聊天内存](chat-memory.md)
- [Agent 内存](agent-memory.md)
- [OpenTelemetry](opentelemetry-support.md)
- [Agent 持久化 (快照)](agent-persistence.md)
- 调试器
- Tokenizer
- SQL 持久化提供者

要了解如何实现您自己的功能，请参阅 [自定义功能](custom-features.md)。