[//]: # (title: Kotlin 1.7 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计中的基本原则。前者指出，阻碍语言演进的构造应被移除；后者则强调，此移除应提前充分沟通，以使代码迁移尽可能顺畅。

尽管大多数语言变更已通过其他渠道（例如更新日志或编译器警告）公布，但本文档总结了所有这些变更，为从 Kotlin 1.6 迁移到 Kotlin 1.7 提供了完整的参考。

## 基本术语

本文档中，我们引入了几种兼容性类型：

-   _源代码_：源代码不兼容的变更，导致原本可以正常编译（无错误或警告）的代码无法再编译。
-   _二进制_：如果两个二进制 artifact 互换不会导致加载或链接错误，则称它们是二进制兼容的。
-   _行为_：如果同一程序在应用变更前后表现出不同的行为，则称该变更行为不兼容。

请记住，这些定义仅适用于纯 Kotlin。从其他语言（例如 Java）角度看 Kotlin 代码的兼容性超出了本文档的范围。

## 语言

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 使安全调用结果始终可空

> **Issue**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 将始终把安全调用结果的类型视为可空，即使安全调用的接收者是非空的。
>
> **Deprecation cycle**:
>
> - <1.3: 对非空接收者的不必要安全调用报告警告
> - 1.6.20: 额外警告，不必要的安全调用的结果类型将在下一版本中改变
> - 1.7.0: 将安全调用结果的类型更改为可空，
> `-XXLanguage:-SafeCallsAreAlwaysNullable` 可用于临时恢复到 1.7 之前的行为

### 禁止将 `super` 调用委托给抽象超类成员

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 当显式或隐式 `super` 调用委托给超类的_抽象_成员时，Kotlin 将报告编译错误，即使超接口中有默认实现。
>
> **Deprecation cycle**:
>
> - 1.5.20: 当使用未覆盖所有抽象成员的非抽象类时引入警告
> - 1.7.0: 如果 `super` 调用实际上访问了超类中的抽象成员，则报告错误
> - 1.7.0: 如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则报告错误；在渐进模式下报告错误
> - >=1.8.0: 在所有情况下报告错误

### 禁止通过非公共主构造函数中声明的公共属性暴露非公共类型

> **Issue**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 将阻止在私有主构造函数中声明具有非公共类型的公共属性。从另一个包访问此类属性可能导致 `IllegalAccessError`。
>
> **Deprecation cycle**:
>
> - 1.3.20: 对具有非公共类型且在非公共构造函数中声明的公共属性报告警告
> - 1.6.20: 在渐进模式下将此警告提升为错误
> - 1.7.0: 将此警告提升为错误

### 禁止访问用枚举名称限定的未初始化枚举条目

> **Issue**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 将禁止在枚举静态初始化块中访问用枚举名称限定的未初始化枚举条目。
>
> **Deprecation cycle**:
>
> - 1.7.0: 在枚举静态初始化块中访问未初始化枚举条目时报告错误

### 禁止在 `when` 条件分支和循环条件中计算复杂布尔表达式的常量值

> **Issue**: [KT-39883](https://youtrack.com/issue/KT-39883)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 将不再基于除字面值 `true` 和 `false` 以外的常量布尔表达式进行穷尽性和控制流假设。
>
> **Deprecation cycle**:
>
> - 1.5.30: 当 `when` 的穷尽性或控制流可达性是基于 `when` 分支或循环条件中的复杂常量布尔表达式确定时，报告警告
> - 1.7.0: 将此警告提升为错误

### 默认使枚举、密封类和布尔类型作为主题的 `when` 语句穷尽化

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 将对以枚举、密封类或布尔类型作为主题的非穷尽 `when` 语句报告错误。
>
> **Deprecation cycle**:
>
> - 1.6.0: 当以枚举、密封类或布尔类型作为主题的 `when` 语句非穷尽时引入警告（渐进模式下为错误）
> - 1.7.0: 将此警告提升为错误

### 废弃 `when` 表达式中令人困惑的语法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 废弃了 `when` 条件表达式中几个令人困惑的语法构造。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对受影响的表达式引入废弃警告
> - 1.8.0: 将此警告提升为错误
> - >= 1.8: 将一些废弃的构造用于新的语言特性

### 类型可空性增强改进

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 将改变其加载和解释 Java 代码中类型可空性注解的方式。
>
> **Deprecation cycle**:
>
> - 1.4.30: 对更精确的类型可空性可能导致错误的情况引入警告
> - 1.7.0: 推断 Java 类型的更精确可空性，
> `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 可用于临时恢复到 1.7 之前的行为

### 防止不同数值类型之间的隐式强制转换

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 将避免在语义上仅需要向下转换为某个原生数值类型时，自动将数值转换为该类型。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 所有受影响案例中的旧行为
> - 1.5.30: 修复生成的属性委托访问器中的向下转换行为，
> `-Xuse-old-backend` 可用于临时恢复到 1.5.30 修复前的行为
> - >= 1.7.20: 修复其他受影响案例中的向下转换行为

### 废弃编译器选项 `-Xjvm-default` 的 `enable` 和 `compatibility` 模式

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20 对使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式发出警告。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - >= 1.8.0: 将此警告提升为错误

### 禁止调用名称为 `suspend` 且带有尾随 lambda 的函数

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 不再允许调用名称为 `suspend` 且以尾随 lambda 形式传入单个函数类型实参的用户函数。
>
> **Deprecation cycle**:
>
> - 1.3.0: 对此类函数调用引入警告
> - 1.6.0: 将此警告提升为错误
> - 1.7.0: 引入语言语法变更，使 `{` 之前的 `suspend` 被解析为关键字

### 禁止对来自另一个模块的基类属性进行智能转换

> **Issue**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 将不再允许对位于另一个模块中的超类属性进行智能转换。
>
> **Deprecation cycle**:
>
> - 1.6.0: 对在位于另一个模块中的超类中声明的属性进行智能转换报告警告
> - 1.7.0: 将此警告提升为错误，
> `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` 可用于临时恢复到 1.7 之前的行为

### 类型推断时勿忽略有意义的约束

> **Issue**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.4−1.6 由于不正确的优化，在类型推断时忽略了一些类型约束。这可能导致编写不健全的代码，并在运行时引发 `ClassCastException`。Kotlin 1.7 会考虑这些约束，从而禁止不健全的代码。
>
> **Deprecation cycle**:
>
> - 1.5.20: 对如果考虑所有类型推断约束就会发生类型不匹配的表达式报告警告
> - 1.7.0: 考虑所有约束，从而将此警告提升为错误，
> `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` 可用于临时恢复到 1.7 之前的行为

## 标准库

### 逐步更改集合 `min` 和 `max` 函数的返回类型为非空

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 集合 `min` 和 `max` 函数的返回类型将在 Kotlin 1.7 中更改为非空。
>
> **Deprecation cycle**:
>
> - 1.4.0: 引入 `...OrNull` 函数作为同义词并废弃受影响的 API（详见 issue）
> - 1.5.0: 将受影响 API 的废弃级别提升为错误
> - 1.6.0: 从公共 API 中隐藏废弃函数
> - 1.7.0: 重新引入受影响的 API，但返回类型为非空

### 废弃浮点数组函数：`contains`、`indexOf`、`lastIndexOf`

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 废弃浮点数组函数 `contains`、`indexOf`、`lastIndexOf`，这些函数使用 IEEE-754 顺序而不是全序来比较值。
>
> **Deprecation cycle**:
>
> - 1.4.0: 以警告形式废弃受影响的函数
> - 1.6.0: 将废弃级别提升为错误
> - 1.7.0: 从公共 API 中隐藏废弃函数

### 将 `kotlin.dom` 和 `kotlin.browser` 包中的声明迁移到 `kotlinx.*`

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` 和 `kotlin.browser` 包中的声明已移至对应的 `kotlinx.*` 包，为将其从标准库中提取做准备。
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替代 API
> - 1.4.0: 废弃 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并建议上述新 API 作为替代
> - 1.6.0: 将废弃级别提升为错误
> - >= 1.8: 从标准库中移除废弃函数
> - >= 1.8: 将 `kotlinx.*` 包中的 API 移动到单独的库

### 废弃部分仅 JS API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 标准库中一些仅 JS 函数已废弃以供移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比较函数的数组 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **Deprecation cycle**:
>
> - 1.6.0: 以警告形式废弃受影响的函数
> - 1.8.0: 将废弃级别提升为错误
> - 1.9.0: 从公共 API 中移除废弃函数

## 工具

### 移除 `KotlinGradleSubplugin` 类

> **Issue**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `KotlinGradleSubplugin` 类。请改用 `KotlinCompilerPluginSupportPlugin` 类。
>
> **Deprecation cycle**:
>
> - 1.6.0: 将废弃级别提升为错误
> - 1.7.0: 移除废弃类

### 移除 `useIR` 编译器选项

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除已废弃并隐藏的 `useIR` 编译器选项。
>
> **Deprecation cycle**:
>
> - 1.5.0: 将废弃级别提升为警告
> - 1.6.0: 隐藏该选项
> - 1.7.0: 移除废弃选项

### 废弃 `kapt.use.worker.api` Gradle 属性

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 废弃 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 kapt（默认值：true）。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将废弃级别提升为警告
> - >= 1.8.0: 移除此属性

### 移除 `kotlin.experimental.coroutines` Gradle DSL 选项和 `kotlin.coroutines` Gradle 属性

> **Issue**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `kotlin.experimental.coroutines` Gradle DSL 选项和 `kotlin.coroutines` 属性。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将废弃级别提升为警告
> - 1.7.0: 移除 DSL 选项、其包含的 `experimental` 代码块和该属性

### 废弃 `useExperimentalAnnotation` 编译器选项

> **Issue**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除用于选择性地使用模块中 API 的隐藏 `useExperimentalAnnotation()` Gradle 函数。请改用 `optIn()` 函数。
>
> **Deprecation cycle:**
>
> - 1.6.0: 隐藏废弃选项
> - 1.7.0: 移除废弃选项

### 废弃 `kotlin.compiler.execution.strategy` 系统属性

> **Issue**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 废弃用于选择编译器执行策略的 `kotlin.compiler.execution.strategy` 系统属性。请改用 Gradle 属性 `kotlin.compiler.execution.strategy` 或编译任务属性 `compilerExecutionStrategy`。
>
> **Deprecation cycle:**
>
> - 1.7.0: 将废弃级别提升为警告
> - > 1.7.0: 移除该属性

### 移除 `kotlinOptions.jdkHome` 编译器选项

> **Issue**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `kotlinOptions.jdkHome` 编译器选项，该选项用于从指定位置而非默认的 `JAVA_HOME` 包含自定义 JDK 到类路径。请改用 [Java 工具链](gradle-configure-project.md#gradle-java-toolchains-support)。
>
> **Deprecation cycle:**
>
> - 1.5.30: 将废弃级别提升为警告
> - > 1.7.0: 移除该选项

### 移除 `noStdlib` 编译器选项

> **Issue**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `noStdlib` 编译器选项。Gradle 插件使用 `kotlin.stdlib.default.dependency=true` 属性来控制 Kotlin 标准库是否存在。
>
> **Deprecation cycle:**
>
> - 1.5.0: 将废弃级别提升为警告
> - 1.7.0: 移除该选项

### 移除 `kotlin2js` 和 `kotlin-dce-plugin` 插件

> **Issue**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `kotlin2js` 和 `kotlin-dce-plugin` 插件。请改用新的 `org.jetbrains.kotlin.js` 插件来替代 `kotlin2js`。无用代码消除 (DCE) 在 Kotlin/JS Gradle 插件正确配置后即可工作。
>
> **Deprecation cycle:**
>
> - 1.4.0: 将废弃级别提升为警告
> - 1.7.0: 移除这些插件

### 编译任务的变更

> **Issue**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 编译任务不再继承 Gradle `AbstractCompile` 任务，因此 `sourceCompatibility` 和 `targetCompatibility` 输入在 Kotlin 用户脚本中不再可用。`SourceTask.stableSources` 输入不再可用。`sourceFilesExtensions` 输入已被移除。废弃的 `Gradle destinationDir: File` 输出已被 `destinationDirectory: DirectoryProperty` 输出替换。`KotlinCompile` 任务的 `classpath` 属性已废弃。
>
> **Deprecation cycle:**
>
> - 1.7.0: 输入不再可用，输出被替换，`classpath` 属性已废弃