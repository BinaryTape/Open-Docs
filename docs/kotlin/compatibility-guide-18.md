[//]: # (title: Kotlin 1.8.x 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_和_[舒适的更新](kotlin-evolution-principles.md)_是 Kotlin 语言设计的基本原则。前者指出应当移除阻碍语言演进的结构，而后者则说明这种移除应当事先做好充分沟通，以使代码迁移尽可能顺畅。

虽然大多数语言变化已经通过其他渠道宣布，例如更新日志或编译器警告，但本文档对它们进行了总结，为从 Kotlin 1.7 迁移到 Kotlin 1.8 提供了完整的参考。

## 基本术语

在本文档中，我们介绍了以下几种兼容性：

- _源码（source）_：源码不兼容的更改会使以前可以正常编译（没有错误或警告）的代码无法再编译。
- _二进制（binary）_：如果交换两个二进制构件不会导致加载或链接错误，则称这两个二进制构件是二进制兼容的。
- _行为（behavioral）_：如果同一个程序在应用更改前后表现出不同的行为，则称该更改为行为不兼容。

请记住，这些定义仅针对纯 Kotlin 而言。从其他语言角度（例如 Java）看 Kotlin 代码的兼容性不在本文档的讨论范围内。

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

> **问题**：[KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)、[KT-49017](https://youtrack.jetbrains.com/issue/KT-49017)、[KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
> 
> **简短摘要**：当显式或隐式 super 调用被委托给超类的“抽象”成员时，即使超接口中有默认实现，Kotlin 也会报告编译错误。
>
> **弃用周期**：
>
> - 1.5.20：当使用未重写所有抽象成员的非抽象类时引入警告
> - 1.7.0：如果 super 调用实际上访问了超类中的抽象成员，则报告警告
> - 1.7.0：如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容性模式，则在所有受影响的情况下报告错误；在渐进模式中报告错误
> - 1.8.0：在声明具有来自超类的未重写抽象方法的具体类，以及超类中 `Any` 方法被重写为抽象的情况下报告错误
> - 1.9.0：在所有受影响的情况下报告错误，包括对超类抽象方法的显式 super 调用

### 弃用带主语的 when 中令人困惑的语法

> **问题**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.6 弃用了 `when` 条件表达式中几种令人困惑的语法结构
>
> **弃用周期**：
>
> - 1.6.20：对受影响的表达式引入弃用警告
> - 1.8.0：将此警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暂时恢复到 1.8 之前的行为
> - &gt;= 1.9：将某些弃用的结构重新用于新的语言功能

### 防止不同数字类型之间的隐式强制转换

> **问题**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：行为
>
> **简短摘要**：在语义上仅需要向下转换（downcast）为该类型的地方，Kotlin 将避免自动将数值转换为原始数字类型
>
> **弃用周期**：
>
> - < 1.5.30：所有受影响的情况均遵循旧行为
> - 1.5.30：修复生成的属性委托访问器中的向下转换行为，
>   可以使用 `-Xuse-old-backend` 暂时恢复到 1.5.30 修复之前的行为
> - &gt;= 1.9：修复其他受影响情况下的向下转换行为

### 使密封类的私有构造函数真正私有

> **问题**：[KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：在放宽了密封类继承者在项目结构中声明位置的限制后，密封类构造函数的默认可见性变为了 protected。然而，在 1.8 之前，Kotlin 仍允许在这些类作用域之外调用显式声明的密封类私有构造函数
>
> **弃用周期**：
>
> - 1.6.20：在类外部调用密封类的私有构造函数时报告警告（或在渐进模式中报告错误）
> - 1.8.0：对私有构造函数使用默认可见性规则（仅当调用在相应类内部时，才能解析对私有构造函数的调用），
>   可以通过指定 `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 编译器实参暂时带回旧行为

### 在构建器推断上下文中禁止对不兼容的数字类型使用 == 运算符

> **问题**：[KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.8 将禁止在构建器推断 lambda 函数的作用域内对不兼容的数字类型（例如 `Int` 和 `Long`）使用 `==` 运算符，这与目前在其他上下文中的做法一致
>
> **弃用周期**：
>
> - 1.6.20：当对不兼容的数字类型使用 `==` 运算符时报告警告（或在渐进模式中报告错误）
> - 1.8.0：将该警告提升为错误，
>   可以使用 `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` 暂时恢复到 1.8 之前的行为

### 禁止在 Elvis 运算符右侧使用没有 else 的 if 和非穷尽的 when

> **问题**：[KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.8 将禁止在 Elvis 运算符（`?:`）右侧使用非穷尽的 `when` 或没有 `else` 分支的 `if` 表达式。以前，如果 Elvis 运算符的结果未用作表达式，这是被允许的
>
> **弃用周期**：
>
> - 1.6.20：对此类非穷尽的 if 和 when 表达式报告警告（或在渐进模式中报告错误）
> - 1.8.0：将此警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` 暂时恢复到 1.8 之前的行为

### 禁止在泛型类型别名用法中违反上界（一个类型参数用于别名类型的多个类型实参中）

> **问题**：[KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：在类型别名的一个类型形参被用于别名类型的多个类型实参的情况下（例如 `typealias Alias<T> = Base<T, T>`），Kotlin 1.8 将禁止使用带有违反别名类型对应类型形参上界限制的类型实参的类型别名
>
> **弃用周期**：
>
> - 1.7.0：在使用类型实参违反别名类型对应类型形参上界约束的类型别名时报告警告（或在渐进模式中报告错误）
> - 1.8.0：将此警告提升为错误，
>  可以使用 `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` 暂时恢复到 1.8 之前的行为

### 禁止在泛型类型别名用法中违反上界（一个类型参数用于别名类型的一个类型实参的泛型类型实参中）

> **问题**：[KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：在类型别名类型形参被用作别名类型某个类型实参的泛型类型实参的情况下（例如 `typealias Alias<T> = Base<List<T>>`），Kotlin 将禁止使用带有违反别名类型对应类型形参上界限制的类型实参的类型别名
>
> **弃用周期**：
>
> - 1.8.0：当泛型类型别名用法中的类型实参违反别名类型对应类型形参的上界约束时报告警告
> - &gt;=1.10：将该警告提升为错误

### 禁止在委托内部使用为扩展属性声明的类型形参

> **问题**：[KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.8 将禁止将泛型类型上的扩展属性委托给以不安全方式使用接收者类型形参的泛型类型
>
> **弃用周期**：
>
> - 1.6.0：当将扩展属性委托给以特定方式使用从委托属性类型实参推断出的类型形参的类型时，报告警告（或在渐进模式中报告错误）
> - 1.8.0：将警告提升为错误，
>  可以使用 `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` 暂时恢复到 1.8 之前的行为

### 禁止在挂起函数上使用 @Synchronized 注解

> **问题**：[KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.8 将禁止在挂起函数上放置 `@Synchronized` 注解，因为挂起调用不应被允许发生在同步块内
>
> **弃用周期**：
>
> - 1.6.0：对带有 `@Synchronized` 注解的挂起函数报告警告，该警告在渐进模式中被报告为错误
> - 1.8.0：将警告提升为错误，
    可以使用 `-XXLanguage:-SynchronizedSuspendError` 暂时恢复到 1.8 之前的行为

### 禁止使用扩展运算符向非变长参数传递实参

> **问题**：[KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 在某些条件下允许通过扩展运算符（`*`）将数组传递给非变长数组参数。从 Kotlin 1.8 开始，这将不被允许
>
> **弃用周期**：
>
> - 1.6.0：在预期为非变长数组参数的地方使用扩展运算符时报告警告（或在渐进模式中报告错误）
> - 1.8.0：将警告提升为错误，
>   可以使用 `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` 暂时恢复到 1.8 之前的行为

### 禁止在传递给按 lambda 返回类型重载的函数的 lambda 中违反 null 安全

> **问题**：[KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：当重载不允许可为 null 的返回类型时，Kotlin 1.8 将禁止从传递给按这些 lambda 返回类型重载的函数的 lambda 中返回 `null`。以前，当从 `when` 运算符的一个分支返回 `null` 时是允许的
>
> **弃用周期**：
>
> - 1.6.20：报告类型不匹配警告（或在渐进模式中报告错误）
> - 1.8.0：将警告提升为错误，
>   可以使用 `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` 暂时恢复到 1.8 之前的行为

### 在公共签名中近似局部类型时保持为 null 性

> **问题**：[KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码、二进制
>
> **简短摘要**：当从没有显式指定返回值类型的表达式体函数中返回局部或匿名类型时，Kotlin 编译器使用该类型的已知超类推断（或近似）返回值类型。在此过程中，编译器可能会在实际可能返回 null 值的地方推断出不可为 null 的类型
>
> **弃用周期**：
>
> - 1.8.0：使用灵活超类近似灵活类型
> - 1.8.0：当声明被推断为本应为可为 null 的不可为 null 类型时报告警告，提示用户显式指定类型
> - 1.9.0：使用可为 null 的超类近似可为 null 的类型，
>   可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暂时恢复到 1.9 之前的行为

### 不要通过重写传播弃用

> **问题**：[KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将不再把超类中弃用成员的弃用状态传播到其在子类中的重写成员，从而提供一种显式机制来弃用超类成员，同时保持其在子类中为非弃用状态
>
> **弃用周期**：
>
> - 1.6.20：报告警告，说明未来的行为变化，并提示禁止此警告或显式在弃用成员的重写上编写 `@Deprecated` 注解
> - 1.9.0：停止向重写成员传播弃用状态。此更改在渐进模式中也会立即生效

### 在构建器推断上下文中禁止将类型变量隐式推断为上界

> **问题**：[KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止在构建器推断 lambda 函数的作用域内，在缺乏任何使用点类型信息的情况下将类型变量推断为对应类型形参的上界，这与目前在其他上下文中的做法一致
>
> **弃用周期**：
>
> - 1.7.20：在缺乏使用点类型信息的情况下，当类型形参被推断为声明的上界时报告警告（或在渐进模式中报告错误）
> - 1.9.0：将警告提升为错误，
>   可以使用 `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` 暂时恢复到 1.9 之前的行为

### 禁止在注解类中除参数声明外的任何地方使用集合文字

> **问题**：[KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 允许以受限的方式使用集合文字——用于向注解类的参数传递数组或为这些参数指定默认值。然而除此之外，Kotlin 曾允许在注解类内部的任何其他地方使用集合文字，例如在其嵌套对象中。Kotlin 1.9 将禁止在注解类中除参数默认值以外的任何地方使用集合文字。
>
> **弃用周期**：
>
> - 1.7.0：对注解类嵌套对象中的数组文字报告警告（或在渐进模式中报告错误）
> - 1.9.0：将警告提升为错误

### 在默认值表达式中禁止向前引用具有默认值的形参

> **问题**：[KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止在其他参数的默认值表达式中向前引用具有默认值的形参。这确保了在默认值表达式中访问参数时，该参数已经具有传递给函数的值或由其自身的默认值表达式初始化的值
>
> **弃用周期**：
>
> - 1.7.0：当具有默认值的形参在其之前的另一个参数的默认值中被引用时报告警告（或在渐进模式中报告错误）
> - 1.9.0：将警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暂时恢复到 1.9 之前的行为

### 禁止对内联函数形参进行扩展调用

> **问题**：[KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：虽然 Kotlin 允许将内联函数形参作为接收者传递给另一个内联函数，但在编译此类代码时总是会导致编译器异常。Kotlin 1.9 将禁止此类操作，从而报告错误而不是导致编译器崩溃
>
> **弃用周期**：
>
> - 1.7.20：对内联函数形参上的内联扩展调用报告警告（或在渐进模式中报告错误）
> - 1.9.0：将警告提升为错误

### 禁止使用匿名函数实参调用名为 suspend 的中缀函数

> **问题**：[KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将不再允许调用名为 `suspend` 的中缀函数，且其单个函数类型实参以匿名函数文字形式传递
>
> **弃用周期**：
>
> - 1.7.20：对带有匿名函数文字的 suspend 中缀调用报告警告
> - 1.9.0：将警告提升为错误，
>   可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暂时恢复到 1.9 之前的行为
> - &gt;=1.10：更改解析器对 `suspend fun` 令牌序列的解释方式

### 禁止在内部类中违背其差异使用捕获的类型形参

> **问题**：[KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止在内部类的某些位置使用具有 `in` 或 `out` 差异的外部类类型形参，如果这些位置违反了该类型形参声明的差异
>
> **弃用周期**：
>
> - 1.7.0：当外部类类型形参的使用位置违反该形参的差异规则时报告警告（或在渐进模式中报告错误）
> - 1.9.0：将警告提升为错误，
>   可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暂时恢复到 1.9 之前的行为

### 在复合赋值运算符中禁止递归调用没有显式返回值类型的函数

> **问题**：[KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止在该函数体内的复合赋值运算符实参中调用没有显式指定返回值类型的函数，这与目前在函数体内其他表达式中的做法一致
>
> **弃用周期**：
>
> - 1.7.0：当没有显式指定返回值类型的函数在复合赋值运算符实参中被递归调用时报告警告（或在渐进模式中报告错误）
> - 1.9.0：将警告提升为错误

### 禁止在使用预期为 @NotNull T 且给定具有可为 null 绑定的 Kotlin 泛型参数时进行不合理的调用

> **问题**：[KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：源码
>
> **简短摘要**：对于 Java 方法的 `@NotNull` 注解参数，如果传递了潜在可为 null 的泛型类型的值，Kotlin 1.9 将禁止此类方法调用
>
> **弃用周期**：
>
> - 1.5.20：在预期为不可为 null 类型的地方传递了不受约束的泛型类型参数时报告警告
> - 1.9.0：报告类型不匹配错误而不是上述警告，  
>   可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暂时恢复到 1.8 之前的行为

### 禁止从枚举条目初始值设定项中访问枚举伴生对象的成员

> **问题**：[KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **组件**：核心语言
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.9 将禁止从枚举条目初始值设定项中以任何形式访问枚举的伴生对象
>
> **弃用周期**：
>
> - 1.6.20：对此类伴生对象成员访问报告警告（或在渐进模式中报告错误）
> - 1.9.0：将警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暂时恢复到 1.8 之前的行为

### 弃用并移除 Enum.declaringClass 合成属性

> **问题**：[KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 允许对由底层 Java 类 `java.lang.Enum` 的 `getDeclaringClass()` 方法生成的 `Enum` 值使用合成属性 `declaringClass`，尽管该方法在 Kotlin `Enum` 类型中不可用。Kotlin 1.9 将禁止使用此属性，并建议迁移到扩展属性 `declaringJavaClass`
>
> **弃用周期**：
>
> - 1.7.0：对 `declaringClass` 属性用法报告警告（或在渐进模式中报告错误），建议迁移到 `declaringJavaClass` 扩展
> - 1.9.0：将警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暂时恢复到 1.9 之前的行为
> - &gt;=1.10：移除 `declaringClass` 合成属性

### 弃用编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **问题**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **组件**：Kotlin/JVM
>
> **不兼容更改类型**：源码
>
> **简短摘要**：Kotlin 1.6.20 针对使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式发出警告
>
> **弃用周期**：
>
> - 1.6.20：对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.9：将此警告提升为错误

## 标准库

### 关于 Range/Progression 开始实现 Collection 时潜在重载解析变化的警告

> **问题**：[KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **组件**：核心语言 / kotlin-stdlib
>
> **不兼容更改类型**：源码
>
> **简短摘要**：计划在 Kotlin 1.9 的标准级数（progression）和从中继承的具体范围内实现 `Collection` 接口。如果某个方法有两个重载，一个接受元素，另一个接受集合，这可能会导致重载解析选择不同的重载。Kotlin 将通过在调用此类重载方法并使用范围或级数实参时报告警告或错误，使这种情况可见
>
> **弃用周期**：
>
> - 1.6.20：当使用标准级数或其范围继承者作为实参调用重载方法时报告警告，如果该级数/范围实现 `Collection` 接口会导致将来在该调用中选择另一个重载
> - 1.8.0：将此警告提升为错误 
> - 1.9.0：停止报告错误，在级数中实现 `Collection` 接口，从而在受影响的情况下更改重载解析结果

### 将 kotlin.dom 和 kotlin.browser 包中的声明迁移到 kotlinx.*

> **问题**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容更改类型**：源码
>
> **简短摘要**：来自 `kotlin.dom` 和 `kotlin.browser` 包的声明已移动到相应的 `kotlinx.*` 包，以便为将它们从 stdlib 中提取出来做准备
>
> **弃用周期**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替换 API
> - 1.4.0：弃用 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并建议使用上述新 API 作为替换
> - 1.6.0：将弃用级别提升为错误
> - 1.8.20：从 JS-IR 目标的 stdlib 中移除已弃用的函数
> - &gt;= 1.9：将 kotlinx.* 包中的 API 移动到单独的库中

### 弃用某些仅限 JS 的 API

> **问题**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容更改类型**：源码
>
> **简短摘要**：stdlib 中许多仅限 JS 的函数已被弃用并准备移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及数组上接受比较函数的 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **弃用周期**：
>
> - 1.6.0：对受影响的函数发出弃用警告
> - 1.9.0：将弃用级别提升为错误
> - &gt;=1.10.0：从公共 API 中移除已弃用的函数

## 工具

### 提高 KotlinCompile 任务的 classpath 属性的弃用级别

> **问题**：[KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：`KotlinCompile` 任务的 `classpath` 属性已被弃用
>
> **弃用周期**：
>
> - 1.7.0：`classpath` 属性被弃用
> - 1.8.0：将弃用级别提升为错误
> - &gt;=1.9.0：从公共 API 中移除已弃用的函数

### 移除 kapt.use.worker.api Gradle 属性

> **问题**：[KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **组件**：Gradle
>
> **不兼容更改类型**：行为
>
> **简短摘要**：移除允许通过 Gradle Workers API 运行 kapt 的 `kapt.use.worker.api` 属性（默认值：true）
>
> **弃用周期**：
>
> - 1.6.20：将弃用级别提升为警告
> - 1.8.0：移除此属性

### 移除 kotlin.compiler.execution.strategy 系统属性

> **问题**：[KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **组件**：Gradle
>
> **不兼容更改类型**：行为
>
> **简短摘要**：移除用于选择编译器执行策略的 `kotlin.compiler.execution.strategy` 系统属性。请改用 Gradle 属性 `kotlin.compiler.execution.strategy` 或编译任务属性 `compilerExecutionStrategy`
>
> **弃用周期：**
>
> - 1.7.0：将弃用级别提升为警告
> - 1.8.0：移除该属性

### 编译器选项的变化

> **问题**：[KT-27301](https://youtrack.jetbrains.com/issue/KT-27301)、[KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码、二进制
>
> **简短摘要**：此更改可能会影响 Gradle 插件作者。在 `kotlin-gradle-plugin` 中，某些内部类型添加了泛型形参（您应该添加泛型类型或 `*`）。`KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile` 任务。`KotlinJsCompilerOptions.outputFile` 及相关的 `KotlinJsOptions.outputFile` 选项已被弃用。请改用 `Kotlin2JsCompile.outputFileProperty` 任务输入。`kotlinOptions` 任务输入和 `kotlinOptions{...}` 任务 DSL 处于支持模式，并将在后续版本中弃用。`compilerOptions` 和 `kotlinOptions` 不能在任务执行阶段更改（请参阅 [Kotlin 1.8 的最新变化](whatsnew18.md#limitations) 中的一个例外情况）。`freeCompilerArgs` 返回不可变的 `List<String>` – `kotlinOptions.freeCompilerArgs.remove("something")` 将失败。允许使用旧 JVM 后端的 `useOldBackend` 属性已被移除
>
> **弃用周期：**
>
> - 1.8.0：`KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile`。`KotlinJsCompilerOptions.outputFile` 及相关的 `KotlinJsOptions.outputFile` 选项已被弃用。允许使用旧 JVM 后端的 `useOldBackend` 属性已被移除。

### 弃用 kotlin.internal.single.build.metrics.file 属性

> **问题**：[KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **组件**：Gradle
>
> **不兼容更改类型**：源码
>
> **简短摘要**：弃用用于定义构建报告单个文件的 `kotlin.internal.single.build.metrics.file` 属性。
> 请改用属性 `kotlin.build.report.single_file` 并配合 `kotlin.build.report.output=single_file` 使用
>
> **弃用周期：**
>
> - 1.8.0：将弃用级别提升为警告
> &gt;= 1.9：删除该属性