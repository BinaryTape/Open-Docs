# A2A 协议

本页面概述了 Koog 代理框架中 A2A（代理到代理）协议的实现。

## A2A 协议是什么？

A2A（代理到代理）协议是一种标准化的通信协议，它使 AI 代理能够彼此以及与客户端应用程序进行交互。
它定义了一组方法、消息格式和行为，这些定义使得代理通信能够保持一致性并实现互操作。
关于 A2A 协议的更多信息和详细规范，请参见官方 [A2A 协议网站](https://a2a-protocol.org/latest/)。

## 快速入门

**重要提示**：A2A 依赖项默认**不**包含在 `koog-agents` 元依赖项中。
你必须显式地将所需的 A2A 模块添加到你的项目。

若要在项目中使用 A2A，请根据你的用例添加依赖项：

-   **针对 A2A 客户端**：请参见 [A2A 客户端文档](a2a-client.md#dependencies)
-   **针对 A2A 服务器**：请参见 [A2A 服务器文档](a2a-server.md#dependencies)
-   **针对 Koog 集成**：请参见 [A2A Koog 集成文档](a2a-koog-integration.md#dependencies)

## A2A 关键组件

Koog 为 A2A 协议 v0.3.0 提供了完整实现，同时支持客户端和服务器，并与 Koog 代理框架进行了集成：

-   [A2A 服务器](a2a-server.md) 是一个代理或代理系统，它公开了一个实现 A2A 协议的端点。它接收来自客户端的请求，处理任务，并返回结果或状态更新。它也可以独立于 Koog 代理使用。
-   [A2A 客户端](a2a-client.md) 是一个客户端应用程序或代理，它使用 A2A 协议与 A2A 服务器发起通信。它也可以独立于 Koog 代理使用。
-   [A2A Koog 集成](a2a-koog-integration.md) 是一组类和工具类，它们简化了 A2A 与 Koog 代理的集成。它包含组件（A2A 特性和节点），用于在 Koog 框架内实现无缝的 A2A 代理连接和通信。

有关更多示例，请参见 [示例](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a)