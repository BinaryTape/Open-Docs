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

* **语言：** [稳定的上下文参数以及注解使用处目标的多个功能](#stable-features-context-parameters-and-features-for-annotation-use-site-targets)
* **标准库：** [用于在 JVM 上将无符号整数转换为 `BigInteger` 的新 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm) 以及 [对检查排序顺序的支持](#support-for-checking-sorted-order)
* **Kotlin/JVM：** [支持 Java 26](#support-for-java-26) 以及 [默认启用元数据中的注解](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native：** [支持将 Swift 软件包作为依赖项](#swift-package-import)
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
* [注解使用处目标的功能](whatsnew22.md#preview-of-features-for-annotation-use-site-targets)
* [用于在 JVM 上将无符号整数转换为 `BigInteger` 的新 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [对检查排序顺序的支持](#support-for-checking-sorted-order)

## 新功能 {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [上下文参数的显式上下文实参](#explicit-context-arguments-for-context-parameters)
* [Swift 软件包导入](#swift-package-import)

## 语言

Kotlin %kotlinEapVersion% 将上下文参数和注解使用处目标功能提升为[稳定](components-stability.md#stability-levels-explained)阶段。此版本还引入了[上下文参数的显式上下文实参](#explicit-context-arguments-for-context-parameters)。

### 稳定功能：上下文参数和注解使用处目标的功能
<secondary-label ref="language"/>

Kotlin 2.2.0 引入了一些作为[实验性](components-stability.md#stability-levels-explained)的语言功能。我们很高兴地宣布，以下语言功能在此版本中现已[稳定](components-stability.md#stability-levels-explained)：

* [上下文参数](whatsnew22.md#preview-of-context-parameters)，除了[上下文实参](#explicit-context-arguments-for-context-parameters)和[可调用引用](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)
* [注解使用处目标的功能](whatsnew22.md#preview-of-features-for-annotation-use-site-targets)

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

## 标准库

Kotlin %kotlinEapVersion% 在 JVM 上添加了用于将无符号整数转换为 `BigInteger` 的新扩展函数。它还添加了对检查可迭代对象、数组和序列中排序顺序的支持。

### 用于在 JVM 上将无符号整数转换为 `BigInteger` 的新 API
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% 在 JVM 上引入了 `UInt.toBigInteger()` 和 `ULong.toBigInteger()` 扩展函数。

此前，将 `UInt` 和 `ULong` 值转换为 `BigInteger` 需要基于字符串的变通方法或自定义转换逻辑。
从 Kotlin %kotlinEapVersion% 开始，您现在可以使用 `.toBigInteger()` 直接将无符号整数值转换为 `BigInteger`。

示例如下：

```kotlin
fun main() {
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
}
```

我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-73111) 中提供反馈。

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

我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78499) 中提供反馈。

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

Kotlin %kotlinEapVersion% 带来了对 Swift 软件包导入的支持。

### Swift 软件包导入
<secondary-label ref="native"/>

<primary-label ref="experimental-general"/>

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

## Kotlin 编译器

Kotlin %kotlinEapVersion% 在 `.klib` 编译期间为在同一模块中声明的内联函数提供了更加一致的行为。

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