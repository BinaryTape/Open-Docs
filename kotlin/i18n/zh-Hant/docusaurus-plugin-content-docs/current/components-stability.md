---
title: "Kotlin 組件的穩定性"
---
Kotlin 語言和工具集被劃分為許多元件，例如用於 JVM、JS 和 Native 目標的編譯器、標準函式庫、各種附屬工具等等。
其中許多元件已正式發佈為 **Stable（穩定版）**，這意味著它們以向後相容的方式發展，並遵循 [「_舒適更新_」和「_保持語言現代化_」原則](kotlin-evolution-principles)。

遵循「_回饋迴圈_」原則，我們儘早發佈許多內容供社群試用，因此許多元件尚未發佈為 **Stable（穩定版）**。
其中一些處於非常早期的階段，一些則更成熟。
我們會根據每個元件的發展速度以及使用者採用它所承擔的風險，將它們標記為 **Experimental（實驗性）**、**Alpha（Alpha 版）**或 **Beta（Beta 版）**。

## 穩定性等級說明

以下是這些穩定性等級及其含義的快速指南：

**Experimental（實驗性）** 表示「僅在玩具專案中嘗試」：
  * 我們只是在嘗試一個想法，並希望一些使用者試用它並提供回饋。如果它不起作用，我們可能會隨時放棄它。

**Alpha（Alpha 版）** 表示「使用風險自負，預期會有遷移問題」：
  * 我們打算將這個想法產品化，但它尚未達到最終形態。

**Beta（Beta 版）** 表示「您可以使用它，我們將盡最大努力減少您的遷移問題」：
  * 它幾乎完成了，使用者回饋現在尤其重要。
  * 儘管如此，它並非 100% 完成，因此可能會進行更改（包括基於您自己回饋的更改）。
  * 提前注意棄用警告，以獲得最佳更新體驗。

我們統稱 _Experimental（實驗性）_、_Alpha（Alpha 版）_ 和 _Beta（Beta 版）_ 為 **pre-stable（預穩定）** 等級。

<a name="stable"/>

