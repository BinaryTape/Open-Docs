[//]: # (title: 패키지와 임포트)

소스 파일은 패키지 선언으로 시작할 수 있습니다:

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

클래스와 함수를 포함한 소스 파일의 모든 콘텐츠는 이 패키지에 포함됩니다.
따라서 위 예제에서 `printMessage()`의 전체 이름(full name)은 `org.example.printMessage`이며,
`Message`의 전체 이름은 `org.example.Message`입니다. 

패키지를 지정하지 않으면, 해당 파일의 콘텐츠는 이름이 없는 _기본(default)_ 패키지에 속하게 됩니다.

## 기본 임포트

많은 패키지가 기본적으로 모든 Kotlin 파일에 임포트됩니다:

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

대상 플랫폼에 따라 추가 패키지가 임포트됩니다:

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## 임포트

기본 임포트 외에도 각 파일에는 자체적인 `import` 지시문을 포함할 수 있습니다.

단일 이름을 임포트할 수 있습니다:

```kotlin
import org.example.Message // 이제 Message를 한정어(qualification) 없이 사용할 수 있습니다.
```

또는 패키지, 클래스, 객체 등 해당 범위(scope)에서 접근 가능한 모든 콘텐츠를 임포트할 수 있습니다:

```kotlin
import org.example.* // 'org.example'의 모든 항목에 접근할 수 있게 됩니다.
```

이름 충돌이 발생하는 경우, `as` 키워드를 사용하여 충돌하는 항목의 이름을 로컬에서 변경함으로써 모호함을 해소할 수 있습니다:

```kotlin
import org.example.Message // Message에 접근 가능
import org.test.Message as TestMessage // TestMessage는 'org.test.Message'를 나타냅니다.
```

`import` 키워드는 클래스 임포트에만 국한되지 않습니다. 다음과 같은 다른 선언들을 임포트하는 데에도 사용할 수 있습니다:

  * 최상위(top-level) 함수 및 프로퍼티
  * [객체 선언(object declarations)](object-declarations.md#object-declarations-overview)에 선언된 함수 및 프로퍼티
  * [열거형 상수(enum constants)](enum-classes.md)

## 최상위 선언의 가시성

최상위 선언이 `private`으로 표시되면, 해당 선언이 포함된 파일 내에서만 접근 가능합니다([가시성 수정자(Visibility modifiers)](visibility-modifiers.md) 참조).