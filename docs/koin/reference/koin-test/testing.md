---
title: 在测试中注入
---

## 将你的测试标记为 KoinComponent 并使用 KoinTest

*警告*：这不适用于 Android 仪器化测试。有关使用 Koin 进行仪器化测试，请参阅 [Android 仪器化测试](/docs/reference/koin-android/instrumented-testing.md)

通过将你的类标记为 `KoinTest`，你的类将成为 `KoinComponent` 并为你带来：

* `by inject()` & `get()` - 从 Koin 获取实例的函数
* `checkModules` - 帮助你检查配置
* `declareMock` & `declare` - 在当前上下文 (Context) 中声明一个 Mock 或新的定义

```kotlin
class ComponentA
class ComponentB(val a: ComponentA)

class MyTest : KoinTest {

    // Lazy inject property
    val componentB : ComponentB by inject()

    @Test
    fun `should inject my components`() {
        startKoin {
            modules(
                module {
                    single { ComponentA() }
                    single { ComponentB(get()) }
                })
        }

        // directly request an instance
        val componentA = get<ComponentA>()

        assertNotNull(a)
        assertEquals(componentA, componentB.a)
    }
```

:::note
 不要犹豫重载 Koin 模块配置，以帮助你部分构建你的应用。
:::

## JUnit 规则

### 为你的测试创建 Koin 上下文

你可以使用以下规则轻松地为你的每个测试创建并持有 Koin 上下文：

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    // Your KoinApplication instance here
    modules(myModule)
}
```

### 指定你的 Mock Provider

为了让你使用 `declareMock` API，你需要指定一个规则，让 Koin 知道你如何构建你的 Mock 实例。这使你可以选择适合你需求的 Mock 框架。

使用 Mockito 创建 Mock:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    Mockito.mock(clazz.java)
}
```

使用 MockK 创建 Mock:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    mockkClass(clazz)
}
```

!> `koin-test` 项目不再绑定到 Mockito

## 开箱即用的 Mock

无需每次需要 Mock 时都创建一个新模块，你可以使用 `declareMock` 动态声明一个 Mock：

```kotlin
class ComponentA
class ComponentB(val a: ComponentA)

class MyTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            module {
                single { ComponentA() }
                single { ComponentB(get()) }
            })
    }

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }
    
    @Test
    fun `should inject my components`() {
    
    }
        // Replace current definition by a Mock
        val mock = declareMock<ComponentA>()

        // retrieve mock, same as variable above 
        assertNotNull(get<ComponentA>())

        // is built with mocked ComponentA
        assertNotNull(get<ComponentB>())
    }
```

:::note
 `declareMock` 可以指定你想要的是单例 (single) 还是工厂 (factory)，以及你是否希望它存在于模块路径 (module path) 中。
:::

## 动态声明组件

当 Mock 不足时，并且你不想仅仅为此创建一个模块，你可以使用 `declare`：

```kotlin
    @Test
    fun `successful declare an expression mock`() {
        startKoin { }

        declare {
            factory { ComponentA("Test Params") }
        }

        Assert.assertNotEquals(get<ComponentA>(), get<ComponentA>())
    }
```

## 检查你的 Koin 模块

Koin 提供了一种测试 Koin 模块是否正常工作的方法：`checkModules` - 遍历你的定义树并检查每个定义是否已绑定

```kotlin
    @Test
    fun `check MVP hierarchy`() {
        checkModules {
            modules(myModule1, myModule2 ...)
        } 
    }
```

## 为你的测试启动和停止 Koin

请注意停止你的 Koin 实例 (如果你在测试中使用 `startKoin`) 在每个测试之间。否则，请务必使用 `koinApplication` (用于本地 Koin 实例) 或 `stopKoin()` 来停止当前全局实例。

## 使用 JUnit5 进行测试

JUnit 5 支持提供了 [扩展 (Extensions)](https://junit.org/junit5/docs/current/user-guide/#extensions)，它们将处理 Koin 上下文的启动和停止。这意味着如果你正在使用该扩展，则无需使用 `AutoCloseKoinTest`。

### 依赖

为了使用 JUnit5 进行测试，你需要使用 `koin-test-junit5` 依赖。

### 编写测试

你需要注册 `KoinTestExtension` 并提供你的模块配置。完成此操作后，你可以将组件 `get` 或 `inject` 到测试中。请记住将 `@JvmField` 与 `@RegisterExtension` 一起使用。

```kotlin
class ExtensionTests: KoinTest {

    private val componentB by inject<Simple.ComponentB>()

    @JvmField
    @RegisterExtension
    val koinTestExtension = KoinTestExtension.create {
        modules(
                module {
            single { Simple.ComponentA() }
            single { Simple.ComponentB(get()) }
        })
    }

    @Test
    fun contextIsCreatedForTheTest() {
        Assertions.assertNotNull(get<Simple.ComponentA>())
        Assertions.assertNotNull(componentB)
    }
}

```

### 使用 JUnit5 进行 Mock

这与 JUnit4 中的工作方式相同，不同之处在于你需要使用 `@RegisterExtension`。

```kotlin
class MockExtensionTests: KoinTest {

    val mock: Simple.UUIDComponent by inject()

    @JvmField
    @RegisterExtension
    val koinTestExtension = KoinTestExtension.create {
        modules(
                module {
                    single { Simple.UUIDComponent() }
                })
    }

    @JvmField
    @RegisterExtension
    val mockProvider = MockProviderExtension.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun mockProviderTest() {
        val uuidValue = "UUID"
        declareMock<Simple.UUIDComponent> {
            BDDMockito.given(getUUID()).will { uuidValue }
        }

        Assertions.assertEquals(uuidValue, mock.getUUID())
    }
}
```

### 获取已创建的 Koin 实例

你也可以将创建的 Koin 上下文作为函数参数获取。这可以通过向测试函数添加一个函数参数来实现。

```kotlin
class ExtensionTests: KoinTest {
    
    @RegisterExtension
    @JvmField
    val koinTestExtension = KoinTestExtension.create {
        modules(
                module {
                    single { Simple.ComponentA() }
                })
    }

    @Test
    fun contextIsCreatedForTheTest(koin: Koin) {
        // get<SimpleComponentA>() == koin.get<Simple.ComponentA>()
        Assertions.assertNotNull(koin.get<Simple.ComponentA>())
    }
}