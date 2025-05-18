---
title: "在測試中注入 (Injecting)"
---
## 使用 KoinTest 讓你的測試成為 KoinComponent

*警告*: 這不適用於 Android Instrumented 測試。對於使用 Koin 的 Instrumented 測試，請參閱 [Android Instrumented Testing](/reference/koin-android/instrumented-testing.md)

藉由標記你的類別為 `KoinTest`，你的類別會變成一個 `KoinComponent`，並為你帶來以下功能：

* `by inject()` & `get()` - 從 Koin 檢索你的實例的函式
* `checkModules` - 幫助你檢查你的配置
* `declareMock` & `declare` - 在目前的上下文中宣告一個 Mock 或一個新的定義

```kotlin
class ComponentA
class ComponentB(val a: ComponentA)

class MyTest : KoinTest {

    // Lazy inject property (延遲注入屬性)
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

        // directly request an instance (直接請求一個實例)
        val componentA = get<ComponentA>()

        assertNotNull(a)
        assertEquals(componentA, componentB.a)
    }
```

:::note
 不要猶豫重載 Koin 模組配置來幫助你部分構建你的應用程式。
:::

## JUnit 規則

### 為你的測試建立 Koin 上下文

你可以使用以下規則，輕鬆地為你的每個測試建立和持有一個 Koin 上下文：

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    // Your KoinApplication instance here (你的 KoinApplication 實例在此)
    modules(myModule)
}
```

### 指定你的 Mock 提供者 (Mock Provider)

為了讓你使用 `declareMock` API，你需要指定一條規則，讓 Koin 知道你如何建立你的 Mock 實例。這讓你選擇適合你需求的 Mock 框架。

使用 Mockito 建立 Mock：

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here (你在此建立 Mock 的方式)
    Mockito.mock(clazz.java)
}
```

使用 MockK 建立 Mock：

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here (你在此建立 Mock 的方式)
    mockkClass(clazz)
}
```

!> koin-test 專案不再與 mockito 綁定

## 開箱即用的 Mock

你不必每次需要 Mock 時都建立一個新的模組，你可以使用 `declareMock` 即時宣告一個 Mock：

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
        // Replace current definition by a Mock (用 Mock 替換目前的定義)
        val mock = declareMock<ComponentA>()

        // retrieve mock, same as variable above (檢索 Mock，與上面的變數相同)
        assertNotNull(get<ComponentA>())

        // is built with mocked ComponentA (用 Mock 的 ComponentA 構建)
        assertNotNull(get<ComponentB>())
    }
```

:::note
 declareMock 可以指定你想要 single 還是 factory，以及你是否想要將它放在一個模組路徑中。
:::

## 即時宣告一個元件

當 Mock 不夠用，而且不想僅為此建立一個模組時，你可以使用 `declare`：

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

## 檢查你的 Koin 模組

Koin 提供了一種方法來測試你的 Koin 模組是否良好：`checkModules` - 遍歷你的定義樹，並檢查每個定義是否已綁定

```kotlin
    @Test
    fun `check MVP hierarchy`() {
        checkModules {
            modules(myModule1, myModule2 ...)
        } 
    }
```

## 為你的測試啟動和停止 Koin

請注意在每次測試之間停止你的 Koin 實例（如果你在你的測試中使用 `startKoin`）。否則，請確保使用 `koinApplication`，用於本地 Koin 實例，或 `stopKoin()` 來停止當前的全域實例。

## 使用 JUnit5 進行測試
JUnit 5 支援提供 [Extensions](https://junit.org/junit5/docs/current/user-guide/)，它將處理 Koin 上下文的啟動和停止。這意味著如果你使用擴充功能 (extension)，則無需使用 `AutoCloseKoinTest`。

### 依賴

對於使用 JUnit5 進行測試，你需要使用 `koin-test-junit5` 依賴。

### 編寫測試
你需要註冊 `KoinTestExtension` 並提供你的模組配置。完成此操作後，你可以取得 (get) 或注入 (inject) 你的元件到測試中。請記住將 `@JvmField` 與 `@RegisterExtension` 一起使用。

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

### 使用 JUnit5 進行 Mock
這與 JUnit4 中的工作方式相同，只是你需要使用 `@RegisterExtension`。

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
你還可以將建立的 Koin 上下文作為函式參數取得。這可以透過將函式參數添加到測試函式來實現。

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