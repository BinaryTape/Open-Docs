---
title: ViewModel
---

Koin 透過 `koin-core-viewmodel` 模組提供多平台 ViewModel 支援。這讓您可以在所有 Kotlin Multiplatform 目標中宣告並注入 [AndroidX ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 執行個體。

## 設定 (Setup)

新增核心 ViewModel 相依性：

```kotlin
// build.gradle.kts (commonMain)
implementation("io.insert-koin:koin-core-viewmodel:$koin_version")
```

對於特定平台的注入 API，請新增：

```kotlin
// Android
implementation("io.insert-koin:koin-android:$koin_version")

// Compose Multiplatform
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
```

## 宣告 ViewModel (Declaring ViewModels)

### 編譯器外掛程式 DSL (Compiler Plugin DSL)

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()
}
```

### 註解 (Annotations)

```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 經典 DSL (Classic DSL)

```kotlin
val appModule = module {
    // 使用建構函式參照
    viewModelOf(::UserViewModel)

    // 使用 Lambda
    viewModel { UserViewModel(get()) }
}
```

## 包含參數的 ViewModel (ViewModel with Parameters)

在注入時使用 `@InjectedParam` 傳遞參數：

### 編譯器外掛程式 DSL (Compiler Plugin DSL)

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

val appModule = module {
    viewModel<DetailViewModel>()
}
```

### 註解 (Annotations)

```kotlin
@KoinViewModel
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()
```

### 經典 DSL (Classic DSL)

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

## ViewModel 作用域 (ViewModel Scope)

需要自己作用域相依性的 ViewModel 會使用 `viewModelScope` 原型。在 `viewModelScope` 內宣告的相依性會與 ViewModel 的生命週期繫結。

### 編譯器外掛程式 DSL (Compiler Plugin DSL)

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

### 註解 (Annotations)

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

### 經典 DSL (Classic DSL)

```kotlin
val appModule = module {
    viewModelScope {
        scoped { UserCache() }
        scoped { UserRepository(get()) }
        viewModel { UserViewModel(get()) }
    }
}
```

:::info
`viewModelScope` 內的相依性會在首次存取 ViewModel 時建立，並在清除 ViewModel 時銷毀。
:::

:::caution 需要 `viewModelScopeFactory()` 選項
在 `viewModelScope { }` 內宣告 **ViewModel 本身**（以便 Koin 自動建立其作用域）需要在您的 Koin 配置中啟用 `viewModelScopeFactory()` 選項：

```kotlin
startKoin {
    options(viewModelScopeFactory())
    modules(appModule)
}
```

若未啟用，解析 ViewModel 將失敗並顯示：

```
No definition found for type 'MyViewModel' on scope '['_root_']'
```

因為 ViewModel 是在 ViewModel 作用域原型下註冊的，而該作用域僅在啟用該選項時才會建立。（這與手動的 `ScopeViewModel` 模式不同，後者會建立自己的作用域，不需要此選項。）
:::

## 注入 ViewModel (Injecting ViewModels)

### 在 Compose (多平台) 中

在 Composable 函式中使用 `koinViewModel()`：

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    // 或使用參數
    val detailVM = koinViewModel<DetailViewModel> { parametersOf("item_123") }
}
```

### 在 Android 中

在 Activity 或 Fragment 中使用 `by viewModel()` 委派：

```kotlin
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()

    // 使用參數
    private val detailVM: DetailViewModel by viewModel { parametersOf("item_123") }
}
```

## SavedStateHandle

將 `SavedStateHandle` 新增至您的 ViewModel 建構函式中 — Koin 會自動注入：

```kotlin
@KoinViewModel
class MyViewModel(
    private val handle: SavedStateHandle,
    private val repository: UserRepository
) : ViewModel() {

    val userId: String? = handle["userId"]
}
```

```kotlin
val appModule = module {
    viewModel<MyViewModel>()  // 編譯器外掛程式 DSL
    // 或
    viewModelOf(::MyViewModel)  // 經典 DSL
}
```

## 快速參考 (Quick Reference)

| 方法 (Approach) | 模組宣告 | 作用域宣告 |
|----------|-------------------|-------------------|
| 編譯器外掛程式 DSL | `viewModel<MyVM>()` | `viewModelScope { viewModel<MyVM>() }` |
| 註解 | `@KoinViewModel` | `@KoinViewModel @ViewModelScope` |
| 經典 DSL | `viewModelOf(::MyVM)` | `viewModelScope { viewModelOf(::MyVM) }` |

| 平台 | 注入 API |
|----------|---------------|
| Compose | `koinViewModel<MyVM>()` |
| Android | `by viewModel()` |

## 特定平台的特性 (Platform-Specific Features)

- **Android**：請參閱 [Android ViewModel](/docs/reference/koin-android/viewmodel) 以了解 Activity/Fragment 共享、導航圖 (Navigation Graph) 作用域。
- **Compose**：請參閱 [Compose ViewModel](/docs/reference/koin-compose/compose#viewmodel-for-composable) 以了解 Compose 特定的 API。

## 後續步驟 (Next Steps)

- **[作用域 (Scopes)](/docs/reference/koin-core/scopes)** – 核心作用域概念
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** – Android 特定特性
- **[Compose](/docs/reference/koin-compose/compose)** – Compose Multiplatform 整合