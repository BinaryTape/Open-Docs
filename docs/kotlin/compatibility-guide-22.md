[//]: # (title: Kotlin 2.2.x 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_和_[舒适更新](kotlin-evolution-principles.md)_是 Kotlin 语言设计的基本原则。前者指出应当移除阻碍语言演进的结构，后者则指出这种移除应当事先进行充分沟通，以使代码迁移尽可能顺畅。

虽然大多数语言变更已经通过其他渠道（如更新日志或编译器警告）公布，但本文档对这些变更进行了汇总，为从 Kotlin 2.1 迁移到 Kotlin 2.2 提供完整的参考。

## 基本术语

在本文档中，我们引入了几种兼容性：

- _源码（source）_：源码不兼容的更改会导致曾经可以正常编译（没有错误或警告）的代码不再能编译。
- _二进制（binary）_：如果两个二进制工件相互交换后不会导致加载或链接错误，则称它们是二进制兼容的。
- _行为（behavioral）_：如果在应用更改前后，同一个程序表现出不同的行为，则称该更改是行为不兼容的。

请记住，这些定义仅针对纯 Kotlin。从其他语言（例如 Java）的角度来看 Kotlin 代码的兼容性不在本文档的讨论范围内。

## 语言

### `-language-version` 停止支持 1.6 和 1.7

> **问题**：[KT-71793](https://youtrack.jetbrains.com/issue/KT-71793)
>
> **组件**：编译器
>
> **不兼容更改类型**：源码
>
> **简短摘要**：从 Kotlin 2.2 开始，编译器不再支持 [`-language-version=1.6`](compiler-reference.md#language-version-version) 或 `-language-version=1.7`。这意味着不再支持早于 1.8 的语言功能集。然而，语言本身仍然与 Kotlin 1.0 完全向后兼容。
>
> **弃用周期**：
>
> - 2.1.0：在使用版本 1.6 和 1.7 的 `-language-version` 时报告警告
> - 2.2.0：在使用版本 1.8 和 1.9 的 `-language-version` 时报告警告；对于版本 1.6 和 1.7，将警告升级为错误

### 默认对带注解的 lambda 启用 invokedynamic

> **问题**：[KTLC-278](https://youtrack.jetbrains.com/issue/KTLC-278)
>
> **组件**：核心语言
>
> **不兼容更改类型**：行为
>
> **简短摘要**：带注解的 lambda 现在默认通过 `LambdaMetafactory` 使用 `invokedynamic`，使其行为与 Java lambda 一致。这会影响依赖从生成的 lambda 类中检索注解的基于反射的代码。要恢复到旧行为，请使用 `-Xindy-allow-annotated-lambdas=false` 编译器选项。
>
> **弃用周期**：
>
> - 2.2.0：默认对带注解的 lambda 启用 `invokedynamic`

### 在 K2 中禁止对展开类型中具有差异（variance）的类型别名进行构造函数调用和继承

> **问题**：[KTLC-4](https://youtrack.jetbrains.com/issue/KTLC-4)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：K2 编译器不再支持使用展开为具有 `out` 等差异（variance）修饰符类型的类型别名进行构造函数调用和继承。这解决了使用原始类型时不被允许，但通过类型别名使用时却被允许的不一致问题。要进行迁移，请在需要的地方显式使用原始类型。
>
> **弃用周期**：
>
> - 2.0.0：对于展开为具有差异修饰符类型的类型别名，在其构造函数调用或超类型使用时报告警告
> - 2.2.0：将警告升级为错误

### 禁止来自 Kotlin getter 的合成属性

> **问题**：[KTLC-272](https://youtrack.jetbrains.com/issue/KTLC-272)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：对于在 Kotlin 中定义的 getter，不再允许使用合成属性。这会影响 Java 类扩展 Kotlin 类的情况，以及处理 `java.util.LinkedHashSet` 等映射类型的情况。要进行迁移，请将属性访问替换为直接调用相应的 getter 函数。
>
> **弃用周期**：
>
> - 2.0.0：对于访问从 Kotlin getter 创建的合成属性报告警告
> - 2.2.0：将警告升级为错误

### 更改 JVM 上接口函数的默认方法生成方式

> **问题**：[KTLC-269](https://youtrack.jetbrains.com/issue/KTLC-269)
>
> **组件**：核心语言
>
> **不兼容更改类型**：二进制
>
> **简短摘要**：除非另有配置，接口中声明的函数现在被编译为 JVM 默认方法。当无关的超类型定义了冲突的实现时，这可能会导致 Java 代码中出现编译错误。该行为受稳定的 `-jvm-default` 编译器选项控制，该选项取代了现已弃用的 `-Xjvm-default` 选项。要恢复之前的行为（即仅在 `DefaultImpls` 类和子类中生成默认实现），请使用 `-jvm-default=disable`。
>
> **弃用周期**：
>
> - 2.2.0：`-jvm-default` 编译器选项默认设置为 `enable`

### 禁止在注解属性上使用针对字段的注解

> **问题**：[KTLC-7](https://youtrack.jetbrains.com/issue/KTLC-7)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：注解属性上不再允许使用针对字段的注解。虽然这些注解没有可观察到的效果，但此更改可能会影响依赖它们的自定义 IR 插件。要进行迁移，请移除属性上针对字段的注解。
>
> **弃用周期**：
>
> - 2.1.0：在注解属性上使用 `@JvmField` 注解被弃用并报告警告
> - 2.1.20：对注解属性上所有针对字段的注解报告警告
> - 2.2.0：将警告升级为错误

### 禁止在类型别名中使用 reified 类型形参

> **问题**：[KTLC-5](https://youtrack.jetbrains.com/issue/KTLC-5)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：类型别名中的类型形参不再允许使用 `reified` 修饰符。reified 类型形参仅在内联函数中有效，因此在类型别名中使用它们没有任何效果。要进行迁移，请从 `typealias` 声明中移除 `reified` 修饰符。
>
> **弃用周期**：
>
> - 2.1.0：对类型别名中的 reified 类型形参报告警告
> - 2.2.0：将警告升级为错误

### 修正 `Number` 和 `Comparable` 的内联值类类型检查

> **问题**：[KTLC-21](https://youtrack.jetbrains.com/issue/KTLC-21)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简短摘要**：在 `is` 和 `as` 检查中，内联值类不再被视为 `java.lang.Number` 或 `java.lang.Comparable` 的实现者。之前在应用于装箱的内联类时，这些检查会返回错误的结果。现在的优化仅适用于原始类型及其包装类。
>
> **弃用周期**：
>
> - 2.2.0：启用新行为

### 禁止来自间接依赖项的不可访问泛型类型

> **问题**：[KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：当使用编译器不可见的间接依赖项中的类型时，K2 编译器现在会报告错误。这会影响 lambda 形参或泛型类型实参等情况，其中引用的类型由于缺少依赖项而不可用。
>
> **弃用周期**：
>
> - 2.0.0：对 lambda 中不可访问的泛型类型以及不可访问泛型类型实参的选定用法报告错误；对 lambda 中不可访问的非泛型类型以及表达式类型和超类型中不可访问的类型实参报告警告
> - 2.1.0：将 lambda 中不可访问的非泛型类型的警告升级为错误
> - 2.2.0：将表达式类型中不可访问类型实参的警告升级为错误

### 强制执行类型形参上限的可见性检查

> **问题**：[KTLC-274](https://youtrack.jetbrains.com/issue/KTLC-274)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：函数和属性不能再使用比声明本身具有更严格可见性的类型形参上限。这可以防止间接暴露不可访问的类型，此前此类代码编译时不会报错，但在某些情况下会导致运行时故障或 IR 验证错误。
>
> **弃用周期**：
>
> - 2.1.0：当类型形参的上限在声明的可见性范围内不可见时，报告警告
> - 2.2.0：将警告升级为错误

### 在非私有内联函数中暴露私有类型时报告错误

> **问题**：[KT-70916](https://youtrack.jetbrains.com/issue/KT-70916)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：不再允许从非私有内联函数访问私有类型、函数或属性。要进行迁移，请避免引用私有实体、将函数设为私有，或移除 `inline` 修饰符。请注意，移除 `inline` 会破坏二进制兼容性。
>
> **弃用周期**：
>
> - 2.2.0：在从非私有内联函数访问私有类型或成员时报告错误

### 禁止在用作形参默认值的 lambda 中使用非局部返回

> **问题**：[KTLC-286](https://youtrack.jetbrains.com/issue/KTLC-286)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：在用作形参默认值的 lambda 中不再允许使用非局部返回语句。这种模式之前可以编译，但会导致运行时崩溃。要进行迁移，请重写 lambda 以避免非局部返回，或将逻辑移至默认值之外。
>
> **弃用周期**：
>
> - 2.2.0：对用作形参默认值的 lambda 中的非局部返回报告错误

## 标准库

### 弃用 `kotlin.native.Throws`

> **问题**：[KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **组件**：Kotlin/Native
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`kotlin.native.Throws` 已弃用；请改用通用的 [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) 注解。
>
> **弃用周期**：
>
> - 1.9.0：在使用 `kotlin.native.Throws` 时报告警告
> - 2.2.0：将警告升级为错误

### 弃用 `AbstractDoubleTimeSource`

> **问题**：[KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **组件**：kotlin-stdlib
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`AbstractDoubleTimeSource` 已弃用；请改用 [`AbstractLongTimeSource`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-abstract-long-time-source/)。
>
> **弃用周期**：
>
> - 1.8.20：在使用 `AbstractDoubleTimeSource` 时报告警告
> - 2.2.0：将警告升级为错误

## 工具

### 修正 `KotlinCompileTool` 中的 `setSource()` 函数以替换源码

> **问题**：[KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **组件**：Gradle
>
> **不兼容更改类型**：行为
>
> **简短摘要**：[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 接口中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函数现在会替换已配置的源码，而不是向其添加源码。如果你想在不替换现有源码的情况下添加源码，请使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函数。
>
> **弃用周期**：
>
> - 2.2.0：启用新行为

### 弃用 `KotlinCompilationOutput#resourcesDirProvider` 属性

> **问题**：[KT-70620](https://youtrack.jetbrains.com/issue/KT-70620)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`KotlinCompilationOutput#resourcesDirProvider` 属性已弃用。请在 Gradle 构建脚本中改用 [`KotlinSourceSet.resources`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/resources.html) 来添加额外的资源目录。
>
> **弃用周期**：
>
> - 2.1.0：`KotlinCompilationOutput#resourcesDirProvider` 已弃用并报告警告
> - 2.2.0：将警告升级为错误

### 弃用 `BaseKapt.annotationProcessorOptionProviders` 属性

> **问题**：[KT-58009](https://youtrack.jetbrains.com/issue/KT-58009)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：[`BaseKapt.annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 属性已弃用，取而代之的是 `BaseKapt.annotationProcessorOptionsProviders`，后者接受 `ListProperty<CommandLineArgumentProvider>` 而不是 `MutableList<Any>`。这明确定义了预期的元素类型，并防止因添加不正确的元素（如嵌套列表）而导致的运行时故障。如果你当前的代码将列表作为单个元素添加，请将 `add()` 函数替换为 `addAll()` 函数。
>
> **弃用周期**：
>
> - 2.2.0：在 API 中强制执行新类型

### 弃用 `kotlin-android-extensions` 插件

> **问题**：[KT-72341](https://youtrack.jetbrains.com/issue/KT-72341/)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`kotlin-android-extensions` 插件已弃用。请改用单独的插件 [`kotlin-parcelize`](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) 作为 `Parcelable` 实现生成器，并使用 Android Jetpack 的 [view bindings](https://developer.android.com/topic/libraries/view-binding) 取代合成视图。
>
> **弃用周期**：
>
> - 1.4.20：插件被弃用
> - 2.1.20：引入配置错误，且不再执行插件代码
> - 2.2.0：移除插件代码
> - 2.4.0：移除插件 ID

### 弃用 `kotlinOptions` DSL

> **问题**：[KT-54110](https://youtrack.jetbrains.com/issue/KT-54110)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：通过 `kotlinOptions` DSL 以及相关的 `KotlinCompile<KotlinOptions>` 任务接口配置编译器选项的能力已弃用，取而代之的是新的 `compilerOptions` DSL。作为此弃用的一部分，`kotlinOptions` 接口中的所有属性现在也被单独标记为已弃用。要进行迁移，请使用 `compilerOptions` DSL 配置编译器选项。有关迁移指南，请参阅[从 `kotlinOptions {}` 迁移到 `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
>
> **弃用周期**：
>
> - 2.0.0：对 `kotlinOptions` DSL 报告警告
> - 2.2.0：将警告升级为错误，并弃用 `kotlinOptions` 中的所有属性

### 移除 `kotlin.incremental.useClasspathSnapshot` 属性

> **问题**：[KT-62963](https://youtrack.jetbrains.com/issue/KT-62963)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`kotlin.incremental.useClasspathSnapshot` Gradle 属性已移除。该属性控制已弃用的基于 JVM 历史记录的增量编译模式，该模式已被自 Kotlin 1.8.20 起默认启用的基于类路径的方法所取代。
>
> **弃用周期**：
>
> - 2.0.20：弃用 `kotlin.incremental.useClasspathSnapshot` 属性并报告警告
> - 2.2.0：移除该属性

### Kotlin 脚本编写的弃用项

> **问题**：[KT-71685](https://youtrack.jetbrains.com/issue/KT-71685), [KT-75632](https://youtrack.jetbrains.com/issue/KT-75632/), [KT-76196](https://youtrack.jetbrains.com/issue/KT-76196/)。
>
> **组件**：脚本编写
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 2.2.0 弃用了对以下内容的支持：
>   * REPL：要继续通过 `kotlinc` 使用 REPL，请使用 `-Xrepl` 编译器选项进行选择加入。
>   * JSR-223：由于 [JSR](https://jcp.org/en/jsr/detail?id=223) 处于 **Withdrawn（已撤回）** 状态。JSR-223 实现继续支持语言版本 1.9，但未来没有迁移到 K2 编译器的计划。
>   * `KotlinScriptMojo` Maven 插件。如果你继续使用它，将会看到编译器警告。
>
> 欲了解更多信息，请参阅我们的[博客文章](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。
>
> **弃用周期**：
>
> - 2.1.0：弃用在 `kotlinc` 中使用 REPL 并报告警告
> - 2.2.0：要通过 `kotlinc` 使用 REPL，请使用 `-Xrepl` 编译器选项选择加入；弃用 JSR-223，可以通过切换到语言版本 1.9 来恢复支持；弃用 `KotlinScriptMojo` Maven 插件
> - 2.4.0：移除通过 `KotlinScriptMojo` Maven 插件执行的 Kotlin 脚本

### 弃用消除歧义的分类器属性

> **问题**：[KT-58231](https://youtrack.jetbrains.com/issue/KT-58231)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：用于控制 Kotlin Gradle 插件如何消除源集名称和 IDE 导入歧义的选项已经过时。因此，`KotlinTarget` 接口中的以下属性现已弃用：
>
> * `useDisambiguationClassifierAsSourceSetNamePrefix`
> * `overrideDisambiguationClassifierOnIdeImport`
>
> **弃用周期**：
>
> - 2.0.0：在使用这些 Gradle 属性时报告警告
> - 2.1.0：将此警告升级为错误
> - 2.2.0：移除 Gradle 属性

### 弃用 commonization 参数

> **问题**：[KT-75161](https://youtrack.jetbrains.com/issue/KT-75161)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin Gradle 插件中实验性 commonization 模式的参数已弃用。这些参数可能会产生无效的编译工件并被缓存。要删除受影响的工件：
>
> 1. 从 `gradle.properties` 文件中移除以下选项：
>
>    ```none
>    kotlin.mpp.enableOptimisticNumberCommonization
>    kotlin.mpp.enablePlatformIntegerCommonization
>    ```
>
> 2. 清除 `~/.konan/*/klib/commonized` 目录中的 commonization 缓存，或运行以下命令： 
>
>    ```bash
>    ./gradlew cleanNativeDistributionCommonization
>    ```
>
> **弃用周期**：
>
> - 2.2.0：弃用 commonization 参数并报告错误
> - 2.2.20：移除 commonization 参数

### 弃用对旧版元数据编译的支持

> **问题**：[KT-61817](https://youtrack.jetbrains.com/issue/KT-61817)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：用于设置分层结构以及在公共源集和中间源集之间创建中间源集的选项已经过时。以下编译器选项已被移除：
> 
> * `isCompatibilityMetadataVariantEnabled`
> * `withGranularMetadata`
> * `isKotlinGranularMetadataEnabled`
>
> **弃用周期**：
>
> - 2.2.0：从 Kotlin Gradle 插件中移除这些编译器选项

### 弃用 `KotlinCompilation.source` API

> **问题**：[KT-64991](https://youtrack.jetbrains.com/issue/KT-64991)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：允许将 Kotlin 源集直接添加到 Kotlin 编译中的 `KotlinCompilation.source` API 的访问已被弃用。
>
> **弃用周期**：
>
> - 1.9.0：在使用 `KotlinCompilation.source` 时报告警告
> - 1.9.20：将此警告升级为错误
> - 2.2.0：从 Kotlin Gradle 插件中移除 `KotlinCompilation.source`；尝试使用它会导致在构建脚本编译期间出现 "unresolved reference" 错误

### 弃用目标预设 API

> **问题**：[KT-71698](https://youtrack.jetbrains.com/issue/KT-71698)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 多平台目标的目标预设已经过时；`jvm()` 或 `iosSimulatorArm64()` 等目标 DSL 函数现在覆盖了相同的用例。所有与预设相关的 API 均已弃用：
> 
> * `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 属性
> * `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 接口及其所有继承者
> * `fromPreset` 重载
>
> **弃用周期**：
>
> - 1.9.20：对预设相关 API 的任何使用报告警告
> - 2.0.0：将此警告升级为错误
> - 2.2.0：从 Kotlin Gradle 插件的公共 API 中移除预设相关 API；仍然使用它的源码将失败并显示 "unresolved reference" 错误，二进制文件（例如 Gradle 插件）可能会失败并显示链接错误，除非针对最新版本的 Kotlin Gradle 插件重新编译

### 弃用 Apple 目标快捷方式

> **问题**：[KT-70615](https://youtrack.jetbrains.com/issue/KT-70615)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`ios()`、`watchos()` 和 `tvos()` 目标快捷方式在 Kotlin 多平台 DSL 中已弃用。这些快捷方式旨在为 Apple 目标部分创建源集层次结构。Kotlin 多平台 Gradle 插件现在提供内置的层次结构模板。现在应指定目标列表，而不是使用快捷方式，随后插件会自动为它们设置中间源集。
>
> **弃用周期**：
>
> - 1.9.20：在使用目标快捷方式时报告警告；取而代之的是默认启用内置层次结构模板
> - 2.1.0：在使用目标快捷方式时报告错误
> - 2.2.0：从 Kotlin 多平台 Gradle 插件中移除目标快捷方式 DSL

### 弃用 `publishAllLibraryVariants()` 函数

> **问题**：[KT-60623](https://youtrack.jetbrains.com/issue/KT-60623)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`publishAllLibraryVariants()` 函数已弃用。它旨在为 Android 目标发布所有构建变体。现在不推荐这种方法，因为它可能会导致变体解析问题，尤其是在使用多个 flavor 和构建类型时。请改用指定构建变体的 `publishLibraryVariants()` 函数。
>
> **弃用周期**：
>
> - 2.2.0：`publishAllLibraryVariants()` 已弃用

### 弃用 `android` 目标

> **问题**：[KT-71608](https://youtrack.jetbrains.com/issue/KT-71608)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：当前 Kotlin DSL 中的 `android` 目标名称已弃用。请改用 `androidTarget`。
>
> **弃用周期**：
>
> - 1.9.0：在 Kotlin 多平台项目中使用 `android` 名称时引入弃用警告
> - 2.1.0：将此警告升级为错误
> - 2.2.0：从 Kotlin 多平台 Gradle 插件中移除 `android` 目标 DSL

### 弃用 `CInteropProcess` 中的 `konanVersion`

> **问题**：[KT-71069](https://youtrack.jetbrains.com/issue/KT-71069)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`CInteropProcess` 任务中的 `konanVersion` 属性已弃用。请改用 `CInteropProcess.kotlinNativeVersion`。
>
> **弃用周期**：
>
> - 2.1.0：在使用 `konanVersion` 属性时报告警告
> - 2.2.0：将此警告升级为错误
> - 2.3.0：从 Kotlin Gradle 插件中移除 `konanVersion` 属性

### 弃用 `CInteropProcess` 中的 `destinationDir`

> **问题**：[KT-71068](https://youtrack.jetbrains.com/issue/KT-71068)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`CInteropProcess` 任务中的 `destinationDir` 属性已弃用。请改用 `CInteropProcess.destinationDirectory.set()` 函数。
>
> **弃用周期**：
>
> - 2.1.0：在使用 `destinationDir` 属性时报告警告
> - 2.2.0：将此警告升级为错误
> - 2.3.0：从 Kotlin Gradle 插件中移除 `destinationDir` 属性

### 弃用 `kotlinArtifacts` API

> **问题**：[KT-74953](https://youtrack.jetbrains.com/issue/KT-74953)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：实验性的 `kotlinArtifacts` API 已弃用。请使用 Kotlin Gradle 插件中现有的 DSL 来[构建最终的原生二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。如果这不足以满足迁移需求，请在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-74953)中留言。
>
> **弃用周期**：
>
> - 2.2.0：在使用 `kotlinArtifacts` API 时报告警告
> - 2.3.0：将此警告升级为错误