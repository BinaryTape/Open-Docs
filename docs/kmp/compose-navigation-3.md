[//]: # (title: Compose Multiplatform 中的 Navigation 3)
<primary-label ref="alpha"/>

[Android 的 Navigation 库](https://developer.android.com/guide/navigation)已升级到 Navigation 3，引入了一种专为 Compose 设计并考虑了对该库先前版本反馈的重新设计的导航方式。
从 1.10 版本开始，Compose Multiplatform 支持在所有支持平台（Android、iOS、桌面和 Web）的多平台项目中采用 Navigation 3。

## 关键变化

Navigation 3 不仅仅是该库的一个新版本——在许多方面，它完全是一个全新的库。
要了解此次重新设计背后的理念，请参阅 [Android 开发者博客文章](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)。

Navigation 3 的关键变化包括：

* **用户拥有的返回栈**。不再操作单一的库返回栈，而是创建并管理一个由 UI 直接观察的状态 `SnapshotStateList`。
* **低层级构建块**。得益于与 Compose 更紧密的集成，该库在实现自定义导航组件和行为方面提供了更高的灵活性。
* **自适应布局系统**。通过自适应设计，您可以同时显示多个目的地，并在布局之间无缝切换。

在 [Android 文档](https://developer.android.com/guide/navigation/navigation-3)中详细了解 Navigation 3 的通用设计。

## 依赖项设置

要试用 Navigation 3 的多平台实现，请将以下依赖项添加到您的版本编目（version catalog）中：

```text
[versions]
multiplatform-nav3-ui = "1.0.0-alpha05"

[libraries]
jetbrains-navigation3-ui = { module = "org.jetbrains.androidx.navigation3:navigation3-ui", version.ref = "multiplatform-nav3-ui" }
```

> 虽然 Navigation 3 发布为两个构件：`navigation3:navigation3-ui` 和 `navigation3:navigation3-common`，但只有 `navigation3-ui` 拥有独立的 Compose Multiplatform 实现。
> 对 `navigation3-common` 的依赖项会通过传递方式添加。
>
{style="note"}

对于使用 Material 3 Adaptive 和 ViewModel 库的项目，还需添加以下导航支持构件：
```text
[versions]
compose-multiplatform-adaptive = "1.3.0-alpha02"
compose-multiplatform-lifecycle = "2.10.0-alpha05"

[libraries]
jetbrains-material3-adaptiveNavigation3 = { module = "org.jetbrains.compose.material3.adaptive:adaptive-navigation3", version.ref = "compose-multiplatform-adaptive" }
jetbrains-lifecycle-viewmodelNavigation3 = { module = "org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3", version.ref = "compose-multiplatform-lifecycle" }
```

最后，您可以试用由 JetBrains 工程师创建的[概念验证库](https://github.com/terrakok/navigation3-browser)。该库将多平台 Navigation 3 与 Web 上的浏览器历史记录导航集成在一起：

```text
[versions]
compose-multiplatform-navigation3-browser = "0.2.0"

[libraries]
navigation3-browser = { module = "com.github.terrakok:navigation3-browser", version.ref = "compose-multiplatform-navigation3-browser" }
```

预计基础多平台 Navigation 3 库将在 1.1.0 版本中支持浏览器历史记录导航。

## 多平台支持

Navigation 3 与 Compose 紧密对齐，允许 Android 导航实现只需极少的改动即可在通用的 Compose Multiplatform 代码中运行。
为了支持 Web 和 iOS 等非 JVM 平台，您唯一需要做的就是实现[目的地键的多态序列化](#目的地键的多态序列化)。

您可以在 GitHub 上对比使用 Navigation 3 的纯 Android 应用与多平台应用的详尽示例：
* [包含 Navigation 3 方案的原始 Android 仓库](https://github.com/android/nav3-recipes)
* [包含大部分相同方案的 Compose Multiplatform 项目](https://github.com/terrakok/nav3-recipes)

### 目的地键的多态序列化

在 Android 上，Navigation 3 依赖于基于反射的序列化，这在针对 iOS 等非 JVM 平台时不可用。
考虑到这一点，该库为 `rememberNavBackStack()` 函数提供了两个重载：

* [第一个重载](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(kotlin.Array))仅接收一组 `NavKey` 引用，且需要基于反射的序列化程序。
* [第二个重载](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(androidx.savedstate.serialization.SavedStateConfiguration,kotlin.Array))还接收一个 `SavedStateConfiguration` 参数，允许您提供 `SerializersModule` 并跨所有平台正确处理开放多态性。

在 Navigation 3 多平台示例中，多态序列化可能如下所示 [like this](https://github.com/terrakok/nav3-recipes/blob/8ff455499877225b638d5fcd82b232834f819422/sharedUI/src/commonMain/kotlin/com/example/nav3recipes/basicdsl/BasicDslActivity.kt#L40)：

```kotlin
@Serializable
private data object RouteA : NavKey

@Serializable
private data class RouteB(val id: String) : NavKey

// 为开放多态性创建所需的序列化配置
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

Android 开发者门户对 Navigation 3 进行了深入介绍。虽然某些文档使用了 Android 特有的示例，但其核心概念和导航原则在所有平台上保持一致：

* [Navigation 3 概览](https://developer.android.com/guide/navigation/navigation-3)，包含关于管理状态、导航代码模块化以及动画的建议。
* [从 Navigation 2 迁移到 Navigation 3](https://developer.android.com/guide/navigation/navigation-3/migration-guide)。将 Navigation 3 视为一个全新的库比将其视为现有库的新版本更容易，因此这与其说是迁移，不如说是重写。但该指南指出了应采取的常规步骤。