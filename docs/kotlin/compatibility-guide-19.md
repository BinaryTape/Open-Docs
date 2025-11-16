[//]: # (title: Kotlin 1.9.x 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的核心原则。前者指出，阻碍语言演进的构造应被移除；后者指出，此移除应提前充分沟通，以使代码迁移尽可能顺畅。

虽然大多数语言更改已通过其他渠道（例如更新日志或编译器警告）公布，但本文档将它们全部汇总，为从 Kotlin 1.8 迁移到 Kotlin 1.9 提供完整的参考。

## 基本术语

本文档介绍了几种兼容性：

- _source_：`source`（源代码）不兼容性变更会使原本可以正常编译（无错误或警告）的代码不再能够编译
- _binary_：如果两个二进制 `artifact` 相互替换不会导致加载或链接错误，则称它们是 `binary`（二进制）兼容的
- _behavioral_：如果同一程序在应用更改前后表现出不同行为，则称该更改是 `behavioral`（行为）不兼容的

请记住，这些定义仅适用于纯 Kotlin。从其他语言视角（例如 Java）看 Kotlin 代码的兼容性不在本文档的`作用域`内。

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
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 引入了语言版本 1.9 并移除了对语言版本 1.3 的支持。
>
> **Deprecation cycle**:
>
> - 1.6.0: 报告警告
> - 1.9.0: 将警告提升为错误

### 禁止当超接口类型为函数字面值时调用超类构造函数

> **Issue**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 如果接口继承自函数字面值类型，Kotlin 1.9 会禁止调用超类`构造函数`，因为不存在此类`构造函数`。
>
> **Deprecation cycle**:
> * 1.7.0: 报告警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告提升为错误

### 禁止注解`形参`类型中的循环

> **Issue**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 禁止注解的类型直接或间接地用作其`形参`类型之一。这可以防止创建循环。但是，允许`形参`类型为该注解类型的 `Array` 或 `vararg`。
>
> **Deprecation cycle**:
> * 1.7.0: 报告关于注解`形参`类型中循环的警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告提升为错误，可以使用 `-XXLanguage:-ProhibitCyclesInAnnotations` 暂时恢复到 1.9 之前的行为

### 禁止在无`形参`的`函数`类型上使用 @ExtensionFunctionType 注解

> **Issue**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 禁止在无`形参`的`函数`类型上，或在非`函数`类型上使用 `@ExtensionFunctionType` 注解。
>
> **Deprecation cycle**:
> * 1.7.0: 报告关于非`函数`类型注解的警告，报告关于**是**`函数`类型的注解的错误
> * 1.9.0: 将关于`函数`类型的警告提升为错误

### 禁止 Java field 类型在赋值时不匹配

> **Issue**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: 如果`检测`到`赋值`给 Java `field` 的值的类型与 Java `field` 的投影类型不匹配，Kotlin 1.9 会报告`编译器`错误。
>
> **Deprecation cycle**:
> * 1.6.0: 当投影的 Java `field` 类型与`赋值`的值类型不匹配时，报告警告（或在渐进模式下报告错误）
> * 1.9.0: 将警告提升为错误，可以使用 `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` 暂时恢复到 1.9 之前的行为

### 平台类型`空安全`断言异常中不包含源代码摘录

> **Issue**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 在 Kotlin 1.9 中，`表达式``空检测`的异常消息不包含源代码摘录。取而代之的是，会显示`方法`或 `field` 的名称。如果`表达式`不是`方法`或 `field`，则消息中不提供额外信息。
>
> **Deprecation cycle**:
>  * < 1.9.0: `表达式``空检测`生成的异常消息包含源代码摘录
>  * 1.9.0: `表达式``空检测`生成的异常消息仅包含`方法`或 `field` 名称，可以使用 `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` 暂时恢复到 1.9 之前的行为

### 禁止将超类调用`委托`给抽象超类成员

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 将报告编译错误，当`显式`或隐式超类调用`委托`给超类的 _抽象_ 成员时，即使超接口中存在默认实现。
>
> **Deprecation cycle**:
>
> - 1.5.20: 引入警告，当使用未`覆盖`所有抽象成员的非抽象类时
> - 1.7.0: 如果超类调用实际上访问了超类中的抽象成员，则报告警告
> - 1.7.0: 如果启用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 兼容模式，则在所有受影响的情况下报告错误；在渐进模式下报告错误
> - 1.8.0: 报告在`声明`具有超类中未`覆盖`的抽象`方法`的具象类，以及超类中 `Any` `方法`的超类调用被`覆盖`为抽象的情况下的错误
> - 1.9.0: 在所有受影响的情况下报告错误，包括对超类中抽象`方法`的`显式`超类调用

### `废弃` `when` 表达式中令人混淆的语法

> **Issue**: [KT-48385](https://youtrack.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 `废弃`了 `when` 条件`表达式`中几个令人混淆的语法构造。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对受影响的`表达式`引入`废弃`警告
> - 1.8.0: 将此警告提升为错误，
>   `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 可用于暂时恢复到 1.8 之前的行为
> - &gt;= 2.1: 将一些`废弃`的构造重新用于新的语言`特性`

### 阻止不同数字类型之间的隐式强制转换

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 将避免将数字值自动转换为`原语`数字类型，而仅在语义上需要`向下转型`为该类型的情况下才进行转换。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 在所有受影响的情况下的旧行为
> - 1.5.30: `构建`的属性`委托`访问器中`向下转型`行为的修复，
>   `-Xuse-old-backend` 可用于暂时恢复到 1.5.30 修复之前的行为
> - &gt;= 2.0: 在其他受影响的情况下修复`向下转型`行为

### 禁止泛型`类型别名`使用中的`上界`违例（在别名类型的`类型实参`的泛型`类型实参`中使用的`类型形参`）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 将禁止使用带有`类型实参`的`类型别名`，这些`类型实参`违反了别名类型相应`类型形参`的`上界`限制，当`类型别名``类型形参`用作别名类型的`类型实参`的泛型`类型实参`时，例如 `typealias Alias<T> = Base<List<T>>`。
>
> **Deprecation cycle**:
>
> - 1.8.0: 当泛型`类型别名`使用中的`类型实参`违反了`上界`约束时，报告警告
>   别名类型相应`类型形参`的`上界`约束时，报告警告
> - 2.0.0: 将警告提升为错误

### 在公共签名中近似局部类型时保持`可空性`

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 当局部或匿名类型从没有`显式`指定返回类型的`表达式`体`函数`返回时，Kotlin `编译器`会使用该类型的已知超类型来`推断`（或近似）返回类型。在此过程中，`编译器`可能会`推断`出`非空的`类型，而实际上可能返回 `null` 值。
>
> **Deprecation cycle**:
>
> - 1.8.0: 通过 `flexible` 超类型近似 `flexible` 类型
> - 1.8.0: 当`声明`被`推断`为应`可空`却为`非空`类型时，报告警告，提示用户`显式`指定类型
> - 2.0.0: 通过`可空`超类型近似`可空`类型，
>   `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 可用于暂时恢复到 2.0 之前的行为

### 不通过`覆盖`传播`废弃`状态

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将不再将`废弃`状态从超类中已`废弃`的成员传播到子类中其`覆盖`的成员，从而为`废弃`超类成员同时使其在子类中不被`废弃`提供了`显式`机制。
>
> **Deprecation cycle**:
>
> - 1.6.20: 报告带有未来行为更改消息的警告，并提示要么抑制此警告，要么在已`废弃`成员的`覆盖`处`显式`写入 `@Deprecated` 注解
> - 1.9.0: 停止向被`覆盖`的成员传播`废弃`状态。此更改也会立即在渐进模式下生效

### 禁止在注解类中除其`形参``声明`之外的任何地方使用`集合`字面值

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 允许以受限方式使用`集合`字面值——用于将数组传递给注解类的`形参`或为此类`形参`指定默认值。然而除此之外，Kotlin 允许在注解类内部的任何其他地方使用`集合`字面值，例如在其`嵌套对象`中。Kotlin 1.9 将禁止在注解类中除其`形参`的默认值之外的任何地方使用`集合`字面值。
>
> **Deprecation cycle**:
>
> - 1.7.0: 报告关于注解类中`嵌套对象`中数组字面值的警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止在默认值`表达式`中向前引用`形参`

> **Issue**: [KT-25694](https://youtrack.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止在其他`形参`的默认值`表达式`中向前引用`形参`。这确保了在`形参`被默认值`表达式`访问时，它已经通过`函数`传递了值或通过其自身的默认值`表达式`初始化了值。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当带有默认值的`形参`在它之前的另一个`形参`的默认值中被引用时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误，
>   `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 可用于暂时恢复到 1.9 之前的行为

### 禁止对内联`函数``形参`进行`扩展`调用

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 尽管 Kotlin 允许将内联`函数``形参`作为`接收者`传递给另一个内联`函数`，但编译此类`代码块`时总是导致`编译器`异常。Kotlin 1.9 将禁止此行为，从而报告错误而不是导致`编译器`崩溃。
>
> **Deprecation cycle**:
>
> - 1.7.20: 报告关于内联`函数``形参`上的内联`扩展`调用的警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止调用名为 `suspend` 且带有匿名`函数``实参`的`中缀函数`

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将不再允许调用名为 `suspend` 且带有一个作为匿名`函数`字面值传递的`函数类型``实参`的`中缀函数`。
>
> **Deprecation cycle**:
>
> - 1.7.20: 报告关于 `suspend` `中缀函数`调用（带匿名`函数`字面值）的警告
> - 1.9.0: 将警告提升为错误，
>   `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 可用于暂时恢复到 1.9 之前的行为
> - TODO: 更改解析器解释 `suspend fun` 令牌序列的方式

### 禁止在`内部类`中违背`型变`规则使用捕获的`类型形参`

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止在该类的`内部类`中，在违反该`类型形参``声明`的`型变`规则的位置使用具有 `in` 或 `out` `型变`的`外部类`的`类型形参`。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当`外部类`的`类型形参`使用位置违反该`形参`的`型变`规则时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误，
>   `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 可用于暂时恢复到 1.9 之前的行为

### 禁止在`复合赋值操作符`中递归调用无`显式`返回类型的`函数`

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止在`函数`体内部的`复合赋值操作符``实参`中调用无`显式`返回类型的`函数`，就像它目前在该`函数`体内部的其他`表达式`中那样。
>
> **Deprecation cycle**:
>
> - 1.7.0: 当无`显式`返回类型的`函数`在该`函数`体内部的`复合赋值操作符``实参`中被递归调用时，报告警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误

### 禁止 `expected @NotNull T` 和 `given Kotlin generic parameter with nullable bound` 之间不健全的调用

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止`方法`调用，当将潜在`可空`泛型类型的值传递给 Java `方法`的 `@NotNull` 注解`形参`时。
>
> **Deprecation cycle**:
>
> - 1.5.20: 当将无约束的泛型`类型形参`传递给预期为`非空`类型的位置时，报告警告
> - 1.9.0: 报告类型不匹配错误而非上述警告，
>   `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 可用于暂时恢复到 1.8 之前的行为

### 禁止在`枚举类`的条目初始化器中访问`枚举``伴生对象`成员

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 将禁止从`枚举条目初始化器`中对`枚举``伴生对象`的所有类型访问。
>
> **Deprecation cycle**:
>
> - 1.6.20: 报告关于此类`伴生对象`成员访问的警告（或在渐进模式下报告错误）
> - 1.9.0: 将警告提升为错误，
>   `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 可用于暂时恢复到 1.8 之前的行为

### `废弃`并移除 Enum.declaringClass `合成属性`

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 允许对从底层 Java 类 `java.lang.Enum` 的 `getDeclaringClass()` `方法`生成的 `Enum` 值使用`合成属性` `declaringClass`，即使此`方法`对 Kotlin `Enum` 类型不可用。Kotlin 1.9 将禁止使用此属性，建议迁移到`扩展属性` `declaringJavaClass`。
>
> **Deprecation cycle**:
>
> - 1.7.0: 报告关于 `declaringClass` 属性用法的警告（或在渐进模式下报告错误），
>   建议迁移到 `declaringJavaClass` `扩展`
> - 1.9.0: 将警告提升为错误，
>   `-XXLanguage:-ProhibitEnumDeclaringClass` 可用于暂时恢复到 1.9 之前的行为
> - 2.0.0: 移除 `declaringClass` `合成属性`

### `废弃``编译器`选项 `-Xjvm-default` 的 `enable` 和 `compatibility` 模式

> **Issues**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 禁止使用`编译器`选项 `-Xjvm-default` 的 `enable` 和 `compatibility` 模式。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对`编译器`选项 `-Xjvm-default` 的 `enable` 和 `compatibility` 模式引入警告
> - 1.9.0: 将此警告提升为错误

### 禁止在`构建器``推断`上下文的`上界`中隐式`推断``类型变量`

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.0 将禁止在`构建器``推断` `lambda 表达式`的`作用域`中，在没有任何`使用点类型信息`的情况下，将`类型变量``推断`为相应`类型形参`的`上界`，其方式与当前在其他上下文中的方式相同。
>
> **Deprecation cycle**:
>
> - 1.7.20: 当在没有`使用点类型信息`的情况下，`类型形参`被`推断`为`声明`的`上界`时，报告警告（或在渐进模式下报告错误）
> - 2.0.0: 将警告提升为错误

## 标准库

### `Range`/`Progression` 实现 `Collection` 时警告潜在的`重载决议`更改

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 计划在 Kotlin 1.9 中在标准`数列`和从它们`继承`的具体`区间`中实现 `Collection` 接口。如果某个`方法`有两个`重载`，一个接受`元素`，另一个接受`集合`，这可能会导致在`重载决议`中选择不同的`重载`。当使用`区间`或`数列``实参`调用此类`重载``方法`时，Kotlin 将通过报告警告或错误来使这种情况可见。
>
> **Deprecation cycle**:
>
> - 1.6.20: 当`重载``方法`以标准`数列`或其`区间``继承者`作为`实参`调用时，如果此`数列`/`区间`实现 `Collection` 接口导致将来在此调用中选择另一个`重载`，则报告警告
> - 1.8.0: 将此警告提升为错误
> - 2.1.0: 停止报告错误，在`数列`中实现 `Collection` 接口，从而更改受影响情况下的`重载决议`结果

### 将 `kotlin.dom` 和 `kotlin.browser` 包中的`声明`迁移到 `kotlinx.*`

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` 和 `kotlin.browser` 包中的`声明`已移至相应的 `kotlinx.*` 包，以准备将其从`标准库`中提取。
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替代 `API`
> - 1.4.0: `废弃` `kotlin.dom` 和 `kotlin.browser` 包中的 `API` 并建议使用上述新 `API` 作为替代
> - 1.6.0: 将`废弃`级别提升为错误
> - 1.8.20: 为 JS-IR `target` 从`标准库`中移除`废弃`的`函数`
> - &gt;= 2.0: 将 `kotlinx.*` 包中的 `API` 移至单独的`库`

### `废弃`一些仅限 JS 的 `API`

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `标准库`中一些仅限 JS 的`函数`已`废弃`以备移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比较`函数`的数组`排序函数`，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **Deprecation cycle**:
>
> - 1.6.0: `废弃`受影响的`函数`并发出警告
> - 1.9.0: 将`废弃`级别提升为错误
> - &gt;=2.0: 从公共 `API` 中移除`废弃`的`函数`

## 工具

### 从 `Gradle` `设置`中移除 `enableEndorsedLibs` `标志`

> **Issue**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `Gradle` `设置`不再支持 `enableEndorsedLibs` `标志`。
>
> **Deprecation cycle**:
>
> - < 1.9.0: `enableEndorsedLibs` `标志`在 `Gradle` `设置`中受支持
> - 1.9.0: `enableEndorsedLibs` `标志`在 `Gradle` `设置`中**不**受支持

### 移除 `Gradle` `约定`

> **Issue**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `Gradle` `约定`已在 `Gradle` 7.1 中`废弃`，并已在 `Gradle` 8 中移除。
>
> **Deprecation cycle**:
>
> - 1.7.20: `Gradle` `约定`已`废弃`
> - 1.9.0: `Gradle` `约定`已移除

### 移除 `KotlinCompile` `任务`的 `classpath` `属性`

> **Issue**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompile` `任务`的 `classpath` `属性`已移除。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` `属性`已`废弃`
> - 1.8.0: 将`废弃`级别提升为错误
> - 1.9.0: 从公共 `API` 中移除`废弃`的`函数`

### `废弃` `kotlin.internal.single.build.metrics.file` `属性`

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `废弃`用于`定义`单个`文件`以`构建`报告的 `kotlin.internal.single.build.metrics.file` `属性`。
> 请改用 `kotlin.build.report.single_file` `属性`并设置 `kotlin.build.report.output=single_file`。
>
> **Deprecation cycle:**
>
> * 1.8.0: 将`废弃`级别提升为警告
> * &gt;= 1.9: 删除该`属性`