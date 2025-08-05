`[//]: # (title: 可測試性)`

除了[測試您的函式庫](api-guidelines-consistency.md#maintain-conventions-and-quality)之外，請確保使用您函式庫的程式碼也具有可測試性。

## 避免全域狀態和有狀態的頂層函數

您的函式庫不應依賴全域變數中的狀態，或提供有狀態的頂層函數作為其公開 API 的一部分。
此類變數和函數使得測試使用該函式庫的程式碼變得困難，因為測試需要找到方法來控制這些全域值。

例如，一個函式庫可能會定義一個全域可存取函式，提供對當前時間的存取：

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

任何使用此 API 的程式碼都將難以測試，因為對 `now()` 函數的呼叫將始終返回實際當前時間，而在測試中，通常期望返回模擬值。

為了實現可測試性，[`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) 函式庫提供了一個 API，允許使用者獲取一個 `Clock` 實例，然後使用它來獲取當前時間：

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

這允許函式庫的使用者將 `Clock` 實例注入到他們自己的類別中，並在測試期間用模擬實作替換實際實作。

## 接下來

如果您還沒有，請考慮查看這些頁面：

* 在[向後相容性](api-guidelines-backward-compatibility.md)頁面中瞭解如何維護向後相容性。
* 有關有效文件實踐的廣泛概述，請參閱[資訊性文件](api-guidelines-informative-documentation.md)。