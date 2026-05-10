[//]: # (title: 布尔类型)
[//]: # (description: 了解如何在 Kotlin 中使用布尔值，包括声明、逻辑运算符和条件。)

<show-structure depth="1"/>

[`Boolean`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/) 类型表示逻辑值：`true` 和 `false`。

在回答“是或否”问题的函数中，以及 `while`、`if` 和 `when` 条件中使用 `Boolean` 值。

## 声明 `Boolean` 变量

要声明 `Boolean` 变量，请为其赋值 `true` 或 `false`。

你可以显式指定 `Boolean` 类型，或者让 Kotlin 从值中自动推断：

```kotlin
val isTrue: Boolean = true
val isFalse = false // Kotlin 推断为 Boolean
```

如果值可以为 `null`，请使用 `Boolean?`：

```kotlin
val isEnabled: Boolean? = null
```

> 不能将整数值赋给 `Boolean` 变量。
> 在 Kotlin 中，`0` 和 `1` 不是 `Boolean` 值。
>
{style="note"}

## 产生 `Boolean` 值

你可以使用比较表达式和函数来产生 `Boolean` 值：

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

你也可以在条件和其他表达式中使用这些结果：

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

## `Boolean` 操作

Kotlin 提供了用于处理 `Boolean` 值的运算符和中缀函数。你可以使用它们对 `Boolean` 值取反，或将多个 `Boolean` 值组合成单个结果。

### 取反 (NOT)

NOT 运算符会对 `Boolean` 值取反。

要使用 NOT，请在 `Boolean` 值之前放置 `!` 运算符：

```kotlin
val isOn = true
val isOff = !isOn // isOff 为 false
```

### 逻辑与 (AND)

仅当两个操作数均为 `true` 时，AND 运算符才返回 `true`。

要使用逻辑与，请在操作数之间放置 `&&` 运算符：

```kotlin
val a = false && false // false
val b = false && true // false
val c = true && false // false
val d = true && true  // true
```

> 如果第一个操作数为 `false`，则 `&&` 运算符会跳过第二个操作数。
> 若要计算两个操作数，请改用 `and` [中缀函数](functions.md#infix-notation)。
>
{style="note"}

### 逻辑或 (OR)

如果至少有一个操作数为 `true`，则 OR 运算符返回 `true`。

要使用逻辑或，请在操作数之间放置 `||` 运算符：

```kotlin
val a = false || false // false
val b = false || true  // true
val c = true || false  // true
val d = true || true   // true
```

> 如果第一个操作数为 `true`，则 `||` 运算符会跳过第二个操作数。
> 若要计算两个操作数，请改用 `or` [中缀函数](functions.md#infix-notation)。
>
{style="note"}

### 异或 (XOR)

如果操作数具有不同的值，则异或 (XOR) 操作返回 `true`。

要使用 XOR，请在操作数之间编写 `xor`：

```kotlin
val a = false xor false // false
val b = false xor true  // true
val c = true xor false  // true
val d = true xor true   // false
```

> `xor` 是一个[中缀函数](functions.md#infix-notation)，而不是运算符。
>
> 要了解有关 `Boolean` 函数的更多信息，请参阅 [API 参考文档](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/)。
>
{style="note"}

## 运算符优先级

如果表达式包含多个逻辑操作，且没有使用圆括号来指定计算顺序，Kotlin 将应用优先级规则。具有较高优先级的操作会先于较低优先级的操作进行计算。

对于本节中描述的 `Boolean` 操作，优先级顺序如下：

1. `!`
2. `xor`（以及其他中缀函数）
3. `&&`
4. `||`

在以下示例中，编译器会在 `||` 之前先计算 `&&`：

```kotlin
fun main() {
//sampleStart
    val result = true || false && false
    println(result) // true
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

要使计算顺序显式化，请使用圆括号：

```kotlin
fun main() {
//sampleStart
    val result = (true || false) && false
    println(result) // false
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

## 条件中的 `Boolean`

[`if`](control-flow.md#if-expression)、[`when`](control-flow.md#when-expressions-and-statements) 和 [`while`](control-flow.md#while-loops) 会计算 `Boolean` 表达式以引导程序流。

### `if` 表达式

```kotlin
fun main() {
//sampleStart
    val number = 4
    val isEven = number % 2 == 0

    // 条件已经是 Boolean 类型
    // 你不需要将其与 true 或 false 进行比较
    if (isEven) { 
        println("The number is even.")
    } else {
        println("The number is odd.")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `when` 表达式

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

### `while` 循环

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