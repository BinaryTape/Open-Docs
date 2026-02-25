[//]: # (title: 새 메모리 관리자로 마이그레이션)

> Kotlin 1.9.20에서 기존(legacy) 메모리 관리자에 대한 지원이 완전히 제거되었습니다. Kotlin 1.7.20부터 기본적으로 활성화된 현재 메모리 모델로 프로젝트를 마이그레이션하세요.
>
{style="note"}

이 가이드는 새로운 [Kotlin/Native 메모리 관리자](native-memory-manager.md)를 기존의 것과 비교하고, 프로젝트를 마이그레이션하는 방법을 설명합니다.

새로운 메모리 관리자의 가장 눈에 띄는 변화는 객체 공유에 대한 제한이 해제되었다는 점입니다. 스레드 간에 객체를 공유하기 위해 객체를 동결(freeze)할 필요가 없으며, 구체적으로 다음과 같은 변화가 있습니다:

* 최상위 프로퍼티(top-level properties)는 `@SharedImmutable`을 사용하지 않고도 모든 스레드에서 접근 및 수정할 수 있습니다.
* 상호 운용성(interop)을 통해 전달되는 객체는 동결하지 않고도 모든 스레드에서 접근 및 수정할 수 있습니다.
* `Worker.executeAfter`는 더 이상 작업이 동결될 것을 요구하지 않습니다.
* `Worker.execute`는 더 이상 생성자(producer)가 격리된 객체 하위 그래프(isolated object subgraph)를 반환할 것을 요구하지 않습니다.
* `AtomicReference` 및 `FreezableAtomicReference`를 포함하는 참조 사이클(reference cycles)이 메모리 누수를 일으키지 않습니다.

쉬운 객체 공유 외에도 새로운 메모리 관리자는 다음과 같은 주요 변경 사항을 제공합니다:

* 전역 프로퍼티는 해당 프로퍼티가 정의된 파일에 처음 접근할 때 지연 초기화(lazy initialization)됩니다. 이전에는 프로그램 시작 시 전역 프로퍼티가 초기화되었습니다. 해결 방법으로, 프로그램 시작 시 초기화되어야 하는 프로퍼티에는 `@EagerInitialization` 어노테이션을 표시할 수 있습니다. 사용하기 전에 해당 [문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)를 확인하세요.
* `by lazy {}` 프로퍼티는 스레드 안전 모드(thread-safety modes)를 지원하며 제한 없는 재귀(unbounded recursion)를 처리하지 않습니다.
* `Worker.executeAfter`의 `operation`에서 발생하는 예외는 런타임의 다른 부분과 마찬가지로 처리됩니다. 사용자 정의 미처리 예외 후크(unhandled exception hook) 실행을 시도하거나, 후크를 찾을 수 없거나 후크 자체가 예외로 실패한 경우 프로그램을 종료합니다.
* 동결(Freezing)은 더 이상 사용되지 않으며(deprecated) 항상 비활성화됩니다.

기존 메모리 관리자에서 프로젝트를 마이그레이션하려면 다음 지침을 따르세요:

## Kotlin 업데이트

새로운 Kotlin/Native 메모리 관리자는 Kotlin 1.7.20부터 기본적으로 활성화되었습니다. Kotlin 버전을 확인하고 필요한 경우 [최신 버전으로 업데이트](releases.md#update-to-a-new-kotlin-version)하세요.

## 종속성 업데이트

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>1.6.0 이상의 버전으로 업데이트하세요. <code>native-mt</code> 접미사가 붙은 버전은 사용하지 마세요.</p>
        <p>새로운 메모리 관리자에서 염두에 두어야 할 몇 가지 구체적인 사항도 있습니다:</p>
        <list>
            <li>동결이 필요하지 않으므로 모든 공통 기본 요소(채널, 플로우, 코루틴)가 워커 경계(Worker boundaries)를 넘어 작동합니다.</li>
            <li><code>Dispatchers.Default</code>는 Linux 및 Windows에서는 워커 풀(pool of Workers)을 기반으로 하고, Apple 타겟에서는 전역 큐(global queue)를 기반으로 합니다.</li>
            <li>워커를 기반으로 하는 코루틴 디스패처를 만들려면 <code>newSingleThreadContext</code>를 사용하세요.</li>
            <li><code>N</code>개의 워커 풀을 기반으로 하는 코루틴 디스패처를 만들려면 <code>newFixedThreadPoolContext</code>를 사용하세요.</li>
            <li><code>Dispatchers.Main</code>은 Darwin에서는 메인 큐를 기반으로 하고, 다른 플랫폼에서는 독립형 워커를 기반으로 합니다.</li>
        </list>
    </def>
    <def title="Ktor">
        2.0 이상의 버전으로 업데이트하세요.
    </def>
    <def title="기타 종속성">
        <p>대부분의 라이브러리는 변경 없이 작동해야 하지만, 예외가 있을 수 있습니다.</p>
        <p>종속성을 최신 버전으로 업데이트하고, 기존 메모리 관리자와 새로운 메모리 관리자용 라이브러리 버전 사이에 차이가 없는지 확인하세요.</p>
    </def>
</deflist>

## 코드 업데이트

새로운 메모리 관리자를 지원하려면 영향을 받는 API의 사용을 제거하세요:

| 이전 API                                                                                                                                         | 조치 사항                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 모든 사용을 제거할 수 있습니다. 새로운 메모리 관리자에서 이 API를 사용하더라도 경고는 발생하지 않습니다.                                                             |
| [`FreezableAtomicReference` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 대신 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)를 사용하세요.                                        |
| [`FreezingException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 모든 사용을 제거하세요.                                                                                                                                                |
| [`InvalidMutabilityException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 모든 사용을 제거하세요.                                                                                                                                                |
| [`IncorrectDereferenceException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 모든 사용을 제거하세요.                                                                                                                                                |
| [`freeze()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 모든 사용을 제거하세요.                                                                                                                                                |
| [`isFrozen` 프로퍼티](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 모든 사용을 제거할 수 있습니다. 동결 기능이 더 이상 사용되지 않으므로 이 프로퍼티는 항상 `false`를 반환합니다.                                                                     |                                                                                                                  
| [`ensureNeverFrozen()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 모든 사용을 제거하세요.                                                                                                                                                |
| [`atomicLazy()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 대신 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)를 사용하세요.                                                                            |
| [`MutableData` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 대신 일반 컬렉션을 사용하세요.                                                                                                                               |
| [`WorkerBoundReference<out T : Any>` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | `T`를 직접 사용하세요.                                                                                                                                                 |
| [`DetachedObjectGraph<T>` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | `T`를 직접 사용하세요. C 상호 운용성을 통해 값을 전달하려면 [StableRef 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)를 사용하세요. |

## 다음 단계

* [새로운 메모리 관리자에 대해 자세히 알아보기](native-memory-manager.md)
* [Swift/Objective-C ARC와의 통합 세부 사항 확인](native-arc-integration.md)
* [다른 코루틴에서 객체를 안전하게 참조하는 방법 알아보기](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)