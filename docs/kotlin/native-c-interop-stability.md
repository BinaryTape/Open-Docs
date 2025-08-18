[//]: # (title: C 和 Objective-C 库导入的稳定性)
<primary-label ref="beta"/>

Kotlin/Native 提供了 [导入 C 库](native-c-interop.md)以及 [Objective-C 库](native-objc-interop.md)的能力。对这些库的支持目前 [处于 Beta 阶段](components-stability.md#kotlin-native)。

处于 Beta 阶段的主要原因之一是，使用 C 和 Objective-C 库可能会影响你的代码与不同版本的 Kotlin、依赖项和 Xcode 的兼容性。本指南列出了实践中经常出现的兼容性问题、仅在某些情况下发生的问题，以及假设性的潜在问题。

在本指南中，C 和 Objective-C 库，为简化起见称为 _原生库_，分为：

* [平台库](#platform-libraries)，Kotlin 默认提供这些库以访问每个平台上的“系统”原生库。
* [第三方库](#third-party-libraries)，所有其他需要额外配置才能在 Kotlin 中使用的原生库。

这两种原生库具有不同的兼容性特点。

## 平台库

[_平台库_](native-platform-libs.md) 随 Kotlin/Native 编译器一同发布。因此，在项目中使用不同版本的 Kotlin 会导致获取到不同版本的平台库。对于 Apple 目标平台（例如 iOS），平台库是根据特定编译器版本所支持的 Xcode 版本生成的。

随 Xcode SDK 提供的原生库 API 会随每个 Xcode 版本而变化。即使此类更改在原生语言内部是源兼容和二进制兼容的，它们也可能由于互操作实现而对 Kotlin 造成破坏性更改。

因此，在项目中更新 Kotlin 版本可能会给平台库带来破坏性更改。这可能在两种情况下很重要：

* 平台库中存在源破坏性更改，这会影响项目中源代码的编译。通常，这很容易修复。
* 平台库中存在二进制破坏性更改，这会影响你的某些依赖项。通常没有简单的解决方法，你需要等待库开发者在他们那边修复此问题，例如通过更新 Kotlin 版本。

  > 此类二进制不兼容性表现为链接警告和运行时异常。
  > 如果你希望在编译期检测它们，可以使用 [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) 编译器选项将警告提升为错误。
  >
  {style="note"}

当 JetBrains 团队更新用于生成平台库的 Xcode 版本时，他们会尽合理努力避免平台库中出现破坏性更改。每当可能发生破坏性更改时，团队会进行影响分析，并决定忽略特定更改（因为受影响的 API 不常用）或应用临时修复。

平台库中破坏性更改的另一个潜在原因是将原生 API 转换为 Kotlin 的算法发生变化。JetBrains 团队也会尽合理努力避免此类情况下的破坏性更改。

### 使用平台库中的新 Objective-C 类

Kotlin 编译器不会阻止你使用在部署目标上不可用的 Objective-C 类。

例如，如果你的部署目标是 iOS 17.0，并且你使用了仅在 iOS 18.0 中出现的类，编译器不会发出警告，你的应用程序可能会在运行 iOS 17.0 的设备上启动时崩溃。此外，即使执行从未到达那些用法，此类崩溃也会发生，因此，仅通过版本检查来防范是不够的。

关于更多详细信息，请参见 [强链接](native-objc-interop.md#strong-linking)。

## 第三方库

除了系统平台库之外，Kotlin/Native 还允许导入第三方原生库。例如，你可以使用 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)或设置 [cinterops 配置](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops)。

### 导入 Xcode 版本不匹配的库

导入第三方原生库可能导致与不同 Xcode 版本的兼容性问题。

处理原生库时，编译器通常使用本地安装的 Xcode 中的头文件，因为几乎所有原生库头文件都会导入来自 Xcode 的“标准”头文件（例如，`stdint.h`）。

这就是为什么 Xcode 版本会影响原生库导入 Kotlin 的原因。这也是为什么在使用第三方原生库时，[从非 Mac 主机交叉编译 Apple 目标平台](whatsnew21.md#ability-to-publish-kotlin-libraries-from-any-host)仍然不可能的原因之一。

每个 Kotlin 版本都与一个特定 Xcode 版本最兼容。这是推荐版本，它已针对相应的 Kotlin 版本进行了最充分的测试。请在 [兼容性表](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#version-compatibility) 中查看与特定 Xcode 版本的兼容性。

使用更新或更旧的 Xcode 版本通常是可行的，但可能会导致问题，通常会影响第三方原生库的导入。

#### Xcode 版本比推荐版本新

使用比推荐版本更新的 Xcode 版本可能会破坏某些 Kotlin 特性。第三方原生库的导入受此影响最大。在使用不支持的 Xcode 版本时，它通常根本无法工作。

#### Xcode 版本比推荐版本旧

通常，Kotlin 能很好地与旧版 Xcode 配合使用。可能会出现偶发问题，这些问题通常表现为：

* Kotlin API 引用了不存在的类型，如 [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694) 中所示。
* 系统库中的类型被包含在原生库的 Kotlin API 中。在这种情况下，项目会成功编译，但一个系统原生类型会被添加到你的原生库包中。例如，你可能会在 IDE 自动补全中意外地看到此类型。

如果你的 Kotlin 库能成功地在旧版 Xcode 下编译，那么可以安全地发布，除非你在 [Kotlin 库 API 中使用了第三方库的类型](#using-native-types-in-library-api)。

### 使用传递性的第三方原生依赖项

当项目中一个 Kotlin 库作为其实现的一部分导入第三方原生库时，你的项目也会获得该原生库的访问权限。发生这种情况是因为 Kotlin/Native 不区分 `api` 和 `implementation` 依赖项类型，因此原生库最终总是作为 `api` 依赖项。

使用此类传递性的原生依赖项更容易出现兼容性问题。例如，Kotlin 库开发者所做的更改可能会使原生库的 Kotlin 表示不兼容，从而在你更新 Kotlin 库时导致兼容性问题。

因此，不要依赖传递性的依赖项，而是直接配置与同一个原生库的互操作。为此，为原生库使用另一个包名，类似于 [使用自定义包名](#use-custom-package-name) 以防止兼容性问题。

### 在库 API 中使用原生类型

如果你发布 Kotlin 库，请谨慎处理库 API 中的原生类型。将来，此类用法预计会被破坏，以修复兼容性及其他问题，这会影响你的库用户。

在某些情况下，在库 API 中使用原生类型是必要的，因为这是库目的所必需的，例如当 Kotlin 库基本上是为原生库提供扩展时。如果情况并非如此，请避免或限制在库 API 中使用原生类型。

此建议仅适用于库 API 中原生类型的用法，与应用程序代码无关。它也不适用于库实现，例如：

```kotlin
// 请格外小心！库 API 中使用了原生类型：
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// 照常小心；库 API 中未使用原生类型：
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

### 发布使用第三方库的库

如果你发布使用第三方原生库的 Kotlin 库，你可以做一些事情来避免兼容性问题。

#### 使用自定义包名

为第三方原生库使用自定义包名可能有助于防止兼容性问题。

当原生库被导入 Kotlin 时，它会获得一个 Kotlin 包名。如果它不是唯一的，库用户可能会遇到冲突。例如，如果一个原生库在用户项目或其他依赖项中的其他位置以相同的包名导入，这两个用法将发生冲突。

在这种情况下，编译可能会失败并出现 `Linking globals named '...': symbol multiply defined!` 错误。然而，也可能出现其他错误，甚至成功编译。

为第三方原生库使用自定义名称：

* 通过 CocoaPods 集成导入原生库时，请在 Gradle 构建脚本的 `pod {}` 代码块中，使用 [`packageName`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html#pod-function) 属性。
* 使用 `cinterops` 配置导入原生库时，请在配置代码块中，使用 [`packageName`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops) 属性。

#### 检查与旧版 Kotlin 的兼容性

发布 Kotlin 库时，第三方原生库的使用可能会影响库与其它 Kotlin 版本的兼容性，具体来说：

* Kotlin 多平台库不保证向前兼容性（即旧版编译器可以使用新版编译器编译的库）。

  实践中，它在某些情况下是可行的；然而，使用原生库可能会进一步限制向前兼容性。

* Kotlin 多平台库提供向后兼容性（即新版编译器可以使用旧版编译器生成的库）。

  在 Kotlin 库中使用原生库通常不应影响其向后兼容性。但这增加了更多影响兼容性的编译器 bug 的可能性。

#### 避免嵌入静态库

导入原生库时，可以使用 `-staticLibrary` 编译器选项或 `.def` 文件中的 `staticLibraries` 属性，包含关联的 [静态库](native-definition-file.md#include-a-static-library)（`.a` 文件）。在这种情况下，你的库用户无需处理原生依赖项和链接器选项。

然而，无法以任何方式配置所包含静态库的用法：既不能排除它，也不能替换（替代）它。因此，用户将无法解决与包含相同静态库的其他 Kotlin 库之间的潜在冲突，也无法调整其版本。

## 原生库支持的演进

目前，在 Kotlin 项目中使用 C 和 Objective-C 可能会导致兼容性问题；其中一些问题已在本指南中列出。为了解决这些问题，将来可能需要进行一些破坏性更改，这本身又会加剧兼容性问题。