---
title: 在平台上共享代码
---
使用 Kotlin Multiplatform，你可以使用 Kotlin 提供的机制来共享代码：

* [在项目中使用的所有平台之间共享代码](#share-code-on-all-platforms)。 用于共享适用于所有平台的通用业务逻辑。
* [在项目中包含的某些平台之间共享代码](#share-code-on-similar-platforms)，但不是所有平台。 你可以在类似平台的帮助下，借助分层结构复用代码。

如果你需要从共享代码访问平台特定的 API，请使用 Kotlin 的 [预期和实际声明](multiplatform-expect-actual)机制。

## 在所有平台之间共享代码

如果你的业务逻辑对于所有平台都是通用的，则无需为每个平台编写相同的代码，只需在通用源集中共享它即可。

<img src="/img/flat-structure.svg" alt="Code shared for all platforms" style={{verticalAlign: 'middle'}}/>

某些源集的依赖项是默认设置的。 你无需手动指定任何 `dependsOn` 关系：
* 对于所有依赖于通用源集的平台特定源集，例如 `jvmMain`、`macosX64Main` 等。
* 在特定目标的 `main` 和 `test` 源集之间，例如 `androidMain` 和 `androidUnitTest`。

如果你需要从共享代码访问平台特定的 API，请使用 Kotlin 的 [预期和实际声明](multiplatform-expect-actual)机制。

## 在类似平台之间共享代码

你经常需要创建多个原生目标，这些目标可能会复用大量通用逻辑和第三方 API。

例如，在典型的以 iOS 为目标的多平台项目中，有两个与 iOS 相关的目标：一个用于 iOS ARM64 设备，另一个用于 x64 模拟器。 它们具有单独的平台特定源集，但在实践中，很少需要为设备和模拟器使用不同的代码，并且它们的依赖关系也大致相同。 因此，可以在它们之间共享 iOS 特定的代码。

显然，在这种设置中，希望为两个 iOS 目标设置一个共享源集，其中 Kotlin/Native 代码仍然可以直接调用 iOS 设备和模拟器通用的任何 API。

在这种情况下，你可以使用[分层结构](multiplatform-hierarchy)，通过以下方式之一在项目中的原生目标之间共享代码：

* [使用默认层次结构模板](multiplatform-hierarchy#default-hierarchy-template)
* [手动配置分层结构](multiplatform-hierarchy#manual-configuration)

了解更多关于[在库中共享代码](#share-code-in-libraries)和[连接平台特定库](#connect-platform-specific-libraries)的信息。

## 在库中共享代码

由于分层项目结构，库还可以为目标子集提供通用 API。 当[库发布时](multiplatform-publish-lib)，其中间源集的 API 会与项目结构信息一起嵌入到库构件中。 当你使用此库时，你的项目的中间源集只能访问库中可用于每个源集的目标的那些 API。

例如，查看 `kotlinx.coroutines` 存储库中的以下源集层次结构：

<img src="/img/lib-hierarchical-structure.svg" alt="Library hierarchical structure" style={{verticalAlign: 'middle'}}/>

`concurrent` 源集声明了函数 runBlocking，并为 JVM 和原生目标编译。 一旦 `kotlinx.coroutines` 库更新并使用分层项目结构发布，你就可以依赖它并从 JVM 和原生目标之间共享的源集调用 `runBlocking`，因为它匹配库的 `concurrent` 源集的“目标签名”。

## 连接平台特定库

为了共享更多原生代码而不受平台特定依赖项的限制，请使用 [平台库](native-platform-libs)，如 Foundation、UIKit 和 POSIX。 这些库随 Kotlin/Native 一起提供，并且默认情况下可在共享源集中使用。

此外，如果在你的项目中使用 [Kotlin CocoaPods Gradle](native-cocoapods) 插件，你可以使用通过 [`cinterop` 机制](native-c-interop) 使用的第三方原生库。

## 接下来做什么？

* [阅读关于 Kotlin 的预期和实际声明机制](multiplatform-expect-actual)
* [了解更多关于分层项目结构的信息](multiplatform-hierarchy)
* [设置你的多平台库的发布](multiplatform-publish-lib)
* [查看我们关于在多平台项目中命名源文件的建议](coding-conventions#source-file-names)