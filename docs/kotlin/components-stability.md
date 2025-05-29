[//]: # (title: Kotlin 组件的稳定性)

Kotlin 语言和工具集分为许多组件，例如 JVM、JS 和 Native 目标平台的编译器、标准库、各种配套工具等等。其中许多组件已正式发布为 **稳定版** (Stable)，这意味着它们按照 [舒适更新 (Comfortable Updates) 和保持语言现代 (Keeping the Language Modern) 的原则](kotlin-evolution-principles.md)以向后兼容的方式发展。

遵循反馈循环 (Feedback Loop) 原则，我们提前发布了许多内容供社区试用，因此许多组件尚未发布为 **稳定版**。其中一些处于非常早期的阶段，另一些则更为成熟。我们根据每个组件的发展速度以及用户采纳时所承担的风险级别，将其标记为 **实验性** (Experimental)、**Alpha** (Alpha) 或 **Beta** (Beta)。

## 稳定性级别说明

以下是这些稳定性级别及其含义的快速指南：

**实验性** (Experimental) 意味着“仅在玩具项目中使用”：
  * 我们只是在尝试一个想法，并希望一些用户试用并提供反馈。如果行不通，我们随时可能放弃它。

**Alpha** (Alpha) 意味着“使用风险自负，预计会出现迁移问题”：
  * 我们打算将此想法产品化，但它尚未达到最终形态。

**Beta** (Beta) 意味着“您可以使用它，我们将尽力为您最大限度地减少迁移问题”：
  * 它几乎完成，用户反馈现在尤为重要。
  * 尽管如此，它仍未 100% 完成，因此仍有可能发生变化（包括基于您自身反馈的变化）。
  * 请提前留意弃用警告，以获得最佳更新体验。

我们将_实验性_、_Alpha_ 和 _Beta_ 统称为 **预稳定** (pre-stable) 级别。

<a name="stable"/>

**稳定版** (Stable) 意味着“即使在最保守的场景中也可以使用它”：
  * 它已完成。我们将根据我们严格的[向后兼容规则](https://kotlinfoundation.org/language-committee-guidelines/)对其进行发展。

请注意，稳定性级别并未说明组件何时会发布为稳定版。同样，它们也未指出组件在发布前会发生多少更改。它们仅说明组件变化的速度以及用户面临的更新问题风险。

## Kotlin 组件的 GitHub 徽章

[Kotlin GitHub 组织](https://github.com/Kotlin) 托管着各种 Kotlin 相关项目。其中一些我们全职开发，而另一些则是副项目。

每个 Kotlin 项目都有两个 GitHub 徽章，描述其稳定性和支持状态：

* **稳定性** 状态。这显示了每个项目的发展速度以及用户在采用时所承担的风险。
  该稳定性状态与 [Kotlin 语言特性及其组件的稳定性级别](#stability-levels-explained) 完全一致：
    * ![Experimental stability level](https://kotl.in/badges/experimental.svg){type="joined"} 代表 **实验性**
    * ![Alpha stability level](https://kotl.in/badges/alpha.svg){type="joined"} 代表 **Alpha**
    * ![Beta stability level](https://kotl.in/badges/beta.svg){type="joined"} 代表 **Beta**
    * ![Stable stability level](https://kotl.in/badges/stable.svg){type="joined"} 代表 **稳定版**

* **支持** 状态。这表明我们对维护项目和帮助用户解决问题的承诺。
  支持级别对所有 JetBrains 产品都是统一的。
  [有关详细信息，请参阅 JetBrains 开源文档](https://github.com/JetBrains#jetbrains-on-github)。

## 子组件的稳定性

一个稳定的组件可能包含一个实验性子组件，例如：
* 一个稳定的编译器可能包含一个实验性特性；
* 一个稳定的 API 可能包含实验性类或函数；
* 一个稳定的命令行工具可能包含实验性选项。

我们确保精确地记录哪些子组件不是 **稳定版**。我们还尽力在可能的情况下警告用户，并要求他们明确选择启用，以避免意外使用尚未发布为稳定版的功能。

## Kotlin 组件的当前稳定性

> 默认情况下，所有新组件都具有实验性状态。
> 
{style="note"}

### Kotlin 编译器

| **组件**                                                          | **状态**   | **自版本** | **备注** |
|---------------------------------------------------------------------|------------|--------------------------|--------------|
| Kotlin/JVM                                                          | 稳定版     | 1.0.0                    |              |
| Kotlin/Native                                                       | 稳定版     | 1.9.0                    |              |
| Kotlin/JS                                                           | 稳定版     | 1.3.0                    |              |
| Kotlin/Wasm                                                         | Alpha      | 1.9.20                   |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | 稳定版     |                          |              |

### 核心编译器插件

| **组件**                                     | **状态**   | **自版本** | **备注** |
|----------------------------------------------|--------------|--------------------------|--------------|
| [All-open](all-open-plugin.md)               | 稳定版       | 1.3.0                    |              |
| [No-arg](no-arg-plugin.md)                   | 稳定版       | 1.3.0                    |              |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | 稳定版       | 1.3.0                    |              |
| [kapt](kapt.md)                              | 稳定版       | 1.3.0                    |              |
| [Lombok](lombok.md)                          | 实验性       | 1.5.20                   |              |
| [Power-assert](power-assert.md)              | 实验性       | 2.0.0                    |              |

### Kotlin 库

| **组件**              | **状态** | **自版本** | **备注** |
|-----------------------|------------|--------------------------|--------------|
| kotlin-stdlib (JVM)   | 稳定版     | 1.0.0                    |              |
| kotlinx-coroutines    | 稳定版     | 1.3.0                    |              |
| kotlinx-serialization | 稳定版     | 1.0.0                    |              |
| kotlin-metadata-jvm   | 稳定版     | 2.0.0                    |              |
| kotlin-reflect (JVM)  | Beta       | 1.0.0                    |              |
| kotlinx-datetime      | Alpha      | 0.2.0                    |              |
| kotlinx-io            | Alpha      | 0.2.0                    |              |

### Kotlin 多平台

| **组件**                                         | **状态** | **自版本** | **备注**                                                                         |
|------------------------------------------------|------------|--------------------------|------------------------------------------------------------------------------------|
| Kotlin Multiplatform                           | 稳定版     | 1.9.20                   |                                                                                    |
| Android Studio 的 Kotlin 多平台插件            | Beta       | 0.8.0                    | [与语言版本独立](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-plugin-releases.html) |

### Kotlin/Native

| **组件**                                   | **状态** | **自版本** | **备注**                     |
|--------------------------------------------|------------|--------------------------|------------------------------|
| Kotlin/Native 运行时                     | 稳定版     | 1.9.20                   |                              |
| Kotlin/Native 与 C 和 Objective-C 的互操作 | Beta       | 1.3.0                    |                              |
| klib 二进制文件                          | 稳定版     | 1.9.20                   | 不包括 cinterop klibs，见下文 |
| cinterop klib 二进制文件                   | Beta       | 1.3.0                    |                              |
| CocoaPods 集成                           | 稳定版     | 1.9.20                   |                              |

> 有关 Kotlin/Native 目标支持的详细信息，请参阅 [](native-target-support.md)。

### 语言工具

| **组件**                      | **状态**   | **自版本** | **备注**                             |
|-------------------------------|--------------|--------------------------|--------------------------------------|
| 脚本语法和语义                | Alpha        | 1.2.0                    |                                      |
| 脚本嵌入和扩展 API            | Beta         | 1.5.0                    |                                      |
| 脚本 IDE 支持                 | Beta         |                          | 适用于 IntelliJ IDEA 2023.1 及更高版本 |
| CLI 脚本                      | Alpha        | 1.2.0                    |                                      |

## 语言特性和设计提案

有关语言特性和新设计提案，请参阅 [](kotlin-language-features-and-proposals.md)。