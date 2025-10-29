# 為何選擇 Koog

Koog 旨在以 JetBrains 等級的品質解決現實世界中的問題。
它提供先進的 AI 演算法、開箱即用的經證實技術、Kotlin DSL，以及超越傳統框架的強大多平台支援。

## 與 JVM 和 Kotlin 應用程式整合

Koog 提供專為 JVM 和 Kotlin 開發者設計的 Kotlin 領域特定語言 (DSL)。
這確保了與 Kotlin 和 Java 應用程式的無縫整合，
顯著提高了生產力並增強了整體開發者體驗。

## 經 JetBrains 產品的真實世界驗證

Koog 為多個 JetBrains 產品提供動力，包括內部 AI 代理程式。
這種真實世界整合確保 Koog 不斷地在實際應用案例中進行測試、改進和驗證。
它專注於實際運作的有效方法，整合了來自廣泛回饋和真實產品情境的見解。
這種整合賦予了 Koog 與其他框架截然不同的優勢。

## 開箱即用的進階解決方案

Koog 包含預建、可組合的解決方案，以簡化和加速代理系統的開發，使其有別於僅提供基本元件的框架：

*   **多種歷史壓縮策略。** Koog 開箱即用地提供了進階策略，用於壓縮和管理長期對話，無需手動試驗各種方法。憑藉經 ML 工程師測試和改進的微調提示、技術和演算法，您可以依賴經驗證的方法來提高效能。有關壓縮策略的更多詳細資訊，請參閱 [歷史壓縮 (History compression)](https://docs.koog.ai/history-compression/)。要探索 Koog 如何在真實世界情境中處理壓縮和上下文管理，請查閱 [這篇文章 (this article)](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)。
*   **無縫 LLM 切換。** 您可以在任何時間點將對話切換到具有一組新可用工具的不同大型語言模型 (LLM)，而不會丟失現有的對話歷史。Koog 會自動重寫歷史記錄並處理不可用的工具，實現流暢的轉換和自然的互動流程。
*   **進階持久化。** Koog 允許您恢復完整的代理狀態機，而不僅僅是聊天訊息。這使得檢查點、故障復原等功能成為可能，甚至能夠還原到狀態機執行的任何時間點。
*   **強固的重試元件。** Koog 包含一個重試機制，讓您可以在代理系統中包裹任何一組操作，並重複重試它們，直到滿足可配置的條件。您可以提供回饋並調整每次嘗試，以確保可靠的結果。如果 LLM 呼叫超時、工具未按預期工作或出現網路問題，Koog 可確保您的代理程式保持彈性並有效執行，即使在暫時性故障期間也是如此。有關更多技術細節，請參閱 [重試功能 (Retry functionality)](https://docs.koog.ai/history-compression/)。
*   **使用 Markdown DSL 進行結構化型別串流。** Koog 串流 LLM 輸出並使用 Markdown DSL 將其解析為結構化、型別化的事件。您可以為標題、項目符號或正規表達式模式等特定元素註冊處理器，並即時接收相關部分。這種方法使用 Markdown 提供人類可讀的回饋，並使用結構化型別提供機器可解析的資料，有效消除了缺乏透明度的問題並增強了使用者體驗。它確保了可預測的輸出和具有漸進式內容渲染的動態使用者介面。

## 廣泛整合、多平台支援、增強的可觀察性

Koog 支援在各種平台和環境中開發和部署代理應用程式：

*   **多平台支援**。您可以將您的代理應用程式部署到 JVM、JS、WasmJS、Android 和 iOS 目標。
*   **廣泛的 AI 整合**。Koog 整合了主要的 LLM 提供者，包括 OpenAI 和 Anthropic，以及企業級 AI 雲端服務，如 Bedrock。它還支援 Ollama 等本地模型。有關可用提供者的完整列表，請參閱 [LLM 提供者 (LLM providers)](https://docs.koog.ai/llm-providers/)。
*   **OpenTelemetry 支援**。Koog 開箱即用地整合了流行的可觀察性提供者，例如 [W&B Weave](https://wandb.ai/site/weave/) 和 [Langfuse](https://langfuse.com/)，用於監控和除錯 AI 應用程式。憑藉原生的 OpenTelemetry 支援，您可以使用系統中已有的相同工具來追蹤、記錄和量測您的代理程式。要了解更多資訊，請參閱 [OpenTelemetry](https://docs.koog.ai/opentelemetry-support/)。
*   **Spring Boot 和 Ktor 整合**。Koog 整合了廣泛使用的企業環境。
    *   如果您有 Ktor 伺服器，您可以將 Koog 安裝為外掛程式，使用配置檔設定提供者，並直接從任何路由呼叫代理程式，而無需手動連接 LLM 用戶端。
    *   對於 Spring Boot，Koog 提供即用型 Bean 和自動配置的 LLM 用戶端，讓您輕鬆開始建構 AI 驅動的工作流程。

## 與 ML 工程師和產品團隊協作

Koog 的一個獨特優勢是它與 JetBrains ML 工程師和產品團隊的直接協作。
這確保了使用 Koog 建構的功能不僅是理論性的，而且是根據真實世界產品需求進行測試和改進的。
這表示 Koog 整合了：

*   為真實世界效能優化的**微調提示和策略**。
*   透過產品開發發現和驗證的**經證實工程方法**，例如其獨特的歷史壓縮策略。您可以在 [這篇詳細文章 (this detailed article)](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/) 中了解更多。
*   **持續改進**，幫助 Koog 保持高效並適應不斷變化的需求。

## 對開發者社群的承諾

Koog 團隊深入致力於建立一個強大的開發者社群。
透過積極收集和納入回饋，Koog 不斷發展以有效滿足開發者的需求。
我們正在積極擴大對多樣 AI 架構、全面基準測試、詳細使用案例指南和教育資源的支援，以賦能開發者。

## 從何開始

*   在 [概觀 (Overview)](https://docs.koog.ai/) 中探索 Koog 的功能。
*   使用我們的 [入門 (Getting started)](https://docs.koog.ai/getting-started/) 指南建構您的第一個 Koog 代理程式。
*   在 Koog [發行說明 (release notes)](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md) 中查看最新更新。
*   從 [範例 (Examples)](https://docs.koog.ai/examples/) 中學習。