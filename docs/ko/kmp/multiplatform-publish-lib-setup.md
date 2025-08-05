[//]: # (title: 멀티플랫폼 라이브러리 퍼블리케이션 설정)

멀티플랫폼 라이브러리의 퍼블리케이션을 다음 위치에 설정할 수 있습니다:

* [로컬 Maven 저장소로 퍼블리싱](#publishing-to-a-local-maven-repository)
* Maven Central 저장소로 퍼블리싱. [튜토리얼](multiplatform-publish-libraries.md)에서 계정 자격 증명 설정, 라이브러리 메타데이터 사용자 정의, 퍼블리케이션 플러그인 구성 방법을 알아보세요.
* GitHub 저장소로 퍼블리싱. 자세한 내용은 GitHub의 [GitHub Packages](https://docs.github.com/en/packages) 문서를 참조하세요.

## 로컬 Maven 저장소로 퍼블리싱

`maven-publish` Gradle 플러그인을 사용하여 멀티플랫폼 라이브러리를 로컬 Maven 저장소에 퍼블리싱할 수 있습니다:

1. `shared/build.gradle.kts` 파일에 [`maven-publish` Gradle 플러그인](https://docs.gradle.org/current/userguide/publishing_maven.html)을 추가합니다.
2. 라이브러리의 그룹과 버전을 지정하고, 퍼블리싱할 [저장소](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)를 지정합니다:

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

`maven-publish`와 함께 사용할 경우, Kotlin 플러그인은 현재 호스트에서 빌드할 수 있는 각 타겟에 대해 자동으로 퍼블리케이션을 생성합니다. 단, Android 타겟은 [퍼블리싱을 구성하기 위한 추가 단계](#publish-an-android-library)가 필요합니다.

## 퍼블리케이션 구조

Kotlin Multiplatform 라이브러리의 퍼블리케이션에는 여러 Maven 퍼블리케이션이 포함되며, 각 퍼블리케이션은 특정 타겟에 해당합니다. 또한, 전체 라이브러리를 나타내는 통합 _루트_ 퍼블리케이션인 `kotlinMultiplatform`도 퍼블리싱됩니다.

`common source set`에 [의존성](multiplatform-add-dependencies.md)으로 추가될 때, 루트 퍼블리케이션은 적절한 플랫폼별 아티팩트로 자동 해결됩니다.

### 타겟별 및 루트 퍼블리케이션

Kotlin Multiplatform Gradle 플러그인은 각 타겟에 대해 별도의 퍼블리케이션을 구성합니다.
다음 프로젝트 구성을 고려해 보세요:

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

이 설정은 다음 Maven 퍼블리케이션을 생성합니다:

**타겟별 퍼블리케이션**

* `jvm` 타겟의 경우: `test:lib-jvm:1.0`
* `iosX64` 타겟의 경우: `test:lib-iosx64:1.0`
* `iosArm64` 타겟의 경우: `test:lib-iosarm64:1.0`

각 타겟별 퍼블리케이션은 독립적입니다. 예를 들어, `publishJvmPublicationTo<MavenRepositoryName>`을 실행하면 JVM 모듈만 퍼블리싱되고 다른 모듈은 퍼블리싱되지 않습니다.

**루트 퍼블리케이션**

`kotlinMultiplatform` 루트 퍼블리케이션: `test:lib:1.0`.

루트 퍼블리케이션은 모든 타겟별 퍼블리케이션을 참조하는 진입점 역할을 합니다.
여기에는 메타데이터 아티팩트가 포함되며, 다른 퍼블리케이션(개별 플랫폼 아티팩트에 대한 예상 URL 및 코디네이트)에 대한 참조를 포함하여 적절한 의존성 해결을 보장합니다.

* Maven Central과 같은 일부 저장소는 루트 모듈에 분류자(classifier)가 없는 JAR 아티팩트(예: `kotlinMultiplatform-1.0.jar`)가 포함되어야 합니다. Kotlin Multiplatform 플러그인은 임베디드 메타데이터 아티팩트와 함께 필요한 아티팩트를 자동으로 생성합니다. 이는 저장소 요구 사항을 충족하기 위해 라이브러리의 루트 모듈에 빈 아티팩트를 추가할 필요가 없다는 의미입니다.

  > [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 및 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 빌드 시스템을 통한 JAR 아티팩트 생성에 대해 자세히 알아보세요.
  >
  {style="tip"}

* `kotlinMultiplatform` 퍼블리케이션은 저장소에서 요구하는 경우 소스 및 문서 아티팩트도 필요할 수 있습니다. 이 경우 퍼블리케이션 스코프 내에서 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)를 사용하세요.

### 완전한 라이브러리 퍼블리싱

모든 필요한 아티팩트를 한 단계로 퍼블리싱하려면 `publishAllPublicationsTo<MavenRepositoryName>` 통합 태스크를 사용하세요.
예시:

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

Maven Local에 퍼블리싱할 때는 특별한 태스크를 사용할 수 있습니다:

```bash
./gradlew publishToMavenLocal
```

이 태스크들은 모든 타겟별 및 루트 퍼블리케이션이 함께 퍼블리싱되어 라이브러리가 의존성 해결에 완전히 사용 가능하도록 보장합니다.

또는 별도의 퍼블리케이션 태스크를 사용할 수도 있습니다. 루트 퍼블리케이션을 먼저 실행합니다:

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
````

이 태스크는 타겟별 퍼블리케이션에 대한 정보가 담긴 `*.module` 파일을 퍼블리싱하지만, 타겟 자체는 퍼블리싱되지 않습니다. 프로세스를 완료하려면 각 타겟별 퍼블리케이션을 별도로 퍼블리싱합니다:

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

이렇게 하면 모든 아티팩트가 사용 가능하고 올바르게 참조됩니다.

## 호스트 요구 사항

Kotlin/Native는 교차 컴파일을 지원하므로 모든 호스트에서 필요한 `.klib` 아티팩트를 생성할 수 있습니다.
하지만 몇 가지 주의해야 할 점이 있습니다.

### Apple 타겟용 컴파일
<secondary-label ref="Experimental"/>

Apple 타겟이 포함된 프로젝트의 아티팩트를 생성하려면 일반적으로 Apple 머신이 필요합니다.
그러나 다른 호스트를 사용하려면 `gradle.properties` 파일에서 다음 옵션을 설정하세요:

```none
kotlin.native.enableKlibsCrossCompilation=true
```

교차 컴파일은 현재 실험적 기능이며 몇 가지 제한 사항이 있습니다. 다음 경우에는 여전히 Mac 머신을 사용해야 합니다:

* 라이브러리에 [cinterop 의존성](https://kotlinlang.org/docs/native-c-interop.html)이 있는 경우.
* 프로젝트에 [CocoaPods 통합](multiplatform-cocoapods-overview.md)이 설정된 경우.
* Apple 타겟용 [최종 바이너리](multiplatform-build-native-binaries.md)를 빌드하거나 테스트해야 하는 경우.

### 퍼블리케이션 중복

퍼블리케이션 중 발생할 수 있는 문제를 방지하려면, 저장소에서 퍼블리케이션이 중복되지 않도록 모든 아티팩트를 단일 호스트에서 퍼블리싱하세요. 예를 들어, Maven Central은 명시적으로 중복 퍼블리케이션을 금지하며 프로세스가 실패합니다.
<!-- TBD: add the actual error -->

## Android 라이브러리 퍼블리싱

Android 라이브러리를 퍼블리싱하려면 추가 구성을 제공해야 합니다.

기본적으로 Android 라이브러리의 아티팩트는 퍼블리싱되지 않습니다. Android [빌드 베리언트](https://developer.android.com/build/build-variants) 세트에서 생성된 아티팩트를 퍼블리싱하려면 `shared/build.gradle.kts` 파일의 Android 타겟 블록에서 베리언트 이름을 지정하세요:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

이 예시는 [프로덕트 플레이버](https://developer.android.com/build/build-variants#product-flavors)가 없는 Android 라이브러리에 작동합니다. 프로덕트 플레이버가 있는 라이브러리의 경우, 베리언트 이름에는 `fooBarDebug` 또는 `fooBarRelease`와 같은 플레이버도 포함됩니다.

기본 퍼블리케이션 설정은 다음과 같습니다:
* 퍼블리싱된 베리언트들이 동일한 빌드 타입(예: 모두 `release` 또는 `debug`)을 갖는 경우, 어떤 소비자 빌드 타입과도 호환됩니다.
* 퍼블리싱된 베리언트들이 다른 빌드 타입을 갖는 경우, 릴리스 베리언트만 퍼블리싱된 베리언트에 포함되지 않는 소비자 빌드 타입과 호환됩니다. 다른 모든 베리언트(예: `debug`)는 소비자 프로젝트에서 [매칭 폴백](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)을 지정하지 않는 한 소비자 측의 동일한 빌드 타입하고만 일치합니다.

모든 퍼블리싱된 Android 베리언트가 라이브러리 소비자가 사용하는 동일한 빌드 타입하고만 호환되도록 하려면 다음 Gradle 프로퍼티를 설정하세요: `kotlin.android.buildTypeAttribute.keep=true`.

또한 프로덕트 플레이버별로 베리언트를 그룹화하여 퍼블리싱할 수도 있습니다. 이렇게 하면 다른 빌드 타입의 결과물이 단일 모듈에 배치되고, 빌드 타입이 아티팩트의 분류자(릴리스 빌드 타입은 여전히 분류자 없이 퍼블리싱됨)가 됩니다. 이 모드는 기본적으로 비활성화되어 있으며 `shared/build.gradle.kts` 파일에서 다음과 같이 활성화할 수 있습니다:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 서로 다른 의존성을 가진 경우, 프로덕트 플레이버별로 그룹화된 베리언트를 퍼블리싱하는 것은 권장되지 않습니다. 의존성 목록이 하나로 병합될 수 있기 때문입니다.
>
{style="note"}

## 소스 퍼블리케이션 비활성화

기본적으로 Kotlin Multiplatform Gradle 플러그인은 지정된 모든 타겟의 소스를 퍼블리싱합니다. 그러나 `shared/build.gradle.kts` 파일에서 `withSourcesJar()` API를 사용하여 소스 퍼블리케이션을 구성하고 비활성화할 수 있습니다:

* 모든 타겟의 소스 퍼블리케이션을 비활성화하려면:

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)

      jvm()
      linuxX64()
  }
  ```

* 지정된 타겟에 대해서만 소스 퍼블리케이션을 비활성화하려면:

  ```kotlin
  kotlin {
       // Disable sources publication only for JVM:
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 지정된 타겟을 제외한 모든 타겟의 소스 퍼블리케이션을 비활성화하려면:

  ```kotlin
  kotlin {
      // Disable sources publication for all targets except for JVM:
      withSourcesJar(publish = false)

      jvm {
          withSourcesJar(publish = true)
      }
      linuxX64()
  }
  ```

## JVM 환경 속성 퍼블리케이션 비활성화

Kotlin 2.0.0부터 Gradle 속성 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)은 Kotlin Multiplatform 라이브러리의 JVM 및 Android 베리언트를 구별하는 데 도움이 되도록 모든 Kotlin 베리언트와 함께 자동으로 퍼블리싱됩니다. 이 속성은 어떤 라이브러리 베리언트가 어떤 JVM 환경에 적합한지 나타내며, Gradle은 이 정보를 사용하여 프로젝트의 의존성 해결을 돕습니다. 대상 환경은 "android", "standard-jvm" 또는 "no-jvm"일 수 있습니다.

`gradle.properties` 파일에 다음 Gradle 프로퍼티를 추가하여 이 속성의 퍼블리케이션을 비활성화할 수 있습니다:

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 라이브러리 홍보

라이브러리는 [JetBrains 검색 플랫폼](https://klibs.io/)에 소개될 수 있습니다.
이 플랫폼은 타겟 플랫폼을 기반으로 Kotlin Multiplatform 라이브러리를 쉽게 찾을 수 있도록 설계되었습니다.

기준을 충족하는 라이브러리는 자동으로 추가됩니다. 라이브러리를 추가하는 방법에 대한 자세한 내용은 [FAQ](https://klibs.io/faq)를 참조하세요.

## 다음 단계

* [Kotlin Multiplatform 라이브러리를 Maven Central 저장소에 퍼블리싱하는 방법 알아보기](multiplatform-publish-libraries.md)
* [Kotlin Multiplatform용 라이브러리 설계에 대한 모범 사례 및 팁은 라이브러리 저자 가이드라인을 참조하세요](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)