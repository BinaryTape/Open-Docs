---
title: "Kotlin 1.9 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的根本原则。前者指出，应移除阻碍语言发展的结构，后者指出，应事先充分沟通此移除，以使代码迁移尽可能顺畅。

虽然大多数语言变更已通过其他渠道宣布，如更新日志或编译器警告，但本文档总结了所有这些变更，为从 Kotlin 1.8 迁移到 Kotlin 1.9 提供了完整的参考。

## 基本术语

本文档介绍了以下几种兼容性：

- _源码兼容性 (source)_：源码不兼容的变更会阻止原本可以正常编译（没有错误或警告）的代码再也无法编译
- _二进制兼容性 (binary)_：如果互换两个二进制工件不会导致加载或链接错误，则称它们是二进制兼容的
- _行为兼容性 (behavioral)_：如果同一个程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的

请记住，这些定义仅适用于纯 Kotlin。Kotlin 代码从其他语言角度（例如，从 Java）的兼容性不在本文档的讨论范围内。

## 语言

<!--
### 标题

> **问题**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**:
>
> **弃用周期**:
>
> - 1.6.20: 报告警告
> - 1.8.0: 将警告升级为错误
-->

### 移除语言版本 1.3

> **问题**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 引入了语言版本 1.9，并移除了对语言版本 1.3 的支持。
>
> **弃用周期**:
>
> - 1.6.0: 报告警告
> - 1.9.0: 将警告升级为错误

### 禁止在超接口类型是函数字面值时调用超类构造函数

> **问题**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: 如果接口继承自函数字面值类型，Kotlin 1.9 将禁止调用超类构造函数，因为不存在这样的构造函数。
>
> **弃用周期**:
> * 1.7.0: 报告警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告升级为错误

### 禁止注解参数类型中的循环

> **问题**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 禁止将注解的类型用作其参数类型之一，无论是直接还是间接。这可以防止创建循环。
> 但是，允许使用 `Array` 或 `vararg` 注解类型的参数类型。
>
> **弃用周期**:
> * 1.7.0: 报告注解参数类型中循环的警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告升级为错误，可以使用 `-XXLanguage:-ProhibitCyclesInAnnotations` 临时恢复到 1.9 之前的行为

### 禁止在没有参数的函数类型上使用 @ExtensionFunctionType 注解

> **问题**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 禁止在没有参数的函数类型或非函数类型上使用 `@ExtensionFunctionType` 注解。
>
> **弃用周期**:
> * 1.7.0: 对非函数类型的注解报告警告，对**是**函数类型的注解报告错误
> * 1.9.0: 将函数类型的警告升级为错误

### 禁止 Java 字段类型在赋值时类型不匹配

> **问题**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: source
>
> **简要总结**: 如果 Kotlin 1.9 检测到赋值给 Java 字段的值的类型与 Java 字段的投影类型不匹配，则会报告编译器错误。
>
> **弃用周期**:
> * 1.6.0: 当投影的 Java 字段类型与赋值的值类型不匹配时，报告警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告升级为错误，可以使用 `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` 临时恢复到 1.9 之前的行为

### 平台类型可空性断言异常中没有源代码摘录

> **问题**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: behavioral
>
> **简要总结**: 在 Kotlin 1.9 中，表达式空值检查的异常消息不包含源代码摘录。而是显示方法或字段的名称。
> 如果表达式不是方法或字段，则消息中不会提供其他信息。
>
> **弃用周期**:
>  * < 1.9.0: 表达式空值检查生成的异常消息包含源代码摘录
>  * 1.9.0: 表达式空值检查生成的异常消息仅包含方法或字段名称，可以使用 `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` 临时恢复到 1.9 之前的行为

### 禁止将超类调用委托给抽象超类成员

> **问题**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
> 
> **简要总结**: 当显式或隐式超类调用委托给超类的 _抽象_ 成员时，即使超接口中存在默认实现，Kotlin 也会报告编译错误。
>
> **弃用周期**:
>
> - 1.5.20: 引入一个警告，当使用未覆盖所有抽象成员的非抽象类时
> - 1.7.0: 如果超类调用实际上访问了超类的抽象成员，则报告警告
> - 1.7.0: 如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则在所有受影响的情况下报告错误；
>   在渐进模式下报告错误
> - 1.8.0: 在声明具有来自超类的未覆盖抽象方法的具体类的情况下报告错误，并且
>   `Any` 方法的超类调用在超类中被覆盖为抽象
> - 1.9.0: 在所有受影响的情况下报告错误，包括显式调用超类的抽象方法

