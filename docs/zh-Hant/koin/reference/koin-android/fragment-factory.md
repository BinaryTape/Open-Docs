---
title: Fragment 工廠
---

Koin 與 [AndroidX FragmentFactory](https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory) 整合，以在 Fragment 中啟用建構函式注入。

:::info
Fragment 工廠僅支援 DSL。目前尚不支援註解和編譯器外掛程式 DSL。
:::

## 設定

### 新增相依性

```groovy
implementation "io.insert-koin:koin-android:$koin_version"
```

### 設定 Fragment 工廠

在你的 Koin 配置中，啟用 Fragment 工廠：

```kotlin
startKoin {
    androidContext(this@MainApplication)
    fragmentFactory()
    modules(appModule)
}
```

## 宣告 Fragment

使用具備建構函式注入的 `fragment` DSL 關鍵字：

```kotlin
class MyFragment(
    private val myService: MyService
) : Fragment()

val appModule = module {
    single { MyService() }
    fragment { MyFragment(get()) }
}
```

## 使用 Fragment

### 在 Activity 中設定

在 `super.onCreate()` **之前**呼叫 `setupKoinFragmentFactory()`：

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // 必須在 super.onCreate() 之前呼叫
        setupKoinFragmentFactory()

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
```

### 新增 Fragment

使用具體化的擴充方法：

```kotlin
supportFragmentManager.beginTransaction()
    .replace<MyFragment>(R.id.container)
    .commit()
```

使用引數和標籤：

```kotlin
supportFragmentManager.beginTransaction()
    .replace<MyFragment>(
        containerViewId = R.id.container,
        args = bundleOf("key" to "value"),
        tag = "my_fragment"
    )
    .commit()
```

## 配合作用域使用 Fragment 工廠

要在你的 Fragment 中使用 Activity 作用域的相依性：

```kotlin
val appModule = module {
    scope<MyActivity> {
        scoped { ActivityService() }
        fragment { MyFragment(get()) }
    }
}
```

將作用域傳遞給 `setupKoinFragmentFactory()`：

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        // 將作用域傳遞給 Fragment 工廠
        setupKoinFragmentFactory(scope)

        super.onCreate(savedInstanceState)
    }
}
```

## 快速參考

| 操作 | 程式碼 |
|--------|------|
| 宣告 fragment | `fragment { MyFragment(get()) }` |
| 設定全域工廠 | `setupKoinFragmentFactory()` |
| 配合作用域設定 | `setupKoinFragmentFactory(scope)` |
| 新增 fragment | `.replace<MyFragment>(R.id.container)` |

## 後續步驟

- **[AndroidX Fragment](https://developer.android.com/guide/fragments)** - 官方 Fragment 文件
- **[作用域](/docs/reference/koin-android/scope)** - Android 作用域
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 注入