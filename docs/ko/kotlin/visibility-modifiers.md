---
title: "가시성 변경자"
---
클래스, 객체, 인터페이스, 생성자, 함수, 프로퍼티 및 해당 세터는 *가시성 수정자*를 가질 수 있습니다.
Getter는 항상 해당 프로퍼티와 동일한 가시성을 가집니다.

Kotlin에는 `private`, `protected`, `internal`, `public`의 네 가지 가시성 수정자가 있습니다.
기본 가시성은 `public`입니다.

이 페이지에서는 수정자가 다양한 유형의 선언 범위에 어떻게 적용되는지 알아봅니다.

## 패키지

함수, 프로퍼티, 클래스, 객체 및 인터페이스는 패키지 내에서 직접 "최상위"로 선언할 수 있습니다.

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 가시성 수정자를 사용하지 않으면 기본적으로 `public`이 사용됩니다. 즉, 선언이 모든 곳에서 표시됩니다.
* 선언을 `private`으로 표시하면 선언을 포함하는 파일 내에서만 표시됩니다.
* `internal`로 표시하면 동일한 [모듈](#modules) 내의 모든 곳에서 표시됩니다.
* `protected` 수정자는 최상위 선언에 사용할 수 없습니다.

:::note
다른 패키지에서 보이는 최상위 선언을 사용하려면 [import](packages#imports)해야 합니다.

:::

예:

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // example.kt 내에서 표시됨

public var bar: Int = 5 // 프로퍼티는 모든 곳에서 표시됨
    private set         // setter는 example.kt에서만 표시됨
    
internal val baz = 6    // 동일한 모듈 내에서 표시됨
```

## 클래스 멤버

클래스 내에 선언된 멤버의 경우:

* `private`은 멤버가 이 클래스 내에서만 (모든 멤버 포함) 표시됨을 의미합니다.
* `protected`는 멤버가 `private`으로 표시된 멤버와 동일한 가시성을 갖지만 서브클래스에서도 표시됨을 의미합니다.
* `internal`은 이 모듈 *내부*에서 선언 클래스를 보는 모든 클라이언트가 해당 `internal` 멤버를 볼 수 있음을 의미합니다.
* `public`은 선언 클래스를 보는 모든 클라이언트가 해당 `public` 멤버를 볼 수 있음을 의미합니다.

:::note
Kotlin에서 외부 클래스는 내부 클래스의 private 멤버를 볼 수 없습니다.

:::

`protected` 또는 `internal` 멤버를 재정의하고 가시성을 명시적으로 지정하지 않으면 재정의하는 멤버도 원래 멤버와 동일한 가시성을 갖습니다.

예:

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
    // a는 보이지 않습니다.
    // b, c 및 d가 보입니다.
    // Nested 및 e가 보입니다.

    override val b = 5   // 'b'는 protected입니다.
    override val c = 7   // 'c'는 internal입니다.
}

class Unrelated(o: Outer) {
    // o.a, o.b는 보이지 않습니다.
    // o.c 및 o.d가 보입니다(동일한 모듈).
    // Outer.Nested는 보이지 않으며 Nested::e도 보이지 않습니다. 
}
```

### 생성자

클래스의 기본 생성자의 가시성을 지정하려면 다음 구문을 사용하세요.

:::note
명시적인 `constructor` 키워드를 추가해야 합니다.

:::

```kotlin
class C private constructor(a: Int) { ... }
```

여기서 생성자는 `private`입니다. 기본적으로 모든 생성자는 `public`이며, 이는 클래스가 보이는 모든 곳에서 효과적으로 보이게 됩니다 (이는 `internal` 클래스의 생성자는 동일한 모듈 내에서만 보인다는 의미입니다).

Sealed 클래스의 경우 생성자는 기본적으로 `protected`입니다. 자세한 내용은 [Sealed classes](sealed-classes#constructors)를 참조하세요.

### 로컬 선언

로컬 변수, 함수 및 클래스는 가시성 수정자를 가질 수 없습니다.

## 모듈

`internal` 가시성 수정자는 멤버가 동일한 모듈 내에서 표시됨을 의미합니다. 보다 구체적으로, 모듈은 함께 컴파일된 Kotlin 파일 세트입니다. 예를 들면 다음과 같습니다.

* IntelliJ IDEA 모듈.
* Maven 프로젝트.
* Gradle 소스 세트 (`test` 소스 세트가 `main`의 internal 선언에 액세스할 수 있다는 예외가 있음).
* `<kotlinc>` Ant 작업의 한 번의 호출로 컴파일된 파일 세트.