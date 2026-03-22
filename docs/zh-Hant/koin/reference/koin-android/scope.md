---
title: Android 作用域
---

本指南涵蓋 Android 特有的作用域實作。

:::info
如需核心作用域概念，請參閱 [作用域](/docs/reference/koin-core/scopes)。
:::

## 總覽

Koin 中的作用域讓您可以管理相依性的生命週期，以符合 Android 組件的生命週期。這能防止記憶體洩漏並確保正確的資源管理。

### 作用域階層結構

| 作用域型別 | 存續時間 | 旋轉後存續 | DSL | 註解 |
|------------|----------|-------------------|-----|------------|
| **Application** | 整個應用程式 | ✅ 是 | `single { }` | `@Singleton` |
| **Activity** | Activity 生命週期 | ❌ 否 | `activityScope { }` | `@ActivityScope` |
| **Activity Retained** | 直到 finish() | ✅ 是 | `activityRetainedScope { }` | `@ActivityRetainedScope` |
| **Fragment** | Fragment 生命週期 | ❌ 否 | `fragmentScope { }` | `@FragmentScope` |
| **ViewModel** | ViewModel 生命週期 | ✅ 是 | `viewModelScope { }` | `@ViewModelScope` |

### 作用域關係

```
Application Scope (single { })
    └── Activity Retained Scope (旋轉後存續)
            └── Activity Scope
                    ├── Fragment Scope 1
                    └── Fragment Scope 2
            └── ViewModel Scope (無法存取 Activity/Fragment 作用域)
```

:::info
**核心原則：** 子作用域可以存取父作用域的定義，但反之亦然。
:::

## 宣告限定作用域的相依性

### 編譯器外掛程式 DSL

```kotlin
val appModule = module {
    // Activity 作用域
    activityScope {
        scoped<ActivityPresenter>()
        scoped<ActivityNavigator>()
    }

    // Fragment 作用域
    fragmentScope {
        scoped<FragmentPresenter>()
    }

    // ViewModel 作用域
    viewModelScope {
        scoped<UserCache>()
        viewModel<UserViewModel>()
    }
}
```

### 註解

```kotlin
// Activity 作用域
@ActivityScope
class ActivityPresenter(private val repository: UserRepository)

@ActivityScope
class ActivityNavigator

// Activity 保留作用域（旋轉後存續）
@ActivityRetainedScope
class RetainedPresenter

// Fragment 作用域
@FragmentScope
class FragmentPresenter

// ViewModel 作用域
@ViewModelScope
class UserCache

@KoinViewModel
@ViewModelScope
class UserViewModel(private val cache: UserCache) : ViewModel()
```

### 經典 DSL

```kotlin
val appModule = module {
    activityScope {
        scoped { ActivityPresenter(get()) }
        scoped { ActivityNavigator() }
    }

    fragmentScope {
        scoped { FragmentPresenter(get()) }
    }

    viewModelScope {
        scoped { UserCache() }
        viewModel { UserViewModel(get()) }
    }
}
```

## 在 Android 組件中使用作用域

### Activity 作用域

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    // 建立繫結至 Activity 生命週期的作用域
    override val scope: Scope by activityScope()

    // 從作用域注入
    private val presenter: ActivityPresenter by inject()
}
```

或使用便利的基底類別：

```kotlin
class MyActivity : ScopeActivity() {

    // 作用域已設定完成
    private val presenter: ActivityPresenter by inject()
}
```

### Activity Retained 作用域

在組態變更（旋轉、佈景主題變更）後存續：

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    // 由 ViewModel 生命週期支援 - 旋轉後存續
    override val scope: Scope by activityRetainedScope()

    private val presenter: RetainedPresenter by inject()
}
```

或使用便利的基底類別：

```kotlin
class MyActivity : RetainedScopeActivity() {

    private val presenter: RetainedPresenter by inject()
}
```

### Fragment 作用域

Fragment 作用域會自動連結到父級 Activity 作用域：

