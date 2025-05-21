---
title: "Kotlin 1.5 兼容性指南"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[便捷的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的基本原则。前者表示应该移除那些会阻碍语言发展的结构，后者表示应该提前充分沟通这种移除，以尽可能平滑地进行代码迁移。

虽然大多数语言变更已经通过其他渠道宣布，例如更新日志或编译器警告，但本文档对它们进行了总结，为从 Kotlin 1.4 迁移到 Kotlin 1.5 提供了完整的参考。

## 基本术语

在本文档中，我们介绍了几种兼容性：

- _source (源码兼容性)_：源码不兼容的变更会导致原本可以正常编译（没有错误或警告）的代码无法再编译
- _binary (二进制兼容性)_：如果交换两个二进制文件不会导致加载或链接错误，则称它们是二进制兼容的
- _behavioral (行为兼容性)_：如果同一个程序在应用变更前后表现出不同的行为，则称该变更为行为不兼容的

请记住，这些定义仅适用于纯 Kotlin 代码。 Kotlin 代码从其他语言角度来看的兼容性（例如，从 Java 角度）不在本文档的范围内。

## 语言和标准库

### 禁止在签名多态调用中使用 spread operator (展开运算符)

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**: Core language (核心语言)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.5 将禁止在签名多态调用中使用 spread operator (*)
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 在调用点对有问题的运算符引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 临时恢复到 1.5 之前的行为

### 禁止包含从该类不可见的抽象成员（internal/package-private）的非抽象类

> **Issue**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **Component**: Core language (核心语言)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.5 将禁止包含从该类不可见的抽象成员（internal/package-private）的非抽象类
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 对有问题的类引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` 临时恢复到 1.5 之前的行为

### 禁止在 JVM 上使用基于非具体化类型参数的数组作为具体化类型参数

> **Issue**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **Component**: Core language (核心语言)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.5 将禁止在 JVM 上使用基于非具体化类型参数的数组作为具体化类型参数
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 对有问题的调用引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` 临时恢复到 1.5 之前的行为

### 禁止不委托给主构造函数的二级 enum 类构造函数

> **Issue**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **Component**: Core language (核心语言)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.5 将禁止不委托给主构造函数的二级 enum 类构造函数
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 对有问题的构造函数引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` 临时恢复到 1.5 之前的行为

### 禁止从私有内联函数公开匿名类型

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language (核心语言)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.5 将禁止从私有内联函数公开匿名类型
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 对有问题的构造函数引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` 临时恢复到 1.5 之前的行为

### 禁止在带有 SAM 转换的参数之后传递非 spread 数组

> **Issue**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **Component**: Core language (核心语言)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.5 将禁止在带有 SAM 转换的参数之后传递非 spread 数组
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.3.70: 对有问题的调用引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` 临时恢复到 1.5 之前的行为

### 支持下划线命名 catch 块参数的特殊语义

> **Issue**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **Component**: Core language (核心语言)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.5 将禁止引用下划线符号 (`_`)，该符号用于省略 catch 块中异常的参数名称
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.4.20: 对有问题的引用引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` 临时恢复到 1.5 之前的行为

### 将 SAM 转换的实现策略从基于匿名类更改为 invokedynamic

> **Issue**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: 从 Kotlin 1.5 开始，SAM（单一抽象方法）转换的实现策略将从生成匿名类更改为使用 `invokedynamic` JVM 指令
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.5: 更改 SAM 转换的实现策略，可以使用 `-Xsam-conversions=class` 将实现方案恢复为之前的方案

### 基于 JVM IR 后端的性能问题

> **Issue**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: Kotlin 1.5 默认使用 Kotlin/JVM 编译器的 [基于 IR 的后端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)。旧后端仍然是早期语言版本的默认后端。
>
> 在 Kotlin 1.5 中使用新的编译器时，您可能会遇到一些性能下降问题。我们正在努力解决这些问题。
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 默认使用旧的 JVM 后端
> - &gt;= 1.5: 默认使用基于 IR 的后端。如果您需要在 Kotlin 1.5 中使用旧后端，请将以下行添加到项目的配置文件中，以临时恢复到 1.5 之前的行为：
>
> 在 Gradle 中：
>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
>
> 在 Maven 中：
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 此标志的支持将在未来的版本中删除。

### 基于 JVM IR 后端的新字段排序

> **Issue**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: 从 1.5 版本开始，Kotlin 使用 [基于 IR 的后端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)，它以不同的方式对 JVM 字节码进行排序：它在主体中声明的字段之前生成在构造函数中声明的字段，而旧后端则相反。 新的排序可能会改变使用依赖于字段顺序的序列化框架（例如 Java 序列化）的程序的行为。
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 默认使用旧的 JVM 后端。 它在构造函数中声明的字段之前具有在主体中声明的字段。
> - &gt;= 1.5: 默认使用新的基于 IR 的后端。 在构造函数中声明的字段在主体中声明的字段之前生成。 作为一种解决方法，您可以暂时切换到 Kotlin 1.5 中的旧后端。为此，请将以下行添加到项目的配置文件中：
>
> 在 Gradle 中：
>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
>
> 在 Maven 中：
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 此标志的支持将在未来的版本中删除。

### 为委托属性生成空值断言，并在委托表达式中使用泛型调用

> **Issue**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: 从 Kotlin 1.5 开始，Kotlin 编译器将为委托属性生成空值断言，并在委托表达式中使用泛型调用
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.5: 为委托属性发出空值断言（请参阅 issue 中的详细信息），可以使用 `-Xuse-old-backend` 或 `-language-version 1.4` 临时恢复到 1.5 之前的行为

### 将带有 @OnlyInputTypes 注释的类型参数的调用中的警告转换为错误

> **Issue**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **Component**: Core language (核心语言)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.5 将禁止使用无意义参数的 `contains`、`indexOf` 和 `assertEquals` 等调用，以提高类型安全性
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.4.0: 对有问题的构造函数引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-StrictOnlyInputTypesChecks` 临时恢复到 1.5 之前的行为

### 在具有命名 vararg 的调用中使用正确的参数执行顺序

> **Issue**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: Kotlin 1.5 将更改具有命名 vararg 的调用中的参数执行顺序
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 对有问题的构造函数引入警告
> - &gt;= 1.5: 将此警告提升为错误，可以使用 `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` 临时恢复到 1.5 之前的行为

### 在运算符函数调用中使用参数的默认值

> **Issue**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: Kotlin 1.5 将在运算符调用中使用参数的默认值
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 旧行为（请参阅 issue 中的详细信息）
> - &gt;= 1.5: 行为已更改，可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 临时恢复到 1.5 之前的行为

### 如果常规 progression (数列) 也为空，则在 for 循环中生成空的反向 progressions (数列)

> **Issue**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: 如果常规 progression (数列) 也为空，Kotlin 1.5 将在 for 循环中生成空的反向 progressions (数列)
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 旧行为（请参阅 issue 中的详细信息）
> - &gt;= 1.5: 行为已更改，可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 临时恢复到 1.5 之前的行为

### 理顺 Char 到代码和 Char 到数字的转换

> **Issue**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: 从 Kotlin 1.5 开始，将弃用 Char 到数字类型的转换
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.5: 弃用 `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 和反向函数（如 `Long.toChar()`），并提出替换方案

### kotlin.text 函数中字符的不一致的忽略大小写比较

> **Issue**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: 从 Kotlin 1.5 开始，`Char.equals` 将通过首先比较字符的大写变体是否相等，然后比较这些大写变体的 小写变体（而不是字符本身）是否相等，来改进忽略大小写的情况
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 旧行为（请参阅 issue 中的详细信息）
> - 1.5: 更改 `Char.equals` 函数的行为

### 删除默认的区域设置敏感的大小写转换 API

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: 从 Kotlin 1.5 开始，默认的区域设置敏感的大小写转换函数（如 `String.toUpperCase()`）将被弃用
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.5: 弃用带有默认区域设置的大小写转换函数（请参阅 issue 中的详细信息），并提出替换方案

### 逐步将集合 min 和 max 函数的返回类型更改为非空类型

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: 集合 `min` 和 `max` 函数的返回类型将在 1.6 中更改为非空类型
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.4: 引入 `...OrNull` 函数作为同义词，并弃用受影响的 API（请参阅 issue 中的详细信息）
> - 1.5.0: 将受影响的 API 的弃用级别提高到错误
> - &gt;=1.6: 重新引入受影响的 API，但使用非空返回类型

### 提高浮点类型到 Short 和 Byte 转换的弃用级别

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source (源码不兼容)
>
> **Short summary**: Kotlin 1.4 中已弃用且具有 `WARNING` 级别的浮点类型到 `Short` 和 `Byte` 的转换将从 Kotlin 1.5.0 开始导致错误。
>
> **Deprecation cycle (弃用周期)**:
>
> - 1.4: 弃用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 并提出替换方案
> - 1.5.0: 将弃用级别提高到错误

## 工具

### 不要在单个项目中混合使用 kotlin-test 的多个 JVM 变体

> **Issue**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral (行为不兼容)
>
> **Short summary**: 如果其中一个变体是由传递依赖项引入的，则项目中可能存在用于不同测试框架的几个互斥的 `kotlin-test` 变体。 从 1.5.0 开始，Gradle 将不允许具有用于不同测试框架的互斥的 `kotlin-test` 变体。
>
> **Deprecation cycle (弃用周期)**:
>
> - < 1.5: 允许具有用于不同测试框架的几个互斥的 `kotlin-test` 变体
> - &gt;= 1.5: 行为已更改，
> Gradle 抛出类似 "Cannot select module with conflict on capability..." 的异常。 可能的解决方案：
>    * 使用与传递依赖项带来的相同的 `kotlin-test` 变体和相应的测试框架。
>    * 查找不通过传递方式引入 `kotlin-test` 变体的依赖项的另一个变体，以便您可以使用您想要使用的测试框架。
>    * 查找通过传递方式引入另一个 `kotlin-test` 变体的依赖项的另一个变体，该变体使用您想要使用的相同测试框架。
>    * 排除通过传递方式引入的测试框架。 以下示例用于排除 JUnit 4：
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      排除测试框架后，测试您的应用程序。 如果它停止工作，则回滚排除更改，使用与库相同的测试框架，并排除您的测试框架。