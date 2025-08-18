[//]: # (title: Compose Multiplatform 1.6.10-rc02 新特性)

以下是此抢先体验预览特性发布中的亮点：

* [支持带有 Compose Multiplatform 资源的模块化项目](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [实验性的导航库](#experimental-navigation-library)
* [带有实验性通用 ViewModel 的生命周期库](#lifecycle-library)
* [已知问题](#known-issues)

关于此版本的完整变更列表，请参见 [GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-beta01-april-2024)。

## 依赖项

* Gradle 插件 `org.jetbrains.compose`，版本 1.6.10-rc01。基于 Jetpack Compose 库：
  * [Compiler 1.5.13](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.13)
  * [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* 生命周期库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0-rc02`。基于 [Jetpack Lifecycle 2.8.0-rc01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0-rc01)。
* 导航库 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha05`。基于 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 破坏性变更

### Kotlin 2.0.0 需要新的 Compose 编译器 Gradle 插件

从 Kotlin 2.0.0-RC2 开始，Compose Multiplatform 需要新的 Compose 编译器 Gradle 插件。
关于详细信息，请参见[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)。

## 跨平台

### 资源

#### 稳定的资源库

[资源库 API](compose-multiplatform-resources.md) 的大部分现已稳定。

#### 支持带有 Compose Multiplatform 资源的多模块项目

从 Compose Multiplatform 1.6.10-beta01 开始，你可以在任意 Gradle 模块和任意源代码集中存储资源，并发布包含资源的[项目]和库。

要启用多模块支持，请将你的项目更新到 Kotlin 2.0.0 或更高版本以及 Gradle 7.6 或更高版本。

#### 多平台资源的配置 DSL

你现在可以微调项目中的 `Res` 类生成：修改类的模态和指定包，并选择其生成条件：始终、从不或仅在对资源库有显式依赖项时。

关于详细信息，请参见[文档部分](compose-multiplatform-resources.md#configuration)。

#### 用于生成资源 URI 的公共函数

新的 `getUri()` 函数允许你将资源的平台特有 URI 传递给外部库，以便它们可以直接访问文件。
关于详细信息，请参见[文档](compose-multiplatform-resources.md#accessing-multiplatform-resources-from-external-libraries)。

#### 字符串资源的复数形式

你现在可以定义复数形式（数量字符串）以及其他多平台字符串资源。
关于详细信息，请参见[文档](compose-multiplatform-resources.md#plurals)。

#### 支持三字母语言环境

[语言限定符](compose-multiplatform-resources.md#language-and-regional-qualifiers) 现在支持语言环境的 alpha-3 (ISO 639-2) 代码。

#### 实验性的图像和字体字节数组函数

你可以试用两个允许将字体和图像作为字节数组获取的函数：`getDrawableResourceBytes` 和 `getFontResourceBytes`。
这些函数旨在帮助从第三方库访问多平台资源。

详细信息请参见 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/4651)。

### 实验性的导航库

基于 Jetpack Compose 的通用导航库现已可用。
关于详细信息，请参见[文档](compose-navigation-routing.md)。

此版本的主要限制：
* [深层链接](https://developer.android.com/guide/navigation/design/deep-link)（处理或跟踪它们）尚不支持。
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 函数和[预测性返回手势](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)仅在 Android 上受支持。

### 生命周期库

基于 Jetpack lifecycle 的通用生命周期库现已可用，关于详细信息，请参见[文档](compose-lifecycle.md)。

此库主要引入以支持通用导航功能，但它也提供一个实验性的跨平台 `ViewModel` 实现，并包含一个你可以为你的项目实现的通用 `LifecycleOwner` 接口。

Compose Multiplatform 还提供一个通用的 `ViewModelStoreOwner` 实现。

### 支持 Kotlin 2.0.0

Kotlin 2.0.0-RC2 与新的 Compose 编译器 Gradle 插件一同发布。
要将 Compose Multiplatform 与最新编译器版本一同使用，请将插件应用到你项目中的模块（关于详细信息，请参见[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)）。

## 桌面

### BasicTextField2 的基本支持

`BasicTextField2` Compose 组件现在已在桌面目标上基础层面受支持。
如果你的项目绝对需要它，或者你只是想测试它，那么可以使用它，但请记住可能存在未发现的边缘情况。
例如，`BasicTextField2` 目前不支持 IME 事件，因此你将无法使用中文、日文或韩文的虚拟键盘。

对该组件的完整支持以及对其他平台的支持计划在 Compose Multiplatform 1.7.0 版本中实现。

### DialogWindow 的 alwaysOnTop 标志

为避免你的对话窗口被覆盖，你现在可以为 `DialogWindow composable` 使用 `alwaysOnTop` 标志。

关于详细信息，请参见 [pull request](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)。

## iOS

### 无障碍支持改进

在此版本中：

* 对话框和弹出窗口已与无障碍特性正确集成，
* 使用 `UIKitView` 和 `UIKitViewController` 创建的互操作视图现在可通过无障碍服务访问，
* `LiveRegion` 语义受无障碍 API 支持，
* [无障碍滚动](https://github.com/JetBrains/compose-multiplatform-core/pull/1169) 受支持，
* `触觉反馈` 受支持。

### iOS 17 及更高版本选择容器放大镜

iOS 上的 Compose Multiplatform 选择容器现在模拟原生放大工具。

![Screenshot of iPhone chat app with the text magnifier active](compose-1610-ios-magnifier.png){width=390}

### Dialog 居中时软件键盘内边距

`Dialog composable` 的行为现在与 Android 对齐：当软件键盘出现在屏幕上时，对话框会考虑应用程序窗口的有效高度进行居中。
可以使用 `DialogProperties.useSoftwareKeyboardInset` 属性禁用此选项。

## Web

### IME 键盘基本支持

Compose Multiplatform 的 Web 目标现在拥有对虚拟 (IME) 键盘的基本支持。

## Gradle 插件

### 修改 macOS 最低版本的可能性

在以前的版本中，无法在不包含 Intel 版本的情况下将 macOS 应用上传到 App Store。
你现在可以在平台特有的 Compose Multiplatform 选项中为你的应用设置一个最低 macOS 版本：

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

关于详细信息，请参见 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/4271)。

### 使用 ProGuard 支持创建 uber JAR 的选项

你现在可以使用 ProGuard Gradle 任务创建 uber JAR（包含应用程序及其所有依赖项 JAR 的复杂包）。

关于详细信息，请参见 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/4136)。

<!--TODO add link to the GitHub tutorial mentioned in PR when it's updated  -->

## 已知问题

### MissingResourceException

将 Kotlin 版本从 1.9.x 更改为 2.0.0（或反之）后，你可能会遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 错误。
要解决此问题，请删除你项目中的 `build` 目录：这包括位于你项目根目录和模块文件夹中的文件夹。

### NativeCodeGeneratorException

iOS 编译项可能会在某些项目中失败并出现以下错误：

```
org.jetbrains.kotlin.backend.konan.llvm.NativeCodeGeneratorException: Exception during generating code for following declaration: private fun $init_global()
```

关于详细信息，请关注 [GitHub issue](https://github.com/JetBrains/compose-multiplatform/issues/4809)。