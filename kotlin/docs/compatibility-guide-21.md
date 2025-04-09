---
title: "Kotlin 2.1 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的根本原则之一。前者指出，应移除阻碍语言发展的结构，而后者指出，应事先充分沟通这些移除，以尽可能地使代码迁移顺利。

虽然大多数语言更改已通过其他渠道（如更新日志或编译器警告）宣布，但本文档对它们进行了总结，为从 Kotlin 2.0 迁移到 Kotlin 2.1 提供了完整的参考。

## 基本术语

在本文档中，我们介绍了几种兼容性：

- _源码兼容性 (source)_：源码不兼容的更改会阻止原本可以正常编译的代码（没有错误或警告）再也无法编译
- _二进制兼容性 (binary)_：如果互换两个二进制文件不会导致加载或链接错误，则称这两个二进制文件是二进制兼容的
- _行为兼容性 (behavioral)_：如果同一个程序在应用更改前后表现出不同的行为，则称更改是行为不兼容的

请记住，这些定义仅适用于纯 Kotlin。 Kotlin 代码从其他语言角度来看的兼容性
（例如，从 Java 角度来看）不在本文档的范围内。

## 语言

### 移除语言版本 1.4 和 1.5

> **问题**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: Kotlin 2.1 引入了语言版本 2.1，并移除了对语言版本 1.4 和 1.5 的支持。语言版本 1.6 和 1.7 已弃用。
>
> **弃用周期**:
>
> - 1.6.0: 报告语言版本 1.4 的警告
> - 1.9.0: 报告语言版本 1.5 的警告
> - 2.1.0: 报告语言版本 1.6 和 1.7 的警告；将语言版本 1.4 和 1.5 的警告升级为错误

### 更改 Kotlin/Native 上 `typeOf()` 函数的行为

> **问题**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 行为
>
> **简短摘要**: Kotlin/Native 上 `typeOf()` 函数的行为与 Kotlin/JVM 对齐，以确保跨平台的一致性。
>
> **弃用周期**:
>
> - 2.1.0: 对齐 Kotlin/Native 上 `typeOf()` 函数的行为

### 禁止通过类型参数的边界暴露类型

> **问题**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 现在禁止通过类型参数边界暴露具有较低可见性的类型，解决了类型可见性规则中的不一致问题。
> 此更改确保类型参数的边界遵循与类相同的可见性规则，从而防止 JVM 中出现 IR 验证错误之类的问题。
>
> **弃用周期**:
>
> - 2.1.0: 报告通过具有较低可见性的类型参数边界暴露类型的警告
> - 2.2.0: 将警告升级为错误

### 禁止继承具有相同名称的抽象 `var` 属性和 `val` 属性

> **问题**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 如果一个类从接口继承一个抽象 `var` 属性，并从超类继承一个具有相同名称的 `val` 属性，
> 现在会触发编译错误。 这解决了此类情况因缺少 setter 而导致的运行时崩溃问题。
>
> **弃用周期**:
>
> - 2.1.0: 当一个类从接口继承一个抽象 `var` 属性，并从超类继承一个具有相同名称的 `val` 属性时，报告警告（或渐进模式下的错误）
> - 2.2.0: 将警告升级为错误

### 报告访问未初始化的枚举条目的错误

> **问题**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 现在，当在枚举类或条目初始化期间访问未初始化的枚举条目时，编译器会报告错误。
> 这使行为与成员属性初始化规则保持一致，从而防止运行时异常并确保一致的逻辑。
>
> **弃用周期**:
>
> - 2.1.0: 报告访问未初始化的枚举条目的错误

### K2 智能类型转换传播中的更改

> **问题**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 行为
>
> **简短摘要**: K2 编译器通过引入推断变量（如 `val x = y`）的类型信息的双向传播来更改其智能类型转换传播的行为。 显式类型变量（例如 `val x: T = y`）
> 不再传播类型信息，从而确保更严格地遵守声明的类型。
>
> **弃用周期**:
>
> - 2.1.0: 启用新行为

### 更正 Java 子类中成员扩展属性覆盖的处理

