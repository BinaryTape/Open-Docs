[//]: # (title: Kotlin 1.8 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的核心原则。前者指出，应移除阻碍语言演进的结构；后者则表示，此种移除应提前充分沟通，以使代码迁移尽可能顺畅。

虽然大多数语言变更已通过更新日志或编译器警告等其他渠道公布，但本文档旨在总结所有变更，为从 Kotlin 1.7 迁移到 Kotlin 1.8 提供完整的参考。

## 基本术语

本文档中，我们引入了几种兼容性类型：

- _源代码_：源代码不兼容的更改会使原本能够正常编译（无错误或警告）的代码无法再编译
- _二进制_：如果两个二进制工件（artifact）互换不会导致加载或链接错误，则称它们是二进制兼容的
- _行为_：如果同一程序在应用更改前后表现出不同的行为，则称该更改是行为不兼容的

请记住，这些定义仅适用于纯 Kotlin 代码。从其他语言（例如 Java）角度来看的 Kotlin 代码兼容性不在本文档的讨论范围之内。

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

### 禁止将超类调用的委托指向抽象超类成员

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
> 
> **简要摘要**: Kotlin 将在显式或隐式的超类调用被委托给超类的_抽象_成员时报告编译错误，即使超类接口中存在默认实现也是如此。
>
> **废弃周期**:
>
> - 1.5.20：当使用了未覆盖所有抽象成员的非抽象类时，引入警告
> - 1.7.0：如果超类调用实际上访问了超类中的抽象成员，则报告警告
> - 1.7.0：如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则在所有受影响的情况下报告错误；在渐进模式下报告错误
> - 1.8.0：在声明具体类时存在超类中未覆盖的抽象方法，以及 `Any` 方法的超类调用在超类中被覆盖为抽象方法的情况下报告错误
> - 1.9.0：在所有受影响的情况下报告错误，包括对超类中抽象方法的显式超类调用

### 废弃带主题的 when 表达式中令人困惑的语法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.6 废弃了 `when` 条件表达式中的一些令人困惑的语法结构
>
> **废弃周期**:
>
> - 1.6.20：对受影响的表达式引入废弃警告
> - 1.8.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暂时恢复到 1.8 之前的行为
> - `>= 1.9`：将一些已废弃的结构重新用于新的语言特性

### 阻止不同数值类型之间的隐式强制转换

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简要摘要**: Kotlin 将避免在语义上仅需要向下转型到基本数值类型的情况下，自动将数值转换为该基本数值类型。
>
> **废弃周期**:
>
> - `< 1.5.30`：所有受影响情况下的旧行为
> - 1.5.30：修复生成的属性委托访问器中的向下转型行为，可以使用 `-Xuse-old-backend` 暂时恢复到 1.5.30 修复之前的行为
> - `>= 1.9`：修复其他受影响情况下的向下转型行为

### 使密封类的私有构造函数真正私有化

> **Issue**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: 在放宽密封类继承者在项目结构中声明位置的限制后，密封类构造函数的默认可见性变为 `protected`。然而，直到 1.8 版本，Kotlin 仍然允许在密封类作用域之外调用显式声明的私有构造函数。
>
> **废弃周期**:
>
> - 1.6.20：当密封类的私有构造函数在类外部被调用时，报告警告（或在渐进模式下报告错误）
> - 1.8.0：对私有构造函数使用默认可见性规则（只有当对私有构造函数的调用位于相应类内部时，该调用才能被解析），可以通过指定编译器参数 `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 暂时恢复旧行为

### 禁止在构建器推断上下文中对不兼容的数值类型使用操作符 ==

> **Issue**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.8 将禁止在构建器推断 lambda 函数的作用域中对不兼容的数值类型（例如 `Int` 和 `Long`）使用操作符 `==`，这与目前在其他上下文中的处理方式相同。
>
> **废弃周期**:
>
> - 1.6.20：当对不兼容的数值类型使用操作符 `==` 时，报告警告（或在渐进模式下报告错误）
> - 1.8.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` 暂时恢复到 1.8 之前的行为

### 禁止在 Elvis 操作符右侧使用不带 else 的 if 表达式和非穷尽的 when 表达式

> **Issue**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.8 将禁止在 Elvis 操作符 (`?:`) 的右侧使用非穷尽的 `when` 表达式或不带 `else` 分支的 `if` 表达式。此前，如果 Elvis 操作符的结果未用作表达式，这是允许的。
>
> **废弃周期**:
>
> - 1.6.20：对此类非穷尽的 if 和 when 表达式报告警告（或在渐进模式下报告错误）
> - 1.8.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` 暂时恢复到 1.8 之前的行为

### 禁止在泛型类型别名使用中违反上限（一个类型参数用于别名类型的多个类型实参）

> **Issues**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.8 将禁止在使用类型别名时，其类型实参违反别名类型相应类型参数的上限限制的情况，特别是当一个类型别名类型参数用于别名类型的多个类型实参时，例如 `typealias Alias<T> = Base<T, T>`。
>
> **废弃周期**:
>
> - 1.7.0：当类型别名的使用中，其类型实参违反别名类型的相应类型参数的上限约束时，报告警告（或在渐进模式下报告错误）
> - 1.8.0：将此警告提升为错误，可以使用 `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` 暂时恢复到 1.8 之前的行为

### 禁止在泛型类型别名使用中违反上限（一个类型参数用作别名类型类型实参的泛型类型实参）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 将禁止在使用类型别名时，其类型实参违反别名类型相应类型参数的上限限制的情况，特别是当类型别名类型参数用作别名类型类型实参的泛型类型实参时，例如 `typealias Alias<T> = Base<List<T>>`。
>
> **废弃周期**:
>
> - 1.8.0：当泛型类型别名的使用中，其类型实参违反别名类型的相应类型参数的上限约束时，报告警告
> - `>=1.10`：将此警告提升为错误

### 禁止在委托中访问为扩展属性声明的类型参数

> **Issue**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.8 将禁止将泛型类型上的扩展属性委托给以不安全方式使用接收者类型参数的泛型类型。
>
> **废弃周期**:
>
> - 1.6.0：当将扩展属性委托给以特定方式使用从委托属性类型实参推断出的类型参数的类型时，报告警告（或在渐进模式下报告错误）
> - 1.8.0：将此警告提升为错误，可以使用 `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` 暂时恢复到 1.8 之前的行为

### 禁止对挂起函数使用 @Synchronized 注解

> **Issue**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.8 将禁止对挂起函数使用 `@Synchronized` 注解，因为挂起调用不应被允许发生在同步块内。
>
> **废弃周期**:
>
> - 1.6.0：对带有 `@Synchronized` 注解的挂起函数报告警告，在渐进模式下此警告将作为错误报告
> - 1.8.0：将此警告提升为错误，可以使用 `-XXLanguage:-SynchronizedSuspendError` 暂时恢复到 1.8 之前的行为

### 禁止使用展开操作符将实参传递给非变长参数

> **Issue**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 曾允许在特定条件下使用展开操作符 (`*`) 将数组传递给非变长数组参数。从 Kotlin 1.8 开始，这将不再被允许。
>
> **废弃周期**:
>
> - 1.6.0：当在预期非变长数组参数的位置使用展开操作符时，报告警告（或在渐进模式下报告错误）
> - 1.8.0：将此警告提升为错误，可以使用 `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` 暂时恢复到 1.8 之前的行为

### 禁止向按 lambda 返回类型重载的函数传递 lambda 时发生空安全违规

> **Issue**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.8 将禁止从传递给按 lambda 返回类型重载的函数中返回 `null`，如果这些重载不允许可空返回类型的话。此前，当 `null` 从 `when` 操作符的一个分支返回时，这是允许的。
>
> **废弃周期**:
>
> - 1.6.20：报告类型不匹配警告（或在渐进模式下报告错误）
> - 1.8.0：将此警告提升为错误，可以使用 `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` 暂时恢复到 1.8 之前的行为

### 在公共签名中近似局部类型时保持可空性

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码, 二进制
>
> **简要摘要**: 当表达式体函数没有显式指定返回类型，且返回局部或匿名类型时，Kotlin 编译器会使用该类型的已知超类型来推断（或近似）返回类型。在此过程中，编译器可能会推断出不可空类型，而实际上可能返回 `null` 值。
>
> **废弃周期**:
>
> - 1.8.0：通过灵活超类型近似灵活类型
> - 1.8.0：当声明被推断为不可空类型但应为可空类型时，报告警告，提示用户显式指定类型
> - 1.9.0：通过可空超类型近似可空类型，可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暂时恢复到 1.9 之前的行为

### 不通过覆盖传播废弃状态

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 将不再把废弃状态从超类中已废弃的成员传播到子类中覆盖该成员的部分，从而提供一种明确的机制，允许废弃超类中的成员，同时在子类中保持其未废弃状态。
>
> **废弃周期**:
>
> - 1.6.20：报告带有未来行为变更消息的警告，并提示用户要么抑制此警告，要么显式地在已废弃成员的覆盖上写入 `@Deprecated` 注解
> - 1.9.0：停止向被覆盖的成员传播废弃状态。此更改在渐进模式下也立即生效

### 禁止在构建器推断上下文中将类型变量隐式推断为上限

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 将禁止在构建器推断 lambda 函数作用域中缺少任何使用点类型信息的情况下，将类型变量推断为相应类型参数的上限，这与目前在其他上下文中的处理方式相同。
>
> **废弃周期**:
>
> - 1.7.20：当在缺少使用点类型信息的情况下将类型参数推断为声明的上限时，报告警告（或在渐进模式下报告错误）
> - 1.9.0：将此警告提升为错误，可以使用 `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` 暂时恢复到 1.9 之前的行为

### 禁止在注解类中使用集合字面量，除非在参数声明中

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 允许以受限方式使用集合字面量——用于将数组传递给注解类的参数或为这些参数指定默认值。然而除此之外，Kotlin 曾允许在注解类内部的任何其他位置使用集合字面量，例如在其嵌套对象中。Kotlin 1.9 将禁止在注解类中使用集合字面量，除非是其参数的默认值。
>
> **废弃周期**:
>
> - 1.7.0：对注解类中嵌套对象中的数组字面量报告警告（或在渐进模式下报告错误）
> - 1.9.0：将此警告提升为错误

### 禁止在默认值表达式中向前引用具有默认值的参数

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 将禁止在其他参数的默认值表达式中向前引用具有默认值的参数。这确保了在默认值表达式中访问参数时，它已经有一个值，无论是传递给函数的值，还是通过其自己的默认值表达式初始化的值。
>
> **废弃周期**:
>
> - 1.7.0：当具有默认值的参数被引用到位于其之前的另一个参数的默认值中时，报告警告（或在渐进模式下报告错误）
> - 1.9.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暂时恢复到 1.9 之前的行为

### 禁止对内联函数参数进行扩展调用

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: 虽然 Kotlin 曾允许将内联函数参数作为接收者传递给另一个内联函数，但这在编译此类代码时总是导致编译器异常。Kotlin 1.9 将禁止此行为，从而报告错误而不是使编译器崩溃。
>
> **废弃周期**:
>
> - 1.7.20：对内联函数参数上的内联扩展调用报告警告（或在渐进模式下报告错误）
> - 1.9.0：将此警告提升为错误

### 禁止使用匿名函数实参调用名为 suspend 的中缀函数

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 将不再允许调用名为 `suspend` 且只有一个函数类型参数并作为匿名函数字面量传递的中缀函数。
>
> **废弃周期**:
>
> - 1.7.20：对带有匿名函数字面量的 suspend 中缀调用报告警告
> - 1.9.0：将此警告提升为错误，可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暂时恢复到 1.9 之前的行为
> - `>=1.10`：更改解析器解释 `suspend fun` 令牌序列的方式

### 禁止在内部类中违背其型变使用捕获的类型参数

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 将禁止在内部类中，当外部类的类型参数具有 `in` 或 `out` 型变时，在其违反声明型变的位置使用这些类型参数。
>
> **废弃周期**:
>
> - 1.7.0：当外部类的类型参数使用位置违反该参数的型变规则时，报告警告（或在渐进模式下报告错误）
> - 1.9.0：将此警告提升为错误，可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暂时恢复到 1.9 之前的行为

### 禁止在复合赋值操作符中递归调用没有显式返回类型的函数

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 将禁止在复合赋值操作符的实参中，对函数体内部没有显式指定返回类型的函数进行递归调用，这与目前在该函数体内部的其他表达式中的处理方式相同。
>
> **废弃周期**:
>
> - 1.7.0：当在复合赋值操作符的实参中，函数体内部递归调用没有显式指定返回类型的函数时，报告警告（或在渐进模式下报告错误）
> - 1.9.0：将此警告提升为错误

### 禁止预期为 @NotNull T 且给定 Kotlin 泛型参数带有可空边界的不健全调用

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 将禁止以下方法调用：将潜在可空泛型类型的值传递给 Java 方法的 `@NotNull` 注解参数。
>
> **废弃周期**:
>
> - 1.5.20：当在预期不可空类型的位置传递无约束泛型类型参数时，报告警告
> - 1.9.0：报告类型不匹配错误，而不是上述警告，可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暂时恢复到 1.8 之前的行为

### 禁止从枚举的条目初始化器中访问枚举伴生对象的成员

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 将禁止从枚举条目初始化器中对枚举伴生对象进行任何形式的访问。
>
> **废弃周期**:
>
> - 1.6.20：对此类伴生对象成员访问报告警告（或在渐进模式下报告错误）
> - 1.9.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暂时恢复到 1.8 之前的行为

### 废弃并移除 Enum.declaringClass 合成属性

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 曾允许对由底层 Java 类 `java.lang.Enum` 的 `getDeclaringClass()` 方法产生的 `Enum` 值使用合成属性 `declaringClass`，尽管此方法不适用于 Kotlin 的 `Enum` 类型。Kotlin 1.9 将禁止使用此属性，并建议迁移到扩展属性 `declaringJavaClass`。
>
> **废弃周期**:
>
> - 1.7.0：对 `declaringClass` 属性的使用报告警告（或在渐进模式下报告错误），建议迁移到 `declaringJavaClass` 扩展
> - 1.9.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暂时恢复到 1.9 之前的行为
> - `>=1.10`：移除 `declaringClass` 合成属性

### 废弃编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.6.20 会在使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式时发出警告。
>
> **废弃周期**:
>
> - 1.6.20：对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - `>= 1.9`：将此警告提升为错误

## 标准库

### 当 Range/Progression 开始实现 Collection 接口时，警告潜在的重载解析变更

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **组件**: 核心语言 / kotlin-stdlib
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: Kotlin 1.9 计划在标准 progression 和从它们继承的具体 range 中实现 `Collection` 接口。如果某个方法存在两个重载（一个接受元素，另一个接受集合），这可能会导致在重载解析中选择不同的重载。当使用 range 或 progression 参数调用此类重载方法时，Kotlin 将通过报告警告或错误来揭示这种情况。
>
> **废弃周期**:
>
> - 1.6.20：当使用标准 progression 或其 range 继承者作为实参调用重载方法时，如果该 progression/range 实现 `Collection` 接口会导致将来在此调用中选择另一个重载，则报告警告
> - 1.8.0：将此警告提升为错误 
> - 1.9.0：停止报告错误，在 progression 中实现 `Collection` 接口，从而在受影响的情况下改变重载解析结果

### 将声明从 kotlin.dom 和 kotlin.browser 包迁移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: `kotlin.dom` 和 `kotlin.browser` 包中的声明已移至相应的 `kotlinx.*` 包，以准备将其从标准库中提取。
>
> **废弃周期**:
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替换 API
> - 1.4.0：废弃 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并建议使用上述新 API 作为替代
> - 1.6.0：将废弃级别提升为错误
> - 1.8.20：从 stdlib 中移除针对 JS-IR 目标的已废弃函数
> - `>= 1.9`：将 kotlinx.* 包中的 API 移动到单独的库中

### 废弃部分仅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: 标准库中一些仅限 JS 的函数已废弃并计划移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比较函数的数组 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **废弃周期**:
>
> - 1.6.0：对受影响的函数发出废弃警告
> - 1.9.0：将废弃级别提升为错误
> - `>=1.10.0`：从公共 API 中移除已废弃的函数

## 工具

### 提升 KotlinCompile 任务的 classpath 属性的废弃级别

> **Issue**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: `KotlinCompile` 任务的 `classpath` 属性已废弃。
>
> **废弃周期**:
>
> - 1.7.0：`classpath` 属性已废弃
> - 1.8.0：将废弃级别提升为错误
> - `>=1.9.0`：从公共 API 中移除已废弃的函数

### 移除 kapt.use.worker.api Gradle 属性

> **Issue**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 行为
>
> **简要摘要**: 移除 `kapt.use.worker.api` 属性，该属性曾允许通过 Gradle Workers API 运行 kapt（默认值：true）。
>
> **废弃周期**:
>
> - 1.6.20：将废弃级别提升为警告
> - 1.8.0：移除此属性

### 移除 kotlin.compiler.execution.strategy 系统属性

> **Issue**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 行为
>
> **简要摘要**: 移除用于选择编译器执行策略的 `kotlin.compiler.execution.strategy` 系统属性。请改用 Gradle 属性 `kotlin.compiler.execution.strategy` 或编译任务属性 `compilerExecutionStrategy`。
>
> **废弃周期:**
>
> - 1.7.0：将废弃级别提升为警告
> - 1.8.0：移除此属性

### 编译器选项变更

> **Issues**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码, 二进制
>
> **简要摘要**: 此更改可能会影响 Gradle 插件作者。在 `kotlin-gradle-plugin` 中，某些内部类型增加了泛型参数（您应该添加泛型类型或 `*`）。`KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile` 任务。`KotlinJsCompilerOptions.outputFile` 和相关的 `KotlinJsOptions.outputFile` 选项已废弃。请改用 `Kotlin2JsCompile.outputFileProperty` 任务输入。`kotlinOptions` 任务输入和 `kotlinOptions{...}` 任务 DSL 处于支持模式，并将在未来版本中废弃。`compilerOptions` 和 `kotlinOptions` 不能在任务执行阶段更改（请参阅 [Kotlin 1.8 新特性](whatsnew18.md#limitations) 中的一个例外）。`freeCompilerArgs` 返回一个不可变的 `List<String>` —— `kotlinOptions.freeCompilerArgs.remove("something")` 将会失败。允许使用旧 JVM 后端的 `useOldBackend` 属性已被移除。
>
> **废弃周期:**
>
> - 1.8.0：`KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile`。`KotlinJsCompilerOptions.outputFile` 和相关的 `KotlinJsOptions.outputFile` 选项已废弃。允许使用旧 JVM 后端的 `useOldBackend` 属性已被移除。

### 废弃 kotlin.internal.single.build.metrics.file 属性

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源代码
>
> **简要摘要**: 废弃 `kotlin.internal.single.build.metrics.file` 属性，该属性曾用于为构建报告定义单个文件。请改用 `kotlin.build.report.single_file` 属性并配合 `kotlin.build.report.output=single_file`。
>
> **废弃周期:**
>
> - 1.8.0：将废弃级别提升为警告
> - `>= 1.9`：删除此属性