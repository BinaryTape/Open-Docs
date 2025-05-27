---
title: テストでのインジェクション
---

## KoinTestでテストをKoinComponentにする

*注意*: これはAndroid Instrumentedテストには適用されません。Koinを使ったInstrumentedテストについては、[Android Instrumented Testing](/docs/reference/koin-android/instrumented-testing.md)を参照してください。

クラスに`KoinTest`タグを付けることで、そのクラスは`KoinComponent`となり、以下の機能を提供します：

* `by inject()` & `get()` - Koinからインスタンスを取得する関数
* `checkModules` - 設定をチェックするのに役立ちます
* `declareMock` & `declare` - 現在のコンテキストでモックまたは新しい定義を宣言するため

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
Koinモジュールの設定をオーバーロードして、アプリを部分的に構築するのに役立てることをためらわないでください。
:::

## JUnitルール (JUnit Rules)

### テスト用のKoinコンテキストを作成する

以下のルールを使用することで、各テスト用にKoinコンテキストを簡単に作成し、保持できます：

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    // Your KoinApplication instance here
    modules(myModule)
}
```

### モックプロバイダを指定する

`declareMock` APIを使用できるようにするには、Koinがモックインスタンスをどのように構築するかをKoinに知らせるルールを指定する必要があります。これにより、ニーズに合った適切なモックフレームワークを選択できます。

Mockitoを使用してモックを作成する:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    Mockito.mock(clazz.java)
}
```

MockKを使用してモックを作成する:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    mockkClass(clazz)
}
```

!> koin-testプロジェクトはもはやMockitoに縛られていません

## 組み込みのモック機能 (Mocking out of the box)

モックが必要になるたびに新しいモジュールを作成する代わりに、`declareMock`を使用してモックをその場で宣言できます：

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
`declareMock`は、シングルトン (single) かファクトリ (factory) か、そしてモジュールパスに含めるかどうかを指定できます。
:::

## コンポーネントをその場で宣言する

モックでは不十分で、そのためだけにモジュールを作成したくない場合は、`declare`を使用できます：

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

## Koinモジュールをチェックする

Koinは、Koinモジュールが適切かどうかをテストする方法を提供します：`checkModules`は、定義ツリーを巡回し、各定義がバインドされているかをチェックします。

```kotlin
    @Test
    fun `check MVP hierarchy`() {
        checkModules {
            modules(myModule1, myModule2 ...)
        } 
    }
```

## テストにおけるKoinの起動と停止

テストで`startKoin`を使用している場合、各テスト間でKoinインスタンスを停止するように注意してください。そうしない場合、ローカルのKoinインスタンスには`koinApplication`を、現在のグローバルインスタンスを停止するには`stopKoin()`を使用してください。

## JUnit5でのテスト

JUnit 5は、Koinコンテキストの起動と停止を処理する[Extensions](https://junit.org/junit5/docs/current/user-guide/#extensions)を提供します。これは、エクステンションを使用する場合、`AutoCloseKoinTest`を使用する必要がないことを意味します。

### 依存関係 (Dependency)

JUnit5でのテストには、`koin-test-junit5`依存関係を使用する必要があります。

### テストの記述 (Writing tests)

`KoinTestExtension`を登録し、モジュール構成を提供する必要があります。これが完了したら、コンポーネントをテストに`get`または`inject`できます。`@RegisterExtension`と一緒に`@JvmField`を使用することを忘れないでください。

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

### JUnit5でのモック (Mocking with JUnit5)

これはJUnit4と全く同じように機能しますが、`@RegisterExtension`を使用する必要があります。

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

### 作成されたKoinインスタンスの取得 (Getting the created Koin instances)

作成されたKoinコンテキストを関数パラメータとして取得することもできます。これは、テスト関数に関数パラメータを追加することで実現できます。

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