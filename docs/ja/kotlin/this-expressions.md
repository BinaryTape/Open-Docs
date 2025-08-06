[//]: # (title: this 式)

現在の_レシーバー_を示すには、`this` 式を使用します。

*   [クラス](classes.md#inheritance) のメンバーでは、`this` はそのクラスの現在のオブジェクトを参照します。
*   [拡張関数](extensions.md) または [レシーバー付き関数リテラル](lambdas.md#function-literals-with-receiver) では、`this` はドットの左側に渡される_レシーバー_パラメーターを示します。

`this` に修飾子がない場合、それは_最も内側の囲むスコープ_を参照します。他のスコープ内の `this` を参照するには、_ラベル修飾子_が使用されます。

## 修飾子付き `this`

外側のスコープ（ [クラス](classes.md)、[拡張関数](extensions.md)、またはラベル付き [レシーバー付き関数リテラル](lambdas.md#function-literals-with-receiver) ）から `this` にアクセスするには、`this@label` と記述します。ここで、`@label` は `this` の元となるスコープの [ラベル](returns.md) です。

```kotlin
class A { // 暗黙的なラベル @A
    inner class B { // 暗黙的なラベル @B
        fun Int.foo() { // 暗黙的なラベル @foo
            val a = this@A // A の this
            val b = this@B // B の this

            val c = this // foo() のレシーバー、Int
            val c1 = this@foo // foo() のレシーバー、Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit のレシーバー、String
            }

            val funLit2 = { s: String ->
                // 外側のラムダ式にはレシーバーがないため、foo() のレシーバー
                val d1 = this
            }
        }
    }
}
```

## 暗黙的な `this`

`this` のメンバー関数を呼び出すとき、`this.` 部分を省略できます。
同じ名前の非メンバー関数がある場合、注意して使用してください。そうしないと、場合によっては代わりにそれが呼び出される可能性があるためです。

```kotlin
fun main() {
    fun printLine() { println("ローカル関数") }
    
    class A {
        fun printLine() { println("メンバー関数") }

        fun invokePrintLine(omitThis: Boolean = false) {
            if (omitThis) printLine()
            else this.printLine()
        }
    }
    
    A().invokePrintLine() // メンバー関数
    A().invokePrintLine(omitThis = true) // ローカル関数
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}