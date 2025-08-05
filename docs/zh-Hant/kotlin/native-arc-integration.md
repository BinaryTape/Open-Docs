[//]: # (title: 與 Swift/Objective-C ARC 的整合)

Kotlin 和 Objective-C 使用不同的記憶體管理策略。Kotlin 擁有追蹤式垃圾收集器，而 Objective-C 則依賴自動引用計數 (ARC)。

這些策略之間的整合通常是無縫的，並且通常不需要額外的工作。然而，您應該注意一些細節：

## 執行緒

### 解初始化器

如果 Swift/Objective-C 物件及其引用的物件在主執行緒上傳遞給 Kotlin，則這些物件的解初始化會發生在主執行緒上，例如：

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

輸出結果：

```text
init on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
shared.SwiftExample
deinit on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
```

如果滿足以下條件，Swift/Objective-C 物件的解初始化將在特殊的 GC 執行緒上而非主執行緒上被呼叫：

*   Swift/Objective-C 物件在非主執行緒上傳遞給 Kotlin。
*   主派發佇列未被處理。

如果您想明確地在特殊 GC 執行緒上呼叫解初始化，請在您的 `gradle.properties` 中設定 `kotlin.native.binary.objcDisposeOnMain=false`。此選項啟用特殊 GC 執行緒上的解初始化，即使 Swift/Objective-C 物件是在主執行緒上傳遞給 Kotlin 的。

特殊 GC 執行緒符合 Objective-C 執行時的要求，這表示它擁有執行迴圈和自動釋放池。

### 完成處理器

當從 Swift 呼叫 Kotlin 暫停函式時，完成處理器可能會在非主執行緒上被呼叫，例如：

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

輸出結果：

```text
Running test on <_NSMainThread: 0x600001b100c0>{number = 1, name = main}
Hello
World!
Running completion handler on <NSThread: 0x600001b45bc0>{number = 7, name = (null)}
```

## 垃圾收集與生命週期

### 物件回收

物件僅在垃圾收集期間被回收。這適用於跨互通性邊界進入 Kotlin/Native 的 Swift/Objective-C 物件，例如：

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

輸出結果：

```text
shared.SwiftExample
SwiftExample deinit
swiftTestFinished
shared.SwiftExample
kotlinTest finished
SwiftExample deinit
```

### Objective-C 物件生命週期

Objective-C 物件的生命週期可能會比預期更長，這有時可能會導致效能問題。例如，當一個長時間執行的迴圈在每次迭代時創建多個跨越 Swift/Objective-C 互通性邊界的臨時物件時。

在 [GC 日誌](native-memory-manager.md#monitor-gc-performance)中，根集合 (root set) 裡有許多穩定引用。如果此數字持續增長，可能表示 Swift/Objective-C 物件未能在應釋放時被釋放。在這種情況下，嘗試將 `autoreleasepool` 區塊放在執行互通性呼叫的迴圈主體周圍：

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

### Swift 和 Kotlin 物件鏈的垃圾收集

請考慮以下範例：

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
        // firstKotlinStorage -> firstSwiftStorage -> secondKotlinStorage -> secondSwiftStorage.
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

"deinit SwiftStorage first" 和 "deinit SwiftStorage second" 訊息出現在日誌中需要一些時間。原因在於 `firstKotlinStorage` 和 `secondKotlinStorage` 是在不同的 GC 循環中被收集的。事件序列如下：

1.  `KotlinExample.action` 完成。`firstKotlinStorage` 被視為「已失效」，因為沒有任何東西引用它，而 `secondKotlinStorage` 則否，因為它被 `firstSwiftStorage` 引用。
2.  第一個 GC 循環開始，`firstKotlinStorage` 被收集。
3.  `firstSwiftStorage` 沒有任何引用，因此它也「已失效」，並呼叫 `deinit`。
4.  第二個 GC 循環開始。`secondKotlinStorage` 被收集，因為 `firstSwiftStorage` 不再引用它。
5.  `secondSwiftStorage` 最終被回收。

收集這四個物件需要兩個 GC 循環，因為 Swift 和 Objective-C 物件的解初始化發生在 GC 循環之後。此限制源於 `deinit` 可以呼叫任意程式碼，包括在 GC 暫停期間無法執行的 Kotlin 程式碼。

### 引用循環

在一個「引用循環」中，許多物件使用強引用彼此循環引用：

```mermaid
graph TD
    A --> B
    B --> C
    C --> A
```

Kotlin 的追蹤式 GC 和 Objective-C 的 ARC 處理引用循環的方式不同。當物件變得無法觸及時，Kotlin 的 GC 可以正確回收此類循環，而 Objective-C 的 ARC 則不能。因此，Kotlin 物件的引用循環可以被回收，而 [Swift/Objective-C 物件的引用循環則不能](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-Between-Class-Instances)。

請考慮引用循環中同時包含 Objective-C 和 Kotlin 物件的情況：

```mermaid
graph TD
    Kotlin.A --> ObjC.B
    ObjC.B --> Kotlin.A
```

這涉及到結合 Kotlin 和 Objective-C 的記憶體管理模型，它們無法共同處理（回收）引用循環。這意味著如果至少存在一個 Objective-C 物件，則整個物件圖的引用循環將無法被回收，並且無法從 Kotlin 方面打破該循環。

遺憾的是，目前沒有特殊的工具可以自動偵測 Kotlin/Native 程式碼中的引用循環。為避免引用循環，請使用 [弱引用或無主引用](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Resolving-Strong-Reference-Cycles-Between-Class-Instances)。

## 對背景狀態和 App Extensions 的支援

目前的記憶體管理器預設不追蹤應用程式狀態，也不會開箱即用地與 [App Extensions](https://developer.apple.com/app-extensions/) 整合。

這表示記憶體管理器不會相應地調整 GC 行為，這在某些情況下可能是有害的。若要更改此行為，請將以下 [實驗性](components-stability.md) 二進位選項新增到您的 `gradle.properties` 中：

```none
kotlin.native.binary.appStateTracking=enabled
```

這會在應用程式處於背景時關閉基於計時器的垃圾收集器調用，因此 GC 只會在記憶體消耗過高時才被呼叫。

## 下一步

了解更多關於 [Swift/Objective-C 互通性](native-objc-interop.md)的資訊。