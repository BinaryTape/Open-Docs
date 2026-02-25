[//]: # (title: 경쟁 프로그래밍을 위한 코틀린)

이 튜토리얼은 코틀린을 사용해 본 적이 없는 경쟁 프로그래밍(Competitive Programming) 참가자와 경쟁 프로그래밍 이벤트에 참여해 본 적이 없는 코틀린 개발자 모두를 위해 작성되었습니다. 이 글은 독자가 기본적인 프로그래밍 기술을 갖추고 있다고 가정합니다.

[경쟁 프로그래밍](https://en.wikipedia.org/wiki/Competitive_programming)은 엄격한 제약 조건 내에서 정밀하게 명시된 알고리즘 문제를 해결하는 프로그램을 작성하는 두뇌 스포츠입니다. 문제는 소프트웨어 개발자라면 누구나 풀 수 있고 정답을 맞히기 위해 적은 양의 코드만 필요한 간단한 것부터, 특수한 알고리즘과 자료 구조에 대한 지식 및 많은 연습을 요구하는 복잡한 것까지 다양합니다. 코틀린은 경쟁 프로그래밍을 위해 특별히 설계된 언어는 아니지만, 우연히도 이 분야에 매우 잘 맞습니다. 코틀린은 정적 타입 언어의 도구 지원과 성능을 갖추면서도, 프로그래머가 작성하고 읽어야 하는 전형적인 보일러플레이트(boilerplate) 코드를 동적 타입 스크립트 언어 수준으로 줄여주기 때문입니다.

IntelliJ IDEA에서 코틀린 프로젝트를 만드는 방법에 대한 자세한 내용은 [콘솔 앱 만들기](jvm-get-started.md) 튜토리얼을 참고하세요. 경쟁 프로그래밍에서는 보통 단일 프로젝트를 생성하고, 각 문제의 해결책을 단일 소스 파일에 작성합니다.

## 간단한 예제: Reachable Numbers 문제

구체적인 예를 살펴보겠습니다.

[Codeforces](https://codeforces.com/) Round 555가 4월 26일에 3rd Division을 대상으로 열렸습니다. 이는 모든 개발자가 시도해 볼 만한 문제들로 구성되었음을 의미합니다. [이 링크](https://codeforces.com/contest/1157)를 통해 문제들을 읽어볼 수 있습니다. 이 세트에서 가장 간단한 문제는 [Problem A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A)입니다. 이 문제는 문제 설명에 기술된 간단한 알고리즘을 구현할 것을 요구합니다.

임의의 이름을 가진 코틀린 소스 파일을 만드는 것부터 시작해 봅시다. `A.kt`가 적당할 것입니다. 먼저, 문제 설명에 명시된 다음과 같은 함수를 구현해야 합니다.

함수 f(x)를 다음과 같이 정의합시다. x에 1을 더한 후, 결과값에 하나 이상의 뒤따르는 0(trailing zero)이 있는 동안 그 0을 제거합니다.

코틀린은 실용적이고 편견이 없는 언어로, 개발자에게 특정 스타일을 강요하지 않으면서 명령형과 함수형 프로그래밍 스타일을 모두 지원합니다. [꼬리 재귀(tail recursion)](functions.md#tail-recursive-functions)와 같은 코틀린의 기능을 사용하여 함수 `f`를 함수형 스타일로 구현할 수 있습니다.

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

또는, 코틀린에서 [`var`](basic-syntax.md#variables)로 표시되는 가변 변수와 전통적인 [while 루프](control-flow.md)를 사용하여 함수 `f`를 명령형으로 구현할 수도 있습니다.

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

코틀린의 타입은 광범위한 타입 추론 덕분에 많은 곳에서 생략 가능하지만, 모든 선언은 여전히 컴파일 시점에 알 수 있는 잘 정의된 정적 타입을 가집니다.

이제 입력값을 읽고 문제에서 요구하는 나머지 알고리즘을 구현하는 메인 함수를 작성하기만 하면 됩니다. 즉, 표준 입력으로 주어진 초기 숫자 `n`에 함수 `f`를 반복적으로 적용하면서 생성되는 서로 다른 정수의 개수를 계산하는 것입니다.

기본적으로 코틀린은 JVM에서 실행되며, 동적 크기 배열(`ArrayList`), 해시 기반 맵 및 셋(`HashMap`/`HashSet`), 트리 기반 정렬 맵 및 셋(`TreeMap`/`TreeSet`)과 같은 범용 컬렉션 및 자료 구조를 갖춘 풍부하고 효율적인 컬렉션 라이브러리에 직접 접근할 수 있습니다. 함수 `f`를 적용하는 동안 이미 도달한 값을 추적하기 위해 정수형 해시 셋을 사용하면, 문제의 해결책을 다음과 같이 직관적인 명령형 버전으로 작성할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 입력에서 정수를 읽음
    val reached = HashSet<Int>() // 가변 해시 셋
    while (reached.add(n)) n = f(n) // 함수 f를 반복 적용
    println(reached.size) // 결과 출력
}
```

경쟁 프로그래밍에서는 잘못된 형식의 입력을 처리할 필요가 없습니다. 입력 형식은 항상 정밀하게 지정되며, 실제 입력이 문제 설명의 입력 명세와 다를 수 없기 때문입니다. 이것이 코틀린의 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 함수를 사용할 수 있는 이유입니다. 이 함수는 입력 문자열이 존재한다고 단언하며, 그렇지 않으면 예외를 발생시킵니다. 마찬가지로 [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 함수도 입력 문자열이 정수가 아니면 예외를 발생시킵니다.

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 입력에서 정수를 읽음
    val reached = HashSet<Int>() // 가변 해시 셋
    while (reached.add(n)) n = f(n) // 함수 f를 반복 적용
    println(reached.size) // 결과 출력
}
```

[`readLine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 함수 호출 뒤에 코틀린의 [null 단언 연산자(null-assertion operator)](null-safety.md#not-null-assertion-operator) `!!`가 사용된 것에 주목하세요. 코틀린의 `readLine()` 함수는 [널 가능 타입(nullable type)](null-safety.md#nullable-types-and-non-nullable-types) `String?`을 반환하도록 정의되어 있으며, 입력의 끝에서 `null`을 반환합니다. 이는 개발자가 입력이 없는 경우를 명시적으로 처리하도록 강제합니다.

경쟁 프로그래밍에서는 잘못된 형식의 입력을 처리할 필요가 없습니다. 입력 형식은 항상 정밀하게 지정되며, 실제 입력이 문제 설명의 입력 명세와 다를 수 없기 때문입니다. 이것이 바로 null 단언 연산자 `!!`가 하는 일입니다. 즉, 입력 문자열이 존재한다고 단언하며 그렇지 않으면 예외를 발생시킵니다. 마찬가지로 [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 함수도 동일하게 동작합니다.

</tab>
</tabs>

모든 온라인 경쟁 프로그래밍 이벤트는 미리 작성된 코드의 사용을 허용하므로, 실제 해결 코드를 읽고 쓰기 쉽게 만들기 위해 경쟁 프로그래밍에 적합한 유틸리티 함수 라이브러리를 직접 정의할 수 있습니다. 그런 다음 이 코드를 문제 해결을 위한 템플릿으로 사용할 수 있습니다. 예를 들어, 경쟁 프로그래밍에서 입력을 읽기 위해 다음과 같은 헬퍼 함수들을 정의할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 한 줄의 문자열
private fun readInt() = readStr().toInt() // 단일 정수
// 문제 해결에 사용할 다른 타입들에 대해서도 유사하게 정의
```

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 한 줄의 문자열
private fun readInt() = readStr().toInt() // 단일 정수
// 문제 해결에 사용할 다른 타입들에 대해서도 유사하게 정의
```

</tab>
</tabs>

여기서 `private` [가시성 수정자(visibility modifier)](visibility-modifiers.md)를 사용한 것에 주목하세요. 가시성 수정자의 개념은 경쟁 프로그래밍 자체와는 전혀 상관없지만, 이를 통해 동일한 패키지 내에서 동일한 템플릿을 기반으로 한 여러 해결책 파일들을 공용(public) 선언 충돌 에러 없이 배치할 수 있습니다.

## 함수형 연산자 예제: Long Number 문제

더 복잡한 문제의 경우, 컬렉션에 대한 코틀린의 방대한 함수형 연산 라이브러리를 사용하면 보일러플레이트를 최소화하고 코드를 위에서 아래로, 왼쪽에서 오른쪽으로 흐르는 유연한 데이터 변환 파이프라인으로 전환하는 데 도움이 됩니다. 예를 들어, [Problem B: Long Number](https://codeforces.com/contest/1157/problem/B) 문제는 간단한 그리디(greedy) 알고리즘으로 구현할 수 있으며, 가변 변수 하나 없이 다음과 같은 스타일로 작성할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
fun main() {
    // 입력 읽기
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // 로컬 함수 f 정의
    fun f(c: Char) = '0' + fl[c - '1']
    // 그리디하게 첫 번째와 마지막 인덱스 찾기
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 결과 조합 및 출력
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
    // 입력 읽기
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // 로컬 함수 f 정의
    fun f(c: Char) = '0' + fl[c - '1']
    // 그리디하게 첫 번째와 마지막 인덱스 찾기
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 결과 조합 및 출력
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

이 간결한 코드에서는 컬렉션 변환 외에도 로컬 함수나 [엘비스 연산자(elvis operator)](null-safety.md#elvis-operator) `?:`와 같은 편리한 코틀린 기능들을 볼 수 있습니다. 이러한 기능들 덕분에 "값이 양수이면 취하고 아니면 길이를 사용하라"와 같은 [관용구(idioms)](idioms.md)를 `.takeIf { it >= 0 } ?: s.length`와 같이 간결하고 가독성 높게 표현할 수 있습니다. 물론 코틀린에서 추가적인 가변 변수를 만들고 동일한 코드를 명령형 스타일로 표현하는 것도 완벽하게 괜찮습니다.

이와 같은 경쟁 프로그래밍 작업에서 입력을 더 간결하게 읽기 위해 다음과 같은 입력 읽기 헬퍼 함수 목록을 사용할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 한 줄의 문자열
private fun readInt() = readStr().toInt() // 단일 정수
private fun readStrings() = readStr().split(" ") // 문자열 리스트
private fun readInts() = readStrings().map { it.toInt() } // 정수 리스트
```

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 한 줄의 문자열
private fun readInt() = readStr().toInt() // 단일 정수
private fun readStrings() = readStr().split(" ") // 문자열 리스트
private fun readInts() = readStrings().map { it.toInt() } // 정수 리스트
```

</tab>
</tabs>

이러한 헬퍼 함수들을 사용하면 입력을 읽는 코드 부분이 문제 설명의 입력 명세를 줄 단위로 밀접하게 따르면서 훨씬 단순해집니다.

```kotlin
// 입력 읽기
val n = readInt()
val s = readStr()
val fl = readInts()
```

경쟁 프로그래밍에서는 코드를 한 번만 작성하고 유지보수하지 않기 때문에, 일반적인 산업 프로그래밍 관행보다 변수 이름을 짧게 짓는 것이 관례입니다. 하지만 이러한 이름들은 보통 여전히 기억하기 쉬운 편입니다. 배열은 `a`, 인덱스는 `i`, `j` 등, 표의 행과 열 번호는 `r`, `c`, 좌표는 `x`, `y` 등을 사용합니다. 문제 설명에 주어진 입력 데이터와 동일한 이름을 유지하는 것이 가장 쉽습니다. 하지만 문제가 복잡해질수록 더 많은 코드가 필요하게 되며, 이는 더 길고 자기 설명적인 변수 및 함수 이름을 사용하는 것으로 이어집니다.

## 추가 팁과 요령

경쟁 프로그래밍 문제에는 종종 다음과 같은 입력이 주어집니다.

입력의 첫 번째 줄에는 두 개의 정수 `n`과 `k`가 포함됩니다.

코틀린에서 이 줄은 정수 리스트로부터 [구조 분해 선언(destructuring declaration)](destructuring-declarations.md)을 사용하여 다음과 같이 간결하게 파싱할 수 있습니다.

```kotlin
val (n, k) = readInts()
```

구조화가 덜 된 입력 형식을 파싱하기 위해 JVM의 `java.util.Scanner` 클래스를 사용하고 싶을 수도 있습니다. 코틀린은 JVM 라이브러리와 잘 상호운용되도록 설계되어 있어 코틀린에서 이를 사용하는 것이 꽤 자연스럽게 느껴집니다. 하지만 `java.util.Scanner`는 매우 느리다는 점에 주의해야 합니다. 사실 너무 느려서 10<sup>5</sup>개 이상의 정수를 파싱할 때 전형적인 2초의 시간 제한을 맞추지 못할 수도 있습니다. 반면 코틀린의 단순한 `split(" ").map { it.toInt() }`는 이를 충분히 처리할 수 있습니다.

코틀린에서 출력을 작성하는 것은 보통 [`println(...)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 호출과 코틀린의 [문자열 템플릿(string templates)](strings.md#string-templates)을 사용하여 직관적으로 할 수 있습니다. 그러나 출력이 10<sup>5</sup>행 이상일 때는 주의해야 합니다. 코틀린의 출력은 각 줄 뒤에 자동으로 플러시(flush)되기 때문에 그렇게 많은 `println`을 호출하는 것은 너무 느립니다. 배열이나 리스트에서 많은 줄을 더 빠르게 작성하는 방법은 다음과 같이 `"
"`을 구분자로 사용하는 [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 함수를 사용하는 것입니다.

```kotlin
println(a.joinToString("
")) // 배열/리스트의 각 요소를 개별 줄에 출력
```

## 코틀린 학습하기

코틀린은 배우기 쉬우며, 특히 이미 자바를 알고 있는 사람들에게는 더욱 그렇습니다. 소프트웨어 개발자를 위한 코틀린의 기본 문법에 대한 짧은 소개는 웹사이트의 [기본 문법(basic syntax)](basic-syntax.md) 섹션부터 시작하여 레퍼런스 섹션에서 직접 찾아볼 수 있습니다.

IDEA에는 내장된 [Java-to-Kotlin 컨버터](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)가 있습니다. 자바에 익숙한 사람들이 대응하는 코틀린 문법 구조를 배우기 위해 이를 사용할 수 있지만, 완벽하지는 않으므로 여전히 코틀린에 익숙해지고 [코틀린 관용구(Kotlin idioms)](idioms.md)를 익히는 것이 가치가 있습니다.

코틀린 문법과 코틀린 표준 라이브러리의 API를 공부하기에 아주 좋은 리소스는 [Kotlin Koans](koans.md)입니다.