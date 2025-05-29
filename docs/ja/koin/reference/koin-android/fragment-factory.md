---
title: Fragment Factory
---

AndroidX は、Android の `Fragment` 周りの機能を拡張するために `androidx.fragment` パッケージファミリーをリリースしました。

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment Factory

バージョン `2.1.0-alpha-3` 以降、`Fragment` クラスのインスタンスを作成するための専用クラスである `FragmentFactory` が導入されました。

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin は、`Fragment` インスタンスを直接インジェクトするのに役立つ `KoinFragmentFactory` を提供できます。

## Fragment Factory のセットアップ

開始時に、`KoinApplication` の宣言で `fragmentFactory()` キーワードを使用して、デフォルトの `KoinFragmentFactory` インスタンスをセットアップします。

```kotlin
 startKoin {
    // setup a KoinFragmentFactory instance
    fragmentFactory()

    modules(...)
}
```

## Fragment の宣言とインジェクト

`Fragment` インスタンスを宣言するには、Koin モジュール内で `fragment` として宣言し、*コンストラクタインジェクション*を使用します。

以下のような `Fragment` クラスの場合：

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

ホストとなる `Activity` クラスから、`setupKoinFragmentFactory()` を使用してフラグメントファクトリをセットアップします。

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

そして、`supportFragmentManager` を使用して `Fragment` を取得します。

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

オーバーロードされたオプションのパラメータを使用して、`bundle` または `tag` を渡します。

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment Factory と Koin スコープ

Koin の Activity スコープを使用したい場合は、Fragment をスコープ内に `scoped` 定義として宣言する必要があります。

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

そして、`setupKoinFragmentFactory(lifecycleScope)` のように、スコープを使用して Koin Fragment Factory をセットアップします。

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment Factory
        setupKoinFragmentFactory(lifecycleScope)

        super.onCreate(savedInstanceState)
        //...
    }
}