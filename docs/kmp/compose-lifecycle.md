[//]: # (title: 生命周期)

Compose Multiplatform 中组件的生命周期概念，源自 Jetpack Compose 的[生命周期](https://developer.android.com/topic/libraries/architecture/lifecycle)理念。
具备生命周期感知能力的组件，能够响应其他组件的生命周期状态变化，帮助你编写出组织更良好、通常更轻量且更易于维护的代码。

Compose Multiplatform 提供了一个公共的 `LifecycleOwner` 实现，它将原有的 Jetpack Compose 功能扩展到其他平台，并有助于在公共代码中观察生命周期状态。

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

> 你可以在我们的[最新特性](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)中跟踪多平台 Lifecycle 实现的变化，或在[Compose Multiplatform 变更日志](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)中关注具体的 EAP 版本发布。
>
{style="tip"}

## 状态与事件

生命周期状态和事件的流程（与 [Jetpack 生命周期](https://developer.android.com/topic/libraries/architecture/lifecycle)相同）：

![Lifecycle diagram](lifecycle-states.svg){width="700"}

## 生命周期实现

Composables 通常不需要独立的生命周期：一个公共的 `LifecycleOwner` 为所有相互关联的实体提供一个生命周期。默认情况下，Compose Multiplatform 创建的所有 composables 都共享相同的生命周期 —— 它们可以订阅其事件，引用生命周期状态等。

> `LifecycleOwner` 对象以 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal) 的形式提供。
> 如果你希望为特定的 composable 子树单独管理生命周期，可以[创建自己的](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco) `LifecycleOwner` 实现。
>
{style="tip"}

在多平台生命周期中使用协程时，请记住 `Lifecycle.coroutineScope` 值与 `Dispatchers.Main.immediate` 值绑定，而该值默认情况下可能在桌面目标平台不可用。
为了使生命周期中的协程和流在 Compose Multiplatform 中正常工作，请将 `kotlinx-coroutines-swing` 依赖项添加到你的项目中。
关于详细信息，请参阅 [`Dispatchers.Main` 文档](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。

*   在 [](compose-navigation-routing.md) 中了解生命周期如何在导航组件中工作。
*   在 [](compose-viewmodel.md) 页面上了解更多关于多平台 ViewModel 实现的信息。

## 将 Android 生命周期映射到其他平台

### iOS

| 原生事件和通知                | 生命周期事件 | 生命周期状态变化  |
|-------------------------------|-----------------|-------------------------|
| `viewDidDisappear`            | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`              | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`            | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`             | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`          | `ON_STOP`       | `STARTED` → `CREATED`   |
| `willEnterForeground`         | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### Web

由于 Wasm 目标平台的限制，生命周期：

*   跳过 `CREATED` 状态，因为应用程序始终依附于页面。
*   永远不会达到 `DESTROYED` 状态，因为网页通常只在用户关闭标签页时终止。

| 原生事件 | 生命周期事件 | 生命周期状态变化 |
|--------------|-----------------|------------------------|
| `blur`       | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `focus`      | `ON_RESUME`     | `STARTED` → `RESUMED`  |

### Desktop

| Swing 监听器回调 | 生命周期事件 | 生命周期状态变化  |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |