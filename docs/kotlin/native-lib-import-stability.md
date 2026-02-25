[//]: # (title: C、Objective-C 与 Swift 库导入)

Kotlin/Native 提供了[导入 C](native-c-interop.md) 和 [Objective-C](native-objc-interop.md) 库的能力。
你还可以通过一些方法在 Kotlin/Native 项目中导入纯 [Swift 库](#swift-library-import)。

## C 与 Objective-C 库导入的稳定性
<primary-label ref="beta"/>

对导入 C 和 Objective-C 库的支持目前处于 [Beta 阶段](components-stability.md#kotlin-native)。

处于 Beta 状态的主要原因之一是，使用 C 和 Objective-C 库可能会影响代码与不同版本的 Kotlin、依赖项以及 Xcode 的兼容性。本指南列出了实践中经常发生的兼容性问题、仅在某些情况下发生的问题，以及假设的潜在问题。

为简单起见，我们将 C 和 Objective-C 库（在此统称为“原生库”）分为：

* [平台库](#platform-libraries)：Kotlin 默认提供，用于访问每个平台上的“系统”原生库。
* [第三方库](#third-party-libraries)：所有其他需要为 Kotlin 使用进行额外配置的原生库。

这两类原生库具有不同的兼容性特性。

### 平台库

[_平台库_](native-platform-libs.md) 随 Kotlin/Native 编译器一起发布。
因此，在项目中使用不同版本的 Kotlin 会导致获得不同版本的平台库。
对于 Apple 目标（如 iOS），平台库是基于特定编译器版本所支持的 Xcode 版本生成的。

Xcode SDK 附带的原生库 API 会随每个 Xcode 版本发生变化。
即使这些变化在原生语言内部是源代码和二进制兼容的，但由于互操作性实现的原因，它们对于 Kotlin 来说可能会变成破坏性变更。

因此，更新项目中的 Kotlin 版本可能会给平台库带来破坏性变更。
这在两种情况下可能会产生影响：

* 平台库中存在源代码破坏性变更，影响了项目中源代码的编译。通常，这很容易修复。
* 平台库中存在二进制破坏性变更，影响了你的某些依赖项。
  通常没有简单的解决方法，你需要等待库开发者在他们那边修复此问题，例如通过更新 Kotlin 版本。

  > 这种二进制不兼容性表现为链接警告和运行时异常。
  > 如果你希望在编译时检测到它们，请使用 [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) 编译器选项将警告提升为错误。
  >
  {style="note"}

当 JetBrains 团队更新用于生成平台库的 Xcode 版本时，会尽力避免平台库中的破坏性变更。每当可能发生破坏性变更时，团队都会进行影响分析，并决定忽略特定更改（因为受影响的 API 不常用）或应用临时修复。

平台库中出现破坏性变更的另一个潜在原因是将原生 API 转换为 Kotlin 的算法发生了变化。在这种情况下，JetBrains 团队也会尽力避免破坏性变更。

#### 使用平台库中新的 Objective-C 类

Kotlin 编译器不会阻止你使用部署目标中不可用的 Objective-C 类。

例如，如果你的部署目标是 iOS 17.0，而你使用了一个仅在 iOS 18.0 中出现的类，编译器不会向你发出警告，你的应用在 iOS 17.0 的设备上启动时可能会崩溃。
此外，即使执行从未到达这些用法，此类崩溃也会发生，因此仅通过版本检查来保护它们是不够的。

有关更多详细信息，请参阅[强链接](native-objc-interop.md#strong-linking)。

### 第三方库

除了系统平台库外，Kotlin/Native 还允许导入第三方原生库。
例如，你可以使用 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)或设置 [cinterops 配置](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops)。

#### 导入 Xcode 版本不匹配的库

导入第三方原生库可能会导致不同 Xcode 版本的兼容性问题。

在处理原生库时，编译器通常会使用本地安装的 Xcode 中的头文件，因为几乎所有原生库头文件都会导入来自 Xcode 的“标准”头文件（例如 `stdint.h`）。

这就是为什么 Xcode 版本会影响原生库向 Kotlin 的导入。这也是为什么在使用第三方原生库时，[从非 Mac 主机交叉编译 Apple 目标](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#compilation-for-apple-targets)仍然是不可能的。

每个 Kotlin 版本都与单个 Xcode 版本最兼容。这是推荐版本，它针对相应的 Kotlin 版本进行了最充分的测试。请在[兼容性表](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#version-compatibility)中查看与特定 Xcode 版本的兼容性。

使用较新或较旧的 Xcode 版本通常是可行的，但可能会导致问题，通常会影响第三方原生库的导入。

##### Xcode 版本高于推荐版本

使用高于推荐版本的 Xcode 版本可能会破坏某些 Kotlin 功能。导入第三方原生库受此影响最大。在不受支持的 Xcode 版本下，导入通常根本无法工作。

##### Xcode 版本低于推荐版本

通常，Kotlin 在较旧的 Xcode 版本下运行良好。可能会偶尔出现问题，最常见的结果是：

* Kotlin API 引用了不存在的类型，如 [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694) 中所示。
* 系统库中的类型被包含在原生库的 Kotlin API 中。
  在这种情况下，项目可以成功编译，但系统原生类型会被添加到你的原生库软件包中。
  例如，你可能会在 IDE 自动补全中意外看到该类型。

如果你的 Kotlin 库使用较旧的 Xcode 版本成功编译，那么除非你在 [库 API 中使用了第三方库的类型](#using-native-types-in-library-api)，否则发布该库是安全的。

#### 使用传递性第三方原生依赖项

当项目中的 Kotlin 库导入第三方原生库作为其实现的一部分时，你的项目也会获得对该原生库的访问权限。
这是因为 Kotlin/Native 不区分 `api` 和 `implementation` 依赖项类型，因此原生库最终总是成为 `api` 依赖项。

使用此类传递性原生依赖项容易出现更多兼容性问题。
例如，Kotlin 库开发者所做的更改可能会使原生库的 Kotlin 表示形式不兼容，从而导致你在更新 Kotlin 库时遇到兼容性问题。

因此，不要依赖传递性依赖项，而是直接配置与同一原生库的互操作性。为此，请为该原生库使用另一个软件包名称，类似于[使用自定义软件包名称](#use-custom-package-name)以防止兼容性问题。

#### 在库 API 中使用原生类型

如果你发布 Kotlin 库，请谨慎在库 API 中使用原生类型。这些用法预计在未来会被破坏，以修复兼容性和其他问题，这将影响你的库用户。

在某些情况下，在库 API 中使用原生类型是必要的，因为这是库的目的所要求的，例如，当 Kotlin 库基本上是为原生库提供扩展时。如果不是这种情况，请避免或限制在库 API 中使用原生类型。

此建议仅适用于库 API 中原生类型的使用，与应用代码无关。它也不适用于库实现，例如：

```kotlin
// 请格外小心！原生类型被用于库 API 中：
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// 像往常一样保持谨慎即可；原生类型未用于库 API 中：
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

#### 发布使用第三方库的库

如果你发布使用第三方原生库的 Kotlin 库，可以采取以下措施来避免兼容性问题。

##### 使用自定义软件包名称

为第三方原生库使用自定义软件包名称有助于防止兼容性问题。

当原生库导入 Kotlin 时，它会获得一个 Kotlin 软件包名称。如果该名称不是唯一的，库用户可能会遇到冲突。例如，如果原生库在用户项目的其他地方或其他依赖项中以相同的软件包名称导入，这两个用法将会发生冲突。

在这种情况下，编译可能会失败并报错 `Linking globals named '...': symbol multiply defined!`。不过，也可能会出现其他错误，甚至是编译成功。

要为第三方原生库使用自定义名称：

* 通过 CocoaPods 集成导入原生库时，请在 Gradle 构建脚本的 `pod {}` 代码块中使用 [`packageName`](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html#pod-function) 属性。
* 通过 `cinterops` 配置导入原生库时，请在配置块中使用 [`packageName`](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops) 属性。

##### 检查与旧版本 Kotlin 的兼容性

发布 Kotlin 库时，第三方原生库的使用可能会影响库与其他 Kotlin 版本的兼容性，具体而言：

* Kotlin Multiplatform 库不保证前向兼容性（即较旧的编译器可以使用由较新编译器编译的库）。

  在实践中，它在某些情况下是可行的；但是，使用原生库可能会进一步限制前向兼容性。

* Kotlin Multiplatform 库提供向后兼容性（即较新的编译器可以使用由较旧版本生成的库）。

  在 Kotlin 库中使用原生库通常不应影响其向后兼容性。但这增加了更多编译器 bug 影响兼容性的可能性。

##### 避免嵌入静态库

导入原生库时，可以使用 `-staticLibrary` 编译器选项或 `.def` 文件中的 `staticLibraries` 属性来包含关联的[静态库](native-definition-file.md#include-a-static-library)（`.a` 文件）。在这种情况下，你的库用户无需处理原生依赖项和链接器选项。

然而，无法以任何方式配置所包含静态库的使用：既不能排除也不能替换（代换）。因此，用户将无法解决与其他包含相同静态库的 Kotlin 库之间的潜在冲突，也无法调整其版本。

### 原生库支持的演进

目前，在 Kotlin 项目中使用 C 和 Objective-C 可能会导致兼容性问题；本指南列出了其中的一些问题。为了修复这些问题，未来可能需要进行一些破坏性变更，这本身也构成了兼容性问题的一部分。

## Swift 库导入

Kotlin/Native 不支持直接导入纯 Swift 库。但是，有几种方法可以解决这个问题。

一种方法是使用手动 Objective-C 桥接。通过这种方式，你需要编写自定义 Objective-C 包装器和 `.def` 文件，并通过 cinterop 使用这些包装器。

然而，在大多数情况下，我们建议使用“反向导入”方法：你在 Kotlin 侧定义预期的行为，在 Swift 侧实现实际功能，然后将其传递回 Kotlin。

你可以通过以下两种方式之一来定义预期的部分：

* 创建一个接口。基于接口的方法在处理多个函数和可测试性方面具有更好的扩展性。
* 使用 Swift 闭包。它们非常适合快速原型开发，但这种方法有其局限性——例如，它不保存状态。

参考这个将 [CryptoKit](https://developer.apple.com/documentation/cryptokit/) Swift 库反向导入到 Kotlin 项目的示例：

<tabs>
<tab title="接口">

1. 在 Kotlin 侧，创建一个接口来描述 Kotlin 对 Swift 的预期：

   ```kotlin
   // CryptoProvider.kt
   interface CryptoProvider {
       fun hashMD5(input: String): String
   }
   ```

2. 在 Kotlin 侧，从 `MainViewController` 传递平台特定的实现，然后在 `App` 可组合项中将其作为参数接收，并在需要的地方使用：

    ```kotlin
    // App.kt
    @Composable
    fun App(cryptoProvider: CryptoProvider) {
        // 在 UI 内部的使用示例
        val hashed = cryptoProvider.hashMD5("Hello, world!")
        androidx.compose.material3.Text("Compose: $hashed")
    }
    ```

    ```kotlin
    // MainViewController.kt
    fun MainViewController(cryptoProvider: CryptoProvider) = ComposeUIViewController {
        App(cryptoProvider)
    }
    ```

3. 在 Swift 侧，使用纯 Swift 库 CryptoKit 实现 MD5 哈希功能：

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

4. 将 Swift 实现传递给 Kotlin 组件：

   ```swift
   // iosApp/ContentView.swift
   struct ComposeView: UIViewControllerRepresentable {
       func makeUIViewController(context: Context) -> UIViewController {
           // 将 Swift 实现注入到 Kotlin UI 入口点
           MainViewControllerKt.MainViewController(cryptoProvider: IosCryptoProvider())
       }

       func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
   }
   ```

</tab>
<tab title="Swift 闭包">

1. 在 Kotlin 侧，声明一个函数参数并在需要的地方使用：

    ```kotlin
    // App.kt
    @Composable
    fun App(md5Hasher: (String) -> String) {
        // 在 UI 内部的使用示例
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

2. 在 Swift 侧，使用 CryptoKit 库构建 MD5 哈希器，并将其作为闭包传递：

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

在更复杂的项目中，使用依赖项注入将 Swift 实现传递回 Kotlin 会更方便。
有关更多信息，请参阅[依赖项注入框架](https://kotlinlang.org/docs/multiplatform/multiplatform-connect-to-apis.html#dependency-injection-framework)或查看 [Koin 框架](https://insert-koin.io/docs/reference/koin-mp/kmp/)文档。