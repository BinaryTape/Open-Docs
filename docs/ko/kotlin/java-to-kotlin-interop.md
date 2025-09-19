[//]: # (title: Java에서 Kotlin 호출하기)

Kotlin 코드는 Java에서 쉽게 호출될 수 있습니다.
예를 들어, Kotlin 클래스의 인스턴스를 Java 메서드에서 원활하게 생성하고 조작할 수 있습니다.
하지만 Kotlin 코드를 Java에 통합할 때 주의해야 할 Java와 Kotlin 간의 특정 차이점이 있습니다.
이 페이지에서는 Kotlin 코드를 Java 클라이언트와 상호 운용(interop)하도록 맞춤화하는 방법을 설명합니다.

## 프로퍼티(Properties)

Kotlin 프로퍼티(property)는 다음 Java 요소로 컴파일됩니다:

*   게터(getter) 메서드. `get` 접두사를 앞에 추가하여 이름이 계산됩니다.
*   세터(setter) 메서드. `set` 접두사를 앞에 추가하여 이름이 계산됩니다 (`var` 프로퍼티에만 해당).
*   프로퍼티 이름과 동일한 이름의 private 필드 (백킹 필드(backing field)를 가진 프로퍼티에만 해당).

예를 들어, `var firstName: String`은 다음 Java 선언으로 컴파일됩니다:

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
이 규칙은 `Boolean` 타입뿐만 아니라 모든 타입의 프로퍼티에 적용됩니다.

## 패키지 수준 함수

확장 함수를 포함하여 `org.example` 패키지 내 `app.kt` 파일에 선언된 모든 함수와 프로퍼티는 `org.example.AppKt`라는 Java 클래스의 정적(static) 메서드로 컴파일됩니다.

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

생성된 Java 클래스에 사용자 지정 이름을 설정하려면 `@JvmName` 어노테이션(annotation)을 사용합니다:

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

동일한 생성된 Java 클래스 이름(동일한 패키지 및 동일한 이름 또는 동일한
[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 어노테이션)을 가진 여러 파일이 있는 것은 일반적으로 오류입니다.
하지만 컴파일러는 지정된 이름을 가지고 해당 이름을 가진 모든 파일의 모든 선언을 포함하는 단일 Java 파사드(facade) 클래스를 생성할 수 있습니다.
이러한 파사드 생성을 활성화하려면 모든 해당 파일에 [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html)
어노테이션을 사용합니다.

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

Kotlin 프로퍼티를 Java에서 필드(field)로 노출해야 하는 경우, [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 어노테이션으로 주석을 달아줍니다.
필드는 기본 프로퍼티와 동일한 가시성(visibility)을 가집니다. 다음 경우 프로퍼티에 `@JvmField` 어노테이션을 달 수 있습니다:
*   백킹 필드를 가지고 있는 경우
*   private이 아닌 경우
*   `open`, `override` 또는 `const` 한정자(modifier)를 가지고 있지 않은 경우
*   위임된 프로퍼티(delegated property)가 아닌 경우

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

이름 있는 객체(named object) 또는 동반 객체(companion object)에 선언된 Kotlin 프로퍼티는 해당 이름 있는 객체 또는 동반 객체를 포함하는 클래스에 정적(static) 백킹 필드를 가집니다.

일반적으로 이러한 필드는 private이지만, 다음 방법 중 하나로 노출될 수 있습니다:

 - [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 어노테이션
 - `lateinit` 한정자
 - `const` 한정자
 
이러한 프로퍼티에 `@JvmField`를 어노테이션으로 추가하면 프로퍼티 자체와 동일한 가시성을 가진 정적 필드가 됩니다.

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

`const`로 선언된 프로퍼티(클래스 및 최상위(top level) 모두)는 Java에서 정적 필드로 전환됩니다:

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

Java에서는:

```java

int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## 정적 메서드

위에서 언급했듯이, Kotlin은 패키지 수준 함수를 정적 메서드로 나타냅니다.
Kotlin은 또한 이름 있는 객체 또는 동반 객체에 정의된 함수를 [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html)으로 어노테이션하면 해당 함수에 대한 정적 메서드를 생성할 수 있습니다.
이 어노테이션을 사용하면 컴파일러는 객체의 포함 클래스(enclosing class)에 정적 메서드를 생성하고 객체 자체에 인스턴스 메서드를 생성합니다. 예를 들어:

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

이제 `callStatic()`은 Java에서 정적이지만 `callNonStatic()`은 그렇지 않습니다:

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

마찬가지로, 이름 있는 객체에 대해서도:

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

Java에서는:

```java

Obj.callStatic(); // works fine
Obj.callNonStatic(); // error
Obj.INSTANCE.callNonStatic(); // works, a call through the singleton instance
Obj.INSTANCE.callStatic(); // works too
```

Kotlin 1.3부터는 `@JvmStatic`이 인터페이스의 동반 객체에 정의된 함수에도 적용됩니다.
이러한 함수는 인터페이스의 정적 메서드로 컴파일됩니다. 인터페이스의 정적 메서드는 Java 1.8에 도입되었으므로 해당 타겟(target)을 사용하는지 확인하십시오.

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

`@JvmStatic` 어노테이션을 객체 또는 동반 객체의 프로퍼티에 적용하여 해당 게터 및 세터 메서드를 해당 객체 또는 동반 객체를 포함하는 클래스의 정적 멤버로 만들 수도 있습니다.

## 인터페이스의 기본 메서드

JVM을 타겟팅(target)할 때, Kotlin은 [다르게 구성되지 않는 한](#compatibility-modes-for-default-methods) 인터페이스에 선언된 함수를 [기본 메서드(default methods)](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)로 컴파일합니다.
이들은 Java 클래스가 재구현 없이 직접 상속할 수 있는 인터페이스의 구체적인(concrete) 메서드입니다.

다음은 기본 메서드를 가진 Kotlin 인터페이스의 예시입니다:

```kotlin
interface Robot {
    fun move() { println("~walking~") }  // will be default in the Java interface
    fun speak(): Unit
}
```

기본 구현은 인터페이스를 구현하는 Java 클래스에서 사용할 수 있습니다.

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

인터페이스의 구현은 기본 메서드를 오버라이드(override)할 수 있습니다.

```java
//Java
public class BB8 implements Robot {
    //own implementation of the default method
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

### 기본 메서드를 위한 호환성 모드

Kotlin은 인터페이스의 함수가 JVM 기본 메서드로 컴파일되는 방식을 제어하기 위한 세 가지 모드를 제공합니다.
이 모드는 컴파일러가 호환성 브릿지(compatibility bridge) 및 `DefaultImpls` 클래스에 정적 메서드를 생성하는지 여부를 결정합니다.

`-jvm-default` 컴파일러 옵션을 사용하여 이 동작을 제어할 수 있습니다:

> `-jvm-default` 컴파일러 옵션은 더 이상 사용되지 않는(deprecated) `-Xjvm-default` 옵션을 대체합니다.
>
{style="note"}

호환성 모드에 대해 자세히 알아보세요:

#### enable {initial-collapse-state="collapsed" collapsible="true"}

기본 동작.
인터페이스에 기본 구현을 생성하고 호환성 브릿지 및 `DefaultImpls` 클래스를 포함합니다.
이 모드는 이전 컴파일된 Kotlin 코드와의 호환성을 유지합니다.

#### no-compatibility {initial-collapse-state="collapsed" collapsible="true"}

인터페이스에만 기본 구현을 생성합니다.
호환성 브릿지와 `DefaultImpls` 클래스를 건너뜁니다.
`DefaultImpls` 클래스에 의존하는 코드와 상호 작용하지 않는 새로운 코드베이스에 이 모드를 사용하십시오.
이는 이전 Kotlin 코드와의 이진 호환성(binary compatibility)을 깨뜨릴 수 있습니다.

> 인터페이스 위임(delegation)이 사용되는 경우, 모든 인터페이스 메서드가 위임됩니다.
>
{style="note"}

#### disable {initial-collapse-state="collapsed" collapsible="true"}

인터페이스의 기본 구현을 비활성화합니다.
호환성 브릿지와 `DefaultImpls` 클래스만 생성됩니다.

## 가시성(Visibility)

Kotlin 가시성 한정자(visibility modifier)는 다음과 같이 Java에 매핑(map)됩니다:

*   `private` 멤버는 `private` 멤버로 컴파일됩니다.
*   `private` 최상위 선언은 `private` 최상위 선언으로 컴파일됩니다. 클래스 내부에서 접근하는 경우 패키지-private 접근자(accessor)도 포함됩니다.
*   `protected`는 `protected`로 유지됩니다. (Java는 동일한 패키지의 다른 클래스에서 protected 멤버에 접근하는 것을 허용하지만 Kotlin은 그렇지 않으므로, Java 클래스는 코드에 더 넓은 접근 권한을 가집니다.)
*   `internal` 선언은 Java에서 `public`이 됩니다. `internal` 클래스의 멤버는 이름 맹글링(name mangling)을 거쳐 Java에서 실수로 사용하는 것을 더 어렵게 하고, Kotlin 규칙에 따라 서로 보이지 않는 동일한 시그니처(signature)를 가진 멤버에 대한 오버로딩(overloading)을 허용합니다.
*   `public`은 `public`으로 유지됩니다.

## KClass

때때로 `KClass` 타입의 파라미터(parameter)를 가진 Kotlin 메서드를 호출해야 할 때가 있습니다.
`Class`에서 `KClass`로의 자동 변환은 없으므로, `Class<T>.kotlin` 확장 프로퍼티와 동등한 것을 호출하여 수동으로 수행해야 합니다:

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## @JvmName을 사용한 시그니처 충돌 처리

때때로 Kotlin에 이름 있는 함수가 있지만, 바이트코드(bytecode)에서는 다른 JVM 이름이 필요할 때가 있습니다.
가장 두드러진 예는 *타입 소거(type erasure)* 때문에 발생합니다:

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

이 두 함수는 JVM 시그니처가 `filterValid(Ljava/util/List;)Ljava/util/List;`로 동일하기 때문에 나란히 정의될 수 없습니다.
Kotlin에서 이들을 동일한 이름으로 유지하려면, 둘 중 하나(또는 둘 다)에
[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 어노테이션을 달고 다른 이름을
인자(argument)로 지정할 수 있습니다:

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

Kotlin에서는 동일한 이름 `filterValid`로 접근할 수 있지만, Java에서는 `filterValid`와 `filterValidInt`입니다.

동일한 방법이 프로퍼티 `x`와 함수 `getX()`를 함께 사용해야 할 때도 적용됩니다:

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

명시적으로 구현된 게터 및 세터가 없는 프로퍼티에 대해 생성된 접근자 메서드의 이름을 변경하려면 `@get:JvmName` 및 `@set:JvmName`을 사용할 수 있습니다:

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 오버로드(Overloads) 생성

일반적으로 기본 파라미터 값을 가진 Kotlin 함수를 작성하면, Java에서는 모든 파라미터가 있는 완전한 시그니처로만 표시됩니다.
Java 호출자에게 여러 오버로드(overload)를 노출하려면 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 어노테이션을 사용할 수 있습니다.

이 어노테이션은 생성자(constructor), 정적 메서드 등에도 작동합니다. 인터페이스에 정의된 메서드를 포함하여 추상 메서드(abstract method)에는 사용할 수 없습니다.

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

기본 값을 가진 모든 파라미터에 대해, 이 파라미터와 파라미터 목록에서 그 오른쪽에 있는 모든 파라미터가 제거된 추가 오버로드 하나를 생성합니다. 이 예시에서는 다음이 생성됩니다:

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

[보조 생성자(Secondary constructors)](classes.md#secondary-constructors)에서 설명했듯이, 클래스에 모든 생성자 파라미터에 대한 기본 값이 있는 경우, 인자 없는 public 생성자가 생성됩니다. `@JvmOverloads` 어노테이션이 지정되지 않은 경우에도 작동합니다.

## 체크드 예외

Kotlin에는 체크드 예외(checked exception)가 없습니다.
따라서 일반적으로 Kotlin 함수의 Java 시그니처는 던져진 예외를 선언하지 않습니다.
따라서 Kotlin에 다음과 같은 함수가 있는 경우:

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

그리고 Java에서 이 함수를 호출하여 예외를 잡으려 할 때:

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // error: writeToFile() does not declare IOException in the throws list
    // ...
}
```

`writeToFile()`가 `IOException`을 선언하지 않기 때문에 Java 컴파일러로부터 오류 메시지를 받게 됩니다.
이 문제를 해결하려면 Kotlin에서 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html) 어노테이션을 사용합니다:

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## Null 안정성

Java에서 Kotlin 함수를 호출할 때, `null`을 널 불가능(non-nullable) 파라미터로 전달하는 것을 막을 수 있는 것은 없습니다.
그렇기 때문에 Kotlin은 널이 아닌 값을 예상하는 모든 public 함수에 대해 런타임 검사(runtime check)를 생성합니다.
이러한 방식으로 Java 코드에서 즉시 `NullPointerException`을 얻게 됩니다.

## 분산 제네릭(Variant generics)

Kotlin 클래스가 [선언-위치 분산(declaration-site variance)](generics.md#declaration-site-variance)을 사용하는 경우, Java 코드에서 해당 사용법이 보이는 방식에는 두 가지 옵션이 있습니다. 예를 들어, 다음과 같은 클래스와 이를 사용하는 두 함수가 있다고 가정해 봅시다:

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

이 함수들을 Java로 번역하는 순진한(naive) 방법은 다음과 같습니다:

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

문제는 Kotlin에서는 `unboxBase(boxDerived(Derived()))`를 작성할 수 있지만, Java에서는 `Box` 클래스가 파라미터 `T`에 대해 *불변(invariant)*이며, 따라서 `Box<Derived>`가 `Box<Base>`의 서브타입(subtype)이 아니기 때문에 불가능하다는 것입니다.
Java에서 이를 작동시키려면 `unboxBase`를 다음과 같이 정의해야 합니다:

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

이 선언은 Java가 가진 모든 것이기 때문에, Java의 *와일드카드 타입(wildcards types)* (`? extends Base`)을 사용하여 사용-위치 분산(use-site variance)을 통해 선언-위치 분산을 에뮬레이트(emulate)합니다.

Kotlin API가 Java에서 작동하도록 하려면, 컴파일러는 공변(covariantly)으로 정의된 `Box`에 대해 `Box<Super>`를 `Box<? extends Super>`로 (또는 반공변(contravariantly)으로 정의된 `Foo`에 대해 `Foo<? super Bar>`로) *파라미터로* 나타날 때 생성합니다. 반환 값인 경우 와일드카드는 생성되지 않습니다. 그렇지 않으면 Java 클라이언트가 이를 처리해야 할 것(그리고 이는 일반적인 Java 코딩 스타일과 반대되는 것)이기 때문입니다. 따라서, 예시의 함수들은 실제로 다음과 같이 번역됩니다:

```java

// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

> 인자 타입이 `final`인 경우, 일반적으로 와일드카드를 생성할 이유가 없으므로, 어떤 위치에 있든 `Box<String>`은 항상 `Box<String>`입니다.
>
{style="note"}

기본적으로 와일드카드가 생성되지 않는 곳에서 와일드카드가 필요한 경우, `@JvmWildcard` 어노테이션을 사용합니다:

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

반대의 경우, 와일드카드가 생성되는 곳에서 필요하지 않은 경우, `@JvmSuppressWildcards`를 사용합니다:

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards`는 개별 타입 인자뿐만 아니라 함수나 클래스와 같은 전체 선언에도 사용될 수 있으며, 그 안에 있는 모든 와일드카드가 억제(suppress)됩니다.
>
{style="note"}

### Nothing 타입의 번역
 
[`Nothing`](exceptions.md#the-nothing-type) 타입은 Java에서 자연스러운 대응 관계(counterpart)가 없기 때문에 특별합니다. 실제로 `java.lang.Void`를 포함한 모든 Java 참조 타입(reference type)은 `null`을 값으로 허용하지만, `Nothing`은 그마저도 허용하지 않습니다. 따라서 이 타입은 Java 세계에서 정확하게 표현될 수 없습니다. 이것이 Kotlin이 `Nothing` 타입의 인자가 사용될 때 원시 타입(raw type)을 생성하는 이유입니다:

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```

## 인라인 값 클래스(Inline value classes)

<primary-label ref="experimental-general"/>

Java 코드가 Kotlin의 [인라인 값 클래스(inline value classes)](inline-classes.md)와 원활하게 작동하기를 원한다면,
[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/) 어노테이션 또는 `-Xjvm-expose-boxed` 컴파일러 옵션을 사용할 수 있습니다.
이러한 접근 방식은 Kotlin이 Java 상호 운용성을 위한 필요한 박스형 표현(boxed representations)을 생성하도록 보장합니다.

기본적으로 Kotlin은 인라인 값 클래스를 **언박스형 표현(unboxed representations)**을 사용하도록 컴파일하며, 이는 종종 Java에서 접근할 수 없습니다.
예를 들어, Java에서 `MyInt` 클래스의 생성자를 호출할 수 없습니다:

```kotlin
@JvmInline
value class MyInt(val value: Int)
```

따라서 다음 Java 코드는 실패합니다:

```java
MyInt input = new MyInt(5);
```

`@JvmExposeBoxed` 어노테이션을 사용하여 Kotlin이 Java에서 직접 호출할 수 있는 public 생성자를 생성하도록 할 수 있습니다.
Java에 노출되는 것을 세밀하게 제어하기 위해 다음 수준에서 어노테이션을 적용할 수 있습니다:

*   클래스
*   생성자
*   함수

코드에서 `@JvmExposeBoxed` 어노테이션을 사용하기 전에 `@OptIn(ExperimentalStdlibApi::class)`를 사용하여 옵트인(opt in)해야 합니다.
예를 들어:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

이러한 어노테이션을 사용하면 Kotlin은 `MyInt` 클래스에 대한 Java에서 접근 가능한 생성자를 생성하고, 값 클래스의 박스형 형식을 사용하는 확장 함수에 대한 변형(variant)을 생성합니다.
따라서 다음 Java 코드는 성공적으로 실행됩니다:

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

이 동작을 모듈 내의 모든 인라인 값 클래스 및 이를 사용하는 함수에 적용하려면 `-Xjvm-expose-boxed` 옵션으로 컴파일하십시오.
이 옵션으로 컴파일하는 것은 모듈의 모든 선언에 `@JvmExposeBoxed` 어노테이션이 있는 것과 동일한 효과를 가집니다.

### 상속된 함수

`@JvmExposeBoxed` 어노테이션은 상속된 함수에 대해 박스형 표현을 자동으로 생성하지 않습니다.
 
상속된 함수에 필요한 표현을 생성하려면 구현 또는 확장 클래스에서 해당 함수를 오버라이드하십시오:
 
```kotlin
interface IdTransformer {
    fun transformId(rawId: UInt): UInt = rawId
}

// Doesn't generate a boxed representation for the transformId() function
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
class LightweightTransformer : IdTransformer

// Generates a boxed representation for the transformId() function
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
class DefaultTransformer : IdTransformer {
    override fun transformId(rawId: UInt): UInt = super.transformId(rawId)
}
```

Kotlin에서 상속이 작동하는 방식과 `super` 키워드를 사용하여 상위 클래스(superclass) 구현을 호출하는 방법을 알아보려면 [상속(Inheritance)](inheritance.md#calling-the-superclass-implementation)을 참조하십시오.