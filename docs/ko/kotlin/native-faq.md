---
title: "Kotlin/Native FAQ"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 프로그램을 어떻게 실행하나요?

최상위 함수 `fun main(args: Array<String>)`를 정의하거나, 전달된 인수에 관심이 없다면 `fun main()`만 정의하십시오. 패키지 내에 있지 않도록 하십시오.
또한 컴파일러 스위치 `-entry`를 사용하면 `Array<String>`을 인수로 받거나 인수가 없고 `Unit`을 반환하는 모든 함수를
진입점으로 사용할 수 있습니다.

## Kotlin/Native 메모리 관리 모델은 무엇인가요?

Kotlin/Native는 Java 또는 Swift에서 제공하는 것과 유사한 자동 메모리 관리 체계를 사용합니다.

[Kotlin/Native 메모리 관리자에 대해 알아보기](native-memory-manager)

## 공유 라이브러리를 어떻게 만드나요?

`-produce dynamic` 컴파일러 옵션 또는 Gradle 빌드 파일에서 `binaries.sharedLib()`를 사용하십시오.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

이는 플랫폼별 공유 객체(Linux에서는 `.so`, macOS에서는 `.dylib`, Windows 대상에서는 `.dll`)와
C 언어 헤더를 생성하여 C/C++ 코드에서 Kotlin/Native 프로그램에서 사용할 수 있는 모든 public API를 사용할 수 있도록 합니다.

[동적 라이브러리 튜토리얼로 Kotlin/Native 완료하기](native-dynamic-libraries)

## 정적 라이브러리 또는 객체 파일을 어떻게 만드나요?

`-produce static` 컴파일러 옵션 또는 Gradle 빌드 파일에서 `binaries.staticLib()`를 사용하십시오.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

이는 플랫폼별 정적 객체(`.a` 라이브러리 형식)와 C 언어 헤더를 생성하여 C/C++ 코드에서 Kotlin/Native 프로그램에서 사용할 수 있는 모든 public API를 사용할 수 있도록 합니다.

## 회사 프록시 뒤에서 Kotlin/Native를 어떻게 실행하나요?

Kotlin/Native는 플랫폼별 툴체인을 다운로드해야 하므로 컴파일러 또는 `gradlew` 인수로
`-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx`를 지정하거나
`JAVA_OPTS` 환경 변수를 통해 설정해야 합니다.

## Kotlin 프레임워크에 대한 사용자 정의 Objective-C 접두사/이름을 어떻게 지정하나요?

`-module-name` 컴파일러 옵션 또는 일치하는 Gradle DSL 구문을 사용하십시오.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</TabItem>
</Tabs>

## iOS 프레임워크 이름을 어떻게 변경하나요?

iOS 프레임워크의 기본 이름은 `<project name>.framework`입니다.
사용자 정의 이름을 설정하려면 `baseName` 옵션을 사용하십시오. 이렇게 하면 모듈 이름도 설정됩니다.

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

## Kotlin 프레임워크에 대해 bitcode를 어떻게 활성화하나요?

Bitcode 임베딩은 Xcode 14에서 더 이상 사용되지 않고 모든 Apple 대상에 대해 Xcode 15에서 제거되었습니다.
Kotlin/Native 컴파일러는 Kotlin 2.0.20 이후로 bitcode 임베딩을 지원하지 않습니다.

이전 버전의 Xcode를 사용하고 있지만 Kotlin 2.0.20 이상 버전으로 업그레이드하려면 Xcode 프로젝트에서 bitcode 임베딩을 비활성화하십시오.

## InvalidMutabilityException이 보이는 이유는 무엇인가요?

:::note
이 문제는 레거시 메모리 관리자에만 해당됩니다. [Kotlin/Native 메모리 관리](native-memory-manager)를 확인하여
Kotlin 1.7.20부터 기본적으로 활성화된 새로운 메모리 관리자에 대해 알아보세요.

:::

이는 고정된 객체를 변경하려고 시도하기 때문에 발생할 가능성이 높습니다. 객체는 `kotlin.native.concurrent.freeze`가 호출된 객체에서 도달 가능한 객체로서 명시적으로 또는
암시적으로(예: `enum` 또는 전역 싱글톤 객체에서 도달 가능 - 다음 질문 참조) 고정 상태로 전송될 수 있습니다.

## 싱글톤 객체를 변경 가능하게 만들려면 어떻게 해야 하나요?

:::note
이 문제는 레거시 메모리 관리자에만 해당됩니다. [Kotlin/Native 메모리 관리](native-memory-manager)를 확인하여
Kotlin 1.7.20부터 기본적으로 활성화된 새로운 메모리 관리자에 대해 알아보세요.

:::

현재 싱글톤 객체는 변경 불가능하며(즉, 생성 후 고정됨) 전역 상태를 변경 불가능하게 유지하는 것이 일반적으로 좋은 방법으로 간주됩니다.
어떤 이유로든 해당 객체 내부에 변경 가능한 상태가 필요한 경우 객체에 `@konan.ThreadLocal` 어노테이션을 사용하십시오. 또한 `kotlin.native.concurrent.AtomicReference` 클래스를 사용하여
고정된 객체에 대한 다른 포인터를 고정된 객체에 저장하고 자동으로 업데이트할 수 있습니다.

## 릴리스되지 않은 버전의 Kotlin/Native로 프로젝트를 어떻게 컴파일할 수 있나요?

먼저 [미리보기 버전](eap)을 사용해 보십시오.

최신 개발 버전이 필요한 경우 소스 코드에서 Kotlin/Native를 빌드할 수 있습니다.
[Kotlin 저장소](https://github.com/JetBrains/kotlin)를 복제하고 [이러한 단계](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README#building-from-source)를 따르십시오.