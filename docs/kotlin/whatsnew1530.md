[//]: # (title: Kotlin 1.5.30 的最新变化)

<web-summary>阅读 Kotlin 1.5.30 发布说明，涵盖新的语言功能、Kotlin 多平台、JVM、Native、JS 的更新，以及对 Gradle 和 Maven 构建工具的支持。</web-summary>

_[发布日期：2021 年 8 月 24 日](releases.md#release-history)_

Kotlin 1.5.30 提供了语言更新，包括未来变化的预览、平台支持和工具方面的各种改进，以及新的标准库函数。

以下是一些主要的改进：
* 语言功能，包括实验性的密封 `when` 语句、选择加入要求使用的更改等
* 对 Apple 芯片的原生支持
* Kotlin/JS IR 后端达到 Beta 阶段
* 改进的 Gradle 插件体验

您还可以在 [发布博客文章](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/) 和此视频中找到这些变化的简短概述：

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布过程](releases.md)。
>
{style="tip"}

## 语言功能

Kotlin 1.5.30 提供了未来语言变化的预览，并对选择加入要求机制和类型推断进行了改进：
* [针对密封和布尔主体的详尽 when 语句](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [将挂起函数作为基类型](#suspending-functions-as-supertypes)
* [对实验性 API 的隐式使用要求选择加入](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [对具有不同目标的选择加入要求注解使用的更改](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [递归泛型类型的类型推断改进](#improvements-to-type-inference-for-recursive-generic-types)
* [消除构建器推断限制](#eliminating-builder-inference-restrictions)

### 针对密封和布尔主体的详尽 when 语句

> 对密封（详尽）when 语句的支持是 [实验性的](components-stability.md)。它可能随时被放弃或更改。
> 需要选择加入（见下文详情），并且您应该仅出于评估目的使用它。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) 上提供反馈。
>
{style="warning"}

一个 _详尽的_ [`when`](control-flow.md#when-expressions-and-statements) 语句包含其主体的所有可能类型或值的分支，或者包含某些类型并包括一个 `else` 分支来涵盖任何剩余情况。

我们计划很快禁止非详尽的 `when` 语句，以使行为与 `when` 表达式保持一致。为了确保顺利迁移，您可以配置编译器，使其针对使用密封类或布尔值的非详尽 `when` 语句报告警告。此类警告将在 Kotlin 1.6 中默认出现，并将在以后变为错误。

> 枚举已经会收到警告。
>
{style="note"}

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON -> println("ON")
    }
// 警告：密封类/接口上的非详尽 'when' 语句 
// 将在 1.7 中被禁止，请改为添加 'OFF' 或 'else' 分支

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// 警告：布尔值上的非详尽 'when' 语句将在 1.7 中
// 被禁止，请改为添加 'false' 或 'else' 分支
}
```

要在 Kotlin 1.5.30 中启用此功能，请使用语言版本 `1.6`。您还可以通过启用 [渐进模式 (progressive mode)](whatsnew13.md#progressive-mode) 将警告更改为错误。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // 默认为 false
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
            //progressiveMode = true // 默认为 false
        }
    }
}
```

</tab>
</tabs>

### 将挂起函数作为基类型

> 将挂起函数作为基类型的支持是 [实验性的](components-stability.md)。它可能随时被放弃或更改。
> 需要选择加入（见下文详情），并且您应该仅出于评估目的使用它。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707) 上提供反馈。
>
{style="warning"}

Kotlin 1.5.30 预览了将 `suspend` 函数类型作为基类型的能力，但有一些限制。

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

使用 `-language-version 1.6` 编译器选项来启用该功能：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
        }
    }
}
```

</tab>
</tabs>

该功能具有以下限制：
* 您不能将普通函数类型和 `suspend` 函数类型混合作为基类型。这是因为 JVM 后端中 `suspend` 函数类型的实现细节所致。它们在其中被表示为带有标记接口的普通函数类型。由于标记接口的存在，无法区分哪些基接口是挂起的，哪些是普通的。
* 您不能使用多个 `suspend` 函数基类型。如果存在类型检查，您也不能使用多个普通函数基类型。

### 对实验性 API 的隐式使用要求选择加入

> 选择加入要求机制是 [实验性的](components-stability.md)。
> 它可能随时更改。[了解如何选择加入](opt-in-requirements.md)。
> 请仅出于评估目的使用它。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

库的作者可以将实验性 API 标记为 [需要选择加入](opt-in-requirements.md#create-opt-in-requirement-annotations)，以告知用户其处于实验状态。当使用该 API 时，编译器会发出警告或错误，并要求 [显式同意](opt-in-requirements.md#opt-in-to-api) 来消除它。

在 Kotlin 1.5.30 中，编译器会将签名中具有实验性类型的任何声明视为实验性的。也就是说，即使是隐式使用实验性 API，它也要求选择加入。例如，如果函数的返回类型被标记为实验性 API 元素，则即使该声明没有被明确标记为需要选择加入，使用该函数也要求您进行选择加入。

```kotlin
// 库代码

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // 选择加入要求注解

@MyDateTime
class DateProvider // 一个需要选择加入的类

// 客户端代码

// 警告：实验性 API 使用
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // 同样警告：实验性 API 使用
    // ... 
}
```

详细了解 [选择加入要求](opt-in-requirements.md)。

### 对具有不同目标的选择加入要求注解使用的更改

> 选择加入要求机制是 [实验性的](components-stability.md)。
> 它可能随时更改。[了解如何选择加入](opt-in-requirements.md)。
> 请仅出于评估目的使用它。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

Kotlin 1.5.30 提出了在不同 [目标 (targets)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/) 上使用和声明选择加入要求注解的新规则。编译器现在会对在编译时难以处理的使用场景报告错误。在 Kotlin 1.5.30 中：
* 在使用位置禁止用选择加入要求注解标记局部变量和值参数。
* 仅当重写 (override) 的基本声明也被标记时，才允许标记该重写。
* 禁止标记支持字段和 getter。您可以改为标记基本属性。
* 在选择加入要求注解声明位置禁止设置 `TYPE` 和 `TYPE_PARAMETER` 注解目标。

详细了解 [选择加入要求](opt-in-requirements.md)。

### 递归泛型类型的类型推断改进

在 Kotlin 和 Java 中，您可以定义递归泛型类型，即在其类型形参中引用自身。在 Kotlin 1.5.30 中，如果是递归泛型，Kotlin 编译器可以仅根据相应类型形参的上界来推断类型实参。这使得创建带有递归泛型类型的各种模式成为可能，这些模式在 Java 中常用于制作构建器 API。

```kotlin
// Kotlin 1.5.20
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
    withDatabaseName("db")
    withUsername("user")
    withPassword("password")
    withInitScript("sql/schema.sql")
}

