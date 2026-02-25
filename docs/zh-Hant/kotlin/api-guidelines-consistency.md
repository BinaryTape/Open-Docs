[//]: # (title: 一致性)

一致性在 API 設計中至關重要，可確保易用性。透過保持一致的參數順序、命名慣例和錯誤處理機制，您的程式庫對使用者來說將更加直覺且可靠。遵循這些最佳實務有助於避免混淆與誤用，進而提供更好的開發者體驗並建構更穩健的應用程式。

## 保持參數順序、命名與用法

在設計程式庫時，請在引數排序、命名方案以及多載的使用上保持一致性。例如，若現有的方法使用了 `offset` 和 `length` 參數，除非有極佳的理由，否則新方法不應切換到 `startIndex` 和 `endIndex` 等替代方案。

程式庫提供的多載函式行為應完全相同。使用者期望當他們更改傳入程式庫的值的型別時，其行為仍保持一致。例如，以下呼叫都會建立相同的執行個體，因為輸入在語意上是相同的：

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

避免將 `startIndex` 和 `stopIndex` 等參數名稱與 `beginIndex` 和 `endIndex` 等同義詞混用。同樣地，請在集合中的值選擇一個術語，例如 `element`、`item`、`entry` 或 `entity`，並堅持使用。

以一致且可預測的方式為相關方法命名。例如，Kotlin 標準函式庫包含成對的函式，如 `first` 與 `firstOrNull`、`single` 或 `singleOrNull`。這些配對清楚地表明某些函式可能會傳回 `null`，而其他函式則可能會拋出例外。參數應從一般到特定進行宣告，使必要的輸入排在前面，選用輸入排在最後。例如，在 [`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html) 中，`strings` 集合排在第一位，接著是 `startIndex`，最後是 `ignoreCase` 旗標。

考慮一個管理員工記錄並提供以下搜尋員工 API 的程式庫：

```kotlin
fun findStaffBySeniority(
    startIndex: Int, 
    minYearsServiceExclusive: Int
): List<Employee>

fun findStaffByAge(
    minAgeInclusive: Int, 
    startIndex: Int
): List<Employee>
```

這組 API 將極難正確使用。多個型別相同的參數以不一致的順序呈現，並以不一致的方式使用。您程式庫的使用者很可能會根據對現有函式的經驗，對新函式做出錯誤的假設。

## 對資料與狀態使用物件導向設計

Kotlin 同時支援物件導向與函數式程式設計風格。在 API 中使用類別來表示資料和狀態。當資料與狀態具有階層關係時，請考慮使用繼承。

如果所需的所有狀態都可以作為參數傳遞，請優先使用頂層函式。當這些函式的呼叫將鏈接在一起時，請考慮將其編寫為擴充函式以提高可讀性。

## 選擇適當的錯誤處理機制

Kotlin 提供多種錯誤處理機制。您的 API 可以拋出例外、傳回 `null` 值、使用自訂結果型別，或使用內建的 [`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 型別。請確保您的程式庫一致且適當地使用這些選項。

當無法獲取或計算資料時，請使用可為 null 的傳回型別並傳回 `null` 以表示缺少資料。在其他情況下，請拋出例外或傳回 `Result` 型別。

考慮提供函式的多載，其中一個拋出例外，而另一個則將其封裝在結果型別中。在這些情況下，請使用 `Catching` 後綴來表示函式中已捕獲例外。例如，標準函式庫中有使用此慣例的 [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 和 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 函式，而協同程式程式庫則針對通道（channels）提供了 [`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html) 和 [`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) 方法。

避免在正常控制流中使用例外。設計您的 API，以便在嘗試操作之前進行條件檢查，從而防止不必要的錯誤處理。「[命令與查詢分離 (Command / Query Separation)](https://martinfowler.com/bliki/CommandQuerySeparation.html)」是一個可以在此應用的實用模式。

## 保持慣例與品質

一致性的最後一個面向與程式庫本身的設計無關，而是與維持高品質有關。

您應該使用自動化工具（linters）進行靜態分析，以確保您的程式碼遵循一般的 Kotlin 慣例以及專案特定的慣例。

Kotlin 程式庫還應提供一組單元測試與整合測試，涵蓋所有 API 入口點的所有記載行為。測試應包含廣泛的輸入，尤其是已知的邊界與邊緣情況。任何未經測試的行為都應被視為（往好處想）不可靠的。

在開發過程中使用這組測試來驗證變更不會破壞現有行為。在每次發佈時，將執行這些測試作為標準化組建與發佈管線的一部分。像 [Kover](https://github.com/Kotlin/kotlinx-kover) 這樣的工具可以整合到您的組建程序中，以測量涵蓋率並產生報告。

## 下一步

在指南的下一部分中，您將了解可預測性。

[繼續前進到下一部分](api-guidelines-predictability.md)