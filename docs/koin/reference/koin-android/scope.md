---
title: Android 作用域
---

## 处理 Android 生命周期

Android 组件主要由其生命周期管理：我们无法直接实例化 Activity 或 Fragment。系统为我们完成所有的创建和管理工作，并回调相应的方法：`onCreate`、`onStart`……

这就是为什么我们无法在 Koin 模块中描述我们的 Activity/Fragment/Service。因此，我们需要将依赖项注入到属性中，同时也要尊重生命周期：与 UI 部分相关的组件必须在不再需要时立即释放。

因此，我们有：

* 长生命周期组件（Service、数据仓库……）——被多个屏幕使用，从不丢弃。
* 中等生命周期组件（用户会话……）——被多个屏幕使用，必须在一段时间后丢弃。
* 短生命周期组件（View）——仅由一个屏幕使用，且必须在屏幕结束时丢弃。

长生命周期组件可以很容易地描述为 `single` 定义。对于中等和短生命周期组件，我们可以采用几种方法。

在 MVP 架构风格的情况下，`Presenter` 是一个用于帮助/支持 UI 的短生命周期组件。Presenter 必须在每次屏幕显示时创建，并在屏幕消失后丢弃。

每次都会创建一个新的 Presenter：

```kotlin
class DetailActivity : AppCompatActivity() {

    // 注入 Presenter
    override val presenter : Presenter by inject()
```

我们可以在模块中这样描述它：

* 作为 `factory` —— 每次调用 `by inject()` 或 `get()` 时都会产出一个新实例。

```kotlin
val androidModule = module {

    // Presenter 的 Factory 实例
    factory { Presenter() }
}
```

* 作为 `scope` —— 产出一个绑定到作用域的实例。

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
大多数 Android 内存泄漏源于从非 Android 组件引用 UI/Android 组件。系统会保留对它的引用，并且无法通过垃圾回收完全将其丢弃。
:::

## Android 组件的作用域（自 3.2.1 起）

### 声明一个 Android 作用域

要将依赖项的作用域限定在 Android 组件上，你必须使用 `scope` 块声明一个作用域部分，如下所示：

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // 为 MyActivity 声明作用域
  scope<MyActivity> {
   // 从当前作用域获取 MyPresenter 实例 
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
 
  // 或者
  activityScope {
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
}
```

### Android 作用域类

Koin 提供了 `ScopeActivity`、`RetainedScopeActivity` 和 `ScopeFragment` 类，让你直接为 Activity 或 Fragment 使用声明的作用域：

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter 从 MyActivity 的作用域中解析 
    val presenter : MyPresenter by inject()
}
```

在底层，Android 作用域需要配合 `AndroidScopeComponent` 接口来像这样实现 `scope` 字段：

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

我们需要使用 `AndroidScopeComponent` 接口并实现 `scope` 属性。这将设置你的类所使用的默认作用域。

### Android 作用域 API

要创建一个绑定到 Android 组件的 Koin 作用域，只需使用以下函数：
- `createActivityScope()` —— 为当前 Activity 创建作用域（必须已声明作用域部分）。
- `createActivityRetainedScope()` —— 为当前 Activity 创建一个保留作用域（由 ViewModel 生命周期支持）（必须已声明作用域部分）。
- `createFragmentScope()` —— 为当前 Fragment 创建作用域并链接到父 Activity 作用域。

这些函数可以作为委托使用，以实现不同类型的作用域：

- `activityScope()` —— 为当前 Activity 创建作用域（必须已声明作用域部分）。
- `activityRetainedScope()` —— 为当前 Activity 创建一个保留作用域（由 ViewModel 生命周期支持）（必须已声明作用域部分）。
- `fragmentScope()` —— 为当前 Fragment 创建作用域并链接到父 Activity 作用域。

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

我们还可以通过以下方式设置一个保留作用域（由 ViewModel 生命周期支持）：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
如果你不想使用 Android 作用域类，可以处理你自己的类，并配合使用 `AndroidScopeComponent` 与作用域创建 API。
:::

### AndroidScopeComponent 与处理作用域关闭

你可以通过重写 `AndroidScopeComponent` 中的 `onCloseScope` 函数，在 Koin 作用域销毁之前运行代码：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // 在关闭作用域之前调用
    }
}
```

:::note
如果你尝试从 `onDestroy()` 函数访问作用域，该作用域届时将已经关闭。
:::

### 作用域原型 (4.1.0)

作为一项新功能，你现在可以按 **原型 (archetype)** 声明作用域：你不需要针对特定类型定义作用域，而是针对“原型”（一种作用域类）进行定义。你可以为 “Activity”、“Fragment” 或 “ViewModel” 声明作用域。
你现在可以使用以下 DSL 部分：

```kotlin
module {
 activityScope {
  // Activity 的作用域实例
 }

 activityRetainedScope {
  // Activity 的作用域实例，保留作用域
 }

 fragmentScope {
  // Fragment 的作用域实例
 }

 viewModelScope {
  // ViewModel 的作用域实例
 }
}
```

这允许在作用域之间更轻松地重用定义。除非你需要在精确的对象上使用作用域，否则无需使用 `scope<>{ }` 这种特定类型。

:::info
请参阅 [Android 作用域 API](#android-作用域-api) 以了解如何使用 `by activityScope()`、`by activityRetainedScope()` 和 `by fragmentScope()` 函数来激活你的 Android 作用域。这些函数将触发作用域原型。
:::

例如，通过作用域原型，你可以像这样轻松地将定义限定在 Activity 的作用域内：

```kotlin
// 在 Activity 作用域内声明 Class Session
module {
 activityScope {
    scopedOf(::Session)
 }
}

