并将其包裹在花括号中 —— `${it.length}`。`it` 是 [lambda 形参](coding-conventions.md#lambda-parameters) 的默认名称。

   ```kotlin
   fun main() {
       // 读取输入值。
       println("Hello, enter your name:")
       val name = readln()
       // 计算名字中的字母数量。
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. 运行应用程序。
5. 输入你的名字并查看结果：

   ![应用程序输出](native-output-gutter-2.png){width=500}

现在让我们只计算名字中唯一的字母：

1. 在 `Main.kt` 文件中，为 `String` 声明新的 [扩展函数](extensions.md#extension-functions) `.countDistinctCharacters()`：

   * 使用 [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 函数将名字转换为小写。
   * 使用 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 函数将输入字符串转换为字符列表。
   * 使用 [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 函数仅选择名字中不同的字符。
   * 使用 [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数计算不同字符的数量。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. 使用 `.countDistinctCharacters()` 函数计算名字中唯一的字母：

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // 读取输入值。
       println("Hello, enter your name:")
       val name = readln()
       // 计算名字中的字母数量。
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // 打印唯一字母的数量。
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. 运行应用程序。
4. 输入你的名字并查看结果：

   ![应用程序输出](native-output-gutter-3.png){width=500}

## 使用 Gradle

在本节中，你将学习如何使用 [Gradle](https://gradle.org) 手动创建 Kotlin/Native 应用程序。它是 Kotlin/Native 和 Kotlin Multiplatform 项目的默认构建系统，在 Java、Android 和其他生态系统中也常用。

在构建 Kotlin/Native 项目时，Kotlin Gradle 插件会下载以下构件：

* 主要的 Kotlin/Native 软件包，其中包含 `konanc`、`cinterop` 和 `jsinterop` 等不同工具。默认情况下，Kotlin/Native 软件包作为一个简单的 Gradle 依赖项从 [Maven Central](https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/) 仓库下载。
* `konanc` 自身所需的依赖项，如 `llvm`。它们使用自定义逻辑从 JetBrains CDN 下载。

你可以在 Gradle 构建脚本的 `repositories {}` 块中更改主要软件包下载的来源。

### 创建项目文件

1. 首先，安装兼容版本的 [Gradle](https://gradle.org/install/)。请查看 [兼容性表](gradle-configure-project.md#apply-the-plugin) 以检查 Kotlin Gradle 插件 (KGP) 与可用 Gradle 版本的兼容性。
2. 创建一个空的项目目录。在其中创建一个包含以下内容的 `build.gradle(.kts)` 文件：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       // 指定下载主要软件包的来源
       // 默认使用 Maven Central
       mavenCentral()
   }

   kotlin {
       macosArm64()    // 在 macOS 上
       // linuxArm64() // 在 Linux 上
       // mingwX64()   // 在 Windows 上
   
       targets.withType<KotlinNativeTarget>().configureEach {
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
   import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       // 指定下载主要软件包的来源
       // 默认使用 Maven Central
       mavenCentral()
   }

   kotlin {
       macosArm64()    // 在 macOS 上
       // linuxArm64() // 在 Linux 上
       // mingwX64()   // 在 Windows 上
   
       targets.withType(KotlinNativeTarget).configureEach {
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

   你可以使用不同的 [目标名称](native-target-support.md)，例如 `macosArm64`、`iosArm64`、`linuxArm64` 和 `mingwX64` 来定义编译代码的目标。目标名称用于在项目中生成源路径和任务名称。

3. 在项目目录中创建一个空的 `settings.gradle(.kts)` 文件。
4. 创建 `src/nativeMain/kotlin` 目录，并在其中放置一个包含以下内容的 `hello.kt` 文件：

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

按照约定，所有源代码都位于 `src/<platform name>[Main|Test]/kotlin` 目录中，其中 `Main` 用于源代码，`Test` 用于测试。在本例中，`<platform name>` 为 `native`。

### 构建并运行项目

1. 从项目根目录，针对你的目标运行 `<yourTargetName>Binaries` 构建命令，例如：

   ```bash
   ./gradlew macosArm64Binaries
   ```

   此命令会创建 `build/bin/<yourTargetName>` 目录，其中包含两个子目录：`debugExecutable` 和 `releaseExecutable`。它们包含相应的二进制文件。

   默认情况下，二进制文件的名称与项目目录名称相同。

2. 要运行项目，请针对你的目标执行 `build/bin/<yourTargetName>/debugExecutable/<project_name>.kexe` 命令，例如：

   ```bash
   build/bin/macosArm64/DebugExecutable/hello.kexe
   ```

终端打印出 "Hello, Kotlin/Native!"。

### 在 IDE 中打开项目

现在，你可以在任何支持 Gradle 的 IDE 中打开你的项目。如果你使用 IntelliJ IDEA：

1. 选择 **File** | **Open**。
2. 选择项目目录并点击 **Open**。
   IntelliJ IDEA 会自动检测它是否为 Kotlin/Native 项目。

如果项目遇到问题，IntelliJ IDEA 会在 **Build** 选项卡中显示错误消息。

## 使用命令行编译器

在本节中，你将学习如何使用命令行工具中的 Kotlin 编译器创建 Kotlin/Native 应用程序。

### 下载并安装编译器

安装编译器：

1. 转到 Kotlin 的 [GitHub 发布页面](%kotlinLatestUrl%)，向下滚动到 **Assets** 部分。
2. 寻找名称中包含 `kotlin-native` 的文件，并下载适合你操作系统的版本，例如 `kotlin-native-prebuilt-linux-x86_64-%kotlinVersion%.tar.gz`。
3. 将压缩包解压缩到你选择的目录中。
4. 打开你的 shell 配置文件，将编译器的 `/bin` 目录路径添加到 `PATH` 环境变量中： 

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

> 虽然编译器输出没有依赖项或虚拟机要求，但编译器本身需要 Java 1.8 或更高版本的运行时。它受 [JDK 8 (JAVA SE 8) 或更高版本](https://www.oracle.com/java/technologies/downloads/) 支持。
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

要编译应用程序，请使用下载的编译器执行以下命令：

```bash
kotlinc-native hello.kt -o hello
```

`-o` 选项的值指定了输出文件的名称，因此此调用会在 macOS 和 Linux 上生成 `hello.kexe` 二进制文件（在 Windows 上为 `hello.exe`）。

有关可用选项的完整列表，请参阅 [Kotlin 编译器选项](compiler-reference.md)。

### 运行程序

要在命令行工具中运行程序，请导航到包含二进制文件的目录并运行以下命令：

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

应用程序将 "Hello, Kotlin/Native" 打印到标准输出。

## 下一步

* 完成 [使用 C 互操作和 libcurl 创建应用](native-app-with-c-and-libcurl.md) 教程，该教程解释了如何创建原生 HTTP 客户端并与 C 库进行互操作。
* 了解如何 [为实际的 Kotlin/Native 项目编写 Gradle 构建脚本](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)。
* 在 [文档](gradle.md) 中阅读更多关于 Gradle 构建系统的信息。