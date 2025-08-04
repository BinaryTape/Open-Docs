[//]: # (title: Kotlin/Native 자주 묻는 질문)

## 내 프로그램을 어떻게 실행하나요?

전달된 인수에 관심이 없다면 최상위 함수 `fun main(args: Array<String>)` 또는 `fun main()`을 정의하세요. 이때 함수가 패키지 안에 있지 않도록 확인해야 합니다.
또한, 컴파일러 스위치 `-entry`를 사용하여 `Array<String>` 또는 인수를 받지 않고 `Unit`을 반환하는 모든 함수를 진입점으로 설정할 수 있습니다.

## Kotlin/Native 메모리 관리 모델이란 무엇인가요?

Kotlin/Native는 Java나 Swift가 제공하는 것과 유사한 자동화된 메모리 관리 방식을 사용합니다.

[Kotlin/Native 메모리 관리자 알아보기](native-memory-manager.md)

## 공유 라이브러리를 어떻게 생성하나요?

Gradle 빌드 파일에서 `-produce dynamic` 컴파일러 옵션 또는 `binaries.sharedLib()`를 사용하세요.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

이는 플랫폼별 공유 객체(Linux에서는 `.so`, macOS에서는 `.dylib`, Windows 대상에서는 `.dll`)와 C 언어 헤더를 생성하여, C/C++ 코드에서 Kotlin/Native 프로그램의 모든 공개 API를 사용할 수 있도록 합니다.

[동적 라이브러리로서의 Kotlin/Native 튜토리얼 완료하기](native-dynamic-libraries.md)

## 정적 라이브러리 또는 객체 파일을 어떻게 생성하나요?

Gradle 빌드 파일에서 `-produce static` 컴파일러 옵션 또는 `binaries.staticLib()`를 사용하세요.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

이는 플랫폼별 정적 객체(`.a` 라이브러리 형식)와 C 언어 헤더를 생성하여, C/C++ 코드에서 Kotlin/Native 프로그램의 모든 공개 API를 사용할 수 있도록 합니다.

## 회사 프록시 뒤에서 Kotlin/Native를 어떻게 실행하나요?

Kotlin/Native는 플랫폼별 툴체인(toolchain)을 다운로드해야 하므로, 컴파일러 또는 `gradlew` 인수로 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx`를 지정하거나 `JAVA_OPTS` 환경 변수를 통해 설정해야 합니다.

## Kotlin 프레임워크에 사용자 지정 Objective-C 접두사/이름을 어떻게 지정하나요?

컴파일러 옵션 `-module-name` 또는 해당 Gradle DSL 문을 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</tab>
</tabs>

## iOS 프레임워크 이름을 어떻게 변경하나요?

iOS 프레임워크의 기본 이름은 `<project name>.framework`입니다.
사용자 지정 이름을 설정하려면 `baseName` 옵션을 사용하세요. 이 옵션은 모듈 이름도 설정합니다.

```kotlin
kotlin {
    iosArm64("myapp") {
       binaries {
          framework {
              baseName = "TheName"
          }
       }
    }
}
```

## Kotlin 프레임워크에 비트코드를 어떻게 활성화하나요?

비트코드 임베딩(Bitcode embedding)은 Xcode 14에서 더 이상 사용되지 않으며 Xcode 15부터 모든 Apple 대상에서 제거되었습니다.
Kotlin/Native 컴파일러는 Kotlin 2.0.20부터 비트코드 임베딩을 지원하지 않습니다.

이전 버전의 Xcode를 사용 중이지만 Kotlin 2.0.20 이상 버전으로 업그레이드하려는 경우, Xcode 프로젝트에서 비트코드 임베딩을 비활성화하세요.

## 서로 다른 코루틴에서 객체를 안전하게 참조하려면 어떻게 해야 하나요?

Kotlin/Native에서 여러 코루틴에 걸쳐 객체를 안전하게 접근하거나 업데이트하려면 `@Volatile` 및 `AtomicReference`와 같은 동시성 안전(concurrency-safe) 구조를 사용하는 것을 고려하세요.

[`@Volatile`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-volatile/)을 사용하여 `var` 프로퍼티에 어노테이션을 달 수 있습니다.
이는 해당 프로퍼티의 백킹 필드에 대한 모든 읽기 및 쓰기를 원자적(atomic)으로 만듭니다. 또한, 쓰기 작업은 다른 스레드에 즉시 가시화됩니다. 다른 스레드가 이 프로퍼티에 접근할 때, 업데이트된 값뿐만 아니라 업데이트 이전에 발생한 변경 사항도 관찰합니다.

대안으로, 원자적(atomic) 읽기 및 업데이트를 지원하는 [AtomicReference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/-atomic-reference/)를 사용하세요. Kotlin/Native에서는 휘발성 변수(volatile variable)를 래핑하고 원자적 연산(atomic operations)을 수행합니다.
Kotlin은 또한 특정 데이터 타입에 맞춰진 원자적 연산을 위한 여러 타입을 제공합니다. `AtomicInt`, `AtomicLong`, `AtomicBoolean`, `AtomicArray`, 그리고 `AtomicIntArray` 및 `AtomicLongArray`를 사용할 수 있습니다.

공유 변경 가능 상태(shared mutable state) 접근에 대한 더 자세한 정보는 [코루틴 문서](shared-mutable-state-and-concurrency.md)를 참조하세요.

## Kotlin/Native의 미공개 버전으로 프로젝트를 어떻게 컴파일할 수 있나요?

먼저, [프리뷰 버전](eap.md)을 사용해 보는 것을 고려해 보세요.

만약 더 최신 개발 버전이 필요한 경우, 소스 코드에서 Kotlin/Native를 빌드할 수 있습니다.
[Kotlin 리포지토리](https://github.com/JetBrains/kotlin)를 클론(clone)하고 [다음 단계](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source)를 따르세요.