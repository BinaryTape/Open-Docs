---
title: 巢狀類別與內部類別
---
類別可以巢狀在其他類別中：

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

你也可以將介面用於巢狀結構。 類別和介面的所有組合都是可能的：你可以在類別中巢狀介面、在介面中巢狀類別以及在介面中巢狀介面。

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

## 內部類別（Inner classes）

標記為 `inner` 的巢狀類別可以訪問其外部類別的成員。 內部類別帶有對外部類別物件的引用：

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

請參閱 [限定的 `this` 表達式](this-expressions) 了解如何消除內部類別中 `this` 的歧義。

## 匿名內部類別（Anonymous inner classes）

匿名內部類別實例是使用 [物件表達式](object-declarations#object-expressions) 建立的：

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

:::note
在 JVM 上，如果物件是 functional Java interface（函數式 Java 介面） 的實例（這表示具有單個抽象方法的 Java 介面），你可以使用帶有介面類型前綴的 lambda 表達式建立它：

```kotlin
val listener = ActionListener { println("clicked") }
```

:::