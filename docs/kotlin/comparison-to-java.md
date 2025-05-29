[//]: # (title: 与 Java 的比较)

## Kotlin 解决的一些 Java 问题

Kotlin 解决了 Java 存在的系列问题：

*   空引用由[类型系统](null-safety.md)控制。
*   [无原始类型](java-interop.md#java-generics-in-kotlin)
*   Kotlin 中的数组是[不变的 (invariant)](arrays.md)
*   Kotlin 拥有真正的[函数类型](lambdas.md#function-types)，而非 Java 的 SAM 转换
*   [使用处协变](generics.md#use-site-variance-type-projections)，无需通配符
*   Kotlin 没有受检[异常](exceptions.md)
*   [针对只读集合和可变集合的独立接口](collections-overview.md)

## Java 拥有而 Kotlin 没有的特性

*   [受检异常](exceptions.md)
*   [原始类型](basic-types.md)，它们不是类。字节码在可能的情况下会使用原始类型，但它们并非显式可用。
*   [静态成员](classes.md)被[伴生对象](object-declarations.md#companion-objects)、[顶层函数](functions.md)、[扩展函数](extensions.md#extension-functions)或 [`@JvmStatic`](java-to-kotlin-interop.md#static-methods) 取代。
*   [通配符类型](generics.md)被[声明处协变](generics.md#declaration-site-variance)和[类型投影](generics.md#type-projections)取代。
*   [三元运算符 `a ? b : c`](control-flow.md#if-expression) 被 [if 表达式](control-flow.md#if-expression)取代。
*   [记录 (Records)](https://openjdk.org/jeps/395)
*   [模式匹配 (Pattern Matching)](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
*   包私有 (package-private) [可见性修饰符](visibility-modifiers.md)

## Kotlin 拥有而 Java 没有的特性

*   [Lambda 表达式](lambdas.md) + [内联函数](inline-functions.md) = 高性能的自定义控制结构
*   [扩展函数](extensions.md)
*   [空安全](null-safety.md)
*   [智能转换](typecasts.md) （**Java 16**: [instanceof 的模式匹配](https://openjdk.org/jeps/394)）
*   [字符串模板](strings.md) （**Java 21**: [字符串模板（预览）](https://openjdk.org/jeps/430)）
*   [属性](properties.md)
*   [主构造函数](classes.md)
*   [一等委托](delegation.md)
*   [变量和属性类型的类型推断](basic-types.md) （**Java 10**: [局部变量类型推断](https://openjdk.org/jeps/286)）
*   [单例](object-declarations.md)
*   [声明处协变与类型投影](generics.md)
*   [范围表达式](ranges.md)
*   [运算符重载](operator-overloading.md)
*   [伴生对象](classes.md#companion-objects)
*   [数据类](data-classes.md)
*   [协程](coroutines-overview.md)
*   [顶层函数](functions.md)
*   [默认参数](functions.md#default-arguments)
*   [命名参数](functions.md#named-arguments)
*   [中缀函数](functions.md#infix-notation)
*   [expect 与 actual 声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)
*   [显式 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors)和[更好地控制 API 面](opt-in-requirements.md)

## 接下来？

了解如何：
*   在 [Java 和 Kotlin 中执行典型的字符串任务](java-to-kotlin-idioms-strings.md)。
*   在 [Java 和 Kotlin 中执行典型的集合任务](java-to-kotlin-collections-guide.md)。
*   [处理 Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide.md)。