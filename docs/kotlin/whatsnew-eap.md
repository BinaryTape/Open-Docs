[//]: # (title: Kotlin %kotlinEapVersion% 最新变化)

<primary-label ref="eap"/>

<show-structure depth="1"/>

<web-summary>阅读 Kotlin 抢先体验预览发布说明，并在最新的实验性 Kotlin 功能正式发布之前进行试用。</web-summary>

_[发布日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文档并未涵盖抢先体验计划 (EAP) 版本的所有功能，
> 但它重点介绍了其中的一些重大改进。
>
> 欲查看完整的更改列表，请参阅 [GitHub 变更日志](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已发布！以下是此 EAP 版本的一些详细信息：

* **语言：** [稳定的上下文参数、显式支持字段以及注解使用处目标的多个功能](#stable-features)
* **标准库：** [稳定的 UUID](#stable-uuids-in-the-common-kotlin-standard-library) 以及 [对检查排序顺序的支持](#support-for-checking-sorted-order)
* **Kotlin/JVM：** [支持 Java 26](#support-for-java-26) 以及 [默认启用元数据中的注解](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native：** [支持将 Swift 软件包作为依赖项、Swift 导出的更新以及默认的 CMS GC](#kotlin-native)
* **Kotlin/Wasm：** [默认启用增量编译以及对 WebAssembly 组件模型的支持](#kotlin-wasm)
* **Kotlin/JS：** [支持 value class 导出以及 JS 代码内联中的 ES2015 功能](#kotlin-js)
* **Gradle：** [兼容 Gradle 9.4.1](#gradle)
* **Maven：** [Java 与 JVM 目标版本之间的自动对齐](#maven)
* **Kotlin 编译器：** [在 `.klib` 编译期间更加一致的内联函数行为](#consistent-intra-module-function-inlining-during-klib-compilation)

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## 更新到 Kotlin %kotlinEapVersion%

最新版本的 Kotlin 已包含在最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 中。

要更新到新的 Kotlin 版本，请确保您的 IDE 已更新至最新版本，并在您的构建脚本中将 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)为 %kotlinEapVersion%。

## 新功能 {id=new-stable-features}
<primary-label ref="stable"/>

在之前的 Kotlin 版本中，有几项新功能作为实验性功能引入。
以下功能现已在 Kotlin %kotlinEapVersion% 中晋升为[稳定](components-stability.md#stability-levels-explained)阶段，因此您不再需要显式启用即可使用它们：

* [上下文参数](whatsnew22.md#preview-of-context-parameters)，除了[上下文实参](#explicit-context-arguments-for-context-parameters)和[可调用引用](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)
* [属性的 `@all` 元目标](whatsnew22.md#all-meta-target-for-properties)
* [注解使用处目标的新默认规则](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [显式支持字段](whatsnew23.md#explicit-backing-fields)
* [公共 Kotlin 标准库中稳定的 UUID](#stable-uuids-in-the-common-kotlin-standard-library)
* [对检查排序顺序的支持](#support-for-checking-sorted-order)
* [用于在 JVM 上将无符号整数转换为 `BigInteger` 的新 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [支持将 value class 导出到 JavaScript/TypeScript](#support-for-value-class-export-to-javascript-typescript)
* [内联 JS 代码时支持 ES2015 功能](#support-for-es2015-features-when-inlining-js-code)
* [Maven：Java 与 JVM 目标版本之间的自动对齐](#automatic-alignment-between-java-and-jvm-target-versions)

## 新功能 {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [上下文参数的显式上下文实参](#explicit-context-arguments-for-context-parameters)
* [支持集合字面量](#support-for-collection-literals)
* [改进的编译时常量](#improved-compile-time-constants)
* [Swift 软件包导入](#swift-package-import)
* [Swift 导出：支持导出协程流](#swift-export-support-for-exporting-coroutine-flows)
* [支持 WebAssembly 组件模型](#support-for-the-webassembly-component-model)

## 语言

Kotlin %kotlinEapVersion% 将上下文参数、显式支持字段和注解使用处目标功能提升为[稳定](components-stability.md#stability-levels-explained)阶段。
此版本还引入了[上下文参数的显式上下文实参](#explicit-context-arguments-for-context-parameters)。

### 稳定功能
<secondary-label ref="language"/>

Kotlin 2.2.0 引入了一些作为[实验性](components-stability.md#stability-levels-explained)的语言功能。我们很高兴地宣布，以下语言功能在此版本中现已[稳定](components-stability.md#stability-levels-explained)：

* [上下文参数](whatsnew22.md#preview-of-context-parameters)，除了[上下文实参](#explicit-context-arguments-for-context-parameters)和[可调用引用](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)
* [属性的 `@all` 元目标](whatsnew22.md#all-meta-target-for-properties)
* [注解使用处目标的新默认规则](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [显式支持字段](whatsnew23.md#explicit-backing-fields)

[查看 Kotlin 语言设计功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

### 上下文参数的显式上下文实参
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% 为[上下文参数](context-parameters.md)引入了显式上下文实参。

Kotlin 2.3.20 [更改了上下文参数的重载解析](whatsnew2320.md#changes-to-overload-resolution-for-context-parameters)。
因此，仅在上下文参数上存在差异的重载调用可能会产生歧义。

您现在可以通过在调用站点传递显式上下文实参来解决此歧义。

示例如下：

```kotlin
class EmailSender
class SmsSender

context(emailSender: EmailSender)
fun sendNotification() {
    println("Sent email notification")
}

context(smsSender: SmsSender)
fun sendNotification() {
    println("Sent SMS notification")
}

context(defaultEmailSender: EmailSender, defaultSmsSender: SmsSender)
fun notifyUser() {
    
    // 选择带有 EmailSender 上下文参数的重载
    sendNotification(emailSender = defaultEmailSender)

    // 选择带有 SmsSender 上下文参数的重载
    sendNotification(smsSender = defaultSmsSender)
}
```

您还可以使用显式上下文实参代替 `context()` 函数，以减少嵌套并使某些调用更易读。
如果您需要在多次调用中使用相同的上下文实参，请改用 `context()` 函数。

此功能处于[实验性](components-stability.md#stability-levels-explained)阶段。要显式启用它，请在您的构建文件中添加以下编译器选项：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-context-arguments")
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
                    <arg>-Xexplicit-context-arguments</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

欲了解更多信息，请参阅该功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0448-explicit-context-arguments.md)。

### 支持集合字面量
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% 引入了对集合字面量的实验性支持。您现在可以使用方括号 `[]` 以更简洁的方式创建集合。

例如：

```kotlin
fun main() {
    // 带有显式类型声明的可变列表
    // val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")

    // 使用方括号语法的可变列表
    val shapes: MutableList<String> = ["triangle", "square", "circle"]
    println(shapes)
    // [triangle, square, circle]
}
```
{validate="false"}

> 目前，集合字面量无法用于构造在 Java 中定义的集合。有关更多信息，请参阅 [KT-80494](https://youtrack.jetbrains.com/issue/KT-80494)。
>
{style="note"}

如果编译器没有足够的信息来推断集合类型，它将默认为 `List` 类型：

```kotlin
fun main() {
    val fruit = ["apple", "banana", "cherry"]
    
    println(fruit)
    // [apple, banana, cherry]
}
```
{validate="false"}

您还可以声明自定义 `operator fun of` 函数，以便对您自己的类型使用方括号语法。例如，如果您有以下 `DoubleMatrix` 类：

```kotlin
class DoubleMatrix(vararg val rows: Row) {
    companion object {
        operator fun of(vararg rows: Row) = DoubleMatrix(*rows)
    }
    class Row(vararg val elements: Double) {
        companion object {
            operator fun of(vararg elements: Double) = Row(*elements)
        }
    }
}
```
{validate="false"}

您可以像这样创建一个 `identityMatrix` 类实例：

```kotlin
fun main() {
    val identityMatrix: DoubleMatrix = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
    ]
}
```
{validate="false"}

在此示例中，编译器将嵌套的集合字面量转换为对相应 `operator fun of` 函数的调用。编译器递归地解析这些调用，并使用预期类型来选择正确的重载。

此功能处于[实验性](components-stability.md#stability-levels-explained)阶段。要显式启用它，请在您的构建文件中添加以下编译器选项：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcollection-literals")
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
                    <arg>-Xcollection-literals</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

欲了解更多信息，请参阅该功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0416-collection-literals.md)。

### 改进的编译时常量
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% 为[编译时常量](properties.md#compile-time-constants)带来了实验性改进，使对数值和字符串类型的支持更加一致且更易于使用。这些改进包括支持：

* 无符号类型操作。
* 标准库中的字符串函数，如 `.lowercase()`、`.uppercase()` 和 `.trim()` 函数。
* 对[枚举常量](enum-classes.md#working-with-enum-constants)的 `.name` 属性以及 [`KCallable` 接口](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/)的求值。

为了明确哪些函数在编译时求值，Kotlin %kotlinEapVersion% 引入了 `IntrinsicConstEvaluation` 注解。
有些函数已在编译时求值，但尚未添加该注解。后续版本将为剩余函数添加该注解。有关支持的函数列表，请参阅 KEEP [附录](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md#appendix)。

此功能处于[实验性](components-stability.md#stability-levels-explained)阶段。要显式启用它，请在您的构建文件中添加以下编译器选项：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-XXLanguage:+IntrinsicConstEvaluation")
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
                    <arg>-XXLanguage:+IntrinsicConstEvaluation</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

欲了解更多信息，请参阅该功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)。

## 标准库

Kotlin %kotlinEapVersion% 稳定了公共 Kotlin 标准库中对 UUID 的支持。它还在 JVM 上添加了用于将无符号整数转换为 `BigInteger` 的新扩展函数，并增加了对检查排序顺序的支持。

### 公共 Kotlin 标准库中稳定的 UUID
<secondary-label ref="standard-library"/>

Kotlin 2.0.20 引入了一个[用于生成 UUID 的类](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library)（通用唯一标识符），并增加了对在 Kotlin 和 Java UUID 之间进行转换的支持。后续版本逐步改进了这一实验性功能，增加了对以下内容的支持：

* [使用 `<` 和 `>` 运算符比较 UUID](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [从带连字符的十六进制格式和纯文本格式解析 UUID](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [解析无效 UUID 时返回 `null`](whatsnew23.md#support-for-returning-null-when-parsing-invalid-uuids)。

在 Kotlin %kotlinEapVersion% 中，[`kotlin.uuid.Uuid` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/) 晋升为[稳定](components-stability.md#stability-levels-explained)阶段。
唯一的例外是[用于生成 V4 和 V7 UUID 的函数](whatsnew23.md#support-for-generating-v7-uuids-for-specific-timestamps)，它们仍处于[实验性](components-stability.md#stability-levels-explained)阶段且仍需显式启用。

### 对检查排序顺序的支持
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% 添加了新的扩展函数，用于检查可迭代对象、数组和序列中的排序顺序。

这包括以下扩展函数：

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

您可以使用这些扩展函数来检查元素是否已经排序，而无需重新排序或创建自己的帮助程序函数。
如果元素按指定顺序排列，或者元素少于两个，则它们返回 `true`，否则返回 `false`。
这些函数在遇到无序对时会立即停止，这使得它们在处理大型输入时非常高效。

以下是使用 `.isSorted()` 和 `.isSortedBy()` 函数检查排序顺序的示例：

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-check-sorted-order"}

我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78499) 中提供反馈。

### 用于在 JVM 上将无符号整数转换为 `BigInteger` 的新 API
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% 在 JVM 上引入了 `UInt.toBigInteger()` 和 `ULong.toBigInteger()` 扩展函数。

此前，将 `UInt` 和 `ULong` 值转换为 `BigInteger` 需要基于字符串的变通方法或自定义转换逻辑。
从 Kotlin %kotlinEapVersion% 开始，您现在可以使用 `.toBigInteger()` 直接将无符号整数值转换为 `BigInteger`。

示例如下：

```kotlin
fun main() {
    //sampleStart
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
   //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-convert-unsigned-int"}

我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-73111) 中提供反馈。

## Kotlin/JVM

Kotlin %kotlinEapVersion% 支持新的 Java 版本，并默认启用元数据中的注解。

### 支持 Java 26
<secondary-label ref="jvm"/>

从 Kotlin %kotlinEapVersion% 开始，编译器可以生成包含 Java 26 字节码的类。

### 默认启用元数据中的注解
<secondary-label ref="jvm"/>

Kotlin 2.2.0 中的 Kotlin Metadata JVM 库[引入了对读取存储在 Kotlin 元数据中注解的支持](whatsnew22.md#support-for-reading-and-writing-annotations-in-kotlin-metadata)。通过此支持，Kotlin 编译器将注解与 JVM 字节码一起写入元数据中，使它们可以被 Kotlin Metadata JVM 库访问。因此，注解处理器和其他工具可以在元数据级别理解和操作这些注解，而无需使用反射或修改源代码。

在 Kotlin %kotlinEapVersion% 中，此支持默认启用。

## Kotlin/Native

Kotlin %kotlinEapVersion% 带来了对 Swift 软件包导入的支持，通过 Swift 导出改进了互操作性，并在垃圾回收器中默认启用了并发标记。

### Swift 软件包导入
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin Multiplatform 项目现在可以在其 Gradle 配置中为 iOS 应用声明 [Swift 软件包](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)作为依赖项：

```kotlin
// build.gradle.kts
kotlin {

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.11.0"),
            products = listOf(
                product("FirebaseAI"),
                product("FirebaseAnalytics"),
                ...
}
```
{validate="false"}

有关工作示例和更详细的信息，请参阅 [SwiftPM 导入](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-import.html)。

如果您的项目依赖于 CocoaPods 依赖项，您可以将当前设置迁移为使用 Swift 软件包。KMP 工具考虑到了这一用例，并帮助您自动重新配置项目。有关详情，请参阅我们的 [CocoaPods 迁移指南](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html)。

### Swift 导出：支持导出协程流
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin %kotlinEapVersion% 通过 Swift 导出进一步改进了 Kotlin 与 Swift 的互操作性，增加了对将 `kotlinx.coroutines` 流导出到 Swift 的支持。

`kotlinx.coroutines` 中的流（Flow）代表可以并发发送和消费的异步数据流。它们通常用于响应式编程模式，例如监听数据库更新、网络请求或 UI 事件。

此前，将 `Flow` 接口从 [`kotlinx.coroutines.flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/) 暴露给 Swift 的唯一方法是通过第三方解决方案。现在，您可以开箱即用地将流导出到 Swift 的惯用对应物：[`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence)。

该功能默认启用。您可以将任何具有 `Flow` 类型的公共 API 导出到 Swift，同时保留类型信息。
例如：

```kotlin
// Kotlin
// 导出 Flow 时保留 String 类型
fun flowOfStrings(): Flow<String> = flowOf("hello", "any", "world")
```

```Swift
// Swift
var actual: [String] = []
// 能够从 Kotlin 正确推断出 String 类型
for try await element in flowOfStrings().asAsyncSequence() {
    actual.append(element)
}
```

有关 Swift 导出的更多信息，请参阅我们的[文档](native-swift-export.md)。

### 垃圾回收器中默认启用并发标记
<secondary-label ref="native"/>

在 Kotlin 2.0.20 中，Kotlin 团队[引入了对并发标记清除垃圾回收器 (CMS GC) 的实验性支持](whatsnew2020.md#concurrent-marking-in-garbage-collector)。在处理了用户反馈并修复了回归问题后，我们现在准备从 Kotlin %kotlinEapVersion% 开始默认启用 CMS。

垃圾回收器中之前的默认并行标记并发清除 (PMCS) 设置在标记堆中的对象时必须暂停应用程序线程。相比之下，CMS 允许标记阶段与应用程序线程并发运行。

这显著改善了 GC 暂停时长和应用响应能力，这对于对延迟敏感的应用程序性能至关重要。CMS 在使用 [Compose Multiplatform](https://blog.jetbrains.com/kotlin/2024/10/compose-multiplatform-1-7-0-released/#performance-improvements-on-ios) 构建的 UI 应用程序基准测试中已经证明了其有效性。

如果您遇到问题，可以切换回 PMCS。为此，请在您的 `gradle.properties` 文件中设置以下[二进制选项](native-binary-options.md)：

```none
kotlin.native.binary.gc=pmcs
```

有关 Kotlin/Native 垃圾回收器的更多信息，请参阅我们的[文档](native-memory-manager.md#garbage-collector)。

## Kotlin/Wasm

Kotlin %kotlinEapVersion% 默认启用了 Kotlin/Wasm 的增量编译，并引入了对 WebAssembly 组件模型的支持。

### 默认启用增量编译

<secondary-label ref="wasm"/>

Kotlin/Wasm 在 2.1.0 中引入了增量编译。从 Kotlin %kotlinEapVersion% 开始，该功能已进入[稳定](components-stability.md#stability-levels-explained)阶段并默认启用。
通过此功能，编译器仅重新构建受最近更改影响的文件，从而显著缩短了构建时间。

要禁用增量编译，请将以下行添加到项目的 `local.properties` 或 `gradle.properties` 文件中：

```none
# gradle.properties
kotlin.incremental.wasm=false
```

如果您遇到任何问题，请在我们的 [YouTrack](https://kotl.in/issue) 中报告。

### 支持 WebAssembly 组件模型
<primary-label ref="experimental-general"/>

<secondary-label ref="wasm"/>

Kotlin %kotlinEapVersion% 通过引入对 [WebAssembly 组件模型](https://component-model.bytecodealliance.org/)的实验性支持，使 Kotlin/Wasm 更进一步。该提案定义了一种通过标准化接口和类型从 Wasm 模块构建组件的方法。这种方法有助于 Wasm 从底层的二进制指令格式演变为一个用于组合可重用的、与语言无关的组件的系统。它使 Kotlin/Wasm 能够超越浏览器。例如，Kotlin 和 WebAssembly 非常适合函数即服务（FaaS）或无服务器应用。

要试用此功能，请查看[使用 `wasi:http` 构建的简单服务器](https://github.com/Kotlin/sample-wasi-http-kotlin/)。

<img src="kotlin-wasm-wasi-http.gif" alt="支持 WebAssembly 组件模型的 Kotlin/Wasm" width="600"/>

请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-64569/Kotlin-Wasm-Support-Component-Model) 中分享您的反馈。

## Kotlin/JS

Kotlin %kotlinEapVersion% 增加了对将 value class 导出到 JavaScript/TypeScript 的支持，并在内联 JS 代码时支持 ES2015 功能。

### 支持将 value class 导出到 JavaScript/TypeScript
<secondary-label ref="js"/>

此前，只有常规的 Kotlin 类可以导出到 JavaScript/TypeScript。
Kotlin %kotlinEapVersion% 解除了这一限制。您现在可以将 Kotlin 的[内联 value class](inline-classes.md) 导出为常规的 TypeScript 类。

To export a value class, mark it with the `@JsExport` annotation on the Kotlin side:

```Kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

在 TypeScript 端，它看起来像一个常规类：

```TypeScript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com"))); 
// "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email"))); 
// "Invalid email"
```

有关更多信息，请参阅 [`@JsExport` 注解](js-to-kotlin-interop.md#jsexport-annotation)。

### 内联 JS 代码时支持 ES2015 功能
<secondary-label ref="js"/>

从 Kotlin %kotlinEapVersion% 开始，JavaScript 代码内联已全面支持 [ES2015 功能](js-project-setup.md#support-for-es2015-features)。

这对于与第三方库的互操作以及直接控制自动应用程序代码生成非常有用。

您现在可以在 [`js()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/js.html) 调用中使用现代 JS 功能，包括：

* Lambda（[箭头函数](whatsnew21.md#support-for-generating-es2015-arrow-functions)）
* ES 类
* 模板字符串
* 扩展运算符
* `const` 和 `let` 变量声明
* 生成器（Generators）

请记住，`js()` 函数的参数应为字符串常量，因为它在编译时被解析并“原样”转换为 JavaScript 代码。
例如，对于扩展运算符，请使用：

```kotlin
fun spreadExample(): dynamic = js("""
    const add = (a, b, c) => a + b + c;

    const nums = [1, 2, 3];
    const sum = add(...nums);

    const a = [1, 2, 3];
    const b = [...a, 4, 5, 6];

    return { sum, b: b };
""")
```

有关内联 JavaScript 代码的更多信息，请参阅我们的[文档](js-interop.md#inline-javascript)。

## Gradle

Kotlin %kotlinEapVersion% 与 Gradle 7.6.3 至 9.4.1 完全兼容。您也可以使用截至最新版本的 Gradle。但请注意，这样做可能会导致弃用警告，且某些新的 Gradle 功能可能无法正常工作。

## Maven

Kotlin %kotlinEapVersion% 通过 Java 与 JVM 目标版本之间的自动对齐，使项目配置变得更加简单。

### Java 与 JVM 目标版本之间的自动对齐
<secondary-label ref="maven"/>

为了简化项目配置并防止兼容性问题，Kotlin Maven 插件现在会自动将 JVM 目标版本与项目中配置的 Java 编译器版本对齐。

这确保了 Kotlin 和 Maven 编译器针对相同的字节码版本，从而避免 Kotlin 生成的字节码与项目其余部分或预期的部署环境不兼容的问题。

启用 `<extensions>` 选项后，您不再需要 `kotlin.compiler.jvmTarget` 属性。如果尚未定义，Kotlin Maven 插件将按以下顺序自动解析 JVM 目标版本：

1. 作为定义的 `maven.compiler.release` 版本（无论是在项目属性中定义还是在 `maven-compiler-plugin` 配置中定义）。

    在这种情况下，Kotlin 编译器会同时设置 `jvmTarget` 和 `jdkRelease` 编译器选项，从而将 API 限制在特定的 JDK 版本。

2. 如果未设置 Maven release 版本，则作为 `maven.compiler.target` 版本。编译器目标版本可以在项目属性中定义，也可以在 `maven-compiler-plugin` 配置中定义。

    在这种情况下，仅设置 Kotlin 的 `jvmTarget`，且 API 不受特定 JDK 版本的限制。

这大大简化了您的 Kotlin 项目配置，因此您的 `pom.xml` 文件可以如下所示：

```xml
<properties>
    <maven.compiler.release>17</maven.compiler.release>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
    </plugins>
</build>
```

在构建期间，插件会输出类似的消息：

```none
[INFO] Using jvmTarget=17 (derived from maven.compiler.release=17)
```

> `<extensions>` 选项仅检查项目级属性和全局 `maven-compiler-plugin` 配置。
> 它不会检查插件 `<executions>` 部分中定义的配置。
>
{style="note"}

有关自动项目配置的更多信息，请参阅我们的[文档](maven-configure-project.md#automatic-configuration)。

## Kotlin 编译器

Kotlin %kotlinEapVersion% 为 `.klib` 编译期间在同一模块中声明的内联函数提供了更加一致的行为。

### klib 编译期间一致的模块内函数内联
<secondary-label ref="compiler"/>

此前，[函数内联](inline-functions.md)在不同的 Kotlin 平台上的行为不一致。JetBrains 团队正致力于在所有支持的平台上统一该行为，以确保相同的兼容性保证。

在 Kotlin/JVM 上，函数内联发生在编译时。因此，当使用 Kotlin/JVM 编译器编译 Kotlin 源代码时，生成的类文件在字节码中没有内联函数调用，因为内联函数的主体已内联到其调用站点，所以其行为在编译期间是固定的。

相反，在 Kotlin/Native、Kotlin/JS 和 Kotlin/Wasm 上，函数内联并非发生在源代码到 klib 的编译期间，而是在二进制生成期间发生。因此，内联函数的行为在 `.klib` 编译期间并未固定，且 `.klib` 库无法为内联函数提供与 Kotlin/JVM 相同的兼容性保证。

Kotlin %kotlinEapVersion% 通过在生成 `.klib` 构件时启用模块内内联，迈出了统一内联函数行为的第一步：

```kotlin
// 现有的 logging.klib 库
inline fun logDebug(message: String) {
    println("[DEBUG] $message")
}
```

```kotlin
// 当前编译的 App 模块
inline fun greetUser(name: String) {
    println("Hello, $name!")
}

fun main() {
    logDebug("App started") // 未内联：在另一个模块中声明
    greetUser("Alice")      // 已内联：在同一个模块中声明
}
```

当编译为 `.klib` 时，代码看起来类似于：

```kotlin
// 伪代码
fun main() {
    logDebug("App started")  // 未内联，在另一个模块中声明
    val tmp0 = "Alice"
    println("Hello, $tmp0!") // 从 greetUser() 内联
}
```

这意味着在 `.klib` 编译期间，只有在同一个模块中声明的内联函数才会被内联。在这种情况下，其他函数将在生成特定平台的二进制文件期间内联。

#### 如何启用

从 %kotlinEapVersion% 开始，对于 Kotlin/Native、Kotlin/JS 和 Kotlin/Wasm，默认启用模块内内联。

如果您遇到此功能的意外问题，可以在命令行中使用以下编译器选项将其禁用：

```bash
-Xklib-ir-inliner=disabled
```

下一步是启用跨模块内联，以确保项目中的所有内联函数都得到一致的内联。这一更改计划在未来的 Kotlin 版本中推出，但您已经可以在命令行中使用以下编译器选项进行试用：

```bash
-Xklib-ir-inliner=full
```

请在 [YouTrack](https://kotl.in/issue) 中分享您的反馈并报告任何问题。