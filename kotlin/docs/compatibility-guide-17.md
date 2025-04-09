---
title: "Kotlin 1.7 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的根本原则。前者指出，应移除阻碍语言发展的结构；后者指出，应事先充分沟通移除行为，以尽可能平滑地进行代码迁移。

虽然大多数语言变更已通过其他渠道（如更新日志或编译器警告）发布，但本文档对所有变更进行了总结，为从 Kotlin 1.6 迁移到 Kotlin 1.7 提供了完整的参考。

## 基本术语

本文档介绍了以下几种兼容性：

- _source（源码）_：源码不兼容的变更会导致以前可以正常编译（没有错误或警告）的代码无法再编译。
- _binary（二进制文件）_：如果互换两个二进制文件不会导致加载或链接错误，则称它们是二进制文件兼容的。
- _behavioral（行为）_：如果同一个程序在应用变更前后表现出不同的行为，则称该变更在行为上是不兼容的。

请记住，这些定义仅适用于纯 Kotlin。从其他语言的角度来看，Kotlin 代码的兼容性（例如，从 Java 的角度来看）不在本文档的讨论范围内。

## 语言

<!--
### 标题

> **问题**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**:
>
> **弃用周期**:
>
> - 1.5.20: 警告
> - 1.7.0: 报告错误
-->

### 使安全调用结果始终可空

> **问题**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 1.7 将认为安全调用结果的类型始终是可空的，即使安全调用的接收者不可空
>
> **弃用周期**:
>
> - &lt;1.3: 报告对不可空接收器进行不必要的安全调用的警告
> - 1.6.20: 额外警告说，不必要的安全调用的结果将在下一个版本中更改其类型
> - 1.7.0: 将安全调用结果的类型更改为可空，可以使用 `-XXLanguage:-SafeCallsAreAlwaysNullable` 暂时恢复到 1.7 之前的行为

### 禁止将超类调用委托给抽象超类成员

> **问题**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 当显式或隐式超类调用被委托给超类的_抽象_成员时，Kotlin 将报告编译错误，即使超接口中存在默认实现
>
> **弃用周期**:
>
> - 1.5.20: 引入一个警告，当使用未覆盖所有抽象成员的非抽象类时
> - 1.7.0: 如果超类调用实际上访问了超类的抽象成员，则报告错误
> - 1.7.0: 如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则报告错误；在渐进模式下报告错误
> - &gt;=1.8.0: 在所有情况下报告错误

### 禁止通过在非公共主构造函数中声明的公共属性公开非公共类型

> **问题**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 将阻止在私有主构造函数中声明具有非公共类型的公共属性。从另一个包访问此类属性可能会导致 `IllegalAccessError`
>
> **弃用周期**:
>
> - 1.3.20: 报告一个警告，关于具有非公共类型并且在非公共构造函数中声明的公共属性
> - 1.6.20: 在渐进模式下将此警告提升为错误
> - 1.7.0: 将此警告提升为错误

### 禁止访问用枚举名称限定的未初始化枚举条目

> **问题**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 当这些条目用枚举名称限定时，Kotlin 1.7 将禁止从枚举静态初始化器块访问未初始化的枚举条目
>
> **弃用周期**:
>
> - 1.7.0: 当从枚举静态初始化器块访问未初始化的枚举条目时，报告错误

### 禁止在 when 条件分支和循环条件中计算复杂布尔表达式的常量值

> **问题**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 将不再基于文字 `true` 和 `false` 之外的常量布尔表达式进行穷举性和控制流假设
>
> **弃用周期**:
>
> - 1.5.30: 当 `when` 的穷举性或控制流可达性基于 `when` 分支或循环条件中的复杂常量布尔表达式确定时，报告警告
> - 1.7.0: 将此警告提升为错误

### 默认情况下，使具有枚举、密封类和布尔主体的 when 语句具有穷举性

> **问题**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 1.7 将报告关于具有枚举、密封类或布尔主体的 `when` 语句不具有穷举性的错误
>
> **弃用周期**:
>
> - 1.6.0: 当具有枚举、密封类或布尔主体的 `when` 语句不具有穷举性时，引入一个警告（在渐进模式下为错误）
> - 1.7.0: 将此警告提升为错误

### 弃用 with-subject 的 when 语句中令人困惑的语法

> **问题**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 1.6 弃用了 `when` 条件表达式中的几个令人困惑的语法结构
>
> **弃用周期**:
>
> - 1.6.20: 在受影响的表达式上引入弃用警告
> - 1.8.0: 将此警告提升为错误
> - &gt;= 1.8: 将一些弃用的结构重新用于新的语言特性

