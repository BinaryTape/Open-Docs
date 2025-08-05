[//]: # (title: This 表示式)

為了表示當前的 _接收者_，您可以使用 `this` 表示式：

* 在 [類別](classes.md#inheritance) 的成員中，`this` 指的是該類別的當前物件。
* 在 [擴充函數](extensions.md) 或 [帶有接收者的函數字面值](lambdas.md#function-literals-with-receiver) 中，`this` 表示在點號左側傳遞的 _接收者_ 參數。

如果 `this` 沒有限定符，它指向最內層的封閉作用域。為了在其他作用域中引用 `this`，會使用 _標籤限定符_：

## 限定的 this

為了從外部作用域（一個 [類別](classes.md)、[擴充函數](extensions.md) 或帶標籤的 [帶有接收者的函數字面值](lambdas.md#function-literals-with-receiver)）存取 `this`，您可以寫作 `this@label`，其中 `@label` 是 `this` 所指的作用域上的 [標籤](returns.md)：

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

## 隱式的 this

當您在 `this` 上呼叫成員函數時，您可以省略 `this.` 部分。如果您有一個同名的非成員函數，請謹慎使用此特性，因為在某些情況下，它可能會被呼叫而非成員函數：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
```