[//]: # (title: 遷移至新的記憶體管理員)

> Kotlin 1.9.20 已完全移除對舊版記憶體管理員的支援。請將您的專案遷移至目前的記憶體模型，該模型自 Kotlin 1.7.20 起已預設啟用。
>
{style="note"}

本指南比較了新的 [Kotlin/Native 記憶體管理員](native-memory-manager.md)與舊版管理員的差異，並說明如何遷移您的專案。

新的記憶體管理員最顯著的變化是解除了物件共享的限制。您不需要凍結物件就能在執行緒之間共享它們，具體包括：

* 最上層屬性可以由任何執行緒存取和修改，無需使用 `@SharedImmutable`。
* 透過互操作性（interop）傳遞的物件可以由任何執行緒存取和修改，無需凍結它們。
* `Worker.executeAfter` 不再要求操作必須被凍結。
* `Worker.execute` 不再要求產製者傳回隔離的物件子圖。
* 包含 `AtomicReference` 和 `FreezableAtomicReference` 的參照循環不會導致記憶體洩漏。

除了更容易共享物件外，新的記憶體管理員還帶來了其他重大變化：

* 全域屬性會在首次存取其定義所在的檔案時延遲初始化。以前全域屬性是在程式啟動時初始化的。作為暫時解決方案，您可以使用 `@EagerInitialization` 註解標記必須在程式啟動時初始化的屬性。在使用之前，請查閱其[文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)。
* `by lazy {}` 屬性支援執行緒安全模式，且不處理無限制的遞迴。
* 在 `Worker.executeAfter` 中從 `operation` 逃逸的例外處理方式與執行時的其他部分相同：嘗試執行使用者定義的未處理例外攔截器，如果找不到攔截器或攔截器本身執行失敗並拋出例外，則終止程式。
* 凍結已棄用且一律停用。

請遵循以下指南將您的專案從舊版記憶體管理員遷移：

## 更新 Kotlin

新的 Kotlin/Native 記憶體管理員自 Kotlin 1.7.20 起已預設啟用。請檢查 Kotlin 版本，必要時[更新至最新版本](releases.md#update-to-a-new-kotlin-version)。

## 更新相依性

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>更新至 1.6.0 或更高版本。請勿使用帶有 <code>native-mt</code> 字尾的版本。</p>
        <p>關於新的記憶體管理員，還有一些細節您應該留意：</p>
        <list>
            <li>由於不再需要凍結，每個通用基本型別（channels、flows、coroutines）都能跨 Worker 邊界運作。</li>
            <li><code>Dispatchers.Default</code> 在 Linux 和 Windows 上由 Worker 池支援，在 Apple 目標平台上則由全域佇列支援。</li>
            <li>使用 <code>newSingleThreadContext</code> 來建立由 Worker 支援的協程分派器（coroutine dispatcher）。</li>
            <li>使用 <code>newFixedThreadPoolContext</code> 來建立由 <code>N</code> 個 Worker 组成的池所支援的協程分派器。</li>
            <li><code>Dispatchers.Main</code> 在 Darwin 上由主佇列支援，在其他平台上則由獨立的 Worker 支援。</li>
        </list>
    </def>
    <def title="Ktor">
        更新至 2.0 或更高版本。
    </def>
    <def title="其他相依性">
        <p>大多數程式庫應該無需任何更改即可運作，但可能存在例外。</p>
        <p>請確保將相依性更新至最新版本，且舊版與新版記憶體管理員的程式庫版本之間沒有差異。</p>
    </def>
</deflist>

## 更新您的程式碼

若要支援新的記憶體管理員，請移除受影響 API 的用法：

| 舊版 API                                                                                                                                         | 該做什麼                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 您可以移除所有用法，儘管在新的記憶體管理員中使用此 API 不會有警告。                                                                                           |
| [`FreezableAtomicReference` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 改用 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)。                                        |
| [`FreezingException` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 移除所有用法。                                                                                                                                                |
| [`InvalidMutabilityException` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 移除所有用法。                                                                                                                                                |
| [`IncorrectDereferenceException` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 移除所有用法。                                                                                                                                                |
| [`freeze()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 移除所有用法。                                                                                                                                                |
| [`isFrozen` 屬性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 您可以移除所有用法。由於凍結已棄用，該屬性一律傳回 `false`。                                                                     |                                                                                                                  
| [`ensureNeverFrozen()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 移除所有用法。                                                                                                                                                |
| [`atomicLazy()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 改用 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)。                                                                            |
| [`MutableData` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 改用任何常規集合。                                                                                                                               |
| [`WorkerBoundReference<out T : Any>` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | 直接使用 `T`。                                                                                                                                                 |
| [`DetachedObjectGraph<T>` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | 直接使用 `T`。若要透過 C 互操作性傳遞值，請使用 [StableRef 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)。 |

## 下一步

* [進一步了解新的記憶體管理員](native-memory-manager.md)
* [查看與 Swift/Objective-C ARC 整合的細節](native-arc-integration.md)
* [了解如何從不同的協程安全地參照物件](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)