> **问题**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 行为
>
> **简短摘要**: 由 Java 子类覆盖的成员扩展属性的 getter 现在在子类的作用域中被隐藏，
> 使其行为与常规 Kotlin 属性的行为保持一致。
>
> **弃用周期**:
>
> - 2.1.0: 启用新行为

### 更正 `var` 属性的 getter 和 setter 的可见性对齐，该属性覆盖受保护的 `val` 属性

> **问题**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 二进制
> 
> **简短摘要**: `var` 属性的 getter 和 setter 覆盖 `protected val` 属性的可见性现在是一致的，两者都继承了被覆盖的 `val` 属性的可见性。
>
> **弃用周期**:
>
> - 2.1.0: 在 K2 中强制执行 getter 和 setter 的一致可见性；K1 仍然不受影响

### 将 JSpecify 空安全不匹配诊断的严重性提高为错误

> **问题**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 来自 `org.jspecify.annotations` 的空安全不匹配（例如 `@NonNull`、`@Nullable` 和 `@NullMarked`）现在被视为错误而不是警告，
> 从而对 Java 互操作强制执行更严格的类型安全。 要调整这些诊断的严重性，请使用 `-Xnullability-annotations` 编译器选项。
>
> **弃用周期**:
>
> - 1.6.0: 报告潜在的空安全不匹配的警告
> - 1.8.20: 将警告扩展到特定的 JSpecify 注释，包括：`@Nullable`、`@NullnessUnspecified`、`@NullMarked` 以及 `org.jspecify.nullness` 中的旧注释（JSpecify 0.2 及更早版本）
> - 2.0.0: 添加对 `@NonNull` 注释的支持
> - 2.1.0: 将 JSpecify 注释的默认模式更改为 `strict`，将警告转换为错误；使用 `-Xnullability-annotations=@org.jspecify.annotations:warning` 或 `-Xnullability-annotations=@org.jspecify.annotations:ignore` 覆盖默认行为

### 更改重载解析以在不明确的情况下优先考虑扩展函数而不是 invoke 调用

> **问题**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 行为
> 
> **简短摘要**: 重载解析现在在不明确的情况下始终优先考虑扩展函数而不是 invoke 调用。
> 这解决了本地函数和属性的解析逻辑中的不一致问题。 此更改仅在重新编译后适用，不会影响预编译的二进制文件。
>
> **弃用周期**:
>
> - 2.1.0: 更改重载解析以始终优先考虑扩展函数而不是具有匹配签名的扩展函数的 `invoke` 调用；此更改仅在重新编译后适用，不会影响预编译的二进制文件

### 禁止从 JDK 函数接口的 SAM 构造函数中的 lambda 返回可空值

> **问题**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
> 
> **简短摘要**: 如果指定的类型参数不可为空，则从 JDK 函数接口的 SAM 构造函数中的 lambda 返回可空值现在会触发编译错误。
> 这解决了空安全不匹配可能导致运行时异常的问题，从而确保更严格的类型安全。
>
> **弃用周期**:
>
> - 2.0.0: 报告 JDK 函数接口的 SAM 构造函数中可空返回值的弃用警告
> - 2.1.0: 默认启用新行为

### 更正 Kotlin/Native 中与公共成员冲突的私有成员的处理

> **问题**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 行为
> 
> **简短摘要**: 在 Kotlin/Native 中，私有成员不再覆盖或与超类中的公共成员冲突，从而使行为与 Kotlin/JVM 保持一致。
> 这解决了覆盖解析中的不一致问题，并消除了由单独编译导致的意外行为。
>
> **弃用周期**:
>
> - 2.1.0: Kotlin/Native 中的私有函数和属性不再覆盖或影响超类中的公共成员，从而与 JVM 行为保持一致

### 禁止在公共内联函数中访问私有运算符函数

> **问题**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 私有运算符函数（如 `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()` 和 `next()`）不能再在公共内联函数中访问。
>
> **弃用周期**:
>
> - 2.0.0: 报告在公共内联函数中访问私有运算符函数的弃用警告
> - 2.1.0: 将警告升级为错误

### 禁止将无效参数传递给使用 @UnsafeVariance 注释的不变参数

