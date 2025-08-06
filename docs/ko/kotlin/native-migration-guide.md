[//]: # (title: 새로운 메모리 관리자로 마이그레이션)

> Kotlin 1.9.20부터 레거시 메모리 관리자 지원이 완전히 제거되었습니다. Kotlin 1.7.20부터 기본적으로 활성화된 현재 메모리 모델로 프로젝트를 마이그레이션하세요.
>
{style="note"}

이 가이드는 새로운 [Kotlin/Native 메모리 관리자](native-memory-manager.md)를 레거시 관리자와 비교하고 프로젝트 마이그레이션 방법을 설명합니다.

새로운 메모리 관리자에서 가장 눈에 띄는 변경 사항은 객체 공유에 대한 제한이 해제되었다는 것입니다. 객체를 스레드 간에 공유하기 위해 더 이상 고정(freeze)할 필요가 없으며, 구체적으로 다음과 같습니다:

*   최상위 프로퍼티는 `@SharedImmutable`을 사용하지 않고도 어떤 스레드에서든 접근하고 수정할 수 있습니다.
*   인터롭(interop)을 통해 전달되는 객체는 고정하지 않고도 어떤 스레드에서든 접근하고 수정할 수 있습니다.
*   `Worker.executeAfter`는 더 이상 작업이 고정될 것을 요구하지 않습니다.
*   `Worker.execute`는 더 이상 생산자가 격리된 객체 서브그래프를 반환할 것을 요구하지 않습니다.
*   `AtomicReference` 및 `FreezableAtomicReference`를 포함하는 참조 주기는 메모리 누수를 유발하지 않습니다.

손쉬운 객체 공유 외에도 새로운 메모리 관리자는 다른 주요 변경 사항도 제공합니다:

*   전역 프로퍼티는 해당 파일에 처음 접근할 때 지연 초기화됩니다. 이전에는 전역 프로퍼티가 프로그램 시작 시 초기화되었습니다. 이 문제를 해결하기 위해, 프로그램 시작 시 초기화되어야 하는 프로퍼티를 `@EagerInitialization` 애노테이션으로 마크할 수 있습니다. 사용하기 전에 [문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)를 확인하세요.
*   `by lazy {}` 프로퍼티는 스레드 안전 모드를 지원하며 무한 재귀를 처리하지 않습니다.
*   `Worker.executeAfter`의 `operation`에서 탈출하는 예외는 다른 런타임 부분과 동일하게 처리됩니다. 사용자 정의 처리되지 않은 예외 훅을 실행하려고 시도하거나, 훅을 찾을 수 없거나 훅 자체가 예외를 발생시킨 경우 프로그램을 종료합니다.
*   고정(Freezing)은 더 이상 사용되지 않으며 항상 비활성화됩니다.

레거시 메모리 관리자에서 프로젝트를 마이그레이션하려면 다음 지침을 따르세요:

## Kotlin 업데이트

새로운 Kotlin/Native 메모리 관리자는 Kotlin 1.7.20부터 기본적으로 활성화되었습니다. Kotlin 버전을 확인하고 필요한 경우 [최신 버전으로 업데이트](releases.md#update-to-a-new-kotlin-version)하세요.

## 의존성 업데이트

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>버전 1.6.0 이상으로 업데이트하세요. <code>native-mt</code> 접미사가 있는 버전은 사용하지 마세요.</p>
        <p>새로운 메모리 관리자와 관련된 몇 가지 특이 사항도 염두에 두어야 합니다:</p>
        <list>
            <li>고정이 필요하지 않으므로 모든 공통 프리미티브(채널, 플로우, 코루틴)는 Worker 경계를 통해 작동합니다.</li>
            <li><code>Dispatchers.Default</code>는 Linux 및 Windows에서는 Worker 풀로 지원되고 Apple 대상에서는 전역 큐로 지원됩니다.</li>
            <li>Worker로 지원되는 코루틴 디스패처를 생성하려면 <code>newSingleThreadContext</code>를 사용하세요.</li>
            <li><code>N</code>개의 Worker 풀로 지원되는 코루틴 디스패처를 생성하려면 <code>newFixedThreadPoolContext</code>를 사용하세요.</li>
            <li><code>Dispatchers.Main</code>은 Darwin에서는 메인 큐로 지원되고 다른 플랫폼에서는 독립 Worker로 지원됩니다.</li>
        </list>
    </def>
    <def title="Ktor">
        버전 2.0 이상으로 업데이트하세요.
    </def>
    <def title="다른 의존성">
        <p>대부분의 라이브러리는 변경 없이 작동해야 하지만, 예외가 있을 수 있습니다.</p>
        <p>의존성을 최신 버전으로 업데이트하고, 레거시 및 새로운 메모리 관리자를 위한 라이브러리 버전 간에 차이가 없는지 확인하세요.</p>
    </def>
</deflist>

## 코드 업데이트

새로운 메모리 관리자를 지원하려면 영향받는 API 사용을 제거하세요:

| 이전 API                                                                                                                                     | 수행할 작업                                                                                                                                                   |
|--------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                             | 모든 사용을 제거할 수 있지만, 새로운 메모리 관리자에서 이 API를 사용해도 경고는 없습니다.                                                                        |
| [<code>FreezableAtomicReference</code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/) | 대신 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)를 사용하세요.                               |
| [<code>FreezingException</code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)       | 모든 사용을 제거하세요.                                                                                                                                         |
| [<code>InvalidMutabilityException</code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/) | 모든 사용을 제거하세요.                                                                                                                                         |
| [<code>IncorrectDereferenceException</code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/) | 모든 사용을 제거하세요.                                                                                                                                         |
| [<code>freeze()</code> 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                          | 모든 사용을 제거하세요.                                                                                                                                         |
| [<code>isFrozen</code> 프로퍼티](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                     | 모든 사용을 제거할 수 있습니다. 고정이 사용 중단되었으므로, 이 프로퍼티는 항상 <code>false</code>를 반환합니다.                                                     |
| [<code>ensureNeverFrozen()</code> 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html) | 모든 사용을 제거하세요.                                                                                                                                         |
| [<code>atomicLazy()</code> 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                 | 대신 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)를 사용하세요.                                                                    |
| [<code>MutableData</code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                     | 대신 일반 컬렉션을 사용하세요.                                                                                                                                  |
| [<code>WorkerBoundReference<out T : Any></code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | <code>T</code>를 직접 사용하세요.                                                                                                                               |
| [<code>DetachedObjectGraph<T></code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/) | <code>T</code>를 직접 사용하세요. C 인터롭(interop)을 통해 값을 전달하려면 [<code>StableRef</code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)를 사용하세요. |

## 다음 단계

*   [새로운 메모리 관리자에 대해 자세히 알아보기](native-memory-manager.md)
*   [Swift/Objective-C ARC와의 통합 세부 정보 확인](native-arc-integration.md)
*   [다른 코루틴에서 객체를 안전하게 참조하는 방법 알아보기](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)