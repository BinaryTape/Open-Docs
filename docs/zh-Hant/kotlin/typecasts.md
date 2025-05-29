[//]: # (title: 型別檢查與轉換)

在 Kotlin 中，您可以在執行時執行型別檢查，以確認物件的型別。型別轉換讓您可以將物件轉換為不同的型別。

> 若要特別了解 **泛型** 型別檢查和轉換，例如 `List<T>`、`Map<K,V>`，請參閱 [泛型型別檢查與轉換](generics.md#generics-type-checks-and-casts)。
>
{style="tip"}

## `is` 和 `!is` 運算子

若要執行一個執行時檢查，判斷物件是否符合給定型別，請使用 `is` 運算子或其否定形式 `!is`：

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

## 智慧型別轉換

在大多數情況下，您不需要使用明確的轉型運算子，因為編譯器會自動為您轉換物件。這稱為智慧型別轉換 (smart-casting)。編譯器會追蹤不可變值 (immutable values) 的型別檢查和 [明確轉換](#unsafe-cast-operator)，並在必要時自動插入隱式（安全）轉換：

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

如果否定檢查導致返回，編譯器甚至會足夠聰明地知道轉換是安全的：

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 控制流

智慧型別轉換不僅適用於 `if` 條件表達式，也適用於 [`when` 表達式](control-flow.md#when-expressions-and-statements) 和 [`while` 迴圈](control-flow.md#while-loops)：

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

如果您在使用 `if`、`when` 或 `while` 條件之前宣告了 `Boolean` 型別的變數，那麼編譯器收集到的關於該變數的任何資訊都將在對應的區塊中可用於智慧型別轉換。

當您想要將布林條件提取到變數中時，這會很有用。然後，您可以給變數一個有意義的名稱，這將提高程式碼的可讀性，並使您以後可以在程式碼中重複使用該變數。例如：

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
        // 因此它知道 animal 被智慧型別轉換為 Cat 型別。
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

如果 `&&` 或 `||` 運算子的左側有型別檢查（常規或否定），編譯器可以在右側執行智慧型別轉換：

```kotlin
// 當在 `||` 的右側時，x 會自動轉換為 String
if (x !is String || x.length == 0) return

// 當在 `&&` 的右側時，x 會自動轉換為 String
if (x is String && x.length > 0) {
    print(x.length) // x 會自動轉換為 String
}
```

如果您使用 `or` 運算子 (`||`) 結合物件的型別檢查，則會將智慧型別轉換應用於它們最接近的共同超型別：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智慧型別轉換為共同超型別 Status
        signalStatus.signal()
    }
}
```

> 共同超型別是 [聯集型別 (union type)](https://en.wikipedia.org/wiki/Union_type) 的一個**近似值**。Kotlin [目前不支援](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types) 聯集型別。
>
{style="note"}

### 行內函數

編譯器可以智慧型別轉換在傳遞給 [行內函數](inline-functions.md) 的 Lambda 函數中捕獲的變數。

行內函數被視為具有隱式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契約。這意味著任何傳遞給行內函數的 Lambda 函數都會在原地呼叫。由於 Lambda 函數是在原地呼叫的，編譯器知道 Lambda 函數不會洩漏對其函數主體中包含的任何變數的引用。

編譯器利用這些知識以及其他分析來決定是否可以安全地對任何捕獲的變數進行智慧型別轉換。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 編譯器知道 processor 是局部變數，且 inlineAction()
        // 是行內函數，因此對 processor 的引用不會洩漏。
        // 因此，智慧型別轉換 processor 是安全的。
      
        // 如果 processor 不為 null，則 processor 會進行智慧型別轉換
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

智慧型別轉換資訊會傳遞到 `catch` 和 `finally` 區塊。這使得您的程式碼更安全，因為編譯器會追蹤您的物件是否為可空型別 (nullable type)。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智慧型別轉換為 String 型別
    stringInput = ""
    try {
        // 編譯器知道 stringInput 不為 null
        println(stringInput.length)
        // 0

        // 編譯器拒絕先前針對 stringInput 的智慧型別轉換資訊。
        // 現在 stringInput 具有 String? 型別。
        stringInput = null

        // 觸發異常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 編譯器知道 stringInput 可以為 null，
        // 因此 stringInput 保持可空型別。
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

### 智慧型別轉換先決條件

> 請注意，智慧型別轉換僅在編譯器能夠保證變數在檢查及其使用之間不會改變時才有效。
>
{style="warning"}

智慧型別轉換可在以下條件下使用：

<table style="none">
    <tr>
        <td>
            <code>val</code> 區域變數
        </td>
        <td>
            除了 <a href="delegated-properties.md">本地委託屬性 (local delegated properties)</a> 外，始終適用。
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 屬性
        </td>
        <td>
            如果屬性是 <code>private</code>、<code>internal</code>，或者檢查是在宣告該屬性的同一個 <a href="visibility-modifiers.md#modules">模組</a> 中執行。智慧型別轉換不能用於 <code>open</code> 屬性或具有自訂 getter 的屬性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 區域變數
        </td>
        <td>
            如果變數在檢查及其使用之間未被修改，未被捕獲在修改它的 Lambda 中，且不是本地委託屬性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 屬性
        </td>
        <td>
            永不適用，因為變數隨時可能被其他程式碼修改。
        </td>
    </tr>
</table>

## 「不安全」轉型運算子

要將物件明確地轉換為非空型別，請使用「不安全」轉型運算子 `as`：

```kotlin
val x: String = y as String
```

如果轉換不可能，編譯器會拋出異常。這就是它被稱為**不安全**的原因。

在前面的範例中，如果 `y` 為 `null`，則上面的程式碼也會拋出異常。這是因為 `null` 無法轉換為 `String`，因為 `String` 不是 [可空型別](null-safety.md)。為了使該範例適用於可能的 `null` 值，請在轉換的右側使用可空型別：

```kotlin
val x: String? = y as String?
```

## 「安全」（可空）轉型運算子

為了避免異常，請使用「安全」轉型運算子 `as?`，它在失敗時返回 `null`。

```kotlin
val x: String? = y as? String
```

請注意，儘管 `as?` 的右側是非空型別 `String`，但轉換的結果是可空型別。