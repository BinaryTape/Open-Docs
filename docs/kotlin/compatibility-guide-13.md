---
title: "Kotlin 1.3 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的基本原则之一。前者指出，应该移除那些阻碍语言发展的结构，而后者指出，应该事先充分沟通这些移除，以使代码迁移尽可能顺利。

虽然大多数语言变更已经通过其他渠道宣布，例如更新日志或编译器警告，但本文档总结了所有这些变更，为从 Kotlin 1.2 迁移到 Kotlin 1.3 提供了完整的参考。

## 基本术语

在本文档中，我们引入了几种兼容性：

- *源码 (Source)*：源码不兼容的变更会导致原本可以正常编译（没有错误或警告）的代码无法再编译
- *二进制 (Binary)*：如果交换两个二进制构件不会导致加载或链接错误，则称它们是二进制兼容的
- *行为 (Behavioral)*：如果同一个程序在应用更改前后表现出不同的行为，则称该更改是行为不兼容的

请记住，这些定义仅针对纯 Kotlin 而言。Kotlin 代码与其他语言（例如 Java）的兼容性不在本文档的范围内。

## 不兼容的变更

### 构造函数参数关于 &lt;clinit&gt; 调用的求值顺序

> **问题**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为 (behavioral)
>
> **简要总结**: 1.3 中类初始化的求值顺序已更改
>
> **弃用周期**: 
>
> - &lt;1.3: 旧行为（请参阅 Issue 中的详细信息）
> - &gt;= 1.3: 行为已更改，
>   `-Xnormalize-constructor-calls=disable` 可用于暂时恢复到 1.3 之前的行为。下一个主要版本将移除对此标志的支持。

### 注解构造函数参数上缺少 getter 目标注解

> **问题**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为 (behavioral)
>
> **简要总结**: 1.3 中，注解构造函数参数上的 getter 目标注解将被正确写入 class 文件
>
> **弃用周期**: 
>
> - &lt;1.3: 注解构造函数参数上的 getter 目标注解未应用
> - &gt;=1.3: 注解构造函数参数上的 getter 目标注解被正确应用并写入生成的代码

### 类构造函数的 @get: 注解中缺少错误

> **问题**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 1.3 中，getter 目标注解中的错误将被正确报告
>
> **弃用周期**:
>
> - &lt;1.2: getter 目标注解中的编译错误未报告，导致不正确的代码可以正常编译。
> - 1.2.x: 仅由工具报告错误，编译器仍然在没有任何警告的情况下编译此类代码
> - &gt;=1.3: 编译器也报告错误，导致错误的代码被拒绝

### 对使用 @NotNull 注解的 Java 类型进行空值断言

> **问题**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为 (Behavioral)
>
> **简要总结**: 将为使用 not-null 注解的 Java 类型更积极地生成空值断言，从而导致在此处传递 `null` 的代码更快地失败。
>
> **弃用周期**:
>
> - &lt;1.3: 当涉及类型推断时，编译器可能会错过此类断言，从而允许在针对二进制文件进行编译期间传播潜在的 `null`（有关详细信息，请参见 Issue）。
> - &gt;=1.3: 编译器会生成错过的断言。这可能会导致（错误地）在此处传递 `null` 的代码更快地失败。
>   `-XXLanguage:-StrictJavaNullabilityAssertions` 可用于暂时恢复到 1.3 之前的行为。下一个主要版本将移除对此标志的支持。

### 枚举成员上的不健全的智能转换 (smartcast)

> **问题**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 对一个枚举条目的成员进行的智能转换将正确地仅应用于该枚举条目
>
> **弃用周期**:
>
> - &lt;1.3: 对一个枚举条目的成员进行的智能转换可能导致对其他枚举条目的相同成员进行不健全的智能转换。
> - &gt;=1.3: 智能转换将仅正确地应用于一个枚举条目的成员。
>   `-XXLanguage:-SoundSmartcastForEnumEntries` 将暂时恢复旧的行为。下一个主要版本将移除对此标志的支持。

### getter 中 val 后端字段的重新赋值

> **问题**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 现在禁止在其 getter 中重新赋值 `val` 属性的后端字段
>
> **弃用周期**:
>
> - &lt;1.2: Kotlin 编译器允许修改 `val` 的 getter 中的后端字段。这不仅违反了 Kotlin 的语义，而且还会生成行为不端的 JVM 字节码，该字节码会重新赋值 `final` 字段。
> - 1.2.X: 在重新赋值 `val` 的后端字段的代码上报告弃用警告
> - &gt;=1.3: 弃用警告提升为错误

### 在 for 循环迭代之前捕获数组

