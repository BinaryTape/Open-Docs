---
title: "与 Java 的比较"
---
## Kotlin 中解决的一些 Java 问题

Kotlin 修复了 Java 存在的一系列问题：

* 空引用由[类型系统控制](null-safety)。
* [没有原始类型](java-interop#java-generics-in-kotlin)
* Kotlin 中的数组是[不变的](arrays)
* Kotlin 具有合适的[函数类型](lambdas#function-types)，而不是 Java 的 SAM 转换
* 没有通配符的 [使用点变型](generics#use-site-variance-type-projections)
* Kotlin 没有受检[异常](exceptions)
* [用于只读和可变集合的独立接口](collections-overview)

## Java 有而 Kotlin 没有的

* [受检异常](exceptions)
* 不是类的[基本类型](basic-types)。 字节码尽可能使用基本类型，但它们不是显式可用的。
* [静态成员](classes)被[伴生对象](object-declarations#companion-objects)、[顶层函数](functions)、[扩展函数](extensions#extension-functions)或 [@JvmStatic](java-to-kotlin-interop#static-methods) 替代。
* [通配符类型](generics)被[声明点变型](generics#declaration-site-variance)和[类型投影](generics#type-projections)替代。
* [三元运算符 `a ? b : c`](control-flow#if-expression) 被 [if 表达式](control-flow#if-expression) 替代。
* [Records](https://openjdk.org/jeps/395)
* [Pattern Matching](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
* package-private [可见性修饰符](visibility-modifiers)

## Kotlin 有而 Java 没有的

* [Lambda 表达式](lambdas) + [内联函数](inline-functions) = 高效的自定义控制结构
* [扩展函数](extensions)
* [空安全](null-safety)
* [智能类型转换](typecasts) (**Java 16**: [Pattern Matching for instanceof](https://openjdk.org/jeps/394))
* [字符串模板](strings) (**Java 21**: [String Templates (Preview)](https://openjdk.org/jeps/430))
* [属性](properties)
* [主构造函数](classes)
* [头等委托](delegation)
* [变量和属性类型的类型推断](basic-types) (**Java 10**: [Local-Variable Type Inference](https://openjdk.org/jeps/286))
* [单例](object-declarations)
* [声明点变型 & 类型投影](generics)
* [区间表达式](ranges)
* [运算符重载](operator-overloading)
* [伴生对象](classes#companion-objects)
* [数据类](data-classes)
* [协程](coroutines-overview)
* [顶层函数](functions)
* [默认参数](functions#default-arguments)
* [命名参数](functions#named-arguments)
* [中缀函数](functions#infix-notation)
* [Expect 和 actual 声明](multiplatform-expect-actual)
* [显式 API 模式](whatsnew14#explicit-api-mode-for-library-authors) 和 [更好地控制 API 表面](opt-in-requirements)

## 接下来做什么？

学习如何：
* 使用 [Java 和 Kotlin 执行字符串的典型任务](java-to-kotlin-idioms-strings)。
* 使用 [Java 和 Kotlin 执行集合的典型任务](java-to-kotlin-collections-guide)。
* [处理 Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide)。