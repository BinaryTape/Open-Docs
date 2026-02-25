[//]: # (title: 迁移到 Kotlin 代码样式)

<no-index/>

> 自 Kotlin 1.4.0 起，IntelliJ IDEA 中的所有项目都默认启用官方代码样式格式化。
> 
{style="note"}

## Kotlin 编码规范与 IntelliJ IDEA 格式化程序

[Kotlin 编码规范](coding-conventions.md) 涉及编写惯用 Kotlin 的多个方面，其中包括旨在提高 Kotlin 代码可读性的一组格式化建议。

IntelliJ IDEA 内置的代码格式化程序过去使用的默认设置所生成的格式与当前推荐的格式不同。

我们希望通过切换 IntelliJ IDEA 中的默认设置，使格式与 Kotlin 编码规范保持一致，从而消除这种不一致性。这就是实施以下迁移计划的原因：

* 自 Kotlin 1.3.0 起，官方代码样式格式化默认启用，且仅针对新项目（旧格式可以手动启用）。
* 现有项目的作者可以选择迁移到 Kotlin 编码规范。
* 现有项目的作者可以选择在项目中显式声明使用旧代码样式（这样项目在将来切换到默认设置时不会受到影响）。
* 自 Kotlin 1.4.0 起，所有项目均启用默认格式化，以使其与 Kotlin 编码规范保持一致。

## “Kotlin 编码规范”与 “IntelliJ IDEA 默认代码样式”的区别

最显著的变化是连续缩进策略。使用双倍缩进（double indent）来表示多行表达式在前一行尚未结束是一个不错的想法。这是一个简单且通用的规则，但当以这种方式格式化时，几种 Kotlin 结构看起来会有些别扭。在 Kotlin 编码规范中，建议在以前强制使用长连续缩进的情况下使用单倍缩进。

<img src="code-formatting-diff.png" alt="代码格式化" width="700"/>

在实践中，受影响的代码相当多，因此这可以被视为一次重大的代码样式更新。

## 迁移到新代码样式的讨论

如果从没有以旧方式格式化代码的新项目开始，采用新代码样式可能是一个非常自然的过程。这就是为什么从 1.3.0 版本开始，Kotlin IntelliJ 插件会使用 [编码规范](coding-conventions.md) 文档中的格式创建新项目，并默认启用。

在现有项目中更改格式是一项要求更高的任务，可能应该先与团队讨论所有注意事项。

在现有项目中更改代码样式的主要缺点是，VCS 的 blame/annotate 功能将更频繁地指向无关的提交。虽然每个 VCS 都有处理此问题的方法（在 IntelliJ IDEA 中可以使用 [“Annotate Previous Revision”](https://www.jetbrains.com/help/idea/investigate-changes.html)），但决定新样式是否值得这些付出仍然很重要。将重新格式化的提交与有意义的更改分开的做法可以极大地帮助以后的调查。

此外，对于大型团队来说，迁移可能会更困难，因为在多个子系统中提交大量文件可能会在个人分支中产生合并冲突。虽然每次解决冲突通常都很简单，但了解当前是否有大型功能分支正在开发中仍然是明智的。

通常对于小型项目，我们建议一次性转换所有文件。

对于中大型项目，决策可能会很艰难。如果您不准备立即更新许多文件，可以决定逐个模块（module）进行迁移，或者仅针对修改过的文件继续进行逐步迁移。

## 迁移到新代码样式

切换到 Kotlin 编码规范代码样式可以在 **设置/偏好设置** | **编辑器** | **代码样式** | **Kotlin** 对话框中完成。将方案切换为 **Project** 并激活 **Set from...** | **Kotlin style guide**。

要与所有项目开发者共享这些更改，必须将 `.idea/codeStyle` 文件夹提交到 VCS。

如果使用外部构建系统来配置项目，并且已决定不共享 `.idea/codeStyle` 文件夹，则可以使用附加属性强制执行 Kotlin 编码规范：

### 在 Gradle 中

在项目根目录的 `gradle.properties` 文件中添加 `kotlin.code.style=official` 属性，并将该文件提交到 VCS。

### 在 Maven 中

在根 `pom.xml` 项目文件中添加 `kotlin.code.style official` 属性。

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

> 设置 **kotlin.code.style** 选项可能会在项目导入期间修改代码样式方案，并可能更改代码样式设置。
> 
{style="warning"}

更新代码样式设置后，在项目视图中对所需范围激活 **Reformat Code**（重新格式化代码）。

<img src="reformat-code.png" alt="重新格式化代码" width="500"/>

对于逐步迁移，可以启用 **File is not formatted according to project settings**（文件未根据项目设置进行格式化）检查（inspection）。它将高亮显示应该重新格式化的地方。启用 **Apply only to modified files**（仅应用于修改过的文件）选项后，检查将仅在修改过的文件中显示格式问题。这类文件反正很可能很快就会被提交。

## 在项目中保存旧代码样式

始终可以显式地将 IntelliJ IDEA 代码样式设置为项目的正确代码样式：

1. 在 **设置/偏好设置** | **编辑器** | **代码样式** | **Kotlin** 中，切换到 **Project** 方案。
2. 打开 **Load/Save** 选项卡，在 **Use defaults from** 中选择 **Kotlin obsolete IntelliJ IDEA codestyle**。

要在项目开发者之间共享更改，必须将 `.idea/codeStyle` 文件夹提交到 VCS。或者，对于使用 Gradle 或 Maven 配置的项目，可以使用 **kotlin.code.style**=**obsolete**。