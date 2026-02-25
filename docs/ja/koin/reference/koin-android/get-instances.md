---
title: Androidでの注入
---

モジュールを宣言し、Koinを開始したら、AndroidのActivity、Fragment、またはServiceでどのようにインスタンスを取得すればよいでしょうか？

## Androidクラスでの準備

`Activity`、`Fragment`、`Service` はKoinComponents拡張によって拡張されています。すべての `ComponentCallbacks` クラスでKoinの拡張機能が利用可能です。

以下のKotlin拡張機能にアクセスできるようになります：

* `by inject()` - Koinコンテナからの遅延評価（lazy）によるインスタンス取得
* `get()` - Koinコンテナからの即時（eager）インスタンス取得

プロパティをLazy注入として宣言できます：

```kotlin
module {
    // Presenterの定義
    factory { Presenter() }
}
```

```kotlin
class DetailActivity : AppCompatActivity() {

    // PresenterをLazy注入
    override val presenter : Presenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        //...
    }
}
```

あるいは、直接インスタンスを取得することもできます：

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Presenterインスタンスの取得
    val presenter : Presenter = get()
}  
```

:::info
クラスに拡張機能がない場合は、そのクラスに `KoinComponent` インターフェースを実装するだけで、別のクラスからインスタンスを `inject()` または `get()` できるようになります。
:::

## 定義内でのAndroid Contextの使用

`Application` クラスでKoinを設定したら、`androidContext` 関数を使用してAndroidのContextを注入できます。これにより、後にモジュール内で必要になったときに解決できるようになります：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Android contextを注入
            androidContext(this@MainApplication)
            // ...
        }
        
    }
}
```

定義内では、`androidContext()` および `androidApplication()` 関数を使用することで、Koinモジュール内で `Context` インスタンスを取得できます。これにより、`Application` インスタンスを必要とする式を簡単に記述できます。

```kotlin
val appModule = module {

    // Androidの R.string.mystring リソースを注入してPresenterインスタンスを作成
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## AndroidのスコープとAndroid Contextの解決

`Context` 型をバインドしているスコープがある場合、異なるレベルから `Context` を解決する必要があるかもしれません。

次の設定を例に見てみましょう：

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

`MyPresenter` で正しい型を解決するには、以下を使用します：
- `get()` は最も近い `Context` 定義を解決します。ここではソーススコープである `MyActivity` になります。
- `androidContext()` も最も近い `Context` 定義を解決します。ここではソーススコープである `MyActivity` になります。
- `androidApplication()` は `Application` 定義を解決します。ここではKoinのセットアップで定義されたソーススコープの `context` オブジェクトになります。