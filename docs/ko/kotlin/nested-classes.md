[//]: # (title: 중첩 및 내부 클래스)

클래스는 다른 클래스 안에 중첩될 수 있습니다:

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

중첩을 통해 인터페이스를 사용할 수도 있습니다. 클래스와 인터페이스의 모든 조합이 가능합니다: 클래스 안에 인터페이스를, 인터페이스 안에 클래스를, 그리고 인터페이스 안에 인터페이스를 중첩할 수 있습니다.

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

## 내부 클래스

`inner`로 표시된 중첩 클래스는 바깥 클래스의 멤버에 접근할 수 있습니다. 내부 클래스는 바깥 클래스의 객체에 대한 참조를 가집니다:

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

내부 클래스에서 `this`의 모호성 해소에 대해 알아보려면 [Qualified `this` expressions](this-expressions.md)을 참조하세요.

## 익명 내부 클래스

익명 내부 클래스 인스턴스는 [객체 표현식](object-declarations.md#object-expressions)을 사용하여 생성됩니다:

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> JVM에서는 객체가 함수형 자바 인터페이스(단일 추상 메서드를 가진 자바 인터페이스를 의미)의 인스턴스인 경우, 인터페이스의 타입이 접두사로 붙은 람다 표현식을 사용하여 생성할 수 있습니다.
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}