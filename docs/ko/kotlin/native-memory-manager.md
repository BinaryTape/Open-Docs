[//]: # (title: Kotlin/Native 메모리 관리)

Kotlin/Native는 JVM, Go 및 기타 주류 기술과 유사한 최신 메모리 관리자를 사용하며, 다음과 같은 기능을 포함합니다.

*   객체는 공유 힙에 저장되며 모든 스레드에서 접근할 수 있습니다.
*   로컬 및 전역 변수와 같은 "루트"에서 도달할 수 없는 객체를 수집하기 위해 트레이싱 가비지 컬렉션이 주기적으로 수행됩니다.

## 가비지 컬렉터

Kotlin/Native의 가비지 컬렉터(GC) 알고리즘은 지속적으로 발전하고 있습니다. 현재는 힙을 세대(generations)로 분리하지 않는 스톱-더-월드 마크 앤드 동시 스윕(stop-the-world mark and concurrent sweep) 컬렉터로 작동합니다.

GC는 별도의 스레드에서 실행되며 메모리 압력 휴리스틱(memory pressure heuristics) 또는 타이머에 따라 시작됩니다. 또는 [수동으로 호출](#enable-garbage-collection-manually)할 수도 있습니다.

GC는 애플리케이션 스레드, GC 스레드 및 선택적 마커 스레드를 포함하여 여러 스레드에서 마크 큐를 병렬로 처리합니다. 애플리케이션 스레드와 최소 하나의 GC 스레드가 마킹 프로세스에 참여합니다. 기본적으로 GC가 힙의 객체를 마킹할 때 애플리케이션 스레드는 일시 중지되어야 합니다.

> `kotlin.native.binary.gcMarkSingleThreaded=true` 컴파일러 옵션을 사용하여 마크 단계의 병렬화를 비활성화할 수 있습니다.
> 그러나 이로 인해 대규모 힙에서 가비지 컬렉터의 일시 정지 시간이 늘어날 수 있습니다.
>
{style="tip"}

마킹 단계가 완료되면 GC는 약한 참조(weak references)를 처리하고 마킹되지 않은 객체에 대한 참조 포인트를 무효화합니다. 기본적으로 GC 일시 정지 시간을 줄이기 위해 약한 참조는 동시에 처리됩니다.

가비지 컬렉션을 [모니터링](#monitor-gc-performance)하고 [최적화](#optimize-gc-performance)하는 방법을 알아보십시오.

### 가비지 컬렉션 수동으로 활성화

가비지 컬렉터를 강제로 시작하려면 `kotlin.native.internal.GC.collect()`를 호출하십시오. 이 메서드는 새로운 컬렉션을 트리거하고 완료될 때까지 기다립니다.

### GC 성능 모니터링

GC 성능을 모니터링하려면 로그를 살펴보거나 문제를 진단할 수 있습니다. 로깅을 활성화하려면 Gradle 빌드 스크립트에 다음 컴파일러 옵션을 설정하십시오.

```none
-Xruntime-logs=gc=info
```

현재 로그는 `stderr`로만 출력됩니다.

Apple 플랫폼에서는 Xcode Instruments 툴킷을 활용하여 iOS 앱 성능을 디버그할 수 있습니다. 가비지 컬렉터는 Instruments에서 사용 가능한 사인포스트(signposts)를 통해 일시 정지를 보고합니다. 사인포스트는 앱 내에서 커스텀 로깅을 활성화하여 GC 일시 정지가 애플리케이션 프리즈와 일치하는지 확인할 수 있도록 합니다.

앱에서 GC 관련 일시 정지를 추적하려면:

1.  이 기능을 활성화하려면 `gradle.properties` 파일에 다음 컴파일러 옵션을 설정하십시오.

    ```none
    kotlin.native.binary.enableSafepointSignposts=true
    ```

2.  Xcode를 열고 **Product** | **Profile**로 이동하거나 <shortcut>Cmd + I</shortcut>를 누르십시오. 이 작업은 앱을 컴파일하고 Instruments를 실행합니다.
3.  템플릿 선택에서 **os_signpost**를 선택하십시오.
4.  `org.kotlinlang.native.runtime`를 **서브시스템**으로, `safepoint`를 **카테고리**로 지정하여 구성하십시오.
5.  빨간색 녹화 버튼을 클릭하여 앱을 실행하고 사인포스트 이벤트 녹화를 시작하십시오.

    ![Tracking GC pauses as signposts](native-gc-signposts.png){width=700}

    여기서 가장 낮은 그래프의 각 파란색 점은 별도의 사인포스트 이벤트를 나타내며, 이는 GC 일시 정지입니다.

### GC 성능 최적화

GC 성능을 향상시키려면 동시 마킹(concurrent marking)을 활성화하여 GC 일시 정지 시간을 줄일 수 있습니다. 이를 통해 가비지 컬렉션의 마킹 단계가 애플리케이션 스레드와 동시에 실행될 수 있습니다.

이 기능은 현재 [실험 단계](components-stability.md#stability-levels-explained)입니다. 이를 활성화하려면 `gradle.properties` 파일에 다음 컴파일러 옵션을 설정하십시오.

```none
kotlin.native.binary.gc=cms
```

### 가비지 컬렉션 비활성화

GC를 활성화된 상태로 유지하는 것이 좋습니다. 그러나 테스트 목적이나 문제가 발생했거나 수명이 짧은 프로그램인 경우와 같은 특정 경우에 비활성화할 수 있습니다. 그렇게 하려면 `gradle.properties` 파일에 다음 바이너리 옵션을 설정하십시오.

```none
kotlin.native.binary.gc=noop
```

> 이 옵션을 활성화하면 GC가 Kotlin 객체를 수집하지 않으므로 프로그램이 실행되는 동안 메모리 사용량이 계속 증가할 것입니다. 시스템 메모리가 고갈되지 않도록 주의하십시오.
>
{style="warning"}

## 메모리 사용량

Kotlin/Native는 자체 [메모리 할당자](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)를 사용합니다. 이는 시스템 메모리를 페이지로 나누어 연속적인 순서로 독립적인 스위핑을 허용합니다. 각 할당은 페이지 내의 메모리 블록이 되며, 페이지는 블록 크기를 추적합니다. 다양한 페이지 유형은 다양한 할당 크기에 최적화되어 있습니다. 메모리 블록의 연속적인 배열은 모든 할당된 블록을 효율적으로 반복할 수 있도록 보장합니다.

스레드가 메모리를 할당할 때, 할당 크기에 따라 적합한 페이지를 검색합니다. 스레드는 다양한 크기 카테고리별로 페이지 세트를 유지합니다. 일반적으로 주어진 크기에 대한 현재 페이지는 할당을 수용할 수 있습니다. 그렇지 않은 경우 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능하거나, 스위핑이 필요하거나, 먼저 생성되어야 할 수 있습니다.

Kotlin/Native 메모리 할당자는 메모리 할당의 갑작스러운 급증으로부터 보호 기능을 제공합니다. 이는 뮤테이터(mutator)가 많은 가비지를 빠르게 할당하기 시작하고 GC 스레드가 이를 따라가지 못하여 메모리 사용량이 끝없이 증가하는 상황을 방지합니다. 이 경우 GC는 반복이 완료될 때까지 스톱-더-월드 단계를 강제로 수행합니다.

직접 메모리 사용량을 모니터링하고, 메모리 누수를 확인하며, 메모리 사용량을 조정할 수 있습니다.

### 메모리 누수 확인

메모리 관리자 메트릭에 접근하려면 `kotlin.native.internal.GC.lastGCInfo()`를 호출하십시오. 이 메서드는 가비지 컬렉터의 마지막 실행에 대한 통계를 반환합니다. 이 통계는 다음 용도로 유용할 수 있습니다.

*   전역 변수를 사용할 때 메모리 누수 디버깅
*   테스트를 실행할 때 누수 확인

```kotlin
import kotlin.native.internal.*
import kotlin.test.*

class Resource

val global = mutableListOf<Resource>()

@OptIn(ExperimentalStdlibApi::class)
fun getUsage(): Long {
    GC.collect()
    return GC.lastGCInfo!!.memoryUsageAfter["heap"]!!.totalObjectsSizeBytes
}

fun run() {
    global.add(Resource())
    // The test will fail if you remove the next line
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // A separate function is used to ensure that all temporary objects are cleared
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

### 메모리 사용량 조정

프로그램에 메모리 누수가 없지만 예상치 않게 높은 메모리 사용량을 계속 확인한다면 Kotlin을 최신 버전으로 업데이트해 보십시오. 우리는 메모리 관리자를 지속적으로 개선하고 있으므로 간단한 컴파일러 업데이트만으로도 메모리 사용량이 개선될 수 있습니다.

업데이트 후에도 높은 메모리 사용량을 계속 경험한다면 Gradle 빌드 스크립트에 다음 컴파일러 옵션을 사용하여 시스템 메모리 할당자로 전환하십시오.

```none
-Xallocator=std
```

이것으로 메모리 사용량이 개선되지 않는다면 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)에 문제를 보고하십시오.

## 백그라운드 유닛 테스트

유닛 테스트에서는 메인 스레드 큐를 처리하는 것이 없으므로 모의(mocked)되지 않은 경우 `Dispatchers.Main`을 사용하지 마십시오. `kotlinx-coroutines-test`에서 `Dispatchers.setMain`을 호출하여 모의할 수 있습니다.

`kotlinx.coroutines`에 의존하지 않거나 어떤 이유로 `Dispatchers.setMain`이 작동하지 않는다면 테스트 런처를 구현하기 위한 다음 해결 방법을 시도해 보십시오.

```kotlin
package testlauncher

import platform.CoreFoundation.*
import kotlin.native.concurrent.*
import kotlin.native.internal.test.*
import kotlin.system.*

fun mainBackground(args: Array<String>) {
    val worker = Worker.start(name = "main-background")
    worker.execute(TransferMode.SAFE, { args.freeze() }) {
        val result = testLauncherEntryPoint(it)
        exitProcess(result)
    }
    CFRunLoopRun()
    error("CFRunLoopRun should never return")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

그런 다음, `-e testlauncher.mainBackground` 컴파일러 옵션을 사용하여 테스트 바이너리를 컴파일하십시오.

## 다음 단계

*   [레거시 메모리 관리자에서 마이그레이션](native-migration-guide.md)
*   [Swift/Objective-C ARC와의 통합 세부 사항 확인](native-arc-integration.md)