[//]: # (title: Kotlin 1.7.0 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_与_[舒适的更新](kotlin-evolution-principles.md)_是 Kotlin 语言设计的基本原则。前者指出应当移除阻碍语言演进的结构，后者则指出这种移除应当事先进行充分沟通，以使代码迁移尽可能顺畅。

虽然大多数语言变更已经通过其他渠道（如更新日志或编译器警告）发布，但本文档对这些变更进行了汇总，为从 Kotlin 1.6 迁移到 Kotlin 1.7 提供完整的参考。

## 基本术语

在本文档中，我们介绍了以下几种兼容性：

- _源码 (source)_：源码不兼容的变更会使原本可以正常编译（无错误或警告）的代码无法再通过编译。
- _二进制 (binary)_：如果交换两个二进制构件不会导致加载或链接错误，则称这两个二进制构件是二进制兼容的。
- _行为 (behavioral)_：如果同一程序在应用变更前后的行为不同，则称该变更为行为不兼容。

请记住，这些定义仅针对纯 Kotlin。从其他语言（例如 Java）的角度来看，Kotlin 代码的兼容性不在本文档的讨论范围内。

## 语言

<!--
### 标题

> **问题**：[KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：
>
> **弃用周期**：
>
> - 1.5.20：报告警告
> - 1.7.0：报告错误
-->

### 使安全调用结果始终为可空

> **问题**：[KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.7 将认为安全调用结果的类型始终为可空，即使安全调用的接收者是非空的
>
> **弃用周期**：
>
> - &lt;1.3：对非空接收者上的不必要安全调用报告警告
> - 1.6.20：额外警告不必要安全调用的结果类型将在下一版本中发生变化
> - 1.7.0：将安全调用结果的类型更改为可空，  
>   可以使用 `-XXLanguage:-SafeCallsAreAlwaysNullable` 临时恢复到 1.7 之前的行为

### 禁止将 super 调用委托给抽象超类成员

> **问题**：[KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
> 
> **简短摘要**：当显式或隐式 super 调用被委托给超类的 _abstract_ 成员时，即使超接口中存在默认实现，Kotlin 也会报告编译错误
>
> **弃用周期**：
>
> - 1.5.20：当使用未重写所有抽象成员的非抽象类时引入警告
> - 1.7.0：如果 super 调用实际上访问了超类中的抽象成员，则报告错误
> - 1.7.0：如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则报告错误；在 progressive 模式下报告错误
> - &gt;=1.8.0：在所有情况下均报告错误

### 禁止通过非公有主构造函数中声明的公有属性暴露非公有类型

> **问题**：[KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 将防止在私有主构造函数中声明具有非公有类型的公有属性。从另一个软件包访问此类属性可能会导致 `IllegalAccessError`
>
> **弃用周期**：
>
> - 1.3.20：对在非公有构造函数中声明且具有非公有类型的公有属性报告警告
> - 1.6.20：在 progressive 模式下将此警告提升为错误
> - 1.7.0：将此警告提升为错误

### 禁止访问以枚举名称限定的未初始化枚举成员

> **问题**：[KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.7 将禁止从枚举静态初始化块访问未初始化的枚举成员，当这些成员是以枚举名称限定时
>
> **弃用周期**：
>
> - 1.7.0：当从枚举静态初始化块访问未初始化的枚举成员时报告错误

### 禁止在 when 条件分支和循环条件中计算复杂布尔表达式的常量值

> **问题**：[KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 将不再基于字面量 `true` 和 `false` 以外的常量布尔表达式做出完备性（exhaustiveness）和控制流假设
>
> **弃用周期**：
>
> - 1.5.30：当根据 `when` 分支或循环条件中的复杂常量布尔表达式确定 `when` 的完备性或控制流可达性时，报告警告
> - 1.7.0：将此警告提升为错误

### 使以枚举、密封类和布尔值为受试对象的 when 语句默认完备

> **问题**：[KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.7 将针对以枚举、密封类或布尔值为受试对象且不完备的 `when` 语句报告错误
>
> **弃用周期**：
>
> - 1.6.0：当以枚举、密封类或布尔值为受试对象的 `when` 语句不完备时引入警告（在 progressive 模式下为错误）
> - 1.7.0：将此警告提升为错误

### 弃用 when-with-subject 中令人困惑的语法

> **问题**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 弃用了 `when` 条件表达式中几种令人困惑的语法结构
>
> **弃用周期**：
>
> - 1.6.20：对受影响的表达式引入弃用警告
> - 1.8.0：将此警告提升为错误
> - &gt;= 1.8：将一些弃用的结构重新用于新的语言功能

### 类型为 null 性增强改进

> **问题**：[KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.7 将更改其加载和解释 Java 代码中类型为 null 性注解的方式
>
> **弃用周期**：
>
> - 1.4.30：针对更精确的类型为 null 性可能导致错误的情况引入警告
> - 1.7.0：推断更精确的 Java 类型为 null 性，  
>   可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 临时恢复到 1.7 之前的行为

### 防止不同数值类型之间的隐式强制转换

> **问题**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简短摘要**：Kotlin 将避免在语义上仅需要向下转换 (downcast) 时自动将数值转换为原始数值类型
>
> **弃用周期**：
>
> - < 1.5.30：在所有受影响的情况下保持旧行为
> - 1.5.30：修复生成的属性委托访问器中的向下转换行为，  
>   可以使用 `-Xuse-old-backend` 临时恢复到 1.5.30 修复之前的行为
> - &gt;= 1.7.20：修复其他受影响情况下的向下转换行为

### 弃用编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **问题**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6.20 针对使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式发出警告
>
> **弃用周期**：
>
> - 1.6.20：对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.8.0：将此警告提升为错误

### 禁止调用名为 suspend 且带有尾随 lambda 的函数

> **问题**：[KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 不再允许调用名为 `suspend` 且具有单个函数类型参数作为尾随 lambda 传递的用户函数
>
> **弃用周期**：
>
> - 1.3.0：对此类函数调用引入警告
> - 1.6.0：将此警告提升为错误
> - 1.7.0：对语言语法引入更改，使得 `{` 之前的 `suspend` 被解析为关键字

### 如果基类来自另一个模块，禁止在基类属性上进行智能转换

> **问题**：[KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：如果超类位于另一个模块中，Kotlin 1.7 将不再允许在该超类的属性上进行智能转换
>
> **弃用周期**：
>
> - 1.6.0：对声明在位于另一个模块的超类中的属性进行智能转换时报告警告
> - 1.7.0：将此警告提升为错误，  
>   可以使用 `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` 临时恢复到 1.7 之前的行为

### 在类型推断过程中不要忽略有意义的约束

> **问题**：[KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：由于错误的优化，Kotlin 1.4−1.6 在类型推断过程中忽略了一些类型约束。这可能允许编写不安全的代码，从而在运行时导致 `ClassCastException`。Kotlin 1.7 考虑了这些约束，从而禁止了不安全的代码
>
> **弃用周期**：
>
> - 1.5.20：对如果考虑所有类型推断约束则会发生类型不匹配的表达式报告警告
> - 1.7.0：考虑所有约束，从而将此警告提升为错误，  
>   可以使用 `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` 临时恢复到 1.7 之前的行为

## 标准库

### 逐步将集合 min 和 max 函数的返回值类型更改为非空

> **问题**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源码
>
> **简短摘要**：集合 `min` 和 `max` 函数的返回值类型将在 Kotlin 1.7 中更改为非空
>
> **弃用周期**：
>
> - 1.4.0：引入 `...OrNull` 函数作为同义词，并弃用受影响的 API（详见问题说明）
> - 1.5.0：将受影响 API 的弃用级别提升为错误
> - 1.6.0：在公有 API 中隐藏已弃用的函数
> - 1.7.0：重新引入受影响的 API，但返回值类型为非空

### 弃用浮点数组函数：contains, indexOf, lastIndexOf

> **问题**：[KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 弃用了使用 IEEE-754 顺序而非总序比较值的浮点数组函数 `contains`、`indexOf`、`lastIndexOf`
>
> **弃用周期**：
>
> - 1.4.0：对受影响的函数发出弃用警告
> - 1.6.0：将弃用级别提升为错误
> - 1.7.0：在公有 API 中隐藏已弃用的函数

### 将声明从 kotlin.dom 和 kotlin.browser 软件包迁移到 kotlinx.*

> **问题**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源码
>
> **简短摘要**：`kotlin.dom` 和 `kotlin.browser` 软件包中的声明已移动到相应的 `kotlinx.*` 软件包中，以为从 stdlib 中提取它们做准备
>
> **弃用周期**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 软件包中引入替代 API
> - 1.4.0：弃用 `kotlin.dom` 和 `kotlin.browser` 软件包中的 API，并建议使用上述新 API 作为替代
> - 1.6.0：将弃用级别提升为错误
> - &gt;= 1.8：从 stdlib 中移除已弃用的函数
> - &gt;= 1.8：将 kotlinx.* 软件包中的 API 移至单独的库

### 弃用部分仅限 JS 的 API

> **问题**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源码
>
> **简短摘要**：stdlib 中许多仅限 JS 的函数已被弃用并准备移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及数组上接收比较函数的 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **弃用周期**：
>
> - 1.6.0：对受影响的函数发出弃用警告
> - 1.8.0：将弃用级别提升为错误
> - 1.9.0：从公有 API 中移除已弃用的函数

## 工具

### 移除 KotlinGradleSubplugin 类

> **问题**：[KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除 `KotlinGradleSubplugin` 类。请改用 `KotlinCompilerPluginSupportPlugin` 类
>
> **弃用周期**：
>
> - 1.6.0：将弃用级别提升为错误
> - 1.7.0：移除已弃用的类

### 移除 useIR 编译器选项

> **问题**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除已弃用且隐藏的 `useIR` 编译器选项
>
> **弃用周期**：
>
> - 1.5.0：将弃用级别提升为警告
> - 1.6.0：隐藏该选项
> - 1.7.0：移除已弃用的选项

### 弃用 kapt.use.worker.api Gradle 属性

> **问题**：[KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：弃用允许通过 Gradle Workers API 运行 kapt 的 `kapt.use.worker.api` 属性（默认值：true）
>
> **弃用周期**：
>
> - 1.6.20：将弃用级别提升为警告
> - &gt;= 1.8.0：移除此属性

### 移除 kotlin.experimental.coroutines Gradle DSL 选项和 kotlin.coroutines Gradle 属性

> **问题**：[KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除 `kotlin.experimental.coroutines` Gradle DSL 选项和 `kotlin.coroutines` 属性
>
> **弃用周期**：
>
> - 1.6.20：将弃用级别提升为警告
> - 1.7.0：移除 DSL 选项及其包含的 `experimental` 块，并移除该属性

### 弃用 useExperimentalAnnotation 编译器选项

> **问题**：[KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除用于在一个模块中选择使用 API 的隐藏 `useExperimentalAnnotation()` Gradle 函数。可以改用 `optIn()` 函数
> 
> **弃用周期：**
> 
> - 1.6.0：隐藏弃用选项
> - 1.7.0：移除已弃用的选项

### 弃用 kotlin.compiler.execution.strategy 系统属性

> **问题**：[KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：弃用用于选择编译器执行策略的 `kotlin.compiler.execution.strategy` 系统属性。请改用 Gradle 属性 `kotlin.compiler.execution.strategy` 或编译任务属性 `compilerExecutionStrategy`
>
> **弃用周期：**
>
> - 1.7.0：将弃用级别提升为警告
> - &gt; 1.7.0：移除该属性

### 移除 kotlinOptions.jdkHome 编译器选项

> **问题**：[KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除用于从指定位置（而非默认 `JAVA_HOME`）将自定义 JDK 包含到类路径中的 `kotlinOptions.jdkHome` 编译器选项。请改用 [Java 工具链](gradle-configure-project.md#gradle-java-toolchains-support)
>
> **弃用周期：**
>
> - 1.5.30：将弃用级别提升为警告
> - &gt; 1.7.0：移除该选项

### 移除 noStdlib 编译器选项

> **问题**：[KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除 `noStdlib` 编译器选项。Gradle 插件使用 `kotlin.stdlib.default.dependency=true` 属性来控制是否存在 Kotlin 标准库
>
> **弃用周期：**
>
> - 1.5.0：将弃用级别提升为警告
> - 1.7.0：移除该选项

### 移除 kotlin2js 和 kotlin-dce-plugin 插件

> **问题**：[KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除 `kotlin2js` 和 `kotlin-dce-plugin` 插件。请改用新的 `org.jetbrains.kotlin.js` 插件来替代 `kotlin2js`。当正确配置 Kotlin/JS Gradle 插件时，无效代码检测 (DCE) 即可正常工作
>
> **弃用周期：**
>
> - 1.4.0：将弃用级别提升为警告
> - 1.7.0：移除这些插件

### 编译任务的变更

> **问题**：[KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 编译任务不再继承 Gradle 的 `AbstractCompile` 任务，因此 `sourceCompatibility` 和 `targetCompatibility` 输入在 Kotlin 用户脚本中不再可用。`SourceTask.stableSources` 输入不再可用。`sourceFilesExtensions` 输入已被移除。弃用的 `Gradle destinationDir: File` 输出已被替换为 `destinationDirectory: DirectoryProperty` 输出。`KotlinCompile` 任务的 `classpath` 属性已被弃用
>
> **弃用周期：**
>
> - 1.7.0：输入不可用，输出被替换，`classpath` 属性被弃用