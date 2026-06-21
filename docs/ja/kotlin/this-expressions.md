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

`this` に対してメンバー関数を呼び出す場合、`this.` 修飾子を省略できます。ただし、より近いレキシカルスコープ（_lexical scope_）に同じ名前の別の呼び出し可能なもの（_callable_）がある場合、Kotlin は修飾されていない呼び出しを、メンバー関数ではなくその呼び出し可能なものとして解決します。明示的にメンバー関数を呼び出すには、`this.` 修飾子を使用します。

```kotlin
fun main() {
    class A {
        fun printLine() {
            println("Member function")
        }

        fun invokePrintLine() {
            fun printLine() {
                println("Local function")
            }
         
            printLine()
            // Local function
         
            this.printLine()
            // Member function
        }
    }

    A().invokePrintLine()
}
```
{kotlin-runnable="true"}