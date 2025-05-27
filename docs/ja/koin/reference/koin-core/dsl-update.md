---
title: コンストラクタDSL
---

Koinは、クラスコンストラクタを直接指定でき、ラムダ式内で定義を記述する必要がなくなる新しい種類のDSLキーワードを提供します。

以下の依存関係を持つ`ClassA`クラスの場合：

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

これらのコンポーネントを、`クラスコンストラクタ`を直接指定して宣言できるようになりました：

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

`get()`関数を使ってコンストラクタで依存関係を指定する必要はもうありません！🎉

:::info
クラスコンストラクタを指定するには、クラス名の前に`::`を使用してください。
:::

:::note
コンストラクタはすべての`get()`で自動的に埋められます。Koinが現在のグラフからその値を見つけようとするため、デフォルト値の使用は避けてください。
:::

:::note
"名前付き"定義を取得する必要がある場合は、クオリファイアを指定するために、ラムダと`get()`を使用する標準DSLを使う必要があります。
:::

## 利用可能なキーワード

コンストラクタから定義を構築するために、以下のキーワードが利用できます：

*   `factoryOf` - `factory { }`と同等 - ファクトリ定義
*   `singleOf` - `single { }`と同等 - シングルトン定義
*   `scopedOf` - `scoped { }`と同等 - スコープ定義

:::info
Koinがその値ですべてのパラメータを埋めようとするため、コンストラクタでデフォルト値を使用しないようにしてください。
:::

## DSLオプション

どのコンストラクタDSL定義も、ラムダ内でいくつかのオプションを開くこともできます：

```kotlin
module {
    singleOf(::ClassA) { 
        // definition options
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

このラムダ内では、通常のオプションとDSLキーワードが利用できます：

*   `named("a_qualifier")` - 定義に文字列クオリファイアを与える
*   `named<MyType>()` - 定義に型クオリファイアを与える
*   `bind<MyInterface>()` - 指定されたBean定義にバインドする型を追加する
*   `binds(listOf(...))` - 指定されたBean定義に型リストを追加する
*   `createdAtStart()` - Koin起動時にシングルトンインスタンスを作成する

ラムダを必要とせずに、`bind`または`binds`演算子を使用することもできます：

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入されたパラメータ

このような宣言では、引き続き注入されたパラメータを使用できます。Koinは注入されたパラメータと現在の依存関係を調べて、コンストラクタを注入しようとします。

以下のようになります：

```kotlin
class MyFactory(val id : String)
```

コンストラクタDSLで宣言する場合：

```kotlin
module {
    factoryOf(::MyFactory)
}
```

このように注入できます：

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## リフレクションベースのDSL（3.2以降非推奨）

:::caution
KoinリフレクションDSLは現在非推奨です。上記のKoinコンストラクタDSLを使用してください。
:::