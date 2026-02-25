---
title: Fragment Factory
---

AndroidXは、Android `Fragment` 関連の機能を拡張するために `androidx.fragment` パッケージ群をリリースしました。

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment Factory

`2.1.0-alpha-3` バージョン以降、`Fragment` クラスのインスタンス生成に特化したクラスである `FragmentFactory` が導入されました。

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koinは、`Fragment` インスタンスを直接インジェクト（注入）できるようにするための `KoinFragmentFactory` を提供しています。

## Fragment Factory のセットアップ

開始時に、`KoinApplication` の宣言内で `fragmentFactory()` キーワードを使用して、デフォルトの `KoinFragmentFactory` インスタンスをセットアップします。

```kotlin
 startKoin {
    // KoinFragmentFactory インスタンスをセットアップ
    fragmentFactory()

    modules(...)
}
```

## Fragment の宣言とインジェクト

`Fragment` インスタンスを宣言するには、Koinモジュール内で `fragment` として宣言し、*コンストラクタインジェクション*を使用します。

`Fragment` クラスの例：

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

ホストとなる `Activity` クラスから、`setupKoinFragmentFactory()` を使用して Fragment Factory をセットアップします。

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

オーバーロードされたオプションのパラメータを使用して、`bundle` や `tag` を指定することもできます。

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment Factory と Koin スコープ

Koin の Activity スコープを使用したい場合は、スコープ内でフラグメントを `scoped` 定義として宣言する必要があります。

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

そして、スコープを指定して Koin Fragment Factory をセットアップします： `setupKoinFragmentFactory(lifecycleScope)`

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // スコープを指定して Koin Fragment Factory をセットアップ
        setupKoinFragmentFactory(lifecycleScope)

        super.onCreate(savedInstanceState)
        //...
    }
}