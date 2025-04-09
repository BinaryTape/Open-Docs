---
title: "Kotlin 1.8 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的根本原则。前者指出，应移除阻碍语言发展的结构；后者指出，应事先充分沟通此类移除，以尽可能顺利地进行代码迁移。

虽然大多数语言变更已通过其他渠道（如更新日志或编译器警告）发布，但本文档对所有变更进行了总结，为从 Kotlin 1.7 迁移到 Kotlin 1.8 提供了完整的参考。

## 基本术语

在本文档中，我们引入了几种兼容性：

- _source (源码)_：源码不兼容的变更会导致原本可以正常编译的代码（没有错误或警告）无法再编译
- _binary (二进制)_：如果交换两个二进制文件不会导致加载或链接错误，则称这两个二进制文件是二进制兼容的
- _behavioral (行为)_：如果同一程序在应用变更前后表现出不同的行为，则称该变更在行为上是不兼容的

请记住，这些定义仅适用于纯 Kotlin。从其他语言角度来看，Kotlin 代码的兼容性（例如，从 Java 角度）不在本文档的范围内。

## 语言

<!--
### 标题

> **问题**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**:
>
> **弃用周期**:
>
> - 1.6.20: 报告一个警告
> - 1.8.0: 将警告提升为错误
-->

### 禁止将超类调用委托给抽象超类成员

> **问题**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
> 
> **简要概述**: 当显式或隐式超类调用委托给超类的 _abstract (抽象)_ 成员时，即使超接口中存在默认实现，Kotlin 也会报告编译错误
>
> **弃用周期**:
>
> - 1.5.20: 引入一个警告，当使用未覆盖所有抽象成员的非抽象类时
> - 1.7.0: 如果超类调用实际上访问了超类的抽象成员，则报告一个警告
> - 1.7.0: 如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则在所有受影响的情况下报告一个错误；在渐进模式下报告一个错误
> - 1.8.0: 在声明一个具有超类中未被覆盖的抽象方法的具体类，并且 `Any` 方法的超类调用在超类中被覆盖为抽象的情况下报告一个错误
> - 1.9.0: 在所有受影响的情况下报告一个错误，包括对超类的抽象方法的显式超类调用

### 弃用 `when-with-subject` 中令人困惑的语法

> **问题**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.6 弃用了 `when` 条件表达式中几个令人困惑的语法结构
>
> **弃用周期**:
>
> - 1.6.20: 在受影响的表达式上引入弃用警告
> - 1.8.0: 将此警告提升为错误,
>   `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 可用于临时恢复到 1.8 之前的行为
> - &gt;= 1.9: 将一些已弃用的结构重新用于新的语言特性

### 阻止不同数字类型之间的隐式强制转换

> **问题**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: 行为
>
> **简要概述**: Kotlin 将避免自动将数值转换为基本数值类型，而语义上只需要向下转换到该类型
>
> **弃用周期**:
>
> - < 1.5.30: 在所有受影响的情况下都保持旧的行为
> - 1.5.30: 修复生成的属性委托访问器中的向下转换行为,
>   `-Xuse-old-backend` 可用于临时恢复到 1.5.30 之前的修复行为
> - &gt;= 1.9: 修复其他受影响情况下的向下转换行为

### 使密封类 (sealed class) 的私有构造函数真正私有

> **问题**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 在放宽了对密封类的继承者可以在项目结构中声明的位置的限制之后，密封类构造函数的默认可见性变为 protected (受保护)。但是，在 1.8 之前，Kotlin 仍然允许在这些类的范围之外调用显式声明的密封类的私有构造函数
>
> **弃用周期**:
>
> - 1.6.20: 当在密封类外部调用密封类的私有构造函数时，报告一个警告（或在渐进模式下报告一个错误）
> - 1.8.0: 对私有构造函数使用默认可见性规则（只有当调用在相应的类内部时，才能解析对私有构造函数的调用），
>   可以通过指定 `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 编译器参数来临时恢复旧的行为

### 禁止在构建器推断上下文 (builder inference context) 中对不兼容的数值类型使用 `==` 运算符

> **问题**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.8 将禁止在构建器推断 lambda 函数的范围内对不兼容的数值类型（例如，`Int` 和 `Long`）使用 `==` 运算符，就像它目前在其他上下文中一样
>
> **弃用周期**:
>
> - 1.6.20: 当对不兼容的数值类型使用 `==` 运算符时，报告一个警告（或在渐进模式下报告一个错误）
> - 1.8.0: 将警告提升为错误,
>   `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` 可用于临时恢复到 1.8 之前的行为

