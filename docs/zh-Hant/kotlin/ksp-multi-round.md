[//]: # (title: 多輪處理)

KSP 支援**多輪處理** (multiple-round processing)，即透過多個輪次處理檔案。每一輪處理的輸出都會作為後續每一輪的額外輸入。

若要使用多輪處理，請從 `SymbolProcessor.process()` 傳回延遲符號清單 (`List<KSAnnotated>`)。KSP 會在下一輪處理這些符號。

若要延遲無效符號，請使用 `KSAnnotated.validate()` 進行篩選，例如：

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

當一整輪處理未產生任何新檔案時，多輪處理即告終止。如果仍存在未處理的延遲符號，KSP 會為每個擁有剩餘延遲符號的處理器記錄一條錯誤訊息。

## 將符號延遲至下一輪

當需要來自其他處理器的額外資訊時，處理器可以將符號延遲到後續輪次。處理器可以根據需要持續延遲該符號多個輪次，直到所需資訊可用為止。一旦資訊可用，處理器便可處理該符號。

僅在以下情況延遲符號：

*   在處理符號之前需要額外資訊。

*   符號源自原始碼。

    > 絕對不要延遲來自類別路徑 (classpath) 的符號。KSP 會自動過濾掉類別路徑符號。
    > 
    {style="note"}

例如，為一個被註解的類別產生 builder 的處理器，可能要求其建構函式的所有參數型別都能解析為具體型別。在第一輪中，其中一個參數型別可能無法解析。在後續輪次中，由於在此期間產生的檔案，該型別可能會變得可以解析。接著處理器便可處理該類別。

## 驗證符號

驗證是判斷是否將符號延遲到後續輪次的一種便捷方法。處理器應定義正確處理符號所需的資訊。

> 驗證通常需要型別解析，這可能會產生很大開銷。請僅檢查處理符號所需的資訊。
>
{style="tip"}

預設的驗證行為可能並不適用於所有使用案例。若要自訂驗證，請使用 `KSValidateVisitor` 並提供一個 `predicate` lambda 來選取要驗證的符號。

在實作自訂驗證時，請使用 `KSType.isError` 判斷型別是否有效。若 `isError` 為 `true`，則表示 KSP 無法解析該型別。請利用此資訊決定是否將處理延遲到後續輪次。

## 存取檔案與符號

新產生的檔案與現有檔案均可透過 `Resolver` 存取。

KSP 提供了兩個用於存取檔案的 API：

*   `Resolver.getAllFiles()` 傳回先前存在的檔案與新產生檔案的清單。

*   `Resolver.getNewFiles()` 僅傳回在上一輪中產生的檔案。

使用 `Resolver.getSymbolsWithAnnotation()` 作為獲取相關符號的主要入口點。

在每一輪中，`Resolver.getSymbolsWithAnnotation()` 僅傳回來自新產生檔案的符號，以及來自上一輪的延遲符號。這有助於避免不必要的重複處理。

## 處理器具現化

KSP 僅會建立一次處理器執行個體。您可以在處理器執行個體中儲存資訊，並在多個輪次之間重複使用。

然而，並非所有 KSP 符號都能在不同輪次之間重複使用。當處理器產生新檔案時，符號解析結果可能會改變，這可能會影響先前已解析符號的有效性。

> 請僅使用在當前輪次中傳遞給處理器的 `Resolver` 執行個體。請勿儲存 `Resolver` 並在不同輪次之間重複使用。
> 
{style="note"}

## 錯誤與例外處理

### 錯誤

處理器透過呼叫 `KSPLogger.error()` 來回報錯誤。

當處理器回報錯誤時，KSP 會呼叫 `SymbolProcessor.onError()` 而非 `SymbolProcessor.finish()`。處理將在當前輪次完成後停止。

其他處理器在該輪次中仍會繼續正常處理。KSP 僅在所有處理器完成當前輪次後才處理錯誤。

### 例外

KSP 會區分來自 KSP 的例外與來自處理器的例外。這兩種類型都會立即終止處理，並透過 `KSPLogger` 記錄為錯誤。

> 請向 KSP 開發者回報來自 KSP 的例外以進行調查。請在 [KSP 問題追蹤器](https://github.com/google/ksp/issues) 中建立問題。
>
{style="note"}

在發生錯誤或例外的輪次結束時，KSP 會對所有處理器呼叫 `SymbolProcessor.onError()`。`SymbolProcessor` 為 `onError()` 提供了一個預設的無操作 (no-op) 實作。請覆寫此方法以實作自訂錯誤處理邏輯。