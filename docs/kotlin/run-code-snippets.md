[//]: # (title: 运行代码片段)

Kotlin 代码通常组织在项目中，您可以在 IDE、文本编辑器或其他工具中处理这些项目。然而，如果您想快速了解函数的工作方式或查找表达式的值，则无需创建新的项目并构建它。请查看以下三种便捷的方式，可在不同环境中即时运行 Kotlin 代码：

*   [IDE 中的暂存文件](#ide-scratches-and-worksheets)。
*   [IDE 中的 Kotlin Notebook](#ide-kotlin-notebook)。
*   [浏览器中的 Kotlin Playground](#browser-kotlin-playground)。
*   [命令行中的 ki shell](#command-line-ki-shell)。

## IDE：暂存 {id="ide-scratches-and-worksheets"}

IntelliJ IDEA 和 Android Studio 支持 Kotlin [暂存文件](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)。

暂存文件（或简称暂存）允许您在与项目相同的 IDE 窗口中创建代码草稿并即时运行它们。暂存不与项目绑定；您可以从操作系统上的任何 IntelliJ IDEA 窗口中访问和运行所有暂存。

要创建 Kotlin 暂存，请点击 **File** | **New** | **Scratch File** 并选择 **Kotlin** 类型。

语法高亮、自动补全以及其他 IntelliJ IDEA 代码编辑特性在暂存中均受支持。无需声明 `main()` 函数 – 您编写的所有代码都如同在 `main()` 的函数体中执行。

在暂存中完成编写代码后，点击 **Run**。执行结果将显示在您代码的对应行中。

![Run scratch](scratch-run.png){width=700}

### 交互模式

IDE 可以自动运行暂存中的代码。为了在您停止输入后立即获取执行结果，请开启 **Interactive mode**（交互模式）。

![Scratch interactive mode](scratch-interactive.png){width=700}

### 使用模块

您可以在暂存中使用 Kotlin 项目中的类或函数。

要在暂存中使用项目中的类或函数，请照常使用 `import` 语句将它们导入暂存文件。然后编写您的代码，并在 **Use classpath of module** 列表中选中相应模块后运行它。

暂存都使用连接模块的编译版本。因此，如果您修改模块的源文件，当您重新构建模块时，这些更改将传播到暂存。要在每次运行暂存之前自动重新构建模块，请选择 **Make module before Run**。

![Scratch select module](scratch-select-module.png){width=700}

## IDE: Kotlin Notebook

[](kotlin-notebook-overview.md) 是一个交互式编辑器，允许您在单个文档中混合代码、输出、视觉效果和 Markdown。您可以使用 Notebook 来在称为 _代码单元_（_code cells_）的部分中编写和运行代码，并即时查看结果。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

Kotlin Notebook 在 IntelliJ IDEA 中默认捆绑并启用。

要开始使用 Kotlin Notebook，请参见 [Kotlin Notebook 入门](get-started-with-kotlin-notebooks.md)。

### Scratch Kotlin Notebook

您还可以将 Kotlin Notebook 创建为[暂存文件](https://www.jetbrains.com/help/idea/scratches.html)，这允许您在不创建新项目或修改现有项目的情况下测试小段代码。暂存 Notebook 可从任何项目访问。

[了解如何创建暂存 Kotlin Notebook](kotlin-notebook-create.md#create-a-scratch-kotlin-notebook)。

## 浏览器：Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) 是一款用于在浏览器中编写、运行和共享 Kotlin 代码的在线应用程序。

### 编写和编辑代码

在 Playground 的编辑器区域，您可以像在源文件中一样编写代码：
*   以任意顺序添加您自己的类、函数和顶层声明。
*   在 `main()` 函数体中编写可执行部分。

与典型 Kotlin 项目中一样，Playground 中的 `main()` 函数可以有 `args` 形参或没有任何形参。要在执行时传递程序实参，请将它们写入 **Program arguments** 字段。

![Playground: code completion](playground-completion.png){width=700}

Playground 会高亮代码并在您输入时显示代码补全选项。它自动导入来自标准库和 [`kotlinx.coroutines`](coroutines-overview.md) 的声明。

### 选择执行环境

Playground 提供了自定义执行环境的方式：
*   多个 Kotlin 版本，包括可用的[未来版本抢先体验预览](eap.md)。
*   多个后端用于运行代码：JVM、JS（旧版或 [IR compiler](js-ir-compiler.md)，或 Canvas），或 JUnit。

![Playground: environment setup](playground-env-setup.png){width=700}

对于 JS 后端，您还可以查看生成的 JS 代码。

![Playground: generated JS](playground-generated-js.png){width=700}

### 在线共享代码

使用 Playground 与他人共享您的代码 – 点击 **Copy link** 并将其发送给您想展示代码的任何人。

您还可以将 Playground 中的代码片段嵌入到其他网站中，甚至使它们可运行。点击 **Share code** 将您的示例嵌入到任何网页或 [Medium](https://medium.com/) 文章中。

![Playground: share code](playground-share.png){width=700}

## 命令行：ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell)（_Kotlin Interactive Shell_）是用于在终端中运行 Kotlin 代码的命令行工具。它适用于 Linux、macOS 和 Windows。

ki shell 提供了基本的代码求值能力，以及以下高级特性：
*   代码补全
*   类型检测
*   外部依赖项
*   代码片段的粘贴模式
*   脚本支持

关于 [ki shell GitHub 版本库](https://github.com/Kotlin/kotlin-interactive-shell)的更多详情。

### 安装并运行 ki shell

要安装 ki shell，请从 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) 下载最新版本并将其解压到您选择的目录。

在 macOS 上，您还可以通过运行以下命令使用 Homebrew 安装 ki shell：

```shell
brew install ki
```

要启动 ki shell，请在 Linux 和 macOS 上运行 `bin/ki.sh`（如果 ki shell 是通过 Homebrew 安装的，则只需运行 `ki`），或在 Windows 上运行 `bin\ki.bat`。

shell 运行后，您可以立即开始在终端中编写 Kotlin 代码。键入 `:help`（或 `:h`）以查看 ki shell 中可用的命令。

### 代码补全和高亮

当您按下 **Tab** 键时，ki shell 会显示代码补全选项。它还在您输入时提供语法高亮。您可以通过输入 `:syntax off` 禁用此特性。

![ki shell highlighting and completion](ki-shell-highlight-completion.png){width=700}

当您按下 **Enter** 键时，ki shell 会对输入的行求值并打印结果。表达式的值作为具有自动生成名称（例如 `res*`）的变量打印。您稍后可以在您运行的代码中使用这些变量。如果输入的构造不完整（例如，带有条件但没有主体的 `if` 语句），shell 会打印三个点并等待剩余部分。

![ki shell results](ki-shell-results.png){width=700}

### 检测表达式类型

对于复杂表达式或您不熟悉的 API，ki shell 提供了 `:type`（或 `:t`）命令，它会显示表达式的类型：

![ki shell type](ki-shell-type.png){width=700}

### 加载代码

如果您需要的代码存储在其他地方，则有两种加载和使用它的方式：
*   使用 `:load`（或 `:l`）命令加载源文件。
*   使用 `:paste`（或 `:p`）命令在粘贴模式下复制并粘贴代码片段。

![ki shell load file](ki-shell-load.png){width=700}

`ls` 命令显示可用符号（变量和函数）。

### 添加外部依赖项

除了标准库之外，ki shell 还支持外部依赖项。这使您可以在其中尝试第三方库，而无需创建整个项目。

要在 ki shell 中添加第三方库，请使用 `:dependsOn` 命令。默认情况下，ki shell 与 Maven Central 协作，但如果您通过 `:repository` 命令连接其他仓库，则也可以使用它们：

![ki shell external dependency](ki-shell-dependency.png){width=700}