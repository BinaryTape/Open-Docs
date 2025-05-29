[//]: # (title: Kotlin 1.7.20 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出阻礙語言演進的結構應該被移除，後者則表明此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

通常，不相容的變更只會在功能發佈 (feature releases) 中發生，但這次我們必須在增量發佈 (incremental release) 中引入兩項此類變更，以限制 Kotlin 1.7 中變更所引入問題的擴散。

本文件總結了這些變更，為從 Kotlin 1.7.0 和 1.7.10 遷移到 Kotlin 1.7.20 提供了參考。

## 基本術語

在本文件中，我們介紹幾種相容性：

- _原始碼_ (source)：原始碼不相容變更 (source-incompatible change) 指的是使原本能正常編譯（無錯誤或警告）的程式碼不再能編譯的變更。
- _二進位_ (binary)：如果兩個二進位構件 (binary artifacts) 互換後不會導致載入或連結錯誤，則稱它們是二進位相容的 (binary-compatible)。
- _行為_ (behavioral)：如果同一程式在應用變更前後展現出不同的行為，則稱該變更為行為不相容的 (behavioral-incompatible)。

請記住，這些定義僅適用於純 Kotlin。從其他語言角度（例如 Java）來看的 Kotlin 程式碼相容性不屬於本文件的範疇。

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

### 回溯嘗試以修復正確的約束處理

> **問題**：[KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：回溯於 1.7.0 實作 [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) 中描述的變更後，在型別推斷約束處理 (type inference constraints processing) 中出現的問題的修復嘗試。該嘗試於 1.7.10 進行，但它反過來引入了新的問題。
>
> **棄用週期**：
>
> - 1.7.20：回溯至 1.7.0 行為

### 禁止某些建構器推斷案例以避免與多個 lambda 和解析產生問題的交互

> **問題**：[KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：Kotlin 1.7 引入了一個稱為無限制建構器推斷 (unrestricted builder inference) 的功能，即使是傳遞給未以 `@BuilderInference` 標註的參數的 lambda 函式，也能受益於建構器推斷 (builder inference)。然而，如果在函式呼叫中出現多個此類 lambda 函式，這可能會導致幾個問題。
>
> 如果有多個 lambda 函式的相應參數未以 `@BuilderInference` 標註，並且需要使用建構器推斷來完成推斷 lambda 中的型別，Kotlin 1.7.20 將會報告錯誤。
>
> **棄用週期**：
>
> - 1.7.20：對此類 lambda 函式報告錯誤，
> `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` 可用於暫時恢復到 1.7.20 之前的行為