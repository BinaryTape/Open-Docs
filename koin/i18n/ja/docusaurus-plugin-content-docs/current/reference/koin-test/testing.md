---
title: テストにおけるインジェクション
---
## KoinTest でテストを KoinComponent にする

*警告*: これは Android の計装化テストには適用されません。Koin を使用した計装化テストについては、[Android Instrumented Testing](/reference/koin-android/instrumented-testing.md) を参照してください。

クラスに `KoinTest` のタグを付けると、そのクラスは `KoinComponent` になり、次の機能が提供されます。

* `by inject()` & `get()` - Koin からインスタンスを取得する関数
* `checkModules` - 構成の確認に役立ちます
* `declareMock` & `declare` - 現在のコンテキストでモックまたは新しい定義を宣言します

```kotlin
class ComponentA
class ComponentB(val a: ComponentA)

class MyTest : KoinTest {

    // 遅延 inject プロパティ
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

        // インスタンスを直接リクエスト
        val componentA = get<ComponentA>()

        assertNotNull(a)
        assertEquals(componentA, componentB.a)
    }
```

:::note
 アプリを部分的に構築するために、Koin モジュール構成をオーバーロードすることを躊躇しないでください。
:::

## JUnit Rules

### テスト用の Koin コンテキストを作成する

次のルールを使用して、各テスト用の Koin コンテキストを簡単に作成および保持できます。

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    // ここに KoinApplication インスタンスを記述
    modules(myModule)
}
```

### Mock プロバイダーの指定

`declareMock` API を使用できるようにするには、Koin に Mock インスタンスの構築方法を知らせるルールを指定する必要があります。これにより、ニーズに合った適切なモックフレームワークを選択できます。

Mockito を使用してモックを作成します。

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // ここに Mock を構築する方法を記述
    Mockito.mock(clazz.java)
}
```

MockK を使用してモックを作成します。

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // ここに Mock を構築する方法を記述
    mockkClass(clazz)
}
```

!> koin-test プロジェクトは mockito にバインドされなくなりました

## そのまま使えるモック

モックが必要になるたびに新しいモジュールを作成する代わりに、`declareMock` を使用してその場でモックを宣言できます。

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
        // 現在の定義を Mock に置き換えます
        val mock = declareMock<ComponentA>()

        // モックを取得します。上記の変数と同じです
        assertNotNull(get<ComponentA>())

        // モックされた ComponentA で構築されています
        assertNotNull(get<ComponentB>())
    }
```

:::note
 declareMock は、single または factory にするか、モジュールパスに含めるかを指定できます。
:::

## その場でコンポーネントを宣言する

モックだけでは十分ではなく、このためだけにモジュールを作成したくない場合は、`declare` を使用できます。

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

## Koin モジュールの確認

Koin には、Koin モジュールが適切かどうかをテストする方法が用意されています。`checkModules` - 定義ツリーを調べて、各定義がバインドされているかどうかを確認します

```kotlin
    @Test
    fun `check MVP hierarchy`() {
        checkModules {
            modules(myModule1, myModule2 ...)
        } 
    }
```

## テスト用の Koin の開始と停止

すべてのテスト間で、koin インスタンスを停止することに注意してください（テストで `startKoin` を使用する場合）。それ以外の場合は、ローカル koin インスタンスの場合は `koinApplication` を、現在のグローバルインスタンスを停止する場合は `stopKoin()` を必ず使用してください。

## JUnit5 でのテスト
JUnit 5 のサポートでは、Koin コンテキストの開始と停止を処理する [Extensions](https://junit.org/junit5/docs/current/user-guide/) が提供されます。つまり、拡張機能を使用している場合は、`AutoCloseKoinTest` を使用する必要はありません。

### 依存関係
JUnit5 でテストするには、`koin-test-junit5` の依存関係を使用する必要があります。

### テストの作成
`KoinTestExtension` を登録し、モジュール構成を提供する必要があります。これが完了すると、テストにコンポーネントを取得または注入できます。`@RegisterExtension` で `@JvmField` を使用することを忘れないでください。

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

### JUnit5 でのモック
これは JUnit4 と同じように機能しますが、`@RegisterExtension` を使用する必要があります。

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

### 作成された Koin インスタンスを取得する
作成された koin コンテキストを関数パラメータとして取得することもできます。これは、テスト関数に関数パラメータを追加することで実現できます。

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