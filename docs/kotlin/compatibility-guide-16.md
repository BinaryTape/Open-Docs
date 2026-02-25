[//]: # (title: Kotlin 1.6.x 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_和_[舒适更新](kotlin-evolution-principles.md)_是 Kotlin 语言设计的基本原则。前者指出应当移除阻碍语言演进的结构，而后者指出这种移除应当事先做好充分沟通，以使代码迁移尽可能顺畅。

虽然大多数语言变更已经通过其他渠道（如更新日志或编译器警告）公布，但本文档对这些变更进行了总结，为从 Kotlin 1.5 迁移到 Kotlin 1.6 提供完整参考。

## 基本术语

在本文档中，我们介绍了以下几种兼容性：

- _源码 (source)_：源码不兼容的变更会导致以前可以正常编译（没有错误或警告）的代码无法再编译
- _二进制 (binary)_：如果交换两个二进制构件不会导致加载或链接错误，则称它们是二进制兼容的
- _行为 (behavioral)_：如果同一程序在应用变更前后表现出不同的行为，则称该变更为行为不兼容

请记住，这些定义仅针对纯 Kotlin。从其他语言（例如 Java）的角度来看 Kotlin 代码的兼容性不在本文档的讨论范围内。

## 语言

### 枚举、密封类和布尔类型的 when 语句默认要求详尽性

> **问题**：[KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将对枚举、密封类或布尔类型主体不详尽的 `when` 语句发出警告
>
> **弃用周期**：
>
> - 1.6.0：当以枚举、密封类或布尔类型为主体的 `when` 语句不详尽时引入警告（在渐进模式下为错误）
> - 1.7.0：将此警告提升为错误

### 废弃 when-with-subject 中令人困惑的语法

> **问题**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将废弃 `when` 条件表达式中几种令人困惑的语法结构
>
> **弃用周期**：
>
> - 1.6.20：在受影响的表达式上引入弃用警告
> - 1.8.0：将此警告提升为错误
> - &gt;= 1.8：将某些废弃的结构重新用于新的语言功能

### 禁止在伴生对象和嵌套对象的父类构造函数调用中访问类成员

> **问题**：[KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：在 Kotlin 1.6 中，如果伴生对象或常规对象的父类构造函数调用的实参接收者引用了包含该对象的声明，则会报告错误
>
> **弃用周期**：
>
> - 1.5.20：在有问题的实参上引入警告
> - 1.6.0：将此警告提升为错误，
>  可以使用 `-XXLanguage:-ProhibitSelfCallsInNestedObjects` 暂时恢复到 1.6 之前的行为

### 类型为 null 性增强改进

> **问题**：[KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.7 将更改加载和解析 Java 代码中类型为 null 性注解的方式
>
> **弃用周期**：
>
> - 1.4.30：在更精确的类型为 null 性可能导致错误的情况下引入警告
> - 1.7.0：推断更精确的 Java 类型为 null 性，
>   可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 暂时恢复到 1.7 之前的行为

### 防止不同数字类型之间的隐式强制转换

> **问题**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简短摘要**：在语义上仅需要向下转换为某种原始数字类型的情况下，Kotlin 将避免自动将数字值转换为该类型
>
> **弃用周期**：
>
> - < 1.5.30：所有受影响情况下的旧行为
> - 1.5.30：修复生成的属性委托访问器中的向下转换行为，
>   可以使用 `-Xuse-old-backend` 暂时恢复到 1.5.30 修复之前的行为
> - &gt;= 1.6.20：修复其他受影响情况下的向下转换行为

### 禁止声明违反 JLS 的可重复注解类及其容器

> **问题**：[KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将检查可重复注解的容器注解是否满足 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3) 中的相同要求：数组类型的值方法、保留期（retention）和目标（target）
>
> **弃用周期**：
>
> - 1.5.30：对违反 JLS 要求的可重复容器注解声明引入警告（在渐进模式下为错误）
> - 1.6.0：将此警告提升为错误，
>   可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 暂时禁用错误报告

### 禁止在可重复注解类中声明名为 Container 的嵌套类

> **问题**：[KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将检查在 Kotlin 中声明的可重复注解是否包含名为 `Container` 的预定义嵌套类
>
> **弃用周期**：
>
> - 1.5.30：对 Kotlin 可重复注解类中名为 `Container` 的嵌套类引入警告（在渐进模式下为错误）
> - 1.6.0：将此警告提升为错误，
>   可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 暂时禁用错误报告

### 禁止在重写接口属性的主构造函数属性上使用 @JvmField

> **问题**：[KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将禁止在主构造函数中声明且重写了接口属性的属性上使用 `@JvmField` 注解
>
> **弃用周期**：
>
> - 1.5.20：对此类主构造函数属性上的 `@JvmField` 注解引入警告
> - 1.6.0：将此警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` 暂时禁用错误报告

### 废弃编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **问题**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6.20 将对使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式发出警告
>
> **弃用周期**：
>
> - 1.6.20：对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.8.0：将此警告提升为错误

### 禁止从 public-abi 内联函数中调用 super

> **问题**：[KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将禁止从公开（public）或受保护（protected）的内联函数和属性中调用带有 `super` 限定符的函数
>
> **弃用周期**：
>
> - 1.5.0：对从公开或受保护的内联函数或属性访问器中进行的 super 调用引入警告
> - 1.6.0：将此警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitSuperCallsFromPublicInline` 暂时禁用错误报告

### 禁止从公开内联函数调用受保护的构造函数

> **问题**：[KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将禁止从公开或受保护的内联函数和属性中调用受保护的构造函数
>
> **弃用周期**：
>
> - 1.4.30：对从公开或受保护的内联函数或属性访问器中调用受保护构造函数的行为引入警告
> - 1.6.0：将此警告提升为错误，
>   可以使用 `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` 暂时禁用错误报告

### 禁止从文件私有类型中暴露私有嵌套类型

> **问题**：[KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将禁止从文件私有（private-in-file）类型中暴露私有嵌套类型和内部类
>
> **弃用周期**：
>
> - 1.5.0：对从文件私有类型中暴露私有类型的行为引入警告
> - 1.6.0：将此警告提升为错误，
>   可以使用 `-XXLanguage:-PrivateInFileEffectiveVisibility` 暂时禁用错误报告

### 在某些情况下不对类型上的注解进行注解目标分析

> **问题**：[KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将不再允许在不应适用于类型的类型上使用注解
>
> **弃用周期**：
>
> - 1.5.20：在渐进模式下引入错误
> - 1.6.0：引入错误，
>   可以使用 `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` 暂时禁用错误报告

### 禁止调用名为 suspend 且带有尾随 lambda 的函数

> **问题**：[KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 1.6 将不再允许调用名为 `suspend` 且将其唯一的函数类型实参作为尾随 lambda 传递的函数
>
> **弃用周期**：
>
> - 1.3.0：对此类函数调用引入警告
> - 1.6.0：将此警告提升为错误
> - &gt;= 1.7.0：引入语言语法变更，使 `{` 之前的 `suspend` 被解析为关键字

## 标准库

### 移除 minus/removeAll/retainAll 中脆弱的 contains 优化

> **问题**：[KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：行为
>
> **简短摘要**：Kotlin 1.6 在调用从 collection/iterable/array/sequence 中移除多个元素的函数和运算符时，将不再对实参执行 Set 转换。
>
> **弃用周期**：
>
> - < 1.6：旧行为：实参在某些情况下会被转换为 Set
> - 1.6.0：如果函数实参是一个集合，它将不再被转换为 `Set`。如果它不是集合，则可能会被转换为 `List`。
> 旧行为在 JVM 上可以通过设置系统属性 `kotlin.collections.convert_arg_to_set_in_removeAll=true` 暂时恢复
> - &gt;= 1.7：上述系统属性将不再生效

### 更改 Random.nextLong 中的值生成算法

> **问题**：[KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：行为
>
> **简短摘要**：Kotlin 1.6 更改了 `Random.nextLong` 函数中的值生成算法，以避免产生超出指定范围的值。
>
> **弃用周期**：
>
> - 1.6.0：行为立即修复

### 逐步将集合 min 和 max 函数的返回值类型更改为非空

> **问题**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源码
>
> **简短摘要**：集合 `min` 和 `max` 函数的返回值类型将在 Kotlin 1.7 中更改为非空
>
> **弃用周期**：
>
> - 1.4.0：引入 `...OrNull` 函数作为同义词，并废弃受影响的 API（详见问题单）
> - 1.5.0：将受影响 API 的弃用级别提升为错误
> - 1.6.0：从公共 API 中隐藏已废弃的函数
> - &gt;= 1.7：重新引入受影响的 API，但具有非空的返回值类型

### 废弃浮点数组函数：contains、indexOf、lastIndexOf

> **问题**：[KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源码
>
> **简短摘要**：Kotlin 废弃了使用 IEEE-754 顺序而非全序（total order）比较值的浮点数组函数 `contains`、`indexOf` 和 `lastIndexOf`
>
> **弃用周期**：
>
> - 1.4.0：通过警告废弃受影响的函数
> - 1.6.0：将弃用级别提升为错误
> - &gt;= 1.7：从公共 API 中隐藏已废弃的函数

### 将 kotlin.dom 和 kotlin.browser 软件包中的声明迁移到 kotlinx.*

> **问题**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源码
>
> **简短摘要**：`kotlin.dom` 和 `kotlin.browser` 软件包中的声明将移动到相应的 `kotlinx.*` 软件包中，以为将其从 stdlib 中提取出来做准备
>
> **弃用周期**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 软件包中引入替代 API
> - 1.4.0：废弃 `kotlin.dom` 和 `kotlin.browser` 软件包中的 API，并建议使用上述新 API 作为替代
> - 1.6.0：将弃用级别提升为错误
> - &gt;= 1.7：从 stdlib 中移除已废弃的函数
> - &gt;= 1.7：将 kotlinx.* 软件包中的 API 移动到独立的库中

### 使 Regex.replace 函数在 Kotlin/JS 中不再内联

> **问题**：[KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源码
>
> **简短摘要**：在 Kotlin/JS 中，带有函数式 `transform` 形参的 `Regex.replace` 函数将不再是内联的
>
> **弃用周期**：
>
> - 1.6.0：从受影响的函数中移除 `inline` 修饰符

### JVM 和 JS 在替换字符串包含组引用时 Regex.replace 函数的行为差异

> **问题**：[KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：行为
>
> **简短摘要**：Kotlin/JS 中带有替换模式字符串的 `Regex.replace` 函数将遵循与 Kotlin/JVM 相同的模式语法
>
> **弃用周期**：
>
> - 1.6.0：更改 Kotlin/JS stdlib 中 `Regex.replace` 的替换模式处理方式

### 在 JS Regex 中使用 Unicode 大小写折叠

> **问题**：[KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：行为
>
> **简短摘要**：Kotlin/JS 中的 `Regex` 类在调用底层 JS 正则表达式引擎时将使用 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 标志，以便根据 Unicode 规则搜索和比较字符。
> 这带来了对 JS 环境的特定版本要求，并会导致对正则表达式模式字符串中不必要转义的验证更加严格。
>
> **弃用周期**：
>
> - 1.5.0：在 JS `Regex` 类的大多数函数中启用 Unicode 大小写折叠
> - 1.6.0：在 `Regex.replaceFirst` 函数中启用 Unicode 大小写折叠

### 废弃一些仅限 JS 的 API

> **问题**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源码
>
> **简短摘要**：stdlib 中许多仅限 JS 的函数被废弃以待移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及数组上接收比较函数的 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **弃用周期**：
>
> - 1.6.0：通过警告废弃受影响的函数
> - 1.7.0：将弃用级别提升为错误
> - 1.8.0：从公共 API 中移除已废弃的函数

### 从 Kotlin/JS 类的公共 API 中隐藏实现相关和互操作相关的函数

> **问题**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源码、二进制
>
> **简短摘要**：`HashMap.createEntrySet` 和 `AbstactMutableCollection.toJSON` 函数的可见性更改为内部 (internal)
>
> **弃用周期**：
>
> - 1.6.0：将这些函数设为内部，从而将其从公共 API 中移除

## 工具

### 废弃 KotlinGradleSubplugin 类

> **问题**：[KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：`KotlinGradleSubplugin` 类将被废弃，取而代之的是 `KotlinCompilerPluginSupportPlugin`
>
> **弃用周期**：
>
> - 1.6.0：将弃用级别提升为错误
> - &gt;= 1.7.0：移除已废弃的类

### 移除 kotlin.useFallbackCompilerSearch 构建选项

> **问题**：[KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除已废弃的 'kotlin.useFallbackCompilerSearch' 构建选项
>
> **弃用周期**：
>
> - 1.5.0：将弃用级别提升为警告
> - 1.6.0：移除已废弃的选项

### 移除几个编译器选项

> **问题**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除已废弃的 `noReflect` 和 `includeRuntime` 编译器选项
>
> **弃用周期**：
>
> - 1.5.0：将弃用级别提升为错误
> - 1.6.0：移除已废弃的选项

### 废弃 useIR 编译器选项

> **问题**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：隐藏已废弃的 `useIR` 编译器选项
>
> **弃用周期**：
>
> - 1.5.0：将弃用级别提升为警告
> - 1.6.0：隐藏该选项
> - &gt;= 1.7.0：移除已废弃的选项

### 废弃 kapt.use.worker.api Gradle 属性

> **问题**：[KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：废弃 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 kapt（默认值：true）
>
> **弃用周期**：
>
> - 1.6.20：将弃用级别提升为警告
> - &gt;= 1.8.0：移除此属性

### 移除 kotlin.parallel.tasks.in.project Gradle 属性

> **问题**：[KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：移除 `kotlin.parallel.tasks.in.project` 属性
>
> **弃用周期**：
>
> - 1.5.20：将弃用级别提升为警告
> - 1.6.20：移除此属性

### 废弃 kotlin.experimental.coroutines Gradle DSL 选项和 kotlin.coroutines Gradle 属性

> **问题**：[KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源码
>
> **简短摘要**：废弃 `kotlin.experimental.coroutines` Gradle DSL 选项和 `kotlin.coroutines` 属性
>
> **弃用周期**：
>
> - 1.6.20：将弃用级别提升为警告
> - &gt;= 1.7.0：移除该 DSL 选项和属性