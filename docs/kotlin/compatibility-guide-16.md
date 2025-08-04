[//]: # (title: Kotlin 1.6 兼容性指南)

_[保持语言现代化](kotlin-evolution-principles.md)_ 和 _[舒适更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计中的基本原则。前者指出，阻碍语言演进的构造应该被移除；后者指出，这种移除应该提前充分沟通，以便代码迁移尽可能顺利。

虽然大多数语言变更已通过其他渠道（例如更新日志或编译器警告）宣布，但本文档总结了所有这些变更，为从 Kotlin 1.5 迁移到 Kotlin 1.6 提供了完整的参考。

## 基本术语

本文档介绍了以下几种兼容性：

- _源代码_：源代码不兼容的变更会使原本能够正常编译（无错误或警告）的代码无法再编译。
- _二进制_：如果两个二进制 artifact 相互替换不会导致加载或链接错误，则称它们是二进制兼容的。
- _行为_：如果同一个程序在应用变更前后表现出不同行为，则称该变更行为不兼容。

请记住，这些定义仅针对纯 Kotlin 代码给出。从其他语言（例如 Java）的角度来看的 Kotlin 代码兼容性不在本文档的讨论范围之内。

## 语言

### 默认情况下使带有 enum、sealed 和 Boolean 类型主体的 when 语句穷尽所有情况

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将对 `when` 语句使用 `enum`、`sealed` 或 `Boolean` 类型的主体但未穷尽所有情况时发出警告。
>
> **Deprecation cycle**:
>
> - 1.6.0: 当 `when` 语句使用 `enum`、`sealed` 或 `Boolean` 类型的主体但未穷尽时引入警告（在渐进模式下为错误）。
> - 1.7.0: 将此警告提升为错误。

### 废弃 when-with-subject 中易混淆的语法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将废弃 `when` 条件表达式中几个易混淆的语法构造。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对受影响的表达式引入废弃警告。
> - 1.8.0: 将此警告提升为错误。
> - &gt;= 1.8: 将一些已废弃的构造用于新的语言特性。

### 禁止在伴生对象和嵌套对象的超类构造函数调用中访问类成员

> **Issue**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将对伴生对象和常规对象的超类构造函数调用的实参报告错误，如果此类实参的接收者引用了包含声明。
>
> **Deprecation cycle**:
>
> - 1.5.20: 对存在问题的实参引入警告。
> - 1.6.0: 将此警告提升为错误。
> - `-XXLanguage:-ProhibitSelfCallsInNestedObjects` 可用于暂时恢复到 1.6 之前的行为。

### 类型可空性增强改进

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 将改变其加载和解释 Java 代码中类型可空性注解的方式。
>
> **Deprecation cycle**:
>
> - 1.4.30: 对更精确的类型可空性可能导致错误的情况引入警告。
> - 1.7.0: 推断更精确的 Java 类型可空性。
> - `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 可用于暂时恢复到 1.7 之前的行为。

### 阻止不同数字类型之间的隐式强制转换

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 将避免在语义上只需要向下转型为原始数字类型的情况下，自动将数值转换为原始数字类型。
>
> **Deprecation cycle**:
>
> - &lt; 1.5.30: 所有受影响情况下的旧行为。
> - 1.5.30: 修复生成的属性委托访问器中的向下转型行为。
> - `-Xuse-old-backend` 可用于暂时恢复到 1.5.30 修复之前的行为。
> - &gt;= 1.6.20: 修复其他受影响情况下的向下转型行为。

### 禁止声明容器注解违反 JLS 规范的可重复注解类

> **Issue**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将检测可重复注解的容器注解是否满足 JLS 9.6.3 中相同的要求：数组类型的 value 方法、保留策略和目标。
>
> **Deprecation cycle**:
>
> - 1.5.30: 对违反 JLS 要求的可重复容器注解声明引入警告（在渐进模式下为错误）。
> - 1.6.0: 将此警告提升为错误。
> - `-XXLanguage:-RepeatableAnnotationContainerConstraints` 可用于暂时禁用错误报告。

### 禁止在可重复注解类中声明名为 Container 的嵌套类

> **Issue**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将检测在 Kotlin 中声明的可重复注解是否具有名为 `Container` 的嵌套类。
>
> **Deprecation cycle**:
>
> - 1.5.30: 对 Kotlin 可重复注解类中名为 `Container` 的嵌套类引入警告（在渐进模式下为错误）。
> - 1.6.0: 将此警告提升为错误。
> - `-XXLanguage:-RepeatableAnnotationContainerConstraints` 可用于暂时禁用错误报告。

### 禁止在覆盖接口属性的主构造函数中的属性上使用 @JvmField 注解

> **Issue**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将禁止在主构造函数中声明并覆盖接口属性的属性上使用 `@JvmField` 注解。
>
> **Deprecation cycle**:
>
> - 1.5.20: 对主构造函数中此类属性上的 `@JvmField` 注解引入警告。
> - 1.6.0: 将此警告提升为错误。
> - `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` 可用于暂时禁用错误报告。

### 废弃编译器选项 -Xjvm-default 的 enable 和 compatibility 模式

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20 将对使用 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式发出警告。
>
> **Deprecation cycle**:
>
> - 1.6.20: 对 `-Xjvm-default` 编译器选项的 `enable` 和 `compatibility` 模式引入警告。
> - &gt;= 1.8.0: 将此警告提升为错误。

### 禁止从公共 ABI inline 函数中调用 super

> **Issue**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将禁止从公共或保护型的 inline 函数和属性中调用带有 `super` 限定符的函数。
>
> **Deprecation cycle**:
>
> - 1.5.0: 对从公共或保护型的 inline 函数或属性访问器中调用 `super` 引入警告。
> - 1.6.0: 将此警告提升为错误。
> - `-XXLanguage:-ProhibitSuperCallsFromPublicInline` 可用于暂时禁用错误报告。

### 禁止从公共 inline 函数中调用保护型构造函数

> **Issue**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将禁止从公共或保护型的 inline 函数和属性中调用保护型构造函数。
>
> **Deprecation cycle**:
>
> - 1.4.30: 对从公共或保护型的 inline 函数或属性访问器中调用保护型构造函数引入警告。
> - 1.6.0: 将此警告提升为错误。
> - `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` 可用于暂时禁用错误报告。

### 禁止从文件内私有类型中暴露私有嵌套类型

> **Issue**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将禁止从文件内私有类型中暴露私有嵌套类型和内部类。
>
> **Deprecation cycle**:
>
> - 1.5.0: 对从文件内私有类型中暴露私有类型引入警告。
> - 1.6.0: 将此警告提升为错误。
> - `-XXLanguage:-PrivateInFileEffectiveVisibility` 可用于暂时禁用错误报告。

### 针对类型上的注解，在某些情况下不再分析注解目标

> **Issue**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将不再允许在不适用于类型的类型上使用注解。
>
> **Deprecation cycle**:
>
> - 1.5.20: 在渐进模式下引入错误。
> - 1.6.0: 引入错误。
> - `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` 可用于暂时禁用错误报告。

### 禁止调用名为 suspend 且带尾部 lambda 表达式的函数

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 将不再允许调用名为 `suspend` 且其单一函数类型实参以尾部 lambda 表达式形式传递的函数。
>
> **Deprecation cycle**:
>
> - 1.3.0: 对此类函数调用引入警告。
> - 1.6.0: 将此警告提升为错误。
> - &gt;= 1.7.0: 对语言语法引入变更，以便将 `{` 前的 `suspend` 解析为关键字。

## 标准库

### 移除 minus/removeAll/retainAll 中脆弱的 contains 优化

> **Issue**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.6 将不再对从集合/可迭代对象/数组/序列中移除多个元素的函数和操作符的实参执行转换为 `set` 的优化。
>
> **Deprecation cycle**:
>
> - &lt; 1.6: 旧行为：在某些情况下实参会转换为 `set`。
> - 1.6.0: 如果函数实参是集合，则不再转换为 `Set`。如果不是集合，则可以转换为 `List`。
> 旧行为可以通过设置系统属性 `kotlin.collections.convert_arg_to_set_in_removeAll=true` 在 JVM 上暂时恢复。
> - &gt;= 1.7: 上述系统属性将不再生效。

### 更改 Random.nextLong 中的值生成算法

> **Issue**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.6 更改了 `Random.nextLong` 函数中的值生成算法，以避免生成超出指定区间的值。
>
> **Deprecation cycle**:
>
> - 1.6.0: 行为立即修复。

### 逐步将集合 min 和 max 函数的返回类型更改为非空的

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 中集合 `min` 和 `max` 函数的返回类型将更改为非空的。
>
> **Deprecation cycle**:
>
> - 1.4.0: 引入 `...OrNull` 函数作为同义函数，并废弃受影响的 API（详情请参见 issue）。
> - 1.5.0: 将受影响 API 的废弃级别提升为错误。
> - 1.6.0: 从公共 API 中隐藏已废弃函数。
> - &gt;= 1.7: 重新引入受影响的 API，但返回类型为非空的。

### 废弃浮点数数组函数：contains、indexOf、lastIndexOf

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 废弃了浮点数数组函数 `contains`、`indexOf`、`lastIndexOf`，这些函数使用 IEEE-754 顺序而不是全序比较值。
>
> **Deprecation cycle**:
>
> - 1.4.0: 以警告废弃受影响的函数。
> - 1.6.0: 将废弃级别提升为错误。
> - &gt;= 1.7: 从公共 API 中隐藏已废弃函数。

### 将 kotlin.dom 和 kotlin.browser 包中的声明迁移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` 和 `kotlin.browser` 包中的声明已移至对应的 `kotlinx.*` 包中，以准备将其从标准库中提取。
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 包中引入替代 API。
> - 1.4.0: 废弃 `kotlin.dom` 和 `kotlin.browser` 包中的 API，并建议使用上述新 API 作为替代。
> - 1.6.0: 将废弃级别提升为错误。
> - &gt;= 1.7: 从标准库中移除已废弃函数。
> - &gt;= 1.7: 将 `kotlinx.*` 包中的 API 移至单独的库。

### 使 Kotlin/JS 中的 Regex.replace 函数不再 inline

> **Issue**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin/JS 中带有函数式 `transform` 形参的 `Regex.replace` 函数将不再是 `inline` 函数。
>
> **Deprecation cycle**:
>
> - 1.6.0: 从受影响的函数中移除 `inline` 修饰符。

### 当替换字符串包含组引用时，JVM 和 JS 中 Regex.replace 函数的不同行为

> **Issue**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/JS 中带有替换模式字符串的 `Regex.replace` 函数将遵循与 Kotlin/JVM 中相同的模式语法。
>
> **Deprecation cycle**:
>
> - 1.6.0: 更改 Kotlin/JS 标准库中 `Regex.replace` 的替换模式处理。

### 在 JS Regex 中使用 Unicode 大小写折叠

> **Issue**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/JS 中的 `Regex` 类在调用底层 JS 正则表达式引擎时，将使用 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 标志来根据 Unicode 规则搜索和比较字符。这带来特定的 JS 环境版本要求，并导致对不必要的转义进行更严格的验证。
>
> **Deprecation cycle**:
>
> - 1.5.0: 在 JS `Regex` 类的多数函数中启用 Unicode 大小写折叠。
> - 1.6.0: 在 `Regex.replaceFirst` 函数中启用 Unicode 大小写折叠。

### 废弃一些仅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 标准库中一些仅限 JS 的函数将被废弃并移除。其中包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比较函数的数组 `sort` 函数，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **Deprecation cycle**:
>
> - 1.6.0: 以警告废弃受影响的函数。
> - 1.7.0: 将废弃级别提升为错误。
> - 1.8.0: 从公共 API 中移除已废弃函数。

### 从 Kotlin/JS 类的公共 API 中隐藏实现和互操作特有的函数

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 函数 `HashMap.createEntrySet` 和 `AbstactMutableCollection.toJSON` 的可见性将更改为 `internal`。
>
> **Deprecation cycle**:
>
> - 1.6.0: 将这些函数设为 `internal`，从而从公共 API 中移除它们。

## 工具

### 废弃 KotlinGradleSubplugin 类

> **Issue**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinGradleSubplugin` 类将被废弃，转而支持 `KotlinCompilerPluginSupportPlugin`。
>
> **Deprecation cycle**:
>
> - 1.6.0: 将废弃级别提升为错误。
> - &gt;= 1.7.0: 移除已废弃的类。

### 移除 kotlin.useFallbackCompilerSearch 构建选项

> **Issue**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除已废弃的 `kotlin.useFallbackCompilerSearch` 构建选项。
>
> **Deprecation cycle**:
>
> - 1.5.0: 将废弃级别提升为警告。
> - 1.6.0: 移除已废弃的选项。

### 移除几个编译器选项

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除已废弃的 `noReflect` 和 `includeRuntime` 编译器选项。
>
> **Deprecation cycle**:
>
> - 1.5.0: 将废弃级别提升为错误。
> - 1.6.0: 移除已废弃的选项。

### 废弃 useIR 编译器选项

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 隐藏已废弃的 `useIR` 编译器选项。
>
> **Deprecation cycle**:
>
> - 1.5.0: 将废弃级别提升为警告。
> - 1.6.0: 隐藏该选项。
> - &gt;= 1.7.0: 移除已废弃的选项。

### 废弃 kapt.use.worker.api Gradle 属性

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 废弃 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 kapt（默认值：`true`）。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将废弃级别提升为警告。
> - &gt;= 1.8.0: 移除此属性。

### 移除 kotlin.parallel.tasks.in.project Gradle 属性

> **Issue**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `kotlin.parallel.tasks.in.project` 属性。
>
> **Deprecation cycle**:
>
> - 1.5.20: 将废弃级别提升为警告。
> - 1.6.20: 移除此属性。

### 废弃 kotlin.experimental.coroutines Gradle DSL 选项和 kotlin.coroutines Gradle 属性

> **Issue**: [KT-50369](https://youtrack.com/issue/KT-50369)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 废弃 `kotlin.experimental.coroutines` Gradle DSL 选项和 `kotlin.coroutines` 属性。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将废弃级别提升为警告。
> - &gt;= 1.7.0: 移除 DSL 选项和属性。