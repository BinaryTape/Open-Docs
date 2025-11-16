[//]: # (title: Kotlin 1.4.x 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计中的基本原则。前者指出应移除阻碍语言演进的结构，后者则表明这种移除应提前充分沟通，以使代码迁移尽可能顺利。

虽然大多数语言变更已通过其他渠道（例如更新日志或编译器警告）公布，但本文档汇总了所有这些变更，为从 Kotlin 1.3 迁移到 Kotlin 1.4 提供了完整的参考。

## 基本术语

在本文档中，我们引入了几种兼容性：

-   _源码_：源码不兼容的变更会使得原本能（无错误或警告地）正常编译的代码无法继续编译
-   _二进制_：如果两个二进制构件在相互替换后不会导致加载或链接错误，则称它们是二进制兼容的
-   _行为_：如果同一程序在应用变更前后表现出不同行为，则称该变更是行为不兼容的

请记住，这些定义仅适用于纯 Kotlin。从其他语言（例如 Java）的角度来看，Kotlin 代码的兼容性超出了本文档的范围。

## 语言和标准库

### `in` 中缀操作符和 ConcurrentHashMap 的意外行为

> **议题**：[KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：Kotlin 1.4 将禁止来自 Java 中 `java.util.Map` 实现者的自动操作符 `contains`
>
> **废弃周期**：
>
> -   < 1.4：在调用点对有问题操作符引入警告
> -   &gt;= 1.4：将此警告提升为错误，
>     `-XXLanguage:-ProhibitConcurrentHashMapContains` 可用于临时恢复到 1.4 版之前的行为

### 禁止在公共内联成员内部访问 `protected` 成员

> **议题**：[KT-21178](https://youtrack.com/issue/KT-21178)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：Kotlin 1.4 将禁止从公共内联成员中访问 `protected` 成员。
>
> **废弃周期**：
>
> -   < 1.4：在调用点对有问题情况引入警告
> -   1.4：将此警告提升为错误，
>     `-XXLanguage:-ProhibitProtectedCallFromInline` 可用于临时恢复到 1.4 版之前的行为

### 带隐式接收者的调用上的契约

> **议题**：[KT-28672](https://youtrack.com/issue/KT-28672)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 1.4 版开始，契约的智能类型转换将可用于带隐式接收者的调用
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 可用于临时恢复到 1.4 版之前的行为

### 浮点数比较行为不一致

> **议题**：[KT-22723](https://youtrack.com/issue/KT-22723)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，Kotlin 编译器将使用 IEEE 754 标准来比较浮点数
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-ProperIeee754Comparisons` 可用于临时恢复到 1.4 版之前的行为

### 泛型 lambda 表达式中最后一个表达式不进行智能类型转换

> **议题**：[KT-15020](https://youtrack.com/issue/KT-15020)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 1.4 版开始，lambda 表达式中最后一个表达式的智能类型转换将正确应用
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 不依赖 lambda 实参的顺序来强制将结果转换为 Unit

> **议题**：[KT-36045](https://youtrack.com/issue/KT-36045)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，lambda 实参将独立解析，不隐式强制转换为 `Unit`
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 原始类型与整数字面量类型之间错误的公共超类型导致不健全的代码

> **议题**：[KT-35681](https://youtrack.com/issue/KT-35681)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，原始 `Comparable` 类型与整数字面量类型之间的公共超类型将更加具体
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 由于将多个相等类型变量实例化为不同类型而导致类型安全问题

> **议题**：[KT-35679](https://youtrack.com/issue/KT-35679)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，Kotlin 编译器将禁止将相等类型变量实例化为不同类型
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 由于交集类型的子类型化不正确而导致类型安全问题

> **议题**：[KT-22474](https://youtrack.com/issue/KT-22474)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：在 Kotlin 1.4 中，交集类型的子类型化将进行优化以更正确地工作
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### lambda 表达式内部空 `when` 表达式不报类型不匹配

> **议题**：[KT-17995](https://youtrack.com/issue/KT-17995)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，如果空 `when` 表达式用作 lambda 表达式中的最后一个表达式，则会出现类型不匹配错误
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 对于带有提前返回且其中一个可能返回值是整数字面量的 lambda 表达式，其返回类型推断为 `Any`

> **议题**：[KT-20226](https://youtrack.com/issue/KT-20226)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，从 lambda 表达式返回的整数类型在存在提前返回的情况下将更加具体
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 正确捕获递归类型的星型投影

> **议题**：[KT-33012](https://youtrack.com/issue/KT-33012)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，更多候选将变得适用，因为递归类型的捕获将更正确地工作
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 不恰当类型和弹性类型计算公共超类型导致不正确结果

> **议题**：[KT-37054](https://youtrack.com/issue/KT-37054)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，弹性类型之间的公共超类型将更加具体，从而防止运行时错误
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 由于缺乏针对可空类型实参的捕获转换而导致类型安全问题

> **议题**：[KT-35487](https://youtrack.com/issue/KT-35487)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，捕获类型与可空类型之间的子类型化将更正确，从而防止运行时错误
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 在非检查转换后保留协变类型的交集类型

> **议题**：[KT-37280](https://youtrack.com/issue/KT-37280)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，协变类型的非检查转换将为智能类型转换产生交集类型，而不是非检查转换的类型。
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 由于使用 `this` 表达式导致构建器推断中的类型变量泄露

> **议题**：[KT-32126](https://youtrack.com/issue/KT-32126)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，如果没有其他适当约束，在 `sequence {}` 等构建器函数内部使用 `this` 将被禁止
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 带可空类型实参的逆变类型的错误重载解析

> **议题**：[KT-31670](https://youtrack.com/issue/KT-31670)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，如果接受逆变类型实参的两个重载函数仅在类型可空性上不同（例如 `In<T>` 和 `In<T?>`），则可空类型被认为更具体。
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 带非嵌套递归约束的构建器推断

> **议题**：[KT-34975](https://youtrack.com/issue/KT-34975)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，像 `sequence {}` 这种在传递的 lambda 表达式内部其类型依赖于递归约束的构建器函数会导致编译器错误。
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 急切类型变量固定导致矛盾的约束系统

> **议题**：[KT-25175](https://youtrack.com/issue/KT-25175)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，某些情况下类型推断不那么急切地工作，从而允许找到不矛盾的约束系统。
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NewInference` 可用于临时恢复到 1.4 版之前的行为。请注意，此标志还将禁用多项新的语言特性。

### 禁止在开放函数上使用 `tailrec` 修饰符

> **议题**：[KT-18541](https://youtrack.com/issue/KT-18541)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，函数不能同时拥有 `open` 和 `tailrec` 修饰符。
>
> **废弃周期**：
>
> -   < 1.4：对同时拥有 `open` 和 `tailrec` 修饰符的函数报告警告（在渐进模式下为错误）。
> -   &gt;= 1.4：将此警告提升为错误。

### 伴生对象 `INSTANCE` 字段可见性高于伴生对象类本身

> **议题**：[KT-11567](https://youtrack.com/issue/KT-11567)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，如果伴生对象是 `private` 的，那么其字段 `INSTANCE` 也将是 `private` 的
>
> **废弃周期**：
>
> -   < 1.4：编译器生成带有废弃标志的对象 `INSTANCE`
> -   &gt;= 1.4：伴生对象 `INSTANCE` 字段具有适当的可见性

### 插入在 `return` 之前的外部 `finally` 代码块未从内部无 `finally` 的 `try` 代码块的 `catch` 区间中排除

> **议题**：[KT-31923](https://youtrack.com/issue/KT-31923)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，嵌套 `try/catch` 代码块的 `catch` 区间将正确计算
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-ProperFinally` 可用于临时恢复到 1.4 版之前的行为

### 在返回类型位置，协变和泛型特化覆盖使用内联类的装箱版本

> **议题**：[KT-30419](https://youtrack.com/issue/KT-30419)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，使用协变和泛型特化覆盖的函数将返回内联类的装箱值
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改

### 在使用委托到 Kotlin 接口时，不在 JVM 字节码中声明受检异常

> **议题**：[KT-35834](https://youtrack.com/issue/KT-35834)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简要概述**：Kotlin 1.4 在接口委托到 Kotlin 接口时将不生成受检异常
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 可用于临时恢复到 1.4 版之前的行为

### 修改了对带有单个 `vararg` 形参的方法进行签名多态调用时的行为，以避免将实参包装到另一个数组中

> **议题**：[KT-35469](https://youtrack.com/issue/KT-35469)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简要概述**：Kotlin 1.4 将不会在签名多态调用时将实参包装到另一个数组中
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改

### 当 `KClass` 用作泛型形参时，注解中泛型签名不正确

> **议题**：[KT-35207](https://youtrack.com/issue/KT-35207)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简要概述**：Kotlin 1.4 将修复当 `KClass` 用作泛型形参时注解中不正确的类型映射
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改

### 禁止在签名多态调用中使用展开操作符

> **议题**：[KT-35226](https://youtrack.com/issue/KT-35226)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简要概述**：Kotlin 1.4 将禁止在签名多态调用中使用展开操作符（`*`）
>
> **废弃周期**：
>
> -   < 1.4：对在签名多态调用中使用展开操作符报告警告
> -   &gt;= 1.5：将此警告提升为错误，
>     `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 可用于临时恢复到 1.4 版之前的行为

### 更改尾递归优化函数默认值的初始化顺序

> **议题**：[KT-31540](https://youtrack.com/issue/KT-31540)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，尾递归函数的初始化顺序将与常规函数相同
>
> **废弃周期**：
>
> -   < 1.4：在声明点对有问题函数报告警告
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 可用于临时恢复到 1.4 版之前的行为

### 不对非 `const` 的 `val` 生成 `ConstantValue` 属性

> **议题**：[KT-16615](https://youtrack.com/issue/KT-16615)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，编译器将不对非 `const` 的 `val` 生成 `ConstantValue` 属性
>
> **废弃周期**：
>
> -   < 1.4：通过 IntelliJ IDEA 检查报告警告
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 可用于临时恢复到 1.4 版之前的行为

### `@JvmOverloads` 注解在 `open` 方法上生成的重载应为 `final`

> **议题**：[KT-33240](https://youtrack.com/issue/KT-33240)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简要概述**：带有 `@JvmOverloads` 注解的函数重载将生成为 `final`
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改，
>     `-XXLanguage:-GenerateJvmOverloadsAsFinal` 可用于临时恢复到 1.4 版之前的行为

### 返回 `kotlin.Result` 的 lambda 表达式现在返回装箱值而非未装箱值

> **议题**：[KT-39198](https://youtrack.com/issue/KT-39198)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，返回 `kotlin.Result` 类型值的 lambda 表达式将返回装箱值而非未装箱值
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改

### 统一空值检测抛出的异常

> **议题**：[KT-22275](https://youtrack.com/issue/KT-22275)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，所有运行时空值检测都将抛出 `java.lang.NullPointerException`
>
> **废弃周期**：
>
> -   < 1.4：运行时空值检测抛出不同的异常，例如 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`
> -   &gt;= 1.4：所有运行时空值检测都抛出 `java.lang.NullPointerException`。
>     `-Xno-unified-null-checks` 可用于临时恢复到 1.4 版之前的行为

### 数组/列表操作 `contains`、`indexOf`、`lastIndexOf` 中浮点值的比较：IEEE 754 或全序

> **议题**：[KT-28753](https://youtrack.com/issue/KT-28753)
>
> **组件**：kotlin-stdlib (JVM)
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 `Double/FloatArray.asList()` 返回的 `List` 实现将实现 `contains`、`indexOf` 和 `lastIndexOf`，以便它们使用全序相等性
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改

### 逐步将集合 `min` 和 `max` 函数的返回类型更改为非空

> **议题**：[KT-38854](https://youtrack.com/issue/KT-38854)
>
> **组件**：kotlin-stdlib (JVM)
>
> **不兼容变更类型**：源码
>
> **简要概述**：集合 `min` 和 `max` 函数的返回类型将在 1.6 版中更改为非空
>
> **废弃周期**：
>
> -   1.4：引入 `...OrNull` 函数作为同义词并废弃受影响的 API（详见议题）
> -   1.5.x：将受影响 API 的废弃级别提升为错误
> -   &gt;=1.6：重新引入受影响的 API，但使用非空返回类型

### 废弃 `appendln`，推荐使用 `appendLine`

> **议题**：[KT-38754](https://youtrack.com/issue/KT-38754)
>
> **组件**：kotlin-stdlib (JVM)
>
> **不兼容变更类型**：源码
>
> **简要概述**：`StringBuilder.appendln()` 将被废弃，推荐使用 `StringBuilder.appendLine()`
>
> **废弃周期**：
>
> -   1.4：引入 `appendLine` 函数作为 `appendln` 的替代项并废弃 `appendln`
> -   &gt;=1.5：将废弃级别提升为错误

### 废弃浮点类型到 `Short` 和 `Byte` 的转换

> **议题**：[KT-30360](https://youtrack.com/issue/KT-30360)
>
> **组件**：kotlin-stdlib (JVM)
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，浮点类型到 `Short` 和 `Byte` 的转换将被废弃
>
> **废弃周期**：
>
> -   1.4：废弃 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 并提出替代方案
> -   &gt;=1.5：将废弃级别提升为错误

### `Regex.findAll` 在 `startIndex` 无效时快速失败

> **议题**：[KT-28356](https://youtrack.com/issue/KT-28356)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：行为
>
> **简要概述**：从 Kotlin 1.4 版开始，`findAll` 将进行改进，以检测 `startIndex` 是否在进入 `findAll` 时输入字符序列的有效位置索引区间内，如果不在则抛出 `IndexOutOfBoundsException`
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改

### 移除废弃的 `kotlin.coroutines.experimental`

> **议题**：[KT-36083](https://youtrack.com/issue/KT-36083)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，废弃的 `kotlin.coroutines.experimental` API 将从标准库中移除
>
> **废弃周期**：
>
> -   < 1.4：`kotlin.coroutines.experimental` 已废弃，废弃级别为 `ERROR`
> -   &gt;= 1.4：`kotlin.coroutines.experimental` 从标准库中移除。在 JVM 上，提供了单独的兼容性构件（详见议题）。

### 移除废弃的 `mod` 操作符

> **议题**：[KT-26654](https://youtrack.com/issue/KT-26654)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源码
>
> **简要概述**：从 Kotlin 1.4 版开始，数值类型上的 `mod` 操作符将从标准库中移除
>
> **废弃周期**：
>
> -   < 1.4：`mod` 已废弃，废弃级别为 `ERROR`
> -   &gt;= 1.4：`mod` 从标准库中移除

### 隐藏 `Throwable.addSuppressed` 成员，并优先使用扩展函数

> **议题**：[KT-38777](https://youtrack.com/issue/KT-38777)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：行为
>
> **简要概述**：`Throwable.addSuppressed()` 扩展函数现在优先于 `Throwable.addSuppressed()` 成员函数
>
> **废弃周期**：
>
> -   < 1.4：旧行为（详见议题）
> -   &gt;= 1.4：行为已更改

### `capitalize` 应将双合字母转换为标题大小写

> **议题**：[KT-38817](https://youtrack.com/issue/KT-38817)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：行为
>
> **简要概述**：`String.capitalize()` 函数现在将 [塞尔维亚-克罗地亚语盖伊拉丁字母](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet) 中的双合字母转换为标题大小写（`ǅ` 而不是 `Ǆ`）
>
> **废弃周期**：
>
> -   < 1.4：双合字母转换为大写（`Ǆ`）
> -   &gt;= 1.4：双合字母转换为标题大小写（`ǅ`）

## 工具

### Windows 上带分隔符的编译器实参必须用双引号传递

> **议题**：[KT-41309](https://youtrack.com/issue/KT-41309)
>
> **组件**：CLI
>
> **不兼容变更类型**：行为
>
> **简要概述**：在 Windows 上，包含分隔符（空格、`=`、`;`、`,`）的 `kotlinc.bat` 实参现在需要双引号（`"`）
>
> **废弃周期**：
>
> -   < 1.4：所有编译器实参不带引号传递
> -   &gt;= 1.4：包含分隔符（空格、`=`、`;`、`,`）的编译器实参需要双引号（`"`）

### KAPT：属性的合成 `$annotations()` 方法名称已更改

> **议题**：[KT-36926](https://youtrack.com/issue/KT-36926)
>
> **组件**：KAPT
>
> **不兼容变更类型**：行为
>
> **简要概述**：KAPT 为属性生成的合成 `$annotations()` 方法名称在 1.4 版中已更改
>
> **废弃周期**：
>
> -   < 1.4：属性的合成 `$annotations()` 方法名称遵循 `<propertyName>@annotations()` 模板
> -   &gt;= 1.4：属性的合成 `$annotations()` 方法名称包含 `get` 前缀：`get<PropertyName>@annotations()`