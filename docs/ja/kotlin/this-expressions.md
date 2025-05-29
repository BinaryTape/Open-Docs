[//]: # (title: this 式)

現在の_レシーバ_を表すには、`this` 式を使用します。

*   [クラス](classes.md#inheritance)のメンバーでは、`this` はそのクラスの現在のオブジェクトを参照します。
*   [拡張関数](extensions.md)または[レシーバ付き関数リテラル](lambdas.md#function-literals-with-receiver)では、`this` はドットの左側に渡される_レシーバ_パラメーターを表します。

`this` に修飾子がない場合、それは_最も内側の囲むスコープ_を参照します。他のスコープの`this`を参照するには、_ラベル修飾子_が使用されます。

## 修飾された this

外側のスコープ（[クラス](classes.md)、[拡張関数](extensions.md)、またはラベル付き[レシーバ付き関数リテラル](lambdas.md#function-literals-with-receiver)）から`this`にアクセスするには、`this@label`と記述します。ここで`@label`は、`this`が本来属するスコープの[ラベル](returns.md)です。

```kotlin
class A { // implicit label @A
    inner class B { // implicit label @B
        fun Int.foo() { // implicit label @foo
            val a = this@A // A's this
            val b = this@B // B's this

            val c = this // foo()'s receiver, an Int
            val c1 = this@foo // foo()'s receiver, an Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit's receiver, a String
            }

            val funLit2 = { s: String ->
                // foo()'s receiver, since enclosing lambda expression
                // doesn't have any receiver
                val d1 = this
            }
        }
    }
}
```

## 暗黙の this

`this`のメンバー関数を呼び出す際、`this.`部分を省略できます。
同じ名前の非メンバー関数がある場合、場合によってはそちらが代わりに呼び出される可能性があるため、この機能は慎重に使用してください。

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