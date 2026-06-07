---
status: beta
---

# A2A 協定

--8<-- "versioning-snippets.md:beta"

本頁面提供 Koog 代理（agentic）架構中 A2A (Agent-to-Agent) 協定實作的概觀。

## 什麼是 A2A 協定？

A2A (Agent-to-Agent) 協定是一種標準化通訊協定，使 AI 代理（agent）能夠彼此互動，並與用戶端應用程式進行溝通。
它定義了一組方法、訊息格式和行為，以實現一致且具備互通性的代理通訊。
如需更多資訊和 A2A 協定的詳細規格，請參閱
官方 [A2A 協定網站](https://a2a-protocol.org/latest/)。

## 快速入門指南

**重要**：`koog-agents` 元相依性（meta-dependency）預設**不**包含 A2A 相依性。
您必須在專案中明確加入所需的 A2A 模組。

要在您的專案中使用 A2A，請根據您的使用案例加入相依性：

- **對於 A2A client**：請參閱 [A2A Client 文件](a2a-client.md#dependencies)
- **對於 A2A server**：請參閱 [A2A Server 文件](a2a-server.md#dependencies)
- **對於 Koog 整合**：請參閱 [A2A Koog 整合文件](a2a-koog-integration.md#dependencies)

## A2A 核心組建

Koog 為用戶端與伺服器提供 A2A 協定 v0.3.0 的完整實作，以及與 Koog 代理架構的整合：

- [A2A Server](a2a-server.md) 是一個代理或代理系統，它公開一個實作 A2A 協定的端點。它接收來自用戶端的請求、處理任務，並傳回結果或狀態更新。它也可以獨立於 Koog 代理程式之外使用。
- [A2A Client](a2a-client.md) 是一個用戶端應用程式或代理，它使用 A2A 協定發起與 A2A 伺服器的通訊。它也可以獨立於 Koog 代理程式之外使用。
- [A2A Koog 整合](a2a-koog-integration.md) 是一組類別與工具程式，可簡化 A2A 與 Koog 代理程式的整合。它包含用於在 Koog 架構內進行無縫 A2A 代理連線與通訊的組建（A2A 功能與節點）。

若要查看更多範例，請參考
[範例](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a)