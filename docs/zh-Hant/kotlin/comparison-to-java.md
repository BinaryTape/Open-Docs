[//]: # (title: 與 Java 的比較)

## Kotlin 解決了 Java 的一些問題

Kotlin 解決了 Java 遇到的一系列問題：

*   空值參考由[類型系統控制](null-safety.md)。
*   [無裸類型](java-interop.md#java-generics-in-kotlin)
*   Kotlin 中的陣列是[不變的](arrays.md)
*   Kotlin 具有適當的[函式類型](lambdas.md#function-types)，而非 Java 的 SAM 轉換。
*   [使用處變數 (Use-site variance)](generics.md#use-site-variance-type-projections) 而無萬用字元 (wildcards)。
*   Kotlin 沒有受檢查的[例外](exceptions.md)。
*   [讀取專用與可變集合的獨立介面](collections-overview.md)。

## Java 擁有但 Kotlin 沒有的功能

*   [受檢查例外 (Checked exceptions)](exceptions.md)
*   非類別的[基本類型](basic-types.md)。位元組碼會盡可能使用基本類型，但它們並非明確可用。
*   [靜態成員](classes.md)已被[伴動物件](object-declarations.md#companion-objects)、[頂層函式](functions.md)、[擴充函式](extensions.md#extension-functions)或 [`@JvmStatic`](java-to-kotlin-interop.md#static-methods) 取代。
*   [萬用字元類型 (Wildcard-types)](generics.md) 已被[宣告處變數 (declaration-site variance)](generics.md#declaration-site-variance) 和[類型投影 (type projections)](generics.md#type-projections) 取代。
*   [三元運算子 `a ? b : c`](control-flow.md#if-expression) 已被 [if 表達式](control-flow.md#if-expression)取代。
*   [記錄 (Records)](https://openjdk.org/jeps/395)
*   [模式比對 (Pattern Matching)](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
*   `package-private` [可見性修飾符](visibility-modifiers.md)

## Kotlin 擁有但 Java 沒有的功能

*   [Lambda 表達式](lambdas.md) + [行內函式](inline-functions.md) = 高效能的自訂控制結構
*   [擴充函式](extensions.md)
*   [空值安全](null-safety.md)
*   [智慧型轉型 (Smart casts)](typecasts.md) (**Java 16**: `instanceof` 的模式比對)
*   [字串模板 (String templates)](strings.md) (**Java 21**: 字串模板 (預覽))
*   [屬性](properties.md)
*   [主要建構函式](classes.md)
*   [一級委託](delegation.md)
*   [變數和屬性類型的類型推斷 (Type inference)](basic-types.md) (**Java 10**: 局部變數類型推斷)
*   [單例](object-declarations.md)
*   [宣告處變數 (Declaration-site variance) & 類型投影 (Type projections)](generics.md)
*   [範圍表達式](ranges.md)
*   [運算子重載](operator-overloading.md)
*   [伴動物件](classes.md#companion-objects)
*   [資料類別](data-classes.md)
*   [協程](coroutines-overview.md)
*   [頂層函式](functions.md)
*   [帶有預設值的參數](functions.md#parameters-with-default-values)
*   [命名參數](functions.md#named-arguments)
*   [中綴函式](functions.md#infix-notation)
*   [期望與實際宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)
*   [顯式 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors) 和[對 API 介面的更好控制](opt-in-requirements.md)

## 下一步是什麼？

學習如何：
*   在 Java 和 Kotlin 中執行[字串的典型任務](java-to-kotlin-idioms-strings.md)。
*   在 Java 和 Kotlin 中執行[集合的典型任務](java-to-kotlin-collections-guide.md)。
*   [處理 Java 和 Kotlin 中的空值性](java-to-kotlin-nullability-guide.md)。