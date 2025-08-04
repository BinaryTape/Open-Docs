[//]: # (title: 코틀린 관용구 방식으로 Advent of Code 퍼즐 해결하기)

[Advent of Code](https://adventofcode.com/)는 매년 12월에 열리는 행사로,
12월 1일부터 12월 25일까지 매일 홀리데이(휴일) 테마 퍼즐이 공개됩니다.
Advent of Code의 제작자인 [Eric Wastl](http://was.tl/)의 허가를 받아,
코틀린 관용구 방식을 사용하여 이 퍼즐들을 해결하는 방법을 보여드리겠습니다.

*   [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
*   [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
*   [](#advent-of-code-2022)
*   [](#advent-of-code-2021)
*   [](#advent-of-code-2020)

## Advent of Code를 준비하세요

코틀린으로 Advent of Code 챌린지를 해결하기 위한 기본적인 시작 및 실행 방법을 안내해 드립니다.

*   [이 GitHub 템플릿](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)을 사용하여 프로젝트를 생성하세요
*   코틀린 개발자 애드버킷 Sebastian Aigner의 환영 영상을 확인하세요:

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### 1일차: 칼로리 계산

[코틀린 Advent of Code 템플릿](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)과 `maxOf()` 및 `sumOf()`와 같이 코틀린에서 문자열과 컬렉션을 다루는 데 유용한 편의 함수에 대해 알아보세요.
확장 함수가 솔루션을 깔끔하게 구조화하는 데 어떻게 도움이 되는지 확인하세요.

*   [Advent of Code](https://adventofcode.com/2022/day/1)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### 2일차: 가위바위보

코틀린에서 `Char` 타입에 대한 연산을 이해하고, `Pair` 타입과 `to` 생성자가 패턴 매칭과 어떻게 잘 작동하는지 확인하세요.
`compareTo()` 함수를 사용하여 사용자 정의 객체를 정렬하는 방법을 이해하세요.

*   [Advent of Code](https://adventofcode.com/2022/day/2)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### 3일차: 배낭 재정비

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 라이브러리가 코드의 성능 특성을 이해하는 데 어떻게 도움이 되는지 알아보세요.
`intersect`와 같은 집합 연산이 겹치는 데이터를 선택하는 데 어떻게 도움이 되는지, 그리고 동일한 솔루션의 다양한 구현 간의 성능 비교를 확인하세요.

*   [Advent of Code](https://adventofcode.com/2022/day/3)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### 4일차: 캠프 정리

`infix` 및 `operator` 함수가 코드를 더 표현력 있게 만드는 방법과 `String` 및 `IntRange` 타입의 확장 함수가 입력을 쉽게 파싱할 수 있게 해주는 방법을 확인하세요.

*   [Advent of Code](https://adventofcode.com/2022/day/4)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### 5일차: 보급 스택

팩토리 함수로 더 복잡한 객체를 구성하는 방법, 정규 표현식 사용 방법, 그리고 양방향 `ArrayDeque` 타입에 대해 알아보세요.

*   [Advent of Code](https://adventofcode.com/2022/day/5)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### 6일차: 튜닝 문제

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 라이브러리를 사용하여 동일한 솔루션의 16가지 변형 특성을 비교하며 심층적인 성능 조사를 확인하세요.

*   [Advent of Code](https://adventofcode.com/2022/day/6)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### 7일차: 장치에 공간 부족

트리 구조를 모델링하는 방법을 배우고, 코틀린 코드를 프로그래밍 방식으로 생성하는 데모를 확인하세요.

*   [Advent of Code](https://adventofcode.com/2022/day/7)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### 8일차: 나무 꼭대기 트리 하우스

`sequence` 빌더가 작동하는 방식과 프로그램의 초안과 코틀린 관용구 방식 솔루션이 얼마나 다를 수 있는지 (특별 게스트 Roman Elizarov와 함께!) 확인하세요.

*   [Advent of Code](https://adventofcode.com/2022/day/8)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### 9일차: 밧줄 다리

`run` 함수, 라벨 붙은 반환, 그리고 `coerceIn`, `zipWithNext`와 같은 편리한 표준 라이브러리 함수를 확인하세요.
`List` 및 `MutableList` 생성자를 사용하여 주어진 크기의 리스트를 구성하는 방법과 문제 설명의 코틀린 기반 시각화를 살짝 엿보세요.

*   [Advent of Code](https://adventofcode.com/2022/day/9)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### 10일차: 음극선관

범위와 `in` 연산자가 범위 확인을 자연스럽게 만드는 방법, 함수 파라미터가 리시버로 전환될 수 있는 방법, 그리고 `tailrec` 수정자에 대한 간략한 탐구를 알아보세요.

*   [Advent of Code](https://adventofcode.com/2022/day/10)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### 11일차: 원숭이 한가운데

가변적이고 명령형 코드에서 불변 및 읽기 전용 데이터 구조를 활용하는 더 함수형 접근 방식으로 어떻게 전환할 수 있는지 확인하세요.
컨텍스트 리시버와 게스트가 Advent of Code만을 위해 자체 시각화 라이브러리를 구축한 방법에 대해 알아보세요.

*   [Advent of Code](https://adventofcode.com/2022/day/11)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### 12일차: 힐 클라이밍 알고리즘

큐, `ArrayDeque`, 함수 참조, 그리고 `tailrec` 수정자를 사용하여 코틀린으로 경로 찾기 문제를 해결합니다.

*   [Advent of Code](https://adventofcode.com/2022/day/12)에서 퍼즐 설명을 읽어보세요
*   영상에서 솔루션을 확인하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> [Advent of Code 2021에 대한 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)을 읽어보세요.
>
{style="tip"}

### 1일차: 소나 스윕

정수 쌍 및 삼중자와 함께 작동하도록 `windowed` 및 `count` 함수를 적용하세요.

*   [Advent of Code](https://adventofcode.com/2021/day/1)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Anton Arhipov의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### 2일차: 다이브!

구조 분해 선언과 `when` 표현식에 대해 알아보세요.

*   [Advent of Code](https://adventofcode.com/2021/day/2)에서 퍼즐 설명을 읽어보세요
*   GitHub에서 Pasha Finkelshteyn의 솔루션을 확인하거나 [여기](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### 3일차: 이진 진단

이진수 작업을 위한 다양한 방법을 탐색하세요.

*   [Advent of Code](https://adventofcode.com/2021/day/3)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Sebastian Aigner의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### 4일차: 거대한 오징어

입력을 파싱하는 방법과 더 편리한 처리를 위해 일부 도메인 클래스를 도입하는 방법을 알아보세요.

*   [Advent of Code](https://adventofcode.com/2021/day/4)에서 퍼즐 설명을 읽어보세요
*   GitHub에서 Anton Arhipov의 솔루션을 확인하거나 [여기](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> Advent of Code 2020 퍼즐의 모든 솔루션은 [GitHub 저장소](https://github.com/kotlin-hands-on/advent-of-code-2020/)에서 찾을 수 있습니다.
>
{style="tip"}

### 1일차: 보고서 복구

입력 처리, 리스트 반복, 맵을 구축하는 다양한 방법, 그리고 `let` 함수를 사용하여 코드를 단순화하는 방법을 탐색하세요.

*   [Advent of Code](https://adventofcode.com/2020/day/1)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Svetlana Isakova의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### 2일차: 암호 철학

문자열 유틸리티 함수, 정규 표현식, 컬렉션에 대한 연산, 그리고 `let` 함수가 표현식을 변환하는 데 어떻게 유용하게 사용될 수 있는지 탐색하세요.

*   [Advent of Code](https://adventofcode.com/2020/day/2)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Svetlana Isakova의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### 3일차: 터보건 궤적

명령형 코드 스타일과 더 함수형 코드 스타일을 비교하고, 쌍과 `reduce()` 함수를 사용하여 작업하며, 열 선택 모드에서 코드를 편집하고, 정수 오버플로를 수정합니다.

*   [Advent of Code](https://adventofcode.com/2020/day/3)에서 퍼즐 설명을 읽어보세요
*   GitHub에서 Mikhail Dvorkin의 솔루션을 확인하거나 [여기](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### 4일차: 여권 처리

`when` 표현식을 적용하고 입력을 유효성 검사하는 다양한 방법: 유틸리티 함수, 범위 작업, 집합 멤버십 확인, 특정 정규 표현식 매칭을 탐색하세요.

*   [Advent of Code](https://adventofcode.com/2020/day/4)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Sebastian Aigner의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### 5일차: 이진 탑승

코틀린 표준 라이브러리 함수 (`replace()`, `toInt()`, `find()`)를 사용하여 숫자의 이진 표현을 다루고, 강력한 지역 함수를 탐색하며, 코틀린 1.5에서 `max()` 함수를 사용하는 방법을 알아보세요.

*   [Advent of Code](https://adventofcode.com/2020/day/5)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Svetlana Isakova의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### 6일차: 맞춤 세관

`map()`, `reduce()`, `sumOf()`, `intersect()`, `union()`과 같은 표준 라이브러리 함수를 사용하여 문자열 및 컬렉션에서 문자를 그룹화하고 세는 방법을 알아보세요.

*   [Advent of Code](https://adventofcode.com/2020/day/6)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Anton Arhipov의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### 7일차: 편리한 휴대용 가방

정규 표현식 사용 방법, 코틀린에서 HashMap의 `compute()` Java 메서드를 사용하여 맵에서 값을 동적으로 계산하는 방법, `forEachLine()` 함수를 사용하여 파일을 읽는 방법, 그리고 깊이 우선 및 너비 우선이라는 두 가지 유형의 검색 알고리즘을 비교하는 방법을 알아보세요.

*   [Advent of Code](https://adventofcode.com/2020/day/7)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Pasha Finkelshteyn의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### 8일차: 휴대용 중단

sealed 클래스 및 람다를 적용하여 명령을 표현하고, 코틀린 집합을 적용하여 프로그램 실행의 루프를 발견하며, 시퀀스와 `sequence { }` 빌더 함수를 사용하여 지연 컬렉션을 구성하고, 실험적 `measureTimedValue()` 함수를 사용하여 성능 메트릭을 확인해보세요.

*   [Advent of Code](https://adventofcode.com/2020/day/8)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Sebastian Aigner의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### 9일차: 인코딩 오류

`any()`, `firstOrNull()`, `firstNotNullOfOrNull()`, `windowed()`, `takeIf()`, `scan()` 함수를 사용하여 코틀린에서 리스트를 조작하는 다양한 방법을 탐색하며, 이는 코틀린 관용구 방식을 잘 보여줍니다.

*   [Advent of Code](https://adventofcode.com/2020/day/9)에서 퍼즐 설명을 읽어보세요
*   Kotlin 블로그에서 Svetlana Isakova의 솔루션을 확인하거나 [여기](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)에서 영상을 시청하세요:

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 다음은 무엇인가요?

*   [Kotlin Koans](koans.md)로 더 많은 작업을 완료하세요
*   JetBrains Academy의 무료 [코틀린 코어 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)으로 작동하는 애플리케이션을 만드세요