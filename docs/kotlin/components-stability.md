[//]: # (title: Kotlin 组件的稳定性)

Kotlin 语言和工具集被划分为许多组件，例如面向 JVM、JS 和 Native 目标平台的编译器、标准库以及各种随附工具等。
其中许多组件已正式发布为 **Stable**（稳定），这意味着它们是按照[《舒适更新与保持语言现代化》原则](kotlin-evolution-principles.md)以向后兼容的方式演进的。

遵循“反馈循环”原则，我们尽早发布许多内容供社区试用，因此许多组件尚未发布为 **Stable**。
其中一些处于非常早期的阶段，另一些则更为成熟。
我们根据每个组件的演进速度以及用户采纳它时所承担的风险级别，将其标记为 **Experimental**（实验性的）、**Alpha** 或 **Beta**。

## 稳定性级别说明

以下是这些稳定性级别及其含义的快速指南：

**Experimental** 意味着“仅限在试验性项目中使用”：
* 我们只是在尝试一个想法，希望一些用户能试用它并提供反馈。如果它不可行，我们随时可能放弃它。

**Alpha** 意味着“使用风险自担，可能会遇到迁移问题”：
* 我们计划将此想法产品化，但它尚未定型。

**Beta** 意味着“您可以使用它，我们将尽最大努力为您最大限度地减少迁移问题”：
* 它几近完成，用户反馈现在尤其重要。
* 不过，它尚未百分百完成，因此仍可能发生变化（包括基于您自身反馈的变化）。
* 提前关注废弃警告，以获得最佳更新体验。

我们将 _Experimental_、_Alpha_ 和 _Beta_ 统称为**预稳定**级别。

<a name="stable"/>

**Stable** 意味着“即使在最保守的场景下也可以使用”：
* 它已完成。我们将根据我们严格的[向后兼容规则](https://kotlinfoundation.org/language-committee-guidelines/)对其进行演进。

请注意，稳定性级别并不表明某个组件会多快发布为 Stable。同样，它们也不说明组件在发布前会有多大变化。它们仅说明组件变化的快慢以及用户面临的更新问题风险有多大。

## Kotlin 组件的 GitHub 徽章

[Kotlin GitHub 组织](https://github.com/Kotlin)托管着不同的 Kotlin 相关项目。
其中一些我们全职开发，另一些则是辅助项目。

每个 Kotlin 项目都有两个 GitHub 徽章，描述其稳定性与支持状态：

* **Stability**（稳定性）状态。这表明各项目演进的速度以及用户采纳它时所承担的风险。
  稳定性状态与 [Kotlin 语言特性及其组件的稳定性级别](#stability-levels-explained)完全一致：
    * ![Experimental stability level](https://kotl.in/badges/experimental.svg){type="joined"} 代表 **Experimental**（实验性的）
    * ![Alpha stability level](https://kotl.in/badges/alpha.svg){type="joined"} 代表 **Alpha**
    * ![Beta stability level](https://kotl.in/badges/beta.svg){type="joined"} 代表 **Beta**
    * ![Stable stability level](https://kotl.in/badges/stable.svg){type="joined"} 代表 **Stable**（稳定）

* **Support**（支持）状态。这表明我们维护项目和帮助用户解决问题的承诺。
  支持级别对所有 JetBrains 产品都是统一的。
  [关于详情，请参见 JetBrains 开源文档](https://github.com/JetBrains#jetbrains-on-github)。

## 子组件的稳定性

一个 Stable 组件可能包含一个实验性的子组件，例如：
* 一个 Stable 编译器可能包含一个实验性的特性；
* 一个 Stable API 可能包含实验性的类或函数；
* 一个 Stable 命令行工具可能包含实验性的选项。

我们确保精确地记录哪些子组件不是 **Stable**。我们还会尽最大努力尽可能地警告用户，并要求他们显式选择加入，以避免意外使用尚未发布为 Stable 的特性。

## Kotlin 组件的当前稳定性

> 默认情况下，所有新组件都具有 Experimental（实验性）状态。
>
{style="note"}

### Kotlin 编译器

| **组件**                                                          | **状态**   | **状态始于版本** | **备注** |
|---------------------------------------------------------------------|------------|--------------------|--------------|
| Kotlin/JVM                                                          | Stable     | 1.0.0              |              |
| Kotlin/Native                                                       | Stable     | 1.9.0              |              |
| Kotlin/JS                                                           | Stable     | 1.3.0              |              |
| Kotlin/Wasm                                                         | Beta       | 2.2.20             |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                    |              |

### 核心编译器插件

| **组件**                                     | **状态**   | **状态始于版本** | **备注** |
|----------------------------------------------|--------------|--------------------|--------------|
| [All-open](all-open-plugin.md)                   | Stable       | 1.3.0              |              |
| [No-arg](no-arg-plugin.md)                       | Stable       | 1.3.0              |              |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | Stable       | 1.3.0              |              |
| [kapt](kapt.md)                                  | Stable       | 1.3.0              |              |
| [Lombok](lombok.md)                              | Experimental | 1.5.20             |              |
| [Power-assert](power-assert.md)                  | Experimental | 2.0.0              |              |

### Kotlin 库

| **组件**             | **状态** | **状态始于版本** | **备注** |
|----------------------|------------|--------------------|--------------|
| kotlin-stdlib (JVM)  | Stable     | 1.0.0              |              |
| kotlinx-coroutines    | Stable     | 1.3.0              |              |
| kotlinx-serialization | Stable     | 1.0.0              |              |
| kotlin-metadata-jvm  | Stable     | 2.0.0              |              |
| kotlin-reflect (JVM) | Beta       | 1.0.0              |              |
| kotlinx-datetime      | Alpha      | 0.2.0              |              |
| kotlinx-io            | Alpha      | 0.2.0              |              |

### Kotlin 多平台

| **组件**                                       | **状态** | **状态始于版本** | **备注**                                                                                                   |
|------------------------------------------------|------------|--------------------|------------------------------------------------------------------------------------------------------------|
| Kotlin Multiplatform                           | Stable     | 1.9.20             |                                                                                                            |
| Kotlin Multiplatform plugin for Android Studio | Beta       | 0.8.0              | [独立于语言版本化](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-plugin-releases.html) |

### Kotlin/Native

| **组件**                                   | **状态** | **状态始于版本** | **备注**                                                                         |
|--------------------------------------------|------------|--------------------|----------------------------------------------------------------------------------|
| Kotlin/Native Runtime                      | Stable     | 1.9.20             |                                                                                  |
| Kotlin/Native 与 C 和 Objective-C 的互操作 | Beta       | 1.3.0              | [C 和 Objective-C 库导入的稳定性](native-c-interop-stability.md)                   |
| klib binaries                              | Stable     | 1.9.20             | 不包括 cinterop klib，详见下文                                                   |
| cinterop klib binaries                     | Beta       | 1.3.0              | [C 和 Objective-C 库导入的稳定性](native-c-interop-stability.md)                   |
| CocoaPods integration                      | Stable     | 1.9.20             |                                                                                  |

关于不同目标平台的支持级别，请参见 [](native-target-support.md)。

### 语言工具

| **组件**                      | **状态**   | **状态始于版本** | **备注**                                   |
|-------------------------------|--------------|--------------------|--------------------------------------------|
| 脚本语法和语义                | Alpha        | 1.2.0              |                                            |
| 脚本嵌入和扩展 API            | Beta         | 1.5.0              |                                            |
| 脚本 IDE 支持                 | Beta         |                    | 可用于 IntelliJ IDEA 2023.1 及更高版本 |
| CLI 脚本                        | Alpha        | 1.2.0              |                                            |

## 语言特性和设计提案

关于语言特性和新设计提案，请参见 [](kotlin-language-features-and-proposals.md)。