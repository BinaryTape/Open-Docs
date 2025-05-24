---
title: "Kotlin 组件的稳定性"
---
Kotlin 语言和工具集被划分为许多组件，例如用于 JVM、JS 和 Native 目标的编译器、标准库、各种配套工具等等。
其中许多组件已正式发布为 **Stable（稳定版）**，这意味着它们遵循 [_Comfortable Updates（舒适更新）_ 和 _Keeping the Language Modern（保持语言现代性）_](kotlin-evolution-principles) 的原则，以向后兼容的方式发展。

遵循 _Feedback Loop（反馈环）_ 原则，我们尽早发布许多内容供社区试用，因此许多组件尚未发布为 **Stable（稳定版）**。
其中一些组件处于非常早期的阶段，一些则更加成熟。
我们根据每个组件的演变速度以及用户采用它所承担的风险将其标记为 **Experimental（实验版）**、**Alpha（先行版）** 或 **Beta（测试版）**。

## Stability levels explained（稳定性级别说明）

以下是这些稳定性级别及其含义的快速指南：

**Experimental（实验版）** 表示“仅在玩具项目中尝试它”：
  * 我们只是在尝试一个想法，并希望一些用户使用它并提供反馈。如果它不起作用，我们可能随时将其删除。

**Alpha（先行版）** 表示“使用风险自负，预计会出现迁移问题”：
  * 我们打算将这个想法产品化，但它尚未达到最终形态。

**Beta（测试版）** 表示“您可以使用它，我们将尽最大努力尽量减少您的迁移问题”：
  * 它几乎完成了，用户反馈现在尤其重要。
  * 尽管如此，它还没有 100% 完成，所以更改是可能的（包括基于您自己反馈的更改）。
  * 提前注意弃用警告，以获得最佳更新体验。

我们统称 _Experimental（实验版）_、_Alpha（先行版）_ 和 _Beta（测试版）_ 为 **pre-stable（预稳定）** 级别。

<a name="stable"/>

**Stable（稳定版）** 表示“即使在最保守的情况下也可以使用它”：
  * 它完成了。我们将根据我们严格的 [向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/) 来发展它。

请注意，稳定性级别与组件发布为 Stable（稳定版）的速度无关。同样，它们并不表示组件在发布之前会被更改多少。它们只说明组件变化的速度以及用户承担的更新问题的风险有多大。

## GitHub badges for Kotlin components（Kotlin 组件的 GitHub 徽章）

