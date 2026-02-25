[//]: # (title: 巢狀與內部類別)

類別可以嵌套在其他類別中：

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

你也可以在巢狀結構中使用介面。類別與介面的所有組合都是可能的：你可以在類別中嵌套介面、在介面中嵌套類別，以及在介面中嵌套介面。

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

標記為 `inner` 的巢狀類別可以存取其外部類別的成員。內部類別會持有其外部類別物件的參照：

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

請參閱 [限定 `this` 運算式](this-expressions.md) 以了解內部類別中 `this` 的消歧義（disambiguation）。

## 匿名內部類別

匿名內部類別的執行個體是使用 [物件運算式](object-declarations.md#object-expressions) 建立的：

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> 在 JVM 上，如果該物件是函數式 Java 介面的執行個體（即具有單一抽象方法的 Java 介面），你可以使用以該介面型別為前綴的 Lambda 運算式來建立：
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}