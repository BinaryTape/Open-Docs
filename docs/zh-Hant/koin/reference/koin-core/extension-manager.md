---
title: 擴充套件管理器
---

以下是 `KoinExtension` 管理器的簡要說明，專門用於在 Koin 架構中新增功能。

## 定義擴充套件

Koin 擴充套件包含一個繼承自 `KoinExtension` 介面的類別：

```kotlin
interface KoinExtension {

    fun onRegister(koin : Koin)

    fun onClose()
}
```

此介面可確保傳遞 `Koin` 執行個體，並在 Koin 關閉時呼叫該擴充套件。

## 啟動擴充套件

若要啟動擴充套件，只需擴充系統的對應位置，並透過 `Koin.extensionManager` 進行註冊。

以下是我們定義 `coroutinesEngine` 擴充套件的方式：

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

以下是我們呼叫 `coroutinesEngine` 擴充套件的方式：

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```

## Resolver 引擎與 Resolution Extension

Koin 的解析 (resolution) 演算法已重新調整，使其具備可插拔性與擴充性。新的 CoreResolver 與 ResolutionExtension API 允許與外部系統整合或使用自訂解析邏輯。

在內部，解析現在能更有效地遍歷堆疊元素，並在作用域與父項階層結構之間更清晰地傳遞。這將修復許多與連結作用域遍歷相關的問題，並讓 Koin 能更好地整合到其他系統中。

請參閱下方示範解析擴充套件的測試：

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