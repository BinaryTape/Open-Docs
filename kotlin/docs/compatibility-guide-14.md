---
title: "Kotlin 1.4 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的根本原则。前者表示应该移除那些阻碍语言发展的结构，后者表示应该提前充分沟通这些移除，以使代码迁移尽可能平滑。

虽然大多数语言变更已经通过其他渠道宣布，如更新日志或编译器警告，但本文档将它们全部汇总，为从 Kotlin 1.3 迁移到 Kotlin 1.4 提供完整的参考。

## 基本术语

在本文档中，我们引入了几种兼容性：

- _source（源码）_: source-incompatible change（源码不兼容变更）会阻止原本编译正常（没有错误或警告）的代码再也无法编译
- _binary（二进制）_: 如果交换两个二进制工件不会导致加载或链接错误，则称它们是 binary-compatible（二进制兼容的）
- _behavioral（行为）_: 如果同一个程序在应用变更前后表现出不同的行为，则称该变更是 behavioral-incompatible（行为不兼容的）

请记住，这些定义仅适用于纯 Kotlin。 从其他语言角度（例如，从 Java）来看，Kotlin 代码的兼容性不在本文档的范围内。

## 语言和标准库

### `in` 中缀运算符和 `ConcurrentHashMap` 的意外行为

> **问题**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: Kotlin 1.4 将禁止自动运算符 `contains` 来自用 Java 编写的 `java.util.Map` 的实现者
> 
> **弃用周期**:
> 
> - < 1.4: 在调用点为有问题的运算符引入警告
> - &gt;= 1.4: 将此警告提升为错误, 可以使用 `-XXLanguage:-ProhibitConcurrentHashMapContains` 暂时恢复到 1.4 之前的行为

### 禁止从公共内联成员访问受保护的成员

> **问题**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: Kotlin 1.4 将禁止从公共内联成员访问受保护的成员。
> 
> **弃用周期**:
> 
> - < 1.4: 在调用点为有问题的用例引入警告
> - 1.4: 将此警告提升为错误, 可以使用 `-XXLanguage:-ProhibitProtectedCallFromInline` 暂时恢复到 1.4 之前的行为

### 具有隐式接收者的调用上的 Contracts（契约）

> **问题**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 来自 Contracts（契约）的智能类型转换将在 1.4 中对具有隐式接收者的调用可用
> 
> **弃用周期**: 
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 暂时恢复到 1.4 之前的行为

### 浮点数比较的不一致行为

