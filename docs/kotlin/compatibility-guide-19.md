[//]: # (title: Kotlin 1.9 兼容性指南)

_[保持语言的现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的核心原则。前者指出，阻碍语言演进的构造应该被移除；后者则要求，此类移除应提前充分沟通，以使代码迁移尽可能顺畅。

尽管大多数语言变更已通过其他渠道（如更新日志或编译器警告）公布，但本文档将它们全部总结，为从 Kotlin 1.8 迁移到 Kotlin 1.9 提供完整的参考。

## 基本术语

本文档介绍了几种兼容性类型：

- _源代码_：源代码不兼容变更会使原本可以正常编译（无错误或警告）的代码不再编译
- _二进制_：如果两个二进制产物互相替换不会导致加载或链接错误，则称它们是二进制兼容的
- _行为_：如果同一程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的

请记住，这些定义仅针对纯 Kotlin。Kotlin 代码与其他语言（例如 Java）的兼容性不在本文档的讨论范围之内。

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

> **Issue**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 引入了语言版本 1.9 并移除了对语言版本 1.3 的支持。
>
> **Deprecation cycle**:
>
> - 1.6.0: 报告警告
> - 1.9.0: 将警告提升为错误

### 当超接口类型是函数字面量时，禁止调用超类构造函数

> **Issue**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 如果接口继承自函数字面量类型，Kotlin 1.9 将禁止调用超类构造函数，因为不存在此类构造函数。
>
> **Deprecation cycle**:
> * 1.7.0: 报告警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告提升为错误

### 禁止注解参数类型中的循环

> **Issue**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 禁止注解的类型直接或间接作为其参数类型之一使用。这可以防止创建循环。
> 但是，允许参数类型是注解类型的 `Array` 或 `vararg`。
>
> **Deprecation cycle**:
> * 1.7.0: 对注解参数类型中的循环报告警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告提升为错误，可使用 `-XXLanguage:-ProhibitCyclesInAnnotations` 暂时恢复到 1.9 之前的行为

### 禁止在无参数的函数类型上使用 @ExtensionFunctionType 注解

> **Issue**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 禁止在无参数的函数类型上，或在非函数类型上使用 `@ExtensionFunctionType` 注解。
>
> **Deprecation cycle**:
> * 1.7.0: 对于非函数类型的注解报告警告，对于**是**函数类型的注解报告错误
> * 1.9.0: 将函数类型的警告提升为错误

### 禁止赋值时 Java 字段类型不匹配

> **Issue**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 如果检测到分配给 Java 字段的值的类型与 Java 字段的投影类型不匹配，Kotlin 1.9 将报告编译器错误。
>
> **Deprecation cycle**:
> * 1.6.0: 当投影的 Java 字段类型与分配的值类型不匹配时，报告警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告提升为错误，可使用 `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` 暂时恢复到 1.9 之前的行为

### 平台类型可空性断言异常中不包含源代码摘录

> **Issue**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行为
>
> **Short summary**: 在 Kotlin 1.9 中，表达式空值检查的异常消息不再包含源代码摘录。取而代之的是，显示方法或字段的名称。
> 如果表达式不是方法或字段，则消息中不提供额外信息。
>
> **Deprecation cycle**:
> * < 1.9.0: 表达式空值检查生成的异常消息包含源代码摘录
> * 1.9.0: 表达式空值检查生成的异常消息仅包含方法或字段名称，可使用 `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` 暂时恢复到 1.9 之前的行为

### 禁止将超类调用委托给抽象超类成员

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 当显式或隐式的超类调用委托给超类的 _抽象_ 成员时，即使超接口中存在默认实现，Kotlin 也会报告编译错误。
>
> **Deprecation cycle**:
>
> - 1.5.20: 当使用未重写所有抽象成员的非抽象类时，引入警告
> - 1.7.0: 如果超类调用实际上访问了超类中的抽象成员，则报告警告
> - 1.7.0: 如果启用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则在所有受影响的情况下报告错误；
>   在渐进模式下报告错误
> - 1.8.0: 在声明具有超类中未被重写的抽象方法的具体类，以及 `Any` 方法的超类调用在超类中被重写为抽象的情况下报告错误
> - 1.9.0: 在所有受影响的情况下报告错误，包括显式调用超类中的抽象方法

### 废弃 when-with-subject 中易混淆的语法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.6 废弃了 `when` 条件表达式中一些易混淆的语法结构。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对受影响的表达式引入废弃警告
> - 1.8.0: 将此警告提升为错误，可使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暂时恢复到 1.8 之前的行为
> - &gt;= 2.1: 将一些废弃的结构重新用于新的语言特性

### 阻止不同数值类型之间的隐式强制转换

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行为
>
> **Short summary**: Kotlin 将避免在语义上只需要向下转型到原始数值类型时，自动将数值转换为原始数值类型。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 所有受影响情况下的旧行为
> - 1.5.30: 修复生成的属性委托访问器中的向下转型行为，可使用 `-Xuse-old-backend` 暂时恢复到 1.5.30 修复之前的行为
> - &gt;= 2.0: 修复其他受影响情况下的向下转型行为

### 禁止泛型类型别名使用中上界违规（别名类型的类型参数作为泛型类型参数的类型参数使用）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 将禁止使用带有类型参数的类型别名，如果其类型参数违反了别名类型相应类型参数的上界限制，且类型别名的类型参数被用作别名类型的类型参数的泛型类型参数，例如 `typealias Alias<T> = Base<List<T>>`。
>
> **Deprecation cycle**:
>
> - 1.8.0: 当泛型类型别名使用中的类型参数违反了别名类型对应类型参数的上界约束时，报告警告
> - 2.0.0: 将警告提升为错误

### 在公共签名中近似局部类型时保留可空性

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码, 二进制
>
> **Short summary**: 当局部或匿名类型从没有显式指定返回类型的表达式体函数返回时，
> Kotlin 编译器会使用该类型的已知超类型推断（或近似）返回类型。
> 在此过程中，编译器可能会推断出非空类型，而实际上可能返回空值。
>
> **Deprecation cycle**:
>
> - 1.8.0: 通过灵活的超类型近似灵活的类型
> - 1.8.0: 当一个声明被推断为非空类型但实际上应为可空类型时，报告警告，提示用户显式指定类型
> - 2.0.0: 通过可空超类型近似可空类型，可使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暂时恢复到 2.0 之前的行为

### 不通过重写传播废弃状态

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 将不再从超类中废弃的成员向其在子类中的重写成员传播废弃状态，从而提供了一种显式机制，可以在废弃超类成员的同时，使其在子类中保持非废弃状态。
>
> **Deprecation cycle**:
>
> - 1.6.20: 报告一个警告，其中包含未来行为变更的消息，并提示用户要么抑制此警告，要么在废弃成员的重写上显式编写 `@Deprecated` 注解
> - 1.9.0: 停止向重写成员传播废弃状态。此变更在渐进模式下也立即生效

### 禁止在注解类中除参数声明以外的任何地方使用集合字面量

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 允许以受限的方式使用集合字面量——用于将数组传递给注解类的参数或为这些参数指定默认值。
> 然而，除此之外，Kotlin 允许在注解类内部的其他任何地方使用集合字面量，例如，在其嵌套对象中。Kotlin 1.9 将禁止在注解类中除了参数的默认值之外的任何地方使用集合字面量。
>
> **Deprecation cycle**:
>
> - 1.7.0: 对注解类中嵌套对象内的数组字面量报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止在默认值表达式中前向引用参数

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 将禁止在其他参数的默认值表达式中前向引用参数。这确保了在默认值表达式中访问参数时，它已经拥有一个值，该值要么传递给函数，要么通过其自身的默认值表达式进行初始化。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当带有默认值的参数在其之前的另一个参数的默认值中被引用时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误，可使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暂时恢复到 1.9 之前的行为

### 禁止在内联函数参数上进行扩展调用

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 尽管 Kotlin 允许将内联函数参数作为接收者传递给另一个内联函数，但在编译此类代码时总是导致编译器异常。
> Kotlin 1.9 将禁止这种行为，从而报告错误而不是使编译器崩溃。
>
> **Deprecation cycle**:
>
> - 1.7.20: 对内联函数参数上的内联扩展调用报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止调用带有匿名函数参数的名为 suspend 的中缀函数

> **Issue**: [KT-49264](https://youtrack.com/issue/KT-49264)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 将不再允许调用带有作为匿名函数字面量传递的单个函数类型参数的名为 `suspend` 的中缀函数。
>
> **Deprecation cycle**:
>
> - 1.7.20: 对带有匿名函数字面量的 suspend 中缀调用报告警告
> - 1.9.0: 将警告提升为错误，可使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暂时恢复到 1.9 之前的行为
> - TODO: Change how the `suspend fun` token sequence is interpreted by the parser

### 禁止内部类中使用捕获的类型参数时违反其协变性

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 将禁止在具有 `in` 或 `out` 协变性的外部类的内部类中，在违反该类型参数声明的协变性的位置使用该外部类的类型参数。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当外部类的类型参数使用位置违反了该参数的协变性规则时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误，可使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暂时恢复到 1.9 之前的行为

### 禁止在复合赋值运算符中递归调用无显式返回类型的函数

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 将禁止在函数体内部的复合赋值运算符的参数中调用无显式返回类型的函数，就像它目前在该函数体内部的其他表达式中一样。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当无显式返回类型的函数在该函数体中，在复合赋值运算符的参数中被递归调用时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止不健全的调用，其中期望 @NotNull T 而给定带有可空边界的 Kotlin 泛型参数

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 将禁止方法调用，其中将可能可空的泛型类型值传递给 Java 方法的 `@NotNull` 注解参数。
>
> **Deprecation cycle**:
>
> - 1.5.20: 当无约束的泛型类型参数被传递到期望非空类型的位置时，报告警告
> - 1.9.0: 报告类型不匹配错误而不是上述警告，可使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暂时恢复到 1.8 之前的行为

### 禁止从枚举的条目初始化器中访问枚举伴生对象的成员

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 将禁止从枚举条目初始化器中对枚举伴生对象进行任何形式的访问。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对此类伴生成员访问报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误，可使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暂时恢复到 1.8 之前的行为

### 废弃并移除 Enum.declaringClass 合成属性

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 允许在 `Enum` 值上使用合成属性 `declaringClass`，该值由底层 Java 类 `java.lang.Enum` 的 `getDeclaringClass()` 方法生成，尽管此方法对 Kotlin `Enum` 类型不可用。Kotlin 1.9 将禁止使用此属性，建议改用扩展属性 `declaringJavaClass`。
>
> **Deprecation cycle**:
>
> - 1.7.0: 对 `declaringClass` 属性使用报告警告（或在渐进模式下报告错误），建议迁移到 `declaringJavaClass` 扩展
> - 1.9.0: 将警告提升为错误，可使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暂时恢复到 1.9 之前的行为
> - 2.0.0: 移除 `declaringClass` 合成属性

### 废弃编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **Issues**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 1.9 禁止使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - 1.9.0: 将此警告提升为错误

### 禁止在构建器推断上下文中将类型变量隐式推断为上界

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Kotlin 2.0 将禁止在构建器推断 lambda 函数的作用域中，在缺少任何使用站点类型信息的情况下，将类型变量推断为相应的类型参数的上界，就像它目前在其他上下文中一样。
>
> **Deprecation cycle**:
>
> - 1.7.20: 当在缺少使用站点类型信息的情况下，类型参数被推断为其声明的上界时，报告警告（或在渐进模式下报告错误）
> - 2.0.0: 将警告提升为错误

## 标准库

### 在 Range/Progression 开始实现 Collection 时，警告潜在的重载解析变更

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: 核心语言 / kotlin-stdlib
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 计划在 Kotlin 1.9 中，在标准 Progression (进程) 和从它们继承的具体 Range (范围) 中实现 `Collection` 接口。
> 如果某个方法有两个重载，一个接受一个元素，另一个接受一个集合，这可能导致在重载解析中选择不同的重载。
> 当使用 Range 或 Progression 参数调用此类重载方法时，Kotlin 将通过报告警告或错误来使这种情况可见。
>
> **Deprecation cycle**:
>
> - 1.6.20: 当使用标准 Progression 或其 Range 继承者作为参数调用重载方法时，如果此 Progression/Range 实现 `Collection` 接口将在未来导致此调用中选择另一个重载，则报告警告
> - 1.8.0: 将此警告提升为错误
> - 2.1.0: 停止报告错误，在 progressions 中实现 `Collection` 接口，从而改变受影响情况下的重载解析结果

### 将 kotlin.dom 和 kotlin.browser 包中的声明迁移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 源代码
>
> **Short summary**: `kotlin.dom` 和 `kotlin.browser` 包中的声明已移动到相应的 `kotlinx.*` 包，以准备将它们从标准库中提取出来。
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替代 API
> - 1.4.0: 废弃 `kotlin.dom` 和 `kotlin.browser` 包中的 API 并建议上述新 API 作为替代
> - 1.6.0: 将废弃级别提升为错误
> - 1.8.20: 为 JS-IR 目标从标准库中移除废弃函数
> - &gt;= 2.0: 将 kotlinx.* 包中的 API 移动到单独的库

### 废弃部分仅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 标准库中一些仅限 JS 的函数被废弃，以备移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比较函数的数组排序函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **Deprecation cycle**:
>
> - 1.6.0: 对受影响的函数发出废弃警告
> - 1.9.0: 将废弃级别提升为错误
> - &gt;=2.0: 从公共 API 中移除废弃函数

## 工具

### 从 Gradle 配置中移除 enableEndorsedLibs 标志

> **Issue**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **Component**: Gradle
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Gradle 配置中不再支持 `enableEndorsedLibs` 标志。
>
> **Deprecation cycle**:
>
> - < 1.9.0: `enableEndorsedLibs` 标志在 Gradle 配置中受支持
> - 1.9.0: `enableEndorsedLibs` 标志在 Gradle 配置中**不**受支持

### 移除 Gradle 约定

> **Issue**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **Component**: Gradle
>
> **Incompatible change type**: 源代码
>
> **Short summary**: Gradle 约定在 Gradle 7.1 中被废弃，并已在 Gradle 8 中移除。
>
> **Deprecation cycle**:
>
> - 1.7.20: Gradle 约定已废弃
> - 1.9.0: Gradle 约定已移除

### 移除 KotlinCompile 任务的 classpath 属性

> **Issue**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **Component**: Gradle
>
> **Incompatible change type**: 源代码
>
> **Short summary**: `KotlinCompile` 任务的 `classpath` 属性已移除。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` 属性已废弃
> - 1.8.0: 将废弃级别提升为错误
> - 1.9.0: 从公共 API 中移除废弃函数

### 废弃 kotlin.internal.single.build.metrics.file 属性

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 废弃用于定义构建报告单个文件的 `kotlin.internal.single.build.metrics.file` 属性。
> 请改用 `kotlin.build.report.single_file` 属性，并设置 `kotlin.build.report.output=single_file`。
>
> **Deprecation cycle:**
>
> * 1.8.0: 将废弃级别提升为警告
> * &gt;= 1.9: 删除该属性