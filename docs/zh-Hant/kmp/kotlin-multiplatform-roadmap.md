# Kotlin Multiplatform 發展藍圖

Kotlin Multiplatform 發展藍圖旨在概述 Kotlin Multiplatform 專案的優先事項和總體方向。

最新的 [發展藍圖部落格文章](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/) 已於 2024 年 10 月 28 日發布。下方頁面總結了該文章的內容，並會隨時更新，以反映我們達到已宣布的里程碑或策略變更：

*   2025 年 2 月 14 日，發展藍圖已更新，以反映 [Kotlin Multiplatform Tooling – Shifting Gears](https://blog.jetbrains.com/kotlin/2025/02/kotlin-multiplatform-tooling-shifting-gears/) 部落格文章中所述的變更。

Kotlin Multiplatform 的目標與 [Kotlin 發展藍圖](https://kotlinlang.org/docs/roadmap.html) 緊密配合。請務必查看該文件，以獲取我們發展方向的更多背景資訊。

## 主要優先事項

*   iOS 版 Stable Compose Multiplatform：推動 iOS 目標達到穩定版本發布，這涉及改進底層框架以及 iOS 特定的整合和基準測試。
*   更好地支援 IntelliJ-based IDEs 中的多平台開發，為 Kotlin Multiplatform 和 Compose Multiplatform 提供優化環境。
*   發布第一個公開版本的 Kotlin-to-Swift export。首次發布時，我們的目標是提供與現有 Objective-C export 相當的體驗，並為未來充分利用 Swift export 鋪平道路。
*   透過提供更好的工具和指南，改善創建多平台函式庫的體驗。我們將改進 `klib` 格式，使其更加靈活和強大，並為創建多平台函式庫提供更好的範本和說明。
*   使 Amper 適用於多平台行動開發。在 2025 年，Amper 應全面支援 iOS 和 Android 的多平台開發，包括使用 Compose Multiplatform 共享 UI 程式碼。

您可以在[常見問題](#faq)部分找到常見問題及解答。

## Compose Multiplatform

Compose Multiplatform 的重點領域包括：

*   **Jetpack Compose 功能對等**。確保所有核心 API 和元件都是多平台的。
*   **iOS 渲染效能**。實施基準測試基礎設施，以捕捉迴歸並使框架的效能對使用者透明。
*   **核心元件的功能完整性**。完成基本功能，包括：
    *   導航
    *   資源管理
    *   無障礙功能
    *   國際化
*   **框架的整體穩定化**。提高整體穩定性（包括 Compose 和原生視圖之間的互操作性），同時透過 Compose Multiplatform 預覽來增強用戶體驗。
*   **文件**。為用戶提供學習和使用 Compose Multiplatform 所需的所有資源，並將其匯集在單一位置。
*   **Compose Multiplatform 網頁版**。達到與其他支援平台的功能對等。

### 對於 Compose HTML 有什麼計畫？

在透過修復錯誤持續維護 Compose HTML 函式庫的同時，我們也在探索其在現有用戶中的使用案例，以便我們能制定其未來發展的計畫。

## 工具鏈

我們的目標是確保 Kotlin Multiplatform 與 KMP 開發中常用的 IDEs（如 IntelliJ IDEA 和 Android Studio）無縫整合，使專案內部或專案之間的程式碼共享更為簡單。

我們也正在探索新的領域來增強開發體驗：

*   調查使用雲端機器構建 iOS 應用程式，以幫助那些不便存取 Apple 裝置的開發人員。
*   試驗更深層次的 AI 工具整合，不僅協助程式碼生成，也協助更複雜的開發任務。

## Kotlin-to-Swift export

我們 2025 年的目標是發布第一個公開版本的直接 Kotlin-to-Swift export。首次發布旨在提供與現有 Objective-C export 相當的用戶體驗，同時克服 Objective-C 的限制。

這將能夠更廣泛地支援 Swift 語言並簡化 API 導出，為未來充分利用 Swift export 鋪平道路。

## 函式庫生態系統

隨著 Kotlin Multiplatform 生態系統的迅速擴展，確保函式庫的向後兼容性變得至關重要。以下是我們的計畫：

*   改進 `klib` 格式，讓函式庫創建者能夠利用其構建 JVM 函式庫的知識。
*   在 Kotlin Multiplatform 函式庫中實現與 JVM 相同的程式碼內聯行為。
*   提供一個工具，確保您的多平台函式庫公開 API 保持向後兼容。

我們也希望改進 Kotlin Multiplatform 函式庫的發布流程。我們希望：

*   為創建和發布 KMP 函式庫提供範本和全面的指南。
*   穩定不同平台上 `klib` 的交叉編譯。
*   推出完全重新設計的 KMP 函式庫發布流程。
*   顯著改善函式庫的文件流程。

雖然 Kotlin Multiplatform 將獲得重大更新，但使用現有格式構建的函式庫仍可與較新的 Kotlin 版本配合使用。

### 改進多平台函式庫的搜尋

目前有超過 2500 個 Kotlin Multiplatform 函式庫可用。然而，儘管選擇廣泛，開發人員要找到符合其特定需求並支援其所選平台的函式庫可能具有挑戰性。

我們的目標是引入一個解決方案，以方便發現這些函式庫並允許開發人員輕鬆試用它們。

### Amper

Amper 是 JetBrains 的一個實驗性專案配置和構建工具。在 2025 年，我們將專注於使 Amper 完全適用於 Android 和 iOS 的多平台行動應用程式開發，並支援共享的 Compose Multiplatform UI。

我們的目標是支援：

*   在本地、實體裝置和 CI 中執行和測試應用程式。
*   簽署應用程式並將其發布到 Play Store 和 App Store。
*   IDE 整合，以確保流暢愉快的體驗。

### Gradle 和其他構建工具

展望 2025 年，我們在 Gradle 增強功能方面的工作已在 [Kotlin 發展藍圖](https://kotlinlang.org/docs/roadmap.html#tooling) 中概述。

以下是我們將特別針對 Kotlin Multiplatform 進行的重點領域：

*   支援在專案層級宣告 Kotlin Multiplatform 依賴項。這將使開發人員更容易有效管理其專案依賴項。
*   改進 `Kotlin/Native` 工具鏈與 Gradle 的整合。
*   實施多平台函式庫的下一代分發格式。這將簡化多平台函式庫的依賴模型和發布佈局，使其更容易與第三方構建工具配合使用，並降低函式庫作者的複雜性。
*   在 Declarative Gradle 中提供對 Kotlin Multiplatform 的全面支援。我們在 Experimental Kotlin Ecosystem Plugin 方面的工作（支援 Declarative Gradle）旨在幫助開發人員探索其 Gradle 構建的宣告式方法。

> *   本發展藍圖並非團隊正在進行的所有工作的詳盡清單，僅列出最大的專案。
> *   不承諾在特定版本中交付特定功能或修復。
> *   我們將隨時調整優先事項並相應地更新發展藍圖。
>
{style="note"}

## 常見問題

### 您能修復 IntelliJ IDEA 中的 KMP 支援嗎？

我們深知在 IntelliJ IDEA 中提供出色 KMP 體驗的重要性。正如[關於 KMP 工具鏈的部落格文章](https://blog.jetbrains.com/kotlin/2025/02/kotlin-multiplatform-tooling-shifting-gears/)所述，我們將專注於增強整個 IntelliJ Platform 的 KMP 支援。這將包括改善品質和穩定性，並引入某些功能，讓偏好 IntelliJ IDEA 進行多平台開發的開發人員，能在他們偏好的 IDE 中享受完整的 KMP 支援。

### Android Studio 中的 KMP 支援情況如何？

我們正積極與 Google 合作，以改進 Android Studio 中的 KMP 支援。更詳細的計畫將於稍後公布。敬請期待！

### 目前 KMP 開發推薦使用哪款 IDE？

如果您的主要使用案例是行動裝置，我們推薦使用 Android Studio。我們也正在努力為 IntelliJ IDEA 提供出色的支援。

### Swift 會在 IntelliJ IDEA 和 Android Studio 中可用嗎？

Swift 是特定 KMP 情境的重要組成部分，我們正在努力支援這些使用案例。

### 您是否放棄了網頁開發？

不，我們絕沒有放棄網頁開發！我們正積極致力於 Kotlin/Wasm 支援以及 Compose Multiplatform 網頁版，以實現與其他平台的功能對等。我們目前的努力包括實現拖放支援、改進文字輸入和渲染，並確保與 HTML 內容的無縫互操作性。我們將很快分享更詳細的網頁開發計畫。敬請期待！

### Compose HTML 情況如何？

在透過修復錯誤持續維護 Compose HTML 函式庫的同時，我們也在探索其在現有用戶中的使用案例，以便我們能制定其未來發展的計畫。