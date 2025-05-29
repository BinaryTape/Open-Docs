[//]: # (title: Kotlin 1.6 兼容性指南)

_保持语言现代化 (Keeping the Language Modern)_ 和 _舒适的更新 (Comfortable Updates)_ 是 Kotlin 语言设计中的基本原则。前者指出，阻碍语言演进的构造应该被移除；后者则表明，这种移除应该提前充分沟通，以使代码迁移尽可能顺利。

尽管大多数语言变更已通过其他渠道（如更新日志或编译器警告）发布，但本文档总结了所有这些变更，为从 Kotlin 1.5 迁移到 Kotlin 1.6 提供了完整的参考。

## 基本术语

本文档介绍了几种兼容性：

- _源代码_：源代码不兼容的变更会使得原本可以正常编译（无错误或警告）的代码无法再编译
- _二进制_：如果两个二进制产物在互换时不会导致加载或链接错误，则称它们是二进制兼容的
- _行为_：如果同一个程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的

请记住，这些定义仅适用于纯 Kotlin。从其他语言（例如 Java）角度看 Kotlin 代码的兼容性不在本文档的讨论范围之内。

## 语言

### 默认情况下，使带有枚举、密封类和布尔类型主体的 when 语句穷尽化

> **问题**：[KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将对带有枚举、密封类或布尔类型主体的 `when` 语句非穷尽（non-exhaustive）的情况发出警告
>
> **弃用周期**：
>
> - 1.6.0：当带有枚举、密封类或布尔类型主体的 `when` 语句非穷尽时引入警告（在渐进模式下为错误）
> - 1.7.0：将此警告提升为错误

### 弃用 when-with-subject 中令人困惑的语法

> **问题**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将弃用 `when` 条件表达式中几个令人困惑的语法结构
>
> **弃用周期**：
>
> - 1.6.20：对受影响的表达式引入弃用警告
> - 1.8.0：将此警告提升为错误
> - &gt;= 1.8：将一些弃用的构造重用于新的语言特性

### 禁止在其伴生对象和嵌套对象的父类构造函数调用中访问类成员

> **问题**：[KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：如果伴生对象和常规对象的父类构造函数调用的实参的接收者引用了包含声明，Kotlin 1.6 将报告错误
>
> **弃用周期**：
>
> - 1.5.20：对问题实参引入警告
> - 1.6.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitSelfCallsInNestedObjects` 临时恢复到 1.6 之前的行为

### 类型可空性增强改进

> **问题**：[KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.7 将改变其加载和解释 Java 代码中类型可空性注解的方式
>
> **弃用周期**：
>
> - 1.4.30：对于更精确的类型可空性可能导致错误的情况引入警告
> - 1.7.0：推断 Java 类型更精确的可空性，可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 临时恢复到 1.7 之前的行为

### 阻止不同数值类型之间的隐式强制转换

> **问题**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：行为
>
> **简要摘要**：Kotlin 将避免在语义上只需要向下转型（downcast）到某个原始数值类型时，自动将数值转换为该原始数值类型
>
> **弃用周期**：
>
> - < 1.5.30：所有受影响情况下的旧行为
> - 1.5.30：修复生成的属性委托访问器中的向下转型行为，可以使用 `-Xuse-old-backend` 临时恢复到 1.5.30 修复前的行为
> - &gt;= 1.6.20：修复其他受影响情况下的向下转型行为

### 禁止声明其容器注解违反 JLS (Java Language Specification) 的可重复注解类

> **问题**：[KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将检查可重复注解的容器注解是否满足 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3) 中的相同要求：数组类型的值方法、保留策略和目标
>
> **弃用周期**：
>
> - 1.5.30：对违反 JLS 要求的可重复容器注解声明引入警告（在渐进模式下为错误）
> - 1.6.0：将此警告提升为错误，可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 临时禁用错误报告

### 禁止在可重复注解类中声明名为 Container 的嵌套类

> **问题**：[KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将检查在 Kotlin 中声明的可重复注解是否不包含预定义名称为 `Container` 的嵌套类
>
> **弃用周期**：
>
> - 1.5.30：对 Kotlin 可重复注解类中名为 `Container` 的嵌套类引入警告（在渐进模式下为错误）
> - 1.6.0：将此警告提升为错误，可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 临时禁用错误报告

### 禁止在覆盖接口属性的主构造函数中的属性上使用 @JvmField

> **问题**：[KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将禁止在主构造函数中声明的、且覆盖接口属性的属性上使用 `@JvmField` 注解
>
> **弃用周期**：
>
> - 1.5.20：对主构造函数中此类属性上的 `@JvmField` 注解引入警告
> - 1.6.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` 临时禁用错误报告

### 弃用编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **问题**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **组件**：Kotlin/JVM
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6.20 将对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式的使用发出警告
>
> **弃用周期**：
>
> - 1.6.20：对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.8.0：将此警告提升为错误

### 禁止公共 ABI (Application Binary Interface) 内联函数中的 super 调用

> **问题**：[KT-45379](https://youtrack.com/issue/KT-45379)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将禁止从公共或保护内联函数和属性中调用带有 `super` 限定符的函数
>
> **弃用周期**：
>
> - 1.5.0：对公共或保护内联函数或属性访问器中的 super 调用引入警告
> - 1.6.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitSuperCallsFromPublicInline` 临时禁用错误报告

### 禁止公共内联函数中的保护构造函数调用

> **问题**：[KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将禁止从公共或保护内联函数和属性中调用保护构造函数
>
> **弃用周期**：
>
> - 1.4.30：对公共或保护内联函数或属性访问器中的保护构造函数调用引入警告
> - 1.6.0：将此警告提升为错误，可以使用 `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` 临时禁用错误报告

### 禁止从文件内私有类型中暴露私有嵌套类型

> **问题**：[KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将禁止从文件内私有类型中暴露私有嵌套类型和内部类
>
> **弃用周期**：
>
> - 1.5.0：对从文件内私有类型中暴露的私有类型引入警告
> - 1.6.0：将此警告提升为错误，可以使用 `-XXLanguage:-PrivateInFileEffectiveVisibility` 临时禁用错误报告

### 在类型上的注解的某些情况下未分析注解目标

> **问题**：[KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将不再允许在不应适用于类型的类型上使用注解
>
> **弃用周期**：
>
> - 1.5.20：在渐进模式下引入错误
> - 1.6.0：引入错误，可以使用 `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` 临时禁用错误报告

### 禁止调用名为 suspend 且带有尾随 lambda 的函数

> **问题**：[KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 1.6 将不再允许调用名为 `suspend` 且其单一函数类型参数作为尾随 lambda 传递的函数
>
> **弃用周期**：
>
> - 1.3.0：对此类函数调用引入警告
> - 1.6.0：将此警告提升为错误
> - &gt;= 1.7.0：对语言语法引入变更，以便 `{` 之前的 `suspend` 被解析为关键字

## 标准库

### 移除 minus/removeAll/retainAll 中脆弱的 contains 优化

> **问题**：[KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：行为
>
> **简要摘要**：Kotlin 1.6 将不再对从集合/迭代器/数组/序列中移除多个元素的函数和运算符的参数执行转换为 Set (集合) 的操作。
>
> **弃用周期**：
>
> - < 1.6：旧行为：参数在某些情况下会被转换为 Set
> - 1.6.0：如果函数参数是集合，它不再转换为 `Set`。如果它不是集合，则可以转换为 `List`。通过设置系统属性 `kotlin.collections.convert_arg_to_set_in_removeAll=true`，可以在 JVM 上临时恢复旧行为
> - &gt;= 1.7：上述系统属性将不再生效

### 更改 Random.nextLong 中的值生成算法

> **问题**：[KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：行为
>
> **简要摘要**：Kotlin 1.6 更改了 `Random.nextLong` 函数中的值生成算法，以避免生成超出指定范围的值。
>
> **弃用周期**：
>
> - 1.6.0：行为立即得到修复

### 逐步将集合 min 和 max 函数的返回类型更改为非可空

> **问题**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：集合 `min` 和 `max` 函数的返回类型将在 Kotlin 1.7 中更改为非可空
>
> **弃用周期**：
>
> - 1.4.0：引入 `...OrNull` 函数作为同义词，并弃用受影响的 API（详见问题）
> - 1.5.0：将受影响 API 的弃用级别提升为错误
> - 1.6.0：从公共 API 中隐藏已弃用的函数
> - &gt;= 1.7：重新引入受影响的 API，但返回类型为非可空

### 弃用浮点数组函数：contains, indexOf, lastIndexOf

> **问题**：[KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **组件**：kotlin-stdlib
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：Kotlin 弃用了浮点数组函数 `contains`、`indexOf`、`lastIndexOf`，这些函数使用 IEEE-754 顺序而不是全序（total order）来比较值
>
> **弃用周期**：
>
> - 1.4.0：对受影响的函数引入弃用警告
> - 1.6.0：将弃用级别提升为错误
> - &gt;= 1.7：从公共 API 中隐藏已弃用的函数

### 将声明从 kotlin.dom 和 kotlin.browser 包迁移到 kotlinx.*

> **问题**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：`kotlin.dom` 和 `kotlin.browser` 包中的声明已移至相应的 `kotlinx.*` 包，以准备将其从标准库中提取出来
>
> **弃用周期**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替代 API
> - 1.4.0：弃用 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并建议使用上述新 API 作为替代
> - 1.6.0：将弃用级别提升为错误
> - &gt;= 1.7：从标准库中移除已弃用的函数
> - &gt;= 1.7：将 `kotlinx.*` 包中的 API 移至单独的库

### 使 Kotlin/JS 中的 Regex.replace 函数不再内联

> **问题**：[KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：带有函数式 `transform` 参数的 `Regex.replace` 函数在 Kotlin/JS 中将不再是内联的
>
> **弃用周期**：
>
> - 1.6.0：从受影响的函数中移除 `inline` 修饰符

### 当替换字符串包含组引用时，JVM 和 JS 中 Regex.replace 函数的行为差异

> **问题**：[KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：行为
>
> **简要摘要**：Kotlin/JS 中带有替换模式字符串的 `Regex.replace` 函数将遵循与 Kotlin/JVM 中相同的模式语法
>
> **弃用周期**：
>
> - 1.6.0：更改 Kotlin/JS 标准库中 `Regex.replace` 的替换模式处理方式

### 在 JS Regex 中使用 Unicode 大小写折叠

> **问题**：[KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：行为
>
> **简要摘要**：Kotlin/JS 中的 `Regex` 类在调用底层 JS 正则表达式引擎时将使用 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 标志，以根据 Unicode 规则搜索和比较字符。这会带来对 JS 环境的某些版本要求，并导致对正则表达式模式字符串中不必要的转义进行更严格的验证。
>
> **弃用周期**：
>
> - 1.5.0：在 JS `Regex` 类的多数函数中启用 Unicode 大小写折叠
> - 1.6.0：在 `Regex.replaceFirst` 函数中启用 Unicode 大小写折叠

### 弃用部分仅限 JS 的 API

> **问题**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：标准库中一些仅限 JS 的函数被弃用并计划移除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比较函数的数组 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **弃用周期**：
>
> - 1.6.0：对受影响的函数引入弃用警告
> - 1.7.0：将弃用级别提升为错误
> - 1.8.0：从公共 API 中移除已弃用的函数

### 从 Kotlin/JS 类的公共 API 中隐藏实现和互操作性特定函数

> **问题**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**：kotlin-stdlib (JS)
>
> **不兼容变更类型**：源代码, 二进制
>
> **简要摘要**：`HashMap.createEntrySet` 和 `AbstactMutableCollection.toJSON` 函数的可见性将更改为 internal（内部）
>
> **弃用周期**：
>
> - 1.6.0：使这些函数变为 internal，从而将其从公共 API 中移除

## 工具

### 弃用 KotlinGradleSubplugin 类

> **问题**：[KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：`KotlinGradleSubplugin` 类将被弃用，转而使用 `KotlinCompilerPluginSupportPlugin`。
>
> **弃用周期**：
>
> - 1.6.0：将弃用级别提升为错误
> - &gt;= 1.7.0：移除已弃用的类

### 移除 kotlin.useFallbackCompilerSearch 构建选项

> **问题**：[KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：移除已弃用的 'kotlin.useFallbackCompilerSearch' 构建选项
>
> **弃用周期**：
>
> - 1.5.0：将弃用级别提升为警告
> - 1.6.0：移除已弃用的选项

### 移除几个编译器选项

> **问题**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：移除已弃用的 `noReflect` 和 `includeRuntime` 编译器选项
>
> **弃用周期**：
>
> - 1.5.0：将弃用级别提升为错误
> - 1.6.0：移除已弃用的选项

### 弃用 useIR 编译器选项

> **问题**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：隐藏已弃用的 `useIR` 编译器选项
>
> **弃用周期**：
>
> - 1.5.0：将弃用级别提升为警告
> - 1.6.0：隐藏该选项
> - &gt;= 1.7.0：移除已弃用的选项

### 弃用 kapt.use.worker.api Gradle 属性

> **问题**：[KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：弃用 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 kapt（默认值：true）
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
> **不兼容变更类型**：源代码
>
> **简要摘要**：移除 `kotlin.parallel.tasks.in.project` 属性
>
> **弃用周期**：
>
> - 1.5.20：将弃用级别提升为警告
> - 1.6.20：移除此属性

### 弃用 kotlin.experimental.coroutines Gradle DSL 选项和 kotlin.coroutines Gradle 属性

> **问题**：[KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **组件**：Gradle
>
> **不兼容变更类型**：源代码
>
> **简要摘要**：弃用 `kotlin.experimental.coroutines` Gradle DSL 选项和 `kotlin.coroutines` 属性
>
> **弃用周期**：
>
> - 1.6.20：将弃用级别提升为警告
> - &gt;= 1.7.0：移除 DSL 选项和属性