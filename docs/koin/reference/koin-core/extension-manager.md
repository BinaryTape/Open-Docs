---
title: 扩展管理器
---

这里是对`KoinExtension`管理器的简要描述，它致力于在Koin框架中添加新功能。

## 定义扩展

Koin 扩展是指一个类继承自`KoinExtension`接口：

```kotlin
interface KoinExtension {

    fun onRegister(koin : Koin)

    fun onClose()
}
```

该接口确保你会传入一个`Koin`实例，并且在 Koin 关闭时会调用该扩展。

## 启动扩展

要启动一个扩展，只需在系统的正确位置进行扩展，并使用`Koin.extensionManager`注册它。

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

## 解析器引擎 (Resolver Engine) 与解析扩展 (Resolution Extension)

Koin 的解析算法已重新设计，使其具有可插拔和可扩展性。新的 CoreResolver 和 ResolutionExtension API 允许与外部系统或自定义解析逻辑集成。

在内部，解析现在能更高效地遍历堆栈元素，并在作用域和父级层次结构中更清晰地传播。这将修复与链接作用域遍历相关的许多问题，并允许 Koin 更好地集成到其他系统中。

请看下面一个演示解析扩展的测试：

```kotlin
@Test
fun extend_resolution_test(){
    val resolutionExtension = object : ResolutionExtension {
        val instanceMap = mapOf<KClass<*>, Any>(
            Simple.ComponentA::class to Simple.ComponentA()
        )

        override val name: String = "hello-extension"
        override fun resolve(
            scope: Scope,
            instanceContext: ResolutionContext
        ): Any? {
            return instanceMap[instanceContext.clazz]
        }
    }

    val koin = koinApplication{
        printLogger(Level.DEBUG)
        koin.resolver.addResolutionExtension(resolutionExtension)
        modules(module {
            single { Simple.ComponentB(get())}
        })
    }.koin

    assertEquals(resolutionExtension.instanceMap[Simple.ComponentA::class], koin.get<Simple.ComponentB>().a)
    assertEquals(1,koin.instanceRegistry.instances.values.size)
}