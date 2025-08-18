[//]: # (title: 资源概览)

Compose Multiplatform 提供了一个专门的 `compose-multiplatform-resources` 库和 Gradle 插件支持，用于在所有支持的平台上的公共代码中访问资源。资源是静态内容，例如图像、字体和字符串，你可以在应用程序中使用它们。

在 Compose Multiplatform 中使用资源时，请考虑以下当前条件：

*   几乎所有资源都在调用者线程中同步读取。唯一的例外是原始文件和 Web 资源，它们是异步读取的。
*   尚不支持以流的形式读取大型原始文件，例如长视频。使用 [`getUri()`](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries) 函数将独立文件传递给系统 API，例如 [kotlinx-io](https://github.com/Kotlin/kotlinx-io) 库。
*   从 1.6.10 开始，只要你使用 Kotlin 2.0.0 或更高版本以及 Gradle 7.6 或更高版本，就可以将资源放置在任何模块或源代码集中。

要了解如何在 Compose Multiplatform 中使用资源，请参考以下主要章节：

*   [多平台资源的设置与配置](compose-multiplatform-resources-setup.md)

    添加 `resources` 库依赖项，并设置你的应用应该能够访问的所有资源。

*   [在应用中使用多平台资源](compose-multiplatform-resources-usage.md)

    了解如何使用自动生成的访问器直接在你的 UI 代码中访问资源。

*   [本地资源环境](compose-resource-environment.md)

    管理你的应用资源环境，例如应用内主题和语言。