---
title: 定義
---

Koinを使用すると、モジュール内で定義を記述します。このセクションでは、モジュールの宣言、整理、およびリンク方法について説明します。

## モジュールの記述

Koinモジュールは、*すべてのコンポーネントを宣言するためのスペース*です。Koinモジュールを宣言するには、`module`関数を使用します。

```kotlin
val myModule = module {
   // your dependencies here
}
```

このモジュール内で、以下に説明するようにコンポーネントを宣言できます。

## シングルトンの定義

シングルトンコンポーネントを宣言することは、Koinコンテナが宣言されたコンポーネントの*ユニークなインスタンス*を保持することを意味します。シングルトンを宣言するには、モジュール内で`single`関数を使用します。

```kotlin
class MyService()

val myModule = module {

    // declare single instance for MyService class
    single { MyService() }
}
```

## ラムダ内でのコンポーネントの定義

`single`、`factory`、`scoped`キーワードは、ラムダ式を介してコンポーネントを宣言するのに役立ちます。このラムダは、コンポーネントを構築する方法を記述します。通常、コンポーネントはコンストラクタを介してインスタンス化しますが、任意の式を使用することもできます。

`single { Class constructor // Kotlin expression }`

ラムダの結果型が、コンポーネントの主要な型となります。

## ファクトリの定義

ファクトリコンポーネント宣言は、この定義を要求するたびに*新しいインスタンス*を提供する定義です（このインスタンスはKoinコンテナによって保持されません。なぜなら、後で他の定義にこのインスタンスをインジェクトしないためです）。コンポーネントを構築するには、ラムダ式とともに`factory`関数を使用します。

```kotlin
class Controller()

val myModule = module {

    // declare factory instance for Controller class
    factory { Controller() }
}
```

:::info
 Koinコンテナはファクトリインスタンスを保持しません。定義が要求されるたびに新しいインスタンスを提供するからです。
:::

## 依存関係の解決と注入

コンポーネント定義を宣言できるようになったので、依存性注入によってインスタンスをリンクさせたいと思います。Koinモジュール内で*インスタンスを解決する*には、要求された必要なコンポーネントインスタンスに対して`get()`関数を使用するだけです。この`get()`関数は通常、コンストラクタ内で、コンストラクタの値をインジェクトするために使用されます。

:::info
 Koinコンテナで依存性注入を行うには、*コンストラクタインジェクション*スタイルで記述する必要があります。つまり、クラスのコンストラクタ内で依存関係を解決します。このようにして、インスタンスはKoinから注入されたインスタンスで作成されます。
:::

いくつかのクラスの例を見てみましょう。

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // declare Service as single instance
    single { Service() }
    // declare Controller as single instance, resolving View instance with get()
    single { Controller(get()) }
}
```

## 定義：インターフェースのバインディング

`single`または`factory`の定義は、指定されたラムダ定義から型を使用します。すなわち、`single { T }`のようにです。
定義の一致する型は、この式からの一致する唯一の型です。

クラスと実装されたインターフェースの例を見てみましょう。

```kotlin
// Service interface
interface Service{

    fun doSomething()
}

// Service Implementation
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

Koinモジュールでは、Kotlinの`as`キャスト演算子を次のように使用できます。

```kotlin
val myModule = module {

    // Will match type ServiceImp only
    single { ServiceImp() }

    // Will match type Service only
    single { ServiceImp() as Service }

}
```

推論された型式を使用することもできます。

```kotlin
val myModule = module {

    // Will match type ServiceImp only
    single { ServiceImp() }

    // Will match type Service only
    single<Service> { ServiceImp() }

}
```

:::note
 この2番目の宣言スタイルが推奨され、以降のドキュメントで採用されます。
:::

## 追加の型バインディング

場合によっては、1つの定義から複数の型を一致させたいことがあります。

クラスとインターフェースの例を見てみましょう。

```kotlin
// Service interface
interface Service{

    fun doSomething()
}

// Service Implementation
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

定義に追加の型をバインドするには、クラスとともに`bind`演算子を使用します。

```kotlin
val myModule = module {

    // Will match types ServiceImp & Service
    single { ServiceImp() } bind Service::class
}
```

ここで注目すべきは、`Service`型を`get()`で直接解決することです。しかし、複数の定義が`Service`をバインドしている場合、`bind<>()`関数を使用する必要があります。

## 定義：命名とデフォルトバインディング

同じ型に関する2つの定義を区別するために、定義に名前を指定できます。

その名前で定義を要求するだけです。

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()`関数と`by inject()`関数は、必要に応じて定義名を指定できます。この名前は、`named()`関数によって生成される`qualifier`です。

デフォルトでは、Koinは型がすでに定義にバインドされている場合、その型またはその名前によって定義をバインドします。

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

次に：

- `val service : Service by inject()` は `ServiceImpl1` 定義をトリガーします。
- `val service : Service by inject(named("test"))` は `ServiceImpl2` 定義をトリガーします。

## インジェクションパラメータの宣言

どの定義でも、インジェクションパラメータ（定義によって注入され使用されるパラメータ）を使用できます。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

解決された依存関係（`get()`で解決されるもの）とは対照的に、インジェクションパラメータは*解決APIを介して渡されるパラメータ*です。
これは、これらのパラメータが`get()`および`by inject()`とともに`parametersOf`関数を使って渡される値であることを意味します。

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

詳細については、[インジェクションパラメータのセクション](/docs/reference/koin-core/injection-parameters)を参照してください。

## 定義の終了 - OnClose

`onClose`関数を使用すると、定義のクローズが呼び出されたときに実行されるコールバックを定義に追加できます。

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // closing callback - it is Presenter }
}
```

## 定義フラグの使用

Koin DSLにはいくつかのフラグも用意されています。

### 起動時にインスタンスを作成する

定義またはモジュールは、起動時（または必要なとき）に作成されるよう、`CreatedAtStart`としてフラグ付けできます。まず、モジュールまたは定義に`createdAtStart`フラグを設定します。

定義に`CreatedAtStart`フラグを設定する

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // eager creation for this definition
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

モジュールに`CreatedAtStart`フラグを設定する：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin`関数は、`createdAtStart`でフラグ付けされた定義インスタンスを自動的に作成します。

```kotlin
// Start Koin modules
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
特定のタイミング（例えばUIスレッドではなくバックグラウンドスレッドなど）で定義をロードする必要がある場合は、目的のコンポーネントを`get`または`inject`するだけです。
:::

### ジェネリクスの扱い

Koinの定義はジェネリクス型引数を考慮しません。例えば、以下のモジュールは2つのList定義を試みています。

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koinは、このような定義では起動しません。これは、ある定義を別の定義で上書きしようとしていると解釈するためです。

2つの定義を使用するには、名前または場所（モジュール）によってそれらを区別する必要があります。例えば：

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}