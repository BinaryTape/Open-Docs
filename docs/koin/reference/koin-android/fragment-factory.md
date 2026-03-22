---
title: Fragment Factory
---

Koin 与 [AndroidX FragmentFactory](https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory) 集成，以在 Fragment 中实现构造函数注入。

:::info
Fragment Factory 仅支持 DSL。目前尚不支持注解和编译器插件 DSL。
:::

## 设置

### 添加依赖项

```groovy
implementation "io.insert-koin:koin-android:$koin_version"
```

### 配置 Fragment Factory

在 Koin 配置中，启用 Fragment Factory：

```kotlin
startKoin {
    androidContext(this@MainApplication)
    fragmentFactory()
    modules(appModule)
}
```

## 声明 Fragment

使用 `fragment` DSL 关键字配合构造函数注入：

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

### 在 Activity 中设置

在 `super.onCreate()` **之前**调用 `setupKoinFragmentFactory()`：

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // 必须在 super.onCreate() 之前调用
        setupKoinFragmentFactory()

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
```

### 添加 Fragment

使用具体化扩展函数：

```kotlin
supportFragmentManager.beginTransaction()
    .replace<MyFragment>(R.id.container)
    .commit()
```

带有实参和标签：

```kotlin
supportFragmentManager.beginTransaction()
    .replace<MyFragment>(
        containerViewId = R.id.container,
        args = bundleOf("key" to "value"),
        tag = "my_fragment"
    )
    .commit()
```

## 带有作用域的 Fragment Factory

要在 Fragment 中使用 Activity 作用域的依赖项：

```kotlin
val appModule = module {
    scope<MyActivity> {
        scoped { ActivityService() }
        fragment { MyFragment(get()) }
    }
}
```

将作用域传递给 `setupKoinFragmentFactory()`：

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        // 将作用域传递给 Fragment Factory
        setupKoinFragmentFactory(scope)

        super.onCreate(savedInstanceState)
    }
}
```

## 快速参考

| 操作 | 代码 |
|--------|------|
| 声明 Fragment | `fragment { MyFragment(get()) }` |
| 设置全局工厂 | `setupKoinFragmentFactory()` |
| 设置作用域 | `setupKoinFragmentFactory(scope)` |
| 添加 Fragment | `.replace<MyFragment>(R.id.container)` |

## 下一步

- **[AndroidX Fragment](https://developer.android.com/guide/fragments)** - 官方 Fragment 文档
- **[作用域](/docs/reference/koin-android/scope)** - Android 作用域
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 注入