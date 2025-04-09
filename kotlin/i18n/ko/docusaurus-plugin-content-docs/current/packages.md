---
title: "패키지 및 임포트"
---
소스 파일은 패키지 선언으로 시작할 수 있습니다.

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

소스 파일의 모든 내용(클래스, 함수 등)은 이 패키지에 포함됩니다.
따라서 위 예제에서 `printMessage()`의 전체 이름은 `org.example.printMessage`이고
`Message`의 전체 이름은 `org.example.Message`입니다.

패키지가 지정되지 않은 경우, 해당 파일의 내용은 이름이 없는 _default_ 패키지에 속합니다.

## Default imports

다음과 같은 여러 패키지는 기본적으로 모든 Kotlin 파일로 가져옵니다.

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

대상 플랫폼에 따라 추가 패키지가 가져옵니다.

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## Imports

기본 임포트 외에도 각 파일에는 자체 `import` 지시문이 포함될 수 있습니다.

단일 이름을 가져올 수 있습니다.

```kotlin
import org.example.Message // Message는 이제 qualification 없이 접근 가능합니다.
```

또는 범위(패키지, 클래스, 객체 등)의 접근 가능한 모든 내용을 가져올 수 있습니다.

```kotlin
import org.example.* // 'org.example'의 모든 것에 접근 가능합니다.
```

이름 충돌이 있는 경우 `as` 키워드를 사용하여 충돌하는 엔터티의 이름을 로컬로 변경하여 명확하게 구분할 수 있습니다.

```kotlin
import org.example.Message // Message에 접근 가능
import org.test.Message as TestMessage // TestMessage는 'org.test.Message'를 나타냅니다.
```

`import` 키워드는 클래스 가져오기에만 국한되지 않습니다. 이를 사용하여 다른 선언을 가져올 수도 있습니다.

  * 최상위 함수 및 속성
  * [object declarations](object-declarations#object-declarations-overview)에 선언된 함수 및 속성
  * [enum constants](enum-classes)

## Visibility of top-level declarations

최상위 선언에 `private`이 표시되면 선언된 파일에 대해 private입니다( [Visibility modifiers](visibility-modifiers) 참조).