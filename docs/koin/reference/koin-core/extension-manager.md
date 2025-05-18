---
title: 扩展管理器
---
以下是关于 `KoinExtension` 管理器的简要描述，它专门用于在 Koin 框架内部添加新特性。

## 定义一个扩展

Koin 扩展由一个继承自 `KoinExtension` 接口的类组成：

```kotlin
interface KoinExtension {
    
    var koin : Koin
    
    fun onClose()
}
```

该接口允许确保你获得一个 `Koin` 实例，并且在 Koin 关闭时调用该扩展。当 Koin 关闭时，该扩展也会被调用。

## 启动一个扩展

要启动一个扩展，只需扩展系统的正确位置，并使用 `Koin.extensionManager` 注册它。

下面是如何定义 `coroutinesEngine` 扩展：

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

下面是如何调用 `coroutinesEngine` 扩展：

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)