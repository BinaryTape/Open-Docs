---
title: 編譯器外掛程式選項
---

Koin 編譯器外掛程式支援配置選項，以自訂其行為。

## 配置

在您的 `build.gradle.kts` 中配置編譯器外掛程式：

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    compileSafety = true
    strictSafety = true       // 預設為自動偵測
    skipDefaultValues = true
    unsafeDslChecks = true
}
```

## 可用選項

### userLogs

- **類型**：布林值
- **預設值**：`false`
- **說明**：啟用組件偵測與 DSL/註解處理的記錄。顯示有哪些組件被外掛程式發現並處理。
- **使用情況**：在開發期間啟用，以偵錯組件探索問題。

```kotlin
koinCompiler {
    userLogs = true
}
```

### debugLogs

- **類型**：布林值
- **預設值**：`false`
- **說明**：啟用外掛程式內部處理（FIR/IR 階段、模組探索）的詳細偵錯記錄。
- **使用情況**：在對外掛程式問題進行疑難排解或回報錯誤 (bug) 時啟用。

```kotlin
koinCompiler {
    debugLogs = true
}
```

### compileSafety

- **類型**：布林值
- **預設值**：`true`
- **說明**：啟用編譯期相依性驗證。啟用後，外掛程式會驗證所有相依性是否能在組建時解析 —— 在執行前擷取缺失的定義、限定詞 (qualifier) 不匹配以及損壞的呼叫點 (call site)。
- **使用情況**：預設啟用。如果需要在遷移期間繞過驗證，可暫時停用。

```kotlin
koinCompiler {
    compileSafety = true
}
```

請參閱 [編譯期安全性 (Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety) 以了解驗證內容的完整詳細資訊。

### strictSafety

- **類型**：布林值
- **預設值**：自動偵測（在聚合器模組 (aggregator module) 上啟用 —— 即包含 `startKoin`、`koinApplication` 或 `@KoinApplication` 的模組）
- **說明**：強制在每次組建時重新執行完整的圖安全性檢查 (A3)，繞過聚合器模組上的 Kotlin 累加編譯 (incremental compilation) 快取。程式庫與功能模組仍保持完全累加。
- **使用情況**：保持預設值。如果自動偵測漏掉了您的聚合器，請明確設定為 `true`；若要退出則設定為 `false`（例如當測試夾具僅在註解中引用 `startKoin` 並觸發了偵測器時）。

```kotlin
koinCompiler {
    strictSafety = true   // 強制啟用
    // 或
    strictSafety = false  // 退出自動偵測
}
```

**為什麼需要此選項**：目前的 K2 累加編譯（透過 AGP 使用的 Build Tools API）無法追蹤 DI 圖所依賴的兩件事 —— `module { … }` Lambda 主體內的 DSL 定義（不屬於任何宣告的 ABI），以及 `@ComponentScan` 套件範圍探索（從掃描器到新增類別之間沒有原始碼層級的關聯）。即使圖已變更，聚合器的 `compileKotlin` 任務仍可能被標記為 UP-TO-DATE。`strictSafety` 是基於目前 K2 IC 所呈現資訊之上最小且正確的因應措施；由於每次組建僅重新執行聚合器，因此成本有限。

當 `compileSafety = false` 時無效。相關背景請參閱 [koin-compiler-plugin 問題 (issue) #32](https://github.com/InsertKoinIO/koin-compiler-plugin/issues/32)。

### skipDefaultValues

- **類型**：布林值
- **預設值**：`true`
- **說明**：啟用時，具有 Kotlin 預設值的參數將使用該預設值，而不是從 DI 容器中解析。可為 null 的參數和帶有註解的參數（`@Named`、`@InjectedParam` 等）仍會正常解析。
- **使用情況**：預設啟用。停用此選項可始終從 DI 容器注入所有參數。

```kotlin
koinCompiler {
    skipDefaultValues = true
}
```

### unsafeDslChecks

- **類型**：布林值
- **預設值**：`true`
- **說明**：驗證 Lambda 內部的 DSL 函式呼叫（例如 `create()`）是否為唯一的指令。有助於防止常見錯誤。
- **使用情況**：如有需要，可在從傳統 DSL 遷移期間暫時停用。

```kotlin
koinCompiler {
    unsafeDslChecks = false  // 在遷移期間停用
}
```

## 完整範例

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

koinCompiler {
    userLogs = true           // 記錄組件偵測
    debugLogs = false         // 詳細記錄（預設關閉）
    compileSafety = true      // 編譯期相依性驗證
    strictSafety = true       // 強制聚合器重新執行安全性檢查（預設為自動偵測）
    skipDefaultValues = true  // 使用 Kotlin 預設值而不是 DI 解析
    unsafeDslChecks = true    // 驗證 DSL 使用情況
}
```

## 最佳實務

- **保持 `compileSafety` 啟用**（預設值），以進行編譯期相依性驗證
- **將 `strictSafety` 保持在自動偵測** — 僅當偵測器漏掉了您的聚合器或在非聚合器檔案上誤判時才覆寫
- **保持 `skipDefaultValues` 啟用**（預設值），以尊重 Kotlin 預設值
- 在開發期間 **啟用 `userLogs`** 以查看偵測到哪些組件
- **保持 `unsafeDslChecks` 啟用**（預設值），以確保更安全的 DSL 使用
- **僅在對外掛程式問題進行疑難排解時使用 `debugLogs`**

## 另請參閱

- **[編譯期安全性 (Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety)** – 驗證內容與方式
- **[編譯器外掛程式設定](/docs/setup/compiler-plugin)** – 完整設定指南
- **[開始使用註解](/docs/reference/koin-annotations/start)** – 快速入門指南