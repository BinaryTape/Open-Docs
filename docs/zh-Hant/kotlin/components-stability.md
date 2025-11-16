[//]: # (title: Kotlin 元件的穩定性)

Kotlin 語言和工具集被劃分為許多元件，例如 JVM、JS 和 Native 目標的編譯器、標準函式庫以及各種配套工具等。
許多這些元件已正式發佈為 **Stable**，這表示它們遵循 [《舒適更新》和《保持語言現代化》的原則](kotlin-evolution-principles.md) 以向後相容的方式演進。

遵循《回饋循環》原則，我們提早發布許多內容供社群試用，因此許多元件尚未發佈為 **Stable**。
其中一些處於非常早期的階段，另一些則更為成熟。
我們根據每個元件的演進速度以及使用者採用時所承擔的風險程度，將它們標記為 **Experimental**、**Alpha** 或 **Beta**。

## 穩定性等級說明

以下是這些穩定性等級及其意義的快速指南：

**Experimental** 意味著「僅限用於試驗性專案」：
* 我們只是在嘗試一個想法，並希望一些使用者能試用並提供回饋。如果行不通，我們隨時可能放棄它。

**Alpha** 意味著「自行承擔風險使用，預期會出現遷移問題」：
* 我們打算將此想法產品化，但它尚未達到最終形態。

**Beta** 意味著「您可以使用它，我們將盡力為您最大限度地減少遷移問題」：
* 它幾乎已完成，使用者回饋現在尤為重要。
* 不過，它並非 100% 完成，因此仍有可能更改（包括根據您自己的回饋進行的更改）。
* 請提前注意棄用警告，以獲得最佳更新體驗。

我們統稱 _Experimental_、_Alpha_ 和 _Beta_ 為 **pre-stable** 等級。

<a name="stable"/>

**Stable** 意味著「即使在最保守的情境中也可以使用」：
* 它已完成。我們將根據嚴格的 [向後相容性規則](https://kotlinfoundation.org/language-committee-guidelines/) 對其進行演進。

請注意，穩定性等級並未說明元件將多快發佈為 Stable。同樣，它們也未指出元件在發佈前將會改變多少。它們僅說明元件的變化速度以及使用者面臨的更新問題風險程度。

## Kotlin 元件的 GitHub 標章

[Kotlin GitHub 組織](https://github.com/Kotlin) 託管著不同的 Kotlin 相關專案。
其中一些是我們全職開發的，而另一些則是附帶專案。

每個 Kotlin 專案都有兩個 GitHub 標章，描述其穩定性和支援狀態：

* **穩定性**狀態。這顯示了每個專案的演進速度以及使用者採用時所承擔的風險。穩定性狀態與 [Kotlin 語言功能及其元件的穩定性等級](#stability-levels-explained) 完全一致：
    * ![Experimental stability level](https://kotl.in/badges/experimental.svg){type="joined"} 代表 **Experimental**
    * ![Alpha stability level](https://kotl.in/badges/alpha.svg){type="joined"} 代表 **Alpha**
    * ![Beta stability level](https://kotl.in/badges/beta.svg){type="joined"} 代表 **Beta**
    * ![Stable stability level](https://kotl.in/badges/stable.svg){type="joined"} 代表 **Stable**

* **支援**狀態。這顯示了我們維護專案和協助使用者解決問題的承諾。所有 JetBrains 產品的支援等級都是統一的。
  [有關詳細資訊，請參閱 JetBrains 開源文件](https://github.com/JetBrains#jetbrains-on-github)。

## 子元件的穩定性

一個穩定的元件可能會有一個實驗性的子元件，例如：
* 穩定的編譯器可能具有實驗性功能；
* 穩定的 API 可能包含實驗性類別或函式；
* 穩定的命令列工具可能具有實驗性選項。

我們確保精確記錄哪些子元件不是 **Stable**。
我們也盡力在可能的情況下警告使用者，並要求他們明確選擇加入，
以避免意外使用尚未發布為 Stable 的功能。

## Kotlin 元件的當前穩定性

> 預設情況下，所有新元件都具有 Experimental 狀態。
>
{style="note"}

### Kotlin 編譯器

| **元件**                                                       | **狀態** | **自版本起狀態** | **備註** |
|---------------------------------------------------------------------|------------|--------------------------|--------------|
| Kotlin/JVM                                                          | Stable     | 1.0.0                    |              |
| Kotlin/Native                                                       | Stable     | 1.9.0                    |              |
| Kotlin/JS                                                           | Stable     | 1.3.0                    |              |
| Kotlin/Wasm                                                         | Beta       | 2.2.20                   |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                          |              |

### 核心編譯器外掛程式

| **元件**                                    | **狀態**   | **自版本起狀態** | **備註** |
|--------------------------------------------------|--------------|--------------------------|--------------|
| [All-open](all-open-plugin.md)                   | Stable       | 1.3.0                    |              |
| [No-arg](no-arg-plugin.md)                       | Stable       | 1.3.0                    |              |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | Stable       | 1.3.0                    |              |
| [kapt](kapt.md)                                  | Stable       | 1.3.0                    |              |
| [Lombok](lombok.md)                              | Experimental | 1.5.20                   |              |
| [Power-assert](power-assert.md)                  | Experimental | 2.0.0                    |              |

### Kotlin 函式庫

| **元件**         | **狀態** | **自版本起狀態** | **備註** |
|-----------------------|------------|--------------------------|--------------|
| kotlin-stdlib (JVM)   | Stable     | 1.0.0                    |              |
| kotlinx-coroutines    | Stable     | 1.3.0                    |              |
| kotlinx-serialization | Stable     | 1.0.0                    |              |
| kotlin-metadata-jvm   | Stable     | 2.0.0                    |              |
| kotlin-reflect (JVM)  | Beta       | 1.0.0                    |              |
| kotlinx-datetime      | Alpha      | 0.2.0                    |              |
| kotlinx-io            | Alpha      | 0.2.0                    |              |

### Kotlin Multiplatform

| **元件**                                  | **狀態** | **自版本起狀態** | **備註**                                                                                                                         |
|------------------------------------------------|------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Kotlin Multiplatform                           | Stable     | 1.9.20                   |                                                                                                                                      |
| Kotlin Multiplatform 外掛程式 for Android Studio | Beta       | 0.8.0                    | [與語言單獨版本化](https://kotlinlang.org/docs/multiplatform/multiplatform-plugin-releases.html) |

### Kotlin/Native

| **元件**                                | **狀態** | **自版本起狀態** | **備註**                                                                   |
|----------------------------------------------|------------|--------------------------|--------------------------------------------------------------------------------|
| Kotlin/Native 執行時                        | Stable     | 1.9.20                   |                                                                                |
| Kotlin/Native 與 C 和 Objective-C 的互通 | Beta       | 1.3.0                    | [C 和 Objective-C 函式庫匯入的穩定性](native-c-interop-stability.md) |
| klib 二進位檔                                | Stable     | 1.9.20                   | 不包括 cinterop klibs，詳見下文                                        |
| cinterop klib 二進位檔                       | Beta       | 1.3.0                    | [C 和 Objective-C 函式庫匯入的穩定性](native-c-interop-stability.md) |
| CocoaPods 整合                        | Stable     | 1.9.20                   |                                                                                |

有關不同目標的支援等級的更多資訊，請參閱 [](native-target-support.md)。

### 語言工具

| **元件**                         | **狀態**   | **自版本起狀態** | **備註**                                   |
|---------------------------------------|--------------|--------------------------|------------------------------------------------|
| Scripting 語法和語義        | Alpha        | 1.2.0                    |                                                |
| Scripting 嵌入和擴展 API | Beta         | 1.5.0                    |                                                |
| Scripting IDE 支援                 | Beta         |                          | 適用於 IntelliJ IDEA 2023.1 及更高版本 |
| CLI scripting                         | Alpha        | 1.2.0                    |                                                |

## 語言功能和設計提案

有關語言功能和新設計提案，請參閱 [](kotlin-language-features-and-proposals.md)。