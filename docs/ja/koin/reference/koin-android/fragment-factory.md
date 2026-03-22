---
title: Fragment Factory
---

Koinは、Fragmentでのコンストラクタインジェクションを可能にするために、[AndroidX FragmentFactory](https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory) と統合されています。

:::info
Fragment FactoryはDSLのみを使用します。アノテーション（Annotation）およびコンパイラプラグイン（Compiler Plugin）のDSLサポートは、現在まだ利用できません。
:::

## セットアップ

### 依存関係の追加

```groovy
implementation "io.insert-koin:koin-android:$koin_version"
```

### Fragment Factory の構成

Koinの設定で、Fragment Factoryを有効にします。

```kotlin
startKoin {
    androidContext(this@MainApplication)
    fragmentFactory()
    modules(appModule)
}
```

## Fragment の宣言

コンストラクタインジェクションとともに `fragment` DSLキーワードを使用します。

```kotlin
class MyFragment(
    private val myService: MyService
) : Fragment()

val appModule = module {
    single { MyService() }
    fragment { MyFragment(get()) }
}
```

## Fragment の使用

### Activity でのセットアップ

`super.onCreate()` の**前に** `setupKoinFragmentFactory()` を呼び出します。

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // super.onCreate() の前に呼び出す必要があります
        setupKoinFragmentFactory()

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
```

### Fragment の追加

具象化（reified）された拡張関数を使用します。

```kotlin
supportFragmentManager.beginTransaction()
    .replace<MyFragment>(R.id.container)
    .commit()
```

引数（arguments）とタグを指定する場合：

```kotlin
supportFragmentManager.beginTransaction()
    .replace<MyFragment>(
        containerViewId = R.id.container,
        args = bundleOf("key" to "value"),
        tag = "my_fragment"
    )
    .commit()
```

## Fragment Factory とスコープ

Fragmentで Activity スコープの依存関係を使用する場合：

```kotlin
val appModule = module {
    scope<MyActivity> {
        scoped { ActivityService() }
        fragment { MyFragment(get()) }
    }
}
```

`setupKoinFragmentFactory()` にスコープを渡します。

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        // Fragment Factory にスコープを渡す
        setupKoinFragmentFactory(scope)

        super.onCreate(savedInstanceState)
    }
}
```

## クイックリファレンス

| アクション | コード |
|--------|------|
| Fragment の宣言 | `fragment { MyFragment(get()) }` |
| グローバルな Factory のセットアップ | `setupKoinFragmentFactory()` |
| スコープを使用したセットアップ | `setupKoinFragmentFactory(scope)` |
| Fragment の追加 | `.replace<MyFragment>(R.id.container)` |

## 次のステップ

- **[AndroidX Fragment](https://developer.android.com/guide/fragments)** - 公式 Fragment ドキュメント
- **[Scopes](/docs/reference/koin-android/scope)** - Android スコープ
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel インジェクション