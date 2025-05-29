[//]: # (title: Kotlin Multiplatform과 KSP)

빠른 시작을 위해 [KSP 프로세서를 정의하는 Kotlin 멀티플랫폼 프로젝트 예시](https://github.com/google/ksp/tree/main/examples/multiplatform)를 참조하십시오.

KSP 1.0.1부터 멀티플랫폼 프로젝트에 KSP를 적용하는 것은 단일 플랫폼 JVM 프로젝트에 적용하는 것과 유사합니다. 주된 차이점은 의존성에 `ksp(...)` 구성을 작성하는 대신, 컴파일 전에 어떤 컴파일 타겟이 심볼 처리를 필요로 하는지 지정하기 위해 `add(ksp<Target>)` 또는 `add(ksp<SourceSet>)`가 사용된다는 것입니다.

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
    add("kspJvmTest", project(":test-processor")) // Not doing anything because there's no test source set for JVM
    // There is no processing for the Linux x64 main source set, because kspLinuxX64 isn't specified
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## 컴파일 및 처리

멀티플랫폼 프로젝트에서 Kotlin 컴파일은 각 플랫폼에 대해 여러 번(`main`, `test`, 또는 다른 빌드 플레이버) 발생할 수 있습니다. 심볼 처리도 마찬가지입니다. Kotlin 컴파일 태스크가 있고 해당 `ksp<Target>` 또는 `ksp<SourceSet>` 구성이 지정된 경우마다 심볼 처리 태스크가 생성됩니다.

예를 들어, 위 `build.gradle.kts`에서는 4개의 컴파일 태스크(common/metadata, JVM main, Linux x64 main, Linux x64 test)와 3개의 심볼 처리 태스크(common/metadata, JVM main, Linux x64 test)가 있습니다.

## KSP 1.0.1+에서 ksp(...) 구성 사용 피하기

KSP 1.0.1 이전에는 단일 통합된 `ksp(...)` 구성만 사용 가능했습니다. 따라서 프로세서는 모든 컴파일 타겟에 적용되거나 전혀 적용되지 않았습니다. 참고로 `ksp(...)` 구성은 메인 소스 세트뿐만 아니라, 존재하는 경우 테스트 소스 세트에도 적용되었으며, 이는 기존의 비멀티플랫폼 프로젝트에서도 마찬가지였습니다. 이는 빌드 시간에 불필요한 오버헤드를 초래했습니다.

KSP 1.0.1부터 위 예시에서 보여진 바와 같이 타겟별 구성이 제공됩니다. 향후에는:
1. 멀티플랫폼 프로젝트의 경우, `ksp(...)` 구성은 더 이상 사용되지 않으며(deprecated) 제거될 예정입니다.
2. 단일 플랫폼 프로젝트의 경우, `ksp(...)` 구성은 메인, 기본 컴파일에만 적용됩니다. `test`와 같은 다른 타겟은 프로세서를 적용하기 위해 `kspTest(...)`를 명시해야 합니다.

KSP 1.0.1부터 더 효율적인 동작으로 전환하기 위한 조기 액세스 플래그 `-DallowAllTargetConfiguration=false`가 있습니다. 현재 동작이 성능 문제를 유발하는 경우, 시도해 보십시오. 해당 플래그의 기본값은 KSP 2.0에서 `true`에서 `false`로 전환될 것입니다.