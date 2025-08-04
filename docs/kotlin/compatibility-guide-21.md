[//]: # (title: Kotlin 2.1 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计中的基本原则。前者指出应移除阻碍语言演进的结构，而后者则表示，在移除之前应事先充分沟通，以尽可能顺畅地进行代码迁移。

虽然大多数语言变更已通过其他渠道（例如更新日志或编译器警告）公布，但本文档总结了所有变更，为从 Kotlin 2.0 到 Kotlin 2.1 的迁移提供了完整参考。

## 基本术语

本文档中介绍了几种兼容性类型：

-   _源代码兼容性_：源代码不兼容的变更会阻止之前能够正常编译（无错误或警告）的代码继续编译。
-   _二进制兼容性_：如果互相替换两个二进制构件不会导致加载或链接错误，则称它们是二进制兼容的。
-   _行为兼容性_：如果同一个程序在应用变更前后表现出不同的行为，则称此变更是行为不兼容的。

请记住，这些定义仅适用于纯 Kotlin。从其他语言角度（例如 Java）来看的 Kotlin 代码兼容性超出了本文档的范围。

## 语言

### 移除语言版本 1.4 和 1.5

> **问题**：[KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：Kotlin 2.1 引入了语言版本 2.1，并移除了对语言版本 1.4 和 1.5 的支持。语言版本 1.6 和 1.7 已被弃用。
>
> **弃用周期**：
>
> -   1.6.0：报告语言版本 1.4 的警告
> -   1.9.0：报告语言版本 1.5 的警告
> -   2.1.0：报告语言版本 1.6 和 1.7 的警告；将语言版本 1.4 和 1.5 的警告提升为错误

### 变更 Kotlin/Native 上 typeOf() 函数的行为

> **问题**：[KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：`typeOf()` 函数在 Kotlin/Native 上的行为与 Kotlin/JVM 对齐，以确保跨平台的一致性。
>
> **弃用周期**：
>
> -   2.1.0：对齐 `typeOf()` 函数在 Kotlin/Native 上的行为

### 禁止通过类型形参界限暴露类型

> **问题**：[KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：现在禁止通过类型形参界限暴露可见性较低的类型，以此解决类型可见性规则中的不一致问题。此变更确保了类型形参的界限遵循与类相同的可见性规则，从而防止了诸如 JVM 中 IR 验证错误之类的问题。
>
> **弃用周期**：
>
> -   2.1.0：报告关于通过可见性较低的类型形参界限暴露类型的警告
> -   2.2.0：将警告提升为错误

### 禁止继承同名的抽象 var 属性和 val 属性

> **问题**：[KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：如果一个类从接口继承了一个抽象的 `var` 属性，同时从超类继承了一个同名的 `val` 属性，现在会触发编译错误。这解决了在这些情况下因缺少 setter 而导致的运行时崩溃问题。
>
> **弃用周期**：
>
> -   2.1.0：当一个类从接口继承了一个抽象的 `var` 属性，同时从超类继承了一个同名的 `val` 属性时，报告警告（或在渐进模式下为错误）
> -   2.2.0：将警告提升为错误

### 访问未初始化的枚举条目时报告错误

> **问题**：[KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：当在枚举类或条目初始化期间访问未初始化的枚举条目时，编译器现在会报告错误。这使得行为与成员属性初始化规则对齐，从而防止了运行时异常并确保了逻辑一致性。
>
> **弃用周期**：
>
> -   2.1.0：访问未初始化的枚举条目时报告错误

### K2 智能类型推断传播的变更

> **问题**：[KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：K2 编译器改变了其智能类型推断传播的行为，为推断的变量（例如 `val x = y`）引入了双向类型信息传播。显式类型化变量（例如 `val x: T = y`）不再传播类型信息，确保更严格地遵循声明的类型。
>
> **弃用周期**：
>
> -   2.1.0：启用新行为

### 纠正 Java 子类中成员扩展属性覆盖的处理

> **问题**：[KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：Java 子类覆盖的成员扩展属性的 getter 现在在其子类作用域中被隐藏，使其行为与常规 Kotlin 属性对齐。
>
> **弃用周期**：
>
> -   2.1.0：启用新行为

### 纠正 var 属性覆盖 protected val 时 getter 和 setter 的可见性对齐

> **问题**：[KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **组件**：核心语言
>
> **不兼容变更类型**：二进制
>
> **简要概述**：现在，覆盖 `protected val` 属性的 `var` 属性的 getter 和 setter 的可见性是一致的，两者都继承被覆盖的 `val` 属性的可见性。
>
> **弃用周期**：
>
> -   2.1.0：在 K2 中强制执行 getter 和 setter 的一致可见性；K1 不受影响

### 将 JSpecify 可空性不匹配诊断的严重性提升为错误

> **问题**：[KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：来自 `org.jspecify.annotations` 的可空性不匹配，例如 `@NonNull`、`@Nullable` 和 `@NullMarked`，现在被视为错误而非警告，以强制执行更严格的 Java 互操作空安全。要调整这些诊断的严重性，请使用 `-Xnullability-annotations` 编译器选项。
>
> **弃用周期**：
>
> -   1.6.0：报告潜在可空性不匹配的警告
> -   1.8.20：将警告扩展到特定的 JSpecify 注解，包括：`@Nullable`、`@NullnessUnspecified`、`@NullMarked`，以及 `org.jspecify.nullness` 中的旧版注解（JSpecify 0.2 及更早版本）
> -   2.0.0：添加对 `@NonNull` 注解的支持
> -   2.1.0：将 JSpecify 注解的默认模式更改为 `strict`，将警告转换为错误；使用 `-Xnullability-annotations=@org.jspecify.annotations:warning` 或 `-Xnullability-annotations=@org.jspecify.annotations:ignore` 来覆盖默认行为

### 在模糊情况下，变更重载解析以优先考虑扩展函数而非 invoke 调用

> **问题**：[KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：现在，在模糊情况下，重载解析始终优先考虑扩展函数而非 invoke 调用。这解决了局部函数和属性解析逻辑中的不一致问题。此变更仅在重新编译后生效，不影响预编译的二进制文件。
>
> **弃用周期**：
>
> -   2.1.0：变更重载解析以始终优先考虑具有匹配签名的扩展函数的 invoke 调用；此变更仅在重新编译后生效，不影响预编译的二进制文件

### 禁止在 JDK 函数接口的 SAM 构造函数中从 lambda 表达式返回可空值

> **问题**：[KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：现在，如果在 JDK 函数接口的 SAM 构造函数中，从 lambda 表达式返回可空值，且指定类型实参为非空的，则会触发编译错误。这解决了可空性不匹配可能导致运行时异常的问题，从而确保了更严格的类型安全。
>
> **弃用周期**：
>
> -   2.0.0：报告关于 JDK 函数接口的 SAM 构造函数中可空返回值弃用警告
> -   2.1.0：默认启用新行为

### 纠正 Kotlin/Native 中私有成员与公共成员冲突的处理

> **问题**：[KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：在 Kotlin/Native 中，私有成员不再覆盖或与超类中的公共成员冲突，使其行为与 Kotlin/JVM 对齐。这解决了覆盖解析中的不一致性，并消除了由单独编译引起的意外行为。
>
> **弃用周期**：
>
> -   2.1.0：Kotlin/Native 中的私有函数和属性不再覆盖或影响超类中的公共成员，使其行为与 JVM 对齐

### 禁止在公共内联函数中访问私有操作符函数

> **问题**：[KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：私有操作符函数，例如 `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()` 和 `next()`，不能再在公共内联函数中访问。
>
> **弃用周期**：
>
> -   2.0.0：报告关于在公共内联函数中访问私有操作符函数弃用警告
> -   2.1.0：将警告提升为错误

### 禁止向带有 @UnsafeVariance 注解的不型变形参传递无效实参

> **问题**：[KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：编译器现在在类型检测期间会忽略 `@UnsafeVariance` 注解，从而对不型变类型形参强制执行更严格的类型安全。这可以防止依赖 `@UnsafeVariance` 绕过预期类型检测的无效调用。
>
> **弃用周期**：
>
> -   2.1.0：激活新行为

### 报告警告级别 Java 类型的错误级别可空实参的空安全错误

> **问题**：[KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：编译器现在会检测 Java 方法中的可空性不匹配，即警告级别的可空类型包含具有更严格错误级别可空性的类型实参。这确保了之前在类型实参中被忽略的错误能被正确报告。
>
> **弃用周期**：
>
> -   2.0.0：报告关于 Java 方法中具有更严格类型实参的可空性不匹配弃用警告
> -   2.1.0：将警告提升为错误

### 报告对不可访问类型的隐式使用

> **问题**：[KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要概述**：编译器现在会报告函数字面量和类型实参中不可访问类型的使用，从而防止由于类型信息不完整导致的编译和运行时失败。
>
> **弃用周期**：
>
> -   2.0.0：报告关于参数或接收者为不可访问非泛型类型的函数字面量以及具有不可访问类型实参的类型警告；报告关于参数或接收者为不可访问泛型类型的函数字面量以及在特定场景下具有不可访问泛型类型实参的类型错误
> -   2.1.0：将参数和接收者为不可访问非泛型类型的函数字面量的警告提升为错误
> -   2.2.0：将具有不可访问类型实参的类型的警告提升为错误

## 标准库

### 弃用 Char 和 String 的区域敏感大小写转换函数

> **问题**：[KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源代码
>
> **简要概述**：在其他 Kotlin 标准库 API 中，对 `Char` 和 `String` 进行区域敏感大小写转换的函数，例如 `Char.toUpperCase()` 和 `String.toLowerCase()`，已被弃用。请将其替换为区域无关的替代方案，例如 `String.lowercase()`，或明确指定区域以实现区域敏感行为，例如 `String.lowercase(Locale.getDefault())`。
>
> 有关 Kotlin 2.1.0 中已弃用的 Kotlin 标准库 API 的完整列表，请参见 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)。
>
> **弃用周期**：
>
> -   1.4.30：引入区域无关的替代方案作为实验性 API
> -   1.5.0：弃用区域敏感大小写转换函数并报告警告
> -   2.1.0：将警告提升为错误

### 移除 kotlin-stdlib-common JAR 构件

> **问题**：[KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：二进制
>
> **简要概述**：`kotlin-stdlib-common.jar` 构件曾用于旧版多平台声明元数据，现已弃用，并由 `.klib` 文件取代，后者是公共多平台声明元数据的标准格式。此变更不影响主要的 `kotlin-stdlib.jar` 或 `kotlin-stdlib-all.jar` 构件。
>
> **弃用周期**：
>
> -   2.1.0：弃用并移除 `kotlin-stdlib-common.jar` 构件

### 弃用 appendln()，转而使用 appendLine()

> **问题**：[KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源代码
>
> **简要概述**：`StringBuilder.appendln()` 已被弃用，转而使用 `StringBuilder.appendLine()`。
>
> **弃用周期**：
>
> -   1.4.0：`appendln()` 函数被弃用；使用时报告警告
> -   2.1.0：将警告提升为错误

### 弃用 Kotlin/Native 中与冻结相关的 API

> **问题**：[KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源代码
>
> **简要概述**：Kotlin/Native 中与冻结相关的 API（之前已标记 `@FreezingIsDeprecated` 注解）现在已被弃用。这与引入新内存管理器保持一致，新管理器消除了为线程共享而冻结对象的需要。有关迁移详情，请参见 [Kotlin/Native 迁移指南](native-migration-guide.md#update-your-code)。
>
> **弃用周期**：
>
> -   1.7.20：弃用与冻结相关的 API 并报告警告
> -   2.1.0：将警告提升为错误

### 变更 Map.Entry 行为，使其在结构性修改时快速失败

> **问题**：[KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：行为
>
> **简要概述**：在其关联的 map 被结构性修改后访问 `Map.Entry` 键值对现在会抛出 `ConcurrentModificationException`。
>
> **弃用周期**：
>
> -   2.1.0：检测到 map 结构性修改时抛出异常

## 工具

### 弃用 KotlinCompilationOutput#resourcesDirProvider

> **问题**：[KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概述**：`KotlinCompilationOutput#resourcesDirProvider` 字段已弃用。请改用 Gradle 构建脚本中的 `KotlinSourceSet.resources` 来添加额外的资源目录。
>
> **弃用周期**：
>
> -   2.1.0：`KotlinCompilationOutput#resourcesDirProvider` 已弃用

### 弃用 registerKotlinJvmCompileTask(taskName, moduleName) 函数

> **问题**：[KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概述**：`registerKotlinJvmCompileTask(taskName, moduleName)` 函数已被弃用，转而使用新的 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 函数，该函数现在接受 `KotlinJvmCompilerOptions`。这允许您传递一个 `compilerOptions` 实例（通常来自扩展或目标），其值用作任务选项的约定。
>
> **弃用周期**：
>
> -   2.1.0：`registerKotlinJvmCompileTask(taskName, moduleName)` 函数已被弃用

### 弃用 registerKaptGenerateStubsTask(taskName) 函数

> **问题**：[KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概述**：`registerKaptGenerateStubsTask(taskName)` 函数已被弃用。请改用新的 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 函数。此新版本允许您将相关 `KotlinJvmCompile` 任务中的值作为约定链接，确保两个任务使用相同的选项集。
>
> **弃用周期**：
>
> -   2.1.0：`registerKaptGenerateStubsTask(taskName)` 函数已被弃用

### 弃用 KotlinTopLevelExtension 和 KotlinTopLevelExtensionConfig 接口

> **问题**：[KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **组件**：Gradle
>
> **不兼容变更类型**：行为
>
> **简要概述**：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 接口已被弃用，转而使用新的 `KotlinTopLevelExtension` 接口。此接口合并了 `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension` 和 `KotlinProjectExtension`，以简化 API 层次结构，并提供对 JVM 工具链和编译器属性的官方访问。
>
> **弃用周期**：
>
> -   2.1.0：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 接口已被弃用

### 从构建运行时依赖项中移除 kotlin-compiler-embeddable

> **问题**：[KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概述**：`kotlin-compiler-embeddable` 依赖项已从 Kotlin Gradle 插件（KGP）的运行时中移除。所需模块现在直接包含在 KGP 构件中，Kotlin 语言版本限制为 2.0，以支持与 8.2 以下版本的 Gradle Kotlin 运行时兼容。
>
> **弃用周期**：
>
> -   2.1.0：报告关于使用 `kotlin-compiler-embeddable` 的警告
> -   2.2.0：将警告提升为错误

### 从 Kotlin Gradle 插件 API 中隐藏编译器符号

> **问题**：[KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概述**：捆绑在 Kotlin Gradle 插件（KGP）中的编译器模块符号（例如 `KotlinCompilerVersion`）已从公共 API 中隐藏，以防止在构建脚本中意外访问。
>
> **弃用周期**：
>
> -   2.1.0：报告关于访问这些符号的警告
> -   2.2.0：将警告提升为错误

### 添加对多个稳定性配置文件支持

> **问题**：[KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概述**：Compose 扩展中的 `stabilityConfigurationFile` 属性已被弃用，转而使用新的 `stabilityConfigurationFiles` 属性，后者允许指定多个配置文件。
>
> **弃用周期**：
>
> -   2.1.0：`stabilityConfigurationFile` 属性已被弃用

### 移除已弃用的平台插件 ID

> **问题**：[KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要概述**：对这些平台插件 ID 的支持已被移除：
>
> *   `kotlin-platform-common`
> *   `org.jetbrains.kotlin.platform.common`
>
> **弃用周期**：
>
> -   1.3：平台插件 ID 被弃用
> -   2.1.0：平台插件 ID 不再受支持