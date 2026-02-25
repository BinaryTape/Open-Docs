[//]: # (title: Gradle)

Gradle 是一种构建系统，可以帮助您自动化和管理构建过程。它会下载所需的依赖项、打包您的代码并为编译做好准备。请在 [Gradle 官网](https://docs.gradle.org/current/userguide/userguide.html)上了解 Gradle 的基础知识和详情。

您可以按照针对不同平台的[这些说明](gradle-configure-project.md)来设置您自己的项目，或者通过一个简单的[循序渐进的教程](get-started-with-jvm-gradle-project.md)，它将向您展示如何使用 Kotlin 创建一个简单的后端 “Hello World” 应用程序。

> 您可以在[此处](gradle-configure-project.md#apply-the-plugin)找到有关 Kotlin、Gradle 和 Android Gradle 插件版本兼容性的信息。
> 
{style="tip"}

在本章中，您还可以了解：
* [编译器选项及其传递方式](gradle-compiler-options.md)。
* [增量编译、缓存支持、构建报告和 Kotlin 守护进程](gradle-compilation-and-caches.md)。
* [对 Gradle 插件变体的支持](gradle-plugin-variants.md)。

## 下一步？

了解：
* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 是一种领域专用语言，您可以利用它快速高效地编写构建脚本。
* **注解处理**。Kotlin 通过 [Kotlin 符号处理 API](ksp-reference.md) (KSP) 支持注解处理。
* **生成文档**。要为 Kotlin 项目生成文档，请使用 [Dokka](https://github.com/Kotlin/dokka)；有关配置说明，请参阅 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)。Dokka 支持混合语言项目，并可以生成多种格式的输出，包括标准的 Javadoc。
* **OSGi**。有关 OSGi 的支持，请参见 [Kotlin OSGi 页面](kotlin-osgi.md)。