[//]: # (title: Kotlin 2.3 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计中的基本原则。前者指出，阻碍语言演进的结构应该被移除；后者则强调，这种移除应提前充分沟通，以使代码迁移尽可能顺畅。

虽然大多数语言变更已通过更新日志或编译器警告等其他渠道公布，但本文档对所有变更进行了总结，为从 Kotlin 2.2 迁移到 Kotlin 2.3 提供了完整的参考。本文档还包括工具相关变更的信息。

## 基本术语

本文档介绍了以下几种兼容性：

- _源_：源不兼容变更是指，原本可以正常编译（无错误或警告）的代码变得无法编译。
- _二进制_：如果两个二进制构件互相替换不会导致加载或链接错误，则称它们是二进制兼容的。
- _行为_：如果同一程序在应用变更前后表现出不同的行为，则称该变更为行为不兼容。

请记住，这些定义仅适用于纯 Kotlin。Kotlin 代码与其他语言（例如 Java）的兼容性不在本文档讨论范围之内。

## 语言

### 移除对 `-language-version` 中 1.8 和 1.9 版本的支持

> **问题**: [KT-76343](https://youtrack.jetbrains.com/issue/KT-76343), [KT-76344](https://youtrack.jetbrains.com/issue/KT-76344)。
>
> **组件**: 编译器
>
> **不兼容变更类型**: 源
>
> **简述**: 从 Kotlin 2.3 开始，编译器不再支持 [`-language-version=1.8`](compiler-reference.md#language-version-version)。对 `-language-version=1.9` 的支持也已针对非 JVM 平台移除。
>
> **弃用周期**：
>
> - 2.2.0: 当对 1.8 和 1.9 版本使用 `-language-version` 时报告警告
> - 2.3.0: 对于在所有平台对 1.8 版本使用 `-language-version` 和在非 JVM 平台对 1.9 版本使用 `-language-version` 的情况，将警告升级为错误

### 报告对含类型别名的推断类型违反上限约束的错误

> **问题**: [KTLC-287](https://youtrack.jetbrains.com/issue/KTLC-287)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源
>
> **简述**: 以前，编译器从未报告过对推断类型违反上限约束的错误。这已在 Kotlin 2.3.0 中得到修复，从而在所有类型形参中一致地报告该错误。
>
> **弃用周期**：
>
> - 2.2.20: 报告由隐式类型实参导致的边界违反弃用警告
> - 2.3.0: 对于隐式类型实参上的 `UPPER_BOUND_VIOLATED`，将警告升级为错误

### 禁止在 `inline` 和 `crossinline` lambda 表达式上使用 `@JvmSerializableLambda` 注解

> **问题**: [KTLC-9](https://youtrack.jetbrains.com/issue/KTLC-9)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源
>
> **简述**: 你不能再将 `@JvmSerializableLambda` 注解应用于 `inline` 或 `crossinline` lambda 表达式。这些 lambda 表达式不可序列化，因此应用 `@JvmSerializableLambda` 没有效果。
>
> **弃用周期**：
>
> - 2.1.20: 当 `@JvmSerializableLambda` 应用于 `inline` 和 `crossinline` lambda 表达式时报告警告
> - 2.3.0: 将警告升级为错误；此变更可在渐进模式下启用

### 禁止当泛型签名不匹配时将 Kotlin 接口委托给 Java 类

> **问题**: [KTLC-267](https://youtrack.jetbrains.com/issue/KTLC-267)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 禁止将 Kotlin 接口委托给实现了带非泛型覆盖的泛型接口方法的 Java 类。以前，允许此行为会导致类型不匹配和在运行时报告 `ClassCastException` 异常。此变更将错误从运行时转移到编译期。
>
> **弃用周期**：
>
> - 2.1.20: 报告警告
> - 2.3.0: 将警告升级为错误

### 弃用在没有显式返回类型的表达式体函数中使用 `return` 语句

> **问题**: [KTLC-288](https://youtrack.jetbrains.com/issue/KTLC-288)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 现在弃用在函数的返回类型未显式声明时，在表达式体内部使用 `return`。
>
> **弃用周期**：
>
> - 2.3.0: 报告警告
> - 2.4.0: 将警告升级为错误

### 禁止通过类型别名从可空超类型继承

> **问题**: [KTLC-279](https://youtrack.jetbrains.com/issue/KTLC-279)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 现在在尝试通过类型别名从可空超类型继承时报告错误，这与它已处理直接可空超类型的方式保持一致。
>
> **弃用周期**：
>
> - 2.2.0: 报告警告
> - 2.3.0: 将警告升级为错误

### 统一顶层 lambda 表达式和调用实参的泛型签名生成

> **问题**: [KTLC-277](https://youtrack.jetbrains.com/issue/KTLC-277)
>
> **组件**: 反射
>
> **不兼容变更类型**: 行为
>
> **简述**: Kotlin 2.3.0 对顶层 lambda 表达式使用与对作为调用实参传递的 lambda 表达式相同的类型检查逻辑，确保在两种情况下泛型签名生成的一致性。
>
> **弃用周期**：
>
> - 2.3.0: 引入新行为；不适用于渐进模式

### 禁止具体化类型形参被推断为交集类型

> **问题**: [KTLC-13](https://youtrack.jetbrains.com/issue/KTLC-13)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 禁止具体化类型形参被推断为交集类型的情况，因为这可能导致不正确的运行时行为。
>
> **弃用周期**：
>
> - 2.1.0: 当具体化类型形参被推断为交集类型时报告警告
> - 2.3.0: 将警告升级为错误

### 禁止通过类型形参边界暴露可见性更低的类型

> **问题**: [KTLC-275](https://youtrack.jetbrains.com/issue/KTLC-275)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 禁止使用暴露可见性比函数或声明本身更受限制的类型的类型形参边界，使函数的规则与已应用于类的规则保持一致。
>
> **弃用周期**：
>
> - 2.1.0: 对有问题的类型形参边界报告警告
> - 2.3.0: 将警告升级为错误

## 标准库

### 弃用字符到数字的转换，并引入显式数字和代码 API

> **问题**: [KTLC-321](https://youtrack.jetbrains.com/issue/KTLC-321)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 弃用数字类型的 `Char.toX()` 和 `X.toChar()` 转换，并引入新的、显式的 API 以访问字符的代码和数字值。
>
> **弃用周期**：
>
> - 1.4.30: 将新函数作为实验性功能引入
> - 1.5.0: 将新函数提升为稳定版；为旧函数报告警告并提供替换建议
> - 2.3.0: 将警告升级为错误

### 弃用 `Number.toChar()` 函数

> **问题**: [KT-56822](https://youtrack.jetbrains.com/issue/KT-56822)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源
>
> **简述**: `Number.toChar()` 函数已弃用。请改用 `toInt().toChar()` 或 `Char` 构造函数。
>
> **弃用周期**：
>
> - 1.9.0: 当使用 `Number.toChar()` 函数时报告警告
> - 2.3.0: 将警告升级为错误

### 弃用 `String.subSequence(start, end)` 函数

> **问题**: [KTLC-282](https://youtrack.jetbrains.com/issue/KTLC-282)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源
>
> **简述**: `String.subSequence(start, end)` 函数已弃用。请改用 [`String.subSequence(startIndex, endIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/sub-sequence.html) 函数。
>
> **弃用周期**：
>
> - 1.0: 当使用 `String.subSequence(start, end)` 时报告警告
> - 2.3.0: 将警告升级为错误

### 弃用 `kotlin.io.createTempDirectory()` 和 `kotlin.io.createTempFile()` 函数

> **问题**: [KTLC-281](https://youtrack.jetbrains.com/issue/KTLC-281)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源
>
> **简述**: `kotlin.io.createTempDirectory()` 和 `kotlin.io.createTempFile()` 函数已弃用。请改用 [`kotlin.io.path.createTempDirectory()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-directory.html) 和 [`kotlin.io.path.createTempFile()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-file.html) 函数。
>
> **弃用周期**：
>
> - 1.4.20: 当使用 `kotlin.io.createTempDirectory()` 和 `kotlin.io.createTempFile()` 函数时报告警告
> - 2.3.0: 将警告升级为错误

### 隐藏 `InputStream.readBytes(Int)` 函数

> **问题**: [KTLC-280](https://youtrack.jetbrains.com/issue/KTLC-280)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源
>
> **简述**: 在长期弃用之后，`InputStream.readBytes(estimatedSize: Int = DEFAULT_BUFFER_SIZE): ByteArray` 函数现已隐藏。
>
> **弃用周期**：
>
> - 1.3.0: 报告警告
> - 1.5.0: 将警告升级为错误
> - 2.3.0: 隐藏该函数

### 统一 Kotlin/Native 堆栈跟踪打印与其他平台的方式

> **问题**: [KT-81431](https://youtrack.com/issue/KT-81431)
>
> **组件**: Kotlin/Native
>
> **不兼容变更类型**: 行为
>
> **简述**: 格式化异常堆栈跟踪时，如果相同的异常原因已被打印，则不会打印额外的原因。
>
> **弃用周期**：
>
> - 2.3.20: 统一 Kotlin/Native 异常堆栈跟踪格式化与所有其他 Kotlin 平台的方式

### 修正 `Iterable<T>.intersect()` 和 `Iterable<T>.subtract()` 的行为

> **问题**: [KTLC-268](https://youtrack.jetbrains.com/issue/KTLC-268)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 行为
>
> **简述**: [`Iterable<T>.intersect()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/intersect.html) 和 [`Iterable<T>.subtract()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/subtract.html) 函数现在在将每个接收者元素添加到结果 set 之前对其进行成员资格检测。结果 set 使用 `Any::equals` 比较元素，即使实参集合使用引用相等性（例如，`IdentityHashMap.keys`），也能确保正确的结果。
>
> **弃用周期**：
>
> - 2.3.0: 启用新行为

## 工具

### 使用 `kotlin-dsl` 和 `kotlin("jvm")` 插件时，Gradle 报告不支持的 KGP 版本警告

> **问题**: [KT-79851](https://youtrack.jetbrains.com/issue/KT-79851)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 行为
>
> **简述**: 在 Kotlin 2.3 中，如果你在 Gradle 项目中同时使用 `kotlin-dsl` **和** `kotlin("jvm")` 插件，你可能会看到一个关于不支持的 Kotlin Gradle 插件 (KGP) 版本的 Gradle 警告。
>
> **迁移步骤**：
>
> 一般来说，我们不建议在同一个 Gradle 项目中同时使用 `kotlin-dsl` 和 `kotlin("jvm")` 插件。此设置不受支持。
>
> 对于约定插件、预编译脚本插件或任何其他形式的未发布的构建逻辑，你有三个选项：
>
> 1. 不要显式应用 `kotlin("jvm")` 插件。相反，让 `kotlin-dsl` 插件自动提供兼容的 KGP 版本。
> 2. 如果你想显式应用 `kotlin("jvm")` 插件，请使用 [`embeddedKotlinVersion`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.kotlin.dsl/embedded-kotlin-version.html) 常量来指定嵌入式 Kotlin 版本。
>
>     要升级嵌入式 Kotlin 和语言版本，请更新你的 Gradle 版本。你可以在 Gradle 的 [Kotlin 兼容性说明](https://docs.gradle.org/current/userguide/compatibility.html#kotlin)中找到兼容的 Gradle 版本。
>
> 3. 不要使用 `kotlin-dsl` 插件。这可能更适合不与特定 Gradle 版本绑定的二进制插件。
>
> 作为最后的手段，你可以配置你的项目以使用语言版本 2.1 或更高版本，这会覆盖 `kotlin-dsl` 插件的冲突行为。但是，我们强烈建议不要这样做。
>
> 如果你在迁移过程中遇到困难，请通过我们的 [Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 上的 #gradle 频道寻求支持。
>
> **弃用周期**：
>
> - 2.3.0: 引入一个诊断，用于检测何时将 `kotlin-dsl` 插件与不兼容的编译器语言或 API 版本一起使用

### 弃用适用于 AGP 9.0.0 及更高版本的 `kotlin-android` 插件

> **问题**: [KT-81199](https://youtrack.jetbrains.com/issue/KT-81199)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 在 Kotlin 2.3.0 中，当使用 Android Gradle 插件 (AGP) 9.0.0 或更高版本时，`org.jetbrains.kotlin.android` 插件已弃用。
> 从 AGP 9.0.0 开始，[AGP 提供了内置的 Kotlin 支持](https://kotl.in/gradle/agp-built-in-kotlin)，因此不再需要 `kotlin-android` 插件。
>
> **弃用周期**：
>
> - 2.3.0: 当 `kotlin-android` 插件与 AGP 9.0.0 或更高版本一起使用，并且 `android.builtInKotlin` 和 `android.newDsl=false` 这两个 Gradle 属性都设置为 `false` 时报告警告

### 弃用 `testApi` 配置

> **问题**: [KT-63285](https://youtrack.jetbrains.com/issue/KT-63285)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 弃用 `testApi` 配置。此配置将测试依赖项和源代码暴露给其他模块，但 Gradle 不支持此行为。
>
> **迁移选项**：
> 将所有 `testApi()` 实例替换为 `testImplementation()`，并对其他变体也这样做。例如，将 `kotlin.sourceSets.commonTest.dependencies.api()` 替换为 `kotlin.sourceSets.commonTest.dependencies.implementation()`。
>
> 对于 Kotlin/JVM 项目，请考虑改用 Gradle 的 [测试夹具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)。
> 如果你希望在多平台项目中看到对测试夹具的支持，请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-63142) 中分享你的用例。
>
> **弃用周期**：
>
> - 2.3.0: 报告警告

### 弃用 `createTestExecutionSpec()` 函数

> **问题**: [KT-75449](https://youtrack.jetbrains.com/issue/KT-75449)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 弃用 `KotlinJsTestFramework` 接口中的 `createTestExecutionSpec()` 函数，因为它不再被使用。
>
> **弃用周期**：
>
> - 2.2.20: 报告警告
> - 2.3.0: 将警告升级为错误

### 移除 `closureTo()`, `createResultSet()` 和 `KotlinToolingVersionOrNull()` 函数

> **问题**: [KT-64273](https://youtrack.jetbrains.com/issue/KT-64273)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 从 `closure` DSL 中移除 `closureTo()` 和 `createResultSet()` 函数，因为它们不再使用。此外，`KotlinToolingVersionOrNull()` 函数也被移除。请改用 `KotlinToolingVersion()` 函数。
>
> **弃用周期**：
>
> - 1.7.20: 报告错误
> - 2.3.0: 移除这些函数

### 弃用 `ExtrasProperty` API

> **问题**: [KT-74915](https://youtrack.jetbrains.com/issue/KT-74915)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 自 Kotlin 2.0.0 以来已被弃用的 `ExtrasProperty` API 现已在 Kotlin 2.3.0 中内部化。请改用 Gradle 的 [`ExtraPropertiesExtension`](https://docs.gradle.org/current/dsl/org.gradle.api.plugins.ExtraPropertiesExtension.html) API 作为替代方案。
>
> **弃用周期**：
>
> - 2.0.0: 报告警告
> - 2.1.0: 将警告升级为错误
> - 2.3.0: 将 API 设为内部

### 弃用 `KotlinCompilation` 中的 `HasKotlinDependencies`

> **问题**: [KT-67290](https://youtrack.jetbrains.com/issue/KT-67290)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 弃用 [`KotlinCompilation`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compilation/) 中的 `HasKotlinDependencies` 接口。依赖项相关 API 现已通过 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) 接口暴露。
>
> **弃用周期**：
>
> - 2.3.0: 报告警告

### 弃用 npm 和 Yarn 包管理器内部函数和属性

> **问题**: [KT-81009](https://youtrack.jetbrains.com/issue/KT-81009)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 以下与 npm 和 Yarn 包管理器相关的函数和属性已弃用：
>
> * `CompositeDependency.dependencyName`, `CompositeDependency.dependencyVersion`, `CompositeDependency.includedBuildDir`。
> * `KotlinNpmInstallTask.Companion.NAME`。
> * `LockCopyTask.Companion.STORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.RESTORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.UPGRADE_PACKAGE_LOCK`。
> * `Npm.npmExec()`。
> * `NpmProject.require()`, `NpmProject.useTool()`。
> * `PublicPackageJsonTask.jsIrCompilation`。
> * `YarnBasics.yarnExec()`。
> * `YarnPlugin.Companion.STORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.RESTORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.UPGRADE_YARN_LOCK`。
> * `YarnSetupTask.Companion.NAME`。
>
> **弃用周期**：
>
> - 2.2.0 和 2.2.20: 当使用这些函数或属性时报告警告
> - 2.3.0: 将警告升级为错误

### 弃用对 PhantomJS 的支持

> **问题**: [KT-76019](https://youtrack.jetbrains.com/issue/KT-76019)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 由于 PhantomJS 不再维护，Kotlin 2.3.0 弃用 `NpmVersions` API 中的 `karmaPhantomjsLauncher` 属性。
>
> **弃用周期**：
>
> - 2.3.0: 报告警告

### 禁止对设置测试运行或 JavaScript 运行时的类进行子类化

> **问题**: [KT-75869](https://youtrack.jetbrains.com/issue/KT-75869), [KT-81007](https://youtrack.jetbrains.com/issue/KT-81007)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 2.3.0 禁止对以下类进行子类化：
>
> * `KotlinTest`
> * `KotlinNativeTest`
> * `KotlinJsTest`
> * `KotlinJsIrTarget`
> * `KotlinNodeJsIr`
> * `KotlinD8Ir`
> * `KotlinKarma`
> * `KotlinMocha`
> * `KotlinWebpack`
> * `TypeScriptValidationTask`
> * `YarnRootExtension`
>
> 这些类从未打算被子类化。所有子类化的用例现在都应由 Kotlin Gradle 插件 DSL 提供的配置块覆盖。
> 如果这些任务的现有 API 不满足你设置测试运行或 JavaScript 运行时的需求，请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-75869) 中分享你的反馈。
>
> **弃用周期**：
>
> - 2.2.0: 对创建这些类的子类的代码报告警告
> - 2.3.0: 将警告升级为错误

### 弃用 `ExperimentalWasmDsl` 注解类

> **问题**: [KT-81005](https://youtrack.jetbrains.com/issue/KT-81005)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: `ExperimentalWasmDsl` 注解类已弃用，因为该功能已移至 `kotlin-plugin-annotations` 模块。
>
> **弃用周期**：
>
> - 2.0.20: 报告警告
> - 2.3.0: 将警告升级为错误

### 弃用 `ExperimentalDceDsl` 注解类

> **问题**: [KT-81008](https://youtrack.jetbrains.com/issue/KT-81008)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: `ExperimentalDceDsl` 注解类不再使用，因此已弃用。
>
> **弃用周期**：
>
> - 2.2.0: 报告警告
> - 2.3.0: 将警告升级为错误

### 弃用 JavaScript 工具函数

> **问题**: [KT-81010](https://youtrack.jetbrains.com/issue/KT-81010)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 以下函数和属性仅供内部使用，因此已弃用：
>
> * `JsIrBinary.generateTs`
> * `KotlinJsIrLink.mode`
> * `NodeJsSetupTask.Companion.NAME`
> * `Appendable.appendConfigsFromDir()`
> * `ByteArray.toHex()`
> * `FileHasher.calculateDirHash()`
> * `String.jsQuoted()`
>
> **弃用周期**：
>
> - 2.2.0: 当使用 `KotlinJsIrLink.mode` 属性时报告警告
> - 2.2.0: 当使用 `NodeJsSetupTask.Companion.NAME` 属性和函数时报告警告
> - 2.2.20: 当使用 `JsIrBinary.generateTs` 属性时报告警告
> - 2.3.0: 将警告升级为错误

### 弃用已迁移的 D8 和 Binaryen 属性

> **问题**: [KT-81006](https://youtrack.jetbrains.com/issue/KT-81006)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 以下属性已弃用，因为它们已从 `org.jetbrains.kotlin.gradle.targets.js` 包迁移到 `org.jetbrains.kotlin.gradle.targets.wasm` 包：
>
> * `binaryen.BinaryenEnvSpec`
> * `binaryen.BinaryenExtension`
> * `binaryen.BinaryenPlugin`
> * `binaryen.BinaryenRootPlugin`
> * `BinaryenSetupTask.Companion.NAME`
> * `d8.D8EnvSpec`
> * `d8.D8Plugin`
> * `D8SetupTask.Companion.NAME`
>
> **弃用周期**：
>
> - 2.2.0: 报告警告
> - 2.3.0: 将警告升级为错误

### 弃用 `NodeJsExec` DSL 中的 `create()` 函数

> **问题**: [KT-81004](https://youtrack.jetbrains.com/issue/KT-81004)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: `NodeJsExec` DSL 的伴生对象中的 `create()` 函数已弃用。请改用 `register()` 函数。
>
> **弃用周期**：
>
> - 2.1.20: 报告警告
> - 2.3.0: 将警告升级为错误

### 弃用 `kotlinOptions` DSL 中的属性

> **问题**: [KT-76720](https://youtrack.jetbrains.com/issue/KT-76720)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 自 Kotlin 2.2.0 起，通过 `kotlinOptions` DSL 和相关的 `KotlinCompile<KotlinOptions>` 任务接口配置编译器选项的功能已被弃用，以支持新的 `compilerOptions` DSL。
> Kotlin 2.3.0 继续 `kotlinOptions` 接口中所有属性的弃用周期。
> 要进行迁移，请使用 `compilerOptions` DSL 配置编译器选项。关于迁移的指南，请参见 [从 `kotlinOptions {}` 迁移到 `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
>
> **弃用周期**：
>
> - 2.0.0: 对 `kotlinOptions` DSL 报告警告
> - 2.2.0: 将警告升级为错误并弃用 `kotlinOptions` 中的所有属性
> - 2.3.0: 对于 `kotlinOptions` 中的所有属性，将警告升级为错误

### 弃用 `kotlinArtifacts` API

> **问题**: [KT-77066](https://youtrack.jetbrains.com/issue/KT-77066)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 实验性的 `kotlinArtifacts` API 已弃用。请使用 Kotlin Gradle 插件中可用的当前 DSL 来[构建最终的原生二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。
> 如果这不足以进行迁移，请在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-74953)中留言。
>
> **弃用周期**：
>
> - 2.2.0: 当使用 `kotlinArtifacts` API 时报告警告
> - 2.3.0: 将此警告升级为错误

### 移除 `kotlin.mpp.resourcesResolutionStrategy` Gradle 属性

> **问题**: [KT-74955](https://youtrack.jetbrains.com/issue/KT-74955)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 之前，`kotlin.mpp.resourcesResolutionStrategy` Gradle 属性因为不再使用而被弃用。在 Kotlin 2.3.0 中，该 Gradle 属性被完全移除。
>
> **弃用周期**：
>
> - 2.2.0: 报告配置期诊断
> - 2.3.0: 移除该 Gradle 属性

### 弃用多平台 IDE 导入的旧模式

> **问题**: [KT-61127](https://youtrack.jetbrains.com/issue/KT-61127)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 在 Kotlin 2.3.0 之前，我们支持多种多平台 IDE 导入模式。现在，旧模式已被弃用，只留下一种模式可用。以前，旧模式通过使用 `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradle 属性启用。现在使用此属性会触发弃用警告。
>
> **弃用周期**：
>
> - 2.3.0: 当使用 `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradle 属性时报告警告

### 移除禁用精确编译备份的属性

> **问题**: [KT-81038](https://youtrack.jetbrains.com/issue/KT-81038)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: Kotlin 1.9.0 引入了一个针对增量编译的实验性优化，称为精确编译备份。经过成功测试后，此优化在 Kotlin 2.0.0 中默认启用。Kotlin 2.3.0 移除用于选择退出此优化的 `kotlin.compiler.preciseCompilationResultsBackup` 和 `kotlin.compiler.keepIncrementalCompilationCachesInMemory` Gradle 属性。
>
> **弃用周期**：
>
> - 2.1.20: 报告警告
> - 2.3.0: 移除这些属性

### 弃用 `CInteropProcess` 中的 `destinationDir`

> **问题**: [KT-74910](https://youtrack.jetbrains.com/issue/KT-74910)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: `CInteropProcess` 任务中的 `destinationDir` 属性已弃用。请改用 `CInteropProcess.destinationDirectory.set()` 函数。
>
> **弃用周期**：
>
> - 2.1.0: 当使用 `destinationDir` 属性时报告警告
> - 2.2.0: 将此警告升级为错误
> - 2.3.0: 隐藏 `destinationDir` 属性

### 弃用 `CInteropProcess` 中的 `konanVersion`

> **问题**: [KT-74911](https://youtrack.jetbrains.com/issue/KT-74911)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: `CInteropProcess` 任务中的 `konanVersion` 属性已弃用。请改用 `CInteropProcess.kotlinNativeVersion`。
>
> **弃用周期**：
>
> - 2.1.0: 当使用 `konanVersion` 属性时报告警告
> - 2.2.0: 将此警告升级为错误
> - 2.3.0: 隐藏 `konanVersion` 属性

### 移除 `KotlinCompile.classpathSnapshotProperties` 属性

> **问题**: [KT-76177](https://youtrack.jetbrains.com/issue/KT-76177)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: `kotlin.incremental.useClasspathSnapshot` Gradle 属性已在 Kotlin 2.2.0 中移除。
> 在 Kotlin 2.3.0 中，以下属性也已移除：
>
> * `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot`
> * `KotlinCompile.classpathSnapshotProperties.classpath`
>
> **弃用周期**：
>
> - 2.0.20: 弃用 `kotlin.incremental.useClasspathSnapshot` 属性并附带警告
> - 2.2.0: 移除 `kotlin.incremental.useClasspathSnapshot` 属性
> - 2.3.0: 移除 `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot` 和 `KotlinCompile.classpathSnapshotProperties.classpath` 属性

### 弃用 `getPluginArtifactForNative()` 函数

> **问题**: [KT-78870](https://youtrack.jetbrains.com/issue/KT-78870)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源
>
> **简述**: 在 Kotlin 2.2.20 中，[`getPluginArtifactForNative()` 函数已弃用](whatsnew2220.md#reduced-size-of-kotlin-native-distribution)。请改用 [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html) 函数。
>
> **弃用周期**：
>
> - 2.2.20: 报告警告
> - 2.3.0: 将警告升级为错误

## 构建工具移除

### 移除对 Ant 的支持

> **问题**: [KT-75875](https://youtrack.jetbrains.com/issue/KT-75875)
>
> **组件**: Ant
>
> **简述**: Kotlin 2.3.0 移除对 Ant 作为构建工具的支持。请改用 [Gradle](gradle.md) 或 [Maven](maven.md)。
>
> **弃用周期**：
>
> - 2.2.0: 报告警告
> - 2.3.0: 移除支持