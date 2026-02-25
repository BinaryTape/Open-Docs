[//]: # (title: 布尔类型)

`Boolean` 类型表示布尔对象，其取值可以为：`true` 和 `false`。
`Boolean` 有一个声明为 `Boolean?` 的[可空](null-safety.md)对应类型。

> 在 JVM 上，以原生 `boolean` 类型存储的布尔值通常占用 8 位。
>
{style="note"}

布尔类型的内置操作包括：

* `||` – 逻辑或（_OR_）
* `&&` – 逻辑与（_AND_）
* `!` – 逻辑非（_NOT_）

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

`||` 和 `&&` 运算符具有惰性，这意味着：

* 如果第一个操作数为 `true`，`||` 运算符将不会计算第二个操作数。
* 如果第一个操作数为 `false`，`&&` 运算符将不会计算第二个操作数。

> 在 JVM 上，布尔对象的可空引用会被装箱在 Java 类中，就像[数字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)一样。
>
{style="note"}