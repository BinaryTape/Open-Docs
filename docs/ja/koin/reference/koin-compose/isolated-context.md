---
title: Composeアプリケーションでの孤立したコンテキスト
---

Composeアプリケーションでは、SDKやホワイトラベルアプリケーションを扱う際に、ユーザーのKoin定義と混ざらないように、[孤立したコンテキスト](/docs/reference/koin-core/context-isolation.md)と同じように作業できます。

## 孤立したコンテキストの定義

まず、孤立したKoinインスタンスをメモリに保存するために、孤立したコンテキストホルダーを宣言しましょう。これは、このようなシンプルなObjectクラスで実現できます。`MyIsolatedKoinContext`クラスがKoinインスタンスを保持します：

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // 使用するモジュールを宣言
        modules(sdkAppModule)
    }
}
```

:::note
`MyIsolatedKoinContext`クラスは、初期化の必要性に合わせて調整してください。
:::

## Composeでの孤立したコンテキストのセットアップ

孤立したKoinコンテキストを定義したので、Composeでそれを使用し、すべてのAPIをオーバーライドするようにセットアップできます。ルートのCompose関数で`KoinIsolatedContext`を使用するだけです。これにより、Koinコンテキストがすべての子コンポーザブルに伝播されます。

```kotlin
@Composable
fun App() {
    // 現在のKoinインスタンスをComposeコンテキストに設定
    KoinIsolatedContext(context = MyIsolatedKoinContext.koinApp) {

        MyScreen()
    }
}
```

:::info
`KoinIsolatedContext`の使用後、すべてのKoin Compose APIがあなたのKoin孤立コンテキストを使用します。
:::