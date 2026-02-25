[//]: # (title: 與 Java 的比較)

## Kotlin 解決的一些 Java 問題

Kotlin 修正了 Java 存在的一系列問題：

*   Null 參照[透過型別系統控制](null-safety.md)。
*   [無未加工型別](java-interop.md#java-generics-in-kotlin)
*   Kotlin 中的陣列具有[不變性 (invariant)](arrays.md)
*   Kotlin 具有正確的[函式型別](lambdas.md#function-types)，而非 Java 的 SAM 轉換
*   不需萬用字元的[使用點差異](generics.md#use-site-variance-type-projections)
*   Kotlin 沒有受檢[例外](exceptions.md)
*   [唯讀與可變集合具有獨立介面](collections-overview.md)

## Java 擁有但 Kotlin 沒有的特性

*   [受檢例外](exceptions.md)
*   並非類別的[原始型別](types-overview.md)。位元組碼會盡可能使用原始型別，但它們無法被明確地使用。
*   [static 成員](classes.md)被[伴隨物件](object-declarations.md#companion-objects)、[頂層函式](functions.md)、[擴充函式](extensions.md#extension-functions)或 [@JvmStatic](java-to-kotlin-interop.md#static-methods) 取代。
*   [萬用字元型別](generics.md)被[宣告點差異](generics.md#declaration-site-variance)與[型別投影](generics.md#type-projections)取代。
*   [三元運算子 `a ? b : c`](control-flow.md#if-expression) 被 [if 運算式](control-flow.md#if-expression)取代。
*   [記錄 (Records)](https://openjdk.org/jeps/395)
*   套件私有 (package-private) [可見性修飾詞](visibility-modifiers.md)

> Kotlin 雖然沒有模式配對，但 [Kotlin 中的智慧轉型](typecasts.md#smart-casts)提供了與 [Java 中的模式配對](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)類似的功能。
>
> 欲了解更多資訊，請觀看 [JetBrains 官方 Kotlin 頻道上的這段影片](https://www.youtube.com/watch?v=yJDoa42X-wQ)。
>
{style="note"}

## Kotlin 擁有但 Java 沒有的特性

*   [Lambda 運算式](lambdas.md) + [內嵌函式](inline-functions.md) = 高效能的自訂控制結構
*   [擴充函式](extensions.md)
*   [Null 安全](null-safety.md)
*   [字串範本](strings.md)
*   [屬性](properties.md)
*   [主建構函數](classes.md)
*   [一等委派](delegation.md)
*   [變數與屬性型別的型別推論](types-overview.md) (**Java 10**：[區域變數型別推論](https://openjdk.org/jeps/286))
*   [單例 (Singletons)](object-declarations.md)
*   [宣告點差異與型別投影](generics.md)
*   [區間運算式](ranges.md)
*   [運算子多載](operator-overloading.md)
*   [伴隨物件](classes.md#companion-objects)
*   [資料類別](data-classes.md)
*   [協同程式](coroutines-overview.md)
*   [頂層函式](functions.md)
*   [具備預設值的參數](functions.md#parameters-with-default-values)
*   [具名參數](functions.md#named-arguments)
*   [中綴函式](functions.md#infix-notation)
*   [expect 與 actual 宣告](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)
*   [顯式 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors)以及[更佳的 API 介面控制](opt-in-requirements.md)

> Java 雖然沒有智慧轉型，但[模式配對](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)提供了與 [Kotlin 中的智慧轉型](typecasts.md#smart-casts)類似的功能。
>
> 欲了解更多資訊，請觀看 [JetBrains 官方 Kotlin 頻道上的這段影片](https://www.youtube.com/watch?v=yJDoa42X-wQ)。
>
{style="note"}

## 下一步

了解如何：
*   在 [Java 與 Kotlin 中執行常見的字串任務](java-to-kotlin-idioms-strings.md)。
*   在 [Java 與 Kotlin 中執行常見的集合任務](java-to-kotlin-collections-guide.md)。
*   [在 Java 與 Kotlin 中處理可 null 性](java-to-kotlin-nullability-guide.md)。