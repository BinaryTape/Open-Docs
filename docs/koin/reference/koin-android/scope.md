---
title: Android 作用域
---

本指南涵盖了 Android 特定的作用域实现。

:::info
有关核心作用域概念，请参阅 [作用域](/docs/reference/koin-core/scopes)。
:::

## 概览

Koin 中的作用域允许您管理依赖项的生命周期，以匹配 Android 组件的生命周期。这可以防止内存泄漏并确保正确的资源管理。

### 作用域层次结构

| 作用域类型 | 生命周期 | 在旋转后存续 | DSL | 注解 |
|------------|----------|-------------------|-----|------------|
| **应用程序** | 整个应用 | ✅ 是 | `single { }` | `@Singleton` |
| **Activity** | Activity 生命周期 | ❌ 否 | `activityScope { }` | `@ActivityScope` |
| **Activity 保留** | 直到 finish() | ✅ 是 | `activityRetainedScope { }` | `@ActivityRetainedScope` |
| **Fragment** | Fragment 生命周期 | ❌ 否 | `fragmentScope { }` | `@FragmentScope` |
| **ViewModel** | ViewModel 生命周期 | ✅ 是 | `viewModelScope { }` | `@ViewModelScope` |

### 作用域关系

```
应用程序作用域 (single { })
    └── Activity 保留作用域 (在旋转后存续)
            └── Activity 作用域
                    ├── Fragment 作用域 1
                    └── Fragment 作用域 2
            └── ViewModel 作用域 (无法访问 Activity/Fragment 作用域)
```

:::info
**核心原则：** 子作用域可以访问父作用域的定义，但反之则不行。
:::

## 声明作用域依赖项

### 编译器插件 DSL

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

### 注解

```kotlin
// Activity 作用域
@ActivityScope
class ActivityPresenter(private val repository: UserRepository)

@ActivityScope
class ActivityNavigator

// Activity 保留作用域 (在旋转后存续)
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

### 经典 DSL

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

## 在 Android 组件中使用作用域

### Activity 作用域

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    // 创建绑定到 Activity 生命周期的作用域
    override val scope: Scope by activityScope()

    // 从作用域注入
    private val presenter: ActivityPresenter by inject()
}
```

或者使用便捷基类：

```kotlin
class MyActivity : ScopeActivity() {

    // 作用域已设置完成
    private val presenter: ActivityPresenter by inject()
}
```

### Activity 保留作用域

在配置更改（旋转、主题更改）后存续：

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    // 由 ViewModel 生命周期支持 - 在旋转后存续
    override val scope: Scope by activityRetainedScope()

    private val presenter: RetainedPresenter by inject()
}
```

或者使用便捷基类：

```kotlin
class MyActivity : RetainedScopeActivity() {

    private val presenter: RetainedPresenter by inject()
}
```

### Fragment 作用域

Fragment 作用域会自动链接到父 Activity 作用域：

```kotlin
class MyFragment : Fragment(), AndroidScopeComponent {

    override val scope: Scope by fragmentScope()

    // 来自 Fragment 作用域
    private val presenter: FragmentPresenter by inject()

    // 也可以访问 Activity 作用域的依赖项
    private val activityPresenter: ActivityPresenter by inject()
}
```

或者使用便捷基类：

```kotlin
class MyFragment : ScopeFragment() {

    private val presenter: FragmentPresenter by inject()
}
```

## 基于类型的作用域 vs 原型作用域

### 原型作用域 (推荐)

适用于任何 Activity/Fragment 的通用作用域：

```kotlin
module {
    activityScope {
        scoped<MyPresenter>()
    }
}

// 适用于任何 Activity
class ActivityA : ScopeActivity() {
    private val presenter: MyPresenter by inject()
}

class ActivityB : ScopeActivity() {
    private val presenter: MyPresenter by inject()
}
```

### 基于类型的作用域

绑定到特定类的工作作用域：

```kotlin
module {
    scope<MyActivity> {
        scoped<MyPresenter>()
    }
}

// 仅适用于 MyActivity
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    override val scope: Scope by activityScope()
    private val presenter: MyPresenter by inject()
}
```

## ViewModel 作用域

ViewModel 无法访问 Activity 或 Fragment 作用域（以防止内存泄漏）。请为作用域内依赖项使用 ViewModel 作用域：

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

有关详细的 ViewModel 作用域用法，请参阅 [作用域 - ViewModel 作用域](/docs/reference/koin-core/scopes#viewmodel-scope)。

## 作用域生命周期

### 处理作用域关闭

重写 `onCloseScope()` 以在作用域销毁之前运行清理代码：

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // 在 scope.close() 之前调用
        // 此处仍可访问作用域
    }
}
```

:::warning
不要在 `onDestroy()` 中访问作用域 - 该作用域在此时已经关闭。
:::

## 作用域链接

在具有自定义作用域的组件之间共享实例：

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

        // 链接到当前作用域
        scope.linkTo(sessionScope)

        // 现在可以访问 UserSession
        val session: UserSession = get()
    }
}
```

## 快速参考

| 组件 | 委托 | 基类 |
|-----------|----------|------------|
| Activity | `by activityScope()` | `ScopeActivity` |
| Activity (保留) | `by activityRetainedScope()` | `RetainedScopeActivity` |
| Fragment | `by fragmentScope()` | `ScopeFragment` |

| 作用域 | 在旋转后存续 | 用例 |
|-------|-------------------|----------|
| `activityScope` | ❌ 否 | UI 状态、Presenter |
| `activityRetainedScope` | ✅ 是 | 表单状态、待处理请求 |
| `fragmentScope` | ❌ 否 | Fragment 特定的 Presenter |
| `viewModelScope` | ✅ 是 | ViewModel 依赖项 |

## 最佳做法

1. **使用原型** - 优先使用 `activityScope { }` 而非 `scope<MyActivity> { }` 以提高可重用性。
2. **为旋转保留** - 对应该在旋转后存续的状态使用 `activityRetainedScope`。
3. **防止泄漏** - 严禁将 Activity/Fragment 注入到单例中。
4. **关闭自定义作用域** - 始终手动关闭手动创建的作用域。
5. **使用 onCloseScope** - 用于在作用域销毁前进行清理。

## 下一步

- **[核心作用域](/docs/reference/koin-core/scopes)** - 作用域基础和 ViewModel 作用域
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 注入
- **[测试](/docs/reference/koin-test/testing)** - 测试作用域内的依赖项