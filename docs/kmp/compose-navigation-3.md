[//]: # (title: Compose Multiplatform 中的 Navigation 3)
<primary-label ref="alpha"/>

[Android 的 Navigation 库](https://developer.android.com/guide/navigation) 已升级到 Navigation 3，引入了一种重新设计的导航方法，该方法与 Compose 协同工作，并考虑了对该库先前版本的反馈。从 1.10 版本开始，Compose Multiplatform 支持在多平台项目中为所有支持的平台采用 Navigation 3：Android、iOS、桌面和 Web。

## 主要变化

Navigation 3 不仅仅是该库的一个新版本，在许多方面，它是一个全新的库。关于此重新设计背后的理念，请参见 [Android 开发者博客文章](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)。

Navigation 3 的主要变化包括：

*   **用户拥有的返回栈**。您不再操作单个库返回栈，而是创建和管理一个 `SnapshotStateList` 状态，UI 会直接观察这些状态。
*   **低层构建块**。得益于与 Compose 更紧密的集成，该库在实现您自己的导航组件和行为方面提供了更大的灵活性。
*   **自适应布局系统**。通过自适应设计，您可以同时显示多个目标，并在布局之间无缝切换。

关于 Navigation 3 的总体设计，请参阅 [Android 文档](https://developer.android.com/guide/navigation/navigation-3)。

## 依赖项设置

要试用 Navigation 3 的多平台实现，请将以下依赖项添加到您的版本目录中：

```text
[versions]
multiplatform-nav3-ui = "1.0.0-alpha05"

[libraries]
jetbrains-navigation3-ui = { module = "org.jetbrains.androidx.navigation3:navigation3-ui", version.ref = "multiplatform-nav3-ui" }
```

> 尽管 Navigation 3 作为两个 artifact 发布，即 `navigation3:navigation3-ui` 和 `navigation3:navigation3-common`，
> 只有 `navigation-ui` 需要单独的 Compose Multiplatform 实现。
> 对 `navigation3-common` 的依赖项会以传递方式添加。
>
{style="note"}

对于使用 Material 3 Adaptive 和 ViewModel 库的项目，请同时添加以下导航支持 artifact：

```text
[versions]
compose-multiplatform-adaptive = "1.3.0-alpha02"
compose-multiplatform-lifecycle = "2.10.0-alpha05"

[libraries]
jetbrains-material3-adaptiveNavigation3 = { module = "org.jetbrains.compose.material3.adaptive:adaptive-navigation3", version.ref = "compose-multiplatform-adaptive" }
jetbrains-lifecycle-viewmodelNavigation3 = { module = "org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3", version.ref = "compose-multiplatform-lifecycle" }
```

最后，您可以试用由 JetBrains 工程师创建的 [概念验证库](https://github.com/terrakok/navigation3-browser)。该库将多平台 Navigation 3 与 Web 上的浏览器历史导航进行了集成：

```text
[versions]
compose-multiplatform-navigation3-browser = "0.2.0"

[libraries]
navigation3-browser = { module = "com.github.terrakok:navigation3-browser", version.ref = "compose-multiplatform-navigation3-browser" }
```

基础多平台 Navigation 3 库预计将在 1.1.0 版本中支持浏览器历史导航。

## 多平台支持

Navigation 3 与 Compose 紧密结合，使得 Android 导航实现能够在公共 Compose Multiplatform 代码中以最少的更改工作。为了支持 Web 和 iOS 等非 JVM 平台，您唯一需要做的就是实现[目标键的多态序列化](#polymorphic-serialization-for-destination-keys)。

您可以在 GitHub 上比较使用 Navigation 3 的 Android 专属应用和多平台应用的丰富示例：
*   [包含 Navigation 3 秘籍的原始 Android 版本库](https://github.com/android/nav3-recipes)
*   [包含大部分相同秘籍的 Compose Multiplatform 项目](https://github.com/terrakok/nav3-recipes)

### 目标键的多态序列化

在 Android 上，Navigation 3 依赖于基于反射的序列化，这在面向 iOS 等非 JVM 平台时不可用。为了考虑到这一点，该库为 `rememberNavBackStack()` 函数提供了两个重载：

*   [第一个重载](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(kotlin.Array)) 只接受一组 `NavKey` 引用，并需要一个基于反射的序列化器。
*   [第二个重载](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(androidx.savedstate.serialization.SavedStateConfiguration,kotlin.Array)) 还接受一个 `SavedStateConfiguration` 形参，允许您提供一个 `SerializersModule` 并在所有平台上正确处理开放多态。

在 Navigation 3 多平台示例中，多态序列化可能看起来[像这样](https://github.com/terrakok/nav3-recipes/blob/8ff455499877225b638d5fcd82b232834f819422/sharedUI/src/commonMain/kotlin/com/example/nav3recipes/basicdsl/BasicDslActivity.kt#L40)：

```kotlin
@Serializable
private data object RouteA : NavKey

@Serializable
private data class RouteB(val id: String) : NavKey

// 为开放多态创建所需的序列化配置
private val config = SavedStateConfiguration {
    serializersModule = SerializersModule {
        polymorphic(NavKey::class) {
            subclass(RouteA::class, RouteA.serializer())
            subclass(RouteB::class, RouteB.serializer())
        }
    }
}

@Composable
fun BasicDslActivity() {
    // 使用序列化配置
    val backStack = rememberNavBackStack(config, RouteA)

    NavDisplay(
        backStack = backStack,
        //...
    )
}
```

## 后续步骤

Android 开发者门户深入介绍了 Navigation 3。虽然有些文档使用了 Android 特有的示例，但核心概念和导航原则在所有平台上都保持一致：

*   [Navigation 3 概述](https://developer.android.com/guide/navigation/navigation-3)，其中包含关于管理状态、模块化导航代码和动画的建议。
*   [从 Navigation 2 迁移到 Navigation 3](https://developer.android.com/guide/navigation/navigation-3/migration-guide)。将 Navigation 3 视为一个新库而非现有库的新版本会更容易理解，因此它与其说是迁移，不如说是重写。但该指南指出了要采取的通用步骤。