### 类型可空性增强改进

> **问题**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 1.7 将更改它在 Java 代码中加载和解释类型可空性注解的方式
>
> **弃用周期**:
>
> - 1.4.30: 为更精确的类型可空性可能导致错误的情况引入警告
> - 1.7.0: 推断 Java 类型更精确的可空性，可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 暂时恢复到 1.7 之前的行为

### 防止不同数值类型之间的隐式强制转换

> **问题**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简短摘要**: Kotlin 将避免自动将数值转换为基本数值类型，在这种情况下，语义上只需要向下转型到该类型
>
> **弃用周期**:
>
> - < 1.5.30: 所有受影响情况下的旧行为
> - 1.5.30: 修复生成的属性委托访问器中的向下转型行为，可以使用 `-Xuse-old-backend` 暂时恢复到 1.5.30 之前的修复行为
> - &gt;= 1.7.20: 修复其他受影响情况下的向下转型行为

### 弃用编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **问题**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 1.6.20 警告使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式
>
> **弃用周期**:
>
> - 1.6.20: 在 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式上引入警告
> - &gt;= 1.8.0: 将此警告提升为错误

### 禁止调用名为 suspend 且带有尾随 lambda 的函数

> **问题**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 1.6 不再允许调用名为 `suspend` 的用户函数，该函数具有作为尾随 lambda 传递的函数类型作为单个参数
>
> **弃用周期**:
>
> - 1.3.0: 在此类函数调用上引入警告
> - 1.6.0: 将此警告提升为错误
> - 1.7.0: 对语言语法进行更改，以便将 `{` 之前的 `suspend` 解析为关键字

### 如果基类来自另一个模块，则禁止对基类属性进行智能类型转换

> **问题**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 如果超类位于另一个模块中，Kotlin 1.7 将不再允许对超类的属性进行智能类型转换
>
> **弃用周期**:
>
> - 1.6.0: 报告对位于另一个模块的超类中声明的属性进行智能类型转换的警告
> - 1.7.0: 将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` 暂时恢复到 1.7 之前的行为

### 在类型推断期间不要忽略有意义的约束

> **问题**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 由于不正确的优化，Kotlin 1.4-1.6 在类型推断期间忽略了一些类型约束。它可能允许编写不健全的代码，导致运行时出现 `ClassCastException`。Kotlin 1.7 考虑了这些约束，因此禁止了不健全的代码
>
> **弃用周期**:
>
> - 1.5.20: 报告表达式的警告，如果在考虑所有类型推断约束的情况下，会发生类型不匹配
> - 1.7.0: 考虑所有约束，因此将此警告提升为错误，可以使用 `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` 暂时恢复到 1.7 之前的行为

## 标准库

### 逐步将集合 min 和 max 函数的返回类型更改为不可空

> **问题**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 集合 `min` 和 `max` 函数的返回类型将在 Kotlin 1.7 中更改为不可空
>
> **弃用周期**:
>
> - 1.4.0: 引入 `...OrNull` 函数作为同义词，并弃用受影响的 API（请参阅问题中的详细信息）
> - 1.5.0: 将受影响的 API 的弃用级别提升为错误
> - 1.6.0: 从公共 API 中隐藏已弃用的函数
> - 1.7.0: 重新引入受影响的 API，但具有不可空的返回类型

### 弃用浮点数组函数：contains、indexOf、lastIndexOf

> **问题**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 弃用浮点数组函数 `contains`、`indexOf`、`lastIndexOf`，这些函数使用 IEEE-754 顺序而不是总顺序比较值
>
> **弃用周期**:
>
> - 1.4.0: 弃用受影响的函数并发出警告
> - 1.6.0: 将弃用级别提升为错误
> - 1.7.0: 从公共 API 中隐藏已弃用的函数

### 将声明从 kotlin.dom 和 kotlin.browser 包迁移到 kotlinx.*

> **问题**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 来自 `kotlin.dom` 和 `kotlin.browser` 包的声明被移动到相应的 `kotlinx.*` 包中，以便为从 stdlib 中提取它们做准备
>
> **弃用周期**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替换 API
> - 1.4.0: 弃用 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并建议使用上面的新 API 作为替换
> - 1.6.0: 将弃用级别提升为错误
> - &gt;= 1.8: 从 stdlib 中删除已弃用的函数
> - &gt;= 1.8: 将 kotlinx.* 包中的 API 移动到单独的库中

### 弃用一些仅限 JS 的 API

> **问题**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: stdlib 中的一些仅限 JS 的函数已被弃用以进行删除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及在数组上采用比较函数的 `sort` 函数，例如，`Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **弃用周期**:
>
> - 1.6.0: 弃用受影响的函数并发出警告
> - 1.8.0: 将弃用级别提升为错误
> - 1.9.0: 从公共 API 中删除已弃用的函数

