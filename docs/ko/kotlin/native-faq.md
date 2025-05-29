[//]: # (title: Kotlin/Native 자주 묻는 질문)

## 프로그램은 어떻게 실행하나요?

`fun main(args: Array<String>)` 또는 전달되는 인자에 관심이 없다면 `fun main()`과 같은 최상위 함수를 정의하세요. 이때 해당 함수가 패키지 내에 있지 않도록 주의하세요.
또한, `-entry` 컴파일러 스위치를 사용하여 `Array<String>`을 받거나 인자가 없고 `Unit`을 반환하는 모든 함수를 진입점으로 만들 수 있습니다.

## Kotlin/Native 메모리 관리 모델은 무엇인가요?

Kotlin/Native는 Java나 Swift가 제공하는 것과 유사한 자동화된 메모리 관리 방식을 사용합니다.

[Kotlin/Native 메모리 관리자에 대해 알아보기](native-memory-manager.md)

## 공유 라이브러리는 어떻게 생성하나요?

`-produce dynamic` 컴파일러 옵션을 사용하거나 Gradle 빌드 파일에서 `binaries.sharedLib()`를 사용하세요.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

이는 플랫폼별 공유 객체(Linux에서는 `.so`, macOS에서는 `.dylib`, Windows 대상에서는 `.dll`)와 C 언어 헤더를 생성하여 C/C++ 코드에서 Kotlin/Native 프로그램의 모든 공개 API를 사용할 수 있도록 합니다.

[동적 라이브러리로 Kotlin/Native 튜토리얼 완료하기](native-dynamic-libraries.md)

## 정적 라이브러리 또는 오브젝트 파일은 어떻게 생성하나요?

`-produce static` 컴파일러 옵션을 사용하거나 Gradle 빌드 파일에서 `binaries.staticLib()`를 사용하세요.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

이는 플랫폼별 정적 객체(`.a` 라이브러리 형식)와 C 언어 헤더를 생성하여 C/C++ 코드에서 Kotlin/Native 프로그램의 모든 공개 API를 사용할 수 있도록 합니다.

## 기업 프록시 뒤에서 Kotlin/Native를 어떻게 실행하나요?

Kotlin/Native는 플랫폼별 툴체인을 다운로드해야 하므로, 컴파일러나 `gradlew` 인자로 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx`를 지정하거나, `JAVA_OPTS` 환경 변수를 통해 설정해야 합니다.

## Kotlin 프레임워크에 사용자 지정 Objective-C 접두사/이름을 어떻게 지정하나요?

`-module-name` 컴파일러 옵션 또는 일치하는 Gradle DSL 문을 사용하세요.

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

비트코드 임베딩은 Xcode 14에서 더 이상 사용되지 않고 Xcode 15에서는 모든 Apple 대상에서 제거되었습니다.
Kotlin/Native 컴파일러는 Kotlin 2.0.20부터 비트코드 임베딩을 지원하지 않습니다.

이전 버전의 Xcode를 사용 중이지만 Kotlin 2.0.20 또는 이후 버전으로 업그레이드하려면 Xcode 프로젝트에서 비트코드 임베딩을 비활성화하세요.

## 다른 코루틴에서 객체를 안전하게 참조하려면 어떻게 해야 하나요?

Kotlin/Native에서 여러 코루틴에 걸쳐 객체를 안전하게 접근하거나 업데이트하려면 `@Volatile` 및 `AtomicReference`와 같은 동시성 안전 구성 요소를 사용하는 것을 고려해 보세요.

`@Volatile`을 사용하여 `var` 프로퍼티에 어노테이션을 지정하세요.
이것은 해당 프로퍼티의 백킹 필드에 대한 모든 읽기 및 쓰기를 원자적으로 만듭니다. 또한, 쓰기는 다른 스레드에 즉시 보이게 됩니다. 다른 스레드가 이 프로퍼티에 접근할 때, 업데이트된 값뿐만 아니라 업데이트 전에 발생한 변경 사항도 관찰합니다.

대안으로, 원자적 읽기 및 업데이트를 지원하는 [AtomicReference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/-atomic-reference/)를 사용하세요. Kotlin/Native에서는 volatile 변수를 래핑하고 원자적 연산을 수행합니다.
Kotlin은 또한 특정 데이터 타입에 맞게 조정된 원자적 연산을 위한 타입 집합을 제공합니다. `AtomicInt`, `AtomicLong`, `AtomicBoolean`, `AtomicArray`, 그리고 `AtomicIntArray` 및 `AtomicLongArray`를 사용할 수 있습니다.

공유 가능한 가변 상태에 대한 접근에 대한 자세한 내용은 [코루틴 문서](shared-mutable-state-and-concurrency.md)를 참조하세요.

## 아직 릴리스되지 않은 버전의 Kotlin/Native로 프로젝트를 컴파일하려면 어떻게 해야 하나요?

먼저, [프리뷰 버전](eap.md)을 사용해 보는 것을 고려해 보세요.

훨씬 더 최신 개발 버전이 필요한 경우, 소스 코드에서 Kotlin/Native를 빌드할 수 있습니다. [Kotlin 리포지토리를 클론](https://github.com/JetBrains/kotlin)하고 [다음 단계](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source)를 따르세요.