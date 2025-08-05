[//]: # (title: 支援平台的穩定性)

Kotlin Multiplatform 讓您能夠為各種平台建立應用程式，並在這些平台之間共用程式碼，以便您可以在使用者偏好的裝置上觸及他們。不同的平台可能根據核心 Kotlin Multiplatform 技術的程式碼共用支援以及 Compose Multiplatform UI 框架的支援，而有不同程度的穩定性。

本頁包含的資訊可協助您識別哪些平台符合您的專案需求，並詳述其穩定性級別。

## 一般 Kotlin 穩定性級別

以下是 Kotlin 中穩定性級別及其含義的快速指南：

**實驗性 (Experimental)** 表示「僅限在玩具專案中嘗試」：

* 我們只是在嘗試一個想法，希望一些使用者能試用並提供回饋。如果效果不彰，我們隨時可能會放棄它。

**Alpha 版 (Alpha)** 表示「請自行承擔風險使用，預期會遇到遷移問題」：

* 我們打算將此想法產品化，但它尚未達到最終形態。

**Beta 版 (Beta)** 表示「您可以使用它，我們將盡力為您將遷移問題降到最低」：

* 它已接近完成，使用者回饋在此時尤其重要。
* 不過，它尚未 100% 完成，因此仍有可能進行變更（包括基於您自身回饋的變更）。
* 務必提前留意棄用警告，以獲得最佳的更新體驗。

我們統稱 _實驗性 (Experimental)_、_Alpha 版 (Alpha)_ 和 _Beta 版 (Beta)_ 為 **預穩定 (pre-stable)** 級別。

**穩定版 (Stable)** 表示「即使在最保守的情況下也可使用」：

* 它已完成。我們將根據我們嚴格的 [向後相容性規則](https://kotlinfoundation.org/language-committee-guidelines/) 進行演進。

### 核心 Kotlin Multiplatform 技術的當前平台穩定性級別

以下是核心 Kotlin Multiplatform 技術的當前平台穩定性級別：

| 平台 (Platform)          | 穩定性級別 (Stability level) |
|--------------------------|-------------------|
| Android                  | 穩定版 (Stable)          |
| iOS                      | 穩定版 (Stable)          |
| Desktop (JVM)            | 穩定版 (Stable)          |
| Server-side (JVM)        | 穩定版 (Stable)          |
| Web based on Kotlin/Wasm | Alpha 版 (Alpha)         |
| Web based on Kotlin/JS   | 穩定版 (Stable)          |
| watchOS                  | Beta 版 (Beta)           |
| tvOS                     | Beta 版 (Beta)           |

* Kotlin Multiplatform 支援比此處列出更多的原生平台。若要了解每個平台的支援程度，請參閱 [Kotlin/Native target support](https://kotlinlang.org/docs/native-target-support.html)。
* 若要深入了解 Kotlin Multiplatform 等 Kotlin 元件的穩定性級別，請參閱 [Current stability of Kotlin components](https://kotlinlang.org/docs/components-stability.html#current-stability-of-kotlin-components)。

## Compose Multiplatform UI 框架穩定性級別

以下是 Compose Multiplatform UI 框架的平台穩定性級別及其含義的快速指南：

**實驗性 (Experimental)** 表示「正在開發中」：

* 某些功能可能尚未推出，而現有的功能可能存在效能問題或錯誤。
* 未來可能會有變更，且破壞性變更可能會頻繁發生。

**Alpha 版 (Alpha)** 表示「請自行承擔風險使用，預期會遇到遷移問題」：

* 我們已決定將平台支援產品化，但它尚未達到最終形態。

**Beta 版 (Beta)** 表示「您可以使用它，我們將盡力為您將遷移問題降到最低」：

* 它已接近完成，因此使用者回饋在此時尤其重要。
* 它尚未 100% 完成，因此仍有可能進行變更（包括基於您自身回饋的變更）。

我們統稱 **實驗性 (Experimental)**、**Alpha 版 (Alpha)** 和 **Beta 版 (Beta)** 為 **預穩定 (pre-stable)** 級別。

**穩定版 (Stable)** 表示「即使在最保守的情況下也可使用」：

* 該框架提供了一個全面的 API 介面，讓您能夠編寫美觀、生產就緒的應用程式，而不會在框架本身遇到效能或其他問題。
* API 破壞性變更只能在官方棄用公告發布後 2 個版本才能進行。

### Compose Multiplatform UI 框架的當前平台穩定性級別

| 平台 (Platform)          | 穩定性級別 (Stability level) |
|--------------------------|-------------------|
| Android                  | 穩定版 (Stable)          |
| iOS                      | 穩定版 (Stable)          |
| Desktop (JVM)            | 穩定版 (Stable)          |
| Web based on Kotlin/Wasm | Alpha 版 (Alpha)         |

## 下一步是什麼？

請參閱 [推薦的 IDEs](recommended-ides.md)，了解哪種 IDE 更適合您在不同平台組合中的程式碼共用情境。