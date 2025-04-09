---
title: 어노테이션
---
어노테이션은 코드에 메타데이터를 첨부하는 수단입니다. 어노테이션을 선언하려면 클래스 앞에 `annotation` 변경자를 넣습니다.

```kotlin
annotation class Fancy
```

메타 어노테이션으로 어노테이션 클래스를 어노테이팅하여 어노테이션의 추가 속성을 지정할 수 있습니다.

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)은 (클래스, 함수, 프로퍼티, 표현식 등) 어노테이션으로 어노테이팅할 수 있는 요소의 종류를 지정합니다.
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html)은
    어노테이션이 컴파일된 클래스 파일에 저장되는지 여부와 런타임 시 리플렉션을 통해 보이는지 여부를 지정합니다 (기본적으로 둘 다 true).
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html)은 단일 요소에 동일한 어노테이션을
    여러 번 사용할 수 있도록 허용합니다.
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html)는
    어노테이션이 공개 API의 일부이며 생성된 API 문서에 표시되는 클래스 또는 메서드 시그니처에 포함되어야 함을 지정합니다.

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER, 
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 사용법

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

클래스의 주 생성자에 어노테이팅해야 하는 경우 생성자 선언에 `constructor` 키워드를 추가하고 그 앞에 어노테이션을 추가해야 합니다.

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

프로퍼티 접근자에 어노테이팅할 수도 있습니다.

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 생성자

어노테이션은 파라미터를 사용하는 생성자를 가질 수 있습니다.

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

허용되는 파라미터 유형은 다음과 같습니다.

 * Java 기본 유형 (Int, Long 등)에 해당하는 유형
 * 문자열
 * 클래스 (`Foo::class`)
 * Enum
 * 기타 어노테이션
 * 위에 나열된 유형의 배열

JVM은 `null`을 어노테이션 속성 값으로 저장하는 것을 지원하지 않기 때문에 어노테이션 파라미터는 nullable 유형을 가질 수 없습니다.

어노테이션이 다른 어노테이션의 파라미터로 사용되는 경우 해당 이름에는 `@` 문자가 접두사로 붙지 않습니다.

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

클래스를 어노테이션의 인수로 지정해야 하는 경우 Kotlin 클래스
([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html))를 사용하십시오. Kotlin 컴파일러는
자동으로 Java 클래스로 변환하므로 Java 코드는 어노테이션과 인수에 정상적으로 액세스할 수 있습니다.

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 인스턴스화

Java에서 어노테이션 유형은 인터페이스의 한 형태이므로 이를 구현하고 인스턴스를 사용할 수 있습니다.
이 메커니즘에 대한 대안으로 Kotlin에서는 임의의 코드에서 어노테이션 클래스의 생성자를 호출하고 결과 인스턴스를 유사하게 사용할 수 있습니다.

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker): Unit = TODO()

fun main(args: Array<String>) {
    if (args.isNotEmpty())
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

어노테이션 클래스의 인스턴스화에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation)에서 확인하십시오.

## 람다

