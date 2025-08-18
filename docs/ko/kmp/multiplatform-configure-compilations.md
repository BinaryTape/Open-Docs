[//]: # (title: 컴필레이션 구성)

Kotlin 멀티플랫폼 프로젝트는 아티팩트를 생성하기 위해 컴필레이션을 사용합니다. 각 타겟은 예를 들어 프로덕션 및 테스트 목적으로 하나 이상의 컴필레이션을 가질 수 있습니다.

각 타겟에 대해 기본 컴필레이션에는 다음이 포함됩니다:

*   JVM, JS, Native 타겟을 위한 `main` 및 `test` 컴필레이션.
*   Android 타겟을 위한 [Android 빌드 배리언트](https://developer.android.com/build/build-variants)별 [컴필레이션](#compilation-for-android).

![Compilations](compilations.svg)

프로덕션 코드 및 단위 테스트 외에 통합 테스트 또는 성능 테스트와 같은 다른 것을 컴파일해야 하는 경우, [사용자 지정 컴필레이션을 생성](#create-a-custom-compilation)할 수 있습니다.

아티팩트가 생성되는 방법을 다음에서 구성할 수 있습니다:

*   프로젝트의 [모든 컴필레이션](#configure-all-compilations)을 한 번에.
*   하나의 타겟이 여러 컴필레이션을 가질 수 있으므로 [하나의 타겟에 대한 컴필레이션](#configure-compilations-for-one-target).
*   [특정 컴필레이션](#configure-one-compilation).

모든 타겟 또는 특정 타겟에 사용할 수 있는 [컴필레이션 파라미터](multiplatform-dsl-reference.md#compilation-parameters) 목록과 [컴파일러 옵션](https://kotlinlang.org/docs/gradle-compiler-options.html)을 참조하세요.

## 모든 컴필레이션 구성

이 예시는 모든 타겟에 공통으로 적용되는 컴파일러 옵션을 구성합니다:

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

## 하나의 타겟에 대한 컴필레이션 구성

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

## 특정 컴필레이션 구성

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

## 사용자 지정 컴필레이션 생성

프로덕션 코드 및 단위 테스트 외에, 예를 들어 통합 테스트 또는 성능 테스트와 같은 다른 것을 컴파일해야 하는 경우, 사용자 지정 컴필레이션을 생성하세요.

사용자 지정 컴필레이션의 경우 모든 의존성을 수동으로 설정해야 합니다. 사용자 지정 컴필레이션의 기본 소스 세트는 `commonMain` 및 `commonTest` 소스 세트에 의존하지 않습니다.

예를 들어, `jvm` 타겟의 통합 테스트를 위한 사용자 지정 컴필레이션을 생성하려면, `integrationTest` 및 `main` 컴필레이션 사이에 `associateWith` 관계를 설정합니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // Import main and its classpath as dependencies and establish internal visibility
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // Create a test task to run the tests produced by this compilation:
                testRuns.create("integration") {
                    // Configure the test task
                    setExecutionSourceFrom(integrationTest)
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
        compilations.create('integrationTest') {
            def main = compilations.main
            // Import main and its classpath as dependencies and establish internal visibility
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // Create a test task to run the tests produced by this compilation
            testRuns.create('integration') {
                // Configure the test task
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</TabItem>
</Tabs>

컴필레이션을 연관시킴으로써, 메인 컴필레이션 출력을 의존성으로 추가하고 컴필레이션 간의 `internal` 가시성을 설정합니다.

사용자 지정 컴필레이션은 다른 경우에도 필요합니다. 예를 들어, 최종 아티팩트에서 다른 JVM 버전용 컴필레이션을 결합하고 싶거나, 이미 Gradle에 소스 세트를 설정했으며 멀티플랫폼 프로젝트로 마이그레이션하려는 경우입니다.

> [`androidTarget`](#compilation-for-android)에 대한 사용자 지정 컴필레이션을 생성하려면 [Android Gradle 플러그인](https://developer.android.com/build/build-variants)을 통해 빌드 배리언트를 설정하세요.
> 
{style="tip"}

## JVM용 컴필레이션

멀티플랫폼 프로젝트에 `jvm` 타겟을 선언하면 Kotlin Multiplatform 플러그인은 자동으로 Java 소스 세트를 생성하고 이를 JVM 타겟의 컴필레이션에 포함합니다.

공통 소스 세트에는 Java 리소스가 포함될 수 없으므로, 해당 리소스를 멀티플랫폼 프로젝트의 해당 하위 디렉터리에 배치해야 합니다. 예를 들어:

![Java source files](java-source-paths.png){width=200}

현재 Kotlin Multiplatform 플러그인은 Java 플러그인에 의해 구성된 일부 태스크를 대체합니다:

*   JAR 태스크: 표준 `jar` 대신, 아티팩트 이름에 기반한 타겟별 태스크를 사용합니다. 예를 들어, `jvm()` 타겟 선언의 경우 `jvmJar`, `jvm("desktop")`의 경우 `desktopJar`와 같습니다.
*   테스트 태스크: 표준 `test` 대신, 아티팩트 이름에 기반한 타겟별 태스크를 사용합니다. 예를 들어, `jvmTest`와 같습니다.
*   리소스 처리: `*ProcessResources` 태스크 대신, 리소스는 해당 컴필레이션 태스크에 의해 처리됩니다.

이러한 태스크는 타겟이 선언될 때 자동으로 생성됩니다. 그러나 필요한 경우 JAR 태스크를 수동으로 정의하고 구성할 수 있습니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// Shared module's `build.gradle.kts` file
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // Specify the JVM target
    jvm {
        // Add the task for JAR generation
        tasks.named<Jar>(artifactsTaskName).configure {
            // Configure the task
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // Add JVM-specific dependencies
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// Shared module's `build.gradle` file
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

kotlin {
    // Specify the JVM target
    jvm {
        // Add the task for JAR generation
        tasks.named<Jar>(artifactsTaskName).configure {
            // Configure the task
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // Add JVM-specific dependencies
            }
        }
    }
}
```

</TabItem>
</Tabs>

이 타겟은 Kotlin Multiplatform 플러그인에 의해 게시되며 Java 플러그인에 특정한 단계는 필요하지 않습니다.

## 네이티브 언어와의 상호 운용성 구성

Kotlin은 [네이티브 언어와의 상호 운용성](https://kotlinlang.org/docs/native-overview.html)과 특정 컴필레이션을 구성하기 위한 DSL을 제공합니다.

| 네이티브 언어       | 지원되는 플랫폼                         | 설명                                                                  |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C                     | 모든 플랫폼                               |                                                                           |
| Objective-C           | Apple 플랫폼 (macOS, iOS, watchOS, tvOS) |                                                                           |
| Swift via Objective-C | Apple 플랫폼 (macOS, iOS, watchOS, tvOS) | Kotlin은 `@objc` 속성으로 표시된 Swift 선언만 사용할 수 있습니다. |

하나의 컴필레이션은 여러 네이티브 라이브러리와 상호 작용할 수 있습니다. [정의 파일](https://kotlinlang.org/docs/native-definition-file.html) 또는 빌드 파일의 [`cinterops` 블록](multiplatform-dsl-reference.md#cinterops)에서 사용 가능한 속성으로 상호 운용성을 구성하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Def-file describing the native API.
                // The default path is src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // Package to place the Kotlin API generated.
                packageName("org.sample")
                
                // Options to be passed to compiler by cinterop tool.
                compilerOpts("-Ipath/to/headers")
              
                // Directories to look for headers.
                includeDirs.apply {
                    // Directories for header search (an equivalent of the -I<path> compiler option).
                    allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    headerFilterOnly("path1", "path2")
                }
                // A shortcut for includeDirs.allHeaders.
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
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // Def-file describing the native API.
                    // The default path is src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // Package to place the Kotlin API generated.
                    packageName 'org.sample'
                    
                    // Options to be passed to compiler by cinterop tool.
                    compilerOpts '-Ipath/to/headers'
                    
                    // Directories for header search (an equivalent of the -I<path> compiler option).
                    includeDirs.allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // A shortcut for includeDirs.allHeaders.
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

## Android용 컴필레이션

Android 타겟을 위해 기본적으로 생성되는 컴필레이션은 [Android 빌드 배리언트](https://developer.android.com/build/build-variants)에 연결됩니다. 각 빌드 배리언트에 대해 동일한 이름으로 Kotlin 컴필레이션이 생성됩니다.

그런 다음, 각 배리언트에 대해 컴파일되는 [Android 소스 세트](https://developer.android.com/build/build-variants#sourcesets)마다 타겟 이름이 접두어로 붙은 소스 세트 이름으로 Kotlin 소스 세트가 생성됩니다. 예를 들어, `debug`라는 Android 소스 세트와 `androidTarget`이라는 Kotlin 타겟에 대해 `androidDebug`라는 Kotlin 소스 세트가 생성됩니다. 이 Kotlin 소스 세트들은 해당 배리언트의 컴필레이션에 추가됩니다.

기본 소스 세트 `commonMain`은 각 프로덕션(애플리케이션 또는 라이브러리) 배리언트의 컴필레이션에 추가됩니다. `commonTest` 소스 세트도 유사하게 단위 테스트 및 계측 테스트 배리언트의 컴필레이션에 추가됩니다.

[`kapt`](https://kotlinlang.org/docs/kapt.html)를 사용한 어노테이션 처리도 지원되지만, 현재 제약 사항으로 인해 `kapt` 의존성이 구성되기 전에 Android 타겟이 생성되어야 하며, 이는 Kotlin 소스 세트 의존성 내부가 아닌 최상위 `dependencies {}` 블록에서 이루어져야 합니다.

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 소스 세트 계층 컴필레이션

Kotlin은 `dependsOn` 관계로 [소스 세트 계층](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)을 빌드할 수 있습니다.

![Source set hierarchy](jvm-js-main.svg)

`jvmMain` 소스 세트가 `commonMain` 소스 세트에 의존하는 경우:

*   `jvmMain`이 특정 타겟을 위해 컴파일될 때마다 `commonMain`도 해당 컴필레이션에 참여하여 JVM 클래스 파일과 같은 동일한 타겟 바이너리 형식으로 컴파일됩니다.
*   `jvmMain`의 소스 코드는 `commonMain`의 선언(내부 선언 포함)을 '볼' 수 있으며, `implementation` 의존성으로 지정된 경우에도 `commonMain`의 [의존성](multiplatform-add-dependencies.md)을 볼 수 있습니다.
*   `jvmMain`은 `commonMain`의 [예상 선언](multiplatform-expect-actual.md)에 대한 플랫폼별 구현을 포함할 수 있습니다.
*   `commonMain`의 리소스는 항상 `jvmMain`의 리소스와 함께 처리되고 복사됩니다.
*   `jvmMain` 및 `commonMain`의 [언어 설정](multiplatform-dsl-reference.md#language-settings)은 일관되어야 합니다.

언어 설정은 다음 방식으로 일관성이 검사됩니다:
*   `jvmMain`은 `commonMain`의 `languageVersion`보다 크거나 같은 `languageVersion`을 설정해야 합니다.
*   `jvmMain`은 `commonMain`이 활성화하는 모든 불안정한 언어 기능을 활성화해야 합니다(버그 수정 기능에는 이러한 요구 사항이 없음).
*   `jvmMain`은 `commonMain`이 사용하는 모든 실험적 어노테이션을 사용해야 합니다.
*   `apiVersion`, 버그 수정 언어 기능, `progressiveMode`는 임의로 설정할 수 있습니다.

## Gradle의 Isolated Projects 기능 구성

> 이 기능은 [실험적](supported-platforms.md#general-kotlin-stability-levels)이며 현재 Gradle에서 프리 알파(pre-alpha) 상태입니다.
> Gradle 버전 8.10 이상에서만 평가 목적으로 사용하세요. 이 기능은 언제든지 제거되거나 변경될 수 있습니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에 대한 귀하의 피드백을 환영합니다.
> 옵트인(Opt-in)이 필요합니다(자세한 내용은 아래 참조).
> 
{style="warning"}

Gradle은 빌드 성능을 향상시키기 위해 개별 프로젝트를 서로 "격리"하는 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 기능을 제공합니다. 이 기능은 프로젝트 간에 빌드 스크립트와 플러그인을 분리하여 안전하게 병렬로 실행할 수 있도록 합니다.

이 기능을 활성화하려면 Gradle의 지침에 따라 [시스템 속성을 설정](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)하세요.

Isolated Projects 기능에 대한 자세한 내용은 [Gradle 문서](https://docs.gradle.org/current/userguide/isolated_projects.html)를 참조하세요.