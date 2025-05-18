---
title: "Fragment Factory"
---
AndroidX が Android `Fragment` 周辺の機能を拡張するために `androidx.fragment` パッケージファミリーをリリースしました。

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment Factory

`2.1.0-alpha-3` バージョン以降、`FragmentFactory` が導入されました。これは `Fragment` クラスのインスタンスを作成することに特化したクラスです。

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin は、`Fragment` インスタンスを直接注入するのに役立つ `KoinFragmentFactory` を提供できます。

## Fragment Factory のセットアップ

最初に、KoinApplication の宣言で、`fragmentFactory()` キーワードを使用して、デフォルトの `KoinFragmentFactory` インスタンスをセットアップします。

```kotlin
 startKoin {
    // KoinFragmentFactory インスタンスをセットアップ
    fragmentFactory()

    modules(...)
}
```

## Fragment の宣言と注入

`Fragment` インスタンスを宣言するには、Koin モジュールで `fragment` として宣言し、*コンストラクタインジェクション (constructor injection)* を使用します。

`Fragment` クラスが与えられた場合:

```kotlin
class MyFragment(val myService: MyService) : Fragment() {

}
```

```kotlin
val appModule = module {
    single { MyService() }
    fragment { MyFragment(get()) }
}
```

## Fragment の取得

ホストの `Activity` クラスから、`setupKoinFragmentFactory()` で Fragment Factory をセットアップします。

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment Factory
        setupKoinFragmentFactory()

        super.onCreate(savedInstanceState)
        //...
    }
}
```

そして、`supportFragmentManager` で `Fragment` を取得します。

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

オーバーロードされたオプションのパラメータを使用して、`bundle` または `tag` を設定します。

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment Factory と Koin スコープ

Koin Activity のスコープを使用したい場合は、`scoped` 定義としてスコープ内でフラグメントを宣言する必要があります。

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

そして、Koin Fragment Factory をスコープでセットアップします: `setupKoinFragmentFactory(lifecycleScope)`

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment Factory
        setupKoinFragmentFactory(lifecycleScope)

        super.onCreate(savedInstanceState)
        //...
    }
}
```