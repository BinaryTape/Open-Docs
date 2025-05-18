---
title: "管理 Android 作用域"
---
## 使用 Android 生命周期

Android 组件主要由其生命周期管理：我们不能直接实例化 Activity 或 Fragment。系统为我们完成所有的创建和管理，并在方法上进行回调：onCreate, onStart...

这就是为什么我们不能在 Koin 模块中描述我们的 Activity/Fragment/Service。我们需要将依赖注入到属性中，并且尊重生命周期：与 UI 部分相关的组件必须在不再需要时立即释放。

因此，我们有：

* 长生命周期组件 (Services, Data Repository ...) - 被多个屏幕使用，永不丢弃
* 中等生命周期组件 (用户会话 ...) - 被多个屏幕使用，必须在一段时间后丢弃
* 短生命周期组件 (视图) - 仅被一个屏幕使用，并且必须在该屏幕结束时丢弃

长生命周期组件可以很容易地描述为 `single` 定义。对于中等和短生命周期组件，我们可以有几种方法。

在 MVP 架构风格中，`Presenter` 是一个短生命周期组件，用于帮助/支持 UI。Presenter 必须在每次屏幕显示时创建，并在屏幕消失后丢弃。

每次都会创建一个新的 Presenter

```kotlin
class DetailActivity : AppCompatActivity() {

    // 注入的 Presenter
    override val presenter : Presenter by inject()
```

我们可以在一个模块中描述它：

* 作为 `factory` - 每次调用 `by inject()` 或 `get()` 时都产生一个新的实例

```kotlin
val androidModule = module {

    // Presenter 的工厂实例
    factory { Presenter() }
}
```

* 作为 `scope` - 产生一个绑定到作用域的实例

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
大多数 Android 内存泄漏来自于从非 Android 组件引用 UI/Android 组件。系统保持对它的引用，并且无法通过垃圾回收完全丢弃它。
:::

## Android 组件的作用域 (自 3.2.1 起)

### 声明一个 Android 作用域

要将依赖项的作用域限定在 Android 组件上，您必须使用 `scope` 块声明一个作用域部分，如下所示：

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // 声明 MyActivity 的作用域
  scope<MyActivity> {
    // 从当前作用域获取 MyPresenter 实例
    scoped { MyAdapter(get()) }
    scoped { MyPresenter() }
  }
}
```

### Android 作用域类

Koin 提供了 `ScopeActivity`、`RetainedScopeActivity` 和 `ScopeFragment` 类，以便您可以直接为 Activity 或 Fragment 使用声明的作用域：

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter 从 MyActivity 的作用域中解析
    val presenter : MyPresenter by inject()
}
```

在底层，Android 作用域需要与 `AndroidScopeComponent` 接口一起使用，以实现 `scope` 字段，如下所示：

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

我们需要使用 `AndroidScopeComponent` 接口并实现 `scope` 属性。这将设置您的类使用的默认作用域。

### Android 作用域 API

要创建绑定到 Android 组件的 Koin 作用域，只需使用以下函数：
- `createActivityScope()` - 为当前 Activity 创建作用域（必须声明作用域部分）
- `createActivityRetainedScope()` - 为当前 Activity 创建一个保留的作用域（由 ViewModel 生命周期支持）（必须声明作用域部分）
- `createFragmentScope()` - 为当前 Fragment 创建作用域并链接到父 Activity 作用域

这些函数可用作委托，以实现不同类型的作用域：

- `activityScope()` - 为当前 Activity 创建作用域（必须声明作用域部分）
- `activityRetainedScope()` - 为当前 Activity 创建一个保留的作用域（由 ViewModel 生命周期支持）（必须声明作用域部分）
- `fragmentScope()` - 为当前 Fragment 创建作用域并链接到父 Activity 作用域

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

我们还可以使用以下方法设置一个保留的作用域（由 ViewModel 生命周期支持）：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
如果您不想使用 Android 作用域类，您可以使用自己的类并结合 `AndroidScopeComponent` 和作用域创建 API
:::

### AndroidScopeComponent 和作用域关闭处理

您可以通过覆盖 `AndroidScopeComponent` 中的 `onCloseScope` 函数，在 Koin 作用域被销毁之前运行一些代码：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // 在关闭作用域之前调用
    }
}
```

:::note
如果您尝试从 `onDestroy()` 函数访问作用域，则作用域将已被关闭。
:::

### ViewModel 作用域 (自 3.5.4 起)

ViewModel 仅针对根作用域创建，以避免任何泄漏（泄漏 Activity 或 Fragment ...）。这可以防止可见性问题，即 ViewModel 可能有权访问不兼容的作用域。

:::warn
ViewModel 无法访问 Activity 或 Fragment 作用域。为什么？因为 ViewModel 的生命周期比 Activity 和 Fragment 长，因此它会将依赖项泄漏到适当作用域之外。
:::

:::note
如果您_真的_需要桥接 ViewModel 作用域之外的依赖项，您可以使用“注入参数”将一些对象传递给您的 ViewModel：`viewModel { p ->  }`
:::

`ScopeViewModel` 是一个新类，用于帮助处理 ViewModel 作用域。这处理 ViewModel 的作用域创建，并提供 `scope` 属性以允许使用 `by scope.inject()` 进行注入：

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }    
}

class MyScopeViewModel : ScopeViewModel() {

    // 在 onCleared 上，作用域被关闭
    
    // 从当前 MyScopeViewModel 的作用域注入
    val session by scope.inject<Session>()

}
```

通过使用 `ScopeViewModel`，您还可以覆盖 `onCloseScope()` 函数，以便在作用域关闭之前运行代码。

:::note
ViewModel 作用域内的所有实例都具有相同的可见性，并且将在 ViewModel 实例的整个生命周期内存在，直到调用 ViewModel 的 onCleared 函数为止
:::

例如，一旦 Activity 或 Fragment 创建了一个 ViewModel，就会创建关联的作用域：

```kotlin
class MyActivity : AppCompatActivity() {

    // 创建 ViewModel 及其作用域
    val myViewModel by viewModel<MyScopeViewModel>()

}
```

一旦您的 ViewModel 被创建，就可以创建和注入来自此作用域内的所有相关依赖项。

要手动实现您的 ViewModel 作用域而不使用 `ScopeViewModel` 类，请按以下步骤操作：

```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {

    override val scope: Scope = createScope(this)

    // 注入你的依赖
    val session by scope.inject<Session>()

    // 清除作用域
    override fun onCleared() {
        super.onCleared()
        scope.close()
    }
}
```

## 作用域链接

作用域链接允许在使用自定义作用域的组件之间共享实例。

在更广泛的用法中，您可以在组件之间使用 `Scope` 实例。例如，如果我们需要共享一个 `UserSession` 实例。

首先声明一个作用域定义：

```kotlin
module {
    // 共享的用户会话数据
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

当需要开始使用 `UserSession` 实例时，为其创建一个作用域：

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// 将 ourSession 作用域链接到当前 `scope`，来自 ScopeActivity 或 ScopeFragment
scope.linkTo(ourSession)
```

然后在任何需要的地方使用它：

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 将 ourSession 作用域链接到当前 `scope`，来自 ScopeActivity 或 ScopeFragment
        scope.linkTo(ourSession)

        // 将在 MyActivity1 的 Scope + ourSession 作用域中查找以解析
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 将 ourSession 作用域链接到当前 `scope`，来自 ScopeActivity 或 ScopeFragment
        scope.linkTo(ourSession)

        // 将在 MyActivity2 的 Scope + ourSession 作用域中查找以解析
        val userSession = get<UserSession>()
    }
}