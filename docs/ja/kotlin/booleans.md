[//]: # (title: ブール型)

`Boolean`型は、`true`と`false`の2つの値を持つ真偽値オブジェクトを表します。
`Boolean`型には、`Boolean?`として宣言される[ヌル許容](null-safety.md)の対応する型があります。

> JVMでは、プリミティブな`boolean`型として格納されるブール値は、通常8ビットを使用します。
>
{style="note"}

ブール値に対する組み込み演算には以下があります。

* `||` – 論理和 (logical _OR_)
* `&&` – 論理積 (logical _AND_)
* `!` – 論理否定 (logical _NOT_)

例:

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

`||`と`&&`演算子は遅延評価で動作します。これはつまり：

* 最初のオペランドが`true`の場合、`||`演算子は2番目のオペランドを評価しません。
* 最初のオペランドが`false`の場合、`&&`演算子は2番目のオペランドを評価しません。

> JVMでは、ブールオブジェクトへのヌル許容参照は、[数値](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)の場合と同様にJavaクラスにボクシングされます。
>
{style="note"}