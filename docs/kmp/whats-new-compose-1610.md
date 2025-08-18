[//]: # (title: Compose Multiplatform 1.6.10 中的新特性)

以下是此特性发布的主要亮点：

*   [破坏性变更：新的 Compose 编译器 Gradle 插件](#breaking-change-new-compose-compiler-gradle-plugin)
*   [支持带有 Compose Multiplatform 资源的模块化项目](#support-for-multimodule-projects-with-compose-multiplatform-resources)
*   [实验性导航库](#experimental-navigation-library)
*   [带有实验性公共 ViewModel 的生命周期库](#lifecycle-library)
*   [已知问题：MissingResourceException](#known-issue-missingresourceexception)

关于此版本的完整变更列表，请参见 [GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024)。

## 依赖项

*   Gradle 插件 `org.jetbrains.compose`，版本 1.6.10。基于 Jetpack Compose 库：
    *   [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
    *   [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
    *   [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
    *   [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
    *   [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
    *   [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
*   Lifecycle 库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`。基于 [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0)。
*   Navigation 库 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`。基于 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 破坏性变更：新的 Compose 编译器 Gradle 插件

从 Kotlin 2.0.0 开始，Compose Multiplatform 要求使用新的 Compose 编译器 Gradle 插件。
关于详细信息，请参见[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)。

## 跨平台

### 资源

#### 稳定的资源库

[资源库 API](compose-multiplatform-resources.md) 的大部分现已被视为稳定版。

#### 支持带有 Compose Multiplatform 资源的模块化项目

从 Compose Multiplatform 1.6.10 开始，你可以在任何 Gradle 模块和任何源代码集中存储资源，并发布包含资源的[项目](project)和库。

要启用模块化支持，请将你的[项目](project)更新到 Kotlin 2.0.0 或更高版本以及 Gradle 7.6 或更高版本。

#### 多平台资源的配置 DSL

你现在可以微调[项目](project)中的 `Res` 类生成：更改该类的模态和指定包，并选择生成条件：总是、从不或仅在[显式](explicit)依赖资源库时。

关于详细信息，请参见[文档部分](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)。

#### 用于生成资源 URI 的公共函数

新的 `getUri()` [函数](function)允许你将资源的平台相关 URI 传递给外部库，以便它们可以直接访问文件。
关于详细信息，请参见[文档](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)。

#### 字符串资源的复数形式

你现在可以与其他多平台字符串资源一起定义复数（数量字符串）。
关于详细信息，请参见[文档](compose-multiplatform-resources-usage.md#plurals)。

#### 支持三字母区域设置

[语言限定符](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers)现在支持区域设置的 alpha-3 (ISO 639-2) 代码。

#### 图像和字体使用的实验性字节数组函数

你可以尝试两个允许将字体和图像作为字节数组获取的[函数](function)：`getDrawableResourceBytes()` 和 `getFontResourceBytes()`。
这些[函数](function)旨在帮助从第三方库访问多平台资源。

关于详细信息，请参见[拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4651)。

### 实验性导航库

基于 Jetpack Compose 的公共导航库现已可用。
关于详细信息，请参见[文档](compose-navigation-routing.md)。

此版本的主要限制：
*   [Deep links](https://developer.android.com/guide/navigation/design/deep-link)（处理或跟踪它们）尚不受支持。
*   `BackHandler` [函数](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button)和[预测性返回手势](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)仅在 Android 上受支持。

### 生命周期库

基于 Jetpack lifecycle 的公共生命周期库现已可用，关于详细信息，请参见[文档](compose-lifecycle.md)。

该库主要用于支持公共导航[功能](functionality)，但也提供了一个[实验性的](experimental)跨平台 `ViewModel` 实现，并包含一个你可以在[项目](project)中实现的公共 `LifecycleOwner` 接口。

Compose Multiplatform 还提供了一个通用的 `ViewModelStoreOwner` 实现。

### 支持 Kotlin 2.0.0

Kotlin 2.0.0 与新的 Compose 编译器 Gradle 插件一同发布。
要使用最新编译器版本的 Compose Multiplatform，请将插件应用到你[项目](project)中的模块（关于详细信息，请参见[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)）。

## 桌面

### BasicTextField2 的基本支持

目前，桌面[目标平台](target)已基本支持 `BasicTextField2` Compose 组件。
如果你的[项目](project)绝对需要它，或者想进行测试，请使用它，但请记住可能存在未发现的边缘情况。
例如，`BasicTextField2` 目前不支持 IME 事件，因此你将无法使用虚拟键盘输入中文、日文或韩文。

该组件的完全支持以及对其他平台的[支持](functionality)计划在 Compose Multiplatform 1.7.0 版本中发布。

### DialogWindow 的 alwaysOnTop 标志

为了避免你的对话框窗口被覆盖，你现在可以为 `DialogWindow` 可组合项使用 `alwaysOnTop` 标志。

关于详细信息，请参见[拉取请求](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)。

## iOS

### 可访问性支持改进

在此版本中：

*   对话框和弹出窗口已与可访问性[特性](feature)正确集成，
*   使用 `UIKitView` 和 `UIKitViewController` 创建的互操作视图现在可通过 Accessibility Services 访问，
*   `LiveRegion` 语义受可访问性 API 支持，
*   [可访问性滚动](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)受支持，
*   `HapticFeedback` 受支持。

### iOS 17 及更高版本上的选择容器放大镜

Compose Multiplatform 在 iOS 上的选择容器现在模拟[原生](native)放大工具。

![Screenshot of iPhone chat app with the text magnifier active](compose-1610-ios-magnifier.png){width=390}

### 用于 Dialog 居中的软键盘内边距

`Dialog` 可组合项的行为现在与 Android 对齐：当软键盘出现在屏幕上时，对话框会根据应用程序窗口的有效高度居中显示。
有一个选项可以通过 `DialogProperties.useSoftwareKeyboardInset` 属性禁用此功能。

## Web

### Kotlin/Wasm Alpha 版支持

[实验性](experimental)的 Compose Multiplatform for Web 现已进入 Alpha 阶段：

*   大部分 Web [功能](functionality)都与 Compose Multiplatform for Desktop 相同。
*   团队致力于将 Web 平台发布。
*   下一步是彻底的浏览器对大部分组件的适配。

请遵循[第一个应用教程](quickstart.md)，了解如何设置和运行带有共享 UI 代码的 Web [应用](app)。

### 基本 IME 键盘支持

Compose Multiplatform 的 Web [目标](target)现在对虚拟（IME）键盘有了基本支持。

## Gradle 插件

### 修改 macOS 最低版本的可能性

在以前的版本中，如果不包含 Intel 版本，则无法将 macOS [应用](app)上传到 App Store。
你现在可以在平台[特有的](specific) Compose Multiplatform 选项中为你的[应用](app)设置最低 macOS 版本：

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

关于详细信息，请参见[拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4271)。

### 支持 Proguard 创建 uber JAR 的选项

你现在可以使用 ProGuard Gradle [任务](task)创建 uber JAR（包含[应用程序](application)所有[依赖项](dependency)的 JAR 的复杂软件包）。

关于详细信息，请参见[代码精简和混淆](compose-native-distribution.md#minification-and-obfuscation)指南。

### 已知问题：MissingResourceException

从 Kotlin 1.9.x 切换到 2.0.0（或反之）后，你可能会遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 错误。
要解决此问题，请删除[项目](project)中的所有 `build` 目录。
这包括位于[项目](project)根目录和模块目录中的目录。