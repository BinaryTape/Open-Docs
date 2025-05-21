---
title: "코틀린을 활용한 Competitive Programming"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

이 튜토리얼은 이전에 Kotlin을 사용해 보지 않은 경쟁적 프로그래밍 참가자와, 이전에 경쟁적 프로그래밍 이벤트에 참여하지 않은 Kotlin 개발자 모두를 위해 설계되었습니다. 튜토리얼은 해당 프로그래밍 기술을 전제로 합니다.

[경쟁적 프로그래밍](https://en.wikipedia.org/wiki/Competitive_programming)
은 참가자들이 엄격한 제약 조건 내에서 정확하게 명시된 알고리즘 문제를 해결하기 위해 프로그램을 작성하는 두뇌 스포츠입니다. 문제는 모든 소프트웨어 개발자가 해결할 수 있고 올바른 솔루션을 얻기 위해 코드를 거의 필요로 하지 않는 간단한 문제부터 특별한 알고리즘, 데이터 구조 및 많은 연습 지식을 필요로 하는 복잡한 문제까지 다양합니다. Kotlin은 경쟁적 프로그래밍을 위해 특별히 설계된 것은 아니지만, 프로그래머가 코드를 작성하고 읽는 데 필요한 일반적인 상용구의 양을 동적 타입 스크립팅 언어가 제공하는 수준으로 줄이면서 정적 타입 언어의 툴링 및 성능을 갖추고 있어 이 영역에 적합합니다.

Kotlin 개발 환경 설정 방법은 [Kotlin/JVM 시작하기](jvm-get-started)를 참조하세요. 경쟁적 프로그래밍에서는 일반적으로 단일 프로젝트가 생성되고 각 문제의 솔루션은 단일 소스 파일에 작성됩니다.

## 간단한 예제: Reachable Numbers 문제

구체적인 예제를 살펴보겠습니다.

[Codeforces](https://codeforces.com/)
Round 555는 4월 26일에 3rd Division을 위해 개최되었으며, 이는 모든 개발자가 시도해 볼 만한 문제가 있다는 것을 의미합니다.
[이 링크](https://codeforces.com/contest/1157)를 사용하여 문제를 읽을 수 있습니다.
이 세트에서 가장 간단한 문제는
[Problem A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A)입니다.
문제 설명에 설명된 간단한 알고리즘을 구현하도록 요청합니다.

임의의 이름으로 Kotlin 소스 파일을 만들어 문제 해결을 시작합니다. `A.kt`가 적합합니다.
먼저 문제 설명에 지정된 대로 함수를 구현해야 합니다.

함수 f(x)를 다음과 같이 나타냅니다. x에 1을 더한 다음, 결과 숫자에 후행 0이 하나 이상 있는 동안 해당 0을 제거합니다.

Kotlin은 실용적이고 자유로운 언어로서, 개발자를 어느 한쪽으로 밀어붙이지 않고 명령형 및 함수형 프로그래밍 스타일을 모두 지원합니다.
[꼬리 재귀](functions#tail-recursive-functions)와 같은 Kotlin 기능을 사용하여 함수 `f`를 함수형 스타일로 구현할 수 있습니다.

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

또는 기존의
[while 루프](control-flow)와 Kotlin에서
[var](basic-syntax#variables)로 표시되는 변경 가능한 변수를 사용하여 함수 `f`의 명령형 구현을 작성할 수 있습니다.

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

Kotlin의 타입은 타입 추론을 널리 사용하기 때문에 많은 곳에서 선택 사항이지만, 모든 선언에는 컴파일 시 알려진 잘 정의된 정적 타입이 여전히 있습니다.

이제 남은 것은 입력을 읽고 문제 설명에서 요구하는 알고리즘의 나머지 부분을 구현하는 메인 함수를 작성하는 것입니다. 즉, 표준 입력에 제공된 초기 숫자 `n`에 함수 `f`를 반복적으로 적용하는 동안 생성되는 서로 다른 정수의 수를 계산합니다.

기본적으로 Kotlin은 JVM에서 실행되며 동적으로 크기가 조정된 배열(`ArrayList`), 해시 기반 맵 및 세트(`HashMap`/`HashSet`), 트리 기반 순서 맵 및 세트(`TreeMap`/`TreeSet`)와 같은 범용 컬렉션 및 데이터 구조를 갖춘 풍부하고 효율적인 컬렉션 라이브러리에 직접 액세스할 수 있습니다.
함수 `f`를 적용하는 동안 이미 도달한 값을 추적하기 위해 정수 해시 세트를 사용하여 문제에 대한 간단한 명령형 솔루션을 아래와 같이 작성할 수 있습니다.

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 이상" default>

```kotlin
fun main() {
    var n = readln().toInt() // 입력에서 정수 읽기
    val reached = HashSet<Int>() // 변경 가능한 해시 세트
    while (reached.add(n)) n = f(n) // 함수 f 반복
    println(reached.size) // 출력에 답 인쇄
}
```

경쟁적 프로그래밍에서는 잘못된 형식의 입력을 처리할 필요가 없습니다. 입력 형식은 경쟁적 프로그래밍에서 항상 정확하게 지정되며 실제 입력은 문제 설명의 입력 사양에서 벗어날 수 없습니다.
그렇기 때문에 Kotlin의 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 함수를 사용할 수 있습니다. 이 함수는 입력 문자열이 있는지 확인하고 그렇지 않으면 예외를 throw합니다. 마찬가지로 [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 함수는 입력 문자열이 정수가 아니면 예외를 throw합니다.

</TabItem>
<TabItem value="kotlin-1-5" label="이전 버전" default>

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 입력에서 정수 읽기
    val reached = HashSet<Int>() // 변경 가능한 해시 세트
    while (reached.add(n)) n = f(n) // 함수 f 반복
    println(reached.size) // 출력에 답 인쇄
}
```

Kotlin의
[null-단정 연산자](null-safety#not-null-assertion-operator) `!!`를
[readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 함수 호출 뒤에 사용합니다.
Kotlin의 `readLine()` 함수는
[nullable 타입](null-safety#nullable-types-and-non-nullable-types)
`String?`을 반환하도록 정의되어 있으며 입력 끝에 `null`을 반환하므로 개발자가 입력 누락의 경우를 명시적으로 처리해야 합니다.

경쟁적 프로그래밍에서는 잘못된 형식의 입력을 처리할 필요가 없습니다.
경쟁적 프로그래밍에서는 입력 형식이 항상 정확하게 지정되며 실제 입력은 문제 설명의 입력 사양에서 벗어날 수 없습니다.
null-단정 연산자 `!!`가 기본적으로 수행하는 작업은 입력 문자열이 있는지 확인하고 그렇지 않으면 예외를 throw하는 것입니다. 마찬가지로
[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)입니다.

</TabItem>
</Tabs>

모든 온라인 경쟁적 프로그래밍 이벤트에서는 미리 작성된 코드를 사용할 수 있으므로 실제 솔루션 코드를 더 쉽게 읽고 쓸 수 있도록 경쟁적 프로그래밍에 적합한 유틸리티 함수 라이브러리를 직접 정의할 수 있습니다.
그런 다음 이 코드를 솔루션 템플릿으로 사용합니다. 예를 들어 경쟁적 프로그래밍에서 입력을 읽기 위해 다음과 같은 도우미 함수를 정의할 수 있습니다.

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 이상" default>

```kotlin
private fun readStr() = readln() // 문자열 줄
private fun readInt() = readStr().toInt() // 단일 int
// 솔루션에서 사용할 다른 타입과 유사
```

</TabItem>
<TabItem value="kotlin-1-5" label="이전 버전" default>

```kotlin
private fun readStr() = readLine()!! // 문자열 줄
private fun readInt() = readStr().toInt() // 단일 int
// 솔루션에서 사용할 다른 타입과 유사
```

</TabItem>
</Tabs>

여기에서 `private` [가시성 수정자](visibility-modifiers)를 사용합니다.
가시성 수정자 개념은 경쟁적 프로그래밍과 전혀 관련이 없지만,
동일한 패키지에서 공개 선언이 충돌하여 오류가 발생하지 않고 동일한 템플릿을 기반으로 여러 솔루션 파일을 배치할 수 있습니다.

## 함수형 연산자 예제: Long Number 문제

더 복잡한 문제의 경우 Kotlin의 컬렉션에 대한 광범위한 함수형 연산 라이브러리가 상용구를 최소화하고 코드를 선형적인 위에서 아래로, 왼쪽에서 오른쪽으로의 유창한 데이터 변환 파이프라인으로 바꾸는 데 유용합니다.
예를 들어
[Problem B: Long Number](https://codeforces.com/contest/1157/problem/B) 문제는
구현할 간단한 탐욕적 알고리즘을 사용하며 단일 변경 가능한 변수 없이 이 스타일을 사용하여 작성할 수 있습니다.

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 이상" default>

```kotlin
fun main() {
    // 입력 읽기
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // 로컬 함수 f 정의
    fun f(c: Char) = '0' + fl[c - '1']
    // 첫 번째 및 마지막 인덱스를 탐욕적으로 찾기
    val i = s.indexOfFirst { c `->` f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) `->` j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 답변 구성 및 쓰기
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c `->` f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</TabItem>
<TabItem value="kotlin-1-5" label="이전 버전" default>

```kotlin
fun main() {
    // 입력 읽기
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // 로컬 함수 f 정의
    fun f(c: Char) = '0' + fl[c - '1']
    // 첫 번째 및 마지막 인덱스를 탐욕적으로 찾기
    val i = s.indexOfFirst { c `->` f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) `->` j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 답변 구성 및 쓰기
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c `->` f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</TabItem>
</Tabs>

이 빽빽한 코드에서는 컬렉션 변환 외에도 로컬 함수와
[엘비스 연산자](null-safety#elvis-operator) `?:`와 같은 편리한 Kotlin 기능을 볼 수 있습니다.
`.takeIf { it >= 0 } ?: s.length`와 같은 간결하고 읽기 쉬운 표현식으로 "값이 양수이면 가져오고 그렇지 않으면 길이를 사용"과 같은
[숙어](idioms)를 표현할 수 있지만, Kotlin에서 추가 변경 가능한 변수를 만들고 동일한 코드를 명령형 스타일로 표현하는 것도 완벽하게 괜찮습니다.

이와 같은 경쟁적 프로그래밍 작업에서 입력을 더 간결하게 읽으려면
다음과 같은 도우미 입력 읽기 함수 목록을 가질 수 있습니다.

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 이상" default>

```kotlin
private fun readStr() = readln() // 문자열 줄
private fun readInt() = readStr().toInt() // 단일 int
private fun readStrings() = readStr().split(" ") // 문자열 목록
private fun readInts() = readStrings().map { it.toInt() } // int 목록
```

</TabItem>
<TabItem value="kotlin-1-5" label="이전 버전" default>

```kotlin
private fun readStr() = readLine()!! // 문자열 줄
private fun readInt() = readStr().toInt() // 단일 int
private fun readStrings() = readStr().split(" ") // 문자열 목록
private fun readInts() = readStrings().map { it.toInt() } // int 목록
```

</TabItem>
</Tabs>

이러한 도우미를 사용하면 입력 읽기 코드가 더 간단해져서 문제 설명의 입력
사양을 줄 단위로 밀접하게 따릅니다.

```kotlin
// 입력 읽기
val n = readInt()
val s = readStr()
val fl = readInts()
```

경쟁적 프로그래밍에서는 코드를 한 번만 작성하고 이후에 지원하지 않으므로 산업 프로그래밍 관행에서 일반적인 것보다 변수 이름을 더 짧게 지정하는 것이 일반적입니다.
그러나 이러한 이름은 일반적으로 여전히 기억하기 쉽습니다. 배열의 경우 `a`,
인덱스의 경우 `i`, `j` 등, 테이블의 행 및 열 번호의 경우 `r` 및 `c`, 좌표의 경우 `x` 및 `y` 등입니다.
문제 설명에 제공된 대로 입력 데이터에 대해 동일한 이름을 유지하는 것이 더 쉽습니다.
그러나 더 복잡한 문제는 더 많은 코드를 필요로 하므로 더 길고 자체 설명적인
변수 및 함수 이름을 사용하게 됩니다.

## 추가 팁과 요령

경쟁적 프로그래밍 문제에는 다음과 같은 입력이 있는 경우가 많습니다.

입력의 첫 번째 줄에는 두 개의 정수 `n`과 `k`가 포함되어 있습니다.

Kotlin에서는 정수 목록에서
[구조 분해 선언](destructuring-declarations)을 사용하여 다음 문으로 이 줄을 간결하게 구문 분석할 수 있습니다.

```kotlin
val (n, k) = readInts()
```

덜 구조화된 입력 형식을 구문 분석하기 위해 JVM의 `java.util.Scanner` 클래스를 사용하고 싶을 수도 있습니다. Kotlin은 JVM 라이브러리와 잘 상호 작용하도록 설계되어 해당 라이브러리 사용이 Kotlin에서 매우 자연스럽게 느껴집니다.
그러나 `java.util.Scanner`는 매우 느립니다. 실제로 너무 느려서 10<sup>5</sup>개 이상의 정수를 구문 분석하는 것이 일반적인 2초 시간 제한에 맞지 않을 수 있지만, 간단한 Kotlin의
`split(" ").map { it.toInt() }`는 처리합니다.

Kotlin에서 출력을 작성하는 것은 일반적으로
[println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html)
호출과 Kotlin의
[문자열 템플릿](strings#string-templates)을 사용하여 간단합니다.
그러나 출력이 10<sup>5</sup>줄 이상을 포함하는 경우에는 주의해야 합니다.
Kotlin의 출력은 각 줄 후에 자동으로 플러시되므로 너무 많은 `println` 호출을 발행하는 것은 너무 느립니다.
배열 또는 목록에서 여러 줄을 더 빠르게 작성하는 방법은
[joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 함수를
`"
"`을 구분 기호로 사용하는 것입니다.

```kotlin
println(a.joinToString("
")) // 배열/목록의 각 요소를 별도의 줄로 표시
```

## Kotlin 배우기

Kotlin은 특히 Java를 이미 알고 있는 사람들에게 배우기 쉽습니다.
소프트웨어 개발자를 위한 Kotlin 기본 구문에 대한 간략한 소개는
[기본 구문](basic-syntax)부터 시작하는 웹사이트의 참조 섹션에서 직접 찾을 수 있습니다.

IDEA에는 기본 제공
[Java-to-Kotlin 변환기](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)가 있습니다.
Java에 익숙한 사람들이 해당 Kotlin 구문 구조를 배우는 데 사용할 수 있지만, 완벽하지 않으므로 Kotlin에 익숙해지고
[Kotlin 숙어](idioms)를 배우는 것이 좋습니다.

Kotlin 구문 및 Kotlin 표준 라이브러리의 API를 연구하는 데 유용한 리소스는
[Kotlin Koans](koans)입니다.