[//]: # (title: 类型检测与类型转换)

在 Kotlin 中，你可以在运行时对类型执行两项操作：检测对象是否为特定类型，或者将其转换为另一种类型。类型**检测**可帮助你确认正在处理的对象的类型，而类型**转换**则尝试将对象转换为另一种类型。

> 关于**泛型**类型检测与类型转换，例如 `List<T>`、`Map<K,V>`，请参见[泛型类型检测与类型转换](generics.md#generics-type-checks-and-casts)。
>
{style="tip"}

## `is` 与 `!is` 操作符的检测 {id="is-and-is-operators"}

使用 `is` 操作符（或 `!is` 作为其否定形式）在运行时检测对象是否符合给定类型：

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

你也可以使用 `is` 与 `!is` 操作符来检测对象是否符合子类型：

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

此示例使用 `is` 操作符来检测 `Animal` 类实例是否为 `Dog` 或 `Cat` 子类型，以便打印相关的护理说明。

你可以检测对象是否为其声明类型的超类型，但这没有意义，因为答案始终为真。每个类实例都已经是其超类型的实例。

> 要在运行时识别对象的类型，请参见[反射](reflection.md)。
> 
{type="tip"}

## 类型转换

在 Kotlin 中，将一个对象的类型转换为另一种类型称为**类型转换**。

在某些情况下，编译器会自动为你转换对象。这被称为智能类型转换。

如果你需要显式类型转换，请使用 `as?` 或 `as` [类型转换操作符](#unsafe-cast-operator)。

## 智能类型转换

编译器会跟踪不可变值的类型检测和[显式类型转换](#unsafe-cast-operator)，并自动插入隐式（安全）类型转换：

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

如果一个否定检测导致返回，编译器甚至足够智能，能够识别这种类型转换是安全的：

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

### 控制流

智能类型转换不仅适用于 `if` 条件表达式，也适用于[`when` 表达式](control-flow.md#when-expressions-and-statements)：

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

以及 [`while` 循环](control-flow.md#while-loops)：

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

在此示例中，密封接口 `Status` 有两种实现：数据类 `Ok` 和数据对象 `Error`。只有 `Ok` 数据类拥有 `currentRoom` 属性。当 `while` 循环条件求值为真时，编译器会将 `status` 变量智能类型转换为 `Ok` 类型，从而使 `currentRoom` 属性可在循环体内部访问。

如果你在使用 `if`、`when` 或 `while` 条件之前声明了一个 `Boolean` 类型的变量，那么编译器收集到的关于该变量的任何信息都将在对应的代码块中可访问，用于智能类型转换。

当你希望将布尔条件提取到变量中时，这会很有用。然后，你可以给变量一个有意义的名称，这将提高你代码的可读性，并使其能够在代码中稍后重用。例如：

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

### 逻辑操作符

如果 `&&` 或 `||` 操作符的左侧存在类型检测（常规或否定），编译器可以对右侧执行智能类型转换：

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

如果你使用 `or` 操作符（`||`）结合对象的类型检测，会进行智能类型转换到它们最近的公共超类型：

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

> 公共超类型是[联合类型](https://en.wikipedia.org/wiki/Union_type)的**近似值**。Kotlin [目前不支持联合类型](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

### 内联函数

编译器可以智能类型转换传递给[内联函数](inline-functions.md)的 lambda 表达式中捕获的变量。

内联函数被视为具有隐式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约。这意味着传递给内联函数的任何 lambda 表达式都会在原地被调用。由于 lambda 表达式是在原地调用的，编译器知道 lambda 表达式不能泄露对其函数体中包含的任何变量的引用。

编译器利用此知识，结合其他分析，来决定是否可以安全地智能类型转换任何捕获的变量。例如：

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

### 异常处理

智能类型转换信息会传递到 `catch` 和 `finally` 代码块。这使得你的代码更安全，因为编译器会跟踪你的对象是否具有可空类型。例如：

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

### 智能类型转换先决条件

智能类型转换仅在编译器可以保证变量在检测及其使用之间不会改变时才有效。它们可以在以下条件下使用：

<table style="none">
    <tr>
        <td>
            <code>val</code> 局部变量
        </td>
        <td>
            始终，除了 <a href="delegated-properties.md">局部委托属性</a>。
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 属性
        </td>
        <td>
            如果属性是 <code>private</code>、<code>internal</code>，或者如果检测是在属性声明的同一个 <a href="visibility-modifiers.md#modules">模块</a>中执行的。智能类型转换不能用于 <code>open</code> 属性或具有自定义 getter 的属性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 局部变量
        </td>
        <td>
            如果变量在检测及其使用之间没有被修改，没有在修改它的 lambda 表达式中被捕获，并且不是局部委托属性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 属性
        </td>
        <td>
            绝不，因为变量随时可能被其他代码修改。
        </td>
    </tr>
</table>

## `as` 与 `as?` 类型转换操作符 {id="unsafe-cast-operator"}

Kotlin 有两种类型转换操作符：`as` 和 `as?`。你可以使用它们进行类型转换，但它们具有不同的行为。

如果使用 `as` 操作符进行类型转换失败，会在运行时抛出 `ClassCastException`。这就是它也被称为**不安全**操作符的原因。
你可以将 `as` 用于转换到非空类型时：

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

如果你改用 `as?` 操作符，并且类型转换失败，该操作符会返回 `null`。这就是它也被称为**安全**操作符的原因：

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

要安全地转换可空类型，请使用 `as?` 操作符，以防止在类型转换失败时触发 `ClassCastException`。

你**可以**将 `as` 与可空类型一起使用。这允许结果为 `null`，但如果类型转换不成功，它仍然会抛出 `ClassCastException`。因此，`as?` 是更安全的选择：

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

### 向上转型与向下转型

在 Kotlin 中，你可以将对象转换为超类型和子类型。

将对象转换为其超类的实例称为**向上转型**。向上转型不需要任何特殊语法或类型转换操作符。例如：

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

在此示例中，当使用 `Dog` 实例调用 `printAnimalInfo()` 函数时，编译器会将其向上转型为 `Animal`，因为这是预期的形参类型。由于实际对象仍是 `Dog` 实例，编译器会动态解析 `Dog` 类中的 `makeSound()` 函数，打印 `"Dog says woof!"`。

你经常会在 Kotlin API 中看到显式向上转型，其中行为取决于抽象类型。这在 Jetpack Compose 和 UI 工具包中也很常见，它们通常将所有 UI 元素视为超类型，然后对特定的子类进行操作：

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

将对象转换为子类实例称为**向下转型**。由于向下转型可能不安全，你需要使用显式类型转换操作符。为避免在类型转换失败时抛出异常，我们建议使用安全类型转换操作符 `as?`，以便在转换失败时返回 `null`：

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

在此示例中，`animal` 被声明为 `Animal` 类型，但它持有一个 `Dog` 实例。代码安全地将 `animal` 转换为 `Dog` 类型，并使用[安全调用](null-safety.md#safe-call-operator)（`?.`）来访问 `bark()` 函数。

在序列化时，当你将基类反序列化为特定子类型时，会用到向下转型。在处理返回超类型对象的 Java 库时，这也常见，你可能需要在 Kotlin 中将其向下转型。