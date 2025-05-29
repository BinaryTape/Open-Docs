[//]: # (title: 與 Java 的比較)

## Kotlin 中解決的一些 Java 問題

Kotlin 修正了 Java 存在的一些問題：

*   空引用[由類型系統控制](null-safety.md)。
*   [無原始類型](java-interop.md#java-generics-in-kotlin)
*   Kotlin 中的陣列是[不變的](arrays.md)
*   Kotlin 擁有適當的[函數類型](lambdas.md#function-types)，與 Java 的 SAM 轉換不同
*   [使用點變異](generics.md#use-site-variance-type-projections)不帶萬用字元
*   Kotlin 沒有受檢[異常](exceptions.md)
*   [唯讀集合與可變集合的獨立介面](collections-overview.md)

## Java 有而 Kotlin 沒有的

*   [受檢異常](exceptions.md)
*   [基本類型](basic-types.md)不是類別。位元組碼在可能的情況下使用基本類型，但它們並非明確可用。
*   [靜態成員](classes.md)被[伴生物件](object-declarations.md#companion-objects)、[頂層函數](functions.md)、[擴充函數](extensions.md#extension-functions)或[@JvmStatic](java-to-kotlin-interop.md#static-methods)取代。
*   [萬用字元類型](generics.md)被[宣告點變異](generics.md#declaration-site-variance)和[類型投影](generics.md#type-projections)取代。
*   [三元運算子 ``a ? b : c``](control-flow.md#if-expression)被[if 表達式](control-flow.md#if-expression)取代。
*   [記錄](https://openjdk.org/jeps/395)
*   [模式匹配](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
*   套件私有[可見性修飾符](visibility-modifiers.md)

## Kotlin 有而 Java 沒有的

*   [Lambda 表達式](lambdas.md) + [內聯函數](inline-functions.md) = 高效能的自定義控制結構
*   [擴充函數](extensions.md)
*   [空安全](null-safety.md)
*   [智慧型轉型](typecasts.md) (**Java 16**: [用於 instanceof 的模式匹配](https://openjdk.org/jeps/394))
*   [字串模板](strings.md) (**Java 21**: [字串模板 (預覽)](https://openjdk.org/jeps/430))
*   [屬性](properties.md)
*   [主建構函式](classes.md)
*   [一流委託](delegation.md)
*   [變數和屬性類型的類型推斷](basic-types.md) (**Java 10**: [局部變數類型推斷](https://openjdk.org/jeps/286))
*   [單例](object-declarations.md)
*   [宣告點變異與類型投影](generics.md)
*   [範圍表達式](ranges.md)
*   [運算子重載](operator-overloading.md)
*   [伴生物件](classes.md#companion-objects)
*   [資料類別](data-classes.md)
*   [協程](coroutines-overview.md)
*   [頂層函數](functions.md)
*   [預設引數](functions.md#default-arguments)
*   [具名引數](functions.md#named-arguments)
*   [中綴函數](functions.md#infix-notation)
*   [預期與實際聲明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)
*   [顯式 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors)和[更好地控制 API 介面](opt-in-requirements.md)

## 接下來？

了解如何：
*   執行[Java 和 Kotlin 中字串的常見任務](java-to-kotlin-idioms-strings.md)。
*   執行[Java 和 Kotlin 中集合的常見任務](java-to-kotlin-collections-guide.md)。
*   [處理 Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide.md)。