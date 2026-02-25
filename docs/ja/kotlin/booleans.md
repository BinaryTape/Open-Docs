[//]: # (title: Boolean 型)

`Boolean` 型は、`true` と `false` の 2 つの値を取ることができる Boolean オブジェクトを表します。
`Boolean` には、`Boolean?` として宣言される[null 許容](null-safety.md)（nullable）の対応する型があります。

> JVM では、プリミティブ型の `boolean` として格納される Boolean は、通常 8 ビットを使用します。
>
{style="note"}

Boolean に対する組み込み演算には以下が含まれます：

* `||` – 論理和（logical _OR_）
* `&&` – 論理積（logical _AND_）
* `!` – 否定（logical _NOT_）

例：

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

`||` と `&&` 演算子は遅延評価（lazy）されます。これは以下を意味します：

* 最初のオペランドが `true` の場合、`||` 演算子は 2 番目のオペランドを評価しません。
* 最初のオペランドが `false` の場合、`&&` 演算子は 2 番目のオペランドを評価しません。

> JVM 上では、Boolean オブジェクトへの null 許容な参照は、[数値](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)と同様に Java クラスにボックス化（boxing）されます。
>
{style="note"}