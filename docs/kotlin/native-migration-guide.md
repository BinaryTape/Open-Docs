[//]: # (title: 迁移到新的内存管理器)

> 对旧版内存管理器的支持已在 Kotlin 1.9.20 中完全移除。请将您的项目迁移到
> 当前的内存模型，该模型自 Kotlin 1.7.20 起已默认启用。
>
{style="note"}

本指南比较了新的 [Kotlin/Native 内存管理器](native-memory-manager.md) 与旧版管理器，并描述了如何迁移您的项目。

新的内存管理器最显著的变化是取消了对象共享的限制。您无需冻结对象即可在线程之间共享它们，具体来说：

*   顶层属性可由任何线程访问和修改，无需使用 `@SharedImmutable`。
*   通过互操作 (interop) 传递的对象可由任何线程访问和修改，无需冻结它们。
*   `Worker.executeAfter` 不再要求操作被冻结。
*   `Worker.execute` 不再要求生产者返回独立的（isolated）对象子图（object subgraph）。
*   包含 `AtomicReference` 和 `FreezableAtomicReference` 的引用循环不会导致内存泄漏。

除了轻松共享对象之外，新的内存管理器还带来了其他主要变化：

*   全局属性在其定义所在的文件首次被访问时才惰性初始化。以前，全局属性是在程序启动时初始化的。作为一种变通方法，您可以使用 `@EagerInitialization` 注解标记那些必须在程序启动时初始化的属性。使用前，请查阅其[文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)。
*   `by lazy {}` 属性支持线程安全模式，并且不处理无界递归。
*   `Worker.executeAfter` 中逃逸 `operation` 的异常会像在其他运行时部分一样进行处理，即尝试执行用户定义的未处理异常钩子，如果未找到钩子或钩子本身执行失败并抛出异常，则终止程序。
*   冻结（Freezing）已弃用且始终禁用。

请遵循以下指南，将您的项目从旧版内存管理器迁移：

## 更新 Kotlin

新的 Kotlin/Native 内存管理器自 Kotlin 1.7.20 起已默认启用。检查 Kotlin 版本，如有必要，请[更新到最新版本](releases.md#update-to-a-new-kotlin-version)。

## 更新依赖

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>更新到 1.6.0 或更高版本。不要使用带有 <code>native-mt</code> 后缀的版本。</p>
        <p>关于新的内存管理器，您还需要记住一些特殊之处：</p>
        <list>
            <li>每个常见原语（channels、flows、coroutines）都可以通过 Worker 边界工作，因为不再需要冻结。</li>
            <li><code>Dispatchers.Default</code> 在 Linux 和 Windows 上由 Worker 池支持，在 Apple 目标平台上由全局队列支持。</li>
            <li>使用 <code>newSingleThreadContext</code> 创建一个由 Worker 支持的协程调度器。</li>
            <li>使用 <code>newFixedThreadPoolContext</code> 创建一个由 N 个 Worker 池支持的协程调度器。</li>
            <li><code>Dispatchers.Main</code> 在 Darwin 上由主队列支持，在其他平台上由独立的 Worker 支持。</li>
        </list>
    </def>
    <def title="Ktor">
        更新到 2.0 或更高版本。
    </def>
    <def title="Other dependencies">
        <p>大多数库应该无需任何更改即可工作，但是，可能会有例外。</p>
        <p>请确保将依赖更新到最新版本，并且旧版和新内存管理器的库版本之间没有差异。</p>
    </def>
</deflist>

## 更新代码

为了支持新的内存管理器，请移除受影响 API 的用法：

| 旧版 API                                                                                                                                         | 操作                                                                                                                                                        |
|:------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [@SharedImmutable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 您可以移除所有用法，不过，在新内存管理器中使用此 API 不会有警告。                                                             |
| [<code>FreezableAtomicReference</code> 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 请改用 [<code>AtomicReference</code>](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)。                                        |
| [<code>FreezingException</code> 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 移除所有用法。                                                                                                                                                |
| [<code>InvalidMutabilityException</code> 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 移除所有用法。                                                                                                                                                |
| [<code>IncorrectDereferenceException</code> 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 移除所有用法。                                                                                                                                                |
| [<code>freeze()</code> 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 移除所有用法。                                                                                                                                                |
| [<code>isFrozen</code> 属性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 您可以移除所有用法。由于冻结（freezing）已弃用，该属性始终返回 <code>false</code>。                                                                     |
| [<code>ensureNeverFrozen()</code> 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 移除所有用法。                                                                                                                                                |
| [<code>atomicLazy()</code> 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 请改用 [<code>lazy()</code>](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)。                                                                            |
| [<code>MutableData</code> 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 请改用任何常规集合。                                                                                                                               |
| [<code>WorkerBoundReference&lt;out T : Any&gt;</code> 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | 直接使用 <code>T</code>。                                                                                                                                                 |
| [<code>DetachedObjectGraph&lt;T&gt;</code> 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | 直接使用 <code>T</code>。要通过 C 互操作（C interop）传递值，请使用 [<code>StableRef</code> 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)。 |

## 接下来

*   [了解有关新内存管理器的更多信息](native-memory-manager.md)
*   [查看与 Swift/Objective-C ARC 集成的具体细节](native-arc-integration.md)
*   [了解如何安全地从不同协程引用对象](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)