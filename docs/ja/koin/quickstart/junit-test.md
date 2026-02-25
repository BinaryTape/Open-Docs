---
title: JUnit テスト
---

> このチュートリアルでは、Kotlin アプリケーションをテストし、Koin を使用してコンポーネントを注入 (inject) および取得する方法を説明します。

## コードの取得

:::info
[ソースコードは GitHub で公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle の設定

まず、以下のように Koin の依存関係を追加します。

```groovy
dependencies {
    // Koin テストツール
    testImplementation "io.insert-koin:koin-test:$koin_version"
    // 必要な JUnit バージョン
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 宣言された依存関係

`koin-core` の入門プロジェクトを再利用して、Koin モジュールを使用します。

```kotlin
val helloModule = module {
    single { HelloMessageData() }
    single { HelloServiceImpl(get()) as HelloService }
}
```

## 最初のテストの作成

最初のテストを作成するために、シンプルな JUnit テストファイルを作成し、`KoinTest` を継承させましょう。これにより、`by inject()` オペレーターを使用できるようになります。

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

> Koin の `KoinTestRule` ルールを使用して、Koin コンテキストの開始と停止を行います。

`MyPresenter` に直接モックを作成したり、`MyRepository` をテストしたりすることもできます。これらのコンポーネントは Koin API との依存関係はありません。

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