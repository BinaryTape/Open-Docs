[//]: # (title: 构建适用于多平台的 Kotlin 库)

当创建 Kotlin 库时，请考虑构建并[发布它以支持 Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。这会拓宽您的库的目标受众，使其与面向多个平台的项目兼容。

以下章节提供了帮助您有效构建 Kotlin Multiplatform 库的指南。

## 扩大您的覆盖范围

为了使您的库作为依赖项可供最多的项目使用，请旨在支持尽可能多的 Kotlin Multiplatform [目标平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)。

如果您的库不支持多平台项目（无论是库还是应用程序）所使用的平台，该项目将难以依赖您的库。在这种情况下，项目可以对某些平台使用您的库，而需要为其他平台实现单独的解决方案，或者它们将完全选择一个支持其所有平台的替代库。

为了简化构件生产，您可以尝试[实验性的交叉编译](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#host-requirements)，以便从任何主机发布 Kotlin Multiplatform 库。这允许您无需 Apple 机器即可为 Apple 目标生成 `.klib` 构件。我们计划在未来稳定化此特性并进一步改进库的发布。请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下您对此特性的反馈。

> 对于 Kotlin/Native 目标，请考虑使用[分层方法](native-target-support.md#for-library-authors)来支持所有可能的目标。
>
{style="note"}

## 设计可从公共代码使用的 API

创建库时，请将 API 设计为可从公共 Kotlin 代码使用，而不是编写平台特有的实现。

在可能的情况下提供合理的默认配置，并包含平台特有的配置选项。良好的默认值允许用户从公共 Kotlin 代码中使用库的 API，而无需编写平台特有的实现来配置库。

按照以下优先级将 API 放置在最广泛的相关源代码集中：

*   **`commonMain` 源代码集：** `commonMain` 源代码集中的 API 可供库支持的所有平台使用。旨在将您库的大部分 API 放置在此处。
*   **中间源代码集：** 如果某些平台不支持特定 API，请使用[中间源代码集](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#intermediate-source-sets)来面向特定平台。例如，您可以创建一个 `concurrent` 源代码集，用于支持多线程的目标，或者一个 `nonJvm` 源代码集，用于所有非 JVM 目标。
*   **平台特有的源代码集：** 对于平台特有的 API，请使用 `androidMain` 等源代码集。

> 关于 Kotlin Multiplatform 项目的源代码集，请参见[分层项目结构](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)。
>
{style="tip"}

## 确保跨平台行为一致

为了确保您的库在所有支持的平台上行为一致，多平台库中的 API 应在所有平台上接受相同范围的有效输入、执行相同的操作并返回相同的结果。同样，库应统一处理无效输入，并在所有平台上一致地报告错误或抛出异常。

不一致的行为会使库难以使用，并迫使用户在公共代码中添加条件逻辑来管理平台特有的差异。

您可以使用[`expect` 和 `actual` 声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)来在公共代码中声明函数，这些函数具有平台特有的实现，可以完全访问每个平台的原生 API。这些实现也必须具有相同的行为，以确保它们可以从公共代码中可靠地使用。

当 API 在跨平台时行为一致时，它们只需在 `commonMain` 源代码集中文档化一次。

> 如果平台差异不可避免，例如当一个平台
> 支持更广泛的输入集时，请尽可能减少它们。例如，您可能不想限制一个平台的功能以匹配其他平台。在这种情况下，请清晰地文档化具体差异。
>
> {style=”note”}

## 在所有平台上测试

多平台库可以有[多平台测试](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)，这些测试用公共代码编写，并在所有平台上运行。定期在您支持的平台上执行此公共测试套件可以确保库行为正确且一致。

定期测试所有已发布平台上的 Kotlin/Native 目标可能具有挑战性。然而，为了确保更广泛的兼容性，请考虑为它能支持的所有目标发布库，并在测试兼容性时使用[分层方法](native-target-support.md#for-library-authors)。

使用[`kotlin-test`](https://kotlinlang.org/api/latest/kotlin.test/) 库在公共代码中编写测试，并使用平台特有的测试运行器执行它们。

## 考虑非 Kotlin 用户

Kotlin Multiplatform 提供与其支持的目标平台上的原生 API 和语言的互操作性。创建 Kotlin Multiplatform 库时，请考虑用户是否可能需要从非 Kotlin 语言中使用您库的类型和声明。

例如，如果您的库中的某些类型将通过互操作性暴露给 Swift 代码，请将这些类型设计为可从 Swift 轻松访问。
[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia) 提供了关于从 Swift 调用时 Kotlin API 呈现方式的有用见解。

## 推广您的库

您的库可以在 [JetBrains 搜索平台](https://klibs.io/)上展示。它旨在方便用户根据目标平台查找 Kotlin Multiplatform 库。

符合条件的库会自动添加。关于如何添加您的库的更多信息，请参见[常见问题解答](https://klibs.io/faq)。