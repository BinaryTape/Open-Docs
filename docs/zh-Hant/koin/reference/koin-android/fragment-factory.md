---
title: Fragment Factory
---

由於 AndroidX 已發佈 `androidx.fragment` 套件系列，以擴展 Android `Fragment` 的相關功能。

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment Factory

自 `2.1.0-alpha-3` 版本以來，`FragmentFactory` 已被引入，它是一個專用於建立 `Fragment` 類別實例的類別：

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin 可以提供一個 `KoinFragmentFactory`，幫助您直接注入您的 `Fragment` 實例。

## 設定 Fragment Factory

在開始時，於您的 `KoinApplication` 宣告中，使用 `fragmentFactory()` 關鍵字來設定一個預設的 `KoinFragmentFactory` 實例：

```kotlin
 startKoin {
    // 設定一個 KoinFragmentFactory 實例
    fragmentFactory()

    modules(...)
}
```

## 宣告與注入您的 Fragment

要宣告一個 `Fragment` 實例，只需在您的 Koin 模組中將其宣告為 `fragment`，並使用 *建構函式注入*。

給定一個 `Fragment` 類別：

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

## 取得您的 Fragment

在您的宿主 `Activity` 類別中，使用 `setupKoinFragmentFactory()` 來設定您的 fragment factory：

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

並透過您的 `supportFragmentManager` 取得您的 `Fragment`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

使用重載的可選參數來傳遞您的 `bundle` 或 `tag`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment Factory 與 Koin 作用域

如果您想使用 Koin Activity 的作用域，您必須在您的作用域內將您的 fragment 宣告為 `scoped` 定義：

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

並使用您的作用域來設定 Koin Fragment Factory：`setupKoinFragmentFactory(lifecycleScope)`

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