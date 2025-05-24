---
title: ネストされたクラスとインナークラス
---
クラスは他のクラスにネストできます。

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

インターフェースをネストして使用することもできます。クラスとインターフェースのすべての組み合わせが可能です。クラスにインターフェースをネストしたり、インターフェースにクラスをネストしたり、インターフェースにインターフェースをネストしたりできます。

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

## Inner class（内部クラス）

`inner` とマークされたネストされたクラスは、その外部クラスのメンバーにアクセスできます。Inner class（内部クラス）は、外部クラスのオブジェクトへの参照を持ちます。

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

Inner class（内部クラス）における `this` の曖昧さ回避については、[Qualified `this` expressions](this-expressions) を参照してください。

## Anonymous inner class（匿名内部クラス）

Anonymous inner class（匿名内部クラス）のインスタンスは、[object expression（オブジェクト式）](object-declarations#object-expressions) を使用して作成されます。

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

:::note
JVM では、オブジェクトが Java の関数型インターフェース (単一の抽象メソッドを持つ Java インターフェース) のインスタンスである場合、インターフェースの型をプレフィックスとして付加したラムダ式を使用して作成できます。

```kotlin
val listener = ActionListener { println("clicked") }
```

:::