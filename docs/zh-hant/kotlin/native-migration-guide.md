---
title: 移轉到新的記憶體管理器
---
:::note
在 Kotlin 1.9.20 中，已完全移除對舊版記憶體管理員的支援。請將您的專案遷移到目前的記憶體模型，該模型自 Kotlin 1.7.20 起預設啟用。

:::

本指南比較了新的 [Kotlin/Native 記憶體管理員](native-memory-manager)與舊版的記憶體管理員，並說明如何遷移您的專案。

新記憶體管理員最顯著的變化是取消了對物件共享的限制。您不需要凍結 (freeze) 物件即可在執行緒之間共享它們，具體來說：

* 任何執行緒都可以存取和修改最上層屬性，而無需使用 `@SharedImmutable`。
* 透過互操作 (Interop) 傳遞的物件可以被任何執行緒存取和修改，而無需凍結它們。
* `Worker.executeAfter` 不再要求凍結操作。
* `Worker.execute` 不再要求生產者傳回隔離的物件子圖 (isolated object subgraph)。
* 包含 `AtomicReference` 和 `FreezableAtomicReference` 的循環引用不會導致記憶體洩漏。

除了簡化物件共享之外，新的記憶體管理員還帶來了其他重大變更：

* 檔案中定義的全域屬性會在首次存取時進行延遲初始化 (lazily)。 以前，全域屬性是在程式啟動時初始化的。 作為一種變通方法，您可以將必須在程式啟動時初始化的屬性標記為 `@EagerInitialization` 註解。 在使用之前，請檢查其[文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)。
* `by lazy {}` 屬性支援執行緒安全模式，並且不處理無限制的遞迴。
* `Worker.executeAfter` 中 `operation` 逸出的例外，會像在其他執行階段部分一樣處理，嘗試執行使用者定義的未處理例外掛鉤，如果找不到掛鉤或掛鉤本身因例外而失敗，則終止程式。
* 凍結 (Freezing) 已被棄用 (deprecated) 且始終禁用。

請按照以下指南將您的專案從舊版記憶體管理員遷移：

## 更新 Kotlin

新的 Kotlin/Native 記憶體管理員已自 Kotlin 1.7.20 起預設啟用。 檢查 Kotlin 版本，如有必要，[更新到最新版本](releases#update-to-a-new-kotlin-version)。

## 更新依賴項 (dependencies)
### kotlinx.coroutines
<p>
   更新到 1.6.0 或更高版本。 請勿使用帶有 `native-mt` 後綴的版本。
</p>
<p>
   關於新的記憶體管理員，您還應該注意一些細節：
</p>
<list>
<li>每個通用基本類型 (channels, flows, coroutines) 都可以通過 Worker 邊界工作，因為不需要凍結。</li>
<li>`Dispatchers.Default` 由 Linux 和 Windows 上的 Worker 池以及 Apple 目標上的全域佇列支援。</li>
<li>使用 `newSingleThreadContext` 建立由 Worker 支援的協程調度器 (coroutine dispatcher)。</li>
<li>使用 `newFixedThreadPoolContext` 建立由 `N` 個 Worker 池支援的協程調度器。</li>
<li>`Dispatchers.Main` 由 Darwin 上的主佇列和其它平台上的獨立 Worker 支援。</li>
</list>
### Ktor
        更新到 2.0 或更高版本。
### 其他依賴項
<p>
   大多數庫應該可以正常工作而無需任何更改，但是，可能會有例外。
</p>
<p>
   確保您將依賴項更新到最新版本，並且舊版和新版記憶體管理員的庫版本之間沒有差異。
</p>
    

## 更新您的程式碼

為了支援新的記憶體管理員，請刪除受影響的 API 的用法：

| 舊 API                                                                                                                                         | 該怎麼做                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 您可以刪除所有用法，儘管在新記憶體管理員中使用此 API 沒有警告。                                                                                            |
| [The `FreezableAtomicReference` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 使用 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/) 代替。                                        |
| [The `FreezingException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 刪除所有用法。                                                                                                                                                |                                                                                                      |
| [The `InvalidMutabilityException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 刪除所有用法。                                                                                                                                                |
| [The `IncorrectDereferenceException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 刪除所有用法。                                                                                                                                                |
| [The `freeze()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 刪除所有用法。                                                                                                                                                |
| [The `isFrozen` property](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 您可以刪除所有用法。 由於凍結 (freezing) 已被棄用 (deprecated)，因此該屬性始終返回 `false`。                                                                     |                                                                                                                  
| [The `ensureNeverFrozen()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 刪除所有用法。                                                                                                                                                |
| [The `atomicLazy()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 使用 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) 代替。                                                                            |
| [The `MutableData` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 使用任何常規集合代替。                                                                                                                               |
| [The `WorkerBoundReference<out T : Any>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | 直接使用 `T`。                                                                                                                                                 |
| [The `DetachedObjectGraph<T>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | 直接使用 `T`。 要通過 C 互操作傳遞值，請使用 [the StableRef class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)。 |

## 接下來

* [了解更多關於新的記憶體管理員](native-memory-manager)
* [檢查與 Swift/Objective-C ARC 整合的細節](native-arc-integration)