---
title: "JUnit 測試 (JUnit Tests)"
---
> 本教學課程可讓您測試 Kotlin 應用程式，並使用 Koin 注入 (inject) 和檢索 (retrieve) 您的元件。

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle 設定

首先，新增 Koin 依賴項，如下所示：

```groovy
dependencies {
    // Koin 測試工具
    testCompile "io.insert-koin:koin-test:$koin_version"
    // 需要的 JUnit 版本
    testCompile "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 宣告依賴項

我們重複使用 `koin-core` getting-started 專案，以使用 koin 模組：

```kotlin
val helloModule = module {
    single { HelloMessageData() }
    single { HelloServiceImpl(get()) as HelloService }
}
```

## 編寫我們的第一個測試

為了進行我們的第一個測試，讓我們編寫一個簡單的 Junit 測試檔案，並使用 `KoinTest` 擴展它。 然後，我們可以使用 `by inject()` 運算符。

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

> 我們使用 Koin KoinTestRule 規則來啟動/停止我們的 Koin 上下文

您甚至可以直接在 MyPresenter 中建立 Mock，或測試 MyRepository。 這些元件與 Koin API 没有任何關聯。

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
```