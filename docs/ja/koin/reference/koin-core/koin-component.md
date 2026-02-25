---
title: Koinコンポーネント
---

Koinは、モジュールや定義を記述するためのDSLであり、定義の解決を行うコンテナです。次に必要となるのは、コンテナの外からインスタンスを取得するためのAPIです。それがKoinコンポーネントの目的です。

:::info
 `KoinComponent` インターフェースは、Koinから直接インスタンスを取得するのに役立ちます。ただし、これによってクラスがKoinコンテナのAPIに結合されることに注意してください。`modules` で宣言できるクラスでの使用は避け、コンストラクタインジェクションを優先してください。
:::

## Koinコンポーネントの作成

クラスでKoinの機能を使用できるようにするには、`KoinComponent` インターフェースで *タグ付け* する必要があります。例を見てみましょう。

MyServiceインスタンスを定義するモジュール：

```kotlin
class MyService

val myModule = module {
    // MyServiceのシングルトンを定義
    single { MyService() }
}
```

定義を使用する前に、Koinを開始します。

myModuleを使用してKoinを開始：

```kotlin
fun main(vararg args : String){
    // Koinの開始
    startKoin {
        modules(myModule)
    }

    // MyComponentインスタンスを作成し、Koinコンテナからインジェクトする
    MyComponent()
}
```

Koinコンテナからインスタンスを取得するための `MyComponent` の記述方法は以下の通りです。

get() と by inject() を使用して MyService インスタンスをインジェクトする：

```kotlin
class MyComponent : KoinComponent {

    // Koinインスタンスを遅延インジェクトする
    val myService : MyService by inject()

    // または
    // Koinインスタンスを即時インジェクトする
    val myService : MyService = get()
}
```

## KoinComponentsでKoin APIを解放する

クラスを `KoinComponent` としてタグ付けすると、以下にアクセスできるようになります。

* `by inject()` - Koinコンテナから遅延評価されるインスタンス
* `get()` - Koinコンテナから即時取得されるインスタンス
* `getProperty()`/`setProperty()` - プロパティの取得/設定

## getとinjectによる定義の取得

Koinでは、Koinコンテナからインスタンスを取得するための2つの方法を提供しています。

* `val t : T by inject()` - 遅延評価される委譲インスタンス
* `val t : T = get()` - インスタンスへの即時アクセス

```kotlin
// 遅延評価されます
val myService : MyService by inject()

// インスタンスを直接取得します
val myService : MyService = get()
```

:::note
 遅延評価が必要なプロパティを定義する場合は、lazy injectの形式が適しています。
:::

## 名前によるインスタンスの解決

必要に応じて、`get()` または `by inject()` で以下のパラメータを指定できます。

* `qualifier` - 定義の名前（定義でnameパラメータを指定した場合）

定義名を使用したモジュールの例：

```kotlin
val module = module {
    single(named("A")) { ComponentA() }
    single(named("B")) { ComponentB(get()) }
}

class ComponentA
class ComponentB(val componentA: ComponentA)
```

以下のように解決を行うことができます：

```kotlin
// 指定されたモジュールから取得
val a = get<ComponentA>(named("A"))