// Kotlin 1.5.30
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
    .withDatabaseName("db")
    .withUsername("user")
    .withPassword("password")
    .withInitScript("sql/schema.sql")
```

您可以通过传递 `-Xself-upper-bound-inference` 或 `-language-version 1.6` 编译器选项来启用这些改进。在 [此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-40804) 中查看新支持的其他用例示例。

### 消除构建器推断限制

构建器推断是一种特殊的类型推断，它允许您根据其 lambda 实参中其他调用的类型信息来推断调用的类型实参。这在调用泛型构建器函数时非常有用，例如 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 或 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)：`buildList { add("string") }`。

在此类 lambda 实参内部，以前对于使用构建器推断尝试推断的类型信息存在限制。这意味着您只能指定它而不能获取它。例如，在没有显式指定类型实参的情况下，您不能在 `buildList()` 的 lambda 实参内调用 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)。

Kotlin 1.5.30 通过 `-Xunrestricted-builder-inference` 编译器选项移除了这些限制。添加此选项以启用泛型构建器函数的 lambda 实参内以前被禁止的调用：

```kotlin
@kotlin.ExperimentalStdlibApi
val list = buildList {
    add("a")
    add("b")
    set(1, null)
    val x = get(1)
    if (x != null) {
        removeAt(1)
    }
}

