---
title: 擴充管理員
---

這裡簡要說明了 `KoinExtension` 管理員，其旨在為 Koin 框架添加新功能。

## 定義擴充

一個 Koin 擴充包含一個繼承自 `KoinExtension` 介面的類別：

```kotlin
interface KoinExtension {
    
    var koin : Koin
    
    fun onClose()
}
```

此介面確保您會獲得一個 `Koin` 實例，並且該擴充會在 Koin 關閉時被呼叫。

## 啟動擴充

要啟動一個擴充，只需擴展系統中的正確位置，並將其註冊到 `Koin.extensionManager`。

下面說明了我們如何定義 `coroutinesEngine` 擴充：

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

下面說明了我們如何呼叫 `coroutinesEngine` 擴充：

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```