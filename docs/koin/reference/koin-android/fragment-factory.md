---
title: Fragment 工厂
---

自 AndroidX 发布 `androidx.fragment` 系列包以来，它扩展了 Android `Fragment` 相关的功能。

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment 工厂

自 `2.1.0-alpha-3` 版本起，引入了 `FragmentFactory`，这是一个专门用于创建 `Fragment` 类实例的类：

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin 可以提供一个 `KoinFragmentFactory` 来帮助你直接注入 `Fragment` 实例。

## 设置 Fragment 工厂

首先，在你的 KoinApplication 声明中，使用 `fragmentFactory()` 关键字来设置一个默认的 `KoinFragmentFactory` 实例：

```kotlin
 startKoin {
    // setup a KoinFragmentFactory instance
    fragmentFactory()

    modules(...)
}
```

## 声明和注入你的 Fragment

要声明一个 `Fragment` 实例，只需将其在你的 Koin 模块中声明为 `fragment`，并使用**构造函数注入**。

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

## 获取你的 Fragment

在你的宿主 `Activity` 类中，通过 `setupKoinFragmentFactory()` 设置你的 Fragment 工厂：

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

并通过 `supportFragmentManager` 获取你的 `Fragment`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

使用重载的可选参数来放置你的 `bundle` 或 `tag`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment 工厂与 Koin 作用域

如果你想使用 Koin Activity 的作用域（Scope），你必须将你的 fragment 作为 `scoped` 定义声明在你的作用域内：

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

并通过你的作用域设置 Koin Fragment 工厂：`setupKoinFragmentFactory(lifecycleScope)`

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment Factory
        setupKoinFragmentFactory(lifecycleScope)

        super.onCreate(savedInstanceState)
        //...
    }
}