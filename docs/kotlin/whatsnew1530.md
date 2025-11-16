[//]: # (title: Kotlin 1.5.30 的新特性)

_[发布日期：2021 年 8 月 24 日](releases.md#release-details)_

Kotlin 1.5.30 带来了语言更新，包括未来变更的预览、平台支持和工具的各种改进，以及新的标准库函数。

以下是一些主要改进：
* 语言特性，包括实验性的密封 `when` 语句、opt-in 要求的变更等
* 对 Apple silicon 的原生支持
* Kotlin/JS IR 后端达到 Beta 版
* 改进的 Gradle 插件体验

你也可以在[发布博文](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)和此视频中找到对这些变更的简短概述：

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 语言特性

Kotlin 1.5.30 正在呈现未来语言变更的预览，并对 opt-in 要求机制和类型推断带来了改进：
* [密封和 Boolean 主体的穷尽 when 语句](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [挂起函数作为超类型](#suspending-functions-as-supertypes)
* [对实验性 API 隐式用法要求 opt-in](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [对使用具有不同目标的 opt-in 要求注解的变更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [对递归泛型类型进行类型推断的改进](#improvements-to-type-inference-for-recursive-generic-types)
* [消除构建器推断限制](#eliminating-builder-inference-restrictions)

### 密封和 Boolean 主体的穷尽 when 语句

> 对密封（穷尽）when 语句的支持是[实验性的](components-stability.md)。它可能随时被放弃或更改。
> 需要 Opt-in（详见下文），且你应仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) 上提供的反馈。
>
{style="warning"}

_穷尽的_ [`when`](control-flow.md#when-expressions-and-statements) 语句包含其主体所有可能类型或值的分支，或者包含特定类型的分支并包含一个 `else` 分支以覆盖任何剩余情况。

我们计划很快禁止非穷尽的 `when` 语句，以使行为与 `when` 表达式保持一致。为确保平滑迁移，你可以配置编译器以报告关于密封类或 Boolean 类型的非穷尽 `when` 语句的警告。此类警告将在 Kotlin 1.6 中默认出现，并将在后续版本中变为错误。

> 枚举已会收到警告。
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
// WARNING: Non exhaustive 'when' statements on sealed classes/interfaces 
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// WARNING: Non exhaustive 'when' statements on Booleans will be prohibited 
// in 1.7, add a 'false' or 'else' branch instead
}
```

要在 Kotlin 1.5.30 中启用此特性，请使用语言版本 `1.6`。你也可以通过启用[渐进模式](whatsnew13.md#progressive-mode)将警告更改为错误。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // false by default
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
            //progressiveMode = true // false by default
        }
    }
}
```

</tab>
</tabs>

### 挂起函数作为超类型

> 对挂起函数作为超类型的支持是[实验性的](components-stability.md)。它可能随时被放弃或更改。
> 需要 Opt-in（详见下文），且你应仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707) 上提供的反馈。
>
{style="warning"}

Kotlin 1.5.30 提供了使用 `suspend` 函数类型作为超类型的能力的预览，但有一些限制。

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

使用 `-language-version 1.6` 编译器选项来启用此特性：

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

此特性有以下限制：
* 你不能将普通函数类型和 `suspend` 函数类型混合作为超类型。这是因为 JVM 后端中 `suspend` 函数类型的实现细节。它们在 JVM 后端中被表示为带有标记接口的普通函数类型。由于标记接口的存在，无法区分哪些超接口是挂起的，哪些是普通的。
* 你不能使用多个 `suspend` 函数超类型。如果存在类型检测，你也不能使用多个普通函数超类型。

### 对实验性 API 隐式用法要求 opt-in

> opt-in 要求机制是[实验性的](components-stability.md)。
> 它可能随时更改。[参见如何 opt-in](opt-in-requirements.md)。
> 仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供的反馈。
>
{style="warning"}

库的作者可以将实验性 API 标记为[需要 opt-in](opt-in-requirements.md#create-opt-in-requirement-annotations) 以告知用户其实验性状态。当 API 被使用时，编译器会发出警告或错误，并要求[显式同意](opt-in-requirements.md#opt-in-to-api)来抑制它。

在 Kotlin 1.5.30 中，编译器将签名中包含实验性类型的任何声明视为实验性。也就是说，即使声明未被显式标记为需要 opt-in，它也要求对实验性 API 的隐式用法进行 opt-in。例如，如果函数的返回类型被标记为实验性 API 元素，则使用该函数需要你 opt-in。

```kotlin
// Library code

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // Opt-in requirement annotation

@MyDateTime
class DateProvider // A class requiring opt-in

// Client code

// Warning: experimental API usage
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // Also warning: experimental API usage
    // ... 
}
```

了解更多关于 [opt-in 要求](opt-in-requirements.md)的信息。

### 对使用具有不同目标的 opt-in 要求注解的变更

> opt-in 要求机制是[实验性的](components-stability.md)。
> 它可能随时更改。[参见如何 opt-in](opt-in-requirements.md)。
> 仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供的反馈。
>
{style="warning"}

Kotlin 1.5.30 提出了在使用和声明 opt-in 要求注解时针对不同[目标](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)的新规则。编译器现在会报告编译期难以处理的用例的错误。在 Kotlin 1.5.30 中：
* 禁止在使用处标记局部变量和值形参与 opt-in 要求注解。
* 只有当其基本声明也被标记时才允许标记覆盖。
* 禁止标记幕后字段和 getter。你可以转而标记基本属性。
* 禁止在 opt-in 要求注解声明处设置 `TYPE` 和 `TYPE_PARAMETER` 注解目标。

了解更多关于 [opt-in 要求](opt-in-requirements.md)的信息。

### 对递归泛型类型进行类型推断的改进

在 Kotlin 和 Java 中，你可以定义一个递归泛型类型，它在自己的类型形参中引用自身。在 Kotlin 1.5.30 中，如果对应的类型形参是递归泛型，Kotlin 编译器可以仅根据其上界推断类型实参。这使得创建各种递归泛型类型模式成为可能，这些模式在 Java 中常用于构建器 API。

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

你可以通过传递 `-Xself-upper-bound-inference` 或 `-language-version 1.6` 编译器选项来启用这些改进。在[此 YouTrack 票证](https://youtrack.jetbrains.com/issue/KT-40804)中查看新支持用例的其他示例。

### 消除构建器推断限制

构建器推断是一种特殊的类型推断，它允许你根据其 lambda 实参内部的其他调用中的类型信息来推断调用的类型实参。这在调用泛型构建器函数（例如 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 或 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)）时非常有用：`buildList { add("string") }`。

在此类 lambda 实参内部，以前在使用构建器推断尝试推断的类型信息时存在限制。这意味着你只能指定它而不能获取它。例如，在未显式指定类型实参的情况下，你无法在 `buildList()` 的 lambda 实参内部调用 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)。

Kotlin 1.5.30 使用 `-Xunrestricted-builder-inference` 编译器选项消除了这些限制。添加此选项以启用以前在泛型构建器函数的 lambda 实参内部被禁止的调用：

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

此外，你还可以使用 `-language-version 1.6` 编译器选项启用此特性。

## Kotlin/JVM

借助 Kotlin 1.5.30，Kotlin/JVM 获得了以下特性：
* [注解类的实例化](#instantiation-of-annotation-classes)
* [改进的空安全注解支持配置](#improved-nullability-annotation-support-configuration)

有关 JVM 平台上 Kotlin Gradle 插件的更新，请参见 [Gradle](#gradle) 部分。

### 注解类的实例化

> 注解类的实例化是[实验性的](components-stability.md)。它可能随时被放弃或更改。
> 需要 Opt-in（详见下文），且你应仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) 上提供的反馈。
>
{style="warning"}

借助 Kotlin 1.5.30，你现在可以在任意代码中调用[注解类](annotations.md)的构造函数以获取结果实例。此特性涵盖了与 Java 约定相同的用例，后者允许实现注解接口。

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

使用 `-language-version 1.6` 编译器选项来启用此特性。请注意，所有当前的注解类限制（例如限制定义非 `val` 形参或与次构造函数不同的成员）保持不变。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解更多关于注解类实例化的信息。

### 改进的空安全注解支持配置

Kotlin 编译器可以读取各种类型的[空安全注解](java-interop.md#nullability-annotations)以从 Java 获取空安全信息。此信息允许它在调用 Java 代码时报告 Kotlin 中的空安全不匹配。

在 Kotlin 1.5.30 中，你可以指定编译器是否根据特定类型的空安全注解中的信息报告空安全不匹配。只需使用编译器选项 `-Xnullability-annotations=@<package-name>:<report-level>`。在实参中，指定完全限定的空安全注解包和以下报告级别之一：
* `ignore` 用于忽略空安全不匹配
* `warn` 用于报告警告
* `strict` 用于报告错误。

参见[受支持的空安全注解的完整列表](java-interop.md#nullability-annotations)及其完全限定包名。

以下是启用新支持的 [RxJava](https://github.com/ReactiveX/RxJava) 3 空安全注解的错误报告的示例：`-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。请注意，所有此类空安全不匹配默认都是警告。

## Kotlin/Native

Kotlin/Native 已经收到了各种变更和改进：
* [Apple silicon 支持](#apple-silicon-support)
* [针对 CocoaPods Gradle 插件的改进 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [与 Swift 5.5 async/await 的实验性互操作](#experimental-interoperability-with-swift-5-5-async-await)
* [改进了 Swift/Objective-C 对对象和伴生对象的映射](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [弃用针对 MinGW 目标链接不带导入库的 DLL](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple silicon 支持

Kotlin 1.5.30 引入了对 [Apple silicon](https://support.apple.com/en-us/HT211814) 的原生支持。

此前，Kotlin/Native 编译器和工具链需要在 Apple silicon 主机上工作时使用 [Rosetta 转换环境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)。在 Kotlin 1.5.30 中，转换环境不再需要——编译器和工具链可以在 Apple silicon 硬件上运行，无需任何额外操作。

我们还引入了新的目标平台，使 Kotlin 代码能够在 Apple silicon 上原生运行：
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

它们在基于 Intel 和 Apple silicon 的主机上均可用。所有现有目标平台在 Apple silicon 主机上也可用。

请注意，在 1.5.30 中，我们仅为 `kotlin-multiplatform` Gradle 插件中的 Apple silicon 目标平台提供基本支持。特别是，新的模拟器目标不包含在 `ios`、`tvos` 和 `watchos` 目标快捷方式中。
我们将继续努力改进新目标平台的用户体验。

### 针对 CocoaPods Gradle 插件的改进 Kotlin DSL

#### Kotlin/Native 框架的新形参

Kotlin 1.5.30 引入了针对 Kotlin/Native 框架的改进 CocoaPods Gradle 插件 DSL。除了框架名称，你还可以在 Pod 配置中指定其他形参：
* 指定框架的动态或静态版本
* 显式启用导出依赖项
* 启用 Bitcode 嵌入

要使用新的 DSL，请将你的项目更新到 Kotlin 1.5.30，并在 `cocoapods` 部分的 `build.gradle(.kts)` 文件中指定形参：

```kotlin
cocoapods {
    frameworkName = "MyFramework" // This property is deprecated 
    // and will be removed in future versions
    // New DSL for framework configuration:
    framework {
        // All Framework properties are supported
        // Framework name configuration. Use this property instead of 
        // deprecated 'frameworkName'
        baseName = "MyFramework"
        // Dynamic framework support
        isStatic = false
        // Dependency export
        export(project(":anotherKMMModule"))
        transitiveExport = false // This is default.
        // Bitcode embedding
        embedBitcode(BITCODE)
    }
}
```

#### 支持 Xcode 配置的自定义名称

Kotlin CocoaPods Gradle 插件支持 Xcode 构建配置中的自定义名称。如果你在 Xcode 中使用特殊的构建配置名称（例如 `Staging`），这也会有所帮助。

要指定自定义名称，请在 `cocoapods` 部分的 `build.gradle(.kts)` 文件中使用 `xcodeConfigurationToNativeBuildType` 形参：

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

此形参不会出现在 Podspec 文件中。当 Xcode 运行 Gradle 构建过程时，Kotlin CocoaPods Gradle 插件将选择所需的原生构建类型。

> 无需声明 `Debug` 和 `Release` 配置，因为它们是默认支持的。
>
{style="note"}

### 与 Swift 5.5 async/await 的实验性互操作

> 与 Swift async/await 的并发互操作是[实验性的](components-stability.md)。它可能随时被放弃或更改。
> 你应仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 上提供的反馈。
>
{style="warning"}

我们在 1.4.0 中添加了[对从 Objective-C 和 Swift 调用 Kotlin 挂起函数的支持](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)，现在我们正在改进它以跟上 Swift 5.5 的新特性——[带 `async` 和 `await` 修饰符的并发](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)。

Kotlin/Native 编译器现在会在生成的 Objective-C 头文件中为具有可空返回类型的挂起函数发出 `_Nullable_result` 属性。这使得从 Swift 调用它们作为具有正确可空性的 `async` 函数成为可能。

请注意，此特性是实验性的，未来可能会受到 Kotlin 和 Swift 变更的影响。目前，我们提供此特性的预览版，它具有某些限制，我们非常期待听到你的想法。在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47610)中了解其当前状态并留下你的反馈。

### 改进了 Swift/Objective-C 对对象和伴生对象的映射

现在可以通过对原生 iOS 开发者而言更直观的方式获取对象和伴生对象。例如，如果你在 Kotlin 中有以下对象：

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

要在 Swift 中访问它们，你可以使用 `shared` 和 `companion` 属性：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

了解更多关于 [Swift/Objective-C 互操作](native-objc-interop.md)的信息。

### 弃用针对 MinGW 目标链接不带导入库的 DLL

[LLD](https://lld.llvm.org/) 是 LLVM 项目中的一个链接器，我们计划开始在 Kotlin/Native 中将其用于 MinGW 目标平台，因为它比默认的 ld.bfd 更有优势——主要是性能更好。

然而，LLD 的最新稳定版本不支持针对 MinGW (Windows) 目标的直接链接 DLL。此类链接需要使用[导入库](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)。尽管 Kotlin/Native 1.5.30 不需要它们，但我们添加了一个警告，以告知你此类用法与 LLD 不兼容，后者将在未来成为 MinGW 的默认链接器。

请在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47605)中分享你对迁移到 LLD 链接器的想法和担忧。

## Kotlin Multiplatform

1.5.30 为 Kotlin Multiplatform 带来了以下显著更新：
* [在共享原生代码中使用自定义 `cinterop` 库的能力](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [支持 XCFrameworks](#support-for-xcframeworks)
* [Android 构件的新的默认发布设置](#new-default-publishing-setup-for-android-artifacts)

### 在共享原生代码中使用自定义 cinterop 库的能力

Kotlin Multiplatform 为你提供了在共享源代码集中使用平台相关互操作库的[选项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。在 1.5.30 之前，这仅适用于 Kotlin/Native 发行版随附的[平台库](native-platform-libs.md)。从 1.5.30 开始，你可以将其与自定义 `cinterop` 库一起使用。要启用此特性，请在 `gradle.properties` 中添加 `kotlin.mpp.enableCInteropCommonization=true` 属性：

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### 支持 XCFrameworks

所有 Kotlin Multiplatform 项目现在都可以将 XCFrameworks 作为输出格式。Apple 引入 XCFrameworks 作为通用（fat）框架的替代品。借助 XCFrameworks，你可以：
* 将所有目标平台和架构的逻辑收集到单个 bundle 中。
* 在将应用程序发布到 App Store 之前，无需移除所有不必要的架构。

如果你想在 Apple M1 设备和模拟器上使用 Kotlin 框架，XCFrameworks 非常有用。

要使用 XCFrameworks，请更新你的 `build.gradle(.kts)` 脚本：

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

当你声明 XCFrameworks 时，将注册以下新的 Gradle 任务：
* `assembleXCFramework`
* `assembleDebugXCFramework` （另外包含调试构件，[其中包含 dSYMs](native-debugging.md#debug-ios-applications)）
* `assembleReleaseXCFramework`

在[此 WWDC 视频](https://developer.apple.com/videos/play/wwdc2019/416/)中了解更多关于 XCFrameworks 的信息。

### Android 构件的新的默认发布设置

使用 `maven-publish` Gradle 插件，你可以通过在构建脚本中指定 [Android variant](https://developer.android.com/studio/build/build-variants) 名称来[发布针对 Android 目标平台的多平台库](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#publish-an-android-library)。Kotlin Gradle 插件将自动生成发布。

在 1.5.30 之前，生成的发布[元数据](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)包含每个已发布 Android variant 的构建类型属性，使其仅与库消费者使用的相同构建类型兼容。Kotlin 1.5.30 引入了新的默认发布设置：
* 如果项目发布的所有 Android variant 具有相同的构建类型属性，则发布的 variant 将不具有构建类型属性，并将与任何构建类型兼容。
* 如果发布的 variant 具有不同的构建类型属性，则只有那些具有 `release` 值的 variant 将在不带构建类型属性的情况下发布。这使得发布 variant 在消费者端与任何构建类型兼容，而非发布 variant 将仅与匹配的消费者构建类型兼容。

要选择退出并保留所有 variant 的构建类型属性，你可以设置此 Gradle 属性：`kotlin.android.buildTypeAttribute.keep=true`。

## Kotlin/JS

Kotlin/JS 在 1.5.30 中带来了两项主要改进：
* [JS IR 编译器后端达到 Beta 版](#js-ir-compiler-backend-reaches-beta)
* [Kotlin/JS IR 后端应用程序的更好调试体验](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 编译器后端达到 Beta 版

Kotlin/JS 的[基于 IR 的编译器后端](whatsnew14.md#unified-backends-and-extensibility)于 1.4.0 以 [Alpha](components-stability.md) 版引入，现已达到 Beta 版。

此前，我们发布了 JS IR 后端的迁移指南，以帮助你将项目迁移到新的后端。现在我们想介绍 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 插件，它直接在 IntelliJ IDEA 中显示所需的更改。

### Kotlin/JS IR 后端应用程序的更好调试体验

Kotlin 1.5.30 为 Kotlin/JS IR 后端带来了 JavaScript 源映射生成。这将在启用 IR 后端时改善 Kotlin/JS 调试体验，提供完整的调试支持，包括断点、单步执行和具有正确源引用的可读堆栈跟踪。

了解如何在[浏览器或 IntelliJ IDEA Ultimate 中调试 Kotlin/JS](js-debugging.md)。

## Gradle

作为我们[改进 Kotlin Gradle 插件用户体验](https://youtrack.jetbrains.com/issue/KT-45778)任务的一部分，我们实现了以下特性：
* [对 Java toolchains 的支持](#support-for-java-toolchains)，其中包括[为旧版 Gradle 使用 `UsesKotlinJavaToolchain` 接口指定 JDK home 的能力](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [更简单地显式指定 Kotlin daemon JVM 实参的方式](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### 对 Java toolchains 的支持

Gradle 6.7 引入了["Java toolchains 支持"](https://docs.gradle.org/current/userguide/toolchains.html)特性。
使用此特性，你可以：
* 使用与 Gradle 不同的 JDK 和 JRE 运行编译、测试和可执行文件。
* 使用未发布的语言版本编译和测试代码。

通过 toolchains 支持，Gradle 可以自动检测本地 JDK 并安装构建所需的缺失 JDK。现在 Gradle 本身可以在任何 JDK 上运行，并且仍然可以重用[构建缓存特性](gradle-compilation-and-caches.md#gradle-build-cache-support)。

Kotlin Gradle 插件支持 Kotlin/JVM 编译任务的 Java toolchains。
Java toolchain：
* 设置 JVM 目标可用的 [`jdkHome` 选项](gradle-compiler-options.md#attributes-specific-to-jvm)。
  > [直接设置 `jdkHome` 选项的能力已被弃用](https://youtrack.jetbrains.com/issue/KT-46541)。
  >
  {style="warning"}

* 如果用户未显式设置 `jvmTarget` 选项，则将 [`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) 设置为 toolchain 的 JDK 版本。
  如果未配置 toolchain，`jvmTarget` 字段将使用默认值。了解更多关于 [JVM 目标兼容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)的信息。

* 影响 [`kapt` 工作进程](kapt.md#run-kapt-tasks-in-parallel)在哪个 JDK 上运行。

使用以下代码设置 toolchain。将占位符 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本：

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

请注意，通过 `kotlin` 扩展设置 toolchain 也会更新 Java 编译任务的 toolchain。

你可以通过 `java` 扩展设置 toolchain，Kotlin 编译任务将使用它：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

有关为 `KotlinCompile` 任务设置任何 JDK 版本的信息，请查阅[通过 Task DSL 设置 JDK 版本](gradle-configure-project.md#set-jdk-version-with-the-task-dsl)的文档。

对于 Gradle 6.1 到 6.6 版本，[使用 `UsesKotlinJavaToolchain` 接口设置 JDK home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### 为旧版 Gradle 使用 UsesKotlinJavaToolchain 接口指定 JDK home 的能力

所有支持通过 [`kotlinOptions`](gradle-compiler-options.md) 设置 JDK 的 Kotlin 任务现在都实现了 `UsesKotlinJavaToolchain` 接口。要设置 JDK home，请填写你的 JDK 路径并替换 `<JDK_VERSION>` 占位符：

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

使用 `UsesKotlinJavaToolchain` 接口处理 Gradle 6.1 到 6.6 版本。从 Gradle 6.7 开始，请改用 [Java toolchains](#support-for-java-toolchains)。

使用此特性时，请注意 [`kapt` 任务工作进程](kapt.md#run-kapt-tasks-in-parallel)将仅使用[进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)，并且 `kapt.workers.isolation` 属性将被忽略。

### 更简单地显式指定 Kotlin daemon JVM 实参的方式

在 Kotlin 1.5.30 中，Kotlin daemon 的 JVM 实参有了新的逻辑。以下列表中的每个选项都会覆盖其之前的选项：

* 如果未指定任何内容，Kotlin daemon 将（像以前一样）继承 Gradle daemon 的实参。例如，在 `gradle.properties` 文件中：

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* 如果 Gradle daemon 的 JVM 实参具有 `kotlin.daemon.jvm.options` 系统属性，则像以前一样使用它：

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* 你可以在 `gradle.properties` 文件中添加 `kotlin.daemon.jvmargs` 属性：

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* 你可以在 `kotlin` 扩展中指定实参：

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

* 你可以为特定任务指定实参：

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

    > 在这种情况下，新的 Kotlin daemon 实例可以在任务执行时启动。了解更多关于 [Kotlin daemon 与 JVM 实参的交互](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)的信息。
    >
  {style="note"}

有关 Kotlin daemon 的更多信息，请参见 [Kotlin daemon 及其与 Gradle 的用法](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)。

## 标准库

Kotlin 1.5.30 正在为标准库的 `Duration` 和 `Regex` API 带来改进：
* [更改 `Duration.toString()` 输出](#changing-duration-tostring-output)
* [从 String 解析 Duration](#parsing-duration-from-string)
* [在特定位置使用 Regex 进行匹配](#matching-with-regex-at-a-particular-position)
* [将 Regex 拆分为序列](#splitting-regex-to-a-sequence)

### 更改 Duration.toString() 输出

> Duration API 是[实验性的](components-stability.md)。它可能随时被放弃或更改。
> 仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供的反馈。
>
{style="warning"}

在 Kotlin 1.5.30 之前，[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) 函数会返回其实参的字符串表示形式，该表示形式以生成最紧凑和可读数值的单位表示。
从现在开始，它将返回一个表示为数字组件组合的字符串值，每个组件都有自己的单位。
每个组件都是一个数字，后跟单位的缩写名称：`d`、`h`、`m`、`s`。例如：

|**函数调用示例**|**旧输出**|**当前输出**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

负时长的表示方式也已更改。负时长以负号（`-`）为前缀，如果它由多个组件组成，则用圆括号括起来：`-12m` 和 `-(1h 30m)`。

请注意，小于一秒的短时长表示为单个数字，带有其中一个亚秒单位。例如，`ms`（毫秒）、`us`（微秒）或 `ns`（纳秒）：`140.884ms`、`500us`、`24ns`。不再使用科学记数法来表示它们。

如果你想以单个单位表示时长，请使用重载的 `Duration.toString(unit, decimals)` 函数。

> 我们建议在某些情况下使用 [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)，包括序列化和互换。`Duration.toIsoString()` 使用更严格的 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 格式，而不是 `Duration.toString()`。
>
{style="note"}

### 从 String 解析 Duration

> Duration API 是[实验性的](components-stability.md)。它可能随时被放弃或更改。
> 仅将其用于求值目的。我们非常感谢你在[此问题](https://github.com/Kotlin/KEEP/issues/190)中提供的反馈。
>
{style="warning"}

在 Kotlin 1.5.30 中，Duration API 中有新函数：
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html)，支持解析以下输出：
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)。
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html)，仅从 `toIsoString()` 生成的格式进行解析。
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) 和 [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html)，它们的行为与上述函数类似，但在无效时长格式上返回 `null` 而不是抛出 `IllegalArgumentException`。

以下是一些 `parse()` 和 `parseOrNull()` 用法的示例：

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
    //println(Duration.parse(invalidFormatString)) // throws exception
    println(Duration.parseOrNull(invalidFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

以下是一些 `parseIsoString()` 和 `parseIsoStringOrNull()` 用法的示例：

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // throws exception
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 在特定位置使用 Regex 进行匹配

> `Regex.matchAt()` 和 `Regex.matchesAt()` 函数是[实验性的](components-stability.md)。它们可能随时被放弃或更改。
> 仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021) 上提供的反馈。
>
{style="warning"}

新的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函数提供了一种检查正则表达式是否在 `String` 或 `CharSequence` 中的特定位置精确匹配的方法。

`matchesAt()` 返回一个布尔结果：

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`matchAt()` 返回匹配（如果找到），否则返回 `null`：

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

### 将 Regex 拆分为序列

> `Regex.splitToSequence()` 和 `CharSequence.splitToSequence(Regex)` 函数是[实验性的](components-stability.md)。它们可能随时被放弃或更改。
> 仅将其用于求值目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351) 上提供的反馈。
>
{style="warning"}

新的 `Regex.splitToSequence()` 函数是 [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html) 的惰性对应函数。它根据给定正则表达式的匹配项拆分字符串，但将结果作为 [Sequence](sequences.md) 返回，以便对该结果的所有操作都惰性执行。

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

一个类似的功能也被添加到 `CharSequence`：

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 现已发布，并带来了新的 JSON 序列化功能：
* Java IO 流序列化
* 属性级别的默认值控制
* 一个从序列化中排除 null 值的选项
* 多态序列化中的自定义类鉴别器

在 [changelog](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 中了解更多信息。
<!-- and the [kotlinx.serialization 1.3.0 release blog post](TODO). -->