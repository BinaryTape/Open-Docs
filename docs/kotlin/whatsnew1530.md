---
title: "Kotlin 1.5.30 中的新增功能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布时间: 2021年8月24日](releases#release-details)_

Kotlin 1.5.30 提供了语言更新，包括未来变化的预览、平台支持和工具方面的各种改进，以及新的标准库函数。

以下是一些主要改进：
* 语言特性，包括实验性的密封类 `when` 语句，选择加入（opt-in）要求的更改等等
* 对 Apple silicon 的原生支持
* Kotlin/JS IR 后端达到 Beta 阶段
* 改进的 Gradle 插件体验

您还可以在[发布博文](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)和以下视频中找到有关更改的简短概述：

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 语言特性

Kotlin 1.5.30 提供了未来语言更改的预览，并改进了选择加入（opt-in）需求机制和类型推断：
* [密封类和布尔类型主体的穷尽式 when 语句](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [挂起函数作为超类型](#suspending-functions-as-supertypes)
* [要求对实验性 API 的隐式使用选择加入](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [使用具有不同目标的 Opt-in requirement 注解的更改](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [递归泛型类型类型推断的改进](#improvements-to-type-inference-for-recursive-generic-types)
* [消除构建器推断限制](#eliminating-builder-inference-restrictions)

### 密封类和布尔类型主体的穷尽式 when 语句

:::note
对密封类（exhaustive）when 语句的支持是 [Experimental](components-stability)。它可能随时被删除或更改。
需要选择加入（opt-in）（请参阅下面的详细信息），并且您应该仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) 中对此提供的反馈。

_穷尽式_ [`when`](control-flow#when-expressions-and-statements) 语句包含其主体所有可能的类型或值的分支，或者包含某些类型的分支并包括 `else` 分支以覆盖任何剩余情况。

我们计划很快禁止非穷尽式 `when` 语句，以使行为与 `when` 表达式保持一致。 为了确保平稳迁移，您可以配置编译器以报告有关带有密封类或布尔类型的非穷尽式 `when` 语句的警告。 默认情况下，此类警告将出现在 Kotlin 1.6 中，并在以后变为错误。

枚举类型已经收到警告。

:::

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON `->` println("ON")
    }
// WARNING: Non exhaustive 'when' statements on sealed classes/interfaces 
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true `->` println("true")
    }
// WARNING: Non exhaustive 'when' statements on Booleans will be prohibited 
// in 1.7, add a 'false' or 'else' branch instead
}
```

要在 Kotlin 1.5.30 中启用此功能，请使用语言版本 `1.6`。 您还可以通过启用[渐进模式](whatsnew13#progressive-mode)将警告更改为错误。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

### 挂起函数作为超类型

:::note
对将挂起函数作为超类型的支持是 [Experimental](components-stability)。它可能随时被删除或更改。
需要选择加入（opt-in）（请参阅下面的详细信息），并且您应该仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707) 中对此提供的反馈。

Kotlin 1.5.30 提供了使用 `suspend` 函数类型作为超类型的预览，但有一些限制。

```kotlin
class MyClass: suspend () `->` Unit {
    override suspend fun invoke() { TODO() }
}
```

使用 `-language-version 1.6` 编译器选项启用该功能：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
        }
    }
}
```

</TabItem>
</Tabs>

该功能有以下限制：
* 您不能将普通的函数类型和 `suspend` 函数类型混合作为超类型。 这是由于 JVM 后端中 `suspend` 函数类型的实现细节。 它们在其中表示为带有标记接口的普通函数类型。 由于标记接口，无法判断哪个超接口被挂起，哪个是普通的。
* 您不能使用多个 `suspend` 函数超类型。 如果有类型检查，您也不能使用多个普通函数超类型。

### 要求对实验性 API 的隐式使用选择加入

选择加入（opt-in）要求机制是 [Experimental](components-stability)。
它可能随时更改。 [查看如何选择加入（opt-in）](opt-in-requirements)。
仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中对此提供的反馈。

库的作者可以将实验性 API 标记为[需要选择加入（opt-in）](opt-in-requirements#create-opt-in-requirement-annotations)以告知用户其试验状态。 当使用 API 时，编译器会引发警告或错误，并且需要[显式同意](opt-in-requirements#opt-in-to-api)才能禁止显示该警告或错误。

在 Kotlin 1.5.30 中，编译器将签名中具有实验性类型的任何声明都视为实验性的。 也就是说，即使隐式使用实验性 API，它也需要选择加入（opt-in）。 例如，如果函数的返回类型被标记为实验性 API 元素，即使该声明未被显式标记为需要选择加入（opt-in），则对该函数的使用也需要您选择加入（opt-in）。

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

了解有关[选择加入（opt-in）要求](opt-in-requirements)的更多信息。

### 使用具有不同目标的 Opt-in requirement 注解的更改

选择加入（opt-in）要求机制是 [Experimental](components-stability)。
它可能随时更改。 [查看如何选择加入（opt-in）](opt-in-requirements)。
仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中对此提供的反馈。

Kotlin 1.5.30 提出了有关在不同 [targets](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/) 上使用和声明选择加入（opt-in） requirement 注解的新规则。 现在，编译器会报告一些用例的错误，这些用例在编译时很难处理。 在 Kotlin 1.5.30 中：
* 禁止在使用位置上使用 opt-in requirement 注解标记局部变量和值参数。
* 仅当覆盖的基本声明也被标记时，才允许标记覆盖。
* 禁止标记后备字段和 getter。 您可以改为标记基本属性。
* 禁止在 opt-in requirement 注解声明位置设置 `TYPE` 和 `TYPE_PARAMETER` 注解目标。

了解有关[选择加入（opt-in）要求](opt-in-requirements)的更多信息。

### 递归泛型类型类型推断的改进

在 Kotlin 和 Java 中，您可以定义一个递归泛型类型，该类型在其类型参数中引用自身。 在 Kotlin 1.5.30 中，如果 Kotlin 编译器是递归泛型，则 Kotlin 编译器可以仅基于相应类型参数的上限来推断类型参数。 这样就可以使用递归泛型类型创建各种模式，这些模式通常在 Java 中用于制作构建器 API。

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

您可以通过传递 `-Xself-upper-bound-inference` 或 `-language-version 1.6` 编译器选项来启用这些改进。 在[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-40804)中查看新支持的用例的其他示例。

### 消除构建器推断限制

构建器推断是一种特殊的类型推断，它允许您基于其 lambda 参数内部其他调用的类型信息来推断调用的类型参数。 在调用泛型构建器函数（例如 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 或 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)）时，这非常有用：`buildList { add("string") }`。

在此 lambda 参数内部，先前对使用构建器推断尝试推断的类型信息有限制。 这意味着您只能指定它而无法获得它。 例如，如果未明确指定类型参数，则无法在 `buildList()` 的 lambda 参数内调用 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)。

Kotlin 1.5.30 使用 `-Xunrestricted-builder-inference` 编译器选项消除了这些限制。 添加此选项可在泛型构建器函数的 lambda 参数内部启用先前禁止的调用：

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

此外，您可以使用 `-language-version 1.6` 编译器选项启用此功能。

## Kotlin/JVM

Kotlin 1.5.30，Kotlin/JVM 接收以下功能：
* [注解类实例化](#instantiation-of-annotation-classes)
* [改进的空值注解支持配置](#improved-nullability-annotation-support-configuration)

有关 JVM 平台上 Kotlin Gradle 插件更新的信息，请参见 [Gradle](#gradle) 部分。

### 注解类实例化

注解类实例化是 [Experimental](components-stability)。它可能随时被删除或更改。
需要选择加入（opt-in）（请参阅下面的详细信息），并且您应该仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) 中对此提供的反馈。

使用 Kotlin 1.5.30，您现在可以在任意代码中调用[注解类](annotations)的构造函数，以获取结果实例。 此功能涵盖与 Java 约定相同的用例，该约定允许实现注解接口。

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

使用 `-language-version 1.6` 编译器选项启用此功能。 请注意，当前所有注解类的限制（例如，限制定义非 `val` 参数或与辅助构造函数不同的成员）保持不变。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation) 中了解有关注解类实例化的更多信息

### 改进的空值注解支持配置

Kotlin 编译器可以读取各种类型的[空值注解](java-interop#nullability-annotations)以从 Java 获取空值信息。 此信息允许它在调用 Java 代码时报告 Kotlin 中的空值不匹配。

在 Kotlin 1.5.30 中，您可以指定编译器是否基于来自特定类型的空值注解的信息来报告空值不匹配。 只需使用编译器选项 `-Xnullability-annotations=@<package-name>:<report-level>`。 在参数中，指定完全限定的空值注解包和以下报告级别之一：
* `ignore` 忽略空值不匹配
* `warn` 报告警告
* `strict` 报告错误。

查看[支持的空值注解的完整列表](java-interop#nullability-annotations)及其完全限定的包名称。

这是一个示例，显示如何为新支持的 [RxJava](https://github.com/ReactiveX/RxJava) 3 空值注解启用错误报告：`-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。 请注意，默认情况下，所有此类空值不匹配都是警告。

## Kotlin/Native

Kotlin/Native 收到各种更改和改进：
* [Apple silicon 支持](#apple-silicon-support)
* [改进的 CocoaPods Gradle 插件的 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [与 Swift 5.5 async/await 的实验性互操作性](#experimental-interoperability-with-swift-5-5-async-await)
* [改进的对象和伴生对象的 Swift/Objective-C 映射](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [弃用针对 MinGW 目标的没有导入库的 DLL 的链接](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple silicon 支持

Kotlin 1.5.30 引入了对 [Apple silicon](https://support.apple.com/en-us/HT211814) 的原生支持。

以前，Kotlin/Native 编译器和工具需要 [Rosetta 转换环境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)才能在 Apple silicon 主机上工作。 在 Kotlin 1.5.30 中，不再需要转换环境 - 编译器和工具可以在 Apple silicon 硬件上运行，而无需任何其他操作。

我们还引入了新的 targets，使 Kotlin 代码可以在 Apple silicon 上原生运行：
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

它们在基于 Intel 的主机和 Apple silicon 主机上均可用。 所有现有 targets 也可以在 Apple silicon 主机上使用。

请注意，在 1.5.30 中，我们仅在 `kotlin-multiplatform` Gradle 插件中为 Apple silicon targets 提供基本支持。 特别是，新的模拟器 targets 未包含在 `ios`，`tvos` 和 `watchos` target 快捷方式中。
我们将继续努力改善新 targets 的用户体验。

### 改进的 CocoaPods Gradle 插件的 Kotlin DSL

#### Kotlin/Native 框架的新参数

Kotlin 1.5.30 引入了改进的用于 Kotlin/Native 框架的 CocoaPods Gradle 插件 DSL。 除了框架的名称之外，您还可以在 Pod 配置中指定其他参数：
* 指定框架的动态或静态版本
* 显式启用导出依赖
* 启用 Bitcode 嵌入

要使用新的 DSL，请将您的项目更新到 Kotlin 1.5.30，并在 `build.gradle(.kts)` 文件的 `cocoapods` 部分中指定参数：

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

Kotlin CocoaPods Gradle 插件支持 Xcode 构建配置中的自定义名称。 如果您在 Xcode 中为构建配置使用了特殊名称（例如 `Staging`），它也会为您提供帮助。

要指定自定义名称，请在 `build.gradle(.kts)` 文件的 `cocoapods` 部分中使用 `xcodeConfigurationToNativeBuildType` 参数：

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

此参数不会显示在 Podspec 文件中。 当 Xcode 运行 Gradle 构建过程时，Kotlin CocoaPods Gradle 插件将选择必要的 native 构建类型。

无需声明 `Debug` 和 `Release` 配置，因为默认情况下支持它们。

:::

### 与 Swift 5.5 async/await 的实验性互操作性

:::note
与 Swift async/await 的并发互操作性是 [Experimental](components-stability)。它可能随时被删除或更改。
您应该仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中对此提供的反馈。

我们在 [1.4.0 中添加了对从 Objective-C 和 Swift 调用 Kotlin 挂起函数的支持](whatsnew14#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)，现在我们正在对其进行改进，以跟上 Swift 5.5 新特性——[带有 `async` 和 `await` 修饰符的并发](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await)。

Kotlin/Native 编译器现在在为具有可空返回类型的挂起函数生成的 Objective-C 标头中发出 `_Nullable_result` 属性。 这样就可以从 Swift 中将它们作为具有适当可空性的 `async` 函数调用。

请注意，此功能是实验性的，并且将来可能会受到 Kotlin 和 Swift 中更改的影响。 目前，我们正在提供此功能的预览版，该功能具有某些限制，并且我们渴望听取您的想法。 在 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610) 中了解有关其当前状态的更多信息并留下您的反馈。

### 改进的对象和伴生对象的 Swift/Objective-C 映射

现在，可以以对 native iOS 开发人员而言更为直观的方式来获取对象和伴生对象。 例如，如果在 Kotlin 中有以下对象：

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

了解更多关于 [Swift/Objective-C 互操作性](native-objc-interop)。

### 弃用针对 MinGW 目标的没有导入库的 DLL 的链接

[LLD](https://lld.llvm.org/) 是来自 LLVM 项目的链接器，由于其优于默认 ld.bfd 的优点（主要是其更好的性能），我们计划开始在 Kotlin/Native 中将其用于 MinGW targets。

但是，最新稳定版本的 LLD 不支持针对 MinGW（Windows）目标的直接链接到 DLL。 这种链接需要使用 [导入库](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)。 尽管 Kotlin/Native 1.5.30 不需要它们，但我们添加了一个警告，以通知您此类用法与 LLD 不兼容，LLD 将来会成为 MinGW 的默认链接器。

请在 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47605) 中分享您对过渡到 LLD 链接器的想法和疑虑。

## Kotlin Multiplatform

1.5.30 为 Kotlin Multiplatform 带来了以下值得注意的更新：
* [能够在共享 native 代码中使用自定义 `cinterop` 库](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [支持 XCFrameworks](#support-for-xcframeworks)
* [Android 制品的新默认发布设置](#new-default-publishing-setup-for-android-artifacts)

### 能够在共享 native 代码中使用自定义 cinterop 库

Kotlin Multiplatform 为您提供了一个[选项](multiplatform-share-on-platforms#connect-platform-specific-libraries) ，以在共享源集中使用平台相关的 interop 库。 在 1.5.30 之前，这仅适用于 Kotlin/Native 发行版附带的[平台库](native-platform-libs)。 从 1.5.30 开始，您可以将其与自定义 `cinterop` 库一起使用。 要启用此功能，请在 `gradle.properties` 中添加 `kotlin.mpp.enableCInteropCommonization=true` 属性：

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### 支持 XCFrameworks

现在，所有 Kotlin Multiplatform 项目都可以使用 XCFrameworks 作为输出格式。 Apple 引入了 XCFrameworks 来代替通用（fat）框架。 借助 XCFrameworks，您可以：
* 在单个 bundle 中收集所有目标平台和架构的逻辑。
* 无需在将应用程序发布到 App Store 之前删除所有不必要的架构。

如果您想在 Apple M1 上为设备和模拟器使用 Kotlin 框架，则 XCFrameworks 非常有用。

要使用 XCFrameworks，请更新您的 `build.gradle(.kts)` 脚本：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

声明 XCFrameworks 时，将注册以下新的 Gradle 任务：
* `assembleXCFramework`
* `assembleDebugXCFramework`（另外添加包含 [dSYMs](native-ios-symbolication) 的 debug 制品）
* `assembleReleaseXCFramework`

在 [此 WWDC 视频](https://developer.apple.com/videos/play/wwdc2019/416/) 中了解有关 XCFrameworks 的更多信息。

### Android 制品的新默认发布设置

使用 `maven-publish` Gradle 插件，您可以通过在构建脚本中指定 [Android 变体](https://developer.android.com/studio/build/build-variants) 名称来[发布用于 Android target 的 multiplatform 库](multiplatform-publish-lib#publish-an-android-library)。 Kotlin Gradle 插件将自动生成 publications。

在 1.5.30 之前，生成的 publication [metadata](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) 为每个发布的 Android 变体都包含构建类型属性，使其仅与库使用者使用的相同构建类型兼容。 Kotlin 1.5.30 引入了新的默认发布设置：
* 如果项目发布的所有 Android 变体都具有相同的构建类型属性，则发布的变体将不具有构建类型属性，并且将与任何构建类型兼容。
* 如果发布的变体具有不同的构建类型属性，则只有那些具有 `release` 值的变体才会在没有构建类型属性的情况下发布。 这使得 release 变体与使用者端的任何构建类型兼容，而非 release 变体将仅与匹配的使用者构建类型兼容。

要选择退出并保留所有变体的构建类型属性，可以设置此 Gradle 属性：`kotlin.android.buildTypeAttribute.keep=true`。

## Kotlin/JS

Kotlin/JS 通过 1.5.30 带来了两项重大改进：
* [JS IR 编译器后端达到 Beta 阶段](#js-ir-compiler-backend-reaches-beta)
* [使用 Kotlin/JS IR 后端的应用程序具有更好的调试体验](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 编译器后端达到 Beta 阶段

用于 Kotlin/JS 的[基于 IR 的编译器后端](whatsnew14#unified-backends-and-extensibility)（在 1.4.0 中以 [Alpha](components-stability) 引入）已达到 Beta 阶段。

之前，我们发布了 [JS IR 后端的迁移指南](js-ir-migration) 以帮助您将项目迁移到新的后端。 现在，我们想介绍 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 插件，该插件直接在 IntelliJ IDEA 中显示所需的更改。

### 使用 Kotlin/JS IR 后端的应用程序具有更好的调试体验

Kotlin 1.5.30 带来了用于 Kotlin/JS IR 后端的 JavaScript 源码映射生成。 当启用 IR 后端后，这将改善 Kotlin/JS 调试体验，并提供完整的调试支持，包括断点、单步执行以及带有适当源引用的可读堆栈跟踪。

了解如何在 [浏览器或 IntelliJ IDEA Ultimate 中调试 Kotlin/JS](js-debugging)。

## Gradle

为了[改善 Kotlin Gradle 插件用户体验](https://youtrack.jetbrains.com/issue/KT-45778)这一使命，我们实现了以下功能：
* [支持 Java 工具链](#support-for-java-toolchains)，其中包括 [对于较旧的 Gradle 版本，能够使用 `UsesKotlinJavaToolchain` 接口指定 JDK home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [一种更简单的方法来显式指定 Kotlin daemon 的 JVM 参数](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### 支持 Java 工具链

Gradle 6.7 引入了 [“Java 工具链支持”](https://docs.gradle.org/current/userguide/toolchains.html) 功能。
使用此功能，您可以：
* 使用与 Gradle 不同的 JDK 和 JRE 运行编译、测试和可执行文件。
* 使用未发布的语言版本编译和测试代码。

通过工具链支持，Gradle 可以自动检测本地 JDK 并安装 Gradle 构建所需的缺失 JDK。 现在 Gradle 本身可以在任何 JDK 上运行，并且仍然可以重用[构建缓存功能](gradle-compilation-and-caches#gradle-build-cache-support)。

Kotlin Gradle 插件支持 Kotlin/JVM 编译任务的 Java 工具链。
Java 工具链：
* 设置 JVM target 可用的 [`jdkHome` 选项](gradle-compiler-options#attributes-specific-to-jvm)。
   [直接设置 `jdkHome` 选项的功能已被弃用](https://youtrack.jetbrains.com/issue/KT-46541)。

* 如果用户未显式设置 `jvmTarget` 选项，则将 [`kotlinOptions.jvmTarget`](gradle-compiler-options#attributes-specific-to-jvm) 设置为工具链的 JDK 版本。
  如果未配置工具链，则 `jvmTarget` 字段将使用默认值。 了解有关 [JVM target 兼容性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)的更多信息。

* 影响 [`kapt` workers](kapt#run-kapt-tasks-in-parallel) 在哪个 JDK 上运行。

使用以下代码设置工具链。 将占位符 `<MAJOR_JDK_VERSION>` 替换为您要使用的 JDK 版本：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</TabItem>
</Tabs>

请注意，通过 `kotlin` 扩展设置工具链也会更新 Java 编译任务的工具链。

您可以通过 `java` 扩展设置工具链，并且 Kotlin 编译任务将使用它：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

有关为 `KotlinCompile` 任务设置任何 JDK 版本的信息，请查看有关[使用 Task DSL 设置 JDK 版本](gradle-configure-project#set-jdk-version-with-the-task-dsl)的文档。

对于 Gradle 6.1 至 6.6 版本，[使用 `UsesKotlinJavaToolchain` 接口设置 JDK home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### 能够使用 UsesKotlinJavaToolchain 接口指定 JDK home

现在，所有支持通过 [`kotlinOptions`](gradle-compiler-options) 设置 JDK 的 Kotlin 任务都实现了 `UsesKotlinJavaToolchain` 接口。 要设置 JDK home，请放置到 JDK 的路径并替换 `<JDK_VERSION>` 占位符：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

对于 Gradle 6.1 至 6.6 版本，请使用 `UsesKotlinJavaToolchain` 接口。 从 Gradle 6.7 开始，请改用 [Java 工具链](#support-for-java-toolchains)。

使用此功能时，请注意 [kapt 任务 workers](kapt#run-kapt-tasks-in-parallel) 将仅使用 [进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)，并且将忽略 `kapt.workers.isolation` 属性。

### 一种更简单的方法来显式指定 Kotlin daemon JVM 参数

在 Kotlin 1.5.30 中，Kotlin daemon 的 JVM 参数有一个新的逻辑。 以下列表中的每个选项都会覆盖之前的选项：

* 如果未指定任何内容，则 Kotlin daemon 会从 Gradle daemon 继承参数（与以前一样）。 例如，在 `gradle.properties` 文件中：

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* 如果 Gradle daemon 的 JVM 参数具有 `kotlin.daemon.jvm.options` 系统属性，则像以前一样使用它：

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m