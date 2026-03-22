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
    dslSafetyChecks = true
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

### dslSafetyChecks

- **類型**：布林值
- **預設值**：`true`
- **說明**：驗證 Lambda 內部的 DSL 函式呼叫（例如 `create()`）是否為唯一的指令。有助於防止常見錯誤。
- **使用情況**：如有需要，可在從傳統 DSL 遷移期間暫時停用。

```kotlin
koinCompiler {
    dslSafetyChecks = false  // 在遷移期間停用
}
```

## 完整範例

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

koinCompiler {
    userLogs = true        // 記錄組件偵測
    debugLogs = false      // 詳細記錄（預設關閉）
    dslSafetyChecks = true // 驗證 DSL 使用情況
}
```

## 最佳實務

- 在開發期間 **啟用 `userLogs`** 以查看偵測到哪些組件
- **保持 `dslSafetyChecks` 啟用**（預設值），以確保更安全的 DSL 使用
- **僅在對外掛程式問題進行疑難排解時使用 `debugLogs`**

## 另請參閱

- **[編譯器外掛程式設定](/docs/setup/compiler-plugin)** – 完整設定指南
- **[開始使用註解](/docs/reference/koin-annotations/start)** – 快速入門指南