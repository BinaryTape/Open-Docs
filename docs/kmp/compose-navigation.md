[//]: # (title: 在 Compose 中导航)

[Android 的 Navigation 库](https://developer.android.com/guide/navigation)支持在 Jetpack Compose 中导航。Compose Multiplatform 团队正在为 AndroidX Navigation 库贡献多平台支持。

除了在应用程序内容片段之间进行实际导航外，该库还解决了基本的导航问题：

*   以类型安全的方式在目标之间传递数据。
*   通过保持清晰易用的导航历史记录，轻松跟踪用户在应用程序中的旅程。
*   支持深层链接机制，允许在常规工作流之外将用户导航到应用程序中的特定位置。
*   支持导航时统一的动画和过渡，并允许使用常用模式（例如返回手势），且只需极少额外工作。

如果您对基础知识感到足够熟悉，请继续阅读 [导航和路由](compose-navigation-routing.md)，了解如何在跨平台项目中利用 Navigation 库。否则，请继续阅读以了解该库所使用的基本概念。

> 您可以在我们的 [新功能](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html) 中跟踪 Navigation 库多平台版本的变更，或在 [Compose Multiplatform 变更日志](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md) 中关注具体的抢先体验预览（EAP）版本。
>
{style="tip"}

## Compose Navigation 的基本概念

Navigation 库使用以下概念来映射导航用例：

*   一个 _导航图_ 描述了应用程序中所有可能的目标以及它们之间的连接。导航图可以嵌套以适应应用程序中的子流程。
*   一个 _目标_ 是导航图中的一个节点，可以导航到该节点。这可以是一个 composable、一个嵌套导航图或一个对话框。当用户导航到目标时，应用程序会显示其内容。
*   一个 _路由_ 标识一个目标并定义导航到它所需的实参，但不描述 UI。通过这种方式，数据与表示分离，这允许您保持每个 UI 实现片段独立于整个应用程序结构。例如，这使得在项目中测试和重新排列 composable 变得更容易。

牢记这些概念，Navigation 库实现了基本规则来指导您的导航架构：

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

*   应用程序将用户路径表示为目标堆栈，或 _返回栈_。默认情况下，每当用户导航到新目标时，该目标都会被添加到堆栈顶部。您可以使用返回栈使导航更直接：您无需直接来回导航，而是可以从堆栈顶部弹出当前目标，并自动返回到上一个目标。
*   每个目标都可以关联一组 _深层链接_：当应用程序从操作系统接收到链接时，应引导至该目标的 URI 模式。

## 基本导航示例

要使用 Navigation 库，请将以下依赖项添加到您的 `commonMain` 源代码集：

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%"}

> Compose Multiplatform %org.jetbrains.compose% 需要 Navigation 库版本 %org.jetbrains.androidx.navigation%。
>
{style="note"}

设置导航所需的步骤存在一定的顺序：

1.  定义您的路由。
    为每个目标创建一个 [可序列化](https://kotlinlang.org/docs/serialization.html) 的对象或数据类，以保存相应目标所需的实参。
2.  创建一个 `NavController`，它将是您的导航接口，位于 composable 层级结构中足够高的位置，以便所有 composable 都可以访问它。
    `NavController` 持有应用程序的返回栈，并提供在导航图中目标之间进行过渡的方法。
3.  设计您的导航图，选择其中一个路由作为起始目标。
    为此，创建一个 `NavHost` composable，它持有导航图（描述所有可导航的目标）。

以下是在应用程序中导航的基础示例：

```kotlin
// Creates routes
@Serializable
object Profile
@Serializable
object FriendsList

// Creates the NavController
val navController = rememberNavController()

// Creates the NavHost with the navigation graph consisting of supplied destinations
NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // You can add more destinations similarly
}
```

### Navigation 库的主要类

Navigation 库提供以下核心类型：

*   `NavController`。
    提供核心导航功能 API：目标之间过渡、处理深层链接、管理返回栈等。
    <!--You should create the `NavController` high in your composable hierarchy, high enough that all the composables
    that need to reference it can do so.
    This way, you can use the `NavController` as the single source of truth for updating composables outside of your screens.
    [NB: This doesn't seem to be useful to people who are trying to cover the basics.]-->
*   `NavHost`。Composable，根据导航图显示当前目标的内容。
    每个 `NavHost` 都有一个必需的 `startDestination` 形参：当用户启动应用程序时应该看到的第一屏所对应的目标。
*   `NavGraph`。
    描述应用程序中所有可能的目标以及它们之间的连接。导航图通常定义为返回 `NavGraph` 的构建器 lambda 表达式，例如在 `NavHost` 声明中。

除了核心类型功能外，Navigation 组件还提供动画和过渡、深层链接支持、类型安全、`ViewModel` 支持以及其他用于处理应用程序导航的质量改进特性。

## 导航用例

### 前往目标

要导航到目标，请调用 `NavController.navigate()` 函数。以上述示例为例：

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("Go to profile")
}
```

### 向目标传递实参

在设计导航图时，可以将路由定义为带有形参的数据类，例如：

```kotlin
@Serializable
data class Profile(val name: String)
```

要向目标传递实参，请在导航到目标时将实参传递给相应的类构造函数。

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("Go to profile")
}
```

然后，在目标处检索数据：

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // Use `profile.name` wherever a user's name is needed
}
```

### 导航时检索复杂数据

在目标之间导航时，请考虑仅传递必要的最少信息。反映应用程序一般状态的文件或复杂对象应存储在数据层中：当用户到达目标时，UI 应从单一可信来源加载实际数据。

例如：

*   **不要**传递完整的用户配置文件；**要**传递用户 ID 以在目标处检索配置文件。
*   **不要**传递图像对象；**要**传递 URI 或文件名，它们允许从源加载图像到目标。
*   **不要**传递应用程序状态或 ViewModels；**要**仅传递目标屏幕工作所需的信息。

这种方法有助于防止配置变更期间的数据丢失以及当引用的对象更新或变更时出现的任何不一致。

有关在应用程序中正确实现数据层的指南，请参见 [Android 的数据层文章](https://developer.android.com/topic/architecture/data-layer)。

### 管理返回栈

返回栈由 `NavController` 类控制。与任何其他栈一样，`NavController` 将新项推到栈的顶部，并从顶部弹出它们：

*   应用程序启动时，返回栈中出现的第一个条目是在 `NavHost` 中定义的起始目标。
*   默认情况下，每次 `NavController.navigate()` 调用都会将给定目标推到栈的顶部。
*   使用返回手势、返回按钮或 `NavController.popBackStack()` 方法会将当前目标从栈中弹出，并将用户返回到上一个目标。如果用户通过深层链接来到当前目标，弹出栈会将其返回到上一个应用程序。
*   或者，`NavController.navigateUp()` 函数只在 `NavController` 的上下文中在应用程序内导航用户。

Navigation 库在处理返回栈方面提供了一些灵活性。您可以：

*   指定返回栈中的特定目标并导航到它，弹出栈中位于该目标顶部（在该目标之后出现）的所有内容。
*   导航到目标 X，同时将返回栈弹出到目标 Y（通过向 `.navigate()` 调用添加 `popUpTo()` 实参）。
*   处理空返回栈的弹出（这将导致用户进入空屏幕）。
*   为应用程序的不同部分维护多个返回栈。
    例如，对于带有底部导航的应用程序，您可以为每个标签页维护单独的嵌套图，同时在标签页之间切换时保存和恢复导航状态。
    或者，您可以为每个标签页创建单独的 `NavHost`，这会使设置稍微复杂一些，但在某些情况下可能更容易跟踪。

有关详细信息和用例，请参见 [Jetpack Compose 返回栈文档](https://developer.android.com/guide/navigation/backstack)。

### 深层链接

Navigation 库允许您将特定 URI、操作或 MIME 类型与目标关联。这种关联称为 _深层链接_。

默认情况下，深层链接不暴露给外部应用程序：您需要为每个目标分发向操作系统注册相应的 URI 方案。

有关创建、注册和处理深层链接的详细信息，请参见 [深层链接](compose-navigation-deep-links.md)。

### 返回手势

多平台 Navigation 库将每个平台上的返回手势转换为导航到上一个屏幕（例如，在 iOS 上这是简单的向后滑动，在桌面端是 `<shortcut>Esc</shortcut>` 键）。

默认情况下，在 iOS 上，返回手势会触发类似原生的滑动过渡到另一个屏幕的动画。如果您使用 `enterTransition` 或 `exitTransition` 实参自定义 `NavHost` 动画，默认动画将不会触发：

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // Explicitly specifying transitions turns off default animations
    // in favor of the selected ones 
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

在 Android 上，您可以在 [manifest 文件](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive) 中启用或禁用返回手势处理程序。

在 iOS 上，处理程序默认启用。要禁用它，请在 `ViewController` 配置中设置此标志：

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 替代导航解决方案

如果基于 Compose 的导航实现不适合您，可以评估以下第三方替代方案：

| 名称                                                | 描述                                                                                                                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | 一种实用的导航方法                                                                                                                              |
| [Decompose](https://arkivanov.github.io/Decompose/) | 一种高级导航方法，涵盖了完整的生命周期和任何潜在的依赖注入                                                        |
| [Circuit](https://slackhq.github.io/circuit/)       | 一种 Compose 驱动的 Kotlin 应用程序架构，具有导航和高级状态管理。                                                            |
| [Appyx](https://bumble-tech.github.io/appyx/)       | 带有手势控制的模型驱动导航                                                                                                                    |
| [PreCompose](https://tlaster.github.io/PreCompose/) | 一种受 Jetpack Lifecycle、ViewModel、LiveData 和 Navigation 启发的导航和视图模型                                                                  |

## 下一步

Compose 导航在 Android 开发者门户中有深入的介绍。
有时此文档会使用仅限 Android 的示例，但基本指导和导航原则对于多平台是相同的：

*   [使用 Compose 导航概览](https://developer.android.com/develop/ui/compose/navigation)。
*   [Jetpack Navigation 入门页面](https://developer.android.com/guide/navigation)，其中包含有关导航图、在其中移动以及其他导航用例的子页面。