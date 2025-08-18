[//]: # (title: 支持平台稳定性)

Kotlin Multiplatform 允许您为各种平台创建应用程序，并在这些平台之间共享代码，从而让您触达用户喜爱的设备。不同平台可能具有不同的稳定性级别，这取决于核心 Kotlin Multiplatform 代码共享技术和 Compose Multiplatform UI 框架对它们的支持。

本页面包含的信息旨在帮助您确定哪些平台符合您的项目需求，并详细说明其稳定性级别。

## 通用 Kotlin 稳定性级别

以下是 Kotlin 中稳定性级别及其含义的快速指南：

**Experimental** 意味着“仅在玩具项目中尝试”：

*   我们只是在尝试一个想法，希望一些用户试用并提供反馈。如果行不通，我们随时可能放弃它。

**Alpha** 意味着“风险自担，预期会遇到迁移问题”：

*   我们打算将此想法产品化，但它尚未达到最终形态。

**Beta** 意味着“您可以使用它，我们将尽力为您最大限度地减少迁移问题”：

*   它已接近完成，用户反馈现在尤为重要。
*   尽管如此，它还不是 100% 完成，因此仍有可能进行更改（包括基于您自身反馈的更改）。
*   请提前留意废弃警告，以获得最佳更新体验。

我们将 _Experimental_、_Alpha_ 和 _Beta_ 统称为**预稳定**级别。

**Stable** 意味着“即使在最保守的场景中也可以使用它”：

*   它已完成。我们将根据严格的[向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/)对其进行演进。

### 核心 Kotlin Multiplatform 技术的当前平台稳定性级别

以下是核心 Kotlin Multiplatform 技术的当前平台稳定性级别：

| 平台                     | 稳定性级别 |
|--------------------------|-----------------|
| Android                  | Stable          |
| iOS                      | Stable          |
| Desktop (JVM)            | Stable          |
| Server-side (JVM)        | Stable          |
| Web based on Kotlin/Wasm | Alpha           |
| Web based on Kotlin/JS   | Stable          |
| watchOS                  | Beta            |
| tvOS                     | Beta            |

*   Kotlin Multiplatform 支持比此处列出更多的原生平台。要了解对每个平台的支持级别，请参见[Kotlin/Native 目标平台支持](https://kotlinlang.org/docs/native-target-support.html)。
*   有关 Kotlin Multiplatform 等 Kotlin 组件的稳定性级别的更多信息，请参见[Kotlin 组件的当前稳定性](https://kotlinlang.org/docs/components-stability.html#current-stability-of-kotlin-components)。

## Compose Multiplatform UI 框架稳定性级别

以下是 Compose Multiplatform UI 框架的平台稳定性级别及其含义的快速指南：

**Experimental** 意味着“正在开发中”：

*   某些特性可能尚未可用，而已有的特性可能存在性能问题或缺陷。
*   将来可能会有更改，并且破坏性更改可能频繁发生。

**Alpha** 意味着“风险自担，预期会遇到迁移问题”：

*   我们已决定将平台支持产品化，但它尚未达到最终形态。

**Beta** 意味着“您可以使用它，我们将尽力为您最大限度地减少迁移问题”：

*   它已接近完成，因此用户反馈现在尤为重要。
*   它还不是 100% 完成，因此仍有可能进行更改（包括基于您自身反馈的更改）。

我们将 **Experimental**、**Alpha** 和 **Beta** 统称为**预稳定**级别。

**Stable** 意味着“即使在最保守的场景中也可以使用它”：

*   该框架提供了一个全面的 API 表面，使您能够编写美观、可用于生产的应用程序，而不会遇到框架本身的性能或其他问题。
*   API 破坏性更改只能在正式废弃公告发布 2 个版本后进行。

### Compose Multiplatform UI 框架的当前平台稳定性级别

| 平台                     | 稳定性级别 |
|--------------------------|-----------------|
| Android                  | Stable          |
| iOS                      | Stable          |
| Desktop (JVM)            | Stable          |
| Web based on Kotlin/Wasm | Alpha           |

## 后续步骤

请参见[推荐的 IDE](recommended-ides.md) 以了解哪种 IDE 更适合您跨不同平台组合的代码共享场景。