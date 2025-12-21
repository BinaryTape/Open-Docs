[//]: # (title: C、Objective-C 和 Swift 库导入)

Kotlin/Native 提供了 [导入 C](native-c-interop.md) 和 [Objective-C](native-objc-interop.md) 库的能力。
你也可以变通解决将纯 [Swift 库](#swift-library-import) 导入到 Kotlin/Native 项目中的问题。

## C 和 Objective-C 库导入的稳定性
<primary-label ref="beta"/>

目前，对导入 C 和 Objective-C 库的支持处于 [Beta 阶段](components-stability.md#kotlin-native)。

处于 Beta 状态的主要原因之一是，使用 C 和 Objective-C 库可能会影响你的代码与不同版本 Kotlin、依赖项和 Xcode 的兼容性。本指南列出了实践中经常发生的兼容性问题、仅在某些情况下发生的问题以及假设性的潜在问题。

为简化起见，我们将 C 和 Objective-C 库（或在此处称作 _原生库_）分为：

* [平台库](#platform-libraries)：Kotlin 默认提供这些库，用于访问每个平台上的“系统”原生库。
* [第三方库](#third-party-libraries)：所有其他原生库，它们需要额外配置才能在 Kotlin 中使用。

这两种原生库具有不同的兼容性特点。

### 平台库

[_平台库_](native-platform-libs.md) 随 Kotlin/Native 编译器一同提供。
因此，在项目中使用不同版本的 Kotlin 会导致获得不同版本的平台库。
对于 Apple 目标平台（例如 iOS），平台库是基于特定编译器版本支持的 Xcode 版本生成的。

随 Xcode SDK 提供的原生库 API 会随每个 Xcode 版本而变化。
即使这些变更在原生语言内部是源和二进制兼容的，但由于互操作性实现，它们可能会对 Kotlin 造成破坏性变更。

结果是，更新项目中的 Kotlin 版本可能会给平台库带来破坏性变更。
这在以下两种情况下可能很重要：

* 平台库中存在源破坏性变更，影响了项目中源代码的编译。这通常易于修复。
* 平台库中存在二进制破坏性变更，影响了你的一些依赖项。通常没有简单的变通方法，你需要等待库开发者在其端修复此问题，例如，通过更新 Kotlin 版本。

  > 此类二进制不兼容性表现为链接警告和运行时异常。
  > 如果你希望在编译期检测它们，请使用 [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) 编译器选项将警告提升为错误。
  >
  {style="note"}

当 JetBrains 团队更新用于生成平台库的 Xcode 版本时，它会做出合理努力来避免平台库中的破坏性变更。每当可能发生破坏性变更时，团队都会进行影响分析，并决定忽略特定变更（因为受影响的 API 不常用）或应用临时修复。

平台库中破坏性变更的另一个潜在原因是翻译原生 API 到 Kotlin 的算法发生变化。JetBrains 团队在这种情况下也会做出合理努力来避免破坏性变更。

#### 使用平台库中的新 Objective-C 类

Kotlin 编译器不会阻止你使用不适用于你的部署目标的 Objective-C 类。

例如，如果你的部署目标是 iOS 17.0，并且你使用了仅在 iOS 18.0 中出现的类，编译器不会警告你，并且你的应用程序可能会在 iOS 17.0 设备上启动期间崩溃。
此外，即使执行永远不会到达那些使用处，也会发生这种崩溃，因此通过版本检测来保护它们是不够的。

关于更多详情，请参见 [强链接](native-objc-interop.md#strong-linking)。

### 第三方库

除了系统平台库之外，Kotlin/Native 还允许导入第三方原生库。
例如，你可以使用 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 或设置 [cinterops 配置](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops)。

#### 导入 Xcode 版本不匹配的库

导入第三方原生库可能导致与不同 Xcode 版本的兼容性问题。

在处理原生库时，编译器通常使用本地安装的 Xcode 中的头文件，因为几乎所有原生库头文件都导入来自 Xcode 的“标准”头文件（例如，`stdint.h`）。

这就是为什么 Xcode 版本会影响将原生库导入 Kotlin。这也是为什么在使用第三方原生库时，[从非 Mac 主机对 Apple 目标平台进行交叉编译](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#compilation-for-apple-targets) 仍然不可能的原因之一。

每个 Kotlin 版本与单个 Xcode 版本的兼容性最佳。这是推荐版本，并且已针对相应的 Kotlin 版本进行了最多测试。请在 [兼容性表](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#version-compatibility) 中检测与特定 Xcode 版本的兼容性。

使用更新或更旧的 Xcode 版本通常是可能的，但可能会导致问题，通常影响第三方原生库的导入。

##### Xcode 版本比推荐版本更新

使用比推荐版本更新的 Xcode 版本可能会破坏一些 Kotlin 特性。第三方原生库的导入受此影响最大。在不支持的 Xcode 版本下，它通常完全不起作用。

##### Xcode 版本比推荐版本更旧

通常，Kotlin 与较旧的 Xcode 版本配合良好。可能会有偶尔出现的问题，最常导致：

* Kotlin API 引用了不存在的类型，如 [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694) 中所示。
* 系统库中的类型包含在原生库的 Kotlin API 中。
  在这种情况下，项目编译成功，但系统原生类型被添加到你的原生库包中。例如，你可能会在 IDE 自动补全中意外地看到此类型。

如果你的 Kotlin 库使用较旧的 Xcode 版本成功编译，则可以安全发布，除非你在 [Kotlin 库 API 中使用来自第三方库的类型](#using-native-types-in-library-api)。

#### 使用传递性第三方原生依赖项

当你的项目中有一个 Kotlin 库作为其实现的一部分导入了第三方原生库时，你的项目也能访问该原生库。
发生这种情况是因为 Kotlin/Native 不区分 `api` 和 `implementation` 依赖项类型，因此原生库总是最终成为 `api` 依赖项。

使用这种传递性原生依赖项容易出现更多兼容性问题。
例如，Kotlin 库开发者所做的变更可能会使原生库的 Kotlin 表示不兼容，从而在你更新 Kotlin 库时导致兼容性问题。

因此，与其依赖于传递性依赖项，不如直接配置与同一原生库的互操作。为此，请为原生库使用另一个包名，类似于 [使用自定义包名](#use-custom-package-name) 以防止兼容性问题。

#### 在库 API 中使用原生类型

如果你发布 Kotlin 库，请小心处理库 API 中的原生类型。预计将来此类用法将被破坏，以修复兼容性及其他问题，这将影响你的库用户。

在某些情况下，在库 API 中使用原生类型是必要的，因为这是库的用途所必需的，例如，当 Kotlin 库基本上提供了对原生库的扩展时。
如果这并非你的情况，请避免或限制在库 API 中使用原生类型。

此建议仅适用于库 API 中原生类型的用法，与应用程序代码无关。它也不适用于库实现，例如：

```kotlin
// 请特别小心！库 API 中使用了原生类型：
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// 照常小心；库 API 中未用到原生类型：
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

#### 发布使用第三方库的库

如果你发布了一个使用第三方原生库的 Kotlin 库，你可以做几件事来避免兼容性问题。

##### 使用自定义包名

为第三方原生库使用自定义包名可能有助于防止兼容性问题。

当原生库被导入 Kotlin 时，它会获得一个 Kotlin 包名。如果它不是唯一的，库用户可能会遇到冲突。例如，如果原生库在用户项目的其他地方或通过其他依赖项导入时使用了相同的包名，这两种用法将会冲突。

在这种情况下，编译可能会因 `Linking globals named '...': symbol multiply defined!` 错误而失败。然而，也可能存在其他错误，甚至成功编译。

要为第三方原生库使用自定义名称：

* 当通过 CocoaPods 集成导入原生库时，请在 Gradle 构建脚本的 `pod {}` 代码块中使用 [`packageName`](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html#pod-function) 属性。
* 当使用 `cinterops` 配置导入原生库时，请在配置代码块中使用 [`packageName`](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops) 属性。

##### 检测与更旧 Kotlin 版本的兼容性

在发布 Kotlin 库时，第三方原生库的使用可能会影响库与其他 Kotlin 版本的兼容性，具体而言：

* Kotlin Multiplatform 库不保证向前兼容性（即较旧的编译器可以使用由较新编译器编译的库）。

  在实践中，它在某些情况下是可行的；然而，使用原生库可能会进一步限制向前兼容性。

* Kotlin Multiplatform 库提供向后兼容性（即较新的编译器可以使用由较旧版本生成的库）。

  在 Kotlin 库中使用原生库通常不应影响其向后兼容性。
  但这带来了更多影响兼容性的编译器错误的可能性。

##### 避免嵌入静态库

在导入原生库时，可以使用 `-staticLibrary` 编译器选项或 `.def` 文件中的 `staticLibraries` 属性来包含相关联的 [静态库](native-definition-file.md#include-a-static-library)（`.a` 文件）。
在这种情况下，你的库用户无需处理原生依赖项和链接器选项。

然而，无法以任何方式配置使用包含的静态库：既不能排除也不能替换（替代）它。因此，用户将无法解决与其他包含相同静态库的 Kotlin 库的潜在冲突或调整其版本。

### 原生库支持的演进

目前，在 Kotlin 项目中使用 C 和 Objective-C 可能会导致兼容性问题；其中一些已在本指南中列出。
为了解决这些问题，未来可能需要进行一些破坏性变更，这本身也加剧了兼容性问题。

## Swift 库导入

Kotlin/Native 不支持直接导入纯 Swift 库。然而，有几种方案可以变通解决这个问题。

一种方法是使用手动 Objective-C 桥接。采用这种方法，你需要编写自定义 Objective-C 包装器和 `.def` 文件，并通过 cinterop 使用这些包装器。

然而，在大多数情况下，我们建议使用 _反向导入_ 方法：你在 Kotlin 侧定义预期行为，在 Swift 侧实现实际功能，并将其传递回 Kotlin。

你可以通过以下两种方式之一定义预期部分：

* 创建一个接口。基于接口的方法更适合扩展多函数和可测试性。
* 使用 Swift 闭包。它们非常适合快速原型开发，但这种方法有其局限性——例如，它不会持有状态。

考虑以下将 [CryptoKit](https://developer.apple.com/documentation/cryptokit/) Swift 库反向导入 Kotlin 项目的示例：

<tabs>
<tab title="接口">

1. 在 Kotlin 侧，创建一个接口来描述 Kotlin 对 Swift 的期望：

   ```kotlin
   // CryptoProvider.kt
   interface CryptoProvider {
       fun hashMD5(input: String): String
   }
   ```

2. 在 Swift 侧，使用纯 Swift 库 CryptoKit 实现 MD5 哈希功能：

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    
    class IosCryptoProvider: CryptoProvider {
        func hashMD5(input: String) -> String {
            guard let data = input.data(using: .utf8) else { return "failed" }
            return Insecure.MD5.hash(data: data).description
        }
    }
    ```

3. 将 Swift 实现传递给 Kotlin 组件：

   ```swift
   // iosApp/ContentView.swift
   struct ComposeView: UIViewControllerRepresentable {
       func makeUIViewController(context: Context) -> UIViewController {
           // 将 Swift 实现注入 Kotlin UI 入口点
           MainViewControllerKt.MainViewController(cryptoProvider: IosCryptoProvider())
       }

       func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
   }
   ```

</tab>
<tab title="Swift 闭包">

1. 在 Kotlin 侧，声明一个函数形参并在需要的地方使用它：

    ```kotlin
    // App.kt
    @Composable
    fun App(md5Hasher: (String) -> String) {
        // 在 UI 中使用的示例
        val hashed = md5Hasher("Hello, world!")
        androidx.compose.material3.Text("Compose: $hashed")
    }
    ```

    ```kotlin
    // MainViewController.kt
    fun MainViewController(md5Hasher: (String) -> String) = ComposeUIViewController {
        App(md5Hasher)
    }
    ```

2. 在 Swift 侧，使用 CryptoKit 库构建 MD5 哈希器并将其作为闭包传递：

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    import SwiftUI

    struct ComposeView: UIViewControllerRepresentable {
        func makeUIViewController(context: Context) -> UIViewController {
            MainViewControllerKt.MainViewController(md5Hasher: { input in
                guard let data = input.data(using: .utf8) else { return "failed" }
                return Insecure.MD5.hash(data: data).description
            })
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
    }
    ```

</tab>
</tabs>

在更复杂的项目中，使用依赖注入将 Swift 实现传递回 Kotlin 会更方便。
关于更多信息，请参见 [依赖注入框架](https://kotlinlang.org/docs/multiplatform/multiplatform-connect-to-apis.html#dependency-injection-framework) 或查阅 [Koin 框架](https://insert-koin.io/docs/reference/koin-mp/kmp/) 文档。