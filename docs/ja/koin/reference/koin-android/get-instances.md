---
title: Androidでのインジェクション
---
モジュールを宣言し、Koin を起動したら、Android の Activity、Fragment、または Service でインスタンスを取得するにはどうすればよいでしょうか？

## Android クラスの準備

`Activity`、`Fragment`、および `Service` は、KoinComponents 拡張機能で拡張されています。`ComponentCallbacks` クラスは、Koin 拡張機能でアクセスできます。

Kotlin 拡張機能にアクセスできるようになります。

* `by inject()` - Koin コンテナから遅延評価されたインスタンス
* `get()` - Koin コンテナからインスタンスをすぐにフェッチ

プロパティを遅延注入として宣言できます。

```kotlin
module {
    // Presenter の定義
    factory { Presenter() }
}
```

```kotlin
class DetailActivity : AppCompatActivity() {

    // Presenter の遅延注入
    override val presenter : Presenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        //...
    }
}
```

または、インスタンスを直接取得することもできます。

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Presenter インスタンスの取得
    val presenter : Presenter = get()
}  
```

:::info
クラスに拡張機能がない場合は、`KoinComponent` インターフェイスを実装して、別のクラスからインスタンスを `inject()` または `get()` してください。
:::

## 定義で Android Context を使用する

`Application` クラスが Koin を構成したら、`androidContext` 関数を使用して Android Context を注入し、モジュールで必要なときに後で解決できるようにします。

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Android context の注入
            androidContext(this@MainApplication)
            // ...
        }
        
    }
}
```

定義では、`androidContext()` および `androidApplication()` 関数を使用すると、Koin モジュールで `Context` インスタンスを取得でき、`Application` インスタンスを必要とする式を簡単に記述できます。

```kotlin
val appModule = module {

    // Android からの R.string.mystring リソースの注入を使用して、Presenter インスタンスを作成します
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## Android Scope と Android Context の解決

`Context` 型をバインドするスコープがある場合、異なるレベルから `Context` を解決する必要がある場合があります。

構成を見てみましょう。

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

`MyPresenter` で適切な型を解決するには、以下を使用します。
- `get()` は最も近い `Context` 定義を解決します。ここでは、ソーススコープ `MyActivity` になります。
- `androidContext()` も最も近い `Context` 定義を解決します。ここでは、ソーススコープ `MyActivity` になります。
- `androidApplication()` も `Application` 定義を解決します。ここでは、Koin の設定で定義されたソーススコープ `context` オブジェクトになります。