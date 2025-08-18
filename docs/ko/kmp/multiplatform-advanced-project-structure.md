[//]: # (title: 멀티플랫폼 프로젝트 구조의 고급 개념)

이 문서는 코틀린 멀티플랫폼 프로젝트 구조의 고급 개념과 이러한 개념이 Gradle 구현에 어떻게 매핑되는지 설명합니다. 이 정보는 Gradle 빌드의 하위 수준 추상화(구성, 태스크, 발행물 등)를 다루거나 코틀린 멀티플랫폼 빌드를 위한 Gradle 플러그인을 생성해야 하는 경우에 유용할 것입니다.

이 페이지는 다음과 같은 경우에 유용합니다:

*   코틀린이 소스 세트를 생성하지 않는 특정 타겟 세트 간에 코드를 공유해야 하는 경우.
*   코틀린 멀티플랫폼 빌드를 위한 Gradle 플러그인을 생성하거나, 구성(configurations), 태스크(tasks), 발행물(publications) 등과 같은 Gradle 빌드의 하위 수준 추상화를 다루어야 하는 경우.

멀티플랫폼 프로젝트에서 의존성 관리에 대해 이해해야 할 중요한 사항 중 하나는 Gradle 스타일의 프로젝트 또는 라이브러리 의존성과 코틀린에 특화된 소스 세트 간의 `dependsOn` 관계의 차이입니다:

*   `dependsOn`은 [소스 세트 계층](#dependson-and-source-set-hierarchies)을 가능하게 하고 멀티플랫폼 프로젝트에서 코드 공유를 전반적으로 가능하게 하는 공통 소스 세트와 플랫폼별 소스 세트 간의 관계입니다. 기본 소스 세트의 경우 계층은 자동으로 관리되지만, 특정 상황에서는 변경해야 할 수 있습니다.
*   라이브러리 및 프로젝트 의존성은 일반적으로 평소와 같이 작동하지만, 멀티플랫폼 프로젝트에서 이를 올바르게 관리하려면 컴파일에 사용되는 세부적인 **소스 세트 → 소스 세트** 의존성으로 [Gradle 의존성이 어떻게 해결되는지](#dependencies-on-other-libraries-or-projects) 이해해야 합니다.

> 고급 개념에 대해 자세히 알아보기 전에 [멀티플랫폼 프로젝트 구조의 기본](multiplatform-discover-project.md)을 학습하는 것을 권장합니다.
>
{style="tip"}

## dependsOn 및 소스 세트 계층

일반적으로 _`dependsOn`_ 관계가 아닌 _의존성(dependencies)_과 작업하게 될 것입니다. 그러나 `dependsOn`을 검토하는 것은 코틀린 멀티플랫폼 프로젝트가 내부적으로 어떻게 작동하는지 이해하는 데 중요합니다.

`dependsOn`은 두 코틀린 소스 세트 간의 코틀린에 특화된 관계입니다. 이는 공통 소스 세트와 플랫폼별 소스 세트 간의 연결일 수 있습니다. 예를 들어, `jvmMain` 소스 세트가 `commonMain`에 의존하고, `iosArm64Main`이 `iosMain`에 의존하는 식입니다.

코틀린 소스 세트 `A`와 `B`를 포함하는 일반적인 예를 고려해 봅시다. `A.dependsOn(B)` 표현식은 코틀린에 다음을 지시합니다:

1.  `A`는 내부 선언을 포함하여 `B`의 API를 관찰합니다.
2.  `A`는 `B`에서 기대되는 선언에 대한 실제 구현을 제공할 수 있습니다. 이는 `A`가 직접 또는 간접적으로 `A.dependsOn(B)`인 경우에만 `B`에 대한 `actuals`를 제공할 수 있으므로 필요충분 조건입니다.
3.  `B`는 자체 타겟 외에 `A`가 컴파일되는 모든 타겟으로 컴파일되어야 합니다.
4.  `A`는 `B`의 모든 일반 의존성을 상속합니다.

`dependsOn` 관계는 소스 세트 계층으로 알려진 트리와 유사한 구조를 만듭니다. 다음은 `androidTarget`, `iosArm64`(iPhone 장치), `iosSimulatorArm64`(Apple Silicon Mac용 iPhone 시뮬레이터)를 사용하는 일반적인 모바일 개발 프로젝트의 예시입니다:

![DependsOn tree structure](dependson-tree-diagram.svg){width=700}

화살표는 `dependsOn` 관계를 나타냅니다.
이러한 관계는 플랫폼 바이너리 컴파일 중에 유지됩니다. 코틀린이 `iosMain`이 `commonMain`의 API를 볼 수 있지만 `iosArm64Main`의 API는 볼 수 없다고 이해하는 방식입니다:

![DependsOn relations during compilation](dependson-relations-diagram.svg){width=700}

`dependsOn` 관계는 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 호출로 구성됩니다. 예를 들어:

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        // Example of configuring the dependsOn relation 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

*   이 예시는 빌드 스크립트에서 `dependsOn` 관계를 정의하는 방법을 보여줍니다. 그러나 코틀린 Gradle 플러그인은 기본적으로 소스 세트를 생성하고 이러한 관계를 설정하므로 수동으로 수행할 필요가 없습니다.
*   `dependsOn` 관계는 빌드 스크립트의 `dependencies {}` 블록과 별도로 선언됩니다.
    이는 `dependsOn`이 일반적인 의존성이 아니라, 다른 타겟 간에 코드를 공유하는 데 필요한 코틀린 소스 세트 간의 특정 관계이기 때문입니다.

`dependsOn`을 사용하여 게시된 라이브러리 또는 다른 Gradle 프로젝트에 대한 일반 의존성을 선언할 수 없습니다.
예를 들어, `commonMain`이 `kotlinx-coroutines-core` 라이브러리의 `commonMain`에 의존하도록 설정하거나 `commonTest.dependsOn(commonMain)`을 호출할 수 없습니다.

### 커스텀 소스 세트 선언하기

어떤 경우에는 프로젝트에 커스텀 중간 소스 세트가 필요할 수 있습니다.
JVM, JS, Linux로 컴파일되는 프로젝트가 있고, JVM과 JS 간에만 일부 소스를 공유하고 싶다고 가정해 봅시다.
이 경우, [멀티플랫폼 프로젝트 구조의 기본](multiplatform-discover-project.md)에 설명된 대로 이 타겟 쌍을 위한 특정 소스 세트를 찾아야 합니다.

코틀린은 이러한 소스 세트를 자동으로 생성하지 않습니다. 이는 `by creating` 구성을 사용하여 수동으로 생성해야 함을 의미합니다:

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

그러나 코틀린은 여전히 이 소스 세트를 어떻게 처리하거나 컴파일할지 모릅니다. 다이어그램을 그렸다면 이 소스 세트는 격리되어 어떤 타겟 레이블도 없을 것입니다:

![Missing dependsOn relation](missing-dependson-diagram.svg){width=700}

이를 해결하려면 여러 `dependsOn` 관계를 추가하여 `jvmAndJsMain`을 계층에 포함해야 합니다:

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

여기서 `jvmMain.dependsOn(jvmAndJsMain)`은 JVM 타겟을 `jvmAndJsMain`에 추가하고, `jsMain.dependsOn(jvmAndJsMain)`은 JS 타겟을 `jvmAndJsMain`에 추가합니다.

최종 프로젝트 구조는 다음과 같습니다:

![Final project structure](final-structure-diagram.svg){width=700}

> `dependsOn` 관계의 수동 구성은 기본 계층 템플릿의 자동 적용을 비활성화합니다.
> 이러한 경우와 이를 처리하는 방법에 대한 자세한 내용은 [추가 구성](multiplatform-hierarchy.md#additional-configuration)을 참조하십시오.
>
{style="note"}

## 다른 라이브러리 또는 프로젝트에 대한 의존성

멀티플랫폼 프로젝트에서는 게시된 라이브러리 또는 다른 Gradle 프로젝트에 대한 일반 의존성을 설정할 수 있습니다.

코틀린 멀티플랫폼은 일반적으로 일반적인 Gradle 방식으로 의존성을 선언합니다. Gradle과 마찬가지로 다음을 수행합니다:

*   빌드 스크립트에서 `dependencies {}` 블록을 사용합니다.
*   `implementation` 또는 `api`와 같은 의존성에 적절한 스코프를 선택합니다.
*   의존성이 리포지토리에 게시된 경우 `"com.google.guava:guava:32.1.2-jre"`와 같이 좌표를 지정하거나, 동일한 빌드에 있는 Gradle 프로젝트인 경우 `project(":utils:concurrency")`와 같이 경로를 지정하여 의존성을 참조합니다.

멀티플랫폼 프로젝트의 의존성 구성에는 몇 가지 특별한 기능이 있습니다. 각 코틀린 소스 세트에는 자체 `dependencies {}` 블록이 있습니다. 이를 통해 플랫폼별 소스 세트에서 플랫폼별 의존성을 선언할 수 있습니다:

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

공통 의존성은 더 복잡합니다. `kotlinx.coroutines`와 같은 멀티플랫폼 라이브러리에 대한 의존성을 선언하는 멀티플랫폼 프로젝트를 고려해 봅시다:

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone devices 
    iosSimulatorArm64() // iPhone simulator on Apple Silicon Mac

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

의존성 해결에는 세 가지 중요한 개념이 있습니다:

1.  멀티플랫폼 의존성은 `dependsOn` 구조 아래로 전파됩니다. `commonMain`에 의존성을 추가하면 `commonMain`에 직간접적으로 `dependsOn` 관계를 선언하는 모든 소스 세트에 자동으로 추가됩니다.

    이 경우, 의존성은 실제로 모든 `*Main` 소스 세트, 즉 `iosMain`, `jvmMain`, `iosSimulatorArm64Main`, `iosX64Main`에 자동으로 추가되었습니다. 이 모든 소스 세트는 `commonMain` 소스 세트로부터 `kotlin-coroutines-core` 의존성을 상속하므로, 모든 소스 세트에 수동으로 복사하여 붙여넣을 필요가 없습니다:

    ![Propagation of multiplatform dependencies](dependency-propagation-diagram.svg){width=700}

    > 전파 메커니즘을 통해 특정 소스 세트를 선택하여 선언된 의존성을 받을 스코프를 선택할 수 있습니다.
    > 예를 들어, iOS에서 `kotlinx.coroutines`를 사용하고 싶지만 Android에서는 사용하고 싶지 않다면 `iosMain`에만 이 의존성을 추가할 수 있습니다.
    >
    {style="tip"}

2.  `commonMain`에서 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`와 같은 _소스 세트 → 멀티플랫폼 라이브러리_ 의존성은 의존성 해결의 중간 상태를 나타냅니다. 해결의 최종 상태는 항상 _소스 세트 → 소스 세트_ 의존성으로 표현됩니다.

    > 최종 _소스 세트 → 소스 세트_ 의존성은 `dependsOn` 관계가 아닙니다.
    >
    {style="note"}

    세부적인 _소스 세트 → 소스 세트_ 의존성을 추론하기 위해 코틀린은 각 멀티플랫폼 라이브러리와 함께 게시된 소스 세트 구조를 읽습니다. 이 단계 후, 각 라이브러리는 전체가 아닌 소스 세트 모음으로 내부적으로 표현됩니다. `kotlinx-coroutines-core`의 이 예시를 참조하십시오:

    ![Serialization of the source set structure](structure-serialization-diagram.svg){width=700}

3.  코틀린은 각 의존성 관계를 가져와 의존성에서 소스 세트 컬렉션으로 해결합니다.
    해당 컬렉션의 각 의존성 소스 세트는 _호환 가능한 타겟_을 가져야 합니다. 의존성 소스 세트가 호환 가능한 타겟을 갖는다는 것은 소비자 소스 세트와 _적어도 동일한 타겟_으로 컴파일된다는 의미입니다.

    샘플 프로젝트의 `commonMain`이 `androidTarget`, `iosX64`, `iosSimulatorArm64`로 컴파일되는 예를 고려해 봅시다:

    *   먼저, `kotlinx-coroutines-core.commonMain`에 대한 의존성을 해결합니다. 이는 `kotlinx-coroutines-core`가 가능한 모든 코틀린 타겟으로 컴파일되기 때문입니다. 따라서, 그 `commonMain`은 필요한 `androidTarget`, `iosX64`, `iosSimulatorArm64`를 포함하여 가능한 모든 타겟으로 컴파일됩니다.
    *   둘째, `commonMain`은 `kotlinx-coroutines-core.concurrentMain`에 의존합니다.
        `kotlinx-coroutines-core`의 `concurrentMain`은 JS를 제외한 모든 타겟으로 컴파일되므로, 소비자 프로젝트의 `commonMain`의 타겟과 일치합니다.

    그러나 coroutines의 `iosX64Main`과 같은 소스 세트는 소비자의 `commonMain`과 호환되지 않습니다.
    `iosX64Main`이 `commonMain`의 타겟 중 하나인 `iosX64`로 컴파일되더라도, `androidTarget`이나 `iosSimulatorArm64`로는 컴파일되지 않습니다.

    의존성 해결 결과는 `kotlinx-coroutines-core`의 어떤 코드가 보이는지에 직접적인 영향을 미칩니다:

    ![Error on JVM-specific API in common code](dependency-resolution-error.png){width=700}

### 소스 세트 간 공통 의존성 버전 정렬하기

코틀린 멀티플랫폼 프로젝트에서 공통 소스 세트는 klib을 생성하고 각 구성된 [컴파일](multiplatform-configure-compilations.md)의 일부로 여러 번 컴파일됩니다. 일관된 바이너리를 생성하려면 공통 코드는 매번 동일한 버전의 멀티플랫폼 의존성에 대해 컴파일되어야 합니다.
코틀린 Gradle 플러그인은 이러한 의존성을 정렬하여 각 소스 세트에 대해 효과적인 의존성 버전이 동일하도록 돕습니다.

위 예시에서, `androidMain` 소스 세트에 `androidx.navigation:navigation-compose:2.7.7` 의존성을 추가하고 싶다고 가정해 봅시다. 프로젝트는 `commonMain` 소스 세트에 `kotlinx-coroutines-core:1.7.3` 의존성을 명시적으로 선언하지만, 버전 2.7.7의 Compose Navigation 라이브러리는 코틀린 코루틴 1.8.0 이상을 필요로 합니다.

`commonMain`과 `androidMain`이 함께 컴파일되므로 코틀린 Gradle 플러그인은 두 코루틴 라이브러리 버전 중 하나를 선택하고 `commonMain` 소스 세트에 `kotlinx-coroutines-core:1.8.0`을 적용합니다. 그러나 공통 코드가 구성된 모든 타겟에서 일관되게 컴파일되도록 하려면 iOS 소스 세트도 동일한 의존성 버전으로 제한되어야 합니다. 따라서 Gradle은 `kotlinx.coroutines-*:1.8.0` 의존성을 `iosMain` 소스 세트에도 전파합니다.

![Alignment of dependencies among *Main source sets](multiplatform-source-set-dependency-alignment.svg){width=700}

의존성은 `*Main` 소스 세트와 [`*Test` 소스 세트](multiplatform-discover-project.md#integration-with-tests) 간에 별도로 정렬됩니다.
`*Test` 소스 세트에 대한 Gradle 구성에는 `*Main` 소스 세트의 모든 의존성이 포함되지만 그 반대는 아닙니다.
따라서 주요 코드에 영향을 주지 않고 최신 라이브러리 버전으로 프로젝트를 테스트할 수 있습니다.

예를 들어, 프로젝트의 모든 소스 세트에 전파되는 코틀린 코루틴 1.7.3 의존성이 `*Main` 소스 세트에 있다고 가정해 봅시다.
하지만 `iosTest` 소스 세트에서는 새 라이브러리 릴리스를 테스트하기 위해 버전을 1.8.0으로 업그레이드하기로 결정합니다.
동일한 알고리즘에 따라 이 의존성은 `*Test` 소스 세트 트리 전체에 전파되므로 모든 `*Test` 소스 세트는 `kotlinx.coroutines-*:1.8.0` 의존성으로 컴파일됩니다.

![Test source sets resolving dependencies separately from the main source sets](test-main-source-set-dependency-alignment.svg)

## 컴파일

단일 플랫폼 프로젝트와 달리 코틀린 멀티플랫폼 프로젝트는 모든 아티팩트를 빌드하기 위해 여러 번의 컴파일러 실행을 필요로 합니다.
각 컴파일러 실행은 _코틀린 컴파일_입니다.

예를 들어, 앞서 언급된 코틀린 컴파일 중에 iPhone 장치용 바이너리가 어떻게 생성되는지는 다음과 같습니다:

![Kotlin compilation for iOS](ios-compilation-diagram.svg){width=700}

코틀린 컴파일은 타겟 아래에 그룹화됩니다. 기본적으로 코틀린은 각 타겟에 대해 두 가지 컴파일을 생성합니다. 하나는 프로덕션 소스를 위한 `main` 컴파일이고, 다른 하나는 테스트 소스를 위한 `test` 컴파일입니다.

빌드 스크립트에서 컴파일에 접근하는 방식도 유사합니다. 먼저 코틀린 타겟을 선택한 다음, 그 안에 있는 `compilations` 컨테이너에 접근하고, 마지막으로 필요한 컴파일을 이름으로 선택합니다:

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```