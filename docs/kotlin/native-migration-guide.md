---
title: 迁移到新的内存管理器
---
:::note
Kotlin 1.9.20 中已完全移除对旧版内存管理器的支持。请将你的项目迁移到自 Kotlin 1.7.20 起默认启用的当前内存模型。

:::

本指南将新的 [Kotlin/Native 内存管理器](native-memory-manager)与旧版内存管理器进行比较，并描述如何迁移你的项目。

新内存管理器最显著的变化是解除了对对象共享的限制。你不需要冻结对象以在线程之间共享它们，具体来说：

* 任何线程都可以访问和修改顶层属性，而无需使用 `@SharedImmutable`。
* 通过互操作传递的对象可以被任何线程访问和修改，而无需冻结它们。
* `Worker.executeAfter` 不再要求操作被冻结。
* `Worker.execute` 不再要求生产者返回一个隔离的对象子图。
* 包含 `AtomicReference` 和 `FreezableAtomicReference` 的引用循环不会导致内存泄漏。

除了更容易的对象共享外，新的内存管理器还带来了其他主要变化：

* 全局属性在首次访问定义它们的文件时才会被延迟初始化。以前，全局属性是在程序启动时初始化的。作为一种解决方法，你可以使用 `@EagerInitialization` 注解标记必须在程序启动时初始化的属性。在使用之前，请查看其[文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)。
* `by lazy {}` 属性支持线程安全模式，并且不处理无限递归。
* 在 `Worker.executeAfter` 中，逃逸 `operation` 的异常会像在其他运行时部分一样被处理，尝试执行用户定义的未处理异常 hook，如果未找到 hook 或 hook 本身因异常而失败，则终止程序。
* 冻结已被弃用且始终禁用。

请遵循以下指南从旧版内存管理器迁移你的项目：

## 更新 Kotlin

自 Kotlin 1.7.20 起，新的 Kotlin/Native 内存管理器已默认启用。检查 Kotlin 版本，如有必要，[更新到最新版本](releases#update-to-a-new-kotlin-version)。

## 更新依赖项
### kotlinx.coroutines
<p>
   更新到 1.6.0 或更高版本。不要使用带有 `native-mt` 后缀的版本。
</p>
<p>
   关于新的内存管理器，你还应该记住一些具体事项：
</p>
<list>
<li>每个通用原语（通道、流、协程）都通过 Worker 边界工作，因为不需要冻结。</li>
<li>`Dispatchers.Default` 由 Linux 和 Windows 上的 Worker 池以及 Apple 目标上的全局队列支持。</li>
<li>使用 `newSingleThreadContext` 创建一个由 Worker 支持的协程调度器。</li>
<li>使用 `newFixedThreadPoolContext` 创建一个由 `N` 个 Worker 池支持的协程调度器。</li>
<li>`Dispatchers.Main` 由 Darwin 上的主队列和其他平台上的独立 Worker 支持。</li>
</list>
### Ktor
        更新到 2.0 或更高版本。
### 其他依赖项
<p>
   大多数库应该可以在没有任何更改的情况下工作，但是，可能存在例外。
</p>
<p>
   请确保将依赖项更新到最新版本，并且旧版和新版内存管理器的库版本之间没有差异。
</p>
    

## 更新你的代码

为了支持新的内存管理器，请删除受影响的 API 的用法：

| 旧 API                                                                                                                                         | 操作方法                                                                                                                                                              |
|-------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 你可以删除所有用法，尽管在新内存管理器中使用此 API 没有警告。                                                                                                         |
| [The `FreezableAtomicReference` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 使用 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/) 代替。                                                           |
| [The `FreezingException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 删除所有用法。                                                                                                                                                      |                                                                                                      |
| [The `InvalidMutabilityException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 删除所有用法。                                                                                                                                                      |
| [The `IncorrectDereferenceException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 删除所有用法。                                                                                                                                                      |
| [The `freeze()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 删除所有用法。                                                                                                                                                      |
| [The `isFrozen` property](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 你可以删除所有用法。由于冻结已被弃用，因此该属性始终返回 `false`。                                                                                                              |                                                                                                                  
| [The `ensureNeverFrozen()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 删除所有用法。                                                                                                                                                      |
| [The `atomicLazy()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 使用 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) 代替。                                                                                           |
| [The `MutableData` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 使用任何常规集合代替。                                                                                                                                              |
| [The `WorkerBoundReference<out T : Any>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | 直接使用 `T`。                                                                                                                                                     |
| [The `DetachedObjectGraph<T>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | 直接使用 `T`。要通过 C 互操作传递该值，请使用 [StableRef 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)。                                         |

## 接下来做什么

* [了解有关新内存管理器的更多信息](native-memory-manager)
* [检查与 Swift/Objective-C ARC 集成的细节](native-arc-integration)