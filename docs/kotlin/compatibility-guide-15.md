[//]: # (title: Kotlin 1.5 兼容性指南)

[保持语言的现代化](kotlin-evolution-principles.md) 和 [舒适的更新](kotlin-evolution-principles.md) 是 Kotlin 语言设计中的基本原则。前者指出，阻碍语言演进的结构应该被移除；后者则强调，这种移除应事先充分沟通，以使代码迁移尽可能顺利。

虽然大多数语言变更已通过其他渠道（例如更新日志或编译器警告）公布，但本文档总结了所有这些变更，为从 Kotlin 1.4 迁移到 Kotlin 1.5 提供了完整的参考。

## 基本术语

本文档介绍了以下几种兼容性类型：

-   _源代码兼容性 (source)_：源代码不兼容的更改会使原本能够正常（无错误或警告）编译的代码不再编译。
-   _二进制兼容性 (binary)_：如果两个二进制工件互换后不会导致加载或链接错误，则称它们是二进制兼容的。
-   _行为兼容性 (behavioral)_：如果同一程序在应用更改前后表现出不同行为，则称该更改是行为不兼容的。

请记住，这些定义仅适用于纯 Kotlin。Kotlin 代码从其他语言视角（例如 Java）的兼容性不在本文档的讨论范围之内。

## 语言与标准库

### 禁止在签名多态调用中使用展开运算符

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 将禁止在签名多态调用 (signature-polymorphic calls) 中使用展开运算符 (`*`)。
>
> **Deprecation cycle**:
>
> -   < 1.5: 在调用处对有问题的运算符引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 临时恢复到 1.5 之前的行为。

### 禁止非抽象类包含对其不可见的抽象成员（internal/package-private）

> **Issue**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 将禁止非抽象类包含对其不可见的抽象成员（internal/package-private）。
>
> **Deprecation cycle**:
>
> -   < 1.5: 对有问题的类引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` 临时恢复到 1.5 之前的行为。

### 禁止在 JVM 上使用基于非具体化类型参数的数组作为具体化类型实参

> **Issue**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 将禁止在 JVM 上使用基于非具体化 (non-reified) 类型参数的数组作为具体化 (reified) 类型实参 (type arguments)。
>
> **Deprecation cycle**:
>
> -   < 1.5: 对有问题的调用引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` 临时恢复到 1.5 之前的行为。

### 禁止不委托给主构造函数的枚举类次构造函数

> **Issue**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 将禁止不委托给主构造函数 (primary constructor) 的枚举类次构造函数 (secondary enum class constructors)。
>
> **Deprecation cycle**:
>
> -   < 1.5: 对有问题的构造函数引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` 临时恢复到 1.5 之前的行为。

### 禁止私有内联函数暴露匿名类型

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 将禁止私有内联函数 (private inline functions) 暴露匿名类型 (anonymous types)。
>
> **Deprecation cycle**:
>
> -   < 1.5: 对有问题的构造函数引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` 临时恢复到 1.5 之前的行为。

### 禁止在带有 SAM 转换的参数之后传递非展开数组

> **Issue**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 将禁止在带有 SAM 转换 (SAM-conversion) 的参数之后传递非展开 (non-spread) 数组。
>
> **Deprecation cycle**:
>
> -   1.3.70: 对有问题的调用引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` 临时恢复到 1.5 之前的行为。

### 支持下划线命名 catch 块参数的特殊语义

> **Issue**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 将禁止引用在 `catch` 块中用于省略异常参数名的下划线符号 (`_`)。
>
> **Deprecation cycle**:
>
> -   1.4.20: 对有问题的引用引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` 临时恢复到 1.5 之前的行为。

### 将 SAM 转换的实现策略从基于匿名类更改为 invokedynamic

> **Issue**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 从 Kotlin 1.5 开始，SAM（单抽象方法 (single abstract method)）转换的实现策略将从生成匿名类 (anonymous class) 更改为使用 `invokedynamic` JVM 指令 (instruction)。
>
> **Deprecation cycle**:
>
> -   1.5: 更改 SAM 转换的实现策略，
>     可以使用 `-Xsam-conversions=class` 恢复到以前的实现方案。

### JVM 基于 IR 的后端存在的性能问题

> **Issue**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5 默认使用 [基于 IR 的后端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/) 作为 Kotlin/JVM 编译器。旧的后端仍是早期语言版本的默认设置。
>
> 您在使用 Kotlin 1.5 的新编译器时可能会遇到一些性能下降问题。我们正在努力修复此类问题。
>
> **Deprecation cycle**:
>
> -   < 1.5: 默认使用旧的 JVM 后端。
> -   &gt;= 1.5: 默认使用基于 IR 的后端。如果您需要在 Kotlin 1.5 中使用旧后端，请将以下行添加到项目配置文件中，以临时恢复到 1.5 之前的行为：
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

### JVM 基于 IR 的后端中的新字段排序

> **Issue**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 从 1.5 版本开始，Kotlin 使用 [基于 IR 的后端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)，它以不同的方式对 JVM 字节码进行排序：它会在构造函数中声明的字段之前生成在类体 (body) 中声明的字段，而旧后端则相反。新的排序方式可能会改变依赖字段顺序的序列化框架（例如 Java 序列化）的程序的行为。
>
> **Deprecation cycle**:
>
> -   < 1.5: 默认使用旧的 JVM 后端。它会将类体中声明的字段置于构造函数中声明的字段之前。
> -   &gt;= 1.5: 默认使用新的基于 IR 的后端。构造函数中声明的字段在类体中声明的字段之前生成。作为一种变通方法，您可以在 Kotlin 1.5 中临时切换回旧后端。为此，请将以下行添加到项目配置文件中：
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

### 为委托表达式中包含泛型调用的委托属性生成可空性断言

> **Issue**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 从 Kotlin 1.5 开始，Kotlin 编译器将为委托表达式 (delegate expression) 中包含泛型调用 (generic call) 的委托属性 (delegated properties) 发出可空性断言 (nullability assertions)。
>
> **Deprecation cycle**:
>
> -   1.5: 为委托属性发出可空性断言（详见 issue），
>     可以使用 `-Xuse-old-backend` 或 `-language-version 1.4` 临时恢复到 1.5 之前的行为。

### 将带有 @OnlyInputTypes 注解的类型参数的调用警告升级为错误

> **Issue**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 将禁止调用诸如 `contains`、`indexOf` 和 `assertEquals` 等带有无意义参数的方法，以提高类型安全性。
>
> **Deprecation cycle**:
>
> -   1.4.0: 对有问题的构造函数引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-StrictOnlyInputTypesChecks` 临时恢复到 1.5 之前的行为。

### 在带有命名可变参数的调用中，使用正确的参数执行顺序

> **Issue**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5 将改变带有命名可变参数 (named vararg) 的调用中参数的执行顺序。
>
> **Deprecation cycle**:
>
> -   < 1.5: 对有问题的构造函数引入警告。
> -   &gt;= 1.5: 将此警告升级为错误，
>     可以使用 `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` 临时恢复到 1.5 之前的行为。

### 在运算符函数调用中使用参数的默认值

> **Issue**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5 将在运算符调用中，使用参数的默认值。
>
> **Deprecation cycle**:
>
> -   < 1.5: 旧行为（详见 issue）。
> -   &gt;= 1.5: 行为已更改，
>     可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 临时恢复到 1.5 之前的行为。

### 如果常规进阶为空，则在 for 循环中生成空的逆序进阶

> **Issue**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 如果常规进阶 (regular progression) 为空，Kotlin 1.5 将在 `for` 循环中生成空的逆序进阶 (reversed progressions)。
>
> **Deprecation cycle**:
>
> -   < 1.5: 旧行为（详见 issue）。
> -   &gt;= 1.5: 行为已更改，
>     可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 临时恢复到 1.5 之前的行为。

### 统一字符到编码和字符到数字的转换

> **Issue**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 从 Kotlin 1.5 开始，字符 (Char) 到数字类型的转换将被弃用。
>
> **Deprecation cycle**:
>
> -   1.5: 弃用 `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 以及 `Long.toChar()` 等反向函数，并提出替代方案。

### kotlin.text 函数中字符不区分大小写比较的不一致性

> **Issue**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 从 Kotlin 1.5 开始，`Char.equals` 在不区分大小写比较方面将得到改进，首先比较字符的大写形式是否相等，然后比较这些大写形式的小写形式（而非字符本身）是否相等。
>
> **Deprecation cycle**:
>
> -   < 1.5: 旧行为（详见 issue）。
> -   1.5: 更改 `Char.equals` 函数的行为。

### 移除默认的区域设置敏感大小写转换 API

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 从 Kotlin 1.5 开始，默认的区域设置敏感 (locale-sensitive) 的大小写转换函数，例如 `String.toUpperCase()`，将被弃用。
>
> **Deprecation cycle**:
>
> -   1.5: 弃用使用默认区域设置的大小写转换函数（详见 issue），并提出替代方案。

### 逐步将集合 min 和 max 函数的返回类型更改为非可空

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source
>
> **Short summary**: 集合 `min` 和 `max` 函数的返回类型将在 1.6 中更改为非可空 (non-nullable)。
>
> **Deprecation cycle**:
>
> -   1.4: 引入 `...OrNull` 函数作为同义词并弃用受影响的 API（详见 issue）。
> -   1.5.0: 将受影响 API 的弃用级别提升为错误。
> -   &gt;=1.6: 重新引入受影响的 API，但返回类型为非可空。

### 提升浮点类型到 Short 和 Byte 转换的弃用级别

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source
>
> **Short summary**: 在 Kotlin 1.4 中以 `WARNING` 级别弃用的浮点类型到 `Short` 和 `Byte` 的转换，将从 Kotlin 1.5.0 开始导致错误。
>
> **Deprecation cycle**:
>
> -   1.4: 弃用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 并提出替代方案。
> -   1.5.0: 将弃用级别提升为错误。

## 工具

### 不要在单个项目中混合使用多个 kotlin-test 的 JVM 变体

> **Issue**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 如果一个项目中通过传递依赖 (transitive dependency) 引入了 `kotlin-test` 的多个互斥变体 (mutually exclusive variants) 以支持不同的测试框架，那么这些变体可能并存。从 1.5.0 开始，Gradle 将不允许存在针对不同测试框架的互斥 `kotlin-test` 变体。
>
> **Deprecation cycle**:
>
> -   < 1.5: 允许针对不同测试框架存在多个互斥的 `kotlin-test` 变体。
> -   &gt;= 1.5: 行为已更改，
>     Gradle 将抛出类似 "Cannot select module with conflict on capability..." 的异常。可能的解决方案有：
>     *   使用与传递依赖所引入的 `kotlin-test` 变体及其对应的测试框架。
>     *   寻找不传递引入 `kotlin-test` 变体的依赖项的其他变体，以便您可以使用您想使用的测试框架。
>     *   寻找传递引入另一个 `kotlin-test` 变体的依赖项的其他变体，该变体使用您想使用的同一测试框架。
>     *   排除通过传递依赖引入的测试框架。以下是排除 JUnit 4 的示例：
>         ```groovy
>         configurations {
>             testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>         }
>         ```
>         排除测试框架后，测试您的应用程序。如果它停止工作，请回滚排除更改，使用库所使用的测试框架，并排除您自己的测试框架。