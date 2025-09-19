[//]: # (title: 与 Java 的对比)

## Kotlin 中解决的一些 Java 问题

Kotlin 解决了 Java 存在的一系列问题：

*   空引用由[类型系统](null-safety.md)控制。
*   [无原始类型](java-interop.md#java-generics-in-kotlin)
*   Kotlin 中的数组是[不型变的](arrays.md)
*   Kotlin 拥有恰当的[函数类型](lambdas.md#function-types)，而非 Java 的 SAM 转换
*   [使用处型变](generics.md#use-site-variance-type-projections)而无需通配符
*   Kotlin 没有受检[异常](exceptions.md)
*   [只读集合和可变集合的独立接口](collections-overview.md)

## Java 有而 Kotlin 没有的特性

*   [受检异常](exceptions.md)
*   不是类的[基本类型](basic-types.md)。字节码尽可能使用基本类型，但它们不[显式](basic-types.md)可用。
*   [静态成员](classes.md)被 [companion objects](object-declarations.md#companion-objects)、[顶层函数](functions.md)、[扩展函数](extensions.md#extension-functions)或 [@JvmStatic](java-to-kotlin-interop.md#static-methods) 取代。
*   [通配符类型](generics.md)被[声明处型变](generics.md#declaration-site-variance)和[类型投影](generics.md#type-projections)取代。
*   [三元操作符 `a ? b : c`](control-flow.md#if-expression)被 [if 表达式](control-flow.md#if-expression)取代。
*   [Records](https://openjdk.org/jeps/395)
*   [Pattern Matching](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
*   包私有[可见性修饰符](visibility-modifiers.md)

## Kotlin 有而 Java 没有的特性

*   [lambda 表达式](lambdas.md) + [内联函数](inline-functions.md) = 高性能的自定义控制结构
*   [扩展函数](extensions.md)
*   [空安全](null-safety.md)
*   [智能类型转换](typecasts.md)（**Java 16**：[Pattern Matching for instanceof](https://openjdk.org/jeps/394)）
*   [字符串模板](strings.md)
*   [属性](properties.md)
*   [主构造函数](classes.md)
*   [头等委托](delegation.md)
*   [变量和属性的类型推断](basic-types.md)（**Java 10**：[Local-Variable Type Inference](https://openjdk.org/jeps/286)）
*   [单例](object-declarations.md)
*   [声明处型变与类型投影](generics.md)
*   [区间表达式](ranges.md)
*   [操作符重载](operator-overloading.md)
*   [Companion objects](classes.md#companion-objects)
*   [数据类](data-classes.md)
*   [协程](coroutines-overview.md)
*   [顶层函数](functions.md)
*   [带默认值的形参](functions.md#parameters-with-default-values)
*   [具名形参](functions.md#named-arguments)
*   [中缀函数](functions.md#infix-notation)
*   [预期与实际声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)
*   [显式 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors)和[更好地控制 API 面](opt-in-requirements.md)

## 接下来？

了解如何：
*   在 Java 和 Kotlin 中执行[典型的字符串任务](java-to-kotlin-idioms-strings.md)。
*   在 Java 和 Kotlin 中执行[典型的集合任务](java-to-kotlin-collections-guide.md)。
*   [处理 Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide.md)。