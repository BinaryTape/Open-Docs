[//]: # (title: 類型檢查與轉型)

在 Kotlin 中，您可以在執行時對物件進行類型檢查。類型轉型則允許您將物件轉換為不同的類型。

> 若要深入瞭解**泛型**的類型檢查和轉型，例如 `List<T>`、`Map<K,V>`，請參閱[泛型類型檢查和轉型](generics.md#generics-type-checks-and-casts)。
>
{style="tip"}

## `is` 與 `!is` 運算子

若要執行執行時檢查以判斷物件是否符合給定類型，請使用 `is` 運算子或其否定形式 `!is`：

```kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // Same as !(obj is String)
    print("Not a String")
} else {
    print(obj.length)
}
```

## 智慧型轉型

在大多數情況下，您無需使用明確的轉型運算子，因為編譯器會自動為您轉換物件。
這稱為智慧型轉型。編譯器會追蹤不可變值的類型檢查和[明確轉型](#unsafe-cast-operator)，並在必要時自動插入隱式（安全）轉型：

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

編譯器甚至聰明到知道，如果否定檢查導致返回，則轉型是安全的：

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 控制流程

智慧型轉型不僅適用於 `if` 條件式，也適用於 [`when` 表達式](control-flow.md#when-expressions-and-statements)和 [`while` 迴圈](control-flow.md#while-loops)：

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

如果您在使用 `if`、`when` 或 `while` 條件之前宣告了 `Boolean` 類型的變數，那麼編譯器收集到的有關該變數的任何資訊都將在對應的區塊中可用於智慧型轉型。

當您想要將布林條件提取到變數中時，這會很有用。然後，您可以為變數賦予一個有意義的名稱，這將提高您程式碼的可讀性，並使您以後可以在程式碼中重複使用該變數。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

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

> 請注意，智慧型轉型僅在編譯器能保證變數在檢查和使用之間不會改變時才有效。
>
{style="warning"}

智慧型轉型可在以下條件下使用：

<table style="none">
    <tr>
        <td>
            `val` 區域變數
        </td>
        <td>
            總是，除了<a href="delegated-properties.md">區域委派屬性</a>。
        </td>
    </tr>
    <tr>
        <td>
            `val` 屬性
        </td>
        <td>
            如果屬性是 `private`、`internal`，或者檢查是在宣告該屬性的相同<a href="visibility-modifiers.md#modules">模組</a>中執行的。智慧型轉型不能用於 `open` 屬性或具有自訂 getter 的屬性。
        </td>
    </tr>
    <tr>
        <td>
            `var` 區域變數
        </td>
        <td>
            如果變數在檢查和使用之間未被修改，未被修改它的 lambda 捕獲，且不是區域委派屬性。
        </td>
    </tr>
    <tr>
        <td>
            `var` 屬性
        </td>
        <td>
            從不，因為變數可以隨時被其他程式碼修改。
        </td>
    </tr>
</table>

## 「不安全」轉型運算子

若要將物件明確轉型為非可空型別，請使用*不安全*轉型運算子 `as`：

```kotlin
val x: String = y as String
```

如果轉型不可能，編譯器會拋出異常。這就是為什麼它被稱為*不安全*。

在前面的範例中，如果 `y` 為 `null`，上述程式碼也會拋出異常。這是因為 `null` 無法轉型為 `String`，因為 `String` 不是[可空型別](null-safety.md)。為了讓範例適用於可能的 null 值，請在轉型的右側使用可空型別：

```kotlin
val x: String? = y as String?
```

## 「安全」（可空）轉型運算子

為了避免異常，請使用*安全*轉型運算子 `as?`，它在失敗時會返回 `null`。

```kotlin
val x: String? = y as? String
```

請注意，儘管 `as?` 的右側是非可空型別 `String`，但轉型的結果是可空的。