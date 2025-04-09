---
title: "Koin Component"
---
Koinは、モジュールと定義を記述するためのDSLであり、定義の解決を行うためのコンテナです。ここで必要なのは、コンテナの外部でインスタンスを取得するためのAPIです。それがKoinコンポーネントの目的です。

:::info
 `KoinComponent`インターフェースは、Koinから直接インスタンスを取得するのに役立ちます。ただし、これはクラスをKoinコンテナAPIにリンクすることに注意してください。`modules`で宣言できるクラスで使用することは避け、コンストラクタインジェクションを優先してください。
:::

## Koinコンポーネントの作成

クラスにKoin機能を使用する機能を与えるには、`KoinComponent`インターフェースで*タグ付け*する必要があります。例を見てみましょう。

MyServiceインスタンスを定義するモジュール
```kotlin
class MyService

val myModule = module {
    // MyServiceのシングルトンを定義します
    single { MyService() }
}
```

定義を使用する前にKoinを起動します。

myModuleでKoinを起動します

```kotlin
fun main(vararg args : String){
    // Koinを起動します
    startKoin {
        modules(myModule)
    }

    // MyComponentインスタンスを作成し、Koinコンテナから注入します
    MyComponent()
}
```

Koinコンテナからインスタンスを取得するために、`MyComponent`を記述する方法を次に示します。

get()とby inject()を使用してMyServiceインスタンスを注入します

```kotlin
class MyComponent : KoinComponent {

    // Koinインスタンスを遅延注入(lazy inject)します
    val myService : MyService by inject()

    // または
    // Koinインスタンスを即時注入(eager inject)します
    val myService : MyService = get()
}
```

## KoinComponentsでKoin APIをアンロックする

クラスに`KoinComponent`としてタグ付けすると、以下にアクセスできるようになります。

* `by inject()` - Koinコンテナからの遅延評価(lazy evaluated)インスタンス
* `get()` - Koinコンテナからの即時取得(eager fetch)インスタンス
* `getProperty()`/`setProperty()` - プロパティの取得/設定

## getとinjectを使用した定義の取得

Koinは、Koinコンテナからインスタンスを取得する2つの方法を提供します。

* `val t : T by inject()` - 遅延評価された委譲インスタンス(lazy evaluated delegated instance)
* `val t : T = get()` - インスタンスへの即時アクセス(eager access)

```kotlin
// 遅延評価されます
val myService : MyService by inject()

// インスタンスを直接取得します
val myService : MyService = get()
```

:::note
 遅延注入(lazy inject)形式は、遅延評価が必要なプロパティを定義するのに適しています。
:::

## 名前によるインスタンスの解決

必要に応じて、`get()`または`by inject()`で次のパラメータを指定できます。

* `qualifier` - 定義の名前（定義でnameパラメータを指定した場合）

定義名を使用するモジュールの例：

```kotlin
val module = module {
    single(named("A")) { ComponentA() }
    single(named("B")) { ComponentB(get()) }
}

class ComponentA
class ComponentB(val componentA: ComponentA)
```

次の解決を行うことができます。

```kotlin
// 指定されたモジュールから取得します
val a = get<ComponentA>(named("A"))
```