@kotlin.ExperimentalStdlibApi
val map = buildMap {
    put("a", 1)
    put("b", 1.1)
    put("c", 2f)
}
```

此外，您还可以通过 `-language-version 1.6` 编译器选项启用此功能。

## Kotlin/JVM

随着 Kotlin 1.5.30 的发布，Kotlin/JVM 获得了以下功能：
* [注解类的实例化](#instantiation-of-annotation-classes)
* [改进的为 null 性注解支持配置](#improved-nullability-annotation-support-configuration)

有关 JVM 平台上 Kotlin Gradle 插件的更新，请参阅 [Gradle](#gradle) 部分。

### 注解类的实例化

> 注解类的实例化是 [实验性的](components-stability.md)。它可能随时被放弃或更改。
> 需要选择加入（见下文详情），并且您应该仅出于评估目的使用它。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) 上提供反馈。
>
{style="warning"}

在 Kotlin 1.5.30 中，您现在可以在任意代码中调用 [注解类](annotations.md) 的构造函数以获得结果实例。此功能涵盖了与允许实现注解接口的 Java 约定相同的用例。

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker) = ...

fun main(args: Array<String>) {
    if (args.size != 0)
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

使用 `-language-version 1.6` 编译器选项来启用此功能。请注意，当前所有的注解类限制（例如限制定义非 `val` 参数或不同于次构造函数的成员）仍然有效。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解更多关于注解类实例化的信息。

### 改进的为 null 性注解支持配置

Kotlin 编译器可以读取各种类型的 [为 null 性注解](java-interop.md#nullability-annotations)，以从 Java 中获取为 null 性信息。这些信息允许它在调用 Java 代码时报告 Kotlin 中的为 null 性不匹配。

在 Kotlin 1.5.30 中，您可以指定编译器是否根据来自特定类型的为 null 性注解的信息报告为 null 性不匹配。只需使用编译器选项 `-Xnullability-annotations=@<package-name>:<report-level>`。在实参中，指定完全限定的为 null 性注解包和以下报告级别之一：
* `ignore` 用于忽略为 null 性不匹配
* `warn` 用于报告警告
* `strict` 用于报告错误。

查看 [支持的为 null 性注解完整列表](java-interop.md#nullability-annotations) 及其完全限定包名。

以下是一个示例，展示了如何为新支持的 [RxJava](https://github.com/ReactiveX/RxJava) 3 为 null 性注解启用错误报告：`-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。请注意，所有此类为 null 性不匹配默认都是警告。

## Kotlin/Native

