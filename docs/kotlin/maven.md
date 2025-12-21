[//]: # (title: Maven)

Maven 是一种构建系统，可用于管理仅含 Kotlin 或 Kotlin-Java 混合项目，并自动化你的构建过程。它适用于基于 JVM 的项目，并下载所需的依赖项，编译并打包你的代码。关于其基础知识和具体细节，请访问 [Maven](https://maven.apache.org/) 网站了解更多。

以下是使用 Kotlin Maven 项目时的一般工作流程：

1.  [应用 Kotlin Maven 插件](maven-configure-project.md#enable-and-configure-the-plugin)。
2.  [声明版本库](maven-configure-project.md#declare-repositories)。
3.  [设置项目依赖项](maven-configure-project.md#set-dependencies)。
4.  [配置源代码编译](maven-compile-package.md#configure-source-code-compilation)。
5.  [配置 Kotlin 编译器](maven-compile-package.md#configure-kotlin-compiler)。
6.  [打包你的应用程序](maven-compile-package.md#package-your-project)。

要开始，你还可以按照我们的分步教程：

*   [配置 Java 项目以使用 Kotlin](mixing-java-kotlin-intellij.md)
*   [使用 Kotlin 和 JUnit5 测试你的 Java Maven 项目](jvm-test-using-junit.md)

> 你可以查看我们的公共 [示例项目](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)，
> 其中包含已为 Kotlin/Java 混合项目设置好的 Maven 和 Gradle 构建文件。
>
{style="tip"}

## 接下来？

*   **使用** [`power-assert` 插件](power-assert.md#maven) **改进你的调试体验**。
*   **使用** [`kover-maven-plugin`](https://kotlin.github.io/kotlinx-kover/maven-plugin/) **衡量测试覆盖率并生成报告**。
*   **使用** [`kapt` 插件](kapt.md#use-in-maven) **配置注解处理**。
*   **使用** [Dokka 文档引擎](dokka-maven.md) **生成文档**。
    它支持混合语言项目，并能生成多种格式的输出，包括标准 Javadoc。
*   **通过添加** [`kotlin-osgi-bundle`](kotlin-osgi.md#maven) **启用 OSGi 支持**。