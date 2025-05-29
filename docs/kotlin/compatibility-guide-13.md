[//]: # (title: Kotlin 1.3 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的核心原则。前者指出，阻碍语言演进的构造应该被移除；后者则强调，这种移除应提前充分沟通，以使代码迁移尽可能顺畅。

尽管大多数语言变更已通过其他渠道（如更新日志或编译器警告）发布，但本文档汇总了所有这些变更，为从 Kotlin 1.2 迁移到 Kotlin 1.3 提供了完整的参考。

## 基本术语

本文档介绍了多种兼容性：

- *源代码兼容性 (Source)*：源代码不兼容变更会使原本能够正常编译（无错误或警告）的代码无法再编译
- *二进制兼容性 (Binary)*：如果两个二进制产物相互替换不会导致加载或链接错误，则称它们是二进制兼容的
- *行为兼容性 (Behavioral)*：如果同一个程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的

请记住，这些定义仅针对纯 Kotlin 代码。从其他语言（例如 Java）视角来看的 Kotlin 代码兼容性不在本文档的讨论范围之内。

## 不兼容变更

### 构造函数参数对 &lt;clinit&gt; 调用的求值顺序

> **Issue**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行为
>
> **Short summary**: 1.3 中，与类初始化相关的求值顺序已更改
>
> **Deprecation cycle**: 
>
> - <1.3：旧行为（详见 Issue）
> - >= 1.3：行为已更改，可以使用 `-Xnormalize-constructor-calls=disable` 暂时恢复到 1.3 之前的行为。对该标志的支持将在下一个主要版本中移除。

### 注解构造函数参数上缺少 getter-target 注解

> **Issue**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行为
>
> **Short summary**: 在 1.3 中，注解构造函数参数上的 getter-target 注解将正确写入类文件
>
> **Deprecation cycle**: 
>
> - <1.3：注解构造函数参数上的 getter-target 注解未被应用
> - >=1.3：注解构造函数参数上的 getter-target 注解已正确应用并写入生成的代码 

### 类构造函数 @get: 注解中缺失的错误报告

> **Issue**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 在 1.3 中，getter-target 注解中的错误将得到正确报告
>
> **Deprecation cycle**:
>
> - <1.2：getter-target 注解中的编译错误未被报告，导致不正确的代码也能正常编译。
> - 1.2.x：错误仅由工具报告，编译器仍然在没有任何警告的情况下编译此类代码
> - >=1.3：编译器也报告错误，导致错误代码被拒绝

### 访问带有 @NotNull 注解的 Java 类型时的可空性断言

> **Issue**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行为
>
> **Short summary**: 对于带有 not-null 注解的 Java 类型的可空性断言将更积极地生成，导致在此处传递 `null` 的代码更快地失败。
>
> **Deprecation cycle**:
>
> - <1.3：当涉及类型推断时，编译器可能会遗漏此类断言，从而允许在针对二进制文件编译时潜在的 `null` 传播（详见 Issue）。
> - >=1.3：编译器会生成遗漏的断言。这可能导致在此处（错误地）传递 `null` 的代码更快地失败。可以使用 `-XXLanguage:-StrictJavaNullabilityAssertions` 暂时恢复到 1.3 之前的行为。对该标志的支持将在下一个主要版本中移除。

### 枚举成员上不健全的智能转换 (smartcast)

> **Issue**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 一个枚举条目成员的智能转换将正确地仅应用于该枚举条目
>
> **Deprecation cycle**:
>
> - <1.3：一个枚举条目成员的智能转换可能导致对其他枚举条目相同成员的不健全智能转换。
> - >=1.3：智能转换将正确地仅应用于一个枚举条目的成员。`-XXLanguage:-SoundSmartcastForEnumEntries` 将暂时恢复旧行为。对该标志的支持将在下一个主要版本中移除。

### getter 中对 val 幕后字段的重新赋值

> **Issue**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **Components**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 现在禁止在 `val` 属性的 getter 中对幕后字段进行重新赋值
>
> **Deprecation cycle**:
>
> - <1.2：Kotlin 编译器允许在 `val` 的 getter 中修改幕后字段。这不仅违反了 Kotlin 语义，还会生成行为不端的 JVM 字节码，对 `final` 字段进行重新赋值。
> - 1.2.X：在对 `val` 幕后字段重新赋值的代码上报告弃用警告
> - >=1.3：弃用警告升级为错误

### 在 for 循环迭代之前捕获数组

> **Issue**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 如果 for 循环范围内的表达式是循环体中更新的局部变量，则此变更会影响循环执行。这与其他容器（如范围、字符序列和集合）的迭代不一致。
>
> **Deprecation cycle**:
> 
> - <1.2：所描述的代码模式可以正常编译，但局部变量的更新会影响循环执行
> - 1.2.X：如果 for 循环中的范围表达式是数组类型的局部变量并在循环体中被赋值，则报告弃用警告
> - 1.3：在这种情况下更改行为，使其与其他容器保持一致 

### 枚举条目中的嵌套分类器

> **Issue**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，禁止在枚举条目中包含嵌套分类器（类、对象、接口、注解类、枚举类）
>
> **Deprecation cycle**:
>
> - <1.2：枚举条目中的嵌套分类器可以正常编译，但可能在运行时抛出异常
> - 1.2.X：对嵌套分类器报告弃用警告
> - >=1.3：弃用警告升级为错误

### 数据类重写 copy 方法

> **Issue**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **Components**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，禁止数据类重写 `copy()` 方法
>
> **Deprecation cycle**:
>
> - <1.2：重写 `copy()` 方法的数据类可以正常编译但可能在运行时失败/表现出奇怪的行为
> - 1.2.X：对重写 `copy()` 方法的数据类报告弃用警告
> - >=1.3：弃用警告升级为错误

### 继承 Throwable 并捕获外部类泛型参数的内部类

> **Issue**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，不允许内部类继承 `Throwable`
>
> **Deprecation cycle**:
>
> - <1.2：继承 `Throwable` 的内部类可以正常编译。如果此类内部类碰巧捕获了泛型参数，则可能导致在运行时失败的奇怪代码模式。
> - 1.2.X：对继承 `Throwable` 的内部类报告弃用警告
> - >=1.3：弃用警告升级为错误

### 涉及伴生对象的复杂类层次结构的可见性规则

> **Issues**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，对于涉及伴生对象和嵌套分类器的复杂类层次结构，按短名称进行可见性判断的规则变得更加严格。   
>
> **Deprecation cycle**:
>
> - <1.2：旧的可见性规则（详见 Issue）
> - 1.2.X：对将不再可访问的短名称报告弃用警告。工具建议通过添加全限定名进行自动化迁移。  
> - >=1.3：弃用警告升级为错误。有问题代码应添加全限定符或显式导入。

### 非常量可变参数 (vararg) 注解参数

> **Issue**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，禁止将非常量值设置为可变参数 (vararg) 注解参数   
>
> **Deprecation cycle**:
>
> - <1.2：编译器允许为可变参数 (vararg) 注解参数传递非常量值，但实际上在字节码生成期间会丢弃该值，导致非显而易见的行为
> - 1.2.X：对此类代码模式报告弃用警告
> - >=1.3：弃用警告升级为错误

### 局部注解类

> **Issue**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，不再支持局部注解类
>
> **Deprecation cycle**:
>
> - <1.2：编译器可以正常编译局部注解类
> - 1.2.X：对局部注解类报告弃用警告
> - >=1.3：弃用警告升级为错误

### 局部委托属性上的智能转换 (smartcast)

> **Issue**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，不允许在局部委托属性上进行智能转换
>
> **Deprecation cycle**:
>
> - <1.2：编译器允许对局部委托属性进行智能转换，这可能导致在委托行为不端时出现不健全的智能转换
> - 1.2.X：局部委托属性上的智能转换被报告为已弃用（编译器发出警告）
> - >=1.3：弃用警告升级为错误

### mod 运算符约定

> **Issues**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，禁止声明 `mod` 运算符，以及解析为此类声明的调用 
>
> **Deprecation cycle**:
>
> - 1.1.X, 1.2.X：对 `operator mod` 的声明以及解析到它的调用报告警告
> - 1.3.X：将警告升级为错误，但仍然允许解析到 `operator mod` 声明
> - 1.4.X：不再解析对 `operator mod` 的调用

### 以命名形式将单个元素传递给可变参数 (vararg)

> **Issues**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589)。另请参阅 [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 在 Kotlin 1.3 中，将单个元素赋值给可变参数 (vararg) 已弃用，应替换为连续的展开 (spread) 和数组构造。    
>
> **Deprecation cycle**:
>
> - <1.2：以命名形式将一个值元素赋值给可变参数 (vararg) 可以正常编译，并被视为将单个元素赋值给数组，导致在将数组赋值给可变参数时出现非显而易见的行为
> - 1.2.X：对此类赋值报告弃用警告，建议用户切换到连续的展开 (spread) 和数组构造。
> - 1.3.X：警告升级为错误
> - >= 1.4：更改将单个元素赋值给可变参数的语义，使数组的赋值等同于数组展开的赋值 

### 目标为 EXPRESSION 的注解的保留策略

> **Issue**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，目标为 `EXPRESSION` 的注解只允许 `SOURCE` 保留策略
>
> **Deprecation cycle**:
>
> - <1.2：允许目标为 `EXPRESSION` 且保留策略非 `SOURCE` 的注解，但在使用点被静默忽略
> - 1.2.X：对此类注解的声明报告弃用警告 
> - >=1.3：警告升级为错误

### 目标为 PARAMETER 的注解不应适用于参数的类型

> **Issue**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **Component**: 核心语言
>
> **Incompatible change type**: 源代码
>
> **Short summary**: 自 Kotlin 1.3 起，当目标为 `PARAMETER` 的注解应用于参数类型时，将正确报告关于错误注解目标的错误 
>
> **Deprecation cycle**:
>
> - <1.2：上述代码模式可以正常编译；注解被静默忽略，并且不在字节码中
> - 1.2.X：对此类用法报告弃用警告
> - >=1.3：警告升级为错误

### 当索引越界时，Array.copyOfRange 抛出异常而不是扩大返回数组

> **Issue**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 行为
>
> **Short summary**: 自 Kotlin 1.3 起，确保 `Array.copyOfRange` 的 `toIndex` 参数（表示要复制范围的独占结束索引）不大于数组大小，如果超出则抛出 `IllegalArgumentException`。 
>
> **Deprecation cycle**:
>
> - <1.3：如果 `Array.copyOfRange` 调用中的 `toIndex` 大于数组大小，则范围中缺失的元素将填充 `null`，这违反了 Kotlin 类型系统的健全性。 
> - >=1.3：检查 `toIndex` 是否在数组界限内，如果不是则抛出异常

### 步长为 Int.MIN_VALUE 和 Long.MIN_VALUE 的整型和长整型序列被禁止实例化

> **Issue**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 行为
>
> **Short summary**: 自 Kotlin 1.3 起，禁止整型序列的步长值为其整型类型（`Long` 或 `Int`）的最小负值，因此调用 `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` 将抛出 `IllegalArgumentException`。 
>
> **Deprecation cycle**:
>
> - <1.3：可以创建步长为 `Int.MIN_VALUE` 的 `IntProgression`，它会生成两个值 `[0, -2147483648]`，这种行为不明显 
> - >=1.3：如果步长是其整型类型的最小负值，则抛出 `IllegalArgumentException`

### 检查超长序列操作中的索引溢出

> **Issue**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 行为
>
> **Short summary**: 自 Kotlin 1.3 起，确保 `index`、`count` 和类似方法在处理长序列时不会溢出。受影响方法的完整列表请参见 Issue。 
>
> **Deprecation cycle**:
>
> - <1.3：在超长序列上调用此类方法可能由于整型溢出而产生负结果 
> - >=1.3：在此类方法中检测溢出并立即抛出异常

### 统一跨平台空匹配正则表达式的 split 结果

> **Issue**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 行为
>
> **Short summary**: 自 Kotlin 1.3 起，统一所有平台上 `split` 方法根据空匹配正则表达式的行为 
>
> **Deprecation cycle**:
>
> - <1.3：描述的调用在 JS、JRE 6、JRE 7 与 JRE 8+ 之间比较时行为不同
> - >=1.3：统一跨平台的行为

### 编译器发行版中弃用的产物已停用

> **Issue**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **Component**: 其他
>
> **Incompatible change type**: 二进制
>
> **Short summary**: Kotlin 1.3 停止支持以下已弃用的二进制产物：
> - `kotlin-runtime`：请使用 `kotlin-stdlib` 代替
> - `kotlin-stdlib-jre7/8`：请使用 `kotlin-stdlib-jdk7/8` 代替
> - 编译器发行版中的 `kotlin-jslib`：请使用 `kotlin-stdlib-js` 代替
>
> **Deprecation cycle**:
>
> - 1.2.X：这些产物被标记为已弃用，编译器在使用这些产物时报告警告
> - >=1.3：这些产物已停用

### 标准库 (stdlib) 中的注解

> **Issue**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 二进制
>
> **Short summary**: Kotlin 1.3 从标准库 (stdlib) 中移除了 `org.jetbrains.annotations` 包下的注解，并将它们移至编译器附带的独立产物中：`annotations-13.0.jar` 和 `mutability-annotations-compat.jar`。
>
> **Deprecation cycle**:
>
> - <1.3：注解随标准库产物一同发布
> - >=1.3：注解在独立的产物中发布