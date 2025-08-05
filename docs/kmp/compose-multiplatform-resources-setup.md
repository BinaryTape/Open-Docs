[//]: # (title: 多平台资源的设置与配置)

<show-structure depth="3"/>

要正确配置项目以使用多平台资源，请执行以下操作：

1.  添加库依赖项。
2.  为每种资源创建必要的目录。
3.  为限定资源创建额外目录（例如，用于深色 UI 主题的不同图像或本地化字符串）。

## 构建脚本和目录设置

要在多平台项目中访问资源，请添加库依赖项并组织项目目录中的文件：

1.  在 `composeApp` 目录中的 `build.gradle.kts` 文件中，将依赖项添加到 `commonMain` 源代码集：

    ```kotlin
    kotlin {
        //...
        sourceSets {
            commonMain.dependencies {
                implementation(compose.components.resources)
            }
        }
    }
    ```

    > 要直接引用该库，请使用 Maven Central 中[构件页面](https://central.sonatype.com/artifact/org.jetbrains.compose.components/components-resources)上的完全限定名。
    {style="tip"}

2.  在要添加资源的源代码集目录中（本例中为 `commonMain`），创建一个新目录 `composeResources`：

    ![Compose resources project structure](compose-resources-structure.png){width=250}

3.  按照以下规则组织 `composeResources` 目录结构：

    *   图像应位于 `drawable` 目录中。Compose Multiplatform 支持栅格图像（JPEG、PNG、位图和 WebP）和矢量 Android XML 图像（不引用 Android 资源）。
    *   字体应位于 `font` 目录中。
    *   字符串应位于 `values` 目录中。
    *   其他文件应位于 `files` 目录中，可根据需要设置任意文件夹层次结构。

### 自定义资源目录

在 `build.gradle.kts` 文件的 `compose.resources {}` 代码块中，你可以为每个源代码集指定自定义资源目录。每个自定义目录中的文件组织方式应与默认的 `composeResources` 相同：包含用于图像的 `drawable` 子目录、用于字体的 `font` 子目录等。

一个简单的例子是指向一个特定文件夹：

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "desktopMain",
        directoryProvider = provider { layout.projectDirectory.dir("desktopResources") }
    )
}
```

你还可以设置一个由 Gradle 任务填充的文件夹，例如，包含下载文件的文件夹：

```kotlin
abstract class DownloadRemoteFiles : DefaultTask() {

    @get:OutputDirectory
    val outputDir = layout.buildDirectory.dir("downloadedRemoteFiles")

    @TaskAction
    fun run() { /* your code for downloading files */ }
}

compose.resources {
    customDirectory(
        sourceSetName = "iosMain",
        directoryProvider = tasks.register<DownloadRemoteFiles>("downloadedRemoteFiles").map { it.outputDir.get() }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="directoryProvider = tasks.register<DownloadRemoteFiles>"}

### `androidLibrary` 目标中的资源
<secondary-label ref="Experimental"/>

从 Android Gradle 插件 8.8.0 版本开始，你可以在 `androidLibrary` 目标中使用生成的 `Res` 类和资源访问器。要在 `androidLibrary` 中启用对多平台资源的支持，请按如下方式更新你的配置：

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 限定符

有时，同一资源需要根据环境（例如语言环境、屏幕密度或界面主题）以不同方式呈现。例如，你可能需要为不同语言本地化文本，或为深色主题调整图像。为此，该库提供了特殊的限定符。

> 关于如何处理与资源相关的设置，请参阅[管理本地资源环境](compose-resource-environment.md)教程。
>
{style="note"}

除 `files` 目录中的原始文件外，所有资源类型都支持限定符。使用连字符向目录名添加限定符：

![Qualifiers in multiplatform resources](compose-resources-qualifiers.png){width=250}

该库支持（按优先级顺序）以下限定符：[语言](#language-and-regional-qualifiers)、[主题](#theme-qualifier)和[密度](#density-qualifier)。

*   不同类型的限定符可以组合使用。例如，“drawable-en-rUS-mdpi-dark”是一个适用于美国区域英语、适合 160 DPI 屏幕并在深色主题下使用的图像。
*   如果请求限定符的资源不可访问，则会使用默认资源（不带限定符）。

### 语言和区域限定符

你可以组合使用语言和区域限定符：
*   语言由两位（ISO 639-1）或三位（ISO 639-2）[语言代码](https://www.loc.gov/standards/iso639-2/php/code_list.php)定义。
*   你可以在语言代码中添加两位 [ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 区域代码。
    区域代码必须带有小写 `r` 前缀，例如：`drawable-spa-rMX`

语言和区域代码区分大小写。

### 主题限定符

你可以添加“light”或“dark”限定符。然后 Compose Multiplatform 会根据当前系统主题选择所需的资源。

### 密度限定符

你可以使用以下密度限定符：

*   "ldpi" – 120 DPI, 0.75x 密度
*   "mdpi" – 160 DPI, 1x 密度
*   "hdpi" – 240 DPI, 1.5x 密度
*   "xhdpi" – 320 DPI, 2x 密度
*   "xxhdpi" – 480 DPI, 3x 密度
*   "xxxhdpi" – 640dpi, 4x 密度

资源的选择取决于系统定义的屏幕密度。

## 发布

从 Compose Multiplatform 1.6.10 开始，所有必要的资源都将包含在发布的 Maven 构件中。

要启用此功能，你的项目需要使用 Kotlin 2.0.0 或更高版本以及 Gradle 7.6 或更高版本。

## 下一步？

*   关于如何访问你设置的资源以及如何自定义默认生成的访问器，请参阅 [](compose-multiplatform-resources-usage.md) 页面。
*   查看官方[演示项目](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)，该项目展示了如何在面向 iOS、Android 和桌面平台的 Compose Multiplatform 项目中处理资源。