[//]: # (title: 创建控制台应用 – 教程)

本教程演示如何使用 IntelliJ IDEA 创建控制台应用。

要开始使用，请先下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 创建项目

1. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
2. 在左侧列表中，选择 **Kotlin**。
3. 为新项目命名，并在必要时更改其位置。

   > 选中 **Create Git repository** 复选框以将新项目置于版本控制之下。你稍后可以随时执行此操作。
   >
   {style="tip"}
   
   ![创建控制台应用](jvm-new-project.png){width=700}

4. 选择 **IntelliJ** 构建系统。这是一个原生构建器，不需要下载额外的构件。

   如果你想创建一个需要进一步配置的更复杂的项目，请选择 Maven 或 Gradle。对于 Gradle，请为构建脚本选择一种语言：Kotlin 或 Groovy。
5. 从 **JDK** 列表中，选择你想在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
   * 如果 JDK 已安装在你的计算机上，但在 IDE 中未定义，请选择 **Add JDK** 并指定 JDK 主目录的路径。 
   * 如果你的计算机上没有所需的 JDK，请选择 **Download JDK**。

6. 启用 **Add sample code** 选项以创建一个包含示例 `"Hello World!"` 应用的文件。

    > 你还可以启用 **Generate code with onboarding tips** 选项，在示例代码中添加一些额外的有用注释。
    >
    {style="tip"}

7. 点击 **Create**。

    > 如果你选择了 Gradle 构建系统，你的项目中会有一个构建脚本文件：`build.gradle(.kts)`。它包含控制台应用所需的 `kotlin("jvm")` 插件和依赖项。请确保你使用的是该插件的最新版本：
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

## 创建应用

1. 在 `src/main/kotlin` 中打开 `Main.kt` 文件。  
   `src` 目录包含 Kotlin 源文件和资源。`Main.kt` 文件包含示例代码，将打印 `Hello, Kotlin!` 以及包含循环迭代器值的若干行。

   ![包含 main 函数的 Main.kt](jvm-main-kt-initial.png){width=700}

2. 修改代码，使其请求你的名字并向你打招呼：

   * 创建一个输入提示，并将 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数返回的值赋值给 `name` 变量。
   * 让我们使用字符串模板代替串联，方法是直接在文本输出中的变量名前添加美元符号，如下所示 – `$name`。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## 运行应用

现在应用已准备好运行。最简单的方法是点击装订区域中的绿色 **Run** 图标，然后选择 **Run 'MainKt'**。

![运行控制台应用](jvm-run-app.png){width=350}

你可以在 **Run** 工具窗口中查看结果。

![Kotlin 运行输出](jvm-output-1.png){width=600}
   
输入你的名字并接受来自应用的问候！ 

![Kotlin 运行输出](jvm-output-2.png){width=600}

恭喜！你刚刚运行了你的第一个 Kotlin 应用。

## 下一步

创建此应用后，你可以开始深入了解 Kotlin 语法：

* 参加 [Kotlin 之旅](kotlin-tour-welcome.md) 
* 为 IDEA 安装 [JetBrains Academy 插件](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy) 并完成 [Kotlin Koans 课程](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) 中的练习