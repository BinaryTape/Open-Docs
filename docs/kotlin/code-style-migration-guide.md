[//]: # (title: 迁移到 Kotlin 代码风格)

<no-index/>

> 从 Kotlin 1.4.0 开始，IntelliJ IDEA 中所有项目默认启用官方代码风格格式化。
>
{style="note"}

## Kotlin 编码规范与 IntelliJ IDEA 格式化程序

[Kotlin 编码规范](coding-conventions.md) 影响编写惯用 Kotlin 的多个方面，其中就包括旨在提高 Kotlin 代码可读性的一系列格式化建议。

IntelliJ IDEA 内置的代码格式化程序曾经的默认设置所产生的格式与现在建议的格式不同。

我们希望通过切换 IntelliJ IDEA 中的默认设置，并使格式与 Kotlin 编码规范保持一致来消除这种不一致。这就是为什么实施了以下迁移计划：

*   从 Kotlin 1.3.0 开始，官方代码风格格式化默认启用，并且仅限于新项目（旧格式可以手动启用）。
*   现有项目的作者可以选择迁移到 Kotlin 编码规范。
*   现有项目的作者可以选择在项目中显式声明使用旧代码风格（这样，项目将来就不会受到切换到默认设置的影响）。
*   从 Kotlin 1.4.0 开始，所有项目默认启用格式化，以使其与 Kotlin 编码规范保持一致。

## "Kotlin 编码规范" 与 "IntelliJ IDEA 默认代码风格" 之间的区别

最显著的变化在于续行缩进策略。有一种不错的想法是使用双倍缩进，以表示多行表达式尚未在前一行结束。这是一个简单且通用的规则，但某些 Kotlin 结构在这样格式化时会显得有些别扭。在 Kotlin 编码规范中，建议在之前强制使用长续行缩进的情况下改用单倍缩进。

<img src="code-formatting-diff.png" alt="Code formatting" width="700"/>

实际上，相当多的代码会受到影响，因此这可以被视为一次重大的代码风格更新。

## 迁移到新代码风格的讨论

如果从一个没有按旧方式格式化代码的新项目开始，采用新的代码风格可能会是一个非常自然的过程。这就是为什么从 1.3.0 版本开始，Kotlin IntelliJ 插件创建新项目时会默认启用 [编码规范](coding-conventions.md) 文档中的格式。

更改现有项目中的格式是一项要求高得多的任务，可能应首先与团队讨论所有注意事项。

更改现有项目中代码风格的主要缺点是，blame/标注 版本控制系统特性将更频繁地指向不相关的提交。虽然每个 VCS 都有某种方式来处理这个问题（IntelliJ IDEA 中可以使用 ["标注前一版本"](https://www.jetbrains.com/help/idea/investigate-changes.html)），但重要的是要决定新的风格是否值得付出所有努力。将格式化提交与有意义的更改分开的做法可以极大地帮助后续调查。

此外，对于大型团队而言，迁移可能更困难，因为在多个子系统中提交大量文件可能会在个人分支中产生合并冲突。虽然每次冲突解决通常都微不足道，但了解当前是否有正在进行中的大型特性分支仍然是明智之举。

通常，对于小型项目，我们建议一次性转换所有文件。

对于中型和大型项目，决策可能很艰难。如果您尚未准备好立即更新许多文件，您可以决定逐个模块迁移，或仅对已修改的文件继续进行逐步迁移。

## 迁移到新的代码风格

切换到 Kotlin 编码规范代码风格可以在 **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 对话框中完成。将方案切换为 **Project** 并激活 **Set from...** | **Kotlin style guide**。

为了让所有项目开发者共享这些更改，`.idea/codeStyle` 文件夹必须提交到 VCS。

如果项目使用外部构建系统进行配置，并且已决定不共享 `.idea/codeStyle` 文件夹，则可以通过附加属性强制执行 Kotlin 编码规范：

### 在 Gradle

将 `kotlin.code.style=official` 属性添加到项目根目录的 `gradle.properties` 文件中，并将该文件提交到 VCS。

### 在 Maven

将 `kotlin.code.style` 属性（值为 `official`）添加到根 `pom.xml` 项目文件中。

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

>设置 **kotlin.code.style** 选项可能会在项目导入期间修改代码风格方案，并可能更改代码风格设置。
>
{style="warning"}

更新代码风格设置后，在项目视图中对所需的作用域激活 **Reformat Code**。

<img src="reformat-code.png" alt="Reformat code" width="500"/>

对于逐步迁移，可以启用 **File is not formatted according to project settings** 检查。它将突出显示需要重新格式化的地方。启用 **Apply only to modified files** 选项后，检查将仅在修改过的文件中显示格式化问题。这些文件无论如何可能很快就会提交。

## 在项目中存储旧代码风格

始终可以显式地将 IntelliJ IDEA 代码风格设置为项目的正确代码风格：

1.  在 **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 中，切换到 **Project** 方案。
2.  打开 **Load/Save** 标签页，并在 **Use defaults from** 中选择 **Kotlin obsolete IntelliJ IDEA codestyle**。

为了在项目开发者之间共享这些更改，`.idea/codeStyle` 文件夹必须提交到 VCS。或者，对于使用 Gradle 或 Maven 配置的项目，可以使用 **kotlin.code.style**=**obsolete**。