---
title: 运行代码片段
---
Kotlin 代码通常被组织成项目，你可以使用 IDE、文本编辑器或其他工具来处理这些项目。然而，如果你想快速了解某个函数的工作方式或查找表达式的值，则无需创建新项目并构建它。请查看以下三种便捷的方式，可以在不同的环境中即时运行 Kotlin 代码：

* IDE 中的 [Scratch 文件和 Worksheet](#ide-scratches-and-worksheets)。
* 浏览器中的 [Kotlin Playground](#browser-kotlin-playground)。
* 命令行中的 [ki shell](#command-line-ki-shell)。

## IDE: Scratch 文件和 Worksheet

IntelliJ IDEA 和 Android Studio 支持 Kotlin [scratch 文件和 worksheet](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)。

* _Scratch 文件_（或简称 _scratches_）允许你在与项目相同的 IDE 窗口中创建代码草稿，并即时运行它们。
  Scratch 文件不与项目绑定；你可以从操作系统上任何 IntelliJ IDEA 窗口访问和运行所有 scratch 文件。

  要创建 Kotlin scratch 文件，请单击 **File** | **New** | **Scratch File** 并选择 **Kotlin** 类型。

* _Worksheet_ 是项目文件：它们存储在项目目录中并与项目模块绑定。
  Worksheet 适用于编写实际上不构成软件单元但仍应存储在项目中的代码片段，例如教育或演示材料。

  要在项目目录中创建 Kotlin worksheet，请在项目树中右键单击该目录，然后选择 **New** | **Kotlin Class/File** | **Kotlin Worksheet**。

    > [K2 模式](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) 不支持 Kotlin worksheet。我们正在努力提供具有类似功能的替代方案。
    >
    

Scratch 文件和 worksheet 支持语法高亮、自动完成和其他 IntelliJ IDEA 代码编辑功能。无需声明 `main()` 函数
– 你编写的所有代码都将像在 `main()` 函数体中一样执行。

在 scratch 文件或 worksheet 中完成代码编写后，单击 **Run**。
执行结果将显示在代码对应的行中。

<img src="/img/scratch-run.png" alt="Run scratch" width="700" style={{verticalAlign: 'middle'}}/>

### 交互模式

IDE 可以自动运行 scratch 文件和 worksheet 中的代码。要停止
输入后立即获得执行结果，请开启 **Interactive mode**（交互模式）。

<img src="/img/scratch-interactive.png" alt="Scratch interactive mode" width="700" style={{verticalAlign: 'middle'}}/>

### 使用模块

你可以在 scratch 文件和 worksheet 中使用 Kotlin 项目中的类或函数。

Worksheet 自动有权访问其所在模块中的类和函数。

要在 scratch 文件中使用项目中的类或函数，请像往常一样使用
`import` 语句将其导入 scratch 文件。然后编写代码，并在 **Use classpath of module** 列表中选择相应的模块来运行它。

Scratch 文件和 worksheet 都使用已编译版本的连接模块。因此，如果你修改了模块的源文件，
则在重新构建模块时，更改将传播到 scratch 文件和 worksheet。
要在每次运行 scratch 文件或 worksheet 之前自动重新构建模块，请选择 **Make module before Run**。

<img src="/img/scratch-select-module.png" alt="Scratch select module" width="700" style={{verticalAlign: 'middle'}}/>

### 以 REPL 方式运行

要评估 scratch 文件或 worksheet 中的每个特定表达式，请在选择 **Use REPL** 的情况下运行它。代码行
将按顺序运行，并提供每次调用的结果。
你以后可以通过引用自动生成的 `res*` 名称（它们显示在相应的行中）在同一文件中使用这些结果。

<img src="/img/scratch-repl.png" alt="Scratch REPL" width="700" style={{verticalAlign: 'middle'}}/>

## 浏览器：Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) 是一个在线应用程序，用于在浏览器中编写、运行和共享
Kotlin 代码。

### 编写和编辑代码

在 Playground 的编辑器区域中，你可以像在源文件中一样编写代码：
* 以任意顺序添加你自己的类、函数和顶级声明。
* 在 `main()` 函数体中编写可执行部分。

与典型的 Kotlin 项目一样，Playground 中的 `main()` 函数可以具有 `args` 参数，也可以没有参数。
要在执行时传递程序参数，请在 **Program arguments** 字段中编写它们。

<img src="/img/playground-completion.png" alt="Playground: code completion" width="700" style={{verticalAlign: 'middle'}}/>

Playground 会突出显示代码，并在你键入时显示代码完成选项。它会自动导入标准库和 [`kotlinx.coroutines`](coroutines-overview) 中的声明。

### 选择执行环境

Playground 提供了自定义执行环境的方式：
* 多个 Kotlin 版本，包括可用的 [未来版本的预览](eap)。
* 多个后端来运行代码：JVM、JS（旧版或 [IR compiler](js-ir-compiler)，或 Canvas）或 JUnit。

<img src="/img/playground-env-setup.png" alt="Playground: environment setup" width="700" style={{verticalAlign: 'middle'}}/>

对于 JS 后端，你还可以查看生成的 JS 代码。

<img src="/img/playground-generated-js.png" alt="Playground: generated JS" width="700" style={{verticalAlign: 'middle'}}/>

### 在线分享代码

使用 Playground 与他人分享你的代码 – 点击 **Copy link** 并将其发送给你想展示代码的任何人。

你还可以将 Playground 中的代码片段嵌入到其他网站中，甚至使它们可运行。点击 **Share code** 以将你的示例嵌入到任何网页或 [Medium](https://medium.com/) 文章中。

<img src="/img/playground-share.png" alt="Playground: share code" width="700" style={{verticalAlign: 'middle'}}/>

## 命令行：ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_) 是一个命令行
实用程序，用于在终端中运行 Kotlin 代码。它适用于 Linux、macOS 和 Windows。

ki shell 提供基本的代码评估功能，以及高级功能，例如：
* 代码完成
* 类型检查
* 外部依赖项
* 用于代码片段的粘贴模式
* 脚本支持

有关更多详细信息，请参阅 [ki shell GitHub 存储库](https://github.com/Kotlin/kotlin-interactive-shell)。

### 安装和运行 ki shell

要安装 ki shell，请从 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) 下载最新版本，然后
将其解压缩到你选择的目录中。

在 macOS 上，你还可以使用 Homebrew 通过运行以下命令来安装 ki shell：

```shell
brew install ki
```

要启动 ki shell，请在 Linux 和 macOS 上运行 `bin/ki.sh`（或者如果 ki shell 是使用 Homebrew 安装的，则只需运行 `ki`），在 Windows 上运行 `bin\ki.bat`。

shell 运行后，你可以立即开始在终端中编写 Kotlin 代码。键入 `:help`（或 `:h`）以查看
ki shell 中可用的命令。

### 代码完成和高亮显示

当你按下 **Tab** 键时，ki shell 会显示代码完成选项。它还提供语法高亮显示。
你可以通过输入 `:syntax off` 来禁用此功能。

<img src="/img/ki-shell-highlight-completion.png" alt="ki shell highlighting and completion" width="700" style={{verticalAlign: 'middle'}}/>

当你按下 **Enter** 键时，ki shell 会评估输入的行并打印结果。表达式值
以自动生成的名称（如 `res*`）的变量形式打印。你以后可以在你运行的代码中使用这些变量。
如果输入的结构不完整（例如，带有条件但没有主体的 `if`），则 shell 会打印
三个点并期望剩余部分。

<img src="/img/ki-shell-results.png" alt="ki shell results" width="700" style={{verticalAlign: 'middle'}}/>

### 检查表达式的类型

对于你不熟悉的复杂表达式或 API，ki shell 提供了 `:type`（或 `:t`）命令，该命令显示
表达式的类型：

<img src="/img/ki-shell-type.png" alt="ki shell type" width="700" style={{verticalAlign: 'middle'}}/>

### 加载代码

如果所需的代码存储在其他位置，则有两种方法可以加载它并在 ki shell 中使用它：
* 使用 `:load`（或 `:l`）命令加载源文件。
* 使用 `:paste`（或 `:p`）命令在粘贴模式下复制并粘贴代码片段。

<img src="/img/ki-shell-load.png" alt="ki shell load file" width="700" style={{verticalAlign: 'middle'}}/>

`ls` 命令显示可用的符号（变量和函数）。

### 添加外部依赖项

除了标准库之外，ki shell 还支持外部依赖项。
这使你无需创建整个项目即可试用第三方库。

要在 ki shell 中添加第三方库，请使用 `:dependsOn` 命令。默认情况下，ki shell 与 Maven Central 配合使用，
但你可以使用 `:repository` 命令连接其他存储库：

<img src="/img/ki-shell-dependency.png" alt="ki shell external dependency" width="700" style={{verticalAlign: 'middle'}}/>