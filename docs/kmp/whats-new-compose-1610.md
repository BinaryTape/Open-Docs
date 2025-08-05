[//]: # (title: Compose Multiplatform 1.6.10 中的新特性)

以下是此功能发布中的亮点：

* [破坏性变更：新的 Compose 编译器 Gradle 插件](#breaking-change-new-compose-compiler-gradle-plugin)
* [支持带 Compose Multiplatform 资源的多模块项目](#support-for-multimodule-projects-with-Compose-Multiplatform-resources)
* [实验性的导航库](#experimental-navigation-library)
* [带实验性的通用 ViewModel 的生命周期库](#lifecycle-library)
* [已知问题：MissingResourceException](#known-issue-missingresourceexception)

有关此版本的完整变更列表，请参阅 [GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024)。

## 依赖项

* Gradle 插件 `org.jetbrains.compose`，版本 1.6.10。基于 Jetpack Compose 库：
  * [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
  * [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* Lifecycle 库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`。基于 [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0)。
* Navigation 库 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`。基于 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 破坏性变更：新的 Compose 编译器 Gradle 插件

从 Kotlin 2.0.0 开始，Compose Multiplatform 要求新的 Compose 编译器 Gradle 插件。有关详情，请参阅[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)。

## 跨平台

### 资源

#### 稳定的资源库

[资源库 API](compose-multiplatform-resources.md) 的大部分现在被认为是稳定的。

#### 支持带 Compose Multiplatform 资源的多模块项目

从 Compose Multiplatform 1.6.10 开始，你可以在任何 Gradle 模块和任何源代码集中存储资源，并发布包含资源的项目和库。

为了启用多模块支持，请将你的项目更新到 Kotlin 2.0.0 或更高版本以及 Gradle 7.6 或更高版本。

#### 跨平台资源的配置 DSL

你现在可以微调项目中的 `Res` 类生成：更改该类的模态和分配的包，并选择生成它的条件：始终、从不或仅在对资源库有显式依赖项时。

有关详情，请参阅[文档章节](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)。

#### 生成资源 URI 的公共函数

新的 `getUri()` 函数允许你将资源的平台相关的 URI 传递给外部库，以便它们可以直接访问文件。有关详情，请参阅[文档](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)。

#### 字符串资源的复数形式

你现在可以定义复数（数量字符串）以及其他跨平台字符串资源。有关详情，请参阅[文档](compose-multiplatform-resources-usage.md#plurals)。

#### 支持三字母区域设置

[语言限定符](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers) 现在支持用于区域设置的 alpha-3 (ISO 639-2) 代码。

#### 用于图片和字体的实验性的字节数组函数

你可以试用两个允许将字体和图片作为字节数组获取的函数：`getDrawableResourceBytes()` 和 `getFontResourceBytes()`。这些函数旨在帮助从第三方库访问跨平台资源。

详情请参阅[拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4651)。

### 实验性的导航库

基于 Jetpack Compose 的通用导航库现已可用。有关详情，请参阅[文档](compose-navigation-routing.md)。

此版本中的主要限制：
* [深层链接](https://developer.android.com/guide/navigation/design/deep-link)（处理或追踪它们）尚不支持。
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 函数和 [预测性返回手势](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture) 仅在 Android 上支持。

### Lifecycle 库

基于 Jetpack lifecycle 的通用 lifecycle 库现已可用，有关详情请参阅[文档](compose-lifecycle.md)。

该库主要引入用于支持通用导航功能，但它还提供了一个实验性的跨平台 `ViewModel` 实现，并包含一个你可以为你的项目实现的通用 `LifecycleOwner` 接口。

Compose Multiplatform 还提供了一个通用的 `ViewModelStoreOwner` 实现。

### 支持 Kotlin 2.0.0

Kotlin 2.0.0 随 Compose 编译器的新 Gradle 插件一起发布。要将 Compose Multiplatform 与最新编译器版本一起使用，请将插件应用于项目中的模块（有关详情，请参阅[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)）。

## 桌面

### BasicTextField2 的基本支持

`BasicTextField2` Compose 组件现在在桌面目标平台的基本层面得到支持。如果你的项目绝对需要它，或者想进行测试，请使用它，但请记住可能存在未发现的边缘情况。例如，`BasicTextField2` 目前不支持 IME 事件，因此你将无法使用中文、日文或韩文的虚拟键盘。

该组件的完全支持和对其他平台的支持计划在 Compose Multiplatform 1.7.0 版本中实现。

### DialogWindow 的 alwaysOnTop 标志

为了避免你的对话窗口被覆盖，你现在可以为 `DialogWindow` 可组合项使用 `alwaysOnTop` 标志。

有关详情，请参阅[拉取请求](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)。

## iOS

### 无障碍支持改进

在此版本中：

* 对话框和弹窗与无障碍特性正确集成，
* 使用 `UIKitView` 和 `UIKitViewController` 创建的互操作视图现在可以通过 Accessibility Services 访问，
* `LiveRegion` 语义受无障碍 API 支持，
* 支持[无障碍滚动](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)，
* 支持 `HapticFeedback`。

### iOS 17 及更高版本选择容器放大镜

iOS 上的 Compose Multiplatform 选择容器现在模拟原生放大工具。

![Screenshot of iPhone chat app with the text magnifier active](compose-1610-ios-magnifier.png){width=390}

### 对话框居中的软键盘内边距

`Dialog` 可组合项的行为现在与 Android 对齐：当软键盘出现在屏幕上时，对话框会根据应用程序窗口的有效高度居中。有一个选项可以禁用此行为，即使用 `DialogProperties.useSoftwareKeyboardInset` 属性。

## Web

### Kotlin/Wasm 支持处于 Alpha 阶段

用于 Web 的实验性的 Compose Multiplatform 现已处于 Alpha 阶段：

* 大部分 Web 功能与 Compose Multiplatform for Desktop 类似。
* 团队致力于将 Web 平台发布。
* 下一步，对大多数组件进行彻底的浏览器适配。

按照[第一个应用教程](quickstart.md) 查看如何设置并运行一个带共享 UI 代码的 Web 应用。

### 基本 IME 键盘支持

Compose Multiplatform 的 Web 目标平台现在对虚拟 (IME) 键盘有基本支持。

## Gradle 插件

### 修改 macOS 最低版本的可能性

在之前的版本中，无法在不包含 Intel 版本的情况下将 macOS 应用上传到 App Store。你现在可以在平台特有的 Compose Multiplatform 选项中为你的应用设置 macOS 的最低版本：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                minimumSystemVersion = "12.0"
            }
        }
    }
}
```

有关详情，请参阅[拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4271)。

### 支持 Proguard 创建 uber JAR 的选项

你现在可以使用 ProGuard Gradle 任务创建 uber JAR（包含应用程序和所有依赖项的 JAR 的复杂包）。

有关详情，请参阅[最小化和混淆](compose-native-distribution.md#minification-and-obfuscation)指南。

### 已知问题：MissingResourceException

从 Kotlin 1.9.x 切换到 2.0.0（或反之）后，你可能会遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 错误。要解决此问题，请删除项目中的所有 `build` 目录。这包括位于项目根目录和模块目录中的目录。