> **问题**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 编译器现在在类型检查期间忽略 `@UnsafeVariance` 注释，从而对不变类型参数强制执行更严格的类型安全。
> 这可以防止依赖 `@UnsafeVariance` 绕过预期类型检查的无效调用。
>
> **弃用周期**:
>
> - 2.1.0: 激活新行为

### 报告警告级别 Java 类型的错误级别可空参数的空安全错误

> **问题**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 编译器现在检测 Java 方法中的空安全不匹配，其中警告级别的
> 可空类型包含具有更严格的错误级别空安全性的类型参数。
> 这确保了以前忽略的类型参数中的错误能够被正确报告。
>
> **弃用周期**:
>
> - 2.0.0: 报告具有更严格类型参数的 Java 方法中的空安全不匹配的弃用警告
> - 2.1.0: 将警告升级为错误

### 报告对无法访问类型的隐式使用

> **问题**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **组件**: 核心语言
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 编译器现在报告函数字面量和类型参数中无法访问类型的使用情况，
> 从而防止由于不完整的类型信息而导致的编译和运行时失败。
>
> **弃用周期**:
>
> - 2.0.0: 报告具有无法访问的非泛型类型的参数或接收者的函数字面量，以及具有无法访问的类型参数的类型；报告
> 具有无法访问的泛型类型的参数或接收者的函数字面量，以及在特定情况下具有无法访问的泛型类型参数的类型的错误
> - 2.1.0: 将具有无法访问的非泛型类型的参数和接收者的函数字面量的警告升级为错误
> - 2.2.0: 将具有无法访问的类型参数的类型的警告升级为错误

## 标准库

### 弃用 `Char` 和 `String` 的区域设置敏感的大小写转换函数

> **问题**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **组件**: kotlin-stdlib
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 在其他 Kotlin 标准库 API 中，`Char` 和 `String` 的区域设置敏感的大小写转换函数（例如 `Char.toUpperCase()` 和 `String.toLowerCase()`）已被弃用。
> 将它们替换为与区域设置无关的替代方案（例如 `String.lowercase()`），或者显式指定区域设置以实现区域设置敏感的行为（例如 `String.lowercase(Locale.getDefault())`）。
>
> 有关 Kotlin 2.1.0 中已弃用的 Kotlin 标准库 API 的完整列表，请参见 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)。
>
> **弃用周期**:
>
> - 1.4.30: 引入与区域设置无关的替代方案作为实验性 API
> - 1.5.0: 弃用区域设置敏感的大小写转换函数，并发出警告
> - 2.1.0: 将警告升级为错误

### 移除 kotlin-stdlib-common JAR 文件

> **问题**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **组件**: kotlin-stdlib
>
> **不兼容更改类型**: 二进制
>
> **简短摘要**: 以前用于旧版多平台声明元数据的 `kotlin-stdlib-common.jar` 文件已被弃用，并被 `.klib` 文件取代，作为通用多平台声明元数据的标准格式。
> 此更改不会影响主要的 `kotlin-stdlib.jar` 或 `kotlin-stdlib-all.jar` 文件。
>
> **弃用周期**:
>
> - 2.1.0: 弃用并移除 `kotlin-stdlib-common.jar` 文件

### 弃用 appendln()，支持 appendLine()

> **问题**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **组件**: kotlin-stdlib
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: `StringBuilder.appendln()` 已弃用，推荐使用 `StringBuilder.appendLine()`。
>
> **弃用周期**:
>
> - 1.4.0: `appendln()` 函数已弃用；使用时报告警告
> - 2.1.0: 将警告升级为错误

### 弃用 Kotlin/Native 中与冻结相关的 API

