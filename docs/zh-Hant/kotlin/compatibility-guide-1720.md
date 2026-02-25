[//]: # (title: Kotlin 1.7.20 相容性指南)

「[保持語言現代化](kotlin-evolution-principles.md)」與「[舒適的更新](kotlin-evolution-principles.md)」是 Kotlin 語言設計的基本原則。前者指出應移除阻礙語言演進的結構，後者則強調此類移除應事先進行良好溝通，以使程式碼遷移盡可能順利。

通常不相容的變更僅發生在功能版本（feature releases）中，但這次我們必須在增量版本（incremental release）中導入兩個此類變更，以限制 Kotlin 1.7 變更所帶來的問題擴散。

本文件總結了這些變更，為從 Kotlin 1.7.0 和 1.7.10 遷移到 Kotlin 1.7.20 提供參考。

## 基本術語

在本文件中，我們介紹了幾種相容性：

- *原始碼 (source)*：原始碼不相容的變更會導致原本可正常編譯（無錯誤或警告）的程式碼無法再編譯。
- *二進制 (binary)*：如果交換兩個二進制構件不會導致載入或連結錯誤，則稱這兩個構件為二進制相容。
- *行為 (behavioral)*：如果同一個程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅針對純 Kotlin。從其他語言角度（例如 Java）看 Kotlin 程式碼的相容性不在本文件的討論範圍內。

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

### 回復修復正確約束處理的嘗試

> **問題**：[KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：在實作 [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) 中描述的變更後，回復 1.7.0 中出現的修復型別推論約束處理問題的嘗試。該嘗試是在 1.7.10 中進行的，但它反過來又引入了新問題。
>
> **棄用週期**：
>
> - 1.7.20：回復至 1.7.0 的行為

### 禁止某些建置器推論案例以避免與多重 Lambda 和解析發生問題

> **問題**：[KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.7 引入了名為不受限建置器推論（unrestricted builder inference）的功能，因此即使是傳遞給未標註 `@BuilderInference` 參數的 Lambda 也可以從建置器推論中受益。然而，如果在一次函式呼叫中出現多個此類 Lambda，可能會導致多個問題。 
> 
> 在 Kotlin 1.7.20 中，如果多個 Lambda 函式（其對應參數未標註 `@BuilderInference`）需要使用建置器推論來完成 Lambda 中的型別推論，則會回報錯誤。
>
> **棄用週期**：
>
> - 1.7.20：對此類 Lambda 函式回報錯誤，可以使用 `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` 暫時回復到 1.7.20 之前的行為