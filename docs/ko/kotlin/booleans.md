---
title: 부울
---
`Boolean` 타입은 `true`와 `false` 두 가지 값을 가질 수 있는 boolean 객체를 나타냅니다.
`Boolean`은 `Boolean?`으로 선언된 [nullable](null-safety) counterpart를 가집니다.

:::note
JVM에서 primitive `boolean` 타입으로 저장된 boolean은 일반적으로 8비트를 사용합니다.

:::

boolean에 대한 내장 연산은 다음과 같습니다.

* `||` – 분리(논리적 _OR_)
* `&&` – 연결(논리적 _AND_)
* `!` – 부정(논리적 _NOT_)

예시:

```kotlin
fun main() {

    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null

    println(myTrue || myFalse)
    // true
    println(myTrue && myFalse)
    // false
    println(!myTrue)
    // false
    println(boolNull)
    // null

}
```

`||` 및 `&&` 연산자는 lazy 방식으로 작동합니다. 이는 다음을 의미합니다.

* 첫 번째 피연산자가 `true`이면 `||` 연산자는 두 번째 피연산자를 평가하지 않습니다.
* 첫 번째 피연산자가 `false`이면 `&&` 연산자는 두 번째 피연산자를 평가하지 않습니다.

:::note
JVM에서 boolean 객체에 대한 nullable 참조는 [numbers](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)에서와 마찬가지로 Java 클래스에 boxing됩니다.

:::