[Kotlin GitHub organization（Kotlin GitHub 组织）](https://github.com/Kotlin) 托管着不同的 Kotlin 相关项目。
其中一些是我们全职开发的，而另一些则是副项目。

每个 Kotlin 项目都有两个 GitHub 徽章，用于描述其稳定性和支持状态：

* **Stability（稳定性）** 状态。这显示了每个项目的演变速度以及用户采用它所承担的风险。
  稳定性状态与 [Kotlin 语言特性及其组件的稳定性级别](#stability-levels-explained) 完全一致：
    * <img src="https://kotl.in/badges/experimental.svg" alt="Experimental stability level" style={{verticalAlign: 'middle'}}/> 代表 **Experimental（实验版）**
    * <img src="https://kotl.in/badges/alpha.svg" alt="Alpha stability level" style={{verticalAlign: 'middle'}}/> 代表 **Alpha（先行版）**
    * <img src="https://kotl.in/badges/beta.svg" alt="Beta stability level" style={{verticalAlign: 'middle'}}/> 代表 **Beta（测试版）**
    * <img src="https://kotl.in/badges/stable.svg" alt="Stable stability level" style={{verticalAlign: 'middle'}}/> 代表 **Stable（稳定版）**

* **Support（支持）** 状态。这表明了我们维护项目并帮助用户解决问题的承诺。
  支持级别对于所有 JetBrains 产品都是统一的。
  [有关详细信息，请参阅 JetBrains Open Source 文档](https://github.com/JetBrains#jetbrains-on-github)。

## Stability of subcomponents（子组件的稳定性）

一个稳定组件可能有一个实验性子组件，例如：
* 一个稳定的编译器可能有一个实验性特性；
* 一个稳定的 API 可能包含实验性类或函数；
* 一个稳定的命令行工具可能具有实验性选项。

我们确保准确记录哪些子组件不是 **Stable（稳定版）**。
我们还会尽最大努力在可能的情况下警告用户，并要求他们明确选择加入，以避免意外使用尚未作为稳定版发布的功能。

## Current stability of Kotlin components（Kotlin 组件的当前稳定性）

:::note
默认情况下，所有新组件都具有 Experimental（实验版）状态。

:::

### Kotlin compiler（Kotlin 编译器）

| **Component**                                                       | **Status** | **Status since version** | **Comments** |
|---------------------------------------------------------------------|------------|--------------------------|--------------|
| Kotlin/JVM                                                          | Stable     | 1.0.0                    |              |
| Kotlin/Native                                                       | Stable     | 1.9.0                    |              |
| Kotlin/JS                                                           | Stable     | 1.3.0                    |              |
| Kotlin/Wasm                                                         | Alpha      | 1.9.20                   |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                          |              |

### Core compiler plugins（核心编译器插件）

| **Component**                                    | **Status**   | **Status since version** | **Comments** |
|--------------------------------------------------|--------------|--------------------------|--------------|
| [All-open](all-open-plugin)                   | Stable       | 1.3.0                    |              |
| [No-arg](no-arg-plugin)                       | Stable       | 1.3.0                    |              |
| [SAM-with-receiver](sam-with-receiver-plugin) | Stable       | 1.3.0                    |              |
| [kapt](kapt)                                  | Stable       | 1.3.0                    |              |
| [Lombok](lombok)                              | Experimental | 1.5.20                   |              |
| [Power-assert](power-assert)                  | Experimental | 2.0.0                    |              |

### Kotlin libraries（Kotlin 库）

| **Component**         | **Status** | **Status since version** | **Comments** |
|-----------------------|------------|--------------------------|--------------|
| kotlin-stdlib (JVM)   | Stable     | 1.0.0                    |              |
| kotlinx-coroutines    | Stable     | 1.3.0                    |              |
| kotlinx-serialization | Stable     | 1.0.0                    |              |
| kotlin-metadata-jvm   | Stable     | 2.0.0                    |              |
| kotlin-reflect (JVM)  | Beta       | 1.0.0                    |              |
| kotlinx-datetime      | Alpha      | 0.2.0                    |              |
| kotlinx-io            | Alpha      | 0.2.0                    |              |

### Kotlin Multiplatform（Kotlin 多平台）

| **Component**                                    | **Status**   | **Status since version** | **Comments**                                                               |
|--------------------------------------------------|--------------|--------------------------|----------------------------------------------------------------------------|
| Kotlin Multiplatform                             | Stable       | 1.9.20                   |                                                                            |
| Kotlin Multiplatform plugin for Android Studio   | Beta         | 0.8.0                    | [Versioned separately from the language](multiplatform-plugin-releases) |

### Kotlin/Native

| **Component**                                | **Status** | **Status since version** | **Comments**                            |
|----------------------------------------------|------------|--------------------------|-----------------------------------------|
| Kotlin/Native Runtime                        | Stable     | 1.9.20                   |                                         |
| Kotlin/Native interop with C and Objective-C | Beta       | 1.3.0                    |                                         |
| klib binaries                                | Stable     | 1.9.20                   | Not including cinterop klibs, see below |
| cinterop klib binaries                       | Beta       | 1.3.0                    |                                         |
| CocoaPods integration                        | Stable     | 1.9.20                   |                                         |

> For details about Kotlin/Native targets support, see [](native-target-support).

### Language tools（语言工具）

| **Component**                         | **Status**   | **Status since version** | **Comments**                                   |
|---------------------------------------|--------------|--------------------------|------------------------------------------------|
| Scripting syntax and semantics        | Alpha        | 1.2.0                    |                                                |
| Scripting embedding and extension API | Beta         | 1.5.0                    |                                                |
| Scripting IDE support                 | Beta         |                          | Available since IntelliJ IDEA 2023.1 and later |
| CLI scripting                         | Alpha        | 1.2.0                    |                                                |

## Language features and design proposals（语言特性和设计提案）

For language features and new design proposals, see [](kotlin-language-features-and-proposals).