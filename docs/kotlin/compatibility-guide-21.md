[//]: # (title: Kotlin 2.1 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的基本原则。前者指出，阻碍语言演进的结构应该被移除；后者则表明，这种移除应提前充分沟通，以使代码迁移尽可能顺利。

尽管大多数语言变更已通过其他渠道（如更新日志或编译器警告）公布，但本文档将它们全部汇总，为从 Kotlin 2.0 迁移到 Kotlin 2.1 提供完整的参考。

## 基本术语

本文档介绍了以下几种兼容性：

- _源代码_：源代码不兼容变更会使原本能够正常编译（无错误或警告）的代码无法再编译
- _二进制_：如果两个二进制工件的互相替换不会导致加载或链接错误，则称它们是二进制兼容的
- _行为_：如果同一程序在应用变更前后表现出不同的行为，则称该变更行为不兼容

请记住，这些定义仅适用于纯 Kotlin。Kotlin 代码从其他语言视角（例如，从 Java）的兼容性不在本文档的讨论范围之内。

## 语言

### 移除语言版本 1.4 和 1.5

> **问题**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: Kotlin 2.1 引入语言版本 2.1，并移除对语言版本 1.4 和 1.5 的支持。语言版本 1.6 和 1.7 已弃用。
>
> **弃用周期**:
>
> - 1.6.0: 对语言版本 1.4 报告警告
> - 1.9.0: 对语言版本 1.5 报告警告
> - 2.1.0: 对语言版本 1.6 和 1.7 报告警告；对语言版本 1.4 和 1.5 将警告提升为错误

### 改变 Kotlin/Native 上 typeOf() 函数的行为

> **问题**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要概述**: Kotlin/Native 上 `typeOf()` 函数的行为与 Kotlin/JVM 对齐，以确保跨平台一致性。
>
> **弃用周期**:
>
> - 2.1.0: 在 Kotlin/Native 上对齐 `typeOf()` 函数的行为

### 禁止通过类型参数的界限暴露类型

> **问题**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 现在禁止通过类型参数界限暴露低可见性类型，解决了类型可见性规则中的不一致问题。此变更确保类型参数的界限遵循与类相同的可见性规则，防止出现 JVM 中 IR 验证错误等问题。
>
> **弃用周期**:
>
> - 2.1.0: 对通过类型参数界限暴露低可见性类型报告警告
> - 2.2.0: 将警告提升为错误

### 禁止继承具有相同名称的抽象 var 属性和 val 属性

> **问题**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 如果一个类从接口继承抽象 `var` 属性，并且从超类继承同名 `val` 属性，现在会触发编译错误。这解决了此类情况下因缺少 setter 而导致的运行时崩溃。
>
> **弃用周期**:
>
> - 2.1.0: 当类从接口继承抽象 `var` 属性且从超类继承同名 `val` 属性时，报告警告（或在渐进模式下报告错误）
> - 2.2.0: 将警告提升为错误

### 访问未初始化的枚举条目时报告错误

> **问题**: [KT-68451](https://youtrack.com/issue/KT-68451)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 编译器现在会在枚举类或枚举条目初始化期间访问未初始化的枚举条目时报告错误。这使行为与成员属性初始化规则对齐，防止运行时异常并确保逻辑一致性。
>
> **弃用周期**:
>
> - 2.1.0: 在访问未初始化的枚举条目时报告错误

### K2 智能转换传播的变更

> **问题**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要概述**: K2 编译器通过为推断变量（如 `val x = y`）引入类型信息的双向传播，改变了其智能转换传播的行为。显式类型变量（如 `val x: T = y`）不再传播类型信息，确保更严格地遵循声明的类型。
>
> **弃用周期**:
>
> - 2.1.0: 启用新行为

### 纠正 Java 子类中成员扩展属性覆盖的处理方式

> **问题**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要概述**: 被 Java 子类覆盖的成员扩展属性的 getter 现在在子类的作用域中被隐藏，使其行为与常规 Kotlin 属性的行为对齐。
>
> **弃用周期**:
>
> - 2.1.0: 启用新行为

### 纠正 var 属性覆盖 protected val 属性时其 getter 和 setter 的可见性对齐

> **问题**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 二进制
>
> **简要概述**: `var` 属性覆盖 `protected val` 属性时，其 getter 和 setter 的可见性现在是一致的，两者都继承被覆盖 `val` 属性的可见性。
>
> **弃用周期**:
>
> - 2.1.0: 在 K2 中对 getter 和 setter 强制执行一致的可见性；K1 不受影响

### 将 JSpecify 可空性不匹配诊断的严重性提升为错误

> **问题**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 来自 `org.jspecify.annotations`（如 `@NonNull`、`@Nullable` 和 `@NullMarked`）的可空性不匹配现在被视为错误而非警告，对 Java 互操作性强制执行更严格的类型安全。要调整这些诊断的严重性，请使用 `-Xnullability-annotations` 编译器选项。
>
> **弃用周期**:
>
> - 1.6.0: 对潜在的可空性不匹配报告警告
> - 1.8.20: 将警告扩展到特定的 JSpecify 注解，包括：`@Nullable`、`@NullnessUnspecified`、`@NullMarked` 以及 `org.jspecify.nullness` 中的旧有注解（JSpecify 0.2 及更早版本）
> - 2.0.0: 添加对 `@NonNull` 注解的支持
> - 2.1.0: 将 JSpecify 注解的默认模式更改为 `strict`，将警告转换为错误；使用 `-Xnullability-annotations=@org.jspecify.annotations:warning` 或 `-Xnullability-annotations=@org.jspecify.annotations:ignore` 来覆盖默认行为

### 更改重载解析以在模糊情况下优先考虑扩展函数而非 invoke 调用

> **问题**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要概述**: 重载解析现在在模糊情况下始终优先考虑扩展函数而非 `invoke` 调用。这解决了局部函数和属性解析逻辑中的不一致问题。此变更仅在重新编译后生效，不影响预编译的二进制文件。
>
> **弃用周期**:
>
> - 2.1.0: 更改重载解析，使其在签名匹配的扩展函数中始终优先考虑扩展函数而非 `invoke` 调用；此更改仅在重新编译后生效，不影响预编译的二进制文件

### 禁止从 JDK 函数接口的 SAM 构造函数中的 lambda 返回可空值

> **问题**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 如果指定的类型参数为非可空类型，现在从 JDK 函数接口的 SAM 构造函数中的 lambda 返回可空值会触发编译错误。这解决了可空性不匹配可能导致运行时异常的问题，确保更严格的类型安全。
>
> **弃用周期**:
>
> - 2.0.0: 对 JDK 函数接口的 SAM 构造函数中可空返回值报告弃用警告
> - 2.1.0: 默认启用新行为

### 纠正 Kotlin/Native 中私有成员与公共成员冲突的处理方式

> **问题**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要概述**: 在 Kotlin/Native 中，私有成员不再覆盖或与超类中的公共成员冲突，与 Kotlin/JVM 对齐。这解决了覆盖解析中的不一致性，并消除了由单独编译引起的意外行为。
>
> **弃用周期**:
>
> - 2.1.0: Kotlin/Native 中的私有函数和属性不再覆盖或影响超类中的公共成员，与 JVM 行为对齐

### 禁止在公共内联函数中访问私有操作符函数

> **问题**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 私有操作符函数，如 `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()` 和 `next()`，不再能在公共内联函数中访问。
>
> **弃用周期**:
>
> - 2.0.0: 对在公共内联函数中访问私有操作符函数报告弃用警告
> - 2.1.0: 将警告提升为错误

### 禁止向带有 @UnsafeVariance 注解的不变参数传递无效实参

> **问题**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 编译器现在会在类型检查期间忽略 `@UnsafeVariance` 注解，对不变类型参数强制执行更严格的类型安全。这防止了依赖 `@UnsafeVariance` 绕过预期类型检查的无效调用。
>
> **弃用周期**:
>
> - 2.1.0: 激活新行为

### 对警告级别的 Java 类型中错误级别的可空实参报告可空性错误

> **问题**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 编译器现在会检测 Java 方法中的可空性不匹配，其中警告级别的可空类型包含具有更严格的、错误级别的可空性的类型参数。这确保了以前被忽略的类型参数错误得到正确报告。
>
> **弃用周期**:
>
> - 2.0.0: 对 Java 方法中具有更严格类型参数的可空性不匹配报告弃用警告
> - 2.1.0: 将警告提升为错误

### 报告不可访问类型的隐式使用

> **问题**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 编译器现在会报告函数字面量和类型参数中不可访问类型的使用，防止因类型信息不完整导致的编译和运行时失败。
>
> **弃用周期**:
>
> - 2.0.0: 对参数或接收器为不可访问的非泛型类型的函数字面量以及具有不可访问类型参数的类型报告警告；在特定场景下，对参数或接收器为不可访问的泛型类型的函数字面量以及具有不可访问泛型类型参数的类型报告错误
> - 2.1.0: 对参数和接收器为不可访问的非泛型类型的函数字面量将警告提升为错误
> - 2.2.0: 对具有不可访问类型参数的类型将警告提升为错误

## 标准库

### 弃用 Char 和 String 的区分语言环境大小写转换函数

> **问题**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 在其他 Kotlin 标准库 API 中，`Char` 和 `String` 的区分语言环境大小写转换函数（如 `Char.toUpperCase()` 和 `String.toLowerCase()`）已弃用。请将它们替换为不区分语言环境的替代方案，例如 `String.lowercase()`，或显式指定语言环境以实现区分语言环境的行为，例如 `String.lowercase(Locale.getDefault())`。
>
> 有关 Kotlin 2.1.0 中弃用的 Kotlin 标准库 API 的完整列表，请参阅 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)。
>
> **弃用周期**:
>
> - 1.4.30: 引入不区分语言环境的替代方案作为实验性 API
> - 1.5.0: 弃用区分语言环境的大小写转换函数并报告警告
> - 2.1.0: 将警告提升为错误

### 移除 kotlin-stdlib-common JAR 工件

> **问题**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 二进制
>
> **简要概述**: `kotlin-stdlib-common.jar` 工件以前用于传统多平台声明元数据，现已弃用，并由 `.klib` 文件取代，后者作为通用多平台声明元数据的标准格式。此变更不影响主要的 `kotlin-stdlib.jar` 或 `kotlin-stdlib-all.jar` 工件。
>
> **弃用周期**:
>
> - 2.1.0: 弃用并移除 `kotlin-stdlib-common.jar` 工件

### 弃用 appendln()，推荐使用 appendLine()

> **问题**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: `StringBuilder.appendln()` 已弃用，推荐使用 `StringBuilder.appendLine()`。
>
> **弃用周期**:
>
> - 1.4.0: `appendln()` 函数已弃用；使用时报告警告
> - 2.1.0: 将警告提升为错误

### 弃用 Kotlin/Native 中与冻结相关的 API

> **问题**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: Kotlin/Native 中与冻结相关的 API（以前用 `@FreezingIsDeprecated` 注解标记）现在已弃用。这与引入新内存管理器对齐，新内存管理器消除了为线程共享冻结对象的需要。有关迁移详情，请参阅 [Kotlin/Native 迁移指南](native-migration-guide.md#update-your-code)。
>
> **弃用周期**:
>
> - 1.7.20: 弃用与冻结相关的 API 并报告警告
> - 2.1.0: 将警告提升为错误

### 更改 Map.Entry 行为，使其在结构性修改时快速失败

> **问题**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 行为
>
> **简要概述**: 在其关联的 map 被结构性修改后，访问 `Map.Entry` 的键值对现在会抛出 `ConcurrentModificationException`。
>
> **弃用周期**:
>
> - 2.1.0: 当检测到 map 结构性修改时抛出异常

## 工具

### 弃用 KotlinCompilationOutput#resourcesDirProvider

> **问题**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: `KotlinCompilationOutput#resourcesDirProvider` 字段已弃用。请改用 Gradle 构建脚本中的 `KotlinSourceSet.resources` 来添加额外的资源目录。
>
> **弃用周期**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` 已弃用

### 弃用 registerKotlinJvmCompileTask(taskName, moduleName) 函数

> **问题**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: `registerKotlinJvmCompileTask(taskName, moduleName)` 函数已弃用，推荐使用新的 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 函数，后者现在接受 `KotlinJvmCompilerOptions`。这允许您传递一个 `compilerOptions` 实例（通常来自扩展或目标），其值将用作任务选项的约定。
>
> **弃用周期**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 函数已弃用

### 弃用 registerKaptGenerateStubsTask(taskName) 函数

> **问题**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: `registerKaptGenerateStubsTask(taskName)` 函数已弃用。请改用新的 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 函数。这个新版本允许您从相关的 `KotlinJvmCompile` 任务链接值作为约定，确保两个任务使用相同的选项集。
>
> **弃用周期**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 函数已弃用

### 弃用 KotlinTopLevelExtension 和 KotlinTopLevelExtensionConfig 接口

> **问题**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 行为
>
> **简要概述**: `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 接口已弃用，推荐使用新的 `KotlinTopLevelExtension` 接口。此接口合并了 `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension` 和 `KotlinProjectExtension`，以简化 API 层次结构，并提供对 JVM 工具链和编译器属性的官方访问。
>
> **弃用周期**:
>
> - 2.1.0: `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 接口已弃用

### 从构建运行时依赖中移除 kotlin-compiler-embeddable

> **问题**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: `kotlin-compiler-embeddable` 依赖已从 Kotlin Gradle 插件 (KGP) 的运行时中移除。所需模块现在直接包含在 KGP 工件中，Kotlin 语言版本限制为 2.0，以支持与 8.2 以下版本的 Gradle Kotlin 运行时兼容。
>
> **弃用周期**:
>
> - 2.1.0: 对使用 `kotlin-compiler-embeddable` 报告警告
> - 2.2.0: 将警告提升为错误

### 从 Kotlin Gradle 插件 API 中隐藏编译器符号

> **问题**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 捆绑在 Kotlin Gradle 插件 (KGP) 中的编译器模块符号（如 `KotlinCompilerVersion`）从公共 API 中隐藏，以防止在构建脚本中进行意外访问。
>
> **弃用周期**:
>
> - 2.1.0: 对访问这些符号报告警告
> - 2.2.0: 将警告提升为错误

### 添加对多个稳定性配置文件的支持

> **问题**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: Compose 扩展中的 `stabilityConfigurationFile` 属性已弃用，推荐使用新的 `stabilityConfigurationFiles` 属性，后者允许指定多个配置文件。
>
> **弃用周期**:
>
> - 2.1.0: `stabilityConfigurationFile` 属性已弃用

### 移除已弃用的平台插件 ID

> **问题**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要概述**: 对这些平台插件 ID 的支持已移除：
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **弃用周期**:
>
> - 1.3: 平台插件 ID 已弃用
> - 2.1.0: 平台插件 ID 不再受支持