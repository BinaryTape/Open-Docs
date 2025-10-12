[//]: # (title: Kotlin/JS 入门)

本教程展示了如何使用 Kotlin/JavaScript (Kotlin/JS) 为浏览器创建 Web 应用程序。
要创建您的应用，请选择最适合您工作流的工具：

*   **[IntelliJ IDEA](#create-your-application-in-intellij-idea)**：从版本控制克隆项目模板并在 IntelliJ IDEA 中进行开发。
*   **[Gradle 构建系统](#create-your-application-using-gradle)**：手动为您的项目创建构建文件，以便更好地理解其底层工作原理。

> 除了面向浏览器，您还可以使用 Kotlin/JS 编译面向其他环境的应用程序。
> 有关更多信息，请参见[执行环境](js-project-setup.md#execution-environments)。
>
{style="tip"}

## 在 IntelliJ IDEA 中创建应用程序

要创建您的 Kotlin/JS Web 应用程序，您可以使用 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/?section=mac) 的社区版或旗舰版。

### 设置环境

1.  下载并安装最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2.  [设置 Kotlin 多平台开发环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment)。

### 创建项目

1.  在 IntelliJ IDEA 中，选择 **File** | **New** | **Project from Version Control**。
2.  输入 [Kotlin/JS 模板项目](https://github.com/Kotlin/kmp-js-wizard)的 URL：

    ```text
    https://github.com/Kotlin/kmp-js-wizard
    ```

3.  点击 **Clone**。

### 配置项目

1.  打开 `kmp-js-wizard/gradle/libs.versions.toml` 文件。它包含项目依赖项的版本目录。
2.  确保 Kotlin 版本与 Kotlin 多平台 Gradle 插件的版本匹配，这是创建面向 Kotlin/JS 的 Web 应用程序所必需的：

    ```text
    [versions]
    kotlin = "%kotlinVersion%"

    [plugins]
    kotlin-multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
    ```

3.  同步 Gradle 文件（如果您更新了 `libs.versions.toml` 文件）。点击构建文件中出现的 **Load Gradle Changes** 图标。

    ![Load the Gradle changes button](load-gradle-changes.png){width=300}

    或者，点击 Gradle 工具窗口中的刷新按钮。

有关多平台项目的 Gradle 配置的更多信息，请参见 [Multiplatform Gradle DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。

### 构建并运行应用程序

1.  打开 `src/jsMain/kotlin/Main.kt` 文件。

    *   `src/jsMain/kotlin/` 目录包含项目 JavaScript 目标平台的主要 Kotlin 源文件。
    *   `Main.kt` 文件包含使用 [`kotlinx.browser`](https://github.com/Kotlin/kotlinx-browser) API 在浏览器页面上渲染 "Hello, Kotlin/JS!" 的代码。

2.  点击 `main()` 函数中的 **Run** 图标来运行代码。

    ![Run the application](js-run-gutter.png){width=500}

Web 应用程序会自动在您的浏览器中打开。
或者，在运行完成后，您可以在浏览器中打开以下 URL：

```text
   http://localhost:8080/
```

您可以看到 Web 应用程序：

![Application output](js-output-gutter-1.png){width=600}

首次运行应用程序后，IntelliJ IDEA 会在其顶部栏创建相应的运行配置（**jsMain \[js]**）：

![Gradle run configuration](js-run-config.png){width=500}

> 在 IntelliJ IDEA 旗舰版中，
> 您可以使用 [JS 调试器](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)
> 直接从 IDE 调试代码。
>
> {style="tip"}

### 启用持续构建

每当您进行更改时，Gradle 都可以自动重新构建您的项目：

1.  在运行配置列表中选择 **jsMain \[js]**，然后点击 **More Actions** | **Edit**。

    ![Gradle edit run configuration](js-edit-run-config.png){width=500}

2.  在 **Run/Debug Configurations** 对话框中，在 **Run** 字段内输入 `jsBrowserDevelopmentRun --continuous`。

    ![Continuous run configuration](js-continuous-run-config.png){width=500}

3.  点击 **OK**。

现在，当您运行应用程序并进行任何更改时，
每当您保存 (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>) 或更改类文件时，
Gradle 都会自动为项目执行增量构建并热重载浏览器。

### 修改应用程序

修改应用程序以添加一个计算单词中字母数量的特性。

#### 添加输入元素

1.  在 `src/jsMain/kotlin/Main.kt` 文件中，
    通过一个[扩展函数](extensions.md#extension-functions)添加一个 [HTML input 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
    来读取用户输入：

    ```kotlin
    // Replace the Element.appendMessage() function
    fun Element.appendInput() {
        val input = document.createElement("input")
        appendChild(input)
    }
    ```

2.  在 `main()` 中调用 `appendInput()` 函数。它会在页面上显示一个输入元素：

    ```kotlin
    fun main() {
        // Replace document.body!!.appendMessage(message)
        document.body?.appendInput()
    }
    ```

3.  [再次运行应用程序](#build-and-run-the-application)。

    您的应用程序看起来像这样：

    ![Application with an input element](js-added-input-element.png){width=600}

#### 添加输入事件处理

1.  在 `appendInput()` 函数内部添加一个监听器，以读取输入值并响应变化：

    ```kotlin
    // Replace the current appendInput() function
    fun Element.appendInput(onChange: (String) -> Unit = {}) {
        val input = document.createElement("input").apply {
            addEventListener("change") { event ->
                onChange(event.target.unsafeCast<HTMLInputElement>().value)
            }
        }
        appendChild(input)
    }
    ```

2.  按照 IDE 的建议导入 `HTMLInputElement` 依赖项。

    ![Import dependencies](js-import-dependency.png){width=600}

3.  在 `main()` 中调用 `onChange` 回调函数。它读取并处理输入值：

    ```kotlin
    fun main() {
        // Replace document.body?.appendInput()
        document.body?.appendInput(onChange = { println(it) })
    }
    ```

#### 添加输出元素

1.  通过定义一个创建段落的[扩展函数](extensions.md#extension-functions)来添加一个文本元素以显示输出：

    ```kotlin
    fun Element.appendTextContainer(): Element {
        return document.createElement("p").also(::appendChild)
    }
    ```

2.  在 `main()` 中调用 `appendTextContainer()` 函数。它创建输出元素：

    ```kotlin
    fun main() {
        // Creates a text container for our output
        // Replace val message = Message(topic = "Kotlin/JS", content = "Hello!")
        val output = document.body?.appendTextContainer()

        // Reads the input value
        document.body?.appendInput(onChange = { println(it) })
    }
    ```

#### 处理输入以计算字母数量

通过移除空白字符并显示带字母数量的输出来处理输入。

将以下代码添加到 `main()` 函数中的 `appendInput()` 函数内部：

```kotlin
fun main() {
    // Creates a text container for our output
    val output = document.body?.appendTextContainer()

    // Reads the input value
    // Replace the current appendInput() function
    document.body?.appendInput(onChange = { name ->
        name.replace(" ", "").let {
            output?.textContent = "Your name contains ${it.length} letters"
        }
    })
}
```

从上述代码中：

*   [`replace()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 移除名称中的空白字符。
*   [`let{}` 作用域函数](scope-functions.md#let) 在对象上下文中运行函数。
*   [字符串模板](strings.md#string-templates) (`${it.length}`)
    通过在前面加上美元符号 (`$`) 并用花括号 (`{}`) 括起来，将单词的长度插入字符串中。
    而 `it` 是 [lambda 形参](coding-conventions.md#lambda-parameters) 的默认名称。

#### 运行应用程序

1.  [运行应用程序](#build-and-run-the-application)。
2.  输入您的姓名。
3.  按下 <shortcut>Enter</shortcut>。

您可以看到结果：

![Application output](js-output-gutter-2.png){width=600}

#### 处理输入以计算唯一字母数量

作为附加练习，让我们处理输入以计算并显示单词中唯一字母的数量：

1.  在 `src/jsMain/kotlin/Main.kt` 文件中，为 `String` 添加 `.countDistinctCharacters()` [扩展函数](extensions.md#extension-functions)：

    ```kotlin
    fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
    ```

    从上述代码中：

    *   [`.lowercase()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 将名称转换为小写。
    *   [`toList()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 将输入字符串转换为字符列表。
    *   [`distinct()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 仅选择单词中的唯一字符。
    *   [`count()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 计算唯一字符。

2.  在 `main()` 中调用 `.countDistinctCharacters()` 函数。它计算名称中的唯一字母数量：

    ```kotlin
    fun main() {
        // Creates a text container for our output
        val output = document.body?.appendTextContainer()

        // Reads the input value
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // Prints the number of unique letters
                // Replace output?.textContent = "Your name contains ${it.length} letters"
                output?.textContent = "Your name contains ${it.countDistinctCharacters()} unique letters"
            }
        })
    }
    ```

3.  按照步骤[运行应用程序并输入您的姓名](#run-the-application)。

您可以看到结果：

![Application output](js-output-gutter-3.png){width=600}

## 使用 Gradle 创建应用程序

在本节中，您将学习如何使用 [Gradle](https://gradle.org) 手动创建 Kotlin/JS 应用程序。

Gradle 是 Kotlin/JS 和 Kotlin 多平台项目的默认构建系统。
它也常用于 Java、
Android 和其他生态系统。

### 创建项目文件

1.  确保您使用的 Gradle 版本与 Kotlin Gradle 插件 (KGP) 兼容。
    请参见[兼容性表](gradle-configure-project.md#apply-the-plugin)了解更多详情。
2.  使用您的文件浏览器、命令行或任何您喜欢的工具，为您的项目创建一个空目录。
3.  在项目目录中，创建一个 `build.gradle.kts` 文件，其内容如下：

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
            // Use browser() for running in a browser or nodejs() for running in Node.js
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
            // Use browser() for running in a browser or nodejs() for running in Node.js
            browser()
            binaries.executable()
        }
    }
    ```

    </tab>
    </tabs>

    > 您可以使用不同的[执行环境](js-project-setup.md#execution-environments)，
    > 例如 `browser()` 或 `nodejs()`。
    > 每个环境都定义了代码的运行位置，并决定了 Gradle 如何在项目中生成任务名称。
    >
    > {style="note"}

4.  在项目目录中，创建一个空的 `settings.gradle.kts` 文件。
5.  在项目目录中，创建一个 `src/jsMain/kotlin` 目录。
6.  在 `src/jsMain/kotlin` 目录中，添加一个 `hello.kt` 文件，其内容如下：

    ```kotlin
    fun main() {
        println("Hello, Kotlin/JS!")
    }
    ```

    按照约定，所有源文件都位于 `src/<target name>[Main|Test]/kotlin` 目录中：
    *   `Main` 是源代码的位置。
    *   `Test` 是测试的位置。
    *   `<target name>` 对应于目标平台（在本例中为 `js`）。

**对于 `browser` 环境**

> 如果您使用的是 `browser` 环境，请按照以下步骤操作。
> 如果您使用的是 `nodejs` 环境，
> 请转到[构建并运行项目](#build-and-run-the-project)部分。
>
> {style="note"}

1.  在项目目录中，创建一个 `src/jsMain/resources` 目录。
2.  在 `src/jsMain/resources` 目录中，创建一个 `index.html` 文件，其内容如下：

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

3.  将 `<$NAME_OF_YOUR_PROJECT_DIRECTORY>` 占位符替换为您的项目目录的名称。

### 构建并运行项目

要构建项目，请从项目根目录运行以下命令：

```bash
# For browser
gradle jsBrowserDevelopmentRun

# OR

# For Node.js
gradle jsNodeDevelopmentRun
```

如果您使用的是 `browser` 环境，
您会看到浏览器打开 `index.html` 文件并在浏览器控制台输出 `"Hello, Kotlin/JS!"`。
您可以使用 <shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut> 命令打开控制台。

![Application output](js-output-gutter-4.png){width=600}

如果您使用的是 `nodejs` 环境，您会看到终端输出 `"Hello, Kotlin/JS!"`。

![Application output](js-output-gutter-5.png){width=500}

### 在 IDE 中打开项目

您可以在任何支持 Gradle 的 IDE 中打开您的项目。

如果您使用 IntelliJ IDEA：

1.  选择 **File** | **Open**。
2.  找到项目目录。
3.  点击 **Open**。

IntelliJ IDEA 会自动检测它是否是一个 Kotlin/JS 项目。
如果您遇到项目问题，
IntelliJ IDEA 会在 **Build** 面板中显示错误消息。

## 接下来？

<!-- * Complete the [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) tutorial that explains how
  to share your Kotlin code with a JavaScript/TypeScript application.]: -->

*   [设置您的 Kotlin/JS 项目](js-project-setup.md)。
*   了解如何[调试 Kotlin/JS 应用程序](js-debugging.md)。
*   了解如何[使用 Kotlin/JS 编写并运行测试](js-running-tests.md)。
*   了解如何[为真实的 Kotlin/JS 项目编写 Gradle 构建脚本](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
*   了解更多关于 [Gradle 构建系统](gradle.md) 的信息。