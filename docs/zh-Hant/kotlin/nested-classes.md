[//]: # (title: 巢狀與內部類別)

類別可以巢狀於其他類別中：

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

您也可以在介面中使用巢狀結構。類別與介面的所有組合皆可行：您可以在類別中巢狀介面、在介面中巢狀類別，以及在介面中巢狀介面。

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

一個標記為 `inner` 的巢狀類別可以存取其外部類別的成員。內部類別會攜帶一個外部類別物件的參考：

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

請參閱[合格的 `this` 表達式](this-expressions.md)以了解在內部類別中 `this` 的消歧義。

## 匿名內部類別

匿名內部類別實例是使用[物件表達式](object-declarations.md#object-expressions)建立的：

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> 在 JVM 上，如果物件是函式式 Java 介面 (意即具有單一抽象方法的 Java 介面) 的實例，您可以使用以介面型別為前綴的 lambda 表達式建立它：
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}