> **问题**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 如果 for 循环范围内的表达式是在循环体中更新的局部变量，则此更改会影响循环执行。这与其他容器（例如范围、字符序列和集合）的迭代不一致。
>
> **弃用周期**:
> 
> - &lt;1.2: 描述的代码模式编译正常，但对局部变量的更新会影响循环执行
> - 1.2.X: 如果 for 循环中的范围表达式是数组类型的局部变量，并且在循环体中赋值，则报告弃用警告
> - 1.3: 在这种情况下更改行为，使其与其他容器保持一致

### 枚举条目中的嵌套分类器

> **问题**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，禁止在枚举条目中使用嵌套分类器（类、对象、接口、注解类、枚举类）
>
> **弃用周期**:
>
> - &lt;1.2: 枚举条目中的嵌套分类器编译正常，但在运行时可能会因异常而失败
> - 1.2.X: 在嵌套分类器上报告弃用警告
> - &gt;=1.3: 弃用警告提升为错误

### 数据类重写 copy

> **问题**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，禁止数据类重写 `copy()`
>
> **弃用周期**:
>
> - &lt;1.2: 重写 `copy()` 的数据类编译正常，但在运行时可能会失败/暴露奇怪的行为
> - 1.2.X: 在重写 `copy()` 的数据类上报告弃用警告
> - &gt;=1.3: 弃用警告提升为错误

### 继承 Throwable 并从外部类捕获泛型参数的内部类

> **问题**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，不允许内部类继承 `Throwable`
>
> **弃用周期**:
>
> - &lt;1.2: 继承 `Throwable` 的内部类编译正常。如果此类内部类恰好捕获泛型参数，则可能导致在运行时失败的奇怪代码模式。
> - 1.2.X: 在继承 `Throwable` 的内部类上报告弃用警告
> - &gt;=1.3: 弃用警告提升为错误

### 关于具有伴生对象的复杂类层次结构的可见性规则

> **问题**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，对于涉及伴生对象和嵌套分类器的复杂类层次结构，通过短名称的可见性规则更加严格。
>
> **弃用周期**:
>
> - &lt;1.2: 旧的可见性规则（有关详细信息，请参见 Issue）
> - 1.2.X: 在将不再可访问的短名称上报告弃用警告。工具建议通过添加完整名称来自动迁移。
> - &gt;=1.3: 弃用警告提升为错误。违规代码应添加完整的限定符或显式导入

### 非恒定的 vararg 注解参数

> **问题**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，禁止将非恒定值设置为 vararg 注解参数
>
> **弃用周期**:
>
> - &lt;1.2: 编译器允许为 vararg 注解参数传递非恒定值，但实际上会在字节码生成期间删除该值，从而导致不明显的行为
> - 1.2.X: 在此类代码模式上报告弃用警告
> - &gt;=1.3: 弃用警告提升为错误

### 局部注解类

> **问题**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，不支持局部注解类
>
> **弃用周期**:
>
> - &lt;1.2: 编译器可以正常编译局部注解类
> - 1.2.X: 在局部注解类上报告弃用警告
> - &gt;=1.3: 弃用警告提升为错误

### 局部委托属性上的智能转换 (smartcast)

> **问题**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，不允许对局部委托属性进行智能转换
>
> **弃用周期**:
>
> - &lt;1.2: 编译器允许对局部委托属性进行智能转换，如果在行为不端的委托的情况下，可能会导致不健全的智能转换
> - 1.2.X: 局部委托属性上的智能转换被报告为已弃用（编译器发出警告）
> - &gt;=1.3: 弃用警告提升为错误

### mod 运算符约定

> **问题**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，禁止声明 `mod` 运算符，以及解析为此类声明的调用
>
> **弃用周期**:
>
> - 1.1.X, 1.2.X: 报告关于 `operator mod` 声明的警告，以及解析到它的调用
> - 1.3.X: 将警告提升为错误，但仍然允许解析为 `operator mod` 声明
> - 1.4.X: 不再解析对 `operator mod` 的调用

### 以命名形式将单个元素传递给 vararg

