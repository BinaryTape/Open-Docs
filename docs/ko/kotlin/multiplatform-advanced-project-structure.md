---
title: "멀티플랫폼 프로젝트 구조의 고급 개념"
---
이 문서는 Kotlin Multiplatform 프로젝트 구조의 고급 개념과 이것들이 Gradle 구현에 어떻게 매핑되는지 설명합니다. 이 정보는 Gradle 빌드(configurations, tasks, publications 등)의 하위 레벨 추상화를 사용해야 하거나 Kotlin Multiplatform 빌드를 위한 Gradle 플러그인을 만들 때 유용할 것입니다.

이 페이지는 다음과 같은 경우에 유용할 수 있습니다.

* Kotlin이 소스 세트를 생성하지 않는 대상 집합 간에 코드를 공유해야 하는 경우.
* Kotlin Multiplatform 빌드를 위한 Gradle 플러그인을 만들거나 configurations, tasks, publications 등과 같은 Gradle 빌드의 하위 레벨 추상화를 사용해야 하는 경우.

멀티플랫폼 프로젝트의 의존성 관리에서 이해해야 할 중요한 사항 중 하나는 Gradle 스타일의 프로젝트 또는 라이브러리 의존성과 Kotlin에 특정한 소스 세트 간의 `dependsOn` 관계의 차이점입니다.

