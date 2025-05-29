---
title: Androidにおけるインジェクション
---

モジュールを宣言し、Koinを開始したら、AndroidのActivity、Fragment、またはServiceでインスタンスを取得するにはどうすればよいでしょうか？

## Androidクラスへの対応

`Activity`、`Fragment`、`Service`はKoinComponents拡張機能で拡張されています。任意の`ComponentCallbacks`クラスはKoin拡張機能にアクセスできます。

以下のKotlin拡張機能にアクセスできます：

*   `by inject()` - Koinコンテナから遅延評価されるインスタンス
*   `get()` - Koinコンテナから即座に取得されるインスタンス

プロパティを遅延インジェクションとして宣言できます：

```kotlin
module {
    // definition of Presenter
    factory { Presenter() }
}
```

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject Presenter
    override val presenter : Presenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        //...
    }
}
```

または、インスタンスを直接取得することもできます：

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Retrieve a Presenter instance
    val presenter : Presenter = get()
}  
```

:::info
クラスに拡張機能がない場合は、`KoinComponent`インターフェースを実装するだけで、他のクラスからインスタンスを`inject()`または`get()`できます。
:::

## 定義におけるAndroid Contextの使用

`Application`クラスがKoinを設定すると、`androidContext`関数を使用してAndroid Contextをインジェクションできます。これにより、モジュールで必要になったときに後で解決できるようになります。

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // inject Android context
            androidContext(this@MainApplication)
            // ...
        }
        
    }
}
```

あなたの定義において、`androidContext()`関数と`androidApplication()`関数は、Koinモジュール内で`Context`インスタンスを取得することを可能にし、`Application`インスタンスを必要とする式を簡単に記述するのに役立ちます。

```kotlin
val appModule = module {

    // create a Presenter instance with injection of R.string.mystring resources from Android
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## AndroidスコープとAndroid Contextの解決

`Context`型をバインドするスコープがある場合でも、異なるレベルから`Context`を解決する必要があるかもしれません。

以下の設定を見てみましょう：

```kotlin
class MyPresenter(val context : Context)

startKoin {
  androidContext(context)
  modules(
    module {
      scope<MyActivity> {
        scoped { MyPresenter( <get() ???> ) }
      }
    }
  )
}
```

`MyPresenter`で適切な型を解決するには、以下を使用します：
- `get()`は最も近い`Context`の定義を解決します。ここではソーススコープの`MyActivity`になります。
- `androidContext()`も最も近い`Context`の定義を解決します。ここではソーススコープの`MyActivity`になります。
- `androidApplication()`も`Application`の定義を解決します。ここではKoinのセットアップで定義されたソーススコープの`context`オブジェクトになります。