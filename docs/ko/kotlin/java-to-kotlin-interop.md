[//]: # (title: 자바에서 코틀린 호출하기)

코틀린 코드는 자바에서 쉽게 호출될 수 있습니다.
예를 들어, 코틀린 클래스의 인스턴스는 자바 메서드에서 원활하게 생성되고 조작될 수 있습니다.
하지만 자바와 코틀린 사이에는 코틀린 코드를 자바에 통합할 때 주의해야 할 몇 가지 차이점이 있습니다.
이 페이지에서는 자바 클라이언트와 코틀린 코드의 상호 운용성(interop)을 맞춤 설정하는 방법을 설명합니다.

## 프로퍼티

코틀린 프로퍼티는 다음 자바 요소로 컴파일됩니다:

 * 이름 앞에 `get` 접두사를 붙여 계산된 이름의 게터(getter) 메서드
 * 이름 앞에 `set` 접두사를 붙여 계산된 이름의 세터(setter) 메서드 (`var` 프로퍼티에만 해당)
 * 프로퍼티 이름과 동일한 이름의 private 필드 (백킹 필드(backing field)를 가진 프로퍼티에만 해당)

예를 들어, `var firstName: String`은 다음 자바 선언으로 컴파일됩니다:

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

프로퍼티 이름이 `is`로 시작하는 경우, 다른 이름 매핑 규칙이 사용됩니다: 게터의 이름은 프로퍼티 이름과 동일하며, 세터의 이름은 `is`를 `set`으로 대체하여 얻어집니다.
예를 들어, `isOpen` 프로퍼티의 경우 게터는 `isOpen()`으로 호출되고 세터는 `setOpen()`으로 호출됩니다.
이 규칙은 `Boolean`뿐만 아니라 모든 타입의 프로퍼티에 적용됩니다.

## 패키지 수준 함수

패키지 `org.example` 내 `app.kt` 파일에 선언된 모든 함수와 프로퍼티(확장 함수 포함)는 `org.example.AppKt`라는 이름의 자바 클래스의 정적 메서드로 컴파일됩니다.

```kotlin
// app.kt
package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.AppKt.getTime();
```

생성된 자바 클래스에 사용자 지정 이름을 설정하려면 `@JvmName` 어노테이션을 사용하세요.

```kotlin
@file:JvmName("DemoUtils")

package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.DemoUtils.getTime();
```

동일한 생성된 자바 클래스 이름(동일한 패키지 및 동일한 이름 또는 동일한 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 어노테이션)을 가진 여러 파일이 있는 것은 일반적으로 오류입니다.
하지만 컴파일러는 지정된 이름을 가지고 해당 이름을 가진 모든 파일의 모든 선언을 포함하는 단일 자바 퍼사드(facade) 클래스를 생성할 수 있습니다.
이러한 퍼사드 생성을 활성화하려면 모든 해당 파일에 [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) 어노테이션을 사용하세요.

```kotlin
// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getTime() { /*...*/ }
```

```kotlin
// newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getDate() { /*...*/ }
```

```java
// Java
org.example.Utils.getTime();
org.example.Utils.getDate();
```

## 인스턴스 필드

코틀린 프로퍼티를 자바에서 필드로 노출해야 하는 경우, [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 어노테이션을 붙이세요.
필드는 기본 프로퍼티와 동일한 가시성(visibility)을 가집니다. 다음 경우에 프로퍼티에 `@JvmField`를 어노테이션할 수 있습니다:
* 백킹 필드를 가짐
* private이 아님
* `open`, `override` 또는 `const` 변경자(modifier)를 가지지 않음
* 위임된(delegated) 프로퍼티가 아님

```kotlin
class User(id: String) {
    @JvmField val ID = id
}
```

```java

// Java
class JavaClient {
    public String getID(User user) {
        return user.ID;
    }
}
```

[지연 초기화(Late-Initialized)](properties.md#late-initialized-properties-and-variables) 프로퍼티도 필드로 노출됩니다.
필드의 가시성은 `lateinit` 프로퍼티 세터의 가시성과 동일합니다.

## 정적 필드

이름 있는 객체 또는 동반 객체(companion object)에 선언된 코틀린 프로퍼티는 해당 이름 있는 객체 또는 동반 객체를 포함하는 클래스에 정적 백킹 필드를 가집니다.

일반적으로 이 필드들은 private이지만 다음 방법 중 하나로 노출될 수 있습니다:

 - [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 어노테이션
 - `lateinit` 변경자
 - `const` 변경자
 
이러한 프로퍼티에 `@JvmField`를 어노테이션하면 프로퍼티 자체와 동일한 가시성을 가진 정적 필드가 됩니다.

```kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```

```java
// Java
Key.COMPARATOR.compare(key1, key2);
// public static final field in Key class
```

객체 또는 동반 객체의 [지연 초기화(late-initialized)](properties.md#late-initialized-properties-and-variables) 프로퍼티는 프로퍼티 세터와 동일한 가시성을 가진 정적 백킹 필드를 가집니다.

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```

```java

// Java
Singleton.provider = new Provider();
// public static non-final field in Singleton class
```

(`const`로 선언된 프로퍼티 (클래스 내 및 최상위 수준 모두)는 자바에서 정적 필드로 변환됩니다:

```kotlin
// file example.kt

object Obj {
    const val CONST = 1
}

class C {
    companion object {
        const val VERSION = 9
    }
}

const val MAX = 239
```

자바에서:

```java

int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## 정적 메서드

위에서 언급했듯이, 코틀린은 패키지 수준 함수를 정적 메서드로 표현합니다.
또한 코틀린은 이름 있는 객체 또는 동반 객체에 정의된 함수를 [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html)으로 어노테이션하면 해당 함수에 대한 정적 메서드를 생성할 수 있습니다.
이 어노테이션을 사용하면 컴파일러는 객체를 감싸는(enclosing) 클래스에 정적 메서드와 객체 자체에 인스턴스 메서드를 모두 생성합니다. 예를 들어:

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

이제 자바에서는 `callStatic()`이 정적이지만 `callNonStatic()`은 그렇지 않습니다:

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

이름 있는 객체도 동일합니다:

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

자바에서:

```java

Obj.callStatic(); // works fine
Obj.callNonStatic(); // error
Obj.INSTANCE.callNonStatic(); // works, a call through the singleton instance
Obj.INSTANCE.callStatic(); // works too
```

코틀린 1.3부터 `@JvmStatic`은 인터페이스의 동반 객체에 정의된 함수에도 적용됩니다.
이러한 함수는 인터페이스에서 정적 메서드로 컴파일됩니다. 인터페이스의 정적 메서드는 자바 1.8에서 도입되었으므로 해당 타겟을 사용하는지 확인하세요.

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

`@JvmStatic` 어노테이션은 객체 또는 동반 객체의 프로퍼티에도 적용될 수 있으며, 이로 인해 해당 객체 또는 동반 객체를 포함하는 클래스에서 해당 프로퍼티의 게터 및 세터 메서드가 정적 멤버가 됩니다.

## 인터페이스의 기본 메서드

>기본 메서드는 JVM 1.8 이상 타겟에서만 사용할 수 있습니다.
>
{style="note"}

JDK 1.8부터 자바의 인터페이스는 [기본 메서드(default methods)](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)를 포함할 수 있습니다.
코틀린 인터페이스의 모든 비추상 멤버를 해당 인터페이스를 구현하는 자바 클래스의 기본값으로 만들려면, 코틀린 코드를 `-Xjvm-default=all` 컴파일러 옵션으로 컴파일하세요.

기본 메서드를 가진 코틀린 인터페이스의 예시는 다음과 같습니다:

```kotlin
// compile with -Xjvm-default=all

interface Robot {
    fun move() { println("~walking~") }  // 자바 인터페이스에서 기본값으로 설정됨
    fun speak(): Unit
}
```

기본 구현은 인터페이스를 구현하는 자바 클래스에서 사용할 수 있습니다.

```java
//Java implementation
public class C3PO implements Robot {
    // move() implementation from Robot is available implicitly
    @Override
    public void speak() {
        System.out.println("I beg your pardon, sir");
    }
}
```

```java
C3PO c3po = new C3PO();
c3po.move(); // default implementation from the Robot interface
c3po.speak();
```

인터페이스의 구현체는 기본 메서드를 오버라이드할 수 있습니다.

```java
//Java
public class BB8 implements Robot {
    // 기본 메서드의 자체 구현
    @Override
    public void move() {
        System.out.println("~rolling~");
    }

    @Override
    public void speak() {
        System.out.println("Beep-beep");
    }
}
```

> 코틀린 1.4 이전에는 기본 메서드를 생성하기 위해 해당 메서드에 `@JvmDefault` 어노테이션을 사용할 수 있었습니다.
> 1.4 이상에서 `-Xjvm-default=all`로 컴파일하는 것은 일반적으로 인터페이스의 모든 비추상 메서드에 `@JvmDefault` 어노테이션을 붙이고 `-Xjvm-default=enable`로 컴파일한 것과 동일하게 작동합니다. 하지만 동작이 다른 경우가 있습니다.
> 코틀린 1.4의 기본 메서드 생성 변경에 대한 자세한 정보는 코틀린 블로그의 [이 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)에서 확인할 수 있습니다.
>
{style="note"}

### 기본 메서드를 위한 호환성 모드

`-Xjvm-default=all` 옵션 없이 컴파일된 코틀린 인터페이스를 사용하는 클라이언트가 있는 경우, 해당 클라이언트는 이 옵션으로 컴파일된 코드와 바이너리 호환성(binary-incompatible)이 없을 수 있습니다. 이러한 클라이언트와의 호환성 손상을 피하려면 `-Xjvm-default=all` 모드를 사용하고 인터페이스에 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/) 어노테이션을 표시하세요.
이를 통해 공개 API의 모든 인터페이스에 이 어노테이션을 한 번 추가할 수 있으며, 새로운 비공개 코드에는 어노테이션을 사용할 필요가 없습니다.

> 코틀린 1.6.20부터는 기본 모드(`-Xjvm-default=disable` 컴파일러 옵션)로 모듈을 컴파일할 때 `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 모드로 컴파일된 모듈에 대해 컴파일할 수 있습니다.
>
{style="note"}

호환성 모드에 대해 자세히 알아보기:

#### disable {initial-collapse-state="collapsed" collapsible="true"}

기본 동작. JVM 기본 메서드를 생성하지 않고 `@JvmDefault` 어노테이션 사용을 금지합니다.

#### all {initial-collapse-state="collapsed" collapsible="true"}

모듈 내에 본문(body)이 있는 모든 인터페이스 선언에 대해 JVM 기본 메서드를 생성합니다. `disable` 모드에서 기본적으로 생성되는 본문이 있는 인터페이스 선언에 대해 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 스텁(stub)을 생성하지 않습니다.

인터페이스가 `disable` 모드로 컴파일된 인터페이스에서 본문이 있는 메서드를 상속하고 이를 오버라이드하지 않으면, 해당 메서드에 대해 `DefaultImpls` 스텁이 생성됩니다.

일부 클라이언트 코드가 `DefaultImpls` 클래스의 존재에 의존하는 경우 __바이너리 호환성을 깨뜨립니다__.

> 인터페이스 위임(delegation)이 사용되는 경우, 모든 인터페이스 메서드가 위임됩니다. 유일한 예외는 사용 중단(deprecated)된 `@JvmDefault` 어노테이션이 붙은 메서드입니다.
>
{style="note"}

#### all-compatibility {initial-collapse-state="collapsed" collapsible="true"}

`all` 모드 외에도 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 클래스에 호환성 스텁을 생성합니다. 호환성 스텁은 라이브러리 및 런타임 개발자가 이전 라이브러리 버전을 대상으로 컴파일된 기존 클라이언트를 위한 역방향 바이너리 호환성을 유지하는 데 유용할 수 있습니다.
`all` 및 `all-compatibility` 모드는 라이브러리 재컴파일 후 클라이언트가 사용할 라이브러리 ABI 표면을 변경합니다.
이러한 의미에서 클라이언트는 이전 라이브러리 버전과 호환되지 않을 수 있습니다.
이는 일반적으로 적절한 라이브러리 버전 관리, 예를 들어 SemVer에서 주(major) 버전 증가가 필요하다는 것을 의미합니다.

컴파일러는 `DefaultImpls`의 모든 멤버를 `@Deprecated` 어노테이션과 함께 생성합니다: 이 멤버는 호환성 목적으로만 생성되므로 자바 코드에서 사용해서는 안 됩니다.

`all` 또는 `all-compatibility` 모드로 컴파일된 코틀린 인터페이스에서 상속하는 경우, `DefaultImpls` 호환성 스텁은 표준 JVM 런타임 해결(resolution) 시맨틱(semantics)으로 인터페이스의 기본 메서드를 호출합니다.

`disable` 모드에서 특수화된 시그니처를 가진 추가적인 암시적(implicit) 메서드가 생성되었던 제네릭 인터페이스를 상속하는 클래스에 대해 추가 호환성 검사를 수행합니다:
`disable` 모드와 달리, 해당 메서드를 명시적으로 오버라이드하지 않고 클래스에 `@JvmDefaultWithoutCompatibility`를 어노테이션하지 않으면 컴파일러가 오류를 보고합니다 ([자세한 내용은 이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-39603) 참조).

## 가시성

코틀린 가시성 변경자(modifier)는 자바에 다음과 같이 매핑됩니다:

* `private` 멤버는 `private` 멤버로 컴파일됩니다.
* `private` 최상위(top-level) 선언은 `private` 최상위 선언으로 컴파일됩니다. 클래스 내부에서 접근하는 경우, 패키지-private 접근자(accessor)도 포함됩니다.
* `protected`는 `protected`로 유지됩니다 (자바는 동일 패키지 내 다른 클래스에서 protected 멤버에 접근하는 것을 허용하지만 코틀린은 그렇지 않으므로, 자바 클래스는 코드에 더 넓은 접근 권한을 가집니다).
* `internal` 선언은 자바에서 `public`이 됩니다. `internal` 클래스의 멤버는 자바에서 의도치 않게 사용하기 어렵게 하고, 코틀린 규칙에 따라 서로 볼 수 없는 동일한 시그니처를 가진 멤버에 대한 오버로딩을 허용하기 위해 이름 맹글링(name mangling)을 거칩니다.
* `public`은 `public`으로 유지됩니다.

## KClass

때로는 `KClass` 타입의 파라미터를 가진 코틀린 메서드를 호출해야 할 수 있습니다.
`Class`에서 `KClass`로의 자동 변환은 없으므로, `Class<T>.kotlin` 확장 프로퍼티와 동일한 것을 호출하여 수동으로 변환해야 합니다:

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## @JvmName으로 시그니처 충돌 처리

때로는 코틀린에 이름 있는 함수가 있지만, 바이트코드에서는 다른 JVM 이름이 필요한 경우가 있습니다.
가장 두드러진 예시는 *타입 소거(type erasure)* 때문에 발생합니다:

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

이 두 함수는 JVM 시그니처가 `filterValid(Ljava/util/List;)Ljava/util/List;`로 동일하기 때문에 나란히 정의될 수 없습니다.
코틀린에서 이들이 동일한 이름을 가지도록 하려면, 둘 중 하나(또는 둘 다)에 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 어노테이션을 붙이고 인수로 다른 이름을 지정할 수 있습니다:

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

코틀린에서는 `filterValid`라는 동일한 이름으로 접근할 수 있지만, 자바에서는 `filterValid`와 `filterValidInt`가 됩니다.

프로퍼티 `x`와 함수 `getX()`를 함께 사용해야 할 때도 동일한 방법이 적용됩니다:

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

명시적으로 구현된 게터와 세터가 없는 프로퍼티에 대해 생성된 접근자 메서드의 이름을 변경하려면 `@get:JvmName`과 `@set:JvmName`을 사용할 수 있습니다:

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 오버로드 생성

일반적으로 기본 파라미터 값을 가진 코틀린 함수를 작성하면, 자바에서는 모든 파라미터가 포함된 전체 시그니처로만 표시됩니다.
자바 호출자에게 여러 오버로드(overload)를 노출하고 싶다면, [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 어노테이션을 사용할 수 있습니다.

이 어노테이션은 생성자, 정적 메서드 등에도 작동합니다. 추상 메서드(인터페이스에 정의된 메서드 포함)에는 사용할 수 없습니다.

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

기본값을 가진 모든 파라미터에 대해, 이 파라미터와 파라미터 목록에서 그 오른쪽에 있는 모든 파라미터가 제거된 추가적인 오버로드 하나를 생성합니다. 이 예시에서는 다음이 생성됩니다:

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

주의할 점은, [보조 생성자(Secondary constructors)](classes.md#secondary-constructors)에 설명된 바와 같이, 클래스의 모든 생성자 파라미터에 기본값이 있는 경우, 인수가 없는 public 생성자가 생성됩니다. 이는 `@JvmOverloads` 어노테이션이 지정되지 않은 경우에도 작동합니다.

## 검사 예외

코틀린에는 검사 예외(checked exceptions)가 없습니다.
따라서 일반적으로 코틀린 함수의 자바 시그니처는 발생시키는 예외를 선언하지 않습니다.
그러므로 코틀린에 다음과 같은 함수가 있는 경우:

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

그리고 자바에서 이를 호출하고 예외를 잡으려 한다면:

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // 오류: writeToFile()은 throws 목록에 IOException을 선언하지 않음
    // ...
}
```

`writeToFile()`가 `IOException`을 선언하지 않기 때문에 자바 컴파일러로부터 오류 메시지를 받게 됩니다.
이 문제를 해결하려면 코틀린에서 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html) 어노테이션을 사용하세요.

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## Null-안전성

자바에서 코틀린 함수를 호출할 때, 누구도 `null`을 null 불허(non-nullable) 파라미터로 전달하는 것을 막지 못합니다.
그렇기 때문에 코틀린은 null 불허 값을 기대하는 모든 public 함수에 대해 런타임 검사(runtime checks)를 생성합니다.
이러한 방식으로 자바 코드에서 즉시 `NullPointerException`이 발생합니다.

## 분산 제네릭

코틀린 클래스가 [선언-위치 분산(declaration-site variance)](generics.md#declaration-site-variance)을 사용하는 경우, 자바 코드에서 해당 사용법이 보이는 방식에는 두 가지 옵션이 있습니다. 예를 들어, 다음과 같은 클래스와 이를 사용하는 두 함수가 있다고 가정해 보세요:

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

이 함수들을 자바로 번역하는 단순한 방법은 다음과 같습니다:

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

문제는 코틀린에서는 `unboxBase(boxDerived(Derived()))`라고 작성할 수 있지만, 자바에서는 `Box` 클래스가 파라미터 `T`에 대해 *불변(invariant)*이며 `Box<Derived>`가 `Box<Base>`의 하위 타입이 아니기 때문에 불가능하다는 점입니다.
자바에서 이를 작동시키려면 `unboxBase`를 다음과 같이 정의해야 합니다:

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

이 선언은 자바의 *와일드카드 타입(wildcards types)* (`? extends Base`)을 사용하여 사용-위치 분산(use-site variance)을 통해 선언-위치 분산을 에뮬레이트합니다. 이는 자바가 지원하는 유일한 방법이기 때문입니다.

코틀린 API가 자바에서 작동하도록 하기 위해 컴파일러는 공변(covariant)하게 정의된 `Box`에 대해 `Box<Super>`를 `Box<? extends Super>`로 (또는 반공변(contravariant)하게 정의된 `Foo`에 대해 `Foo<? super Bar>`로) *파라미터로* 나타날 때 생성합니다.
반환 값인 경우, 와일드카드는 생성되지 않습니다. 그렇지 않으면 자바 클라이언트가 이를 처리해야 할 것이고 (이는 일반적인 자바 코딩 스타일과 다릅니다).
따라서 우리 예시의 함수들은 실제로 다음과 같이 번역됩니다:

```java

// 반환 타입 - 와일드카드 없음
Box<Derived> boxDerived(Derived value) { ... }
 
// 파라미터 - 와일드카드 있음
Base unboxBase(Box<? extends Base> box) { ... }
```

> 인수 타입이 final인 경우, 일반적으로 와일드카드를 생성할 필요가 없으므로 `Box<String>`은 어떤 위치에 있든 항상 `Box<String>`입니다.
>
{style="note"}

기본적으로 와일드카드가 생성되지 않는 곳에서 와일드카드가 필요한 경우, `@JvmWildcard` 어노테이션을 사용하세요:

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

반대의 경우, 와일드카드가 생성되는 곳에서 와일드카드가 필요 없는 경우, `@JvmSuppressWildcards`를 사용하세요:

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards`는 개별 타입 인수에만 사용될 수 있는 것이 아니라, 함수나 클래스와 같은 전체 선언에도 사용될 수 있으며, 이 경우 해당 선언 내의 모든 와일드카드가 억제됩니다.
>
{style="note"}

### Nothing 타입의 번역
 
[`Nothing`](exceptions.md#the-nothing-type) 타입은 자바에서 자연스러운 대응 관계가 없기 때문에 특별합니다. 실제로 `java.lang.Void`를 포함한 모든 자바 참조 타입은 `null`을 값으로 허용하지만, `Nothing`은 심지어 `null`도 허용하지 않습니다. 따라서 이 타입은 자바 환경에서 정확하게 표현될 수 없습니다.
이것이 코틀린이 `Nothing` 타입의 인수가 사용되는 곳에 로(raw) 타입을 생성하는 이유입니다:

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }