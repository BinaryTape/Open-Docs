[//]: # (title: 布尔类型)

`Boolean` 类型表示布尔对象，它可以拥有两个值：`true` 和 `false`。
`Boolean` 有一个 [可空](null-safety.md) 的对应类型，声明为 `Boolean?`。

> 在 JVM 上，存储为原生 `boolean` 类型的布尔值通常使用 8 位。
>
{style="note"}

布尔值的内置操作包括：

* `||` – 析取（逻辑 _或_）
* `&&` – 合取（逻辑 _与_）
* `!` – 否定（逻辑 _非_）

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

`||` 和 `&&` 操作符以惰性方式工作，这意味着：

* 如果第一个操作数为 `true`，`||` 操作符不会对第二个操作数求值。
* 如果第一个操作数为 `false`，`&&` 操作符不会对第二个操作数求值。

> 在 JVM 上，可空引用到布尔对象会被装箱为 Java 类，就像 [数字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual_machine) 那样。
>
{style="note"}