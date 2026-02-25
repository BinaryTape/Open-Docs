# 範例

Koog 架構提供的範例可協助您了解如何針對不同的使用案例實作 AI 代理。
這些範例展示了您可以套用到自己應用程式中的關鍵特性與模式。

瀏覽下方的範例，並點擊連結以在 GitHub 上檢視原始碼。

| 範例 | 說明 |
|-------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Attachments](examples/Attachments.md)                                                                                              | 學習如何在提示詞中使用結構化 Markdown 和附件。建立包含圖片的提示詞，並使用 OpenAI 模型為 Instagram 貼文產生創意內容。 |
| [Banking](examples/Banking.md)                                                                                                      | 建立一個具備路由功能的全方位 AI 銀行助手，能透過複雜的基於圖形策略處理轉帳和交易分析。包含領域建模、工具建立和代理組成模式。 |
| [BedrockAgent](examples/BedrockAgent.md)                                                                                            | 使用整合了 AWS Bedrock 的 Koog 架構建立智慧 AI 代理。學習如何定義自訂工具、設定 AWS Bedrock，以及建立能理解自然語言指令以控制裝置的互動式代理。 |
| [Calculator](examples/Calculator.md)                                                                                                | 建立一個計算機代理，使用加、減、乘、除工具執行算術運算。展示平行工具呼叫、事件記錄以及多執行器支援 (OpenAI 和 Ollama)。 |
| [Chess](examples/Chess.md)                                                                                                          | 建立一個智慧西洋棋代理，具備複雜的領域建模、自訂工具、記憶體最佳化技術和互動式選項選取。展示進階代理策略、遊戲狀態管理和人機協作模式。 |
| [GoogleMapsMcp](examples/GoogleMapsMcp.md)                                                                                          | 透過 Docker 將 Koog 連接至 Google Maps MCP 伺服器。在 Kotlin Notebook 環境中，使用 AI 代理與現實世界的地理 API 來探索工具、對地址進行地理編碼並獲取海拔資料。 |
| [Guesser](examples/Guesser.md)                                                                                                      | 建立一個猜數字代理，利用工具詢問針對性問題來實作二分搜尋策略。該代理透過策略性提問有效縮小使用者數字的範圍，並展示基於工具的互動模式。 |
| [Langfuse](examples/Langfuse.md)                                                                                                    | 學習如何使用 OpenTelemetry 將 Koog 代理追蹤匯出至 Langfuse。設定環境變數、執行代理，並在 Langfuse 執行個體中檢查 span 和追蹤以獲得全面的可觀測性。 |
| [MCP](https://github.com/JetBrains/koog/tree/develop/examples/src/main/kotlin/ai/koog/agents/example/mcp)                           | 模型內容協定 (Model Context Protocol) 的整合範例，包含用於地理資料的 GoogleMapsMcpClient 和用於瀏覽器自動化的 PlaywrightMcpClient。 |
| [Memory](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/memory)                     | 一個展示記憶體系統用法的客戶支援代理。該代理使用加密的本機儲存空間，並透過主體與作用域的適當記憶體組織，追蹤使用者的對話偏好、裝置診斷和組織特定資訊。 |
| [OpenTelemetry](examples/OpenTelemetry.md)                                                                                          | 為 Koog AI 代理新增基於 OpenTelemetry 的追蹤。學習將 span 發送到主控台進行偵錯，並將追蹤匯出到 OpenTelemetry Collector 以在 Jaeger 中檢視。包含 Docker 設定與疑難排解指南。 |
| [Planner](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/planner)                   | 一個任務規劃系統，建立具有平行與循序執行節點的執行樹，動態地為複雜的工作流建構執行計畫。 |
| [PlaywrightMcp](examples/PlaywrightMcp.md)                                                                                          | 使用 Playwright MCP 和 Koog 驅動瀏覽器。啟動 Playwright MCP 伺服器，透過 SSE 連接，並讓 AI 代理透過自然語言指令自動化 Web 任務，如導覽、接受 Cookie 和 UI 互動。 |
| [SimpleAPI](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/simpleapi)               | 展示聊天代理和基本代理的範例，使用簡單的 API 模式來開始使用 Koog。 |
| [StructuredData](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/structuredoutput)     | 展示基於 JSON 的結構化資料輸出，包含複雜的巢狀類別、多型以及天氣預報範例，說明如何在代理回應中處理型別化資料。 |
| [SubgraphWithTask](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/subgraphwithtask) | 專案產生工具，展示檔案與目錄操作，包含使用子圖策略進行建立、刪除和指令執行。 |
| [Tone](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/tone)                         | 一個文字語氣分析代理，使用專門工具識別輸入文字中的正向、負向或中性語氣，展示情感分析能力。 |
| [UnityMcp](examples/UnityMcp.md)                                                                                                    | 使用 Unity MCP 伺服器整合，讓 AI 代理驅動 Unity 遊戲開發。透過 stdio 連接至 Unity，探索可用工具，並讓代理透過自然語言指令修改場景、放置物件並執行遊戲開發任務。 |
| [VaccumAgent](examples/VaccumAgent.md)                                                                                              | 使用 Koog 架構實作基礎反射代理。涵蓋環境建模、工具建立與代理行為，在簡單的雙格世界中執行自動清潔任務。 |
| [Weave](examples/Weave.md)                                                                                                          | 學習如何使用 OpenTelemetry (OTLP) 將 Koog 代理追蹤至 W&B Weave。設定環境變數、執行代理，並在 Weave UI 中查看豐富的追蹤，以進行全面的監控與偵錯。 |
| [A2A](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a)                                                                                                            | 展示使用 Koog 架構進行代理對代理 (A2A) 的通訊。說明如何設定 AI 代理之間的雙向通訊、啟用協作解決問題，並透過適當的訊息路由與協調管理多代理工作流。 |