[//]: # (title: 与 Swift/Objective-C ARC 的集成)

Kotlin 和 Objective-C 使用不同的内存管理策略。Kotlin 拥有一个追踪式垃圾回收器，而 Objective-C 则依赖于自动引用计数（ARC）。

这些策略之间的集成通常是无缝的，一般不需要额外的工作。然而，你应该牢记一些细节：

## 线程

### 析构函数

如果 Swift/Objective-C 对象在主线程上被传递给 Kotlin，那么这些对象及其引用的对象的析构过程将在主线程上调用，例如：

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

输出结果：

```text
init on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
shared.SwiftExample
deinit on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
```

在以下情况下，Swift/Objective-C 对象的析构过程将在特殊的 GC 线程而不是主线程上调用：

* Swift/Objective-C 对象在非主线程上被传递给 Kotlin。
* 主调度队列（main dispatch queue）未被处理。

如果你想显式地在特殊 GC 线程上调用析构过程，请在你的 `gradle.properties` 中设置 `kotlin.native.binary.objcDisposeOnMain=false`。即使 Swift/Objective-C 对象是在主线程上传递给 Kotlin 的，此选项也会启用特殊 GC 线程上的析构过程。

特殊的 GC 线程符合 Objective-C 运行时规范，这意味着它拥有运行循环（run loop）并会排空自动释放池（autorelease pool）。

### 完成处理程序

从 Swift 调用 Kotlin 挂起函数时，完成处理程序可能会在主线程之外的线程上调用，例如：

```kotlin
// Kotlin
// coroutineScope, launch, and delay 来自 kotlinx.coroutines
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

输出结果：

```text
Running test on <_NSMainThread: 0x600001b100c0>{number = 1, name = main}
Hello
World!
Running completion handler on <NSThread: 0x600001b45bc0>{number = 7, name = (null)}
```

## 垃圾回收与生命周期

### 对象回收

对象仅在垃圾回收期间被回收。这适用于跨越互操作边界进入 Kotlin/Native 的 Swift/Objective-C 对象，例如：

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

输出结果：

```text
shared.SwiftExample
SwiftExample deinit
swiftTestFinished
shared.SwiftExample
kotlinTest finished
SwiftExample deinit
```

### Objective-C 对象生命周期

Objective-C 对象的存活时间可能比预期的更长，这有时可能会导致性能问题。例如，当一个长时间运行的循环在每次迭代中创建多个跨越 Swift/Objective-C 互操作边界的临时对象时。

在 [GC 日志](native-memory-manager.md#monitor-gc-performance)中，根集中有一定数量的稳定引用。如果这个数字持续增长，可能表明 Swift/Objective-C 对象没有在应当释放的时候被释放。在这种情况下，请尝试在执行互操作调用的循环体周围使用 `autoreleasepool` 块：

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

### Swift 与 Kotlin 对象链的垃圾回收

考虑以下示例：

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
        // 在这里，我们创建了以下链：
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

日志中出现 "deinit SwiftStorage first" 和 "deinit SwiftStorage second" 消息之间需要一些时间。原因是 `firstKotlinStorage` 和 `secondKotlinStorage` 是在不同的 GC 周期中被回收的。以下是事件序列：

1. `KotlinExample.action` 运行结束。`firstKotlinStorage` 被视为“死亡”，因为没有东西引用它，而 `secondKotlinStorage` 则不是，因为它被 `firstSwiftStorage` 引用。
2. 第一个 GC 周期开始，`firstKotlinStorage` 被回收。
3. 此时不再有对 `firstSwiftStorage` 的引用，因此它也“死亡”了，并调用了 `deinit`。
4. 第二个 GC 周期开始。`secondKotlinStorage` 被回收，因为 `firstSwiftStorage` 不再引用它。
5. `secondSwiftStorage` 最终被回收。

收集这四个对象需要两个 GC 周期，因为 Swift 和 Objective-C 对象的析构过程发生在 GC 周期之后。这种限制源于 `deinit`，它可以调用任意代码，包括无法在 GC 暂停期间运行的 Kotlin 代码。

### 循环引用

在“循环引用”（retain cycle）中，多个对象通过强引用循环地相互引用：

```mermaid
graph TD
    A --> B
    B --> C
    C --> A
```

Kotlin 的追踪式 GC 和 Objective-C 的 ARC 处理循环引用的方式不同。当对象变得不可达时，Kotlin 的 GC 可以正确回收此类循环，而 Objective-C 的 ARC 则不能。因此，Kotlin 对象的循环引用可以被回收，而 [Swift/Objective-C 对象的循环引用则不能](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-Between-Class-Instances)。

考虑循环引用中同时包含 Objective-C 和 Kotlin 对象的情况：

```mermaid
graph TD
    Kotlin.A --> ObjC.B
    ObjC.B --> Kotlin.A
```

这涉及到结合 Kotlin 和 Objective-C 的内存管理模型，它们无法共同处理（回收）循环引用。这意味着只要存在至少一个 Objective-C 对象，整个对象图的循环引用就无法被回收，并且无法从 Kotlin 侧打破该循环。

遗憾的是，目前没有专门的工具可以自动检测 Kotlin/Native 代码中的循环引用。为了避免循环引用，请使用[弱引用或无主引用](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Resolving-Strong-Reference-Cycles-Between-Class-Instances)。

## 对后台状态和应用扩展的支持

目前的内存管理器默认不会跟踪应用程序状态，并且不会开箱即用地与 [应用扩展](https://developer.apple.com/app-extensions/) 集成。

这意味着内存管理器不会相应地调整 GC 行为，这在某些情况下可能是有害的。要更改此行为，请在你的 `gradle.properties` 中添加以下[实验性](components-stability.md)二进制选项：

```none
kotlin.native.binary.appStateTracking=enabled
```

当应用程序处于后台时，它会关闭基于定时器的垃圾回收器调用，因此只有在内存消耗过高时才会调用 GC。

## 下一步

详细了解 [Swift/Objective-C 互操作性](native-objc-interop.md)。