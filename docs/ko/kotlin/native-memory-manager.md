[//]: # (title: Kotlin/Native 메모리 관리)

Kotlin/Native는 JVM, Go 및 기타 주요 기술과 유사한 현대적인 메모리 매니저를 사용하며, 다음과 같은 기능을 포함합니다:

* 객체는 공유 힙(shared heap)에 저장되며 모든 스레드에서 접근할 수 있습니다.
* 로컬 및 전역 변수와 같은 "루트(roots)"로부터 도달할 수 없는 객체를 수집하기 위해 주기적으로 트레이싱 가비지 컬렉션(tracing garbage collection)이 수행됩니다.

## 가비지 컬렉터 (Garbage collector)

Kotlin/Native의 가비지 컬렉터(GC) 알고리즘은 지속적으로 발전하고 있습니다. 현재는 힙을 세대별로 나누지 않는 컨커런트 마크 및 스윕(concurrent mark and sweep, CMS) 컬렉터로 작동합니다.

GC는 별도의 스레드에서 실행되며, 메모리 압박 휴리스틱(memory pressure heuristics) 또는 타이머에 따라 시작됩니다. 또는 [수동으로 호출](#enable-garbage-collection-manually)할 수도 있습니다.

GC는 애플리케이션 스레드, GC 스레드 및 선택적인 마커(marker) 스레드를 포함하여 여러 스레드에서 병렬로 마크 큐를 처리합니다. 애플리케이션 스레드와 적어도 하나 이상의 GC 스레드가 마킹 프로세스에 참여합니다. 기본적으로 마킹 단계는 애플리케이션 스레드와 동시에(concurrently) 실행되어 GC 일시 중지 시간을 줄입니다. [GC 로그](#monitor-gc-performance)를 통해 GC 성능을 모니터링할 수 있습니다.

> `kotlin.native.binary.gcMarkSingleThreaded=true` 컴파일러 옵션으로 마크 단계의 병렬화를 비활성화할 수 있습니다. 그러나 이 경우 대규모 힙에서 가비지 컬렉터의 일시 중지 시간이 늘어날 수 있습니다.
>
{style="tip"}

마킹 단계가 완료되면, GC는 약한 참조(weak references)를 처리하고 마킹되지 않은 객체를 가리키는 참조 포인트를 null로 만듭니다. 기본적으로 약한 참조는 GC 일시 중지 시간을 줄이기 위해 동시에 처리됩니다.

CMS에서 문제가 발생하는 경우, 패러럴 마크 컨커런트 스윕(parallel mark concurrent sweep, PMCS) 설정으로 다시 전환하세요. 이를 위해 `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 설정하세요:

```none
kotlin.native.binary.gc=pmcs
```

### 가비지 컬렉션 수동 활성화

가비지 컬렉터를 강제로 시작하려면 `kotlin.native.internal.GC.collect()`를 호출하세요. 이 메서드는 새로운 컬렉션을 트리거하고 완료될 때까지 기다립니다.

### GC 성능 모니터링

GC 성능을 모니터링하기 위해 로그를 살펴보고 문제를 진단할 수 있습니다. 로그를 활성화하려면 Gradle 빌드 스크립트에 다음 컴파일러 옵션을 설정하세요:

```none
-Xruntime-logs=gc=info
```

현재 로그는 `stderr`로만 출력됩니다.

Apple 플랫폼에서는 Xcode Instruments 툴킷을 활용하여 iOS 앱 성능을 디버깅할 수 있습니다. 가비지 컬렉터는 Instruments에서 사용할 수 있는 사인포스트(signposts)를 통해 일시 중지 상황을 보고합니다. 사인포스트를 사용하면 앱 내에서 커스텀 로깅이 가능하므로, GC 일시 중지가 애플리케이션 프리징(freeze)과 일치하는지 확인할 수 있습니다.

앱에서 GC 관련 일시 중지를 추적하려면 다음 단계를 따르세요:

1. 이 기능을 활성화하려면 `gradle.properties` 파일에 다음 컴파일러 옵션을 설정하세요:
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. Xcode를 열고 **Product** | **Profile**을 선택하거나 <shortcut>Cmd + I</shortcut>를 누릅니다. 이 작업은 앱을 컴파일하고 Instruments를 실행합니다.
3. 템플릿 선택에서 **os_signpost**를 선택합니다.
4. **subsystem**으로 `org.kotlinlang.native.runtime`을, **category**로 `safepoint`를 지정하여 구성합니다.
5. 빨간색 녹화 버튼을 클릭하여 앱을 실행하고 사인포스트 이벤트 기록을 시작합니다:

   ![사인포스트로 GC 일시 중지 추적](native-gc-signposts.png){width=700}

   여기서 가장 낮은 그래프의 각 파란색 블롭(blob)은 개별 사인포스트 이벤트를 나타내며, 이는 곧 GC 일시 중지를 의미합니다.

### 가비지 컬렉션 비활성화

GC를 활성화 상태로 유지하는 것이 권장됩니다. 그러나 테스트 목적이나 프로그램 수명이 짧고 문제가 발생하는 경우와 같은 특정 사례에서는 GC를 비활성화할 수 있습니다. 이를 위해 `gradle.properties` 파일에 다음 바이너리 옵션을 설정하세요:

```none
kotlin.native.binary.gc=noop
```

> 이 옵션을 활성화하면 GC가 Kotlin 객체를 수집하지 않으므로, 프로그램이 실행되는 동안 메모리 소비가 계속 증가합니다. 시스템 메모리가 고갈되지 않도록 주의하세요.
>
{style="warning"}

## 메모리 소비 (Memory consumption)

Kotlin/Native는 자체 [메모리 할당자(memory allocator)](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)를 사용합니다. 이 할당자는 시스템 메모리를 페이지(page) 단위로 나누어 연속적인 순서로 독립적인 스윕이 가능하게 합니다. 각 할당은 페이지 내의 메모리 블록이 되며, 페이지는 블록 크기를 추적합니다. 다양한 페이지 유형이 다양한 할당 크기에 최적화되어 있습니다. 메모리 블록을 연속적으로 배치함으로써 할당된 모든 블록을 효율적으로 반복(iteration)할 수 있습니다.

스레드가 메모리를 할당할 때, 할당 크기에 따라 적절한 페이지를 검색합니다. 스레드는 다양한 크기 카테고리에 대한 페이지 세트를 유지 관리합니다. 일반적으로 지정된 크기에 대한 현재 페이지가 할당을 수용할 수 있습니다. 수용할 수 없는 경우, 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능할 수도 있고, 스윕이 필요할 수도 있으며, 새로 생성해야 할 수도 있습니다.

Kotlin/Native 메모리 할당자는 메모리 할당의 갑작스러운 급증에 대한 보호 기능을 갖추고 있습니다. 이는 뮤테이터(mutator)가 많은 양의 가비지를 빠르게 할당하기 시작하고 GC 스레드가 이를 따라가지 못해 메모리 사용량이 끝없이 늘어나는 상황을 방지합니다. 이 경우, GC는 반복이 완료될 때까지 스톱 더 월드 단계를 강제합니다.

직접 메모리 소비를 모니터링하고, 메모리 누수를 확인하며, 메모리 소비를 조정할 수 있습니다.

### 메모리 소비 모니터링

메모리 문제를 디버깅하기 위해 메모리 매니저 메트릭을 확인할 수 있습니다. 또한, Apple 플랫폼에서 Kotlin의 메모리 소비를 추적하는 것도 가능합니다.

#### 메모리 누수 확인

메모리 매니저 메트릭에 접근하려면 `kotlin.native.internal.GC.lastGCInfo()`를 호출하세요. 이 메서드는 가비지 컬렉터의 마지막 실행에 대한 통계를 반환합니다. 이 통계는 다음과 같은 경우에 유용합니다:

* 전역 변수를 사용할 때 메모리 누수 디버깅
* 테스트 실행 시 누수 확인

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
    // 다음 라인을 제거하면 테스트가 실패합니다.
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // 모든 임시 객체가 정리되었는지 확인하기 위해 별도의 함수를 사용합니다.
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

#### Apple 플랫폼에서 메모리 소비 추적

Apple 플랫폼에서 메모리 문제를 디버깅할 때 Kotlin 코드에 의해 얼마나 많은 메모리가 예약되었는지 확인할 수 있습니다. Kotlin의 지분(share)은 식별자로 태그가 지정되며 Xcode Instruments의 VM Tracker와 같은 도구를 통해 추적할 수 있습니다.

이 기능은 다음 조건이 _모두_ 충족될 때 기본 Kotlin/Native 메모리 할당자에서만 사용할 수 있습니다:

* **태깅 활성화**. 메모리에 유효한 식별자로 태그를 지정해야 합니다. Apple은 240에서 255 사이의 숫자를 권장하며, 기본값은 246입니다.

  `kotlin.native.binary.mmapTag=0` Gradle 속성을 설정하면 태깅이 비활성화됩니다.

* **mmap을 통한 할당**. 할당자는 `mmap` 시스템 호출을 사용하여 파일을 메모리에 매핑해야 합니다.

  `kotlin.native.binary.disableMmap=true` Gradle 속성을 설정하면 기본 할당자는 `mmap` 대신 `malloc`을 사용합니다.

* **페이징 활성화**. 할당의 페이징(버퍼링)이 활성화되어야 합니다.

  [`kotlin.native.binary.pagedAllocator=false`](#disable-allocator-paging) Gradle 속성을 설정하면 메모리가 객체별로 예약됩니다.

### 메모리 소비 조정

예상치 못하게 높은 메모리 소비가 발생하는 경우 다음 해결 방법을 시도해 보세요:

#### Kotlin 업데이트

Kotlin을 최신 버전으로 업데이트하세요. 메모리 매니저를 지속적으로 개선하고 있으므로 단순한 컴파일러 업데이트만으로도 메모리 소비가 개선될 수 있습니다.

#### 할당자 페이징 비활성화
<primary-label ref="experimental-opt-in"/>

메모리 할당자가 객체별로 메모리를 예약하도록 할당 페이징(버퍼링)을 비활성화할 수 있습니다. 일부 사례에서는 엄격한 메모리 제한을 충족하거나 애플리케이션 시작 시 메모리 소비를 줄이는 데 도움이 될 수 있습니다.

이를 위해 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.native.binary.pagedAllocator=false
```

> 할당자 페이징이 비활성화되면 [Apple 플랫폼에서 메모리 소비 추적](#track-memory-consumption-on-apple-platforms)이 불가능합니다.
> 
{style="note"}

#### Latin-1 문자열 지원 활성화
<primary-label ref="experimental-opt-in"/>

기본적으로 Kotlin의 문자열은 각 문자가 2바이트로 표현되는 UTF-16 인코딩을 사용하여 저장됩니다. 경우에 따라 이는 문자열이 소스 코드에 비해 바이너리에서 두 배의 공간을 차지하고, 데이터를 읽을 때 메모리를 두 배로 사용하는 결과를 초래합니다.

애플리케이션의 바이너리 크기를 줄이고 메모리 소비를 조정하려면 Latin-1 인코딩 문자열에 대한 지원을 활성화할 수 있습니다. [Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 인코딩은 처음 256개의 유니코드 문자를 각각 1바이트로만 표현합니다.

이를 활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.native.binary.latin1Strings=true
```

Latin-1 지원을 사용하면 모든 문자가 해당 범위 내에 있는 한 문자열은 Latin-1 인코딩으로 저장됩니다. 그렇지 않으면 기본 UTF-16 인코딩이 사용됩니다.

> 이 기능은 실험적(Experimental) 단계이므로, cinterop 확장 함수인 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html), [`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html), [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)의 효율성이 떨어질 수 있습니다. 이러한 함수를 호출할 때마다 UTF-16으로의 자동 문자열 변환이 트리거될 수 있습니다.
> 
{style="note"}

이러한 옵션 중 어느 것도 도움이 되지 않는다면 [YouTrack](https://kotl.in/issue)에 이슈를 생성해 주세요.

## 백그라운드에서의 유닛 테스트

유닛 테스트에서는 메인 스레드 큐를 처리하는 것이 없으므로, 모킹(mock)되지 않은 한 `Dispatchers.Main`을 사용하지 마세요. `kotlinx-coroutines-test`의 `Dispatchers.setMain`을 호출하여 모킹할 수 있습니다.

`kotlinx.coroutines`를 사용하지 않거나 어떤 이유로 `Dispatchers.setMain`이 작동하지 않는 경우, 테스트 런처를 구현하기 위해 다음 우회 방법을 시도해 보세요:

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

그런 다음 `-e testlauncher.mainBackground` 컴파일러 옵션을 사용하여 테스트 바이너리를 컴파일하세요.

## 다음 단계

* [레거시 메모리 매니저에서 마이그레이션](native-migration-guide.md)
* [Swift/Objective-C ARC와의 통합 세부 사항 확인](native-arc-integration.md)