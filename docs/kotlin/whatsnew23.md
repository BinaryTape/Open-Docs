[//]: # (title: Kotlin 2.3.0 有哪些新特性)

_[发布日期：2025 年 12 月 16 日](releases.md#release-details)_

Kotlin 2.3.0 版本已发布！以下是主要亮点：

*   **语言**: [更多稳定和默认的特性、未使用的返回值检测器、显式幕后字段以及上下文敏感解析的更改](#language)。
*   **Kotlin/JVM**: [支持 Java 25](#kotlin-jvm-support-for-java-25)。
*   **Kotlin/Native**: [通过 Swift 导出改进互操作性、更快的发布任务构建时间、C 和 Objective-C 库导入处于 Beta 阶段](#kotlin-native)。
*   **Kotlin/Wasm**: [默认启用完全限定名和新的异常处理提案，以及拉丁-1 字符的新紧凑存储](#kotlin-wasm)。
*   **Kotlin/JS**: [新的实验性挂起函数导出、`LongArray` 表示、统一的伴生对象访问等](#kotlin-js)。
*   **Gradle**: [与 Gradle 9.0 的兼容性以及用于注册生成源代码的新 API](#gradle)。
*   **Compose 编译器**: [精简 Android 应用程序的堆栈跟踪](#compose-compiler-stack-traces-for-minified-android-applications)。
*   **标准库**: [稳定的时间追踪功能和改进的 UUID 生成与解析](#standard-library)。

## IDE 支持

支持 2.3.0 版本的 Kotlin 插件已捆绑在最新版本的 IntelliJ IDEA 和 Android Studio 中。
你无需在 IDE 中更新 Kotlin 插件。
你只需在构建脚本中将 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version) 为 2.3.0。

有关详细信息，请参见 [更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

Kotlin 2.3.0 专注于特性稳定化，引入了一种用于检测未使用的返回值的新机制，并改进了上下文敏感解析。

### 稳定特性

在之前的 Kotlin 版本中，一些新的语言特性以实验性（Experimental）和 Beta 形式引入。
以下特性现已在 Kotlin 2.3.0 中升级为 [稳定](components-stability.md#stability-levels-explained) 版：

*   [支持嵌套类型别名](whatsnew22.md#support-for-nested-type-aliases)
*   [针对 `when` 表达式的基于数据流的穷尽性检测](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### 默认启用的特性

在 Kotlin 2.3.0 中，[`return` 语句在具有显式返回类型的表达式主体中](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types) 的支持现已默认启用。

[查看 Kotlin 语言特性和提案的完整列表](kotlin-language-features-and-proposals.md)。

### 未使用的返回值检测器
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 引入了未使用的返回值检测器，以帮助防止结果被忽略。
当表达式返回除 `Unit` 或 `Nothing` 之外的值，且未传递给函数、未在条件中检测或未以其他方式使用时，它会发出警告。

该检测器有助于捕获函数调用产生有意义的结果却被悄无声息地丢弃的 bug，这可能导致意外行为或难以追溯的问题。

> 检测器会忽略来自 `++` 和 `--` 等增量操作返回的值。
>
{style="note"}

请看以下示例：

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 检测器报告此结果被忽略的警告
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

在此示例中，创建了一个字符串但从未使用，因此检测器将其报告为被忽略的结果。

此特性是 [实验性的](components-stability.md#stability-levels-explained)。
要选择启用，请将以下编译器选项添加到你的构建文件中：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xreturn-value-checker=check</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

使用此选项，检测器只报告来自已标记表达式（例如 Kotlin 标准库中的大多数函数）的被忽略结果。

要标记你的函数，请使用 `@MustUseReturnValues` 注解来标记你希望检测器报告被忽略返回值的范围。

例如，你可以标记整个文件：

```kotlin
// 标记此文件中的所有函数和类，以便检测器报告未使用的返回值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或者，你可以标记特定的类：

```kotlin
// 标记此类中的所有函数，以便检测器报告未使用的返回值
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

你也可以通过向构建文件添加以下编译器选项来标记整个项目：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xreturn-value-checker=full</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

通过此设置，Kotlin 会自动将你编译的文件视为已使用 `@MustUseReturnValues` 注解，并且检测器会报告项目中所有函数的返回值。

你可以通过使用 `@IgnorableReturnValue` 注解标记特定函数来抑制警告。
标记那些忽略返回值很常见且符合预期的函数，例如 `MutableList.add`：

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

你可以在不将函数本身标记为可忽略的情况下抑制警告。
为此，请将结果赋值给一个带有下划线 (`_`) 的特殊未命名变量：

```kotlin
// 不可忽略的函数
fun computeValue(): Int = 42

fun main() {
    // 报告警告：结果被忽略
    computeValue()

    // 仅在此调用点使用特殊未使用的变量抑制警告
    val _ = computeValue()
}
```

有关更多信息，请参见此特性的 [KEEP]( https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)。

我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供反馈。

### 显式幕后字段
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0 引入了显式幕后字段——一种新语法，用于显式声明保存属性值的底层字段，与现有隐式幕后字段形成对比。

新的显式语法简化了常见的幕后属性模式，在该模式中，属性的内部类型与其暴露的 API 类型不同。例如，你可能使用一个 `ArrayList`，但将其暴露为只读的 `List` 或 `MutableList`。
以前，这需要一个额外的私有属性。

使用显式幕后字段，`field` 的实现类型直接在属性的作用域内定义。
这消除了对单独私有属性的需求，并允许编译器在相同的私有作用域内自动对幕后字段的类型执行智能转换。

之前：

```kotlin
private val _city = MutableStateFlow<String>("")
val city: StateFlow<String> get() = _city

fun updateCity(newCity: String) {
    _city.value = newCity
}
```

之后：

```kotlin
val city: StateFlow<String>
    field = MutableStateFlow("")

fun updateCity(newCity: String) {
    // 智能转换自动生效
    city.value = newCity
}
```

此特性是 [实验性的](components-stability.md#stability-levels-explained)。
要选择启用，请将以下编译器选项添加到你的构建文件中：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-backing-fields")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-backing-fields</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

有关更多信息，请参见此特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)。

我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-14663) 中提供反馈。

### 上下文敏感解析的更改
<primary-label ref="experimental-general"/>

上下文敏感解析仍处于 [实验性](components-stability.md#stability-levels-explained) 阶段，但我们正在根据用户反馈持续改进此特性：

*   当前类型的密封（sealed）和封闭超类型（enclosing supertypes）现在被视为搜索的上下文作用域的一部分。
    不考虑其他超类型作用域。关于动机和示例，请参见 [KT-77823](https://youtrack.jetbrains.com/issue/KT-77823) YouTrack issue。
*   当涉及类型操作符和等式时，如果使用上下文敏感解析导致解析模糊，编译器现在会报告警告。这可以发生，例如，当导入类的冲突声明时。关于动机和示例，请参见 [KT-77821](https://youtrack.jetbrains.com/issue/KT-77821) YouTrack issue。

关于当前提案的全文，请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md)。

## Kotlin/JVM: 支持 Java 25

从 Kotlin 2.3.0 开始，编译器可以生成包含 Java 25 字节码的类。

## Kotlin/Native

Kotlin 2.3.0 改进了对 Swift 导出的支持以及 C 和 Objective-C 库的导入，并增强了发布任务的构建时间。

### 通过 Swift 导出改进互操作性
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 通过 Swift 导出进一步改进了 Kotlin 与 Swift 的互操作性，增加了对原生枚举类和可变参数函数（variadic function）的支持。

以前，Kotlin 枚举被导出为普通的 Swift 类。现在映射是直接的，你可以使用常规的原生 Swift 枚举。例如：

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get }
}
```

此外，Kotlin 的 [`vararg`](functions.md#variable-number-of-arguments-varargs) 函数现在直接映射到 Swift 的可变参数函数形参。

此类函数允许你传递可变数量的实参。当你不提前知道实参的数量，或者当你想创建或传递一个集合而不指定其类型时，这非常有用。例如：

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
public func log(messages: Swift.String...)
```

> 可变参数函数形参中的泛型类型尚不支持。
>
{style="note"}

### C 和 Objective-C 库导入处于 Beta 阶段
<primary-label ref="beta"/>

将 [C](native-c-interop.md) 和 [Objective-C](native-objc-interop.md) 库导入到 Kotlin/Native 项目的支持处于 [Beta](components-stability.md#stability-levels-explained) 阶段。

尚不能保证与不同版本的 Kotlin、依赖项和 Xcode 完全兼容，但编译器现在在出现二进制兼容性问题时会发出更好的诊断信息。

导入尚不稳定，并且在使用 C 和 Objective-C 库时，仍需要 `@ExperimentalForeignApi` 选择启用注解，以处理与 C 和 Objective-C 互操作性相关的某些事项，包括：

*   `kotlinx.cinterop.*` 包中的某些 API，在使用原生库或内存时需要。
*   原生库中的所有声明，除了 [平台库](native-platform-libs.md) 外。

为了兼容性并防止你必须更改源代码，新的稳定性状态未反映在注解名称中。

有关更多信息，请参见 [C 和 Objective-C 库导入的稳定性](native-lib-import-stability.md)。

### Objective-C 头文件中代码块类型的默认显式名称

Kotlin 函数类型中的显式形参名（[在 Kotlin 2.2.20 中引入](whatsnew2220.md#explicit-names-in-block-types-for-objective-c-headers)）现在是 Kotlin/Native 项目导出的 Objective-C 头文件中的默认设置。这些形参名改进了 Xcode 中的自动补全建议，并有助于避免 Clang 警告。

请看以下 Kotlin 代码：

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin 将形参名从 Kotlin 函数类型转发到 Objective-C 块类型，允许 Xcode 在建议中使用它们：

```ObjC
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

如果你遇到问题，可以禁用显式形参名。
为此，请将以下 [二进制选项](native-binary-options.md) 添加到你的 `gradle.properties` 文件中：

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=false
```

请在 [YouTrack](https://kotl.in/issue) 中报告任何问题。

### 更快的发布任务构建时间

Kotlin/Native 在 2.3.0 中获得了多项性能改进。它们带来了更快的发布任务构建时间，例如 `linkRelease*`（例如 `linkReleaseFrameworkIosArm64`）。

根据我们的基准测试，发布构建的速度最高可提高 40%，具体取决于项目大小。这些改进在面向 iOS 的 Kotlin Multiplatform 项目中最为显著。

关于改进项目编译时间的更多提示，请参见 [文档](native-improving-compilation-time.md)。

### Apple 目标支持的更改

Kotlin 2.3.0 提高了 Apple 目标的最低支持版本：

*   对于 iOS 和 tvOS，从 12.0 提高到 14.0。
*   对于 watchOS，从 5.0 提高到 7.0。

根据公开数据，旧版本的使用量已经非常有限。此更改简化了我们对 Apple 目标的整体维护，并为 Kotlin/Native 中支持 [Mac Catalyst](https://developer.apple.com/documentation/uikit/mac-catalyst) 带来了机会。

如果你的项目必须保留旧版本，请将以下行添加到构建文件中：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
        binaries.configureEach {
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.ios=12.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.tvos=12.0"
        }
    }
}
```

请注意，此类设置不保证成功编译，并且可能在构建或运行时破坏你的应用程序。

此版本还在 [基于 Intel 芯片的 Apple 目标的弃用周期](whatsnew2220.md#deprecation-of-x86-64-apple-targets) 中迈出了下一步。

从 Kotlin 2.3.0 开始，`macosX64`、`iosX64`、`tvosX64` 和 `watchosX64` 目标被降级到支持级别 3。
这意味着不保证它们在 CI 上进行测试，并且可能不提供不同编译器版本之间的源和二进制兼容性。我们计划最终在 Kotlin 2.4.0 中移除对 `x86_64` Apple 目标的支持。

有关更多信息，请参见 [Kotlin/Native 目标支持](native-target-support.md)。

## Kotlin/Wasm

Kotlin 2.3.0 默认启用了 Kotlin/Wasm 目标的完全限定名、`wasmWasi` 目标的新异常处理提案，并引入了拉丁-1 字符的紧凑存储。

### 默认启用完全限定名

在 Kotlin/Wasm 目标上，完全限定名（FQN）在运行时默认未启用。
你必须手动启用对 `KClass.qualifiedName` 属性的支持才能使用 FQN。

只能访问类名（不带包名），这给从 JVM 移植到 Wasm 目标的代码或在运行时需要完全限定名的库带来了问题。

在 Kotlin 2.3.0 中，`KClass.qualifiedName` 属性在 Kotlin/Wasm 目标上默认启用。
这意味着 FQN 在运行时无需任何额外配置即可使用。

默认启用 FQN 提高了代码的可移植性，并通过显示完全限定名使运行时错误更具信息性。

由于编译器优化通过使用拉丁-1 字符串字面量的紧凑存储来减少元数据，此更改不会增加编译后的 Wasm 二进制文件的大小。

### 拉丁-1 字符的紧凑存储

以前，Kotlin/Wasm 原样存储字符串字面量数据，这意味着每个字符都以 UTF-16 编码。这对于只包含或主要包含拉丁-1 字符的文本来说并非最佳。

从 Kotlin 2.3.0 开始，Kotlin/Wasm 编译器将仅包含拉丁-1 字符的字符串字面量以 UTF-8 格式存储。

此优化显著减少了元数据，正如 JetBrains [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app) 上的实验所表明的。它带来了：

*   与未优化的构建相比，Wasm 二进制文件减小多达 13%。
*   即使在启用完全限定名的情况下，Wasm 二进制文件也比不存储它们的早期版本小多达 8%。

这种紧凑存储对于下载和启动时间很重要的 Web 环境非常重要。
此外，此优化消除了以前阻止存储 [类的完全限定名和默认启用 `KClass.qualifiedName` 的大小障碍](#fully-qualified-names-enabled-by-default)。

此更改默认启用，无需进一步操作。

### 默认对 `wasmWasi` 启用新的异常处理提案

以前，Kotlin/Wasm 对所有目标（包括 [`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi)）都使用 [旧版异常处理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)。然而，大多数独立的 WebAssembly 虚拟机（VM）都与 [新版异常处理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) 对齐。

从 Kotlin 2.3.0 开始，新的 WebAssembly 异常处理提案默认对 `wasmWasi` 目标启用，确保与现代 WebAssembly 运行时更好的兼容性。

对于 `wasmWasi` 目标，此更改可以安全地提前引入，因为面向它的应用程序通常在多样性较低的运行时环境（通常在单个特定 VM 上运行）中运行，这通常由用户控制，从而降低了兼容性问题的风险。

新的异常处理提案默认对 [`wasmJs` 目标](wasm-overview.md#kotlin-wasm-and-compose-multiplatform) 保持关闭。
你可以通过使用 `-Xwasm-use-new-exception-proposal` 编译器选项手动启用它。

## Kotlin/JS

Kotlin 2.3.0 带来了实验性支持，用于将挂起函数导出到 JavaScript，并使用 `BigInt64Array` 类型来表示 Kotlin 的 `LongArray` 类型。

在此版本中，你现在可以统一访问接口内的伴生对象，在带有伴生对象的接口中使用 `@JsStatic` 注解，在单个函数和类中使用 `@JsQualifier` 注解，并通过新的注解 `@JsExport.Default` 进行默认导出。

### 使用 `JsExport` 导出新的挂起函数
<primary-label ref="experimental-opt-in"/>

以前，`@JsExport` 注解不允许将挂起函数（或包含此类函数的类和接口）导出到 JavaScript。你必须手动包装每个挂起函数，这既繁琐又容易出错。

从 Kotlin 2.3.0 开始，可以使用 `@JsExport` 注解直接将挂起函数导出到 JavaScript。

启用挂起函数导出减少了样板代码，并改善了 Kotlin/JS 与 JavaScript/TypeScript (JS/TS) 之间的互操作性。Kotlin 的异步函数现在可以直接从 JS/TS 调用，无需额外的代码。

要启用此特性，请将以下编译器选项添加到你的 `build.gradle.kts` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xenable-suspend-function-exporting")
    }
}
```

启用后，使用 `@JsExport` 注解标记的类和函数可以包含挂起函数，而无需额外的包装。

它们可以作为常规的 JavaScript 异步函数使用，也可以作为异步函数被覆盖：

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

此特性是 [实验性的](components-stability.md#stability-levels-explained)。我们非常感谢你在我们的 issue 跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions) 中提供反馈。

### 使用 `BigInt64Array` 类型表示 Kotlin 的 `LongArray` 类型
<primary-label ref="experimental-opt-in"/>

以前，Kotlin/JS 将其 `LongArray` 表示为 JavaScript 的 `Array<bigint>`。这种方法可行，但对于与期望类型化数组的 JavaScript API 进行互操作性而言并不理想。

从本版本开始，Kotlin/JS 现在在编译到 JavaScript 时，使用 JavaScript 内置的 `BigInt64Array` 类型来表示 Kotlin 的 `LongArray` 值。

使用 `BigInt64Array` 简化了与使用类型化数组的 JavaScript API 的互操作。
它还允许接受或返回 `LongArray` 的 API 更自然地从 Kotlin 导出到 JavaScript。

要启用此特性，请将以下编译器选项添加到你的 `build.gradle.kts` 文件中：

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此特性是 [实验性的](components-stability.md#stability-levels-explained)。我们非常感谢你在我们的 issue 跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray) 中提供反馈。

### 跨 JS 模块系统统一伴生对象访问

以前，当你使用 `@JsExport` 注解将带有伴生对象的 Kotlin 接口导出到 JavaScript/TypeScript 时，在 TypeScript 中使用该接口对于 ES 模块与其他模块系统的工作方式有所不同。

因此，你必须根据模块系统调整 TypeScript 侧的输出使用方式。

请看以下 Kotlin 代码：

```kotlin
@JsExport
interface Foo {
    companion object {
        fun bar() = "OK"
    }
}
```

你必须根据模块系统以不同方式调用它：

```kotlin
// 适用于 CommonJS、AMD、UMD 和无模块
Foo.bar()

// 适用于 ES 模块
Foo.getInstance().bar() 
```

在此版本中，Kotlin 统一了所有 JavaScript 模块系统中的伴生对象导出。

现在，对于每个模块系统（ES 模块、CommonJS、AMD、UMD、无模块），接口内的伴生对象始终以相同的方式访问（就像类中的伴生对象一样）：

```kotlin
// 适用于所有模块系统
Foo.Companion.bar()
```

此改进还修复了集合互操作性。以前，集合工厂函数必须根据模块系统以不同方式访问：

```kotlin
// 适用于 CommonJS、AMD、UMD 和无模块
KtList.fromJsArray([1, 2, 3])

// 适用于 ES 模块
KtList.getInstance().fromJsArray([1, 2, 3])
```

现在，访问集合工厂函数在所有模块系统中都是类似的：

```kotlin
// 适用于所有模块系统
KtList.fromJsArray([1, 2, 3])
```

此更改减少了模块系统之间的不一致行为，并避免了错误和互操作性问题。

此特性默认启用。

### 支持带有伴生对象的接口中的 `@JsStatic` 注解

以前，`@JsStatic` 注解不允许用于带有伴生对象的导出接口内部。

例如，以下代码会产生错误，因为只有类伴生对象的成员才能用 `@JsStatic` 注解：

```kotlin
@JsExport
interface Foo {
    companion object {
        @JsStatic // 错误
        fun bar() = "OK"
    }
}
```

在这种情况下，你必须删除 `@JsStatic` 注解并以下列方式从 JavaScript (JS) 访问伴生对象：

```kotlin
// 适用于所有模块系统
Foo.Companion.bar()
```

现在，`@JsStatic` 注解在带有伴生对象的接口中受支持。
你可以在此类伴生对象上使用此注解，并直接从 JS 调用该函数，就像对类一样：

```kotlin
// 适用于所有模块系统
Foo.bar()
```

此更改简化了 JS 中的 API 使用，允许在接口上使用静态工厂方法，并消除了类和接口之间的不一致。

此特性默认启用。

### 允许在单个函数和类中使用 `@JsQualifier` 注解

以前，你只能在文件级别应用 `@JsQualifier` 注解，要求所有外部 JavaScript (JS) 声明都放置在单独的文件中。

从 Kotlin 2.3.0 开始，你可以直接将 `@JsQualifier` 注解应用到单个函数和类，就像 `@JsModule` 和 `@JsNonModule` 注解一样。

例如，你现在可以在同一文件中与常规 Kotlin 声明一起编写以下外部函数代码：

```kotlin
@JsQualifier("jsPackage")
private external fun jsFun()
```

此更改简化了 Kotlin/JS 互操作，使你的项目结构更清晰，并使 Kotlin/JS 与其他平台处理外部声明的方式保持一致。

此特性默认启用。

### 支持 JavaScript 默认导出

以前，Kotlin/JS 无法从 Kotlin 代码生成 JavaScript 的默认导出。相反，Kotlin/JS 只生成命名导出，例如：

```javascript
export { SomeDeclaration };
```

如果你需要默认导出，你必须在编译器内部使用变通方法，例如放置 `@JsName` 注解，并将 `default` 和一个空格作为实参：

```kotlin
@JsExport
@JsName("default ")
class SomeDeclaration
```

Kotlin/JS 现在通过新的注解直接支持默认导出：

```kotlin
@JsExport.Default
```

当你将此注解应用到 Kotlin 声明（类、对象、函数或属性）时，生成的 JavaScript 会自动为 ES 模块包含一个 `export default` 语句：

```javascript
export default HelloWorker;
```

> 对于与 ES 模块不同的模块系统，新的 `@JsExport.Default` 注解的工作方式与常规的 `@JsExport` 注解类似。
>
{style="note"}

此更改使 Kotlin 代码能够符合 JavaScript 约定，对于 Cloudflare Workers 等平台或 `React.lazy` 等框架尤其重要。

此特性默认启用。你只需使用 `@JsExport.Default` 注解。

## Gradle

Kotlin 2.3.0 完全兼容 Gradle 7.6.3 到 9.0.0。你也可以使用直到最新 Gradle 版本的 Gradle 版本。但是，请注意，这样做可能会导致弃用警告，并且某些新的 Gradle 特性可能无法正常工作。

此外，最低支持的 Android Gradle 插件版本现在是 8.2.2，最高支持版本是 8.13.0。

Kotlin 2.3.0 还引入了一个用于在你的 Gradle 项目中注册生成源代码的新 API。

### 用于在 Gradle 项目中注册生成源代码的新 API
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 在 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) 接口中引入了一个新的 [实验性](components-stability.md#stability-levels-explained) API，你可以使用它在你的 Gradle 项目中注册生成源代码。

这个新的 API 是一个生活质量改进，有助于 IDE 区分生成代码和常规源文件。
该 API 允许 IDE 在 UI 中以不同方式突出显示生成代码，并在导入项目时触发生成任务。我们目前正在 IntelliJ IDEA 中添加此支持。该 API 对于生成代码的第三方插件或工具（例如 [KSP](ksp-overview.md) (Kotlin Symbol Processing)）也特别有用。

有关更多信息，请参见 [注册生成源代码](gradle-configure-project.md#register-generated-sources)。

## 标准库

Kotlin 2.3.0 稳定了新的时间追踪功能，[`kotlin.time.Clock` 和 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)，并对实验性的 UUID API 增加了一些改进。

### 改进的 UUID 生成与解析
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0 引入了对 UUID API 的几项改进，包括：

*   [支持在解析无效 UUID 时返回 `null`](#support-for-returning-null-when-parsing-invalid-uuids)
*   [用于生成 v4 和 v7 UUID 的新函数](#new-functions-to-generate-v4-and-v7-uuids)
*   [支持为特定时间戳生成 v7 UUID](#support-for-generating-v7-uuids-for-specific-timestamps)

标准库中的 UUID 支持是 [实验性的](components-stability.md#stability-levels-explained)，但 [计划在未来稳定](https://youtrack.jetbrains.com/issue/KT-81395)。
要选择启用，请使用 `@OptIn(ExperimentalUuidApi::class)` 注解或将以下编译器选项添加到你的构建文件中：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=kotlin.uuid.ExperimentalUuidApi")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-opt-in=kotlin.uuid.ExperimentalUuidApi</arg>
                </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-81395) 或 [相关 Slack 频道](https://slack-chats.kotlinlang.org/c/uuid) 中提供反馈。

#### 支持在解析无效 UUID 时返回 `null`

Kotlin 2.3.0 引入了新函数，用于从字符串创建 `Uuid` 实例，如果字符串不是有效的 UUID，这些函数将返回 `null` 而不是抛出异常。

这些函数包括：

*   `Uuid.parseOrNull()` – 解析十六进制带连字符或纯十六进制格式的 UUID。
*   `Uuid.parseHexDashOrNull()` – 仅解析十六进制带连字符格式的 UUID，否则返回 `null`。
*   `Uuid.parseHexOrNull()` – 仅解析纯十六进制格式的 UUID，否则返回 `null`。

以下是一个示例：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    val valid = Uuid.parseOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(valid)
    // 550e8400-e29b-41d4-a716-446655440000

    val invalid = Uuid.parseOrNull("not-a-uuid")
    println(invalid)
    // null

    val hexDashValid = Uuid.parseHexDashOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(hexDashValid)
    // 550e8400-e29b-41d4-a716-446655440000

    val hexDashInvalid = Uuid.parseHexDashOrNull("550e8400e29b41d4a716446655440000")
    println(hexDashInvalid)
    // null
}
```
{kotlin-runnable="true"}

#### 用于生成 v4 和 v7 UUID 的新函数

Kotlin 2.3.0 引入了两个用于生成 UUID 的新函数：`Uuid.generateV4()` 和 `Uuid.generateV7()`。

使用 `Uuid.generateV4()` 函数生成版本 4 UUID，或使用 `Uuid.generateV7()` 函数生成版本 7 UUID。

> `Uuid.random()` 函数保持不变，仍然生成版本 4 UUID，就像 `Uuid.generateV4()` 一样。
>
{style="note"}

以下是一个示例：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // 生成 v4 UUID
    val v4 = Uuid.generateV4()
    println(v4)

    // 生成 v7 UUID
    val v7 = Uuid.generateV7()
    println(v7)

    // 生成 v4 UUID
    val random = Uuid.random()
    println(random)
}
```
{kotlin-runnable="true"}

#### 支持为特定时间戳生成 v7 UUID

Kotlin 2.3.0 引入了新的 `Uuid.generateV7NonMonotonicAt()` 函数，你可以使用它为特定的时间点生成版本 7 UUID。

> 与 `Uuid.generateV7()` 不同，`Uuid.generateV7NonMonotonicAt()` 不保证单调排序，因此为相同时间戳创建的多个 UUID 可能不是顺序的。
>
{style="note"}

当你需要与已知时间戳绑定的标识符时，请使用此函数，例如在重新创建事件 ID 或生成反映事物最初发生时间的数据库条目时。

例如，要为特定瞬间创建版本 7 UUID，请使用以下代码：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid
import kotlin.time.ExperimentalTime
import kotlin.time.Instant

@OptIn(ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    val timestamp = Instant.fromEpochMilliseconds(1577836800000) // 2020-01-01T00:00:00Z

    // 为指定时间戳生成 v7 UUID（不保证单调性）
    val v7AtTimestamp = Uuid.generateV7NonMonotonicAt(timestamp)
    println(v7AtTimestamp)
}
```
{kotlin-runnable="true"}

## Compose 编译器: 精简 Android 应用程序的堆栈跟踪

从 Kotlin 2.3.0 开始，当应用程序由 R8 精简时，编译器会为 Compose 堆栈跟踪输出 ProGuard 映射。
这扩展了以前仅在可调试变体中可用的实验性堆栈跟踪特性。

堆栈跟踪的发布变体包含可用于在精简应用程序中识别可组合函数的组键，而无需在运行时记录源信息的开销。组键堆栈跟踪要求你的应用程序使用 Compose 运行时 1.10 或更高版本构建。

要启用组键堆栈跟踪，请在初始化任何 `@Composable` 内容之前添加以下行：

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

启用这些堆栈跟踪后，即使应用程序被精简，Compose 运行时也会在组合、测量或绘制过程中捕获崩溃后附加自己的堆栈跟踪：

```text
java.lang.IllegalStateException: <message>
        at <original trace>
    Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
        at $compose.m$123(SourceFile:1)
        at $compose.m$234(SourceFile:1)
        ...
```

Jetpack Compose 1.10 在此模式下生成的堆栈跟踪仅包含仍需反混淆的组键。
这在 Kotlin 2.3.0 版本中得到了解决，Compose 编译器 Gradle 插件现在将组键条目附加到 R8 生成的 ProGuard 映射文件中。如果你在编译器未能为某些函数创建映射时看到新警告，请向 [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 报告。

> Compose 编译器 Gradle 插件仅在由于依赖 R8 映射文件而为构建启用 R8 时，才为组键堆栈跟踪创建反混淆映射。
>
{style="note"}

默认情况下，无论你是否启用跟踪，映射文件 Gradle 任务都会运行。如果它们在你的构建中造成问题，你可以完全禁用此特性。在你的 Gradle 配置的 `composeCompiler {}` 代码块中添加以下属性：

```kotlin
composeCompiler {
    includeComposeMappingFile.set(false)
}
```

> Android Gradle 插件提供的项目文件的堆栈跟踪中不显示某些代码存在已知问题：[KT-83099](https://youtrack.jetbrains.com/issue/KT-83099)。
>
{style="warning"}

请向 [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 报告遇到的任何问题。

## 破坏性更改和弃用

本节重点介绍重要的破坏性更改和弃用。
有关完整概述，请参见我们的 [兼容性指南](compatibility-guide-23.md)。

*   从 Kotlin 2.3.0 开始，编译器 [不再支持 `-language-version=1.8`](compatibility-guide-23.md#drop-support-in-language-version-for-1-8-and-1-9)。
    在非 JVM 平台上也不支持 `-language-version=1.9`。
*   早于 2.0 的语言特性集（JVM 平台 1.9 除外）不受支持，但语言本身仍与 Kotlin 1.0 完全向后兼容。

    如果你的 Gradle 项目同时使用 `kotlin-dsl` **和** `kotlin("jvm")` 插件，你可能会看到关于不支持的 Kotlin 插件版本的 Gradle 警告。关于迁移步骤的指导，请参见我们的 [兼容性指南](compatibility-guide-23.md#unsupported-kgp-version-warning-when-using-kotlin-dsl-and-kotlin-jvm-plugins)。

*   在 Kotlin Multiplatform 中，对 Android 目标的支持现在通过 Google 的 [`com.android.kotlin.multiplatform.library` 插件](https://developer.android.com/kotlin/multiplatform/plugin) 提供。
    将带有 Android 目标的项目迁移到新插件，并将 `androidTarget` 代码块重命名为 `android`。

*   如果你继续将 Kotlin Multiplatform Gradle 插件用于 Android 目标，并且使用 Android Gradle 插件 (AGP) 9.0.0 或更高版本，则在使用 `androidTarget` 代码块时会看到配置错误，并附带提供迁移指导的诊断消息。有关更多信息，请参见 [迁移到 Google 的 Android 目标插件](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#migrate-to-google-s-plugin-for-android-targets)。

*   AGP 9.0.0 包含了 [对 Kotlin 的内置支持](https://developer.android.com/build/releases/agp-preview#android-gradle-plugin-built-in-kotlin)。
    从 Kotlin 2.3.0 开始，如果将此版本的 AGP 与 `kotlin-android` 插件一起使用，你将 [看到配置错误](compatibility-guide-23.md#deprecate-kotlin-android-plugin-for-agp-versions-9-0-0-and-later)，因为该插件不再必要。新的诊断消息可帮助你进行迁移。
    如果你使用旧版 AGP，你将看到弃用警告。

*   不再支持 Ant 构建系统。

## 文档更新

Kotlin Multiplatform 文档已迁移至 kotlinlang.org。现在你可以在一个地方切换 Kotlin 和 KMP 文档。
我们还更新了语言指南的目录，并引入了新的导航。

自上一个 Kotlin 版本以来的其他显著变化：

*   [KMP 概览](https://kotlinlang.org/docs/multiplatform/kmp-overview.html) – 在一个页面上探索 Kotlin Multiplatform 生态系统。
*   [Kotlin Multiplatform 快速入门](https://kotlinlang.org/docs/multiplatform/quickstart.html) – 了解如何使用 KMP IDE 插件设置环境。
*   [Compose Multiplatform 1.9.3 中的新特性](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html) – 了解最新版本的亮点。
*   [Kotlin/JS 入门](js-get-started.md) – 使用 Kotlin/JavaScript 为浏览器创建 Web 应用程序。
*   [类](classes.md) – 了解在 Kotlin 中使用类的基础知识和最佳实践。
*   [扩展](extensions.md) – 了解如何在 Kotlin 中扩展类和接口。
*   [协程基础](coroutines-basics.md) – 探索关键的协程概念并学习如何创建你的第一个协程。
*   [取消和超时](cancellation-and-timeouts.md) – 了解协程取消的工作原理以及如何使协程响应取消。
*   [Kotlin/Native 库](native-libraries.md) – 了解如何生成 `klib` 库构件。
*   [Kotlin Notebook 概览](kotlin-notebook-overview.md) – 使用 Kotlin Notebook 插件创建交互式笔记本文档。
*   [将 Kotlin 添加到 Java 项目](mixing-java-kotlin-intellij.md) – 配置 Java 项目以同时使用 Kotlin 和 Java。
*   [使用 Kotlin 测试 Java 代码](jvm-test-using-junit.md) – 使用 JUnit 测试混合 Java-Kotlin 项目。
*   [新的案例研究页面](https://kotlinlang.org/case-studies/) – 了解不同公司如何应用 Kotlin。

## 如何更新到 Kotlin 2.3.0

Kotlin 插件作为捆绑插件分发在 IntelliJ IDEA 和 Android Studio 中。

要更新到新的 Kotlin 版本，请在构建脚本中将 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version) 为 2.3.0。