---
title: "定義 (Definitions)"
---
Koin を使用すると、モジュール内で定義を記述できます。このセクションでは、モジュールを宣言、構成、およびリンクする方法について説明します。

## モジュールの作成

Koin モジュールは、*すべてのコンポーネントを宣言するためのスペース*です。 `module` 関数を使用して Koin モジュールを宣言します。

```kotlin
val myModule = module {
   // ここに依存関係を記述します
}
```

このモジュールでは、以下に示すようにコンポーネントを宣言できます。

## シングルトンの定義

シングルトンコンポーネントを宣言するということは、Koin コンテナが宣言されたコンポーネントの *一意のインスタンス* を保持することを意味します。モジュールで `single` 関数を使用して、シングルトンを宣言します。

```kotlin
class MyService()

val myModule = module {

    // MyService クラスの単一インスタンスを宣言する
    single { MyService() }
}
```

## ラムダ内でのコンポーネントの定義

`single`、`factory`、および `scoped` キーワードは、ラムダ式を使用してコンポーネントを宣言するのに役立ちます。このラムダは、コンポーネントを構築する方法を記述します。通常、コンポーネントはコンストラクタを介してインスタンス化しますが、任意の式を使用することもできます。

`single { Class コンストラクタ // Kotlin の式 }`

ラムダの結果の型は、コンポーネントのメインの型です。

## ファクトリの定義

ファクトリコンポーネントの宣言は、この定義を要求するたびに *新しいインスタンスを提供する* 定義です (このインスタンスは Koin コンテナによって保持されません。後で他の定義でこのインスタンスをインジェクトしないため)。ラムダ式で `factory` 関数を使用して、コンポーネントを構築します。

```kotlin
class Controller()

val myModule = module {

    // Controller クラスのファクトリインスタンスを宣言する
    factory { Controller() }
}
```

:::info
Koin コンテナは、定義が要求されるたびに新しいインスタンスを提供するので、ファクトリインスタンスを保持しません。
:::

## 依存関係の解決とインジェクト

コンポーネント定義を宣言できるようになったので、インスタンスを依存性注入 (Dependency Injection) とリンクさせたいと思います。 Koin モジュールで *インスタンスを解決する* には、要求された必要なコンポーネントインスタンスに対して `get()` 関数を使用します。この `get()` 関数は通常、コンストラクタ値をインジェクトするためにコンストラクタで使用されます。

:::info
Koin コンテナを使用して依存性注入を行うには、*コンストラクタインジェクション* スタイルで記述する必要があります。つまり、クラスコンストラクタで依存関係を解決します。このようにして、インスタンスは Koin からインジェクトされたインスタンスとともに作成されます。
:::

いくつかのクラスの例を見てみましょう。

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // Service を単一のインスタンスとして宣言する
    single { Service() }
    // Controller を単一のインスタンスとして宣言し、get() で View インスタンスを解決する
    single { Controller(get()) }
}
```

## 定義: インターフェースのバインド

`single` または `factory` 定義は、与えられたラムダ定義からの型を使用します。例：`single { T }`。定義の一致する型は、この式からの一致する唯一の型です。

クラスと実装されたインターフェースの例を見てみましょう。

```kotlin
// Service インターフェース
interface Service{

    fun doSomething()
}

// Service 実装
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

Koin モジュールでは、次のように `as` キャスト Kotlin 演算子を使用できます。

```kotlin
val myModule = module {

    // ServiceImp 型のみに一致する
    single { ServiceImp() }

    // Service 型のみに一致する
    single { ServiceImp() as Service }

}
```

推論された型式を使用することもできます。

```kotlin
val myModule = module {

    // ServiceImp 型のみに一致する
    single { ServiceImp() }

    // Service 型のみに一致する
    single<Service> { ServiceImp() }

}
```

:::note
この2番目のスタイルの宣言が推奨され、ドキュメントの残りの部分で使用されます。
:::

## 追加の型バインド

場合によっては、1つの定義から複数の型を一致させたい場合があります。

クラスとインターフェースの例を見てみましょう。

```kotlin
// Service インターフェース
interface Service{

    fun doSomething()
}

// Service 実装
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

定義に追加の型をバインドするには、クラスで `bind` 演算子を使用します。

```kotlin
val myModule = module {

    // ServiceImp および Service 型に一致する
    single { ServiceImp() } bind Service::class
}
```

ここでは、`get()` で `Service` 型を直接解決することに注意してください。ただし、`Service` をバインドする複数の定義がある場合は、`bind<>()` 関数を使用する必要があります。

## 定義: 名前付きバインディングとデフォルトバインディング

同じ型に関する2つの定義を区別するために、定義に名前を指定できます。

名前で定義をリクエストするだけです。

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()` および `by inject()` 関数を使用すると、必要に応じて定義名を指定できます。この名前は、`named()` 関数によって生成された `qualifier` です。

デフォルトでは、Koin は型または名前で定義をバインドします (型がすでに定義にバインドされている場合)。

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

次に:

- `val service : Service by inject()` は `ServiceImpl1` 定義をトリガーします
- `val service : Service by inject(named("test"))` は `ServiceImpl2` 定義をトリガーします

## インジェクションパラメータの宣言

定義では、インジェクションパラメータを使用できます。これらは、定義によってインジェクトおよび使用されるパラメータです。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

解決された依存関係 (`get()` で解決) とは対照的に、インジェクションパラメータは *解決 API を介して渡されるパラメータ* です。
つまり、これらのパラメータは、`parametersOf` 関数を使用して、`get()` および `by inject()` で渡される値です。

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

詳細については、[インジェクションパラメータセクション](/reference/koin-core/injection-parameters.md) を参照してください。

## 定義の終了 - OnClose

`onClose` 関数を使用して、定義のクローズが呼び出されたときに、定義に追加するコールバックを追加できます。

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // closing callback - it is Presenter }
}
```

## 定義フラグの使用

Koin DSL は、いくつかのフラグも提案しています。

### 開始時にインスタンスを作成する

定義またはモジュールに `CreatedAtStart` のフラグを立てて、開始時 (または必要なとき) に作成することができます。最初に、モジュールまたは定義に `createdAtStart` フラグを設定します。

定義の CreatedAtStart フラグ

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // この定義をすぐに作成する
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

モジュールの CreatedAtStart フラグ：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 関数は、`createdAtStart` のフラグが立てられた定義インスタンスを自動的に作成します。

```kotlin
// Koin モジュールを起動する
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
特定の時間に定義をロードする必要がある場合 (たとえば、UI の代わりにバックグラウンドスレッドで)、必要なコンポーネントを取得/インジェクトするだけです。
:::

### ジェネリクスを扱う

Koin 定義は、ジェネリクスの型引数を考慮していません。たとえば、以下のモジュールは List の2つの定義を定義しようとしています。

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin は、一方の定義を他方の定義でオーバーライドしようとしていると理解して、このような定義では起動しません。

許可するには、2つの定義を名前または場所 (モジュール) で区別する必要があります。 例：

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}
```