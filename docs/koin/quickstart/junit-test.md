---
title: JUnit 测试
---

> 本教程将指导您测试 Kotlin 应用程序，并使用 Koin 注入和检索组件。

## 获取代码

:::info
[源代码可在 GitHub 上获得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle 设置

首先，如下添加 Koin 依赖项：

```groovy
dependencies {
    // Koin 测试工具
    testImplementation "io.insert-koin:koin-test:$koin_version"
    // 所需的 JUnit 版本
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 声明依赖项

我们重复使用 `koin-core` 快速入门项目，以使用 koin 模块：

```kotlin
val helloModule = module {
    single { HelloMessageData() }
    single { HelloServiceImpl(get()) as HelloService }
}
```

## 编写我们的第一个测试

为了进行第一个测试，让我们编写一个简单的 JUnit 测试文件并扩展 `KoinTest`。然后，我们将能够使用 `by inject()` 运算符。

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

> 我们使用 Koin `KoinTestRule` 规则来启动/停止 Koin 上下文

您甚至可以直接在 `MyPresenter` 中创建 Mock，或测试 `MyRepository`。这些组件与 Koin API 没有任何联系。

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