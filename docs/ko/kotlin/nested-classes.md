---
title: "중첩 클래스 및 내부 클래스"
---
클래스는 다른 클래스 안에 중첩될 수 있습니다.

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

인터페이스에 중첩을 사용할 수도 있습니다. 클래스와 인터페이스의 모든 조합이 가능합니다. 클래스 안에 인터페이스를, 인터페이스 안에 클래스를, 인터페이스 안에 인터페이스를 중첩할 수 있습니다.

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

## 내부 클래스 (Inner classes)

`inner` 로 표시된 중첩 클래스는 외부 클래스의 멤버에 접근할 수 있습니다. 내부 클래스는 외부 클래스의 객체에 대한 참조를 전달합니다.

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

내부 클래스에서 `this` 의 모호성을 제거하는 방법에 대한 자세한 내용은 [Qualified `this` expressions](this-expressions) 를 참조하십시오.

## 익명 내부 클래스 (Anonymous inner classes)

익명 내부 클래스 인스턴스는 [object expression](object-declarations#object-expressions)을 사용하여 생성됩니다.

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

:::note
JVM에서 객체가 단일 추상 메서드를 가진 Java 인터페이스인 functional Java interface의 인스턴스인 경우 인터페이스 유형이 접두사로 붙은 람다 표현식을 사용하여 만들 수 있습니다.

```kotlin
val listener = ActionListener { println("clicked") }
```

:::