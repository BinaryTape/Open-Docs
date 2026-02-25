[//]: # (title: 生命周期)

Compose Multiplatform 中组件的生命周期采用了 Jetpack Compose [生命周期](https://developer.android.com/topic/libraries/architecture/lifecycle)的概念。
生命周期感知型组件可以响应其他组件生命周期状态的变化，帮助您编写组织更佳、通常更轻量且更易于维护的代码。

Compose Multiplatform 提供了一个通用的 `LifecycleOwner` 实现，它将原始的 Jetpack Compose 功能扩展到其他平台，并帮助在公共代码中观察生命周期状态。

要使用多平台 `Lifecycle` 实现，请将以下依赖项添加到您的 `commonMain` 源集中：

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose:%org.jetbrains.androidx.lifecycle%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose:%org.jetbrains.androidx.lifecycle%"}

> 您可以在我们的[最新变化](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)中跟踪多平台 Lifecycle 实现的变化，或在 [Compose Multiplatform 变更日志](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)中关注特定的抢先体验计划版本。
>
{style="tip"}

## 状态与事件

生命周期状态和事件流（与 [Jetpack 生命周期](https://developer.android.com/topic/libraries/architecture/lifecycle)相同）：

![生命周期图示](lifecycle-states.svg){width="700"}

## 生命周期实现

Composable 通常不需要唯一的生命周期：一个通用的 `LifecycleOwner` 为所有相互关联的实体提供生命周期。默认情况下，由 Compose Multiplatform 创建的所有 Composable 共享相同的生命周期 —— 它们可以订阅其事件、引用生命周期状态等。

> `LifecycleOwner` 对象作为 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal) 提供。如果您想为特定的 Composable 子树单独管理生命周期，可以[创建自己的](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco) `LifecycleOwner` 实现。
>
{style="tip"}

在多平台生命周期中使用协程时，请记住 `Lifecycle.coroutineScope` 的值与 `Dispatchers.Main.immediate` 值绑定，而该值在桌面端目标上默认可能不可用。为了让生命周期中的协程和 flow 在 Compose Multiplatform 中正确工作，请向您的项目添加 `kotlinx-coroutines-swing` 依赖项。详见 [`Dispatchers.Main` 文档](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。

* 在[导航与路由](compose-navigation-routing.md)中了解生命周期在导航组件中的工作方式。
* 在[公共 ViewModel](compose-viewmodel.md) 页面上详细了解多平台 ViewModel 实现。

## 将 Android 生命周期映射到其他平台

### iOS

| 原生事件与通知                              | 生命周期事件      | 生命周期状态变化          |
|-----------------------------------------|-----------------|-------------------------|
| `viewDidDisappear`                      | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`                        | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`                      | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`                       | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`                    | `ON_STOP`       | `STARTED` → `CREATED`   |
| `willEnterForeground`                   | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### Web

由于 Wasm 目标的限制，生命周期：

* 跳过 `CREATED` 状态，因为应用程序始终附加到页面。
* 永远不会达到 `DESTROYED` 状态，因为网页通常只有在用户关闭标签页时才会终止。

| 原生事件                                     | 生命周期事件      | 生命周期状态变化          |
|------------------------------------------|-----------------|------------------------|
| `visibilitychange` (变为可见)               | `ON_START`      | `CREATED` → `STARTED`  |
| `focus`                                  | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `blur`                                   | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `visibilitychange` (停止可见)               | `ON_STOP`       | `STARTED` → `CREATED`  |

### 桌面端 (Desktop)

| Swing 监听器回调           | 生命周期事件      | 生命周期状态变化          |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |