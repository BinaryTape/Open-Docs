---
status: beta
---

# A2A 协议

--8<-- "versioning-snippets.md:beta"

本页面概述了 Koog 智能体框架中 A2A (Agent-to-Agent) 协议的实现。

## 什么是 A2A 协议？

A2A (Agent-to-Agent) 协议是一种标准化的通信协议，使 AI 智能体能够彼此交互以及与客户端应用程序进行交互。
它定义了一组方法、消息格式和行为，从而实现一致且可互操作的智能体通信。
要了解更多信息和 A2A 协议的详细规范，请参阅官方 [A2A 协议网站](https://a2a-protocol.org/latest/)。

## 快速入门

**重要提示**：`koog-agents` 元依赖项中默认**不**包含 A2A 依赖项。
您必须显式地向项目中添加所需的 A2A 模块。

要在项目中使用 A2A，请根据您的用例添加依赖项：

- **对于 A2A 客户端**：请参阅 [A2A 客户端文档](a2a-client.md#dependencies)
- **对于 A2A 服务器**：请参阅 [A2A 服务器文档](a2a-server.md#dependencies)
- **对于 Koog 集成**：请参阅 [A2A Koog 集成文档](a2a-koog-integration.md#dependencies)

## 关键 A2A 组件

Koog 为客户端和服务器提供了 A2A 协议 v0.3.0 的完整实现，并与 Koog 智能体框架集成：

- [A2A 服务器](a2a-server.md) 是一个暴露了实现 A2A 协议端点的智能体或智能体系统。它接收来自客户端的请求，处理任务，并返回结果或状态更新。它也可以独立于 Koog 智能体使用。
- [A2A 客户端](a2a-client.md) 是一个使用 A2A 协议发起与 A2A 服务器通信的客户端应用程序或智能体。它也可以独立于 Koog 智能体使用。
- [A2A Koog 集成](a2a-koog-integration.md) 是一组简化 A2A 与 Koog 智能体集成的类和实用程序。它包含用于在 Koog 框架内实现无缝 A2A 智能体连接和通信的组件（A2A 功能和节点）。

欲了解更多示例，请查看 [示例](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a)