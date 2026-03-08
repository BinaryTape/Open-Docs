[//]: # (title: 멀티플랫폼 라이브러리 배포 설정하기)

멀티플랫폼 라이브러리를 다양한 위치에 배포하도록 설정할 수 있습니다:

* [로컬 메이븐(Maven) 저장소로 배포](#publishing-to-a-local-maven-repository)
* 메이븐 중앙(Maven Central) 저장소로 배포. 계정 자격 증명 설정, 라이브러리 메타데이터 사용자 정의 및 배포 플러그인 구성 방법은 [자습서](multiplatform-publish-libraries.md)에서 확인할 수 있습니다.
* GitHub 저장소로 배포. 자세한 내용은 [GitHub 패키지(GitHub packages)](https://docs.github.com/en/packages)에 대한 GitHub 문서를 참조하세요.

## 로컬 메이븐 저장소로 배포

`maven-publish` Gradle 플러그인을 사용하여 멀티플랫폼 라이브러리를 로컬 메이븐 저장소에 배포할 수 있습니다:

1. `shared/build.gradle.kts` 파일에 [`maven-publish` Gradle 플러그인](https://docs.gradle.org/current/userguide/publishing_maven.html)을 추가합니다.
2. 라이브러리의 `group`과 `version`을 지정하고, 배포될 [저장소(repositories)](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)를 설정합니다:

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

`maven-publish`와 함께 사용하면, Kotlin 플러그인은 현재 호스트에서 빌드 가능한 각 타겟에 대해 배포(publication)를 자동으로 생성합니다. 단, 안드로이드(Android) 타겟은 [배포 구성을 위한 추가 단계](#publish-an-android-library)가 필요합니다.

## 배포 구조

Kotlin 멀티플랫폼 라이브러리의 배포는 여러 개의 메이븐 배포로 구성되며, 각 배포는 특정 타겟에 대응합니다. 또한, 전체 라이브러리를 나타내는 통합 *루트(root)* 배포인 `kotlinMultiplatform`이 함께 발행됩니다.

공통 소스 세트(common source set)에 [의존성](multiplatform-add-dependencies.md)으로 추가될 때, 루트 배포는 적절한 플랫폼별 아티팩트로 자동 확인(resolve)됩니다.

### 타겟별 배포 및 루트 배포

Kotlin 멀티플랫폼 Gradle 플러그인은 각 타겟에 대해 별도의 배포를 구성합니다. 다음 프로젝트 구성을 예 들어보겠습니다:

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

이 설정은 다음과 같은 메이븐 배포를 생성합니다:

**타겟별 배포**

* `jvm` 타겟: `test:lib-jvm:1.0`
* `iosX64` 타겟: `test:lib-iosx64:1.0`
* `iosArm64` 타겟: `test:lib-iosarm64:1.0`

각 타겟별 배포는 독립적입니다. 예를 들어, `publishJvmPublicationTo<MavenRepositoryName>`을 실행하면 JVM 모듈만 배포되고 다른 모듈은 배포되지 않은 상태로 남습니다.

**루트 배포**

`kotlinMultiplatform` 루트 배포: `test:lib:1.0`.

루트 배포는 모든 타겟별 배포를 참조하는 엔트리 포인트 역할을 합니다. 여기에는 메타데이터 아티팩트가 포함되며, 개별 플랫폼 아티팩트에 대한 예상 URL 및 좌표와 같은 다른 배포에 대한 참조를 포함하여 적절한 의존성 확인을 보장합니다.

* 메이븐 중앙(Maven Central)과 같은 일부 저장소는 루트 모듈에 분류자(classifier)가 없는 JAR 아티팩트(예: `kotlinMultiplatform-1.0.jar`)가 포함되어야 합니다. Kotlin 멀티플랫폼 플러그인은 내장된 메타데이터 아티팩트와 함께 필요한 아티팩트를 자동으로 생성합니다. 즉, 저장소의 요구 사항을 충족하기 위해 라이브러리의 루트 모듈에 빈 아티팩트를 수동으로 추가할 필요가 없습니다.

  > [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 및 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 빌드 시스템의 JAR 아티팩트 생성에 대해 자세히 알아보세요.
  >
  {style="tip"}

* 저장소에서 요구하는 경우 `kotlinMultiplatform` 배포에 소스 및 문서 아티팩트가 필요할 수도 있습니다. 이 경우 배포 범위 내에서 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)를 사용하세요.

### 전체 라이브러리 배포

필요한 모든 아티팩트를 한 번에 배포하려면 `publishAllPublicationsTo<MavenRepositoryName>` 통합(umbrella) 태스크를 사용하세요. 예시:

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

Maven Local로 배포할 때는 다음과 같은 특수 태스크를 사용할 수 있습니다:

```bash
./gradlew publishToMavenLocal
```

이러한 태스크는 모든 타겟별 배포와 루트 배포가 함께 배포되도록 보장하여, 의존성 확인 시 라이브러리를 완전히 사용할 수 있게 합니다.

또는 별도의 배포 태스크를 사용할 수도 있습니다. 먼저 루트 배포를 실행합니다:

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
```

이 태스크는 타겟별 배포에 대한 정보가 담긴 `*.module` 파일을 배포하지만, 타겟 자체는 배포되지 않은 상태로 유지됩니다. 프로세스를 완료하려면 각 타겟별 배포를 별도로 실행하세요:

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

이렇게 하면 모든 아티팩트가 사용 가능하고 올바르게 참조되는 것을 보장할 수 있습니다.

## 호스트 요구 사항

Kotlin/Native는 교차 컴파일(cross-compilation)을 지원하므로 어떤 호스트에서든 필요한 `.klib` 아티팩트를 생성할 수 있습니다. 하지만 주의해야 할 몇 가지 제한 사항이 있습니다.

### Apple 타겟을 위한 컴파일

모든 호스트를 사용하여 Apple 타겟이 포함된 프로젝트의 아티팩트를 생성할 수 있습니다. 하지만 다음과 같은 경우에는 여전히 Mac 시스템을 사용해야 합니다:

* 라이브러리 또는 의존 모듈에 [cinterop 의존성](https://kotlinlang.org/docs/native-c-interop.html)이 있는 경우.
* 프로젝트에 [CocoaPods 통합](multiplatform-cocoapods-overview.md)이 설정된 경우.
* Apple 타겟을 위한 [최종 바이너리(final binaries)](multiplatform-build-native-binaries.md)를 빌드하거나 테스트해야 하는 경우.

### 배포 중복 방지

저장소에서 배포가 중복되는 것을 방지하려면, 단일 호스트에서 모든 아티팩트를 배포하세요. 예를 들어, 메이븐 중앙(Maven Central)은 중복 배포를 명시적으로 금지하며 중복이 발생하면 프로세스가 실패합니다.

## 안드로이드 라이브러리 배포

안드로이드 라이브러리를 배포하려면 추가 구성이 필요합니다. 기본적으로 안드로이드 라이브러리의 아티팩트는 배포되지 않습니다.

> 이 섹션에서는 Android Gradle Library Plugin을 사용하고 있다고 가정합니다.
> 플러그인 설정 가이드 또는 레거시 `com.android.library` 플러그인에서의 마이그레이션 방법은 안드로이드 문서의 [Android Gradle Library Plugin 설정](https://developer.android.com/kotlin/multiplatform/plugin#migrate) 페이지를 참조하세요.
> 
{style="note"}

아티팩트를 배포하려면 `shared/build.gradle.kts` 파일에 `androidLibrary {}` 블록을 추가하고 KMP DSL을 사용하여 배포를 구성합니다. 예시:

```kotlin
kotlin {
    androidLibrary {
        namespace = "org.example.library"
        compileSdk = libs.versions.android.compileSdk.get().toInt()
        minSdk = libs.versions.android.minSdk.get().toInt()

        // Java 컴파일 지원을 활성화합니다.
        // Java 컴파일이 필요하지 않을 때 빌드 시간을 개선하려면 이 설정을 사용하세요.
        withJava()

        compilations.configureEach {
            compilerOptions.configure {
                jvmTarget.set(
                    JvmTarget.JVM_11
                )
            }
        }
    }
}
```

Android Gradle Library 플러그인은 프로덕트 플레이버(product flavors)와 빌드 변량(build variants)을 지원하지 않으므로 구성이 간소화됩니다. 결과적으로 테스트 소스 세트 및 구성을 생성하려면 명시적으로 선택(opt-in)해야 합니다. 예시:

```kotlin
kotlin {
    androidLibrary {
        // ...

        // 호스트 측(유닛) 테스트 활성화 및 구성 선택
        withHostTestBuilder {}.configure {}

        // 소스 세트 이름을 지정하여 기기 테스트 활성화 선택
        withDeviceTestBuilder {
            sourceSetTreeName = "test"
        }

        // ...
    }
}
```

이전에는 GitHub Action 등을 통해 테스트를 실행할 때 debug와 release 변량을 별도로 지정해야 했습니다:

```yaml
- target: testDebugUnitTest
  os: ubuntu-latest
- target: testReleaseUnitTest
  os: ubuntu-latest
```

Android Gradle Library 플러그인을 사용하면 소스 세트 이름과 함께 일반적인 타겟만 지정하면 됩니다:

```yaml
- target: testAndroidHostTest
  os: ubuntu-latest
```

## 소스 배포 비활성화

기본적으로 Kotlin 멀티플랫폼 Gradle 플러그인은 지정된 모든 타겟에 대해 소스 코드를 배포합니다. 하지만 `shared/build.gradle.kts` 파일의 `withSourcesJar()` API를 사용하여 소스 배포를 구성하거나 비활성화할 수 있습니다:

* 모든 타겟에 대해 소스 배포를 비활성화하려면:

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)

      jvm()
      linuxX64()
  }
  ```

* 지정된 타겟에 대해서만 소스 배포를 비활성화하려면:

  ```kotlin
  kotlin {
       // JVM에 대해서만 소스 배포 비활성화:
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 지정된 타겟을 제외한 모든 타겟의 소스 배포를 비활성화하려면:

  ```kotlin
  kotlin {
      // JVM을 제외한 모든 타겟의 소스 배포 비활성화:
      withSourcesJar(publish = false)

      jvm {
          withSourcesJar(publish = true)
      }
      linuxX64()
  }
  ```

## 라이브러리 홍보하기

여러분의 라이브러리를 [JetBrains의 멀티플랫폼 라이브러리 카탈로그](https://klibs.io/)에 등록할 수 있습니다. 이 사이트는 타겟 플랫폼에 따라 Kotlin 멀티플랫폼 라이브러리를 쉽게 찾을 수 있도록 설계되었습니다.

기준을 충족하는 라이브러리는 자동으로 추가됩니다. 라이브러리가 카탈로그에 표시되도록 하는 자세한 방법은 [FAQ](https://klibs.io/faq)를 참조하세요.

## 다음 단계

* [Kotlin 멀티플랫폼 라이브러리를 메이븐 중앙 저장소에 배포하는 방법 알아보기](multiplatform-publish-libraries.md)
* [Kotlin 멀티플랫폼 라이브러리 설계를 위한 모범 사례 및 팁은 라이브러리 작성자 가이드라인을 참조하세요](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)