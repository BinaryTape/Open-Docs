---
title: Composeアプリケーションでの隔離されたコンテキスト
---

Composeアプリケーションでは、SDKやホワイトラベルアプリケーションを扱うために、[隔離されたコンテキスト (isolated context)](/docs/reference/koin-core/context-isolation.md)を同様に使用できます。これにより、自身のKoin定義がエンドユーザーのものと混ざるのを防ぐことができます。

## 隔離されたコンテキストの定義

まず、隔離されたKoinインスタンスをメモリ内に保持するために、隔離されたコンテキストホルダーを宣言しましょう。これは、以下のようなシンプルな `object` クラスで行うことができます。`MyIsolatedKoinContext` クラスがKoinインスタンスを保持します：

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // 使用するモジュールを宣言
        modules(sdkAppModule)
    }
}
```

:::note
初期化のニーズに合わせて、`MyIsolatedKoinContext` クラスを調整してください。
:::

## Composeでの隔離されたコンテキストのセットアップ

隔離されたKoinコンテキストを定義したので、次はそれをComposeで利用し、すべてのAPIをオーバーライドするようにセットアップします。ルートとなるCompose関数で `KoinIsolatedContext` を使用するだけです。これにより、すべての下位コンポーザブル（child composables）にKoinコンテキストが伝播されます。

```kotlin
@Composable
fun App() {
    // 現在のKoinインスタンスをComposeコンテキストにセットする
    KoinIsolatedContext(context = MyIsolatedKoinContext.koinApp) {

        MyScreen()
    }
}
```

:::info
`KoinIsolatedContext` を使用した後は、すべてのKoin Compose APIは隔離されたKoinコンテキストを使用するようになります。
:::