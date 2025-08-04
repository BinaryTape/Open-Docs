[//]: # (title: ネストされたクラスとインナークラス)

クラスは他のクラスにネストできます:

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

インターフェースもネストして使用できます。クラスとインターフェースのすべての組み合わせが可能です: クラス内にインターフェースを、インターフェース内にクラスを、そしてインターフェース内にインターフェースをネストできます。

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

## インナークラス

`inner`とマークされたネストされたクラスは、その外側クラスのメンバーにアクセスできます。インナークラスは、外側クラスのオブジェクトへの参照を持ちます:

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

インナークラスにおける`this`の曖昧さ解消について学ぶには、[Qualified `this` expressions](this-expressions.md)を参照してください。

## 匿名インナークラス

匿名インナークラスのインスタンスは、[オブジェクト式](object-declarations.md#object-expressions)を使用して作成されます:

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> JVM上では、そのオブジェクトが関数型Javaインターフェース（つまり、単一の抽象メソッドを持つJavaインターフェース）のインスタンスである場合、そのインターフェースの型をプレフィックスとして付けたラムダ式を使用して作成できます:
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}