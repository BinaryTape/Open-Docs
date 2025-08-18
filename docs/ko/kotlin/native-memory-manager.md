[//]: # (title: Kotlin/Native 메모리 관리)

Kotlin/Native는 JVM, Go 및 기타 주류 기술과 유사한 최신 메모리 관리자를 사용하며, 다음과 같은 특징을 포함합니다:

*   객체는 공유 힙에 저장되며 모든 스레드에서 접근할 수 있습니다.
*   "루트(roots)"(예: 지역 변수 및 전역 변수)에서 접근할 수 없는 객체를 수집하기 위해 추적 가비지 컬렉션(tracing garbage collection)이 주기적으로 수행됩니다.

## 가비지 컬렉터

Kotlin/Native의 가비지 컬렉터(GC) 알고리즘은 지속적으로 발전하고 있습니다. 현재, 이는 힙을 세대별로 분리하지 않는 스톱-더-월드(stop-the-world) 마크 및 동시 스윕(concurrent sweep) 컬렉터로 작동합니다.

GC는 별도의 스레드에서 실행되며 메모리 압력 휴리스틱(heuristics) 또는 타이머에 따라 시작됩니다. 또는 [수동으로 호출](#enable-garbage-collection-manually)할 수도 있습니다.

GC는 애플리케이션 스레드, GC 스레드 및 선택적 마커 스레드를 포함하여 여러 스레드에서 마크 큐를 병렬로 처리합니다. 애플리케이션 스레드와 최소 하나의 GC 스레드가 마킹 프로세스에 참여합니다. 기본적으로 GC가 힙의 객체를 마킹할 때 애플리케이션 스레드는 일시 중지되어야 합니다.

> `kotlin.native.binary.gcMarkSingleThreaded=true` 컴파일러 옵션으로 마크 단계의 병렬화를 비활성화할 수 있습니다.
> 하지만 이는 대규모 힙에서 가비지 컬렉터의 일시 중지 시간을 증가시킬 수 있습니다.
>
{style="tip"}

마킹 단계가 완료되면 GC는 약한 참조(weak references)를 처리하고 마크되지 않은 객체를 가리키는 참조 포인트를 무효화합니다. 기본적으로 약한 참조는 GC 일시 중지 시간을 줄이기 위해 동시에 처리됩니다.

가비지 컬렉션을 [모니터링](#monitor-gc-performance)하고 [최적화](#optimize-gc-performance)하는 방법을 알아보세요.

### 수동으로 가비지 컬렉션 활성화

가비지 컬렉터를 강제로 시작하려면 `kotlin.native.internal.GC.collect()`를 호출합니다. 이 메서드는 새 컬렉션을 트리거하고 완료를 기다립니다.

### GC 성능 모니터링

GC 성능을 모니터링하려면 로그를 살펴보고 문제를 진단할 수 있습니다. 로깅을 활성화하려면 Gradle 빌드 스크립트에서 다음 컴파일러 옵션을 설정하세요:

```none
-Xruntime-logs=gc=info
```

현재 로그는 `stderr`로만 출력됩니다.

Apple 플랫폼에서는 Xcode Instruments 툴킷을 활용하여 iOS 앱 성능을 디버그할 수 있습니다. 가비지 컬렉터는 Instruments에서 사용 가능한 사인포스트(signposts)를 통해 일시 중지를 보고합니다. 사인포스트는 앱 내에서 사용자 정의 로깅을 가능하게 하여 GC 일시 중지가 애플리케이션 정지와 일치하는지 확인할 수 있도록 합니다.

앱에서 GC 관련 일시 중지를 추적하려면:

1.  이 기능을 활성화하려면 `gradle.properties` 파일에 다음 컴파일러 옵션을 설정하세요:

    ```none
    kotlin.native.binary.enableSafepointSignposts=true
    ```

2.  Xcode를 열고 **Product** | **Profile**로 이동하거나 <shortcut>Cmd + I</shortcut>를 누르세요. 이 동작은 앱을 컴파일하고 Instruments를 시작합니다.
3.  템플릿 선택에서 **os_signpost**를 선택합니다.
4.  **subsystem**을 `org.kotlinlang.native.runtime`으로, **category**를 `safepoint`으로 지정하여 구성합니다.
5.  빨간색 기록 버튼을 클릭하여 앱을 실행하고 사인포스트 이벤트 기록을 시작합니다:

    ![Tracking GC pauses as signposts](native-gc-signposts.png){width=700}

    여기서 가장 아래 그래프의 각 파란색 점(blob)은 GC 일시 중지인 별도의 사인포스트 이벤트를 나타냅니다.

### GC 성능 최적화

GC 성능을 향상시키려면 동시 마킹(concurrent marking)을 활성화하여 GC 일시 중지 시간을 줄일 수 있습니다. 이를 통해 가비지 컬렉션의 마킹 단계가 애플리케이션 스레드와 동시에 실행될 수 있습니다.

이 기능은 현재 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 활성화하려면 `gradle.properties` 파일에 다음 컴파일러 옵션을 설정하세요:

```none
kotlin.native.binary.gc=cms
```

### 가비지 컬렉션 비활성화

GC를 활성화 상태로 유지하는 것이 좋습니다. 하지만 테스트 목적이거나 문제가 발생하여 프로그램 실행 시간이 짧은 경우와 같이 특정 상황에서는 비활성화할 수 있습니다. 그렇게 하려면 `gradle.properties` 파일에 다음 바이너리 옵션을 설정하세요:

```none
kotlin.native.binary.gc=noop
```

> 이 옵션을 활성화하면 GC가 Kotlin 객체를 수집하지 않으므로 프로그램이 실행되는 동안 메모리 소비가 계속 증가합니다. 시스템 메모리가 고갈되지 않도록 주의하세요.
>
{style="warning"}

## 메모리 소비

Kotlin/Native는 자체 [메모리 할당자](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)를 사용합니다. 이 할당자는 시스템 메모리를 페이지로 나누어 연속적인 순서로 독립적인 스윕(sweeping)을 허용합니다. 각 할당은 페이지 내의 메모리 블록이 되며, 페이지는 블록 크기를 추적합니다. 다양한 페이지 유형은 다양한 할당 크기에 최적화되어 있습니다. 메모리 블록의 연속적인 배열은 할당된 모든 블록을 효율적으로 반복할 수 있도록 보장합니다.

스레드가 메모리를 할당할 때, 할당 크기에 따라 적합한 페이지를 검색합니다. 스레드는 다양한 크기 범주에 대한 페이지 집합을 유지합니다. 일반적으로 주어진 크기에 대한 현재 페이지는 할당을 수용할 수 있습니다. 그렇지 않으면 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능하거나, 스윕이 필요하거나, 먼저 생성되어야 할 수 있습니다.

Kotlin/Native 메모리 할당자에는 급작스러운 메모리 할당 급증에 대한 보호 기능이 있습니다. 이 기능은 뮤테이터(mutator)가 많은 가비지를 빠르게 할당하기 시작하고 GC 스레드가 이를 따라잡지 못하여 메모리 사용량이 끝없이 증가하는 상황을 방지합니다. 이 경우 GC는 반복이 완료될 때까지 스톱-더-월드 단계를 강제합니다.

메모리 소비를 직접 모니터링하고, 메모리 누수를 확인하고, 메모리 소비를 조정할 수 있습니다.

### 메모리 소비 모니터링

메모리 문제를 디버그하려면 메모리 관리자 메트릭을 확인할 수 있습니다. 또한 Apple 플랫폼에서 Kotlin의 메모리 소비를 추적할 수 있습니다.

#### 메모리 누수 확인

메모리 관리자 메트릭에 접근하려면 `kotlin.native.internal.GC.lastGCInfo()`를 호출합니다. 이 메서드는 가비지 컬렉터의 마지막 실행에 대한 통계를 반환합니다. 이 통계는 다음 용도로 유용합니다:

*   전역 변수를 사용할 때 메모리 누수 디버깅
*   테스트 실행 시 누수 확인

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

#### Apple 플랫폼에서 메모리 소비 추적

Apple 플랫폼에서 메모리 문제를 디버그할 때 Kotlin 코드에 의해 예약된 메모리 양을 확인할 수 있습니다. Kotlin의 점유율은 식별자로 태그되며 Xcode Instruments의 VM Tracker와 같은 도구를 통해 추적할 수 있습니다.

이 기능은 다음 조건이 _모두_ 충족될 때 기본 Kotlin/Native 메모리 할당자에만 사용할 수 있습니다:

*   **태깅 활성화**. 메모리는 유효한 식별자로 태그되어야 합니다. Apple은 240에서 255 사이의 숫자를 권장하며, 기본값은 246입니다.

    `kotlin.native.binary.mmapTag=0` Gradle 속성을 설정하면 태깅이 비활성화됩니다.

*   **mmap을 이용한 할당**. 할당자는 `mmap` 시스템 호출을 사용하여 파일을 메모리로 매핑해야 합니다.

    `kotlin.native.binary.disableMmap=true` Gradle 속성을 설정하면 기본 할당자는 `mmap` 대신 `malloc`을 사용합니다.

*   **페이징 활성화**. 할당의 페이징(버퍼링)이 활성화되어야 합니다.

    `kotlin.native.binary.pagedAllocator=false` Gradle 속성을 설정하면 메모리가 객체당(per-object)으로 예약됩니다.

### 메모리 소비 조정

예상치 않게 높은 메모리 소비를 겪고 있다면 다음 해결책을 시도해 보세요:

#### Kotlin 업데이트

Kotlin을 최신 버전으로 업데이트하세요. 저희는 메모리 관리자를 지속적으로 개선하고 있으므로, 간단한 컴파일러 업데이트만으로도 메모리 소비를 개선할 수 있습니다.

#### 할당자 페이징 비활성화
<primary-label ref="experimental-opt-in"/>

할당의 페이징(버퍼링)을 비활성화하여 메모리 할당자가 객체당 메모리를 예약하도록 할 수 있습니다. 경우에 따라 엄격한 메모리 제한을 충족하거나 애플리케이션 시작 시 메모리 소비를 줄이는 데 도움이 될 수 있습니다.

그러려면 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.native.binary.pagedAllocator=false
```

> 할당자 페이징을 비활성화하면 [Apple 플랫폼에서 메모리 소비를 추적](#track-memory-consumption-on-apple-platforms)할 수 없습니다.
>
{style="note"}

#### Latin-1 문자열 지원 활성화
<primary-label ref="experimental-opt-in"/>

기본적으로 Kotlin의 문자열은 UTF-16 인코딩을 사용하여 저장되며, 각 문자는 2바이트로 표현됩니다. 경우에 따라 이는 문자열이 소스 코드보다 바이너리에서 두 배 많은 공간을 차지하고 데이터를 읽는 데 두 배 많은 메모리를 사용하는 결과를 초래합니다.

애플리케이션의 바이너리 크기를 줄이고 메모리 소비를 조정하려면 Latin-1 인코딩 문자열 지원을 활성화할 수 있습니다. [Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 인코딩은 처음 256개의 유니코드 문자를 단 1바이트로 표현합니다.

활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.native.binary.latin1Strings=true
```

Latin-1 지원을 활성화하면 모든 문자가 해당 범위 내에 있는 한 문자열은 Latin-1 인코딩으로 저장됩니다. 그렇지 않은 경우 기본 UTF-16 인코딩이 사용됩니다.

> 이 기능은 실험적(Experimental)이지만, cinterop 확장 함수인 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html), [`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html), 그리고 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)의 효율성이 떨어집니다.
> 이러한 각 호출은 자동 문자열 변환을 UTF-16으로 트리거할 수 있습니다.
>
{style="note"}

이러한 옵션 중 어느 것도 도움이 되지 않았다면, [YouTrack](https://kotl.in/issue)에 이슈를 생성하세요.

## 백그라운드에서 단위 테스트

단위 테스트에서는 메인 스레드 큐를 처리하는 것이 없으므로, 모의(mock)되지 않았다면 `Dispatchers.Main`을 사용하지 마세요. 모의는 `kotlinx-coroutines-test`에서 `Dispatchers.setMain`을 호출하여 수행할 수 있습니다.

`kotlinx.coroutines`에 의존하지 않거나 어떤 이유로든 `Dispatchers.setMain`이 작동하지 않는다면, 테스트 런처 구현을 위해 다음 해결 방법을 시도해 보세요:

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

그런 다음 `-e testlauncher.mainBackground` 컴파일러 옵션으로 테스트 바이너리를 컴파일하세요.

## 다음 단계

*   [레거시 메모리 관리자에서 마이그레이션](native-migration-guide.md)
*   [Swift/Objective-C ARC 통합 세부 정보 확인](native-arc-integration.md)