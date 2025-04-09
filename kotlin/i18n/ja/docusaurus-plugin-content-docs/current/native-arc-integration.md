---
title: "Swift/Objective-C ARC との統合"
---
KotlinとObjective-Cは、異なるメモリ管理戦略を使用します。Kotlinはトレース型ガベージコレクタを持ち、一方Objective-Cは自動参照カウント(ARC)に依存しています。

通常、これらの戦略間の統合はシームレスであり、追加の作業は必要ありません。ただし、留意すべき点がいくつかあります。

## スレッド

### デイニシャライザ

Swift/Objective-Cのオブジェクト、およびそれらが参照するオブジェクトのデイニシャライズは、これらのオブジェクトがメインスレッドでKotlinに渡された場合、メインスレッドで呼び出されます。例：

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

結果の出力：

```text
init on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
shared.SwiftExample
deinit on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
```

Swift/Objective-Cオブジェクトのデイニシャライズは、以下の場合に、メインスレッドではなく、特別なGCスレッドで呼び出されます。

* Swift/Objective-Cオブジェクトがメイン以外のスレッドでKotlinに渡された場合。
* メインディスパッチキューが処理されない場合。

特別なGCスレッドで明示的にデイニシャライズを呼び出したい場合は、`gradle.properties`で`kotlin.native.binary.objcDisposeOnMain=false`を設定してください。このオプションは、Swift/Objective-CオブジェクトがメインスレッドでKotlinに渡された場合でも、特別なGCスレッドでのデイニシャライズを有効にします。

特別なGCスレッドはObjective-C runtimeに準拠しており、ランループを持ち、autorelease poolをdrainします。

### 完了ハンドラ

SwiftからKotlinのsuspend関数を呼び出す場合、完了ハンドラがメインスレッド以外のスレッドで呼び出されることがあります。例：

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

結果の出力：

```text
Running test on <_NSMainThread: 0x600001b100c0>{number = 1, name = main}
Hello
World!
Running completion handler on <NSThread: 0x600001b45bc0>{number = 7, name = (null)}
```

## ガベージコレクションとライフサイクル

### オブジェクトの再利用

オブジェクトはガベージコレクション中にのみ再利用されます。これは、Interop境界を越えてKotlin/Nativeに入るSwift/Objective-Cオブジェクトに適用されます。例：

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

結果の出力：

```text
shared.SwiftExample
SwiftExample deinit
swiftTestFinished
shared.SwiftExample
kotlinTest finished
SwiftExample deinit
```

### Objective-Cオブジェクトのライフサイクル

Objective-Cオブジェクトは必要以上に長く生存する可能性があり、パフォーマンス上の問題を引き起こすことがあります。たとえば、長時間のループで、各イテレーションでSwift/Objective-C interop境界を越える一時オブジェクトが複数作成される場合などです。

[GC logs](native-memory-manager#monitor-gc-performance)には、root set内のstable refsの数が表示されます。この数が増え続ける場合は、Swift/Objective-Cオブジェクトが解放されるべき時に解放されていないことを示している可能性があります。この場合は、Interop呼び出しを行うループ本体の周りに`autoreleasepool`ブロックを試してください。

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

### SwiftとKotlinオブジェクトのチェーンのガベージコレクション

次の例を考えてみましょう。

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

ログに"deinit SwiftStorage first"と"deinit SwiftStorage second"のメッセージが表示されるまでに時間がかかります。その理由は、`firstKotlinStorage`と`secondKotlinStorage`が異なるGCサイクルで収集されるためです。イベントのシーケンスは次のとおりです。

1. `KotlinExample.action`が終了します。`firstKotlinStorage`は、何も参照していないため「dead」と見なされます。一方、`secondKotlinStorage`は、`firstSwiftStorage`によって参照されているため「dead」とは見なされません。
2. 最初のGCサイクルが開始され、`firstKotlinStorage`が収集されます。
3. `firstSwiftStorage`への参照がないため、これも「dead」となり、`deinit`が呼び出されます。
4. 2番目のGCサイクルが開始されます。`firstSwiftStorage`が参照しなくなったため、`secondKotlinStorage`が収集されます。
5. 最後に、`secondSwiftStorage`が再利用されます。

これらの4つのオブジェクトを収集するには、2つのGCサイクルが必要です。SwiftおよびObjective-CオブジェクトのデイニシャライズはGCサイクルの後に行われるためです。この制限は、`deinit`に起因します。`deinit`は、GC一時停止中に実行できないKotlinコードを含む任意のコードを呼び出すことができます。

### 循環参照

_循環参照_では、複数のオブジェクトが強い参照を使用して互いに循環的に参照します。

<img src="/img/native-retain-cycle.png" alt="Retain cycles" style={{verticalAlign: 'middle'}}/>

KotlinのトレースGCとObjective-CのARCは、循環参照を異なる方法で処理します。オブジェクトが到達不能になった場合、KotlinのGCはこのようなサイクルを適切に再利用できますが、Objective-CのARCはできません。したがって、Kotlinオブジェクトの循環参照は再利用できますが、[Swift/Objective-Cオブジェクトの循環参照はできません](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-Between-Class-Instances)。

循環参照にObjective-CオブジェクトとKotlinオブジェクトの両方が含まれる場合を考えてみましょう。

<img src="/img/native-objc-kotlin-retain-cycles.png" alt="Retain cycles with Objective-C and Kotlin objects" style={{verticalAlign: 'middle'}}/>

これには、KotlinとObjective-Cのメモリ管理モデルを組み合わせることが含まれ、循環参照を一緒に処理（再利用）できません。つまり、少なくとも1つのObjective-Cオブジェクトが存在する場合、オブジェクトのグラフ全体の循環参照を再利用できず、Kotlin側からサイクルを解除することは不可能です。

残念ながら、Kotlin/Nativeコードで循環参照を自動的に検出するための特別なツールは現在利用できません。循環参照を回避するには、[weak または unowned 参照](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Resolving-Strong-Reference-Cycles-Between-Class-Instances)を使用してください。

## バックグラウンド状態とApp Extensionsのサポート

現在のメモリマネージャは、デフォルトではアプリケーションの状態を追跡せず、[App Extensions](https://developer.apple.com/app-extensions/)とそのままでは統合されません。

これは、メモリマネージャがそれに応じてGCの動作を調整しないことを意味し、場合によっては有害となる可能性があります。この動作を変更するには、次の[Experimental](components-stability)バイナリオプションを`gradle.properties`に追加します。

```none
kotlin.native.binary.appStateTracking=enabled
```

これにより、アプリケーションがバックグラウンドにあるときにタイマーベースのガベージコレクタの呼び出しが無効になるため、GCはメモリ消費が高くなりすぎた場合にのみ呼び出されます。

## 次のステップ

[Swift/Objective-C interop](native-objc-interop)について詳しく学んでください。