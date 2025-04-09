---
title: "관용적인 Kotlin으로 풀어보는 Advent of Code 퍼즐"
---
[Advent of Code](https://adventofcode.com/)는 매년 12월에 열리는 이벤트로, 12월 1일부터 25일까지 매일 휴일 테마의 퍼즐이 게시됩니다. [Advent of Code](https://adventofcode.com/)의 제작자인 [Eric Wastl](http://was.tl/)의 허가를 받아 관용적인 Kotlin 스타일을 사용하여 이러한 퍼즐을 해결하는 방법을 보여드리겠습니다.

* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## Advent of Code 준비하기

Kotlin으로 Advent of Code 챌린지를 해결하는 방법을 시작하고 실행하는 기본 팁을 안내합니다.

* [이 GitHub 템플릿](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)을 사용하여 프로젝트 만들기
* Kotlin Developer Advocate인 Sebastian Aigner의 환영 비디오를 확인하세요.

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: Calorie counting

[Kotlin Advent of Code template](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)과 Kotlin에서 문자열 및 컬렉션 작업을 위한 편의 함수(예: [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) 및 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html))에 대해 알아봅니다.
확장 함수가 멋진 방식으로 솔루션을 구성하는 데 어떻게 도움이 되는지 확인하세요.

* [Advent of Code](https://adventofcode.com/2022/day/1)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: Rock paper scissors

Kotlin에서 `Char` 유형에 대한 연산을 이해하고, `Pair` 유형과 `to` 생성자가 패턴 매칭과 어떻게 잘 작동하는지 확인하세요.
[`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 함수를 사용하여 자신의 객체를 정렬하는 방법을 이해하세요.

* [Advent of Code](https://adventofcode.com/2022/day/2)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: Rucksack reorganization

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 라이브러리가 코드의 성능 특성을 이해하는 데 어떻게 도움이 되는지 알아봅니다.
`intersect`와 같은 집합 연산이 겹치는 데이터를 선택하는 데 어떻게 도움이 되는지 확인하고, 동일한 솔루션의 다양한 구현 간의 성능 비교를 확인하세요.

* [Advent of Code](https://adventofcode.com/2022/day/3)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: Camp cleanup

`infix` 및 `operator` 함수가 코드를 더 표현력 있게 만들 수 있는 방법과 `String` 및 `IntRange` 유형에 대한 확장 함수가 입력을 쉽게 구문 분석할 수 있도록 하는 방법을 확인하세요.

* [Advent of Code](https://adventofcode.com/2022/day/4)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: Supply stacks

팩토리 함수로 더 복잡한 객체를 구성하는 방법, 정규 표현식을 사용하는 방법, 양방향 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 유형에 대해 알아봅니다.

* [Advent of Code](https://adventofcode.com/2022/day/5)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: Tuning trouble

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 라이브러리를 사용하여 더 심층적인 성능 조사를 보고, 동일한 솔루션의 16가지 변형의 특성을 비교합니다.

* [Advent of Code](https://adventofcode.com/2022/day/6)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: No space left on device

트리 구조를 모델링하는 방법을 배우고, Kotlin 코드를 프로그래밍 방식으로 생성하는 데모를 확인하세요.

* [Advent of Code](https://adventofcode.com/2022/day/7)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: Treetop tree house

실행 중인 `sequence` 빌더와
프로그램의 첫 번째 초안과 관용적인 Kotlin 솔루션이 얼마나 다를 수 있는지 확인하세요(특별 게스트 Roman Elizarov와 함께!).

* [Advent of Code](https://adventofcode.com/2022/day/8)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: Rope bridge

`run` 함수, 레이블이 지정된 반환 및 `coerceIn` 또는 `zipWithNext`와 같은 편리한 표준 라이브러리 함수를 확인하세요.
`List` 및 `MutableList` 생성자를 사용하여 주어진 크기의 목록을 구성하는 방법을 확인하고, 문제 설명에 대한 Kotlin 기반 시각화를 살펴보세요.

* [Advent of Code](https://adventofcode.com/2022/day/9)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: Cathode-ray tube

범위와 `in` 연산자가 범위를 자연스럽게 확인하는 방법, 함수 매개변수를 수신기로 바꿀 수 있는 방법, `tailrec` 수정자에 대한 간략한 탐색을 알아봅니다.

* [Advent of Code](https://adventofcode.com/2022/day/10)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: Monkey in the middle

가변적인
명령형 코드에서 불변 및 읽기 전용 데이터 구조를 사용하는 보다 기능적인 접근 방식으로 이동하는 방법을 확인하세요.
컨텍스트 수신기와 손님이 Advent of Code를 위해 자신의 시각화 라이브러리를 구축한 방법을 알아보세요.

* [Advent of Code](https://adventofcode.com/2022/day/11)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: Hill Climbing algorithm

큐, `ArrayDeque`, 함수 참조 및 `tailrec` 수정자를 사용하여 Kotlin으로 경로 찾기 문제를 해결합니다.

* [Advent of Code](https://adventofcode.com/2022/day/12)에서 퍼즐 설명을 읽어보세요.
* 비디오에서 솔루션을 확인하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

:::tip
[Advent of Code 2021에 대한 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)을 읽어보세요.

:::

### Day 1: Sonar sweep

windowed 및 count 함수를 적용하여 정수의 쌍 및 세 쌍으로 작업합니다.

* [Advent of Code](https://adventofcode.com/2021/day/1)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)에서 Anton Arhipov의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: Dive!

구조 분해 선언과 `when` 표현식에 대해 알아봅니다.

* [Advent of Code](https://adventofcode.com/2021/day/2)에서 퍼즐 설명을 읽어보세요.
* [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt)에서 Pasha Finkelshteyn의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: Binary diagnostic

이진수로 작업하는 다양한 방법을 살펴보세요.

* [Advent of Code](https://adventofcode.com/2021/day/3)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)에서 Sebastian Aigner의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: Giant squid

입력을 구문 분석하고 보다 편리한 처리를 위해 일부 도메인 클래스를 도입하는 방법을 알아봅니다.

* [Advent of Code](https://adventofcode.com/2021/day/4)에서 퍼즐 설명을 읽어보세요.
* [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt)에서 Anton Arhipov의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

:::tip
[GitHub 리포지토리](https://github.com/kotlin-hands-on/advent-of-code-2020/)에서 Advent of Code 2020 퍼즐에 대한 모든 솔루션을 찾을 수 있습니다.

:::

### Day 1: Report repair

입력 처리, 목록 반복, 맵 구축의 다양한 방법, [`let`](scope-functions#let)을 사용하는 방법을 살펴보세요.
함수를 사용하여 코드를 단순화합니다.

* [Advent of Code](https://adventofcode.com/2020/day/1)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)에서 Svetlana Isakova의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: Password philosophy

문자열 유틸리티 함수, 정규 표현식, 컬렉션 작업 및 [`let`](scope-functions#let)이 어떻게 작동하는지 살펴보세요.
함수는 표현식을 변환하는 데 유용할 수 있습니다.

* [Advent of Code](https://adventofcode.com/2020/day/2)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)에서 Svetlana Isakova의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: Toboggan trajectory

명령형 및 보다 기능적인 코드 스타일을 비교하고, 쌍 및 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)로 작업합니다.
함수, 열 선택 모드에서 코드를 편집하고, 정수 오버플로를 수정합니다.

* [Advent of Code](https://adventofcode.com/2020/day/3)에서 퍼즐 설명을 읽어보세요.
* [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt)에서 Mikhail Dvorkin의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: Passport processing

[`when`](control-flow#when-expressions-and-statements) 표현식을 적용하고 입력 유효성을 검사하는 다양한 방법을 살펴보세요.
유틸리티 함수, 범위 작업, 집합 멤버십 확인 및 특정 정규 표현식과 일치합니다.

* [Advent of Code](https://adventofcode.com/2020/day/4)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)에서 Sebastian Aigner의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: Binary boarding

Kotlin 표준 라이브러리 함수(`replace()`, `toInt()`, `find()`)를 사용하여 숫자의 이진 표현으로 작업하고, 강력한 로컬 함수를 탐색하고, Kotlin 1.5에서 `max()` 함수를 사용하는 방법을 배웁니다.

* [Advent of Code](https://adventofcode.com/2020/day/5)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)에서 Svetlana Isakova의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: Custom customs

표준 라이브러리 함수(`map()`,
`reduce()`, `sumOf()`, `intersect()` 및 `union()`)를 사용하여 문자열 및 컬렉션에서 문자를 그룹화하고 계산하는 방법을 알아봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/6)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)에서 Anton Arhipov의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: Handy haversacks

정규 표현식을 사용하고, Kotlin에서 Java의 `compute()` 메서드를 사용하여 맵의 값에 대한 동적 계산을 위해 HashMaps를 사용하고, `forEachLine()` 함수를 사용하여 파일을 읽고, 두 가지 유형의 검색 알고리즘(깊이 우선 및 너비 우선)을 비교하는 방법을 알아봅니다.

* [Advent of Code](https://adventofcode.com/2020/day/7)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)에서 Pasha Finkelshteyn의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: Handheld halting

봉인된 클래스와 람다를 적용하여 명령을 나타내고, Kotlin 집합을 적용하여 프로그램 실행에서 루프를 검색하고, 시퀀스와 `sequence { }` 빌더 함수를 사용하여 지연 컬렉션을 구성하고, 실험적인
`measureTimedValue()` 함수를 사용하여 성능 메트릭을 확인합니다.

* [Advent of Code](https://adventofcode.com/2020/day/8)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)에서 Sebastian Aigner의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: Encoding error

`any()`, `firstOrNull()`, `firstNotNullOfOrNull()`,
`windowed()`, `takeIf()` 및 `scan()` 함수를 사용하여 Kotlin에서 목록을 조작하는 다양한 방법을 살펴보고, 이는 관용적인 Kotlin 스타일을 보여줍니다.

* [Advent of Code](https://adventofcode.com/2020/day/9)에서 퍼즐 설명을 읽어보세요.
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)에서 Svetlana Isakova의 솔루션을 확인하거나 비디오를 시청하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 다음 단계는 무엇입니까?

* [Kotlin Koans](koans)로 더 많은 작업 완료
* JetBrains Academy의 무료 [Kotlin Core 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)으로 작동하는 애플리케이션 만들기