**Stable（穩定版）** 表示「即使在最保守的情況下也可以使用它」：
  * 它完成了。我們將按照嚴格的 [向後相容性規則](https://kotlinfoundation.org/language-committee-guidelines/) 來發展它。

請注意，穩定性等級並未說明元件何時會發佈為 Stable（穩定版）。同樣，它們也沒有說明元件在發佈前會更改多少。它們僅說明元件的變更速度以及使用者面臨的更新問題風險有多大。

## Kotlin 元件的 GitHub 徽章

[Kotlin GitHub 組織](https://github.com/Kotlin) 託管了不同的 Kotlin 相關專案。
其中一些是我們全職開發的，而另一些則是副專案。

每個 Kotlin 專案都有兩個 GitHub 徽章，用於描述其穩定性和支援狀態：

* **Stability（穩定性）** 狀態。這顯示了每個專案的發展速度以及使用者採用它所承擔的風險。
  穩定性狀態與 [Kotlin 語言特性及其元件的穩定性等級](#stability-levels-explained) 完全一致：
    * <img src="https://kotl.in/badges/experimental.svg" alt="Experimental stability level" style={{verticalAlign: 'middle'}}/> 代表 **Experimental（實驗性）**
    * <img src="https://kotl.in/badges/alpha.svg" alt="Alpha stability level" style={{verticalAlign: 'middle'}}/> 代表 **Alpha（Alpha 版）**
    * <img src="https://kotl.in/badges/beta.svg" alt="Beta stability level" style={{verticalAlign: 'middle'}}/> 代表 **Beta（Beta 版）**
    * <img src="https://kotl.in/badges/stable.svg" alt="Stable stability level" style={{verticalAlign: 'middle'}}/> 代表 **Stable（穩定版）**

* **Support（支援）** 狀態。這顯示了我們對維護專案和幫助使用者解決問題的承諾。
  支援等級對於所有 JetBrains 產品都是統一的。
  [有關詳細資訊，請參閱 JetBrains Open Source 文件](https://github.com/JetBrains#jetbrains-on-github)。

## 子元件的穩定性

一個穩定的元件可能有一個實驗性的子元件，例如：
* 一個穩定的編譯器可能有一個實驗性的功能；
* 一個穩定的 API 可能包含實驗性的類別或函式；
* 一個穩定的命令列工具可能具有實驗性的選項。

我們確保準確記錄哪些子元件不是 **Stable（穩定版）**。
我們也會盡力在可能的情況下警告使用者，並要求他們明確選擇加入，以避免意外使用尚未發佈為穩定版的功能。

## Kotlin 元件的目前穩定性

:::note
預設情況下，所有新元件都具有 Experimental（實驗性）狀態。

:::

### Kotlin 編譯器

| **Component（元件）**                                                                  | **Status（狀態）** | **Status since version（狀態起始版本）** | **Comments（備註）** |
|---------------------------------------------------------------------------------------|--------------------|------------------------------------------|----------------------|
| Kotlin/JVM                                                                            | Stable（穩定版）     | 1.0.0                                      |                      |
| Kotlin/Native                                                                         | Stable（穩定版）     | 1.9.0                                      |                      |
| Kotlin/JS                                                                             | Stable（穩定版）     | 1.3.0                                      |                      |
| Kotlin/Wasm                                                                           | Alpha（Alpha 版）    | 1.9.20                                     |                      |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable（穩定版）     |                                          |                      |

### 核心編譯器外掛程式

| **Component（元件）**                                | **Status（狀態）**   | **Status since version（狀態起始版本）** | **Comments（備註）** |
|-----------------------------------------------------|----------------------|------------------------------------------|----------------------|
| [All-open](all-open-plugin)                      | Stable（穩定版）       | 1.3.0                                      |                      |
| [No-arg](no-arg-plugin)                          | Stable（穩定版）       | 1.3.0                                      |                      |
| [SAM-with-receiver](sam-with-receiver-plugin)    | Stable（穩定版）       | 1.3.0                                      |                      |
| [kapt](kapt)                                     | Stable（穩定版）       | 1.3.0                                      |                      |
| [Lombok](lombok)                                 | Experimental（實驗性） | 1.5.20                                     |                      |
| [Power-assert](power-assert)                     | Experimental（實驗性） | 2.0.0                                     |                      |

### Kotlin 函式庫

| **Component（元件）**          | **Status（狀態）** | **Status since version（狀態起始版本）** | **Comments（備註）** |
|--------------------------------|--------------------|------------------------------------------|----------------------|
| kotlin-stdlib (JVM)            | Stable（穩定版）     | 1.0.0                                      |                      |
| kotlinx-coroutines             | Stable（穩定版）     | 1.3.0                                      |                      |
| kotlinx-serialization          | Stable（穩定版）     | 1.0.0                                      |                      |
| kotlin-metadata-jvm            | Stable（穩定版）     | 2.0.0                                      |                      |
| kotlin-reflect (JVM)           | Beta（Beta 版）    | 1.0.0                                      |                      |
| kotlinx-datetime               | Alpha（Alpha 版）    | 0.2.0                                      |                      |
| kotlinx-io                     | Alpha（Alpha 版）    | 0.2.0                                      |                      |

### Kotlin Multiplatform

| **Component（元件）**                                | **Status（狀態）**   | **Status since version（狀態起始版本）** | **Comments（備註）**                                                               |
|-----------------------------------------------------|----------------------|------------------------------------------|------------------------------------------------------------------------------------|
| Kotlin Multiplatform                                | Stable（穩定版）       | 1.9.20                                      |                                                                                    |
| Kotlin Multiplatform plugin for Android Studio      | Beta（Beta 版）    | 0.8.0                                      | [Versioned separately from the language](multiplatform-plugin-releases) |

### Kotlin/Native

| **Component（元件）**                                | **Status（狀態）** | **Status since version（狀態起始版本）** | **Comments（備註）**                            |
|-----------------------------------------------------|--------------------|------------------------------------------|------------------------------------------------|
| Kotlin/Native Runtime                               | Stable（穩定版）     | 1.9.20                                      |                                                |
| Kotlin/Native interop with C and Objective-C        | Beta（Beta 版）    | 1.3.0                                      |                                                |
| klib binaries                                       | Stable（穩定版）     | 1.9.20                                      | Not including cinterop klibs, see below        |
| cinterop klib binaries                              | Beta（Beta 版）    | 1.3.0                                      |                                                |
| CocoaPods integration                               | Stable（穩定版）     | 1.9.20                                      |                                                |

> 有關 Kotlin/Native 目標支援的詳細資訊，請參閱 [](native-target-support)。

### 語言工具

| **Component（元件）**                         | **Status（狀態）**   | **Status since version（狀態起始版本）** | **Comments（備註）**                                   |
|-----------------------------------------------|----------------------|------------------------------------------|--------------------------------------------------------|
| Scripting syntax and semantics                | Alpha（Alpha 版）    | 1.2.0                                      |                                                        |
| Scripting embedding and extension API         | Beta（Beta 版）    | 1.5.0                                      |                                                        |
| Scripting IDE support                         | Beta（Beta 版）    |                                          | Available since IntelliJ IDEA 2023.1 and later         |
| CLI scripting                                 | Alpha（Alpha 版）    | 1.2.0                                      |                                                        |

## 語言特性和設計提案

有關語言特性和新設計提案，請參閱 [](kotlin-language-features-and-proposals)。