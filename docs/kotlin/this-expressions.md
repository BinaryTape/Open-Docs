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

当你在 `this` 上调用成员函数时，可以省略 `this.` 部分。如果你有一个同名的非成员函数，请谨慎使用此写法，因为在某些情况下可能会调用到该非成员函数：

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