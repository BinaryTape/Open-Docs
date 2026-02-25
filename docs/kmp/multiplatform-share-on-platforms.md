[//]: # (title: 在平台上共享代码)

使用 Kotlin Multiplatform，您可以利用 Kotlin 提供的机制来共享代码： 
 
* [在项目使用的所有平台之间共享代码](#share-code-on-all-platforms)。用于共享适用于所有平台的通用业务逻辑。     
* [在项目包含的部分平台（而非全部平台）之间共享代码](#share-code-on-similar-platforms)。您可以借助层次结构在相似平台中重用代码。

如果您需要从共享代码访问平台特定的 API，请使用 Kotlin 的 [预期声明与实际声明](multiplatform-expect-actual.md) 机制。

## 在所有平台上共享代码

如果您拥有适用于所有平台的通用业务逻辑，则无需为每个平台编写相同的代码 —— 只需在 common 源集中共享即可。

![在所有平台上共享代码](flat-structure.svg)

源集的某些依赖项是默认设置的。您不需要手动指定任何 `dependsOn` 关系：
* 对于依赖于 common 源集的所有平台特定源集，例如 `jvmMain`、`macosX64Main` 等。 
* 在特定目标的 `main` 和 `test` 源集之间，例如 `androidMain` 和 `androidUnitTest`。

如果您需要从共享代码访问平台特定的 API，请使用 Kotlin 的 [预期声明与实际声明](multiplatform-expect-actual.md) 机制。

## 在相似平台上共享代码

您经常需要创建多个原生目标，这些目标可能会重用大量通用逻辑和第三方 API。

例如，在针对 iOS 的典型多平台项目中，有两个 iOS 相关的目标：一个是针对 iOS ARM64 设备的，另一个是针对 x64 模拟器的。它们拥有独立的平台特定源集，但实际上很少需要为设备和模拟器编写不同的代码，且它们的依赖项也基本相同。因此，iOS 特定的代码可以在它们之间共享。

显然，在这种配置下，最好能为两个 iOS 目标建立一个共享源集，其中的 Kotlin/Native 代码仍然可以直接调用 iOS 设备和模拟器共有的任何 API。

在这种情况下，您可以使用 [层次结构](multiplatform-hierarchy.md) 通过以下方式之一在项目中的原生目标之间共享代码：

* [使用默认层次结构模板](multiplatform-hierarchy.md#default-hierarchy-template)
* [手动配置层次结构](multiplatform-hierarchy.md#manual-configuration)

详细了解 [在库中共享代码](#share-code-in-libraries) 和 [连接平台特定库](#connect-platform-specific-libraries)。

## 在库中共享代码

得益于层次结构项目结构，库也可以为目标的子集提供通用 API。当 [库发布](multiplatform-publish-lib-setup.md) 时，其中间源集的 API 会与项目结构信息一起嵌入到库工件中。当您使用该库时，项目的中间源集仅访问该库中对每个源集的目标可用的 API。

例如，查看来自 `kotlinx.coroutines` 仓库的以下源集层次结构：

![库层次结构](lib-hierarchical-structure.svg)

`concurrent` 源集声明了 `runBlocking` 函数，并为 JVM 和原生目标进行编译。一旦 `kotlinx.coroutines` 库使用层次结构项目结构完成更新和发布，您就可以依赖它，并从 JVM 和原生目标共享的源集中调用 `runBlocking`，因为它匹配库中 `concurrent` 源集的“目标签名”。

## 连接平台特定库

为了在不受平台特定依赖项限制的情况下共享更多原生代码，请使用 [平台库](https://kotlinlang.org/docs/native-platform-libs.html)，如 Foundation、UIKit 和 POSIX。这些库随 Kotlin/Native 一起提供，并且默认在共享源集中可用。

此外，如果您在项目中使用 [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) 插件，则可以处理通过 [`cinterop` 机制](https://kotlinlang.org/docs/native-c-interop.html) 使用的第三方原生库。

## 下一步

* [阅读关于 Kotlin 的预期声明与实际声明机制](multiplatform-expect-actual.md)
* [详细了解层次结构项目结构](multiplatform-hierarchy.md)
* [设置多平台库的发布](multiplatform-publish-lib-setup.md)
* [查看我们关于多平台项目中源文件命名的建议](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)