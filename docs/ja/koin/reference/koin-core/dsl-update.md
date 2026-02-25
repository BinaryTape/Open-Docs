---
title: コンストラクタ DSL
---

Koinは現在、クラスのコンストラクタを直接ターゲットにできる新しい種類のDSLキーワードを提供しています。これにより、ラムダ式内で定義を記述する必要がなくなります。

以下の依存関係を持つクラス `ClassA` がある場合：

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

`クラスコンストラクタ` を直接ターゲットにして、これらのコンポーネントを宣言できるようになりました。

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

`get()` 関数を使ってコンストラクタで依存関係を指定する必要はもうありません！ 🎉

:::info
クラスコンストラクタをターゲットにするには、クラス名の前に `::` を必ず使用してください。
:::

:::note
コンストラクタは、すべての `get()` で自動的に埋められます。Koinは現在のグラフからそれを見つけようとするため、デフォルト値の使用は避けてください。
:::

:::note
「名前付き (named)」定義を取得する必要がある場合は、クオリファイアを指定するために、ラムダと `get()` を使用する標準のDSLを使用する必要があります。
:::

## 利用可能なキーワード

コンストラクタから定義を構築するために、以下のキーワードが利用可能です：

* `factoryOf` - `factory { }` と同等 - factory 定義
* `singleOf` - `single { }` と同等 - single 定義
* `scopedOf` - `scoped { }` と同等 - scoped 定義

:::info
Koinはすべてのパラメータを依存関係で埋めようとするため、コンストラクタでデフォルト値を使用しないように注意してください。
:::

## DSL オプション

どのコンストラクタDSL定義でも、ラムダ内でオプションを設定できます：

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

このラムダ内では、通常のオプションとDSLキーワードが利用可能です：

* `named("a_qualifier")` - 定義に文字列のクオリファイアを付与する
* `named<MyType>()` - 定義に型のクオリファイアを付与する
* `bind<MyInterface>()` - 指定されたBean定義にバインドする型を追加する
* `binds(listOf(...))` - 指定されたBean定義にバインドする型のリストを追加する
* `createdAtStart()` - Koinの開始時にシングルインスタンスを作成する

また、ラムダを使わずに `bind` または `binds` 演算子を使用することもできます。

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入パラメータ (Injected Parameters)

この種類の宣言でも、注入パラメータ（injected parameters）を引き続き使用できます。Koinは注入されたパラメータと現在の依存関係を調べて、コンストラクタへの注入を試みます。

以下のような例です：

```kotlin
class MyFactory(val id : String)
```

コンストラクタDSLでの宣言：

```kotlin
module {
    factoryOf(::MyFactory)
}
```

以下のように注入できます：

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## リフレクションベースのDSL（3.2以降非推奨）

:::caution
KoinリフレクションDSLは現在非推奨です。上記のKoinコンストラクタDSLを使用してください。
:::