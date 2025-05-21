---
title: "Swift/Objective-C ARC와의 통합"
---
Kotlin과 Objective-C는 서로 다른 메모리 관리 전략을 사용합니다. Kotlin은 추적 가비지 컬렉터를 사용하는 반면, Objective-C는 자동 참조 카운팅(ARC)에 의존합니다.

이러한 전략 간의 통합은 일반적으로 매끄럽게 이루어지며 추가 작업이 거의 필요하지 않습니다. 그러나 몇 가지 유념해야 할 사항이 있습니다.

## 스레드

### 초기화 해제

Swift/Objective-C 객체 및 해당 객체가 참조하는 객체의 초기화 해제는 다음의 경우 메인 스레드에서 호출됩니다.
이러한 객체가 메인 스레드에서 Kotlin으로 전달되는 경우, 예를 들어 다음과 같습니다.

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

결과 출력:

```text
init on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
shared.SwiftExample
deinit on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
```

Swift/Objective-C 객체의 초기화 해제는 다음과 같은 경우 메인 스레드 대신 특수 GC 스레드에서 호출됩니다.

* Swift/Objective-C 객체가 메인이 아닌 다른 스레드에서 Kotlin으로 전달되는 경우.
* 메인 디스패치 큐가 처리되지 않는 경우.

특수 GC 스레드에서 초기화 해제를 명시적으로 호출하려면 `gradle.properties`에서 `kotlin.native.binary.objcDisposeOnMain=false`를 설정하세요. 이 옵션은
Swift/Objective-C 객체가 메인 스레드에서 Kotlin으로 전달된 경우에도 특수 GC 스레드에서 초기화 해제를 활성화합니다.

특수 GC 스레드는 Objective-C 런타임을 준수하며, 이는 런 루프가 있고
자동 해제 풀을 비운다는 것을 의미합니다.

### 완료 핸들러

Swift에서 Kotlin 일시 중단 함수를 호출할 때 완료 핸들러는 메인 스레드가 아닌 다른 스레드에서 호출될 수 있습니다.
예를 들어 다음과 같습니다.

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

결과 출력:

```text
Running test on <_NSMainThread: 0x600001b100c0>{number = 1, name = main}
Hello
World!
Running completion handler on <NSThread: 0x600001b45bc0>{number = 7, name = (null)}
```

## 가비지 컬렉션 및 라이프사이클

### 객체 회수

객체는 가비지 컬렉션 중에만 회수됩니다. 이는 interop 경계를 넘어 Kotlin/Native로 넘어오는 Swift/Objective-C 객체에 적용됩니다.
예를 들어 다음과 같습니다.

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

결과 출력:

```text
shared.SwiftExample
SwiftExample deinit
swiftTestFinished
shared.SwiftExample
kotlinTest finished
SwiftExample deinit
```

### Objective-C 객체 라이프사이클

Objective-C 객체는 필요 이상으로 오래 살아남을 수 있으며, 이는 때때로 성능 문제를 일으킬 수 있습니다. 예를 들어,
장시간 실행되는 루프가 각 반복에서 Swift/Objective-C interop 경계를 넘는 여러 임시 객체를 생성하는 경우입니다.

