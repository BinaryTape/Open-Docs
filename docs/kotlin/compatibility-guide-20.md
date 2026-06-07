[//]: # (title: Kotlin 2.0.x 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_和_[舒适更新](kotlin-evolution-principles.md)_是 Kotlin 语言设计的基本原则。前者指出应当移除阻碍语言演进的结构，后者则要求此类移除应当提前进行充分沟通，以使代码迁移尽可能顺畅。

虽然大多数语言变更已通过其他渠道（如更新的变更日志或编译器警告）公布，但本文档为从 Kotlin 1.9 迁移到 Kotlin 2.0 提供了完整的参考。

> Kotlin K2 编译器作为 Kotlin 2.0 的一部分引入。有关新编译器的优势、迁移过程中可能遇到的变更以及如何回滚到之前的编译器的信息，请参阅 [K2 编译器迁移指南](k2-compiler-migration-guide.md)。
>
{style="note"}

## 基本术语

在本文档中，我们介绍了以下几种兼容性：

- _源码 (source)_：源码不兼容的变更会导致以前可以正常编译（没有错误或警告）的代码无法再编译。
- _二进制 (binary)_：如果交换两个二进制构件不会导致加载或链接错误，则称它们是二进制兼容的。
- _行为 (behavioral)_：如果在应用变更前后，同一个程序表现出不同的行为，则称该变更为行为不兼容。

请记住，这些定义仅针对纯 Kotlin 而言。从其他语言（例如 Java）的角度来看 Kotlin 代码的兼容性不在本文档的讨论范围之内。

## 语言

<!--
### 标题

> **问题**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**:
>
> **弃用周期**:
>
> - 1.6.20: 报告警告
> - 1.8.0: 将警告提升为错误
-->

### 弃用在投影接收器上使用合成 setter

> **问题**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 如果您使用 Java 类的合成 setter 来分配一个与该类的投影类型冲突的类型，则会触发错误。
>
> **弃用周期**:
>
> - 1.8.20: 当合成属性 setter 在逆变位置具有投影参数类型，导致调用站点实参类型不兼容时，报告警告
> - 2.0.0: 将警告提升为错误

### 修正调用在 Java 子类中重载且带有内联类参数的函数时的修饰 (mangling)

> **问题**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 在函数调用中使用正确的修饰行为；要恢复到以前的行为，请使用 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 编译器选项。

### 修正逆变捕获类型的类型近似算法

> **问题**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.8.20: 对有问题的调用报告警告
> - 2.0.0: 将警告提升为错误

### 禁止在属性初始化之前访问属性值

> **问题**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 在受影响的上下文中，如果在初始化之前访问属性，则报告错误

### 当导入的同名类存在歧义时报告错误

> **问题**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 在解析通过星号导入存在于多个软件包中的类名时报告错误

### 默认通过 invokedynamic 和 LambdaMetafactory 生成 Kotlin lambda

> **问题**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；默认使用 `invokedynamic` 和 `LambdaMetafactory` 生成 lambda

### 当需要表达式时禁止仅带有一个分支的 if 条件

> **问题**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 如果 `if` 条件只有一个分支，则报告错误

### 禁止通过传递泛型类型的星投影来违反自上界 (self upper bounds)

> **问题**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 当通过传递泛型类型的星投影违反自上界时报告错误

### 对私有内联函数返回值类型中的匿名类型进行近似

> **问题**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.9.0: 如果推断的返回值类型包含匿名类型，则在私有内联函数上报告警告
> - 2.0.0: 将此类私有内联函数的返回值类型近似为其基类型

### 更改重载解析行为，优先处理局部扩展函数调用，而非局部函数类型属性的 invoke 约定

> **问题**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 新的重载解析行为；函数调用始终优先于 invoke 约定

### 当由于二进制依赖项中基类型的更改而发生继承成员冲突时报告错误

> **问题**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.7.0: 在二进制依赖项的基类型中发生继承成员冲突的声明上报告 `CONFLICTING_INHERITED_MEMBERS_WARNING` 警告
> - 2.0.0: 将警告提升为错误：`CONFLICTING_INHERITED_MEMBERS`

### 忽略不变类型参数上的 @UnsafeVariance 注解

> **问题**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；在报告逆变参数中的类型不匹配错误时，忽略 `@UnsafeVariance` 注解

### 更改对伴生对象成员的调用外引用的类型

> **问题**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.8.20: 对推断为未绑定引用的伴生对象函数引用类型报告警告
> - 2.0.0: 更改行为，使伴生对象函数引用在所有使用上下文中都被推断为绑定引用

### 禁止通过非私有内联函数暴露匿名类型

> **问题**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.3.0: 对从私有内联函数返回的匿名对象自身成员的调用报告警告
> - 2.0.0: 将此类私有内联函数的返回值类型近似为其基类型，并且不再解析对匿名对象成员的调用

### 对 while 循环中断 (break) 后不合理的智能转换报告错误

> **问题**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；可以通过切换到语言版本 1.9 来恢复旧行为

### 当交集类型的变量被赋予一个不是该交集类型子类型的值时报告错误

> **问题**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 当具有交集类型的变量被赋予一个不是该交集类型子类型的值时报告错误

### 当使用 SAM 构造函数构建的接口包含需要选择使用的函数时，要求选择使用 (opt-in)

> **问题**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.7.20: 对通过 SAM 构造函数使用的 `OptIn` 报告警告
> - 2.0.0: 对通过 SAM 构造函数使用的 `OptIn` 将警告提升为错误（如果 `OptIn` 标记严重级别为警告，则继续报告警告）

### 禁止在 typealias 构造函数中违反上界

> **问题**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.8.0: 针对在 typealias 构造函数中违反上界的情况引入警告
> - 2.0.0: 在 K2 编译器中将警告提升为错误

### 使解构变量的真实类型与指定的显式类型保持一致

> **问题**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；解构变量的真实类型现在与指定的显式类型保持一致

### 当调用的构造函数具有需要选择使用的默认值参数类型时，要求选择使用 (opt-in)

> **问题**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.8.20: 在具有需要选择使用的参数类型的构造函数调用上报告警告
> - 2.0.0: 将警告提升为错误（如果 `OptIn` 标记严重级别为警告，则继续报告警告）

### 在同一作用域级别下，同名的属性和枚举项之间报告歧义

> **问题**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.7.20: 当编译器在同一作用域级别解析为属性而非枚举项时报告警告
> - 2.0.0: 当 K2 编译器在同一作用域级别同时遇到同名的属性和枚举项时报告歧义（在旧编译器中保持警告不变）

### 更改限定符解析行为，优先选择伴生属性而非枚举项

> **问题**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的解析行为；伴生属性优先于枚举项

### 像以脱糖形式编写的那样解析 invoke 调用接收器类型和 invoke 函数类型

> **问题**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 独立解析 invoke 调用接收器类型和 invoke 函数类型，就像它们是以脱糖形式编写的一样

### 禁止通过非私有内联函数暴露私有类成员

> **问题**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.9.0: 从内部内联函数调用私有类伴生对象成员时报告 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告
> - 2.0.0: 将此警告提升为 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 错误

### 修正投影泛型类型中绝对非空类型的为 null 性

> **问题**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；投影类型会考虑所有就地的非空类型

### 更改前缀自增的推断类型以匹配 getter 的返回值类型，而非 inc() 运算符的返回值类型

> **问题**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；前缀自增的推断类型更改为匹配 getter 的返回值类型，而非 `inc()` 运算符的返回值类型

### 从基类中声明的泛型内部类继承内部类时强制执行边界检查

> **问题**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 当违反泛型内部基类的类型参数上界时报告错误

### 当预期类型是带有函数类型参数的函数类型时，禁止分配具有 SAM 类型的可调用引用

> **问题**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 当预期类型是带有函数类型参数的函数类型时，对具有 SAM 类型的可调用引用报告编译错误

### 在伴生对象上的注解解析中考虑伴生对象作用域

> **问题**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；现在在伴生对象上的注解解析期间不会忽略伴生对象作用域

### 更改安全调用与约定运算符组合的评估语义

> **问题**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **弃用周期**:
>
> - 1.4.0: 对每个不正确的调用报告警告
> - 2.0.0: 实现新的解析行为

### 要求具有支持字段和自定义 setter 的属性立即初始化

> **问题**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
> 
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **弃用周期**:
>
> - 1.9.20: 针对没有主构造函数的情况引入 `MUST_BE_INITIALIZED` 警告
> - 2.0.0: 将警告提升为错误

### 禁止在 invoke 运算符约定调用中对任意表达式进行 Unit 转换

> **问题**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 当在变量和 invoke 解析上对任意表达式应用 Unit 转换时报告错误；使用 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 编译器选项可以对受影响的表达式保持之前的行为。

### 当通过安全调用访问字段时，禁止向非空 Java 字段分配可空值

> **问题**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 在向非空 Java 字段分配可空值的情况下报告错误

### 重写包含原始类型 (raw-type) 参数的 Java 方法时需要星投影类型

> **问题**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；禁止重写原始类型参数

### 当 V 具有伴生对象时更改 (V)::foo 引用解析

> **问题**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 行为
>
> **弃用周期**:
>
> - 1.6.0: 对当前绑定到伴生对象实例的可调用引用报告警告
> - 2.0.0: 实现新行为；在类型周围添加圆括号不再使其成为对该类型伴生对象实例的引用

### 禁止在有效公开的内联函数中隐式访问非公开 API

> **问题**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.8.20: 当在公开内联函数中隐式访问非公开 API 时报告编译警告
> - 2.0.0: 将警告提升为错误

### 禁止在属性 getter 上使用使用处 get 注解

> **问题**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.9.0: 在 getter 上的使用处 `get` 注解上报告警告（在渐进模式下为错误）
> - 2.0.0: 将警告提升为 `INAPPLICABLE_TARGET_ON_PROPERTY` 错误；使用 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 可恢复为警告

### 防止在构建器推断 lambda 函数中将类型参数隐式推断为上界

> **问题**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.7.20: 当类型实参的类型参数无法推断为声明的上界时，报告警告（或在渐进模式下报告错误）
> - 2.0.0: 将警告提升为错误

### 在公共签名中近似局部类型时保留为 null 性

> **问题**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.8.0: 平台类型通过平台基类型进行近似；当一个声明被推断为本应可空却是非空类型时报告警告，提示显式指定类型以避免 NPE
> - 2.0.0: 可空类型通过可空基类型进行近似

### 为了智能转换的目的，移除对 false && ... 和 false || ... 的特殊处理

> **问题**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 2.0.0: 实现新行为；不对 `false && ...` 和 `false || ...` 进行特殊处理

### 禁止在枚举中使用内联 open 函数

> **问题**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **弃用周期**:
>
> - 1.8.0: 对枚举中的内联 open 函数报告警告
> - 2.0.0: 将警告提升为错误

## 工具

### Gradle 中的可见性变更

> **问题**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 以前，某些旨在用于特定 DSL 上下文的 Kotlin DSL 函数和属性会无意中泄露到其他 DSL 上下文中。我们添加了 `@KotlinGradlePluginDsl` 注解，它防止 Kotlin Gradle 插件 DSL 函数和属性暴露给不打算提供它们的级别。以下级别彼此分离：
> * Kotlin 扩展
> * Kotlin 目标
> * Kotlin 编译
> * Kotlin 编译任务
>
> **弃用周期**:
>
> - 2.0.0: 对于大多数流行的情况，如果您的构建脚本配置不正确，编译器会报告警告并提供有关如何修复它们的建议；否则，编译器会报告错误

### 弃用 kotlinOptions DSL

> **问题**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 通过 `kotlinOptions` DSL 和相关的 `KotlinCompile<KotlinOptions>` 任务接口配置编译器选项的能力已被弃用。
>
> **弃用周期**:
>
> - 2.0.0: 报告警告

### 弃用 KotlinCompilation DSL 中的 compilerOptions

> **问题**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 在 `KotlinCompilation` DSL 中配置 `compilerOptions` 属性的能力已被弃用。
>
> **弃用周期**:
>
> - 2.0.0: 报告警告

### 弃用处理 CInteropProcess 的旧方式

> **问题**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: `CInteropProcess` 任务和 `CInteropSettings` 类现在使用 `definitionFile` 属性，而不是 `defFile` 和 `defFileProperty`。
> 
> 这消除了当 `defFile` 是动态生成时，在 `CInteropProcess` 任务和生成 `defFile` 的任务之间添加额外 `dependsOn` 关系的需要。
> 
> 在 Kotlin/Native 项目中，Gradle 现在会在构建过程后期连接的任务运行后，延迟验证 `definitionFile` 属性的存在。
>
> **弃用周期**:
>
> - 2.0.0: `defFile` 和 `defFileProperty` 参数已被弃用
> - 2.4.0: [对已弃用的 `defFile` 属性报告错误](compatibility-guide-24.md#report-errors-for-obsolete-kotlin-native-gradle-task-apis)

### 移除 kotlin.useK2 Gradle 属性

> **问题**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 行为
>
> **简短摘要**: `kotlin.useK2` Gradle 属性已被移除。在 Kotlin 1.9.* 中，它可用于启用 K2 编译器。在 Kotlin 2.0.0 及更高版本中，K2 编译器默认启用，因此该属性无效，且不能用于切回以前的编译器。
>
> **弃用周期**:
>
> - 1.8.20: `kotlin.useK2` Gradle 属性已被弃用
> - 2.0.0: `kotlin.useK2` Gradle 属性已被移除

### 移除弃用的平台插件 ID

> **问题**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: 已移除对以下平台插件 ID 的支持：
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **弃用周期**:
>
> - 1.3: 平台插件 ID 已被弃用
> - 2.0.0: 平台插件 ID 不再受支持

### 移除 outputFile JavaScript 编译器选项

> **问题**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简短摘要**: `outputFile` JavaScript 编译器选项已被移除。相反，您可以使用 `Kotlin2JsCompile` 任务的 `destinationDirectory` 属性来指定编写编译后的 JavaScript 输出文件的目录。
>
> **弃用周期**:
>
> - 1.9.25: `outputFile` 编译器选项已被弃用
> - 2.0.0: `outputFile` 编译器选项已被移除