[//]: # (title: Compose Multiplatform 1.6.10-rc02 最新变化)

以下是此抢先体验计划功能版本的亮点：

* [支持包含 Compose Multiplatform 资源的多模块项目](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [实验性导航库](#experimental-navigation-library)
* [包含实验性通用 ViewModel 的 Lifecycle 库](#lifecycle-library)
* [已知问题](#known-issues)

请参阅 [GitHub 上的](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-beta01-april-2024)此版本的完整变更列表。

## 依赖项

* Gradle 插件 `org.jetbrains.compose` 版本 1.6.10-rc01。基于 Jetpack Compose 库：
  * [Compiler 1.5.13](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.13)
  * [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* Lifecycle 库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0-rc02`。基于 [Jetpack Lifecycle 2.8.0-rc01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0-rc01)。
* 导航库 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha05`。基于 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 破坏性变更

### Kotlin 2.0.0 需要新的 Compose 编译器 Gradle 插件

从 Kotlin 2.0.0-RC2 开始，Compose Multiplatform 需要新的 Compose 编译器 Gradle 插件。
详见[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)。

## 跨平台

### 资源

#### 稳定的资源库

[资源库 API](compose-multiplatform-resources.md) 的主体部分现已被视为稳定。

#### 支持包含 Compose Multiplatform 资源的多模块项目

从 Compose Multiplatform 1.6.10-beta01 开始，
您可以将资源存储在任何 Gradle 模块和任何源集中，还可以发布包含资源的项项目和库。

要启用多模块支持，请将您的项目更新到 Kotlin 2.0.0 或更新版本，并将 Gradle 更新到 7.6 或更新版本。

#### 多平台资源的配置 DSL

您现在可以微调项目中 `Res` 类的生成：更改类的 modality 和分配的软件包，以及选择生成条件：始终、从不或仅在显式依赖资源库时生成。

详见[文档部分](compose-multiplatform-resources.md#configuration)。

#### 生成资源 URI 的公开函数

新的 `getUri()` 函数允许您将资源的平台相关 URI 传递给外部库，以便它们可以直接访问该文件。
详见[文档](compose-multiplatform-resources.md#accessing-multiplatform-resources-from-external-libraries)。

#### 字符串资源的复数形式

您现在可以与其他多平台字符串资源一起定义复数（数量字符串）。
详见[文档](compose-multiplatform-resources.md#plurals)。

#### 支持三字母区域性

[语言限定符](compose-multiplatform-resources.md#language-and-regional-qualifiers)现在支持区域性的 alpha-3 (ISO 639-2) 代码。 

#### 用于图像和字体的实验性字节数组函数

您可以试用两个允许以字节数组形式获取字体和图像的函数：
`getDrawableResourceBytes` 和 `getFontResourceBytes`。
这些函数旨在帮助从第三方库访问多平台资源。

详见 [拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4651) 中的详细信息。

### 实验性导航库

基于 Jetpack Compose 的通用导航库现已推出。
详见[文档](compose-navigation-routing.md)。

此版本的主要限制：
* 尚不支持[深层链接](https://developer.android.com/guide/navigation/design/deep-link)（处理或跟随它们）。
* `BackHandler` 函数和[预测性返回手势](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)仅在 Android 上受支持。

### Lifecycle 库

基于 Jetpack lifecycle 的通用 Lifecycle 库现已推出，详见[文档](compose-lifecycle.md)。

该库引入的主要目的是为了支持通用导航功能，但它也提供了实验性的跨平台 `ViewModel` 实现，并包含一个可为您项目实现的通用 `LifecycleOwner` 接口。

Compose Multiplatform 还提供了一个通用的 `ViewModelStoreOwner` 实现。

### 支持 Kotlin 2.0.0

Kotlin 2.0.0-RC2 随新的 Compose 编译器 Gradle 插件一起发布。
要在最新的编译器版本中使用 Compose Multiplatform，请将插件应用于项目中的模块（详见[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)）。

## 桌面端

### 对 BasicTextField2 的初步支持

`BasicTextField2` Compose 组件现在在桌面端目标上获得了基础级别的支持。
如果您的项目绝对需要它，或者为了进行测试，请使用它，但请记住可能存在未涵盖的边缘情况。
例如，`BasicTextField2` 目前不支持 IME 事件，因此您将无法使用中文、日文或韩文的虚拟键盘。

对该组件的完整支持以及对其他平台的支持计划在 Compose Multiplatform 1.7.0 版本中提供。

### DialogWindow 的 alwaysOnTop 标志

为了避免您的对话框窗口被覆盖，您现在可以为 `DialogWindow` 可组合项使用 `alwaysOnTop` 标志。

详见 [拉取请求](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)。

## iOS

### 辅助功能支持改进

在此版本中：

* 对话框和弹出窗口已与辅助功能妥善集成，
* 使用 `UIKitView` 和 `UIKitViewController` 创建的互操作视图现在可以被辅助功能服务访问，
* 辅助功能 API 支持 `LiveRegion` 语义，
* 支持[辅助功能滚动](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)，
* 支持 `HapticFeedback`。

### 针对 iOS 17 及更高版本的选择容器放大镜

iOS 上的 Compose Multiplatform 选择容器现在会模拟原生的放大镜工具。

![iPhone 聊天应用在文字放大镜激活时的屏幕截图](compose-1610-ios-magnifier.png){width=390}

### 用于对话框居中的软件键盘内边距

`Dialog` 可组合项的行为现在与 Android 对齐：当软件键盘出现在屏幕上时，对话框会考虑应用程序窗口的有效高度进行居中。
可以通过 `DialogProperties.useSoftwareKeyboardInset` 属性禁用此选项。

## Web

### 基础 IME 键盘支持

Compose Multiplatform 的 Web 目标现在对虚拟 (IME) 键盘提供了基础支持。

## Gradle 插件

### 能够修改 macOS 最低版本

在之前的版本中，如果不包含 Intel 版本，就无法将 macOS 应用上传到 App Store。
您现在可以在平台特定的 Compose Multiplatform 选项中为您的应用设置 macOS 最低版本：

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

详见 [拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4271)。

### 创建支持 ProGuard 的 uber JAR 的选项

您现在可以使用 ProGuard Gradle 任务创建 uber JAR（包含应用程序和所有依赖项 JAR 的复杂包）。

详见 [拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4136)。

<!--TODO add link to the GitHub tutorial mentioned in PR when it's updated  -->

## 已知问题

### MissingResourceException

在将 Kotlin 版本从 1.9.x 更改为 2.0.0（或反之）后，您可能会遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 错误。
要解决此问题，请删除项目中的 `build` 目录：这包括位于项目根目录和模块目录中的文件夹。

### NativeCodeGeneratorException

某些项目的 iOS 编译可能会失败，并出现以下错误：

```
org.jetbrains.kotlin.backend.konan.llvm.NativeCodeGeneratorException: Exception during generating code for following declaration: private fun $init_global()
```

请关注 [GitHub 问题](https://github.com/JetBrains/compose-multiplatform/issues/4809) 以了解详情。