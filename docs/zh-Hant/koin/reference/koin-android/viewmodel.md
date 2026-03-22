---
title: Android ViewModel
---

本頁面涵蓋 Android 特有的 ViewModel 功能。關於核心 ViewModel DSL 與多平台支援，請參閱 [ViewModel](/docs/reference/koin-core/viewmodel)。

## 概覽

[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 是架構元件，旨在於設定變更（configuration changes）後繼續存在並管理 UI 相關資料。Koin 為 ViewModel 提供特殊支援，具備生命週期感知的注入功能。

### 核心概念

- **在設定變更後繼續存在** — ViewModel 在旋轉螢幕與佈景主題變更時仍會保留
- **限定於生命週期作用域** — 綁定到 Activity、Fragment 或 Navigation 圖表的生命週期
- **延遲建立** — 僅在首次存取時建立
- **共享執行個體** — 可在 Fragment 及其宿主 Activity 之間共享

:::info
**多平台 ViewModel** — Koin ViewModel DSL 透過 `koin-core-viewmodel` 完全支援多平台。關於 Compose Multiplatform，請參閱 [Compose ViewModel](/docs/reference/koin-compose/compose#viewmodel-for-composable)。
:::

### ViewModel 作用域限制

:::warning
**重要事項：** ViewModel 是針對根 Koin 作用域建立的，**無法存取** Activity 或 Fragment 作用域的相依性。這可防止記憶體洩漏，因為 ViewModel 的壽命比 Activity 和 Fragment 更長。

**需要在 ViewModel 中使用作用域相依性？** 請使用 [ViewModel 作用域](/docs/reference/koin-core/scopes#viewmodel-scope) 來建立一個與您的 ViewModel 生命週期綁定的專用作用域。
:::

## 宣告 ViewModel

### 編譯器外掛程式 DSL

```kotlin
val appModule = module {
    viewModel<DetailViewModel>()
    viewModel<UserViewModel>()
}
```

### 註解

```kotlin
@KoinViewModel
class DetailViewModel(
    private val repository: DetailRepository
) : ViewModel()

@KoinViewModel
class UserViewModel(
    private val userRepository: UserRepository
) : ViewModel()
```

### 經典 DSL

```kotlin
val appModule = module {
    // 使用建構函式參考
    viewModelOf(::DetailViewModel)

    // 使用 Lambda
    viewModel { DetailViewModel(get()) }
}
```

## 注入 ViewModel

在 `Activity`、`Fragment` 或 `Service` 中，使用：

* `by viewModel()` — 延遲委派屬性
* `getViewModel()` — 立即獲取

```kotlin
class DetailActivity : AppCompatActivity() {

    // 延遲注入 ViewModel
    private val viewModel: DetailViewModel by viewModel()

    // 或立即獲取
    // private val viewModel: DetailViewModel = getViewModel()
}
```

## 共享 ViewModel (Activity)

在 Fragment 及其宿主 Activity 之間共享 ViewModel：

* `by activityViewModel()` — 用於共享 ViewModel 的延遲委派
* `getActivityViewModel()` — 立即獲取

```kotlin
class WeatherActivity : AppCompatActivity() {
    private val weatherViewModel: WeatherViewModel by viewModel()
}

class WeatherHeaderFragment : Fragment() {
    // 與 Activity 共享
    private val weatherViewModel: WeatherViewModel by activityViewModel()
}

class WeatherListFragment : Fragment() {
    // 與 WeatherHeaderFragment 相同的執行個體
    private val weatherViewModel: WeatherViewModel by activityViewModel()
}
```

## 傳遞參數

### 編譯器外掛程式 DSL

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

val appModule = module {
    viewModel<DetailViewModel>()
}
```

### 註解

```kotlin
@KoinViewModel
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()
```

### 經典 DSL

```kotlin
val appModule = module {
    viewModel { params ->
        DetailViewModel(
            itemId = params.get(),
            repository = get()
        )
    }
}
```

### 注入呼叫點

```kotlin
class DetailActivity : AppCompatActivity() {

    private val itemId: String by lazy { intent.getStringExtra("ITEM_ID")!! }

    // 在注入時傳遞參數
    private val viewModel: DetailViewModel by viewModel { parametersOf(itemId) }
}
```

## SavedStateHandle

在您的 ViewModel 建構函式中新增 `SavedStateHandle` — Koin 會自動注入它：

### 註解

```kotlin
@KoinViewModel
class MyStateViewModel(
    private val handle: SavedStateHandle,
    private val repository: MyRepository
) : ViewModel()
```

### DSL

```kotlin
class MyStateViewModel(
    private val handle: SavedStateHandle,
    private val repository: MyRepository
) : ViewModel()

val appModule = module {
    viewModel<MyStateViewModel>()  // 編譯器外掛程式 DSL
    // 或
    viewModelOf(::MyStateViewModel)  // 經典 DSL
}
```

### 使用方式

```kotlin
class DetailActivity : AppCompatActivity() {
    // SavedStateHandle 會自動注入
    private val viewModel: MyStateViewModel by viewModel()
}
```

:::info
所有 `stateViewModel` 函式皆已棄用。請使用一般的 `viewModel` 函式 — `SavedStateHandle` 會自動注入。
:::

## Navigation 圖表 ViewModel

將 ViewModel 的作用域限定在 Navigation 圖表中：

```kotlin
class NavFragment : Fragment() {

    // 限定於 navigation 圖表作用域
    private val navViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)
}
```

此 ViewModel 會：
- 在圖表中的第一個 Fragment 存取它時建立
- 在圖表中的所有 Fragment 之間共享
- 在 Navigation 圖表被彈出（popped）時銷毀

## 具有作用域相依性的 ViewModel

如果您的 ViewModel 需要其專屬的作用域相依性，請使用 [ViewModel 作用域](/docs/reference/koin-core/scopes#viewmodel-scope)：

```kotlin
val appModule = module {
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

## ViewModel 泛型 API

對於進階使用案例，Koin 提供了更底層的 API：

```kotlin
// 來自 ComponentActivity 或 Fragment
val viewModel = viewModelForClass(
    clazz = MyViewModel::class,
    qualifier = null,
    owner = this,
    key = null,
    parameters = { parametersOf("param") }
)
```

## Java 相容性

新增相容性相依性：

```groovy
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

使用 `ViewModelCompat` 靜態方法：

```java
MyViewModel viewModel = ViewModelCompat.getViewModel(this, MyViewModel.class);
```

## 快速參考

| 操作 | 程式碼 |
|--------|------|
| 宣告 ViewModel | `viewModel<MyVM>()` / `@KoinViewModel` |
| 在 Activity/Fragment 中注入 | `by viewModel()` |
| 與 Activity 共享 | `by activityViewModel()` |
| 傳遞參數 | `by viewModel { parametersOf(id) }` |
| Navigation 圖表作用域 | `by koinNavGraphViewModel(R.id.graph)` |
| 使用 SavedStateHandle | 直接新增至建構函式即可 |

## 下一步

- **[核心 ViewModel](/docs/reference/koin-core/viewmodel)** — 多平台 ViewModel DSL
- **[作用域](/docs/reference/koin-core/scopes#viewmodel-scope)** — 用於作用域相依性的 ViewModel 作用域
- **[測試](/docs/reference/koin-test/testing)** — 測試 ViewModel
- **[Compose](/docs/reference/koin-compose/compose)** — Compose 中的 ViewModel