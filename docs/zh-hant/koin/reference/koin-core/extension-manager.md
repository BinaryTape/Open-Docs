---
title: "擴充功能管理器 (Extension Manager)"
---
以下是有關於 `KoinExtension` 管理器的簡要說明，其專用於在 Koin 框架內新增功能。

## 定義擴充功能（Extension）

Koin 擴充功能由繼承自 `KoinExtension` 介面的類別組成：

```kotlin
interface KoinExtension {
    
    var koin : Koin
    
    fun onClose()
}
```

此介面可確保您獲得傳遞的 `Koin` 實例，並且在 Koin 關閉時會呼叫擴充功能。

## 啟動擴充功能（Extension）

要啟動擴充功能，只需擴充系統的正確位置，並使用 `Koin.extensionManager` 註冊它。

以下是我們如何定義 `coroutinesEngine` 擴充功能：

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

以下是如何呼叫 `coroutinesEngine` 擴充功能：

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```