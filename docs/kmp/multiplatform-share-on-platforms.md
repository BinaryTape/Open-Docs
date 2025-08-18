[//]: # (title: 跨平台共享代码)

借助 Kotlin Multiplatform，你可以使用 Kotlin 提供的机制共享代码：
 
* [在项目中使用的所有平台之间共享代码](#share-code-on-all-platforms)。这适用于共享适用于所有平台的通用业务逻辑。
* [在项目包含的部分而非所有平台之间共享代码](#share-code-on-similar-platforms)。借助分层结构，你可以在相似平台中重用代码。

如果你需要从共享代码中访问平台特有的 API，请使用 Kotlin 的[预期与实际声明](multiplatform-expect-actual.md)机制。

## 在所有平台之间共享代码

如果你有适用于所有平台的通用业务逻辑，则无需为每个平台编写相同的代码——只需在公共源代码集中共享即可。

![所有平台共享的代码](flat-structure.svg)

某些源代码集的依赖项是默认设置的。你无需手动指定任何 `dependsOn` 关系：
* 对于所有依赖于公共源代码集的平台特有源代码集，例如 `jvmMain`、`macosX64Main` 等。
* 在特定目标平台的 `main` 和 `test` 源代码集之间，例如 `androidMain` 和 `androidUnitTest`。

如果你需要从共享代码中访问平台特有的 API，请使用 Kotlin 的[预期与实际声明](multiplatform-expect-actual.md)机制。

## 在相似平台之间共享代码

你通常需要创建多个原生目标平台，这些平台可能会重用大量通用逻辑和第三方 API。

例如，在一个典型的面向 iOS 的多平台项目中，有两个与 iOS 相关的目标平台：一个是用于 iOS ARM64 设备，另一个是用于 x64 模拟器。它们有各自独立的平台特有源代码集，但实际上很少需要为设备和模拟器编写不同的代码，而且它们的依赖项也大同小异。因此，iOS 特有的代码可以在它们之间共享。

显然，在这种设置中，最好能为两个 iOS 目标平台提供一个共享源代码集，其中包含的 Kotlin/Native 代码仍然可以直接调用 iOS 设备和模拟器共有的任何 API。

在这种情况下，你可以使用以下方式之一，通过[分层结构](multiplatform-hierarchy.md)在项目中的原生目标平台之间共享代码：

* [使用默认分层模板](multiplatform-hierarchy.md#default-hierarchy-template)
* [手动配置分层结构](multiplatform-hierarchy.md#manual-configuration)

了解更多关于[在库中共享代码](#share-code-in-libraries)和[连接平台特有的库](#connect-platform-specific-libraries)的信息。

## 在库中共享代码

得益于分层项目结构，库也可以为目标平台子集提供通用 API。当[库发布](multiplatform-publish-lib-setup.md)时，其中间源代码集的 API 会与项目结构信息一同嵌入到库构件中。当你使用此库时，你项目的中间源代码集仅访问该库中可供每个源代码集的目标平台使用的 API。

例如，查看 `kotlinx.coroutines` 版本库中的以下源代码集层次结构：

![库分层结构](lib-hierarchical-structure.svg)

`concurrent` 源代码集声明了 `runBlocking` 函数，并为 JVM 和原生目标平台编译。一旦 `kotlinx.coroutines` 库使用分层项目结构更新并发布，你就可以依赖它，并从 JVM 和原生目标平台之间共享的源代码集中调用 `runBlocking`，因为它与该库的 `concurrent` 源代码集的“目标平台签名”匹配。

## 连接平台特有的库

为了共享更多原生代码而不受平台特有依赖项的限制，请使用 [平台库](https://kotlinlang.org/docs/native-platform-libs.html)，例如 Foundation、UIKit 和 POSIX。这些库随 Kotlin/Native 提供，并默认在共享源代码集中可用。

此外，如果你在项目中使用了 [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) 插件，你可以使用 [`cinterop` 机制](https://kotlinlang.org/docs/native-c-interop.html)与第三方原生库交互。

## 接下来？

* [关于 Kotlin 预期与实际声明机制，请参阅](multiplatform-expect-actual.md)
* [了解更多关于分层项目结构的信息](multiplatform-hierarchy.md)
* [设置你的多平台库的发布](multiplatform-publish-lib-setup.md)
* [关于多平台项目中源代码文件命名，请参见我们的建议](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)