<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 코루틴 가이드)

Kotlin은 다른 라이브러리가 코루틴을 활용할 수 있도록 표준 라이브러리에 최소한의 저수준(low-level) API만을 제공합니다. 비슷한 기능을 가진 다른 많은 언어들과 달리, Kotlin에서는 `async`와 `await`가 키워드가 아니며, 심지어 표준 라이브러리의 일부도 아닙니다. 더 나아가, Kotlin의 _정지 함수(suspending function)_ 개념은 퓨처(futures)와 프로미스(promises)보다 비동기 작업을 위한 더 안전하고 오류 발생 가능성이 적은 추상화를 제공합니다.

`kotlinx.coroutines`는 JetBrains에서 개발한 코루틴용으로 풍부한 기능을 제공하는 라이브러리입니다. 이 가이드에서 다루는 `launch`, `async` 등을 포함하여 코루틴을 활성화하는 여러 고수준 기본 요소(primitives)를 포함하고 있습니다.

이 가이드는 `kotlinx.coroutines`의 핵심 기능에 대한 내용을 여러 예제와 함께 다양한 주제로 나누어 설명합니다.

코루틴을 사용하고 이 가이드의 예제를 따라 하려면, [프로젝트 README](https://github.com/Kotlin/kotlinx.coroutines/blob/master/README.md#using-in-your-projects)에 설명된 대로 `kotlinx-coroutines-core` 모듈에 대한 의존성(dependency)을 추가해야 합니다.

## 목차

*   [코루틴 기초](coroutines-basics.md)
*   [튜토리얼: 코루틴 및 채널 소개](coroutines-and-channels.md)
*   [취소 및 타임아웃](cancellation-and-timeouts.md)
*   [정지 함수 조합하기](composing-suspending-functions.md)
*   [코루틴 컨텍스트 및 디스패처](coroutine-context-and-dispatchers.md)
*   [비동기 Flow](flow.md)
*   [채널](channels.md)
*   [코루틴 예외 처리](exception-handling.md)
*   [공유 가변 상태 및 동시성](shared-mutable-state-and-concurrency.md)
*   [Select 표현식 (실험적)](select-expression.md)
*   [튜토리얼: IntelliJ IDEA를 사용하여 코루틴 디버그](debug-coroutines-with-idea.md)
*   [튜토리얼: IntelliJ IDEA를 사용하여 Kotlin Flow 디버그](debug-flow-with-idea.md)

## 추가 자료

*   [코루틴을 활용한 UI 프로그래밍 가이드](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
*   [코루틴 설계 문서 (KEEP)](https://github.com/Kotlin/KEEP/blob/master/proposals/coroutines.md)
*   [전체 kotlinx.coroutines API 참조](https://kotlinlang.org/api/kotlinx.coroutines/)
*   [Android에서 코루틴 모범 사례](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
*   [Kotlin 코루틴 및 Flow를 위한 추가 Android 자료](https://developer.android.com/kotlin/coroutines/additional-resources)