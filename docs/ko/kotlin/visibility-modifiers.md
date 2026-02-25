[//]: # (title: 가시성 수정자)

클래스, 객체, 인터페이스, 생성자, 함수뿐만 아니라 프로퍼티와 그 세터(setter)에는 *가시성 수정자*를 지정할 수 있습니다.
게터(getter)는 항상 해당 프로퍼티와 동일한 가시성을 가집니다.

Kotlin에는 `private`, `protected`, `internal`, `public`의 네 가지 가시성 수정자가 있습니다.
기본 가시성은 `public`입니다.

이 페이지에서는 수정자가 다양한 선언 범위에 어떻게 적용되는지 알아봅니다.

## 패키지

함수, 프로퍼티, 클래스, 객체 및 인터페이스는 패키지 바로 아래의 "최상위(top-level)"에 직접 선언할 수 있습니다.

```kotlin
// 파일 이름: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 가시성 수정자를 사용하지 않으면 기본적으로 `public`이 사용되며, 이는 해당 선언이 어디에서나 보인다는 것을 의미합니다.
* 선언을 `private`으로 표시하면 해당 선언이 포함된 파일 내부에서만 보입니다.
* `internal`로 표시하면 동일한 [모듈](#modules) 내의 모든 곳에서 보입니다.
* `protected` 수정자는 최상위 선언에서 사용할 수 없습니다.

>다른 패키지에서 보이는 최상위 선언을 사용하려면 해당 선언을 [임포트(import)](packages.md#imports)해야 합니다.
>
{style="note"}

예제:

```kotlin
// 파일 이름: example.kt
package foo

private fun foo() { ... } // example.kt 내부에서만 보임

public var bar: Int = 5 // 프로퍼티가 모든 곳에서 보임
    private set         // 세터는 example.kt 내부에서만 보임
    
internal val baz = 6    // 동일한 모듈 내부에서 보임
```

## 클래스 멤버

클래스 내부에 선언된 멤버의 경우:

* `private`은 해당 멤버가 이 클래스 내부(모든 멤버 포함)에서만 보임을 의미합니다.
* `protected`는 `private`으로 표시된 멤버와 동일한 가시성을 갖지만, 하위 클래스에서도 보임을 의미합니다.
* `internal`은 선언된 클래스를 볼 수 있는 *이 모듈 내부*의 모든 클라이언트가 해당 클래스의 `internal` 멤버를 볼 수 있음을 의미합니다.
* `public`은 선언된 클래스를 볼 수 있는 모든 클라이언트가 해당 클래스의 `public` 멤버를 볼 수 있음을 의미합니다.

> Kotlin에서 외부 클래스는 내부 클래스의 private 멤버를 볼 수 없습니다.
>
{style="note"}

`protected`나 `internal` 멤버를 오버라이드하고 가시성을 명시적으로 지정하지 않으면, 오버라이드하는 멤버도 원래 멤버와 동일한 가시성을 갖게 됩니다.

예제:

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // 기본적으로 public
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a는 보이지 않음
    // b, c, d는 보임
    // Nested와 e는 보임

    override val b = 5   // 'b'는 protected
    override val c = 7   // 'c'는 internal
}

class Unrelated(o: Outer) {
    // o.a, o.b는 보이지 않음
    // o.c와 o.d는 보임 (동일 모듈인 경우)
    // Outer.Nested는 보이지 않으며, Nested::e도 보이지 않음
}
```

### 생성자

클래스의 기본 생성자(primary constructor)의 가시성을 지정하려면 다음 구문을 사용하세요.

> 명시적으로 `constructor` 키워드를 추가해야 합니다.
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

여기서 생성자는 `private`입니다. 기본적으로 모든 생성자는 `public`이며, 이는 결과적으로 클래스가 보이는 모든 곳에서 생성자도 보임을 의미합니다 (즉, `internal` 클래스의 생성자는 동일한 모듈 내에서만 보입니다).

봉인된 클래스(sealed classes)의 생성자는 기본적으로 `protected`입니다. 자세한 정보는 [봉인된 클래스](sealed-classes.md#constructors)를 참조하세요.

### 지역 선언

지역 변수, 함수 및 클래스는 가시성 수정자를 가질 수 없습니다.

## 모듈

`internal` 가시성 수정자는 멤버가 동일한 모듈 내에서 보임을 의미합니다. 더 구체적으로, 모듈은 함께 컴파일되는 Kotlin 파일 집합을 말하며, 예를 들면 다음과 같습니다.

* IntelliJ IDEA 모듈.
* Maven 프로젝트.
* Gradle 소스 세트 (`test` 소스 세트가 `main`의 internal 선언에 접근할 수 있는 경우는 예외).