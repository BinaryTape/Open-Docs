[//]: # (title: 布尔类型)

`Boolean` 类型表示布尔对象，它可以有两个值：`true` 和 `false`。
`Boolean` 有一个 [可空](null-safety.md) 对应类型，声明为 `Boolean?`。

> 在 JVM 上，存储为基本 `boolean` 类型的布尔值通常使用 8 比特。
>
{style="note"}

布尔值的内置操作包括：

*   `||` – 析取（逻辑**或**）
*   `&&` – 合取（逻辑**与**）
*   `!` – 否定（逻辑**非**）

例如：

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null

    println(myTrue || myFalse)
    // true
    println(myTrue && myFalse)
    // false
    println(!myTrue)
    // false
    println(boolNull)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`||` 和 `&&` 运算符以短路求值方式工作，这意味着：

*   如果第一个操作数为 `true`，`||` 运算符不会评估第二个操作数。
*   如果第一个操作数为 `false`，`&&` 运算符不会评估第二个操作数。

> 在 JVM 上，布尔对象的空引用会被装箱到 Java 类中，就像 [数字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 一样。
>
{style="note"}