### 禁止在 Elvis 运算符 (Elvis operator) 的右侧使用没有 `else` 的 `if` 和非穷举的 `when`

> **问题**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.8 将禁止在 Elvis 运算符 (`?:`) 的右侧使用非穷举的 `when` 或没有 `else` 分支的 `if` 表达式。以前，如果 Elvis 运算符的结果未用作表达式，则允许这样做
>
> **弃用周期**:
>
> - 1.6.20: 对此类非穷举的 if 和 when 表达式报告一个警告（或在渐进模式下报告一个错误）
> - 1.8.0: 将此警告提升为错误,
>   `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` 可用于临时恢复到 1.8 之前的行为

### 禁止在泛型类型别名 (generic type alias) 用法中违反上限（一个类型参数用于别名类型的多个类型实参中）

> **问题**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 如果别名类型的一个类型参数被用于别名类型的多个类型实参中，例如，`typealias Alias<T> = Base<T, T>`，Kotlin 1.8 将禁止使用类型实参违反别名类型的相应类型参数的上限约束的类型别名
>
> **弃用周期**:
>
> - 1.7.0: 对类型实参违反别名类型的相应类型参数的上限约束的类型别名的用法报告一个警告（或在渐进模式下报告一个错误）
> - 1.8.0: 将此警告提升为错误,
>  `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` 可用于临时恢复到 1.8 之前的行为

### 禁止在泛型类型别名用法中违反上限（类型参数用于别名类型的类型实参的泛型类型实参中）

> **问题**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 如果别名类型参数用作别名类型的类型参数的泛型类型参数，例如 `typealias Alias<T> = Base<List<T>>`，Kotlin 将禁止使用类型参数违反别名类型的对应类型参数的上限限制的类型别名。
>
> **弃用周期**:
>
> - 1.8.0: 当泛型类型别名用法具有违反别名类型的相应类型参数的上限约束的类型参数时，报告一个警告
> - &gt;=1.10: 将警告提升为错误

### 禁止在委托中使用为扩展属性声明的类型参数

> **问题**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.8 将禁止以不安全的方式将泛型类型的扩展属性委托给使用接收者的类型参数的泛型类型
>
> **弃用周期**:
>
> - 1.6.0: 当将扩展属性委托给以特定方式使用从委托属性的类型参数推断的类型参数的类型时，报告一个警告（或在渐进模式下报告一个错误）
> - 1.8.0: 将警告提升为错误,
>  `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` 可用于临时恢复到 1.8 之前的行为

### 禁止在 suspend (挂起) 函数上使用 `@Synchronized` 注解

> **问题**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.8 将禁止将 `@Synchronized` 注解放在 suspend 函数上，因为不应允许在 synchronized (同步) 代码块内发生挂起调用
>
> **弃用周期**:
>
> - 1.6.0: 在用 `@Synchronized` 注解的 suspend 函数上报告一个警告,
>    该警告在渐进模式下报告为一个错误
> - 1.8.0: 将警告提升为错误,
>    `-XXLanguage:-SynchronizedSuspendError` 可用于临时恢复到 1.8 之前的行为

### 禁止使用 spread operator (展开运算符) 将参数传递给非 vararg 参数

> **问题**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 在某些条件下，Kotlin 允许使用 spread operator (`*`) 将数组传递给非 vararg 数组参数。从 Kotlin 1.8 开始，这将是被禁止的
>
> **弃用周期**:
>
> - 1.6.0: 当期望一个非 vararg 数组参数时，报告一个关于使用 spread operator 的警告（或在渐进模式下报告一个错误）
> - 1.8.0: 将警告提升为错误,
>   `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` 可用于临时恢复到 1.8 之前的行为

### 禁止在通过 lambda 返回类型重载的函数传递的 lambda 中违反 null-safety (空安全)

> **问题**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 当重载不允许可空返回类型时，Kotlin 1.8 将禁止从传递给通过这些 lambda 的返回类型重载的函数的 lambda 返回 `null`。
> 以前，当从 `when` 运算符的一个分支返回 `null` 时，允许这样做
>
> **弃用周期**:
>
> - 1.6.20: 报告类型不匹配警告（或在渐进模式下报告一个错误）
> - 1.8.0: 将警告提升为错误,
>   `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` 可用于临时恢复到 1.8 之前的行为

