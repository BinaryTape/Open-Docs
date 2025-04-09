---
title: JUnitテスト
---
> このチュートリアルでは、Kotlinアプリケーションをテストし、Koinを使用してコンポーネントを注入（inject）および取得（retrieve）する方法を説明します。

## コードを入手する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradleの設定

まず、以下のようにKoinの依存関係を追加します。

```groovy
dependencies {
    // Koin testing tools
    testCompile "io.insert-koin:koin-test:$koin_version"
    // Needed JUnit version
    testCompile "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 宣言された依存関係

`koin-core`のgetting-startedプロジェクトを再利用して、Koinモジュールを使用します。

```kotlin
val helloModule = module {
    single { HelloMessageData() }
    single { HelloServiceImpl(get()) as HelloService }
}
```

## 最初のテストの作成

最初のテストを作成するために、簡単なJUnitテストファイルを作成し、それを`KoinTest`で拡張してみましょう。そうすることで、`by inject()`演算子を使用できるようになります。

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

> KoinのKoinTestRuleルールを使用して、Koinコンテキストを開始/停止します。

MyPresenterに直接Mockを作成したり、MyRepositoryをテストしたりすることもできます。これらのコンポーネントは、Koin APIとは一切関係ありません。

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