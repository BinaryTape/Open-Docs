[//]: # (title: 运行代码片段)

Kotlin 代码通常组织在项目中，您可以在 IDE、文本编辑器或其他工具中处理这些项目。然而，如果您想快速了解函数的工作方式或查找表达式的值，则无需创建新的项目并构建它。请查看以下三种便捷的方式，可在不同环境中即时运行 Kotlin 代码：

*   [IDE 中的暂存文件](#ide-scratches-and-worksheets)。
*   [浏览器中的 Kotlin Playground](#browser-kotlin-playground)。
*   [命令行中的 ki shell](#command-line-ki-shell)。

## IDE：暂存 {id="ide-scratches-and-worksheets"}

IntelliJ IDEA 和 Android Studio 支持 Kotlin [暂存文件](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)。

**暂存文件**（或简称**暂存**）允许您在与项目相同的 IDE 窗口中创建代码草稿并即时运行它们。暂存不**与项目绑定**；您可以从**操作系统**上的任何 IntelliJ IDEA 窗口中**访问和运行**所有暂存。

要创建 Kotlin 暂存，请点击 **File** | **New** | **Scratch File** 并选择 **Kotlin** 类型。

**语法高亮**、**自动补全**以及其他 IntelliJ IDEA **代码编辑特性**在暂存中均**受支持**。无需**声明** `main()` **函数**——您编写的所有代码都**如同在 `main()` 的函数体中执行**。

在暂存中**完成编写**代码后，点击 **Run**。**执行结果**将**显示在您代码的对应行中**。

![Run scratch](scratch-run.png){width=700}

### 交互模式

IDE 可以**自动**运行暂存中的代码。为了**在您停止输入后立即获取执行结果**，请**开启** **Interactive mode**（**交互模式**）。

![Scratch interactive mode](scratch-interactive.png){width=700}

### 使用模块

您可以在暂存中使用 Kotlin **项目**中的**类或函数**。

要在暂存中使用**项目**中的类或函数，请**照常**使用 `import` **语句将它们导入暂存文件**。然后编写您的代码，并在 **Use classpath of module** 列表中**选中相应模块**后运行它。

暂存都使用**连接模块**的**编译版本**。因此，如果您**修改模块的源文件**，当您**重新构建模块**时，这些更改将**传播到**暂存。要在每次运行暂存之前**自动重新构建模块**，请选择 **Make module before Run**。

![Scratch select module](scratch-select-module.png){width=700}

### 以 REPL 模式运行

要对暂存中的每个**特定表达式求值**，请**选中 Use REPL 选项后运行**。代码行将**顺序地**运行，**提供每个调用的结果**。您可以稍后通过**引用其自动生成的 `res*` 名称**（它们**显示在相应行中**）在同一文件中使用这些结果。

![Scratch REPL](scratch-repl.png){width=700}

## 浏览器：Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) 是一款用于在浏览器中**编写、运行和共享** Kotlin 代码的在线**应用程序**。

### 编写和编辑代码

在 Playground 的**编辑器区域**，您可以像在**源文件**中一样编写代码：
*   以任意顺序添加您自己的类、函数和**顶层声明**。
*   在 `main()` **函数体**中编写**可执行部分**。

与**典型 Kotlin 项目**中一样，Playground 中的 `main()` **函数**可以有 `args` **形参**或**没有任何形参**。要在执行时**传递程序实参**，请将它们写入 **Program arguments** 字段。

![Playground: code completion](playground-completion.png){width=700}

Playground 会**高亮代码**并在您输入时**显示代码补全选项**。它**自动导入**来自**标准库**和 [`kotlinx.coroutines`](coroutines-overview.md) 的**声明**。

### 选择执行环境

Playground 提供了**自定义执行环境**的方式：
*   多个 Kotlin 版本，包括**可用的未来版本抢先体验预览**。
*   多个**后端**用于运行代码：JVM、JS（**旧版**或 [IR compiler](js-ir-compiler.md)，或 Canvas），或 JUnit。

![Playground: environment setup](playground-env-setup.png){width=700}

对于 JS 后端，您还可以查看**生成的 JS 代码**。

![Playground: generated JS](playground-generated-js.png){width=700}

### 在线共享代码

使用 Playground **与他人共享代码**——点击 **Copy link** 并**将其发送给您想展示代码的任何人**。

您还可以将 Playground 中的**代码片段嵌入**到其他网站中，甚至**使它们可运行**。点击 **Share code** 将您的**示例嵌入**到任何**网页**或 [Medium](https://medium.com/) **文章**中。

![Playground: share code](playground-share.png){width=700}

## 命令行：ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell)（**Kotlin Interactive Shell**）是用于**在终端中运行** Kotlin 代码的**命令行工具**。它**适用于** Linux、macOS 和 Windows。

ki shell 提供了**基本的代码求值能力**，以及以下**高级特性**：
*   代码补全
*   **类型检测**
*   **外部依赖项**
*   **代码片段**的**粘贴模式**
*   脚本支持

关于 [ki shell GitHub **版本库**](https://github.com/Kotlin/kotlin-interactive-shell)的**更多详情**。

### 安装并运行 ki shell

要**安装** ki shell，请从 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) **下载最新版本**并将其**解压**到**您选择的目录**。

在 macOS 上，您还可以**通过运行以下命令**使用 Homebrew **安装** ki shell：

```shell
brew install ki
```

要**启动** ki shell，请在 Linux 和 macOS 上运行 `bin/ki.sh`（如果 ki shell 是**通过 Homebrew 安装**的，则只需运行 `ki`），或在 Windows 上运行 `bin\ki.bat`。

shell 运行后，您可以**立即开始编写** Kotlin 代码。键入 `:help`（或 `:h`）以查看 ki shell 中**可用**的命令。

### 代码补全和高亮

当您按下 **Tab** 键时，ki shell 会**显示代码补全选项**。它还在您输入时**提供语法高亮**。您可以**通过输入** `:syntax off` **禁用此特性**。

![ki shell highlighting and completion](ki-shell-highlight-completion.png){width=700}

当您按下 **Enter** 键时，ki shell 会**对输入的行求值**并**打印结果**。**表达式的值作为**具有**自动生成名称**（例如 `res*`）的**变量打印**。您稍后可以在**您运行的代码中使用这些变量**。如果**输入的构造不完整**（**例如**，带有条件但**没有主体**的 `if` 语句），shell 会打印三个点并**等待剩余部分**。

![ki shell results](ki-shell-results.png){width=700}

### 检测表达式类型

对于**复杂表达式**或您**不熟悉的 API**，ki shell **提供**了 `:type`（或 `:t`）命令，它会**显示表达式的类型**：

![ki shell type](ki-shell-type.png){width=700}

### 加载代码

如果您需要的代码**存储在其他地方**，则有**两种加载和使用它**的方式：
*   使用 `:load`（或 `:l`）命令加载**源文件**。
*   使用 `:paste`（或 `:p`）命令在**粘贴模式**下复制并粘贴**代码片段**。

![ki shell load file](ki-shell-load.png){width=700}

`ls` 命令**显示可用符号**（**变量和函数**）。

### 添加外部依赖项

除了**标准库**之外，ki shell 还**支持外部依赖项**。这使您可以在其中**尝试第三方库**，**而无需创建整个项目**。

要在 ki shell 中**添加第三方库**，请使用 `:dependsOn` 命令。**默认情况下**，ki shell **与 Maven Central 协作**，但如果您**通过** `:repository` 命令**连接**其他**仓库**，则也可以使用它们：

![ki shell external dependency](ki-shell-dependency.png){width=700}