### 在 public (公共) 签名中近似局部类型 (local types) 时保持可空性 (nullability)

> **问题**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码, 二进制
>
> **简要概述**: 当从没有显式指定返回类型的表达式体函数返回局部类型或匿名类型时，Kotlin 编译器使用该类型的已知超类型推断（或近似）返回类型。
> 在此过程中，编译器可以推断出一个不可空类型，而实际上可能会返回 null 值
>
> **弃用周期**:
>
> - 1.8.0: 通过灵活的超类型近似灵活的类型
> - 1.8.0: 当一个声明被推断为具有应该是可空的非空类型时，报告一个警告，提示用户显式指定该类型
> - 1.9.0: 通过可空的超类型近似可空类型,
>   `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 可用于临时恢复到 1.9 之前的行为

### 不要通过 override (重写) 传播 deprecation (弃用)

> **问题**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.9 将不再将超类中已弃用的成员的弃用传播到子类中的其 override 成员，从而为弃用超类的成员同时使其在子类中保持未弃用状态提供了一种显式机制
>
> **弃用周期**:
>
> - 1.6.20: 报告一个警告，其中包含未来行为更改的消息，并提示您抑制此警告或在已弃用成员的 override 上显式编写 `@Deprecated` 注释
> - 1.9.0: 停止将弃用状态传播到重写成员。此更改也会立即在渐进模式下生效

### 禁止在构建器推断上下文中将类型变量隐式推断到上限中

> **问题**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.9 将禁止在构建器推断 lambda 函数的范围内，在没有任何使用点类型信息的情况下，将类型变量推断到相应类型参数的上限中，就像它目前在其他上下文中一样
>
> **弃用周期**:
>
> - 1.7.20: 当在没有使用点类型信息的情况下，将类型参数推断到声明的上限中时，报告一个警告（或在渐进模式下报告一个错误）
> - 1.9.0: 将警告提升为错误,
>   `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` 可用于临时恢复到 1.9 之前的行为

### 禁止在注解类 (annotation classes) 中使用集合字面量 (collection literals)，除非在它们的参数声明中

> **问题**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 允许以受限制的方式使用集合字面量 - 用于将数组传递给注解类的参数或为这些参数指定默认值。
> 然而，除此之外，Kotlin 允许在注解类中的任何其他地方使用集合字面量，例如，
> 在其嵌套对象中。Kotlin 1.9 将禁止在注解类中使用集合字面量，除非在其参数的默认值中。
>
> **弃用周期**:
>
> - 1.7.0: 在注解类中的嵌套对象中的数组字面量上报告一个警告（或在渐进模式下报告一个错误）
> - 1.9.0: 将警告提升为错误

### 禁止在默认值表达式中向前引用具有默认值的参数

> **问题**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.9 将禁止在其他参数的默认值表达式中向前引用具有默认值的参数。这确保了在默认值表达式中访问参数时，
> 它已经有一个传递给函数的值或由其自身的默认值表达式初始化的值
>
> **弃用周期**:
>
> - 1.7.0: 当在位于其之前的另一个参数的默认值中引用具有默认值的参数时，报告一个警告（或在渐进模式下报告一个错误）
> - 1.9.0: 将警告提升为错误,
>   `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 可用于临时恢复到 1.9 之前的行为

### 禁止在内联函数 (inline functions) 参数上进行扩展调用

> **问题**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 虽然 Kotlin 允许将内联函数参数作为 receiver (接收者) 传递给另一个内联函数，但在编译此类代码时总是会导致编译器异常。
> Kotlin 1.9 将禁止这样做，因此会报告一个错误而不是崩溃编译器
>
> **弃用周期**:
>
> - 1.7.20: 对内联函数参数上的内联扩展调用报告一个警告（或在渐进模式下报告一个错误）
> - 1.9.0: 将警告提升为错误

### 禁止调用名为 `suspend` 的 infix (中缀) 函数，该函数具有匿名函数参数