* `dependsOn`은 [소스 세트 계층](#dependson-and-source-set-hierarchies)을 활성화하고 일반적으로 멀티플랫폼 프로젝트에서 코드를 공유할 수 있도록 하는 공통 소스 세트와 플랫폼 특정 소스 세트 간의 관계입니다. 기본 소스 세트의 경우 계층은 자동으로 관리되지만 특정 상황에서는 이를 변경해야 할 수 있습니다.
* 일반적으로 라이브러리 및 프로젝트 의존성은 평소와 같이 작동하지만 멀티플랫폼 프로젝트에서 이를 적절하게 관리하려면 컴파일에 사용되는 세분화된 **소스 세트 → 소스 세트** 의존성으로 [Gradle 의존성이 어떻게 해결되는지](#dependencies-on-other-libraries-or-projects) 이해해야 합니다.

:::note
고급 개념을 살펴보기 전에 [멀티플랫폼 프로젝트 구조의 기본 사항](multiplatform-discover-project)을 배우는 것이 좋습니다.

## dependsOn 및 소스 세트 계층

일반적으로 _`dependsOn`_ 관계가 아닌 _의존성_을 사용하게 됩니다. 그러나 `dependsOn`을 검토하는 것은 Kotlin Multiplatform 프로젝트가 내부적으로 어떻게 작동하는지 이해하는 데 중요합니다.

`dependsOn`은 두 개의 Kotlin 소스 세트 간의 Kotlin 특정 관계입니다. 이는 예를 들어 `jvmMain` 소스 세트가 `commonMain`에 의존하고, `iosArm64Main`이 `iosMain`에 의존하는 등 공통 소스 세트와 플랫폼 특정 소스 세트 간의 연결일 수 있습니다.

Kotlin 소스 세트 `A`와 `B`가 있는 일반적인 예를 생각해 봅시다. `A.dependsOn(B)`라는 표현은 Kotlin에게 다음을 지시합니다.

1. `A`는 내부 선언을 포함하여 `B`의 API를 관찰합니다.
2. `A`는 `B`의 예상 선언에 대한 실제 구현을 제공할 수 있습니다. 이는 필요충분 조건입니다. `A`는 직접 또는 간접적으로 `A.dependsOn(B)`인 경우에만 `B`에 대한 `actuals`를 제공할 수 있습니다.
3. `B`는 자체 대상 외에도 `A`가 컴파일되는 모든 대상으로 컴파일되어야 합니다.
4. `A`는 `B`의 모든 일반 의존성을 상속합니다.

`dependsOn` 관계는 소스 세트 계층이라고 하는 트리와 유사한 구조를 만듭니다. 다음은 `androidTarget`, `iosArm64` (iPhone 장치) 및 `iosSimulatorArm64` (Apple Silicon Mac용 iPhone 시뮬레이터)를 사용하여 모바일 개발을 위한 일반적인 프로젝트의 예입니다.

<img src="/img/dependson-tree-diagram.svg" alt="DependsOn 트리 구조" width="700" style={{verticalAlign: 'middle'}}/>

화살표는 `dependsOn` 관계를 나타냅니다.
이러한 관계는 플랫폼 바이너리 컴파일 중에 유지됩니다. 이것이 Kotlin이 `iosMain`이 `commonMain`의 API를 볼 수 있지만 `iosArm64Main`의 API는 볼 수 없다고 이해하는 방법입니다.

<img src="/img/dependson-relations-diagram.svg" alt="컴파일 중의 DependsOn 관계" width="700" style={{verticalAlign: 'middle'}}/>

`dependsOn` 관계는 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 호출로 구성됩니다. 예를 들면 다음과 같습니다.

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        // Example of configuring the dependsOn relation 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

* 이 예제는 빌드 스크립트에서 `dependsOn` 관계를 정의하는 방법을 보여줍니다. 그러나 Kotlin Gradle 플러그인은 기본적으로 소스 세트를 만들고 이러한 관계를 설정하므로 수동으로 수행할 필요가 없습니다.
* `dependsOn` 관계는 빌드 스크립트의 `dependencies {}` 블록과 별도로 선언됩니다.
  이는 `dependsOn`이 일반적인 의존성이 아니기 때문입니다. 대신, 여러 대상에서 코드를 공유하는 데 필요한 Kotlin 소스 세트 간의 특정 관계입니다.

`dependsOn`을 사용하여 게시된 라이브러리 또는 다른 Gradle 프로젝트에 대한 일반 의존성을 선언할 수 없습니다.
예를 들어, `commonMain`이 `kotlinx-coroutines-core` 라이브러리의 `commonMain`에 의존하도록 설정하거나 `commonTest.dependsOn(commonMain)`을 호출할 수 없습니다.

### 사용자 지정 소스 세트 선언

경우에 따라 프로젝트에 사용자 지정 중간 소스 세트가 필요할 수 있습니다.
JVM, JS 및 Linux로 컴파일되는 프로젝트를 고려하고 JVM과 JS 간에만 일부 소스를 공유하려고 합니다.
이 경우 [멀티플랫폼 프로젝트 구조의 기본 사항](multiplatform-discover-project)에 설명된 대로 이 대상 쌍에 대한 특정 소스 세트를 찾아야 합니다.

Kotlin은 이러한 소스 세트를 자동으로 만들지 않습니다. 즉, `by creating` 구성으로 수동으로 만들어야 합니다.

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // Create a source set named "jvmAndJs"
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

그러나 Kotlin은 여전히 이 소스 세트를 처리하거나 컴파일하는 방법을 모릅니다. 다이어그램을 그리면 이 소스 세트가 격리되어 있고 대상 레이블이 없을 것입니다.

<img src="/img/missing-dependson-diagram.svg" alt="누락된 DependsOn 관계" width="700" style={{verticalAlign: 'middle'}}/>

이를 수정하려면 여러 `dependsOn` 관계를 추가하여 `jvmAndJsMain`을 계층에 포함합니다.

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // Don't forget to add dependsOn to commonMain
            dependsOn(commonMain.get())
        }

        jvmMain {
            dependsOn(jvmAndJsMain)
        }

        jsMain {
            dependsOn(jvmAndJsMain)
        }
    }
}
```

여기서 `jvmMain.dependsOn(jvmAndJsMain)`은 JVM 대상을 `jvmAndJsMain`에 추가하고 `jsMain.dependsOn(jvmAndJsMain)`은 JS 대상을 `jvmAndJsMain`에 추가합니다.

최종 프로젝트 구조는 다음과 같습니다.

<img src="/img/final-structure-diagram.svg" alt="최종 프로젝트 구조" width="700" style={{verticalAlign: 'middle'}}/>

`dependsOn` 관계를 수동으로 구성하면 기본 계층 템플릿의 자동 적용이 비활성화됩니다.
이러한 경우와 처리 방법에 대한 자세한 내용은 [추가 구성](multiplatform-hierarchy#additional-configuration)을 참조하십시오.

:::

## 다른 라이브러리 또는 프로젝트에 대한 의존성

멀티플랫폼 프로젝트에서는 게시된 라이브러리 또는 다른 Gradle 프로젝트에 대한 일반 의존성을 설정할 수 있습니다.

Kotlin Multiplatform은 일반적으로 일반적인 Gradle 방식으로 의존성을 선언합니다. Gradle과 마찬가지로 다음을 수행합니다.

* 빌드 스크립트에서 `dependencies {}` 블록을 사용합니다.
* 의존성에 대한 적절한 범위를 선택합니다(예: `implementation` 또는 `api`).
* 리포지토리에 게시된 경우 `"com.google.guava:guava:32.1.2-jre"`와 같이 좌표를 지정하거나, 동일한 빌드의 Gradle 프로젝트인 경우 `project(":utils:concurrency")`와 같이 해당 경로를 지정하여 의존성을 참조합니다.

멀티플랫폼 프로젝트의 의존성 구성에는 몇 가지 특별한 기능이 있습니다. 각 Kotlin 소스 세트에는 자체 `dependencies {}` 블록이 있습니다. 이를 통해 플랫폼 특정 소스 세트에서 플랫폼 특정 의존성을 선언할 수 있습니다.

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        jvmMain.dependencies {
            // This is jvmMain's dependencies, so it's OK to add a JVM-specific dependency
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

일반적인 의존성은 더 까다롭습니다. 예를 들어 `kotlinx.coroutines`와 같은 멀티플랫폼 라이브러리에 대한 의존성을 선언하는 멀티플랫폼 프로젝트를 고려하십시오.

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone devices 
    iosSimulatorArm64() // Apple Silicon Mac의 iPhone 시뮬레이터

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

의존성 해결에는 세 가지 중요한 개념이 있습니다.

1. 멀티플랫폼 의존성은 `dependsOn` 구조를 따라 전파됩니다. `commonMain`에 의존성을 추가하면 `commonMain`에서 직접 또는 간접적으로 `dependsOn` 관계를 선언하는 모든 소스 세트에 자동으로 추가됩니다.

   이 경우 의존성은 실제로 모든 `*Main` 소스 세트(`iosMain`, `jvmMain`, `iosSimulatorArm64Main` 및 `iosX64Main`)에 자동으로 추가되었습니다. 이러한 모든 소스 세트는 `commonMain` 소스 세트에서 `kotlin-coroutines-core` 의존성을 상속하므로 수동으로 모두 복사하여 붙여넣을 필요가 없습니다.

   <img src="/img/dependency-propagation-diagram.svg" alt="멀티플랫폼 의존성의 전파" width="700" style={{verticalAlign: 'middle'}}/>

   > 전파 메커니즘을 사용하면 특정 소스 세트를 선택하여 선언된 의존성을 수신할 범위를 선택할 수 있습니다.
   > 예를 들어, Android가 아닌 iOS에서 `kotlinx.coroutines`를 사용하려면 이 의존성을 `iosMain`에만 추가할 수 있습니다.
   >
   

2. 위에서 `commonMain`에서 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`와 같은 _소스 세트 → 멀티플랫폼 라이브러리_ 의존성은 의존성 해결의 중간 상태를 나타냅니다. 해결의 최종 상태는 항상 _소스 세트 → 소스 세트_ 의존성으로 표시됩니다.

   > 최종 _소스 세트 → 소스 세트_ 의존성은 `dependsOn` 관계가 아닙니다.
   >
   

   세분화된 _소스 세트 → 소스 세트_ 의존성을 추론하기 위해 Kotlin은 각 멀티플랫폼 라이브러리와 함께 게시되는 소스 세트 구조를 읽습니다. 이 단계 후에는 각 라이브러리가 전체가 아닌 해당 소스 세트 모음으로 내부적으로 표시됩니다. `kotlinx-coroutines-core`에 대한 이 예제를 참조하십시오.

   <img src="/img/structure-serialization-diagram.svg" alt="소스 세트 구조의 직렬화" width="700" style={{verticalAlign: 'middle'}}/>

