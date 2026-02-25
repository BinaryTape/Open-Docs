[//]: # (title: 与 Java 的比较)

## Kotlin 解决的一些 Java 问题

Kotlin 修复了 Java 中存在的一系列问题：

* 空引用受 [类型系统控制](null-safety.md)。
* [无原始类型](java-interop.md#java-generics-in-kotlin)
* Kotlin 中的数组是 [不型变的](arrays.md)
* Kotlin 拥有真正的 [函数类型](lambdas.md#function-types)，而 Java 则是使用 SAM 转换
* 不使用通配符的 [使用处型变](generics.md#use-site-variance-type-projections)
* Kotlin 没有受检 [异常](exceptions.md)
* [为只读集合与可变集合提供独立接口](collections-overview.md)

## Java 拥有但 Kotlin 没有的功能

* [受检异常](exceptions.md)
* 不是类的 [原始类型](types-overview.md)。字节码会尽可能使用原始类型，但它们并非显式可用。
* [static 成员](classes.md) 被 [伴生对象](object-declarations.md#companion-objects)、[顶层函数](functions.md)、[扩展函数](extensions.md#extension-functions) 或 [@JvmStatic](java-to-kotlin-interop.md#static-methods) 所取代。
* [通配符类型](generics.md) 被 [声明处型变](generics.md#declaration-site-variance) 与 [类型投影](generics.md#type-projections) 所取代。
* [三元运算符 a ? b : c](control-flow.md#if-expression) 被 [if 表达式](control-flow.md#if-expression) 所取代。 
* [记录](https://openjdk.org/jeps/395)
* package-private [可见性修饰符](visibility-modifiers.md)

> Kotlin 没有模式匹配，但 [Kotlin 中的智能转换](typecasts.md#smart-casts) 提供了与 [Java 中的模式匹配](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java) 类似的功能。
>
> 请在 [JetBrains 官方 Kotlin 频道的视频](https://www.youtube.com/watch?v=yJDoa42X-wQ) 中了解更多详情。
>
{style="note"}

## Kotlin 拥有但 Java 没有的功能

* [lambda表达式](lambdas.md) + [内联函数](inline-functions.md) = 高性能自定义控制结构
* [扩展函数](extensions.md)
* [空安全](null-safety.md)
* [字符串模板](strings.md)
* [属性](properties.md)
* [主构造函数](classes.md)
* [一等委托](delegation.md)
* [变量与属性类型的类型推断](types-overview.md) (**Java 10**: [本地变量类型推断](https://openjdk.org/jeps/286))
* [单例](object-declarations.md)
* [声明处型变与类型投影](generics.md)
* [区间表达式](ranges.md)
* [运算符重载](operator-overloading.md)
* [伴生对象](classes.md#companion-objects)
* [数据类](data-classes.md)
* [协程](coroutines-overview.md)
* [顶层函数](functions.md)
* [带有默认值的形参](functions.md#parameters-with-default-values)
* [具名参数](functions.md#named-arguments)
* [中缀函数](functions.md#infix-notation)
* [Expect 与 actual 声明](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)
* [显式 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors) 和 [更好的 API 表面控制](opt-in-requirements.md)

> Java 没有智能转换，但 [模式匹配](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java) 提供了与 [Kotlin 中的智能转换](typecasts.md#smart-casts) 类似的功能。
>
> 请在 [JetBrains 官方 Kotlin 频道的视频](https://www.youtube.com/watch?v=yJDoa42X-wQ) 中了解更多详情。
>
{style="note"}

## 下一步？

了解如何：
* 执行 [Java 与 Kotlin 中常见的字符串任务](java-to-kotlin-idioms-strings.md)。
* 执行 [Java 与 Kotlin 中常见的集合任务](java-to-kotlin-collections-guide.md)。
* [处理 Java 与 Kotlin 中的为 null 性](java-to-kotlin-nullability-guide.md)。