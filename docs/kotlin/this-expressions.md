[//]: # (title: This 表达式)

为了表示当前的 *接收者*，你可以使用 `this` 表达式：

* 在 [类](classes.md#inheritance) 的成员中，`this` 指向该类的当前对象。
* 在 [扩展函数](extensions.md) 或 [带接收者的函数字面量](lambdas.md#function-literals-with-receiver) 中，`this` 表示在点号左侧传递的 *接收者* 形参。

如果 `this` 没有限定符，它指向 *最内层包含它的作用域*。要引用其他作用域中的 `this`，可以使用 *标签限定符*：

## 限定的 this

要从外部作用域（[类](classes.md)、[扩展函数](extensions.md) 或带标签的 [带接收者的函数字面量](lambdas.md#function-literals-with-receiver)）访问 `this`，你需要编写 `this@label`，其中 `@label` 是 `this` 所属作用域上的 [标签](returns.md)：

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
                // foo() 的接收者，因为包含它的 lambda 表达式
                // 没有任何接收者
                val d1 = this
            }
        }
    }
}
```

## 隐式 this

当你在 `this` 上调用成员函数时，可以省略 `this.` 限定符。然而，如果更近的词法作用域内有另一个同名的可调用对象，Kotlin 会将不带限定符的调用解析为该对象，而不是成员函数。要显式调用成员函数，请使用 `this.` 限定符：

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
            // 局部函数
         
            this.printLine()
            // 成员函数
        }
    }

    A().invokePrintLine()
}
```
{kotlin-runnable="true"}