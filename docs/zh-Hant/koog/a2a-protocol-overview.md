# A2A 協定

本頁面概述了 Koog 代理框架中 A2A (Agent-to-Agent) 協定的實作。

## 什麼是 A2A 協定？

A2A (Agent-to-Agent) 協定是一種標準化的通訊協定，讓 AI 代理能夠彼此以及與客戶端應用程式互動。
它定義了一組方法、訊息格式和行為，以實現一致且可互通的代理通訊。
如需更多資訊和 A2A 協定的詳細規格，請參閱官方的 [A2A Protocol website](https://a2a-protocol.org/latest/)。

## 開始使用

**重要**：A2A 依賴項預設**不**包含在 `koog-agents` 元依賴項中。您必須明確地將所需的 A2A 模組新增到您的專案。

若要在專案中使用 A2A，請根據您的使用情境新增依賴項：

- **對於 A2A 客戶端**：請參閱 [A2A 客戶端文件](a2a-client.md#dependencies)
- **對於 A2A 伺服器**：請參閱 [A2A 伺服器文件](a2a-server.md#dependencies)
- **對於 Koog 整合**：請參閱 [A2A Koog 整合文件](a2a-koog-integration.md#dependencies)

## A2A 關鍵組件

Koog 為客戶端和伺服器提供了 A2A 協定 v0.3.0 的完整實作，以及與 Koog 代理框架的整合：

- [A2A 伺服器](a2a-server.md) 是一個代理或代理系統，它公開一個實作 A2A 協定的端點。它接收來自客戶端的請求，處理任務，並回傳結果或狀態更新。它也可以獨立於 Koog 代理使用。
- [A2A 客戶端](a2a-client.md) 是一個客戶端應用程式或代理，它使用 A2A 協定發起與 A2A 伺服器的通訊。它也可以獨立於 Koog 代理使用。
- [A2A Koog 整合](a2a-koog-integration.md) 是一組類別和工具，可簡化 A2A 與 Koog 代理的整合。它包含組件（A2A 功能和節點），以便在 Koog 框架內實現無縫的 A2A 代理連接和通訊。

如需更多範例，請參考 [examples](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a)