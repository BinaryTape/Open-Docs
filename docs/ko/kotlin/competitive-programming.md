[//]: # (title: 경쟁 프로그래밍을 위한 Kotlin)

이 튜토리얼은 Kotlin을 사용해 본 적 없는 경쟁 프로그래머와 경쟁 프로그래밍 대회에 참가해 본 적 없는 Kotlin 개발자 모두를 위해 설계되었습니다. 이는 해당 프로그래밍 기술을 전제로 합니다.

[경쟁 프로그래밍](https://en.wikipedia.org/wiki/Competitive_programming)은 참가자들이 엄격한 제약 조건 내에서 정확히 명시된 알고리즘 문제를 해결하기 위해 프로그램을 작성하는 마인드 스포츠입니다. 문제는 모든 소프트웨어 개발자가 풀 수 있고 올바른 솔루션을 얻기 위해 코드가 거의 필요 없는 간단한 것부터 특수 알고리즘, 자료 구조 및 많은 연습이 필요한 복잡한 것까지 다양할 수 있습니다. Kotlin은 경쟁 프로그래밍을 위해 특별히 설계된 것은 아니지만, 이 분야에 우연히 잘 맞아떨어집니다. 이 언어는 프로그래머가 코드를 작업할 때 작성하고 읽어야 하는 일반적인 보일러플레이트 양을 동적 타입 스크립팅 언어가 제공하는 수준으로 거의 줄여주는 동시에, 정적 타입 언어의 도구와 성능을 제공합니다.

Kotlin 개발 환경을 설정하는 방법에 대해서는 [Kotlin/JVM 시작하기](jvm-get-started.md)를 참조하세요. 경쟁 프로그래밍에서는 일반적으로 단일 프로젝트가 생성되며 각 문제의 솔루션은 단일 소스 파일에 작성됩니다.

## 간단한 예시: 도달 가능한 숫자 문제

구체적인 예시를 살펴보겠습니다.

[Codeforces](https://codeforces.com/) Round 555는 4월 26일에 3rd Division을 위해 개최되었으며, 이는 모든 개발자가 시도해 볼 만한 문제들이 포함되어 있었음을 의미합니다. [이 링크](https://codeforces.com/contest/1157)를 사용하여 문제들을 읽어볼 수 있습니다. 문제 세트 중 가장 간단한 문제는 [문제 A: 도달 가능한 숫자](https://codeforces.com/contest/1157/problem/A)입니다. 이 문제는 문제 설명에 명시된 간단한 알고리즘을 구현하도록 요청합니다.

`A.kt`와 같이 임의의 이름을 가진 Kotlin 소스 파일을 생성하여 이 문제를 해결하기 시작할 것입니다.
먼저, 문제 설명에 다음과 같이 명시된 함수를 구현해야 합니다.

함수 f(x)를 다음과 같이 정의합니다: x에 1을 더한 다음, 결과 숫자에 후행 0이 하나 이상 있는 동안 해당 0을 제거합니다.

Kotlin은 실용적이고 비정형적인 언어로, 개발자에게 특정 스타일을 강요하지 않고 명령형 및 함수형 프로그래밍 스타일을 모두 지원합니다. [꼬리 재귀](functions.md#tail-recursive-functions)와 같은 Kotlin 기능을 사용하여 함수 `f`를 함수형 스타일로 구현할 수 있습니다.

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

또는 전통적인 [while 루프](control-flow.md)와 Kotlin에서 [var](basic-syntax.md#variables)로 표시되는 가변 변수를 사용하여 함수 `f`의 명령형 구현을 작성할 수 있습니다.

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

Kotlin에서 타입은 타입 추론의 광범위한 사용으로 인해 많은 곳에서 선택 사항이지만, 모든 선언은 컴파일 시점에 알려진 잘 정의된 정적 타입을 가집니다.

이제 남은 것은 입력을 읽고 문제 설명이 요구하는 알고리즘의 나머지 부분을 구현하는 메인 함수를 작성하는 것입니다. 즉, 표준 입력으로 주어진 초기 숫자 `n`에 함수 `f`를 반복적으로 적용하면서 생성되는 서로 다른 정수의 수를 계산하는 것입니다.

기본적으로 Kotlin은 JVM에서 실행되며 동적 크기 배열(`ArrayList`), 해시 기반 맵 및 세트(`HashMap`/`HashSet`), 트리 기반 정렬 맵 및 세트(`TreeMap`/`TreeSet`)와 같은 범용 컬렉션 및 자료 구조를 포함하는 풍부하고 효율적인 컬렉션 라이브러리에 직접 접근할 수 있도록 합니다. 함수 `f`를 적용하는 동안 이미 도달한 값을 추적하기 위해 정수 해시 세트를 사용하면, 문제에 대한 간단한 명령형 솔루션 버전을 아래와 같이 작성할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // read integer from the input
    val reached = HashSet<Int>() // a mutable hash set 
    while (reached.add(n)) n = f(n) // iterate function f
    println(reached.size) // print answer to the output
}
```

경쟁 프로그래밍에서는 잘못된 형식의 입력을 처리할 필요가 없습니다. 경쟁 프로그래밍에서 입력 형식은 항상 정확하게 명시되며, 실제 입력은 문제 설명의 입력 명세에서 벗어날 수 없습니다. 이것이 바로 Kotlin의 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 함수를 사용할 수 있는 이유입니다. 이 함수는 입력 문자열이 존재함을 단언하며, 그렇지 않으면 예외를 발생시킵니다. 마찬가지로, [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 함수는 입력 문자열이 정수가 아니면 예외를 발생시킵니다.

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // read integer from the input
    val reached = HashSet<Int>() // a mutable hash set 
    while (reached.add(n)) n = f(n) // iterate function f
    println(reached.size) // print answer to the output
}
```

[`readLine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 함수 호출 뒤에 Kotlin의 [널 단언 연산자](null-safety.md#not-null-assertion-operator) `!!`를 사용한 것에 주목하세요. Kotlin의 `readLine()` 함수는 [널 허용 타입](null-safety.md#nullable-types-and-non-nullable-types) `String?`을 반환하도록 정의되어 있으며, 입력의 끝에서는 `null`을 반환하여 개발자가 누락된 입력의 경우를 명시적으로 처리하도록 강제합니다.

경쟁 프로그래밍에서는 잘못된 형식의 입력을 처리할 필요가 없습니다. 경쟁 프로그래밍에서 입력 형식은 항상 정확하게 명시되며, 실제 입력은 문제 설명의 입력 명세에서 벗어날 수 없습니다. 널 단언 연산자 `!!`는 본질적으로 이러한 역할을 수행합니다. 즉, 입력 문자열이 존재함을 단언하며, 그렇지 않으면 예외를 발생시킵니다. [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)도 마찬가지입니다.

</tab>
</tabs>

모든 온라인 경쟁 프로그래밍 대회에서는 미리 작성된 코드를 사용할 수 있으므로, 실제 솔루션 코드를 좀 더 쉽게 읽고 작성할 수 있도록 경쟁 프로그래밍에 특화된 자신만의 유틸리티 함수 라이브러리를 정의할 수 있습니다. 그런 다음 이 코드를 솔루션의 템플릿으로 사용할 수 있습니다. 예를 들어, 경쟁 프로그래밍에서 입력을 읽기 위한 다음 도우미 함수들을 정의할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // string line
private fun readInt() = readStr().toInt() // single int
// similar for other types you'd use in your solutions
```

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // string line
private fun readInt() = readStr().toInt() // single int
// similar for other types you'd use in your solutions
```

</tab>
</tabs>

여기서 `private` [가시성 변경자](visibility-modifiers.md)를 사용한 것에 주목하세요. 가시성 변경자의 개념은 경쟁 프로그래밍에 전혀 관련이 없지만, 동일한 패키지 내에서 충돌하는 공개 선언으로 인한 오류 없이 동일한 템플릿을 기반으로 여러 솔루션 파일을 배치할 수 있도록 합니다.

## 함수형 연산자 예시: 긴 숫자 문제

더 복잡한 문제의 경우, Kotlin의 광범위한 컬렉션 함수형 연산 라이브러리는 보일러플레이트를 최소화하고 코드를 선형적인 상향식 및 좌우 흐름의 데이터 변환 파이프라인으로 전환하는 데 유용합니다. 예를 들어, [문제 B: 긴 숫자](https://codeforces.com/contest/1157/problem/B)는 구현하기에 간단한 그리디 알고리즘을 취하며, 단 하나의 가변 변수 없이 이러한 스타일로 작성할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
fun main() {
    // read input
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // define local function f
    fun f(c: Char) = '0' + fl[c - '1']
    // greedily find first and last indices
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // compose and write the answer
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
fun main() {
    // read input
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // define local function f
    fun f(c: Char) = '0' + fl[c - '1']
    // greedily find first and last indices
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // compose and write the answer
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

이 간결한 코드에서는 컬렉션 변환 외에도 로컬 함수와 [엘비스 연산자](null-safety.md#elvis-operator) `?:`와 같은 편리한 Kotlin 기능을 볼 수 있으며, 이는 `.takeIf { it >= 0 } ?: s.length`와 같이 "값이 양수이면 사용하고 그렇지 않으면 길이를 사용하라"와 같은 [관용구](idioms.md)를 간결하고 가독성 높은 표현으로 나타낼 수 있게 합니다. 하지만 Kotlin에서는 추가적인 가변 변수를 만들고 동일한 코드를 명령형 스타일로 표현하는 것도 완벽하게 허용됩니다.

이와 같은 경쟁 프로그래밍 문제에서 입력을 더 간결하게 읽기 위해 다음과 같은 도우미 입력 읽기 함수 목록을 가질 수 있습니다.

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // string line
private fun readInt() = readStr().toInt() // single int
private fun readStrings() = readStr().split(" ") // list of strings
private fun readInts() = readStrings().map { it.toInt() } // list of ints
```

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // string line
private fun readInt() = readStr().toInt() // single int
private fun readStrings() = readStr().split(" ") // list of strings
private fun readInts() = readStrings().map { it.toInt() } // list of ints
```

</tab>
</tabs>

이 도우미 함수들을 사용하면, 입력을 읽는 코드 부분이 더 간단해지며, 문제 설명의 입력 명세를 한 줄 한 줄 밀접하게 따릅니다.

```kotlin
// read input
val n = readInt()
val s = readStr()
val fl = readInts()
```

경쟁 프로그래밍에서는 산업 프로그래밍 관행에서 흔히 사용되는 것보다 변수 이름을 더 짧게 지정하는 것이 관례입니다. 이는 코드가 한 번만 작성되고 그 이후에는 지원되지 않기 때문입니다. 그러나 이러한 이름은 일반적으로 여전히 기억하기 쉽게 사용됩니다. 예를 들어, 배열에는 `a`, 인덱스에는 `i`, `j` 등이, 테이블의 행 및 열 번호에는 `r`, `c`가, 좌표에는 `x`, `y` 등이 사용됩니다. 입력 데이터에 대해 문제 설명에 주어진 것과 동일한 이름을 사용하는 것이 더 쉽습니다. 하지만 더 복잡한 문제는 더 많은 코드를 필요로 하며, 이는 더 길고 스스로 설명적인 변수 및 함수 이름 사용으로 이어집니다.

## 더 많은 팁과 트릭

경쟁 프로그래밍 문제에는 종종 다음과 같은 입력이 있습니다.

입력의 첫 줄에는 두 개의 정수 `n`과 `k`가 포함됩니다.

Kotlin에서는 정수 목록에서 [구조 분해 선언](destructuring-declarations.md)을 사용하여 다음 문으로 이 줄을 간결하게 파싱할 수 있습니다.

```kotlin
val (n, k) = readInts()
```

덜 구조화된 입력 형식을 파싱하기 위해 JVM의 `java.util.Scanner` 클래스를 사용하고 싶은 유혹을 느낄 수 있습니다. Kotlin은 JVM 라이브러리와 잘 상호 운용되도록 설계되어, Kotlin에서 이들을 사용하는 것이 매우 자연스럽게 느껴집니다. 그러나 `java.util.Scanner`는 매우 느리다는 점에 유의해야 합니다. 사실, 10<sup>5</sup>개 이상의 정수를 파싱하는 데 전형적인 2초의 시간 제한에 맞지 않을 정도로 느리며, 반면 Kotlin의 간단한 `split(" ").map { it.toInt() }`는 이를 처리할 수 있습니다.

Kotlin에서 출력 작성은 일반적으로 [println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 호출과 Kotlin의 [문자열 템플릿](strings.md#string-templates)을 사용하여 간단합니다. 하지만 출력이 10<sup>5</sup>줄 이상인 경우 주의해야 합니다. 이렇게 많은 `println` 호출을 발행하는 것은 너무 느린데, 이는 Kotlin에서 출력이 각 줄마다 자동으로 플러시되기 때문입니다. 배열이나 리스트에서 여러 줄을 더 빠르게 작성하는 방법은 `"
"`을 구분자로 사용하여 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 함수를 사용하는 것입니다. 예시:

```kotlin
println(a.joinToString("
")) // each element of array/list of a separate line
```

## Kotlin 배우기

Kotlin은 배우기 쉽습니다. 특히 Java를 이미 알고 있는 사람들에게는 더욱 그렇습니다. 소프트웨어 개발자를 위한 Kotlin의 기본 문법에 대한 간략한 소개는 [기본 문법](basic-syntax.md)부터 시작하여 웹사이트의 참조 섹션에서 직접 찾을 수 있습니다.

IDEA에는 [Java-to-Kotlin 변환기](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)가 내장되어 있습니다. Java에 익숙한 사람들이 해당 Kotlin 구문 구성을 배우는 데 사용할 수 있지만, 완벽하지는 않으므로 Kotlin에 익숙해지고 [Kotlin 관용구](idioms.md)를 배우는 것이 여전히 가치가 있습니다.

Kotlin 문법과 Kotlin 표준 라이브러리의 API를 공부하는 데 훌륭한 자료는 [Kotlin Koans](koans.md)입니다.