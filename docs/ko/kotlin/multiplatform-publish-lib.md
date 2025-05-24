---
title: "멀티플랫폼 라이브러리 발행 설정"
---
다양한 위치에 멀티플랫폼 라이브러리를 게시하도록 설정할 수 있습니다.

* [로컬 Maven 저장소에 게시](#publishing-to-a-local-maven-repository)
* Maven Central 저장소에 게시합니다. 계정 자격 증명을 설정하고 라이브러리 메타데이터를 사용자 지정하며 게시 플러그인을 구성하는 방법은 [튜토리얼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)에서 확인하세요.
* GitHub 저장소에 게시합니다. 자세한 내용은 [GitHub 패키지](https://docs.github.com/en/packages)에 대한 GitHub 문서를 참조하세요.

## 로컬 Maven 저장소에 게시

`maven-publish` Gradle 플러그인을 사용하여 멀티플랫폼 라이브러리를 로컬 Maven 저장소에 게시할 수 있습니다.

1. `shared/build.gradle.kts` 파일에서 [`maven-publish` Gradle 플러그인](https://docs.gradle.org/current/userguide/publishing_maven.html)을 추가합니다.
2. 라이브러리의 그룹 및 버전을 지정하고, 게시할 [저장소](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)를 지정합니다.

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

`maven-publish`와 함께 사용하면 Kotlin 플러그인은 [Android 라이브러리 게시](#publish-an-android-library)를 구성하기 위한 추가 단계를 제외하고 현재 호스트에서 빌드할 수 있는 각 대상에 대한 게시를 자동으로 생성합니다.

## 게시 구조

멀티플랫폼 라이브러리의 게시에는 전체 라이브러리를 나타내고 공통 소스 세트에 종속성으로 추가될 때 적절한 플랫폼별 아티팩트로 자동 확인되는 추가 _루트_ 게시 `kotlinMultiplatform`이 포함됩니다. [종속성 추가](multiplatform-add-dependencies)에 대해 자세히 알아보세요.

이 `kotlinMultiplatform` 게시에는 메타데이터 아티팩트가 포함되어 있고 다른 게시를 해당 변형으로 참조합니다.

:::note
Maven Central과 같은 일부 저장소에서는 루트 모듈에 분류자가 없는 JAR 아티팩트(예: `kotlinMultiplatform-1.0.jar`)가 포함되어야 합니다.
Kotlin Multiplatform 플러그인은 임베디드 메타데이터 아티팩트를 사용하여 필요한 아티팩트를 자동으로 생성합니다.
즉, 저장소 요구 사항을 충족하기 위해 라이브러리의 루트 모듈에 빈 아티팩트를 추가하여 빌드를 사용자 지정할 필요가 없습니다.

:::

`kotlinMultiplatform` 게시는 저장소에서 필요한 경우 소스 및 문서 아티팩트도 필요할 수 있습니다. 이 경우 [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)를 사용하여 해당 아티팩트를 게시 범위에 추가합니다.

## 호스트 요구 사항

Kotlin/Native는 크로스 컴파일을 지원하므로 모든 호스트에서 필요한 `.klib` 아티팩트를 생성할 수 있습니다.
그러나 여전히 염두에 두어야 할 몇 가지 사항이 있습니다.

### Apple 대상을 위한 컴파일

Apple 대상을 사용하는 프로젝트에 대한 아티팩트를 생성하려면 일반적으로 Apple 장치가 필요합니다.
그러나 다른 호스트를 사용하려면 `gradle.properties` 파일에서 이 옵션을 설정합니다.

```none
kotlin.native.enableKlibsCrossCompilation=true
```

크로스 컴파일은 현재 실험적이며 몇 가지 제한 사항이 있습니다. 다음과 같은 경우 여전히 Mac 장치를 사용해야 합니다.

* 라이브러리에 [cinterop 종속성](native-c-interop)이 있습니다.
* 프로젝트에 [CocoaPods 통합](native-cocoapods)이 설정되어 있습니다.
* Apple 대상에 대한 [최종 바이너리](multiplatform-build-native-binaries)를 빌드하거나 테스트해야 합니다.

### 게시 복제

게시 중에 문제가 발생하지 않도록 하려면 저장소에서 게시를 복제하지 않도록 단일 호스트에서 모든 아티팩트를 게시합니다. 예를 들어 Maven Central은 중복 게시를 명시적으로 금지하고 프로세스가 실패합니다.
<!-- TBD: add the actual error -->

## Android 라이브러리 게시

Android 라이브러리를 게시하려면 추가 구성을 제공해야 합니다.

기본적으로 Android 라이브러리의 아티팩트는 게시되지 않습니다. Android [빌드 변형](https://developer.android.com/build/build-variants) 집합에서 생성된 아티팩트를 게시하려면
`shared/build.gradle.kts` 파일의 Android 대상 블록에서 변형 이름을 지정합니다.

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}

```

이 예제는 [제품 버전](https://developer.android.com/build/build-variants#product-flavors)이 없는 Android 라이브러리에 적용됩니다.
제품 버전이 있는 라이브러리의 경우 변형 이름에는 `fooBarDebug` 또는 `fooBarRelease`와 같이 버전도 포함됩니다.

기본 게시 설정은 다음과 같습니다.
* 게시된 변형의 빌드 유형이 동일한 경우(예: 모두 `release` 또는 `debug`),
  모든 소비자 빌드 유형과 호환됩니다.
* 게시된 변형의 빌드 유형이 다른 경우 릴리스 변형만 호환됩니다.
  게시된 변형에 없는 소비자 빌드 유형과 호환됩니다. 다른 모든 변형(예: `debug`)은
  소비자 프로젝트에서
  [일치하는 폴백](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)을 지정하지 않는 한 소비자 쪽에서 동일한 빌드 유형만 일치합니다.

라이브러리 소비자가 사용하는 동일한 빌드 유형과만 각 게시된 Android 변형을 호환되도록 하려면
이 Gradle 속성을 설정합니다. `kotlin.android.buildTypeAttribute.keep=true`.

제품 버전을 기준으로 그룹화된 변형을 게시하여 다른 빌드 유형의 출력을 배치할 수도 있습니다.
빌드 유형이 아티팩트의 분류자가 되는 단일 모듈에 있습니다(릴리스 빌드 유형은 여전히 게시됨).
분류자 없이). 이 모드는 기본적으로 비활성화되어 있으며 `shared/build.gradle.kts` 파일에서 다음과 같이 활성화할 수 있습니다.

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

:::note
종속성이 다른 경우 제품 버전별로 그룹화된 변형을 게시하는 것은 권장되지 않습니다.
종속성이 하나의 종속성 목록으로 병합되기 때문입니다.

:::

## 소스 게시 비활성화

기본적으로 Kotlin Multiplatform Gradle 플러그인은 지정된 모든 대상에 대한 소스를 게시합니다. 그러나
`shared/build.gradle.kts` 파일에서 `withSourcesJar()` API를 사용하여 소스 게시를 구성하고 비활성화할 수 있습니다.

* 모든 대상에 대해 소스 게시를 비활성화하려면

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)
  
      jvm()
      linuxX64()
  }
  ```

* 지정된 대상에 대해서만 소스 게시를 비활성화하려면

  ```kotlin
  kotlin {
       // Disable sources publication only for JVM:
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 지정된 대상을 제외한 모든 대상에 대해 소스 게시를 비활성화하려면

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

## JVM 환경 속성 게시 비활성화

Kotlin 2.0.0부터 Gradle 속성 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)
는 Kotlin Multiplatform의 JVM 및 Android 변형을 구별하는 데 도움이 되도록 모든 Kotlin 변형과 함께 자동으로 게시됩니다.
라이브러리 변형이 적합한 JVM 환경을 나타내며 Gradle은 이 정보를 사용하여 프로젝트에서 종속성 해결을 돕습니다. 대상 환경은 "android", "standard-jvm" 또는 "no-jvm"일 수 있습니다.

`gradle.properties` 파일에 다음 Gradle 속성을 추가하여 이 속성의 게시를 비활성화할 수 있습니다.

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 라이브러리 홍보

라이브러리는 [JetBrains의 검색 플랫폼](https://klibs.io/)에서 추천될 수 있습니다.
대상 플랫폼을 기반으로 Kotlin Multiplatform 라이브러리를 쉽게 찾을 수 있도록 설계되었습니다.

기준을 충족하는 라이브러리가 자동으로 추가됩니다. 라이브러리를 추가하는 방법에 대한 자세한 내용은 [FAQ](https://klibs.io/faq)를 참조하세요.

## 다음 단계

* [Kotlin Multiplatform 라이브러리를 Maven Central 저장소에 게시하는 방법 알아보기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
* [Kotlin Multiplatform용 라이브러리 설계에 대한 모범 사례 및 팁은 라이브러리 작성자 지침](api-guidelines-build-for-multiplatform)을 참조하세요.