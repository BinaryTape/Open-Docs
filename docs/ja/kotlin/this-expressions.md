---
title: "This 式"
---
現在の _レシーバ_ を示すには、`this` 式を使用します。

* [クラス](classes#inheritance)のメンバでは、`this` はそのクラスの現在のオブジェクトを指します。
* [拡張関数](extensions)または[レシーバ付きの関数リテラル](lambdas#function-literals-with-receiver)では、
`this` はドットの左側に渡される _レシーバ_ パラメータを示します。

`this` に修飾子がない場合、_最も内側の囲みスコープ_ を指します。他のスコープの `this` を参照するには、_ラベル修飾子_ を使用します。

## 修飾された this

外側のスコープ（[クラス](classes)、[拡張関数](extensions)、
またはラベル付きの[レシーバ付きの関数リテラル](lambdas#function-literals-with-receiver)）から `this` にアクセスするには、`this@label` と記述します。
ここで `@label` は、`this` が対象とするスコープの[ラベル](returns)です。

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

            val funLit2 = { s: String `->`
                // foo()'s receiver, since enclosing lambda expression
                // doesn't have any receiver
                val d1 = this
            }
        }
    }
}
```

## 暗黙的な this

`this` でメンバ関数を呼び出す場合、`this.` の部分を省略できます。
同じ名前の非メンバ関数がある場合は、代わりに呼び出される可能性があるため、注意して使用してください。

```kotlin
fun main() {
    fun printLine() { println("Local function") }
    
    class A {
        fun printLine() { println("Member function") }

        fun invokePrintLine(omitThis: Boolean = false)  { 
            if (omitThis) printLine()
            else this.printLine()
        }
    }
    
    A().invokePrintLine() // Member function
    A().invokePrintLine(omitThis = true) // Local function
}
```