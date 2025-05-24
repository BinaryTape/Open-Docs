---
title: "반환과 점프"
---
Kotlin에는 세 가지 구조적 점프 표현식이 있습니다.

* `return`은 기본적으로 가장 가까운 둘러싸는 함수 또는 [익명 함수](lambdas#anonymous-functions)에서 반환됩니다.
* `break`는 가장 가까운 둘러싸는 루프를 종료합니다.
* `continue`는 가장 가까운 둘러싸는 루프의 다음 단계로 진행합니다.

이러한 표현식은 모두 더 큰 표현식의 일부로 사용될 수 있습니다.

```kotlin
val s = person.name ?: return
```

이러한 표현식의 유형은 [Nothing type](exceptions#the-nothing-type)입니다.

## Break 및 continue 레이블

Kotlin의 모든 표현식은 _레이블_로 표시될 수 있습니다.
레이블은 `abc@` 또는 `fooBar@`와 같이 식별자 뒤에 `@` 기호가 오는 형태입니다.
표현식에 레이블을 지정하려면 앞에 레이블을 추가하기만 하면 됩니다.

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

이제 `break` 또는 `continue`에 레이블을 지정할 수 있습니다.

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

레이블이 지정된 `break`는 해당 레이블로 표시된 루프 바로 다음의 실행 지점으로 점프합니다.
`continue`는 해당 루프의 다음 반복으로 진행합니다.

:::note
경우에 따라 레이블을 명시적으로 정의하지 않고도 `break` 및 `continue`를 *non-locally* 적용할 수 있습니다.
이러한 비지역적 사용은 둘러싸는 [inline functions](inline-functions#break-and-continue)에 사용되는 람다 표현식에서 유효합니다.

:::

## 레이블로 반환

Kotlin에서는 함수 리터럴, 로컬 함수 및 객체 표현식을 사용하여 함수를 중첩할 수 있습니다.
정규화된 `return`을 사용하면 외부 함수에서 반환할 수 있습니다.

가장 중요한 사용 사례는 람다 표현식에서 반환하는 것입니다. 람다 표현식에서 반환하려면
레이블을 지정하고 `return`을 정규화합니다.

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 람다 호출자(forEach 루프)로 로컬 반환
        print(it)
    }
    print(" done with explicit label")
}

fun main() {
    foo()
}
```

이제 람다 표현식에서만 반환됩니다. 종종 _암시적 레이블_을 사용하는 것이 더 편리합니다. 이러한 레이블은
람다가 전달되는 함수와 이름이 같기 때문입니다.

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 람다 호출자(forEach 루프)로 로컬 반환
        print(it)
    }
    print(" done with implicit label")
}

fun main() {
    foo()
}
```

또는 람다 표현식을 [익명 함수](lambdas#anonymous-functions)로 바꿀 수 있습니다.
익명 함수의 `return` 문은 익명 함수 자체에서 반환됩니다.

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 익명 함수 호출자(forEach 루프)로 로컬 반환
        print(value)
    })
    print(" done with anonymous function")
}

fun main() {
    foo()
}
```

이전 세 예에서 로컬 반환을 사용하는 것은 일반 루프에서 `continue`를 사용하는 것과 유사합니다.

`break`에 대한 직접적인 동등물은 없지만 다른 중첩 람다를 추가하고 비지역적으로 반환하여 시뮬레이션할 수 있습니다.

```kotlin

fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // run에 전달된 람다에서 비지역적으로 반환
            print(it)
        }
    }
    print(" done with nested loop")
}

fun main() {
    foo()
}
```

값을 반환할 때 파서는 정규화된 반환을 선호합니다.

```kotlin
return@a 1
```

이것은 "레이블 `@a`에서 `1`을 반환"하는 것을 의미하며 "레이블이 지정된 표현식 `(@a 1)`을 반환"하는 것이 아닙니다.

:::note
경우에 따라 레이블을 사용하지 않고 람다 표현식에서 반환할 수 있습니다. 이러한 *비지역적* 반환은
람다에 있지만 둘러싸는 [inline function](inline-functions#returns)을 종료합니다.

:::