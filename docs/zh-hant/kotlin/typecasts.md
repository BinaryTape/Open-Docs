---
title: "型別檢查與轉換 (Type checks and casts)"
---
在 Kotlin 中，您可以執行類型檢查，以在運行時檢查對象的類型。類型轉換使您可以將對象轉換為不同的類型。

:::note
要專門了解**泛型（generics）**類型檢查和轉換，例如 `List<T>`、`Map<K,V>`，請參閱[泛型類型檢查和轉換](generics#generics-type-checks-and-casts)。

## is 和 !is 運算符（operators）

要執行運行時檢查，以識別對象是否符合給定類型，請使用 `is` 運算符或其否定形式 `!is`：

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

## Smart casts（智能轉換）

在大多數情況下，您不需要使用顯式轉換運算符，因為編譯器會自動為您轉換對象。
這稱為智能轉換（smart-casting）。 編譯器會追蹤不可變值的類型檢查和[顯式轉換](#unsafe-cast-operator)，並在必要時自動插入隱式（安全）轉換：

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

如果否定檢查導致返回，編譯器甚至聰明地知道轉換是安全的：

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### Control flow（控制流程）

智能轉換不僅適用於 `if` 條件表達式，還適用於 [`when` 表達式](control-flow#when-expressions-and-statements)和 [`while` 循環](control-flow#while-loops)：

```kotlin
when (x) {
    is Int `->` print(x + 1)
    is String `->` print(x.length + 1)
    is IntArray `->` print(x.sum())
}
```

如果您在使用 `if`、`when` 或 `while` 條件之前聲明一個 `Boolean` 類型的變量，那麼編譯器收集的關於該變量的任何訊息都可以在相應的塊中用於智能轉換。

當您想做一些事情，例如將布爾條件提取到變量中時，這會很有用。 然後，您可以為變量指定一個有意義的名稱，這將提高代碼的可讀性，並使以後可以在代碼中重複使用該變量。 例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

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
```

### Logical operators（邏輯運算符）

如果左側有類型檢查（常規或否定），則編譯器可以在 `&&` 或 `||` 運算符的右側執行智能轉換：

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

如果將對象的類型檢查與 `or` 運算符 (`||`) 結合使用，則會對它們最接近的公共超類型進行智能轉換：

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

公共超類型是[聯合類型](https://en.wikipedia.org/wiki/Union_type)的**近似值**。 Kotlin 目前[不支持聯合類型](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。

:::

### Inline functions（內聯函數）

編譯器可以對捕獲在傳遞給[內聯函數](inline-functions)的 lambda 函數中的變量執行智能轉換。

內聯函數被視為具有隱式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
契约（contract）。 這意味著傳遞給內聯函數的任何 lambda 函數都會被就地調用（called in place）。 由於 lambda 函數被就地調用，因此編譯器知道 lambda 函數無法洩漏對其函數體中包含的任何變量的引用。

編譯器使用這些知識以及其他分析來決定智能轉換任何捕獲的變量是否安全。 例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () `->` Unit) = f()

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

### Exception handling（異常處理）

智能轉換信息會傳遞到 `catch` 和 `finally` 程式碼區塊（blocks）。 這使您的程式碼更安全，因為編譯器會追蹤您的對象是否具有可空類型（nullable type）。 例如：

```kotlin

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

fun main() {
    testString()
}
```

### Smart cast prerequisites（智能轉換先決條件）

:::caution
請注意，只有當編譯器可以保證變量在檢查和使用之間不會更改時，智能轉換才有效。

:::

智能轉換可以在以下條件下使用：
<table >
<tr>
<td>

            `val` 局部變量（local variables）
</td>
<td>

            始終，但 <a href="delegated-properties">local delegated properties（局部委託屬性）</a> 除外。
</td>
</tr>
<tr>
<td>

            `val` 屬性（properties）
</td>
<td>

            如果屬性是 `private`、`internal`，或者如果在宣告該屬性的同一 <a href="visibility-modifiers#modules">模塊（module）</a>中執行檢查。 智能轉換不能用於 `open` 屬性或具有自定義 getter 的屬性。
</td>
</tr>
<tr>
<td>

            `var` 局部變量
</td>
<td>

            如果變量在檢查和使用之間未被修改，未在修改它的 lambda 中捕獲，並且不是局部委託屬性。
</td>
</tr>
<tr>
<td>

            `var` 屬性
</td>
<td>

            永遠不能，因為變量可以隨時被其他程式碼修改。
</td>
</tr>
</table>

## "Unsafe" cast operator（“不安全”轉換運算符）

要將對象顯式轉換為非空類型，請使用*不安全*轉換運算符 `as`：

```kotlin
val x: String = y as String
```

如果無法進行轉換，則編譯器會拋出異常。 這就是它被稱為 _unsafe（不安全）_ 的原因。

在前面的示例中，如果 `y` 是 `null`，則上面的程式碼也會拋出異常。 這是因為 `null` 無法轉換為 `String`，因為 `String` 不是 [nullable（可空）](null-safety)。 要使該示例適用於可能為 null 的值，請在轉換的右側使用可空類型：

```kotlin
val x: String? = y as String?
```

## "Safe" (nullable) cast operator（“安全”（可空）轉換運算符）

要避免異常，請使用*安全*轉換運算符 `as?`，該運算符在失敗時返回 `null`。

```kotlin
val x: String? = y as? String
```

請注意，儘管 `as?` 的右側是非空類型 `String`，但轉換的結果是可空的。