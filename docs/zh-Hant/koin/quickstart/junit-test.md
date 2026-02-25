---
title: JUnit 測試
---

> 本教學將帶領您測試 Kotlin 應用程式，並使用 Koin 注入與擷取您的組建。

## 取得程式碼

:::info
[原始碼可於 GitHub 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle 設定

首先，如下所示新增 Koin 相依性：

```groovy
dependencies {
    // Koin 測試工具
    testImplementation "io.insert-koin:koin-test:$koin_version"
    // 所需的 JUnit 版本
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 宣告相依性

我們重複使用 `koin-core` 快速入門專案，以使用 koin 模組：

```kotlin
val helloModule = module {
    single { HelloMessageData() }
    single { HelloServiceImpl(get()) as HelloService }
}
```

## 編寫我們的第一個測試

為了進行我們的第一個測試，讓我們先編寫一個簡單的 JUnit 測試檔案並擴充（extend）`KoinTest`。接著我們就能夠使用 `by inject()` 運算子。

```kotlin
class HelloAppTest : KoinTest {

    val model by inject<HelloMessageData>()
    val service by inject<HelloService>()

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger()
        modules(helloModule)
    }

    @Test
    fun `unit test`() {
        val helloApp = HelloApplication()
        helloApp.sayHello()

        assertEquals(service, helloApp.helloService)
        assertEquals("Hey, ${model.message}", service.hello())
    }
}
```

> 我們使用 Koin 的 KoinTestRule 規則來啟動/停止我們的 Koin 上下文

您甚至可以直接在 MyPresenter 中製作 Mock，或是測試 MyRepository。這些組建與 Koin API 沒有任何關聯。

```kotlin
class HelloMockTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger(Level.DEBUG)
        modules(helloModule)
    }

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `mock test`() {
        val service = declareMock<HelloService> {
            given(hello()).willReturn("Hello Mock")
        }

        HelloApplication().sayHello()

        Mockito.verify(service,times(1)).hello()
    }
}