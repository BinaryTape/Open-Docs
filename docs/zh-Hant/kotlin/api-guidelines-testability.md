[//]: # (title: 可測試性)

除了[測試您的程式庫](api-guidelines-consistency.md#maintain-conventions-and-quality)之外，請確保使用您程式庫的程式碼也具備可測試性。

## 避免全域狀態與具狀態的頂層函式

您的程式庫不應依賴全域變數中的狀態，也不應提供具狀態的頂層函式作為其公開 API 的一部分。
這類變數和函式會使得測試使用該程式庫的程式碼變得很困難，因為測試需要尋找控制這些全域值的方法。

例如，某個程式庫可能會定義一個全域可存取的函式，用來獲取目前時間：

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

任何使用此 API 的程式碼都將難以測試，因為對 `now()` 函式的呼叫將始終傳回真實的目前時間，而在測試中，通常希望傳回模擬值（fake values）取代之。

為了實現可測試性，[`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) 程式庫提供的 API 可讓使用者獲取 `Clock` 執行個體，然後使用該執行個體獲取目前時間：

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

這允許程式庫的使用者將 `Clock` 執行個體注入到他們自己的類別中，並在測試期間將真實實作替換為模擬實作。

## 接續內容

如果您尚未查看，請考慮閱讀以下頁面：

*   在 [回溯相容性](api-guidelines-backward-compatibility.md) 頁面中了解如何維持回溯相容性。
*   如需了解有效文件實務的廣泛概覽，請參閱 [具資訊性的文件](api-guidelines-informative-documentation.md)。