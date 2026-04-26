[//]: # (title: 布林值)
[//]: # (description: 了解如何在 Kotlin 中使用布林值，包括宣告、邏輯運算子與條件。)

<show-structure depth="1"/>

[`Boolean`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/) 型別表示邏輯值：`true` 與 `false`。

在回答「是或否」問題的函式，以及 `while`、`if` 與 `when` 的條件中使用 `Boolean` 值。

## 宣告 `Boolean` 變數

要宣告 `Boolean` 變數，請對其指派 `true` 或 `false`。

您可以明確指定 `Boolean` 型別，或讓 Kotlin 從值中自動推論：

```kotlin
val isTrue: Boolean = true
val isFalse = false // Kotlin 推論為 Boolean
```

如果值可以為 `null`，請使用 `Boolean?`：

```kotlin
val isEnabled: Boolean? = null
```

> 您不能將整數值指派給 `Boolean` 變數。
> 在 Kotlin 中，`0` 與 `1` 不是 `Boolean` 值。
>
{style="note"}

## 產出 `Boolean` 值

您可以使用比較運算式與函式來產出 `Boolean` 值：

```kotlin
fun main() {
//sampleStart
    val number = 10
    val isPositive = number > 0 
    println(isPositive) // true

    val language = "Kotlin"
    val isEmpty = language.isEmpty() 
    println(isEmpty) // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以在條件與其他運算式中使用這些結果：

```kotlin
fun main() {
//sampleStart
    val number = 10
    val isPositive = number > 0 // true

    if (isPositive) {
        println("The number is positive.")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## `Boolean` 運算

Kotlin 提供了用於處理 `Boolean` 值的運算子與中綴函式。您可以使用它們來反轉 `Boolean` 值，或將多個 `Boolean` 值結合成單一結果。

### 否定 (NOT)

NOT 運算子會反轉 `Boolean` 值。

要使用 NOT，請在 `Boolean` 值之前放置 `!` 運算子：

```kotlin
val isOn = true
val isOff = !isOn // isOff 為 false
```

### 邏輯 AND（合取）

僅當兩個運算元皆為 `true` 時，AND 運算子才會傳回 `true`。

要使用邏輯 AND，請在運算元之間放置 `&&` 運算子：

```kotlin
val a = false && false // false
val b = false && true // false
val c = true && false // false
val d = true && true  // true
```

> 如果第一個運算元為 `false`，`&&` 運算子就會跳過第二個運算元的評估。
> 若要評估兩個運算元，請改用 `and` [中綴函式](functions.md#infix-notation)。
> 
{style="note"}

### 邏輯 OR（析取）

如果至少有一個運算元為 `true`，OR 運算子就會傳回 `true`。

要使用邏輯 OR，請在運算元之間放置 `||` 運算子：

```kotlin
val a = false || false // false
val b = false || true  // true
val c = true || false  // true
val d = true || true   // true
```

> 如果第一個運算元為 `true`，`||` 運算子就會跳過第二個運算元的評估。
> 若要評估兩個運算元，請改用 `or` [中綴函式](functions.md#infix-notation)。
>
{style="note"}

### 互斥或 (XOR)

如果運算元具有不同的值，互斥或 (XOR) 運算就會傳回 `true`。

要使用 XOR，請在運算元之間寫入 `xor`：

```kotlin
val a = false xor false // false
val b = false xor true  // true
val c = true xor false  // true
val d = true xor true   // false
```

> `xor` 是一個 [中綴函式](functions.md#infix-notation)，而不是運算子。
> 
> 在 [API 參考文件](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/) 中了解更多關於 `Boolean` 函式的資訊。
>
{style="note"} 

## 運算子優先級

如果運算式包含多個邏輯運算，且沒有使用圓括號來指定評估順序，Kotlin 將套用優先級規則。較高優先級的運算會先於較低優先級的運算進行評估。

對於本節中說明的 `Boolean` 運算，優先級順序如下：

1. `!`
2. `xor`（以及其他中綴函式）
3. `&&`
4. `||`

在以下範例中，編譯器會先評估 `&&` 再評估 `||`：

```kotlin
fun main() {
//sampleStart
    val result = true || false && false
    println(result) // true
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要使評估順序更明確，請使用圓括號：

```kotlin
fun main() {
//sampleStart
    val result = (true || false) && false
    println(result) // false
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 條件中的 `Boolean`

[`if`](control-flow.md#if-expression)、[`when`](control-flow.md#when-expressions-and-statements) 與 [`while`](control-flow.md#while-loops) 會評估 `Boolean` 運算式以引導程式流程。

### `if` 運算式

```kotlin
fun main() {
//sampleStart
    val number = 4
    val isEven = number % 2 == 0

    // 條件已經是 `Boolean` 型別
    // 您不需要將其與 `true` 或 `false` 進行比較
    if (isEven) { 
        println("The number is even.")
    } else {
        println("The number is odd.")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `when` 運算式

```kotlin
fun main() {
//sampleStart
    val number = 3

    when {
        number > 0 -> println("The number is positive.")
        number < 0 -> println("The number is negative.")
        else -> println("The number is zero.")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `while` 迴圈

```kotlin
fun main() {
//sampleStart
    var isCalculating = true
    
    while (isCalculating) {
        println("Calculating...")
        isCalculating = false
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}