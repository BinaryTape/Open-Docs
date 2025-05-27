---
title: Koin DSL
---

Kotlin言語の力のおかげで、Koinはアノテーションを付けたりコードを生成したりする代わりに、アプリを記述するのに役立つDSLを提供します。そのKotlin DSLにより、Koinは依存性注入の準備を実現するためのスマートな関数型APIを提供します。

## アプリケーション & モジュールDSL

Koinは、Koinアプリケーションの要素を記述するためのいくつかのキーワードを提供します。

- アプリケーションDSL：Koinコンテナの設定を記述します
- モジュールDSL：注入する必要があるコンポーネントを記述します

## アプリケーションDSL

`KoinApplication` インスタンスは、Koinコンテナインスタンスの設定です。これにより、ロギング、プロパティのロード、モジュールを設定できます。

新しい `KoinApplication` を構築するには、以下の関数を使用します。

* `koinApplication { }` - `KoinApplication` コンテナ設定を作成します
* `startKoin { }` - `KoinApplication` コンテナ設定を作成し、`GlobalContext` に登録してGlobalContext APIの使用を可能にします

`KoinApplication` インスタンスを設定するには、以下のいずれかの関数を使用できます。

* `logger( )` - 使用するレベルとLogger実装を記述します（デフォルトでは`EmptyLogger`を使用）
* `modules( )` - コンテナにロードするKoinモジュールのリストを設定します（リストまたは可変長引数リスト）
* `properties()` - `HashMap` のプロパティをKoinコンテナにロードします
* `fileProperties( )` - 指定されたファイルからプロパティをKoinコンテナにロードします
* `environmentProperties( )` - OS環境からプロパティをKoinコンテナにロードします
* `createEagerInstances()` - eagerインスタンス（`createdAtStart`とマークされた`Single`定義）を作成します

## KoinApplicationインスタンス：グローバル vs ローカル

上記のように、Koinコンテナ設定は`koinApplication`または`startKoin`関数の2つの方法で記述できます。

- `koinApplication` はKoinコンテナインスタンスを記述します
- `startKoin` はKoinコンテナインスタンスを記述し、Koinの`GlobalContext`に登録します

コンテナ設定を`GlobalContext`に登録することで、グローバルAPIはそれを直接使用できます。任意の`KoinComponent`は`Koin`インスタンスを参照します。デフォルトでは、`GlobalContext`からのインスタンスを使用します。

詳細については、カスタムKoinインスタンスに関する章を参照してください。

## Koinの開始

Koinを開始するということは、`KoinApplication`インスタンスを`GlobalContext`で実行することを意味します。

モジュールを使用してKoinコンテナを開始するには、`startKoin`関数を次のように使用するだけです。

```kotlin
// KoinApplicationをグローバルコンテキストで開始
startKoin {
    // 使用するロガーを宣言
    logger()
    // 使用するモジュールを宣言
    modules(coffeeAppModule)
}
```

## モジュールDSL

Koinモジュールは、アプリケーションに注入/結合する定義を収集します。新しいモジュールを作成するには、以下の関数を使用するだけです。

* `module { // module content }` - Koinモジュールを作成します

モジュール内でコンテンツを記述するには、以下の関数を使用できます。

* `factory { //definition }` - ファクトリbean定義を提供します
* `single { //definition }` - シングルトンbean定義を提供します（`bean`としてもエイリアスされます）
* `get()` - コンポーネントの依存関係を解決します（名前、スコープ、またはパラメータも使用可能）
* `bind()` - 指定されたbean定義にバインドする型を追加します
* `binds()` - 指定されたbean定義に型の配列を追加します
* `scope { // scope group }` - `scoped`定義の論理グループを定義します
* `scoped { //definition }`- スコープ内でのみ存在するbean定義を提供します

注: `named()` 関数を使用すると、文字列、Enum、または型によって修飾子を付与できます。これは定義に名前を付けるために使用されます。

### モジュールの作成

Koinモジュールは、*すべてのコンポーネントを宣言する場所*です。`module`関数を使用してKoinモジュールを宣言します。

```kotlin
val myModule = module {
   // ここに依存関係を記述
}
```

このモジュールでは、以下に示すようにコンポーネントを宣言できます。

### withOptions - DSLオプション (バージョン3.2以降)

新しい[Constructor DSL](./dsl-update.md)定義と同様に、`withOptions`オペレーターを使用して「通常の」定義に定義オプションを指定できます。

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

このオプションラムダ内で、以下のオプションを指定できます。

* `named("a_qualifier")` - 定義に文字列修飾子を付与します
* `named<MyType>()` - 定義に型修飾子を付与します
* `bind<MyInterface>()` - 指定されたbean定義にバインドする型を追加します
* `binds(arrayOf(...))` - 指定されたbean定義に型の配列を追加します
* `createdAtStart()` - Koin開始時にシングルインスタンスを作成します