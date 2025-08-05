[//]: # (title: Compose 中的导航)

Android 的 [Navigation 库](https://developer.android.com/guide/navigation)支持 Jetpack Compose 中的导航。Compose Multiplatform 团队为 AndroidX Navigation 库贡献了多平台支持。

除了应用内实际的内容间导航外，该库还解决了基本的导航问题：

* 以类型安全的方式在目标之间传递实参。
* 通过维护清晰且易于访问的导航历史，轻松追踪用户在应用中的旅程。
* 支持深层链接（deep linking）机制，允许在常规工作流之外将用户导航到应用中的特定位置。
* 支持导航时统一的动画和过渡，并且允许常见的模式（例如返回手势），只需极少额外工作。

如果你对基础知识足够熟悉，请转到 [](compose-navigation-routing.md)，了解如何在跨平台项目中利用 Navigation 库。否则，请继续阅读以了解该库所使用的基本概念。

> 你可以在 Navigation 库的多平台版本中追踪更改，请参阅我们的 [最新动态](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)
> 或关注 [Compose Multiplatform 变更日志](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md) 中的特定抢先体验预览版本。
>
{style="tip"}

## Compose 导航的基本概念

Navigation 库使用以下概念来映射导航用例：

* _导航图_描述了应用内所有可能的目标以及它们之间的连接。导航图可以嵌套以适应应用中的子流程。
* _目标_是导航图中的一个可导航节点。这可以是一个 composable、一个嵌套导航图或一个对话框。当用户导航到目标时，应用会显示其内容。
* _路由_标识一个目标并定义导航到它所需的实参，但不描述 UI。这样，数据与表示分离，允许你使每个 UI 实现独立于整体应用结构。例如，这使得测试和重新排列项目中的 composable 变得更容易。

牢记这些概念，Navigation 库实现了以下基本规则来指导你的导航架构：

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

* 应用将用户路径表示为目标栈，或称 _返回栈_。默认情况下，每当用户导航到一个新目标时，该目标都会被添加到栈顶。你可以使用返回栈使导航更直观：无需直接来回导航，你可以从栈顶弹出当前目标并自动返回到上一个目标。
* 每个目标都可以关联一组 _深层链接_：当应用从操作系统接收到链接时，应导致该目标的 URI 模式。

## 基本导航示例

要使用 Navigation 库，请将以下依赖项添加到你的 `commonMain` 源代码集：

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

设置导航时，按以下顺序处理必要步骤会更有意义：

1. 定义你的路由。为每个目标创建一个 [可序列化](https://kotlinlang.org/docs/serialization.html) 对象或数据类，以保存相应目标所需的实参。
2. 创建一个 `NavController`，它将作为你的导航接口，在 composable 层次结构中足够高，以便所有 composable 都可以访问它。NavController 持有应用的返回栈，并提供在导航图中的目标之间进行过渡的方法。
3. 设计你的导航图，选择其中一个路由作为起始目标。为此，创建一个持有导航图（描述所有可导航目标）的 `NavHost` composable。

以下是应用内导航基础的一个基本示例：

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

Navigation 库提供了以下核心类型：

* `NavController`。提供核心导航功能的 API：在目标之间过渡、处理深层链接、管理返回栈等等。
<!--You should create the `NavController` high in your composable hierarchy, high enough that all the composables
    that need to reference it can do so.
    This way, you can use the `NavController` as the single source of truth for updating composables outside of your screens.
    [NB: This doesn't seem to be useful to people who are trying to cover the basics.]-->
* `NavHost`。一个 composable，它根据导航图显示当前目标的内容。每个 NavHost 都有一个必需的 `startDestination` 形参：即用户启动应用时应看到的第一个屏幕所对应的目标。
* `NavGraph`。描述了应用内所有可能的目标以及它们之间的连接。导航图通常被定义为返回 `NavGraph` 的构建器 lambda 表达式，例如在 `NavHost` 声明中。

除了核心类型功能之外，Navigation 组件还提供了动画和过渡、对深层链接的支持、类型安全、`ViewModel` 支持以及其他用于处理应用导航的实用功能。

## 导航用例

### 前往目标

要导航到目标，请调用 `NavController.navigate()` 函数。继续上面的示例：

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("Go to profile")
}
```

### 给目标传递实参

设计导航图时，你可以将路由定义为带有形参的数据类，例如：

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

然后在目标处检索数据：

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // 在需要用户名称的任何地方使用 profile.name
}
```

### 导航时检索复杂数据

在目标之间导航时，考虑只在它们之间传递最少必要的信息。反映应用总体状态的文件或复杂对象应存储在数据层中：当用户到达某个目标时，UI 应从单一事实来源加载实际数据。

例如：

* **不要**传递完整的用户资料；**要**传递用户 ID，以便在目标处检索资料。
* **不要**传递图像对象；**要**传递 URI 或文件名，以便在目标处从源加载图像。
* **不要**传递应用状态或 ViewModels；**要**只传递目标屏幕正常工作所需的信息。

这种方法有助于防止在配置更改期间数据丢失，以及当引用的对象被更新或变异时产生任何不一致。

关于在应用中正确实现数据层的指导，请参见 [Android 关于数据层的文章](https://developer.android.com/topic/architecture/data-layer)。

### 管理返回栈

返回栈由 `NavController` 类控制。与任何其他栈一样，`NavController` 将新项推到栈顶并从栈顶弹出它们：

* 当应用启动时，出现在返回栈中的第一个条目是在 NavHost 中定义的起始目标。
* 每次 `NavController.navigate()` 调用默认将给定目标推到栈顶。
* 使用返回手势、返回按钮或 `NavController.popBackStack()` 方法会从栈中弹出当前目标，并将用户返回到上一个目标。如果用户通过深层链接到达当前目标，弹出栈会将他们返回到上一个应用。另外，`NavController.navigateUp()` 函数只在 `NavController` 的上下文内将用户导航到应用内部。

Navigation 库在处理返回栈方面提供了一些灵活性。你可以：

* 在返回栈中指定一个特定目标并导航到它，弹出栈中在该目标之上（即在该目标之后出现）的所有内容。
* 导航到目标 X，同时将返回栈弹出到目标 Y（通过向 `.navigate()` 调用添加 `popUpTo()` 实参）。
* 处理弹出空返回栈（这会将用户带到一个空白屏幕）。
* 为应用的不同部分维护多个返回栈。例如，对于带有底部导航的应用，你可以为每个标签页维护单独的嵌套图，同时在标签页之间切换时保存和恢复导航状态。另外，你可以为每个标签页创建单独的 NavHosts，这会使设置稍微复杂一些，但在某些情况下可能更容易追踪。

关于 [Jetpack Compose 返回栈文档](https://developer.android.com/guide/navigation/backstack) 的详情和用例，请参见此文档。

### 深层链接

Navigation 库允许你将特定 URI、动作或 MIME 类型与目标关联。这种关联称为 _深层链接_。

默认情况下，深层链接不会暴露给外部应用：你需要为每个目标分发向操作系统注册相应的 URI 方案。

关于创建、注册和处理深层链接的详情，请参见 [](compose-navigation-deep-links.md)。

### 返回手势

多平台 Navigation 库将各个平台上的返回手势转换为导航到上一个屏幕（例如，在 iOS 上这是简单的向后轻扫，在桌面端则是 <shortcut>Esc</shortcut> 键）。

默认情况下，在 iOS 上返回手势会触发类似原生的屏幕滑动过渡动画。如果你使用 `enterTransition` 或 `exitTransition` 实参自定义 NavHost 动画，则默认动画将不会触发：

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // 显式指定过渡会关闭默认动画
    // 转而使用选定的动画 
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

在 Android 上，你可以在 [manifest 文件](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive) 中启用或禁用返回手势处理程序。

在 iOS 上，该处理程序默认启用。要禁用它，请在 ViewController 配置中设置此标志：

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 替代导航方案

如果基于 Compose 的导航实现不适合你，可以评估第三方替代方案：

| 名称 | 描述 |
|---|---|
| [Voyager](https://voyager.adriel.cafe) | 一种实用的导航方法 |
| [Decompose](https://arkivanov.github.io/Decompose/) | 一种高级导航方法，涵盖了完整的生命周期和任何潜在的依赖注入 |
| [Circuit](https://slackhq.github.io/circuit/) | 一种 Compose 驱动的架构，适用于具备导航和高级状态管理的 Kotlin 应用程序。 |
| [Appyx](https://bumble-tech.github.io/appyx/) | 带有手势控制的模型驱动导航 |
| [PreCompose](https://tlaster.github.io/PreCompose/) | 一种导航和视图模型，灵感来源于 Jetpack Lifecycle、ViewModel、LiveData 和 Navigation |

## 接下来

Compose 导航在 Android 开发者门户上进行了深入介绍。有时此文档仅使用 Android 示例，但基本指导和导航原则对于多平台是相同的：

* [使用 Compose 进行导航概述](https://developer.android.com/develop/ui/compose/navigation)。
* [Jetpack Navigation 的起始页](https://developer.android.com/guide/navigation)，包含关于导航图、在它们之间移动以及其他导航用例的子页面。