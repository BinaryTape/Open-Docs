---
title: "Kotlin 1.6 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的根本原则。前者指出，应移除阻碍语言发展的结构；后者指出，应提前充分沟通移除行为，以尽可能平滑地进行代码迁移。

虽然大多数语言变更已经通过其他渠道（如更新日志或编译器警告）发布，但本文档将它们全部汇总，为从 Kotlin 1.5 迁移到 Kotlin 1.6 提供完整的参考。

## 基本术语

在本文档中，我们介绍了几种兼容性：

- _source（源码）_: 源码不兼容变更会导致原本能够正常编译（没有错误或警告）的代码无法再编译
- _binary（二进制）_: 如果互换两个二进制工件不会导致加载或链接错误，则称这两个二进制工件是二进制兼容的
- _behavioral（行为）_: 如果同一个程序在应用变更前后表现出不同的行为，则称该变更在行为上是不兼容的

请记住，这些定义仅适用于纯 Kotlin。Kotlin 代码从其他语言的角度来看的兼容性（例如，从 Java 来看）不在本文档的范围之内。

## 语言

### 默认情况下，使枚举、密封类和 Boolean 类型的 `when` 语句具有穷尽性

> **问题**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将会针对 enum（枚举）、sealed（密封类）或 Boolean 类型的 `when` 语句不具有穷尽性发出警告
>
> **弃用周期**:
>
> - 1.6.0: 当 enum（枚举）、sealed（密封类）或 Boolean 类型的 `when` 语句不具有穷尽性时，引入一个警告（在 progressive 模式下为错误）
> - 1.7.0: 将此警告升级为错误

### 弃用 `when` 语句中令人困惑的语法

> **问题**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将弃用 `when` 条件表达式中几个令人困惑的语法结构
>
> **弃用周期**:
>
> - 1.6.20: 对受影响的表达式引入弃用警告
> - 1.8.0: 将此警告升级为错误
> - &gt;= 1.8: 将一些已弃用的结构重新用于新的语言特性

### 禁止在伴生对象和嵌套对象的超类构造函数调用中访问类成员

> **问题**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简述**: 如果伴生对象和普通对象的超类构造函数调用的参数引用了包含声明，则 Kotlin 1.6 将报告一个错误
>
> **弃用周期**:
>
> - 1.5.20: 在有问题的参数上引入一个警告
> - 1.6.0: 将此警告升级为错误，可以使用 `-XXLanguage:-ProhibitSelfCallsInNestedObjects` 临时恢复到 1.6 之前的行为

### 改进类型空值性增强

> **问题**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.7 将更改其加载和解释 Java 代码中类型空值性注解的方式
>
> **弃用周期**:
>
> - 1.4.30: 针对更精确的类型空值性可能导致错误的情况引入警告
> - 1.7.0: 推断 Java 类型的更精确的空值性，可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 临时恢复到 1.7 之前的行为

### 阻止不同数值类型之间的隐式强制转换

> **问题**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 行为
>
> **简述**: Kotlin 将避免自动将数值转换为基本数值类型，而语义上只需要向下转换到该类型
>
> **弃用周期**:
>
> - < 1.5.30: 所有受影响情况下的旧行为
> - 1.5.30: 修复生成的属性委托访问器中的向下转换行为，可以使用 `-Xuse-old-backend` 临时恢复到 1.5.30 之前的修复行为
> - &gt;= 1.6.20: 修复其他受影响情况下的向下转换行为

### 禁止声明容器注解违反 JLS 的可重复注解类

> **问题**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将检查可重复注解的容器注解是否满足与 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3) 中相同的要求：数组类型的 value 方法、retention 和 target
>
> **弃用周期**:
>
> - 1.5.30: 在违反 JLS 要求的可重复容器注解声明上引入警告（在 progressive 模式下为错误）
> - 1.6.0: 将此警告升级为错误，可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 临时禁用错误报告

### 禁止在可重复注解类中声明名为 Container 的嵌套类

> **问题**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将检查在 Kotlin 中声明的可重复注解是否具有具有预定义名称 `Container` 的嵌套类
>
> **弃用周期**:
>
> - 1.5.30: 在 Kotlin 可重复注解类中，对名为 `Container` 的嵌套类引入警告（在 progressive 模式下为错误）
> - 1.6.0: 将此警告升级为错误，可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 临时禁用错误报告

### 禁止在覆盖接口属性的主构造函数中的属性上使用 @JvmField 注解

> **问题**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将禁止使用 `@JvmField` 注解来注解在覆盖接口属性的主构造函数中声明的属性
>
> **弃用周期**:
>
> - 1.5.20: 在主构造函数中对此类属性上的 `@JvmField` 注解引入警告
> - 1.6.0: 将此警告升级为错误，可以使用 `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` 临时禁用错误报告

### 弃用编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **问题**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **组件**: Kotlin/JVM
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6.20 将警告使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式
>
> **弃用周期**:
>
> - 1.6.20: 对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.8.0: 将此警告升级为错误

