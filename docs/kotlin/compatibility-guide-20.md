---
title: "Kotlin 2.0 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的根本原则。前者指出，应移除阻碍语言发展的结构，后者指出，应事先充分沟通移除情况，以尽可能顺利地进行代码迁移。

虽然大多数语言更改已通过其他渠道（如更新的变更日志或编译器警告）宣布，但本文档提供了从 Kotlin 1.9 迁移到 Kotlin 2.0 的完整参考。

:::note
Kotlin K2 编译器作为 Kotlin 2.0 的一部分引入。 有关新编译器的优势、迁移期间可能遇到的更改以及如何回滚到之前的编译器的信息，请参阅 [K2 编译器迁移指南](k2-compiler-migration-guide)。

:::

## 基本术语

在本文档中，我们介绍了几种兼容性：

- _source (源代码)_：源代码不兼容的更改会阻止以前可以正常编译（没有错误或警告）的代码再进行编译
- _binary (二进制文件)_：如果交换两个二进制文件不会导致加载或链接错误，则称这两个二进制文件是二进制兼容的
- _behavioral (行为)_：如果同一个程序在应用更改前后表现出不同的行为，则称该更改是行为不兼容的

请记住，这些定义仅适用于纯 Kotlin。 从其他语言的角度来看 Kotlin 代码的兼容性
（例如，来自 Java）不在本文档的范围内。

## 语言

<!--
### 标题

> **问题**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **简短摘要**:
>
> **弃用周期**:
>
> - 1.6.20: 报告警告
> - 1.8.0: 将警告提升为错误
-->

### 弃用在 projected receiver 上使用 synthetic setter

> **问题**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **简短摘要**: 如果您使用 Java 类的 synthetic setter 来分配与该类的 projected type 冲突的类型，则会触发错误。
>
> **弃用周期**:
>
> - 1.8.20: 当 synthetic property setter 在逆变位置具有 projected parameter type，导致调用点的参数类型不兼容时，报告警告
> - 2.0.0: 将警告提升为错误

### 更正调用具有内联类参数并在 Java 子类中重载的函数时的名称修饰 (mangling)

> **问题**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 在函数调用中使用正确的名称修饰行为；要恢复到之前的行为，请使用 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 编译器选项。

### 更正逆变捕获类型的类型近似算法

> **问题**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.8.20: 在有问题的调用上报告警告
> - 2.0.0: 将警告提升为错误

### 禁止在属性初始化之前访问属性值

> **问题**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 当在受影响的上下文中于初始化之前访问属性时，报告错误

### 当导入的类具有相同的名称时，报告错误

> **问题**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 当解析的类名存在于使用星号导入的多个包中时，报告错误

### 默认情况下通过 invokedynamic 和 LambdaMetafactory 生成 Kotlin lambda 表达式

> **问题**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；默认情况下使用 `invokedynamic` 和 `LambdaMetafactory` 生成 lambda 表达式

### 当需要表达式时，禁止使用只有一个分支的 if 条件

> **问题**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 如果 `if` 条件只有一个分支，则报告错误

### 禁止通过传递泛型类型的 star-projection 来违反 self upper bounds

> **问题**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 当通过传递泛型类型的 star-projection 来违反 self upper bounds 时，报告错误

### 近似私有内联函数返回类型中的匿名类型

> **问题**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.9.0: 如果推断的返回类型包含匿名类型，则在私有内联函数上报告警告
> - 2.0.0: 将此类私有内联函数的返回类型近似为超类型

### 更改重载解析行为，以优先于本地函数类型属性的 invoke 约定调用本地扩展函数调用

> **问题**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 新的重载解析行为；函数调用始终优先于 invoke 约定

### 当由于二进制依赖项中超类型的更改而发生继承成员冲突时，报告错误

> **问题**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.7.0: 在声明上报告 CONFLICTING_INHERITED_MEMBERS_WARNING，其中继承的成员冲突发生在来自二进制依赖项的超类型中
> - 2.0.0: 将警告提升为错误：CONFLICTING_INHERITED_MEMBERS

### 忽略不变类型中参数上的 @UnsafeVariance 注解

> **问题**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；在报告有关逆变参数中的类型不匹配的错误时，将忽略 `@UnsafeVariance` 注解

### 更改对伴生对象成员的 call-out 引用的类型

> **问题**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.8.20: 在推断为 unbound reference 的伴生对象函数引用类型上报告警告
> - 2.0.0: 更改行为，以便在所有使用上下文中将伴生对象函数引用推断为 bound reference

### 禁止从私有内联函数公开匿名类型

> **问题**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.3.0: 报告对匿名对象的自身成员的调用，这些匿名对象是从私有内联函数返回的
> - 2.0.0: 将此类私有内联函数的返回类型近似为超类型，并且不解析对匿名对象成员的调用

### 报告 while 循环中断后不合理的智能转换错误

> **问题**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；可以通过切换到语言版本 1.9 来恢复旧的行为

### 当将 intersection type (交集类型)的变量分配给不是该交集类型的子类型的值时，报告错误

