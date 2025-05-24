---
title: "迁移到 Kotlin 代码风格"
---
## Kotlin 编码规范和 IntelliJ IDEA 格式化器

[Kotlin 编码规范](coding-conventions) 影响了编写符合 Kotlin 习惯代码的多个方面，其中就包含旨在提高 Kotlin 代码可读性的一系列格式化建议。

不幸的是，IntelliJ IDEA 内置的代码格式化器早在本文档发布之前就已存在，并且现在的默认设置所产生的格式与现在的建议格式不同。

一个看似合理的下一步是移除这种模糊性，通过切换 IntelliJ IDEA 中的默认设置，使格式与 Kotlin 编码规范保持一致。但这将意味着所有现有的 Kotlin 项目在安装 Kotlin 插件的那一刻，都将启用一种新的代码风格。对于插件更新来说，这并不是一个符合预期的结果，对吧？

这就是为什么我们采取以下迁移计划：

* 从 Kotlin 1.3 开始，默认启用官方代码风格格式化，且仅适用于新项目（旧的格式化可以手动启用）
* 现有项目的作者可以选择迁移到 Kotlin 编码规范
* 现有项目的作者可以选择在项目中显式声明使用旧的代码风格（这样，项目将来就不会受到切换到默认设置的影响）
* 在 Kotlin 1.4 中切换到默认格式化，并使其与 Kotlin 编码规范保持一致

## “Kotlin 编码规范” 和 “IntelliJ IDEA 默认代码风格” 之间的差异

最显著的变化在于延续缩进策略（continuation indentation policy）。一个不错的想法是使用双倍缩进来表明多行表达式在前一行尚未结束。这是一个非常简单和通用的规则，但是当某些 Kotlin 结构以这种方式格式化时，看起来会有点笨拙。在 Kotlin 编码规范中，建议在之前被迫使用长延续缩进的情况下使用单倍缩进。

<img src="/img/code-formatting-diff.png" alt="Code formatting" width="700"/>

在实践中，相当多的代码会受到影响，因此这可以被认为是一次重大的代码风格更新。

## 迁移到新代码风格的讨论

如果从一个没有以旧方式格式化代码的新项目开始，那么采用新的代码风格可能是一个非常自然的过程。这就是为什么从 1.3 版本开始，Kotlin IntelliJ 插件会使用[编码规范](coding-conventions)文档中的格式化来创建新项目，该格式化默认启用。

更改现有项目中的格式化是一项要求更高的任务，可能应该首先与团队讨论所有的注意事项。

在现有项目中更改代码风格的主要缺点是，VCS 的 blame/annotate 功能将更频繁地指向不相关的提交。虽然每个 VCS 都有某种方法来处理这个问题（IntelliJ IDEA 中可以使用["Annotate Previous Revision"](https://www.jetbrains.com/help/idea/investigate-changes.html)），但重要的是要决定一种新的风格是否值得付出所有的努力。将格式化提交与有意义的更改分离的做法可以大大有助于以后的调查。

此外，对于较大的团队来说，迁移可能会更加困难，因为在多个子系统中提交大量文件可能会在个人分支中产生合并冲突。虽然每个冲突解决通常都很简单，但了解当前是否有大型功能分支正在进行中仍然是明智的。

一般来说，对于小型项目，我们建议一次性转换所有文件。

对于中型和大型项目，该决定可能很艰难。如果您还没有准备好立即更新许多文件，您可以决定按模块迁移，或者继续仅对修改后的文件进行逐步迁移。

## 迁移到新代码风格

切换到 Kotlin 编码规范代码风格可以在 **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 对话框中完成。将 scheme 切换到 **Project** 并激活 **Set from...** | **Kotlin style guide**。

为了与所有项目开发人员共享这些更改，`.idea/codeStyle` 文件夹必须提交到 VCS。

如果使用外部构建系统来配置项目，并且已决定不共享 `.idea/codeStyle` 文件夹，则可以使用附加属性强制执行 Kotlin 编码规范：

### 在 Gradle 中

将 `kotlin.code.style=official` 属性添加到项目根目录下的 `gradle.properties` 文件中，并将该文件提交到 VCS。

### 在 Maven 中

将 `kotlin.code.style official` 属性添加到根 `pom.xml` 项目文件中。

```xml
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

:::caution
设置 **kotlin.code.style** 选项可能会在项目导入期间修改代码风格方案，并可能更改代码风格设置。

:::

更新代码风格设置后，在项目视图中对所需范围激活 **Reformat Code**。

<img src="/img/reformat-code.png" alt="Reformat code" width="500"/>

对于逐步迁移，可以启用 **File is not formatted according to project settings** 检查。它将突出显示应该重新格式化的位置。启用 **Apply only to modified files** 选项后，检查将仅显示修改过的文件中的格式问题。这些文件可能无论如何都会很快被提交。

## 在项目中存储旧的代码风格

始终可以将 IntelliJ IDEA 代码风格显式设置为项目的正确代码风格：

1. 在 **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 中，切换到 **Project** scheme。
2. 打开 **Load/Save** 选项卡，然后在 **Use defaults from** 中选择 **Kotlin obsolete IntelliJ IDEA codestyle**。

为了在项目开发人员之间共享更改，`.idea/codeStyle` 文件夹必须提交到 VCS。或者，对于使用 Gradle 或 Maven 配置的项目，可以使用 **kotlin.code.style**=**obsolete**。