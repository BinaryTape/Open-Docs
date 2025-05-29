[//]: # (title: 运行代码片段)

Kotlin 代码通常组织成项目，你在 IDE、文本编辑器或其他工具中处理这些项目。但是，如果你想快速了解函数如何工作或查找表达式的值，则无需创建新项目并构建它。请查看以下三种在不同环境中即时运行 Kotlin 代码的便捷方式：

* [IDE 中的暂存文件和工作表](#ide-scratches-and-worksheets)。
* [浏览器中的 Kotlin Playground](#browser-kotlin-playground)。
* [命令行中的 ki shell](#command-line-ki-shell)。

## IDE：暂存文件和工作表

IntelliJ IDEA 和 Android Studio 支持 Kotlin [暂存文件和工作表](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)。

* _暂存文件_（或简称_暂存区_）允许你在与项目相同的 IDE 窗口中创建代码草稿并即时运行它们。暂存区不与项目绑定；你可以在操作系统上任何 IntelliJ IDEA 窗口中访问和运行所有暂存区。

  要创建 Kotlin 暂存文件，请点击 **File** | **New** | **Scratch File** 并选择 **Kotlin** 类型。

* _工作表_是项目文件：它们存储在项目目录中并绑定到项目模块。工作表适用于编写不构成软件单元但仍应一起存储在项目中的代码片段，例如教学或演示材料。

  要在项目目录中创建 Kotlin 工作表，请右键点击项目树中的目录，然后选择 **New** | **Kotlin Class/File** | **Kotlin Worksheet**。

    > Kotlin 工作表在 [K2 模式](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)下不支持。我们正在努力提供具有类似功能的替代方案。
    >
    {style="warning"}

语法高亮、自动补全以及其他 IntelliJ IDEA 代码编辑功能在暂存文件和工作表中均受支持。无需声明 `main()` 函数 — 你编写的所有代码都将像在 `main()` 函数体中一样执行。

完成在暂存文件或工作表中编写代码后，点击 **运行**。执行结果将出现在代码旁边的行中。

![运行暂存文件](scratch-run.png){width=700}

### 交互模式

IDE 可以自动运行暂存文件和工作表中的代码。要在一停止输入就获取执行结果，请开启 **交互模式**。

![暂存文件交互模式](scratch-interactive.png){width=700}

### 使用模块

你可以在暂存文件和工作表中引用 Kotlin 项目中的类或函数。

工作表自动访问其所在模块中的类和函数。

要在暂存文件中使用项目中的类或函数，请像往常一样使用 `import` 语句将它们导入暂存文件。然后编写代码，并在 **使用模块的类路径** 列表中选择相应模块后运行它。

暂存文件和工作表都使用连接模块的编译版本。因此，如果你修改了模块的源文件，当你重新构建模块时，这些更改将传播到暂存文件和工作表。
要在每次运行暂存文件或工作表之前自动重新构建模块，请选择 **运行前生成模块**。

![暂存文件选择模块](scratch-select-module.png){width=700}

### 作为 REPL 运行 

要在暂存文件或工作表中评估每个特定表达式，请选择 **使用 REPL** 运行它。代码行将顺序运行，提供每次调用的结果。
你稍后可以通过引用其自动生成的 `res*` 名称（它们显示在相应行中）在同一文件中使用这些结果。

![暂存文件 REPL](scratch-repl.png){width=700}

## 浏览器：Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) 是一个在线应用程序，用于在浏览器中编写、运行和共享 Kotlin 代码。

### 编写和编辑代码

在 Playground 的编辑器区域，你可以像在源文件中一样编写代码：
* 以任意顺序添加你自己的类、函数和顶级声明。
* 在 `main()` 函数体中编写可执行部分。

与典型 Kotlin 项目一样，Playground 中的 `main()` 函数可以有 `args` 参数，也可以根本没有参数。
要在执行时传递程序参数，请将它们写入 **Program arguments** 字段。

![Playground：代码补全](playground-completion.png){width=700}

在你输入时，Playground 会高亮显示代码并显示代码补全选项。它会自动导入标准库和 [`kotlinx.coroutines`](coroutines-overview.md) 中的声明。

### 选择执行环境

Playground 提供了自定义执行环境的方式：
* 多个 Kotlin 版本，包括未来版本的可用[预览版](eap.md)。
* 运行代码的多个后端：JVM、JS（传统或 [IR 编译器](js-ir-compiler.md)，或 Canvas）或 JUnit。

![Playground：环境设置](playground-env-setup.png){width=700}

对于 JS 后端，你还可以查看生成的 JS 代码。

![Playground：生成的 JS](playground-generated-js.png){width=700}

### 在线分享代码 

使用 Playground 与他人分享你的代码 — 点击 **复制链接** 并将其发送给任何你想展示代码的人。

你还可以将 Playground 中的代码片段嵌入到其他网站，甚至使其可运行。点击 **分享代码** 将你的示例嵌入到任何网页或 [Medium](https://medium.com/) 文章中。

![Playground：分享代码](playground-share.png){width=700}

## 命令行：ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell)（_Kotlin 交互式 Shell_）是一个命令行工具，用于在终端中运行 Kotlin 代码。它适用于 Linux、macOS 和 Windows。

ki shell 提供了基本的代码评估功能，以及高级功能，例如：
* 代码补全
* 类型检查
* 外部依赖
* 代码片段的粘贴模式
* 脚本支持

有关更多详情，请参阅 [ki shell GitHub 仓库](https://github.com/Kotlin/kotlin-interactive-shell)。

### 安装和运行 ki shell

要安装 ki shell，请从 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) 下载最新版本，并将其解压到你选择的目录中。

在 macOS 上，你还可以通过运行以下命令使用 Homebrew 安装 ki shell：

```shell
brew install ki
```

要启动 ki shell，请在 Linux 和 macOS 上运行 `bin/ki.sh`（如果 ki shell 是通过 Homebrew 安装的，则只需运行 `ki`），或在 Windows 上运行 `bin\ki.bat`。

一旦 shell 运行起来，你就可以立即开始在终端中编写 Kotlin 代码。输入 `:help`（或 `:h`）以查看 ki shell 中可用的命令。

### 代码补全和高亮

当你按下 **Tab** 键时，ki shell 会显示代码补全选项。它还会在你输入时提供语法高亮。
你可以通过输入 `:syntax off` 来禁用此功能。

![ki shell 高亮和补全](ki-shell-highlight-completion.png){width=700}

当你按下 **Enter** 键时，ki shell 会评估输入的行并打印结果。表达式的值以自动生成的 `res*` 名称的变量形式打印。你稍后可以在运行的代码中使用这些变量。
如果输入的构造不完整（例如，带有条件但没有主体的 `if` 语句），shell 会打印三个点并等待剩余部分。

![ki shell 结果](ki-shell-results.png){width=700}

### 检查表达式类型

对于复杂表达式或你不熟悉的 API，ki shell 提供了 `:type`（或 `:t`）命令，它会显示表达式的类型：

![ki shell 类型](ki-shell-type.png){width=700}

### 加载代码

如果你需要的代码存储在其他地方，有两种加载并使用它在 ki shell 中的方法：
* 使用 `:load`（或 `:l`）命令加载源文件。
* 使用 `:paste`（或 `:p`）命令在粘贴模式下复制并粘贴代码片段。

![ki shell 加载文件](ki-shell-load.png){width=700}

`ls` 命令显示可用符号（变量和函数）。

### 添加外部依赖

除了标准库，ki shell 还支持外部依赖。
这使你可以在不创建整个项目的情况下尝试其中的第三方库。

要在 ki shell 中添加第三方库，请使用 `:dependsOn` 命令。默认情况下，ki shell 与 Maven Central 一起工作，但如果你使用 `:repository` 命令连接了其他仓库，也可以使用它们：

![ki shell 外部依赖](ki-shell-dependency.png){width=700}