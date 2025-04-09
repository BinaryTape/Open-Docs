---
title: "Kotlin Multiplatform을 사용한 KSP"
---
빠른 시작을 위해 KSP 프로세서를 정의하는 [샘플 Kotlin Multiplatform 프로젝트](https://github.com/google/ksp/tree/main/examples/multiplatform)를 참조하세요.

KSP 1.0.1부터 Multiplatform 프로젝트에 KSP를 적용하는 것은 단일 플랫폼인 JVM 프로젝트에 적용하는 것과 유사합니다.
주요 차이점은 종속성에서 `ksp(...)` 구성을 작성하는 대신 컴파일 전에 어떤 컴파일 대상에 심볼 처리가 필요한지 지정하기 위해 `add(ksp<Target>)` 또는 `add(ksp<SourceSet>)`가 사용된다는 점입니다.

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    jvm()
    linuxX64 {
        binaries {
            executable()
        }
    }
}

dependencies {
    add("kspCommonMainMetadata", project(":test-processor"))
    add("kspJvm", project(":test-processor"))
    add("kspJvmTest", project(":test-processor")) // JVM에 대한 테스트 소스 세트가 없으므로 아무 작업도 수행하지 않음
    // kspLinuxX64가 지정되지 않았으므로 Linux x64 메인 소스 세트에 대한 처리가 없습니다.
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## 컴파일 및 처리

Multiplatform 프로젝트에서 Kotlin 컴파일은 각 플랫폼에 대해 여러 번( `main`, `test` 또는 기타 빌드 플레이버) 발생할 수 있습니다.
심볼 처리도 마찬가지입니다. Kotlin 컴파일 작업과 해당하는 `ksp<Target>` 또는 `ksp<SourceSet>` 구성이 지정될 때마다 심볼 처리 작업이 생성됩니다.

예를 들어 위의 `build.gradle.kts`에는 common/metadata, JVM main, Linux x64 main, Linux x64 test의 4가지 컴파일 작업과 common/metadata, JVM main, Linux x64 test의 3가지 심볼 처리 작업이 있습니다.

## KSP 1.0.1+에서 ksp(...) 구성 사용을 피하십시오.

KSP 1.0.1 이전에는 통합된 `ksp(...)` 구성만 사용할 수 있었습니다. 따라서 프로세서는 모든 컴파일 대상에 적용되거나 전혀 적용되지 않았습니다. `ksp(...)` 구성은 메인 소스 세트뿐만 아니라 기존의 non-multiplatform 프로젝트에서도 테스트 소스 세트가 있는 경우 테스트 소스 세트에도 적용됩니다. 이로 인해 빌드 시간에 불필요한 오버헤드가 발생했습니다.

KSP 1.0.1부터는 위의 예에 표시된 대로 대상별 구성이 제공됩니다. 앞으로는 다음과 같습니다.
1. Multiplatform 프로젝트의 경우 `ksp(...)` 구성은 더 이상 사용되지 않으며 제거됩니다.
2. 단일 플랫폼 프로젝트의 경우 `ksp(...)` 구성은 메인, 기본 컴파일에만 적용됩니다.
   `test`와 같은 다른 대상은 프로세서를 적용하기 위해 `kspTest(...)`를 지정해야 합니다.

KSP 1.0.1부터 더 효율적인 동작으로 전환하는 얼리 액세스 플래그 `-DallowAllTargetConfiguration=false`가 있습니다.
현재 동작으로 인해 성능 문제가 발생하는 경우 사용해 보십시오.
플래그의 기본값은 KSP 2.0에서 `true`에서 `false`로 바뀝니다.