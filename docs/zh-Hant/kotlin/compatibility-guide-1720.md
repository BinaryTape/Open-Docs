[//]: # (title: Kotlin 1.7.20 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出阻礙語言演進的建構應被移除，而後者則說明此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

通常，不相容變更僅發生在功能發佈版本中，但本次我們必須在一個增量發佈版本中引入兩項此類變更，以限制 Kotlin 1.7 中變更所引入問題的蔓延。

本文總結了這些變更，為從 Kotlin 1.7.0 和 1.7.10 遷移到 Kotlin 1.7.20 提供了參考。

## 基本術語

本文中我們介紹了幾種相容性類型：

-   _source_：原始碼不相容變更會使原本能正常編譯（沒有錯誤或警告）的程式碼不再能編譯
-   _binary_：如果互換兩個二進位產物不會導致載入或連結錯誤，則稱它們是二進位相容的
-   _behavioral_：如果相同的程式在應用變更前後表現出不同的行為，則稱該變更是行為不相容的

請記住，這些定義僅針對純 Kotlin 程式碼。從其他語言（例如 Java）的角度來看 Kotlin 程式碼的相容性不在本文的範圍之內。

## 語言

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 回溯嘗試以修正正確的約束處理

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 回溯一項修正型別推斷約束處理中問題的嘗試，該問題在實作 [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) 中描述的變更後於 1.7.0 版本中出現。該嘗試於 1.7.10 版本中進行，但它反過來引入了新的問題。
>
> **Deprecation cycle**:
>
> - 1.7.20: 回溯至 1.7.0 的行為

### 禁止某些建構器推斷案例以避免與多個 Lambda 和解析產生問題的交互

> **Issue**: [KT-53797](https://youtrack.com/issue/KT-53797)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 引入了一項名為「無限制建構器推斷 (unrestricted builder inference)」的功能，使得即使傳遞給未以 `@BuilderInference` 註解之參數的 Lambda 也能從建構器推斷中受益。然而，如果函數調用中出現多於一個此類 Lambda，則可能導致多個問題。Kotlin 1.7.20 將報告錯誤，如果有多個 Lambda 函數的相應參數未以 `@BuilderInference` 註解，並且需要使用建構器推斷來完成 Lambda 中的型別推斷。
>
> **Deprecation cycle**:
>
> - 1.7.20: 在此類 Lambda 函數上報告錯誤，可以使用 `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` 來暫時恢復到 1.7.20 之前的行為