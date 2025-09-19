[//]: # (title: 어노테이션)

어노테이션은 코드에 메타데이터를 연결하는 수단입니다. 어노테이션을 선언하려면 클래스 앞에 `annotation` 한정자를 붙입니다.

```kotlin
annotation class Fancy
```

어노테이션의 추가 속성은 메타 어노테이션으로 어노테이션 클래스에 어노테이션을 붙여 지정할 수 있습니다.

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)은 어노테이션이 적용될 수 있는 요소의 가능한 종류를 지정합니다(클래스, 함수, 프로퍼티, 표현식 등).
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html)은 어노테이션이 컴파일된 클래스 파일에 저장되는지, 그리고 런타임에 리플렉션을 통해 볼 수 있는지 여부를 지정합니다(기본적으로 둘 다 true입니다).
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html)은 단일 요소에 동일한 어노테이션을 여러 번 사용할 수 있도록 허용합니다.
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html)는 어노테이션이 public API의 일부이며 생성된 API 문서에 표시되는 클래스 또는 메서드 시그니처에 포함되어야 함을 지정합니다.

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

클래스의 주 생성자에 어노테이션을 붙여야 하는 경우, 생성자 선언에 `constructor` 키워드를 추가하고 그 앞에 어노테이션을 추가해야 합니다.

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

프로퍼티 접근자에도 어노테이션을 붙일 수 있습니다.

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 생성자

어노테이션은 매개변수를 받는 생성자를 가질 수 있습니다.

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

허용되는 매개변수 타입은 다음과 같습니다.

 * 자바 프리미티브 타입에 해당하는 타입 (Int, Long 등)
 * 문자열
 * 클래스 (`Foo::class`)
 * 이넘
 * 다른 어노테이션
 * 위에 나열된 타입의 배열

어노테이션 매개변수는 널러블 타입을 가질 수 없습니다. JVM이 `null`을 어노테이션 속성의 값으로 저장하는 것을 지원하지 않기 때문입니다.

다른 어노테이션의 매개변수로 어노테이션이 사용되는 경우, 그 이름 앞에는 `@` 문자가 붙지 않습니다.

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

어노테이션의 인수로 클래스를 지정해야 하는 경우, 코틀린 클래스([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html))를 사용하세요. 코틀린 컴파일러는 이를 자동으로 자바 클래스로 변환하여 자바 코드가 어노테이션과 인수에 정상적으로 접근할 수 있도록 합니다.

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 인스턴스화

자바에서 어노테이션 타입은 인터페이스의 한 형태이므로, 이를 구현하고 인스턴스를 사용할 수 있습니다. 이 메커니즘에 대한 대안으로, 코틀린은 임의의 코드에서 어노테이션 클래스의 생성자를 호출하고 결과로 생성된 인스턴스를 유사하게 사용할 수 있도록 허용합니다.

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

[이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)에서 어노테이션 클래스 인스턴스화에 대해 자세히 알아보세요.

## 람다