### 禁止从 public-abi 内联函数进行超类调用

> **问题**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将禁止从 public 或 protected inline（内联）函数和属性中使用 `super` 限定符调用函数
>
> **弃用周期**:
>
> - 1.5.0: 对从 public 或 protected inline（内联）函数或属性访问器进行超类调用引入警告
> - 1.6.0: 将此警告升级为错误，可以使用 `-XXLanguage:-ProhibitSuperCallsFromPublicInline` 临时禁用错误报告

### 禁止从 public 内联函数调用 protected 构造函数

> **问题**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将禁止从 public 或 protected inline（内联）函数和属性调用 protected 构造函数
>
> **弃用周期**:
>
> - 1.4.30: 对从 public 或 protected inline（内联）函数或属性访问器调用 protected 构造函数引入警告
> - 1.6.0: 将此警告升级为错误，可以使用 `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` 临时禁用错误报告

### 禁止从 file-private 类型暴露 private 嵌套类型

> **问题**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将禁止从 file-private 类型暴露 private 嵌套类型和内部类
>
> **弃用周期**:
>
> - 1.5.0: 对从 file-private 类型暴露 private 类型引入警告
> - 1.6.0: 将此警告升级为错误，可以使用 `-XXLanguage:-PrivateInFileEffectiveVisibility` 临时禁用错误报告

### 在某些情况下，类型上的注解未分析注解目标

> **问题**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将不再允许在不应适用于类型的类型上使用注解
>
> **弃用周期**:
>
> - 1.5.20: 在 progressive 模式下引入错误
> - 1.6.0: 引入错误，可以使用 `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` 临时禁用错误报告

### 禁止调用名为 suspend 且带有尾随 lambda 的函数

> **问题**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **组件**: 核心语言
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 1.6 将不再允许调用名为 `suspend` 的函数，该函数具有作为尾随 lambda 传递的函数类型（functional type）的单个参数
>
> **弃用周期**:
>
> - 1.3.0: 对此类函数调用引入警告
> - 1.6.0: 将此警告升级为错误
> - &gt;= 1.7.0: 引入对语言语法的更改，以便将 `{` 之前的 `suspend` 解析为关键字

## 标准库

### 移除 minus/removeAll/retainAll 中脆弱的 contains 优化

> **问题**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 行为
>
> **简述**: Kotlin 1.6 将不再对从 collection/iterable/array/sequence 中移除多个元素的函数和运算符的参数执行转换为 set 的操作。
>
> **弃用周期**:
>
> - < 1.6: 旧行为：在某些情况下，参数会转换为 set
> - 1.6.0: 如果函数参数是一个 collection（集合），则不再将其转换为 `Set`。如果它不是一个 collection（集合），则可以转换为 `List`。
> 可以通过设置系统属性 `kotlin.collections.convert_arg_to_set_in_removeAll=true` 在 JVM 上临时恢复旧行为
> - &gt;= 1.7: 上述系统属性将不再生效

### 更改 Random.nextLong 中的值生成算法

> **问题**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 行为
>
> **简述**: Kotlin 1.6 更改了 `Random.nextLong` 函数中的值生成算法，以避免生成超出指定范围的值。
>
> **弃用周期**:
>
> - 1.6.0: 立即修复该行为

### 逐步将 collection 的 min 和 max 函数的返回类型更改为 non-nullable（非空）

> **问题**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源码
>
> **简述**: collection 的 `min` 和 `max` 函数的返回类型将在 Kotlin 1.7 中更改为 non-nullable（非空）
>
> **弃用周期**:
>
> - 1.4.0: 引入 `...OrNull` 函数作为同义词，并弃用受影响的 API（请参阅问题中的详细信息）
> - 1.5.0: 将受影响的 API 的弃用级别提高到错误
> - 1.6.0: 从公共 API 中隐藏已弃用的函数
> - &gt;= 1.7: 重新引入受影响的 API，但具有 non-nullable（非空）返回类型

### 弃用浮点数数组函数：contains、indexOf、lastIndexOf

> **问题**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **组件**: kotlin-stdlib
>
> **不兼容变更类型**: 源码
>
> **简述**: Kotlin 弃用浮点数数组函数 `contains`、`indexOf`、`lastIndexOf`，这些函数使用 IEEE-754 顺序而不是总顺序比较值
>
> **弃用周期**:
>
> - 1.4.0: 弃用受影响的函数并发出警告
> - 1.6.0: 将弃用级别提高到错误
> - &gt;= 1.7: 从公共 API 中隐藏已弃用的函数

### 将声明从 kotlin.dom 和 kotlin.browser 包迁移到 kotlinx.*

> **问题**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 源码
>
> **简述**: 来自 `kotlin.dom` 和 `kotlin.browser` 包的声明被移动到相应的 `kotlinx.*` 包中，以为从 stdlib 中提取它们做准备
>
> **弃用周期**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替换 API
> - 1.4.0: 弃用 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并建议使用上面的新 API 作为替代
> - 1.6.0: 将弃用级别提高到错误
> - &gt;= 1.7: 从 stdlib 中删除已弃用的函数
> - &gt;= 1.7: 将 kotlinx.* 包中的 API 移动到单独的库

