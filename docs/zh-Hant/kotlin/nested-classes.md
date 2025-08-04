[//]: # (title: 巢狀類別與內部類別)

類別可以巢狀地定義在其他類別中：

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

你也可以在介面中使用巢狀定義。類別與介面之間的所有組合都是可能實現的：你可以在類別中巢狀定義介面，在介面中巢狀定義類別，以及在介面中巢狀定義介面。

```kotlin
interface OuterInterface {
    class InnerClass
    interface InnerInterface
}

class OuterClass {
    class InnerClass
    interface InnerInterface
}
```

## 內部類別

被標記為 `inner` 的巢狀類別可以存取其外部類別的成員。內部類別攜帶一個對外部類別物件的引用：

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

參見 [Qualified `this` expressions](this-expressions.md) 以了解在內部類別中 `this` 的消歧義用法。

## 匿名內部類別

匿名內部類別實例是使用 [object expression](object-declarations.md#object-expressions) 創建的：

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> 在 JVM 上，如果該物件是函數式 Java 介面（即只有一個抽象方法的 Java 介面）的實例，你可以使用以介面類型作為前綴的 lambda 運算式來創建它：
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}