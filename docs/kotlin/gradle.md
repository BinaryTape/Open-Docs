[//]: # (title: Gradle)

Gradle 是一个构建系统，它帮助自动化并管理你的构建过程。它会下载所需的依赖项，打包你的代码，并为编译做好准备。请访问 [Gradle 网站](https://docs.gradle.org/current/userguide/userguide.html) 了解 Gradle 的基础知识和具体细节。

你可以根据[这些说明](gradle-configure-project.md)为不同平台设置你自己的项目，或者通过一个小的[分步教程](get-started-with-jvm-gradle-project.md)来学习如何使用 Kotlin 创建一个简单的后端“Hello World”应用程序。

> 你可以在[此处](gradle-configure-project.md#apply-the-plugin)找到关于 Kotlin、Gradle 和 Android Gradle 插件版本兼容性的信息。
> 
{style="tip"}

在本章中，你还可以了解到：
* [编译器选项及其传递方式](gradle-compiler-options.md)。
* [增量编译、缓存支持、构建报告和 Kotlin 守护进程](gradle-compilation-and-caches.md)。
* [Gradle 插件变体支持](gradle-plugin-variants.md)。

## 下一步？

了解：
* **Gradle Kotlin DSL**。 [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 是一种领域特定语言 (DSL)，可用于快速高效地编写构建脚本。
* **注解处理**。 Kotlin 通过 [Kotlin 符号处理 API](ksp-reference.md) 支持注解处理。
* **生成文档**。 要为 Kotlin 项目生成文档，请使用 [Dokka](https://github.com/Kotlin/dokka)；请参阅 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin) 获取配置说明。Dokka 支持多语言项目，并能生成多种格式的输出，包括标准 Javadoc。
* **OSGi**。 有关 OSGi 支持，请参阅 [Kotlin OSGi 页面](kotlin-osgi.md)。