> **问题**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.9 将不再允许调用名为 `suspend` 的中缀函数，该函数具有作为匿名函数字面量传递的函数类型 (functional type) 的单个参数
>
> **弃用周期**:
>
> - 1.7.20: 在带有匿名函数字面量的 suspend 中缀调用上报告一个警告
> - 1.9.0: 将警告提升为错误,
>   `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 可用于临时恢复到 1.9 之前的行为
> - &gt;=1.10: 更改解析器解释 `suspend fun` 标记序列的方式

### 禁止在内部类 (inner classes) 中针对 captured (捕获的) 类型参数的 variance (变性) 使用它们

> **问题**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.9 将禁止在该类的内部类中，以违反这些类型参数声明的 variance 的位置使用具有 `in` 或 `out` variance 的外部类的类型参数
>
> **弃用周期**:
>
> - 1.7.0: 当外部类的类型参数使用位置违反该参数的 variance 规则时，报告一个警告（或在渐进模式下报告一个错误）
> - 1.9.0: 将警告提升为错误,
>   `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 可用于临时恢复到 1.9 之前的行为

### 禁止在复合赋值运算符 (compound assignment operators) 中递归调用没有显式返回类型的函数

> **问题**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.9 将禁止在该函数体内的复合赋值运算符的参数中调用没有显式指定返回类型的函数，就像它目前在该函数的函数体内的其他表达式中一样
>
> **弃用周期**:
>
> - 1.7.0: 当没有显式指定返回类型的函数在该函数体内的复合赋值运算符参数中被递归调用时，报告一个警告（或在渐进模式下报告一个错误）
> - 1.9.0: 将警告提升为错误

### 禁止使用预期的 `@NotNull T` 进行不健全的调用，并提供带有可空界限的 Kotlin 泛型参数

> **问题**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.9 将禁止方法调用，其中将潜在可空的泛型类型的值传递给 Java 方法的 `@NotNull` 注解的参数
>
> **弃用周期**:
>
> - 1.5.20: 当传递未受约束的泛型类型参数且期望非空类型时，报告一个警告
> - 1.9.0: 报告类型不匹配错误而不是上面的警告,
>   `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 可用于临时恢复到 1.8 之前的行为

### 禁止从该枚举的条目初始化器 (entry initializers) 访问枚举类的伴生对象 (companion) 的成员

> **问题**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **组件**: 核心语言
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.9 将禁止从枚举条目初始化器对枚举的伴生对象进行所有类型的访问
>
> **弃用周期**:
>
> - 1.6.20: 对此类伴生对象成员访问报告一个警告（或在渐进模式下报告一个错误）
> - 1.9.0: 将警告提升为错误,
>   `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 可用于临时恢复到 1.8 之前的行为

### 弃用并移除 `Enum.declaringClass` 合成属性

> **问题**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 允许在从底层 Java 类 `java.lang.Enum` 的方法 `getDeclaringClass()` 生成的 `Enum` 值上使用合成属性 `declaringClass`，即使此方法不适用于 Kotlin `Enum` 类型。Kotlin 1.9 将禁止使用此属性，建议迁移到扩展属性 `declaringJavaClass`
>
> **弃用周期**:
>
> - 1.7.0: 在 `declaringClass` 属性用法上报告一个警告（或在渐进模式下报告一个错误）,
>   建议迁移到 `declaringJavaClass` 扩展
> - 1.9.0: 将警告提升为错误,
>   `-XXLanguage:-ProhibitEnumDeclaringClass` 可用于临时恢复到 1.9 之前的行为
> - &gt;=1.10: 移除 `declaringClass` 合成属性

### 弃用编译器选项 `-Xjvm-default` 的 enable 和 compatibility 模式

> **问题**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **组件**: Kotlin/JVM
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: Kotlin 1.6.20 警告关于使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式
>
> **弃用周期**:
>
> - 1.6.20: 在 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式上引入一个警告
> - &gt;= 1.9: 将此警告提升为错误

## 标准库

### 当 Range/Progression 开始实现 Collection 时，警告关于潜在的重载解析变更

> **问题**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **组件**: 核心语言 / kotlin-stdlib
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 计划在 Kotlin 1.9 中在标准 progression (数列) 和从中继承的 concrete range (具体区间) 中实现 `Collection` 接口。如果某个方法的两个重载，一个接受元素，另一个接受集合，这可能会使不同的重载在重载解析中被选中。
> 当使用 range 或 progression 参数调用此类重载方法时，Kotlin 将通过报告警告或错误来使这种情况可见
>
> **弃用周期**:
>
> - 1.6.20: 当使用标准 progression 或其 range 继承者作为参数调用重载方法时，如果通过此 progression/range 实现 `Collection` 接口会导致将来在此调用中选择另一个重载，则报告一个警告
> - 1.8.0: 将此警告提升为错误
> - 1.9.0: 停止报告错误，在 progression 中实现 `Collection` 接口，从而更改受影响情况下的重载解析结果