> **问题**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **组件**: kotlin-stdlib
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: Kotlin/Native 中与冻结相关的 API（以前使用 `@FreezingIsDeprecated` 注释标记）现在已弃用。
> 这与引入新的内存管理器相一致，该管理器消除了为线程共享而冻结对象的需求。
> 有关迁移的详细信息，请参见 [Kotlin/Native 迁移指南](native-migration-guide#update-your-code)。
>
> **弃用周期**:
>
> - 1.7.20: 弃用与冻结相关的 API，并发出警告
> - 2.1.0: 将警告升级为错误

### 更改 Map.Entry 行为以在结构修改时快速失败

> **问题**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **组件**: kotlin-stdlib
>
> **不兼容更改类型**: 行为
>
> **简短摘要**: 在与其关联的映射进行结构修改后访问 `Map.Entry` 键值对现在会抛出 `ConcurrentModificationException`。
>
> **弃用周期**:
>
> - 2.1.0: 检测到映射结构修改时抛出异常

## 工具

### 弃用 KotlinCompilationOutput#resourcesDirProvider

> **问题**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **组件**: Gradle
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: `KotlinCompilationOutput#resourcesDirProvider` 字段已弃用。
> 请在 Gradle 构建脚本中使用 `KotlinSourceSet.resources` 来添加其他资源目录。
> 
> **弃用周期**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` 已弃用

### 弃用 registerKotlinJvmCompileTask(taskName, moduleName) 函数

> **问题**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **组件**: Gradle
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: `registerKotlinJvmCompileTask(taskName, moduleName)` 函数已弃用，
> 推荐使用新的 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 函数，该函数现在接受 `KotlinJvmCompilerOptions`。
> 这允许您传递 `compilerOptions` 实例（通常来自扩展或目标），其值用作任务选项的约定。
>
> **弃用周期**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 函数已弃用

### 弃用 registerKaptGenerateStubsTask(taskName) 函数

> **问题**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **组件**: Gradle
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: `registerKaptGenerateStubsTask(taskName)` 函数已弃用。
> 请改用新的 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 函数。
> 这个新版本允许您将值作为约定从相关的 `KotlinJvmCompile` 任务链接，从而确保两个任务都使用同一组选项。
>
> **弃用周期**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 函数已弃用

### 弃用 KotlinTopLevelExtension 和 KotlinTopLevelExtensionConfig 接口

> **问题**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **组件**: Gradle
>
> **不兼容更改类型**: 行为
>
> **简短摘要**: `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 接口已弃用，推荐使用新的 `KotlinTopLevelExtension` 接口。
> 此接口合并了 `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension` 和 `KotlinProjectExtension`，
> 以简化 API 层次结构，并提供对 JVM 工具链和编译器属性的官方访问。
>
> **弃用周期**:
>
> - 2.1.0: `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 接口已弃用

### 从构建运行时依赖项中移除 kotlin-compiler-embeddable

> **问题**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **组件**: Gradle
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: `kotlin-compiler-embeddable` 依赖项已从 Kotlin Gradle 插件 (KGP) 的运行时中移除。
> 所需的模块现在直接包含在 KGP 文件中，Kotlin 语言版本限制为 2.0，以支持与低于 8.2 的版本中的 Gradle Kotlin 运行时的兼容性。
>
> **弃用周期**:
>
> - 2.1.0: 报告使用 `kotlin-compiler-embeddable` 的警告
> - 2.2.0: 将警告升级为错误

### 从 Kotlin Gradle 插件 API 隐藏编译器符号

> **问题**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **组件**: Gradle
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: Kotlin Gradle 插件 (KGP) 中捆绑的编译器模块符号（例如 `KotlinCompilerVersion`）
> 从公共 API 中隐藏，以防止在构建脚本中进行意外访问。
>
> **弃用周期**:
>
> - 2.1.0: 报告访问这些符号的警告
> - 2.2.0: 将警告升级为错误

### 添加对多个稳定性配置文件 (stability configuration files) 的支持

> **问题**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **组件**: Gradle
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: Compose 扩展中的 `stabilityConfigurationFile` 属性已弃用，
> 推荐使用新的 `stabilityConfigurationFiles` 属性，该属性允许指定多个配置文件。
>
> **弃用周期**:
>
> - 2.1.0: `stabilityConfigurationFile` 属性已弃用

### 移除已弃用的平台插件 ID

> **问题**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **组件**: Gradle
>
> **不兼容更改类型**: 源码
>
> **简短摘要**: 已移除对以下平台插件 ID 的支持：
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **弃用周期**:
>
> - 1.3: 平台插件 ID 已弃用
> - 2.1.0: 不再支持平台插件 ID