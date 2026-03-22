---
title: ViewModel
---

Koin 通过 `koin-core-viewmodel` 模块提供跨平台 ViewModel 支持。这允许您在所有 Kotlin 跨平台目标中声明并注入 [AndroidX ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 实例。

## 安装

添加核心 ViewModel 依赖项：

```kotlin
// build.gradle.kts (commonMain)
implementation("io.insert-koin:koin-core-viewmodel:$koin_version")
```

对于平台特定的注入 API，请添加：

```kotlin
// Android
implementation("io.insert-koin:koin-android:$koin_version")

// Compose Multiplatform
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
```

## 声明 ViewModel

### 编译器插件 DSL

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()
}
```

### 注解

```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 经典 DSL

```kotlin
val appModule = module {
    // 使用构造函数引用
    viewModelOf(::UserViewModel)

    // 使用 lambda
    viewModel { UserViewModel(get()) }
}
```

## 带有参数的 ViewModel

使用 `@InjectedParam` 在注入时传递参数：

### 编译器插件 DSL

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

val appModule = module {
    viewModel<DetailViewModel>()
}
```

### 注解

```kotlin
@KoinViewModel
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()
```

### 经典 DSL

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

## ViewModel 作用域

需要其自身作用域依赖项的 ViewModel 使用 `viewModelScope` 模式。在 `viewModelScope` 内部声明的依赖项与 ViewModel 的生命周期绑定。

### 编译器插件 DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

### 注解

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

### 经典 DSL

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
在第一次访问 ViewModel 时会创建 `viewModelScope` 内部的依赖项，并在清除 ViewModel 时销毁。
:::

## 注入 ViewModel

### 在 Compose (跨平台) 中

在 Composable 函数中使用 `koinViewModel()`：

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    // 或带有参数
    val detailVM = koinViewModel<DetailViewModel> { parametersOf("item_123") }
}
```

### 在 Android 中

在 Activity 或 Fragment 中使用 `by viewModel()` 委托：

```kotlin
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()

    // 带有参数
    private val detailVM: DetailViewModel by viewModel { parametersOf("item_123") }
}
```

## SavedStateHandle

将 `SavedStateHandle` 添加到您的 ViewModel 构造函数中 - Koin 会自动注入它：

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
    viewModel<MyViewModel>()  // 编译器插件 DSL
    // 或
    viewModelOf(::MyViewModel)  // 经典 DSL
}
```

## 快速参考

| 方式 | 模块声明 | 作用域声明 |
|----------|-------------------|-------------------|
| 编译器插件 DSL | `viewModel<MyVM>()` | `viewModelScope { viewModel<MyVM>() }` |
| 注解 | `@KoinViewModel` | `@KoinViewModel @ViewModelScope` |
| 经典 DSL | `viewModelOf(::MyVM)` | `viewModelScope { viewModelOf(::MyVM) }` |

| 平台 | 注入 API |
|----------|---------------|
| Compose | `koinViewModel<MyVM>()` |
| Android | `by viewModel()` |

## 平台特定功能

- **Android**：有关 Activity/Fragment 共享、导航图作用域的信息，请参阅 [Android ViewModel](/docs/reference/koin-android/viewmodel)
- **Compose**：有关 Compose 特定 API 的信息，请参阅 [Compose ViewModel](/docs/reference/koin-compose/compose#viewmodel-for-composable)

## 后续步骤

- **[作用域](/docs/reference/koin-core/scopes)** - 核心作用域概念
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android 特定功能
- **[Compose](/docs/reference/koin-compose/compose)** - Compose 跨平台集成