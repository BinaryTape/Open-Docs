[//]: # (title: Kotlin 2.0 兼容性指南)

《[保持语言现代性](kotlin-evolution-principles.md)》和《[舒适的更新](kotlin-evolution-principles.md)》是 Kotlin 语言设计中的基本原则。
前者指出应移除阻碍语言演进的构造，后者则要求预先充分沟通此类移除，以使代码迁移尽可能顺利。

虽然大多数语言变更已通过其他渠道（如更新的更新日志或编译器警告）公布，但本文档提供了从 Kotlin 1.9 迁移到 Kotlin 2.0 的完整参考。

> Kotlin K2 编译器作为 Kotlin 2.0 的一部分引入。有关新编译器的好处、迁移过程中可能遇到的变更以及如何回滚到旧编译器，请参阅 [K2 编译器迁移指南](k2-compiler-migration-guide.md)。
>
{style="note"}

## 基本术语

本文档引入了几种兼容性：

-   _源代码兼容性_：源代码不兼容变更会阻止过去编译正常（无错误或警告）的代码继续编译。
-   _二进制兼容性_：如果两个二进制制品可以相互替换而不会导致加载或链接错误，则称它们是二进制兼容的。
-   _行为兼容性_：如果同一程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的。

请记住，这些定义仅适用于纯 Kotlin。Kotlin 代码从其他语言角度（例如，从 Java）的兼容性不属于本文档的范围。

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

### 弃用在投影接收器上使用合成 setter

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 如果你使用 Java 类的合成 setter 赋值一个与该类投影类型冲突的类型，将触发错误。
>
> **Deprecation cycle**:
>
> - 1.8.20: 当合成属性 setter 在逆变位置具有投影参数类型，导致调用点参数类型不兼容时，报告警告。
> - 2.0.0: 将警告提升为错误。

### 当调用在 Java 子类中重载的、带有内联类参数的函数时，修正命名混淆 (mangling)

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 在函数调用中使用正确的命名混淆行为；要恢复到以前的行为，请使用 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 编译器选项。

### 修正逆变捕获类型的类型近似算法

> **Issue**: [KT-49404](https://youtrack.com/issue/KT-49404)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 对有问题的调用报告警告。
> - 2.0.0: 将警告提升为错误。

### 禁止在属性初始化前访问属性值

> **Issue**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 当在受影响的上下文（context）中属性在初始化前被访问时，报告错误。

### 当导入的类存在同名歧义时报告错误

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 当解析在多个通过星型导入 (star import) 导入的包中都存在的类名时，报告错误。

### 默认通过 `invokedynamic` 和 `LambdaMetafactory` 生成 Kotlin lambda 表达式

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；lambda 表达式默认使用 `invokedynamic` 和 `LambdaMetafactory` 生成。

### 禁止在需要表达式时 `if` 条件只有一个分支

> **Issue**: [KT-57871](https://youtrack.com/issue/KT-57871)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 如果 `if` 条件只有一个分支，则报告错误。

### 禁止通过传递泛型类型的星型投影来违反自身上限

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 当通过传递泛型类型的星型投影违反自身上限时，报告错误。

### 近似私有内联函数返回类型中的匿名类型

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 如果推断的返回类型包含匿名类型，则对私有内联函数报告警告。
> - 2.0.0: 将此类私有内联函数的返回类型近似为超类型。

### 改变重载解析行为，优先处理局部扩展函数调用而非局部函数类型属性的 `invoke` 约定

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新的重载解析行为；函数调用始终优先于 `invoke` 约定。

### 当二进制依赖的超类型发生变化导致继承成员冲突时报告错误

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.0: 当二进制依赖的超类型中发生继承成员冲突时，对声明报告警告 `CONFLICTING_INHERITED_MEMBERS_WARNING`。
> - 2.0.0: 将警告提升为错误：`CONFLICTING_INHERITED_MEMBERS`。

### 忽略不变类型中参数上的 `@UnsafeVariance` 注解

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；在报告逆变参数的类型不匹配错误时，会忽略 `@UnsafeVariance` 注解。

### 改变对伴生对象成员的非调用引用类型

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 对推断为非绑定引用的伴生对象函数引用类型报告警告。
> - 2.0.0: 改变行为，使伴生对象函数引用在所有使用上下文中均推断为绑定引用。

### 禁止私有内联函数暴露匿名类型

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.3.0: 对从私有内联函数返回的匿名对象的自身成员调用报告警告。
> - 2.0.0: 将此类私有内联函数的返回类型近似为超类型，并且不解析对匿名对象成员的调用。

### 在 `while` 循环中断后，对不健全的智能转换报告错误

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；可以通过切换到语言版本 1.9 来恢复旧行为。

### 当交集类型的变量被赋值一个非该交集类型子类型的值时报告错误

> **Issue**: [KT-53752](https://youtrack.com/issue/KT-53752)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 当具有交集类型的变量被赋值一个非该交集类型子类型的值时，报告错误。

### 当使用 SAM 构造器构造的接口包含需要显式选择加入 (opt-in) 的方法时，要求显式选择加入

> **Issue**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 对通过 SAM 构造器使用的 `OptIn` 报告警告。
> - 2.0.0: 对通过 SAM 构造器使用的 `OptIn` 将警告提升为错误（如果 `OptIn` 标记严重性为警告，则继续报告警告）。

### 禁止在类型别名构造器中违反上限

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 对在类型别名构造器中违反上限的情况引入警告。
> - 2.0.0: 在 K2 编译器中将警告提升为错误。

### 使解构变量的实际类型与指定时的显式类型保持一致

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；解构变量的实际类型现在与指定时的显式类型保持一致。

### 当调用具有默认值且需要显式选择加入的参数类型的构造器时，要求显式选择加入

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 对具有需要显式选择加入的参数类型的构造器调用报告警告。
> - 2.0.0: 将警告提升为错误（如果 `OptIn` 标记严重性为警告，则继续报告警告）。

### 当属性与枚举条目在同一作用域级别具有相同名称时报告歧义

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 当编译器解析到属性而非同一作用域级别的枚举条目时报告警告。
> - 2.0.0: 在 K2 编译器中，当编译器在同一作用域级别遇到同名属性和枚举条目时报告歧义（在旧编译器中保留警告不变）。

### 改变限定符解析行为，优先处理伴生属性而非枚举条目

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新的解析行为；伴生属性优先于枚举条目。

### 解析 `invoke` 调用接收器类型和 `invoke` 函数类型，如同它们以脱糖形式编写一样

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 独立解析 `invoke` 调用接收器类型和 `invoke` 函数类型，如同它们以脱糖形式编写一样。

### 禁止非私有内联函数暴露私有类成员

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 当从内部内联函数调用私有类伴生对象成员时，报告 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告。
> - 2.0.0: 将此警告提升为 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 错误。

### 修正投影泛型类型中明确非空类型的可空性

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；投影类型现在考虑所有就地非空类型。

### 改变前缀递增的推断类型，使其与 getter 的返回类型匹配，而非 `inc()` 操作符的返回类型

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；前缀递增的推断类型已更改为与 getter 的返回类型匹配，而非 `inc()` 操作符的返回类型。

### 在从超类中声明的泛型内部类继承内部类时，强制执行边界检查

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 当泛型内部超类的类型参数上限被违反时，报告错误。

### 禁止在预期类型是带有函数类型参数的函数类型时，将带有 SAM 类型的可调用引用赋值

> **Issue**: [KT-64342](https://youtrack.com/issue/KT-64342)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 当预期类型是带有函数类型参数的函数类型时，对带有 SAM 类型的可调用引用报告编译错误。

### 考虑伴生对象上的注解解析的伴生对象作用域

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；在伴生对象上的注解解析过程中，伴生对象作用域现在不会被忽略。

### 改变安全调用和约定操作符组合的求值语义

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.4.0: 对每个不正确的调用报告警告。
> - 2.0.0: 实现新的解析行为。

### 要求带有支持字段和自定义 setter 的属性立即初始化

> **Issue**: [KT-58589](https://youtrack.com/issue/KT-58589)
> 
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.9.20: 对没有主构造器的情况引入 `MUST_BE_INITIALIZED` 警告。
> - 2.0.0: 将警告提升为错误。

### 禁止在 `invoke` 操作符约定调用中对任意表达式进行 Unit 转换

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 当对变量和 `invoke` 解析中的任意表达式应用 Unit 转换时，报告错误；使用 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 编译器选项可保留受影响表达式的先前行为。

### 当通过安全调用访问 Java 字段时，禁止将可空值赋值给非空 Java 字段

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 如果将可空值赋值给非空 Java 字段，则报告错误。

### 当重写包含原始类型参数的 Java 方法时，要求使用星型投影类型

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；禁止对原始类型参数进行重写。

### 当 V 具有伴生对象时，改变 `(V)::foo` 引用解析行为

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.6.0: 对当前绑定到伴生对象实例的可调用引用报告警告。
> - 2.0.0: 实现新行为；在类型周围添加括号不再使其成为对该类型伴生对象实例的引用。

### 禁止在实际上是公共的内联函数中隐式访问非公共 API

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 当在公共内联函数中隐式访问非公共 API 时，报告编译警告。
> - 2.0.0: 将警告提升为错误。

### 禁止在属性 getter 上使用 use-site `get` 注解

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 对 getter 上的 use-site `get` 注解报告警告（在渐进模式下为错误）。
> - 2.0.0: 将警告提升为 `INAPPLICABLE_TARGET_ON_PROPERTY` 错误；使用 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 恢复为警告。

### 阻止在构建器推断 lambda 函数中将类型参数隐式推断到上限

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 当类型实参的类型参数无法推断到声明的上限时，报告警告（或在渐进模式下为错误）。
> - 2.0.0: 将警告提升为错误。

### 在公共签名中近似局部类型时保持可空性

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 柔性类型（flexible types）通过柔性超类型近似；当推断的声明具有非空类型但应为可空类型时，报告警告，提示显式指定类型以避免空指针异常（NPEs）。
> - 2.0.0: 可空类型通过可空超类型近似。

### 移除 `false && ...` 和 `false || ...` 在智能转换目的上的特殊处理

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 实现新行为；对 `false && ...` 和 `false || ...` 不再进行特殊处理。

### 禁止枚举中的内联开放函数

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 对枚举中的内联开放函数报告警告。
> - 2.0.0: 将警告提升为错误。

## 工具

### Gradle 中的可见性变更

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 以前，某些 Kotlin DSL 函数和属性本意用于特定 DSL 上下文，却可能意外泄露到其他 DSL 上下文。我们已添加 `@KotlinGradlePluginDsl` 注解，可防止 Kotlin Gradle 插件 DSL 函数和属性暴露到其不应可用的级别。以下级别相互分离：
> * Kotlin 扩展
> * Kotlin 目标
> * Kotlin 编译
> * Kotlin 编译任务
>
> **Deprecation cycle**:
>
> - 2.0.0: 对于大多数常见情况，如果你的构建脚本配置不正确，编译器会报告警告并提供修复建议；否则，编译器会报告错误。

### 弃用 `kotlinOptions` DSL

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 通过 `kotlinOptions` DSL 和相关的 `KotlinCompile<KotlinOptions>` 任务接口配置编译器选项的功能已被弃用。
>
> **Deprecation cycle**:
>
> - 2.0.0: 报告警告。

### 弃用 `KotlinCompilation` DSL 中的 `compilerOptions`

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 在 `KotlinCompilation` DSL 中配置 `compilerOptions` 属性的功能已被弃用。
>
> **Deprecation cycle**:
>
> - 2.0.0: 报告警告。

### 弃用 CInteropProcess 的旧处理方式

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `CInteropProcess` 任务和 `CInteropSettings` 类现在使用 `definitionFile` 属性，而非 `defFile` 和 `defFileProperty`。
> 
> 这消除了当 `defFile` 动态生成时，需要在 `CInteropProcess` 任务和生成 `defFile` 的任务之间添加额外 `dependsOn` 关系的必要性。
> 
> 在 Kotlin/Native 项目中，Gradle 现在会在构建过程后期，在相关任务运行后惰性验证 `definitionFile` 属性的存在。
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile` 和 `defFileProperty` 参数已弃用。

### 移除 `kotlin.useK2` Gradle 属性

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `kotlin.useK2` Gradle 属性已被移除。在 Kotlin 1.9.* 中，它可用于启用 K2 编译器。在 Kotlin 2.0.0 及更高版本中，K2 编译器默认启用，因此该属性不再有任何作用，也不能用于切换回旧编译器。
>
> **Deprecation cycle**:
>
> - 1.8.20: `kotlin.useK2` Gradle 属性已弃用。
> - 2.0.0: `kotlin.useK2` Gradle 属性已移除。

### 移除已弃用的平台插件 ID

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 对以下平台插件 ID 的支持已移除：
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: 平台插件 ID 已弃用。
> - 2.0.0: 平台插件 ID 不再受支持。

### 移除 `outputFile` JavaScript 编译器选项

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `outputFile` JavaScript 编译器选项已被移除。现在，你可以使用 `Kotlin2JsCompile` 任务的 `destinationDirectory` 属性来指定编译后的 JavaScript 输出文件写入的目录。
>
> **Deprecation cycle**:
>
> - 1.9.25: `outputFile` 编译器选项已弃用。
> - 2.0.0: `outputFile` 编译器选项已移除。