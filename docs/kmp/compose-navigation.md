[//]: # (title: Compose 中的导航)

[Android 的 Navigation 库](https://developer.android.com/guide/navigation)支持 Jetpack Compose 中的导航。
Compose Multiplatform 团队为 AndroidX Navigation 库贡献了跨平台支持。

除了在应用内的内容片段之间进行实际导航外，该库还解决了基本的导航问题：

* 以类型安全的方式在目的地之间传递数据。
* 通过保持清晰且可访问的导航历史记录，轻松跟踪用户在应用中的路径。
* 支持深层链接机制，允许将用户导航到应用中的特定位置，而无需遵循常规工作流。
* 在导航时支持统一的动画和过渡效果，并允许以最少的额外工作实现常见模式（如返回手势）。

如果您对基础知识已足够熟悉，请转到[导航与路由](compose-navigation-routing.md)，了解如何在跨平台项目中利用 Navigation 库。
否则，请继续阅读以了解该库使用的基本概念。

> 您可以在我们的[最新变化](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)中跟踪 Navigation 库跨平台版本的更改，或在 [Compose Multiplatform 更改日志](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)中关注特定的 EAP 版本。
>
{style="tip"}

## Compose 导航的基本概念

Navigation 库使用以下概念来映射导航用例：

* **导航图 (navigation graph)** 描述了应用内所有可能的目的地以及它们之间的连接。导航图可以嵌套，以适应应用中的子流。
* **目的地 (destination)** 是导航图中的一个节点，可以导航到该节点。这可以是一个可组合项、一个嵌套导航图或一个对话框。当用户导航到该目的地时，应用会显示其内容。
* **路线 (route)** 标识一个目的地并定义导航到该目的地所需的实参，但不描述 UI。通过这种方式，数据与表示形式分离，使您能够保持每个 UI 实现独立于整体应用结构。例如，这使得在项目中测试和重新排列可组合项变得更加容易。

记住这些概念后，Navigation 库实现了以下基本规则来指导您的导航架构：

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

* 应用将用户的路径表示为一个目的地堆栈，即**返回堆栈 (back stack)**。默认情况下，每当用户导航到一个新目的地时，该目的地都会被添加到堆栈顶部。您可以使用返回堆栈使导航更加直观：通过从堆栈顶部弹出当前目的地并自动返回到前一个目的地，而不是直接来回导航。
* 每个目的地可以关联一组**深层链接 (deep links)**：当应用从操作系统接收到链接时，应引导至该目的地的 URI 模式。

## 基本导航示例

要使用 Navigation 库，请将以下依赖项添加到您的 `commonMain` 源集：

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

按照以下顺序执行必要步骤来设置您的导航是有意义的：

1. 定义您的路线。为每个目的地创建一个[可序列化](https://kotlinlang.org/docs/serialization.html)对象或数据类，以保存相应目的地所需的实参。
2. 创建一个 `NavController`，它将作为您的导航接口，其在可组合项层次结构中的位置应足够高，以便所有可组合项都能访问它。`NavController` 持有应用的返回堆栈，并提供在导航图中转换目的地的方法。
3. 设计您的导航图，选择其中一条路线作为起始目的地。为此，请创建一个持有导航图（描述所有可导航目的地）的 `NavHost` 可组合项。

以下是应用内导航基础架构的一个基本示例：

```kotlin
// 创建路线
@Serializable
object Profile
@Serializable
object FriendsList

// 创建 NavController
val navController = rememberNavController()

// 创建带有由提供的目的地组成的导航图的 NavHost
NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // 您可以类似地添加更多目的地
}
```

### Navigation 库的主要类

Navigation 库提供了以下核心类型：

* `NavController`：为核心导航功能提供 API：在目的地之间转换、处理深层链接、管理返回堆栈等。
* `NavHost`：根据导航图显示当前目的地内容的可组合项。每个 `NavHost` 都有一个必填的 `startDestination` 形参：对应于用户启动应用时应该看到的第一个屏幕的目的地。
* `NavGraph`：描述应用内所有可能的目的地以及它们之间的连接。导航图通常定义为返回 `NavGraph` 的构建器 lambda，例如在 `NavHost` 声明中。

除了核心类型的功能外，Navigation 组件还提供动画和过渡效果、深层链接支持、类型安全、`ViewModel` 支持以及其他用于处理应用导航的便捷功能。

## 导航用例

### 转到目的地

要导航到目的地，请调用 `NavController.navigate()` 函数。继续上面的示例：

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("Go to profile")
}
```

### 向目的地传递实参

在设计导航图时，您可以将路线定义为带有参数的数据类，例如：

```kotlin
@Serializable
data class Profile(val name: String)
```

要在导航到目的地时传递实参，请在导航时将实参传递给相应的类构造函数。

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("Go to profile")
}
```

然后在目的地检索数据：

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // 在任何需要用户名的地方使用 `profile.name`
}
```

### 导航时检索复杂数据

在目的地之间导航时，请考虑仅在它们之间传递最必要的最小信息。反映应用总体状态的文件或复杂对象应存储在数据层中：当用户到达目的地时，UI 应从单一事实来源加载实际数据。

例如：

* **不要**传递整个用户配置文件；**要**传递用户 ID 以在目的地检索配置文件。
* **不要**传递图像对象；**要**传递 URI 或文件名，以便在目的地从源加载图像。
* **不要**传递应用状态或 `ViewModel`；**要**仅传递目的地屏幕工作所需的信息。

这种方法有助于防止配置更改期间的数据丢失，以及在引用的对象被更新或更改时产生任何不一致。

有关在应用中正确实现数据层的指南，请参阅 [Android 关于数据层的文章](https://developer.android.com/topic/architecture/data-layer)。

### 管理返回堆栈

返回堆栈由 `NavController` 类控制。与任何其他堆栈一样，`NavController` 将新项压入堆栈顶部并从顶部弹出：

* 应用启动时，返回堆栈中出现的第一个条目是在 `NavHost` 中定义的起始目的地。
* 每个 `NavController.navigate()` 调用默认都会将给定的目的地压入堆栈顶部。
* 使用返回手势、返回按钮或 `NavController.popBackStack()` 方法会将当前目的地从堆栈中弹出，并将用户返回到上一个目的地。如果用户是通过深层链接到达当前目的地的，则弹出堆栈将使他们返回到上一个应用。或者，`NavController.navigateUp()` 函数仅在 `NavController` 的上下文中在应用内导航用户。

Navigation 库允许在处理返回堆栈时具有一定的灵活性。您可以：

* 指定返回堆栈中的特定目的地并导航到它，弹出堆栈中该目的地之上（之后进入）的所有内容。
* 导航到目的地 X，同时弹出返回堆栈直到目的地 Y（通过向 `.navigate()` 调用添加 `popUpTo()` 实参）。
* 处理弹出空返回堆栈的情况（这会使用户停留在空白屏幕上）。
* 为应用的不同部分维护多个返回堆栈。例如，对于带有底部导航的应用，您可以为每个选项卡维护单独的嵌套图，并在选项卡之间切换时保存和恢复导航状态。或者，您可以为每个选项卡创建单独的 `NavHost`，这会使设置稍微复杂一些，但在某些情况下可能更容易跟踪。

有关详细信息和用例，请参阅 [Jetpack Compose 关于返回堆栈的文档](https://developer.android.com/guide/navigation/backstack)。

### 深层链接

Navigation 库允许您将特定的 URI、操作或 MIME 类型与目的地关联。这种关联称为**深层链接 (deep link)**。

默认情况下，深层链接不会暴露给外部应用：您需要为每个目标发行版向操作系统注册适当的 URI 方案。

有关创建、注册和处理深层链接的详细信息，请参阅[深层链接](compose-navigation-deep-links.md)。

### 返回手势

跨平台 Navigation 库将每个平台上的返回手势转换为导航到上一个屏幕（例如，在 iOS 上这是一个简单的向后滑动，在桌面上则是 <shortcut>Esc</shortcut> 键）。

默认情况下，在 iOS 上，返回手势会触发类似于原生的滑动过渡动画到另一个屏幕。如果您使用 `enterTransition` 或 `exitTransition` 实参自定义 `NavHost` 动画，则不会触发默认动画：

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // 显式指定过渡会关闭默认动画，
    // 以支持所选的动画 
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

在 Android 上，您可以在[清单文件](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive)中启用或禁用返回手势处理程序。

在 iOS 上，该处理程序默认启用。要禁用它，请在 `ViewController` 配置中设置此标志：

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 替代导航解决方案

如果基于 Compose 的导航实现不适合您，还有一些第三方替代方案可供评估：

| 名称 | 描述 |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | 一种务实的导航方法 |
| [Decompose](https://arkivanov.github.io/Decompose/) | 一种高级导航方法，涵盖了完整的生命周期和任何潜在的依赖项注入 |
| [Circuit](https://slackhq.github.io/circuit/)       | 适用于具有导航和高级状态管理的 Kotlin 应用程序的 Compose 驱动架构。 |
| [Appyx](https://bumble-tech.github.io/appyx/)       | 带有手势控制的模型驱动导航 |
| [PreCompose](https://tlaster.github.io/PreCompose/) | 受 Jetpack Lifecycle、ViewModel、LiveData 和 Navigation 启发的导航和视图模型 |

如果您的目标平台是 iOS 并且希望在导航 UI 中实现系统渲染的效果（如 [Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass)），请考虑[将导航迁移到原生 SwiftUI](ios-liquid-glass.md)，同时保留 Compose 用于屏幕内容。

## 下一步

Android 开发者门户对 Compose 导航进行了深入介绍。虽然该文档有时使用仅限 Android 的示例，但跨平台的基本指南和导航原则是相同的：

* [Compose 导航概览](https://developer.android.com/develop/ui/compose/navigation)。
* [Jetpack Navigation 入门页面](https://developer.android.com/guide/navigation)，包含有关导航图、在其间移动以及其他导航用例的子页面。