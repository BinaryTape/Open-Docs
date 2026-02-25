---
title: KSP 編譯器選項
---

Koin Annotations KSP 處理器支援數個可在編譯期間傳遞的配置選項，以自訂程式碼產生行為。

## 可用選項

### KOIN_CONFIG_CHECK
- **類型**：布林值
- **預設值**：`false`
- **說明**：啟用 Koin 定義的編譯時期配置檢查。啟用後，編譯器將在編譯時期驗證所有 Koin 配置，以確保安全性並儘早捕捉潛在問題。
- **使用情況**：透過在執行時期之前偵測配置問題，協助提升編譯時期的安全性。

### KOIN_LOG_TIMES
- **類型**：布林值
- **預設值**：`false`
- **說明**：顯示編譯期間模組產生的時間記錄。這有助於監控程式碼產生的快照並識別潛在的瓶頸。
- **使用情況**：適用於偵錯與優化組建時間。

### KOIN_DEFAULT_MODULE
- **類型**：布林值
- **預設值**：`false`
- **狀態**：⚠️ **自 1.3.0 起棄用**
- **說明**：若未找到給定定義的明確模組，則自動產生預設模組。**此選項自 Annotations 1.3.0 起已棄用且不建議使用。** 請改用 `@Configuration` 註解與 `@KoinApplication` 來自動引導您的應用程式。
- **使用情況**：避免使用此選項。建議偏好使用 `@Configuration` 與 `@KoinApplication` 進行明確的模組組織，以獲得更好的程式碼清晰度與可維護性。

### KOIN_GENERATION_PACKAGE
- **類型**：字串
- **預設值**：`"org.koin.ksp.generated"`
- **說明**：指定產生的 Koin 類別所在的軟件包名稱。軟件包名稱必須是有效的 Kotlin 軟件包識別碼。**重要事項**：若設定此選項，所有模組必須一致地使用相同的值。
- **使用情況**：僅在您的專案需要將程式碼產生在與預設路徑不同的路徑時使用（例如：由於特定的編碼規則或專案結構需求）。請確保所有模組都使用相同的軟件包名稱。

### KOIN_USE_COMPOSE_VIEWMODEL
- **類型**：布林值
- **預設值**：`true`
- **說明**：使用 `koin-core-viewmodel` 主要 DSL 而非 Android 特定的 ViewModel 來產生 ViewModel 定義。此選項預設為啟用，以提供 Kotlin 多平台相容性並使用統一的 ViewModel API。
- **使用情況**：建議在所有專案中保持啟用。對於需要跨平台 ViewModel 支援的 KMP 專案而言至關重要。

### KOIN_EXPORT_DEFINITIONS
- **類型**：布林值
- **預設值**：`true`
- **說明**：控制除了模組組裝的定義外，是否也產生匯出的定義。停用時，將僅產生在模組中組裝的定義，並過濾掉獨立的匯出定義。
- **使用情況**：若您只想產生明確在模組中組裝的定義，並排除獨立的匯出定義，請將此項設為 `false`。適用於更嚴格的模組組織。

## 配置範例

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

## 最佳實務

- 在開發組建中 **啟用 KOIN_CONFIG_CHECK** 以儘早發現配置問題
- 在組建最佳化期間 **使用 KOIN_LOG_TIMES** 以識別效能瓶頸
- **僅在符合編碼規則必要時使用 KOIN_GENERATION_PACKAGE** - 並確保在所有模組中一致使用
- **保持 KOIN_USE_COMPOSE_VIEWMODEL 啟用**（預設值），以便在不同平台間使用統一的 ViewModel API
- **避免使用 KOIN_DEFAULT_MODULE** - 請使用 `@Configuration` 與 `@KoinApplication` 進行正確的應用程式引導

## 軟件包名稱驗證

使用 `KOIN_GENERATION_PACKAGE` 時，提供的軟件包名稱必須：
- 不為空
- 僅包含以點號分隔的有效 Kotlin 識別符
- 不使用 Kotlin 關鍵字或保留字
- 遵循標準的 Java/Kotlin 軟件包命名慣例

無效的軟件包名稱將導致編譯錯誤並顯示描述性訊息。