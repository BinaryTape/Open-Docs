---
title: 此表示式
---
要表示目前的 _接收者_ (receiver)，可以使用 `this` 表達式：

*   在 [類別](classes#inheritance) 的成員中，`this` 指的是該類別的目前物件。
*   在[擴充函式](extensions) 或[帶接收者的函數文本](lambdas#function-literals-with-receiver)中，`this` 表示在點的左側傳遞的 _接收者_ (receiver) 參數。

如果 `this` 沒有限定詞，則它指的是 _最內層的封閉作用域_ (innermost enclosing scope)。 要在其他作用域中引用 `this`，可以使用 _標籤限定詞_ (label qualifiers)：

## 限定的 this (Qualified this)

要從外部作用域（[類別](classes)、[擴充函式](extensions) 或標記的[帶接收者的函數文本](lambdas#function-literals-with-receiver)）訪問 `this`，可以寫入 `this@label`，其中 `@label` 是作用域上的一個 [標籤](returns)，表示 `this` 應該來自哪裡：

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

## 隱式的 this (Implicit this)

當你在 `this` 上呼叫成員函式時，你可以省略 `this.` 部分。
如果你有一個具有相同名稱的非成員函式，請謹慎使用 `this`，因為在某些情況下可能會呼叫它：

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