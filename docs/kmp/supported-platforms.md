[//]: # (title: 支持平台的稳定性)

Kotlin Multiplatform 允许您为各种平台创建应用程序，并在它们之间共享代码，以便让用户在他们喜欢的设备上使用。不同的平台可能具有不同级别的稳定性，这取决于核心 Kotlin Multiplatform 代码共享技术的支持以及 Compose Multiplatform UI 框架的支持。

本页面包含可帮助您识别哪些平台符合您的项目需求的信息，以及其稳定性级别的详细信息。

## Kotlin 的通用稳定性级别

以下是 Kotlin 稳定性级别及其含义的快速指南：

**Experimental** 表示“仅用于玩具项目尝试”：

* 我们只是尝试一个想法，希望一些用户试用并提供反馈。如果不可行，我们随时可能放弃它。

**Alpha** 表示“使用风险自负，预计会遇到迁移问题”：

* 我们打算将此想法产品化，但尚未定型。

**Beta** 表示“您可以使用它，我们将尽力为您将迁移问题降至最低”：

* 它已接近完成，用户反馈现在尤为重要。
* 不过，它尚未 100% 完成，因此仍可能发生变化（包括基于您自身反馈的更改）。
* 请提前留意弃用警告，以获得最佳更新体验。

我们将 _Experimental_、_Alpha_ 和 _Beta_ 统称为**预稳定**级别。

**Stable** 表示“即使在最保守的场景下也可以使用”：

* 它已完成。我们将根据我们严格的[向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/)对其进行演进。

### 核心 Kotlin Multiplatform 技术的当前平台稳定性级别

以下是核心 Kotlin Multiplatform 技术的当前平台稳定性级别：

| Platform                 | Stability level |
|--------------------------|-----------------|
| Android                  | Stable          |
| iOS                      | Stable          |
| Desktop (JVM)            | Stable          |
| Server-side (JVM)        | Stable          |
| Web based on Kotlin/Wasm | Alpha           |
| Web based on Kotlin/JS   | Stable          |
| watchOS                  | Beta            |
| tvOS                     | Beta            |

* Kotlin Multiplatform 支持比此处列出的更多原生平台。要了解每个平台的具体支持级别，请参见 [Kotlin/Native 目标平台支持](https://kotlinlang.org/docs/native-target-support.html)。
* 关于 Kotlin Multiplatform 等 Kotlin 组件的稳定性级别，请参见 [Kotlin 组件的当前稳定性](https://kotlinlang.org/docs/components-stability.html#current-stability-of-kotlin-components)。

## Compose Multiplatform UI 框架的稳定性级别

以下是 Compose Multiplatform UI 框架的平台稳定性级别及其含义的快速指南：

**Experimental** 表示“正在开发中”：

* 某些特性可能尚未可用，而那些已有的特性可能存在性能问题或 bug。
* 将来可能会有变化，并且破坏性变更可能频繁发生。

**Alpha** 表示“使用风险自负，预计会遇到迁移问题”：

* 我们已决定将平台支持产品化，但尚未定型。

**Beta** 表示“您可以使用它，我们将尽力为您将迁移问题降至最低”：

* 它已接近完成，因此用户反馈现在尤为重要。
* 它尚未 100% 完成，因此仍可能发生变化（包括基于您自身反馈的更改）。

我们将 **Experimental**、**Alpha** 和 **Beta** 统称为**预稳定**级别。

**Stable** 表示“即使在最保守的场景下也可以使用”：

* 该框架提供了全面的 API 表面，使您能够编写精美、可用于生产的应用程序，而不会在框架本身遇到性能或其他问题。
* API 破坏性变更只能在官方弃用公告发布 2 个版本后进行。

### Compose Multiplatform UI 框架的当前平台稳定性级别

| Platform                 | Stability level |
|--------------------------|-----------------|
| Android                  | Stable          |
| iOS                      | Stable          |
| Desktop (JVM)            | Stable          |
| Web based on Kotlin/Wasm | Alpha           |

## 下一步？

请参见[推荐的 IDE](recommended-ides.md)，了解哪个 IDE 更适合您在不同平台组合中的代码共享场景。