> **问题**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589). 另请参见 [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 在 Kotlin 1.3 中，将单个元素赋值给 vararg 已被弃用，应替换为连续的 spread 和数组构造。
>
> **弃用周期**:
>
> - &lt;1.2: 以命名形式将一个值元素赋值给 vararg 编译正常，并被视为将*单个*元素赋值给数组，当将数组赋值给 vararg 时导致不明显的行为
> - 1.2.X: 在此类赋值上报告弃用警告，建议用户切换到连续的 spread 和数组构造。
> - 1.3.X: 警告提升为错误
> - &gt;= 1.4: 更改将单个元素赋值给 vararg 的语义，使数组的赋值等效于数组的 spread 的赋值

### 具有目标 EXPRESSION 的注解的保留策略 (Retention)

> **问题**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，对于目标为 `EXPRESSION` 的注解，仅允许 `SOURCE` 保留策略
>
> **弃用周期**:
>
> - &lt;1.2: 允许使用目标 `EXPRESSION` 且保留策略不是 `SOURCE` 的注解，但在使用位置会被静默忽略
> - 1.2.X: 在此类注解的声明上报告弃用警告
> - &gt;=1.3: 警告提升为错误

### 目标为 PARAMETER 的注解不应适用于参数的类型

> **问题**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **组件**: 核心语言 (Core language)
>
> **不兼容变更类型**: 源码 (Source)
>
> **简要总结**: 自 Kotlin 1.3 起，当目标为 `PARAMETER` 的注解应用于参数的类型时，将正确报告关于错误注解目标的错误
>
> **弃用周期**:
>
> - &lt;1.2: 上述代码模式编译正常；注解会被静默忽略且不存在于字节码中
> - 1.2.X: 在此类用法上报告弃用警告
> - &gt;=1.3: 警告提升为错误

### 当索引超出范围时，Array.copyOfRange 抛出异常，而不是扩大返回的数组

> **问题**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 行为 (Behavioral)
>
> **简要总结**: 自 Kotlin 1.3 起，确保 `Array.copyOfRange` 的 `toIndex` 参数（表示要复制的范围的独占结束）不大于数组大小，如果大于则抛出 `IllegalArgumentException`。
>
> **弃用周期**:
>
> - &lt;1.3: 如果 `Array.copyOfRange` 调用中的 `toIndex` 大于数组大小，则范围中缺少的元素将填充 `null`，从而违反 Kotlin 类型系统的健全性。
> - &gt;=1.3: 检查 `toIndex` 是否在数组边界内，如果不在则抛出异常

### 步长为 Int.MIN_VALUE 和 Long.MIN_VALUE 的 int 和 long 的 progressions (数列) 被禁止，并且不允许实例化

> **问题**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 行为 (Behavioral)
>
> **简要总结**: 自 Kotlin 1.3 起，禁止整数数列的步长值为其整数类型的最小负值（`Long` 或 `Int`），因此调用 `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` 将抛出 `IllegalArgumentException`
>
> **弃用周期**:
>
> - &lt;1.3: 可以使用 `Int.MIN_VALUE` 步长创建一个 `IntProgression`，它产生两个值 `[0, -2147483648]`，这是一种不明显的行为
> - &gt;=1.3: 如果步长是其整数类型的最小负值，则抛出 `IllegalArgumentException`

### 检查非常长的序列上操作中的索引溢出

> **问题**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 行为 (Behavioral)
>
> **简要总结**: 自 Kotlin 1.3 起，确保 `index`、`count` 和类似的方法不会因长序列而溢出。有关受影响方法的完整列表，请参见 Issue。
>
> **弃用周期**:
>
> - &lt;1.3: 在非常长的序列上调用此类方法可能会由于整数溢出而产生负结果
> - &gt;=1.3: 在此类方法中检测溢出并立即抛出异常

### 统一跨平台的空匹配正则表达式的分裂 (split) 结果

> **问题**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 行为 (Behavioral)
>
> **简要总结**: 自 Kotlin 1.3 起，统一跨所有平台的空匹配正则表达式的 `split` 方法的行为
>
> **弃用周期**:
>
> - &lt;1.3: 当比较 JS、JRE 6、JRE 7 与 JRE 8+ 时，描述的调用的行为是不同的
> - &gt;=1.3: 统一跨平台的行为

### 编译器发行版中已停止使用的已弃用构件

> **问题**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **组件**: other
>
> **不兼容变更类型**: 二进制 (Binary)
>
> **简要总结**: Kotlin 1.3 停止使用以下已弃用的二进制构件：
> - `kotlin-runtime`: 请改用 `kotlin-stdlib`
> - `kotlin-stdlib-jre7/8`: 请改用 `kotlin-stdlib-jdk7/8`
> - 编译器发行版中的 `kotlin-jslib`: 请改用 `kotlin-stdlib-js`
>
> **弃用周期**:
>
> - 1.2.X: 这些构件被标记为已弃用，编译器报告了关于使用这些构件的警告
> - &gt;=1.3: 这些构件已停止使用

### stdlib 中的注解

> **问题**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容变更类型**: 二进制 (Binary)
>
> **简要总结**: Kotlin 1.3 从 stdlib 中删除了 `org.jetbrains.annotations` 包中的注解，并将它们移动到与编译器一起提供的单独构件：`annotations-13.0.jar` 和 `mutability-annotations-compat.jar`
>
> **弃用周期**:
>
> - &lt;1.3: 注解与 stdlib 构件一起提供
> - &gt;=1.3: 注解在单独的构件中提供