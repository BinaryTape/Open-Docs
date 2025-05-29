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

インターフェースをネストして使用することもできます。クラスとインターフェースのあらゆる組み合わせが可能です。インターフェースをクラス内に、クラスをインターフェース内に、そしてインターフェースをインターフェース内にネストできます。

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

`inner` とマークされたネストされたクラスは、その外部クラスのメンバーにアクセスできます。インナークラスは、外部クラスのオブジェクトへの参照を持ちます:

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

インナークラスにおける `this` の曖昧さ解消について学ぶには、[修飾された `this` 式](this-expressions.md)を参照してください。

## 匿名インナークラス

匿名インナークラスのインスタンスは、[オブジェクト式](object-declarations.md#object-expressions)を使用して作成されます:

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> JVMでは、オブジェクトが関数型Javaインターフェース（単一の抽象メソッドを持つJavaインターフェース）のインスタンスである場合、そのインターフェースの型を接頭辞とするラムダ式を使用して作成できます:
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}