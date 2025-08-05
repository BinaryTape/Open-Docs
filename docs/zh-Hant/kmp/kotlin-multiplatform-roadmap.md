# Kotlin Multiplatform 路線圖

Kotlin Multiplatform 路線圖旨在概述 Kotlin Multiplatform 專案的優先事項和總體方向。

最新的 [路線圖部落格文章](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/) 已於 2024 年 10 月 28 日發佈。
以下頁面總結了該文章，並在我們達到聲明的里程碑或需要反映策略變化時進行更新：

*   2025 年 2 月 14 日，該路線圖已更新，以反映 [Kotlin Multiplatform 工具鏈 – 調整方向](https://blog.jetbrains.com/kotlin/2025/02/kotlin-multiplatform-tooling-shifting-gears/) 部落格文章中描述的變更。

Kotlin Multiplatform 的目標與 [Kotlin 路線圖](https://kotlinlang.org/docs/roadmap.html) 緊密對齊。
請務必查看，以了解我們正在採取的方向的更多背景資訊。

## 主要優先事項

*   適用於 iOS 的穩定 Compose Multiplatform：推動 iOS 目標達成穩定發佈涉及改進底層框架以及 iOS 特定的整合和基準測試。
*   在基於 IntelliJ 的 IDE 中提供更好的多平台開發支援，為 Kotlin Multiplatform 和 Compose Multiplatform 提供優化的環境。
*   發佈首個 Kotlin-to-Swift 匯出公開版本。在初始發佈中，我們旨在提供與現有 Objective-C 匯出媲美的體驗，並為未來充分利用 Swift 匯出鋪平道路。
*   透過提供更好的工具和指南來改善建立多平台函式庫的體驗。我們將改進 klib 格式，使其更靈活和強大，並為建立多平台函式庫提供更好的範本和說明。
*   使 Amper 適用於多平台行動開發。在 2025 年，Amper 應全面支援 iOS 和 Android 的多平台開發，包括使用 Compose Multiplatform 共享 UI 程式碼。

您可以在 [常見問題部分](#faq) 中找到常見問題和答案。

## Compose Multiplatform

Compose Multiplatform 的重點領域包括：

*   **Jetpack Compose 功能對等**。確保所有核心 API 和元件都支援多平台。
*   **iOS 渲染效能**。實施基準測試基礎設施，以發現迴歸並使框架效能對使用者透明。
*   **核心元件的功能完整性**。完成基本功能，包括：
    *   導航、
    *   資源管理、
    *   無障礙功能、
    *   國際化。
*   **框架的全面穩定化**。在透過 Compose Multiplatform 預覽增強使用者體驗的同時，提高整體穩定性（包括 Compose 與原生視圖之間的互通性）。
*   **文件**。為使用者提供學習和使用 Compose Multiplatform 所需的所有資源，並將其匯集到一個地方。
*   **適用於 Web 的 Compose Multiplatform**。達到與其他支援平台的功能對等。

### Compose HTML 有什麼計畫嗎？

在繼續透過修復錯誤來維護 Compose HTML 函式庫的同時，我們也在探索現有使用者中它的使用案例，以便我們能夠制定其未來開發的計畫。

## 工具鏈

我們的目標是確保 Kotlin Multiplatform 與已經常用於 KMP 開發的 IDE（例如 IntelliJ IDEA 和 Android Studio）無縫整合，使專案內部或專案之間的程式碼共享更為直接。

我們也在探索新的領域來增強開發體驗：

*   研究使用雲端機器建置 iOS 應用程式，以幫助那些無法方便地使用 Apple 裝置的開發人員。
*   試驗更深入的 AI 工具整合，不僅輔助程式碼生成，還輔助更複雜的開發任務。

## Kotlin-to-Swift 匯出

我們 2025 年的目標是發佈首個直接 Kotlin-to-Swift 匯出的公開版本。
初始發佈旨在提供與現有 Objective-C 匯出媲美的使用者體驗，同時克服 Objective-C 的限制。

這將實現對 Swift 語言的更廣泛支援，並促進 API 匯出，為未來充分利用 Swift 匯出鋪平道路。

## 函式庫生態系統

隨著 Kotlin Multiplatform 生態系統的迅速擴張，確保函式庫的向後相容性變得至關重要。
以下是我們的計畫：

*   改進 klib 格式，讓函式庫建立者能夠利用他們建置 JVM 函式庫的知識。
*   在 Kotlin Multiplatform 函式庫中實施與 JVM 相同的程式碼內聯行為。
*   提供一個工具，確保您的多平台函式庫公共 API 保持向後相容。

我們也在尋求改進 Kotlin Multiplatform 函式庫的發佈流程。我們希望：

*   為建立和發佈 KMP 函式庫提供範本和全面的指南。
*   穩定不同平台上的 klib 交叉編譯。
*   推出全面重新設計的 KMP 函式庫發佈流程。
*   顯著改善函式庫的文件流程。

儘管 Kotlin Multiplatform 將收到重大更新，但以當前格式建置的函式庫仍將與較新的 Kotlin 版本相容。

### 改善多平台函式庫的搜尋

目前有超過 2500 個 Kotlin Multiplatform 函式庫可用。
然而，儘管選擇廣泛，開發人員要找到符合其特定需求並支援所選平台的函式庫可能具有挑戰性。

我們的目標是引入一種解決方案，以促進這些函式庫的發現並允許開發人員輕鬆試用它們。

### Amper

Amper 是 JetBrains 的一個實驗性專案配置和建置工具。在 2025 年，我們將專注於使 Amper 完全適用於 Android 和 iOS 的多平台行動應用程式開發，並帶有共享的 Compose Multiplatform UI。

我們旨在支援：

*   在本地、實體裝置以及 CI 環境中執行和測試應用程式。
*   簽署應用程式並將其發佈到 Play Store 和 App Store。
*   IDE 整合，以確保流暢愉快的體驗。

### Gradle 和其他建置工具

展望 2025 年，我們在 Gradle 增強方面的工作已在 [Kotlin 路線圖](https://kotlinlang.org/docs/roadmap.html#tooling) 中概述。

以下是我們將特別針對 Kotlin Multiplatform 展開工作的重點領域：

*   支援在專案層級聲明 Kotlin Multiplatform 依賴項。這將使開發人員更容易有效地管理其專案依賴項。
*   改進 Kotlin/Native 工具鏈與 Gradle 的整合。
*   實施多平台函式庫的下一代發佈格式。這將簡化多平台函式庫的依賴項模型和發佈佈局，使其更容易與第三方建置工具配合使用，並降低函式庫作者的複雜性。
*   在 Declarative Gradle 中提供對 Kotlin Multiplatform 的全面支援。我們在支援 Declarative Gradle 的 Experimental Kotlin Ecosystem Plugin 方面的工作，旨在幫助開發人員探索其 Gradle 建置的宣告式方法。

> * 此路線圖並非團隊正在進行的所有工作的詳盡清單，僅為最重要的專案。
> * 沒有承諾在特定版本中提供特定功能或修復。
> * 我們將根據進展調整優先事項並相應地更新路線圖。
>
{style="note"}

## 常見問題

### 您能修復 IntelliJ IDEA 中的 KMP 支援嗎？

我們認識到在 IntelliJ IDEA 中提供卓越 KMP 體驗的重要性。
如 [關於 KMP 工具鏈的部落格文章](https://blog.jetbrains.com/kotlin/2025/02/kotlin-multiplatform-tooling-shifting-gears/) 所述，我們將專注於全面增強對 IntelliJ Platform 的 KMP 支援。
這將包括改善品質和穩定性，並引入某些功能，讓偏好使用 IntelliJ IDEA 進行多平台開發的開發人員，能在他們偏好的 IDE 中享受完整的 KMP 支援。

### Android Studio 中的 KMP 支援如何？

我們正在積極與 Google 合作，以改進 Android Studio 中的 KMP 支援。
更詳細的計畫將在稍後公佈。
敬請關注！

### 目前 KMP 開發推薦使用哪種 IDE？

如果您的主要使用案例是行動裝置，我們建議使用 Android Studio。
我們也正在努力在 IntelliJ IDEA 中提供出色的支援。

### Swift 會在 IntelliJ IDEA 和 Android Studio 中可用嗎？

Swift 是某些 KMP 情境的重要組成部分，我們正在努力支援這些使用案例。

### 您們是否放棄 Web 了？

不，我們一點都沒有放棄 Web！
我們正在積極開發 Kotlin/Wasm 支援，以及適用於 Web 的 Compose Multiplatform，以實現與其他平台的功能對等。
我們目前的努力包括實施拖放支援、改進文字輸入和渲染，並確保與 HTML 內容的無縫互通性。
我們將很快分享更多關於 Web 的詳細計畫。敬請關注！

### Compose HTML 如何？

在繼續透過修復錯誤來維護 Compose HTML 函式庫的同時，我們也在探索現有使用者中它的使用案例，以便我們能夠制定其未來開發的計畫。