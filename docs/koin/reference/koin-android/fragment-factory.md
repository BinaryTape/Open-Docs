---
title: "Fragment 工厂"
---
自从 AndroidX 发布了 `androidx.fragment` 包系列，以扩展 Android `Fragment` 周围的功能

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment Factory

从 `2.1.0-alpha-3` 版本开始，引入了 `FragmentFactory`，一个专门用于创建 `Fragment` 类实例的类：

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin 可以提供一个 `KoinFragmentFactory` 来帮助你直接注入 `Fragment` 实例。

## 设置 Fragment Factory

首先，在你的 KoinApplication 声明中，使用 `fragmentFactory()` 关键字来设置一个默认的 `KoinFragmentFactory` 实例：

```kotlin
 startKoin {
    // setup a KoinFragmentFactory instance
    fragmentFactory()

    modules(...)
}
```

## 声明 & 注入你的 Fragment

要声明一个 `Fragment` 实例，只需在你的 Koin 模块中将其声明为一个 `fragment`，并使用*构造函数注入*。

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

从你的宿主 `Activity` 类中，使用 `setupKoinFragmentFactory()` 设置你的 fragment 工厂：

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

然后使用你的 `supportFragmentManager` 检索你的 `Fragment`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

使用重载的可选参数放入你的 `bundle`（数据包）或 `tag`（标签）：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment Factory & Koin Scopes

如果你想使用 Koin Activity 的 Scope（作用域），你必须在你的作用域内将你的 fragment 声明为 `scoped` 定义：

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

并使用你的作用域设置你的 Koin Fragment Factory：`setupKoinFragmentFactory(lifecycleScope)`

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