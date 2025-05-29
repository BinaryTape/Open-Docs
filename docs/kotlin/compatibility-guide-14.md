[//]: # (title: Kotlin 1.4 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的核心原则。前者指出应移除阻碍语言演进的构造，而后者则表示这种移除应提前充分沟通，以使代码迁移尽可能顺畅。

尽管大多数语言变更已通过其他渠道（例如更新日志或编译器警告）发布，但本文档对它们进行了总结，为从 Kotlin 1.3 迁移到 Kotlin 1.4 提供了完整的参考。

## 基本术语

本文档中，我们引入了几种兼容性类型：

-   _源代码_：源代码不兼容变更会使原本正常编译（无错误或警告）的代码无法再编译。
-   _二进制_：如果相互替换两个二进制构件不会导致加载或链接错误，则称它们是二进制兼容的。
-   _行为_：如果同一程序在应用变更前后表现出不同行为，则称该变更行为不兼容。

请记住，这些定义仅针对纯 Kotlin。从其他语言（例如 Java）视角来看的 Kotlin 代码兼容性不在本文档的范围之内。

## 语言和标准库 (stdlib)

### `in` 中缀操作符和 `ConcurrentHashMap` 的意外行为

> **问题**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: Kotlin 1.4 将禁止来自 Java 编写的 `java.util.Map` 实现者的自动操作符 `contains`。
>
> **弃用周期**:
>
> -   < 1.4: 在调用点对有问题的操作符引入警告
> -   `>=` 1.4: 将此警告提升为错误，
>     `-XXLanguage:-ProhibitConcurrentHashMapContains` 可用于暂时恢复到 1.4 之前的行为

### 禁止在公共内联成员中访问受保护成员

> **问题**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: Kotlin 1.4 将禁止从公共内联成员中访问受保护成员。
>
> **弃用周期**:
>
> -   < 1.4: 对有问题的案例在调用点引入警告
> -   1.4: 将此警告提升为错误，
>     `-XXLanguage:-ProhibitProtectedCallFromInline` 可用于暂时恢复到 1.4 之前的行为

### 隐式接收者调用的契约

> **问题**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 在 1.4 中，来自契约的智能类型转换 (smart casts) 将在隐式接收者调用中可用
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 可用于暂时恢复到 1.4 之前的行为

### 浮点数比较行为不一致

> **问题**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，Kotlin 编译器将使用 IEEE 754 标准来比较浮点数
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-ProperIeee754Comparisons` 可用于暂时恢复到 1.4 之前的行为

### 泛型 Lambda 中最后一个表达式没有智能类型转换

> **问题**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 1.4 开始，Lambda 中最后一个表达式的智能类型转换将正确应用
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 不要依赖 Lambda 参数的顺序来强制结果为 `Unit`

> **问题**: [KT-36045](https://youtrack.com/issue/KT-36045)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，Lambda 参数将独立解析，不隐式强制转换为 `Unit`。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 原始类型与整数字面量类型之间的错误公共超类型导致不健全代码

> **问题**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，原始 `Comparable` 类型与整数字面量类型之间的公共超类型将更具体。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 类型安全问题：多个相等类型变量被实例化为不同类型

> **问题**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，Kotlin 编译器将禁止用不同类型实例化相等类型变量。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 类型安全问题：交集类型不正确的子类型化

> **问题**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 在 Kotlin 1.4 中，交集类型的子类型化将被优化以更正确地工作。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### Lambda 内空 `when` 表达式没有类型不匹配

> **问题**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，如果空 `when` 表达式用作 Lambda 中的最后一个表达式，将出现类型不匹配。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 在可能返回值之一中包含整数字面量的提前返回 Lambda 推断出返回类型为 `Any`

> **问题**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，从 Lambda 返回的整数类型在存在提前返回的情况下将更具体。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 正确捕获带有递归类型的星投影

> **问题**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，更多候选者将变得适用，因为递归类型的捕获将更正确地工作。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 非适当类型与灵活类型计算公共超类型导致不正确结果

> **问题**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，灵活类型之间的公共超类型将更具体，从而防止运行时错误。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 类型安全问题：缺少对可空类型参数的捕获转换

> **问题**: [KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，捕获类型和可空类型之间的子类型化将更正确，从而防止运行时错误。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 在非受检转换 (unchecked cast) 后保留协变类型的交集类型

> **问题**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，协变类型的非受检转换 (unchecked casts) 会为智能类型转换 (smart casts) 产生交集类型，而不是非受检转换的类型。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 因为使用 `this` 表达式，类型变量从构建器类型推断 (builder inference) 中泄漏

> **问题**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，如果不存在其他适当约束，则禁止在 `sequence {}` 等构建器函数内部使用 `this`。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 带有可空类型参数的逆变类型错误的重载解析

> **问题**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，如果一个函数的两个重载（它们接受逆变类型参数）仅在类型的可空性上有所不同（例如 `In<T>` 和 `In<T?>`），则可空类型被认为更具体。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 带有非嵌套递归约束的构建器类型推断 (builder inference)

> **问题**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，`sequence {}` 等构建器函数，如果其类型依赖于传入 Lambda 内部的递归约束，将导致编译器错误。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 急切的类型变量固定导致矛盾的约束系统

> **问题**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，在某些情况下，类型推断的工作方式不再那么急切，从而可以找到不矛盾的约束系统。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还将禁用一些新的语言特性。

### 禁止在 `open` 函数上使用 `tailrec` 修饰符

> **问题**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，函数不能同时拥有 `open` 和 `tailrec` 修饰符。
>
> **弃用周期**:
>
> -   < 1.4: 报告同时具有 `open` 和 `tailrec` 修饰符的函数上的警告（在渐进模式下为错误）。
> -   `>=` 1.4: 将此警告提升为错误。

### 伴生对象 (companion object) 的 `INSTANCE` 字段比伴生对象类本身更可见

> **问题**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，如果伴生对象是私有的，则其字段 `INSTANCE` 也将是私有的。
>
> **弃用周期**:
>
> -   < 1.4: 编译器生成带有弃用标志的对象 `INSTANCE`
> -   `>=` 1.4: 伴生对象 `INSTANCE` 字段具有适当可见性

### 在返回前插入的外部 `finally` 块未从没有 `finally` 的内部 `try` 块的捕获区间中排除

> **问题**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，嵌套的 `try/catch` 块的捕获区间将正确计算。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-ProperFinally` 可用于暂时恢复到 1.4 之前的行为

### 对于协变和泛型特化 (generic-specialized) 的重写，在返回类型位置使用内联类的装箱版本

> **问题**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，使用协变和泛型特化 (generic-specialized) 的重写函数将返回内联类的装箱值。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更

### 使用 Kotlin 接口委托时，不在 JVM 字节码中声明受检异常

> **问题**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: Kotlin 1.4 将不会在接口委托到 Kotlin 接口时生成受检异常。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 可用于暂时恢复到 1.4 之前的行为

### 改变了单 `vararg` 参数方法的签名多态调用行为，以避免将参数包装到另一个数组中

> **问题**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: Kotlin 1.4 将不会在签名多态调用中将参数包装到另一个数组中。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更

### `KClass` 用作泛型参数时注解中错误的泛型签名

> **问题**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: Kotlin 1.4 将修复 `KClass` 用作泛型参数时注解中不正确的类型映射。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更

### 禁止在签名多态调用中使用展开操作符

> **问题**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: Kotlin 1.4 将禁止在签名多态调用中使用展开操作符 (`*`)。
>
> **弃用周期**:
>
> -   < 1.4: 报告在签名多态调用中使用展开操作符的警告
> -   `>=` 1.5: 将此警告提升为错误，
>     `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 可用于暂时恢复到 1.4 之前的行为

### 更改尾递归优化函数默认值的初始化顺序

> **问题**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，尾递归函数的初始化顺序将与常规函数相同。
>
> **弃用周期**:
>
> -   < 1.4: 对有问题的函数在声明点报告警告
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 可用于暂时恢复到 1.4 之前的行为

### 不为非 `const` 的 `val` 生成 `ConstantValue` 属性

> **问题**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，编译器将不会为非 `const` 的 `val` 生成 `ConstantValue` 属性。
>
> **弃用周期**:
>
> -   < 1.4: 通过 IntelliJ IDEA 检查报告警告
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 可用于暂时恢复到 1.4 之前的行为

### 为 `open` 方法上的 `@JvmOverloads` 生成的重载应为 `final`

> **问题**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 带有 `@JvmOverloads` 的函数重载将生成为 `final`。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更，
>     `-XXLanguage:-GenerateJvmOverloadsAsFinal` 可用于暂时恢复到 1.4 之前的行为

### 返回 `kotlin.Result` 的 Lambda 现在返回装箱值而不是未装箱值

> **问题**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，返回 `kotlin.Result` 类型值的 Lambda 将返回装箱值而不是未装箱值。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更

### 统一空检查的异常

> **问题**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，所有运行时空检查都将抛出 `java.lang.NullPointerException`。
>
> **弃用周期**:
>
> -   < 1.4: 运行时空检查抛出不同的异常，例如 `KotlinNullPointerException`、`IllegalStateException`、
>     `IllegalArgumentException` 和 `TypeCastException`
> -   `>=` 1.4: 所有运行时空检查都抛出 `java.lang.NullPointerException`。
>     `-Xno-unified-null-checks` 可用于暂时恢复到 1.4 之前的行为

### 数组/列表操作 `contains`、`indexOf`、`lastIndexOf` 中的浮点值比较：IEEE 754 或全序

> **问题**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 `Double/FloatArray.asList()` 返回的 `List` 实现将实现 `contains`、`indexOf` 和 `lastIndexOf`，以便它们使用全序相等性。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更

### 逐步将集合 `min` 和 `max` 函数的返回类型更改为非空

> **问题**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 集合 `min` 和 `max` 函数的返回类型将在 1.6 中更改为非空。
>
> **弃用周期**:
>
> -   1.4: 引入 `...OrNull` 函数作为同义词并弃用受影响的 API（详见问题描述）
> -   1.5.x: 将受影响 API 的弃用级别提升为错误
> -   `>=`1.6: 重新引入受影响的 API，但返回类型为非空

### 弃用 `appendln`，支持 `appendLine`

> **问题**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: `StringBuilder.appendln()` 将被弃用，支持 `StringBuilder.appendLine()`。
>
> **弃用周期**:
>
> -   1.4: 引入 `appendLine` 函数作为 `appendln` 的替代方案，并弃用 `appendln`
> -   `>=`1.5: 将弃用级别提升为错误

### 弃用浮点类型到 `Short` 和 `Byte` 的转换

> **问题**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，浮点类型到 `Short` 和 `Byte` 的转换将被弃用。
>
> **弃用周期**:
>
> -   1.4: 弃用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 并建议替代方案
> -   `>=`1.5: 将弃用级别提升为错误

### 在 `Regex.findAll` 中对无效 `startIndex` 快速失败 (Fail fast)

> **问题**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 从 Kotlin 1.4 开始，`findAll` 将得到改进，以检查 `startIndex` 是否在输入字符序列在进入 `findAll` 时有效位置索引的范围内，如果不是，则抛出 `IndexOutOfBoundsException`。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更

### 移除已弃用的 `kotlin.coroutines.experimental`

> **问题**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，已弃用的 `kotlin.coroutines.experimental` API 已从标准库中移除。
>
> **弃用周期**:
>
> -   < 1.4: `kotlin.coroutines.experimental` 以 `ERROR` 级别弃用
> -   `>=` 1.4: `kotlin.coroutines.experimental` 从标准库中移除。在 JVM 上，提供了单独的兼容性构件（详见问题描述）。

### 移除已弃用的 `mod` 操作符

> **问题**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源代码
>
> **简要总结**: 从 Kotlin 1.4 开始，数值类型上的 `mod` 操作符已从标准库中移除。
>
> **弃用周期**:
>
> -   < 1.4: `mod` 以 `ERROR` 级别弃用
> -   `>=` 1.4: `mod` 从标准库中移除

### 隐藏 `Throwable.addSuppressed` 成员，优先使用扩展函数

> **问题**: [KT-38777](https://youtrack.com/issue/KT-38777)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 行为
>
> **简要总结**: `Throwable.addSuppressed()` 扩展函数现在优先于 `Throwable.addSuppressed()` 成员函数。
>
> **弃用周期**:
>
> -   < 1.4: 旧行为（详见问题描述）
> -   `>=` 1.4: 行为变更

### `capitalize` 应该将二合字母 (digraphs) 转换为首字母大写 (title case)

> **问题**: [KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 行为
>
> **简要总结**: `String.capitalize()` 函数现在将 [塞尔维亚-克罗地亚语盖伊拉丁字母](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet) 中的二合字母 (digraphs) 转换为首字母大写 (title case)（`ǅ` 而不是 `Ǆ`）。
>
> **弃用周期**:
>
> -   < 1.4: 二合字母 (digraphs) 转换为大写（`Ǆ`）
> -   `>=` 1.4: 二合字母 (digraphs) 转换为首字母大写 (title case)（`ǅ`）

## 工具

### 在 Windows 上，包含分隔符的编译器参数必须用双引号传递

> **问题**: [KT-41309](https://youtrack.jetbrains.com/issue/KT-41309)
>
> **组件**: CLI
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 在 Windows 上，包含分隔符（空格、`=`、`;`、`,`）的 `kotlinc.bat` 参数现在需要双引号 (`"` )。
>
> **弃用周期**:
>
> -   < 1.4: 所有编译器参数都无需引号即可传递
> -   `>=` 1.4: 包含分隔符（空格、`=`、`;`、`,`）的编译器参数需要双引号 (`"`)

### KAPT：属性的合成 `$annotations()` 方法名称已更改

> **问题**: [KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
>
> **组件**: KAPT
>
> **不兼容变更类型**: 行为
>
> **简要总结**: 在 1.4 中，KAPT 为属性生成的合成 `$annotations()` 方法名称已更改。
>
> **弃用周期**:
>
> -   < 1.4: 属性的合成 `$annotations()` 方法名称遵循模板 `<propertyName>@annotations()`
> -   `>=` 1.4: 属性的合成 `$annotations()` 方法名称包含 `get` 前缀: `get<PropertyName>@annotations()`