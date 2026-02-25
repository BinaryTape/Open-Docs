---
title: 扩展管理器
---

这里是`KoinExtension`管理器的简要说明，该管理器致力于在`Koin`框架内部添加新功能。

## 定义扩展

Koin扩展由一个继承自`KoinExtension`接口的类组成：

```kotlin
interface KoinExtension {

    fun onRegister(koin : Koin)

    fun onClose()
}
```

此接口允许确保为您传递一个`Koin`实例，并且在`Koin`关闭时调用该扩展。

## 启动扩展

要启动扩展，只需扩展系统的相应位置，并使用`Koin.extensionManager`进行注册。

下面是我们如何定义`coroutinesEngine`扩展：

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

下面是我们如何调用`coroutinesEngine`扩展：

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```

## 解析器引擎与解析扩展

Koin的解析算法已重构为可插拔且可扩展。新的`CoreResolver`和`ResolutionExtension`API允许与外部系统或自定义解析逻辑集成。

在内部，解析现在可以更高效地遍历堆栈元素，并在作用域和父级层次结构之间进行更清晰的传播。这将修复许多与链接作用域遍历相关的问题，并允许`Koin`更好地与其他系统集成。

请参阅下方演示解析扩展的测试：

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