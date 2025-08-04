[//]: # (title: Kotlin/JVM 入门)

本教程演示了如何使用 IntelliJ IDEA 创建控制台应用程序。

开始之前，请先下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 创建项目

1.  在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
2.  在左侧列表中，选择 **Kotlin**。
3.  命名新项目并在必要时更改其位置。

    > 勾选 **Create Git repository** 复选框可将新项目置于版本控制之下。您可以随时进行此操作。
    >
    {style="tip"}

    ![Create a console application](jvm-new-project.png){width=700}

4.  选择 **IntelliJ** 构建系统。它是一个原生构建器，无需下载额外的构件。

    如果您想创建一个需要进一步配置的更复杂项目，请选择 Maven 或 Gradle。对于 Gradle，请选择构建脚本语言：Kotlin 或 Groovy。
5.  从 **JDK** 列表中，选择要在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    *   如果 JDK 已安装在计算机上，但未在 IDE 中定义，请选择 **Add JDK** 并指定 JDK 主目录的路径。
    *   如果您的计算机上没有所需的 JDK，请选择 **Download JDK**。

6.  启用 **Add sample code** 选项以创建包含示例“Hello World!”应用程序的文件。

    > 您还可以启用 **Generate code with onboarding tips** 选项，为您的示例代码添加其他有用的注释。
    >
    {style="tip"}

7.  点击 **Create**。

    > 如果您选择 Gradle 构建系统，则您的项目中有以下构建脚本文件：`build.gradle(.kts)`。它包含了 `kotlin("jvm")` 插件和控制台应用程序所需的依赖项。请确保使用最新版本的插件：
    >
    > <tabs group="build-script">
    > <tab title="Kotlin" group-key="kotlin">
    >
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "%kotlinVersion%"
    >     application
    > }
    > ```
    >
    > </tab>
    > <tab title="Groovy" group-key="groovy">
    >
    > ```groovy
    > plugins {
    >     id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    >     id 'application'
    > }
    > ```
    >
    > </tab>
    > </tabs>
    >
    {style="note"}

## 创建应用程序

1.  打开 `src/main/kotlin` 中的 `Main.kt` 文件。
    `src` 目录包含 Kotlin 源文件和资源。`Main.kt` 文件包含将打印 `Hello, Kotlin!` 以及循环迭代器值的多行的示例代码。

    ![Main.kt with main fun](jvm-main-kt-initial.png){width=700}

2.  修改代码，使其请求您的姓名并向您问好：

    *   创建一个输入提示，并将 `readln()` 函数返回的值赋值给 `name` 变量。
    *   让我们使用字符串内插而不是字符串连接，方法是在文本输出中直接在变量名前添加美元符号 `$`，例如这样 – `$name`。

    ```kotlin
    fun main() {
        println("What's your name?")
        val name = readln()
        println("Hello, $name!")

        // ...
    }
    ```

## 运行应用程序

现在应用程序已准备好运行。最简单的方法是点击边槽中的绿色 **Run** 图标，然后选择 **Run 'MainKt'**。

![Running a console app](jvm-run-app.png){width=350}

您可以在 **Run** 工具窗口中查看结果。

![Kotlin run output](jvm-output-1.png){width=600}

输入您的姓名，并接收来自应用程序的问候！

![Kotlin run output](jvm-output-2.png){width=600}

恭喜！您刚刚运行了第一个 Kotlin 应用程序。

## 接下来做什么？

创建此应用程序后，您可以开始深入了解 Kotlin 语法：

*   从 [Kotlin examples](https://play.kotlinlang.org/byExample/overview) 添加示例代码
*   为 IDEA 安装 [JetBrains Academy 插件](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy) 并完成 [Kotlin 心印课程](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) 中的练习