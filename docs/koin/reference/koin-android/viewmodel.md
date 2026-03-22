---
title: Android ViewModel
---

本页涵盖了 Android 特定的 ViewModel 功能。有关核心 ViewModel DSL 和多平台支持，请参阅 [ViewModel](/docs/reference/koin-core/viewmodel)。

## 概述

[ViewModels](https://developer.android.com/topic/libraries/architecture/viewmodel) 是旨在在配置更改后继续存在并管理 UI 相关数据的架构组件。Koin 为 ViewModel 提供特殊支持，支持生命周期感知的注入。

### 核心概念

- **在配置更改后继续存在** - ViewModel 在旋转和主题更改时持久存在
- **作用域限定到生命周期** - 与 Activity、Fragment 或导航图生命周期绑定
- **延迟创建** - 仅在首次访问时创建
- **共享实例** - 可以在 Fragment 及其宿主 Activity 之间共享

:::info
**多平台 ViewModel** - Koin ViewModel DSL 通过 `koin-core-viewmodel` 完全支持多平台。对于 Compose Multiplatform，请参阅 [Compose ViewModel](/docs/reference/koin-compose/compose#viewmodel-for-composable)。
:::

### ViewModel 作用域限制

:::warning
**重要提示：** ViewModel 是针对根 Koin 作用域创建的，**无法访问** Activity 或 Fragment 作用域限定的依赖项。这可以防止内存泄漏，因为 ViewModel 的生命周期超过了 Activity 和 Fragment。

**需要在 ViewModel 中使用作用域限定的依赖项？** 使用 [ViewModel 作用域](/docs/reference/koin-core/scopes#viewmodel-scope)创建一个绑定到 ViewModel 生命周期的专用作用域。
:::

## 声明 ViewModel

### 编译器插件 DSL

```kotlin
val appModule = module {
    viewModel<DetailViewModel>()
    viewModel<UserViewModel>()
}
```

### 注解

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

### 经典 DSL

```kotlin
val appModule = module {
    // 使用构造函数引用
    viewModelOf(::DetailViewModel)

    // 使用 lambda
    viewModel { DetailViewModel(get()) }
}
```

## 注入 ViewModel

在 `Activity`、`Fragment` 或 `Service` 中，使用：

* `by viewModel()` - 延迟委托属性
* `getViewModel()` - 立即提取

```kotlin
class DetailActivity : AppCompatActivity() {

    // 延迟注入 ViewModel
    private val viewModel: DetailViewModel by viewModel()

    // 或立即提取
    // private val viewModel: DetailViewModel = getViewModel()
}
```

## 共享 ViewModel (Activity)

在 Fragment 及其宿主 Activity 之间共享 ViewModel：

* `by activityViewModel()` - 用于共享 ViewModel 的延迟委托
* `getActivityViewModel()` - 立即提取

```kotlin
class WeatherActivity : AppCompatActivity() {
    private val weatherViewModel: WeatherViewModel by viewModel()
}

class WeatherHeaderFragment : Fragment() {
    // 与 Activity 共享
    private val weatherViewModel: WeatherViewModel by activityViewModel()
}

class WeatherListFragment : Fragment() {
    // 与 WeatherHeaderFragment 相同的实例
    private val weatherViewModel: WeatherViewModel by activityViewModel()
}
```

## 传递参数

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

### 注入站点

```kotlin
class DetailActivity : AppCompatActivity() {

    private val itemId: String by lazy { intent.getStringExtra("ITEM_ID")!! }

    // 在注入时传递实参
    private val viewModel: DetailViewModel by viewModel { parametersOf(itemId) }
}
```

## SavedStateHandle

在你的 ViewModel 构造函数中添加 `SavedStateHandle` - Koin 会自动注入它：

### 注解

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
    viewModel<MyStateViewModel>()  // 编译器插件 DSL
    // 或
    viewModelOf(::MyStateViewModel)  // 经典 DSL
}
```

### 用法

```kotlin
class DetailActivity : AppCompatActivity() {
    // SavedStateHandle 自动注入
    private val viewModel: MyStateViewModel by viewModel()
}
```

:::info
所有的 `stateViewModel` 函数均已弃用。请使用常规的 `viewModel` 函数 - `SavedStateHandle` 会自动注入。
:::

## 导航图 ViewModel

将 ViewModel 的作用域限定到导航图：

```kotlin
class NavFragment : Fragment() {

    // 作用域限定到导航图
    private val navViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)
}
```

该 ViewModel：
- 在导航图中的第一个 Fragment 访问它时创建
- 在导航图中的所有 Fragment 之间共享
- 在导航图被弹出（popped）时销毁

## 带有作用域限定依赖项的 ViewModel

如果你的 ViewModel 需要自己的作用域限定依赖项，请使用 [ViewModel 作用域](/docs/reference/koin-core/scopes#viewmodel-scope)：

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

对于高级用例，Koin 提供了底层 API：

```kotlin
// 来自 ComponentActivity 或 Fragment
val viewModel = viewModelForClass(
    clazz = MyViewModel::class,
    qualifier = null,
    owner = this,
    key = null,
    parameters = { parametersOf("param") }
)
```

## Java 兼容性

添加兼容性依赖项：

```groovy
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

使用 `ViewModelCompat` 静态方法：

```java
MyViewModel viewModel = ViewModelCompat.getViewModel(this, MyViewModel.class);
```

## 快速参考

| 操作 | 代码 |
|--------|------|
| 声明 ViewModel | `viewModel<MyVM>()` / `@KoinViewModel` |
| 在 Activity/Fragment 中注入 | `by viewModel()` |
| 与 Activity 共享 | `by activityViewModel()` |
| 传递形参 | `by viewModel { parametersOf(id) }` |
| 导航图作用域 | `by koinNavGraphViewModel(R.id.graph)` |
| 配合 SavedStateHandle | 只需添加到构造函数即可 |

## 下一步

- **[核心 ViewModel](/docs/reference/koin-core/viewmodel)** - 多平台 ViewModel DSL
- **[作用域](/docs/reference/koin-core/scopes#viewmodel-scope)** - 用于作用域限定依赖项的 ViewModel 作用域
- **[测试](/docs/reference/koin-test/testing)** - 测试 ViewModel
- **[Compose](/docs/reference/koin-compose/compose)** - Compose 中的 ViewModel