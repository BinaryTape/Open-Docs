[//]: # (title: 在平台间共享代码)

借助 Kotlin Multiplatform，你可以使用 Kotlin 提供的机制共享代码：
 
* [在项目中使用的所有平台之间共享代码](#share-code-on-all-platforms)。将其用于共享适用于所有平台的公共业务逻辑。
* [在项目中包含但不是所有的某些平台之间共享代码](#share-code-on-similar-platforms)。借助分层结构，你可以在相似平台中重用代码。

如果需要从共享代码访问平台特有的 API，请使用 Kotlin 的 [预期与实际声明](multiplatform-expect-actual.md) 机制。

## 在所有平台之间共享代码

如果你的业务逻辑适用于所有平台，则无需为每个平台编写相同的代码 — 只需在公共源代码集中共享它即可。

![Code shared for all platforms](flat-structure.svg)

某些源代码集的依赖项是默认设置的。你无需手动指定任何 `dependsOn` 关系：
* 对于所有依赖于公共源代码集的平台特有源代码集，例如 `jvmMain`、`macosX64Main` 等。
* 特定目标中的 `main` 和 `test` 源代码集之间，例如 `androidMain` 和 `androidUnitTest`。

如果需要从共享代码访问平台特有的 API，请使用 Kotlin 的 [预期与实际声明](multiplatform-expect-actual.md) 机制。

## 在相似平台之间共享代码

你通常需要创建多个原生目标，这些目标可以重用大量公共逻辑和第三方 API。

例如，在一个典型的面向 iOS 的多平台项目中，有两个与 iOS 相关的目标：一个用于 iOS ARM64 设备，另一个用于 x64 模拟器。它们拥有独立的平台特有源代码集，但实际上很少需要针对设备和模拟器编写不同的代码，并且它们的依赖项也大同小异。因此，iOS 特有的代码可以在它们之间共享。

显然，在这种设置中，最好为两个 iOS 目标提供一个共享源代码集，其中包含的 Kotlin/Native 代码仍然可以直接调用 iOS 设备和模拟器共有的任何 API。

在这种情况下，你可以使用 [分层结构](multiplatform-hierarchy.md) 通过以下方式之一在项目中的原生目标之间共享代码：

* [使用默认分层模板](multiplatform-hierarchy.md#default-hierarchy-template)
* [手动配置分层结构](multiplatform-hierarchy.md#manual-configuration)

了解更多关于 [在库中共享代码](#share-code-in-libraries) 和 [连接平台特有库](#connect-platform-specific-libraries) 的信息。

## 在库中共享代码

借助分层项目结构，库也可以为目标子集提供公共 API。当一个 [库发布](multiplatform-publish-lib-setup.md) 时，其中间源代码集的 API 会与项目结构信息一起嵌入到库构件中。当你使用此库时，你项目的中间源代码集只会访问该库中对每个源代码集的目标可用的 API。

例如，查看 `kotlinx.coroutines` 版本库中的以下源代码集层次结构：

![Library hierarchical structure](lib-hierarchical-structure.svg)

`concurrent` 源代码集声明了 `runBlocking` 函数，并为 JVM 和原生目标编译。一旦 `kotlinx.coroutines` 库更新并以分层项目结构发布，你就可以依赖它并从 JVM 和原生目标之间共享的源代码集中调用 `runBlocking`，因为它匹配该库 `concurrent` 源代码集的“目标签名”。

## 连接平台特有库

为了在不受平台特有依赖项限制的情况下共享更多原生代码，请使用 [平台库](https://kotlinlang.org/docs/native-platform-libs.html)，例如 Foundation、UIKit 和 POSIX。这些库与 Kotlin/Native 一起发布，并且默认在共享源代码集中可用。

此外，如果你在项目中使用了 [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) 插件，你可以使用 [`cinterop` 机制](https://kotlinlang.org/docs/native-c-interop.html) 处理所使用的第三方原生库。

## 下一步？

* [了解 Kotlin 预期与实际声明机制](multiplatform-expect-actual.md)
* [了解更多关于分层项目结构的信息](multiplatform-hierarchy.md)
* [设置多平台库的发布](multiplatform-publish-lib-setup.md)
* [查看关于多平台项目源代码文件命名的建议](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)