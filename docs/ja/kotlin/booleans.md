[//]: # (title: 真偽値)

`Boolean`型は、`true`と`false`の2つの値を持つ真偽値オブジェクトを表します。
`Boolean`型には、`Boolean?`として宣言される[null許容型](null-safety.md)があります。

> JVM上では、プリミティブな`boolean`型として格納される真偽値は、通常8ビットを使用します。
>
{style="note"}

真偽値に対する組み込みの操作には以下が含まれます。

*   `||` – 論理和 (論理OR)
*   `&&` – 論理積 (論理AND)
*   `!` – 論理否定 (論理NOT)

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

`||`および`&&`演算子は遅延評価で動作します。これは以下のことを意味します。

*   最初のオペランドが`true`の場合、`||`演算子は2番目のオペランドを評価しません。
*   最初のオペランドが`false`の場合、`&&`演算子は2番目のオペランドを評価しません。

> JVM上では、真偽値オブジェクトへのnull許容参照は、[数値](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)の場合と同様に、Javaクラスでボックス化されます。
>
{style="note"}