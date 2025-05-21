---
title: "컴파일 구성"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 멀티플랫폼 프로젝트는 아티팩트 생성을 위해 컴파일레이션(compilation)을 사용합니다. 각 타겟은 프로덕션 및 테스트 목적과 같이 하나 이상의 컴파일레이션을 가질 수 있습니다.

각 타겟에 대한 기본 컴파일레이션에는 다음이 포함됩니다.

* JVM, JS 및 Native 타겟을 위한 `main` 및 `test` 컴파일레이션.
* Android 타겟의 경우 [Android 빌드 배리언트](https://developer.android.com/studio/build/build-variants)별 [컴파일레이션](#compilation-for-android).

<img src="/img/compilations.svg" alt="Compilations" style={{verticalAlign: 'middle'}}/>

프로덕션 코드 및 단위 테스트 이외의 다른 항목(예: 통합 또는 성능 테스트)을 컴파일해야 하는 경우 [사용자 정의 컴파일레이션을 생성](#create-a-custom-compilation)할 수 있습니다.

다음 위치에서 아티팩트 생성 방법을 구성할 수 있습니다.

* 프로젝트의 [모든 컴파일레이션](#configure-all-compilations)을 한 번에 구성합니다.
* 하나의 타겟에 여러 컴파일레이션이 있을 수 있으므로 [하나의 타겟에 대한 컴파일레이션](#configure-compilations-for-one-target)을 구성합니다.
* [특정 컴파일레이션](#configure-one-compilation)을 구성합니다.

전체 또는 특정 타겟에 사용할 수 있는 [컴파일레이션 파라미터 목록](multiplatform-dsl-reference#compilation-parameters) 및 [컴파일러 옵션](gradle-compiler-options)을 참조하세요.

## 모든 컴파일레이션 구성

다음 예제는 모든 타겟에서 공통적인 컴파일러 옵션을 구성합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 하나의 타겟에 대한 컴파일레이션 구성

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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

## 하나의 컴파일레이션 구성

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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

## 사용자 정의 컴파일레이션 생성

프로덕션 코드 및 단위 테스트 이외의 다른 항목(예: 통합 또는 성능 테스트)을 컴파일해야 하는 경우 사용자 정의 컴파일레이션을 생성합니다.
 
예를 들어 `jvm()` 타겟의 통합 테스트를 위한 사용자 정의 컴파일레이션을 생성하려면 `compilations` 컬렉션에 새 항목을 추가합니다.
 
:::note
사용자 정의 컴파일레이션의 경우 모든 종속성을 수동으로 설정해야 합니다. 사용자 정의 컴파일레이션의 기본 소스 세트는 `commonMain` 및 `commonTest` 소스 세트에 의존하지 않습니다.

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm() {
        compilations {
            val main by getting
            
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        // Compile against the main compilation's compile classpath and outputs:
                        implementation(main.compileDependencyFiles + main.output.classesDirs)
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // Create a test task to run the tests produced by this compilation:
                tasks.register<Test>("integrationTest") {
                    // Run the tests with the classpath containing the compile dependencies (including 'main'),
                    // runtime dependencies, and the outputs of this compilation:
                    classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                    
                    // Run only the tests from this compilation's outputs:
                    testClassesDirs = output.classesDirs
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    def main = compilations.main
                    // Compile against the main compilation's compile classpath and outputs:
                    implementation(main.compileDependencyFiles + main.output.classesDirs)
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }
           
            // Create a test task to run the tests produced by this compilation:
            tasks.register('jvmIntegrationTest', Test) {
                // Run the tests with the classpath containing the compile dependencies (including 'main'),
                // runtime dependencies, and the outputs of this compilation:
                classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                
                // Run only the tests from this compilation's outputs:
                testClassesDirs = output.classesDirs
            }
        }
    }
}
```

</TabItem>
</Tabs>

최종 아티팩트에서 여러 JVM 버전에 대한 컴파일레이션을 결합하거나 Gradle에서 이미 소스 세트를 설정했고 멀티플랫폼 프로젝트로 마이그레이션하려는 경우와 같이 다른 경우에도 사용자 정의 컴파일레이션을 생성해야 합니다.

## JVM 컴파일레이션에서 Java 소스 사용

[프로젝트 마법사](https://kmp.jetbrains.com/)를 사용하여 프로젝트를 생성할 때 Java 소스가 기본적으로 생성되어 JVM 타겟의 컴파일레이션에 포함됩니다.

Java 소스 파일은 Kotlin 소스 루트의 하위 디렉토리에 배치됩니다. 예를 들어 경로는 다음과 같습니다.

<img src="/img/java-source-paths.png" alt="Java source files" width="200" style={{verticalAlign: 'middle'}}/>

공통 소스 세트는 Java 소스를 포함할 수 없습니다.

현재 제한 사항으로 인해 Kotlin 플러그인은 Java 플러그인에서 구성한 일부 작업을 대체합니다.

* `jar` 대신 타겟의 JAR 작업(예: `jvmJar`).
* `test` 대신 타겟의 테스트 작업(예: `jvmTest`).
* 리소스는 `*ProcessResources` 작업 대신 컴파일레이션의 해당 작업에 의해 처리됩니다.

이 타겟의 퍼블리싱은 Kotlin 플러그인에서 처리하며 Java 플러그인에 특정한 단계가 필요하지 않습니다.

## 네이티브 언어와의 interop 구성

Kotlin은 특정 컴파일레이션에 대해 이를 구성하기 위해 [네이티브 언어와의 상호 운용성](native-c-interop) 및 DSL을 제공합니다.

| 네이티브 언어       | 지원되는 플랫폼                         | 주석                                                                  |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C                     | WebAssembly를 제외한 모든 플랫폼       |                                                                           |
| Objective-C           | Apple 플랫폼(macOS, iOS, watchOS, tvOS) |                                                                           |
| Objective-C를 통한 Swift | Apple 플랫폼(macOS, iOS, watchOS, tvOS) | Kotlin은 `@objc` 속성으로 표시된 Swift 선언만 사용할 수 있습니다. |

컴파일레이션은 여러 네이티브 라이브러리와 상호 작용할 수 있습니다. [정의 파일](native-definition-file) 또는 빌드 파일의 [`cinterops` 블록](multiplatform-dsl-reference#cinterops)에서 사용 가능한 속성을 사용하여 상호 운용성을 구성합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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
                    
                    // Directories for header search (an eqivalent of the -I<path> compiler option).
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

## Android용 컴파일레이션
 
기본적으로 Android 타겟에 대해 생성된 컴파일레이션은 [Android 빌드 배리언트](https://developer.android.com/studio/build/build-variants)에 연결됩니다. 각 빌드 배리언트에 대해 동일한 이름으로 Kotlin 컴파일레이션이 생성됩니다.

그런 다음 각 배리언트에 대해 컴파일된 각 [Android 소스 세트](https://developer.android.com/studio/build/build-variants#sourcesets)에 대해 Android 소스 세트 `debug`에 대한 Kotlin 소스 세트 `androidDebug` 및 `androidTarget`이라는 Kotlin 타겟과 같이 타겟 이름이 앞에 붙은 해당 소스 세트 이름으로 Kotlin 소스 세트가 생성됩니다. 이러한 Kotlin 소스 세트는 배리언트의 컴파일레이션에 따라 추가됩니다.

기본 소스 세트 `commonMain`은 각 프로덕션(애플리케이션 또는 라이브러리) 배리언트의 컴파일레이션에 추가됩니다. `commonTest` 소스 세트는 단위 테스트 및 계측된 테스트 배리언트의 컴파일레이션에 유사하게 추가됩니다.

[`kapt`](kapt)를 사용한 어노테이션 처리가 지원되지만 현재 제한 사항으로 인해 Android 타겟은 `kapt` 종속성이 구성되기 전에 생성되어야 하며, 이는 Kotlin 소스 세트 종속성 내에서가 아니라 최상위 `dependencies {}` 블록에서 수행되어야 합니다.

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 소스 세트 계층 구조의 컴파일레이션

Kotlin은 `dependsOn` 관계를 사용하여 [소스 세트 계층 구조](multiplatform-share-on-platforms#share-code-on-similar-platforms)를 빌드할 수 있습니다.

<img src="/img/jvm-js-main.svg" alt="Source set hierarchy" style={{verticalAlign: 'middle'}}/>

소스 세트 `jvmMain`이 소스 세트 `commonMain`에 의존하는 경우:

* 특정 타겟에 대해 `jvmMain`이 컴파일될 때마다 `commonMain`도 해당 컴파일에 참여하고 JVM 클래스 파일과 같은 동일한 타겟 바이너리 형식으로 컴파일됩니다.
* `jvmMain`의 소스는 내부 선언을 포함하여 `commonMain`의 선언을 '보고', `implementation` 종속성으로 지정된 종속성까지 포함하여 `commonMain`의 [종속성](multiplatform-add-dependencies)도 봅니다.
* `jvmMain`은 `commonMain`의 [예상 선언](multiplatform-expect-actual)에 대한 플랫폼별 구현을 포함할 수 있습니다.
* `commonMain`의 리소스는 항상 `jvmMain`의 리소스와 함께 처리되고 복사됩니다.
* `jvmMain`과 `commonMain`의 [언어 설정](multiplatform-dsl-reference#language-settings)은 일관성이 있어야 합니다.

언어 설정은 다음과 같은 방식으로 일관성이 있는지 확인됩니다.
* `jvmMain`은 `commonMain`보다 크거나 같은 `languageVersion`을 설정해야 합니다.
* `jvmMain`은 `commonMain`이 활성화하는 모든 불안정한 언어 기능을 활성화해야 합니다(버그 수정 기능에는 이러한 요구 사항이 없습니다).
* `jvmMain`은 `commonMain`이 사용하는 모든 실험적 어노테이션을 사용해야 합니다.
* `apiVersion`, 버그 수정 언어 기능 및 `progressiveMode`는 임의로 설정할 수 있습니다.

## Gradle에서 Isolated Projects 기능 구성

:::caution
이 기능은 [Experimental](components-stability#stability-levels-explained)이며 현재 Gradle에서 프리 알파 상태입니다. Gradle 버전 8.10 이상에서만 평가 목적으로 사용하십시오. 이 기능은 언제든지 삭제되거나 변경될 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에서 이에 대한 피드백을 보내주시면 감사하겠습니다. 옵트인이 필요합니다(자세한 내용은 아래 참조).

:::

Gradle은 개별 프로젝트를 서로 "격리"하여 빌드 성능을 향상시키는 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 기능을 제공합니다. 이 기능은 프로젝트 간의 빌드 스크립트와 플러그인을 분리하여 안전하게 병렬로 실행할 수 있도록 합니다.

이 기능을 활성화하려면 Gradle 지침에 따라 [시스템 속성을 설정](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)하십시오.

Isolated Projects 기능에 대한 자세한 내용은 [Gradle 문서](https://docs.gradle.org/current/userguide/isolated_projects.html)를 참조하십시오.