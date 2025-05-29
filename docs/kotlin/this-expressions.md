[//]: # (title: this 表达式)

为了表示当前的 _接收者_，你可以使用 `this` 表达式：

* 在 [类](classes.md#inheritance) 的成员中，`this` 指代该类的当前对象。
* 在 [扩展函数](extensions.md) 或 [带接收者的函数字面量](lambdas.md#function-literals-with-receiver) 中，`this` 表示在点号左侧传递的 _接收者_ 参数。

如果 `this` 没有限定符，它指代 _最内层封闭作用域_。要在其他作用域中引用 `this`，可以使用 _标签限定符_：

## 带限定符的 this

要从外部作用域（[类](classes.md)、[扩展函数](extensions.md) 或带标签的 [带接收者的函数字面量](lambdas.md#function-literals-with-receiver)）访问 `this`，你可以写 `this@label`，其中 `@label` 是 `this` 所指代作用域上的一个 [标签](returns.md)：

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

            val funLit2 = { s: String ->
                // foo() 的接收者，因为外层 lambda 表达式
                // 没有任何接收者
                val d1 = this
            }
        }
    }
}
```

## 隐式 this

当你在 `this` 上调用成员函数时，你可以省略 `this.` 部分。如果你有一个同名的非成员函数，请谨慎使用，因为在某些情况下，它可能会被调用：

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
    
    A().invokePrintLine() // 成员函数
    A().invokePrintLine(omitThis = true) // 局部函数
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}