[GC 로그](native-memory-manager#monitor-gc-performance)에는 루트 세트에 안정적인 참조 수가 있습니다.
이 숫자가 계속 증가하면 Swift/Objective-C 객체가 해제되어야 할 때 해제되지 않는다는 것을 나타낼 수 있습니다.
이 경우 interop 호출을 수행하는 루프 본문 주위에 `autoreleasepool` 블록을 사용해 보세요.

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

### Swift 및 Kotlin 객체 체인의 가비지 컬렉션

다음 예제를 고려해 보세요.

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

로그에 "deinit SwiftStorage first" 및 "deinit SwiftStorage second" 메시지가 나타나기까지 시간이 걸립니다.
그 이유는 `firstKotlinStorage` 및 `secondKotlinStorage`가 서로 다른 GC 주기에서 수집되기 때문입니다.
이벤트 순서는 다음과 같습니다.

1. `KotlinExample.action`이 완료됩니다. `firstKotlinStorage`는 아무것도 참조하지 않으므로 "dead"로 간주되는 반면,
    `secondKotlinStorage`는 `firstSwiftStorage`에서 참조하므로 그렇지 않습니다.
2. 첫 번째 GC 주기가 시작되고 `firstKotlinStorage`가 수집됩니다.
3. `firstSwiftStorage`에 대한 참조가 없으므로 "dead"로 간주되어 `deinit`가 호출됩니다.
4. 두 번째 GC 주기가 시작됩니다. `firstSwiftStorage`가 더 이상 참조하지 않으므로 `secondKotlinStorage`가 수집됩니다.
5. `secondSwiftStorage`가 최종적으로 회수됩니다.

Swift 및 Objective-C 객체의 초기화 해제가 GC 주기 후에 발생하기 때문에 이러한 네 개의 객체를 수집하는 데 두 개의 GC 주기가 필요합니다.
이러한 제한은 `deinit`에서 GC 일시 중지 중에 실행할 수 없는 Kotlin 코드를 포함하여 임의의 코드를 호출할 수 있다는 데서 비롯됩니다.

### Retain cycles

_retain cycle_에서 여러 객체가 강력한 참조를 사용하여 서로 순환적으로 참조합니다.

<img src="/img/native-retain-cycle.png" alt="Retain cycles" style={{verticalAlign: 'middle'}}/>

Kotlin의 추적 GC와 Objective-C의 ARC는 retain cycle을 다르게 처리합니다. 객체가 도달할 수 없게 되면 Kotlin의 GC는
이러한 주기를 올바르게 회수할 수 있지만 Objective-C의 ARC는 그렇지 않습니다. 따라서 Kotlin 객체의 retain cycle은 회수할 수 있지만,
[Swift/Objective-C 객체의 retain cycle은 회수할 수 없습니다](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-Between-Class-Instances).

retain cycle에 Objective-C 및 Kotlin 객체가 모두 포함된 경우를 고려해 보세요.

<img src="/img/native-objc-kotlin-retain-cycles.png" alt="Retain cycles with Objective-C and Kotlin objects" style={{verticalAlign: 'middle'}}/>

여기에는 retain cycle을 함께 처리(회수)할 수 없는 Kotlin 및 Objective-C의 메모리 관리 모델을 결합하는 것이 포함됩니다.
즉, Objective-C 객체가 하나 이상 있는 경우 전체 객체 그래프의 retain cycle은
회수할 수 없으며 Kotlin 쪽에서 주기를 끊는 것은 불가능합니다.

불행히도 현재 Kotlin/Native 코드에서 retain cycle을 자동으로 감지하는 데 사용할 수 있는 특수 도구는 없습니다.
retain cycle을 피하려면 [약한 또는 소유되지 않은 참조](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Resolving-Strong-Reference-Cycles-Between-Class-Instances)를 사용하세요.

## 백그라운드 상태 및 App Extensions 지원

현재 메모리 관리자는 기본적으로 애플리케이션 상태를 추적하지 않으며
[App Extensions](https://developer.apple.com/app-extensions/)와 바로 통합되지 않습니다.

즉, 메모리 관리자가 GC 동작을 적절하게 조정하지 않으며, 이는 일부 경우에 해로울 수 있습니다.
이 동작을 변경하려면 `gradle.properties`에 다음 [Experimental](components-stability) 바이너리 옵션을 추가하세요.

```none
kotlin.native.binary.appStateTracking=enabled
```

이 옵션은 애플리케이션이 백그라운드에 있을 때 타이머 기반 가비지 컬렉터 호출을 끄므로 메모리 소비가 너무 높아질 때만 GC가 호출됩니다.

## 다음 단계

[Swift/Objective-C 상호 운용성](native-objc-interop)에 대해 자세히 알아보세요.