3. Kotlin은 각 의존성 관계를 가져와 의존성의 소스 세트 모음으로 해결합니다. 해당 컬렉션의 각 의존성 소스 세트에는 _호환 가능한 대상_이 있어야 합니다. 의존성 소스 세트는 소비자 소스 세트와 _최소한 동일한 대상_으로 컴파일되는 경우 호환 가능한 대상을 갖습니다.

   샘플 프로젝트의 `commonMain`이 `androidTarget`, `iosX64` 및 `iosSimulatorArm64`로 컴파일되는 예를 고려하십시오.

    * 먼저 `kotlinx-coroutines-core.commonMain`에 대한 의존성을 해결합니다. 이는 `kotlinx-coroutines-core`가 가능한 모든 Kotlin 대상으로 컴파일되기 때문에 발생합니다. 따라서 해당 `commonMain`은 필요한 `androidTarget`, `iosX64` 및 `iosSimulatorArm64`를 포함하여 가능한 모든 대상으로 컴파일됩니다.
    * 둘째, `commonMain`은 `kotlinx-coroutines-core.concurrentMain`에 의존합니다.
      `kotlinx-coroutines-core`의 `concurrentMain`은 JS를 제외한 모든 대상으로 컴파일되므로 소비자 프로젝트의 `commonMain` 대상과 일치합니다.

   그러나 코루틴의 `iosX64Main`과 같은 소스 세트는 소비자 `commonMain`과 호환되지 않습니다.
   `iosX64Main`이 `commonMain` 대상 중 하나인 `iosX64`로 컴파일되더라도 `androidTarget` 또는 `iosSimulatorArm64`로 컴파일되지 않습니다.

   의존성 해결 결과는 `kotlinx-coroutines-core`에서 보이는 코드에 직접적인 영향을 미칩니다.

   <img src="/img/dependency-resolution-error.png" alt="공통 코드의 JVM 특정 API 오류" width="700" style={{verticalAlign: 'middle'}}/>