### 弃用 when-with-subject 中令人困惑的语法

> **问题**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.6 弃用了 `when` 条件表达式中的几个令人困惑的语法结构。
>
> **弃用周期**:
>
> - 1.6.20: 在受影响的表达式上引入弃用警告
> - 1.8.0: 将此警告升级为错误，
>   可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 临时恢复到 1.8 之前的行为
> - &gt;= 2.1: 将一些弃用的结构重新用于新的语言功能

### 阻止不同数值类型之间的隐式强制转换

> **问题**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: behavioral
>
> **简要总结**: Kotlin 将避免自动将数值转换为原始数值类型，如果语义上只需要向下转型到该类型。
>
> **弃用周期**:
>
> - < 1.5.30: 所有受影响的情况下的旧行为
> - 1.5.30: 修复生成的属性委托访问器中的向下转型行为，
>   可以使用 `-Xuse-old-backend` 临时恢复到 1.5.30 之前的修复行为
> - &gt;= 2.0: 修复其他受影响的情况下的向下转型行为

### 禁止在泛型类型别名用法中违反上限（在别名类型的类型参数的泛型类型参数中使用的类型参数）

> **问题**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 将禁止使用带有类型参数的类型别名，这些类型参数违反了别名类型的相应类型参数的上限约束，如果类型别名类型参数用作别名类型的类型参数的泛型类型参数，例如，`typealias Alias<T> = Base<List<T>>`。
>
> **弃用周期**:
>
> - 1.8.0: 当泛型类型别名用法具有违反别名类型的相应类型参数的上限约束的类型参数时，报告警告
> - 2.0.0: 将警告升级为错误

### 在公共签名中近似局部类型时保持可空性

> **问题**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source, binary
>
> **简要总结**: 当从没有显式指定返回类型的表达式主体函数返回局部类型或匿名类型时，
> Kotlin 编译器会使用该类型的已知超类型推断（或近似）返回类型。
> 在此期间，编译器可以推断出非空类型，而实际上可以返回空值。
>
> **弃用周期**:
>
> - 1.8.0: 通过灵活的超类型近似灵活类型
> - 1.8.0: 当声明被推断为具有应该是可空的非空类型时，报告警告，提示用户显式指定类型
> - 2.0.0: 通过可空超类型近似可空类型，
>   可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 临时恢复到 2.0 之前的行为

### 不要通过重写传播弃用

> **问题**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 将不再从超类中的弃用成员传播弃用到子类中的重写成员，从而为弃用超类的成员同时使其在子类中保持非弃用状态提供了一种显式机制。
>
> **弃用周期**:
>
> - 1.6.20: 报告一个警告，其中包含未来行为更改的消息，并提示要么抑制此警告，要么在已弃用成员的重写上显式编写 `@Deprecated` 注解
> - 1.9.0: 停止将弃用状态传播到重写成员。此更改也会立即在渐进模式下生效

### 禁止在注解类中使用集合字面值，除非在它们的参数声明中

> **问题**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 允许以受限制的方式使用集合字面值 - 用于将数组传递给注解类的参数或为这些参数指定默认值。
> 然而，除此之外，Kotlin 允许在注解类中的任何其他地方使用集合字面值，例如，
> 在其嵌套对象中。Kotlin 1.9 将禁止在注解类中使用集合字面值，除非在
> 它们的参数的默认值中。
>
> **弃用周期**:
>
> - 1.7.0: 报告注解类中嵌套对象中的数组字面值的警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告升级为错误

### 禁止在默认值表达式中向前引用参数

> **问题**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 将禁止在其他参数的默认值表达式中向前引用参数。
> 这确保了在默认值表达式中访问参数时，
> 它已经有一个传递给函数的值或由其自身的默认值表达式初始化的值。
>
> **弃用周期**:
>
> - 1.7.0: 当带有默认值的参数在位于其前面的另一个参数的默认值中被引用时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告升级为错误，
>   可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 临时恢复到 1.9 之前的行为

