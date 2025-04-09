---
title: "Fragment 工廠 (Fragment Factory)"
---
由於 AndroidX 已經發布了 `androidx.fragment` 封裝家族，以擴展 Android `Fragment` 周圍的功能

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment Factory (Fragment 工廠)

自 `2.1.0-alpha-3` 版本起，引入了 `FragmentFactory`（Fragment 工廠），這是一個專門用於創建 `Fragment` 類實例的類別：

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin 可以引入一個 `KoinFragmentFactory` 來幫助您直接注入 `Fragment` 實例。

## 設定 Fragment Factory (Fragment 工廠)

首先，在您的 KoinApplication 宣告中，使用 `fragmentFactory()` 關鍵字來設定預設的 `KoinFragmentFactory` 實例：

```kotlin
 startKoin {
    // setup a KoinFragmentFactory instance
    fragmentFactory()

    modules(...)
}
```

## 宣告 & 注入您的 Fragment (Fragment)

要宣告一個 `Fragment` 實例，只需在您的 Koin 模組中將其宣告為一個 `fragment`，並使用*建構函式注入 (constructor injection)*。

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

## 取得您的 Fragment (Fragment)

從您的宿主 `Activity` 類別中，使用 `setupKoinFragmentFactory()` 設定您的 fragment 工廠：

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

並使用您的 `supportFragmentManager` 檢索您的 `Fragment`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

使用重載的可選參數放入您的 `bundle` 或 `tag`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment Factory (Fragment 工廠) & Koin Scopes (Koin 作用域)

如果您想使用 Koin Activity 的 Scope (作用域)，您必須在您的 scope (作用域) 內將您的 fragment 宣告為 `scoped` 定義：

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

並使用您的 scope 設定您的 Koin Fragment Factory：`setupKoinFragmentFactory(lifecycleScope)`

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