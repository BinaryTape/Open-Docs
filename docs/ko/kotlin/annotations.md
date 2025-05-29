[//]: # (title: 애너테이션)

애너테이션은 코드에 메타데이터를 첨부하는 수단입니다. 애너테이션을 선언하려면 클래스 앞에 `annotation` 한정자를 붙입니다:

```kotlin
annotation class Fancy
```

애너테이션의 추가 속성은 메타 애너테이션으로 애너테이션 클래스를 애너테이트함으로써 지정할 수 있습니다:

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)은 애너테이션으로 애너테이트될 수 있는 요소의 종류(클래스, 함수, 프로퍼티, 표현식 등)를 지정합니다.
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html)은 애너테이션이 컴파일된 클래스 파일에 저장되는지, 그리고 런타임에 리플렉션을 통해 볼 수 있는지 여부를 지정합니다(기본적으로 둘 다 true).
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html)은 단일 요소에 동일한 애너테이션을 여러 번 사용할 수 있도록 합니다.
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html)는 애너테이션이 공개 API의 일부이며 생성된 API 문서에 표시되는 클래스 또는 메서드 시그니처에 포함되어야 함을 지정합니다.

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

클래스의 주 생성자를 애너테이트해야 하는 경우, 생성자 선언에 `constructor` 키워드를 추가하고 그 앞에 애너테이션을 붙여야 합니다:

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

프로퍼티 접근자도 애너테이트할 수 있습니다:

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 생성자

애너테이션은 파라미터를 받는 생성자를 가질 수 있습니다.

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

허용되는 파라미터 타입은 다음과 같습니다:

 * 자바 기본 타입(Int, Long 등)에 해당하는 타입
 * 문자열
 * 클래스 (`Foo::class`)
 * 열거형
 * 다른 애너테이션
 * 위에 나열된 타입의 배열

애너테이션 파라미터는 널 허용 타입(nullable types)을 가질 수 없습니다. 이는 JVM이 애너테이션 속성의 값으로 `null`을 저장하는 것을 지원하지 않기 때문입니다.

애너테이션이 다른 애너테이션의 파라미터로 사용되는 경우, 이름에 `@` 문자가 붙지 않습니다:

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

애너테이션의 인자로 클래스를 지정해야 하는 경우, Kotlin 클래스([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html))를 사용하십시오. Kotlin 컴파일러는 이를 자동으로 자바 클래스로 변환하여 자바 코드가 애너테이션과 인자에 정상적으로 접근할 수 있도록 합니다.

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 인스턴스화

자바에서 애너테이션 타입은 인터페이스의 한 형태이므로, 이를 구현하고 인스턴스를 사용할 수 있습니다. 이 메커니즘의 대안으로, 코틀린은 임의의 코드에서 애너테이션 클래스의 생성자를 호출하고 그 결과로 생성된 인스턴스를 유사하게 사용할 수 있도록 합니다.

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

애너테이션 클래스의 인스턴스화에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)에서 확인할 수 있습니다.

## 람다

