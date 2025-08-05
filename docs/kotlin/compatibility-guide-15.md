[//]: # (title: Kotlin 1.5 兼容性指南)

_[保持语言的现代性](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的核心原则。前者指出应移除阻碍语言演进的构造，而后者则表示这种移除应提前充分沟通，以使代码迁移尽可能顺利。

虽然大多数语言变更已通过其他渠道（例如更新日志或编译器警告）发布，但本文档对其进行了汇总，为从 Kotlin 1.4 迁移到 Kotlin 1.5 提供了完整的参考。

## 基本术语

本文档中引入了几种兼容性：

*   _源兼容性_：源不兼容性变更是指曾经能够正常编译（无错误或警告）的代码不再编译通过。
*   _二进制兼容性_：如果两个二进制 artifact 相互替换不会导致加载或链接错误，则称它们是二进制兼容的。
*   _行为兼容性_：如果同一程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的。

请记住，这些定义仅适用于纯 Kotlin。Kotlin 代码与其他语言（例如 Java）的兼容性不在本文档的讨论范围之内。

## 语言与标准库 (stdlib)

### 禁止在签名多态调用中使用展开操作符

> **Issue**：[KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**：Core language
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：Kotlin 1.5 将禁止在签名多态调用中使用展开操作符（`*`）。
>
> **弃用周期**：
>
> *   < 1.5：在调用点对问题操作符引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 暂时恢复到 1.5 之前的行为。

### 禁止非抽象类包含从这些类中不可见的抽象成员（internal/package-private）

> **Issue**：[KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **Component**：Core language
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：Kotlin 1.5 将禁止非抽象类包含从这些类中不可见的抽象成员（internal/package-private）。
>
> **弃用周期**：
>
> *   < 1.5：对问题类引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` 暂时恢复到 1.5 之前的行为。

### 禁止将基于非具体化类型形参的数组用作 JVM 上的具体化类型实参

> **Issue**：[KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **Component**：Core language
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：Kotlin 1.5 将禁止将基于非具体化类型形参的数组用作 JVM 上的具体化类型实参。
>
> **弃用周期**：
>
> *   < 1.5：对问题调用引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` 暂时恢复到 1.5 之前的行为。

### 禁止不委托给主构造函数的二级枚举类构造函数

> **Issue**：[KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **Component**：Core language
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：Kotlin 1.5 将禁止不委托给主构造函数的二级枚举类构造函数。
>
> **弃用周期**：
>
> *   < 1.5：对问题构造函数引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` 暂时恢复到 1.5 之前的行为。

### 禁止私有 inline 函数暴露匿名类型

> **Issue**：[KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**：Core language
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：Kotlin 1.5 将禁止私有 inline 函数暴露匿名类型。
>
> **弃用周期**：
>
> *   < 1.5：对问题构造函数引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` 暂时恢复到 1.5 之前的行为。

### 禁止在 SAM 转换实参后传递非展开数组

> **Issue**：[KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **Component**：Core language
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：Kotlin 1.5 将禁止在 SAM 转换实参后传递非展开数组。
>
> **弃用周期**：
>
> *   1.3.70：对问题调用引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` 暂时恢复到 1.5 之前的行为。

### 支持下划线命名的 catch 代码块形参的特殊语义

> **Issue**：[KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **Component**：Core language
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：Kotlin 1.5 将禁止引用用于省略 catch 代码块中异常形参名称的下划线符号（`_`）。
>
> **弃用周期**：
>
> *   1.4.20：对问题引用引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` 暂时恢复到 1.5 之前的行为。

### 将 SAM 转换的实现策略从基于匿名类更改为 invokedynamic

> **Issue**：[KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **Component**：Kotlin/JVM
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：自 Kotlin 1.5 起，SAM（Single Abstract Method）转换的实现策略将从生成匿名类更改为使用 `invokedynamic` JVM 指令。
>
> **弃用周期**：
>
> *   1.5：更改 SAM 转换的实现策略，
>     可以使用 `-Xsam-conversions=class` 恢复实现方案到之前使用的方案。

### JVM IR 后端的性能问题

> **Issue**：[KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **Component**：Kotlin/JVM
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：Kotlin 1.5 默认使用 [基于 IR 的后端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/) 作为 Kotlin/JVM 编译器。旧后端仍然是早期语言版本的默认设置。
>
> 在 Kotlin 1.5 中使用新编译器时，你可能会遇到一些性能下降问题。我们正在努力解决这些情况。
>
> **弃用周期**：
>
> *   < 1.5：默认使用旧的 JVM 后端
> *   `>=` 1.5：默认使用基于 IR 的后端。如果你需要在 Kotlin 1.5 中使用旧后端，
>     将以下行添加到项目的配置文件中以暂时恢复到 1.5 之前的行为：
>
> 在 Gradle 中：
>
> <tabs>
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
> </tabs>
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
> 对此标志的支持将在未来的某个版本中移除。

### JVM IR 后端中的新字段排序

> **Issue**：[KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **Component**：Kotlin/JVM
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：自 1.5 版本起，Kotlin 使用 [基于 IR 的后端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)，它对 JVM 字节码的排序方式不同：它在构造函数中声明的字段生成在在代码块中声明的字段之前，而旧后端则相反。新的排序可能会改变使用依赖于字段顺序的序列化框架（例如 Java 序列化）的程序的行为。
>
> **弃用周期**：
>
> *   < 1.5：默认使用旧的 JVM 后端。它在代码块中声明的字段先于在构造函数中声明的字段。
> *   `>=` 1.5：默认使用新的基于 IR 的后端。在构造函数中声明的字段生成在在代码块中声明的字段之前。作为一种临时解决方案，你可以暂时切换到 Kotlin 1.5 中的旧后端。为此，
>     将以下行添加到项目的配置文件中：
>
> 在 Gradle 中：
>
> <tabs>
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
> </tabs>
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
> 对此标志的支持将在未来的某个版本中移除。

### 为在委托表达式中包含泛型调用的委托属性生成空安全断言

> **Issue**：[KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **Component**：Kotlin/JVM
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：自 Kotlin 1.5 起，Kotlin 编译器将为在委托表达式中包含泛型调用的委托属性发出空安全断言。
>
> **弃用周期**：
>
> *   1.5：为委托属性发出空安全断言（详情请参见 issue），
>     可以使用 `-Xuse-old-backend` 或 `-language-version 1.4` 暂时恢复到 1.5 之前的行为。

### 将使用 @OnlyInputTypes 注解的类型形参的调用的警告提升为错误

> **Issue**：[KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **Component**：Core language
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：Kotlin 1.5 将禁止 `contains`、`indexOf` 和 `assertEquals` 等具有无意义实参的调用，以提高类型安全。
>
> **弃用周期**：
>
> *   1.4.0：对问题构造函数引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-StrictOnlyInputTypesChecks` 暂时恢复到 1.5 之前的行为。

### 在带有命名 vararg 的调用中使用正确的实参执行顺序

> **Issue**：[KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **Component**：Kotlin/JVM
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：Kotlin 1.5 将更改带有命名 vararg 的调用中实参的执行顺序。
>
> **弃用周期**：
>
> *   < 1.5：对问题构造函数引入警告
> *   `>=` 1.5：将此警告提升为错误，
>     可以使用 `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` 暂时恢复到 1.5 之前的行为。

### 在操作符函数式调用中使用形参的默认值

> **Issue**：[KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **Component**：Kotlin/JVM
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：Kotlin 1.5 将在操作符调用中使用形参的默认值。
>
> **弃用周期**：
>
> *   < 1.5：旧行为（详情请参见 issue）
> *   `>=` 1.5：行为已更改，
>     可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 暂时恢复到 1.5 之前的行为。

### 如果常规数列为空，则在 for 循环中生成空的逆序数列

> **Issue**：[KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **Component**：Kotlin/JVM
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：如果常规数列为空，Kotlin 1.5 将在 for 循环中生成空的逆序数列。
>
> **弃用周期**：
>
> *   < 1.5：旧行为（详情请参见 issue）
> *   `>=` 1.5：行为已更改，
>     可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 暂时恢复到 1.5 之前的行为。

### 理顺 Char 到代码和 Char 到数字的转换

> **Issue**：[KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **Component**：kotlin-stdlib
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：自 Kotlin 1.5 起，Char 到数字类型的转换将被弃用。
>
> **弃用周期**：
>
> *   1.5：弃用 `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 以及像 `Long.toChar()` 这样的逆向函数，并提出替换方案。

### kotlin.text 函数中字符不区分大小写的比较不一致

> **Issue**：[KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **Component**：kotlin-stdlib
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：自 Kotlin 1.5 起，`Char.equals` 在不区分大小写的情况下将得到改进，它将首先比较字符的大写变体是否相等，然后比较这些大写变体（而非字符本身）的小写变体是否相等。
>
> **弃用周期**：
>
> *   < 1.5：旧行为（详情请参见 issue）
> *   1.5：更改 `Char.equals` 函数的行为。

### 移除默认的区分区域设置的大小写转换 API

> **Issue**：[KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**：kotlin-stdlib
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：自 Kotlin 1.5 起，默认的区分区域设置的大小写转换函数（例如 `String.toUpperCase()`）将被弃用。
>
> **弃用周期**：
>
> *   1.5：弃用使用默认区域设置的大小写转换函数（详情请参见 issue），并提出替换方案。

### 逐步将集合 min 和 max 函数的返回类型更改为非可空类型

> **Issue**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**：kotlin-stdlib (JVM)
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：集合 `min` 和 `max` 函数的返回类型将在 1.6 中更改为非可空类型。
>
> **弃用周期**：
>
> *   1.4：引入 `...OrNull` 函数作为同义词并弃用受影响的 API（详情请参见 issue）。
> *   1.5.0：将受影响 API 的弃用级别提升为错误。
> *   `>=`1.6：重新引入受影响的 API，但返回类型为非可空类型。

### 提高浮点类型转换为 Short 和 Byte 的弃用级别

> **Issue**：[KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**：kotlin-stdlib (JVM)
>
> **不兼容变更类型**：源兼容性
>
> **简要概述**：在 Kotlin 1.4 中以 `WARNING` 级别弃用的浮点类型到 `Short` 和 `Byte` 的转换，自 Kotlin 1.5.0 起将导致错误。
>
> **弃用周期**：
>
> *   1.4：弃用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 并提出替换方案。
> *   1.5.0：将弃用级别提升为错误。

## 工具

### 不在单个项目混用多个 JVM 变体的 kotlin-test

> **Issue**：[KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **Component**：Gradle
>
> **不兼容变更类型**：行为兼容性
>
> **简要概述**：如果一个项目通过传递依赖项引入了多个互斥的 `kotlin-test` 变体（针对不同的测试框架），则在 1.5.0 之前是允许的。从 1.5.0 开始，Gradle 将不允许存在针对不同测试框架的互斥 `kotlin-test` 变体。
>
> **弃用周期**：
>
> *   < 1.5：允许存在针对不同测试框架的多个互斥 `kotlin-test` 变体。
> *   `>=` 1.5：行为已更改，
>     Gradle 将抛出类似 "Cannot select module with conflict on capability..." 的异常。可能的解决方案：
>     *   使用与传递依赖项引入的 `kotlin-test` 变体和对应的测试框架。
>     *   寻找不传递引入 `kotlin-test` 变体的其他依赖项变体，这样你就可以使用你想要的测试框架。
>     *   寻找传递引入了另一个 `kotlin-test` 变体的依赖项变体，该变体使用了你想要的测试框架。
>     *   排除传递引入的测试框架。以下示例用于排除 JUnit 4：
>         ```groovy
>         configurations {
>             testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>         }
>         ```
>         排除测试框架后，测试你的应用程序。如果它停止工作，回滚排除更改，
>         使用库使用的相同测试框架，并排除你自己的测试框架。