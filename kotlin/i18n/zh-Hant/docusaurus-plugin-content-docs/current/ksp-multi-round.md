---
title: 多輪處理
---
KSP 支援_多輪處理_（multiple round processing），或是在多輪中處理檔案。 這意味著後續的輪次會使用前幾輪的輸出作為額外的輸入。

## 處理器 (Processor) 的變更

要使用多輪處理，`SymbolProcessor.process()` 函數需要傳回一個延遲符號的列表 (`List<KSAnnotated>`)，用於無效的符號。 使用 `KSAnnotated.validate()` 來篩選無效的符號，將其延遲到下一輪。

以下範例程式碼展示了如何透過驗證檢查來延遲無效的符號：

```kotlin
override fun process(resolver: Resolver): List<KSAnnotated> {
    val symbols = resolver.getSymbolsWithAnnotation("com.example.annotation.Builder")
    val result = symbols.filter { !it.validate() }
    symbols
        .filter { it is KSClassDeclaration && it.validate() }
        .map { it.accept(BuilderVisitor(), Unit) }
    return result
}
```

## 多輪行為

### 將符號延遲到下一輪

處理器可以將某些符號的處理延遲到下一輪。 當一個符號被延遲時，處理器會等待其他處理器提供額外的資訊。 它可以根據需要繼續延遲符號任意輪次。 一旦其他處理器提供了所需的資訊，處理器就可以處理延遲的符號。 處理器應該只延遲缺少必要資訊的無效符號。 因此，處理器**不應**延遲來自 classpath 的符號，KSP 也會過濾掉任何非來自原始碼的延遲符號。

舉例來說，一個為帶有註解的類別建立 builder 的處理器可能需要其建構函式的所有參數類型都是有效的（解析為具體類型）。 在第一輪中，其中一個參數類型無法解析。 然後在第二輪中，由於第一輪產生的檔案，它變得可解析。

### 驗證符號

決定是否應該延遲符號的一種便捷方法是透過驗證。 處理器應該知道正確處理符號需要哪些資訊。
請注意，驗證通常需要解析，這可能會很耗費資源，因此我們建議僅檢查所需的內容。
繼續前面的例子，builder 處理器的理想驗證僅檢查帶註解符號的建構函式的所有已解析參數類型是否包含 `isError == false`。

KSP 提供了一個預設的驗證工具。 更多資訊，請參閱[進階](#advanced)章節。

### 終止條件

當完整的一輪處理沒有產生任何新檔案時，多輪處理終止。 如果滿足終止條件時仍然存在未處理的延遲符號，KSP 會為每個具有未處理延遲符號的處理器記錄一條錯誤訊息。

### 每輪可存取的檔案

新產生的檔案和現有檔案都可以透過 `Resolver` 存取。 KSP 提供了兩個用於存取檔案的 API：`Resolver.getAllFiles()` 和 `Resolver.getNewFiles()`。 `getAllFiles()` 傳回現有檔案和新產生檔案的組合列表，而 `getNewFiles()` 僅傳回新產生的檔案。

### `getSymbolsAnnotatedWith()` 的變更

為了避免不必要的符號重新處理，`getSymbolsAnnotatedWith()` 僅傳回在新產生的檔案中找到的那些符號，以及來自上一輪的延遲符號。

### 處理器實例化 (Processor instantiating)

處理器實例只會建立一次，這意味著您可以將資訊儲存在處理器物件中，以便在後續的輪次中使用。

### 跨輪次一致的資訊

所有 KSP 符號都無法在多輪中重複使用，因為解析結果可能會根據前一輪產生的內容而改變。 然而，由於 KSP 不允許修改現有程式碼，因此某些資訊（例如符號名稱的字串值）仍然應該可以重複使用。
總之，處理器可以儲存來自前幾輪的資訊，但需要記住這些資訊在未來的輪次中可能無效。

### 錯誤和異常處理

當發生錯誤（由處理器呼叫 `KSPLogger.error()` 定義）或異常時，處理會在當前輪次完成後停止。 所有處理器都將呼叫 `onError()` 方法，並且**不會**呼叫 `finish()` 方法。

請注意，即使發生了錯誤，其他處理器仍會在該輪次中繼續正常處理。
這意味著錯誤處理會在該輪次的處理完成後發生。

遇到異常時，KSP 會嘗試區分來自 KSP 的異常和來自處理器的異常。
異常將導致處理立即終止，並在 KSPLogger 中記錄為錯誤。
來自 KSP 的異常應報告給 KSP 開發人員以進行進一步調查。
在發生異常或錯誤的輪次結束時，所有處理器都將呼叫 onError() 函數來執行它們自己的錯誤處理。

KSP 為 `onError()` 提供了一個預設的 no-op 實現，作為 `SymbolProcessor` 介面的一部分。
您可以覆寫此方法以提供您自己的錯誤處理邏輯。

## 進階

### 驗證的預設行為

KSP 提供的預設驗證邏輯會驗證正在驗證的符號的封閉範圍內所有直接可到達的符號。
預設驗證檢查封閉範圍內的引用是否可解析為具體類型，但不會遞迴地深入到引用的類型中執行驗證。

### 編寫您自己的驗證邏輯

預設驗證行為可能不適合所有情況。 您可以參考 `KSValidateVisitor` 並透過提供自定義 `predicate` lambda 來編寫您自己的驗證邏輯，然後 `KSValidateVisitor` 使用該 lambda 來篩選出需要檢查的符號。