애너테이션은 람다에서도 사용할 수 있습니다. 람다의 본문이 생성되는 `invoke()` 메서드에 적용됩니다. 이는 동시성 제어를 위해 애너테이션을 사용하는 [Quasar](https://docs.paralleluniverse.co/quasar/)와 같은 프레임워크에 유용합니다.

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 애너테이션 사용 지점 대상

프로퍼티 또는 주 생성자 파라미터를 애너테이트할 때, 해당하는 Kotlin 요소로부터 여러 자바 요소가 생성되며, 따라서 생성된 자바 바이트코드 내에서 애너테이션이 위치할 수 있는 여러 지점이 존재합니다. 애너테이션이 정확히 어떻게 생성되어야 하는지 지정하려면 다음 구문을 사용하십시오:

```kotlin
class Example(@field:Ann val foo,    // annotate Java field
              @get:Ann val bar,      // annotate Java getter
              @param:Ann val quux)   // annotate Java constructor parameter
```

동일한 구문을 사용하여 파일 전체를 애너테이트할 수 있습니다. 이를 위해 파일 최상단에서 `file` 대상을 가진 애너테이션을 패키지 지시어 앞에 또는 파일이 기본 패키지에 있는 경우 모든 임포트(import) 앞에 배치하십시오:

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

동일한 대상을 가진 여러 애너테이션이 있는 경우, 대상 뒤에 대괄호를 추가하고 모든 애너테이션을 대괄호 안에 넣어 대상을 반복하는 것을 피할 수 있습니다:

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

지원되는 사용 지점 대상의 전체 목록은 다음과 같습니다:

  * `file`
  * `property` (이 대상을 가진 애너테이션은 자바에서 보이지 않습니다)
  * `field`
  * `get` (프로퍼티 게터)
  * `set` (프로퍼티 세터)
  * `receiver` (확장 함수 또는 프로퍼티의 리시버 파라미터)
  * `param` (생성자 파라미터)
  * `setparam` (프로퍼티 세터 파라미터)
  * `delegate` (위임된 프로퍼티의 위임 인스턴스를 저장하는 필드)

확장 함수의 리시버 파라미터를 애너테이트하려면 다음 구문을 사용하십시오:

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

사용 지점 대상을 지정하지 않으면, 사용 중인 애너테이션의 `@Target` 애너테이션에 따라 대상이 선택됩니다. 적용 가능한 대상이 여러 개 있는 경우, 다음 목록에서 첫 번째 적용 가능한 대상이 사용됩니다:

  * `param`
  * `property`
  * `field`

## 자바 애너테이션

자바 애너테이션은 코틀린과 100% 호환됩니다:

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // apply @Rule annotation to property getter
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

자바로 작성된 애너테이션의 파라미터 순서가 정의되어 있지 않으므로, 인자를 전달하기 위해 일반적인 함수 호출 구문을 사용할 수 없습니다. 대신, 명명된 인자 구문을 사용해야 합니다:

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

자바와 마찬가지로, `value` 파라미터는 특별한 경우입니다; 이 값은 명시적인 이름 없이 지정할 수 있습니다:

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

### 애너테이션 파라미터로서의 배열

자바에서 `value` 인자가 배열 타입인 경우, 코틀린에서는 `vararg` 파라미터가 됩니다:

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

배열 타입을 가진 다른 인자들의 경우, 배열 리터럴 구문 또는 `arrayOf(...)`를 사용해야 합니다:

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

### 애너테이션 인스턴스의 프로퍼티에 접근하기

애너테이션 인스턴스의 값은 코틀린 코드에 프로퍼티로 노출됩니다:

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

### JVM 1.8 이상 애너테이션 대상 생성 방지 기능

Kotlin 애너테이션이 Kotlin 대상 중 `TYPE`을 포함하는 경우, 해당 애너테이션은 자바 애너테이션 대상 목록에서 `java.lang.annotation.ElementType.TYPE_USE`에 매핑됩니다. 이는 `TYPE_PARAMETER` Kotlin 대상이 `java.lang.annotation.ElementType.TYPE_PARAMETER` 자바 대상에 매핑되는 방식과 같습니다. 이는 API에 이러한 대상이 없는 API 레벨 26 미만의 안드로이드 클라이언트에게 문제가 됩니다.

`TYPE_USE` 및 `TYPE_PARAMETER` 애너테이션 대상을 생성하는 것을 피하려면, 새로운 컴파일러 인자 `-Xno-new-java-annotation-targets`를 사용하십시오.

## 반복 가능한 애너테이션

[자바](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)와 마찬가지로, 코틀린은 단일 코드 요소에 여러 번 적용할 수 있는 반복 가능한 애너테이션을 지원합니다. 애너테이션을 반복 가능하게 만들려면, 선언에 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 메타 애너테이션을 표시하십시오. 이는 코틀린과 자바 모두에서 반복 가능하게 만듭니다. 자바 반복 가능한 애너테이션 또한 코틀린 측에서 지원됩니다.

자바에서 사용되는 방식과의 주된 차이점은 코틀린 컴파일러가 미리 정의된 이름으로 자동으로 생성하는 _컨테이닝 애너테이션_(containing annotation)이 없다는 것입니다. 아래 예시의 애너테이션의 경우, 컨테이닝 애너테이션 `@Tag.Container`를 생성할 것입니다:

```kotlin
@Repeatable
annotation class Tag(val name: String)

// The compiler generates the @Tag.Container containing annotation
```

컨테이닝 애너테이션에 사용자 지정 이름을 설정하려면 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 메타 애너테이션을 적용하고 명시적으로 선언된 컨테이닝 애너테이션 클래스를 인자로 전달하십시오:

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

리플렉션을 통해 코틀린 또는 자바 반복 가능한 애너테이션을 추출하려면 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 함수를 사용하십시오.

코틀린 반복 가능한 애너테이션에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md)에서 확인할 수 있습니다.