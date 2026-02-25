[//]: # (title: 支援平台的穩定性)

Kotlin Multiplatform 讓您可以為各種平台建立應用程式並跨平台共享程式碼，進而觸及使用者偏好的裝置。不同的平台可能具有不同的穩定性等級，這取決於 Kotlin Multiplatform 核心技術對程式碼共享的支援，以及 Compose Multiplatform UI 架構的支援程度。

本頁面包含相關資訊，可協助您識別哪些平台符合您的專案需求，並詳細說明其穩定性等級。

## Kotlin 一般穩定性等級

以下是 Kotlin 穩定性等級及其含義的快速指南：

**Experimental**（實驗性）表示「僅在玩具專案中嘗試」：

* 我們只是在嘗試一個想法，希望一些使用者能試用並提供回饋。如果效果不佳，我們隨時可能捨棄它。

**Alpha** 表示「使用風險自負，預期會有遷移問題」：

* 我們打算將此想法產品化，但它尚未達到最終形態。

**Beta** 表示「您可以使用它，我們將盡力為您減少遷移問題」：

* 它已接近完成，現在使用者的回饋尤為重要。
* 儘管如此，它尚未 100% 完成，因此仍有可能發生變更（包括基於您的回饋所做的變更）。
* 請提前留意棄用警告，以獲得最佳的更新體驗。

我們統稱 **Experimental**、**Alpha** 和 **Beta** 為 **pre-stable**（穩定前）等級。

**Stable**（穩定）表示「即使在最保守的場景中也可以使用」：

* 它已完成。我們將根據嚴格的 [後向相容性規則](https://kotlinfoundation.org/language-committee-guidelines/) 對其進行演進。

### Kotlin Multiplatform 核心技術的目前平台穩定性等級

以下是 Kotlin Multiplatform 核心技術目前的平台穩定性等級：

| 平台                      | 穩定性等級      |
|--------------------------|-----------------|
| Android                  | Stable          |
| iOS                      | Stable          |
| 桌面 (JVM)               | Stable          |
| 伺服器端 (JVM)           | Stable          |
| 基於 Kotlin/Wasm 的 Web   | Beta            |
| 基於 Kotlin/JS 的 Web     | Stable          |
| watchOS                  | Beta            |
| tvOS                     | Beta            |

* Kotlin Multiplatform 支援的原生平台比此處列出的更多。若要了解每個平台的支援程度，請參閱 [Kotlin/Native 目標支援](https://kotlinlang.org/docs/native-target-support.html)。
* 有關 Kotlin Multiplatform 等 Kotlin 元件穩定性等級的更多資訊，請參閱 [Kotlin 元件的目前穩定性](https://kotlinlang.org/docs/components-stability.html#current-stability-of-kotlin-components)。

## Compose Multiplatform UI 架構穩定性等級

以下是 Compose Multiplatform UI 架構平台穩定性等級及其含義的快速指南：

**Experimental**（實驗性）表示「正在開發中」：

* 某些功能可能尚未提供，且已存在的功能可能存在效能問題或錯誤。
* 未來可能會發生變更，且破壞性變更可能會頻繁發生。

**Alpha** 表示「使用風險自負，預期會有遷移問題」：

* 我們已決定將平台支援產品化，但尚未定型。

**Beta** 表示「您可以使用它，我們將盡力為您減少遷移問題」：

* 它已接近完成，因此現在使用者的回饋尤為重要。
* 它尚未 100% 完成，因此仍有可能發生變更（包括基於您的回饋所做的變更）。

我們統稱 **Experimental**、**Alpha** 和 **Beta** 為 **pre-stable** 等級。

**Stable**（穩定）表示「即使在最保守的場景中也可以使用」：

* 該架構提供了全面的 API 介面，讓您可以編寫美觀、正式環境就緒的應用程式，而不會在架構本身遇到效能或其他問題。
* API 破壞性變更只能在正式發佈棄用公告 2 個版本後進行。

### Compose Multiplatform UI 架構目前的平台穩定性等級

| 平台                      | 穩定性等級      |
|--------------------------|-----------------|
| Android                  | Stable          |
| iOS                      | Stable          |
| 桌面 (JVM)               | Stable          |
| 基於 Kotlin/Wasm 的 Web   | Beta            |

## 接續步驟

請參閱 [推薦的 IDE](recommended-ides.md)，了解在不同的平台組合中，哪款 IDE 更適合您的程式碼共享場景。