[//]: # (title: Kotlin 1.8 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的核心原则。前者指出，阻碍语言演进的结构应该被移除；后者则强调，这种移除应提前充分沟通，以使代码迁移尽可能平滑。

虽然大多数语言变更已通过其他渠道（例如更新日志或编译器警告）发布，但本文档总结了所有这些变更，为从 Kotlin 1.7 迁移到 Kotlin 1.8 提供了完整参考。

## 基本术语

本文档中引入了几种兼容性：

-   _源兼容性_：源不兼容变更会导致原本可以正常（无错误或警告）编译的代码不再编译通过。
-   _二进制兼容性_：如果两个二进制 artifact 相互替换不会导致加载或链接错误，则称它们具有二进制兼容性。
-   _行为兼容性_：如果同一程序在应用变更前后表现出不同行为，则称该变更具有行为不兼容性。

请记住，这些定义仅适用于纯 Kotlin。从其他语言（例如 Java）的角度来看 Kotlin 代码的兼容性不在本文档的范围之内。

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

### 禁止将 super 调用委托给抽象超类成员

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 将报告一个编译错误，当显式或隐式 super 调用委托给超类的 _抽象_ 成员时，即使超接口中存在默认实现。
>
> **Deprecation cycle**:
>
> - 1.5.20: 当使用未覆盖所有抽象成员的非抽象类时，引入警告
> - 1.7.0: 如果 super 调用实际访问了超类中的抽象成员，则报告警告
> - 1.7.0: 如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则在所有受影响的情况下报告错误；在渐进模式中报告错误
> - 1.8.0: 在声明具有超类中未覆盖抽象方法的具体类，以及 `Any` 方法的 super 调用在超类中被覆盖为抽象方法的情况下报告错误
> - 1.9.0: 在所有受影响的情况下报告错误，包括对超类中抽象方法的显式 super 调用

### 弃用 when 表达式中令人困惑的语法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 弃用了 `when` 条件表达式中几个令人困惑的语法结构。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对受影响的表达式引入弃用警告
> - 1.8.0: 将此警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暂时恢复到 1.8 之前的行为
> - &gt;= 1.9: 为新的语言特性重新定义一些已弃用的结构

### 禁止不同数值类型之间的隐式强制转换

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 将避免自动将数值转换为基本数值类型，如果语义上只需要向下转型到该类型。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 在所有受影响的情况下保持旧行为
> - 1.5.30: 修复生成的属性委托访问器中的向下转型行为，
>   可以使用 `-Xuse-old-backend` 暂时恢复到 1.5.30 修复之前的行为
> - &gt;= 1.9: 修复其他受影响情况下的向下转型行为

### 使密封类的私有构造函数真正私有

> **Issue**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 在放宽密封类继承者在项目结构中声明位置的限制后，密封类构造函数的默认可见性变为 protected。然而，直到 1.8 版本，Kotlin 仍然允许在这些类的作用域之外调用显式声明的密封类私有构造函数。
>
> **Deprecation cycle**:
>
> - 1.6.20: 当在密封类之外调用密封类的私有构造函数时，报告警告（或在渐进模式中报告错误）
> - 1.8.0: 对私有构造函数使用默认可见性规则（私有构造函数的调用只能在其对应类内部解析），
>   可以通过指定 `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 编译器实参暂时恢复旧行为

### 禁止在构建器推断上下文中使用操作符 == 比较不兼容的数值类型

> **Issue**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 将禁止在构建器推断 lambda 表达式的作用域内使用操作符 `==` 比较不兼容的数值类型，例如 `Int` 和 `Long`，与目前在其他上下文中的处理方式相同。
>
> **Deprecation cycle**:
>
> - 1.6.20: 当在不兼容的数值类型上使用操作符 `==` 时，报告警告（或在渐进模式中报告错误）
> - 1.8.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` 暂时恢复到 1.8 之前的行为

### 禁止在 Elvis 操作符右侧使用不带 else 的 if 表达式和不完全穷尽的 when 表达式

> **Issue**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 将禁止在 Elvis 操作符 (`?:`) 的右侧使用不完全穷尽的 `when` 表达式或不带 `else` 分支的 `if` 表达式。此前，如果 Elvis 操作符的结果不作为表达式使用，这是允许的。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对此类不完全穷尽的 if 和 when 表达式报告警告（或在渐进模式中报告错误）
> - 1.8.0: 将此警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` 暂时恢复到 1.8 之前的行为

### 禁止在泛型类型别名用法中违反上限约束（当一个类型形参被用于别名类型的多个类型实参中）

> **Issues**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 将禁止使用类型实参违反别名类型相应类型形参上限约束的类型别名，如果一个类型别名类型形参被用于别名类型的多个类型实参中，例如 `typealias Alias<T> = Base<T, T>`。
>
> **Deprecation cycle**:
>
> - 1.7.0: 对使用类型实参违反别名类型相应类型形参上限约束的类型别名报告警告（或在渐进模式中报告错误）
> - 1.8.0: 将此警告提升为错误，
>   可以使用 `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` 暂时恢复到 1.8 之前的行为

### 禁止在泛型类型别名用法中违反上限约束（当一个类型形参被用作别名类型的类型实参的泛型类型实参中）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 将禁止使用类型实参违反别名类型相应类型形参上限约束的类型别名，如果类型别名类型形参被用作别名类型的类型实参的泛型类型实参中，例如 `typealias Alias<T> = Base<List<T>>`。
>
> **Deprecation cycle**:
>
> - 1.8.0: 当泛型类型别名用法具有违反别名类型相应类型形参上限约束的类型实参时，报告警告
> - &gt;=1.10: 将警告提升为错误

### 禁止在委托中将为扩展属性声明的类型形参以不安全的方式使用

> **Issue**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 将禁止将泛型类型上的扩展属性委托给以不安全方式使用接收者类型形参的泛型类型。
>
> **Deprecation cycle**:
>
> - 1.6.0: 当将扩展属性委托给以特定方式使用从委托属性类型实参推断的类型形参的类型时，报告警告（或在渐进模式中报告错误）
> - 1.8.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` 暂时恢复到 1.8 之前的行为

### 禁止在挂起函数上使用 @Synchronized 注解

> **Issue**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 将禁止在挂起函数上放置 `@Synchronized` 注解，因为挂起调用不应被允许在同步代码块内发生。
>
> **Deprecation cycle**:
>
> - 1.6.0: 对使用 `@Synchronized` 注解的挂起函数报告警告，
>   在渐进模式中，该警告被报告为错误
> - 1.8.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-SynchronizedSuspendError` 暂时恢复到 1.8 之前的行为

### 禁止使用展开操作符将实参传递给非变长形参

> **Issue**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 曾允许在某些条件下使用展开操作符 (`*`) 将数组传递给非变长数组形参。从 Kotlin 1.8 开始，这将受到禁止。
>
> **Deprecation cycle**:
>
> - 1.6.0: 当在预期非变长数组形参的位置使用展开操作符时，报告警告（或在渐进模式中报告错误）
> - 1.8.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` 暂时恢复到 1.8 之前的行为

### 禁止在传递给通过 lambda 返回类型重载的函数中，lambda 表达式中出现空安全违规

> **Issue**: [KT-49658](https://youtrack.fakku.com/issue/KT-49658)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 将禁止从传递给通过 lambda 返回类型重载的 lambda 表达式中返回 `null`，如果重载不允许可空返回类型。
> 此前，当 `null` 从 `when` 操作符的一个分支返回时，这是允许的。
>
> **Deprecation cycle**:
>
> - 1.6.20: 报告类型不匹配警告（或在渐进模式中报告错误）
> - 1.8.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` 暂时恢复到 1.8 之前的行为

### 在公共签名中近似局部类型时保持可空性

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 当从没有显式指定返回类型的表达式体函数返回局部或匿名类型时，Kotlin 编译器会使用该类型已知的超类型来推断（或近似）返回类型。
> 在此过程中，编译器可能会推断出一个非空类型，而实际上却可能返回 `null` 值。
>
> **Deprecation cycle**:
>
> - 1.8.0: 通过灵活超类型近似灵活类型
> - 1.8.0: 当声明被推断为非空类型但实际应为可空类型时，报告警告，提示用户显式指定类型
> - 1.9.0: 通过可空超类型近似可空类型，
>   可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暂时恢复到 1.9 之前的行为

### 不通过覆盖传播弃用状态

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将不再从超类中已弃用的成员向其在子类中覆盖的成员传播弃用状态，从而提供一种显式机制，允许弃用超类成员同时使其在子类中保持非弃用状态。
>
> **Deprecation cycle**:
>
> - 1.6.20: 报告一条警告，其中包含未来行为变更的消息，并提示用户抑制此警告或在已弃用成员的覆盖上显式编写 `@Deprecated` 注解
> - 1.9.0: 停止向被覆盖成员传播弃用状态。此变更也立即在渐进模式中生效

### 禁止在构建器推断上下文的没有使用点类型信息时，将类型变量隐式推断为上限

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止在构建器推断 lambda 表达式作用域中没有使用点类型信息时，将类型变量隐式推断为其相应类型形参的上限，与目前在其他上下文中的处理方式相同。
>
> **Deprecation cycle**:
>
> - 1.7.20: 当在没有使用点类型信息的情况下，类型形参被推断为声明的上限时，报告警告（或在渐进模式中报告错误）
> - 1.9.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` 暂时恢复到 1.9 之前的行为

### 禁止在注解类中除形参声明之外的任何地方使用集合字面量

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 允许以受限方式使用集合字面量——用于将数组传递给注解类的形参或为这些形参指定默认值。
> 然而，除此之外，Kotlin 曾允许在注解类内部的任何其他地方使用集合字面量，例如在其嵌套对象中。Kotlin 1.9 将禁止在注解类中除形参的默认值之外的任何地方使用集合字面量。
>
> **Deprecation cycle**:
>
> - 1.7.0: 对注解类中嵌套对象中的数组字面量报告警告（或在渐进模式中报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止在默认值表达式中向前引用带默认值的形参

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止在其他形参的默认值表达式中向前引用带默认值的形参。这确保了当形参在默认值表达式中被访问时，它已经有一个值，无论是传递给函数的值还是通过其自身的默认值表达式初始化的值。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当带有默认值的形参在它之前的另一个形参的默认值中被引用时，报告警告（或在渐进模式中报告错误）
> - 1.9.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暂时恢复到 1.9 之前的行为

### 禁止在内联函数式形参上进行扩展调用

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 尽管 Kotlin 允许将内联函数式形参作为接收者传递给另一个内联函数，但这在编译此类代码时总是导致编译器异常。
> Kotlin 1.9 将禁止此行为，从而报告错误而不是导致编译器崩溃。
>
> **Deprecation cycle**:
>
> - 1.7.20: 对内联函数式形参上的内联扩展调用报告警告（或在渐进模式中报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止对名为 suspend 的中缀函数使用匿名函数实参进行调用

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将不再允许对名为 `suspend` 且带有一个函数类型实参（以匿名函数字面量形式传递）的中缀函数进行调用。
>
> **Deprecation cycle**:
>
> - 1.7.20: 对带有匿名函数字面量的 suspend 中缀调用报告警告
> - 1.9.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暂时恢复到 1.9 之前的行为
> - &gt;=1.10: 改变解析器解释 `suspend fun` 词法序列的方式

### 禁止在内部类中违背其型变约束使用捕获的类型形参

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止在其内部类中使用外部类具有 `in` 或 `out` 型变约束的类型形参，如果使用位置违反了该类型形参声明的型变规则。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当外部类的类型形参使用位置违反该形参的型变规则时，报告警告（或在渐进模式中报告错误）
> - 1.9.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暂时恢复到 1.9 之前的行为

### 禁止在复合赋值操作符中对没有显式返回类型的函数进行递归调用

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止在函数体内的复合赋值操作符的实参中对没有显式返回类型的函数进行递归调用，与目前在该函数体内的其他表达式中的处理方式相同。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当没有显式返回类型的函数在其函数体内的复合赋值操作符实参中被递归调用时，报告警告（或在渐进模式中报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止在预期为 @NotNull T 而给定可空边界的 Kotlin 泛型形参时进行不健全的调用

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止将潜在可空的泛型类型值传递给 Java 方法中带有 `@NotNull` 注解的形参。
>
> **Deprecation cycle**:
>
> - 1.5.20: 当无约束的泛型类型形参在预期非空类型的位置传递时，报告警告
> - 1.9.0: 报告类型不匹配错误，而不是上述警告，
>   可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暂时恢复到 1.8 之前的行为

### 禁止从枚举的条目初始化器中访问枚举类的伴生对象成员

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止从枚举条目初始化器中对枚举类的伴生对象进行所有类型的访问。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对此类伴生成员访问报告警告（或在渐进模式中报告错误）
> - 1.9.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暂时恢复到 1.8 之前的行为

### 弃用并移除 Enum.declaringClass 合成属性

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 曾允许在 `Enum` 值上使用合成属性 `declaringClass`，该属性来自底层 Java 类 `java.lang.Enum` 的 `getDeclaringClass()` 方法，尽管此方法对 Kotlin `Enum` 类型不可用。Kotlin 1.9 将禁止使用此属性，建议迁移到扩展属性 `declaringJavaClass`。
>
> **Deprecation cycle**:
>
> - 1.7.0: 对 `declaringClass` 属性用法报告警告（或在渐进模式中报告错误），
>   建议迁移到 `declaringJavaClass` 扩展
> - 1.9.0: 将警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暂时恢复到 1.9 之前的行为
> - &gt;=1.10: 移除 `declaringClass` 合成属性

### 弃用编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20 会在使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式时发出警告。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.9: 将此警告提升为错误

## 标准库

### 警告 Range/Progression 开始实现 Collection 时可能发生的重载解析变更

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 计划在 Kotlin 1.9 中让标准数列和从它们继承的具体区间实现 `Collection` 接口。如果某个方法存在两个重载，一个接受元素，另一个接受集合，这可能会导致重载解析选择不同的重载。
> Kotlin 将通过在用区间或数列实参调用此类重载方法时报告警告或错误来使这种情况可见。
>
> **Deprecation cycle**:
>
> - 1.6.20: 当以标准数列或其区间继承者作为实参调用重载方法时，如果未来该数列/区间实现 `Collection` 接口会导致此调用中选择另一个重载，则报告警告
> - 1.8.0: 将此警告提升为错误
> - 1.9.0: 停止报告错误，在数列中实现 `Collection` 接口，从而改变受影响情况下的重载解析结果

### 将 kotlin.dom 和 kotlin.browser 包中的声明迁移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` 和 `kotlin.browser` 包中的声明已移至相应的 `kotlinx.*` 包，为将其从标准库中提取做准备。
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替代 API
> - 1.4.0: 弃用 `kotlin.dom` 和 `kotlin.browser` 包中的 API 并建议使用上述新 API 作为替代
> - 1.6.0: 将弃用级别提升为错误
> - 1.8.20: 从针对 JS-IR 目标的标准库中移除已弃用的函数
> - &gt;= 1.9: 将 kotlinx.* 包中的 API 移至单独的库

### 弃用部分仅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 标准库中许多仅限 JS 的函数已被弃用，待移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比较函数的数组 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **Deprecation cycle**:
>
> - 1.6.0: 对受影响的函数发出弃用警告
> - 1.9.0: 将弃用级别提升为错误
> - &gt;=1.10.0: 从公共 API 中移除已弃用的函数

## 工具

### 提高 KotlinCompile 任务的 classpath 属性的弃用级别

> **Issue**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompile` 任务的 `classpath` 属性已被弃用。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` 属性被弃用
> - 1.8.0: 将弃用级别提升为错误
> - &gt;=1.9.0: 从公共 API 中移除已弃用的函数

### 移除 kapt.use.worker.api Gradle 属性

> **Issue**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 移除 `kapt.use.worker.api` 属性，该属性曾允许通过 Gradle Workers API 运行 kapt（默认：true）。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将弃用级别提升为警告
> - 1.8.0: 移除此属性

### 移除 kotlin.compiler.execution.strategy 系统属性

> **Issue**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 移除用于选择编译器执行策略的 `kotlin.compiler.execution.strategy` 系统属性。
> 请改用 Gradle 属性 `kotlin.compiler.execution.strategy` 或编译任务属性 `compilerExecutionStrategy`。
>
> **Deprecation cycle:**
>
> - 1.7.0: 将弃用级别提升为警告
> - 1.8.0: 移除此属性

### 编译器选项变更

> **Issues**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **Component**: Gradle
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 此变更可能会影响 Gradle 插件作者。在 `kotlin-gradle-plugin` 中，某些内部类型增加了泛型形参（你需要添加泛型类型或 `*`）。
> `KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile` 任务。
> `KotlinJsCompilerOptions.outputFile` 和相关的 `KotlinJsOptions.outputFile` 选项已被弃用。
> 请改用 `Kotlin2JsCompile.outputFileProperty` 任务输入。`kotlinOptions` 任务输入和 `kotlinOptions{...}` 任务 DSL 处于支持模式，并将在即将发布的版本中弃用。`compilerOptions` 和 `kotlinOptions` 不能在任务执行阶段更改（参见 [Kotlin 1.8 新特性](whatsnew18.md#limitations) 中的一个例外）。
> `freeCompilerArgs` 返回一个不可变的 `List<String>` —— `kotlinOptions.freeCompilerArgs.remove("something")` 将会失败。
> 允许使用旧 JVM 后端的 `useOldBackend` 属性已被移除。
>
> **Deprecation cycle:**
>
> - 1.8.0: `KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile`。`KotlinJsCompilerOptions.outputFile`
>   和相关的 `KotlinJsOptions.outputFile` 选项已被弃用。允许使用旧 JVM 后端的 `useOldBackend` 属性已被移除。

### 弃用 kotlin.internal.single.build.metrics.file 属性

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 弃用 `kotlin.internal.single.build.metrics.file` 属性，该属性曾用于定义构建报告的单个文件。
> 请改用属性 `kotlin.build.report.single_file`，并配合 `kotlin.build.report.output=single_file`。
>
> **Deprecation cycle:**
>
> - 1.8.0: 将弃用级别提升为警告
> &gt;= 1.9: 删除此属性