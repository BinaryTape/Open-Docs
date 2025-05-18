---
title: "Constructor DSL"
---
Koinは、クラスのコンストラクタを直接ターゲットにできる新しい種類のDSLキーワードを提供するようになりました。これにより、ラムダ式内で定義を入力する必要がなくなります。

次の依存関係を持つ指定されたクラス`ClassA`の場合：

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

これらのコンポーネントを、`class constructor`を直接ターゲットにして宣言できるようになりました。

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

`get()`関数を使用してコンストラクタに依存関係を指定する必要はもうありません！🎉

:::info
クラスコンストラクタをターゲットにするには、クラス名の前に`::`を使用してください。
:::

:::note
コンストラクタは、すべての`get()`で自動的に入力されます。Koinは現在のグラフでそれを見つけようとするため、デフォルト値は使用しないでください。
:::

:::note
「名前付き」定義を取得する必要がある場合は、ラムダと`get()`を含む標準DSLを使用して、qualifier（修飾子）を指定する必要があります。
:::

## 利用可能なキーワード

次のキーワードは、コンストラクタから定義を構築するために使用できます。

* `factoryOf` - `factory { }`と同等 - ファクトリ定義
* `singleOf` - `single { }`と同等 - シングル定義
* `scopedOf` - `scoped { }`と同等 - スコープ定義

:::info
Koinはすべてのパラメータを埋めようとするため、コンストラクタでデフォルト値を使用しないようにしてください。
:::

## DSLオプション

コンストラクタDSL定義では、ラムダ内でいくつかのオプションを開くこともできます。

```kotlin
module {
    singleOf(::ClassA) { 
        // 定義オプション
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

このラムダでは、通常のオプションとDSLキーワードを使用できます。

* `named("a_qualifier")` - 定義にString qualifier（修飾子）を付与
* `named<MyType>()` - 定義にType qualifier（修飾子）を付与
* `bind<MyInterface>()` - 指定されたBean定義にバインドするタイプを追加
* `binds(listOf(...))` - 指定されたBean定義にバインドするタイプのリストを追加
* `createdAtStart()` - Koinの起動時に単一のインスタンスを作成

ラムダを必要とせずに、`bind`または`binds`演算子を使用することもできます。

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入されたパラメータ

このような宣言では、注入されたパラメータを依然として使用できます。Koinは、注入されたパラメータと現在の依存関係を調べて、コンストラクタを注入しようとします。

次のように：

```kotlin
class MyFactory(val id : String)
```

コンストラクタDSLで宣言されています：

```kotlin
module {
    factoryOf(::MyFactory)
}
```

これは、次のように注入できます。

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## リフレクションベースDSL（3.2以降非推奨）

:::caution
KoinリフレクションDSLは非推奨になりました。上記のKoinコンストラクタDSLを使用してください
:::