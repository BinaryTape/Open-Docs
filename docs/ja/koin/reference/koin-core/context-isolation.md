---
title: コンテキストの分離
---

## コンテキストの分離とは？

SDK開発者の場合、Koinを非グローバルな方法で使用することもできます。ライブラリのDIにKoinを使用しつつ、ライブラリの利用者もKoinを使用している場合に発生する可能性のある競合を、コンテキストを分離することで回避できます。

標準的な方法では、次のようにKoinを開始できます：

```kotlin
// KoinApplicationを起動し、グローバルコンテキストに登録する
startKoin {

    // 使用するモジュールを宣言する
    modules(...)
}
```

これは、デフォルトのKoinコンテキストを使用して依存関係を登録します。

しかし、分離されたKoinインスタンスを使用したい場合は、インスタンスを宣言し、そのインスタンスを保持するためのクラスに保存する必要があります。
ライブラリ内でKoin Applicationインスタンスを保持し続け、それをカスタムの `KoinComponent` 実装に渡す必要があります。

以下の `MyIsolatedKoinContext` クラスは、Koinインスタンスを保持しています：

```kotlin
// Koinインスタンスのコンテキストを取得する
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // 使用するモジュールを宣言する
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

次に、 `MyIsolatedKoinContext` を使用して、分離されたコンテキストを使用する `KoinComponent` である `IsolatedKoinComponent` インターフェースを定義しましょう：

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // デフォルトのKoinインスタンスをオーバーライドする
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

これで準備が整いました。あとは `IsolatedKoinComponent` を使用して、分離されたコンテキストからインスタンスを取得するだけです：

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject と get は MyIsolatedKoinContext を対象にします
}
```

## テスト

`by inject()` デリゲートを使用して依存関係を取得しているクラスをテストするには、 `getKoin()` メソッドをオーバーライドし、カスタムのKoinモジュールを定義します：

```kotlin
class MyClassTest : KoinTest {
    // 依存関係を取得するために使用されるKoinコンテキスト
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // カスタムのKoinモジュールを定義する
        val module = module {
            // 依存関係を登録する
        }

        koin.loadModules(listOf(module))
    }
}