### 使 Kotlin/JS 中的 Regex.replace 函数变为非内联（non inline）

> **问题**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 源码
>
> **简述**: 带有函数式 `transform` 参数的 `Regex.replace` 函数在 Kotlin/JS 中将不再是内联的（inline）
>
> **弃用周期**:
>
> - 1.6.0: 从受影响的函数中删除 `inline` 修饰符

### 当替换字符串包含组引用时，JVM 和 JS 中 Regex.replace 函数的行为不同

> **问题**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 行为
>
> **简述**: 具有替换模式字符串的 Kotlin/JS 中的函数 `Regex.replace` 将遵循与 Kotlin/JVM 中该模式相同的语法
>
> **弃用周期**:
>
> - 1.6.0: 更改 Kotlin/JS stdlib 中 `Regex.replace` 的替换模式处理

### 在 JS Regex 中使用 Unicode 大小写折叠

> **问题**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 行为
>
> **简述**: Kotlin/JS 中的 `Regex` 类在调用底层 JS 正则表达式引擎以根据 Unicode 规则搜索和比较字符时，将使用 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 标志。
> 这带来对 JS 环境的某些版本要求，并导致对 regex 模式字符串中不必要的转义进行更严格的验证。
>
> **弃用周期**:
>
> - 1.5.0: 在 JS `Regex` 类的大多数函数中启用 Unicode 大小写折叠
> - 1.6.0: 在 `Regex.replaceFirst` 函数中启用 Unicode 大小写折叠

### 弃用一些仅限 JS 的 API

> **问题**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 源码
>
> **简述**: stdlib 中的许多仅限 JS 的函数已被弃用以供删除。它们包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)` 以及在数组上采用比较函数的 `sort` 函数，例如，`Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **弃用周期**:
>
> - 1.6.0: 弃用受影响的函数并发出警告
> - 1.7.0: 将弃用级别提高到错误
> - 1.8.0: 从公共 API 中删除已弃用的函数

### 从 Kotlin/JS 类中的公共 API 中隐藏特定于实现和互操作的函数

> **问题**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **组件**: kotlin-stdlib (JS)
>
> **不兼容变更类型**: 源码，二进制
>
> **简述**: 函数 `HashMap.createEntrySet` 和 `AbstactMutableCollection.toJSON` 将其可见性更改为 internal
>
> **弃用周期**:
>
> - 1.6.0: 使函数变为 internal，从而从公共 API 中删除它们

## 工具

### 弃用 KotlinGradleSubplugin 类

> **问题**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简述**: 类 `KotlinGradleSubplugin` 将被弃用，转而使用 `KotlinCompilerPluginSupportPlugin`
>
> **弃用周期**:
>
> - 1.6.0: 将弃用级别提高到错误
> - &gt;= 1.7.0: 删除已弃用的类

### 删除 kotlin.useFallbackCompilerSearch 构建选项

> **问题**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简述**: 删除已弃用的 'kotlin.useFallbackCompilerSearch' 构建选项
>
> **弃用周期**:
>
> - 1.5.0: 将弃用级别提高到警告
> - 1.6.0: 删除已弃用的选项

### 删除几个编译器选项

> **问题**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简述**: 删除已弃用的 `noReflect` 和 `includeRuntime` 编译器选项
>
> **弃用周期**:
>
> - 1.5.0: 将弃用级别提高到错误
> - 1.6.0: 删除已弃用的选项

### 弃用 useIR 编译器选项

> **问题**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简述**: 隐藏已弃用的 `useIR` 编译器选项
>
> **弃用周期**:
>
> - 1.5.0: 将弃用级别提高到警告
> - 1.6.0: 隐藏该选项
> - &gt;= 1.7.0: 删除已弃用的选项

### 弃用 kapt.use.worker.api Gradle 属性

> **问题**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简述**: 弃用 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 kapt (默认值: true)
>
> **弃用周期**:
>
> - 1.6.20: 将弃用级别提高到警告
> - &gt;= 1.8.0: 删除此属性

### 删除 kotlin.parallel.tasks.in.project Gradle 属性

> **问题**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简述**: 删除 `kotlin.parallel.tasks.in.project` 属性
>
> **弃用周期**:
>
> - 1.5.20: 将弃用级别提高到警告
> - 1.6.20: 删除此属性

### 弃用 kotlin.experimental.coroutines Gradle DSL 选项和 kotlin.coroutines Gradle 属性

> **问题**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **组件**: Gradle
>
> **不兼容变更类型**: 源码
>
> **简述**: 弃用 `kotlin.experimental.coroutines` Gradle DSL 选项和 `kotlin.coroutines` 属性
>
> **弃用周期**:
>
> - 1.6.20: 将弃用级别提高到警告
> - &gt;= 1.7.0: 删除 DSL 选项和属性