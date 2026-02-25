---
title: Koin DSL
---

Kotlin言語の強力な機能のおかげで、Koinはアノテーションやコード生成を使用する代わりに、アプリの構成を記述するためのDSLを提供します。Koinは、そのKotlin DSLを通じて、依存性注入（Dependency Injection）の準備を整えるためのスマートで関数的なAPIを提供しています。

## Application & Module DSL

Koinは、Koinアプリケーションの要素を記述するためのいくつかのキーワードを提供しています。

- Application DSL: Koinコンテナの設定を記述します。
- Module DSL: 注入されるコンポーネントを記述します。

## Application DSL

`KoinApplication` インスタンスは、Koinコンテナのインスタンス設定です。これにより、ロギング、プロパティのロード、およびモジュールの設定が可能になります。

新しい `KoinApplication` を構築するには、以下の関数を使用します：

* `koinApplication { }` - `KoinApplication` コンテナ設定を作成します。
* `startKoin { }` - `KoinApplication` コンテナ設定を作成し、GlobalContext APIを使用できるように `GlobalContext` に登録します。

`KoinApplication` インスタンスを設定するには、以下のいずれかの関数を使用できます：

* `logger( )` - 使用するログレベルと Logger 実装を記述します（デフォルトでは EmptyLogger が使用されます）。
* `modules( )` - コンテナにロードする Koin モジュールのリスト（list または vararg list）を設定します。
* `properties()` - HashMap プロパティを Koin コンテナにロードします。
* `fileProperties( )` - 指定されたファイルからプロパティを Koin コンテナにロードします。
* `environmentProperties( )` - OS の環境変数からプロパティを Koin コンテナにロードします。
* `createEagerInstances()` - Eager インスタンス（`createdAtStart` とマークされた Single 定義）を作成します。

## KoinApplication インスタンス: グローバル vs ローカル

上記のように、Koinコンテナの設定を記述するには `koinApplication` または `startKoin` 関数の2つの方法があります。

- `koinApplication` は Koin コンテナインスタンスを記述します。
- `startKoin` は Koin コンテナインスタンスを記述し、Koin の `GlobalContext` に登録します。

コンテナ設定を `GlobalContext` に登録することで、グローバル API から直接利用できるようになります。すべての `KoinComponent` は `Koin` インスタンスを参照します。デフォルトでは、`GlobalContext` のインスタンスが使用されます。

詳細については、「Custom Koin instance」の章を確認してください。

## Koin の開始

Koin を開始するということは、`GlobalContext` 内で `KoinApplication` インスタンスを実行することを意味します。

モジュールを使用して Koin コンテナを開始するには、次のように `startKoin` 関数を使用します：

```kotlin
// Global context で KoinApplication を開始する
startKoin {
    // 使用するロガーを宣言
    logger()
    // 使用するモジュールを宣言
    modules(coffeeAppModule)
}
```

## Module DSL

Koin モジュールは、アプリケーションで注入または組み合わせる定義を集めたものです。新しいモジュールを作成するには、以下の関数を使用します：

* `module { // module content }` - Koin モジュールを作成します。

モジュール内のコンテンツを記述するには、以下の関数を使用できます：

* `factory { //definition }` - factory ビーン定義を提供します。
* `single { //definition  }` - シングルトン（singleton）ビーン定義を提供します（`bean` というエイリアスもあります）。
* `get()` - コンポーネントの依存関係を解決します（名前、スコープ、またはパラメータも使用可能です）。
* `bind()` - 指定されたビーン定義にバインドする型を追加します。
* `binds()` - 指定されたビーン定義にバインドする型の配列を追加します。
* `scope { // scope group }` - `scoped` 定義のための論理的なグループを定義します。
* `scoped { //definition }` - 特定のスコープ内でのみ存在するビーン定義を提供します。

注意：`named()` 関数を使用すると、文字列、列挙型（enum）、または型によって限定子（qualifier）を指定できます。これは定義に名前を付けるために使用されます。

### モジュールの作成

Koin モジュールは、*すべてのコンポーネントを宣言する場所*です。Koin モジュールを宣言するには `module` 関数を使用します：

```kotlin
val myModule = module {
   // ここに依存関係を記述します
}
```

このモジュール内では、以下のようにコンポーネントを宣言できます。

### withOptions - DSL オプション (3.2以降)

新しい [Constructor DSL](./dsl-update.md) 定義と同様に、`withOptions` オペレータを使用して「通常の」定義にオプションを指定できます：

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

このオプションのラムダ内では、以下のオプションを指定できます：

* `named("a_qualifier")` - 定義に文字列の限定子を付与します。
* `named<MyType>()` - 定義に型の限定子を付与します。
* `bind<MyInterface>()` - 指定されたビーン定義にバインドする型を追加します。
* `binds(arrayOf(...))` - 指定されたビーン定義にバインドする型の配列を追加します。
* `createdAtStart()` - Koin の開始時にシングルインスタンスを作成します。