## 工具

### 删除 KotlinGradleSubplugin 类

> **问题**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 删除 `KotlinGradleSubplugin` 类。改用 `KotlinCompilerPluginSupportPlugin` 类
>
> **弃用周期**:
>
> - 1.6.0: 将弃用级别提升为错误
> - 1.7.0: 删除已弃用的类

### 删除 useIR 编译器选项

> **问题**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 删除已弃用和隐藏的 `useIR` 编译器选项
>
> **弃用周期**:
>
> - 1.5.0: 将弃用级别提升为警告
> - 1.6.0: 隐藏该选项
> - 1.7.0: 删除已弃用的选项

### 弃用 kapt.use.worker.api Gradle 属性

> **问题**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 弃用 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 kapt（默认值：true）
>
> **弃用周期**:
>
> - 1.6.20: 将弃用级别提升为警告
> - &gt;= 1.8.0: 删除此属性

### 删除 kotlin.experimental.coroutines Gradle DSL 选项和 kotlin.coroutines Gradle 属性

> **问题**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 删除 `kotlin.experimental.coroutines` Gradle DSL 选项和 `kotlin.coroutines` 属性
>
> **弃用周期**:
>
> - 1.6.20: 将弃用级别提升为警告
> - 1.7.0: 删除 DSL 选项、其封闭的 `experimental` 块和该属性

### 弃用 useExperimentalAnnotation 编译器选项

> **问题**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 删除隐藏的 `useExperimentalAnnotation()` Gradle 函数，该函数用于选择加入以使用模块中的 API。可以使用 `optIn()` 函数代替
> 
> **弃用周期:**
> 
> - 1.6.0: 隐藏弃用选项
> - 1.7.0: 删除已弃用的选项

### 弃用 kotlin.compiler.execution.strategy 系统属性

> **问题**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 弃用用于选择编译器执行策略的 `kotlin.compiler.execution.strategy` 系统属性。请改用 Gradle 属性 `kotlin.compiler.execution.strategy` 或编译任务属性 `compilerExecutionStrategy`
>
> **弃用周期:**
>
> - 1.7.0: 将弃用级别提升为警告
> - &gt; 1.7.0: 删除该属性

### 删除 kotlinOptions.jdkHome 编译器选项

> **问题**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 删除 `kotlinOptions.jdkHome` 编译器选项，该选项用于将指定位置的自定义 JDK 包含到类路径中，而不是默认的 `JAVA_HOME`。请改用 [Java toolchains](gradle-configure-project#gradle-java-toolchains-support) (Java 工具链)
>
> **弃用周期:**
>
> - 1.5.30: 将弃用级别提升为警告
> - &gt; 1.7.0: 删除该选项

### 删除 noStdlib 编译器选项

> **问题**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 删除 `noStdlib` 编译器选项。Gradle 插件使用 `kotlin.stdlib.default.dependency=true` 属性来控制 Kotlin 标准库是否存在
>
> **弃用周期:**
>
> - 1.5.0: 将弃用级别提升为警告
> - 1.7.0: 删除该选项

### 删除 kotlin2js 和 kotlin-dce-plugin 插件

> **问题**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 删除 `kotlin2js` 和 `kotlin-dce-plugin` 插件。代替 `kotlin2js`，使用新的 `org.jetbrains.kotlin.js` 插件。当 Kotlin/JS Gradle 插件[正确配置](http://javascript-dce)时，死代码消除 (DCE) 才会起作用

>
> **弃用周期:**
>
> - 1.4.0: 将弃用级别提升为警告
> - 1.7.0: 删除插件

### 编译任务中的更改

> **问题**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: Kotlin 编译任务不再继承 Gradle `AbstractCompile` 任务，因此 `sourceCompatibility` 和 `targetCompatibility` 输入在 Kotlin 用户的脚本中不再可用。`SourceTask.stableSources` 输入不再可用。`sourceFilesExtensions` 输入已删除。已弃用的 `Gradle destinationDir: File` 输出已替换为 `destinationDirectory: DirectoryProperty` 输出。`KotlinCompile` 任务的 `classpath` 属性已弃用
>
> **弃用周期:**
>
> - 1.7.0: 输入不可用，输出被替换，`classpath` 属性被弃用