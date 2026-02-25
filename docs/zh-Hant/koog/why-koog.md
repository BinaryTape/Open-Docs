# 為何選擇 Koog

Koog 的設計旨在以 JetBrains 等級的品質解決現實世界中的問題。
它提供進階的 AI 演算法、開箱即用的成熟技術、Kotlin DSL，以及超越傳統架構的強大多平台支援。

## 與 JVM 和 Kotlin 應用程式整合

Koog 提供專為 JVM 和 Kotlin 開發人員設計的 Kotlin 領域特定語言 (DSL)。
這確保了能順暢整合至基於 Kotlin 與 Java 的應用程式中，顯著提升生產力並增強整體的開發者體驗。

## 經 JetBrains 產品實戰驗證

Koog 為多款 JetBrains 產品提供支援，包括內部的 AI 代理。
這種實戰整合確保了 Koog 針對實際使用案例進行持續的測試、改進與驗證。
它專注於實務中的有效性，並結合了來自廣泛回饋和真實產品場景的洞察。
這種整合賦予了 Koog 與其他架構截然不同的優勢。

## 開箱即用的進階解決方案

Koog 包含預先建置且可組合的解決方案，以簡化並加速代理系統 (Agentic systems) 的開發，使其與僅提供基礎元件的架構有所區別：

* **多種歷程記錄壓縮策略。** Koog 開箱即提供進階策略來壓縮與管理長期的對話，無需手動嘗試各種方法。憑藉經 ML 工程師測試與改進的微調提示詞、技術與演算法，您可以依靠成熟的方法來提升效能。如需更多關於壓縮策略的詳細資訊，請參閱 [歷程記錄壓縮](https://docs.koog.ai/history-compression/)。若要探索 Koog 如何在現實場景中處理壓縮與內容管理，請查看 [這篇文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)。
* **無縫 LLM 切換。** 您可以在任何時間點將對話切換到具有一組新可用工具的不同大型語言模型 (LLM)，而不會遺失現有的對話歷程記錄。Koog 會自動重寫歷程記錄並處理無法使用的工具，實現平滑轉換與自然的互動流程。
* **進階永續性 (Persistence)。** Koog 讓您能恢復完整的代理狀態機，而不僅僅是聊天訊息。這實現了檢查點、失敗恢復等功能，甚至能復原到狀態機執行過程中的任何時間點。
* **強大的重試元件。** Koog 包含一個重試機制，讓您可以在代理系統中封裝任何操作集，並持續重試直到符合可設定的條件為止。您可以提供回饋並調整每次嘗試，以確保結果可靠。如果 LLM 呼叫逾時、工具運作不如預期或發生網路問題，Koog 可確保您的代理保持彈性，即使在暫時性失敗期間也能有效運作。如需更多技術細節，請參閱 [重試功能](https://docs.koog.ai/history-compression/)。
* **結合 Markdown DSL 的結構化型別串流。** Koog 會串流 LLM 輸出，並使用 Markdown DSL 將其剖析為結構化的型別化事件。您可以為特定元素（如標題、項目符號或正規表示式模式）註冊處理常式，並即時僅接收相關部分。這種方法使用 Markdown 提供人類可讀的回饋，並使用結構化型別提供機器可剖析的資料，有效地消除了透明度不足的問題並增強使用者體驗。它確保了輸出的可預測性，並透過漸進式內容呈現實現動態使用者介面。

## 廣泛的整合、多平台支援與增強的可觀測性

Koog 支援在多種平台與環境中開發與部署代理應用程式：

*  **多平台支援**。您可以將代理應用程式部署至 JVM、JS、WasmJS、Android 和 iOS 目標。
*  **廣泛的 AI 整合**。Koog 與主要的 LLM 提供者（包括 OpenAI 和 Anthropic）以及企業級 AI 雲端（如 Bedrock）整合。它也支援 Ollama 等本地模型。如需可用提供者的完整清單，請參閱 [LLM 提供者](https://docs.koog.ai/llm-providers/)。
*  **OpenTelemetry 支援**。Koog 針對熱門的可觀測性提供者（如 [W&B Weave](https://wandb.ai/site/weave/) 和 [Langfuse](https://langfuse.com/)）提供開箱即用的整合，用於監控與偵錯 AI 應用程式。藉由原生的 OpenTelemetry 支援，您可以使用系統中已有的工具來追蹤、記錄與測量您的代理。若要了解更多，請參閱 [OpenTelemetry](https://docs.koog.ai/opentelemetry-support/)。
*  **Spring Boot 與 Ktor 整合**。Koog 與廣泛使用的企業環境整合。
      * 如果您擁有 Ktor 伺服器，可以將 Koog 安裝為外掛程式，使用設定檔配置提供者，並直接從任何路由呼叫代理，而無需手動連接 LLM 用戶端。
      * 對於 Spring Boot，Koog 提供即用型 bean 和自動配置的 LLM 用戶端，讓您輕鬆開始建置由 AI 驅動的工作流。

## 與 ML 工程師和產品團隊協作

Koog 的獨特優勢在於與 JetBrains ML 工程師和產品團隊的直接協作。
這確保了使用 Koog 建置的功能不只是理論，而是根據現實世界的產品需求進行測試與改進。
這意味著 Koog 納入了：

* 針對現實世界效能優化的**微調提示詞與策略**。
* 透過產品開發發現並驗證的**成熟工程方法**，例如其獨特的歷程記錄壓縮策略。您可以在[這篇詳細文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)中了解更多資訊。
* 幫助 Koog 保持效率並適應不斷變化需求的**持續改進**。

## 對開發者社群的承諾

Koog 團隊致力於建立強大的開發者社群。
藉由積極收集並納入回饋，Koog 不斷演進以有效滿足開發人員的需求。
我們正積極擴展對多樣化 AI 架構、全面效能基準測試、詳細使用案例指南以及教育資源的支援，以賦能開發人員。

## 從何處開始

* 在 [總覽](https://docs.koog.ai/) 中探索 Koog 的功能。
* 參考我們的 [快速入門](https://docs.koog.ai/getting-started/) 指南建置您的第一個 Koog 代理。
* 在 Koog [版本說明](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md) 中查看最新更新。
* 從 [範例](https://docs.koog.ai/examples/) 中學習。