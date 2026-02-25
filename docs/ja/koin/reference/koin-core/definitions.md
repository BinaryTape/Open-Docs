---
title: 定義
---

Koinを使用することで、モジュール内に定義を記述します。このセクションでは、モジュールの宣言、整理、およびリンクの方法について説明します。

## モジュールの記述

Koinモジュールは、*すべてのコンポーネントを宣言するためのスペース*です。`module`関数を使用してKoinモジュールを宣言します。

```kotlin
val myModule = module {
   // ここに依存関係を記述します
}
```

このモジュール内では、以下で説明するようにコンポーネントを宣言できます。

## シングルトンの定義

シングルトンコンポーネントを宣言すると、Koinコンテナは宣言されたコンポーネントの*唯一のインスタンス*を保持します。モジュール内でシングルトンを宣言するには、`single`関数を使用します。

```kotlin
class MyService()

val myModule = module {

    // MyServiceクラスのシングルインスタンスを宣言
    single { MyService() }
}
```

## ラムダ内でのコンポーネント定義

`single`、`factory`、および`scoped`キーワードを使用すると、ラムダ式を通じてコンポーネントを宣言できます。このラムダは、コンポーネントの構築方法を記述します。通常はコンストラクタを介してコンポーネントをインスタンス化しますが、任意の式を使用することも可能です。

`single { クラスのコンストラクタ // Kotlinの式 }`

ラムダの結果の型が、そのコンポーネントのメインの型になります。

## ファクトリの定義

ファクトリコンポーネントの宣言は、その定義が要求されるたびに*新しいインスタンスを提供する*定義です（このインスタンスはKoinコンテナに保持されないため、後で他の定義にこのインスタンスが注入されることはありません）。コンポーネントを構築するには、ラムダ式とともに`factory`関数を使用します。

```kotlin
class Controller()

val myModule = module {

    // Controllerクラスのファクトリインスタンスを宣言
    factory { Controller() }
}
```

:::info
 Koinコンテナはファクトリインスタンスを保持しません。定義が要求されるたびに新しいインスタンスを提供するためです。
:::

## 依存関係の解決と注入

コンポーネントの定義を宣言できるようになったので、次は依存関係の注入（Dependency Injection）によってインスタンスをリンクさせます。Koinモジュール内で*インスタンスを解決*するには、`get()`関数を使用して必要なコンポーネントインスタンスをリクエストするだけです。この`get()`関数は通常、コンストラクタの値を注入するためにコンストラクタ内で使用されます。

:::info
 Koinコンテナで依存関係の注入を行うには、*コンストラクタ注入*のスタイルで記述する必要があります。つまり、クラスのコンストラクタで依存関係を解決します。これにより、インスタンスはKoinから注入されたインスタンスを使用して作成されます。
:::

複数のクラスを使用した例を見てみましょう：

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // Serviceをシングルインスタンスとして宣言
    single { Service() }
    // Controllerをシングルインスタンスとして宣言し、get()でViewインスタンスを解決
    single { Controller(get()) }
}
```

## 定義：インターフェースのバインド

`single`または`factory`の定義は、指定されたラムダ定義の型（例：`single { T }`）を使用します。
その定義に一致する型は、この式から得られる唯一の型となります。

クラスと実装されたインターフェースの例を見てみましょう：

```kotlin
// Serviceインターフェース
interface Service {

    fun doSomething()
}

// Serviceの実装
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

Koinモジュールでは、以下のようにKotlinの`as`キャスト演算子を使用できます。

```kotlin
val myModule = module {

    // ServiceImp型のみに一致
    single { ServiceImp() }

    // Service型のみに一致
    single { ServiceImp() as Service }

}
```

また、推論された型による表現も使用できます：

```kotlin
val myModule = module {

    // ServiceImp型のみに一致
    single { ServiceImp() }

    // Service型のみに一致
    single<Service> { ServiceImp() }

}
```

:::note
 この2番目の宣言スタイルが推奨されており、以降のドキュメントでも使用されます。
:::

## 追加の型バインド

1つの定義から複数の型を一致させたい場合があります。

クラスとインターフェースの例を見てみましょう：

```kotlin
// Serviceインターフェース
interface Service {

    fun doSomething()
}

// Serviceの実装
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

定義に追加の型をバインドさせるには、クラスに対して`bind`演算子を使用します。

```kotlin
val myModule = module {

    // ServiceImp型とService型の両方に一致
    single { ServiceImp() } bind Service::class
}
```

ここでは、`get()`を使用して直接`Service`型を解決できます。しかし、`Service`をバインドしている定義が複数ある場合は、`bind<>()`関数を使用する必要があります。

## 定義：命名とデフォルトのバインド

同じ型の2つの定義を区別するために、定義に名前を指定することができます。

名前を指定して定義をリクエストするだけです：

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()`および`by inject()`関数では、必要に応じて定義名を指定できます。この名前は、`named()`関数によって生成される`qualifier`です。

デフォルトでは、Koinは型によって定義をバインドしますが、その型が既に別の定義にバインドされている場合は名前によってバインドします。

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

この場合：

- `val service : Service by inject()` は `ServiceImpl1` の定義をトリガーします
- `val service : Service by inject(named("test"))` は `ServiceImpl2` の定義をトリガーします

## 注入パラメータの宣言

どの定義においても、注入パラメータ（定義によって注入され使用されるパラメータ）を使用できます。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

解決された依存関係（`get()`で解決されるもの）とは異なり、注入パラメータは*解決APIを通じて渡されるパラメータ*です。
これは、それらのパラメータが`get()`や`by inject()`において、`parametersOf`関数を使用して渡される値であることを意味します。

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

詳細は [注入パラメータのセクション](/docs/reference/koin-core/injection-parameters) を参照してください。

## 定義の終了 - OnClose

`onClose`関数を使用すると、定義にコールバックを追加し、定義のクローズが呼び出された際に実行させることができます。

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // クローズ時のコールバック - 対象はPresenter }
}
```

## 定義フラグの使用

Koin DSLでは、いくつかのフラグも提供されています。

### 開始時にインスタンスを作成する

定義またはモジュールに`CreatedAtStart`フラグを立てることで、開始時（または任意のタイミング）に作成されるように指定できます。まず、モジュールまたは定義に`createdAtStart`フラグを設定します。

定義におけるCreatedAtStartフラグ：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // この定義を先行作成（eager creation）する
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

モジュールにおけるCreatedAtStartフラグ：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin`関数は、`createdAtStart`フラグが立てられた定義のインスタンスを自動的に作成します。

```kotlin
// Koinモジュールを開始
startKoin {
    modules(myModuleA, myModuleB)
}
```

:::info
特定のタイミング（例えば、UIスレッドではなくバックグラウンドスレッドなど）で定義をロードする必要がある場合は、単に必要なコンポーネントをget/injectしてください。
:::

### ジェネリクスの扱い

Koinの定義では、ジェネリクスの型引数は考慮されません。例えば、以下のモジュールはListの2つの定義を行おうとしています：

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koinはこのような定義では起動しません。一方が他方をオーバーライドしようとしていると解釈するためです。

これら2つの定義を使用できるようにするには、名前または場所（モジュール）によってそれらを区別する必要があります。例：

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}