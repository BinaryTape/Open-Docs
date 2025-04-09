---
title: "與 Swift/Objective-C ARC 整合"
---
Kotlin 和 Objective-C 使用不同的記憶體管理策略。Kotlin 有追蹤式垃圾回收器 (tracing garbage collector)，而 Objective-C 則依賴自動引用計數 (ARC, automatic reference counting)。

這些策略之間的整合通常是無縫的，通常不需要額外的工作。 但是，您應該牢記一些具體事項：

## Threads (執行緒)

### Deinitializers (解構式)

如果 Swift/Objective-C 物件及其引用的物件在主執行緒上傳遞到 Kotlin，則 Swift/Objective-C 物件上的解構式會在主執行緒上呼叫，例如：

```kotlin
// Kotlin
class KotlinExample {
    fun action(arg: Any) {
        println(arg)
    }
}
```

```swift
// Swift
class SwiftExample {
    init() {
        print("init on \(Thread.current)")
    }

    deinit {
        print("deinit on \(Thread.current)")
    }
}

func test() {
    KotlinExample().action(arg: SwiftExample())
}
```

產生的輸出：

```text
init on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
shared.SwiftExample
deinit on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
```

如果符合以下條件，則 Swift/Objective-C 物件上的解構式會在特殊的 GC 執行緒上呼叫，而不是在主執行緒上呼叫：

* Swift/Objective-C 物件在主執行緒以外的執行緒上傳遞到 Kotlin。
* 未處理主調度佇列 (main dispatch queue)。

如果您想在特殊的 GC 執行緒上顯式呼叫解構式，請在 `gradle.properties` 中設定 `kotlin.native.binary.objcDisposeOnMain=false`。 即使 Swift/Objective-C 物件是在主執行緒上傳遞到 Kotlin，此選項也會在特殊的 GC 執行緒上啟用解構式。

特殊的 GC 執行緒符合 Objective-C 執行時 (runtime)，這表示它具有一個執行迴圈 (run loop) 並排空自動釋放池 (drain autorelease pools)。

### Completion handlers (完成處理常式)

從 Swift 呼叫 Kotlin 暫停函式 (suspending functions) 時，完成處理常式可能會在主執行緒以外的執行緒上呼叫，例如：

```kotlin
// Kotlin
// coroutineScope, launch, and delay are from kotlinx.coroutines
suspend fun asyncFunctionExample() = coroutineScope {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
```

```swift
// Swift
func test() {
    print("Running test on \(Thread.current)")
    PlatformKt.asyncFunctionExample(completionHandler: { _ in
        print("Running completion handler on \(Thread.current)")
    })
}
```

產生的輸出：

```text
Running test on <_NSMainThread: 0x600001b100c0>{number = 1, name = main}
Hello
World!
Running completion handler on <NSThread: 0x600001b45bc0>{number = 7, name = (null)}
```

## Garbage collection and lifecycle (垃圾回收和生命週期)

### Object reclamation (物件回收)

只有在垃圾回收期間才會回收物件。 這適用於跨越互通邊界 (interop boundaries) 進入 Kotlin/Native 的 Swift/Objective-C 物件，例如：

```kotlin
// Kotlin
class KotlinExample {
    fun action(arg: Any) {
        println(arg)
    }
}
```

```swift
// Swift
class SwiftExample {
    deinit {
        print("SwiftExample deinit")
    }
}

func test() {
    swiftTest()
    kotlinTest()
}

func swiftTest() {
    print(SwiftExample())
    print("swiftTestFinished")
}

func kotlinTest() {
    KotlinExample().action(arg: SwiftExample())
    print("kotlinTest finished")
}
```

產生的輸出：

```text
shared.SwiftExample
SwiftExample deinit
swiftTestFinished
shared.SwiftExample
kotlinTest finished
SwiftExample deinit
```

### Objective-C objects lifecycle (Objective-C 物件生命週期)

Objective-C 物件的存活時間可能比它們應有的時間長，這有時可能會導致效能問題。 例如，當一個長時間運行的迴圈在每次迭代時建立幾個跨越 Swift/Objective-C 互通邊界的臨時物件時。

