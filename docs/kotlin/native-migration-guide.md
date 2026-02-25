[//]: # (title: 迁移到新内存管理器)

> Kotlin 1.9.20 已完全移除对旧版内存管理器的支持。请将您的项目迁移到当前的内存模型，该模型自 Kotlin 1.7.20 起已默认启用。
>
{style="note"}

本指南将新的 [Kotlin/Native 内存管理器](native-memory-manager.md)与旧版进行了对比，并说明了如何迁移您的项目。

新内存管理器中最显著的变化是取消了对象共享限制。您无需冻结 (freeze) 对象即可在线程间共享，具体包括：

* 顶级属性可由任何线程访问和修改，无需使用 `@SharedImmutable`。
* 通过互操作 (interop) 传递的对象可由任何线程访问和修改，无需将其冻结。
* `Worker.executeAfter` 不再要求操作必须被冻结。
* `Worker.execute` 不再要求生产者返回孤立的对象子图。
* 包含 `AtomicReference` 和 `FreezableAtomicReference` 的引用循环不会导致内存泄漏。

除了更轻松的对象共享，新内存管理器还带来了其他重大变化：

* 全局属性在首次访问其定义所在的文件时进行延迟初始化。以前，全局属性在程序启动时初始化。作为权宜之计，您可以使用 `@EagerInitialization` 注解标记必须在程序启动时初始化的属性。在使用之前，请查阅其[文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)。
* `by lazy {}` 属性支持线程安全模式，且不处理无限递归。
* 在 `Worker.executeAfter` 中从 `operation` 逃逸的异常处理方式与运行时其他部分一致：尝试执行用户定义的未处理异常挂钩，如果未找到该挂钩或其本身抛出异常，则终止程序。
* 冻结 (Freezing) 已弃用并始终处于禁用状态。

请按照以下指南从旧版内存管理器迁移您的项目：

## 更新 Kotlin

新的 Kotlin/Native 内存管理器自 Kotlin 1.7.20 起已默认启用。请检查 Kotlin 版本，并在必要时[更新到最新版本](releases.md#update-to-a-new-kotlin-version)。

## 更新依赖项

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>更新到 1.6.0 或更高版本。不要使用带有 <code>native-mt</code> 后缀的版本。</p>
        <p>关于新内存管理器，还有一些细节需要注意：</p>
        <list>
            <li>由于不再需要冻结，所有常用原语（通道、流、协程）都可以跨越工作线程 (Worker) 边界工作。</li>
            <li><code>Dispatchers.Default</code> 在 Linux 和 Windows 上由工作线程池支持，在 Apple 目标平台上由全局队列支持。</li>
            <li>使用 <code>newSingleThreadContext</code> 创建由工作线程支持的协程调度器。</li>
            <li>使用 <code>newFixedThreadPoolContext</code> 创建由 <code>N</code> 个工作线程组成的池支持的协程调度器。</li>
            <li><code>Dispatchers.Main</code> 在 Darwin 上由主队列支持，在其他平台上由独立工作线程支持。</li>
        </list>
    </def>
    <def title="Ktor">
        更新到 2.0 或更高版本。
    </def>
    <def title="其他依赖项">
        <p>大多数库应该无需任何更改即可工作，但可能存在例外。</p>
        <p>请确保将依赖项更新到最新版本，且旧版和新版内存管理器的库版本之间没有差异。</p>
    </def>
</deflist>

## 更新您的代码

要支持新内存管理器，请移除受影响 API 的用法：

| 旧版 API                                                                                                                                         | 操作建议                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 您可以移除所有用法，尽管在新内存管理器中使用此 API 不会有警告。                                                                                             |
| [`FreezableAtomicReference` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 改为使用 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)。                                        |
| [`FreezingException` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 移除所有用法。                                                                                                                                                |
| [`InvalidMutabilityException` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 移除所有用法。                                                                                                                                                |
| [`IncorrectDereferenceException` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 移除所有用法。                                                                                                                                                |
| [`freeze()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 移除所有用法。                                                                                                                                                |
| [`isFrozen` 属性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 您可以移除所有用法。由于冻结已弃用，该属性始终返回 `false`。                                                                     |                                                                                                                  
| [`ensureNeverFrozen()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 移除所有用法。                                                                                                                                                |
| [`atomicLazy()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 改为使用 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)。                                                                            |
| [`MutableData` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 改为使用任何常规集合。                                                                                                                               |
| [`WorkerBoundReference<out T : Any>` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | 直接使用 `T`。                                                                                                                                                 |
| [`DetachedObjectGraph<T>` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | 直接使用 `T`。要通过 C 互操作传递值，请使用 [StableRef 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)。 |

## 下一步

* [详细了解新内存管理器](native-memory-manager.md)
* [查看与 Swift/Objective-C ARC 集成的具体细节](native-arc-integration.md)
* [了解如何从不同协程安全地引用对象](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)