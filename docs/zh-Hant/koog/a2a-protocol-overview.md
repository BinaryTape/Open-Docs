# A2A 協定

本頁面提供了 Koog 代理架構中 A2A (Agent-to-Agent) 協定實作的總覽。

## 什麼是 A2A 協定？

A2A (Agent-to-Agent) 協定是一種標準化的通訊協定，讓 AI 代理能夠彼此互動，並與用戶端應用程式通訊。
它定義了一組方法、訊息格式與行為，以實現一致且具備互通性的代理通訊。
如需 A2A 協定的更多資訊與詳細規格，請參閱 [A2A 協定官方網站](https://a2a-protocol.org/latest/)。

## 快速入門

**重要**：A2A 相依性 **不** 預設包含在 `koog-agents` 中繼相依性 (meta-dependency) 中。
您必須將需要的 A2A 模組明確地加入到您的專案中。

要在專案中使用 A2A，請根據您的使用案例新增相依性：

- **針對 A2A 用戶端**：請參閱 [A2A 用戶端文件](a2a-client.md#dependencies)
- **針對 A2A 伺服器**：請參閱 [A2A 伺服器文件](a2a-server.md#dependencies)
- **針對 Koog 整合**：請參閱 [A2A Koog 整合文件](a2a-koog-integration.md#dependencies)

## A2A 核心組建

Koog 為用戶端與伺服器提供了 A2A 協定 v0.3.0 的完整實作，並與 Koog 代理架構進行了整合：

- [A2A 伺服器](a2a-server.md) 是一個實作 A2A 協定並對外公開端點的代理或代理系統。它接收來自用戶端的請求、處理任務，並傳回結果或狀態更新。它也可以獨立於 Koog 代理之外使用。
- [A2A 用戶端](a2a-client.md) 是一個使用 A2A 協定啟動與 A2A 伺服器通訊的用戶端應用程式或代理。它也可以獨立於 Koog 代理之外使用。
- [A2A Koog 整合](a2a-koog-integration.md) 是一組類別與公用程式，旨在簡化 A2A 與 Koog 代理的整合。它包含了用於在 Koog 架構中進行無縫 A2A 代理連線與通訊的組建（A2A 功能與節點）。

如需更多範例，請參考 [範例](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a)