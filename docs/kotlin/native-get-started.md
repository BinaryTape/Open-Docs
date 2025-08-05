[//]: # (title: Kotlin/Native 入门)

在本教程中，您将学习如何创建 Kotlin/Native 应用程序。选择最适合您的工具来创建应用：

* **[IDE](#in-ide)**。在这里，您可以从版本控制系统克隆项目模板并在 IntelliJ IDEA 中使用它。
* **[Gradle 构建系统](#using-gradle)**。为了更好地理解内部原理，您可以手动为项目创建构建文件。
* **[命令行工具](#using-the-command-line-compiler)**。您可以使用 Kotlin/Native 编译器（它作为标准 Kotlin 发行版的一部分提供），并直接在命令行工具中创建应用。

控制台编译可能看起来简单直接，但对于包含数百个文件和库的更大型项目来说，它的伸缩性不佳。对于此类项目，我们建议使用 IDE 或构建系统。

使用 Kotlin/Native，您可以为[不同的目标平台](native-target-support.md)编译，包括 Linux、macOS 和 Windows。虽然可以进行跨平台编译（这意味着使用一个平台为另一个平台编译），但本教程中，您将以您正在编译的同一平台为目标。

> 如果您使用 Mac 并希望为 macOS 或其他 Apple 目标平台创建和运行应用程序，您还需要先安装 [Xcode Command Line Tools](https://developer.apple.com/download/)，启动它并接受许可条款。
>
{style="note"}

## 在 IDE 中

在本节中，您将学习如何使用 IntelliJ IDEA 创建 Kotlin/Native 应用程序。您可以使用 Community Edition 和 Ultimate Edition。

### 创建项目

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 中，通过选择 **File** | **New** | **Project from Version Control** 并使用此 URL 来克隆[项目模板](https://github.com/Kotlin/kmp-native-wizard)：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```   

3. 打开 `gradle/libs.versions.toml` 文件，它是项目依赖项的版本目录。要创建 Kotlin/Native 应用程序，您需要 Kotlin Multiplatform Gradle 插件，它的版本与 Kotlin 相同。请确保使用最新的 Kotlin 版本：

   ```none
   [versions]
   kotlin = "%kotlinVersion%"
   ```

4. 按照建议重新加载 Gradle 文件：

   ![Load Gradle changes button](load-gradle-changes.png){width=295}

有关这些设置的更多信息，请参见 [Multiplatform Gradle DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。

### 构建并运行应用程序

打开 `src/nativeMain/kotlin/` 目录中的 `Main.kt` 文件：

* `src` 目录包含 Kotlin 源文件。
* `Main.kt` 文件包含使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数打印“Hello, Kotlin/Native!”的代码。

按下边栏中的绿色图标来运行代码：

![Run the application](native-run-gutter.png){width=478}

IntelliJ IDEA 使用 Gradle 任务运行代码，并在 **Run** 标签页中输出结果：

![Application output](native-output-gutter-1.png){width=331}

首次运行后，IDE 会在顶部创建相应的运行配置：

![Gradle run configuration](native-run-config.png){width=503}

> IntelliJ IDEA Ultimate 版用户可以安装 [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support) 插件，该插件允许调试已编译的原生可执行文件，并自动为导入的 Kotlin/Native 项目创建运行配置。

您可以[配置 IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build) 以自动构建项目：

1. 转到 **Settings | Build, Execution, Deployment | Compiler**。
2. 在 **Compiler** 页面上，选择 **Build project automatically**。
3. 应用更改。

现在，当您修改类文件或保存文件（<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>）时，IntelliJ IDEA 会自动执行项目的增量构建。

### 更新应用程序

让我们为您的应用程序添加一个特性，让它能够计算您姓名中的字母数量：

1. 在 `Main.kt` 文件中，添加代码读取输入。使用 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数读取输入值并将其赋值给 `name` 变量：

   ```kotlin
   fun main() {
       // 读取输入值。
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

2. 要使用 Gradle 运行此应用，请在 `build.gradle.kts` 文件中指定 `System.in` 作为输入，然后加载 Gradle 更改：

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
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="runTask?.standardInput = System.`in`"}

3. 消除空白字符并计算字母：

   * 使用 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 函数移除姓名中的空格。
   * 使用作用域函数 [`let`](scope-functions.md#let) 在对象上下文内运行该函数。
   * 使用[字符串模板](strings.md#string-templates)将姓名长度插入字符串中，方法是添加美元符号并用花括号将其括起来 – `${it.length}`。`it` 是[lambda 实参](coding-conventions.md#lambda-parameters)的默认名称。

   ```kotlin
   fun main() {
       // 读取输入值。
       println("Hello, enter your name:")
       val name = readln()
       // 计算姓名中的字母数量。
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. 运行应用程序。
5. 输入您的姓名，然后查看结果：

   ![Application output](native-output-gutter-2.png){width=422}

现在我们只计算姓名中唯一的字母：

1. 在 `Main.kt` 文件中，为 `String` 声明新的[扩展函数](extensions.md#extension-functions) `.countDistinctCharacters()`：

   * 使用 [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 函数将姓名转换为小写。
   * 使用 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 函数将输入字符串转换为字符 list。
   * 使用 [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 函数只选择姓名中不同的字符。
   * 使用 [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数计算不同的字符。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. 使用 `.countDistinctCharacters()` 函数计算姓名中唯一的字母：

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // 读取输入值。
       println("Hello, enter your name:")
       val name = readln()
       // 计算姓名中的字母数量。
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // 打印唯一字母的数量。
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. 运行应用程序。
4. 输入您的姓名并查看结果：

   ![Application output](native-output-gutter-3.png){width=422}

## 使用 Gradle

在本节中，您将学习如何使用 [Gradle](https://gradle.org) 手动创建 Kotlin/Native 应用程序。它是 Kotlin/Native 和 Kotlin Multiplatform 项目的默认构建系统，也常用于 Java、Android 和其他生态系统。

### 创建项目文件

1. 开始之前，请安装兼容版本的 [Gradle](https://gradle.org/install/)。请参见[兼容性表格](gradle-configure-project.md#apply-the-plugin)以检测 Kotlin Gradle 插件 (KGP) 与可用 Gradle 版本的兼容性。
2. 创建一个空项目目录。在其中，创建 `build.gradle(.kts)` 文件并包含以下内容：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
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
       gradleVersion = "%gradleVersion%"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
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
       gradleVersion = '%gradleVersion%'
       distributionType = 'BIN'
   }
   ```

   </tab>
   </tabs>

   您可以使用不同的[目标名称](native-target-support.md)，例如 `macosArm64`、`iosArm64`、`linuxArm64` 和 `mingwX64` 来定义编译代码的目标平台。这些目标名称可以选择将平台名称作为形参，在本例中为 `native`。平台名称用于在项目中生成源代码路径和任务名称。

3. 在项目目录中创建一个空 `settings.gradle(.kts)` 文件。
4. 创建 `src/nativeMain/kotlin` 目录，并在其中放置一个 `hello.kt` 文件，内容如下：

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

按照约定，所有源代码都位于 `src/<target name>[Main|Test]/kotlin` 目录中，其中 `Main` 用于源代码，`Test` 用于测试。`<target name>` 对应于目标平台（在本例中为 `native`），如构建文件中所指定。

### 构建并运行项目

1. 在项目根目录中，运行构建命令：

   ```bash
   ./gradlew nativeBinaries
   ```

   此命令会创建 `build/bin/native` 目录，其中包含两个子目录：`debugExecutable` 和 `releaseExecutable`。它们包含相应的二进制文件。

   默认情况下，二进制文件的名称与项目目录的名称相同。

2. 要运行项目，请执行以下命令：

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

终端会打印“Hello, Kotlin/Native!”。

### 在 IDE 中打开项目

现在，您可以在任何支持 Gradle 的 IDE 中打开项目。如果您使用 IntelliJ IDEA：

1. 选择 **File** | **Open**。
2. 选择项目目录并点击 **Open**。IntelliJ IDEA 会自动检测它是否是 Kotlin/Native 项目。

如果您遇到项目问题，IntelliJ IDEA 会在 **Build** 标签页中显示错误消息。

## 使用命令行编译器

在本节中，您将学习如何使用命令行工具中的 Kotlin 编译器创建 Kotlin/Native 应用程序。

### 下载并安装编译器

要安装编译器：

1. 转到 Kotlin 的 [GitHub 发布](%kotlinLatestUrl%)页面，并向下滚动到 **Assets** 部分。
2. 查找名称中包含 `kotlin-native` 的文件，并下载一个适合您操作系统的文件，例如 `kotlin-native-prebuilt-linux-x86_64-%kotlinVersion%.tar.gz`。
3. 将存档解压到您选择的目录。
4. 打开您的 shell 配置文件，并将编译器的 `/bin` 目录路径添加到 `PATH` 环境变量中：

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

> 尽管编译器输出没有依赖项或虚拟机要求，但编译器本身需要 Java 1.8 或更高运行时。它支持 [JDK 8 (JAVA SE 8) 或更高版本](https://www.oracle.com/java/technologies/downloads/)。
>
{style="note"}

### 创建程序

选择一个工作目录并创建一个名为 `hello.kt` 的文件。使用以下代码更新它：

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### 从控制台编译代码

要编译应用程序，请使用已下载的编译器执行以下命令：

```bash
kotlinc-native hello.kt -o hello
```

`-o` 选项的值指定输出文件的名称，因此此调用会在 macOS 和 Linux 上生成 `hello.kexe` 二进制文件（在 Windows 上生成 `hello.exe`）。

有关可用选项的完整列表，请参见 [Kotlin 编译器选项](compiler-reference.md)。

### 运行程序

要运行程序，请在命令行工具中导航到包含二进制文件的目录，然后运行以下命令：

<tabs>
<tab title="macOS 和 Linux">

```none
./hello.kexe
```

</tab>
<tab title="Windows">

```none
./hello.exe
```

</tab>
</tabs>

应用程序会打印“Hello, Kotlin/Native!”到标准输出。

## 接下来？

* 完成[使用 C 互操作和 libcurl 创建应用](native-app-with-c-and-libcurl.md)教程，该教程解释了如何创建原生 HTTP 客户端以及如何与 C 库进行互操作。
* 学习如何[为实际的 Kotlin/Native 项目编写 Gradle 构建脚本](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
* 在[文档](gradle.md)中阅读更多关于 Gradle 构建系统的信息。