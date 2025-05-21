---
title: "Kotlin/Native 入门"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

在本教程中，你将学习如何创建一个 Kotlin/Native 应用程序。选择最适合你的工具，并使用以下方法创建你的应用：

* **[IDE](#in-ide)中创建**。在这里，你可以从版本控制系统克隆项目模板，并在 IntelliJ IDEA 中使用它。
* **[Gradle 构建系统](#using-gradle)**。为了更好地了解其内部工作原理，手动为你的项目创建构建文件。
* **[命令行工具](#using-the-command-line-compiler)**。你可以使用 Kotlin/Native 编译器（作为标准 Kotlin 发行版的一部分提供），并直接在命令行工具中创建应用程序。

控制台编译可能看起来简单直接，但它不适用于具有数百个文件和库的大型项目。对于此类项目，我们建议使用 IDE 或构建系统。

使用 Kotlin/Native，你可以为[不同的目标平台](native-target-support)进行编译，包括 Linux、macOS 和 Windows。虽然可以进行跨平台编译，这意味着使用一个平台为另一个平台进行编译，但在本教程中，你将以编译所在的平台为目标平台。

:::note
如果你使用 Mac 并想为 macOS 或其他 Apple 目标创建和运行应用程序，你还需要首先安装 [Xcode Command Line Tools](https://developer.apple.com/download/)，启动它，并接受许可条款。
:::

## 在 IDE 中创建

在本节中，你将学习如何使用 IntelliJ IDEA 创建 Kotlin/Native 应用程序。你可以使用 Community Edition（社区版）和 Ultimate Edition（旗舰版）。

### 创建项目

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 通过在 IntelliJ IDEA 中选择 **File** | **New** | **Project from Version Control** 并使用以下 URL，克隆[项目模板](https://github.com/Kotlin/kmp-native-wizard)：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```   

3. 打开 `gradle/libs.versions.toml` 文件，它是项目依赖的版本目录。要创建 Kotlin/Native 应用程序，你需要 Kotlin Multiplatform Gradle 插件，它的版本与 Kotlin 相同。 确保你使用最新的 Kotlin 版本：

   ```none
   [versions]
   kotlin = "2.1.20"
   ```

4. 按照建议重新加载 Gradle 文件：

   <img src="/img/load-gradle-changes.png" alt="Load Gradle changes button" width="295" style={{verticalAlign: 'middle'}}/>

有关这些设置的更多信息，请参阅 [Multiplatform Gradle DSL 参考](multiplatform-dsl-reference)。

### 构建并运行应用程序

在 `src/nativeMain/kotlin/` 目录中打开 `Main.kt` 文件：

* `src` 目录包含 Kotlin 源代码文件。
* `Main.kt` 文件包含使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数打印 "Hello, Kotlin/Native!" 的代码。

按下代码槽中的绿色图标来运行代码：

<img src="/img/native-run-gutter.png" alt="Run the application" width="478" style={{verticalAlign: 'middle'}}/>

IntelliJ IDEA 使用 Gradle 任务运行代码，并在 **Run** 选项卡中输出结果：

<img src="/img/native-output-gutter-1.png" alt="Application output" width="331" style={{verticalAlign: 'middle'}}/>

首次运行后，IDE 会在顶部创建相应的运行配置：

<img src="/img/native-run-config.png" alt="Gradle run configuration" width="503" style={{verticalAlign: 'middle'}}/>
:::note
IntelliJ IDEA Ultimate 用户可以安装
[Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)
插件，该插件允许调试已编译的 native（原生）可执行文件，并且还可以自动为导入的 Kotlin/Native 项目创建运行配置。

你可以[配置 IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build)来自动构建你的项目：

1. 转到 **Settings | Build, Execution, Deployment | Compiler**。
2. 在 **Compiler** 页面上，选择 **Build project automatically**。
3. 应用更改。

现在，当你更改类文件或保存文件 (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>) 时，IntelliJ IDEA 会自动执行项目的增量构建。

### 更新应用程序

让我们向你的应用程序添加一个功能，使其可以计算你姓名中的字母数：

1. 在 `Main.kt` 文件中，添加代码以读取输入。 使用 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)
   函数读取输入值并将其分配给 `name` 变量：

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

2. 要使用 Gradle 运行此应用程序，请在 `build.gradle.kts` 文件中指定 `System.in` 作为要使用的输入，
   并加载 Gradle 更改：

   ```kotlin
   kotlin {
       //...
       nativeTarget.apply {
           binaries {
               executable {
                   entryPoint = "main"
                   runTask?.standardInput = System.`in`
               }
           }
       }
       //...
   }
   ```
   

3. 消除空格并计算字母：

   * 使用 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 函数删除名称中的
     空字符。
   * 使用作用域函数 [`let`](scope-functions#let) 在对象上下文中运行该函数。
   * 使用[字符串模板](strings#string-templates)通过添加美元符号 `$` 并将其括在花括号中`${it.length}`，将你的姓名长度插入到字符串中。 `it` 是[lambda 参数](coding-conventions#lambda-parameters)的默认名称。

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. 运行应用程序。
5. 输入你的姓名并享受结果：

   <img src="/img/native-output-gutter-2.png" alt="Application output" width="422" style={{verticalAlign: 'middle'}}/>

现在让我们只计算你姓名中的唯一字母：

1. 在 `Main.kt` 文件中，为 `String` 声明新的[扩展函数](extensions#extension-functions)
   `.countDistinctCharacters()`：

   * 使用 [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 函数将名称转换为小写。
   * 使用 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 函数将输入字符串转换为字符列表。
   * 使用 [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 函数仅选择你姓名中的不同字符。
   * 使用 [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数计算不同的字符。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. 使用 `.countDistinctCharacters()` 函数计算你姓名中的唯一字母：

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // Print the number of unique letters.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. 运行应用程序。
4. 输入你的姓名并查看结果：

   <img src="/img/native-output-gutter-3.png" alt="Application output" width="422" style={{verticalAlign: 'middle'}}/>

## 使用 Gradle

在本节中，你将学习如何使用 [Gradle](https://gradle.org) 手动创建一个 Kotlin/Native 应用程序。
它是 Kotlin/Native 和 Kotlin Multiplatform 项目的默认构建系统，通常也用于 Java、Android 和其他生态系统。

### 创建项目文件

1. 首先，安装兼容版本的 [Gradle](https://gradle.org/install/)。 请参阅[兼容性表](gradle-configure-project#apply-the-plugin)
   以检查 Kotlin Gradle 插件 (KGP) 与可用 Gradle 版本的兼容性。
2. 创建一个空项目目录。 在其中创建一个包含以下内容的 `build.gradle(.kts)` 文件：

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "2.1.20"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64("native") {  // on macOS
       // linuxArm64("native") // on Linux
       // mingwX64("native")   // on Windows
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "8.10"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64('native') {  // on macOS
       // linuxArm64('native') // on Linux
       // mingwX64('native')   // on Windows
           binaries {
               executable()
           }
       }
   }

   wrapper {
       gradleVersion = '8.10'
       distributionType = 'BIN'
   }
   ```

   </TabItem>
   </Tabs>

   你可以使用不同的[目标名称](native-target-support)，例如 `macosArm64`、`iosArm64`、`linuxArm64`
   和 `mingwX64` 来定义你正在编译代码的目标。
   这些目标名称可以选择将平台名称作为参数，在本例中为 `native`。
   平台名称用于在项目中生成源路径和任务名称。

3. 在项目目录中创建一个空的 `settings.gradle(.kts)` 文件。
4. 创建一个 `src/nativeMain/kotlin` 目录，并在其中放置一个包含以下内容的 `hello.kt` 文件：

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

按照惯例，所有源代码都位于 `src/<target name>[Main|Test]/kotlin` 目录中，其中 `Main` 用于
源代码，`Test` 用于测试。 `<target name>` 对应于构建文件中指定的目标平台（在本例中为 `native`）。

### 构建并运行项目

1. 从根项目目录中，运行构建命令：

   ```bash
   ./gradlew nativeBinaries
   ```

   此命令将创建 `build/bin/native` 目录，其中包含两个目录：`debugExecutable` 和
   `releaseExecutable`。 它们包含相应的二进制文件。

   默认情况下，二进制文件的名称与项目目录相同。

2. 要运行项目，请执行以下命令：

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

终端将打印 "Hello, Kotlin/Native!"。

### 在 IDE 中打开项目

现在，你可以在任何支持 Gradle 的 IDE 中打开你的项目。 如果你使用 IntelliJ IDEA：

1. 选择 **File** | **Open**。
2. 选择项目目录，然后单击 **Open**。
   IntelliJ IDEA 会自动检测它是否是 Kotlin/Native 项目。

如果项目遇到问题，IntelliJ IDEA 会在 **Build** 选项卡中显示错误消息。

## 使用命令行编译器

在本节中，你将学习如何在命令行工具中使用 Kotlin 编译器创建一个 Kotlin/Native 应用程序。

### 下载并安装编译器

要安装编译器：

1. 转到 Kotlin 的 [GitHub releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 页面。
2. 查找名称中带有 `kotlin-native` 的文件，并下载一个适合你操作系统的文件，
   例如 `kotlin-native-prebuilt-linux-x86_64-2.0.21.tar.gz`。
3. 将归档文件解压缩到你选择的目录。
4. 打开你的 shell 配置文件，并将编译器 `/bin` 目录的路径添加到 `PATH` 环境变量：

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

虽然编译器输出没有依赖项或虚拟机要求，但编译器本身
需要 Java 1.8 或更高版本的运行时。 它受
[JDK 8 (JAVA SE 8) 或更高版本](https://www.oracle.com/java/technologies/downloads/)支持。

:::

### 创建程序

选择一个工作目录并创建一个名为 `hello.kt` 的文件。 使用以下代码更新它：

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### 从控制台编译代码

要编译应用程序，请使用下载的编译器执行以下命令：

```bash
kotlinc-native hello.kt -o hello
```

`-o` 选项的值指定输出文件的名称，因此此调用将在 macOS 和 Linux 上生成 `hello.kexe` 二进制文件
（在 Windows 上生成 `hello.exe`）。

有关可用选项的完整列表，请参阅 [Kotlin 编译器选项](compiler-reference)。

### 运行程序

要运行程序，请在你的命令行工具中，导航到包含二进制文件的目录并运行
以下命令：

<Tabs>
<TabItem value="macOS and Linux" label="macOS and Linux">

```none
./hello.kexe
```

</TabItem>
<TabItem value="Windows" label="Windows">

```none
./hello.exe
```

</TabItem>
</Tabs>

应用程序将 "Hello, Kotlin/Native" 打印到标准输出。

## 接下来做什么？

* 完成[使用 C Interop 和 libcurl 创建应用程序](native-app-with-c-and-libcurl) 教程，该教程解释了如何
  创建一个 native（原生） HTTP 客户端并与 C 库进行互操作。
* 了解如何[为真实的 Kotlin/Native 项目编写 Gradle 构建脚本](multiplatform-dsl-reference)。
* 在[文档](gradle)中阅读有关 Gradle 构建系统的更多信息。
  ```