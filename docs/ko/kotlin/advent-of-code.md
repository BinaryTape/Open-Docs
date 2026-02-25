[//]: # (title: 이디옴틱한(Idiomatic) Kotlin으로 풀어보는 Advent of Code 퍼즐)

[Advent of Code](https://adventofcode.com/)는 매년 12월 1일부터 12월 25일까지 매일 휴일 테마의 퍼즐이 게시되는 연례 행사입니다. Advent of Code의 제작자인 [Eric Wastl](http://was.tl/)의 허락을 받아, 이 퍼즐들을 이디옴틱한(idiomatic) Kotlin 스타일로 해결하는 방법을 보여드립니다.

* [Advent of Code 2025](https://www.youtube.com/playlist?list=PLlFc5cFwUnmx9-VIcfxqhjHrwD3Lab4o4)
* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## Advent of Code 준비하기

Kotlin으로 Advent of Code 챌린지를 해결하기 위해 시작하고 실행하는 데 필요한 기본적인 팁을 안내해 드립니다.

* [이 GitHub 템플릿](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)을 사용하여 프로젝트를 생성하세요.
* Kotlin 개발자 에드보킷(Developer Advocate) Sebastian Aigner의 환영 영상을 확인해 보세요:

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: Calorie counting

[Kotlin Advent of Code 템플릿](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)과 [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html), [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)와 같이 Kotlin에서 문자열 및 컬렉션을 다루는 데 유용한 편의 함수에 대해 알아보세요. 확장 함수(extension functions)가 솔루션을 깔끔하게 구조화하는 데 어떻게 도움이 되는지 확인해 보세요.

* [Advent of Code](https://adventofcode.com/2022/day/1)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: Rock paper scissors

Kotlin의 `Char` 타입 연산을 이해하고, `Pair` 타입과 `to` 생성자가 패턴 매칭(pattern matching)과 어떻게 잘 어우러지는지 확인해 보세요. [`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 함수를 사용하여 직접 만든 객체를 정렬하는 방법을 이해해 보세요.

* [Advent of Code](https://adventofcode.com/2022/day/2)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: Rucksack reorganization

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 라이브러리가 코드의 성능 특성을 이해하는 데 어떤 도움이 되는지 알아보세요. `intersect`와 같은 집합 연산이 겹치는 데이터를 선택하는 데 어떻게 도움이 되는지 확인하고, 동일한 솔루션의 서로 다른 구현 간의 성능 비교를 확인해 보세요.

* [Advent of Code](https://adventofcode.com/2022/day/3)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: Camp cleanup

`infix` 및 `operator` 함수가 코드를 얼마나 더 표현력 있게 만들 수 있는지, 그리고 `String` 및 `IntRange` 타입에 대한 확장 함수가 입력을 파싱하는 것을 얼마나 쉽게 만드는지 확인해 보세요.

* [Advent of Code](https://adventofcode.com/2022/day/4)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: Supply stacks

팩토리 함수(factory functions)로 더 복잡한 객체를 구성하는 방법, 정규 표현식(regular expressions)을 사용하는 방법, 그리고 양방향 큐인 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 타입을 사용하는 방법에 대해 알아보세요.

* [Advent of Code](https://adventofcode.com/2022/day/5)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: Tuning trouble

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 라이브러리를 사용하여 동일한 솔루션의 16가지 변형에 대한 특성을 비교하며 더 심층적인 성능 조사를 확인해 보세요.

* [Advent of Code](https://adventofcode.com/2022/day/6)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: No space left on device

트리 구조(tree structures)를 모델링하는 방법을 배우고, 프로그래밍 방식으로 Kotlin 코드를 생성하는 데모를 확인해 보세요.

* [Advent of Code](https://adventofcode.com/2022/day/7)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: Treetop tree house

실제로 작동하는 `sequence` 빌더를 확인하고, 프로그램의 초안과 이디옴틱한 Kotlin 솔루션이 얼마나 다를 수 있는지 확인해 보세요(특별 게스트 Roman Elizarov와 함께합니다!).

* [Advent of Code](https://adventofcode.com/2022/day/8)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: Rope bridge

`run` 함수, 레이블이 지정된 반환(labeled returns), 그리고 `coerceIn`이나 `zipWithNext`와 같은 편리한 표준 라이브러리 함수를 확인해 보세요. `List` 및 `MutableList` 생성자를 사용하여 주어진 크기의 리스트를 구성하는 방법을 알아보고, 문제 설명을 바탕으로 Kotlin 기반의 시각화도 엿볼 수 있습니다.

* [Advent of Code](https://adventofcode.com/2022/day/9)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: Cathode-ray tube

범위(ranges)와 `in` 연산자가 범위 체크를 얼마나 자연스럽게 만드는지, 함수 파라미터가 어떻게 수신 객체(receivers)로 바뀔 수 있는지 알아보고, `tailrec` 수정자에 대해 간략히 살펴봅니다.

* [Advent of Code](https://adventofcode.com/2022/day/10)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: Monkey in the middle

가변적(mutable)이고 명령형(imperative)인 코드에서 불변(immutable) 및 읽기 전용 데이터 구조를 사용하는 더 함수형(functional)인 접근 방식으로 전환하는 방법을 확인해 보세요. 컨텍스트 리시버(context receivers)에 대해 알아보고, 게스트가 Advent of Code만을 위해 직접 시각화 라이브러리를 구축한 방법도 들어보세요.

* [Advent of Code](https://adventofcode.com/2022/day/11)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: Hill Climbing algorithm

큐(queues), `ArrayDeque`, 함수 참조(function references) 및 `tailrec` 수정자를 사용하여 Kotlin으로 경로 찾기 문제를 해결해 보세요.

* [Advent of Code](https://adventofcode.com/2022/day/12)에서 퍼즐 설명 읽기
* 영상에서 솔루션 확인하기:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> [Advent of Code 2021에 관한 블로그 포스트](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)를 읽어보세요.
> 
{style="tip"}

### Day 1: Sonar sweep

정수 쌍과 트리플(triplets)을 작업하기 위해 windowed 및 count 함수를 적용합니다.

* [Advent of Code](https://adventofcode.com/2021/day/1)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)에서 Anton Arhipov의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: Dive!

구조 분해 선언(destructuring declarations)과 `when` 표현식에 대해 알아봅니다.

* [Advent of Code](https://adventofcode.com/2021/day/2)에서 퍼즐 설명 읽기
* [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt)에서 Pasha Finkelshteyn의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: Binary diagnostic

2진수를 다루는 다양한 방법을 살펴봅니다.

* [Advent of Code](https://adventofcode.com/2021/day/3)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)에서 Sebastian Aigner의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: Giant squid

입력을 파싱하고 더 편리한 처리를 위해 일부 도메인 클래스(domain classes)를 도입하는 방법을 배웁니다.

* [Advent of Code](https://adventofcode.com/2021/day/4)에서 퍼즐 설명 읽기
* [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt)에서 Anton Arhipov의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> Advent of Code 2020 퍼즐에 대한 모든 솔루션은 [GitHub 저장소](https://github.com/kotlin-hands-on/advent-of-code-2020/)에서 찾을 수 있습니다.
>
{style="tip"}

### Day 1: Report repair

입력 처리, 리스트 순회, 맵(map)을 빌드하는 다양한 방법, 그리고 코드를 단순화하기 위해 [`let`](scope-functions.md#let) 함수를 사용하는 방법을 살펴봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/1)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)에서 Svetlana Isakova의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: Password philosophy

문자열 유틸리티 함수, 정규 표현식, 컬렉션 연산, 그리고 [`let`](scope-functions.md#let) 함수가 표현식을 변환하는 데 어떻게 도움이 되는지 살펴봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/2)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)에서 Svetlana Isakova의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: Toboggan trajectory

명령형 코드 스타일과 더 함수형인 코드 스타일을 비교하고, Pair와 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 함수를 사용해 보고, 열 선택 모드(column selection mode)에서 코드를 편집하며, 정수 오버플로(integer overflows)를 수정해 봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/3)에서 퍼즐 설명 읽기
* [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt)에서 Mikhail Dvorkin의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: Passport processing

[`when`](control-flow.md#when-expressions-and-statements) 표현식을 적용하고 유틸리티 함수, 범위(ranges) 사용, 집합 포함 여부 확인, 특정 정규 표현식 매칭 등 입력을 검증하는 다양한 방법을 살펴봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/4)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)에서 Sebastian Aigner의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: Binary boarding

Kotlin 표준 라이브러리 함수(`replace()`, `toInt()`, `find()`)를 사용하여 숫자의 2진 표현을 다루고, 강력한 로컬 함수(local functions)를 살펴보고, Kotlin 1.5에서 `max()` 함수를 사용하는 방법을 배웁니다.

* [Advent of Code](https://adventofcode.com/2020/day/5)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)에서 Svetlana Isakova의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: Custom customs

표준 라이브러리 함수 `map()`, `reduce()`, `sumOf()`, `intersect()`, `union()`을 사용하여 문자열과 컬렉션에서 문자를 그룹화하고 개수를 세는 방법을 배웁니다.

* [Advent of Code](https://adventofcode.com/2020/day/6)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)에서 Anton Arhipov의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: Handy haversacks

정규 표현식을 사용하는 방법, 맵의 값을 동적으로 계산하기 위해 Kotlin에서 Java HashMap의 `compute()` 메서드를 사용하는 방법, 파일을 읽기 위해 `forEachLine()` 함수를 사용하는 방법을 배우고 깊이 우선 탐색(DFS)과 너비 우선 탐색(BFS) 두 가지 유형의 탐색 알고리즘을 비교해 봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/7)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)에서 Pasha Finkelshteyn의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: Handheld halting

봉인된 클래스(sealed classes)와 람다를 적용하여 명령어를 표현하고, Kotlin 집합(sets)을 적용하여 프로그램 실행 중 루프를 발견하고, 시퀀스(sequences)와 `sequence { }` 빌더 함수를 사용하여 지연 컬렉션(lazy collection)을 구축하고, 성능 지표를 확인하기 위해 실험적인 `measureTimedValue()` 함수를 시도해 봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/8)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)에서 Sebastian Aigner의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: Encoding error

이디옴틱한 Kotlin 스타일을 잘 보여주는 `any()`, `firstOrNull()`, `firstNotNullOfOrNull()`, `windowed()`, `takeIf()`, `scan()` 함수를 사용하여 Kotlin에서 리스트를 조작하는 다양한 방법을 살펴봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/9)에서 퍼즐 설명 읽기
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)에서 Svetlana Isakova의 솔루션을 확인하거나 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 다음 단계는 무엇인가요?

* [Kotlin Koans](koans.md)로 더 많은 과제를 완료하세요.
* JetBrains Academy에서 제공하는 무료 [Kotlin Core 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)을 통해 실제 애플리케이션을 만들어 보세요.