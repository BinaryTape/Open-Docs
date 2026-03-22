---
title: Autowire DSL
---

Koinは、クラスのコンストラクタを直接ターゲットにし、依存関係を自動的に解決（Autowire）できるAutowire DSLを提供しています。

:::tip
**Koin Compiler Plugin**を使用している場合は、追加のコンパイル時の安全性を備えた同様の自動解決機能を提供する[Compiler Plugin DSL](/docs/setup/compiler-plugin)の使用を検討してください。
:::

## クラシック Autowire DSL

以下の依存関係を持つクラス `ClassA` がある場合：

```kotlin
class ClassA(val b: ClassB, val c: ClassC)
class ClassB()
class ClassC()
```

クラスコンストラクタをターゲットにしてコンポーネントを宣言します：

```kotlin
import org.koin.dsl.*

module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

`get()` 関数を使って依存関係を指定する必要はもうありません！

:::info
クラスコンストラクタをターゲットにするには、クラス名の前に `::` を使用してください。
:::

:::note
コンストラクタは、必要なすべての依存関係で自動的に埋められます。Koinはすべてのパラメータを解決しようとするため、デフォルト値の使用は避けてください。
:::

## Compiler Plugin DSL との比較

| クラシック Autowire | コンパイラプラグイン |
|------------------|-----------------|
| `singleOf(::ClassA)` | `single<ClassA>()` |
| `factoryOf(::ClassA)` | `factory<ClassA>()` |
| `scopedOf(::ClassA)` | `scoped<ClassA>()` |
| パッケージ: `org.koin.dsl` | パッケージ: `org.koin.plugin.module.dsl` |

Compiler Plugin DSLは、同様の自動解決機能を提供し、さらにコンパイル時の検証を可能にします。

## 利用可能なキーワード

コンストラクタから定義を構築するために、以下のAutowireキーワードが利用可能です：

* `factoryOf` - `factory { }` と同等 - factory 定義
* `singleOf` - `single { }` と同等 - single 定義
* `scopedOf` - `scoped { }` と同等 - scoped 定義

:::info
Koinはすべてのパラメータを依存関係で埋めようとするため、コンストラクタでデフォルト値を使用しないように注意してください。
:::

## DSL オプション

どのAutowire DSL定義でも、ラムダ内でオプションを設定できます：

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

Autowire DSLによる宣言でも、注入パラメータ（injected parameters）を引き続き使用できます。Koinは注入されたパラメータと現在の依存関係を調べて、コンストラクタへの注入を試みます。

以下のような例です：

```kotlin
class MyFactory(val id : String)
```

Autowire DSLでの宣言：

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
KoinリフレクションDSLは現在非推奨です。上記のKoin Autowire DSLを使用してください。
:::