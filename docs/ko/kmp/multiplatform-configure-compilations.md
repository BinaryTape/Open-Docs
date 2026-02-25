[//]: # (title: 컴파일 설정)

Kotlin 멀티플랫폼 프로젝트는 산출물(artifact)을 생성하기 위해 컴파일(compilation)을 사용합니다. 각 타겟(target)은 프로덕션 및 테스트 용도와 같이 하나 이상의 컴파일을 가질 수 있습니다.

각 타겟의 기본 컴파일은 다음과 같습니다:

* JVM, JS, Native 타겟의 경우 `main` 및 `test` 컴파일.
* Android 타겟의 경우 [Android 빌드 변형(build variant)](https://developer.android.com/build/build-variants)당 하나의 [컴파일](#compilation-for-android).

![컴파일](compilations.svg)

프로덕션 코드와 유닛 테스트 외에 통합 테스트나 성능 테스트와 같은 다른 코드를 컴파일해야 하는 경우, [커스텀 컴파일을 생성](#create-a-custom-compilation)할 수 있습니다.

다음과 같은 단위로 산출물 생성 방식을 구성할 수 있습니다:

* 프로젝트의 [모든 컴파일](#configure-all-compilations)을 한 번에 설정.
* 한 타겟은 여러 컴파일을 가질 수 있으므로, [특정 타겟의 컴파일들](#configure-compilations-for-one-target)을 설정.
* [특정 컴파일](#configure-one-compilation) 하나를 설정.

모든 타겟 또는 특정 타겟에서 사용할 수 있는 [컴파일 파라미터 목록](multiplatform-dsl-reference.md#compilation-parameters)과 [컴파일러 옵션](https://kotlinlang.org/docs/gradle-compiler-options.html)을 참조하세요.

## 모든 컴파일 설정

이 예제는 모든 타겟에서 공통으로 사용하는 컴파일러 옵션을 구성합니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 특정 타겟의 컴파일 설정

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</TabItem>
</Tabs>

## 특정 컴파일 하나 설정

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 커스텀 컴파일 생성

프로덕션 코드와 유닛 테스트 외에 통합 테스트나 성능 테스트 등을 컴파일해야 하는 경우 커스텀 컴파일을 생성하세요.

커스텀 컴파일의 경우 모든 의존성을 수동으로 설정해야 합니다. 커스텀 컴파일의 기본 소스 세트(source set)는 `commonMain` 및 `commonTest` 소스 세트에 의존하지 않습니다.
 
예를 들어, `jvm` 타겟의 통합 테스트를 위한 커스텀 컴파일을 만들려면 `integrationTest`와 `main` 컴파일 사이에 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 관계를 설정하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // main과 해당 클래스패스를 의존성으로 가져오고 internal 가시성을 확보합니다.
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
            }

            // 이 컴파일에서 생성된 테스트를 실행하기 위한 테스트 태스크를 생성합니다:
            testRuns.create("integration") {
                // 테스트 태스크 구성
                setExecutionSourceFrom(integrationTest)
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // main과 해당 클래스패스를 의존성으로 가져오고 internal 가시성을 확보합니다.
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }
        }

        // 이 컴파일에서 생성된 테스트를 실행하기 위한 테스트 태스크를 생성합니다.
        testRuns.create('integration') {
            // 테스트 태스크 구성
            setExecutionSourceFrom(compilations.integrationTest)
        }
    }
}
```

</TabItem>
</Tabs>

컴파일을 연관(associate)시키면 메인 컴파일 출력이 의존성으로 추가되고 컴파일 간에 `internal` 가시성이 설정됩니다.

커스텀 컴파일은 다른 경우에도 필요합니다. 예를 들어, 최종 산출물에 서로 다른 JVM 버전을 위한 컴파일을 결합하고 싶거나, 이미 Gradle에서 소스 세트를 설정한 상태에서 멀티플랫폼 프로젝트로 마이그레이션하려는 경우입니다.

> [`android`](#compilation-for-android)를 위한 커스텀 컴파일을 생성하려면 [Android Gradle 플러그인](https://developer.android.com/build/build-variants)을 통해 빌드 변형을 설정하세요.
> 
{style="tip"}

## JVM 컴파일

멀티플랫폼 프로젝트에서 `jvm` 타겟을 선언하면, Kotlin 멀티플랫폼 Gradle 플러그인이 자동으로 Java 소스 세트를 생성하고 이를 JVM 타겟의 컴파일에 포함시킵니다.

공통 소스 세트(Common source sets)에는 Java 리소스를 포함할 수 없으므로, 멀티플랫폼 프로젝트의 해당 하위 디렉토리에 배치해야 합니다. 예:

![Java 소스 파일](java-source-paths.png){width=200}

현재 Kotlin 멀티플랫폼 Gradle 플러그인은 Java 플러그인에 의해 구성된 일부 태스크를 대체합니다:

* JAR 태스크: 표준 `jar` 대신 산출물 이름을 기반으로 한 타겟별 태스크를 사용합니다. 예를 들어 `jvm()` 타겟 선언에는 `jvmJar`를, `jvm("desktop")`에는 `desktopJar`를 사용합니다.
* 테스트 태스크: 표준 `test` 대신 산출물 이름을 기반으로 한 타겟별 태스크(예: `jvmTest`)를 사용합니다.
* 리소스 처리: `*ProcessResources` 태스크 대신 해당 컴파일 태스크에서 리소스를 처리합니다.

이러한 태스크들은 타겟이 선언될 때 자동으로 생성됩니다. 그러나 필요한 경우 JAR 태스크를 수동으로 정의하고 구성할 수 있습니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// 공유 모듈의 `build.gradle.kts` 파일
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // JVM 타겟 지정
    jvm {
        // JAR 생성을 위한 태스크 추가
        tasks.named<Jar>(artifactsTaskName).configure {
            // 태스크 구성
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // JVM 전용 의존성 추가
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// 공유 모듈의 `build.gradle` 파일
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

kotlin {
    // JVM 타겟 지정
    jvm {
        // JAR 생성을 위한 태스크 추가
        tasks.named<Jar>(artifactsTaskName).configure {
            // 태스크 구성
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // JVM 전용 의존성 추가
            }
        }
    }
}
```

</TabItem>
</Tabs>

이 타겟은 Kotlin 멀티플랫폼 Gradle 플러그인에 의해 게시되며 Java 플러그인에 특화된 단계가 필요하지 않습니다.

## 네이티브 언어와의 상호 운용성 설정

Kotlin은 [네이티브 언어와의 상호 운용성(interoperability)](https://kotlinlang.org/docs/native-overview.html) 및 특정 컴파일에 대해 이를 구성할 수 있는 DSL을 제공합니다.

| 네이티브 언어 | 지원 플랫폼 | 비고 |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C | 모든 플랫폼 | |
| Objective-C | Apple 플랫폼 (macOS, iOS, watchOS, tvOS) | |
| Swift (Objective-C 경유) | Apple 플랫폼 (macOS, iOS, watchOS, tvOS) | Kotlin은 `@objc` 어트리뷰트가 표시된 Swift 선언만 사용할 수 있습니다. |

컴파일은 여러 네이티브 라이브러리와 상호 작용할 수 있습니다. [정의 파일(definition file)](https://kotlinlang.org/docs/native-definition-file.html)의 가용 속성이나 빌드 파일의 [`cinterops` 블록](multiplatform-dsl-reference.md#cinterops)에서 상호 운용성을 구성하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 필요한 타겟으로 교체하세요.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 네이티브 API를 설명하는 def 파일.
                // 기본 경로는 src/nativeInterop/cinterop/<interop-name>.def 입니다.
                definitionFile.set(project.file("def-file.def"))
                
                // 생성된 Kotlin API를 배치할 패키지.
                packageName("org.sample")
                
                // cinterop 도구에 의해 컴파일러에 전달될 옵션.
                compilerOpts("-Ipath/to/headers")
              
                // 헤더를 찾을 디렉토리.
                includeDirs.apply {
                    // 헤더 검색 디렉토리 (-I<path> 컴파일러 옵션과 동일).
                    allHeaders("path1", "path2")
                    
                    // 'headerFilter' def 파일 옵션에 나열된 헤더를 검색할 추가 디렉토리.
                    // -headerFilterAdditionalSearchPrefix 명령줄 옵션과 동일.
                    headerFilterOnly("path1", "path2")
                }
                // includeDirs.allHeaders의 축약형.
                includeDirs("include/directory", "another/directory")
            }
            
            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 필요한 타겟으로 교체하세요.
        compilations.main {
            cinterops {
                myInterop {
                    // 네이티브 API를 설명하는 def 파일.
                    // 기본 경로는 src/nativeInterop/cinterop/<interop-name>.def 입니다.
                    definitionFile = project.file("def-file.def")
                    
                    // 생성된 Kotlin API를 배치할 패키지.
                    packageName 'org.sample'
                    
                    // cinterop 도구에 의해 컴파일러에 전달될 옵션.
                    compilerOpts '-Ipath/to/headers'
                    
                    // 헤더 검색 디렉토리 (-I<path> 컴파일러 옵션과 동일).
                    includeDirs.allHeaders("path1", "path2")
                    
                    // 'headerFilter' def 파일 옵션에 나열된 헤더를 검색할 추가 디렉토리.
                    // -headerFilterAdditionalSearchPrefix 명령줄 옵션과 동일.
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // includeDirs.allHeaders의 축약형.
                    includeDirs("include/directory", "another/directory")
                }
                
                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Android 컴파일
 
Android 타겟을 위해 기본적으로 생성되는 컴파일은 [Android 빌드 변형(build variant)](https://developer.android.com/build/build-variants)에 연결됩니다. 각 빌드 변형에 대해 동일한 이름으로 Kotlin 컴파일이 생성됩니다.

그런 다음, 각 변형에 대해 컴파일된 각 [Android 소스 세트](https://developer.android.com/build/build-variants#sourcesets)에 대해, 타겟 이름이 앞에 붙은 해당 소스 세트 이름으로 Kotlin 소스 세트가 생성됩니다. 예를 들어, `android`라는 이름의 Kotlin 타겟에 대해 Android 소스 세트 `debug`에 대응하는 Kotlin 소스 세트 `androidDebug`가 생성됩니다. 이러한 Kotlin 소스 세트들은 각 변형의 컴파일에 적절히 추가됩니다.

기본 소스 세트 `commonMain`은 각 프로덕션(애플리케이션 또는 라이브러리) 변형의 컴파일에 추가됩니다. `commonTest` 소스 세트도 이와 유사하게 유닛 테스트 및 계측 테스트(instrumented test) 변형의 컴파일에 추가됩니다.

[`kapt`](https://kotlinlang.org/docs/kapt.html)를 이용한 어노테이션 처리도 지원되지만, 현재의 제한 사항으로 인해 `kapt` 의존성이 구성되기 전에 Android 타겟이 생성되어야 합니다. 이는 Kotlin 소스 세트 의존성 내부가 아닌 최상위 `dependencies {}` 블록에서 수행되어야 합니다.

```kotlin
kotlin {
    android { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 소스 세트 계층 구조 컴파일

Kotlin은 `dependsOn` 관계를 사용하여 [소스 세트 계층 구조(source set hierarchy)](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)를 빌드할 수 있습니다.

![소스 세트 계층 구조](jvm-js-main.svg)

소스 세트 `jvmMain`이 소스 세트 `commonMain`에 의존하는 경우:

* `jvmMain`이 특정 타겟을 위해 컴파일될 때마다 `commonMain`도 해당 컴파일에 참여하며 JVM 클래스 파일과 같은 동일한 타겟 바이너리 형태로 컴파일됩니다.
* `jvmMain`의 소스는 `commonMain`의 선언(internal 선언 포함)을 '볼' 수 있으며, `implementation` 의존성으로 지정된 것들을 포함하여 `commonMain`의 [의존성](multiplatform-add-dependencies.md)도 볼 수 있습니다.
* `jvmMain`은 `commonMain`의 [expect 선언(expected declarations)](multiplatform-expect-actual.md)에 대한 플랫폼별 구현을 포함할 수 있습니다.
* `commonMain`의 리소스는 항상 `jvmMain`의 리소스와 함께 처리되고 복사됩니다.
* `jvmMain`과 `commonMain`의 [언어 설정(language settings)](multiplatform-dsl-reference.md#language-settings)은 일관되어야 합니다.

언어 설정의 일관성은 다음과 같은 방식으로 확인됩니다:
* `jvmMain`은 `commonMain`보다 크거나 같은 `languageVersion`을 설정해야 합니다.
* `jvmMain`은 `commonMain`이 활성화한 모든 불안정(unstable) 언어 기능을 활성화해야 합니다(버그 수정 기능에 대해서는 이러한 요구 사항이 없습니다).
* `jvmMain`은 `commonMain`이 사용하는 모든 실험적(experimental) 어노테이션을 사용해야 합니다.
* `apiVersion`, 버그 수정 언어 기능 및 `progressiveMode`는 임의로 설정할 수 있습니다.

## Gradle의 프로젝트 격리 기능 설정

> 이 기능은 [실험적(Experimental)](supported-platforms.md#general-kotlin-stability-levels)이며 현재 Gradle에서 프리 알파(pre-alpha) 상태입니다. Gradle 버전 8.10 이상에서만 평가 목적으로만 사용하십시오. 이 기능은 언제든지 중단되거나 변경될 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에서 의견을 보내주시면 감사하겠습니다. 사용을 위해서는 명시적 동의(Opt-in)가 필요합니다(아래 상세 내용 참조).
> 
{style="warning"}

Gradle은 개별 프로젝트를 서로 "격리"하여 빌드 성능을 향상시키는 [프로젝트 격리(Isolated Projects)](https://docs.gradle.org/current/userguide/isolated_projects.html) 기능을 제공합니다. 이 기능은 프로젝트 간의 빌드 스크립트와 플러그인을 분리하여 안전하게 병렬로 실행할 수 있도록 합니다.

이 기능을 활성화하려면 Gradle의 안내에 따라 [시스템 속성을 설정](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)하십시오.

프로젝트 격리 기능에 대한 자세한 내용은 [Gradle 문서](https://docs.gradle.org/current/userguide/isolated_projects.html)를 참조하세요.