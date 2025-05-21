---
title: "與 Java 的比較"
---
## Kotlin 解決的 Java 問題

Kotlin 修正了一系列 Java 存在的問題：

* Null 引用由[類型系統](null-safety)控制。
* [沒有 Raw Types](java-interop#java-generics-in-kotlin)
* Kotlin 中的陣列是[invariant (不變的)](arrays)
* Kotlin 具有適當的[函數類型](lambdas#function-types)，而不是 Java 的 SAM 轉換
* [Use-site variance (使用點變異數)](generics#use-site-variance-type-projections)，無需萬用字元 (Wildcards)
* Kotlin 沒有已檢查的 [exceptions (例外)](exceptions)
* [用於唯讀和可變集合的單獨介面](collections-overview)

## Java 擁有的 Kotlin 沒有的

* [Checked exceptions (已檢查的例外)](exceptions)
* 不是類別的 [Primitive types (基本類型)](basic-types)。位元組碼在可能的情況下使用基本類型，但它們不是顯式可用的。
* [Static members (靜態成員)](classes) 被 [companion objects (伴生物件)](object-declarations#companion-objects)、[top-level functions (頂層函數)](functions)、[extension functions (擴展函數)](extensions#extension-functions) 或 [@JvmStatic](java-to-kotlin-interop#static-methods) 取代。
* [Wildcard-types (萬用字元類型)](generics) 被 [declaration-site variance (宣告點變異數)](generics#declaration-site-variance) 和 [type projections (類型投影)](generics#type-projections) 取代。
* [Ternary-operator `a ? b : c` (三元運算符)](control-flow#if-expression) 被 [if expression (if 表達式)](control-flow#if-expression) 取代。
* [Records](https://openjdk.org/jeps/395)
* [Pattern Matching](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
* package-private [visibility modifier (可見性修飾符)](visibility-modifiers)

## Kotlin 擁有的 Java 沒有的

* [Lambda expressions (Lambda 表達式)](lambdas) + [Inline functions (內聯函數)](inline-functions) = 高效能的自訂控制結構
* [Extension functions (擴展函數)](extensions)
* [Null-safety (Null 安全)](null-safety)
* [Smart casts (智能轉換)](typecasts) (**Java 16**: [Pattern Matching for instanceof](https://openjdk.org/jeps/394))
* [String templates (字串模板)](strings) (**Java 21**: [String Templates (Preview)](https://openjdk.org/jeps/430))
* [Properties (屬性)](properties)
* [Primary constructors (主建構函數)](classes)
* [First-class delegation (頭等委託)](delegation)
* [Type inference for variable and property types (變數和屬性類型的類型推斷)](basic-types) (**Java 10**: [Local-Variable Type Inference](https://openjdk.org/jeps/286))
* [Singletons (單例)](object-declarations)
* [Declaration-site variance & Type projections (宣告點變異數 & 類型投影)](generics)
* [Range expressions (範圍表達式)](ranges)
* [Operator overloading (運算符重載)](operator-overloading)
* [Companion objects (伴生物件)](classes#companion-objects)
* [Data classes (數據類)](data-classes)
* [Coroutines (協程)](coroutines-overview)
* [Top-level functions (頂層函數)](functions)
* [Default arguments (預設參數)](functions#default-arguments)
* [Named parameters (具名參數)](functions#named-arguments)
* [Infix functions (中綴函數)](functions#infix-notation)
* [Expect and actual declarations (Expect 和 Actual 宣告)](multiplatform-expect-actual)
* [Explicit API mode (顯式 API 模式)](whatsnew14#explicit-api-mode-for-library-authors) 和 [better control of API surface (更好地控制 API 介面)](opt-in-requirements)

## 接下來做什麼？

學習如何：
* 在 [Java 和 Kotlin 中使用字串執行典型任務](java-to-kotlin-idioms-strings)。
* 在 [Java 和 Kotlin 中使用集合執行典型任務](java-to-kotlin-collections-guide)。
* [處理 Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide)。