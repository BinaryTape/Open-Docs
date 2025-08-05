[//]: # (title: Compose Multiplatform 1.6.10-rc02 有哪些新特性)

以下是此抢先体验预览特性版本的亮点：

* [支持带有 Compose Multiplatform 资源的多模块项目](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [实验性的导航库](#experimental-navigation-library)
* [带有实验性通用 ViewModel 的生命周期库](#lifecycle-library)
* [已知问题](#known-issues)

关于此版本的完整变更列表，请[在 GitHub 上](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-beta01-april-2024)查看。

## 依赖项

* Gradle 插件 `org.jetbrains.compose`，版本 1.6.10-rc01。基于 Jetpack Compose 库：
  * [Compiler 1.5.13](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.13)
  * [运行时 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* 生命周期库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0-rc02`。基于 [Jetpack Lifecycle 2.8.0-rc01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0-rc01)。
* 导航库 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha05`。基于 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 重大变更

### Kotlin 2.0.0 需要新的 Compose 编译器 Gradle 插件

从 Kotlin 2.0.0-RC2 开始，Compose Multiplatform 要求使用新的 Compose 编译器 Gradle 插件。
有关详细信息，请参见[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)。

## 跨平台

### 资源

#### 稳定的资源库

[资源库 API](compose-multiplatform-resources.md) 的大部分内容现在被认为是稳定的。

#### 支持带有 Compose Multiplatform 资源的多模块项目

从 Compose Multiplatform 1.6.10-beta01 开始，
您可以在任何 Gradle 模块和任何源代码集中存储资源，并发布包含资源的[项目](project)和库。

要启用多模块支持，请将您的[项目](project)更新到 Kotlin 2.0.0 或更高版本，以及 Gradle 7.6 或更高版本。

#### 多平台资源的配置 DSL

您现在可以微调[项目](project)中的 `Res` 类生成：更改其形态和分配的包，并选择生成条件：始终、从不或仅在对资源库有显式依赖项时生成。

有关详细信息，请参见[文档部分](compose-multiplatform-resources.md#configuration)。

#### 用于生成资源 URI 的公共函数

新的 `getUri()` [函数](function)允许您将资源的平台相关 URI 传递给外部库，以便它们可以直接访问文件。
有关详细信息，请参见[文档](compose-multiplatform-resources.md#accessing-multiplatform-resources-from-external-libraries)。

#### 字符串资源的复数形式

您现在可以定义复数形式（数量字符串）以及其他多平台字符串资源。
有关详细信息，请参见[文档](compose-multiplatform-resources.md#plurals)。

#### 支持三字母语言环境

[语言限定符](compose-multiplatform-resources.md#language-and-regional-qualifiers) 现在支持用于语言环境的 alpha-3 (ISO 639-2) 代码。

#### 用于图像和字体的实验性字节数组函数

您可以试用两个[函数](function)，它们允许以字节数组形式获取字体和图像：`getDrawableResourceBytes` 和 `getFontResourceBytes`。
这些[函数](function)旨在帮助从第三方库访问多平台资源。

有关详细信息，请参见[拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4651)。

### 实验性的导航库

基于 Jetpack Compose 的通用导航库现已可用。
有关详细信息，请参见[文档](compose-navigation-routing.md)。

此版本中的主要限制：
* [深层链接](https://developer.android.com/guide/navigation/design/deep-link)（处理或跟踪）尚不支持。
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) [函数](function)和[预测性返回手势](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)仅在 Android 上受支持。

### 生命周期库

基于 Jetpack lifecycle 的通用生命周期库现已可用，有关详细信息请参见[文档](compose-lifecycle.md)。

此库的引入主要是为了支持通用导航[功能](functionality)，但它也提供了一个[实验性的](experimental)跨平台 ViewModel 实现，并包含一个可供您为[项目](project)实现的通用 LifecycleOwner 接口。

Compose Multiplatform 还提供了一个通用的 ViewModelStoreOwner 实现。

### 支持 Kotlin 2.0.0

Kotlin 2.0.0-RC2 随新的 Compose 编译器 Gradle 插件一同发布。
要在 Compose Multiplatform 中使用最新编译器版本，请将该插件应用到[项目](project)中的模块（有关详细信息，请参见[迁移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)）。

## 桌面

### 对 BasicTextField2 的基本支持

`BasicTextField2` Compose 组件现在在桌面[目标平台](target)上得到了基本层面的支持。
如果您的[项目](project)绝对需要它，或者只是为了测试，请使用它，但请记住可能存在未发现的边缘情况。
[例如](for example)，`BasicTextField2` 目前不支持 IME 事件，因此您将无法使用虚拟键盘输入中文、日文或韩文。

此组件的全面支持以及对其他平台的支持计划在 Compose Multiplatform 1.7.0 版本中提供。

### DialogWindow 的 `alwaysOnTop` 标志

为避免您的对话框窗口被覆盖，您现在可以为 `DialogWindow` 可组合项使用 `alwaysOnTop` 标志。

有关详细信息，请参见[拉取请求](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)。

## iOS

### 辅助功能支持改进

在此版本中：

* 对话框和弹窗已正确集成到辅助功能中；
* 使用 `UIKitView` 和 `UIKitViewController` 创建的[互操作](interop)视图现在可通过辅助功能服务访问；
* `LiveRegion` 语义由辅助功能 API 支持；
* [辅助功能滚动](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)受支持；
* 触觉反馈受支持。

### 适用于 iOS 17 及更高版本的选择容器放大镜

Compose Multiplatform 在 iOS 上的选择容器现在可以模拟[原生](native)放大工具。

![带有文本放大镜的 iPhone 聊天应用截图](compose-1610-ios-magnifier.png){width=390}

### 用于对话框居中的软键盘插入

`Dialog` 可组合项的行为现在与 Android 对齐：当软键盘在屏幕上出现时，对话框会根据[应用程序](application)窗口的有效高度居中。
可以通过 `DialogProperties.useSoftwareKeyboardInset` 属性禁用此选项。

## Web

### 基本的 IME 键盘支持

Compose Multiplatform 的 Web [目标平台](target)现在已对虚拟 (IME) 键盘提供了基本支持。

## Gradle 插件

### 修改 macOS 最低版本的可能性

在早期版本中，不包含 Intel 版本的 macOS [应用](app)无法上传到 App Store。
您现在可以在平台特有的 Compose Multiplatform 选项中为您的[应用](app)设置最低 macOS 版本：

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

有关详细信息，请参见[拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4271)。

### 创建支持 Proguard 的 uber JARs 的选项

您现在可以使用 ProGuard Gradle [任务](task)创建 uber JARs（包含[应用程序](application)及其所有[依赖项](dependency)的 JAR 的复杂包）。

有关详细信息，请参见[拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/4136)。

<!--TODO add link to the GitHub tutorial mentioned in PR when it's updated  -->

## 已知问题

### MissingResourceException

在将 Kotlin 版本从 1.9.x 更改为 2.0.0（或反之亦然）后，您可能会遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 错误。
要解决此问题，请删除[项目](project)中的 `build` 目录：这包括位于[项目](project)根目录和模块文件夹中的所有文件夹。

### NativeCodeGeneratorException

某些[项目](project)的 iOS [编译项](compilation)可能会因以下错误而失败：

```
org.jetbrains.kotlin.backend.konan.llvm.NativeCodeGeneratorException: Exception during generating code for following declaration: private fun $init_global()
```

有关详细信息，请跟踪此[GitHub 问题](https://github.com/JetBrains/compose-multiplatform/issues/4809)。