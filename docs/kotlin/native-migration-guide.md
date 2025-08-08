[//]: # (title: 迁移到新的内存管理器)

> Kotlin 1.9.20 已完全移除对旧内存管理器的支持。请将项目迁移到当前内存模型，该模型自 Kotlin 1.7.20 起默认启用。
>
{style="note"}

本指南将比较新的 [Kotlin/Native 内存管理器](native-memory-manager.md)与旧内存管理器，并描述如何迁移项目。

新内存管理器中最显著的变化是取消了对象共享的限制。你不再需要冻结对象即可在线程间共享它们，具体而言：

* 顶层属性可由任何线程访问和修改，无需使用 `@SharedImmutable`。
* 通过互操作（interop）传递的对象可由任何线程访问和修改，无需冻结。
* `Worker.executeAfter` 不再要求操作被冻结。
* `Worker.execute` 不再要求生产者返回隔离的对象子图。
* 包含 `AtomicReference` 和 `FreezableAtomicReference` 的引用循环不会导致内存泄漏。

除了轻松的对象共享，新内存管理器还带来了其他主要变化：

* 全局属性在首次访问定义它们的文件时惰性初始化。以前，全局属性在程序启动时初始化。作为一种变通方法，你可以使用 `@EagerInitialization` 注解标记那些必须在程序启动时初始化的属性。使用前，请查阅其[文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)。
* `by lazy {}` 属性支持线程安全模式，但不处理无界递归。
* `Worker.executeAfter` 中逃逸出 `operation` 的异常，像在其他运行时部分一样处理，即尝试执行用户定义的未处理异常钩子；如果未找到钩子或钩子本身执行失败并抛出异常，则终止程序。
* 冻结已弃用，并且始终禁用。

请遵循以下指南，将项目从旧内存管理器迁移过来：

## 更新 Kotlin

新的 Kotlin/Native 内存管理器自 Kotlin 1.7.20 起默认启用。检查 Kotlin 版本，如有必要，请[更新到最新版本](releases.md#update-to-a-new-kotlin-version)。

## 更新依赖项

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>更新到 1.6.0 或更高版本。请勿使用带有 <code>native-mt</code> 后缀的版本。</p>
        <p>新的内存管理器还有一些需要注意的特殊之处：</p>
        <list>
            <li>所有常见的原语（channels、flows、coroutines）都可以跨越 Worker 边界工作，因为不再需要冻结。</li>
            <li><code>Dispatchers.Default</code> 在 Linux 和 Windows 上由 Worker 池提供支持，在 Apple 目标平台 (target) 上由全局队列提供支持。</li>
            <li>使用 <code>newSingleThreadContext</code> 创建由 Worker 支持的协程调度器。</li>
            <li>使用 <code>newFixedThreadPoolContext</code> 创建由 <code>N</code> 个 Worker 池支持的协程调度器。</li>
            <li><code>Dispatchers.Main</code> 在 Darwin 上由主队列提供支持，在其他平台由独立的 Worker 提供支持。</li>
        </list>
    </def>
    <def title="Ktor">
        更新到 2.0 或更高版本。
    </def>
    <def title="其他依赖项">
        <p>大多数库无需任何更改即可工作，但可能存在例外。</p>
        <p>请确保将依赖项更新到最新版本，并且旧内存管理器和新内存管理器的库版本之间没有差异。</p>
    </def>
</deflist>

## 更新代码

为了支持新的内存管理器，请移除受影响的 API 用法：

| 旧 API                                                                                                                                         | 操作                                                                                                                                                              |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 你可以移除所有用法，尽管在新内存管理器中使用此 API 不会有警告。                                                                                                     |
| [The `FreezableAtomicReference` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 请改用 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)。                                        |
| [The `FreezingException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 移除所有用法。                                                                                                                                                    |
| [The `InvalidMutabilityException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 移除所有用法。                                                                                                                                                    |
| [The `IncorrectDereferenceException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 移除所有用法。                                                                                                                                                    |
| [The `freeze()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 移除所有用法。                                                                                                                                                    |
| [The `isFrozen` property](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 你可以移除所有用法。由于冻结已弃用，此属性始终返回 `false`。                                                                                                     |                                                                                                                  
| [The `ensureNeverFrozen()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 移除所有用法。                                                                                                                                                    |
| [The `atomicLazy()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 请改用 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)。                                                                            |
| [The `MutableData` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 请改用任何常规集合。                                                                                                                                              |
| [The `WorkerBoundReference<out T : Any>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | 直接使用 `T`。                                                                                                                                                    |
| [The `DetachedObjectGraph<T>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | 直接使用 `T`。要通过 C 互操作（interop）传递值，请使用 [StableRef 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)。 |

## 接下来

* [了解更多关于新内存管理器](native-memory-manager.md)
* [检查与 Swift/Objective-C ARC 集成的具体细节](native-arc-integration.md)
* [了解如何在不同协程中安全地引用对象](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)