[//]: # (title: 인터페이스)

Kotlin의 인터페이스는 추상 메서드의 선언과 메서드 구현을 모두 포함할 수 있습니다. 추상 클래스와 다른 점은 인터페이스는 상태를 저장할 수 없다는 것입니다. 인터페이스는 프로퍼티를 가질 수 있지만, 이 프로퍼티는 추상적이거나 접근자(accessor) 구현을 제공해야 합니다.

인터페이스는 `interface` 키워드를 사용하여 정의됩니다:

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## 인터페이스 구현

클래스나 객체는 하나 이상의 인터페이스를 구현할 수 있습니다:

```kotlin
class Child : MyInterface {
    override fun bar() {
        // body
    }
}
```

## 인터페이스의 프로퍼티

인터페이스에서 프로퍼티를 선언할 수 있습니다. 인터페이스에 선언된 프로퍼티는 추상적이거나 접근자(accessor)에 대한 구현을 제공할 수 있습니다. 인터페이스에 선언된 프로퍼티는 지원 필드(backing field)를 가질 수 없으며, 따라서 인터페이스에 선언된 접근자는 이를 참조할 수 없습니다:

```kotlin
interface MyInterface {
    val prop: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(prop)
    }
}

class Child : MyInterface {
    override val prop: Int = 29
}
```

## 인터페이스 상속

인터페이스는 다른 인터페이스로부터 파생될 수 있습니다. 이는 다른 인터페이스의 멤버에 대한 구현을 제공하고 새로운 함수와 프로퍼티를 선언할 수 있음을 의미합니다. 당연하게도, 그러한 인터페이스를 구현하는 클래스는 누락된 구현만 정의하면 됩니다:

```kotlin
interface Named {
    val name: String
}

interface Person : Named {
    val firstName: String
    val lastName: String
    
    override val name: String get() = "$firstName $lastName"
}

data class Employee(
    // implementing 'name' is not required
    override val firstName: String,
    override val lastName: String,
    val position: Position
) : Person
```

## 오버라이딩 충돌 해결

슈퍼타입 목록에 여러 타입을 선언할 때, 동일한 메서드에 대해 둘 이상의 구현을 상속받을 수 있습니다:

```kotlin
interface A {
    fun foo() { print("A") }
    fun bar()
}

interface B {
    fun foo() { print("B") }
    fun bar() { print("bar") }
}

class C : A {
    override fun bar() { print("bar") }
}

class D : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }

    override fun bar() {
        super<B>.bar()
    }
}
```

인터페이스 *A*와 *B*는 모두 함수 *foo()*와 *bar()*를 선언합니다. 둘 다 *foo()*를 구현하지만, *B*만 *bar()*를 구현합니다 (*bar()*는 *A*에서 추상으로 표시되어 있지 않습니다. 이는 함수에 본문이 없는 경우 인터페이스의 기본값이기 때문입니다). 이제, *A*로부터 구체적인 클래스 *C*를 파생하는 경우, *bar()*를 오버라이드하고 구현을 제공해야 합니다.

그러나 *A*와 *B*로부터 *D*를 파생하는 경우, 여러 인터페이스로부터 상속받은 모든 메서드를 구현해야 하며, *D*가 이들을 정확히 어떻게 구현해야 하는지 명시해야 합니다. 이 규칙은 단일 구현을 상속받은 메서드(*bar()*)와 여러 구현을 상속받은 메서드(*foo()*) 모두에 적용됩니다.