[//]: # (title: 반환과 점프)

코틀린에는 세 가지 구조적 점프 표현식이 있습니다:

* `return`은 기본적으로 가장 가까운 둘러싸는 함수 또는 [익명 함수](lambdas.md#anonymous-functions)에서 반환합니다.
* `break`는 가장 가까운 둘러싸는 루프를 종료합니다.
* `continue`는 가장 가까운 둘러싸는 루프의 다음 단계로 진행합니다.

이 모든 표현식은 더 큰 표현식의 일부로 사용될 수 있습니다:

```kotlin
val s = person.name ?: return
```

이 표현식들의 타입은 [Nothing 타입](exceptions.md#the-nothing-type)입니다.

## Break 및 continue 레이블

코틀린의 모든 표현식은 _레이블_로 표시될 수 있습니다.
레이블은 `@` 기호가 뒤에 오는 식별자 형태를 가집니다. 예를 들어 `abc@` 또는 `fooBar@`와 같습니다.
표현식에 레이블을 지정하려면 그 앞에 레이블을 추가하기만 하면 됩니다.

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

이제 레이블로 `break` 또는 `continue`를 한정할 수 있습니다:

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

레이블로 한정된 `break`는 해당 레이블로 표시된 루프 바로 다음의 실행 지점으로 점프합니다.
`continue`는 해당 루프의 다음 반복으로 진행합니다.

> 어떤 경우에는 명시적으로 레이블을 정의하지 않고도 `break` 및 `continue`를 *비지역적으로* 적용할 수 있습니다.
> 이러한 비지역적 사용은 둘러싸는 [인라인 함수](inline-functions.md#break-and-continue)에서 사용되는 람다 표현식에서 유효합니다.
>
{style="note"}

## 레이블로 반환

코틀린에서는 함수 리터럴, 지역 함수, 객체 표현식을 사용하여 함수를 중첩할 수 있습니다.
한정된 `return`은 외부 함수에서 반환할 수 있도록 합니다.

가장 중요한 사용 사례는 람다 표현식에서 반환하는 것입니다. 람다 표현식에서 반환하려면,
람다에 레이블을 지정하고 `return`을 한정해야 합니다:

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 람다 호출자(forEach 루프)로의 지역 반환
        print(it)
    }
    print(" done with explicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이제 람다 표현식에서만 반환합니다. 종종 _암시적 레이블_을 사용하는 것이 더 편리한데, 이러한 레이블은
람다가 전달되는 함수와 동일한 이름을 가지기 때문입니다.

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 람다 호출자(forEach 루프)로의 지역 반환
        print(it)
    }
    print(" done with implicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

대안으로, 람다 표현식을 [익명 함수](lambdas.md#anonymous-functions)로 대체할 수 있습니다.
익명 함수 내의 `return` 문은 익명 함수 자체에서 반환합니다.

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 익명 함수 호출자(forEach 루프)로의 지역 반환
        print(value)
    })
    print(" done with anonymous function")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이전 세 가지 예시에서 지역 반환의 사용은 일반적인 루프에서 `continue`의 사용과 유사합니다.

직접적인 `break`에 해당하는 것은 없지만, 외부 `run` 람다를 추가하고 그 람다에서 비지역적으로 반환함으로써 시뮬레이션할 수 있습니다:

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // run에 전달된 람다로부터의 비지역적 반환
            print(it)
        }
    }
    print(" done with nested loop")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

여기서 비지역적 반환이 가능한 것은 중첩된 `forEach()` 람다가 [인라인 함수](inline-functions.md)처럼 동작하기 때문입니다.

값을 반환할 때, 파서는 한정된 반환에 우선순위를 둡니다:

```kotlin
return@a 1
```

이는 "레이블 `@a`에서 `1`을 반환"한다는 의미이며, "레이블이 지정된 표현식 `(@a 1)`을 반환"하는 것이 아닙니다.

> 어떤 경우에는 레이블을 사용하지 않고 람다 표현식에서 반환할 수 있습니다. 이러한 *비지역적* 반환은
> 람다 안에 위치하지만, 둘러싸는 [인라인 함수](inline-functions.md#returns)를 종료합니다.
>
{style="note"}