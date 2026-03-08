) 并将其包含在花括号 (`{}`) 中。
  而 `it` 是 [lambda 参数](coding-conventions.md#lambda-parameters) 的默认名称。

#### 运行应用程序

1. [运行应用程序](#build-and-run-the-application)。
2. 输入您的名字。
3. 按下 <shortcut>输入</shortcut>。 

您可以看到结果：

![应用程序输出](js-output-gutter-2.png){width=600}

#### 处理输入以计算不重复字母的数量

作为一项额外练习，让我们处理输入以计算并显示单词中不重复字母的数量：

1. 在 `src/jsMain/kotlin/Main.kt` 文件中，为 `String` 添加 `.countDistinctCharacters()` [扩展函数](extensions.md#extension-functions)：

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

   在上面的代码中：

   * [`.lowercase()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 将名字转换为小写。
   * [`toList()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 将输入字符串转换为字符列表。
   * [`distinct()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 仅从单词中选择不重复的字符。
   * [`count()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 统计不重复字符的数量。

2. 在 `main()` 中调用 `.countDistinctCharacters()` 函数。它会统计您名字中不重复的字母：

   ```kotlin
    fun main() {
        // 为我们的输出创建一个文本容器
        val output = document.body?.appendTextContainer()
   
        // 读取输入值
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // 打印不重复字母的数量
                // 替换 output?.textContent = "Your name contains ${it.length} letters"
                output?.textContent = "Your name contains ${it.countDistinctCharacters()} unique letters"
            }
        })
   }
   ```

3. 按照步骤[运行应用程序并输入您的名字](#run-the-application)。

您可以看到结果：

![应用程序输出](js-output-gutter-3.png){width=600}

## 使用 Gradle 创建应用程序

在本节中，您可以了解如何使用 [Gradle](https://gradle.org) 手动创建一个 Kotlin/JS 应用程序。

Gradle 是 Kotlin/JS 和 Kotlin 多平台项目的默认构建系统。它也广泛应用于 Java、Android 和其他生态系统。

### 创建项目文件

1. 确保您使用的 Gradle 版本与 Kotlin Gradle 插件 (KGP) 兼容。
   详情请参阅[兼容性表](gradle-configure-project.md#apply-the-plugin)。
2. 使用文件管理器、命令行或您喜欢的任何工具为项目创建一个空目录。 
3. 在项目目录内，创建一个具有以下内容的 `build.gradle.kts` 文件：

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
       js {
           // 使用 browser() 以在浏览器中运行，或使用 nodejs() 以在 Node.js 中运行
           browser() 
           binaries.executable()
       }
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
       js {
           // 使用 browser() 以在浏览器中运行，或使用 nodejs() 以在 Node.js 中运行
           browser() 
           binaries.executable()
       }
   }
   ```

   </tab>
   </tabs>

   > 您可以使用不同的[执行环境](js-project-setup.md#execution-environments)，
   > 例如 `browser()` 或 `nodejs()`。 
   > 每个环境定义了代码运行的位置，并决定了 Gradle 如何在项目中生成任务名称。
   >
   > {style="note"}

4. 在项目目录内，创建一个空的 `settings.gradle.kts` 文件。
5. 在项目目录内，创建一个 `src/jsMain/kotlin` 目录。
6. 在 `src/jsMain/kotlin` 目录内，添加一个具有以下内容的 `hello.kt` 文件：

   ```kotlin
   fun main() {
       println("Hello, Kotlin/JS!")
   }
   ```

   按照约定，所有源代码都位于 `src/<target name>[Main|Test]/kotlin` 目录： 
   * `Main` 是源代码的位置。
   * `Test` 是测试的位置。 
   * `<target name>` 对应目标平台（在本例中为 `js`）。

**对于 `browser` 环境**

> 如果您使用的是 `browser` 环境，请遵循以下步骤。
> 如果您使用的是 `nodejs` 环境，请转到[构建并运行项目](#build-and-run-the-project)部分。
> 
> {style="note"}

1. 在项目目录内，创建一个 `src/jsMain/resources` 目录。
2. 在 `src/jsMain/resources` 目录内，创建一个具有以下内容的 `index.html` 文件：

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Application title</title>
   </head>
   <body>
       <script src="$NAME_OF_YOUR_PROJECT_DIRECTORY.js"></script>
   </body>
   </html>
   ```

3. 将 `<$NAME_OF_YOUR_PROJECT_DIRECTORY>` 占位符替换为您的项目目录名称。

### 构建并运行项目

要构建项目，请在项目根目录运行以下命令：

```bash
# 对于浏览器
gradle jsBrowserDevelopmentRun

# 或者

# 对于 Node.js
gradle jsNodeDevelopmentRun 
```

如果您使用的是 `browser` 环境，您可以看到浏览器打开了 `index.html` 文件，并在浏览器控制台中打印了 `"Hello, Kotlin/JS!"`。
您可以使用 <shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut> 命令打开控制台。

![应用程序输出](js-output-gutter-4.png){width=600}

如果您使用的是 `nodejs` 环境，您可以看到终端打印了 `"Hello, Kotlin/JS!"`。

![应用程序输出](js-output-gutter-5.png){width=500}

### 在 IDE 中打开项目

您可以在任何支持 Gradle 的 IDE 中打开您的项目。 

如果您使用 IntelliJ IDEA：

1. 选择 **File** | **Open**。
2. 找到项目目录。
3. 点击 **Open**。

IntelliJ IDEA 会自动检测这是否是一个 Kotlin/JS 项目。
如果您在项目上遇到问题，IntelliJ IDEA 会在 **Build** 窗格中显示错误信息。

## 下一步

<!-- * Complete the [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) tutorial that explains how
  to share your Kotlin code with a JavaScript/TypeScript application.]: -->

* [设置您的 Kotlin/JS 项目](js-project-setup.md)。
* 了解如何[调试 Kotlin/JS 应用程序](js-debugging.md)。
* 了解如何[使用 Kotlin/JS 编写并运行测试](js-running-tests.md)。
* 了解如何[为实际的 Kotlin/JS 项目编写 Gradle 构建脚本](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)。
* 阅读更多关于 [构建系统](gradle.md)的信息。