在 [GC 日誌](native-memory-manager#monitor-gc-performance)中，根集中 (root set) 有許多穩定的引用 (stable refs)。 如果這個數字持續增長，則可能表示 Swift/Objective-C 物件在它們應該釋放時沒有被釋放。 在這種情況下，請在執行互通呼叫的迴圈主體周圍嘗試 `autoreleasepool` 塊：

```kotlin
// Kotlin
fun growingMemoryUsage() {
    repeat(Int.MAX_VALUE) {
        NSLog("$it
")
    }
}

fun steadyMemoryUsage() {
    repeat(Int.MAX_VALUE) {
        autoreleasepool {
            NSLog("$it
")
        }
    }
}
```

### Garbage collection of Swift and Kotlin objects' chains (Swift 和 Kotlin 物件鏈的垃圾回收)

考慮以下範例：

```kotlin
// Kotlin
interface Storage {
    fun store(arg: Any)
}

class KotlinStorage(var field: Any? = null) : Storage {
    override fun store(arg: Any) {
        field = arg
    }
}

class KotlinExample {
    fun action(firstSwiftStorage: Storage, secondSwiftStorage: Storage) {
        // Here, we create the following chain:
        // firstKotlinStorage `->` firstSwiftStorage `->` secondKotlinStorage `->` secondSwiftStorage.
        val firstKotlinStorage = KotlinStorage()
        firstKotlinStorage.store(firstSwiftStorage)
        val secondKotlinStorage = KotlinStorage()
        firstSwiftStorage.store(secondKotlinStorage)
        secondKotlinStorage.store(secondSwiftStorage)
    }
}
```

```swift
// Swift
class SwiftStorage : Storage {

    let name: String

    var field: Any? = nil

    init(_ name: String) {
        self.name = name
    }

    func store(arg: Any) {
        field = arg
    }

    deinit {
        print("deinit SwiftStorage \(name)")
    }
}

func test() {
    KotlinExample().action(
        firstSwiftStorage: SwiftStorage("first"),
        secondSwiftStorage: SwiftStorage("second")
    )
}
```

從日誌中出現 "deinit SwiftStorage first" 和 "deinit SwiftStorage second" 訊息之間需要一些時間。 原因是 `firstKotlinStorage` 和 `secondKotlinStorage` 在不同的 GC 週期中收集。 這是事件的順序：

1. `KotlinExample.action` 完成。 `firstKotlinStorage` 被認為是 "dead" (無效的)，因為沒有任何東西引用它，而 `secondKotlinStorage` 不是，因為它被 `firstSwiftStorage` 引用。
2. 第一個 GC 週期開始，並且收集 `firstKotlinStorage`。
3. 沒有對 `firstSwiftStorage` 的引用，因此它也是 "dead" (無效的)，並且呼叫 `deinit`。
4. 第二個 GC 週期開始。 收集 `secondKotlinStorage`，因為 `firstSwiftStorage` 不再引用它。
5. 最終回收 `secondSwiftStorage`。

收集這四個物件需要兩個 GC 週期，因為 Swift 和 Objective-C 物件的解構式在 GC 週期之後發生。 這種限制源於 `deinit`，它可以呼叫任意程式碼，包括在 GC 暫停期間無法運行的 Kotlin 程式碼。

### Retain cycles (保留環)

在 *保留環 (retain cycle)* 中，許多物件使用強引用 (strong references) 循環地互相引用：

<img src="/img/native-retain-cycle.png" alt="Retain cycles" style={{verticalAlign: 'middle'}}/>

Kotlin 的追蹤式 GC 和 Objective-C 的 ARC 以不同的方式處理保留環。 當物件變得無法訪問時，Kotlin 的 GC 可以正確地回收這些環，而 Objective-C 的 ARC 無法做到。 因此，Kotlin 物件的保留環可以被回收，而 [Swift/Objective-C 物件的保留環則不能](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-Between-Class-Instances)。

考慮一下保留環包含 Objective-C 和 Kotlin 物件的情況：

<img src="/img/native-objc-kotlin-retain-cycles.png" alt="Retain cycles with Objective-C and Kotlin objects" style={{verticalAlign: 'middle'}}/>

這涉及組合 Kotlin 和 Objective-C 的記憶體管理模型，這些模型無法一起處理（回收）保留環。 這意味著如果存在至少一個 Objective-C 物件，則無法回收整個物件圖的保留環，並且無法從 Kotlin 端打破該環。

不幸的是，目前沒有特殊的工具可以自動檢測 Kotlin/Native 程式碼中的保留環。 為了避免保留環，請使用 [weak or unowned references (弱引用或無主引用)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Resolving-Strong-Reference-Cycles-Between-Class-Instances)。

## Support for background state and App Extensions (後台狀態和應用程式擴展的支援)

預設情況下，目前的記憶體管理器不會追蹤應用程式狀態，並且不會與 [App Extensions (應用程式擴展)](https://developer.apple.com/app-extensions/) 開箱即用整合。

這意味著記憶體管理器不會相應地調整 GC 行為，這在某些情況下可能是有害的。 若要變更此行為，請將以下 [Experimental](components-stability) 二進位選項新增至您的 `gradle.properties`：

```none
kotlin.native.binary.appStateTracking=enabled
```

當應用程式在後台時，它會關閉基於計時器的垃圾回收器呼叫，因此僅當記憶體消耗過高時才會呼叫 GC。

## What's next (下一步)

了解更多關於 [Swift/Objective-C interoperability (Swift/Objective-C 互通性)](native-objc-interop) 的資訊。