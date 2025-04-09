---
title: "Koin DSL"
---
Kotlin言語の強力さのおかげで、Koinはアノテーションを付けたり、コードを生成したりする代わりに、アプリケーションを記述するのに役立つDSLを提供します。 Kotlin DSLにより、Koinは依存性注入を準備するためのスマートな関数型APIを提供します。

## Application & Module DSL

Koinは、Koinアプリケーションの要素を記述するためのいくつかのキーワードを提供します。

- Application DSL：Koinコンテナの構成を記述します
- Module DSL：注入する必要のあるコンポーネントを記述します

## Application DSL

`KoinApplication`インスタンスは、Koinコンテナインスタンスの構成です。 これにより、ロギング、プロパティのロード、およびモジュールを構成できます。

新しい`KoinApplication`を構築するには、次の関数を使用します。

* `koinApplication { }` - `KoinApplication`コンテナ構成を作成します
* `startKoin { }` - `KoinApplication`コンテナ構成を作成し、`GlobalContext`に登録して、GlobalContext APIの使用を許可します

`KoinApplication`インスタンスを構成するには、次のいずれかの関数を使用できます。

* `logger( )` - 使用するレベルとロガーの実装を記述します（デフォルトではEmptyLoggerを使用します）
* `modules( )` - コンテナにロードするKoinモジュールのリストを設定します（リストまたは可変長引数リスト）
* `properties()` - HashMapのプロパティをKoinコンテナにロードします
* `fileProperties( )` - 指定されたファイルからプロパティをKoinコンテナにロードします
* `environmentProperties( )` - OS環境からプロパティをKoinコンテナにロードします
* `createEagerInstances()` - eagerインスタンス（`createdAtStart`としてマークされたSingle定義）を作成します

## KoinApplicationインスタンス：グローバル vs ローカル

上記のように、Koinコンテナ構成は、`koinApplication`または`startKoin`関数の2つの方法で記述できます。

- `koinApplication`はKoinコンテナインスタンスを記述します
- `startKoin`はKoinコンテナインスタンスを記述し、Koin `GlobalContext`に登録します

コンテナ構成を`GlobalContext`に登録することにより、グローバルAPIはそれを直接使用できます。 `KoinComponent`は`Koin`インスタンスを参照します。 デフォルトでは、`GlobalContext`のインスタンスを使用します。

詳細については、カスタムKoinインスタンスに関する章を確認してください。

## Koinの開始

Koinの開始とは、`GlobalContext`で`KoinApplication`インスタンスを実行することを意味します。

モジュールを使用してKoinコンテナを開始するには、次のように`startKoin`関数を使用します。

```kotlin
// グローバルコンテキストでKoinApplicationを開始します
startKoin {
    // 使用するロガーを宣言します
    logger()
    // 使用するモジュールを宣言します
    modules(coffeeAppModule)
}
```

## Module DSL

Koinモジュールは、アプリケーション用に注入/結合する定義を収集します。 新しいモジュールを作成するには、次の関数を使用します。

* `module { // モジュールの内容 }` - Koinモジュールを作成します

モジュールでコンテンツを記述するには、次の関数を使用できます。

* `factory { //定義 }` - ファクトリBean定義を提供します
* `single { //定義  }` - シングルトンBean定義を提供します（`bean`としてもエイリアス化されます）
* `get()` - コンポーネントの依存関係を解決します（名前、スコープ、またはパラメータも使用できます）
* `bind()` - 指定されたBean定義にバインドする型を追加します
* `binds()` - 指定されたBean定義にバインドする型の配列を追加します
* `scope { // スコープグループ }` - `scoped`定義の論理グループを定義します
* `scoped { //定義 }`- スコープにのみ存在するBean定義を提供します

注：`named()`関数を使用すると、文字列、enum、または型で修飾子を指定できます。 これは、定義に名前を付けるために使用されます。

### モジュールの作成

Koinモジュールは、*すべてのコンポーネントを宣言するスペース*です。 `module`関数を使用して、Koinモジュールを宣言します。

```kotlin
val myModule = module {
   // ここに依存関係があります
}
```

このモジュールでは、以下に示すようにコンポーネントを宣言できます。

### withOptions - DSLオプション（3.2以降）

新しい[Constructor DSL](./dsl-update.md)定義と同様に、`withOptions`演算子を使用して、「通常の」定義に定義オプションを指定できます。

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

このオプションのラムダ内では、次のオプションを指定できます。

* `named("a_qualifier")` - 定義にString修飾子を付与します
* `named<MyType>()` - 定義にType修飾子を付与します
* `bind<MyInterface>()` - 指定されたBean定義にバインドする型を追加します
* `binds(arrayOf(...))` - 指定されたBean定義にバインドする型の配列を追加します
* `createdAtStart()` - Koinの起動時に単一のインスタンスを作成します