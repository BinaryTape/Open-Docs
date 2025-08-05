[//]: # (title: 코루틴)

앱은 종종 사용자 입력에 응답하거나, 데이터를 로드하거나, 화면을 업데이트하는 등 여러 작업을 동시에 수행해야 합니다.
이를 지원하기 위해, 앱은 작업이 서로를 블로킹하지 않고 독립적으로 실행될 수 있도록 하는 동시성(concurrency)에 의존합니다.

작업을 동시에 실행하는 가장 일반적인 방법은 운영 체제에 의해 관리되는 독립적인 실행 경로인 스레드(threads)를 사용하는 것입니다.
하지만 스레드는 상대적으로 무겁고, 많은 스레드를 생성하면 성능 문제가 발생할 수 있습니다.

효율적인 동시성을 지원하기 위해 코틀린은 _코루틴(coroutines)_을 중심으로 구축된 비동기 프로그래밍을 사용하며, 이를 통해 일시 중단 함수(suspending functions)를 사용하여 자연스럽고 순차적인 방식으로 비동기 코드를 작성할 수 있습니다.
코루틴은 스레드의 경량화된 대안입니다.
코루틴은 시스템 리소스를 블로킹하지 않고 일시 중단될 수 있으며, 리소스 친화적이어서 세분화된 동시성(fine-grained concurrency)에 더 적합합니다.

대부분의 코루틴 기능은 코루틴 실행, 동시성 처리, 비동기 스트림 작업 등을 위한 도구를 포함하는 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 라이브러리에서 제공됩니다.

코틀린의 코루틴이 처음이라면, 더 복잡한 주제로 들어가기 전에 [코루틴 기초(Coroutine basics)](coroutines-basics.md) 가이드부터 시작하세요.
이 가이드는 일시 중단 함수, 코루틴 빌더(coroutine builders), 구조화된 동시성(structured concurrency)의 핵심 개념을 간단한 예제를 통해 소개합니다:

<a href="coroutines-basics.md"><img src="get-started-coroutines.svg" width="700" alt="Get started with coroutines" style="block"/></a>

> [KotlinConf 앱](https://github.com/JetBrains/kotlinconf-app)에서 코루틴이 실제로 어떻게 사용되는지 보여주는 샘플 프로젝트를 확인해 보세요.
> 
{style="tip"}

## 코루틴 개념

`kotlinx.coroutines` 라이브러리는 작업을 동시에 실행하고, 코루틴 실행을 구조화하며, 공유 상태를 관리하기 위한 핵심 빌딩 블록을 제공합니다.

### 일시 중단 함수 및 코루틴 빌더

코틀린의 코루틴은 스레드를 블로킹하지 않고 코드를 일시 중단하고 재개할 수 있게 하는 일시 중단 함수를 기반으로 합니다.
`suspend` 키워드는 장시간 실행되는 작업을 비동기적으로 수행할 수 있는 함수를 표시합니다.

새로운 코루틴을 실행하려면 [`.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 및 [`.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)와 같은 코루틴 빌더를 사용하세요.
이러한 빌더는 코루틴의 생명주기를 정의하고 코루틴 컨텍스트(coroutine context)를 제공하는 [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/)의 확장 함수입니다.

이 빌더에 대한 자세한 내용은 [코루틴 기초(Coroutine basics)](coroutines-basics.md) 및 [일시 중단 함수 구성(Composing suspend functions)](coroutines-and-channels.md)에서 확인할 수 있습니다.

### 코루틴 컨텍스트 및 동작

`CoroutineScope`에서 코루틴을 실행하면 해당 실행을 제어하는 컨텍스트가 생성됩니다.
`.launch()` 및 `.async()`와 같은 빌더 함수는 코루틴이 어떻게 동작하는지 정의하는 일련의 요소를 자동으로 생성합니다:

*   [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 인터페이스는 코루틴의 생명주기를 추적하고 구조화된 동시성을 가능하게 합니다.
*   [`CoroutineDispatcher`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/)는 코루틴이 실행되는 위치를 제어합니다. 예를 들어, 백그라운드 스레드나 UI 애플리케이션의 메인 스레드에서 실행되도록 합니다.
*   [`CoroutineExceptionHandler`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/)는 포착되지 않은 예외를 처리합니다.

이러한 요소들은 다른 가능한 요소들과 함께 _코루틴 컨텍스트(coroutine context)_를 구성하며, 이는 기본적으로 코루틴의 부모로부터 상속됩니다.
이 컨텍스트는 구조화된 동시성을 가능하게 하는 계층 구조를 형성하며, 이를 통해 관련된 코루틴은 함께 [취소](cancellation-and-timeouts.md)되거나 그룹으로 [예외를 처리](exception-handling.md)할 수 있습니다.

### 비동기 흐름 및 공유 가능한 가변 상태

코틀린은 코루틴이 통신할 수 있는 여러 방법을 제공합니다.
코루틴 간에 값을 공유하는 방식에 따라 다음 옵션 중 하나를 사용하세요:

*   [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/)는 코루틴이 값을 활발하게 수집할 때만 값을 생성합니다.
*   [`Channel`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/)은 여러 코루틴이 값을 송수신할 수 있도록 하며, 각 값은 정확히 하나의 코루틴으로 전달됩니다.
*   [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)는 모든 활성 수집 코루틴과 모든 값을 지속적으로 공유합니다.

여러 코루틴이 동일한 데이터에 접근하거나 업데이트해야 할 때, 이들은 _가변 상태를 공유(share mutable state)_합니다.
조정 없이는 작업이 예측할 수 없는 방식으로 서로 간섭하는 경쟁 조건(race conditions)으로 이어질 수 있습니다.
공유 가변 상태를 안전하게 관리하려면 [`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/#)를 사용하여 공유 데이터를 래핑하세요.
그런 다음, 하나의 코루틴에서 업데이트하고 다른 코루틴에서 최신 값을 수집할 수 있습니다.
<!-- Learn more in [Shared mutable state and concurrency](shared-mutable-state-and-concurrency.md). -->

자세한 내용은 [비동기 흐름(Asynchronous flow)](flow.md), [채널(Channels)](channels.md), [코루틴 및 채널 튜토리얼(Coroutines and channels tutorial)](coroutines-and-channels.md)을 참조하세요.

## 다음 단계

*   [코루틴 기초 가이드(Coroutine basics guide)](coroutines-basics.md)에서 코루틴, 일시 중단 함수 및 빌더의 기본 사항을 알아보세요.
*   [일시 중단 함수 구성(Composing suspending functions)](coroutine-context-and-dispatchers.md)에서 일시 중단 함수를 결합하고 코루틴 파이프라인을 구축하는 방법을 살펴보세요.
*   IntelliJ IDEA의 내장 도구를 사용하여 [코루틴을 디버그](debug-coroutines-with-idea.md)하는 방법을 알아보세요.
*   Flow 관련 디버깅은 [IntelliJ IDEA를 사용하여 Kotlin Flow 디버그](debug-flow-with-idea.md) 튜토리얼을 참조하세요.
*   코루틴 기반 UI 개발에 대해 알아보려면 [코루틴을 사용한 UI 프로그래밍 가이드](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)를 읽어보세요.
*   [Android에서 코루틴 사용을 위한 모범 사례](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)를 검토하세요.
*   [`kotlinx.coroutines` API 레퍼런스](https://kotlinlang.org/api/kotlinx.coroutines/)를 확인하세요.