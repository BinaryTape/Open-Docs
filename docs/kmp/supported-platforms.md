[//]: # (title: 支持平台的稳定性)

Kotlin Multiplatform 允许您为各种平台创建应用程序并在这些平台之间共享代码，以便触达用户喜爱的设备。不同的平台可能具有不同的稳定性水平，这取决于核心 Kotlin Multiplatform 代码共享技术以及 Compose Multiplatform UI 框架对其的支持程度。

本页包含的信息可帮助您确定哪些平台符合您的项目需求，并提供其稳定性水平的详细信息。

## Kotlin 常规稳定性水平

以下是 Kotlin 稳定性水平及其含义的快速指南：

**实验性 (Experimental)** 表示“仅在玩具项目中使用”：

* 我们只是在尝试一个想法，并希望一些用户试用它并提供反馈。如果行不通，我们可能随时放弃它。

**Alpha** 表示“风险自负，预见迁移问题”：

* 我们打算将这个想法产品化，但它尚未达到最终形态。

**Beta** 表示“您可以使用它，我们将尽力为您减少迁移问题”：

* 它已基本完成，现在的用户反馈尤为重要。
* 尽管如此，它还没有 100% 完成，因此可能会发生变化（包括基于您反馈的变化）。
* 请提前关注弃用警告，以获得最佳的更新体验。

我们将**实验性**、**Alpha** 和 **Beta** 统称为**稳定前 (pre-stable)** 阶段。

**稳定 (Stable)** 表示“即使在最保守的场景中也可以使用”：

* 它已完成。我们将根据严格的[向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/)对其进行演进。

### 核心 Kotlin Multiplatform 技术的当前平台稳定性水平

以下是核心 Kotlin Multiplatform 技术的当前平台稳定性水平：

| 平台                       | 稳定性水平 |
|--------------------------|--------|
| Android                  | 稳定     |
| iOS                      | 稳定     |
| Desktop (JVM)            | 稳定     |
| Server-side (JVM)        | 稳定     |
| 基于 Kotlin/Wasm 的 Web     | Beta   |
| 基于 Kotlin/JS 的 Web       | 稳定     |
| watchOS                  | Beta   |
| tvOS                     | Beta   |

* Kotlin Multiplatform 支持的原生平台比此处列出的更多。要了解每个平台的具体支持级别，请参阅 [Kotlin/Native 目标支持](https://kotlinlang.org/docs/native-target-support.html)。
* 有关 Kotlin Multiplatform 等 Kotlin 组件稳定性水平的更多信息，请参阅 [Kotlin 组件的当前稳定性](https://kotlinlang.org/docs/components-stability.html#current-stability-of-kotlin-components)。

## Compose Multiplatform UI 框架稳定性水平

以下是 Compose Multiplatform UI 框架的平台稳定性水平及其含义的快速指南：

**实验性 (Experimental)** 表示“正在开发中”：

* 某些功能可能尚不可用，而当前存在的功能可能存在性能问题或错误。
* 未来可能会发生变化，并且可能会频繁发生破坏性变更。

**Alpha** 表示“风险自负，预见迁移问题”：

* 我们已决定将平台支持产品化，但它尚未呈现出最终形态。

**Beta** 表示“您可以使用它，我们将尽力为您减少迁移问题”：

* 它已基本完成，因此现在的用户反馈尤为重要。
* 它尚未 100% 完成，因此可能会发生变化（包括基于您反馈的变化）。

我们将**实验性**、**Alpha** 和 **Beta** 统称为**稳定前 (pre-stable)** 阶段。

**稳定 (Stable)** 表示“即使在最保守的场景中也可以使用”：

* 框架提供了全面的 API 表面，允许您编写美观、生产就绪的应用程序，而不会在框架本身中遇到性能或其他问题。
* 只有在官方发布弃用公告 2 个版本后，才能进行破坏 API 的变更。

### Compose Multiplatform UI 框架的当前平台稳定性水平

| 平台                       | 稳定性水平 |
|--------------------------|--------|
| Android                  | 稳定     |
| iOS                      | 稳定     |
| Desktop (JVM)            | 稳定     |
| 基于 Kotlin/Wasm 的 Web     | Beta   |

## 后续步骤

请参阅[推荐的 IDE](recommended-ides.md)，了解在不同的平台组合中，哪种 IDE 更适合您的代码共享方案。