### 소스 세트 간의 공통 의존성 버전 정렬

Kotlin Multiplatform 프로젝트에서 공통 소스 세트는 klib를 생성하고 구성된 각 [컴파일](multiplatform-configure-compilations)의 일부로 여러 번 컴파일됩니다. 일관된 바이너리를 생성하려면 공통 코드를 매번 동일한 버전의 멀티플랫폼 의존성으로 컴파일해야 합니다. Kotlin Gradle 플러그인은 이러한 의존성을 정렬하여 효과적인 의존성 버전이 각 소스 세트에서 동일하도록 합니다.

위의 예에서 `androidx.navigation:navigation-compose:2.7.7` 의존성을 `androidMain` 소스 세트에 추가한다고 가정해 보겠습니다. 프로젝트는 `commonMain` 소스 세트에 대해 `kotlinx-coroutines-core:1.7.3` 의존성을 명시적으로 선언하지만 버전 2.7.7의 Compose Navigation 라이브러리에는 Kotlin 코루틴 1.8.0 이상이 필요합니다.

`commonMain`과 `androidMain`이 함께 컴파일되므로 Kotlin Gradle 플러그인은 코루틴 라이브러리의 두 버전 중에서 선택하고 `commonMain` 소스 세트에 `kotlinx-coroutines-core:1.8.0`을 적용합니다. 그러나 공통 코드가 구성된 모든 대상에서 일관되게 컴파일되도록 하려면 iOS 소스 세트도 동일한 의존성 버전으로 제한해야 합니다. 따라서 Gradle은 `kotlinx.coroutines-*:1.8.0` 의존성을 `iosMain` 소스 세트에도 전파합니다.

<img src="/img/multiplatform-source-set-dependency-alignment.svg" alt="*Main 소스 세트 간의 의존성 정렬" width="700" style={{verticalAlign: 'middle'}}/>

의존성은 `*Main` 소스 세트와 [`*Test` 소스 세트](multiplatform-discover-project#integration-with-tests)에서 개별적으로 정렬됩니다.
`*Test` 소스 세트에 대한 Gradle 구성에는 `*Main` 소스 세트의 모든 의존성이 포함되지만 그 반대는 아닙니다.
따라서 기본 코드에 영향을 주지 않고 더 새로운 라이브러리 버전으로 프로젝트를 테스트할 수 있습니다.

예를 들어 프로젝트의 모든 소스 세트에 전파된 `*Main` 소스 세트에 Kotlin 코루틴 1.7.3 의존성이 있다고 가정합니다.
그러나 `iosTest` 소스 세트에서는 새로운 라이브러리 릴리스를 테스트하기 위해 버전을 1.8.0으로 업그레이드하기로 결정합니다.
동일한 알고리즘에 따라 이 의존성은 `*Test` 소스 세트의 트리에 걸쳐 전파되므로 모든 `*Test` 소스 세트는 `kotlinx.coroutines-*:1.8.0` 의존성으로 컴파일됩니다.

<img src="/img/test-main-source-set-dependency-alignment.svg" alt="주요 소스 세트와 별도로 의존성을 해결하는 테스트 소스 세트" style={{verticalAlign: 'middle'}}/>

## 컴파일

단일 플랫폼 프로젝트와 달리 Kotlin Multiplatform 프로젝트는 모든 아티팩트를 빌드하기 위해 여러 컴파일러 실행이 필요합니다.
각 컴파일러 실행은 _Kotlin 컴파일_입니다.

예를 들어, 이전에 언급한 Kotlin 컴파일 중에 iPhone 장치용 바이너리가 생성되는 방법은 다음과 같습니다.

<img src="/img/ios-compilation-diagram.svg" alt="iOS용 Kotlin 컴파일" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin 컴파일은 대상 아래에 그룹화됩니다. 기본적으로 Kotlin은 각 대상에 대해 두 개의 컴파일, 즉 프로덕션 소스용 `main` 컴파일과 테스트 소스용 `test` 컴파일을 만듭니다.

빌드 스크립트에서 컴파일은 유사한 방식으로 액세스됩니다. 먼저 Kotlin 대상을 선택한 다음 내부의 `compilations` 컨테이너에 액세스하고 마지막으로 해당 이름으로 필요한 컴파일을 선택합니다.

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```