[//]: # (title: Kotlin 1.4.x 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_和_[舒适的更新](kotlin-evolution-principles.md)_是 Kotlin 语言设计的基本原则。前者指出应当移除阻碍语言演进的构造，后者指出这种移除应当事先进行充分沟通，以使代码迁移尽可能平滑。

虽然大多数语言变更已经通过其他渠道（如更新日志或编译器警告）发布，但本文档对这些变更进行了汇总，为从 Kotlin 1.3 迁移到 Kotlin 1.4 提供完整的参考。

## 基本术语

在本文档中，我们引入了几种兼容性：

- _源码 (source)_：源码不兼容的变更会导致原本可以正常编译（没有错误或警告）的代码无法再通过编译。
- _二进制 (binary)_：如果交换两个二进制构件不会导致加载或链接错误，则称它们为二进制兼容。
- _行为 (behavioral)_：如果同一程序在应用变更前后的表现不同，则称该变更为行为不兼容。

请记住，这些定义仅针对纯 Kotlin。从其他语言（例如从 Java）的角度来看，Kotlin 代码的兼容性不在本文档的讨论范围内。

## 语言与标准库 (stdlib)

### infix 运算符与 ConcurrentHashMap 的异常行为

> **问题**：[KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：Kotlin 1.4 将禁止来自 Java 编写的 `java.util.Map` 实现类的自动 `contains` 运算符。
> 
> **弃用周期**：
> 
> - < 1.4：在调用点为存在问题的运算符引入警告。
> - &gt;= 1.4：将该警告提升为错误，
>  可以使用 `-XXLanguage:-ProhibitConcurrentHashMapContains` 暂时恢复到 1.4 之前的行为。

### 禁止在 public inline 成员内部访问 protected 成员

> **问题**：[KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：Kotlin 1.4 将禁止从 public 内联成员访问 protected 成员。
> 
> **弃用周期**：
> 
> - < 1.4：在调用点为有问题的情况引入警告。
> - 1.4：将该警告提升为错误，
>  可以使用 `-XXLanguage:-ProhibitProtectedCallFromInline` 暂时恢复到 1.4 之前的行为。

### 带有隐式接收者的调用上的契约 (contract)

> **问题**：[KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：在 1.4 中，来自契约的智能转换将可用于带有隐式接收者的调用。
> 
> **弃用周期**： 
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
>  可以使用 `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 暂时恢复到 1.4 之前的行为。

### 浮点数比较的行为不一致

> **问题**：[KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 Kotlin 1.4 起，Kotlin 编译器将使用 IEEE 754 标准来比较浮点数。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
>  可以使用 `-XXLanguage:-ProperIeee754Comparisons` 暂时恢复到 1.4 之前的行为。

### 泛型 Lambda 中最后一个表达式没有智能转换

> **问题**：[KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 1.4 起，lambda表达式中最后一个表达式的智能转换将被正确应用。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 不再依赖 lambda 实参的顺序来将结果强转为 Unit

> **问题**：[KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，lambda 实参将独立解析，不再隐式强转为 `Unit`。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 原始类型与整数文字类型之间的错误公共超类型导致代码不健壮

> **问题**：[KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，原始 `Comparable` 类型与数字文字类型之间的公共超类型将更加具体。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 多个相同的类型变量被实例化为不同类型导致类型安全问题

> **问题**：[KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，Kotlin 编译器将禁止将相同的类型变量实例化为不同的类型。   
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 相交类型子类型化不正确导致的类型安全问题

> **问题**：[KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：在 Kotlin 1.4 中，相交类型的子类型化将被优化以更正确地工作。    
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### Lambda 内部空的 when 表达式没有类型不匹配错误

> **问题**：[KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，如果空的 `when` 表达式被用作 lambda表达式中的最后一个表达式，则会出现类型不匹配错误。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 在可能返回值之一包含数字文字且有提前返回的 Lambda 中，推断返回类型为 Any

> **问题**：[KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，在存在提前返回的情况下，从 lambda 返回的整数类型将更加具体。  
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 递归类型星投影的正确定位

> **问题**：[KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，由于递归类型的定位将更正确地工作，更多的候选者将变得适用。 
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 非适当类型与灵活类型之间的公共超类型计算导致错误结果

> **问题**：[KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 Kotlin 1.4 起，灵活类型之间的公共超类型将更加具体，以防止运行时错误。 
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 对可空类型实参缺乏捕获转换导致的类型安全问题

> **问题**：[KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，捕获类型与可空类型之间的子类型化将更加正确，以防止运行时错误。 
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 在未检查的转换后保留协变类型的相交类型
 
> **问题**：[KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，协变类型的未检查转换会为智能转换生成相交类型，而不是未检查转换本身的类型。 
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 由于使用 this 表达式导致类型变量从构建器推断中泄露
 
> **问题**：[KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，如果在 `sequence {}` 等构建器函数内部没有其他适当的约束，则禁止使用 `this`。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 带有可空类型实参的逆变类型的重载解析错误
 
> **问题**：[KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，如果一个接收逆变类型实参的函数的两个重载仅在类型的为 null 性上不同（如 `In<T>` 和 `In<T?>`），则可空类型被认为更加具体。 
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 具有非嵌套递归约束的构建器推断
 
> **问题**：[KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，像 `sequence {}` 这样类型取决于所传 lambda 内部递归约束的构建器函数将导致编译器错误。 
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 过早的类型变量固定导致约束系统冲突
 
> **问题**：[KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，类型推断在某些情况下不再那么急于固定，从而允许找到非冲突的约束系统。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
> `-XXLanguage:-NewInference` 可用于暂时恢复到 1.4 之前的行为。请注意，此标志还会禁用多项新语言功能。

### 禁止在 open 函数上使用 tailrec 修饰符

> **问题**：[KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
> 
> **组件**：核心语言
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，函数不能同时拥有 `open` 和 `tailrec` 修饰符。 
> 
> **弃用周期**：
> 
> - < 1.4：对同时拥有 `open` 和 `tailrec` 修饰符的函数报告警告（在渐进模式下为错误）。
> - &gt;= 1.4：将该警告提升为错误。

### 伴生对象的 INSTANCE 字段比伴生对象类本身具有更高的可见性

> **问题**：[KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，如果伴生对象是私有的，那么其字段 `INSTANCE` 也将是私有的。
> 
> **弃用周期**：
> 
> - < 1.4：编译器生成带有弃用标志的 `INSTANCE` 对象
> - &gt;= 1.4：伴生对象 `INSTANCE` 字段具有正确的可见性

### 在 return 之前插入的外部 finally 块未从没有 finally 的内部 try 块的 catch 区间中排除

> **问题**：[KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 Kotlin 1.4 起，嵌套 `try/catch` 块的 catch 区间将被正确计算。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
>  可以使用 `-XXLanguage:-ProperFinally` 暂时恢复到 1.4 之前的行为。

### 在协变和泛型特化重写中，在返回值类型位置使用内联类的装箱版本

> **问题**：[KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 Kotlin 1.4 起，使用协变和泛型特化重写的函数将返回内联类的装箱值。   
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改 

### 在对 Kotlin 接口使用委托时，不要在 JVM 字节码中声明受检异常

> **问题**：[KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：Kotlin 1.4 在对 Kotlin 接口进行接口委托期间不会生成受检异常。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
>  可以使用 `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 暂时恢复到 1.4 之前的行为。

### 更改了对具有单个 vararg 形参的方法的签名多态调用的行为，以避免将实参包装到另一个数组中

> **问题**：[KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：Kotlin 1.4 在进行签名多态调用时不会将实参包装到另一个数组中。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改

### 当 KClass 用作泛型参数时，注解中出现错误的泛型签名

> **问题**：[KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：当 KClass 用作泛型参数时，Kotlin 1.4 将修复注解中不正确的类型映射。 
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改

### 禁止在签名多态调用中使用扩展运算符

> **问题**：[KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：Kotlin 1.4 将禁止在签名多态调用中使用扩展运算符 (*)。 
> 
> **弃用周期**：
> 
> - < 1.4：在使用扩展运算符的签名多态调用中报告警告。
> - &gt;= 1.5：将该警告提升为错误，
> `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 可用于暂时恢复到 1.4 之前的行为。

### 更改尾递归优化函数的默认值初始化顺序

> **问题**：[KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 Kotlin 1.4 起，尾递归函数的初始化顺序将与常规函数相同。 
> 
> **弃用周期**：
> 
> - < 1.4：在声明点为存在问题的函数报告警告。
> - &gt;= 1.4：行为已更改，
>  可以使用 `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 暂时恢复到 1.4 之前的行为。

### 不要为非 const val 生成 ConstantValue 属性

> **问题**：[KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 Kotlin 1.4 起，编译器将不会为非 `const` `val` 生成 `ConstantValue` 属性。 
> 
> **弃用周期**：
> 
> - < 1.4：通过 IntelliJ IDEA 检查报告警告。
> - &gt;= 1.4：行为已更改，
>  可以使用 `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 暂时恢复到 1.4 之前的行为。

### 在 open 方法上为 @JvmOverloads 生成的重载应该是 final

> **问题**：[KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：带有 `@JvmOverloads` 的函数的重载将被生成为 `final`。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改，
>  可以使用 `-XXLanguage:-GenerateJvmOverloadsAsFinal` 暂时恢复到 1.4 之前的行为。

### 返回 kotlin.Result 的 Lambda 现在返回装箱值而非拆箱值

> **问题**：[KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 Kotlin 1.4 起，返回 `kotlin.Result` 类型值的 lambda表达式将返回装箱值而不是拆箱值。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改

### 统一来自 null 检查的异常

> **问题**：[KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
> 
> **组件**：Kotlin/JVM
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：从 Kotlin 1.4 开始，所有运行时 null 检查都将抛出 `java.lang.NullPointerException`。
> 
> **弃用周期**：
> 
> - < 1.4：运行时 null 检查会抛出不同的异常，如 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`。
> - &gt;= 1.4：所有运行时 null 检查都抛出 `java.lang.NullPointerException`。
>   可以使用 `-Xno-unified-null-checks` 暂时恢复到 1.4 之前的行为。

### 数组/列表操作 contains、indexOf、lastIndexOf 中的浮点值比较：IEEE 754 还是总序

> **问题**：[KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
> 
> **组件**：kotlin-stdlib (JVM)
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：从 `Double/FloatArray.asList()` 返回的 `List` 实现将实现 `contains`、`indexOf` 和 `lastIndexOf`，从而使用总序相等性。
> 
> **弃用周期**： 
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改

### 逐步将集合 min 和 max 函数的返回值类型更改为不可空

> **问题**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
> 
> **组件**：kotlin-stdlib (JVM)
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：集合 `min` 和 `max` 函数的返回值类型将在 1.6 中更改为不可空。
> 
> **弃用周期**：
> 
> - 1.4：引入 `...OrNull` 函数作为同义词，并弃用受影响的 API（详见问题描述）。
> - 1.5.x：将受影响 API 的弃用级别提升为错误。
> - &gt;=1.6：重新引入受影响的 API，但使用不可空返回值类型。

### 弃用 appendln 以支持 appendLine

> **问题**：[KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
> 
> **组件**：kotlin-stdlib (JVM)
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：`StringBuilder.appendln()` 将被弃用，取而代之的是 `StringBuilder.appendLine()`。
> 
> **弃用周期**：
> 
> - 1.4：引入 `appendLine` 函数替代 `appendln` 并弃用 `appendln`。
> - &gt;=1.5：将弃用级别提升为错误。

### 弃用将浮点类型转换为 Short 和 Byte 的操作

> **问题**：[KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
> 
> **组件**：kotlin-stdlib (JVM)
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，将浮点类型转换为 `Short` 和 `Byte` 的操作将被弃用。 
> 
> **弃用周期**：
> 
> - 1.4：弃用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 并提出替代方案。
> - &gt;=1.5：将弃用级别提升为错误。

### Regex.findAll 在无效的 startIndex 上快速失败

> **问题**：[KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
> 
> **组件**：kotlin-stdlib
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：自 Kotlin 1.4 起，`findAll` 将进行优化，在进入 `findAll` 的瞬间检查 `startIndex` 是否在输入字符序列的有效位置索引范围内，如果不在范围内则抛出 `IndexOutOfBoundsException`。 
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改

### 移除已弃用的 kotlin.coroutines.experimental

> **问题**：[KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
> 
> **组件**：kotlin-stdlib
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，已弃用的 `kotlin.coroutines.experimental` API 从 stdlib 中移除。
> 
> **弃用周期**：
> 
> - < 1.4：`kotlin.coroutines.experimental` 以 `ERROR` 级别被弃用。
> - &gt;= 1.4：`kotlin.coroutines.experimental` 从 stdlib 中移除。在 JVM 上提供了一个单独的兼容性构件（详见问题描述）。

### 移除已弃用的 mod 运算符

> **问题**：[KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
> 
> **组件**：kotlin-stdlib
> 
> **不兼容变更类型**：源码
> 
> **简要总结**：自 Kotlin 1.4 起，数值类型上的 `mod` 运算符从 stdlib 中移除。
> 
> **弃用周期**：
> 
> - < 1.4：`mod` 以 `ERROR` 级别被弃用。
> - &gt;= 1.4：`mod` 从 stdlib 中移除。

### 隐藏 Throwable.addSuppressed 成员并优先使用扩展函数

> **问题**：[KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
> 
> **组件**：kotlin-stdlib
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：现在优先选择 `Throwable.addSuppressed()` 扩展函数，而不是 `Throwable.addSuppressed()` 成员函数。
> 
> **弃用周期**：
> 
> - < 1.4：旧行为（详见问题描述）。
> - &gt;= 1.4：行为已更改

### capitalize 应当将二合字母转换为首字母大写 (title case)

> **问题**：[KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
> 
> **组件**：kotlin-stdlib
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：`String.capitalize()` 函数现在将 [塞尔维亚-克罗地亚语盖伊拉丁字母](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet) 中的二合字母转换为首字母大写 (`ǅ` 而非 `Ǆ`)。
> 
> **弃用周期**：
> 
> - < 1.4：二合字母被转换为全大写 (`Ǆ`)。
> - &gt;= 1.4：二合字母被转换为首字母大写 (`ǅ`)。

## 工具

### 带有分隔符字符的编译器参数在 Windows 上必须用双引号括起来

> **问题**：[KT-41309](https://youtrack.jetbrains.com/issue/KT-41309)
> 
> **组件**：命令行
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：在 Windows 上，包含分隔符（空格、`=`、`;`、`,`）的 `kotlinc.bat` 参数现在需要使用双引号 (`"`)。
> 
> **弃用周期**：
> 
> - < 1.4：所有编译器参数都在没有引号的情况下传递。
> - &gt;= 1.4：包含分隔符（空格、`=`、`;`、`,`）的编译器参数需要双引号 (`"`)。

### KAPT：属性的合成 $annotations() 方法名称已更改

> **问题**：[KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
> 
> **组件**：KAPT
> 
> **不兼容变更类型**：行为
> 
> **简要总结**：KAPT 为属性生成的合成 `$annotations()` 方法名称在 1.4 中已更改。
> 
> **弃用周期**：
> 
> - < 1.4：属性的合成 `$annotations()` 方法名称遵循模板 `<propertyName>@annotations()`。
> - &gt;= 1.4：属性的合成 `$annotations()` 方法名称包含 `get` 前缀：`get<PropertyName>@annotations()`。