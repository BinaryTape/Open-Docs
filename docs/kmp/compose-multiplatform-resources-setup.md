[//]: # (title: 多平台资源设置与配置)

<show-structure depth="3"/>

要正确配置项目以使用多平台资源：

1. 添加库依赖项。
2. 为每种资源创建必要的目录。
3. 为限定资源创建额外目录（例如，用于深色 UI 主题的不同图像或本地化字符串）。

## 构建脚本与目录设置

要在多平台项目中访问资源，请添加库依赖项并整理项目目录中的文件：

1. 在 `composeApp` 目录下的 `build.gradle.kts` 文件中，为 `commonMain` 源集添加依赖项：

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
   
   > 要直接引用该库，请使用 [Maven Central 构件页面](https://central.sonatype.com/artifact/org.jetbrains.compose.components/components-resources) 中的完全限定名称。
   {style="tip"}

2. 在您想要添加资源的源集目录（在本示例中为 `commonMain`）中创建一个新目录 `composeResources`：

   ![Compose 资源项目结构](compose-resources-structure.png){width=250}

3. 根据以下规则组织 `composeResources` 目录结构：

   * 图像应放在 `drawable` 目录中。Compose Multiplatform 支持光栅化图像（JPEG、PNG、位图和 WebP）以及矢量 Android XML 图像（不含对 Android 资源的引用）。
   * 字体应放在 `font` 目录中。
   * 字符串应放在 `values` 目录中。
   * 其他文件应放在 `files` 目录中，可以使用您认为合适的任何文件夹层次结构。

### 自定义资源目录

在 `build.gradle.kts` 文件的 `compose.resources {}` 块中，您可以为每个源集指定自定义资源目录。每个自定义目录也应以与默认 `composeResources` 相同的方式包含文件：使用 `drawable` 子目录存放图像，使用 `font` 子目录存放字体，依此类推。

一个简单的示例是指向特定文件夹：

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "jvmMain",
        directoryProvider = provider { layout.projectDirectory.dir("desktopResources") }
    )
}
```

您还可以设置由 Gradle 任务填充的文件夹，例如包含下载的文件：

```kotlin
abstract class DownloadRemoteFiles : DefaultTask() {

    @get:OutputDirectory
    val outputDir = layout.buildDirectory.dir("downloadedRemoteFiles")

    @TaskAction
    fun run() { /* 用于下载文件的代码 */ }
}

compose.resources {
    customDirectory(
        sourceSetName = "iosMain",
        directoryProvider = tasks.register<DownloadRemoteFiles>("downloadedRemoteFiles").map { it.outputDir.get() }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="directoryProvider = tasks.register<DownloadRemoteFiles>"}

在 [访问与用法](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation) 中详细了解如何自定义资源访问。

### 自定义 Web 资源路径

您可以使用 `configureWebResources()` 函数为您的 Web 资源指定路径和 URL：

* 使用相对路径（以 `/` 开头）从域名根目录引用资源。
* 使用绝对 URL（以 `http://` 或 `https://` 开头）引用托管在外部域名或 CDN 上的资源。

```kotlin
// 将资源映射到特定于应用程序的路径
configureWebResources {
    resourcePathMapping { path -> "/myApp/resources/$path" }
}

// 将资源映射到外部 CDN
configureWebResources {
    resourcePathMapping { path -> "https://mycdn.com/myApp/res/$path" }
}
```

### 在 `androidLibrary` 目标中使用资源
<primary-label ref="Experimental"/>

从 Android Gradle 插件版本 8.8.0 开始，您可以在 `androidLibrary` 目标中使用生成的 `Res` 类和资源访问器。要在 `androidLibrary` 中启用对多平台资源的支持，请按如下方式更新您的配置：

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 限定符

有时，同一资源应根据环境（如区域性、屏幕密度或界面主题）以不同方式呈现。例如，您可能需要为不同语言本地化文本，或针对深色主题调整图像。为此，该库提供了特殊的限定符。

> 在 [管理本地资源环境](compose-resource-environment.md) 教程中了解如何处理资源相关设置。
>
{style="note"}

除 `files` 目录中的原始文件外，所有资源类型都支持限定符。使用连字符为目录名称添加限定符：

![多平台资源中的限定符](compose-resources-qualifiers.png){width=250}

该库支持以下限定符（按优先级排序）：[语言](#language-and-regional-qualifiers)、[主题](#theme-qualifier) 和 [密度](#density-qualifier)。

* 可以同时应用不同类型的限定符。例如，"drawable-en-rUS-mdpi-dark" 是针对美国地区英语语言的图像，适用于深色主题下的 160 DPI 屏幕。
* 如果请求的限定符对应的资源不可访问，则改用默认资源（不带限定符）。

### 语言和区域限定符

您可以结合使用语言和区域限定符：

* 语言由双字母 (ISO 639-1) 或三字母 (ISO 639-2) [语言代码](https://www.loc.gov/standards/iso639-2/php/code_list.php) 定义。
* 您可以在语言代码中添加双字母 [ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 区域代码。区域代码必须带有小写 `r` 前缀，例如：`drawable-spa-rMX`。

语言和区域代码区分大小写。在 [本地化](compose-regional-format.md) 中详细了解如何使用特定于区域的格式。

### 主题限定符

您可以添加 "light" 或 "dark" 限定符。Compose Multiplatform 会根据当前系统主题选择必要的资源。

### 密度限定符

您可以使用以下密度限定符：

* "ldpi" – 120 DPI，0.75x 密度
* "mdpi" – 160 DPI，1x 密度
* "hdpi" – 240 DPI，1.5x 密度
* "xhdpi" – 320 DPI，2x 密度
* "xxhdpi" – 480 DPI，3x 密度
* "xxxhdpi" – 640 DPI，4x 密度

系统会根据定义的屏幕密度选择资源。

## 发布

从 Compose Multiplatform 1.6.10 开始，所有必要的资源都包含在发布的 Maven 构件中。

要启用此功能，您的项目需要使用 Kotlin 2.0.0 或更新版本，以及 Gradle 7.6 或更新版本。

## 下一步

* 在 [在您的应用中使用多平台资源](compose-multiplatform-resources-usage.md) 页面上了解如何访问已设置的资源，以及如何自定义默认生成的访问器。
* 查看官方 [演示项目](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)，该项目展示了如何在针对 iOS、Android 和桌面端的 Compose Multiplatform 项目中处理资源。