### 禁止在内联函数参数上进行扩展调用

> **问题**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: 虽然 Kotlin 允许将内联函数参数作为接收者传递给另一个内联函数，
> 但在编译此类代码时总是会导致编译器异常。
> Kotlin 1.9 将禁止这样做，因此报告错误而不是使编译器崩溃。
>
> **弃用周期**:
>
> - 1.7.20: 报告对内联函数参数的内联扩展调用的警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告升级为错误

### 禁止使用匿名函数参数调用名为 suspend 的中缀函数

> **问题**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 将不再允许调用名为 `suspend` 的中缀函数，该函数具有作为匿名函数字面值传递的函数类型 (functional type) 的单个参数。
>
> **弃用周期**:
>
> - 1.7.20: 报告带有匿名函数字面值的 suspend 中缀调用的警告
> - 1.9.0: 将警告升级为错误，
>   可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 临时恢复到 1.9 之前的行为
> - TODO: 更改解析器解释 `suspend fun` 令牌序列的方式

### 禁止在内部类中使用捕获的类型参数违反其方差

> **问题**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 将禁止在该类的内部类中使用具有 `in` 或 `out` 方差的外部类的类型参数，如果使用位置违反了该类型参数的声明方差。
>
> **弃用周期**:
>
> - 1.7.0: 当外部类的类型参数使用位置违反该参数的方差规则时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告升级为错误，
>   可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 临时恢复到 1.9 之前的行为

### 禁止在复合赋值运算符中递归调用没有显式返回类型的函数

> **问题**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 将禁止在函数体内的复合赋值运算符的参数中调用没有显式指定返回类型的函数，就像它目前在该函数体内的其他表达式中一样。
>
> **弃用周期**:
>
> - 1.7.0: 当没有显式指定返回类型的函数在复合赋值运算符参数中在该函数体内被递归调用时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告升级为错误

### 禁止使用预期的 @NotNull T 和给定的带有可空边界的 Kotlin 泛型参数进行不健全的调用

> **问题**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 将禁止方法调用，其中将潜在可空的泛型类型的值传递给 Java 方法的 `@NotNull` 注解参数。
>
> **弃用周期**:
>
> - 1.5.20: 当传递未约束的泛型类型参数到期望非空类型的位置时，报告警告
> - 1.9.0: 报告类型不匹配错误而不是上面的警告，
>   可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 临时恢复到 1.8 之前的行为

### 禁止从该枚举的条目初始化器访问枚举类的伴生对象成员

> **问题**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 将禁止从枚举条目初始化器访问枚举的伴生对象的所有类型。
>
> **弃用周期**:
>
> - 1.6.20: 报告此类伴生对象成员访问的警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告升级为错误，
>   可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 临时恢复到 1.8 之前的行为

### 弃用并移除 Enum.declaringClass 合成属性

> **问题**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 允许在从底层 Java 类 `java.lang.Enum` 的方法 `getDeclaringClass()` 生成的 `Enum` 值上使用合成属性 `declaringClass`，即使此方法对于 Kotlin `Enum` 类型不可用。Kotlin 1.9 将禁止使用此属性，建议迁移到扩展属性 `declaringJavaClass`。
>
> **弃用周期**:
>
> - 1.7.0: 报告 `declaringClass` 属性用法的警告（或在渐进模式下报告错误），
>   建议迁移到 `declaringJavaClass` 扩展
> - 1.9.0: 将警告升级为错误，
>   可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 临时恢复到 1.9 之前的行为
> - 2.0.0: 移除 `declaringClass` 合成属性

### 弃用编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **问题**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: source
>
> **简要总结**: Kotlin 1.9 禁止使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式。
>
> **弃用周期**:
>
> - 1.6.20: 在 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式上引入警告
> - 1.9.0: 将此警告升级为错误

### 禁止在构建器推断上下文中将类型变量隐式推断到上限

