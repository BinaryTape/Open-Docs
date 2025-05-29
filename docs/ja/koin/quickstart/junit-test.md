---
title: JUnitテスト
---

> このチュートリアルでは、Kotlinアプリケーションをテストし、Koinのinjectとコンポーネントの取得機能を利用する方法を説明します。

## コードの取得

:::info
[ソースコードはGitHubで利用可能です。](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradleセットアップ

まず、以下のようにKoinの依存関係を追加します。

```groovy
dependencies {
    // Koin testing tools
    testCompile "io.insert-koin:koin-test:$koin_version"
    // Needed JUnit version
    testCompile "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 依存関係の宣言

Koinモジュールを使用するために、`koin-core`のgetting-startedプロジェクトを再利用します。

```kotlin
val helloModule = module {
    single { HelloMessageData() }
    single { HelloServiceImpl(get()) as HelloService }
}
```

## 初めてのテストの記述

初めてのテストを作成するために、シンプルなJUnitテストファイルを作成し、`KoinTest`を継承させましょう。そうすれば、`by inject()`演算子を使用できるようになります。

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

> Koinコンテキストを開始/停止するために、Koin KoinTestRuleルールを使用します。

MyPresenter内に直接モックを作成したり、MyRepositoryをテストしたりすることもできます。これらのコンポーネントはKoin APIとは関連がありません。

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