[//]: # (title: 遷移至新的記憶體管理器)

> Kotlin 1.9.20 已完全移除對舊版記憶體管理器的支援。請將您的專案遷移至目前記憶體模型，此模型自 Kotlin 1.7.20 起已預設啟用。
>
{style="note"}

本指南比較了新的 [Kotlin/Native 記憶體管理器](native-memory-manager.md) 與舊版，並說明如何遷移您的專案。

新記憶體管理器最顯著的變化是解除了物件共享的限制。您不再需要凍結物件即可在執行緒之間共享它們，具體來說：

*   頂層屬性可由任何執行緒存取和修改，而無需使用 `@SharedImmutable`。
*   透過 interop 傳遞的物件可由任何執行緒存取和修改，無需凍結它們。
*   `Worker.executeAfter` 不再要求操作被凍結。
*   `Worker.execute` 不再要求生產者返回一個獨立的物件子圖。
*   包含 `AtomicReference` 和 `FreezableAtomicReference` 的參照循環不會導致記憶體洩漏。

除了方便的物件共享外，新的記憶體管理器還帶來了其他主要變化：

*   全域屬性在定義它們的文件首次被存取時延遲初始化。以前全域屬性是在程式啟動時初始化的。作為一種權宜之計，您可以為必須在程式啟動時初始化的屬性標記 `@EagerInitialization` 註解。在使用前，請查閱其 [文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)。
*   `by lazy {}` 屬性支援執行緒安全模式，但不處理無界遞迴。
*   逸出 `Worker.executeAfter` 中 `operation` 的例外會像在其他執行期部分一樣處理，透過嘗試執行使用者定義的未處理例外掛鉤，或者如果未找到該掛鉤或該掛鉤本身因例外而失敗，則終止程式。
*   凍結已棄用並始終禁用。

請遵循以下指南將您的專案從舊版記憶體管理器遷移：

## 更新 Kotlin

新的 Kotlin/Native 記憶體管理器自 Kotlin 1.7.20 起已預設啟用。請檢查 Kotlin 版本並在需要時[更新到最新版本](releases.md#update-to-a-new-kotlin-version)。

## 更新依賴項

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>更新到 1.6.0 或更高版本。請勿使用帶有 <code>native-mt</code> 尾碼的版本。</p>
        <p>關於新的記憶體管理器，您還應該記住一些具體注意事項：</p>
        <list>
            <li>每個常見的原生類型（通道、流、協程）都能跨越 Worker 邊界工作，因為不再需要凍結。</li>
            <li><code>Dispatchers.Default</code> 在 Linux 和 Windows 上由 Worker 池支援，在 Apple 目標上由全域佇列支援。</li>
            <li>使用 <code>newSingleThreadContext</code> 建立一個由 Worker 支援的協程分發器。</li>
            <li>使用 <code>newFixedThreadPoolContext</code> 建立一個由一個包含 N 個 Worker 的池支援的協程分發器。</li>
            <li><code>Dispatchers.Main</code> 在 Darwin 上由主佇列支援，在其他平台則由獨立的 Worker 支援。</li>
        </list>
    </def>
    <def title="Ktor">
        更新到 2.0 或更高版本。
    </def>
    <def title="其他依賴項">
        <p>大多數函式庫應該無需任何更改即可運作，但是，可能會有例外情況。</p>
        <p>請確保您將依賴項更新到最新版本，並且舊版與新記憶體管理器的函式庫版本之間沒有差異。</p>
    </def>
</deflist>

## 更新您的程式碼

為了支援新的記憶體管理器，請移除受影響 API 的使用：

| 舊版 API                                                                                                                                              | 應採取的動作                                                                                                                                                                      |
|:------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                        | 您可以移除所有用法，儘管在新記憶體管理器中沒有使用此 API 的警告。                                                                                                                    |
| [`FreezableAtomicReference` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)                 | 改用 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)。                                                                  |
| [`FreezingException` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                                | 移除所有用法。                                                                                                                                                                    |
| [`InvalidMutabilityException` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)             | 移除所有用法。                                                                                                                                                                    |
| [`IncorrectDereferenceException` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)                   | 移除所有用法。                                                                                                                                                                    |
| [`freeze()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                                  | 移除所有用法。                                                                                                                                                                    |
| [`isFrozen` 屬性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                               | 您可以移除所有用法。由於凍結已棄用，此屬性總是回傳 `false`。                                                                                                                        |
| [`ensureNeverFrozen()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)                          | 移除所有用法。                                                                                                                                                                    |
| [`atomicLazy()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                                         | 改用 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)。                                                                                                   |
| [`MutableData` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                            | 改用任何常規集合。                                                                                                                                                                |
| [`WorkerBoundReference<out T : Any>` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/)             | 直接使用 `T`。                                                                                                                                                                    |
| [`DetachedObjectGraph<T>` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)                         | 直接使用 `T`。為了透過 C interop 傳遞值，請使用 [<code>StableRef</code> 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)。 |

## 接下來是什麼

*   [深入了解新的記憶體管理器](native-memory-manager.md)
*   [查看與 Swift/Objective-C ARC 整合的具體細節](native-arc-integration.md)
*   [了解如何在不同的協程中安全地引用物件](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)