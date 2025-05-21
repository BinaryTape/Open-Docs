---
title: "Kotlin/JVM 入门"
---
本文将演示如何使用 IntelliJ IDEA 创建控制台应用程序。

首先，下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 创建项目

1. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
2. 在左侧列表中，选择 **Kotlin**。
3. 命名新项目，并在必要时更改其位置。

   > 选中 **Create Git repository** 复选框，将新项目置于版本控制之下。 你可以稍后随时进行此操作。
   >
   
   
   <img src="/img/jvm-new-project.png" alt="Create a console application" width="700" style={{verticalAlign: 'middle'}}/>

4. 选择 **IntelliJ** 构建系统。 这是一个原生构建器，不需要下载额外的工件（artifacts）。

   如果你想创建一个需要进一步配置的更复杂的项目，请选择 Maven 或 Gradle。 对于 Gradle，选择构建脚本的语言：Kotlin 或 Groovy。
5. 从 **JDK list** 中，选择要在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
   * 如果 JDK 已安装在你的计算机上，但未在 IDE 中定义，请选择 **Add JDK** 并指定 JDK 主目录的路径。
   * 如果你的计算机上没有必要的 JDK，请选择 **Download JDK**。

6. 启用 **Add sample code** 选项以创建一个包含示例 `"Hello World!"` 应用程序的文件。

    > 你还可以启用 **Generate code with onboarding tips** 选项，以便向示例代码添加一些额外的有用注释。
    >
    

7. 点击 **Create**。

    > 如果你选择了 Gradle 构建系统，那么你的项目中会有一个构建脚本文件：`build.gradle(.kts)`。 它包括 `kotlin("jvm")` 插件和控制台应用程序所需的依赖项。 确保你使用最新版本的插件：
    > 
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "2.1.20"
    >     application
    > }
    > ```
    > 
    

## 创建应用程序

1. 在 `src/main/kotlin` 中打开 `Main.kt` 文件。
   `src` 目录包含 Kotlin 源代码文件和资源。 `Main.kt` 文件包含示例代码，该代码将打印 `Hello, Kotlin!` 以及循环迭代器的几行值。

   <img src="/img/jvm-main-kt-initial.png" alt="Main.kt with main fun" width="700" style={{verticalAlign: 'middle'}}/>

2. 修改代码，使其请求你的名字并向你问 `Hello`：

   * 创建一个输入提示，并将 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数返回的值赋给 `name` 变量。
   * 让我们使用字符串模板而不是连接，方法是在文本输出中直接在变量名之前添加美元符号 `$`，就像这样 – `$name`。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## 运行应用程序

现在应用程序已准备好运行。 最简单的方法是单击装订线中的绿色 **Run** 图标，然后选择 **Run 'MainKt'**。

<img src="/img/jvm-run-app.png" alt="Running a console app" width="350" style={{verticalAlign: 'middle'}}/>

你可以在 **Run** 工具窗口中看到结果。

<img src="/img/jvm-output-1.png" alt="Kotlin run output" width="600" style={{verticalAlign: 'middle'}}/>
   
输入你的名字，并接受来自你的应用程序的问候！

<img src="/img/jvm-output-2.png" alt="Kotlin run output" width="600" style={{verticalAlign: 'middle'}}/>

恭喜！ 你刚刚运行了你的第一个 Kotlin 应用程序。

## 接下来做什么？

创建此应用程序后，你可以开始更深入地研究 Kotlin 语法：

* 从 [Kotlin examples](https://play.kotlinlang.org/byExample/overview) 添加示例代码
* 安装用于 IDEA 的 [JetBrains Academy plugin](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy)，并完成 [Kotlin Koans course](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) 中的练习
  ```