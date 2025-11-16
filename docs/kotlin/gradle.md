[//]: # (title: Gradle)

Gradle 是一种构建系统，有助于自动化和管理你的构建过程。它会下载所需的依赖项，打包你的代码，并为编译项做好准备。关于 Gradle 的基础知识和具体信息，请参阅 [Gradle 网站](https://docs.gradle.org/current/userguide/userguide.html)。

你可以根据 [这些说明](gradle-configure-project.md) 为不同平台设置你自己的项目，或者完成一个小的 [分步教程](get-started-with-jvm-gradle-project.md)，该教程将向你展示如何使用 Kotlin 创建一个简单的后端“Hello World”应用程序。

> 你可以在 [此处](gradle-configure-project.md#apply-the-plugin) 找到关于 Kotlin、Gradle 和 Android Gradle 插件版本兼容性的信息。
>
{style="tip"}

在本章节中，你还可以了解：
* [编译器选项及其传递方法](gradle-compiler-options.md)。
* [增量编译、缓存支持、构建报告和 Kotlin 守护进程](gradle-compilation-and-caches.md)。
* [对 Gradle 插件变体的支持](gradle-plugin-variants.md)。

## 接下来是什么？

了解：
* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 是一种领域特定语言，你可以使用它快速高效地编写构建脚本。
* **注解处理**。Kotlin 通过 [Kotlin Symbol Processing API](ksp-reference.md) 支持注解处理。
* **生成文档**。要为 Kotlin 项目生成文档，请使用 [Dokka](https://github.com/Kotlin/dokka)；关于配置说明，请参考 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)。Dokka 支持混合语言项目，并可以生成多种格式的输出，包括标准 Javadoc。
* **OSGi**。关于 OSGi 支持，请参阅 [Kotlin OSGi 页面](kotlin-osgi.md)。