### 将声明从 `kotlin.dom` 和 `kotlin.browser` 包迁移到 `kotlinx.*`

> **问题**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 来自 `kotlin.dom` 和 `kotlin.browser` 包的声明被移动到相应的 `kotlinx.*` 包，以准备将它们从 stdlib 中提取出来
>
> **弃用周期**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替换 API
> - 1.4.0: 弃用 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并建议使用上面的新 API 作为替代
> - 1.6.0: 将弃用级别提升为错误
> - 1.8.20: 从 JS-IR 目标的 stdlib 中移除已弃用的函数
> - &gt;= 1.9: 将 kotlinx.* 包中的 API 移动到单独的库中

### 弃用一些仅限 JS 的 API

> **问题**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: stdlib 中许多仅限 JS 的函数已被弃用以供删除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及数组上采用比较函数的 `sort` 函数，例如，`Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`
>
> **弃用周期**:
>
> - 1.6.0: 弃用受影响的函数并发出警告
> - 1.9.0: 将弃用级别提升为错误
> - &gt;=1.10.0: 从公共 API 中删除已弃用的函数

## 工具

### 提高 KotlinCompile task 的 classpath 属性的弃用级别

> **问题**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: `KotlinCompile` task 的 `classpath` 属性已被弃用
>
> **弃用周期**:
>
> - 1.7.0: `classpath` 属性已被弃用
> - 1.8.0: 将弃用级别提升为错误
> - &gt;=1.9.0: 从公共 API 中删除已弃用的函数

### 移除 kapt.use.worker.api Gradle 属性

> **问题**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: 行为
>
> **简要概述**: 移除 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 kapt (默认值: true)
>
> **弃用周期**:
>
> - 1.6.20: 将弃用级别提升为警告
> - 1.8.0: 移除此属性

### 移除 kotlin.compiler.execution.strategy system (系统) 属性

> **问题**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: 行为
>
> **简要概述**: 移除 `kotlin.compiler.execution.strategy` 系统属性，该属性用于选择编译器执行策略。
> 使用 Gradle 属性 `kotlin.compiler.execution.strategy` 或编译 task 属性 `compilerExecutionStrategy` 代替
>
> **弃用周期:**
>
> - 1.7.0: 将弃用级别提升为警告
> - 1.8.0: 移除该属性

### 编译器选项中的变更

> **问题**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: 源码, 二进制
>
> **简要概述**: 此更改可能会影响 Gradle 插件作者。在 `kotlin-gradle-plugin` 中，某些内部类型有额外的泛型参数（您应该添加泛型类型或 `*`）。
> `KotlinNativeLink` task 不再继承 `AbstractKotlinNativeCompile` task。
> `KotlinJsCompilerOptions.outputFile` 和相关的 `KotlinJsOptions.outputFile` 选项已被弃用。
> 使用 `Kotlin2JsCompile.outputFileProperty` task 输入代替。`kotlinOptions` task 输入和 `kotlinOptions{...}`
> task DSL 处于支持模式，将在即将发布的版本中被弃用。无法在 task 执行阶段更改 `compilerOptions` 和 `kotlinOptions`（请参阅 [Kotlin 1.8 中的新特性](whatsnew18#limitations) 中的一个例外）。
> `freeCompilerArgs` 返回一个不可变的 `List<String>` – `kotlinOptions.freeCompilerArgs.remove("something")` 将会失败。
> 允许使用旧 JVM 后端的 `useOldBackend` 属性已被移除
>
> **弃用周期:**
>
> - 1.8.0: `KotlinNativeLink` task 不再继承 `AbstractKotlinNativeCompile`。`KotlinJsCompilerOptions.outputFile`
> 和相关的 `KotlinJsOptions.outputFile` 选项已被弃用。允许使用旧 JVM 后端的 `useOldBackend` 属性已被移除。

### 弃用 kotlin.internal.single.build.metrics.file 属性

> **问题**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **组件**: Gradle
>
> **不兼容的变更类型**: 源码
>
> **简要概述**: 弃用用于定义构建报告的单个文件的 `kotlin.internal.single.build.metrics.file` 属性。
> 将属性 `kotlin.build.report.single_file` 与 `kotlin.build.report.output=single_file` 一起使用
>
> **弃用周期:**
>
> - 1.8.0: 将弃用级别提升为警告
> &gt;= 1.9: 删除该属性