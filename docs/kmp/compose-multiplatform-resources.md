[//]: # (title: 资源概述)

Compose Multiplatform 提供了一个特殊的 `compose-multiplatform-resources` 库和 Gradle 插件支持，用于在所有支持的平台上，通过公共代码访问资源。资源是静态内容，例如图像、字体和字符串，你可以在应用程序中使用它们。

在使用 Compose Multiplatform 中的资源时，请考虑以下当前情况：

* 几乎所有资源都在调用者线程中同步读取。唯一的例外是原始文件和 Web 资源，它们是异步读取的。
* 尚不支持将大型原始文件（例如长视频）作为流读取。
  例如，可以使用 [`getUri()`](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries) 函数将独立文件传递给系统 API，例如 [kotlinx-io](https://github.com/Kotlin/kotlinx-io) 库。
* 从 1.6.10 版本开始，只要你使用 Kotlin 2.0.0 或更高版本以及 Gradle 7.6 或更高版本，就可以将资源放置在任何模块或源代码集中。

要了解如何在 Compose Multiplatform 中使用资源，请参考以下关键章节：

* [](compose-multiplatform-resources-setup.md)

  添加 `resources` 库依赖项并设置你的应用应能访问的所有资源。

* [](compose-multiplatform-resources-usage.md)

  了解如何使用自动生成的访问器，直接在 UI 代码中访问资源。

* [本地资源环境](compose-resource-environment.md)
  
  管理你的应用的资源环境，例如应用内主题和语言。