---
title: KSP 編譯器選項
---

Koin Annotations KSP 處理器支援多種設定選項，這些選項可在編譯期間傳遞，以自訂程式碼生成行為。

## 可用選項

### KOIN_CONFIG_CHECK
- **類型**: Boolean
- **預設值**: `false`
- **說明**: 啟用 Koin 定義的編譯時設定檢查。啟用後，編譯器將在編譯時驗證所有 Koin 設定，以確保安全性並及早發現潛在問題。
- **用途**: 透過在執行時之前偵測設定問題，有助於提高編譯時的安全性。

### KOIN_LOG_TIMES
- **類型**: Boolean
- **預設值**: `false`
- **說明**: 在編譯期間顯示模組生成的時間記錄。這有助於監控程式碼生成的效能並識別潛在的瓶頸。
- **用途**: 對於偵錯和最佳化建構時間很有用。

### KOIN_DEFAULT_MODULE
- **類型**: Boolean
- **預設值**: `false`
- **狀態**: ⚠️ **自 1.3.0 版起已棄用**
- **說明**: 如果未找到給定定義的顯式模組，則自動生成一個預設模組。**此選項自 Annotations 1.3.0 版起已棄用且不建議使用。** 相反地，請使用 `@Configuration` 註解和 `@KoinApplication` 來自動引導您的應用程式。
- **用途**: 避免使用此選項。建議使用 `@Configuration` 和 `@KoinApplication` 進行明確的模組組織，以提高程式碼清晰度和可維護性。

### KOIN_GENERATION_PACKAGE
- **類型**: String
- **預設值**: `"org.koin.ksp.generated"`
- **說明**: 指定生成 Koin 類別所放置的套件名稱。套件名稱必須是有效的 Kotlin 套件識別符。**重要提示**：如果設定此選項，則必須在所有模組中一致使用相同的值。
- **用途**: 僅在您的專案需要將程式碼生成到預設路徑以外的路徑時（例如，由於特定的程式碼規則或專案結構要求）才使用此選項。確保所有模組都使用相同的套件名稱。

### KOIN_USE_COMPOSE_VIEWMODEL
- **類型**: Boolean
- **預設值**: `true`
- **說明**: 使用 `koin-core-viewmodel` 主要 DSL 生成 ViewModel 定義，而不是 Android 特定的 ViewModel。此選項預設啟用，以提供 Kotlin Multiplatform 相容性並使用統一的 ViewModel API。
- **用途**: 建議所有專案都保持啟用。對於需要在跨平台提供 ViewModel 支援的 KMP 專案至關重要。

### KOIN_EXPORT_DEFINITIONS
- **類型**: Boolean
- **預設值**: `true`
- **說明**: 控制除了模組組裝的定義之外，是否生成匯出的定義。禁用時，將只生成在模組中組裝的定義，並過濾掉獨立的匯出定義。
- **用途**: 如果您只想生成在模組中明確組裝的定義並排除獨立的匯出定義，請將此選項設為 `false`。對於更嚴格的模組組織很有用。

## 設定範例

### Gradle Kotlin DSL

```kotlin
ksp {
    arg("KOIN_CONFIG_CHECK", "true")
    arg("KOIN_LOG_TIMES", "true")
    arg("KOIN_DEFAULT_MODULE", "false")
    arg("KOIN_GENERATION_PACKAGE", "com.mycompany.koin.generated")
    arg("KOIN_USE_COMPOSE_VIEWMODEL", "true")
    arg("KOIN_EXPORT_DEFINITIONS", "true")
}
```

### Gradle Groovy DSL

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK", "true")
    arg("KOIN_LOG_TIMES", "true")
    arg("KOIN_DEFAULT_MODULE", "false")
    arg("KOIN_GENERATION_PACKAGE", "com.mycompany.koin.generated")
    arg("KOIN_USE_COMPOSE_VIEWMODEL", "true")
    arg("KOIN_EXPORT_DEFINITIONS", "true")
}
```

## 最佳實踐

- **在開發版本中啟用 KOIN_CONFIG_CHECK** 以及早發現設定問題
- **在建構最佳化期間使用 KOIN_LOG_TIMES** 以識別效能瓶頸
- **僅在需要遵守程式碼規則時使用 KOIN_GENERATION_PACKAGE** - 確保在所有模組中一致使用
- **保持啟用 KOIN_USE_COMPOSE_VIEWMODEL** (預設值) 以實現跨平台統一的 ViewModel API
- **避免使用 KOIN_DEFAULT_MODULE** - 使用 `@Configuration` 和 `@KoinApplication` 來正確引導應用程式

## 套件名稱驗證

使用 `KOIN_GENERATION_PACKAGE` 時，所提供的套件名稱必須：
- 不得為空
- 僅包含以點分隔的有效 Kotlin 識別符
- 不得使用 Kotlin 關鍵字或保留字
- 遵循標準 Java/Kotlin 套件命名慣例

無效的套件名稱將導致編譯錯誤並附帶描述性訊息。