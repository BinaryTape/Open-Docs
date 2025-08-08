[//]: # (title: 一致性)

在 API 設計中，一致性對於確保易用性至關重要。透過維持參數順序、命名慣例和錯誤處理機制的一致性，您的函式庫將對使用者來說更直觀且可靠。遵循這些最佳實務有助於避免混淆和誤用，進而帶來更好的開發者體驗和更穩健的應用程式。

## 維持參數順序、命名及用法

在設計函式庫時，請維持引數順序、命名方案以及多載使用上的一致性。例如，如果您的某個現有方法具有 `offset` 和 `length` 參數，除非有令人信服的理由，否則您不應為新方法改用 `startIndex` 和 `endIndex` 等替代方案。

函式庫提供的多載函數應該表現一致。當使用者變更傳遞到您的函式庫中的值的型別時，他們期望行為保持一致。例如，這些呼叫都建立相同的實例，因為輸入的語義是相同的：

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

避免將 `startIndex` 和 `stopIndex` 等參數名稱與 `beginIndex` 和 `endIndex` 等同義詞混用。同樣地，對於集合中的值，請選擇一個術語，例如 `element`、`item`、`entry` 或 `entity`，並堅持使用它。

對相關方法進行一致且可預測的命名。例如，Kotlin 標準函式庫包含像 `first` 和 `firstOrNull`、`single` 或 `singleOrNull` 這樣的成對方法。這些成對方法清楚地表明，有些可能會回傳 `null`，而另一些則可能會拋出例外。參數的宣告應從一般到具體，因此必要的輸入應優先出現，而可選的輸入則排在最後。例如，在 [`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html) 中，`strings` 集合優先，其次是 `startIndex`，最後是 `ignoreCase` 旗標。

考量一個管理員工記錄的函式庫，它提供以下 API 來搜尋員工：

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

這個 API 將會非常難以正確使用。它有多個相同型別的參數，呈現的順序不一致，並且使用方式也不一致。您的函式庫使用者很可能會根據他們現有函式的使用經驗，對新函數做出不正確的假設。

## 使用物件導向設計處理資料與狀態

Kotlin 同時支援物件導向和函數式程式設計風格。請使用類別來表示您 API 中的資料和狀態。當資料和狀態具有層次結構時，請考量使用繼承。

如果所有所需的狀態都可以作為參數傳遞，則優先使用頂層函數。當這些函數的呼叫將被串聯時，請考慮將它們撰寫為擴充函數以提高可讀性。

## 選擇適當的錯誤處理機制

Kotlin 提供了多種錯誤處理機制。您的 API 可以拋出例外、回傳 `null` 值、使用自訂結果型別，或使用內建的 [`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 型別。請確保您的函式庫一致且適當地使用這些選項。

當資料無法擷取或計算時，請使用可空回傳型別並回傳 `null` 來指示資料遺失。在其他情況下，則拋出例外或回傳 `Result` 型別。

考慮提供函數的多載，其中一個拋出例外，而另一個則將例外包裝在結果型別中。在這些情況下，請使用 `Catching` 後綴來表示函數中捕獲了例外。例如，標準函式庫有使用此慣例的 [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 和 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 函數，而協程函式庫則為通道提供了 [`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html) 和 [`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) 方法。

避免將例外用於正常的控制流程。設計您的 API，使其允許在嘗試操作之前進行條件檢查，從而防止不必要的錯誤處理。[命令/查詢分離 (Command / Query Separation)](https://martinfowler.com/bliki/CommandQuerySeparation.html) 是此處可以應用的一個有用模式。

## 維持慣例與品質

一致性的最後一個層面，與函式庫本身的設計無關，而是與維持高水準的品質相關。

您應該使用自動化工具 (linters) 進行靜態分析，以確保您的程式碼遵循通用的 Kotlin 慣例以及專案特定的慣例。

Kotlin 函式庫還應該提供一套單元測試和整合測試，涵蓋所有 API 進入點的所有已記錄行為。測試應包含廣泛的輸入，特別是已知的邊界條件和邊緣案例。任何未經測試的行為，應假定其（充其量）不可靠。

在開發過程中利用這套測試，以驗證變更不會破壞現有行為。在每次發布時，作為標準化建置與發布管線的一部分，執行這些測試。像 [Kover](https://github.com/Kotlin/kotlinx-kover) 這樣的工具可以整合到您的建置流程中，以測量覆蓋率並產生報告。

## 下一步

在指南的下一部分中，您將了解可預測性。

[Proceed to the next part](api-guidelines-predictability.md)