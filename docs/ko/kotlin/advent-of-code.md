[//]: # (title: 관용적인 Kotlin으로 Advent of Code 퍼즐 풀기)

[Advent of Code](https://adventofcode.com/)는 매년 12월에 열리는 행사로, 12월 1일부터 12월 25일까지 매일 휴일 테마의 퍼즐이 공개됩니다. Advent of Code의 개발자 [Eric Wastl](http://was.tl/)의 허가를 받아, 관용적인 Kotlin 스타일로 이 퍼즐들을 푸는 방법을 보여드리겠습니다:

* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## Advent of Code를 위한 준비

Kotlin으로 Advent of Code 챌린지를 풀기 위한 기본적인 팁들을 알려드리겠습니다:

* [이 GitHub 템플릿](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)을 사용하여 프로젝트 생성
* Kotlin 개발자 옹호자 Sebastian Aigner의 환영 영상을 확인하세요:

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: 칼로리 계산

Kotlin의 문자열 및 컬렉션 작업을 위한 [Kotlin Advent of Code 템플릿](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)과 편의 함수(`maxOf()`, `sumOf()` 등)에 대해 알아보세요.
확장 함수가 솔루션을 깔끔하게 구성하는 데 어떻게 도움이 되는지 확인하세요.

* [Advent of Code](https://adventofcode.com/2022/day/1)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: 가위바위보

Kotlin에서 `Char` 타입에 대한 연산을 이해하고, `Pair` 타입과 `to` 생성자가 패턴 매칭과 어떻게 잘 작동하는지 확인하세요.
[`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 함수를 사용하여 자신만의 객체를 정렬하는 방법을 이해하세요.

* [Advent of Code](https://adventofcode.com/2022/day/2)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: 배낭 재정리

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 라이브러리가 코드의 성능 특성을 이해하는 데 어떻게 도움이 되는지 알아보세요.
`intersect`와 같은 집합 연산이 겹치는 데이터를 선택하는 데 어떻게 도움이 되는지, 그리고 동일한 솔루션의 다른 구현 간의 성능 비교를 확인하세요.

* [Advent of Code](https://adventofcode.com/2022/day/3)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: 캠프 정리

`infix` 및 `operator` 함수가 코드를 더 표현력 있게 만드는 방법과 `String` 및 `IntRange` 타입의 확장 함수가 입력을 쉽게 파싱하는 방법을 확인하세요.

* [Advent of Code](https://adventofcode.com/2022/day/4)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: 보급품 스택

팩토리 함수로 더 복잡한 객체를 구성하는 방법, 정규 표현식을 사용하는 방법, 그리고 양방향 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 타입에 대해 알아보세요.

* [Advent of Code](https://adventofcode.com/2022/day/5)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: 튜닝 문제

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 라이브러리를 사용하여 더 심층적인 성능 조사를 확인하고, 동일한 솔루션의 16가지 다른 변형 특성을 비교하세요.

* [Advent of Code](https://adventofcode.com/2022/day/6)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: 장치에 남은 공간 없음

트리 구조를 모델링하는 방법과 프로그래밍 방식으로 Kotlin 코드를 생성하는 데모를 확인하세요.

* [Advent of Code](https://adventofcode.com/2022/day/7)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: 나무 꼭대기 오두막

`sequence` 빌더가 작동하는 방식과 프로그램의 초안과 관용적인 Kotlin 솔루션이 얼마나 다를 수 있는지 확인하세요 (특별 게스트 Roman Elizarov와 함께!).

* [Advent of Code](https://adventofcode.com/2022/day/8)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: 밧줄 다리

`run` 함수, 레이블 있는 반환, 그리고 `coerceIn` 또는 `zipWithNext`와 같은 편리한 표준 라이브러리 함수를 확인하세요.
`List` 및 `MutableList` 생성자를 사용하여 주어진 크기의 리스트를 구성하는 방법과 문제 설명의 Kotlin 기반 시각화를 살짝 엿볼 수 있습니다.

* [Advent of Code](https://adventofcode.com/2022/day/9)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: 음극선관

범위와 `in` 연산자가 범위 확인을 자연스럽게 만드는 방법, 함수 매개변수가 리시버로 전환될 수 있는 방법, 그리고 `tailrec` 한정자에 대한 간략한 탐구를 알아보세요.

* [Advent of Code](https://adventofcode.com/2022/day/10)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: 가운데 원숭이

가변적이고 명령적인 코드에서 불변 및 읽기 전용 데이터 구조를 활용하는 보다 기능적인 접근 방식으로 전환하는 방법을 확인하세요.
컨텍스트 리시버와 게스트가 Advent of Code만을 위해 자신만의 시각화 라이브러리를 구축한 방법에 대해 알아보세요.

* [Advent of Code](https://adventofcode.com/2022/day/11)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: 언덕 오르기 알고리즘

큐, `ArrayDeque`, 함수 참조, 그리고 `tailrec` 한정자를 사용하여 Kotlin으로 경로 찾기 문제를 해결하세요.

* [Advent of Code](https://adventofcode.com/2022/day/12)에서 퍼즐 설명을 읽어보세요.
* 영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> [Advent of Code 2021에 대한 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)을 읽어보세요.
> 
{style="tip"}

### Day 1: 음파 탐지

정수 쌍 및 삼중자와 작업하기 위해 `windowed` 및 `count` 함수를 적용하세요.

* [Advent of Code](https://adventofcode.com/2021/day/1)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)에서 Anton Arhipov의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: 잠수!

비구조화 선언과 `when` 표현식에 대해 알아보세요.

* [Advent of Code](https://adventofcode.com/2021/day/2)에서 퍼즐 설명을 읽어보세요.
* [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt)에서 Pasha Finkelshteyn의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: 이진 진단

이진수와 작업하는 다양한 방법을 탐색하세요.

* [Advent of Code](https://adventofcode.com/2021/day/3)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)에서 Sebastian Aigner의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: 거대 오징어

입력을 파싱하고 더 편리한 처리를 위해 일부 도메인 클래스를 도입하는 방법을 알아보세요.

* [Advent of Code](https://adventofcode.com/2021/day/4)에서 퍼즐 설명을 읽어보세요.
* [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt)에서 Anton Arhipov의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> [GitHub 저장소](https://github.com/kotlin-hands-on/advent-of-code-2020/)에서 Advent of Code 2020 퍼즐의 모든 솔루션을 찾을 수 있습니다.
>
{style="tip"}

### Day 1: 보고서 수리

입력 처리, 리스트 반복, 맵을 구축하는 다양한 방법, 그리고 [`let`](scope-functions.md#let) 함수를 사용하여 코드를 단순화하는 방법을 탐색하세요.

* [Advent of Code](https://adventofcode.com/2020/day/1)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)에서 Svetlana Isakova의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: 암호 철학

문자열 유틸리티 함수, 정규 표현식, 컬렉션 연산, 그리고 [`let`](scope-functions.md#let) 함수가 표현식을 변환하는 데 어떻게 유용할 수 있는지 탐색하세요.

* [Advent of Code](https://adventofcode.com/2020/day/2)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)에서 Svetlana Isakova의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: 터보건 궤적

명령형 및 더 기능적인 코드 스타일을 비교하고, 쌍과 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 함수로 작업하며, 열 선택 모드에서 코드를 편집하고, 정수 오버플로를 수정하세요.

* [Advent of Code](https://adventofcode.com/2020/day/3)에서 퍼즐 설명을 읽어보세요.
* [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt)에서 Mikhail Dvorkin의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: 여권 처리

[`when`](control-flow.md#when-expressions-and-statements) 표현식을 적용하고 입력을 유효성 검사하는 다양한 방법을 탐색하세요: 유틸리티 함수, 범위 작업, 집합 멤버십 확인, 특정 정규 표현식 매칭.

* [Advent of Code](https://adventofcode.com/2020/day/4)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)에서 Sebastian Aigner의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: 이진 탑승

Kotlin 표준 라이브러리 함수(`replace()`, `toInt()`, `find()`)를 사용하여 숫자의 이진 표현과 작업하고, 강력한 로컬 함수를 탐색하며, Kotlin 1.5에서 `max()` 함수를 사용하는 방법을 알아보세요.

* [Advent of Code](https://adventofcode.com/2020/day/5)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)에서 Svetlana Isakova의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: 맞춤 세관

표준 라이브러리 함수(`map()`, `reduce()`, `sumOf()`, `intersect()`, `union()`)를 사용하여 문자열 및 컬렉션의 문자를 그룹화하고 세는 방법을 알아보세요.

* [Advent of Code](https://adventofcode.com/2020/day/6)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)에서 Anton Arhipov의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: 편리한 해버색

정규 표현식을 사용하는 방법, Kotlin에서 HashMap의 Java `compute()` 메서드를 사용하여 맵의 값을 동적으로 계산하는 방법, `forEachLine()` 함수를 사용하여 파일을 읽는 방법, 그리고 두 가지 유형의 검색 알고리즘(깊이 우선 및 너비 우선)을 비교하는 방법을 알아보세요.

* [Advent of Code](https://adventofcode.com/2020/day/7)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)에서 Pasha Finkelshteyn의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: 휴대용 중단

`sealed classes`와 `lambdas`를 적용하여 명령어를 표현하고, Kotlin 세트를 적용하여 프로그램 실행의 루프를 발견하며, 시퀀스와 `sequence { }` 빌더 함수를 사용하여 지연 컬렉션을 구성하고, 실험적인 `measureTimedValue()` 함수를 시도하여 성능 메트릭을 확인하세요.

* [Advent of Code](https://adventofcode.com/2020/day/8)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)에서 Sebastian Aigner의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: 인코딩 오류

관용적인 Kotlin 스타일을 보여주는 `any()`, `firstOrNull()`, `firstNotNullOfOrNull()`, `windowed()`, `takeIf()`, `scan()` 함수를 사용하여 Kotlin에서 리스트를 조작하는 다양한 방법을 탐색하세요.

* [Advent of Code](https://adventofcode.com/2020/day/9)에서 퍼즐 설명을 읽어보세요.
* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)에서 Svetlana Isakova의 솔루션을 확인하거나 다음 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 다음 단계는?

* [Kotlin Koans](koans.md)로 더 많은 작업을 완료하세요
* JetBrains Academy의 무료 [Kotlin Core 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)으로 작동하는 애플리케이션을 만드세요