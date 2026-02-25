---
title: Fragment 工廠
---

自從 AndroidX 發佈了 `androidx.fragment` 軟體包系列，以擴充 Android `Fragment` 相關的功能：

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment 工廠

自 `2.1.0-alpha-3` 版本起，引入了 `FragmentFactory`，這是一個專門用於建立 `Fragment` 類別執行個體的類別：

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin 提供 `KoinFragmentFactory` 來協助你直接注入你的 `Fragment` 執行個體。

## 設定 Fragment 工廠

在啟動時，於你的 `KoinApplication` 宣告中，使用 `fragmentFactory()` 關鍵字來設定預設的 `KoinFragmentFactory` 執行個體：

```kotlin
 startKoin {
    // 設定一個 KoinFragmentFactory 執行個體
    fragmentFactory()

    modules(...)
}
```

## 宣告與注入你的 Fragment

要宣告 `Fragment` 執行個體，只需在你的 Koin 模組中將其宣告為 `fragment`，並使用*建構函式注入*。

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

## 取得你的 Fragment

在你的主體 `Activity` 類別中，使用 `setupKoinFragmentFactory()` 來設定 Fragment 工廠：

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment 工廠
        setupKoinFragmentFactory()

        super.onCreate(savedInstanceState)
        //...
    }
}
```

並透過你的 `supportFragmentManager` 取得你的 `Fragment`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

使用多載的選用參數來加入你的 `bundle` 或 `tag`：

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment 工廠與 Koin 作用域

如果你想使用 Koin Activity 的作用域，你必須在你的作用域內將 fragment 宣告為 `scoped` 定義：

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

並使用你的作用域來設定 Koin Fragment 工廠：`setupKoinFragmentFactory(lifecycleScope)`

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment 工廠
        setupKoinFragmentFactory(lifecycleScope)

        super.onCreate(savedInstanceState)
        //...
    }
}