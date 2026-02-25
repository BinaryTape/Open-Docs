[//]: # (title: Kotlin 1.9.x 兼容性指南)

[保持语言的现代性](kotlin-evolution-principles.md) 和 [平滑更新](kotlin-evolution-principles.md) 是 Kotlin 语言设计的基本原则。前者指出应移除阻碍语言演进的结构，后者指出应事先就这种移除进行充分沟通，以使代码迁移尽可能顺利。

虽然大多数语言变化已经通过其他渠道（如更新日志或编译器警告）发布，但本文档对这些变化进行了总结，为从 Kotlin 1.8 迁移到 Kotlin 1.9 提供完整参考。

## 基本术语

在本文档中，我们介绍了以下几种兼容性：

- _源码 (source)_：源码不兼容的变化会导致以前可以正常编译（没有错误或警告）的代码无法再编译。
- _二进制 (binary)_：如果两个二进制构件可以互换而不会导致加载或链接错误，则称它们为二进制兼容。
- _行为 (behavioral)_：如果同一个程序在应用更改前后表现出不同的行为，则称该更改为行为不兼容。

请记住，这些定义仅针对纯 Kotlin。从其他语言（例如 Java）的视角来看 Kotlin 代码的兼容性不在本文档的讨论范围内。

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
> - 1.6.20: report a warning
> - 1.8.0: raise the warning to an error
-->

### 移除语言版本 1.3

> **问题**：[KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 引入了语言版本 1.9，并移除了对语言版本 1.3 的支持。 
>
> **弃用周期**：
>
> - 1.6.0：报告警告
> - 1.9.0：将警告升级为错误

### 当父接口类型为函数字面量时禁止调用父类构造函数

> **问题**：[KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：如果接口继承自函数字面量类型，Kotlin 1.9 将禁止调用父类构造函数，因为不存在此类构造函数。
>
> **弃用周期**：
> * 1.7.0：报告警告（或在渐进模式下报告错误）
> * 1.9.0：将警告升级为错误

### 禁止在注解参数类型中出现循环

> **问题**：[KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 禁止直接或间接地将注解类型用作其自身的参数类型之一。这可以防止产生循环。
> 但是，允许参数类型为该注解类型的 `Array` 或 `vararg`。
>
> **弃用周期**：
> * 1.7.0：对注解参数类型中的循环报告警告（或在渐进模式下报告错误）
> * 1.9.0：将警告升级为错误，可以使用 `-XXLanguage:-ProhibitCyclesInAnnotations` 暂时恢复到 1.9 之前的行为

### 禁止在没有形参的函数类型上使用 @ExtensionFunctionType 注解

> **问题**：[KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 禁止在没有形参的函数类型或非函数类型上使用 `@ExtensionFunctionType` 注解。
>
> **弃用周期**：
> * 1.7.0：对于非函数类型上的注解报告警告，对于**是**函数类型上的注解报告错误
> * 1.9.0：将针对函数类型的警告升级为错误

### 禁止在赋值时出现 Java 字段类型不匹配

> **问题**：[KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：源码
>
> **简短摘要**：如果 Kotlin 1.9 检测到赋给 Java 字段的值的类型与该 Java 字段的投影类型不匹配，则会报告编译器错误。
>
> **弃用周期**：
> * 1.6.0：当投影的 Java 字段类型与所赋的值类型不匹配时，报告警告（或在渐进模式下报告错误）
> * 1.9.0：将警告升级为错误，可以使用 `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` 暂时恢复到 1.9 之前的行为

### 平台类型为 null 性断言异常中不再包含源代码片段

> **问题**：[KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简短摘要**：在 Kotlin 1.9 中，表达式 null 检查的异常消息不再包含源代码片段。取而代之的是显示方法或字段的名称。
> 如果表达式既不是方法也不是字段，则消息中不会提供额外信息。
>
> **弃用周期**：
>  * < 1.9.0：表达式 null 检查生成的异常消息包含源代码片段
>  * 1.9.0：表达式 null 检查生成的异常消息仅包含方法或字段名称，可以使用 `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` 暂时恢复到 1.9 之前的行为

### 禁止将父类调用委托给抽象父类成员

> **问题**：[KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
> 
> **简短摘要**：当显式或隐式的父类调用被委托给父类的“抽象”成员时，即使父接口中有默认实现，Kotlin 也会报告编译错误。
>
> **弃用周期**：
>
> - 1.5.20：当使用未重写所有抽象成员的非抽象类时引入警告
> - 1.7.0：如果父类调用实际上访问了父类中的抽象成员，则报告警告
> - 1.7.0：如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则在所有受影响的情况下报告错误；在渐进模式下报告错误
> - 1.8.0：在声明具体类时若其带有未重写的父类抽象方法，或者 `Any` 方法的父类调用在父类中被重写为抽象方法时，报告错误
> - 1.9.0：在所有受影响的情况下报告错误，包括显式调用父类中的抽象方法

### 弃用带主语的 when 中的模糊语法

> **问题**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.6 弃用了 `when` 条件表达式中几种模糊的语法结构。
>
> **弃用周期**：
>
> - 1.6.20：在受影响的表达式上引入弃用警告
> - 1.8.0：将此警告升级为错误，可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暂时恢复到 1.8 之前的行为
> - &gt;= 2.1：将一些弃用的结构重新用于新的语言功能

### 防止不同数值类型之间的隐式强制转换

> **问题**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简短摘要**：在语义上只需要对该类型进行向下转换的情况下，Kotlin 将避免自动将数值转换为原生数值类型。
>
> **弃用周期**：
>
> - < 1.5.30：所有受影响情况下的旧行为
> - 1.5.30：修复生成的属性委托访问器中的向下转换行为，可以使用 `-Xuse-old-backend` 暂时恢复到 1.5.30 之前的修复行为
> - &gt;= 2.0：修复其他受影响情况下的向下转换行为

### 禁止在泛型类型别名使用中违反上界约束（当类型参数用于别名类型之类型实参的类型实参时）

> **问题**：[KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：当类型别名的类型形参被用作别名类型之类型实参的泛型类型实参时（例如 `typealias Alias<T> = Base<List<T>>`），Kotlin 将禁止使用违反了别名类型相应类型形参上界限制的类型实参。
>
> **弃用周期**：
>
> - 1.8.0：当泛型类型别名使用的类型实参违反了别名类型相应类型形参的上界约束时，报告警告
> - 2.0.0：将警告升级为错误

### 在公共签名中近似局部类型时保持为 null 性

> **问题**：[KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码、二进制
>
> **简短摘要**：当局部或匿名类型从没有显式指定返回值类型的表达式体函数返回时，Kotlin 编译器会使用该类型的已知超类型来推断（或近似）返回值类型。
> 在此过程中，编译器可能会推断出一个非为 null 类型，而实际上可能会返回 null 值。
>
> **弃用周期**：
>
> - 1.8.0：使用灵活超类型近似灵活类型
> - 1.8.0：当声明被推断为本应可为空的非为 null 类型时报告警告，提示用户显式指定类型
> - 2.0.0：使用可为空超类型近似可为空类型，可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暂时恢复到 2.0 之前的行为

### 不再通过重写传播弃用

> **问题**：[KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将不再把父类中已弃用成员的弃用状态传播到子类中的重写成员，从而提供一种显式机制：在弃用父类成员的同时，保持子类中的成员为非弃用状态。
>
> **弃用周期**：
>
> - 1.6.20：报告警告，说明未来的行为变化，并提示禁止此警告或显式在已弃用成员的重写上编写 `@Deprecated` 注解
> - 1.9.0：停止向重写成员传播弃用状态。此更改在渐进模式下也会立即生效

### 禁止在注解类中除参数声明外的任何位置使用集合字面量

> **问题**：[KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 允许以受限方式使用集合字面量——用于将数组传递给注解类的参数或为这些参数指定默认值。
> 然而除此之外，Kotlin 曾允许在注解类内部的任何其他位置使用集合字面量，例如在其嵌套对象中。Kotlin 1.9 将禁止在注解类中除参数默认值以外的任何位置使用集合字面量。
>
> **弃用周期**：
>
> - 1.7.0：对注解类嵌套对象中的数组字面量报告警告（或在渐进模式下报告错误）
> - 1.9.0：将警告升级为错误

### 禁止在默认值表达式中前向引用形参

> **问题**：[KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止在其他形参的默认值表达式中前向引用形参。这确保了当在默认值表达式中访问形参时，该形参已经拥有了通过函数传递或由其自身的默认值表达式初始化的值。
>
> **弃用周期**：
>
> - 1.7.0：当在先前的形参默认值中引用带有默认值的形参时，报告警告（或在渐进模式下报告错误）
> - 1.9.0：将警告升级为错误，可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暂时恢复到 1.9 之前的行为

### 禁止对内联函数形参进行扩展调用

> **问题**：[KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：虽然 Kotlin 允许将内联函数形参作为接收器传递给另一个内联函数，但在编译此类代码时总是会导致编译器异常。
> Kotlin 1.9 将禁止此操作，从而报告错误而不是导致编译器崩溃。
>
> **弃用周期**：
>
> - 1.7.20：对内联函数形参上的内联扩展调用报告警告（或在渐进模式下报告错误）
> - 1.9.0：将警告升级为错误

### 禁止使用匿名函数实参调用名为 suspend 的中缀函数

> **问题**：[KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将不再允许调用名为 `suspend` 且带有一个以匿名函数字面量形式传递的函数类型实参的中缀函数。
>
> **弃用周期**：
>
> - 1.7.20：对带有匿名函数字面量的 suspend 中缀调用报告警告
> - 1.9.0：将警告升级为错误，可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暂时恢复到 1.9 之前的行为
> - TODO：更改解析器对 `suspend fun` 令牌序列的解释方式

### 禁止在内部类中以违反其差异的方式使用捕获的类型参数

> **问题**：[KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止在内部类中以违反外部类类型形参声明差异的方式使用具有 `in` 或 `out` 差异的外部类类型形参。
>
> **弃用周期**：
>
> - 1.7.0：当外部类类型参数的使用位置违反该参数的差异规则时，报告警告（或在渐进模式下报告错误）
> - 1.9.0：将警告升级为错误，可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暂时恢复到 1.9 之前的行为

### 禁止在复合赋值运算符中递归调用没有显式返回值类型的函数

> **问题**：[KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止在函数体内的复合赋值运算符的实参中调用没有显式指定返回值类型的函数，就像目前在该函数体内的其他表达式中所做的那样。
>
> **弃用周期**：
>
> - 1.7.0：当没有显式指定返回值类型的函数在该函数体的复合赋值运算符实参中被递归调用时，报告警告（或在渐进模式下报告错误）
> - 1.9.0：将警告升级为错误

### 禁止在预期为 @NotNull T 但给定带可为空绑定的 Kotlin 泛型参数时进行不安全的调用

> **问题**：[KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止在为 Java 方法的 `@NotNull` 注解参数传递潜在可为空的泛型类型值时进行方法调用。
>
> **弃用周期**：
>
> - 1.5.20：当在预期为非为 null 类型的地方传递不受约束的泛型类型形参时报告警告
> - 1.9.0：报告类型不匹配错误而不是上述警告，可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暂时恢复到 1.8 之前的行为

### 禁止从枚举条目初始值设定项中访问枚举类伴生对象的成员

> **问题**：[KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止从枚举条目初始值设定项中对枚举伴生对象进行任何形式的访问。
>
> **弃用周期**：
>
> - 1.6.20：对此类伴生成员访问报告警告（或在渐进模式下报告错误）
> - 1.9.0：将警告升级为错误，可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暂时恢复到 1.8 之前的行为

### 弃用并移除 Enum.declaringClass 合成属性

> **问题**：[KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 允许在 `Enum` 值上使用合成属性 `declaringClass`，该属性由底层 Java 类 `java.lang.Enum` 的方法 `getDeclaringClass()` 生成，即使该方法在 Kotlin `Enum` 类型中不可用。Kotlin 1.9 将禁止使用此属性，建议迁移到扩展属性 `declaringJavaClass`。
>
> **弃用周期**：
>
> - 1.7.0：对 `declaringClass` 属性的使用报告警告（或在渐进模式下报告错误），建议迁移到 `declaringJavaClass` 扩展
> - 1.9.0：将警告升级为错误，可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暂时恢复到 1.9 之前的行为
> - 2.0.0：移除 `declaringClass` 合成属性

### 弃用编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **问题**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 禁止使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式。
>
> **弃用周期**：
>
> - 1.6.20：针对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - 1.9.0：将此警告升级为错误

### 禁止在构建器推断上下文中将类型变量隐式推断为上界

> **问题**：[KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：在构建器推断 lambda 函数范围内没有任何使用点类型信息的情况下，Kotlin 2.0 将禁止将类型变量推断为相应类型形参的上界，这与目前在其他上下文中的做法一致。
>
> **弃用周期**：
>
> - 1.7.20：在缺乏使用点类型信息的情况下，当类型形参被推断为声明的上界时，报告警告（或在渐进模式下报告错误）
> - 2.0.0：将警告升级为错误

## 标准库

### 当 Range/Progression 开始实现 Collection 时，警告潜在的重载决策变化

> **问题**：[KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **组件**：核心语言 / kotlin-stdlib
>
> **不兼容更改类型**：源码
>
> **简短摘要**：计划在 Kotlin 1.9 的标准数列 (Progression) 和从中继承的具体区间 (Range) 中实现 `Collection` 接口。如果某个方法有两个重载，一个接收元素，另一个接收集合，这可能会导致在重载决策中选择不同的重载。
> Kotlin 将在以区间或数列作为实参调用此类重载方法时报告警告或错误，从而使这种情况可见。
>
> **弃用周期**：
>
> - 1.6.20：如果此数列/区间实现 `Collection` 接口会导致未来该调用选择另一个重载，则在以标准数列或其区间继承者作为实参调用重载方法时报告警告
> - 1.8.0：将此警告升级为错误 
> - 2.1.0：停止报告错误，在数列中实现 `Collection` 接口，从而更改受影响情况下的重载决策结果

### 将 kotlin.dom 和 kotlin.browser 软件包中的声明迁移到 kotlinx.*

> **问题**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`kotlin.dom` 和 `kotlin.browser` 软件包中的声明已移动到相应的 `kotlinx.*` 软件包中，以为将其从标准库中提取出来做准备。
>
> **弃用周期**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 软件包中引入替代 API
> - 1.4.0：弃用 `kotlin.dom` 和 `kotlin.browser` 软件包中的 API，并建议使用上述新 API 作为替代
> - 1.6.0：将弃用级别升级为错误
> - 1.8.20：针对 JS-IR 目标从标准库中移除已弃用的函数
> - &gt;= 2.0：将 kotlinx.* 软件包中的 API 移至独立库

### 弃用某些仅限 JS 的 API

> **问题**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容更改类型**：源码
>
> **简短摘要**：标准库中许多仅限 JS 的函数已被弃用并计划移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接收比较函数的数组 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **弃用周期**：
>
> - 1.6.0：对受影响的函数发出弃用警告
> - 1.9.0：将弃用级别升级为错误
> - &gt;=2.0：从公共 API 中移除已弃用的函数

## 工具

### 从 Gradle 设置中移除 enableEndorsedLibs 标志

> **问题**：[KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Gradle 设置中不再支持 `enableEndorsedLibs` 标志。
>
> **弃用周期**：
>
> - < 1.9.0：Gradle 设置中支持 `enableEndorsedLibs` 标志
> - 1.9.0：Gradle 设置中**不**支持 `enableEndorsedLibs` 标志

### 移除 Gradle 约定 (Conventions)

> **问题**：[KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Gradle 约定在 Gradle 7.1 中已弃用，并在 Gradle 8 中移除。
>
> **弃用周期**：
>
> - 1.7.20：Gradle 约定已弃用
> - 1.9.0：Gradle 约定已移除

### 移除 KotlinCompile 任务的 classpath 属性

> **问题**：[KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`KotlinCompile` 任务的 `classpath` 属性已移除。
>
> **弃用周期**：
>
> - 1.7.0：`classpath` 属性已弃用
> - 1.8.0：将弃用级别升级为错误
> - 1.9.0：从公共 API 中移除已弃用的函数

### 弃用 kotlin.internal.single.build.metrics.file 属性

> **问题**：[KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：弃用用于定义构建报告单一文件的 `kotlin.internal.single.build.metrics.file` 属性。
> 请改用 `kotlin.build.report.single_file` 属性并设置 `kotlin.build.report.output=single_file`。
>
> **弃用周期：**
>
> * 1.8.0：将弃用级别升级为警告
> * &gt;= 1.9：删除该属性