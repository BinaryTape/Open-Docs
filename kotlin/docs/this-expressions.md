---
title: "This 表达式"
---
要表示当前的 _接收者_ (receiver)，可以使用 `this` 表达式：

* 在 [类](classes#inheritance) 的成员中，`this` 指的是该类的当前对象。
* 在 [扩展函数](extensions) 或带有 [接收者的函数字面量](lambdas#function-literals-with-receiver) 中，`this` 表示点号左侧传递的 _接收者_ 参数。

如果 `this` 没有限定符，则它指的是 _最内层的封闭作用域_。 要引用其他作用域中的 `this`，可以使用 _标签限定符_：

## 限定的 this

要从外部作用域（[类](classes)、[扩展函数](extensions) 或带标签的 [带接收者的函数字面量](lambdas#function-literals-with-receiver)）访问 `this`，可以编写 `this@label`，其中 `@label` 是作用域 [标签](returns)，表示 `this` 应该来自哪里：

```kotlin
class A { // 隐式标签 @A
    inner class B { // 隐式标签 @B
        fun Int.foo() { // 隐式标签 @foo
            val a = this@A // A 的 this
            val b = this@B // B 的 this

            val c = this // foo() 的接收者，一个 Int
            val c1 = this@foo // foo() 的接收者，一个 Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit 的接收者，一个 String
            }

            val funLit2 = { s: String `->`
                // foo() 的接收者，因为封闭的 lambda 表达式
                // 没有接收者
                val d1 = this
            }
        }
    }
}
```

## 隐式的 this

在 `this` 上调用成员函数时，可以跳过 `this.` 部分。
如果你有一个同名的非成员函数，请谨慎使用 `this`，因为在某些情况下可能会调用该函数：

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