> **问题**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 Kotlin 1.4 以来，Kotlin 编译器将使用 IEEE 754 标准来比较浮点数
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-ProperIeee754Comparisons` 暂时恢复到 1.4 之前的行为

### 在泛型 lambda 中的最后一个表达式上没有智能类型转换

> **问题**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 1.4 以来，lambda 中最后一个表达式的智能类型转换将得到正确应用
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 不要依赖 lambda 参数的顺序来强制将结果转换为 Unit

> **问题**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，lambda 参数将被独立解析，而不会隐式强制转换为 `Unit`
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 原始类型和整数文本类型之间的错误公共超类型导致不健全的代码

> **问题**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，原始 `Comparable` 类型和整数文本类型之间的公共超类型将更具体
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 由于几个相等的类型变量使用不同的类型实例化，导致类型安全问题

> **问题**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，Kotlin 编译器将禁止使用不同的类型实例化相等的类型变量
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 由于 intersection types（交集类型）的不正确子类型化导致的类型安全问题

> **问题**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 在 Kotlin 1.4 中，intersection types（交集类型）的子类型化将被改进，以更正确地工作
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 在 lambda 表达式中的空 `when` 表达式没有类型不匹配

> **问题**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，如果空 `when` 表达式用作 lambda 中的最后一个表达式，则会出现类型不匹配
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 对于 lambda 表达式，如果其中一个可能的返回值中包含整数文本，则推断返回类型为 Any

> **问题**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，从 lambda 返回的整数类型对于存在提前返回的情况将更加具体
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 正确捕获具有递归类型的星号投影

> **问题**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，由于递归类型的捕获将更正确地工作，因此将有更多候选者变得适用
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 具有非 proper type（恰当类型）和 flexible one（灵活类型）的公共超类型计算导致不正确的结果

> **问题**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 Kotlin 1.4 以来，flexible types（灵活类型）之间的公共超类型将更加具体，以防止运行时错误
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 由于缺少针对可空类型参数的捕获转换导致的类型安全问题

> **问题**: [KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，捕获类型和可空类型之间的子类型化将更加正确，以防止运行时错误
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 在 unchecked cast（未检查类型转换）之后保留 covariant types（协变类型）的 intersection type（交集类型）
 
> **问题**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，covariant types（协变类型）的 uchecked cast（未检查类型转换）会为智能类型转换生成 intersection type（交集类型），而不是 unchecked cast（未检查类型转换）的类型。
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 由于使用 this 表达式，类型变量从 builder inference（构建器推断）中泄漏
 
> **问题**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，如果不存在其他适当的约束，则禁止在像 `sequence {}` 这样的构建器函数中使用 `this`
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 具有可空类型参数的逆变类型的错误重载解析
 
> **问题**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，如果接受逆变类型参数的函数的两个重载仅在类型的可空性上有所不同（例如 `In<T>` 和 `In<T?>`），则认为可空类型更具体。
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 具有非嵌套递归约束的构建器推断
 
> **问题**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，类型依赖于传递的 lambda 内部的递归约束的构建器函数（如 `sequence {}`）会导致编译器错误。
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 急切的类型变量固定导致矛盾的约束系统
 
> **问题**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，某些情况下的类型推断不再那么急切，从而可以找到不矛盾的约束系统。
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NewInference` 暂时恢复到 1.4 之前的行为。 请注意，此标志还将禁用一些新的语言功能。

### 禁止在 open 函数上使用 tailrec 修饰符

> **问题**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
> 
> **组件**: 核心语言
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，函数不能同时具有 `open` 和 `tailrec` 修饰符。
> 
> **弃用周期**:
> 
> - < 1.4: 报告同时具有 `open` 和 `tailrec` 修饰符的函数上的警告（在 progressive mode（渐进模式）下为错误）。
> - &gt;= 1.4: 将此警告提升为错误。

### 伴生对象的 INSTANCE 字段比伴生对象类本身更可见

> **问题**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，如果伴生对象是私有的，那么它的字段 `INSTANCE` 也将是私有的
> 
> **弃用周期**:
> 
> - < 1.4: 编译器生成具有弃用标志的对象 `INSTANCE`
> - &gt;= 1.4: 伴生对象 `INSTANCE` 字段具有适当的可见性

### 在没有 finally 的内部 try 块的 catch 间隔中，不排除在 return 之前插入的外部 finally 块