어노테이션은 람다에도 사용될 수 있습니다. 이들은 람다 본문이 생성되는 `invoke()` 메서드에 적용됩니다. 이는 동시성 제어를 위해 어노테이션을 사용하는 [Quasar](https://docs.paralleluniverse.co/quasar/)와 같은 프레임워크에 유용합니다.

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 어노테이션 사용-사이트 타겟

프로퍼티 또는 주 생성자 매개변수에 어노테이션을 붙일 때, 해당 코틀린 요소로부터 여러 자바 요소가 생성됩니다. 따라서 생성된 자바 바이트코드에서 어노테이션의 가능한 위치가 여러 군데 있습니다. 어노테이션이 정확히 어떻게 생성되어야 하는지 지정하려면 다음 구문을 사용하세요.

```kotlin
class Example(@field:Ann val foo,    // 자바 필드에만 어노테이션 적용
              @get:Ann val bar,      // 자바 getter에만 어노테이션 적용
              @param:Ann val quux)   // 자바 생성자 매개변수에만 어노테이션 적용
```

동일한 구문을 사용하여 전체 파일에 어노테이션을 적용할 수 있습니다. 이렇게 하려면 파일의 최상위에 `file` 타겟을 가진 어노테이션을 배치합니다. 이는 패키지 지시문 앞 또는 파일이 기본 패키지에 있는 경우 모든 임포트 앞에 배치합니다.

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

동일한 타겟을 가진 어노테이션이 여러 개 있는 경우, 타겟 뒤에 대괄호를 추가하여 타겟을 반복하는 것을 피하고 모든 어노테이션을 대괄호 안에 넣을 수 있습니다(`all` 메타 타겟 제외).

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

지원되는 사용-사이트 타겟의 전체 목록은 다음과 같습니다.

  * `file`
  * `field`
  * `property` (이 타겟을 가진 어노테이션은 자바에서 볼 수 없습니다.)
  * `get` (프로퍼티 getter)
  * `set` (프로퍼티 setter)
  * `all` (프로퍼티를 위한 실험적인 메타 타겟이며, 목적과 사용법은 [아래](#all-meta-target)를 참조하십시오.)
  * `receiver` (확장 함수 또는 프로퍼티의 리시버 매개변수)

    확장 함수의 리시버 매개변수에 어노테이션을 적용하려면 다음 구문을 사용하세요.

    ```kotlin
    fun @receiver:Fancy String.myExtension() { ... }
    ```

  * `param` (생성자 매개변수)
  * `setparam` (프로퍼티 setter 매개변수)
  * `delegate` (위임된 프로퍼티의 위임 인스턴스를 저장하는 필드)

### 사용-사이트 타겟이 지정되지 않은 경우의 기본값

사용-사이트 타겟을 지정하지 않으면, 사용 중인 어노테이션의 `@Target` 어노테이션에 따라 타겟이 선택됩니다. 여러 개의 적용 가능한 타겟이 있는 경우, 다음 목록에서 첫 번째로 적용 가능한 타겟이 사용됩니다.

* `param`
* `property`
* `field`

[`Jakarta Bean Validation`의 `@Email` 어노테이션](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email)을 사용해 봅시다. 이 어노테이션은 다음과 같이 정의됩니다.

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

이 어노테이션과 함께 다음 예시를 고려해 봅시다.

```kotlin
data class User(val username: String,
                // @Email은 @param:Email과 동일합니다.
                @Email val email: String) {
    // @Email은 @field:Email과 동일합니다.
    @Email val secondaryEmail: String? = null
}
```

코틀린 2.2.0에서는 어노테이션을 매개변수, 필드, 프로퍼티로 전파하는 것을 더욱 예측 가능하게 만들 실험적인 기본 규칙을 도입했습니다.

새 규칙에 따라 여러 적용 가능한 타겟이 있는 경우, 하나 이상이 다음과 같이 선택됩니다.

* 생성자 매개변수 타겟(`param`)이 적용 가능하면 사용됩니다.
* 프로퍼티 타겟(`property`)이 적용 가능하면 사용됩니다.
* `property`가 적용 가능하지 않을 때 필드 타겟(`field`)이 적용 가능하면 `field`가 사용됩니다.

동일한 예시를 사용하면:

```kotlin
data class User(val username: String,
                // @Email은 이제 @param:Email @field:Email과 동일합니다.
                @Email val email: String) {
    // @Email은 여전히 @field:Email과 동일합니다.
    @Email val secondaryEmail: String? = null
}
```

여러 타겟이 있고, `param`, `property`, `field` 중 어느 것도 적용 가능하지 않은 경우, 해당 어노테이션은 유효하지 않습니다.

새 기본 규칙을 활성화하려면 Gradle 설정에 다음 줄을 사용하십시오.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

이전 동작을 사용하고 싶을 때 다음을 수행할 수 있습니다.

* 특정 경우에 `@Annotation` 대신 `@param:Annotation`을 사용하는 것처럼 필요한 타겟을 명시적으로 지정할 수 있습니다.
* 전체 프로젝트의 경우 Gradle 빌드 파일에서 이 플래그를 사용하세요.

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

### `all` 메타 타겟

<primary-label ref="experimental-opt-in"/>

`all` 타겟은 동일한 어노테이션을 매개변수와 프로퍼티 또는 필드뿐만 아니라 해당 getter와 setter에도 적용하기 쉽게 만듭니다.

특히, `all`로 표시된 어노테이션은 적용 가능한 경우 다음과 같이 전파됩니다.

* 프로퍼티가 주 생성자에 정의된 경우 생성자 매개변수(`param`)로 전파됩니다.
* 프로퍼티 자체(`property`)로 전파됩니다.
* 프로퍼티에 백킹 필드가 있는 경우 해당 백킹 필드(`field`)로 전파됩니다.
* getter(`get`)로 전파됩니다.
* 프로퍼티가 `var`로 정의된 경우 setter 매개변수(`setparam`)로 전파됩니다.
* 클래스에 `@JvmRecord` 어노테이션이 있는 경우 자바 전용 타겟인 `RECORD_COMPONENT`로 전파됩니다.

[`Jakarta Bean Validation`의 `@Email` 어노테이션](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email)을 사용해 봅시다. 이 어노테이션은 다음과 같이 정의됩니다.

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

아래 예시에서 이 `@Email` 어노테이션은 모든 관련 타겟에 적용됩니다.

```kotlin
data class User(
    val username: String,
    // @Email을 param, field, get에 적용
    @all:Email val email: String,
    // @Email을 param, field, get, setparam에 적용
    @all:Email var name: String,
) {
    // @Email을 field와 getter에 적용 (생성자에 없으므로 param 없음)
    @all:Email val secondaryEmail: String? = null
}
```

`all` 메타 타겟은 주 생성자 내부와 외부 모두에서 어떤 프로퍼티에도 사용할 수 있습니다.

#### 제한 사항

`all` 타겟에는 몇 가지 제한 사항이 있습니다.

* 어노테이션을 타입, 잠재적 확장 리시버, 컨텍스트 리시버 또는 매개변수로 전파하지 않습니다.
* 여러 어노테이션과 함께 사용할 수 없습니다.
    ```kotlin
    @all:[A B] // 금지됨, @all:A @all:B를 사용하십시오.
    val x: Int = 5
    ```
* [위임된 프로퍼티](delegated-properties.md)와 함께 사용할 수 없습니다.

#### 활성화 방법

프로젝트에서 `all` 메타 타겟을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하십시오.

```Bash
-Xannotation-target-all
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하십시오.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

## 자바 어노테이션

자바 어노테이션은 코틀린과 100% 호환됩니다.

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

자바로 작성된 어노테이션의 매개변수 순서는 정의되어 있지 않으므로, 인수를 전달하기 위해 일반 함수 호출 구문을 사용할 수 없습니다. 대신, 명명된 인수 구문을 사용해야 합니다.

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

자바에서와 마찬가지로, `value` 매개변수는 특별한 경우입니다. 그 값은 명시적인 이름 없이 지정될 수 있습니다.

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

### 어노테이션 매개변수로서의 배열

자바에서 `value` 인수가 배열 타입인 경우, 코틀린에서는 `vararg` 매개변수가 됩니다.

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

배열 타입을 가진 다른 인수들의 경우, 배열 리터럴 구문 또는 `arrayOf(...)`를 사용해야 합니다.

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

### 어노테이션 인스턴스의 프로퍼티 접근

어노테이션 인스턴스의 값은 코틀린 코드에서 프로퍼티로 노출됩니다.

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

### JVM 1.8+ 어노테이션 타겟을 생성하지 않는 기능

코틀린 어노테이션이 코틀린 타겟 중 `TYPE`을 포함하는 경우, 해당 어노테이션은 자바 어노테이션 타겟 목록에서 `java.lang.annotation.ElementType.TYPE_USE`에 매핑됩니다. 이는 `TYPE_PARAMETER` 코틀린 타겟이 `java.lang.annotation.ElementType.TYPE_PARAMETER` 자바 타겟에 매핑되는 방식과 같습니다. 이는 API 레벨 26 미만의 안드로이드 클라이언트에게 문제가 됩니다. 해당 API 수준에서는 이러한 타겟이 없기 때문입니다.

`TYPE_USE` 및 `TYPE_PARAMETER` 어노테이션 타겟 생성을 피하려면 새 컴파일러 인수 `-Xno-new-java-annotation-targets`를 사용하십시오.

## 반복 가능한 어노테이션

[자바](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)에서와 마찬가지로 코틀린에는 반복 가능한 어노테이션이 있습니다. 이는 단일 코드 요소에 여러 번 적용될 수 있습니다. 어노테이션을 반복 가능하게 만들려면 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 메타 어노테이션으로 선언에 표시하십시오. 이렇게 하면 코틀린과 자바 모두에서 반복 가능하게 됩니다. 자바 반복 가능한 어노테이션도 코틀린 측에서 지원됩니다.

자바에서 사용되는 방식과의 주요 차이점은 코틀린 컴파일러가 미리 정의된 이름으로 자동으로 생성하는 _컨테이닝 어노테이션(containing annotation)_이 없다는 것입니다. 아래 예시의 어노테이션의 경우, 컨테이닝 어노테이션 `@Tag.Container`를 생성합니다.

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 컴파일러가 @Tag.Container 컨테이닝 어노테이션을 생성합니다.
```

[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 메타 어노테이션을 적용하고 명시적으로 선언된 컨테이닝 어노테이션 클래스를 인수로 전달하여 컨테이닝 어노테이션에 사용자 지정 이름을 설정할 수 있습니다.

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

리플렉션을 통해 코틀린 또는 자바 반복 가능한 어노테이션을 추출하려면 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 함수를 사용하십시오.

[이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md)에서 코틀린 반복 가능한 어노테이션에 대해 자세히 알아보세요.