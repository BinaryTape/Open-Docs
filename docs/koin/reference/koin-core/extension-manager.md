---
title: 扩展管理器
---

这里是对`KoinExtension`管理器的简要描述，它致力于在Koin框架中添加新功能。

## 定义扩展

Koin扩展是指一个类继承自`KoinExtension`接口：

```kotlin
interface KoinExtension {
    
    var koin : Koin
    
    fun onClose()
}
```

该接口确保你会传入一个`Koin`实例，并且在Koin关闭时会调用该扩展。

## 启动扩展

要启动一个扩展，只需扩展系统的正确位置，并使用`Koin.extensionManager`注册它。

下面是如何定义`coroutinesEngine`扩展：

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

下面是如何调用`coroutinesEngine`扩展：

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```