> **问题**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 Kotlin 1.4 以来，将为嵌套的 `try/catch` 块正确计算 catch 间隔
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-ProperFinally` 暂时恢复到 1.4 之前的行为

### 在协变和泛型专用重写中使用内联类的 boxed 版本作为返回类型

> **问题**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 Kotlin 1.4 以来，使用协变和泛型专用重写的函数将返回内联类的 boxed 值
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改

### 使用委托给 Kotlin 接口时，不要在 JVM 字节码中声明 checked exceptions（受检异常）

> **问题**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: Kotlin 1.4 不会在接口委托给 Kotlin 接口期间生成 checked exceptions（受检异常）
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 暂时恢复到 1.4 之前的行为

### 更改了对具有单个 vararg 参数的方法的 signature-polymorphic（签名多态）调用的行为，以避免将参数包装到另一个数组中

> **问题**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: Kotlin 1.4 不会将参数包装到 signature-polymorphic（签名多态）调用的另一个数组中
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改

### 当 KClass 用作泛型参数时，注解中的泛型签名不正确

> **问题**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 当 KClass 用作泛型参数时，Kotlin 1.4 将修复注解中不正确的类型映射
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改

### 禁止在 signature-polymorphic（签名多态）调用中使用 spread operator（展开运算符）

> **问题**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: Kotlin 1.4 将禁止在 signature-polymorphic（签名多态）调用中使用 spread operator（展开运算符）(*)
> 
> **弃用周期**:
> 
> - < 1.4: 报告在 signature-polymorphic（签名多态）调用中使用 spread operator（展开运算符）的警告
> - &gt;= 1.5: 将此警告提升为错误, 可以使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 暂时恢复到 1.4 之前的行为

### 更改 tail-recursive（尾递归）优化函数的默认值的初始化顺序

> **问题**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 Kotlin 1.4 以来，tail-recursive（尾递归）函数的初始化顺序将与常规函数相同
> 
> **弃用周期**:
> 
> - < 1.4: 在有问题的函数的声明位置报告警告
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 暂时恢复到 1.4 之前的行为

### 不要为非 const vals 生成 ConstantValue 属性

> **问题**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 Kotlin 1.4 以来，编译器将不会为非 `const` `val` 生成 `ConstantValue` 属性
> 
> **弃用周期**:
> 
> - < 1.4: 通过 IntelliJ IDEA 检查报告警告
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 暂时恢复到 1.4 之前的行为

### 在 open 方法上为 @JvmOverloads 生成的重载应该是 final

> **问题**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 具有 `@JvmOverloads` 的函数的重载将生成为 `final`
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改, 可以使用 `-XXLanguage:-GenerateJvmOverloadsAsFinal` 暂时恢复到 1.4 之前的行为

### 返回 kotlin.Result 的 Lambdas 现在返回 boxed 值而不是 unboxed 值

> **问题**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 Kotlin 1.4 以来，返回 `kotlin.Result` 类型值的 lambdas 将返回 boxed 值而不是 unboxed 值
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改

### 统一空值检查中的异常

> **问题**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
> 
> **组件**: Kotlin/JVM
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 从 Kotlin 1.4 开始，所有运行时空值检查都将抛出 `java.lang.NullPointerException`
> 
> **弃用周期**:
> 
> - < 1.4: 运行时空值检查会抛出不同的异常，例如 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`
> - &gt;= 1.4: 所有运行时空值检查都抛出 `java.lang.NullPointerException`。 可以使用 `-Xno-unified-null-checks` 暂时恢复到 1.4 之前的行为

### 在数组/列表操作 contains、indexOf、lastIndexOf 中比较浮点值：IEEE 754 或 total order（全序）

> **问题**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
> 
> **组件**: kotlin-stdlib (JVM)
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 从 `Double/FloatArray.asList()` 返回的 `List` 实现将实现 `contains`、`indexOf` 和 `lastIndexOf`，以便它们使用 total order equality（全序相等）
> 
> **弃用周期**: 
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改

### 逐步将 collection 的 min 和 max 函数的返回类型更改为 non-nullable（非空）

> **问题**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
> 
> **组件**: kotlin-stdlib (JVM)
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: collection 的 `min` 和 `max` 函数的返回类型将在 1.6 中更改为 non-nullable（非空）
> 
> **弃用周期**:
> 
> - 1.4: 引入 `...OrNull` 函数作为同义词并弃用受影响的 API (参见 issue 中的详细信息)
> - 1.5.x: 将受影响的 API 的弃用级别提高到 error
> - &gt;=1.6: 重新引入受影响的 API，但使用 non-nullable（非空）返回类型

### 弃用 appendln 以支持 appendLine

> **问题**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
> 
> **组件**: kotlin-stdlib (JVM)
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: `StringBuilder.appendln()` 将被弃用以支持 `StringBuilder.appendLine()`
> 
> **弃用周期**:
> 
> - 1.4: 引入 `appendLine` 函数作为 `appendln` 的替代品并弃用 `appendln`
> - &gt;=1.5: 将弃用级别提高到 error

