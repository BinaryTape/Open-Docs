[//]: # (title: ネストしたクラスと内部クラス)

クラスを他のクラスの中にネスト（入れ子に）することができます。

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

インターフェースをネストして使用することもできます。クラスとインターフェースのあらゆる組み合わせが可能です。クラスの中にインターフェースを、インターフェースの中にクラスを、そしてインターフェースの中に別のインターフェースをネストすることができます。

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

## 内部クラス

`inner` マークが付いたネストしたクラスは、外部クラスのメンバにアクセスできます。内部クラスは、外部クラスのオブジェクトへの参照を保持します。

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

内部クラスにおける `this` の曖昧さ回避については、[限定付き this 式](this-expressions.md)を参照してください。

## 匿名内部クラス

匿名内部クラスのインスタンスは、[オブジェクト式](object-declarations.md#object-expressions)を使用して作成されます。

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> JVM では、オブジェクトが関数型 Java インターフェース（単一の抽象メソッドを持つ Java インターフェース）のインスタンスである場合、インターフェースの型を接頭辞として付けたラムダ式を使用して作成できます。
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}