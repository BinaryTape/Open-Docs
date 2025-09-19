[//]: # (title: 生命周期)

Compose Multiplatform 中的组件生命周期沿用了 Jetpack Compose [生命周期](https://developer.android.com/topic/libraries/architecture/lifecycle)的概念。
生命周期感知的组件能够响应其他组件的生命周期状态变化，帮助你产出组织更良好、通常更轻量级且更易于维护的代码。

Compose Multiplatform 提供了一个公共的 `LifecycleOwner` 实现，它将原始的 Jetpack Compose 功能性扩展到其他平台，并帮助在公共代码中观察生命周期状态。

要使用多平台 `Lifecycle` 实现，请将以下依赖项添加到你的 `commonMain` 源代码集：

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

> 你可以在我们的[新增功能](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)中追踪多平台 Lifecycle 实现的变更，或在 [Compose Multiplatform 变更日志](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)中关注特定的抢先体验预览版本。
>
{style="tip"}

## 状态与事件

生命周期状态和事件的流转（与 [Jetpack 生命周期](https://developer.android.com/topic/libraries/architecture/lifecycle)相同）：

![生命周期图](lifecycle-states.svg){width="700"}

## 生命周期实现

Composables 通常不需要独有的生命周期：一个公共的 `LifecycleOwner` 为所有相互连接的实体提供一个生命周期。默认情况下，所有由 Compose Multiplatform 创建的 Composables 共享同一生命周期——它们可以订阅其事件、引用生命周期状态等等。

> `LifecycleOwner` 对象作为 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal) 提供。
> 如果你想为特定的可组合项子树单独管理生命周期，你可以[创建自己的](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco) `LifecycleOwner` 实现。
>
{style="tip"}

在使用多平台生命周期中的协程时，请记住 `Lifecycle.coroutineScope` 值绑定到 `Dispatchers.Main.immediate` 值，该值在桌面目标平台中可能默认不可用。
要使生命周期中的协程和流在 Compose Multiplatform 中正常工作，请将 `kotlinx-coroutines-swing` 依赖项添加到你的项目。
关于 `Dispatchers.Main` 的详情，请参见[文档](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。

* 关于导航组件中生命周期如何工作，请了解[导航与路由](compose-navigation-routing.md)。
* 关于多平台 ViewModel 实现的更多信息，请参见[公共 ViewModel](compose-viewmodel.md) 页面。

## 将 Android 生命周期映射到其他平台

### iOS

| 原生事件和通知                | 生命周期事件    | 生命周期状态变更      |
|-------------------------------|-----------------|-----------------------|
| `viewDidDisappear`            | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`              | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`            | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`             | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`          | `ON_STOP`       | `CREATED` → `STARTED`   |
| `willEnterForeground`         | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### Web

由于 Wasm 目标平台的限制，生命周期：

* 跳过 `CREATED` 状态，因为应用程序始终附加到页面。
* 永远不会达到 `DESTROYED` 状态，因为网页通常只有当用户关闭标签页时才会被终止。

| 原生事件                           | 生命周期事件 | 生命周期状态变更 |
|------------------------------------|-----------------|------------------|
| `visibilitychange` (变为可见)        | `ON_START`      | `CREATED` → `STARTED`  |
| `focus`                            | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `blur`                             | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `visibilitychange` (停止可见)        | `ON_STOP`       | `STARTED` → `CREATED`  |

### 桌面

| Swing 监听器回调 | 生命周期事件 | 生命周期状态变更 |
|------------------|-----------------|------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |