---
title: "Kotlin/Native 메모리 관리"
---
Kotlin/Native는 JVM, Go 및 기타 주류 기술과 유사한 최신 메모리 관리자를 사용하며 다음과 같은 기능을 포함합니다.

* 객체는 공유 힙에 저장되며 모든 스레드에서 액세스할 수 있습니다.
* 추적 가비지 수집은 로컬 및 전역 변수와 같은 "루트"에서 연결할 수 없는 객체를 수집하기 위해 주기적으로 수행됩니다.

## 가비지 수집기

Kotlin/Native의 가비지 수집기(GC) 알고리즘은 끊임없이 진화하고 있습니다. 현재는 stop-the-world mark로 작동합니다.
힙을 세대로 분리하지 않는 동시 스윕 수집기입니다.

GC는 별도의 스레드에서 실행되며 메모리 압력 휴리스틱 또는 타이머에 따라 시작됩니다. 또는
[수동으로 호출할 수 있습니다](#enable-garbage-collection-manually).

GC는 애플리케이션 스레드, GC 스레드,
선택적 마커 스레드를 포함하여 여러 스레드에서 병렬로 마크 큐를 처리합니다. 애플리케이션 스레드와 하나 이상의 GC 스레드가 마킹 프로세스에 참여합니다.
기본적으로 GC가 힙에서 객체를 마킹할 때 애플리케이션 스레드를 일시 중지해야 합니다.

:::tip
`kotlin.native.binary.gcMarkSingleThreaded=true` 컴파일러 옵션을 사용하여 마크 단계의 병렬 처리를 비활성화할 수 있습니다.
그러나 이렇게 하면 큰 힙에서 가비지 수집기의 일시 중지 시간이 늘어날 수 있습니다.

:::

마킹 단계가 완료되면 GC는 weak references를 처리하고 마크되지 않은 객체에 대한 참조 지점을 무효화합니다.
기본적으로 weak references는 GC 일시 중지 시간을 줄이기 위해 동시에 처리됩니다.

가비지 수집을 [모니터링](#monitor-gc-performance)하고 [최적화](#optimize-gc-performance)하는 방법을 참조하세요.

### 가비지 수집을 수동으로 활성화

가비지 수집기를 강제로 시작하려면 `kotlin.native.internal.GC.collect()`를 호출합니다. 이 메서드는 새로운 수집을 트리거합니다
완료될 때까지 기다립니다.

### GC 성능 모니터링

GC 성능을 모니터링하려면 로그를 살펴보고 문제를 진단할 수 있습니다. 로깅을 활성화하려면
Gradle 빌드 스크립트에서 다음 컴파일러 옵션을 설정합니다.

```none
-Xruntime-logs=gc=info
```

현재 로그는 `stderr`에만 출력됩니다.

Apple 플랫폼에서는 Xcode Instruments 툴킷을 사용하여 iOS 앱 성능을 디버깅할 수 있습니다.
가비지 수집기는 Instruments에서 사용할 수 있는 signpost를 사용하여 일시 중지를 보고합니다.
Signpost를 사용하면 앱 내에서 사용자 지정 로깅을 수행하여 GC 일시 중지가 애플리케이션 정지에 해당하는지 확인할 수 있습니다.

앱에서 GC 관련 일시 중지를 추적하려면:

1. 이 기능을 활성화하려면 `gradle.properties` 파일에서 다음 컴파일러 옵션을 설정합니다.
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. Xcode를 열고 **Product** | **Profile**로 이동하거나 <shortcut>Cmd + I</shortcut>를 누릅니다. 이 작업은 앱을 컴파일하고
   Instruments를 실행합니다.
3. 템플릿 선택에서 **os_signpost**를 선택합니다.
4. **subsystem**으로 `org.kotlinlang.native.runtime`을, **category**로 `safepoint`를 지정하여 구성합니다.
5. 빨간색 기록 버튼을 클릭하여 앱을 실행하고 signpost 이벤트 기록을 시작합니다.

   <img src="/img/native-gc-signposts.png" alt="Tracking GC pauses as signposts" width="700" style={{verticalAlign: 'middle'}}/>

   여기서 가장 낮은 그래프의 각 파란색 blob은 별도의 signpost 이벤트, 즉 GC 일시 중지를 나타냅니다.

### GC 성능 최적화

GC 성능을 개선하려면 동시 마킹을 활성화하여 GC 일시 중지 시간을 줄일 수 있습니다. 이렇게 하면 가비지 수집의 마킹 단계가 애플리케이션 스레드와 동시에 실행될 수 있습니다.

이 기능은 현재 [Experimental](components-stability#stability-levels-explained)입니다. 활성화하려면
`gradle.properties` 파일에서 다음 컴파일러 옵션을 설정합니다.
  
```none
kotlin.native.binary.gc=cms
```

### 가비지 수집 비활성화

GC를 활성화된 상태로 유지하는 것이 좋습니다. 그러나 테스트 목적과 같이 특정 경우에는 비활성화할 수 있습니다.
문제가 발생하고 프로그램이 수명이 짧은 경우. 이렇게 하려면 다음 바이너리 옵션을 설정합니다.
`gradle.properties` 파일:

```none
kotlin.native.binary.gc=noop
```

:::caution
이 옵션을 활성화하면 GC가 Kotlin 객체를 수집하지 않으므로 프로그램이 실행되는 동안 메모리 소비가 계속 증가합니다.
시스템 메모리를 소모하지 않도록 주의하세요.

:::

## 메모리 소비

Kotlin/Native는 자체 [메모리 할당자](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)를 사용합니다.
시스템 메모리를 페이지로 나누어 연속 순서로 독립적인 스윕을 허용합니다. 각 할당은 페이지 내의 메모리
블록이 되고 페이지는 블록 크기를 추적합니다. 다양한 페이지 유형은 다양한 할당에 최적화되어 있습니다.
크기. 메모리 블록의 연속적인 배열은 할당된 모든 블록을 효율적으로 반복할 수 있도록 합니다.

스레드가 메모리를 할당할 때 할당 크기에 따라 적절한 페이지를 검색합니다. 스레드는 다양한 크기 범주에 대한 페이지 집합을 유지 관리합니다.
일반적으로 지정된 크기에 대한 현재 페이지는 할당을 수용할 수 있습니다.
그렇지 않으면 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능하거나
스윕이 필요하거나 먼저 생성해야 합니다.

Kotlin/Native 메모리 할당자는 메모리 할당의 갑작스러운 급증에 대한 보호 기능을 제공합니다. 이를 통해
뮤테이터가 빠르게 많은 가비지를 할당하기 시작하고 GC 스레드가 이를 따라갈 수 없어 메모리 사용량이 끝없이 증가하는 상황을 방지합니다.
이 경우 GC는 반복이 완료될 때까지 stop-the-world 단계를 강제합니다.

직접 메모리 소비를 모니터링하고, 메모리 누수를 확인하고, 메모리 소비를 조정할 수 있습니다.

### 메모리 누수 확인

메모리 관리자 메트릭에 액세스하려면 `kotlin.native.internal.GC.lastGCInfo()`를 호출합니다. 이 메서드는 마지막
가비지 수집기 실행에 대한 통계를 반환합니다. 통계는 다음과 같은 경우에 유용할 수 있습니다.

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

### 메모리 소비 조정

프로그램에 메모리 누수가 없지만 예상보다 높은 메모리 소비가 계속 발생하면
Kotlin을 최신 버전으로 업데이트해 보세요. 메모리 관리자를 지속적으로 개선하고 있으므로 간단한 컴파일러 업데이트만으로도
메모리 소비를 개선할 수 있습니다.

업데이트 후에도 높은 메모리 소비가 계속 발생하면 다음을 사용하여 시스템 메모리 할당자로 전환합니다.
Gradle 빌드 스크립트에서 다음 컴파일러 옵션을 사용합니다.

```none
-Xallocator=std
```

이렇게 해도 메모리 소비가 개선되지 않으면 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)에서 문제를 보고하세요.

## 백그라운드에서 단위 테스트

단위 테스트에서는 메인 스레드 큐를 처리하는 것이 없으므로 `Dispatchers.Main`이 mocking되지 않은 경우에는 사용하지 마세요. mocking은 `kotlinx-coroutines-test`에서 `Dispatchers.setMain`을 호출하여 수행할 수 있습니다.

`kotlinx.coroutines`를 사용하지 않거나 `Dispatchers.setMain`이 어떤 이유로 작동하지 않으면 다음
테스트 런처 구현에 대한 해결 방법을 시도해 보세요.

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

그런 다음 `-e testlauncher.mainBackground` 컴파일러 옵션으로 테스트 바이너리를 컴파일합니다.

## 다음 단계

* [레거시 메모리 관리자에서 마이그레이션](native-migration-guide)
* [Swift/Objective-C ARC와의 통합에 대한 세부 사항 확인](native-arc-integration)