---
title: "Context Isolation (コンテキスト分離)"
---
## Context Isolation（コンテキスト分離）とは？

SDK (Software Development Kit)作成者の場合、グローバルではない方法でKoinを使用することもできます。ライブラリのDI (Dependency Injection)にKoinを使用し、コンテキストを分離することで、ライブラリを使用するユーザーとKoinの間で競合が発生するのを防ぎます。

通常の方法では、次のようにKoinを起動できます。

```kotlin
// KoinApplicationを起動し、グローバルコンテキストに登録します
startKoin {

    // 使用するModuleを宣言します
    modules(...)
}
```

これは、デフォルトのKoinコンテキストを使用して依存関係を登録します。

しかし、分離されたKoinインスタンスを使用したい場合は、インスタンスを宣言し、インスタンスを保持するクラスに格納する必要があります。
ライブラリ内でKoin Applicationインスタンスを使用できるようにし、カスタムのKoinComponent実装に渡す必要があります。

`MyIsolatedKoinContext`クラスは、ここでKoinインスタンスを保持しています。

```kotlin
// KoinインスタンスのContextを取得します
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // 使用するModuleを宣言します
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

`MyIsolatedKoinContext`を使用して、分離されたKoinComponent (IsolatedKoinComponent)クラスを定義しましょう。これは、分離されたコンテキストを使用するKoinComponentです。

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // デフォルトのKoinインスタンスをオーバーライドします
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

すべて準備が整いました。`IsolatedKoinComponent`を使用して、分離されたコンテキストからインスタンスを取得します。

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject & getはMyKoinContextをターゲットにします
}
```

## テスト

`by inject()`デリゲートを使用して依存関係を取得するクラスをテストするには、`getKoin()`メソッドをオーバーライドし、カスタムKoinモジュールを定義します。

```kotlin
class MyClassTest : KoinTest {
    // 依存関係を取得するために使用されるKoin Context
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // カスタムKoinモジュールを定義します
        val module = module {
            // 依存関係を登録します
        }

        koin.loadModules(listOf(module))
    }
}
```