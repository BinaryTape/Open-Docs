---
title: Koinコンポーネント
---

Koinは、モジュールと定義を記述するのに役立つDSLであり、定義の解決を行うコンテナです。私たちが今必要としているのは、コンテナの外からインスタンスを取得するためのAPIです。それがKoinコンポーネントの目的です。

:::info
`KoinComponent`インターフェースは、Koinから直接インスタンスを取得するのに役立ちます。注意すべきは、これによりクラスがKoinコンテナAPIにリンクされることです。`modules`で宣言できるクラスでの使用は避け、コンストラクタインジェクションを優先してください。
:::

## Koinコンポーネントの作成

クラスにKoin機能を使用する能力を与えるには、`KoinComponent`インターフェースで「タグ付け」する必要があります。例を見てみましょう。

MyServiceインスタンスを定義するモジュール

```kotlin
class MyService

val myModule = module {
    // Define a singleton for MyService
    single { MyService() }
}
```

定義を使用する前にKoinを起動します。

myModuleでKoinを起動

```kotlin
fun main(vararg args : String){
    // Start Koin
    startKoin {
        modules(myModule)
    }

    // Create MyComponent instance and inject from Koin container
    MyComponent()
}
```

Koinコンテナからインスタンスを取得するために`MyComponent`を記述する方法は次のとおりです。

get()とby inject()を使用してMyServiceインスタンスをインジェクトする

```kotlin
class MyComponent : KoinComponent {

    // lazy inject Koin instance
    val myService : MyService by inject()

    // or
    // eager inject Koin instance
    val myService : MyService = get()
}
```

## KoinComponentsでKoin APIをアンロックする

クラスを`KoinComponent`としてタグ付けすると、次のものにアクセスできるようになります。

*   `by inject()` - Koinコンテナからの遅延評価されたインスタンス
*   `get()` - Koinコンテナからの即時取得インスタンス
*   `getProperty()`/`setProperty()` - プロパティの取得/設定

## getとinjectによる定義の取得

Koinは、Koinコンテナからインスタンスを取得する2つの方法を提供します。

*   `val t : T by inject()` - 遅延評価された委譲インスタンス
*   `val t : T = get()` - インスタンスへの即時アクセス

```kotlin
// is lazy evaluated
val myService : MyService by inject()

// retrieve directly the instance
val myService : MyService = get()
```

:::note
遅延インジェクト形式は、遅延評価が必要なプロパティを定義するのに優れています。
:::

## 名前によるインスタンスの解決

必要に応じて、`get()`または`by inject()`で以下のパラメータを指定できます。

*   `qualifier` - 定義の名前（定義で名前パラメータが指定されている場合）

定義名を使用するモジュールの例:

```kotlin
val module = module {
    single(named("A")) { ComponentA() }
    single(named("B")) { ComponentB(get()) }
}

class ComponentA
class ComponentB(val componentA: ComponentA)
```

次の解決を行うことができます:

```kotlin
// retrieve from given module
val a = get<ComponentA>(named("A"))
```