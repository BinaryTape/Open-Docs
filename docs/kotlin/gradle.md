---
title: Gradle
---
Gradle 是一个构建系统，它可以帮助你自动化和管理构建过程。它会下载所需的依赖项、打包你的代码，并为编译做准备。你可以在 [Gradle 官网](https://docs.gradle.org/current/userguide/userguide.html)上了解 Gradle 的基础知识和具体信息。

你可以按照[这些说明](gradle-configure-project)为不同的平台设置你自己的项目，或者通过一个简短的[循序渐进的教程](get-started-with-jvm-gradle-project)，它将向你展示如何在 Kotlin 中创建一个简单的后端 “Hello World” 应用程序。

:::tip
你可以在[这里](gradle-configure-project#apply-the-plugin)找到关于 Kotlin、Gradle 和 Android Gradle 插件版本兼容性的信息。

:::

在本章中，你还可以了解：

* [编译器选项以及如何传递它们](gradle-compiler-options)。
* [增量编译、缓存支持、构建报告和 Kotlin 守护进程(daemon)](gradle-compilation-and-caches)。
* [对 Gradle 插件变体（variants）的支持](gradle-plugin-variants)。

## 接下来做什么？

了解关于以下内容：

* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 是一种特定领域的语言（domain specific language），你可以使用它来快速有效地编写构建脚本。
* **注解处理(Annotation processing)**。 Kotlin 通过 [Kotlin Symbol processing API](ksp-reference) 支持注解处理。
* **生成文档(Generating documentation)**。 要为 Kotlin 项目生成文档，请使用 [Dokka](https://github.com/Kotlin/dokka)；有关配置说明，请参阅 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README#using-the-gradle-plugin)。Dokka 支持混合语言项目，并且可以生成多种格式的输出，包括标准 Javadoc。
* **OSGi**。 有关 OSGi 支持，请参见 [Kotlin OSGi 页面](kotlin-osgi)。