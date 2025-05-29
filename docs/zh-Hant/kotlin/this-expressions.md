[//]: # (title: This 表達式)

為了表示當前的 _接收者_，您可以使用 `this` 表達式：

*   在[類別](classes.md#inheritance)的成員中，`this` 參照到該類別的當前物件。
*   在[擴充函式](extensions.md)或[帶接收者的函式常值](lambdas.md#function-literals-with-receiver)中，`this` 表示作為點號左側傳遞的_接收者_參數。

如果 `this` 沒有限定符 (qualifiers)，它會參照到_最內層的封裝作用域 (innermost enclosing scope)_。要參照其他作用域中的 `this`，則使用_標籤限定符 (label qualifiers)_：

## 限定 this

要從外部作用域（一個[類別](classes.md)、[擴充函式](extensions.md)或帶標籤的[帶接收者的函式常值](lambdas.md#function-literals-with-receiver)）存取 `this`，您可以寫作 `this@label`，其中 `@label` 是 `this` 所屬作用域的一個[標籤](returns.md)：

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

## 隱式 this

當您在 `this` 上呼叫成員函式時，可以省略 `this.` 部分。如果您有一個同名的非成員函式，請謹慎使用此功能，因為在某些情況下它可能會被呼叫來取代：

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