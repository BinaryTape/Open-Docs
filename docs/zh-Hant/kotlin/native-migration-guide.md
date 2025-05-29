[//]: # (title: 遷移至新的記憶體管理器)

> 自 Kotlin 1.9.20 起，已完全移除對舊版記憶體管理器 (legacy memory manager) 的支援。請將您的專案遷移至目前的記憶體模型，該模型自 Kotlin 1.7.20 起已預設啟用。
>
{style="note"}

本指南比較了新的 [Kotlin/Native 記憶體管理器](native-memory-manager.md) 與舊版記憶體管理器，並說明如何遷移您的專案。

新的記憶體管理器最顯著的變化是解除了物件共享的限制。您不再需要凍結 (freeze) 物件即可在執行緒 (thread) 之間共享它們，具體來說：

*   頂層屬性 (top-level properties) 可以由任何執行緒存取和修改，而無需使用 `@SharedImmutable`。
*   透過互通 (interop) 傳遞的物件可以由任何執行緒存取和修改，而無需凍結它們。
*   `Worker.executeAfter` 不再要求操作 (operations) 必須被凍結。
*   `Worker.execute` 不再要求生產者 (producers) 返回一個隔離的物件子圖 (isolated object subgraph)。
*   包含 `AtomicReference` 和 `FreezableAtomicReference` 的參考循環 (reference cycles) 不會導致記憶體洩漏 (memory leaks)。

除了輕鬆共享物件之外，新的記憶體管理器還帶來了其他重大變化：

*   全域屬性 (global properties) 在首次存取定義它們的檔案時才進行延遲初始化 (lazily initialized)。以前，全域屬性是在程式啟動時初始化的。作為替代方案，您可以將必須在程式啟動時初始化的屬性標記為 `@EagerInitialization` 註解。在使用前，請查閱其[文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)。
*   `by lazy {}` 屬性支援執行緒安全模式，但不處理無界遞歸 (unbounded recursion)。
*   從 `Worker.executeAfter` 中的 `operation` 逃逸的例外 (exceptions) 會像其他執行時 (runtime) 部分一樣處理，即嘗試執行使用者定義的未處理例外掛鉤 (unhandled exception hook)，如果找不到掛鉤或掛鉤本身執行失敗，則終止程式。
*   凍結 (Freezing) 功能已棄用且始終禁用。

請遵循以下指南將您的專案從舊版記憶體管理器遷移：

## 更新 Kotlin

新的 Kotlin/Native 記憶體管理器自 Kotlin 1.7.20 起已預設啟用。請檢查 Kotlin 版本並在必要時 [更新至最新版本](releases.md#update-to-a-new-kotlin-version)。

## 更新依賴項

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>更新至 1.6.0 版或更高版本。請勿使用帶有 <code>native-mt</code> 後綴的版本。</p>
        <p>關於新的記憶體管理器，您還需要注意以下幾點：</p>
        <list>
            <li>每個常見的原語 (primitives)（通道 (channels)、流 (flows)、協程 (coroutines)）都可以跨越 Worker 邊界運作，因為不再需要凍結。</li>
            <li><code>Dispatchers.Default</code> 在 Linux 和 Windows 上由 Worker 池支援，而在 Apple 目標上則由全域佇列 (global queue) 支援。</li>
            <li>使用 <code>newSingleThreadContext</code> 來建立一個由 Worker 支援的協程調度器 (coroutine dispatcher)。</li>
            <li>使用 <code>newFixedThreadPoolContext</code> 來建立一個由 <code>N</code> 個 Worker 池支援的協程調度器。</li>
            <li><code>Dispatchers.Main</code> 在 Darwin 上由主佇列支援，而在其他平台上則由獨立的 Worker 支援。</li>
        </list>
    </def>
    <def title="Ktor">
        更新至 2.0 版或更高版本。
    </def>
    <def title="Other dependencies">
        <p>大多數函式庫應該無需任何更改即可運作，但可能會有例外。</p>
        <p>請確保將依賴項更新到最新版本，並且舊版和新版記憶體管理器的函式庫版本之間沒有差異。</p>
    </def>
</deflist>

## 更新您的程式碼

為了支援新的記憶體管理器，請移除受影響 API 的使用方式：

| 舊版 API                                                                                                                                         | 應對方式                                                                                                                                                        |
|:------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 您可以移除所有用法，儘管在新記憶體管理器中使用此 API 不會產生警告。                                                                                                                           |
| [The `FreezableAtomicReference` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 改用 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)。                                        |
| [The `FreezingException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 移除所有用法。                                                                                                                                                |
| [The `InvalidMutabilityException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 移除所有用法。                                                                                                                                                |
| [The `IncorrectDereferenceException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 移除所有用法。                                                                                                                                                |
| [The `freeze()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 移除所有用法。                                                                                                                                                |
| [The `isFrozen` property](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 您可以移除所有用法。由於凍結 (freezing) 功能已棄用，該屬性始終返回 `false`。                                                                                                                                   |
| [The `ensureNeverFrozen()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 移除所有用法。                                                                                                                                                |
| [The `atomicLazy()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 改用 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)。                                                                            |
| [The `MutableData` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 改用任何常規集合 (regular collection)。                                                                                                                               |
| [The `WorkerBoundReference<out T : Any>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | 直接使用 `T`。                                                                                                                                                 |
| [The `DetachedObjectGraph<T>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | 直接使用 `T`。若要透過 C 語言互通 (interop) 傳遞值，請使用 [StableRef 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)。 |

## 接下來

*   [深入了解新的記憶體管理器](native-memory-manager.md)
*   [查看與 Swift/Objective-C ARC 整合的具體細節](native-arc-integration.md)
*   [了解如何安全地從不同協程中引用物件](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)