// 将作用域内的 Session 对象注入到 Activity：
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    
    // 创建 Activity 的作用域
    val scope: Scope by activityScope() 
    
    // 从上述作用域注入
    val session: Session by inject()
}
```

### ViewModel 作用域（4.1.0 更新）

ViewModel 仅针对根作用域创建，以避免任何泄漏（泄漏 Activity 或 Fragment……）。这可以防止可见性问题，即 ViewModel 可能会访问不兼容的作用域。

:::warn
ViewModel 无法访问 Activity 或 Fragment 作用域。为什么？因为 ViewModel 的持续时间比 Activity 和 Fragment 长，因此它会将依赖项泄漏到适当的作用域之外。
如果你需要从 ViewModel 作用域之外桥接依赖项，可以使用“注入参数”将某些对象传递给你的 ViewModel：`viewModel { p -> }`
:::

如下所示声明你的 ViewModel 作用域，绑定到你的 ViewModel 类或使用 `viewModelScope` DSL 部分：

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    // 仅针对 MyScopeViewModel 的作用域
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }
    // ViewModel 原型作用域 - 针对所有 ViewModel 的作用域 
    viewModelScope {
        scopedOf(::Session)
    }
}
```

一旦声明了 ViewModel 和作用域组件，你可以 _二选一_：
- 手动 API —— 手动使用 `KoinScopeComponent` 和 `viewModelScope` 函数。这将处理你创建的 ViewModel 作用域的创建和销毁。但你必须通过字段注入你的作用域定义，因为你需要依赖 `scope` 属性来注入你的作用域定义：
```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {
    
    // 创建 ViewModel 作用域
    override val scope: Scope = viewModelScope()
    
    // 使用上述作用域注入 session
    val session: Session by inject()
}
```
- 自动作用域创建
    - 激活 `viewModelScopeFactory` 选项（请参阅 [Koin 选项](../koin-core/start-koin.md#koin-options---feature-flagging)）以实时自动创建 ViewModel 作用域。
    - 这允许使用构造函数注入。
```kotlin
// 激活 ViewModel 作用域工厂
startKoin {
    options(
        viewModelScopeFactory()
    )
}

// 作用域在工厂级别、注入前自动创建
class MyScopeViewModel(val session: Session) : ViewModel()
```

现在只需从你的 Activity 或 Fragment 调用你的 ViewModel：

```kotlin
class MyActivity : AppCompatActivity() {
    
    // 创建 MyScopeViewModel 实例，并分配 MyScopeViewModel 的作用域
    val vieModel: MyScopeViewModel by viewModel()
}
```

## 作用域链接

作用域链接允许在具有自定义作用域的组件之间共享实例。默认情况下，Fragment 的作用域链接到父 Activity 作用域。

在更扩展的用法中，你可以跨组件使用一个 `Scope` 实例。例如，如果我们需要共享一个 `UserSession` 实例。

首先，声明一个作用域定义：

```kotlin
module {
    // 共享用户会话数据
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

当需要开始使用 `UserSession` 实例时，为其创建一个作用域：

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// 将 ourSession 作用域链接到当前来自 ScopeActivity 或 ScopeFragment 的 `scope`
scope.linkTo(ourSession)
```

然后在任何需要的地方使用它：

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 将 ourSession 作用域链接到当前来自 ScopeActivity 或 ScopeFragment 的 `scope`
        scope.linkTo(ourSession)

        // 将查看 MyActivity1 的作用域 + ourSession 作用域来解析
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 将 ourSession 作用域链接到当前来自 ScopeActivity 或 ScopeFragment 的 `scope`
        scope.linkTo(ourSession)

        // 将查看 MyActivity2 的作用域 + ourSession 作用域来解析
        val userSession = get<UserSession>()
    }
}