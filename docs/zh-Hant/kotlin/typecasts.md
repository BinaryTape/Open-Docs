[//]: # (title: 類型檢查與轉型)

在 Kotlin 中，您可以在執行時對類型進行兩件事：檢查物件是否為特定類型，或將其轉換為另一種類型。類型 **檢查** 幫助您確認所處理的物件類型，而類型 **轉型** 則嘗試將物件轉換為另一種類型。

> 若要深入瞭解**泛型**的類型檢查與轉型，例如 `List<T>`、`Map<K,V>`，請參閱[泛型類型檢查和轉型](generics.md#generics-type-checks-and-casts)。
>
{style="tip"}

## 使用 `is` 與 `!is` 運算子進行檢查 {id="is-and-is-operators"}

使用 `is` 運算子（或 `!is` 進行否定）來檢查物件是否在執行時符合某個類型：

```kotlin
fun main() {
    val input: Any = "Hello, Kotlin"

    if (input is String) {
        println("Message length: ${input.length}")
        // Message length: 13
    }

    if (input !is String) { // 與 !(input is String) 相同
        println("Input is not a valid message")
    } else {
        println("Processing message: ${input.length} characters")
        // Processing message: 13 characters
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator"}

您也可以使用 `is` 和 `!is` 運算子來檢查物件是否符合子型別：

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
    
    // 使用 is 運算子檢查子型別
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

此範例使用 `is` 運算子來檢查 `Animal` 類別實例是否為 `Dog` 或 `Cat` 子型別，以列印相關的照護說明。

您可以檢查物件是否為其宣告型別的超型別，但這並沒有意義，因為答案總是 `true`。每個類別實例都已經是其超型別的實例。

> 若要在執行時識別物件的類型，請參閱 [Reflection](reflection.md)。
> 
{type="tip"}

## 類型轉型

在 Kotlin 中，將物件的類型轉換為另一種類型稱為 **轉型**。

在某些情況下，編譯器會自動為您轉型物件。這稱為智慧型轉型。

如果您需要明確轉型類型，請使用 `as?` 或 `as` [轉型運算子](#unsafe-cast-operator)。

## 智慧型轉型

編譯器會追蹤不可變值的類型檢查和[明確轉型](#unsafe-cast-operator)，並自動插入隱式（安全）轉型：

```kotlin
fun logMessage(data: Any) {
    // data 自動轉型為 String
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

編譯器甚至聰明到知道，如果否定檢查導致返回，則轉型是安全的：

```kotlin
fun logMessage(data: Any) {
    // data 自動轉型為 String
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

### 控制流程

智慧型轉型不僅適用於 `if` 條件式，也適用於 [`when` 表達式](control-flow.md#when-expressions-and-statements)：

```kotlin
fun processInput(data: Any) {
    when (data) {
        // data 自動轉型為 Int
        is Int -> println("Log: Assigned new ID ${data + 1}")
        // data 自動轉型為 String
        is String -> println("Log: Received message \"$data\"")
        // data 自動轉型為 IntArray
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

也適用於 [`while` 迴圈](control-flow.md#while-loops)：

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
        // 編譯器將 status 智慧型轉型為 Ok 類型，
        // 因此 currentRoom 屬性可供存取。
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

在此範例中，密封介面 `Status` 有兩個實作：資料類別 `Ok` 和資料物件 `Error`。只有 `Ok` 資料類別具有 `currentRoom` 屬性。當 `while` 迴圈條件評估為 `true` 時，編譯器會將 `status` 變數智慧型轉型為 `Ok` 類型，使 `currentRoom` 屬性在迴圈主體內可供存取。

如果您在使用 `if`、`when` 或 `while` 條件之前宣告了 `Boolean` 類型的變數，那麼編譯器收集到的有關該變數的任何資訊都將在對應的區塊中可用於智慧型轉型。

當您想要將布林條件提取到變數中時，這會很有用。然後，您可以為變數賦予一個有意義的名稱，這將提高您程式碼的可讀性，並使您以後可以在程式碼中重複使用該變數。例如：

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
        // 編譯器可以存取關於 isCat 的資訊，
        // 因此它知道 animal 已被智慧型轉型為 Cat 類型。
        // 因此，可以呼叫 purr() 函數。
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

### 邏輯運算子

如果 `&&` 或 `||` 運算子的左側有類型檢查（常規或否定），編譯器可以在其右側執行智慧型轉型：

```kotlin
// x 在 `||` 的右側自動轉型為 String
if (x !is String || x.length == 0) return

// x 在 `&&` 的右側自動轉型為 String
if (x is String && x.length > 0) {
    print(x.length) // x 自動轉型為 String
}
```

如果您將物件的類型檢查與 `or` 運算子（`||`）結合使用，則會智慧型轉型為它們最接近的共同超型別：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智慧型轉型為共同超型別 Status
        signalStatus.signal()
    }
}
```

> 共同超型別是[聯集型別](https://en.wikipedia.org/wiki/Union_type)的**近似值**。Kotlin [目前不支援](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)聯集型別。
>
{style="note"}

### 內聯函數

編譯器可以對傳遞給[內聯函數](inline-functions.md)的 Lambda 函數中捕獲的變數進行智慧型轉型。

內聯函數被視為具有隱式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契約。這意味著傳遞給內聯函數的任何 Lambda 函數都會在原地呼叫。由於 Lambda 函數是在原地呼叫的，編譯器知道 Lambda 函數不會洩漏對其函數體內包含的任何變數的引用。

編譯器利用這些知識以及其他分析來決定對任何捕獲的變數進行智慧型轉型是否安全。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 編譯器知道 processor 是一個區域變數且 inlineAction() 是一個內聯函數，
        // 因此對 processor 的引用不會洩漏。
        // 因此，對 processor 進行智慧型轉型是安全的。
      
        // 如果 processor 不為 null，processor 就會被智慧型轉型
        if (processor != null) {
            // 編譯器知道 processor 不為 null，因此不需要安全呼叫
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 異常處理

智慧型轉型資訊會傳遞到 `catch` 和 `finally` 區塊。這使得您的程式碼更安全，因為編譯器會追蹤您的物件是否為可空型別。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智慧型轉型為 String 類型
    stringInput = ""
    try {
        // 編譯器知道 stringInput 不為 null
        println(stringInput.length)
        // 0

        // 編譯器拒絕了 stringInput 之前的智慧型轉型資訊。
        // 現在 stringInput 具有 String? 類型。
        stringInput = null

        // 觸發異常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 編譯器知道 stringInput 可以為 null，
        // 因此 stringInput 保持可空。
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

### 智慧型轉型前提條件

智慧型轉型僅在編譯器能保證變數在檢查和使用之間不會改變時才有效。它們可在以下條件下使用：

<table style="none">
    <tr>
        <td>
            <code>val</code> 區域變數
        </td>
        <td>
            總是，除了<a href="delegated-properties.md">區域委派屬性</a>。
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 屬性
        </td>
        <td>
            如果屬性是 <code>private</code>、<code>internal</code>，或者檢查是在宣告該屬性的相同<a href="visibility-modifiers.md#modules">模組</a>中執行的。智慧型轉型不能用於 <code>open</code> 屬性或具有自訂 getter 的屬性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 區域變數
        </td>
        <td>
            如果變數在檢查和使用之間未被修改，未被修改它的 Lambda 捕獲，且不是區域委派屬性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 屬性
        </td>
        <td>
            從不，因為變數可以隨時被其他程式碼修改。
        </td>
    </tr>
</table>

## `as` 和 `as?` 轉型運算子 {id="unsafe-cast-operator"}

Kotlin 有兩個轉型運算子：`as` 和 `as?`。您可以使用它們進行轉型，但它們具有不同的行為。

如果使用 `as` 運算子轉型失敗，會在執行時拋出 `ClassCastException`。這就是為什麼它也被稱為**不安全**運算子。您可以在轉型為非空型別時使用 `as`：

```kotlin
fun main() {
    val rawInput: Any = "user-1234"

    // 成功轉型為 String
    val userId = rawInput as String
    println("Logging in user with ID: $userId")
    // Logging in user with ID: user-1234

    // 觸發 ClassCastException
    val wrongCast = rawInput as Int
    println("wrongCast contains: $wrongCast")
    // Exception in thread "main" java.lang.ClassCastException
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-unsafe-cast-operator" validate="false"}

如果您改用 `as?` 運算子，並且轉型失敗，該運算子會返回 `null`。這就是為什麼它也被稱為**安全**運算子：

```kotlin
fun main() {
    val rawInput: Any = "user-1234"

    // 成功轉型為 String
    val userId = rawInput as? String
    println("Logging in user with ID: $userId")
    // Logging in user with ID: user-1234

    // 將 null 值賦予 wrongCast
    val wrongCast = rawInput as? Int
    println("wrongCast contains: $wrongCast")
    // wrongCast contains: null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-safe-cast-operator"}

為了安全地轉型可空型別，請使用 `as?` 運算子以防止在轉型失敗時觸發 `ClassCastException`。

您_可以_將 `as` 與可空型別一起使用。這允許結果為 `null`，但如果轉型不成功，它仍然會拋出 `ClassCastException`。因此，`as?` 是更安全的選項：

```kotlin
fun main() {
    val config: Map<String, Any?> = mapOf(
        "username" to "kodee",
        "alias" to null,
        "loginAttempts" to 3
    )

    // 不安全地轉型為可空 String
    val username: String? = config["username"] as String?
    println("Username: $username")
    // Username: kodee

    // 不安全地將 null 值轉型為可空 String
    val alias: String? = config["alias"] as String?
    println("Alias: $alias")
    // Alias: null

    // 無法轉型為可空 String 並拋出 ClassCastException
    // val unsafeAttempts: String? = config["loginAttempts"] as String?
    // println("Login attempts (unsafe): $unsafeAttempts")
    // Exception in thread "main" java.lang.ClassCastException

    // 無法轉型為可空 String 並返回 null
    val safeAttempts: String? = config["loginAttempts"] as? String
    println("Login attempts (safe): $safeAttempts")
    // Login attempts (safe): null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-cast-nullable-types"}

### 向上轉型與向下轉型

在 Kotlin 中，您可以將物件轉型為超型別和子型別。

將物件轉型為其超類別的實例稱為**向上轉型**（upcasting）。向上轉型不需要任何特殊語法或轉型運算子。例如：

```kotlin
interface Animal {
    fun makeSound()
}

class Dog : Animal {
    // 實作 makeSound() 的行為
    override fun makeSound() {
        println("Dog says woof!")
    }
}

fun printAnimalInfo(animal: Animal) {
    animal.makeSound()
}

fun main() {
    val dog = Dog()
    // 將 Dog 實例向上轉型為 Animal
    printAnimalInfo(dog)  
    // Dog says woof!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-upcast"}

在此範例中，當使用 `Dog` 實例呼叫 `printAnimalInfo()` 函數時，編譯器會將其向上轉型為 `Animal`，因為這是預期的參數類型。由於實際物件仍然是 `Dog` 實例，編譯器會動態解析 `Dog` 類別中的 `makeSound()` 函數，並列印 `"Dog says woof!"`。

您經常會在 Kotlin API 中看到明確的向上轉型，其中行為取決於抽象類型。它在 Jetpack Compose 和 UI 工具包中也很常見，這些工具包通常將所有 UI 元素視為超型別，然後再對特定子類別進行操作：

```kotlin
    val textView = TextView(this)
    textView.text = "Hello, View!"

    // 從 TextView 向上轉型為 View
    val view: View = textView  

    // 使用 View 函數
    view.setPadding(20, 20, 20, 20)
    // Activity 預期 View 類型
    setContentView(view)
```

將物件轉型為子類別的實例稱為**向下轉型**（downcasting）。由於向下轉型可能不安全，您需要使用明確的轉型運算子。為避免在轉型失敗時拋出異常，我們建議使用安全轉型運算子 `as?`，以便在轉型失敗時返回 `null`：

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
    // 建立一個 Animal 類型的 Dog 實例
    val animal: Animal = Dog()
    
    // 將 animal 安全地向下轉型為 Dog 類型
    val dog: Dog? = animal as? Dog

    // 如果 dog 不為 null，則使用安全呼叫呼叫 bark()
    dog?.bark()
    // "BARK!"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-downcast"}

在此範例中，`animal` 宣告為 `Animal` 類型，但它持有一個 `Dog` 實例。程式碼安全地將 `animal` 轉型為 `Dog` 類型，並使用[安全呼叫](null-safety.md#safe-call-operator) (`?.`) 來存取 `bark()` 函數。

在序列化時，當您將基類別反序列化為特定子型別時，您會使用向下轉型。在處理返回超型別物件的 Java 函式庫時也很常見，您可能需要在 Kotlin 中將這些物件向下轉型。