---
title: "Composeアプリケーションでの分離されたコンテキスト（Isolated Context）"
---
Composeアプリケーションでは、[分離されたコンテキスト](/reference/koin-core/context-isolation.md)を使用することで、SDKやホワイトラベルアプリケーションを扱う際に、Koinの定義をエンドユーザーのものと混同させないように、同じように作業できます。

## 分離されたコンテキストを定義する

まず、分離されたKoinインスタンスをメモリに格納するために、分離されたコンテキストホルダーを宣言しましょう。これは、次のような単純なObjectクラスで実現できます。`MyIsolatedKoinContext`クラスは、Koinインスタンスを保持しています。

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // declare used modules
        modules(sdkAppModule)
    }
}
```

:::note
`MyIsolatedKoinContext`クラスは、初期化の必要に応じて調整してください。
:::

## Composeで分離されたコンテキストをセットアップする

分離されたKoinコンテキストを定義したので、Composeでそれを使用し、すべてのAPIをオーバーライドするようにセットアップできます。ルートCompose関数で`KoinIsolatedContext`を使用するだけです。これにより、Koinコンテキストがすべての子コンポーザブルに伝播されます。

```kotlin
@Composable
fun App() {
    // Set current Koin instance to Compose context
    KoinIsolatedContext(context = MyIsolatedKoinContext.koinApp) {

        MyScreen()
    }
}
```

:::info
すべてのKoin Compose APIは、`KoinIsolatedContext`の使用後、分離されたKoinコンテキストを使用します。
:::