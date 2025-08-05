[//]: # (title: Kotlin 2.0 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计的核心原则。前者指出，阻碍语言演进的结构应该被移除；后者则强调，这种移除应提前充分沟通，以使代码迁移尽可能顺畅。

虽然大部分语言变更已通过其他渠道（例如更新的变更日志或编译器警告）发布，但本文档提供了从 Kotlin 1.9 到 Kotlin 2.0 迁移的完整参考。

> Kotlin K2 编译器作为 Kotlin 2.0 的一部分引入。关于新编译器的优势、迁移期间可能遇到的变更以及如何回滚到之前的编译器，请参见 [K2 编译器迁移指南](k2-compiler-migration-guide.md)。
{style="note"}

## 基本术语

本文档介绍了多种兼容性：

- _源_：源不兼容变更指导致过去能正常编译（无错误或警告）的代码无法再编译。
- _二进制_：如果互换两个二进制 artifact 不会导致加载或链接错误，则称它们是二进制兼容的。
- _行为_：如果相同的程序在应用变更前后表现出不同的行为，则称该变更为行为不兼容。

请注意，这些定义仅适用于纯 Kotlin。Kotlin 代码与其他语言（例如 Java）的兼容性不在本文档的讨论范围之内。

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

### 废弃在投影接收者上使用合成 setter

> **问题**：[KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **简要概述**：如果您使用 Java 类的合成 setter 赋值一个与该类的投影类型冲突的类型，则会触发错误。
>
> **废弃周期**：
>
> - 1.8.20：当合成属性 setter 在逆变位置具有投影形参类型，导致调用点实参类型不兼容时，报告警告。
> - 2.0.0：将警告提升为错误。

### 更正当调用 Java 子类中重载的带有内联类形参的函数时的名字修饰

> **问题**：[KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **废弃周期**：
>
> - 2.0.0：在函数调用中采用正确的名字修饰行为；要恢复到之前的行为，请使用 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 编译器选项。

### 更正逆变捕获类型的类型近似算法

> **问题**：[KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.8.20：对有问题的调用报告警告
> - 2.0.0：将警告提升为错误

### 禁止在属性初始化前访问属性值

> **问题**：[KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：当属性在受影响的上下文中使用前被访问时，报告错误。

### 当导入的同名类存在歧义时报告错误

> **问题**：[KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：当解析存在于通过星号导入的多个包中的类名时，报告错误。

### 默认通过 invokedynamic 和 LambdaMetafactory 生成 Kotlin lambda 表达式

> **问题**：[KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；lambda 表达式默认使用 `invokedynamic` 和 `LambdaMetafactory` 生成。

### 禁止当需要表达式时 if 条件只有一个分支

> **问题**：[KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：如果 `if` 条件只有一个分支，则报告错误。

### 禁止通过传递泛型类型的星投影来违反自身上界

> **问题**：[KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：当通过传递泛型类型的星投影违反自身上界时，报告错误。

### 近似私有内联函数的返回类型中的匿名类型

> **问题**：[KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.9.0：如果推断的返回类型包含匿名类型，则对私有内联函数报告警告。
> - 2.0.0：将此类私有内联函数的返回类型近似为超类型。

### 变更重载解析行为，以优先处理本地扩展函数调用而非本地函数类型属性的 invoke 约定

> **问题**：[KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **废弃周期**：
>
> - 2.0.0：新的重载解析行为；函数调用始终优先于 invoke 约定。

### 当由于二进制依赖项中的超类型变更导致继承成员冲突时报告错误

> **问题**：[KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.7.0：对从二进制依赖项的超类型中发生继承成员冲突的声明报告警告 CONFLICTING_INHERITED_MEMBERS_WARNING。
> - 2.0.0：将警告提升为错误：CONFLICTING_INHERITED_MEMBERS。

### 忽略不型变类型中形参上的 @UnsafeVariance 注解

> **问题**：[KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；当报告逆变形参中的类型不匹配错误时，将忽略 `@UnsafeVariance` 注解。

### 变更伴生对象成员的调用外部引用的类型

> **问题**：[KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.8.20：当伴生对象函数引用类型被推断为非绑定引用时，报告警告。
> - 2.0.0：变更行为，以便在所有使用上下文中，伴生对象函数引用都被推断为绑定引用。

### 禁止私有内联函数暴露匿名类型

> **问题**：[KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.3.0：对从私有内联函数返回的匿名对象的自身成员调用报告警告。
> - 2.0.0：将此类私有内联函数的返回类型近似为超类型，并且不解析对匿名对象成员的调用。

### 报告 while 循环中断后不健全智能类型转换的错误

> **问题**：[KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；通过切换到语言版本 1.9 可以恢复旧行为。

### 当交集类型变量被赋值一个不是该交集类型子类型的值时报告错误

> **问题**：[KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：当交集类型变量被赋值一个不是该交集类型子类型的值时，报告错误。

### 要求当用 SAM 构造函数构造的接口包含一个需要选择启用的方法时选择启用

> **问题**：[KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.7.20：对通过 SAM 构造函数使用 `OptIn` 的情况报告警告。
> - 2.0.0：对通过 SAM 构造函数使用 `OptIn` 的情况将警告提升为错误（如果 `OptIn` 标记的严重性为警告，则继续报告警告）。

### 禁止类型别名构造函数中违反上界

> **问题**：[KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.8.0：对类型别名构造函数中违反上界的情况引入警告。
> - 2.0.0：在 K2 编译器中将警告提升为错误。

### 使解构变量的真实类型与指定时的显式类型保持一致

> **问题**：[KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；解构变量的真实类型现在与指定时的显式类型保持一致。

### 要求当调用具有需要选择启用的默认值形参类型的构造函数时选择启用

> **问题**：[KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.8.20：对具有需要选择启用形参类型的构造函数调用报告警告。
> - 2.0.0：将警告提升为错误（如果 `OptIn` 标记的严重性为警告，则继续报告警告）。

### 在同一作用域级别具有相同名称的属性和枚举条目之间存在歧义时报告错误

> **问题**：[KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.7.20：当编译器在同一作用域级别解析为属性而非枚举条目时，报告警告。
> - 2.0.0：当 K2 编译器在同一作用域级别同时遇到具有相同名称的属性和枚举条目时，报告歧义（在旧编译器中保留警告不变）。

### 变更限定符解析行为以优先选择伴生属性而非枚举条目

> **问题**：[KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：实现新解析行为；伴生属性优先于枚举条目。

### 解析 invoke 调用接收者类型和 invoke 函数类型，如同它们以脱糖形式编写

> **问题**：[KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：独立解析 invoke 调用接收者类型和 invoke 函数类型，如同它们以脱糖形式编写。

### 禁止通过非私有内联函数暴露私有类成员

> **问题**：[KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.9.0：当从内部内联函数调用私有类伴生对象成员时，报告 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告。
> - 2.0.0：将此警告提升为 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 错误。

### 更正投影泛型类型中确定非空类型的可空性

> **问题**：[KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；投影类型会考虑所有原地非空类型。

### 变更前缀自增的推断类型，以匹配 getter 的返回类型而非 inc() 操作符的返回类型

> **问题**：[KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；前缀自增的推断类型已更改为匹配 getter 的返回类型，而非 `inc()` 操作符的返回类型。

### 强制当从超类中声明的泛型内部类继承内部类时进行边界检测

> **问题**：[KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：当泛型内部超类的类型形参上界被违反时，报告错误。

### 禁止当预期类型是带有函数类型形参的函数类型时，对带有 SAM 类型的可调用引用进行赋值

> **问题**：[KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：当预期类型是带有函数类型形参的函数类型时，对带有 SAM 类型的可调用引用报告编译错误。

### 考虑伴生对象作用域以解析伴生对象上的注解

> **问题**：[KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；现在在伴生对象上的注解解析期间不再忽略伴生对象作用域。

### 变更安全调用和约定操作符组合的求值语义

> **问题**：[KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **废弃周期**：
>
> - 1.4.0：对每个不正确的调用报告警告。
> - 2.0.0：实现新解析行为。

### 要求具有幕后字段和自定义 setter 的属性立即初始化

> **问题**：[KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **废弃周期**：
>
> - 1.9.20：对没有主构造函数的情况引入 `MUST_BE_INITIALIZED` 警告。
> - 2.0.0：将警告提升为错误。

### 禁止在 invoke 操作符约定调用中对任意表达式进行 Unit 转换

> **问题**：[KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **废弃周期**：
>
> - 2.0.0：当 Unit 转换应用于变量和 invoke 解析中的任意表达式时，报告错误；使用 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 编译器选项可保留受影响表达式的旧行为。

### 禁止当字段通过安全调用访问时对非空 Java 字段进行可空赋值

> **问题**：[KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：当可空值被赋值给非空 Java 字段时，报告错误。

### 要求当覆盖包含原始类型形参的 Java 方法时使用星投影类型

> **问题**：[KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；原始类型形参的覆盖被禁止。

### 变更当 V 具有伴生对象时 (V)::foo 引用的解析

> **问题**：[KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **组件**：核心语言
>
> **不兼容变更类型**：行为
>
> **废弃周期**：
>
> - 1.6.0：对当前绑定到伴生对象实例的可调用引用报告警告。
> - 2.0.0：实现新行为；在类型周围添加圆括号不再使其成为该类型的伴生对象实例的引用。

### 禁止在实际公共内联函数中隐式访问非公共 API

> **问题**：[KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.8.20：当公共内联函数中隐式访问非公共 API 时，报告编译警告。
> - 2.0.0：将警告提升为错误。

### 禁止在属性 getter 上使用点 get 注解

> **问题**：[KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.9.0：对 getter 上的使用点 `get` 注解报告警告（在渐进模式下为错误）。
> - 2.0.0：将警告提升为 `INAPPLICABLE_TARGET_ON_PROPERTY` 错误；使用 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 可恢复为警告。

### 阻止构建器推断 lambda 函数中类型形参的隐式推断到上界

> **问题**：[KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.7.20：当类型实参的类型形参无法推断到声明的上界时，报告警告（在渐进模式下为错误）。
> - 2.0.0：将警告提升为错误。

### 在公共签名中近似本地类型时保持可空性

> **问题**：[KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.8.0：柔性类型通过柔性超类型近似；当声明被推断为非空类型但应为可空类型时，报告警告，提示显式指定类型以避免 NPEs。
> - 2.0.0：可空类型通过可空超类型近似。

### 移除 false && ... 和 false || ... 为了智能类型转换目的的特殊处理

> **问题**：[KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 2.0.0：实现新行为；对 `false && ...` 和 `false || ...` 不再有特殊处理。

### 禁止枚举中的内联开放函数

> **问题**：[KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **废弃周期**：
>
> - 1.8.0：对枚举中的内联开放函数报告警告。
> - 2.0.0：将警告提升为错误。

## 工具

### Gradle 中的可见性变更

> **问题**：[KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源
>
> **简要概述**：此前，某些旨在用于特定 DSL 上下文的 Kotlin DSL 函数和属性会无意中泄漏到其他 DSL 上下文。我们已添加 `@KotlinGradlePluginDsl` 注解，这阻止了 Kotlin Gradle 插件 DSL 函数和属性暴露到不打算可用的级别。以下级别彼此分离：
> * Kotlin 扩展
> * Kotlin 目标
> * Kotlin 编译项
> * Kotlin 编译任务
>
> **废弃周期**：
>
> - 2.0.0：对于大多数常见情况，如果您的构建脚本配置不正确，编译器会报告警告并提供修复建议；否则，编译器会报告错误。

### 废弃 kotlinOptions DSL

> **问题**：[KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源
>
> **简要概述**：通过 `kotlinOptions` DSL 和相关 `KotlinCompile<KotlinOptions>` 任务接口配置编译器选项的能力已被废弃。
>
> **废弃周期**：
>
> - 2.0.0：报告警告。

### 废弃 KotlinCompilation DSL 中的 compilerOptions

> **问题**：[KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源
>
> **简要概述**：在 `KotlinCompilation` DSL 中配置 `compilerOptions` 属性的能力已被废弃。
>
> **废弃周期**：
>
> - 2.0.0：报告警告。

### 废弃 CInteropProcess 处理的旧方式

> **问题**：[KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源
>
> **简要概述**：`CInteropProcess` 任务和 `CInteropSettings` 类现在使用 `definitionFile` 属性，而不是 `defFile` 和 `defFileProperty`。
>
> 这消除了当 `defFile` 动态生成时，在 `CInteropProcess` 任务和生成 `defFile` 的任务之间添加额外 `dependsOn` 关联的需要。
>
> 在 Kotlin/Native 项目中，Gradle 现在会在构建过程后期，连接的任务运行后惰性验证 `definitionFile` 属性的存在。
>
> **废弃周期**：
>
> - 2.0.0：`defFile` 和 `defFileProperty` 形参被废弃。

### 移除 kotlin.useK2 Gradle 属性

> **问题**：[KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **组件**：Gradle
>
> **不兼容变更类型**：行为
>
> **简要概述**：`kotlin.useK2` Gradle 属性已被移除。在 Kotlin 1.9.* 中，它可用于启用 K2 编译器。在 Kotlin 2.0.0 及更高版本中，K2 编译器默认启用，因此该属性不再有效果，也无法用于切换回之前的编译器。
>
> **废弃周期**：
>
> - 1.8.20：`kotlin.useK2` Gradle 属性被废弃。
> - 2.0.0：`kotlin.useK2` Gradle 属性被移除。

### 移除已废弃的平台插件 ID

> **问题**：[KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源
>
> **简要概述**：对这些平台插件 ID 的支持已被移除：
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **废弃周期**：
>
> - 1.3：平台插件 ID 被废弃。
> - 2.0.0：平台插件 ID 不再受支持。

### 移除 outputFile JavaScript 编译器选项

> **问题**：[KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源
>
> **简要概述**：`outputFile` JavaScript 编译器选项已被移除。取而代之，您可以使用 `Kotlin2JsCompile` 任务的 `destinationDirectory` 属性来指定编译后的 JavaScript 输出文件写入的目录。
>
> **废弃周期**：
>
> - 1.9.25：`outputFile` 编译器选项被废弃。
> - 2.0.0：`outputFile` 编译器选项被移除。