[//]: # (title: 새 메모리 관리자로 마이그레이션)

> Kotlin 1.9.20부터 레거시 메모리 관리자 지원이 완전히 제거되었습니다. Kotlin 1.7.20부터 기본적으로 활성화된 현재 메모리 모델로 프로젝트를 마이그레이션하세요.
>
{style="note"}

이 가이드에서는 새로운 [Kotlin/Native 메모리 관리자](native-memory-manager.md)를 레거시 메모리 관리자와 비교하고 프로젝트를 마이그레이션하는 방법을 설명합니다.

새 메모리 관리자에서 가장 눈에 띄는 변화는 객체 공유에 대한 제약을 완화했다는 것입니다. 스레드 간에 객체를 공유하기 위해 객체를 고정(freeze)할 필요가 없습니다. 구체적으로:

* 최상위 속성(Top-level properties)은 `@SharedImmutable`을 사용하지 않고도 모든 스레드에서 액세스하고 수정할 수 있습니다.
* 상호 운용(interop)을 통해 전달되는 객체는 고정하지 않고도 모든 스레드에서 액세스하고 수정할 수 있습니다.
* `Worker.executeAfter`는 더 이상 작업(operation)을 고정할 필요가 없습니다.
* `Worker.execute`는 더 이상 프로듀서가 독립된 객체 서브그래프를 반환하도록 요구하지 않습니다.
* `AtomicReference`와 `FreezableAtomicReference`를 포함하는 참조 주기(reference cycles)는 메모리 누수를 유발하지 않습니다.

손쉬운 객체 공유 외에도, 새 메모리 관리자는 다음과 같은 다른 주요 변경 사항도 가져옵니다:

* 전역 속성(Global properties)은 정의된 파일에 처음 액세스될 때 지연 초기화됩니다. 이전에는 전역 속성이 프로그램 시작 시 초기화되었습니다. 해결 방법으로, 프로그램 시작 시 초기화되어야 하는 속성을 `@EagerInitialization` 애너테이션으로 표시할 수 있습니다. 사용하기 전에 해당 [문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)를 확인하세요.
* `by lazy {}` 속성은 스레드 안전 모드를 지원하며 무한 재귀를 처리하지 않습니다.
* `Worker.executeAfter`의 `operation`에서 벗어나는 예외는 다른 런타임 부분과 마찬가지로 처리됩니다. 사용자 정의 처리되지 않은 예외 훅을 실행하거나, 훅을 찾지 못했거나 훅 자체에서 예외가 발생한 경우 프로그램을 종료함으로써 처리됩니다.
* 고정(freezing)은 사용되지 않으며 항상 비활성화됩니다.

레거시 메모리 관리자에서 프로젝트를 마이그레이션하려면 다음 지침을 따르세요:

## Kotlin 업데이트

새로운 Kotlin/Native 메모리 관리자는 Kotlin 1.7.20부터 기본적으로 활성화되었습니다. Kotlin 버전을 확인하고 필요한 경우 [최신 버전으로 업데이트](releases.md#update-to-a-new-kotlin-version)하세요.

## 종속성 업데이트

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>버전 1.6.0 이상으로 업데이트하세요. <code>native-mt</code> 접미사가 붙은 버전은 사용하지 마세요.</p>
        <p>새로운 메모리 관리자와 관련하여 명심해야 할 몇 가지 특정 사항도 있습니다:</p>
        <list>
            <li>고정(freezing)이 필요하지 않으므로 모든 일반적인 프리미티브(채널, 플로우, 코루틴)는 Worker 경계를 넘어 작동합니다.</li>
            <li><code>Dispatchers.Default</code>는 Linux 및 Windows에서는 Worker 풀에 의해 지원되며, Apple 타겟에서는 전역 큐에 의해 지원됩니다.</li>
            <li>Worker에 의해 지원되는 코루틴 디스패처를 생성하려면 <code>newSingleThreadContext</code>를 사용하세요.</li>
            <li><code>N</code>개의 Worker 풀에 의해 지원되는 코루틴 디스패처를 생성하려면 <code>newFixedThreadPoolContext</code>를 사용하세요.</li>
            <li><code>Dispatchers.Main</code>은 Darwin에서는 메인 큐에 의해 지원되며, 다른 플랫폼에서는 독립형 Worker에 의해 지원됩니다.</li>
        </list>
    </def>
    <def title="Ktor">
        버전 2.0 이상으로 업데이트하세요.
    </def>
    <def title="기타 종속성">
        <p>대부분의 라이브러리는 변경 없이 작동해야 하지만, 예외가 있을 수 있습니다.</p>
        <p>종속성을 최신 버전으로 업데이트하고, 레거시 메모리 관리자와 새 메모리 관리자 간에 라이브러리 버전에 차이가 없는지 확인하세요.</p>
    </def>
</deflist>

## 코드 업데이트

새 메모리 관리자를 지원하려면 영향을 받는 API 사용을 제거하세요:

| 이전 API                                                                                                                                      | 수행할 작업                                                                                                                                                         |
|-----------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 모든 사용을 제거할 수 있습니다. 단, 새 메모리 관리자에서 이 API를 사용해도 경고는 발생하지 않습니다.                                                               |
| [`FreezableAtomicReference` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 대신 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)를 사용하세요.                                        |
| [`FreezingException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 모든 사용을 제거하세요.                                                                                                                                                |
| [`InvalidMutabilityException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 모든 사용을 제거하세요.                                                                                                                                                |
| [`IncorrectDereferenceException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 모든 사용을 제거하세요.                                                                                                                                                |
| [`freeze()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 모든 사용을 제거하세요.                                                                                                                                                |
| [`isFrozen` 속성](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 모든 사용을 제거할 수 있습니다. 고정(freezing)이 사용되지 않으므로, 이 속성은 항상 `false`를 반환합니다.                                                                     |
| [`ensureNeverFrozen()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 모든 사용을 제거하세요.                                                                                                                                                |
| [`atomicLazy()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 대신 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)를 사용하세요.                                                                            |
| [`MutableData` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 대신 일반적인 컬렉션을 사용하세요.                                                                                                                               |
| [`WorkerBoundReference<out T : Any>` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | `T`를 직접 사용하세요.                                                                                                                                                 |
| [`DetachedObjectGraph<T>` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | `T`를 직접 사용하세요. C 상호 운용(interop)을 통해 값을 전달하려면 [<code>StableRef</code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)를 사용하세요. |

## 다음 단계

* [새 메모리 관리자에 대해 자세히 알아보기](native-memory-manager.md)
* [Swift/Objective-C ARC와의 통합 세부 정보 확인](native-arc-integration.md)
* [다른 코루틴에서 객체를 안전하게 참조하는 방법 알아보기](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)