어노테이션은 람다에서도 사용할 수 있습니다. 람다는 람다 본문이 생성되는 `invoke()` 메서드에 적용됩니다.
이는 [Quasar](https://docs.paralleluniverse.co/quasar/)와 같은 프레임워크에 유용합니다.
Quasar는 동시성 제어를 위해 어노테이션을 사용합니다.

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 어노테이션 사용 위치 대상

프로퍼티 또는 주 생성자 파라미터를 어노테이팅할 때 해당 Kotlin 요소에서 생성된 여러 Java 요소가 있으므로 생성된 Java 바이트코드에서 어노테이션을 배치할 수 있는 위치가 여러 곳일 수 있습니다. 어노테이션을 생성하는 정확한 방법을 지정하려면 다음 구문을 사용하십시오.

```kotlin
class Example(@field:Ann val foo,    // Java 필드에 어노테이팅
              @get:Ann val bar,      // Java getter에 어노테이팅
              @param:Ann val quux)   // Java 생성자 파라미터에 어노테이팅
```

동일한 구문을 사용하여 전체 파일에 어노테이팅할 수 있습니다. 이렇게 하려면 `file` 대상이 있는 어노테이션을
파일의 최상위 수준에 패키지 지시문 앞이나 파일이 기본 패키지에 있는 경우 모든 import문 앞에 넣으십시오.

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

동일한 대상이 있는 여러 어노테이션이 있는 경우 대상 뒤에 대괄호를 추가하고 대괄호 안에 모든 어노테이션을 넣어 대상을 반복하는 것을 피할 수 있습니다.

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

지원되는 사용 위치 대상의 전체 목록은 다음과 같습니다.

  * `file`
  * `property` (이 대상이 있는 어노테이션은 Java에 표시되지 않습니다.)
  * `field`
  * `get` (프로퍼티 getter)
  * `set` (프로퍼티 setter)
  * `receiver` (확장 함수 또는 프로퍼티의 receiver 파라미터)
  * `param` (생성자 파라미터)
  * `setparam` (프로퍼티 setter 파라미터)
  * `delegate` (위임된 프로퍼티에 대한 delegate 인스턴스를 저장하는 필드)

확장 함수의 receiver 파라미터를 어노테이팅하려면 다음 구문을 사용하십시오.

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

사용 위치 대상을 지정하지 않으면 사용되는 어노테이션의 `@Target` 어노테이션에 따라 대상이 선택됩니다. 적용 가능한 대상이 여러 개인 경우 다음 목록에서 첫 번째 적용 가능한 대상이 사용됩니다.

  * `param`
  * `property`
  * `field`

## Java 어노테이션

Java 어노테이션은 Kotlin과 100% 호환됩니다.

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // 프로퍼티 getter에 @Rule 어노테이션 적용
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

Java로 작성된 어노테이션의 파라미터 순서가 정의되어 있지 않으므로 인수를 전달하는 데 일반 함수 호출 구문을 사용할 수 없습니다. 대신 이름이 지정된 인수 구문을 사용해야 합니다.

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

```kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```

Java와 마찬가지로 특별한 경우는 `value` 파라미터입니다. 값은 명시적 이름 없이 지정할 수 있습니다.

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

```kotlin
// Kotlin
@AnnWithValue("abc") class C
```

### 어노테이션 파라미터로 배열 사용

Java에서 `value` 인수가 배열 유형인 경우 Kotlin에서 `vararg` 파라미터가 됩니다.

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

```kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```

배열 유형인 다른 인수의 경우 배열 리터럴 구문 또는
`arrayOf(...)`를 사용해야 합니다.

``` java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```

```kotlin
@AnnWithArrayMethod(names = ["abc", "foo", "bar"]) 
class C
```

### 어노테이션 인스턴스의 프로퍼티 액세스

어노테이션 인스턴스의 값은 Kotlin 코드에 프로퍼티로 노출됩니다.

``` java
// Java
public @interface Ann {
    int value();
}
```

```kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```

### JVM 1.8+ 어노테이션 대상 생성 기능 비활성화

Kotlin 어노테이션에 Kotlin 대상 중 `TYPE`이 있는 경우 어노테이션은 Java 어노테이션 대상 목록에서 `java.lang.annotation.ElementType.TYPE_USE`에 매핑됩니다. 이는 `TYPE_PARAMETER` Kotlin 대상이
`java.lang.annotation.ElementType.TYPE_PARAMETER` Java 대상에 매핑되는 방식과 같습니다. 이는 API 수준이 26 미만인 Android 클라이언트에 문제가 됩니다. 해당 클라이언트는 API에 이러한 대상이 없기 때문입니다.

`TYPE_USE` 및 `TYPE_PARAMETER` 어노테이션 대상 생성을 피하려면 새 컴파일러 인수 `-Xno-new-java-annotation-targets`를 사용하십시오.

## 반복 가능한 어노테이션

[Java에서와 같이](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html), Kotlin에는 반복 가능한 어노테이션이 있으며
단일 코드 요소에 여러 번 적용할 수 있습니다. 어노테이션을 반복 가능하게 만들려면 선언을
[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)
메타 어노테이션으로 표시하십시오. 이렇게 하면 Kotlin과 Java 모두에서 반복 가능해집니다. Java 반복 가능한 어노테이션도
Kotlin 측에서 지원됩니다.

Java에서 사용되는 체계와의 주요 차이점은 Kotlin 컴파일러가
사전 정의된 이름으로 자동 생성하는 _포함 어노테이션_이 없다는 것입니다. 아래 예제의 어노테이션의 경우 컴파일러는 포함
어노테이션 `@Tag.Container`를 생성합니다.

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 컴파일러는 @Tag.Container 포함 어노테이션을 생성합니다.
```

[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 메타 어노테이션을 적용하고
명시적으로 선언된 포함 어노테이션 클래스를 인수로 전달하여 포함 어노테이션에 대한 사용자 지정 이름을 설정할 수 있습니다.

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

리플렉션을 통해 Kotlin 또는 Java 반복 가능한 어노테이션을 추출하려면 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)
함수를 사용하십시오.

Kotlin 반복 가능한 어노테이션에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations)에서 확인하십시오.