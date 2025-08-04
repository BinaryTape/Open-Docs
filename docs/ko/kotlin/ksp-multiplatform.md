[//]: # (title: Kotlin Multiplatform와 KSP)

빠른 시작을 위해, KSP 프로세서를 정의하는 [샘플 Kotlin Multiplatform 프로젝트](https://github.com/google/ksp/tree/main/examples/multiplatform)를 참조하세요.

KSP 1.0.1부터는 멀티플랫폼 프로젝트에 KSP를 적용하는 것이 단일 플랫폼, JVM 프로젝트에 적용하는 것과 유사합니다. 주요 차이점은 의존성(dependencies)에 `ksp(...)` 설정을 작성하는 대신, 컴파일 전에 어떤 컴파일 타겟이 심볼 처리(symbol processing)를 필요로 하는지 지정하기 위해 `add(ksp<Target>)` 또는 `add(ksp<SourceSet>)`를 사용한다는 것입니다.

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

멀티플랫폼 프로젝트에서는 각 플랫폼에 대해 Kotlin 컴파일이 여러 번(`main`, `test` 또는 기타 빌드 플레이버) 발생할 수 있습니다. 심볼 처리 또한 마찬가지입니다. Kotlin 컴파일 태스크가 있고 이에 해당하는 `ksp<Target>` 또는 `ksp<SourceSet>` 설정이 지정될 때마다 심볼 처리 태스크가 생성됩니다.

예를 들어, 위 `build.gradle.kts`에서는 common/metadata, JVM main, Linux x64 main, Linux x64 test의 4가지 컴파일 태스크와 common/metadata, JVM main, Linux x64 test의 3가지 심볼 처리 태스크가 있습니다.

## KSP 1.0.1 이상에서 `ksp(...)` 설정 피하기

KSP 1.0.1 이전에는 하나의 통합된 `ksp(...)` 설정만 사용할 수 있었습니다. 따라서 프로세서는 모든 컴파일 타겟에 적용되거나 전혀 적용되지 않았습니다. `ksp(...)` 설정은 메인 소스 세트뿐만 아니라, 기존의 단일 플랫폼 프로젝트에서도 테스트 소스 세트가 존재할 경우에도 적용됩니다. 이는 빌드 시간에 불필요한 오버헤드를 발생시켰습니다.

KSP 1.0.1부터는 위 예시에서 보여준 것처럼 타겟별 설정이 제공됩니다. 향후에는:
1.  멀티플랫폼 프로젝트의 경우, `ksp(...)` 설정은 사용 중단(deprecated)되고 제거될 예정입니다.
2.  단일 플랫폼 프로젝트의 경우, `ksp(...)` 설정은 기본 메인 컴파일에만 적용됩니다. `test`와 같은 다른 타겟은 프로세서를 적용하려면 `kspTest(...)`를 지정해야 합니다.

KSP 1.0.1부터는 더 효율적인 동작으로 전환하기 위한 얼리 액세스 플래그(early access flag) `-DallowAllTargetConfiguration=false`가 제공됩니다. 현재 동작이 성능 문제를 일으키는 경우, 시도해 보세요. 해당 플래그의 기본값은 KSP 2.0에서 `true`에서 `false`로 변경될 예정입니다.