> **问题**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 当将具有 intersection type 的变量分配给不是该交集类型的子类型的值时，报告错误

### 当使用 SAM 构造函数构造的接口包含需要选择加入的方法时，需要选择加入

> **问题**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.7.20: 报告通过 SAM 构造函数使用 `OptIn` 的警告
> - 2.0.0: 将通过 SAM 构造函数使用 `OptIn` 的警告提升为错误（如果 `OptIn` 标记的严重性为警告，则继续报告警告）

### 禁止 typealias 构造函数中违反 upper bound 的情况

> **问题**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.8.0: 针对在 typealias 构造函数中违反 upper bound 的情况引入警告
> - 2.0.0: 在 K2 编译器中将警告提升为错误

### 使 destructuring variable 的实际类型与指定时的显式类型保持一致

> **问题**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；现在，destructuring variable 的实际类型与指定时的显式类型一致

### 调用具有需要选择加入的默认值的参数类型的构造函数时，需要选择加入

> **问题**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.8.20: 报告具有需要选择加入的参数类型的构造函数调用上的警告
> - 2.0.0: 将警告提升为错误（如果 `OptIn` 标记的严重性为警告，则继续报告警告）

### 报告同一作用域级别中具有相同名称的属性和枚举条目之间的歧义

> **问题**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.7.20: 当编译器解析为同一作用域级别的属性而不是枚举条目时，报告警告
> - 2.0.0: 当编译器在 K2 编译器中遇到同一作用域级别中具有相同名称的属性和枚举条目时，报告歧义（在旧编译器中保持警告不变）

### 更改限定符解析行为，以优先于枚举条目选择伴生对象属性

> **问题**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的解析行为；伴生对象属性优先于枚举条目

### 解析 invoke call receiver type 和 invoke function type，就像以 desugared 形式编写一样

> **问题**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 独立解析 invoke call receiver type 和 invoke function type，就像它们是以 desugared 形式编写的一样

### 禁止通过非私有内联函数公开私有类成员

> **问题**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.9.0: 从内部内联函数调用私有类伴生对象成员时，报告 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告
> - 2.0.0: 将此警告提升为 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 错误

### 更正 projected generic type 中 definitely non-null (明确非空)类型的可空性

> **问题**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；projected type 将考虑所有 in-place not-null 类型

### 更改前缀增量的推断类型以匹配 getter 的返回类型，而不是 inc() 运算符的返回类型

> **问题**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；更改前缀增量的推断类型以匹配 getter 的返回类型，而不是 `inc()` 运算符的返回类型

### 从超类中声明的泛型内部类继承内部类时，强制执行绑定检查

> **问题**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 当违反泛型内部超类的类型参数的 upper bound 时，报告错误

### 当预期类型是具有函数类型参数的函数类型时，禁止使用具有 SAM 类型的可调用引用

> **问题**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 当预期类型是具有函数类型参数的函数类型时，报告具有 SAM 类型的可调用引用的编译错误

### 考虑伴生对象作用域，以在伴生对象上进行注解解析

> **问题**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；现在，在伴生对象上进行注解解析期间，不再忽略伴生对象作用域

### 更改 safe calls 和 convention operators 组合的评估语义

> **问题**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 行为
>
> **弃用周期**:
>
> - 1.4.0: 报告每个不正确的调用上的警告
> - 2.0.0: 实现新的解析行为

### 要求具有 backing field 和自定义 setter 的属性立即初始化

> **问题**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 行为
>
> **弃用周期**:
>
> - 1.9.20: 对于没有主构造函数的情况，引入 `MUST_BE_INITIALIZED` 警告
> - 2.0.0: 将警告提升为错误

### 禁止在 invoke 运算符约定调用中对任意表达式进行 Unit 转换

> **问题**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 行为
>
> **弃用周期**:
>
> - 2.0.0: 当 Unit 转换应用于变量和 invoke 解析中的任意表达式时，报告错误； 使用 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 编译器选项来保持受影响表达式的先前行为。

### 当使用 safe call 访问字段时，禁止将可空值分配给非空 Java 字段

> **问题**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 如果将可空值分配给非空 Java 字段，则报告为错误

### 覆盖包含 raw-type 参数的 Java 方法时，需要 star-projected 类型

> **问题**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；禁止覆盖 raw type 参数

### 当 V 具有伴生对象时，更改 (V)::foo 引用解析

> **问题**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 行为
>
> **弃用周期**:
>
> - 1.6.0: 报告当前绑定到伴生对象实例的可调用引用上的警告
> - 2.0.0: 实现新的行为；在类型周围添加括号不再使其成为对类型伴生对象实例的引用

### 禁止在 effectively public (有效公共) 内联函数中进行隐式非公共 API 访问

> **问题**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.8.20: 当在公共内联函数中访问隐式非公共 API 时，报告编译警告
> - 2.0.0: 将警告提升为错误

### 禁止在属性 getter 上使用 use-site get annotations

> **问题**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.9.0: 报告在 getter 上使用 use-site `get` 注解的警告（在 progressive mode (渐进模式)下为错误）
> - 2.0.0: 将警告提升为 `INAPPLICABLE_TARGET_ON_PROPERTY` 错误；
>   使用 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 恢复为警告

