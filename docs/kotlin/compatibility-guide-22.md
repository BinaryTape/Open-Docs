[//]: # (title: Kotlin 2.2 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计中的基本原则。前者指出，阻碍语言演进的结构应被移除；后者则表明，此移除应事先充分沟通，以便代码迁移尽可能顺利。

尽管大多数语言变更已通过其他渠道（如更新日志或编译器警告）公布，但本文档汇总了所有变更，为从 Kotlin 2.1 迁移到 Kotlin 2.2 提供了完整的参考。

## 基本术语

本文档介绍了几种兼容性类型：

- _源代码_：源代码不兼容变更会使过去可以正常编译（没有错误或警告）的代码无法再编译。
- _二进制_：如果两个二进制 artifact 互换不会导致加载或链接错误，则称它们是二进制兼容的。
- _行为_：如果同一程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的。

请记住，这些定义仅适用于纯 Kotlin。Kotlin 代码从其他语言视角（例如，从 Java）的兼容性超出本文档的范围。

## 语言

### 默认启用带注解 lambda 表达式的 invokedynamic

> **问题**：[KTLC-278](https://youtrack.jetbrains.com/issue/KTLC-278)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概括**：带注解的 lambda 表达式现在默认通过 `LambdaMetafactory` 使用 `invokedynamic`，使其行为与 Java lambda 表达式保持一致。这会影响依赖于从生成的 lambda 类中检索注解的基于反射的代码。要恢复旧行为，请使用 `-Xindy-allow-annotated-lambdas=false` 编译器选项。
>
> **废弃周期**：
>
> - 2.2.0：默认启用带注解 lambda 表达式的 `invokedynamic`

### 在 K2 中禁止构造函数调用和展开类型中带型变修饰符的类型别名继承

> **问题**：[KTLC-4](https://youtrack.jetbrains.com/issue/KTLC-4)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概括**：使用展开为使用如 `out` 等型变修饰符的类型的类型别名进行构造函数调用和继承，不再受 K2 编译器支持。这解决了使用原始类型不允许，但通过类型别名使用相同用法却被允许的不一致性。要迁移，请在需要时显式使用原始类型。
>
> **废弃周期**：
>
> - 2.0.0：对展开为带型变修饰符类型的类型别名上的构造函数调用或超类型用法报告警告
> - 2.2.0：将警告提升为错误

### 禁止从 Kotlin getter 创建合成属性

> **问题**：[KTLC-272](https://youtrack.jetbrains.com/issue/KTLC-272)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概括**：合成属性不再允许用于 Kotlin 中定义的 getter。这会影响 Java 类扩展 Kotlin 类以及处理如 `java.util.LinkedHashSet` 等映射类型的情况。要迁移，请将属性访问替换为对相应 getter 函数的直接调用。
>
> **废弃周期**：
>
> - 2.0.0：对从 Kotlin getter 创建的合成属性访问报告警告
> - 2.2.0：将警告提升为错误

### 变更 JVM 接口函数默认方法生成方式

> **问题**：[KTLC-269](https://youtrack.jetbrains.com/issue/KTLC-269)
>
> **组件**：核心语言
>
> **不兼容变更类型**：二进制
>
> **简要概括**：除非另行配置，接口中声明的函数现在会编译为 JVM 默认方法。当不相关的超类型定义冲突的实现时，这可能导致 Java 代码中出现编译错误。此行为由稳定的 `-jvm-default` 编译器选项控制，该选项替代了现在已废弃的 `-Xjvm-default` 选项。要恢复以前的行为（默认实现仅在 `DefaultImpls` 类和子类中生成），请使用 `-jvm-default=disable`。
>
> **废弃周期**：
>
> - 2.2.0：`-jvm-default` 编译器选项默认设置为 `enable`

### 禁止注解属性上的字段目标注解

> **问题**：[KTLC-7](https://youtrack.jetbrains.com/issue/KTLC-7)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概括**：字段目标注解不再允许用于注解属性。尽管这些注解没有可观察到的效果，但此更改可能会影响依赖于它们的自定义 IR 插件。要迁移，请从属性中移除字段目标注解。
>
> **废弃周期**：
>
> - 2.1.0：对注解属性上的 `@JvmField` 注解报告废弃警告
> - 2.1.20：对注解属性上的所有字段目标注解报告警告
> - 2.2.0：将警告提升为错误

### 禁止类型别名中使用 `reified` 类型形参

> **问题**：[KTLC-5](https://youtrack.jetbrains.com/issue/KTLC-5)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`reified` 修饰符不再允许用于类型别名中的类型形参。`reified` 类型形参仅在内联函数中有效，因此在类型别名中使用它们无效。要迁移，请从 `typealias` 声明中移除 `reified` 修饰符。
>
> **废弃周期**：
>
> - 2.1.0：对类型别名中的 `reified` 类型形参报告警告
> - 2.2.0：将警告提升为错误

### 修正 `Number` 和 `Comparable` 内联值类的类型检测

> **问题**：[KTLC-21](https://youtrack.jetbrains.com/issue/KTLC-21)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简要概括**：内联值类在 `is` 和 `as` 检测中不再被视为 `java.lang.Number` 或 `java.lang.Comparable` 的实现者。这些检测在应用于装箱的内联类时，以前会返回不正确的结果。该优化现在仅适用于原生类型及其包装器。
>
> **废弃周期**：
>
> - 2.2.0：启用新行为

### 禁止从间接依赖项中访问不可访问的泛型类型

> **问题**：[KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概括**：当使用来自间接依赖项中对编译器不可见的类型时，K2 编译器现在会报告错误。这会影响诸如 lambda 实参或泛型类型实参的情况，其中引用的类型由于缺少依赖项而不可用。
>
> **废弃周期**：
>
> - 2.0.0：对 lambda 表达式中不可访问的泛型类型以及不可访问泛型类型实参的特定用法报告错误；对 lambda 表达式中不可访问的非泛型类型以及表达式和超类型中不可访问的类型实参报告警告
> - 2.1.0：将 lambda 表达式中不可访问的非泛型类型的警告提升为错误
> - 2.2.0：将表达式类型中不可访问的类型实参的警告提升为错误

### 强制执行类型形参边界的可见性检测

> **问题**：[KTLC-274](https://youtrack.jetbrains.com/issue/KTLC-274)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概括**：函数和属性不再允许使用其可见性比声明本身更具限制性的类型形参边界。这可以防止间接暴露不可访问的类型，此类情况以前编译时没有错误，但在某些情况下会导致运行时故障或 IR 验证错误。
>
> **废弃周期**：
>
> - 2.1.0：当类型形参的边界从声明的可见性作用域不可见时，报告警告
> - 2.2.0：将警告提升为错误

### 在非私有内联函数中暴露私有类型时报告错误

> **问题**：[KT-70916](https://youtrack.jetbrains.com/issue/KT-70916)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概括**：不再允许从非私有内联函数访问私有类型、函数或属性。要迁移，请避免引用私有实体，将函数设为私有，或移除 `inline` 修饰符。请注意，移除 `inline` 会破坏二进制兼容性。
>
> **废弃周期**：
>
> - 2.2.0：当从非私有内联函数访问私有类型或成员时报告错误

### 禁止将非局部返回用于形参默认值 lambda 表达式

> **问题**：[KTLC-286](https://youtrack.jetbrains.com/issue/KTLC-286)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概括**：非局部返回语句不再允许用于作为形参默认值的 lambda 表达式中。这种模式以前可以编译，但会导致运行时崩溃。要迁移，请重写 lambda 表达式以避免非局部返回，或将逻辑移到默认值之外。
>
> **废弃周期**：
>
> - 2.2.0：对用作形参默认值的 lambda 表达式中的非局部返回报告错误

## 标准库

### 废弃 `kotlin.native.Throws`

> **问题**：[KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **组件**：Kotlin/Native
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`kotlin.native.Throws` 已废弃；请改用通用的 [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) 注解。
>
> **废弃周期**：
>
> - 1.9.0：使用 `kotlin.native.Throws` 时报告警告
> - 2.2.0：将警告提升为错误

### 废弃 `AbstractDoubleTimeSource`

> **问题**：[KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`AbstractDoubleTimeSource` 已废弃；请改用 [`AbstractLongTimeSource`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-abstract-long-time-source/)。
>
> **废弃周期**：
>
> - 1.8.20：使用 `AbstractDoubleTimeSource` 时报告警告
> - 2.2.0：将警告提升为错误

## 工具

### 修正 `KotlinCompileTool` 中的 `setSource()` 函数以替换源代码

> **问题**：[KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **组件**：Gradle
>
> **不兼容变更类型**：行为
>
> **简要概括**：[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 接口中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函数现在会替换已配置的源代码，而不是向其添加。如果您想添加源代码而不替换现有源代码，请使用 `source()` 函数。
>
> **废弃周期**：
>
> - 2.2.0：启用新行为

### 废弃 `KotlinCompilationOutput#resourcesDirProvider` 属性

> **问题**：[KT-70620](https://youtrack.jetbrains.com/issue/KT-70620)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`KotlinCompilationOutput#resourcesDirProvider` 属性已废弃。请改在 Gradle 构建脚本中使用 [`KotlinSourceSet.resources`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/resources.html) 以添加额外的资源目录。
>
> **废弃周期**：
>
> - 2.1.0：`KotlinCompilationOutput#resourcesDirProvider` 已废弃并报告警告
> - 2.2.0：将警告提升为错误

### 废弃 `BaseKapt.annotationProcessorOptionProviders` 属性

> **问题**：[KT-58009](https://youtrack.jetbrains.com/issue/KT-58009)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：[`BaseKapt.annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 属性已废弃，推荐使用 `BaseKapt.annotationProcessorOptionsProviders`，后者接受 `ListProperty<CommandLineArgumentProvider>` 而不是 `MutableList<Any>`。这清晰地定义了预期的元素类型，并防止了因添加不正确元素（例如嵌套列表）而导致的运行时故障。如果您当前的代码将列表作为单个元素添加，请将 `add()` 函数替换为 `addAll()` 函数。
>
> **废弃周期**：
>
> - 2.2.0：在 API 中强制使用新类型

### 废弃 `kotlin-android-extensions` 插件

> **问题**：[KT-72341](https://youtrack.jetbrains.com/issue/KT-72341/)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`kotlin-android-extensions` 插件已废弃。请改用单独的插件 [`kotlin-parcelize`](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) 来生成 `Parcelable` 实现，并使用 Android Jetpack 的 [视图绑定](https://developer.android.com/topic/libraries/view-binding) 来处理合成视图。
>
> **废弃周期**：
>
> - 1.4.20：插件已废弃
> - 2.1.20：引入配置错误，且不执行任何插件代码
> - 2.2.0：插件代码已移除

### 废弃 `kotlinOptions` DSL

> **问题**：[KT-54110](https://youtrack.jetbrains.com/issue/KT-54110)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：通过 `kotlinOptions` DSL 和相关的 `KotlinCompile<KotlinOptions>` 任务接口配置编译器选项的功能已废弃，推荐使用新的 `compilerOptions` DSL。作为此次废弃的一部分，`kotlinOptions` 接口中的所有属性现在也已单独标记为废弃。要迁移，请使用 `compilerOptions` DSL 配置编译器选项。关于迁移指南，请参见[从 `kotlinOptions {}` 迁移到 `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
>
> **废弃周期**：
>
> - 2.0.0：对 `kotlinOptions` DSL 报告警告
> - 2.2.0：将警告提升为错误，并废弃 `kotlinOptions` 中的所有属性

### 移除 `kotlin.incremental.useClasspathSnapshot` 属性

> **问题**：[KT-62963](https://youtrack.jetbrains.com/issue/KT-62963)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`kotlin.incremental.useClasspathSnapshot` Gradle 属性已移除。此属性控制已废弃的基于 JVM 历史的增量编译模式，该模式已被从 Kotlin 1.8.20 开始默认启用的基于类路径的方法取代。
>
> **废弃周期**：
>
> - 2.0.20：废弃 `kotlin.incremental.useClasspathSnapshot` 属性并报告警告
> - 2.2.0：移除该属性

### Kotlin 脚本的废弃事项

> **问题**：[KT-71685](https://youtrack.jetbrains.com/issue/KT-71685)、[KT-75632](https://youtrack.jetbrains.com/issue/KT-75632/)、[KT-76196](https://youtrack.jetbrains.com/issue/KT-76196/)。
>
> **组件**：Scripting
>
> **不兼容变更类型**：源代码
>
> **简要概括**：Kotlin 2.2.0 废弃了对以下各项的支持：
> *   REPL：要继续通过 `kotlinc` 使用 REPL，请使用 `-Xrepl` 编译器选项选择加入。
> *   JSR-223：由于 [JSR](https://jcp.org/en/jsr/detail?id=223) 处于 **已撤回** 状态。JSR-223 实现继续支持语言版本 1.9，但未来没有迁移到 K2 编译器的计划。
> *   `KotlinScriptMojo` Maven 插件。如果您继续使用它，将会看到编译器警告。
>
> 有关更多信息，请参阅我们的[博客文章](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。
>
> **废弃周期**：
>
> - 2.1.0：废弃 `kotlinc` 中 REPL 的使用并报告警告
> - 2.2.0：要通过 `kotlinc` 使用 REPL，请使用 `-Xrepl` 编译器选项选择加入；废弃 JSR-223，通过切换到语言版本 1.9 可以恢复支持；废弃 `KotlinScriptMojo` Maven 插件

### 废弃消歧分类器属性

> **问题**：[KT-58231](https://youtrack.jetbrains.com/issue/KT-58231)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：用于控制 Kotlin Gradle 插件如何消除源代码集名称和 IDE 导入歧义的选项已过时。因此，`KotlinTarget` 接口中的以下属性现已废弃：
>
> *   `useDisambiguationClassifierAsSourceSetNamePrefix`
> *   `overrideDisambiguationClassifierOnIdeImport`
>
> **废弃周期**：
>
> - 2.0.0：当使用 Gradle 属性时报告警告
> - 2.1.0：将此警告提升为错误
> - 2.2.0：移除 Gradle 属性

### 废弃通用化形参

> **问题**：[KT-75161](https://youtrack.jetbrains.com/issue/KT-75161)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：Kotlin Gradle 插件中实验性的通用化模式的形参已废弃。这些形参可能会生成无效的编译构件，然后被缓存。要删除受影响的构件：
>
> 1.  从您的 `gradle.properties` 文件中移除以下选项：
>
>     ```none
>     kotlin.mpp.enableOptimisticNumberCommonization
>     kotlin.mpp.enablePlatformIntegerCommonization
>     ```
>
> 2.  清除 `~/.konan/*/klib/commonized` 目录中的通用化缓存，或运行以下命令：
>
>     ```bash
>     ./gradlew cleanNativeDistributionCommonization
>     ```
>
> **废弃周期**：
>
> - 2.2.0：废弃通用化形参并报告错误
> - 2.2.20：移除通用化形参

### 废弃对旧版元数据编译的支持

> **问题**：[KT-61817](https://youtrack.jetbrains.com/issue/KT-61817)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：用于设置分层结构并在公共源代码集和中间源代码集之间创建中间源代码集的选项已过时。以下编译器选项已移除：
>
> *   `isCompatibilityMetadataVariantEnabled`
> *   `withGranularMetadata`
> *   `isKotlinGranularMetadataEnabled`
>
> **废弃周期**：
>
> - 2.2.0：从 Kotlin Gradle 插件中移除编译器选项

### 废弃 `KotlinCompilation.source` API

> **问题**：[KT-64991](https://youtrack.jetbrains.com/issue/KT-64991)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：允许将 Kotlin 源代码集直接添加到 Kotlin 编译项的 `KotlinCompilation.source` API 访问已废弃。
>
> **废弃周期**：
>
> - 1.9.0：当使用 `KotlinCompilation.source` 时报告警告
> - 1.9.20：将此警告提升为错误
> - 2.2.0：从 Kotlin Gradle 插件中移除 `KotlinCompilation.source`；尝试使用它会导致构建脚本编译期间出现“unresolved reference”错误

### 废弃目标预设 API

> **问题**：[KT-71698](https://youtrack.jetbrains.com/issue/KT-71698)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：Kotlin 多平台目标的目标预设已过时；`jvm()` 或 `iosSimulatorArm64()` 等目标 DSL 函数现在覆盖了相同的用例。所有与预设相关的 API 已废弃：
>
> *   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 属性
> *   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 接口及其所有继承者
> *   `fromPreset` 重载
>
> **废弃周期**：
>
> - 1.9.20：对任何使用预设相关 API 的情况报告警告
> - 2.0.0：将此警告提升为错误
> - 2.2.0：从 Kotlin Gradle 插件的公共 API 中移除与预设相关的 API；仍然使用它的源代码会因“unresolved reference”错误而失败，并且二进制文件（例如 Gradle 插件）除非针对最新版本的 Kotlin Gradle 插件重新编译，否则可能会因链接错误而失败

### 废弃 Apple 目标快捷方式

> **问题**：[KT-70615](https://youtrack.jetbrains.com/issue/KT-70615)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：Kotlin 多平台 DSL 中的 `ios()`、`watchos()` 和 `tvos()` 目标快捷方式已废弃。这些快捷方式旨在部分创建 Apple 目标的源代码集层次结构。Kotlin 多平台 Gradle 插件现在提供内置的层次结构模板。不再使用快捷方式，而是指定目标列表，然后插件会自动为它们设置中间源代码集。
>
> **废弃周期**：
>
> - 1.9.20：当使用目标快捷方式时报告警告；默认改为启用默认层次结构模板
> - 2.1.0：当使用目标快捷方式时报告错误
> - 2.2.0：从 Kotlin 多平台 Gradle 插件中移除目标快捷方式 DSL

### 废弃 `publishAllLibraryVariants()` 函数

> **问题**：[KT-60623](https://youtrack.jetbrains.com/issue/KT-60623)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`publishAllLibraryVariants()` 函数已废弃。它旨在发布 Android 目标的所有构建变体。现不推荐此方法，因为它可能导致变体解析问题，尤其是在使用多个风味 (flavor) 和构建类型 (build type) 时。请改用指定构建变体的 `publishLibraryVariants()` 函数。
>
> **废弃周期**：
>
> - 2.2.0：`publishAllLibraryVariants()` 已废弃

### 废弃 `android` 目标

> **问题**：[KT-71608](https://youtrack.jetbrains.com/issue/KT-71608)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`android` 目标名称在当前 Kotlin DSL 中已废弃。请改用 `androidTarget`。
>
> **废弃周期**：
>
> - 1.9.0：当 `android` 名称在 Kotlin 多平台项目中被使用时，引入废弃警告
> - 2.1.0：将此警告提升为错误
> - 2.2.0：从 Kotlin 多平台 Gradle 插件中移除 `android` 目标 DSL

### 废弃 `CInteropProcess` 中的 `konanVersion`

> **问题**：[KT-71069](https://youtrack.jetbrains.com/issue/KT-71069)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`CInteropProcess` 任务中的 `konanVersion` 属性已废弃。请改用 `CInteropProcess.kotlinNativeVersion`。
>
> **废弃周期**：
>
> - 2.1.0：当使用 `konanVersion` 属性时报告警告
> - 2.2.0：将此警告提升为错误
> - 2.3.0：从 Kotlin Gradle 插件中移除 `konanVersion` 属性

### 废弃 `CInteropProcess` 中的 `destinationDir`

> **问题**：[KT-71068](https://youtrack.jetbrains.com/issue/KT-71068)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：`CInteropProcess` 任务中的 `destinationDir` 属性已废弃。请改用 `CInteropProcess.destinationDirectory.set()` 函数。
>
> **废弃周期**：
>
> - 2.1.0：当使用 `destinationDir` 属性时报告警告
> - 2.2.0：将此警告提升为错误
> - 2.3.0：从 Kotlin Gradle 插件中移除 `destinationDir` 属性

### 废弃 `kotlinArtifacts` API

> **问题**：[KT-74953](https://youtrack.jetbrains.com/issue/KT-74953)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概括**：实验性的 `kotlinArtifacts` API 已废弃。请使用 Kotlin Gradle 插件中当前可用的 DSL 来[构建最终的原生二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。如果这不足以进行迁移，请在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-74953)中留下评论。
>
> **废弃周期**：
>
> - 2.2.0：当使用 `kotlinArtifacts` API 时报告警告
> - 2.3.0：将此警告提升为错误