[//]: # (title: Kotlin 1.5.x 兼容性指南)

_[保持语言现代](kotlin-evolution-principles.md)_和_[舒适更新](kotlin-evolution-principles.md)_是 Kotlin 语言设计的基本原则。前者指出应当移除阻碍语言演进的构造，而后者则指出这种移除应当事先进行良好的沟通，以使代码迁移尽可能顺畅。

虽然大多数语言更改已经通过其他渠道（如更新日志或编译器警告）公布，但本文档对它们进行了全面总结，为从 Kotlin 1.4 迁移到 Kotlin 1.5 提供了完整的参考。

## 基本术语

在本文档中，我们介绍了以下几种兼容性：

- _源码（source）_：源码不兼容的更改会使以前可以正常编译（没有错误或警告）的代码无法再编译。
- _二进制（binary）_：如果交换两个二进制构件不会导致加载或链接错误，则称它们是二进制兼容的。
- _行为（behavioral）_：如果同一程序在应用更改前后表现出不同的行为，则称该更改为行为不兼容。

请记住，这些定义仅针对纯 Kotlin。从其他语言（例如 Java）的角度来看 Kotlin 代码的兼容性不在本文档的讨论范围之内。

## 语言与标准库

### 在签名多态（signature-polymorphic）调用中禁止使用星号操作符

> **问题**：[KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简要总结**：Kotlin 1.5 将禁止在签名多态调用中使用星号操作符 (*)
>
> **弃用周期**：
>
> - < 1.5：在调用处为有问题的操作符引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 暂时恢复到 1.5 之前的行为

### 禁止包含对类不可见（internal/包私有）抽象成员的非抽象类

> **问题**：[KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简要总结**：Kotlin 1.5 将禁止包含对类不可见（internal/包私有）抽象成员的非抽象类
>
> **弃用周期**：
>
> - < 1.5：为有问题的类引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` 暂时恢复到 1.5 之前的行为

### 在 JVM 上禁止将基于非具体化（non-reified）类型形参的数组用作具体化（reified）类型实参

> **问题**：[KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简要总结**：Kotlin 1.5 将禁止在 JVM 上将基于非具体化类型形参的数组用作具体化类型实参
>
> **弃用周期**：
>
> - < 1.5：为有问题的调用引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` 暂时恢复到 1.5 之前的行为

### 禁止未委托给主构造函数的枚举类次构造函数

> **问题**：[KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简要总结**：Kotlin 1.5 将禁止未委托给主构造函数的枚举类次构造函数
>
> **弃用周期**：
>
> - < 1.5：为有问题的构造函数引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` 暂时恢复到 1.5 之前的行为

### 禁止从私有内联函数暴露匿名类型

> **问题**：[KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简要总结**：Kotlin 1.5 将禁止从私有内联函数暴露匿名类型
>
> **弃用周期**：
>
> - < 1.5：为有问题的构造函数引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` 暂时恢复到 1.5 之前的行为

### 禁止在带有 SAM 转换的实参之后传递非星号数组

> **问题**：[KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简要总结**：Kotlin 1.5 将禁止在带有 SAM 转换的实参之后传递非星号数组
>
> **弃用周期**：
>
> - 1.3.70：为有问题的调用引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` 暂时恢复到 1.5 之前的行为

### 支持下划线命名的 catch 块形参的特殊语义

> **问题**：[KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简要总结**：Kotlin 1.5 将禁止引用下划线符号 (`_`)，该符号用于在 catch 块中省略异常的形参名称
>
> **弃用周期**：
>
> - 1.4.20：为有问题的引用引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` 暂时恢复到 1.5 之前的行为

### 将 SAM 转换的实现策略从基于匿名类更改为 invokedynamic

> **问题**：[KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简要总结**：从 Kotlin 1.5 开始，SAM（单一抽象方法）转换的实现策略将从生成匿名类更改为使用 `invokedynamic` JVM 指令
>
> **弃用周期**：
>
> - 1.5：更改 SAM 转换的实现策略，
>  可以使用 `-Xsam-conversions=class` 将实现方案恢复为之前使用的方案

### 基于 JVM IR 的后端的性能问题

> **问题**：[KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简要总结**：Kotlin 1.5 默认对 Kotlin/JVM 编译器使用[基于 IR 的后端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)。早期的语言版本默认仍使用旧后端。
>
> 在 Kotlin 1.5 中使用新编译器时，你可能会遇到一些性能下降问题。我们正在努力修复此类情况。
>
> **弃用周期**：
>
> - < 1.5：默认使用旧 JVM 后端
> - >= 1.5：默认使用基于 IR 的后端。如果你需要在 Kotlin 1.5 中使用旧后端，
> 请在项目的配置文件中添加以下行，以暂时恢复到 1.5 之前的行为：
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

### 基于 JVM IR 的后端中的新字段排序

> **问题**：[KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简要总结**：从 1.5 版本开始，Kotlin 使用[基于 IR 的后端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)，它对 JVM 字节码的排序方式不同：它在生成正文中声明的字段之前，先生成在构造函数中声明的字段，而旧后端则相反。新的排序可能会改变使用依赖于字段顺序的序列化框架（如 Java 序列化）的程序的行为。
>
> **弃用周期**：
>
> - < 1.5：默认使用旧 JVM 后端。它在构造函数中声明的字段之前生成在正文中声明的字段。
> - >= 1.5：默认使用新的基于 IR 的后端。在正文中声明的字段之前生成在构造函数中声明的字段。作为权宜之计，你可以在 Kotlin 1.5 中暂时切换到旧后端。为此，请在项目的配置文件中添加以下行：
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

### 为委托表达式中包含泛型调用的委托属性生成为 null 性断言

> **问题**：[KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简要总结**：从 Kotlin 1.5 开始，Kotlin 编译器将为委托表达式中包含泛型调用的委托属性发出为 null 性断言
>
> **弃用周期**：
>
> - 1.5：为委托属性发出为 null 性断言（详见问题说明），
>  可以使用 `-Xuse-old-backend` 或 `-language-version 1.4` 暂时恢复到 1.5 之前的行为

### 将带有 @OnlyInputTypes 注解的类型形参调用的警告转为错误

> **问题**：[KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简要总结**：Kotlin 1.5 将禁止带有无意义实参的 `contains`、`indexOf` 和 `assertEquals` 等调用，以提高类型安全性
>
> **弃用周期**：
>
> - 1.4.0：为有问题的构造函数引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-StrictOnlyInputTypesChecks` 暂时恢复到 1.5 之前的行为

### 在带有具名可变参数的调用中使用正确的实参执行顺序

> **问题**：[KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简要总结**：Kotlin 1.5 将更改带有具名可变参数调用中的实参执行顺序
>
> **弃用周期**：
>
> - < 1.5：为有问题的构造函数引入警告
> - >= 1.5：将此警告提高为错误，
>  可以使用 `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` 暂时恢复到 1.5 之前的行为

### 在运算符函数调用中使用形参的默认值

> **问题**：[KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简要总结**：Kotlin 1.5 将在运算符调用中使用形参的默认值
>
> **弃用周期**：
>
> - < 1.5：旧行为（详见问题说明）
> - >= 1.5：行为已更改，
>  可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 暂时恢复到 1.5 之前的行为

### 如果常规级数也为空，则在 for 循环中产生空的倒序级数

> **问题**：[KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简要总结**：Kotlin 1.5 将在 for 循环中产生空的倒序级数，前提是常规级数也为空
>
> **弃用周期**：
>
> - < 1.5：旧行为（详见问题说明）
> - >= 1.5：行为已更改，
>  可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 暂时恢复到 1.5 之前的行为

### 理顺 Char 到代码（code）以及 Char 到数字（digit）的转换

> **问题**：[KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **组件**：kotlin-stdlib
>
> **不兼容更改类型**：源码
>
> **简要总结**：从 Kotlin 1.5 开始，将弃用 Char 到数字类型的转换
>
> **弃用周期**：
>
> - 1.5：弃用 `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 以及反向函数如 `Long.toChar()`，并提出替代方案

### kotlin.text 函数中不一致的字符忽略大小写比较

> **问题**：[KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **组件**：kotlin-stdlib
>
> **不兼容更改类型**：行为
>
> **简要总结**：从 Kotlin 1.5 开始，`Char.equals` 在忽略大小写的情况下将得到改进，首先比较字符的大写形式是否相等，然后比较这些大写形式的小写形式（而非字符本身）是否相等
>
> **弃用周期**：
>
> - < 1.5：旧行为（详见问题说明）
> - 1.5：更改 `Char.equals` 函数的行为

### 移除默认区域性敏感的大小写转换 API

> **问题**：[KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **组件**：kotlin-stdlib
>
> **不兼容更改类型**：源码
>
> **简要总结**：从 Kotlin 1.5 开始，将弃用默认区域性敏感的大小写转换函数，如 `String.toUpperCase()`
>
> **弃用周期**：
>
> - 1.5：弃用使用默认区域性的案例转换函数（详见问题说明），并提出替代方案

### 逐步将集合 min 和 max 函数的返回值类型更改为不可为空

> **问题**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **组件**：kotlin-stdlib (JVM)
>
> **不兼容更改类型**：源码
>
> **简要总结**：集合 `min` 和 `max` 函数的返回值类型将在 1.6 中更改为不可为空
>
> **弃用周期**：
>
> - 1.4：引入 `...OrNull` 函数作为同义词，并弃用受影响的 API（详见问题说明）
> - 1.5.0：将受影响 API 的弃用级别提高为错误
> - >= 1.6：重新引入受影响的 API，但使用不可为空的返回值类型

### 提高浮点类型到 Short 和 Byte 转换的弃用级别

> **问题**：[KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **组件**：kotlin-stdlib (JVM)
>
> **不兼容更改类型**：源码
>
> **简要总结**：在 Kotlin 1.4 中以 `WARNING` 级别弃用的浮点类型到 `Short` 和 `Byte` 的转换，从 Kotlin 1.5.0 开始将导致错误。
>
> **弃用周期**：
>
> - 1.4：弃用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 并提出替代方案
> - 1.5.0：将弃用级别提高为错误

## 工具

### 不要在单个项目中混合多个 kotlin-test 的 JVM 变体

> **问题**：[KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **组件**：Gradle
>
> **不兼容更改类型**：行为
>
> **简要总结**：如果其中一个变体是由传递依赖引入的，项目中可能会出现多个针对不同测试框架的互斥 `kotlin-test` 变体。从 1.5.0 开始，Gradle 将不允许针对不同测试框架拥有互斥的 `kotlin-test` 变体。
>
> **弃用周期**：
>
> - < 1.5：允许针对不同测试框架拥有多个互斥的 `kotlin-test` 变体
> - >= 1.5：行为已更改，
> Gradle 会抛出类似 "Cannot select module with conflict on capability..." 的异常。可能的解决方案：
>    * 使用与传递依赖引入的相同的 `kotlin-test` 变体和相应的测试框架。
>    * 寻找该依赖项的另一个不通过传递方式引入 `kotlin-test` 变体的版本，以便你可以使用想要使用的测试框架。
>    * 寻找该依赖项的另一个通过传递方式引入另一个 `kotlin-test` 变体的版本，该变体使用你想要使用的相同测试框架。
>    * 排除通过传递方式引入的测试框架。以下示例用于排除 JUnit 4：
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      排除测试框架后，请测试你的应用程序。如果它停止工作，请回滚排除更改，使用与库相同的测试框架，并排除你的测试框架。