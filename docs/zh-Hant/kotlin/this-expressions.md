[//]: # (title: this 表達式)

為了表示目前的 _receiver_，您可以使用 `this` 表達式：

* 在 [類別](classes.md#inheritance) 的成員中，`this` 指的是該類別的目前物件。
* 在 [擴充方法](extensions.md) 或 [帶有接收者的函式常值](lambdas.md#function-literals-with-receiver) 中，`this` 表示在點（dot）左側傳遞的 _receiver_ 參數。

如果 `this` 沒有限定詞，它指的是 _最內層的封閉作用域_。若要參考其他作用域中的 `this`，則使用 _標籤限定詞_：

## 限定的 this 

若要從外層作用域（[類別](classes.md)、[擴充方法](extensions.md) 或具標籤的 [帶有接收者的函式常值](lambdas.md#function-literals-with-receiver)）存取 `this`，您可以撰寫 `this@label`，其中 `@label` 是 `this` 所屬作用域上的 [標籤](returns.md)：

```kotlin
class A { // 隱式標籤 @A
    inner class B { // 隱式標籤 @B
        fun Int.foo() { // 隱式標籤 @foo
            val a = this@A // A 的 this
            val b = this@B // B 的 this

            val c = this // foo() 的 receiver，一個 Int
            val c1 = this@foo // foo() 的 receiver，一個 Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit 的 receiver，一個 String
            }

            val funLit2 = { s: String ->
                // foo() 的 receiver，因為封閉的 Lambda 運算式
                // 沒有任何 receiver
                val d1 = this
            }
        }
    }
}
```

## 隱式 this

當您在 `this` 上呼叫成員函數時，可以省略 `this.` 限定詞。然而，如果另一個具有相同名稱的可呼叫物件在更近的語法作用域內可用，Kotlin 會將不帶限定詞的呼叫解析為該物件，而非成員函數。若要明確呼叫成員函數，請使用 `this.` 限定詞：

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