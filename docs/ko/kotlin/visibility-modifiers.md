[//]: # (title: 가시성 한정자)

클래스, 객체, 인터페이스, 생성자, 함수뿐만 아니라 프로퍼티 및 해당 세터도 *가시성 한정자*를 가질 수 있습니다.
게터는 항상 해당 프로퍼티와 동일한 가시성을 가집니다.

코틀린에는 `private`, `protected`, `internal`, `public`의 네 가지 가시성 한정자가 있습니다.
기본 가시성은 `public`입니다.

이 페이지에서는 한정자가 다양한 유형의 선언 범위에 어떻게 적용되는지 알아봅니다.

## 패키지

함수, 프로퍼티, 클래스, 객체, 인터페이스는 패키지 내부에 직접 "최상위"로 선언될 수 있습니다.

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

*   가시성 한정자를 사용하지 않으면 `public`이 기본적으로 사용되며, 이는 선언이 모든 곳에서 가시적임을 의미합니다.
*   선언을 `private`으로 표시하면 해당 선언을 포함하는 파일 내에서만 가시적입니다.
*   `internal`로 표시하면 동일한 [모듈](#modules) 내 모든 곳에서 가시적입니다.
*   `protected` 한정자는 최상위 선언에 사용할 수 없습니다.

>다른 패키지의 가시적인 최상위 선언을 사용하려면 해당 선언을 [임포트](packages.md#imports)해야 합니다.
>
{style="note"}

예시:

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // example.kt 파일 내에서 가시적

public var bar: Int = 5 // 프로퍼티는 모든 곳에서 가시적
    private set         // 세터는 example.kt 파일 내에서만 가시적
    
internal val baz = 6    // 동일 모듈 내에서 가시적
```

## 클래스 멤버

클래스 내부에 선언된 멤버의 경우:

*   `private`은 멤버가 이 클래스 내부(모든 멤버 포함)에서만 가시적임을 의미합니다.
*   `protected`는 멤버가 `private`으로 표시된 멤버와 동일한 가시성을 가지지만, 서브클래스에서도 가시적임을 의미합니다.
*   `internal`은 선언하는 클래스를 볼 수 있는 *이 모듈 내*의 모든 클라이언트가 해당 `internal` 멤버를 볼 수 있음을 의미합니다.
*   `public`은 선언하는 클래스를 볼 수 있는 모든 클라이언트가 해당 `public` 멤버를 볼 수 있음을 의미합니다.

>코틀린에서는 외부 클래스가 내부 클래스의 private 멤버를 볼 수 없습니다.
>
{style="note"}

`protected` 또는 `internal` 멤버를 오버라이드하고 가시성을 명시적으로 지정하지 않으면, 오버라이딩하는 멤버도 원본과 동일한 가시성을 가집니다.

예시:

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // public by default
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a는 가시적이지 않음
    // b, c, d는 가시적
    // Nested와 e는 가시적

    override val b = 5   // 'b'는 protected
    override val c = 7   // 'c'는 internal
}

class Unrelated(o: Outer) {
    // o.a, o.b는 가시적이지 않음
    // o.c, o.d는 가시적 (동일 모듈)
    // Outer.Nested는 가시적이지 않으며, Nested::e 또한 가시적이지 않음 
}
```

### 생성자

클래스의 주 생성자의 가시성을 지정하려면 다음 문법을 사용하세요.

>명시적인 `constructor` 키워드를 추가해야 합니다.
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

여기서 생성자는 `private`입니다. 기본적으로 모든 생성자는 `public`이며, 이는 클래스가 가시적인 모든 곳에서 생성자가 가시적이라는 것과 같습니다(이는 `internal` 클래스의 생성자가 동일한 모듈 내에서만 가시적임을 의미합니다).

봉인된 클래스의 경우, 생성자는 기본적으로 `protected`입니다. 자세한 내용은 [봉인된 클래스](sealed-classes.md#constructors)를 참조하세요.

### 지역 선언

지역 변수, 함수, 클래스는 가시성 한정자를 가질 수 없습니다.

## 모듈

`internal` 가시성 한정자는 멤버가 동일한 모듈 내에서 가시적임을 의미합니다. 더 구체적으로, 모듈은 함께 컴파일되는 코틀린 파일의 집합이며, 예를 들면 다음과 같습니다.

*   IntelliJ IDEA 모듈
*   Maven 프로젝트
*   Gradle 소스 세트 (`test` 소스 세트가 `main`의 내부 선언에 접근할 수 있다는 예외 포함)
*   `<kotlinc>` Ant 태스크를 한 번 호출하여 컴파일된 파일 집합