> **问题**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: source
>
> **简要总结**: 在缺少构建器推断 lambda 函数范围内的任何使用位置类型信息的情况下，Kotlin 2.0 将禁止将类型变量推断到相应的类型参数上限，就像它目前在其他上下文中一样。
>
> **弃用周期**:
>
> - 1.7.20: 当类型参数在缺少使用位置类型信息的情况下被推断到声明的上限时，报告警告（或在渐进模式下报告错误）
> - 2.0.0: 将警告升级为错误

## 标准库

### 当 Range/Progression 开始实现 Collection 时，警告潜在的重载解析更改

> **问题**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **组件**: 核心语言 / kotlin-stdlib
>
> **不兼容的变更类型**: source
>
> **简要总结**: 计划在 Kotlin 1.9 中在标准级数和从它们继承的具体范围中实现 `Collection` 接口。如果存在某个方法的两个重载，一个接受元素，另一个接受集合，这可能会导致在重载解析中选择不同的重载。
> 当使用范围或级数参数调用此类重载方法时，Kotlin 将通过报告警告或错误使这种情况可见。
>
> **弃用周期**:
>
> - 1.6.20: 当使用标准级数或其范围继承者作为参数调用重载方法时，报告警告
>   如果此级数/范围实现 `Collection` 接口导致将来在此调用中选择另一个重载
> - 1.8.0: 将此警告升级为错误
> - 2.1.0: 停止报告错误，在级数中实现 `Collection` 接口，从而更改受影响情况下的重载解析结果

### 将声明从 kotlin.dom 和 kotlin.browser 包迁移到 kotlinx.*

> **问题**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容的变更类型**: source
>
> **简要总结**: 来自 `kotlin.dom` 和 `kotlin.browser` 包的声明被移动到相应的 `kotlinx.*` 包，以准备从 stdlib 中提取它们。
>
> **弃用周期**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替换 API
> - 1.4.0: 弃用 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并提出上述新 API 作为替代
> - 1.6.0: 将弃用级别提高到错误
> - 1.8.20: 从 JS-IR 目标的 stdlib 中删除已弃用的函数
> - &gt;= 2.0: 将 kotlinx.* 包中的 API 移动到单独的库

### 弃用一些仅限 JS 的 API

> **问题**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容的变更类型**: source
>
> **简要总结**: stdlib 中的许多仅限 JS 的函数被弃用以供删除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及在数组上采用比较函数的 `sort` 函数，例如，`Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`。
>
> **弃用周期**:
>
> - 1.6.0: 使用警告弃用受影响的函数
> - 1.9.0: 将弃用级别提高到错误
> - &gt;=2.0: 从公共 API 中删除已弃用的函数

## 工具

### 从 Gradle 设置中删除 enableEndorsedLibs 标志

> **问题**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: source
>
> **简要总结**: Gradle 设置中不再支持 `enableEndorsedLibs` 标志。
>
> **弃用周期**:
>
> - < 1.9.0: Gradle 设置中支持 `enableEndorsedLibs` 标志
> - 1.9.0: Gradle 设置中**不**支持 `enableEndorsedLibs` 标志

### 移除 Gradle 约定

> **问题**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: source
>
> **简要总结**: Gradle 约定在 Gradle 7.1 中已弃用，并在 Gradle 8 中已移除。
>
> **弃用周期**:
>
> - 1.7.20: Gradle 约定已弃用
> - 1.9.0: Gradle 约定已移除

### 移除 KotlinCompile 任务的 classpath 属性

> **问题**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: source
>
> **简要总结**: 移除 `KotlinCompile` 任务的 `classpath` 属性。
>
> **弃用周期**:
>
> - 1.7.0: `classpath` 属性已弃用
> - 1.8.0: 将弃用级别提高到错误
> - 1.9.0: 从公共 API 中删除已弃用的函数

### 弃用 kotlin.internal.single.build.metrics.file 属性

> **问题**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: source
>
> **简要总结**: 弃用用于定义单个构建报告文件的 `kotlin.internal.single.build.metrics.file` 属性。
> 使用属性 `kotlin.build.report.single_file` 代替，并使用 `kotlin.build.report.output=single_file`。
>
> **弃用周期:**
>
> * 1.8.0: 将弃用级别提高到警告
> * &gt;= 1.9: 删除该属性