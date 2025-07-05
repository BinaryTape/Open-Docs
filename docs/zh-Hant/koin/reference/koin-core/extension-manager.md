---
title: 擴充管理員
---

這裡簡要說明了 `KoinExtension` 管理員，其旨在為 Koin 框架添加新功能。

## 定義擴充

一個 Koin 擴充包含一個繼承自 `KoinExtension` 介面的類別：

```kotlin
interface KoinExtension {

    fun onRegister(koin : Koin)

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

## 解析器引擎與解析擴充

Koin 的解析演算法已重新設計為可插拔和可擴充的。新的 `CoreResolver` 和 `ResolutionExtension` API 允許與外部系統或自訂解析邏輯整合。

在內部，解析現在能更有效地遍歷堆疊元素，並在作用域和父層級結構之間進行更清晰的傳播。這將解決許多與鏈接作用域遍歷相關的問題，並允許 Koin 更好地整合到其他系統中。

請看下方演示解析擴充的測試：

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