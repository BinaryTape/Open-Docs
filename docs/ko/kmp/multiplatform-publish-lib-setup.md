[//]: # (title: 멀티플랫폼 라이브러리 게시 설정)

멀티플랫폼 라이브러리를 다양한 위치에 게시하도록 설정할 수 있습니다:

*   [로컬 Maven 저장소로](#publishing-to-a-local-maven-repository)
*   Maven Central 저장소로. 계정 자격 증명 설정, 라이브러리 메타데이터 사용자 지정 및 게시 플러그인 구성 방법에 대한 자세한 내용은 [튜토리얼](multiplatform-publish-libraries.md)을 참조하세요.
*   GitHub 저장소로. 자세한 내용은 GitHub의 [GitHub Packages](https://docs.github.com/en/packages) 문서를 참조하세요.

## 로컬 Maven 저장소로 게시

`maven-publish` Gradle 플러그인을 사용하여 멀티플랫폼 라이브러리를 로컬 Maven 저장소에 게시할 수 있습니다:

1.  `shared/build.gradle.kts` 파일에 [`maven-publish` Gradle 플러그인](https://docs.gradle.org/current/userguide/publishing_maven.html)을 추가합니다.
2.  라이브러리의 그룹과 버전을 지정하고, [게시해야 할 저장소](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)도 지정합니다:

    ```kotlin
    plugins {
        // ...
        id("maven-publish")
    }

    group = "com.example"
    version = "1.0"

    publishing {
        repositories {
            maven {
                //...
            }
        }
    }
    ```

`maven-publish`와 함께 사용될 때, Kotlin 플러그인은 현재 호스트에서 빌드할 수 있는 각 타겟에 대해 자동으로 게시물을 생성합니다. 단, Android 타겟은 [게시를 구성하기 위한 추가 단계](#publish-an-android-library)가 필요합니다.

## 게시물의 구조

Kotlin Multiplatform 라이브러리의 게시물은 여러 Maven 게시물을 포함하며, 각 게시물은 특정 타겟에 해당합니다.
또한, 전체 라이브러리를 나타내는 통합 _루트_ 게시물인 `kotlinMultiplatform`도 게시됩니다.

공통 소스 세트에 [의존성](multiplatform-add-dependencies.md)으로 추가될 때, 루트 게시물은 자동으로 적절한 플랫폼별 아티팩트로 해결됩니다.

### 타겟별 게시물 및 루트 게시물

Kotlin Multiplatform Gradle 플러그인은 각 타겟에 대해 별도의 게시물을 구성합니다.
다음 프로젝트 구성을 고려해보세요:

```kotlin
// projectName = "lib"
group = "test"
version = "1.0"

kotlin {
    jvm()
    iosX64()
    iosArm64()
}
```

이 설정은 다음 Maven 게시물을 생성합니다:

**타겟별 게시물**

*   `jvm` 타겟의 경우: `test:lib-jvm:1.0`
*   `iosX64` 타겟의 경우: `test:lib-iosx64:1.0`
*   `iosArm64` 타겟의 경우: `test:lib-iosarm64:1.0`

각 타겟별 게시물은 독립적입니다. 예를 들어, `publishJvmPublicationTo<MavenRepositoryName>`을 실행하면 JVM 모듈만 게시되고 다른 모듈은 게시되지 않습니다.

**루트 게시물**

`kotlinMultiplatform` 루트 게시물: `test:lib:1.0`.

루트 게시물은 모든 타겟별 게시물을 참조하는 진입점 역할을 합니다.
이것은 메타데이터 아티팩트를 포함하며, 다른 게시물에 대한 참조(개별 플랫폼 아티팩트의 예상 URL 및 좌표)를 포함함으로써 적절한 의존성 해결을 보장합니다.

*   Maven Central과 같은 일부 저장소는 루트 모듈이 분류자(classifier)가 없는 JAR 아티팩트(예: `kotlinMultiplatform-1.0.jar`)를 포함하도록 요구합니다. Kotlin Multiplatform 플러그인은 포함된 메타데이터 아티팩트와 함께 필요한 아티팩트를 자동으로 생성합니다. 이는 저장소 요구 사항을 충족하기 위해 라이브러리의 루트 모듈에 빈 아티팩트를 추가할 필요가 없음을 의미합니다.

    > [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 및 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 빌드 시스템으로 JAR 아티팩트 생성에 대해 자세히 알아보세요.
    >
    {style="tip"}

*   `kotlinMultiplatform` 게시물은 저장소에서 요구하는 경우 소스 및 문서 아티팩트도 필요할 수 있습니다. 이 경우 게시 범위 내에서 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)를 사용하세요.

### 전체 라이브러리 게시

한 번에 필요한 모든 아티팩트를 게시하려면 `publishAllPublicationsTo<MavenRepositoryName>` 통합 작업을 사용하세요.
예시:

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

Maven Local에 게시할 때는 특별한 작업을 사용할 수 있습니다:

```bash
./gradlew publishToMavenLocal
```

이 작업들은 모든 타겟별 및 루트 게시물이 함께 게시되도록 하여, 의존성 해결을 위해 라이브러리를 완전히 사용할 수 있도록 보장합니다.

또는, 개별 게시 작업을 사용할 수도 있습니다. 먼저 루트 게시물을 실행하세요:

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
```

이 작업은 타겟별 게시물에 대한 정보가 포함된 `*.module` 파일을 게시하지만, 타겟 자체는 게시되지 않은 상태로 남습니다. 프로세스를 완료하려면 각 타겟별 게시물을 별도로 게시해야 합니다:

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

이는 모든 아티팩트가 사용 가능하고 올바르게 참조되도록 보장합니다.

## 호스트 요구 사항

Kotlin/Native는 크로스 컴파일을 지원하므로 모든 호스트가 필요한 `.klib` 아티팩트를 생성할 수 있습니다.
그러나 몇 가지 주의해야 할 특정 사항이 있습니다.

**Apple 타겟용 컴파일**

Apple 타겟이 있는 프로젝트의 아티팩트를 생성하기 위해 어떤 호스트든 사용할 수 있습니다.
그러나 다음 경우에는 여전히 Mac 머신을 사용해야 합니다:

*   라이브러리 또는 종속 모듈에 [cinterop 의존성](https://kotlinlang.org/docs/native-c-interop.html)이 있는 경우.
*   프로젝트에 [CocoaPods 통합](multiplatform-cocoapods-overview.md)이 설정된 경우.
*   Apple 타겟용 [최종 바이너리](multiplatform-build-native-binaries.md)를 빌드하거나 테스트해야 하는 경우.

**게시물 중복 방지**

게시 중 발생할 수 있는 문제를 방지하려면, 저장소에 게시물이 중복되지 않도록 모든 아티팩트를 단일 호스트에서 게시하세요. 예를 들어, Maven Central은 중복 게시물을 명시적으로 금지하며 프로세스를 실패시킵니다.

## Android 라이브러리 게시

Android 라이브러리를 게시하려면 추가 구성을 제공해야 합니다.

기본적으로 Android 라이브러리의 아티팩트는 게시되지 않습니다. Android [빌드 베리언트](https://developer.android.com/build/build-variants) 세트에 의해 생성된 아티팩트를 게시하려면, `shared/build.gradle.kts` 파일의 Android 타겟 블록에 베리언트 이름을 지정합니다:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

이 예시는 [제품 플레이버](https://developer.android.com/build/build-variants#product-flavors)가 없는 Android 라이브러리에 적용됩니다.
제품 플레이버가 있는 라이브러리의 경우, 베리언트 이름에는 `fooBarDebug` 또는 `fooBarRelease`와 같이 플레이버도 포함됩니다.

기본 게시 설정은 다음과 같습니다:
*   게시된 베리언트가 동일한 빌드 타입(예: 모두 `release` 또는 `debug`)을 갖는 경우, 모든 소비자 빌드 타입과 호환됩니다.
*   게시된 베리언트가 다른 빌드 타입을 갖는 경우, 릴리스 베리언트만 게시된 베리언트에 포함되지 않는 소비자 빌드 타입과 호환됩니다. 다른 모든 베리언트(예: `debug`)는 소비자 측에서 동일한 빌드 타입만 일치시키며, 소비 프로젝트가 [매칭 폴백](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)을 지정하지 않는 한 그렇습니다.

게시된 모든 Android 베리언트가 라이브러리 소비자가 사용하는 동일한 빌드 타입하고만 호환되도록 하려면, 다음 Gradle 프로퍼티를 설정하세요: `kotlin.android.buildTypeAttribute.keep=true`.

또한 제품 플레이버별로 그룹화된 베리언트를 게시하여, 다른 빌드 타입의 결과물이 단일 모듈에 배치되고 빌드 타입이 아티팩트의 분류자(classifier)가 되도록 할 수 있습니다(릴리스 빌드 타입은 여전히 분류자 없이 게시됩니다). 이 모드는 기본적으로 비활성화되어 있으며, `shared/build.gradle.kts` 파일에서 다음과 같이 활성화할 수 있습니다:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 다른 의존성을 가질 경우 제품 플레이버별로 그룹화된 베리언트를 게시하는 것은 권장되지 않습니다. 의존성 목록이 하나로 병합될 수 있기 때문입니다.
>
{style="note"}

## 소스 게시 비활성화

기본적으로 Kotlin Multiplatform Gradle 플러그인은 지정된 모든 타겟에 대해 소스를 게시합니다. 그러나 `shared/build.gradle.kts` 파일에서 `withSourcesJar()` API를 사용하여 소스 게시를 구성하고 비활성화할 수 있습니다:

*   모든 타겟에 대한 소스 게시를 비활성화하려면:

    ```kotlin
    kotlin {
        withSourcesJar(publish = false)

        jvm()
        linuxX64()
    }
    ```

*   지정된 타겟에 대해서만 소스 게시를 비활성화하려면:

    ```kotlin
    kotlin {
         // JVM에 대해서만 소스 게시 비활성화:
        jvm {
            withSourcesJar(publish = false)
        }
        linuxX64()
    }
    ```

*   지정된 타겟을 제외한 모든 타겟에 대한 소스 게시를 비활성화하려면:

    ```kotlin
    kotlin {
        // JVM을 제외한 모든 타겟에 대한 소스 게시 비활성화:
        withSourcesJar(publish = false)

        jvm {
            withSourcesJar(publish = true)
        }
        linuxX64()
    }
    ```

## JVM 환경 속성 게시 비활성화

Kotlin 2.0.0부터 Gradle 속성 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)은 Kotlin Multiplatform 라이브러리의 JVM 및 Android 베리언트를 구별하는 데 도움이 되도록 모든 Kotlin 베리언트와 함께 자동으로 게시됩니다. 이 속성은 어떤 라이브러리 베리언트가 어떤 JVM 환경에 적합한지 나타내며, Gradle은 이 정보를 사용하여 프로젝트의 의존성 해결을 돕습니다. 대상 환경은 "android", "standard-jvm" 또는 "no-jvm"일 수 있습니다.

`gradle.properties` 파일에 다음 Gradle 프로퍼티를 추가하여 이 속성의 게시를 비활성화할 수 있습니다:

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 라이브러리 홍보

귀하의 라이브러리는 [JetBrains 검색 플랫폼](https://klibs.io/)에 소개될 수 있습니다.
이 플랫폼은 타겟 플랫폼을 기반으로 Kotlin Multiplatform 라이브러리를 쉽게 찾을 수 있도록 설계되었습니다.

기준을 충족하는 라이브러리는 자동으로 추가됩니다. 라이브러리 추가 방법에 대한 자세한 내용은 [FAQ](https://klibs.io/faq)를 참조하세요.

## 다음 단계

*   [Kotlin Multiplatform 라이브러리를 Maven Central 저장소에 게시하는 방법 알아보기](multiplatform-publish-libraries.md)
*   [Kotlin Multiplatform용 라이브러리 설계에 대한 모범 사례 및 팁은 라이브러리 저자 가이드라인 참조](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)