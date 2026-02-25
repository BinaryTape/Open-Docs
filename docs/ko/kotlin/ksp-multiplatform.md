[//]: # (title: Kotlin 멀티플랫폼에서의 KSP)

빠른 시작을 위해 KSP 프로세서를 정의하는 [샘플 Kotlin 멀티플랫폼 프로젝트](https://github.com/google/ksp/tree/main/examples/multiplatform)를 확인하세요.

KSP 1.0.1부터 멀티플랫폼 프로젝트에 KSP를 적용하는 방식은 단일 플랫폼 JVM 프로젝트와 유사합니다. 주요 차이점은 종속성(dependencies)에 `ksp(...)` 구성을 작성하는 대신, 컴파일 전에 어떤 컴파일 대상에 심볼 처리(symbol processing)가 필요한지 지정하기 위해 `add(ksp<Target>)` 또는 `add(ksp<SourceSet>)`를 사용한다는 점입니다.

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
    add("kspJvmTest", project(":test-processor")) // JVM용 테스트 소스 세트가 없으므로 아무 작업도 수행하지 않음
    // kspLinuxX64가 지정되지 않았으므로 Linux x64 메인 소스 세트에 대한 처리가 없음
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## 컴파일 및 처리

멀티플랫폼 프로젝트에서는 각 플랫폼에 대해 Kotlin 컴파일이 여러 번(`main`, `test` 또는 기타 빌드 버전) 발생할 수 있습니다. 심볼 처리도 마찬가지입니다. Kotlin 컴파일 태스크가 있고 그에 대응하는 `ksp<Target>` 또는 `ksp<SourceSet>` 구성이 지정될 때마다 심볼 처리 태스크가 생성됩니다.

예를 들어, 위의 `build.gradle.kts`에는 4개의 컴파일 태스크(common/metadata, JVM main, Linux x64 main, Linux x64 test)와 3개의 심볼 처리 태스크(common/metadata, JVM main, Linux x64 test)가 있습니다.

## KSP 1.0.1+ 버전에서 ksp(...) 구성 지양하기

KSP 1.0.1 이전에는 단일화된 `ksp(...)` 구성만 사용할 수 있었습니다. 따라서 프로세서가 모든 컴파일 대상에 적용되거나, 아예 적용되지 않았습니다. 참고로 `ksp(...)` 구성은 기존의 비 멀티플랫폼 프로젝트에서도 메인 소스 세트뿐만 아니라 테스트 소스 세트가 존재하는 경우 해당 세트에도 적용됩니다. 이는 빌드 시간에 불필요한 오버헤드를 초래했습니다.

KSP 1.0.1부터는 위의 예시와 같이 타겟별 구성이 제공됩니다. 향후에는 다음과 같이 변경될 예정입니다:
1. 멀티플랫폼 프로젝트의 경우, `ksp(...)` 구성은 사용 중단(deprecated) 및 삭제될 예정입니다.
2. 단일 플랫폼 프로젝트의 경우, `ksp(...)` 구성은 기본 메인 컴파일에만 적용됩니다. `test`와 같은 다른 타겟에 프로세서를 적용하려면 `kspTest(...)`를 지정해야 합니다.

KSP 1.0.1부터 더 효율적인 동작으로 전환할 수 있는 얼리 액세스(early access) 플래그 `-DallowAllTargetConfiguration=false`가 제공됩니다. 현재 동작으로 인해 성능 문제가 발생하는 경우 이 플래그를 사용해 보시기 바랍니다. 이 플래그의 기본값은 KSP 2.0에서 `true`에서 `false`로 변경될 예정입니다.