### 防止在 builder inference (构建器推断) lambda 函数中将类型参数隐式推断为 upper bounds

> **问题**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.7.20: 当无法将类型参数推断为声明的 upper bounds 时，报告警告（或在 progressive mode 下为错误）
> - 2.0.0: 将警告提升为错误

### 在公共签名中近似本地类型时保持可空性

> **问题**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.8.0: 灵活类型由灵活的超类型近似；当推断声明具有应为可空的非空类型时，报告警告，提示显式指定类型以避免 NPE

> - 2.0.0: 可空类型由可空超类型近似

### 删除对 false && ... 和 false || ... 进行智能转换的特殊处理

> **问题**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 2.0.0: 实现新的行为；没有针对 `false && ...` 和 `false || ...` 的特殊处理

### 禁止枚举中的内联 open 函数

> **问题**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **组件**: 核心语言
>
> **不兼容的更改类型**: 源代码
>
> **弃用周期**:
>
> - 1.8.0: 报告枚举中的内联 open 函数上的警告
> - 2.0.0: 将警告提升为错误

## 工具

### Gradle 中的可见性更改

> **问题**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **组件**: Gradle
>
> **不兼容的更改类型**: 源代码
>
> **简短摘要**: 以前，某些旨在用于特定 DSL 上下文的 Kotlin DSL 函数和属性会无意中泄漏到其他 DSL 上下文中。 我们添加了 `@KotlinGradlePluginDsl` 注解，
> 它可以防止 Kotlin Gradle 插件 DSL 函数和属性暴露到不打算提供的级别。 以下级别彼此分离：
> * Kotlin 扩展
> * Kotlin 目标
> * Kotlin 编译
> * Kotlin 编译任务
>
> **弃用周期**:
>
> - 2.0.0: 对于大多数常见情况，如果您的构建脚本配置不正确，编译器会报告带有修复建议的警告； 否则，编译器会报告错误

### 弃用 kotlinOptions DSL

> **问题**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **组件**: Gradle
>
> **不兼容的更改类型**: 源代码
>
> **简短摘要**: 已弃用通过 `kotlinOptions` DSL 和相关的 `KotlinCompile<KotlinOptions>` 任务接口配置编译器选项的功能。
>
> **弃用周期**:
>
> - 2.0.0: 报告警告

### 弃用 KotlinCompilation DSL 中的 compilerOptions

> **问题**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **组件**: Gradle
>
> **不兼容的更改类型**: 源代码
>
> **简短摘要**: 已弃用在 `KotlinCompilation` DSL 中配置 `compilerOptions` 属性的功能。
>
> **弃用周期**:
>
> - 2.0.0: 报告警告

### 弃用 CInteropProcess 的旧处理方式

> **问题**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **组件**: Gradle
>
> **不兼容的更改类型**: 源代码
>
> **简短摘要**: `CInteropProcess` 任务和 `CInteropSettings` 类现在使用 `definitionFile` 属性而不是 `defFile` 和 `defFileProperty`。
>
> 这消除了在动态生成 `defFile` 时，在 `CInteropProcess` 任务和生成 `defFile` 的任务之间添加额外的 `dependsOn` 关系的需求。
>
> 在 Kotlin/Native 项目中，Gradle 现在会在构建过程中稍后运行的连接任务之后延迟验证 `definitionFile` 属性的存在。
>
> **弃用周期**:
>
> - 2.0.0: `defFile` 和 `defFileProperty` 参数已弃用

### 删除 kotlin.useK2 Gradle 属性

> **问题**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **组件**: Gradle
>
> **不兼容的更改类型**: 行为
>
> **简短摘要**: 已删除 `kotlin.useK2` Gradle 属性。 在 Kotlin 1.9.* 中，它可用于启用 K2 编译器。 在 Kotlin 2.0.0 及更高版本中，默认情况下启用 K2 编译器，因此该属性无效
> 并且不能用于切换回先前的编译器。
>
> **弃用周期**:
>
> - 1.8.20: `kotlin.useK2` Gradle 属性已弃用
> - 2.0.0: `kotlin.useK2` Gradle 属性已删除

### 删除已弃用的平台插件 ID

> **问题**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **组件**: Gradle
>
> **不兼容的更改类型**: 源代码
>
> **简短摘要**: 已删除对以下平台插件 ID 的支持：
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **弃用周期**:
>
> - 1.3: 平台插件 ID 已弃用
> - 2.0.0: 不再支持平台插件 ID

### 删除 outputFile JavaScript 编译器选项

> **问题**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **组件**: Gradle
>
> **不兼容的更改类型**: 源代码
>
> **简短摘要**: 已删除 `outputFile` JavaScript 编译器选项。 相反，您可以使用 `Kotlin2JsCompile` 任务的 `destinationDirectory` 属性来指定编译后的 JavaScript 输出文件写入的目录。
>
> **弃用周期**:
>
> - 1.9.25: `outputFile` 编译器选项已弃用
> - 2.0.0: `outputFile` 编译器选项已删除