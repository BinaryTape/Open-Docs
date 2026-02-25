[//]: # (title: this 式)

現在のレシーバー（_receiver_）を表すには、`this` 式を使用します。

* [クラス](classes.md#inheritance)のメンバー内では、`this` はそのクラスの現在のオブジェクトを指します。
* [拡張関数](extensions.md)または[レシーバー付き関数リテラル](lambdas.md#function-literals-with-receiver)内では、`this` はドットの左側に渡されるレシーバーパラメータを表します。

`this` に修飾子がない場合、それは最も内側の囲まれたスコープ（_innermost enclosing scope_）を指します。他のスコープの `this` を参照するには、ラベル修飾子（_label qualifiers_）を使用します。

## 修飾付きの this (Qualified this)

外側のスコープ（[クラス](classes.md)、[拡張関数](extensions.md)、またはラベル付きの[レシーバー付き関数リテラル](lambdas.md#function-literals-with-receiver)）から `this` にアクセスするには、`this@label` と記述します。ここで `@label` は、`this` が由来するスコープの[ラベル](returns.md)です。

```kotlin
class A { // 暗黙のラベル @A
    inner class B { // 暗黙のラベル @B
        fun Int.foo() { // 暗黙のラベル @foo
            val a = this@A // A の this
            val b = this@B // B の this

            val c = this // foo() のレシーバー、Int
            val c1 = this@foo // foo() のレシーバー、Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit のレシーバー、String
            }

            val funLit2 = { s: String ->
                // 囲んでいるラムダ式にレシーバーがないため、
                // foo() のレシーバーを指す
                val d1 = this
            }
        }
    }
}
```

## 暗黙の this (Implicit this)

`this` に対してメンバー関数を呼び出す場合、`this.` の部分を省略できます。同じ名前の非メンバー関数がある場合は、注意して使用してください。場合によっては、代わりにその非メンバー関数が呼び出される可能性があるためです。

```kotlin
fun main() {
    fun printLine() { println("Local function") }
    
    class A {
        fun printLine() { println("Member function") }

        fun invokePrintLine(omitThis: Boolean = false) {
            if (omitThis) printLine()
            else this.printLine()
        }
    }
    
    A().invokePrintLine() // Member function
    A().invokePrintLine(omitThis = true) // Local function
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}