```kotlin
class MyFragment : Fragment(), AndroidScopeComponent {

    override val scope: Scope by fragmentScope()

    // 來自 Fragment 作用域
    private val presenter: FragmentPresenter by inject()

    // 也可以存取 Activity 作用域的相依性
    private val activityPresenter: ActivityPresenter by inject()
}
```

或使用便利的基底類別：

```kotlin
class MyFragment : ScopeFragment() {

    private val presenter: FragmentPresenter by inject()
}
```

## 基於型別 vs 原型作用域

### 原型作用域 (建議使用)

適用於任何 Activity/Fragment 的泛型作用域：

```kotlin
module {
    activityScope {
        scoped<MyPresenter>()
    }
}

// 適用於任何 Activity
class ActivityA : ScopeActivity() {
    private val presenter: MyPresenter by inject()
}

class ActivityB : ScopeActivity() {
    private val presenter: MyPresenter by inject()
}
```

### 基於型別的作用域

繫結至特定類別的作用域：

```kotlin
module {
    scope<MyActivity> {
        scoped<MyPresenter>()
    }
}

// 僅適用於 MyActivity
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    override val scope: Scope by activityScope()
    private val presenter: MyPresenter by inject()
}
```

## ViewModel 作用域

ViewModel 無法存取 Activity 或 Fragment 作用域（以防止記憶體洩漏）。請針對限定作用域的相依性使用 ViewModel 作用域：

```kotlin
module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

有關 ViewModel 作用域用法的詳細資訊，請參閱 [作用域 - ViewModel 作用域](/docs/reference/koin-core/scopes#viewmodel-scope)。

## 作用域生命週期

### 處理作用域關閉

覆寫 `onCloseScope()` 以在作用域銷毀前執行清理作業：

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // 在 scope.close() 之前呼叫
        // 此處仍可存取作用域
    }
}
```

:::warning
不要在 `onDestroy()` 中存取作用域 - 此時它已經關閉。
:::

## 作用域連結

在具有自訂作用域的組件之間共享執行個體：

```kotlin
module {
    scope(named("session")) {
        scoped<UserSession>()
    }
}
```

```kotlin
class MyActivity : ScopeActivity() {

    fun startSession() {
        val sessionScope = getKoin().createScope("session", named("session"))

        // 連結到目前作用域
        scope.linkTo(sessionScope)

        // 現在可以存取 UserSession
        val session: UserSession = get()
    }
}
```

## 快速參考

| 組件 | 委託 | 基底類別 |
|-----------|----------|------------|
| Activity | `by activityScope()` | `ScopeActivity` |
| Activity (retained) | `by activityRetainedScope()` | `RetainedScopeActivity` |
| Fragment | `by fragmentScope()` | `ScopeFragment` |

| 作用域 | 旋轉後存續 | 使用案例 |
|-------|-------------------|----------|
| `activityScope` | ❌ 否 | UI 狀態、presenters |
| `activityRetainedScope` | ✅ 是 | 表單狀態、擱置中的請求 |
| `fragmentScope` | ❌ 否 | Fragment 特有的 presenters |
| `viewModelScope` | ✅ 是 | ViewModel 相依性 |

## 最佳實務

1. **使用原型** - 為了可重用性，優先使用 `activityScope { }` 而非 `scope<MyActivity> { }`。
2. **針對旋轉保留** - 針對應在旋轉後存續的狀態使用 `activityRetainedScope`。
3. **不要洩漏** - 絕不要將 Activity/Fragment 注入到 singletons。
4. **關閉自訂作用域** - 務必手動關閉建立的作用域。
5. **使用 onCloseScope** - 用於作用域銷毀前的清理作業。

## 後續步驟

- **[核心作用域](/docs/reference/koin-core/scopes)** - 作用域基本原理與 ViewModel 作用域
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 注入
- **[測試](/docs/reference/koin-test/testing)** - 測試限定作用域的相依性