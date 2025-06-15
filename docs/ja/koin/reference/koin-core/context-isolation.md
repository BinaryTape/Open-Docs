---
title: コンテキストの分離
---

## コンテキストの分離とは？

SDK開発者の場合、Koinをグローバルではない方法で利用することも可能です。ライブラリのDIにKoinを使用し、コンテキストを分離することで、ライブラリとその利用者がKoinを併用する際の競合を回避できます。

標準的な方法では、Koinを次のように開始できます。

```kotlin
// start a KoinApplication and register it in Global context
startKoin {

    // declare used modules
    modules(...)
}
```

これはデフォルトのKoinコンテキストを使用して依存関係を登録します。

しかし、隔離されたKoinインスタンスを使用したい場合は、インスタンスを宣言し、そのインスタンスを保持するためのクラスに格納する必要があります。Koinアプリケーションインスタンスをライブラリで利用可能にしておく必要があり、カスタムのKoinComponent実装に渡す必要があります。

`MyIsolatedKoinContext`クラスが、ここでKoinインスタンスを保持しています。

```kotlin
// Get a Context for your Koin instance
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // declare used modules
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

`MyIsolatedKoinContext`を使用して`IsolatedKoinComponent`クラス、つまり隔離されたコンテキストを使用するKoinComponentを定義してみましょう。

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // Override default Koin instance
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

準備は整いました。`IsolatedKoinComponent`を使用して、隔離されたコンテキストからインスタンスを取得するだけです。

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject & get will target MyKoinContext
}
```

## テスト

`by inject()`デリゲートで依存関係を取得するクラスをテストするには、`getKoin()`メソッドをオーバーライドし、カスタムのKoinモジュールを定義します。

```kotlin
class MyClassTest : KoinTest {
    // Koin Context used to retrieve dependencies
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // Define custom Koin module
        val module = module {
            // Register dependencies
        }

        koin.loadModules(listOf(module))
    }
}
```