Kotlin/Native 获得了各种更改和改进：
* [Apple 芯片支持](#apple-silicon-support)
* [针对 CocoaPods Gradle 插件改进的 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [与 Swift 5.5 async/await 的实验性互操作性](#experimental-interoperability-with-swift-5-5-async-await)
* [改进的对象和伴生对象的 Swift/Objective-C 映射](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [弃用针对没有导入库的 MinGW 目标的 DLL 链接](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple 芯片支持

Kotlin 1.5.30 引入了对 [Apple 芯片](https://support.apple.com/en-us/HT211814) 的原生支持。

此前，Kotlin/Native 编译器和工具在 Apple 芯片宿主上工作需要 [Rosetta 转换环境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)。在 Kotlin 1.5.30 中，不再需要转换环境——编译器和工具可以在 Apple 芯片硬件上运行，而不需要任何额外操作。

我们还引入了使 Kotlin 代码在 Apple 芯片上原生运行的新目标：
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

它们在基于 Intel 和 Apple 芯片的宿主上均可用。所有现有目标在 Apple 芯片宿主上也可使用。

请注意，在 1.5.30 中，我们仅在 `kotlin-multiplatform` Gradle 插件中提供对 Apple 芯片目标的初步支持。特别是，新的模拟器目标未包含在 `ios`、`tvos` 和 `watchos` 目标快捷方式中。
我们将继续努力改进新目标的用户体验。

### 针对 CocoaPods Gradle 插件改进的 Kotlin DSL

#### Kotlin/Native 框架的新参数

Kotlin 1.5.30 为 Kotlin/Native 框架引入了改进的 CocoaPods Gradle 插件 DSL。除了框架名称外，您还可以在 Pod 配置中指定其他参数：
* 指定框架的动态或静态版本
* 显式启用导出依赖项
* 启用 Bitcode 嵌入

要使用新的 DSL，请将项目更新到 Kotlin 1.5.30，并在 `build.gradle(.kts)` 文件的 `cocoapods` 部分指定参数：

```kotlin
cocoapods {
    frameworkName = "MyFramework" // 此属性已弃用 
    // 并将在未来版本中移除
    // 用于框架配置的新 DSL：
    framework {
        // 支持所有框架属性
        // 框架名称配置。使用此属性代替 
        // 已弃用的 'frameworkName'
        baseName = "MyFramework"
        // 动态框架支持
        isStatic = false
        // 依赖项导出
        export(project(":anotherKMMModule"))
        transitiveExport = false // 这是默认值。
        // Bitcode 嵌入
        embedBitcode(BITCODE)
    }
}
```

#### 支持 Xcode 配置的自定义名称

Kotlin CocoaPods Gradle 插件支持 Xcode 构建配置中的自定义名称。如果您在 Xcode 中为构建配置使用特殊名称（例如 `Staging`），它也会对您有所帮助。

要指定自定义名称，请在 `build.gradle(.kts)` 文件的 `cocoapods` 部分使用 `xcodeConfigurationToNativeBuildType` 参数：

```kotlin
cocoapods {
    // 将自定义 Xcode 配置映射到 NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

此参数不会出现在 Podspec 文件中。当 Xcode 运行 Gradle 构建过程时，Kotlin CocoaPods Gradle 插件将选择必要的原生构建类型。

> 无需声明 `Debug` 和 `Release` 配置，因为它们默认受支持。
>
{style="note"}

### 与 Swift 5.5 async/await 的实验性互操作性

> 与 Swift async/await 的并发互操作性是 [实验性的](components-stability.md)。它可能随时被放弃或更改。
> 您应该仅出于评估目的使用它。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 上提供反馈。
>
{style="warning"}

我们在 [1.4.0 中添加了对从 Objective-C 和 Swift 调用 Kotlin 挂起函数的支持](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)，现在我们正在对其进行改进，以跟上 Swift 5.5 的新功能——[使用 `async` 和 `await` 修饰符进行并发](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)。

Kotlin/Native 编译器现在在为具有可为 null 返回类型的挂起函数生成的 Objective-C 头文件中发出 `_Nullable_result` 属性。这使得从 Swift 中将它们作为具有正确为 null 性的 `async` 函数进行调用成为可能。

请注意，此功能是实验性的，未来可能会受到 Kotlin 和 Swift 变化的影响。目前，我们提供此功能的预览版，它具有某些限制，我们渴望听到您的想法。在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47610) 中了解更多关于其当前状态的信息并留下您的反馈。

### 改进的对象和伴生对象的 Swift/Objective-C 映射

现在可以以对原生 iOS 开发者更直观的方式获取对象和伴生对象。例如，如果您在 Kotlin 中有以下对象：

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

要在 Swift 中访问它们，您可以使用 `shared` 和 `companion` 属性：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

了解更多关于 [Swift/Objective-C 互操作性](native-objc-interop.md) 的信息。

### 弃用针对没有导入库的 MinGW 目标的 DLL 链接

[LLD](https://lld.llvm.org/) 是 LLVM 项目中的一个链接器，我们计划在 Kotlin/Native 中为 MinGW 目标开始使用它，因为它比默认的 ld.bfd 具有更多优势——主要是更好的性能。

然而，LLD 的最新稳定版本不支持对 MinGW (Windows) 目标的直接 DLL 链接。此类链接需要使用 [导入库](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)。虽然 Kotlin/Native 1.5.30 不需要它们，但我们正在添加警告，以告知您此类用法与 LLD 不兼容，而 LLD 将在未来成为 MinGW 的默认链接器。

请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47605) 中分享您对向 LLD 链接器过渡的想法和疑虑。

## Kotlin 多平台

1.5.30 为 Kotlin 多平台带来了以下显著更新：
* [在共享原生代码中使用自定义 `cinterop` 库的能力](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [对 XCFrameworks 的支持](#support-for-xcframeworks)
* [Android 构件的新默认发布设置](#new-default-publishing-setup-for-android-artifacts)

### 在共享原生代码中使用自定义 cinterop 库的能力

Kotlin 多平台为您提供了一个 [选项](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries) 在共享源集中使用平台相关的互操作库。在 1.5.30 之前，这仅适用于随 Kotlin/Native 分发版提供的 [平台库](native-platform-libs.md)。从 1.5.30 开始，您可以将其用于自定义 `cinterop` 库。要启用此功能，请在您的 `gradle.properties` 中添加 `kotlin.mpp.enableCInteropCommonization=true` 属性：

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### 对 XCFrameworks 的支持

所有 Kotlin 多平台项目现在都可以将 XCFrameworks 作为输出格式。Apple 引入了 XCFrameworks 作为通用 (fat) 框架的替代品。通过 XCFrameworks，您可以：
* 在单个包中收集所有目标平台和架构的逻辑。
* 在将应用程序发布到 App Store 之前，无需移除所有不需要的架构。

如果您想在 Apple M1 上的设备和模拟器上使用 Kotlin 框架，XCFrameworks 非常有用。

要使用 XCFrameworks，请更新您的 `build.gradle(.kts)` 脚本：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform")
}

kotlin {
    val xcf = XCFramework()
  
    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)

    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
}
```

</tab>
</tabs>

当您声明 XCFrameworks 时，将注册以下新的 Gradle 任务：
* `assembleXCFramework`
* `assembleDebugXCFramework`（额外的调试构件，[包含 dSYMs](native-debugging.md#debug-ios-applications)）
* `assembleReleaseXCFramework`

在 [此 WWDC 视频](https://developer.apple.com/videos/play/wwdc2019/416/) 中详细了解 XCFrameworks。

### Android 构件的新默认发布设置

使用 `maven-publish` Gradle 插件，您可以通过在构建脚本中指定 [Android 变体](https://developer.android.com/studio/build/build-variants) 名称来 [发布适用于 Android 目标的多平台库](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#publish-an-android-library)。Kotlin Gradle 插件将自动生成发布内容。

在 1.5.30 之前，生成的发布 [元数据](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) 包含每个发布的 Android 变体的构建类型属性，使其仅与库使用者使用的相同构建类型兼容。Kotlin 1.5.30 引入了新的默认发布设置：
* 如果项目发布的所有 Android 变体具有相同的构建类型属性，则发布的变体将不具有构建类型属性，并将与任何构建类型兼容。
* If the published variants have different build type attributes, then only those with the `release` value will be published without the build type attribute. 这使得发布变体在使用者端与任何构建类型兼容，而显式非发布变体将仅与匹配的使用者构建类型兼容。

要退出并为所有变体保留构建类型属性，可以设置此 Gradle 属性：`kotlin.android.buildTypeAttribute.keep=true`。

## Kotlin/JS

1.5.30 为 Kotlin/JS 带来了两项重大改进：
* [JS IR 编译器后端达到 Beta 阶段](#js-ir-compiler-backend-reaches-beta)
* [使用 Kotlin/JS IR 后端的应用程序获得更好的调试体验](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 编译器后端达到 Beta 阶段

在 1.4.0 中作为 [Alpha](components-stability.md) 引入的 Kotlin/JS [基于 IR 的编译器后端](whatsnew14.md#unified-backends-and-extensibility) 已达到 Beta 阶段。

此前，我们发布了 JS IR 后端迁移指南，以帮助您将项目迁移到新后端。现在我们想介绍 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 插件，它直接在 IntelliJ IDEA 中显示所需的更改。

### 使用 Kotlin/JS IR 后端的应用程序获得更好的调试体验

Kotlin 1.5.30 为 Kotlin/JS IR 后端带来了 JavaScript 源代码映射生成。启用 IR 后端时，这将改进 Kotlin/JS 调试体验，提供完整的调试支持，包括断点、步进以及带有正确源引用的可读堆栈跟踪。

了解如何 [在浏览器或 IntelliJ IDEA 中调试 Kotlin/JS](js-debugging.md)。

## Gradle

作为我们 [改进 Kotlin Gradle 插件用户体验](https://youtrack.jetbrains.com/issue/KT-45778) 使命的一部分，我们实现了以下功能：
* [支持 Java 工具链](#support-for-java-toolchains)，其中包括针对旧版 Gradle 版本 [使用 `UsesKotlinJavaToolchain` 接口指定 JDK home 的能力](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [显式指定 Kotlin 守护进程 JVM 参数的更简单方法](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### 支持 Java 工具链

Gradle 6.7 引入了 ["Java 工具链支持"](https://docs.gradle.org/current/userguide/toolchains.html) 功能。
使用此功能，您可以：
* 使用与 Gradle 不同的 JDK 和 JRE 运行编译、测试和可执行文件。
* 使用未发布的语言版本编译和测试代码。

有了工具链支持，Gradle 可以自动检测本地 JDK，并安装 Gradle 构建所需的缺失 JDK。现在 Gradle 本身可以在任何 JDK 上运行，并且仍然可以重复使用 [构建缓存功能](gradle-compilation-and-caches.md#gradle-build-cache-support)。

Kotlin Gradle 插件支持用于 Kotlin/JVM 编译任务的 Java 工具链。
Java 工具链：
* 设置适用于 JVM 目标的 [`jdkHome` 选项](gradle-compiler-options.md#attributes-specific-to-jvm)。
  > [直接设置 `jdkHome` 选项的能力已被弃用](https://youtrack.jetbrains.com/issue/KT-46541)。
  >
  {style="warning"}

* 如果用户没有显式设置 `jvmTarget` 选项，则将 [`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) 设置为工具链的 JDK 版本。
  如果未配置工具链，则 `jvmTarget` 字段使用默认值。详细了解 [JVM 目标兼容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)。

* 影响 [`kapt` 工作线程](kapt.md#run-kapt-tasks-in-parallel) 运行在哪个 JDK 上。

使用以下代码设置工具链。将占位符 `<MAJOR_JDK_VERSION>` 替换为您想要使用的 JDK 版本：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</tab>
</tabs>

请注意，通过 `kotlin` 扩展设置工具链也会更新 Java 编译任务的工具链。

您可以通过 `java` 扩展设置工具链，Kotlin 编译任务将使用它：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

有关为 `KotlinCompile` 任务设置任何 JDK 版本的信息，请查阅有关 [使用任务 DSL 设置 JDK 版本](gradle-configure-project.md#set-jdk-version-with-the-task-dsl) 的文档。

对于 6.1 到 6.6 的 Gradle 版本，[使用 `UsesKotlinJavaToolchain` 接口设置 JDK home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### 使用 UsesKotlinJavaToolchain 接口指定 JDK home 的能力

所有支持通过 [`kotlinOptions`](gradle-compiler-options.md) 设置 JDK 的 Kotlin 任务现在都实现了 `UsesKotlinJavaToolchain` 接口。要设置 JDK home，请输入您的 JDK 路径并替换 `<JDK_VERSION>` 占位符：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.tasks
    .withType<UsesKotlinJavaToolchain>()
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            "/path/to/local/jdk",
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.tasks
    .withType(UsesKotlinJavaToolchain.class)
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            '/path/to/local/jdk',
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</tab>
</tabs>

对于 6.1 到 6.6 的 Gradle 版本，请使用 `UsesKotlinJavaToolchain` 接口。从 Gradle 6.7 开始，请改用 [Java 工具链](#support-for-java-toolchains)。

使用此功能时，请注意 [kapt 任务工作线程](kapt.md#run-kapt-tasks-in-parallel) 将仅使用 [进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)，并且 `kapt.workers.isolation` 属性将被忽略。

### 显式指定 Kotlin 守护进程 JVM 参数的更简单方法

在 Kotlin 1.5.30 中，Kotlin 守护进程的 JVM 参数有了新的逻辑。以下列表中的每个选项都会覆盖其之前的选项：

* 如果未指定任何内容，Kotlin 守护进程将继承 Gradle 守护进程的参数（同以前一样）。例如，在 `gradle.properties` 文件中：

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* 如果 Gradle 守护进程的 JVM 参数具有 `kotlin.daemon.jvm.options` 系统属性，请像以前一样使用它：

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* 您可以在 `gradle.properties` 文件中添加 `kotlin.daemon.jvmargs` 属性：

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* 您可以在 `kotlin` 扩展中指定参数：

  <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
    }
    ```

    </tab>
    </tabs>

* 您可以为特定任务指定参数：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    tasks
        .matching { it.name == "compileKotlin" && it is CompileUsingKotlinDaemon }
        .configureEach {
            (this as CompileUsingKotlinDaemon).kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
        }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">
  
    ```groovy
    tasks
        .matching {
            it.name == "compileKotlin" && it instanceof CompileUsingKotlinDaemon
        }
        .configureEach {
            kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
        }
    ```

    </tab>
    </tabs>

    > 在这种情况下，新的 Kotlin 守护进程实例可以在任务执行时启动。详细了解 [Kotlin 守护进程与 JVM 参数的交互](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。
    >
    {style="note"}

有关 Kotlin 守护进程的更多信息，请参阅 [Kotlin 守护进程及其在 Gradle 中的使用](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)。

## 标准库

Kotlin 1.5.30 为标准库的 `Duration` 和 `Regex` API 带来了改进：
* [更改 `Duration.toString()` 的输出](#changing-duration-tostring-output)
* [从字符串解析 Duration](#parsing-duration-from-string)
* [在特定位置使用正则表达式进行匹配](#matching-with-regex-at-a-particular-position)
* [将正则表达式拆分为序列](#splitting-regex-to-a-sequence)

### 更改 Duration.toString() 的输出

> Duration API 是 [实验性的](components-stability.md)。它可能随时被放弃或更改。
> 请仅出于评估目的使用它。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上向我们提供关于它的反馈。
>
{style="warning"}

在 Kotlin 1.5.30 之前，[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) 函数会返回其参数的字符串表示形式，该形式以产生最紧凑且可读的数字值的单位表示。
从现在起，它将返回以数字分量组合形式表示的字符串值，每个分量都有自己的单位。
每个分量都是一个数字，后跟单位的缩写名称：`d`、`h`、`m`、`s`。例如：

|**函数调用示例**|**以前的输出**|**当前的输出**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

负时长的表示方式也已更改。负时长以前缀减号 (`-`) 开头，如果它由多个分量组成，则用圆括号括起来：`-12m` 和 `-(1h 30m)`。

请注意，小于一秒的小时长由单个数字和其中一个亚秒单位表示。例如，`ms`（毫秒）、`us`（微秒）或 `ns`（纳秒）：`140.884ms`、`500us`、`24ns`。科学计数法不再用于表示它们。

如果您想以单一单位表示时长，请使用重载的 `Duration.toString(unit, decimals)` 函数。

> 我们建议在某些情况下使用 [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)，包括序列化和交换。`Duration.toIsoString()` 使用更严格的 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 格式，而不是 `Duration.toString()`。
>
{style="note"}

### 从字符串解析 Duration

> Duration API 是 [实验性的](components-stability.md)。它可能随时被放弃或更改。
> 请仅出于评估目的使用它。我们非常欢迎您在 [此问题](https://github.com/Kotlin/KEEP/issues/190) 中向我们提供反馈。
>
{style="warning"}

在 Kotlin 1.5.30 中，Duration API 中新增了以下函数：
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html)，支持解析以下函数的输出：
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)。
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html)，仅解析 `toIsoString()` 生成的格式。
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) 和 [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html)，其行为与上述函数类似，但在时长格式无效时返回 `null` 而不是抛出 `IllegalArgumentException`。

以下是 `parse()` 和 `parseOrNull()` 的一些用法示例：

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    val singleUnitFormatString = "1.5h"
    val invalidFormatString = "1 hour 30 minutes"
    println(Duration.parse(isoFormatString)) // "1h 30m"
    println(Duration.parse(defaultFormatString)) // "1h 30m"
    println(Duration.parse(singleUnitFormatString)) // "1h 30m"
    //println(Duration.parse(invalidFormatString)) // 抛出异常
    println(Duration.parseOrNull(invalidFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

以下是 `parseIsoString()` 和 `parseIsoStringOrNull()` 的一些用法示例：

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // 抛出异常
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 在特定位置使用正则表达式进行匹配

> `Regex.matchAt()` 和 `Regex.matchesAt()` 函数是 [实验性的](components-stability.md)。它们可能随时被放弃或更改。
> 请仅出于评估目的使用它们。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021) 上向我们提供关于它们的反馈。
>
{style="warning"}

新的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函数提供了一种检查正则表达式是否在 `String` 或 `CharSequence` 的特定位置具有精确匹配的方法。

`matchesAt()` 返回布尔值结果：

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // 正则表达式：一个数字，点，一个数字，点，一个或多个数字
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

如果找到匹配项，`matchAt()` 返回该匹配项；如果未找到，则返回 `null`：

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.5.30"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 将正则表达式拆分为序列

> `Regex.splitToSequence()` 和 `CharSequence.splitToSequence(Regex)` 函数是 [实验性的](components-stability.md)。它们可能随时被放弃或更改。
> 请仅出于评估目的使用它们。我们非常欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351) 上向我们提供关于它们的反馈。
>
{style="warning"}

新的 `Regex.splitToSequence()` 函数是 [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html) 的延迟（lazy）对应函数。它围绕给定正则表达式的匹配项拆分字符串，但将结果作为 [序列 (Sequence)](sequences.md) 返回，因此对此结果的所有操作都是延迟执行的。

```kotlin
fun main(){
//sampleStart
    val colorsText = "green, red , brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`CharSequence` 也添加了类似函数：

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 带来了新的 JSON 序列化功能：
* Java IO 流序列化
* 对默认值的属性级控制
* 排除序列化中 null 值的选项
* 多态序列化中的自定义类判别器

在 [变更日志](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 中了解更多信息。
<!-- 以及 [kotlinx.serialization 1.3.0 发布博客文章](TODO)。 -->