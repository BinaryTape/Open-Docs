---
title: 在測試中注入
---

## 讓您的測試成為 KoinComponent 並使用 KoinTest

*警告*：這不適用於 Android 儀器化測試。有關 Koin 的儀器化測試，請參閱 [Android 儀器化測試](/docs/reference/koin-android/instrumented-testing.md)

透過將您的類別標記為 `KoinTest`，您的類別將成為一個 `KoinComponent` 並為您帶來：

* `by inject()` 和 `get()` - 從 Koin 取得實例的函式
* `checkModules` - 幫助您檢查您的配置
* `declareMock` 和 `declare` - 在目前上下文宣告一個模擬或新的定義

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
 您可以隨意地擴充 Koin 模組配置，以幫助您部分建構您的應用程式。
:::

## JUnit 規則

### 為您的測試建立 Koin 上下文

您可以使用以下規則，為您的每個測試輕鬆建立並持有 Koin 上下文：

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    // Your KoinApplication instance here
    modules(myModule)
}
```

### 指定您的 Mock 提供者

為了讓您使用 `declareMock` API，您需要指定一個規則，讓 Koin 知道您如何建構您的 Mock 實例。這讓您可以根據需要選擇合適的模擬框架。

使用 Mockito 建立模擬：

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    Mockito.mock(clazz.java)
}
```

使用 MockK 建立模擬：

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    mockkClass(clazz)
}
```

!> koin-test 專案不再綁定於 mockito

## 開箱即用的模擬

與其每次需要模擬時都建立一個新模組，不如使用 `declareMock` 即時宣告一個模擬：

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
 `declareMock` 可以指定您是想要 single 還是 factory，以及您是否希望它位於模組路徑中。
:::

## 即時宣告元件

當模擬不足以應付，且不想只為此建立一個模組時，您可以使用 `declare`：

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

## 檢查您的 Koin 模組

Koin 提供一種測試您的 Koin 模組是否良好的方法：`checkModules` - 遍歷您的定義樹並檢查每個定義是否已綁定

```kotlin
    @Test
    fun `check MVP hierarchy`() {
        checkModules {
            modules(myModule1, myModule2 ...)
        } 
    }
```

## 啟動與停止 Koin 以進行測試

請注意在每次測試之間停止您的 koin 實例（如果您在測試中使用 `startKoin`）。否則請確保使用 `koinApplication`，用於本地 koin 實例，或使用 `stopKoin()` 來停止目前的全局實例。

## 使用 JUnit5 進行測試
JUnit 5 支援提供 [Extensions]([url](https://junit.org/junit5/docs/current/user-guide/#extensions))，它們將處理 Koin 上下文的啟動與停止。這表示如果您正在使用此擴充功能，則無需使用 `AutoCloseKoinTest`。

### 依賴項
為了使用 JUnit5 進行測試，您需要使用 `koin-test-junit5` 依賴項。

### 撰寫測試
您需要註冊 `KoinTestExtension` 並提供您的模組配置。完成後，您可以透過 get 或 inject 將您的元件注入到測試中。請記住將 `@JvmField` 與 `@RegisterExtension` 一起使用。

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

### 使用 JUnit5 進行模擬
這與 JUnit4 的工作方式相同，只是您需要使用 `@RegisterExtension`。

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

### 取得已建立的 Koin 實例
您也可以將已建立的 koin 上下文作為函式參數取得。這可以透過向測試函式添加一個函式參數來實現。

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
```