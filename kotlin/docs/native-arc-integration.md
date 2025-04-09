---
title: "与 Swift/Objective-C ARC 集成"
---
Kotlin 和 Objective-C 使用不同的内存管理策略。Kotlin 采用追踪垃圾回收器（tracing garbage collector），而 Objective-C 依赖于自动引用计数 (ARC)。

这两种策略之间的集成通常是无缝的，一般不需要额外的工作。但是，您应该记住一些细节：

## 线程

### 析构器（Deinitializers）

如果 Swift/Objective-C 对象以及它们引用的对象在主线程上传递给 Kotlin，则这些对象的反初始化会在主线程上调用，例如：

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

如果出现以下情况，Swift/Objective-C 对象的反初始化将在一个特殊的 GC 线程上调用，而不是在主线程上：

* Swift/Objective-C 对象在主线程之外的线程上传递给 Kotlin。
* 主分发队列（main dispatch queue）未被处理。

如果您想显式地在特殊的 GC 线程上调用反初始化，请在您的 `gradle.properties` 中设置 `kotlin.native.binary.objcDisposeOnMain=false`。即使 Swift/Objective-C 对象是在主线程上传递给 Kotlin 的，此选项也会启用在特殊的 GC 线程上进行反初始化。

特殊的 GC 线程符合 Objective-C 运行时（runtime），这意味着它有一个运行循环（run loop）并消耗自动释放池（drain autorelease pools）。

### 完成处理程序（Completion handlers）

从 Swift 调用 Kotlin 挂起函数时，完成处理程序可能会在主线程之外的线程上调用，例如：

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

输出结果：

```text
Running test on <_NSMainThread: 0x600001b100c0>{number = 1, name = main}
Hello
World!
Running completion handler on <NSThread: 0x600001b45bc0>{number = 7, name = (null)}
```

## 垃圾回收和生命周期

### 对象回收（Object reclamation）

只有在垃圾回收期间才会回收对象。这适用于跨互操作边界进入 Kotlin/Native 的 Swift/Objective-C 对象，例如：

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

Objective-C 对象的生命周期可能比它们应该的更长，这有时可能会导致性能问题。例如，当一个长时间运行的循环在每次迭代中创建几个跨越 Swift/Objective-C 互操作边界的临时对象时。

在[GC 日志](native-memory-manager#monitor-gc-performance)中，根集中有一个稳定的引用（stable refs）数量。如果这个数字持续增长，可能表明 Swift/Objective-C 对象没有在应该释放的时候被释放。在这种情况下，尝试在进行互操作调用的循环体周围使用 `autoreleasepool` 块：

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

### Swift 和 Kotlin 对象链的垃圾回收

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
        // 这里，我们创建了以下链：
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

日志中出现 "deinit SwiftStorage first" 和 "deinit SwiftStorage second" 消息之间需要一些时间。原因是 `firstKotlinStorage` 和 `secondKotlinStorage` 在不同的 GC 周期中被回收。以下是事件的顺序：

1. `KotlinExample.action` 完成。`firstKotlinStorage` 被认为是“死亡的（dead）”，因为没有任何东西引用它，而 `secondKotlinStorage` 不是，因为它被 `firstSwiftStorage` 引用。
2. 第一个 GC 周期开始，`firstKotlinStorage` 被回收。
3. 没有对 `firstSwiftStorage` 的引用，所以它也“死亡”，并且调用 `deinit`。
4. 第二个 GC 周期开始。`secondKotlinStorage` 被回收，因为 `firstSwiftStorage` 不再引用它。
5. `secondSwiftStorage` 最终被回收。

需要两个 GC 周期来回收这四个对象，因为 Swift 和 Objective-C 对象的反初始化发生在 GC 周期之后。这种限制源于 `deinit`，它可以调用任意代码，包括在 GC 暂停期间无法运行的 Kotlin 代码。

### 循环引用（Retain cycles）

在 *循环引用* 中，多个对象使用强引用（strong references）以循环方式相互引用：

<img src="/img/native-retain-cycle.png" alt="Retain cycles" style={{verticalAlign: 'middle'}}/>

Kotlin 的追踪 GC 和 Objective-C 的 ARC 以不同的方式处理循环引用。当对象变得不可达时，Kotlin 的 GC 可以正确地回收这些循环，而 Objective-C 的 ARC 不能。因此，Kotlin 对象的循环引用可以被回收，而 [Swift/Objective-C 对象的循环引用不能](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-Between-Class-Instances)。

考虑循环引用包含 Objective-C 和 Kotlin 对象的情况：

<img src="/img/native-objc-kotlin-retain-cycles.png" alt="Retain cycles with Objective-C and Kotlin objects" style={{verticalAlign: 'middle'}}/>

这涉及到组合 Kotlin 和 Objective-C 的内存管理模型，它们不能一起处理（回收）循环引用。这意味着如果至少存在一个 Objective-C 对象，则无法回收整个对象图的循环引用，并且无法从 Kotlin 端打破循环。

不幸的是，目前没有特殊的工具可以自动检测 Kotlin/Native 代码中的循环引用。为了避免循环引用，请使用 [弱引用（weak）或无主引用（unowned references）](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Resolving-Strong-Reference-Cycles-Between-Class-Instances)。

## 对后台状态和 App Extensions 的支持

当前的内存管理器默认情况下不跟踪应用程序状态，并且不与 [App Extensions](https://developer.apple.com/app-extensions/) 集成。

这意味着内存管理器不会相应地调整 GC 行为，这在某些情况下可能是有害的。要更改此行为，请将以下[实验性](components-stability)二进制选项添加到您的 `gradle.properties` 中：

```none
kotlin.native.binary.appStateTracking=enabled
```

当应用程序在后台时，它会关闭基于计时器的垃圾回收器调用，因此仅当内存消耗过高时才会调用 GC。

## 接下来

了解更多关于 [Swift/Objective-C 互操作性](native-objc-interop)。