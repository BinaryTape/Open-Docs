[//]: # (title: 支援平台的穩定性)

Kotlin Multiplatform 讓您能夠為各種平台建立應用程式，並在它們之間共享程式碼，以便您能夠觸及他們喜愛的裝置上的使用者。不同平台可能具有不同程度的穩定性，這取決於核心 Kotlin Multiplatform 技術在程式碼共享方面的支援，以及 Compose Multiplatform UI 框架的支援。

本頁面包含的資訊旨在幫助您辨識哪些平台符合您的專案需求，並提供其穩定性層級的詳細資訊。

## 一般 Kotlin 穩定性層級

以下是 Kotlin 穩定性層級及其含義的快速指南：

**Experimental** 意味著「僅在玩具專案中嘗試」：

*   我們正在嘗試一個想法，並希望一些使用者可以試用並提供回饋。如果不可行，我們隨時可能放棄它。

**Alpha** 意味著「請自行承擔風險使用，預期會有遷移問題」：

*   我們打算將這個想法產品化，但它尚未達到最終形式。

**Beta** 意味著「您可以使用它，我們將盡力為您減少遷移問題」：

*   它幾乎完成，現在使用者回饋尤其重要。
*   不過，它尚未百分之百完成，因此仍可能會有變更（包括基於您回饋的變更）。
*   請提前留意棄用警告，以獲得最佳更新體驗。

我們將 _Experimental_、_Alpha_ 和 _Beta_ 統稱為 **預穩定** 層級。

**Stable** 意味著「即使在最保守的情境下也能使用」：

*   它已經完成。我們將根據我們嚴格的 [向後相容性規則](https://kotlinfoundation.org/language-committee-guidelines/) 來發展它。

### 核心 Kotlin Multiplatform 技術目前的平台穩定性層級

以下是核心 Kotlin Multiplatform 技術目前的平台穩定性層級：

| 平台                     | 穩定性層級 |
| ------------------------ | ---------- |
| Android                  | Stable     |
| iOS                      | Stable     |
| Desktop (JVM)            | Stable     |
| Server-side (JVM)        | Stable     |
| Web based on Kotlin/Wasm | Alpha      |
| Web based on Kotlin/JS   | Stable     |
| watchOS                  | Beta       |
| tvOS                     | Beta       |

*   Kotlin Multiplatform 支援此處列出之外的更多原生平台。要了解它們各自的支援層級，請參閱 [Kotlin/Native 目標支援](https://kotlinlang.org/docs/native-target-support.html)。
*   有關 Kotlin 元件（如 Kotlin Multiplatform）穩定性層級的更多資訊，請參閱 [Kotlin 元件的目前穩定性](https://kotlinlang.org/docs/components-stability.html#current-stability-of-kotlin-components)。

## Compose Multiplatform UI 框架穩定性層級

以下是 Compose Multiplatform UI 框架平台穩定性層級及其含義的快速指南：

**Experimental** 意味著「它正在開發中」：

*   某些功能可能尚未可用，而已有的功能可能存在效能問題或錯誤。
*   未來可能會有變更，且破壞性變更可能頻繁發生。

**Alpha** 意味著「請自行承擔風險使用，預期會有遷移問題」：

*   我們已決定將平台支援產品化，但它尚未達到最終形式。

**Beta** 意味著「您可以使用它，我們將盡力為您減少遷移問題」：

*   它幾乎完成，因此現在使用者回饋尤其重要。
*   它尚未百分之百完成，因此仍可能會有變更（包括基於您回饋的變更）。

我們將 **Experimental**、**Alpha** 和 **Beta** 統稱為 **預穩定** 層級。

**Stable** 意味著「即使在最保守的情境下也能使用」：

*   該框架提供全面的 API 介面，讓您能夠編寫美觀且可投入生產的應用程式，而不會在框架本身遇到效能或其他問題。
*   API 破壞性變更只能在官方棄用公告發布兩個版本後進行。

### Compose Multiplatform UI 框架目前的平台穩定性層級

| 平台                     | 穩定性層級 |
| ------------------------ | ---------- |
| Android                  | Stable     |
| iOS                      | Stable     |
| Desktop (JVM)            | Stable     |
| Web based on Kotlin/Wasm | Alpha      |

## 接下來？

請參閱 [推薦的 IDE](recommended-ides.md)，了解哪種 IDE 更適合您在不同平台組合中的程式碼共享情境。