### 弃用浮点类型到 Short 和 Byte 的转换

> **问题**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
> 
> **组件**: kotlin-stdlib (JVM)
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，浮点类型到 `Short` 和 `Byte` 的转换将被弃用
> 
> **弃用周期**:
> 
> - 1.4: 弃用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 并提出替代方案
> - &gt;=1.5: 将弃用级别提高到 error

### 在无效的 startIndex 上快速失败 Regex.findAll

> **问题**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
> 
> **组件**: kotlin-stdlib
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 自 Kotlin 1.4 以来，`findAll` 将得到改进，以检查 `startIndex` 是否在输入字符序列的有效位置索引范围内，并在进入 `findAll` 时抛出 `IndexOutOfBoundsException`，如果不是
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改

### 移除已弃用的 kotlin.coroutines.experimental

> **问题**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
> 
> **组件**: kotlin-stdlib
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，已弃用的 `kotlin.coroutines.experimental` API 已从 stdlib 中移除
> 
> **弃用周期**:
> 
> - < 1.4: `kotlin.coroutines.experimental` 已被弃用，级别为 `ERROR`
> - &gt;= 1.4: `kotlin.coroutines.experimental` 已从 stdlib 中移除。 在 JVM 上，提供了一个单独的兼容性工件 (参见 issue 中的详细信息)。

### 移除已弃用的 mod 运算符

> **问题**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
> 
> **组件**: kotlin-stdlib
> 
> **不兼容变更类型**: 源码
> 
> **简短摘要**: 自 Kotlin 1.4 以来，numeric types（数值类型）上的 `mod` 运算符已从 stdlib 中移除
> 
> **弃用周期**:
> 
> - < 1.4: `mod` 已被弃用，级别为 `ERROR`
> - &gt;= 1.4: `mod` 已从 stdlib 中移除

### 隐藏 Throwable.addSuppressed 成员并优先使用扩展

> **问题**: [KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
> 
> **组件**: kotlin-stdlib
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 现在，`Throwable.addSuppressed()` 扩展函数优先于 `Throwable.addSuppressed()` 成员函数
> 
> **弃用周期**:
> 
> - < 1.4: 旧的行为 (参见 issue 中的详细信息)
> - &gt;= 1.4: 行为已更改

### capitalize 应该将 digraphs（二合字母）转换为 title case（首字母大写）

> **问题**: [KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
> 
> **组件**: kotlin-stdlib
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: `String.capitalize()` 函数现在以 title case（首字母大写）的形式大写 [Serbo-Croatian Gaj's Latin alphabet](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet) 中的 digraphs（二合字母）（`ǅ` 代替 `Ǆ`）
> 
> **弃用周期**:
> 
> - < 1.4: digraphs（二合字母）以大写形式大写 (`Ǆ`)
> - &gt;= 1.4: digraphs（二合字母）以 title case（首字母大写）形式大写 (`ǅ`)

## 工具

### 带有分隔符的编译器参数必须在 Windows 上用双引号传递

> **问题**: [KT-41309](https://youtrack.jetbrains.com/issue/KT-41309)
> 
> **组件**: CLI
> 
> **不兼容变更类型**: 行为
> 
> **简短摘要**: 在 Windows 上，包含分隔符（空格、`=`、`;`、`,`）的 `kotlinc.bat` 参数现在需要双引号 (`"`)
> 
> **弃用周期**:
> 
> - < 1.4: 所有编译器参数都传递时不带引号
> - &gt;= 1.4: 包含分隔符（空格、`=`、`;`、`,`）的编译器参数需要双引号 (`"`)

### KAPT: 属性的合成 $annotations() 方法的名称已更改

> **问题**: [KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
> 
> **组件**: KAPT
> 
> **不兼容变更类型**: 行为
> 
> **简