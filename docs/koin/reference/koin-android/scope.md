---
title: 管理 Android Scope
---

## 处理 Android 生命周期

Android 组件主要由其生命周期管理：我们无法直接实例化 Activity 或 Fragment。系统为我们处理所有的创建和管理，并在方法（如 onCreate、onStart 等）上进行回调。

这就是为什么我们无法在 Koin 模块中描述我们的 Activity/Fragment/Service。因此，我们需要将依赖项注入到属性中，并且还要尊重生命周期：与 UI 部分相关的组件必须在我们不再需要它们时尽快释放。

那么我们有：

*   长生命周期组件（服务、数据仓库等）- 由多个屏幕使用，永不销毁。
*   中生命周期组件（用户会话等）- 由多个屏幕使用，必须在一段时间后销毁。
*   短生命周期组件（视图）- 仅由一个屏幕使用，必须在屏幕结束时销毁。

长生命周期组件可以很容易地描述为 `single` 定义。对于中生命周期和短生命周期组件，我们可以有几种方法。

在 MVP 架构风格中，`Presenter` 是一个短生命周期组件，用于帮助/支持 UI。每次屏幕显示时都必须创建 Presenter，并在屏幕消失时销毁。

每次都会创建一个新的 Presenter

```kotlin
class DetailActivity : AppCompatActivity() {

    // injected Presenter
    override val presenter : Presenter by inject()
```

我们可以将其描述在一个模块中：

*   作为 `factory` - 每次调用 `by inject()` 或 `get()` 时生成一个新实例。

```kotlin
val androidModule = module {

    // Factory instance of Presenter
    factory { Presenter() }
}
```

*   作为 `scope` - 生成一个绑定到 scope 的实例。

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
 大多数 Android 内存泄漏都来自于从非 Android 组件引用 UI/Android 组件。系统会保留对其的引用，并且无法通过垃圾回收完全释放它。
:::

## Android 组件的 Scope (自 3.2.1 版本起)

### 声明一个 Android Scope

要将依赖项限定在 Android 组件上，您必须按照以下方式使用 `scope` 块声明一个 scope 部分：

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // Declare scope for MyActivity
  scope<MyActivity> {
    // get MyPresenter instance from current scope 
    scoped { MyAdapter(get()) }
    scoped { MyPresenter() }
  }
}
```

### Android Scope 类

Koin 提供了 `ScopeActivity`、`RetainedScopeActivity` 和 `ScopeFragment` 类，让您可以直接为 Activity 或 Fragment 使用已声明的 scope：

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter is resolved from MyActivity's scope 
    val presenter : MyPresenter by inject()
}
```

在底层，Android scope 需要与 `AndroidScopeComponent` 接口一起使用，以像这样实现 `scope` 字段：

```kotlin
abstract class ScopeActivity(
    @LayoutRes contentLayoutId: Int = 0,
) : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        checkNotNull(scope)
    }
}
```

我们需要使用 `AndroidScopeComponent` 接口并实现 `scope` 属性。这将设置您的类使用的默认 scope。

### Android Scope API

要创建绑定到 Android 组件的 Koin scope，只需使用以下函数：
- `createActivityScope()` - 为当前 Activity 创建 Scope (必须声明 scope 部分)
- `createActivityRetainedScope()` - 为当前 Activity 创建一个保留的 Scope (由 ViewModel 生命周期支持) (必须声明 scope 部分)
- `createFragmentScope()` - 为当前 Fragment 创建 Scope 并链接到父 Activity scope

这些函数作为委托可用，以实现不同类型的 scope：

- `activityScope()` - 为当前 Activity 创建 Scope (必须声明 scope 部分)
- `activityRetainedScope()` - 为当前 Activity 创建一个保留的 Scope (由 ViewModel 生命周期支持) (必须声明 scope 部分)
- `fragmentScope()` - 为当前 Fragment 创建 Scope 并链接到父 Activity scope

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

我们还可以通过以下方式设置一个保留的 scope (由 ViewModel 生命周期支持)：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
如果您不想使用 Android Scope 类，您可以使用自己的类并结合 Scope 创建 API 来使用 `AndroidScopeComponent`。
:::

### AndroidScopeComponent 和 Scope 关闭处理

您可以通过重写 `AndroidScopeComponent` 中的 `onCloseScope` 函数，在 Koin Scope 被销毁之前运行一些代码：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // Called before closing the Scope
    }
}
```

:::note
如果您尝试从 `onDestroy()` 函数访问 Scope，scope 将已经关闭。
:::

### ViewModel Scope (自 3.5.4 版本起)

ViewModel 仅针对根 scope 创建，以避免任何泄漏（如 Activity 或 Fragment 泄漏）。这可以防止可见性问题，即 ViewModel 可能会访问不兼容的 scope。

:::warn
ViewModel 无法访问 Activity 或 Fragment 的 scope。为什么？因为 ViewModel 的生命周期比 Activity 和 Fragment 更长，因此它会将依赖项泄漏到适当的 scope 之外。
:::

:::note
如果您**确实**需要从 ViewModel scope 外部桥接一个依赖项，您可以使用“注入参数”将一些对象传递给您的 ViewModel：`viewModel { p -> }`
:::

`ScopeViewModel` 是一个新类，用于帮助处理 ViewModel scope。它处理 ViewModel 的 scope 创建，并提供 `scope` 属性以允许使用 `by scope.inject()` 进行注入：

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }    
}

class MyScopeViewModel : ScopeViewModel() {

    // on onCleared, scope is closed
    
    // injected from current MyScopeViewModel's scope
    val session by scope.inject<Session>()

}
```

通过使用 `ScopeViewModel`，您还可以重写 `onCloseScope()` 函数，以便在 scope 关闭之前运行代码。

:::note
ViewModel scope 内的所有实例都具有相同的可见性，并将存活于 ViewModel 实例的整个生命周期，直到调用 ViewModel 的 `onCleared` 函数。
:::

例如，一旦 Activity 或 fragment 创建了 ViewModel，相关的 scope 就会被创建：

```kotlin
class MyActivity : AppCompatActivity() {

    // Create ViewModel and its scope
    val myViewModel by viewModel<MyScopeViewModel>()

}
```

一旦您的 ViewModel 被创建，此 scope 内的所有相关依赖项都可以被创建和注入。

要不使用 `ScopeViewModel` 类手动实现您的 ViewModel scope，请按以下步骤操作：

```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {

    override val scope: Scope = createScope(this)

    // inject your dependency
    val session by scope.inject<Session>()

    // clear scope
    override fun onCleared() {
        super.onCleared()
        scope.close()
    }
}
```

## Scope 链接

Scope 链接允许在具有自定义 scope 的组件之间共享实例。

在更广泛的用法中，您可以在组件之间使用 `Scope` 实例。例如，如果我们需要共享一个 `UserSession` 实例。

首先声明一个 scope 定义：

```kotlin
module {
    // Shared user session data
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

当需要开始使用 `UserSession` 实例时，为其创建一个 scope：

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
scope.linkTo(ourSession)
```

然后，在任何你需要的地方使用它：

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
        scope.linkTo(ourSession)

        // will look at MyActivity1's Scope + ourSession scope to resolve
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
        scope.linkTo(ourSession)

        // will look at MyActivity2's Scope + ourSession scope to resolve
        val userSession = get<UserSession>()
    }
}
```