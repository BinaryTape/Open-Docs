---
title: 真偽値
---
`Boolean`型は、`true`と`false`の2つの値を持つことができるブールオブジェクトを表します。
`Boolean`には、`Boolean?`として宣言された[nullable](null-safety)な対応するものがあります。

:::note
JVMでは、プリミティブな`boolean`型として格納されるブール値は、通常8ビットを使用します。

:::

ブール値に対する組み込みの操作は次のとおりです。

* `||` – disjunction (論理 _OR_)
* `&&` – conjunction (論理 _AND_)
* `!` – negation (論理 _NOT_)

例：

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

`||`および`&&`演算子は遅延して動作します。これは次のことを意味します。

* 最初のオペランドが`true`の場合、`||`演算子は2番目のオペランドを評価しません。
* 最初のオペランドが`false`の場合、`&&`演算子は2番目のオペランドを評価しません。

:::note
JVMでは、ブールオブジェクトへのnullableな参照は、[numbers](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)と同様に、Javaクラスにボックス化されます。

:::