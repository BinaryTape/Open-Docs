---
title: Fragment Factory
---

由于 AndroidX 发布了 `androidx.fragment` 软件包系列，以扩展 Android `Fragment` 相关功能：

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment Factory

自 `2.1.0-alpha-3` 版本起，引入了 `FragmentFactory`，这是一个专门用于创建 `Fragment` 类实例的类：

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin 提供了 `KoinFragmentFactory` 来帮助您直接注入 `Fragment` 实例。

## 设置 Fragment Factory

在开始时，在您的 KoinApplication 声明中，使用 `fragmentFactory()` 关键字来设置默认的 `KoinFragmentFactory` 实例：

```kotlin
 startKoin {
    // 设置 KoinFragmentFactory 实例
    fragmentFactory()

    modules(...)
}
```

## 声明并注入您的 Fragment

要声明 `Fragment` 实例，只需在 Koin 模块中将其声明为 `fragment` 并使用*构造函数注入*。

给定一个 `Fragment` 类：

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

## 获取您的 Fragment

在宿主 `Activity` 类中，使用 `setupKoinFragmentFactory()` 设置您的 Fragment 工厂：

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

并使用您的 `supportFragmentManager` 检索 `Fragment`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

使用重载的可选参数传递您的 `bundle` 或 `tag`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment Factory 与 Koin 作用域

如果您想使用 Koin Activity 的作用域，您必须在作用域内将 Fragment 声明为 `scoped` 定义：

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

并使用您的作用域设置 Koin Fragment Factory：`setupKoinFragmentFactory(lifecycleScope)`

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment Factory
        setupKoinFragmentFactory(lifecycleScope)

        super.onCreate(savedInstanceState)
        //...
    }
}