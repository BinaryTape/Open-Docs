---
title: 布尔值
---
`Boolean` 类型表示可以有两个值的布尔对象：`true` 和 `false`。
`Boolean` 有一个声明为 `Boolean?` 的 [nullable](null-safety)（可空）对应类型。

:::note
在 JVM 上，存储为原始 `boolean` 类型的布尔值通常使用 8 位。

:::

布尔值的内置操作包括：

* `||` – 析取（逻辑 _OR_，或运算）
* `&&` – 合取（逻辑 _AND_，与运算）
* `!` – 否定（逻辑 _NOT_，非运算）

例如：

```kotlin
fun main() {

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

}
```

`||` 和 `&&` 操作符以惰性方式工作，这意味着：

* 如果第一个操作数是 `true`，则 `||` 操作符不计算第二个操作数。
* 如果第一个操作数是 `false`，则 `&&` 操作符不计算第二个操作数。

:::note
在 JVM 上，对布尔对象的可空引用会被装箱到 Java 类中，就像 [numbers](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)（数字）一样。

:::