---
title: "새로운 메모리 관리자로 마이그레이션"
---
:::note
Kotlin 1.9.20에서 레거시 메모리 관리자 지원이 완전히 제거되었습니다. 프로젝트를 현재 메모리 모델로 마이그레이션하세요. 현재 메모리 모델은 Kotlin 1.7.20 이후 기본적으로 활성화되어 있습니다.

:::

이 가이드에서는 새로운 [Kotlin/Native memory manager](native-memory-manager)와 레거시 메모리 관리자를 비교하고 프로젝트를 마이그레이션하는 방법을 설명합니다.

새로운 메모리 관리자의 가장 눈에 띄는 변화는 객체 공유에 대한 제한이 완화되었다는 점입니다. 스레드 간에 객체를 공유하기 위해 객체를 고정할 필요가 없으며, 특히 다음 사항에 해당합니다.

* 최상위 속성은 `@SharedImmutable`을 사용하지 않고도 모든 스레드에서 액세스하고 수정할 수 있습니다.
* Interop을 통해 전달되는 객체는 고정하지 않고도 모든 스레드에서 액세스하고 수정할 수 있습니다.
* `Worker.executeAfter`는 더 이상 작업을 고정할 필요가 없습니다.
* `Worker.execute`는 더 이상 생산자가 격리된 객체 서브그래프를 반환할 필요가 없습니다.
* `AtomicReference` 및 `FreezableAtomicReference`를 포함하는 참조 순환은 메모리 누수를 일으키지 않습니다.

쉬운 객체 공유 외에도 새로운 메모리 관리자는 다음과 같은 주요 변경 사항을 제공합니다.

* 전역 속성은 속성이 정의된 파일에 처음 액세스할 때 지연 초기화됩니다. 이전에는 전역 속성이 프로그램 시작 시 초기화되었습니다. 이에 대한 해결 방법으로 프로그램 시작 시 초기화해야 하는 속성을 `@EagerInitialization` 어노테이션으로 표시할 수 있습니다. 사용하기 전에 [documentation](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)을 확인하세요.
* `by lazy {}` 속성은 스레드 안전 모드를 지원하며 무한 재귀를 처리하지 않습니다.
* `Worker.executeAfter`에서 `operation`을 이스케이프하는 예외는 다른 런타임 부분과 마찬가지로 사용자 정의 처리되지 않은 예외 후크를 실행하거나 후크를 찾을 수 없거나 예외 자체로 실패한 경우 프로그램을 종료하여 처리됩니다.
* 고정은 더 이상 사용되지 않으며 항상 비활성화됩니다.

다음 지침에 따라 레거시 메모리 관리자에서 프로젝트를 마이그레이션하세요.

## Update Kotlin

새로운 Kotlin/Native memory manager는 Kotlin 1.7.20부터 기본적으로 활성화되었습니다. Kotlin 버전을 확인하고 필요한 경우 [update
to the latest one](releases#update-to-a-new-kotlin-version)으로 업데이트하세요.

## Update dependencies
<h3>kotlinx.coroutines</h3>
<p>
   버전 1.6.0 이상으로 업데이트하세요. `native-mt` 접미사가 있는 버전은 사용하지 마세요.
</p>
<p>
   새로운 메모리 관리와 관련하여 염두에 두어야 할 몇 가지 사항도 있습니다.
</p>
<list>
<li>모든 공통 기본 요소(채널, 플로우, 코루틴)는 고정이 필요하지 않으므로 Worker 경계를 통해 작동합니다.</li>
<li>`Dispatchers.Default`는 Linux 및 Windows에서는 Worker 풀에서, Apple 타겟에서는 글로벌 큐에서 지원됩니다.</li>
<li>`newSingleThreadContext`를 사용하여 Worker에서 지원되는 코루틴 디스패처를 만듭니다.</li>
<li>`newFixedThreadPoolContext`를 사용하여 `N`개의 Worker 풀에서 지원되는 코루틴 디스패처를 만듭니다.</li>
<li>`Dispatchers.Main`은 Darwin에서는 기본 큐에서, 다른 플랫폼에서는 독립 실행형 Worker에서 지원됩니다.</li>
</list>
<h3>Ktor</h3>
        버전 2.0 이상으로 업데이트하세요.
<h3>Other dependencies</h3>
<p>
   대부분의 라이브러리는 변경 없이 작동해야 하지만 예외가 있을 수 있습니다.
</p>
<p>
   종속성을 최신 버전으로 업데이트하고 레거시 및 새 메모리 관리자에 대한 라이브러리 버전 간에 차이가 없는지 확인하세요.
</p>
    

## Update your code

새로운 메모리 관리자를 지원하려면 영향을 받는 API의 사용을 제거하세요.

| Old API                                                                                                                                         | What to do                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | 새로운 메모리 관리자에서 이 API를 사용해도 경고가 없지만 모든 사용을 제거할 수 있습니다.                                                                        |
| [The `FreezableAtomicReference` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 대신 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)를 사용하세요.                                        |
| [The `FreezingException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 모든 사용을 제거하세요.                                                                                                                                                |                                                                                                      |
| [The `InvalidMutabilityException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 모든 사용을 제거하세요.                                                                                                                                                |
| [The `IncorrectDereferenceException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 모든 사용을 제거하세요.                                                                                                                                                |
| [The `freeze()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | 모든 사용을 제거하세요.                                                                                                                                                |
| [The `isFrozen` property](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | 모든 사용을 제거할 수 있습니다. 고정이 더 이상 사용되지 않으므로 속성은 항상 `false`를 반환합니다.                                                                     |                                                                                                                  
| [The `ensureNeverFrozen()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | 모든 사용을 제거하세요.                                                                                                                                                |
| [The `atomicLazy()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 대신 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)를 사용하세요.                                                                            |
| [The `MutableData` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 대신 일반 컬렉션을 사용하세요.                                                                                                                               |
| [The `WorkerBoundReference<out T : Any>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | `T`를 직접 사용하세요.                                                                                                                                                 |
| [The `DetachedObjectGraph<T>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | `T`를 직접 사용하세요. C interop을 통해 값을 전달하려면 [the StableRef class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)를 사용하세요. |

## What's next

* [Learn more about the new memory manager](native-memory-manager)
* [Check the specifics of integration with Swift/Objective-C ARC](native-arc-integration)