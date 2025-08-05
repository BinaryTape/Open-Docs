[//]: # (title: 표준 입력 읽기)

`readln()` 함수를 사용하여 표준 입력에서 데이터를 읽습니다. 이 함수는 전체 줄을 문자열로 읽습니다.

```kotlin
// 사용자 입력을 읽어 변수에 저장합니다. 예: Hi there!
val myInput = readln()

println(myInput)
// Hi there!

// 사용자 입력을 변수에 저장하지 않고 읽고 출력합니다. 예: Hi, Kotlin!
println(readln())
// Hi, Kotlin!
```

문자열 외 다른 데이터 타입을 사용하려면, `.toInt()`, `.toLong()`, `.toDouble()`, `.toFloat()`, `.toBoolean()`과 같은 변환 함수를 사용하여 입력값을 변환할 수 있습니다.
여러 다른 데이터 타입의 입력값을 읽어 각각 변수에 저장할 수 있습니다.

```kotlin
// 문자열 입력을 정수 값으로 변환합니다. 예: 12
val myNumber = readln().toInt()
println(myNumber)
// 12

// 문자열 입력을 double 값으로 변환합니다. 예: 345 
val myDouble = readln().toDouble()
println(myDouble)
// 345.0

// 문자열 입력을 boolean 값으로 변환합니다. 예: true
val myBoolean = readln().toBoolean()
println(myBoolean)
// true
```

이러한 변환 함수는 사용자가 대상 데이터 타입의 유효한 표현을 입력한다고 가정합니다. 예를 들어, `.toInt()`를 사용하여 "hello"를 정수로 변환하는 것은 함수가 문자열 입력에서 숫자를 예상하므로 예외를 발생시킵니다.

구분자로 구분된 여러 입력 요소를 읽으려면 구분자를 지정하여 `.split()` 함수를 사용합니다. 다음 코드 샘플은 표준 입력에서 읽은 후, 구분자를 기반으로 입력값을 요소 목록으로 분할하고, 목록의 각 요소를 특정 타입으로 변환합니다.

```kotlin
// 공백으로 요소가 구분된다고 가정하고 입력을 읽어 정수로 변환합니다. 예: 1 2 3 
val numbers = readln().split(' ').map { it.toInt() }
println(numbers)
//[1, 2, 3] 

// 쉼표로 요소가 구분된다고 가정하고 입력을 읽어 double로 변환합니다. 예: 4,5,6
val doubles = readln().split(',').map { it.toDouble() }
println(doubles)
//[4.0, 5.0, 6.0]
```

> Kotlin/JVM에서 사용자 입력을 읽는 대안적인 방법을 보려면 [Java Scanner를 사용한 표준 입력](standard-input.md)을 참조하세요.
>
{style="note"}

## 표준 입력 안전하게 처리하기

`.toIntOrNull()` 함수를 사용하여 사용자 입력을 문자열에서 정수로 안전하게 변환할 수 있습니다. 이 함수는 변환에 성공하면 정수를 반환하지만, 입력이 정수의 유효한 표현이 아니면 `null`을 반환합니다.

```kotlin
// 입력이 유효하지 않으면 null을 반환합니다. 예: Hello!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 유효한 입력을 문자열에서 정수로 변환합니다. 예: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

`readlnOrNull()` 함수도 사용자 입력을 안전하게 처리하는 데 유용합니다. `readlnOrNull()` 함수는 표준 입력에서 읽고 입력의 끝에 도달하면 null을 반환하는 반면, `readln()`은 이러한 경우 예외를 발생시킵니다.