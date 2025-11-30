[//]: # (title: 型チェックとキャスト)

Kotlinでは、実行時に型に関して2つのことができます。オブジェクトが特定の型であるかどうかのチェック、または、それを別の型へ変換することです。型**チェック**は、扱っているオブジェクトの種類を確認するのに役立ち、一方、型**キャスト**は、オブジェクトを別の型に変換しようとします。

> **ジェネリクス**の型チェックとキャスト（例：`List<T>`、`Map<K,V>`）について詳しく学習するには、[ジェネリクスの型チェックとキャスト](generics.md#generics-type-checks-and-casts)を参照してください。
>
{style="tip"}

## `is` および `!is` 演算子によるチェック {id="is-and-is-operators"}

`is` 演算子（またはその否定形である `!is`）を使用して、実行時にオブジェクトが型に一致するかどうかをチェックします。

```kotlin
fun main() {
    val input: Any = "Hello, Kotlin"

    if (input is String) {
        println("Message length: ${input.length}")
        // Message length: 13
    }

    if (input !is String) { // Same as !(input is String)
        println("Input is not a valid message")
    } else {
        println("Processing message: ${input.length} characters")
        // Processing message: 13 characters
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator"}

`is` および `!is` 演算子を使用して、オブジェクトがサブタイプに一致するかどうかをチェックすることもできます。

```kotlin
interface Animal {
    val name: String
    fun speak()
}

class Dog(override val name: String) : Animal {
    override fun speak() = println("$name says: Woof!")
}

class Cat(override val name: String) : Animal {
    override fun speak() = println("$name says: Meow!")
}
//sampleStart
fun handleAnimal(animal: Animal) {
    println("Handling animal: ${animal.name}")
    animal.speak()
    
    // Use is operator to check for subtypes
    if (animal is Dog) {
        println("Special care instructions: This is a dog.")
    } else if (animal is Cat) {
        println("Special care instructions: This is a cat.")
    }
}
//sampleEnd
fun main() {
    val pets: List<Animal> = listOf(
        Dog("Buddy"),
        Cat("Whiskers"),
        Dog("Rex")
    )

    for (pet in pets) {
        handleAnimal(pet)
        println("---")
    }
    // Handling animal: Buddy
    // Buddy says: Woof!
    // Special care instructions: This is a dog.
    // ---
    // Handling animal: Whiskers
    // Whiskers says: Meow!
    // Special care instructions: This is a cat.
    // ---
    // Handling animal: Rex
    // Rex says: Woof!
    // Special care instructions: This is a dog.
    // ---
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator-subtype"}

この例では、`is` 演算子を使用して、`Animal` クラスのインスタンスがサブタイプである `Dog` または `Cat` に該当するかどうかをチェックし、関連する世話の指示を出力しています。

オブジェクトがその宣言された型のスーパータイプであるかどうかをチェックすることもできますが、その答えは常に`true`であるため、それを行う価値はありません。すべてのクラスインスタンスは、すでにそのスーパータイプのインスタンスです。

> 実行時にオブジェクトの型を識別するには、[リフレクション](reflection.md)を参照してください。
>
{type="tip"}

## 型キャスト

Kotlinでオブジェクトの型を別の型に変換することを**キャスト**と呼びます。

場合によっては、コンパイラが自動的にオブジェクトをキャストします。これはスマートキャストと呼ばれます。

型を明示的にキャストする必要がある場合は、`as?` または `as` [キャスト演算子](#unsafe-cast-operator)を使用します。

## スマートキャスト

コンパイラは、不変な値に対する型チェックと[明示的なキャスト](#unsafe-cast-operator)を追跡し、暗黙的な（安全な）キャストを自動的に挿入します。

```kotlin
fun logMessage(data: Any) {
    // data is automatically cast to String
    if (data is String) {
        println("Received text: ${data.length} characters")
    }
}

fun main() {
    logMessage("Server started")
    // Received text: 14 characters
    logMessage(404)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast"}

コンパイラは、否定的なチェックがリターンにつながる場合にキャストが安全であることを認識するほど賢明です。

```kotlin
fun logMessage(data: Any) {
    // data is automatically cast to String
    if (data !is String) return

    println("Received text: ${data.length} characters")
}

fun main() {
    logMessage("User signed in")
    // Received text: 14 characters
    logMessage(true)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-negative"}

### 制御フロー

スマートキャストは、`if` 条件式だけでなく、[`when` 式](control-flow.md#when-expressions-and-statements)でも機能します。

```kotlin
fun processInput(data: Any) {
    when (data) {
        // data is automatically cast to Int
        is Int -> println("Log: Assigned new ID ${data + 1}")
        // data is automatically cast to String
        is String -> println("Log: Received message \"$data\"")
        // data is automatically cast to IntArray
        is IntArray -> println("Log: Processed scores, total = ${data.sum()}")
    }
}

fun main() {
    processInput(1001)
    // Log: Assigned new ID 1002
    processInput("System rebooted")
    // Log: Received message "System rebooted"
    processInput(intArrayOf(10, 20, 30))
    // Log: Processed scores, total = 60
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-when"}

そして、[`while` ループ](control-flow.md#while-loops)でも機能します。

```kotlin
sealed interface Status
data class Ok(val currentRoom: String) : Status
data object Error : Status

class RobotVacuum(val rooms: List<String>) {
    var index = 0

    fun status(): Status =
        if (index < rooms.size) Ok(rooms[index])
        else Error

    fun clean(): Status {
        println("Finished cleaning ${rooms[index]}")
        index++
        return status()
    }
}

fun main() {
    //sampleStart
    val robo = RobotVacuum(listOf("Living Room", "Kitchen", "Hallway"))

    var status: Status = robo.status()
    while (status is Ok) {
        // The compiler smart casts status to OK type, so the currentRoom
        // property is accessible.
        println("Cleaning ${status.currentRoom}...")
        status = robo.clean()
    }
    // Cleaning Living Room...
    // Finished cleaning Living Room
    // Cleaning Kitchen...
    // Finished cleaning Kitchen
    // Cleaning Hallway...
    // Finished cleaning Hallway
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-while"}

この例では、sealedインターフェース `Status` には2つの実装があります。データクラス `Ok` とデータオブジェクト `Error` です。`Ok` データクラスのみが `currentRoom` プロパティを持っています。`while` ループの条件が `true` と評価されると、コンパイラは `status` 変数を `Ok` 型にスマートキャストし、ループ本体内で `currentRoom` プロパティにアクセスできるようになります。

`if`、`when`、または `while` 条件で使用する前に `Boolean` 型の変数を宣言すると、コンパイラによってその変数について収集されたすべての情報が、スマートキャストのために対応するブロック内でアクセス可能になります。

これは、ブール条件を変数に抽出するなどの場合に役立ちます。そうすることで、変数に意味のある名前を付けられ、コードの可読性が向上し、後でコード内で変数を再利用できるようになります。例：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}
//sampleStart
fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // The compiler can access information about
        // isCat, so it knows that animal was smart-cast
        // to the type Cat.
        // Therefore, the purr() function can be called.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### 論理演算子

コンパイラは、`&&`または`||`演算子の左側に型チェック（通常または否定）がある場合、右側でスマートキャストを実行できます。

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

オブジェクトに対する型チェックを`or`演算子（`||`）と組み合わせると、最も近い共通のスーパータイプにスマートキャストされます。

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
    }
}
```

> 共通のスーパータイプは、[ユニオン型](https://en.wikipedia.org/wiki/Union_type)の**近似値**です。ユニオン型は[現在Kotlinではサポートされていません](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

### インライン関数

コンパイラは、[インライン関数](inline-functions.md)に渡されるラムダ関数内でキャプチャされた変数をスマートキャストできます。

インライン関数は、暗黙的な[`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)コントラクトを持つものとして扱われます。これは、インライン関数に渡されたラムダ関数がその場で呼び出されることを意味します。ラムダ関数はインプレースで呼び出されるため、コンパイラはラムダ関数がその関数本体内に含まれる変数の参照を漏洩させないことを認識しています。

コンパイラはこの知識と他の分析を組み合わせて、キャプチャされた変数をスマートキャストしても安全かどうかを判断します。例：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // The compiler knows that processor is a local variable and inlineAction()
        // is an inline function, so references to processor can't be leaked.
        // Therefore, it's safe to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 例外処理

スマートキャスト情報は`catch`ブロックと`finally`ブロックに引き継がれます。これにより、コンパイラがオブジェクトがNull許容型であるかどうかを追跡するため、コードの安全性が向上します。例：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // The compiler knows stringInput can be null
        // so stringInput stays nullable.
        println(stringInput?.length)
        // null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### スマートキャストの前提条件

スマートキャストは、コンパイラが、変数とチェックとその使用の間で変数が変更されないことを保証できる場合にのみ機能します。これらは以下の条件で使用できます。

<table style="none">
    <tr>
        <td>
            <code>val</code> ローカル変数
        </td>
        <td>
            [ローカルデリゲートプロパティ](delegated-properties.md)を除き、常に。
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> プロパティ
        </td>
        <td>
            プロパティが<code>private</code>または<code>internal</code>である場合、またはプロパティが宣言されているのと同じ[モジュール](visibility-modifiers.md#modules)内でチェックが実行される場合。<code>open</code>プロパティやカスタムゲッターを持つプロパティではスマートキャストを使用できません。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> ローカル変数
        </td>
        <td>
            変数がチェックとその使用の間で変更されず、それを変更するラムダ内でキャプチャされておらず、かつローカルデリゲートプロパティでない場合。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> プロパティ
        </td>
        <td>
            他のコードによって変数がいつでも変更される可能性があるため、決して。
        </td>
    </tr>
</table>

## `as` および `as?` キャスト演算子 {id="unsafe-cast-operator"}

Kotlinには`as`と`as?`の2つのキャスト演算子があります。どちらもキャストに使用できますが、動作が異なります。

`as` 演算子によるキャストが失敗した場合、実行時に`ClassCastException`がスローされます。そのため、これは**非安全な**演算子とも呼ばれます。
非Null許容型にキャストする場合は`as`を使用できます。

```kotlin
fun main() {
    val rawInput: Any = "user-1234"

    // Casts to String successfully
    val userId = rawInput as String
    println("Logging in user with ID: $userId")
    // Logging in user with ID: user-1234

    // Triggers ClassCastException
    val wrongCast = rawInput as Int
    println("wrongCast contains: $wrongCast")
    // Exception in thread "main" java.lang.ClassCastException
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-unsafe-cast-operator" validate="false"}

代わりに`as?`演算子を使用し、キャストが失敗した場合は、その演算子は`null`を返します。そのため、これは**安全な**演算子とも呼ばれます。

```kotlin
fun main() {
    val rawInput: Any = "user-1234"

    // Casts to String successfully
    val userId = rawInput as? String
    println("Logging in user with ID: $userId")
    // Logging in user with ID: user-1234

    // Assigns a null value to wrongCast
    val wrongCast = rawInput as? Int
    println("wrongCast contains: $wrongCast")
    // wrongCast contains: null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-safe-cast-operator"}

Null許容型を安全にキャストするには、キャストが失敗した場合に`ClassCastException`がトリガーされるのを防ぐために、`as?`演算子を使用します。

Null許容型に対して`as`を使用することは_可能_です。これにより結果が`null`になることはありますが、キャストが成功しなかった場合は`ClassCastException`がスローされます。このため、`as?`の方が安全な選択肢です。

```kotlin
fun main() {
    val config: Map<String, Any?> = mapOf(
        "username" to "kodee",
        "alias" to null,
        "loginAttempts" to 3
    )

    // Unsafely casts to a nullable String
    val username: String? = config["username"] as String?
    println("Username: $username")
    // Username: kodee

    // Unsafely casts a null value to a nullable String
    val alias: String? = config["alias"] as String?
    println("Alias: $alias")
    // Alias: null

    // Fails to cast to nullable String and throws ClassCastException
    // val unsafeAttempts: String? = config["loginAttempts"] as String?
    // println("Login attempts (unsafe): $unsafeAttempts")
    // Exception in thread "main" java.lang.ClassCastException

    // Fails to cast to nullable String and returns null
    val safeAttempts: String? = config["loginAttempts"] as? String
    println("Login attempts (safe): $safeAttempts")
    // Login attempts (safe): null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-cast-nullable-types"}

### アップキャストとダウンキャスト

Kotlinでは、オブジェクトをスーパータイプやサブタイプにキャストできます。

オブジェクトをそのスーパークラスのインスタンスにキャストすることを**アップキャスト**と呼びます。アップキャストには特別な構文やキャスト演算子は必要ありません。例：

```kotlin
interface Animal {
    fun makeSound()
}

class Dog : Animal {
    // Implements behavior for makeSound()
    override fun makeSound() {
        println("Dog says woof!")
    }
}

fun printAnimalInfo(animal: Animal) {
    animal.makeSound()
}

fun main() {
    val dog = Dog()
    // Upcasts Dog instance to Animal
    printAnimalInfo(dog)  
    // Dog says woof!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-upcast"}

この例では、`printAnimalInfo()` 関数が `Dog` インスタンスで呼び出されると、コンパイラはそれを `Animal` にアップキャストします。これは、それが期待されるパラメーター型であるためです。実際のオブジェクトは引き続き `Dog` インスタンスであるため、コンパイラは `Dog` クラスの `makeSound()` 関数を動的に解決し、`"Dog says woof!"` と出力します。

抽象型に動作が依存するKotlin APIでは、明示的なアップキャストがよく見られます。また、Jetpack ComposeやUIツールキットでも一般的であり、これらは通常、すべてのUI要素をスーパータイプとして扱い、後で特定のサブクラスに対して操作を行います。

```kotlin
    val textView = TextView(this)
    textView.text = "Hello, View!"

    // Upcasts from TextView to View
    val view: View = textView  

    // Use View functions
    view.setPadding(20, 20, 20, 20)
    // Activity expects a View type
    setContentView(view)
```

オブジェクトをサブクラスのインスタンスにキャストすることを**ダウンキャスト**と呼びます。ダウンキャストは安全でない場合があるため、明示的なキャスト演算子を使用する必要があります。キャストの失敗時に例外がスローされるのを避けるために、キャストが失敗した場合に`null`を返す安全なキャスト演算子`as?`を使用することをお勧めします。

```kotlin
interface Animal {
    fun makeSound()
}

class Dog : Animal {
    override fun makeSound() {
        println("Dog says woof!")
    }

    fun bark() {
        println("BARK!")
    }
}

fun main() {
    // Creates animal as a Dog instance with Animal
    // type
    val animal: Animal = Dog()
    
    // Safely downcasts animal to Dog type
    val dog: Dog? = animal as? Dog

    // Uses a safe call to call bark() if dog isn't null
    dog?.bark()
    // "BARK!"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-downcast"}

この例では、`animal` は `Animal` 型として宣言されていますが、`Dog` インスタンスを保持しています。このコードは `animal` を安全に `Dog` 型にキャストし、[安全呼び出し](null-safety.md#safe-call-operator) (`?.`) を使用して `bark()` 関数にアクセスしています。

ダウンキャストは、シリアライゼーションにおいて、基底クラスを特定のサブタイプにデシリアライズする際に使用します。また、スーパータイプオブジェクトを返すJavaライブラリを扱う場合にも一般的であり、Kotlinでダウンキャストが必要になることがあります。