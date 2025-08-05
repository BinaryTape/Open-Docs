[//]: # (title: iOS 종속성 추가)

Apple SDK 종속성(예: Foundation 또는 Core Bluetooth)은 Kotlin 멀티플랫폼 프로젝트에서 사전 빌드된 라이브러리 세트로 제공됩니다. 별도의 추가 구성이 필요하지 않습니다.

iOS 소스 세트에서 iOS 생태계의 다른 라이브러리 및 프레임워크를 재사용할 수도 있습니다. Kotlin은 Objective-C 종속성 및 Swift 종속성과의 상호 운용성을 지원하며, 이는 API가 `@objc` 속성으로 Objective-C에 노출되는 경우에 해당합니다. 순수 Swift 종속성은 아직 지원되지 않습니다.

Kotlin 멀티플랫폼 프로젝트에서 iOS 종속성을 처리하려면 [cinterop 도구](#with-cinterop)를 사용하거나 [CocoaPods 종속성 관리자](#with-cocoapods)를 사용하여 관리할 수 있습니다(순수 Swift Pod는 지원되지 않습니다).

### cinterop 사용

cinterop 도구를 사용하여 Objective-C 또는 Swift 선언을 위한 Kotlin 바인딩을 생성할 수 있습니다. 이를 통해 Kotlin 코드에서 해당 선언을 호출할 수 있습니다.

[라이브러리](#add-a-library) 및 [프레임워크](#add-a-framework)에 따라 단계가 약간 다르지만, 일반적인 워크플로는 다음과 같습니다.

1.  종속성을 다운로드합니다.
2.  바이너리를 얻기 위해 빌드합니다.
3.  cinterop에 이 종속성을 설명하는 특별한 `.def` [정의 파일](https://kotlinlang.org/docs/native-definition-file.html)을 생성합니다.
4.  빌드 중에 바인딩을 생성하도록 빌드 스크립트를 조정합니다.

#### 라이브러리 추가

1.  라이브러리 소스 코드를 다운로드하고 프로젝트에서 참조할 수 있는 곳에 배치합니다.
2.  라이브러리를 빌드하고(라이브러리 작성자는 일반적으로 빌드 방법에 대한 가이드를 제공합니다) 바이너리 경로를 가져옵니다.
3.  프로젝트에서 예를 들어 `DateTools.def`와 같은 `.def` 파일을 생성합니다.
4.  이 파일에 첫 번째 문자열 `language = Objective-C`를 추가합니다. 순수 C 종속성을 사용하려면 language 속성을 생략합니다.
5.  두 개의 필수 속성에 값을 제공합니다.

    *   `headers`: cinterop이 처리할 헤더를 설명합니다.
    *   `package`: 이 선언들이 포함될 패키지의 이름을 설정합니다.

    예를 들어:

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6.  이 라이브러리와의 상호 운용성에 대한 정보를 빌드 스크립트에 추가합니다.

    *   `.def` 파일 경로를 전달합니다. `.def` 파일이 cinterop과 이름이 같고 `src/nativeInterop/cinterop/` 디렉터리에 있는 경우 이 경로는 생략할 수 있습니다.
    *   `includeDirs` 옵션을 사용하여 cinterop에게 헤더 파일을 찾아야 할 위치를 알려줍니다.
    *   라이브러리 바이너리 링크를 구성합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 파일 경로
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // 헤더 검색 디렉터리(-I<path> 컴파일러 옵션의 아날로그)
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 라이브러리에 링크하는 데 필요한 링커 옵션.
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 파일 경로
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // 헤더 검색 디렉터리(-I<path> 컴파일러 옵션의 아날로그)
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 라이브러리에 링크하는 데 필요한 링커 옵션.
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </tab>
    </tabs>

7.  프로젝트를 빌드합니다.

이제 Kotlin 코드에서 이 종속성을 사용할 수 있습니다. 그렇게 하려면 `.def` 파일의 `package` 속성에 설정한 패키지를 임포트합니다. 위 예시의 경우 다음과 같습니다.

```kotlin
import DateTools.*
```

> [cinterop 도구와 libcurl 라이브러리를 사용하는 샘플 프로젝트](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)를 참조하세요.
>
{style="tip"}

#### 프레임워크 추가

1.  프레임워크 소스 코드를 다운로드하고 프로젝트에서 참조할 수 있는 곳에 배치합니다.
2.  프레임워크를 빌드하고(프레임워크 작성자는 일반적으로 빌드 방법에 대한 가이드를 제공합니다) 바이너리 경로를 가져옵니다.
3.  프로젝트에서 예를 들어 `MyFramework.def`와 같은 `.def` 파일을 생성합니다.
4.  이 파일에 첫 번째 문자열 `language = Objective-C`를 추가합니다. 순수 C 종속성을 사용하려면 language 속성을 생략합니다.
5.  다음 두 가지 필수 속성에 값을 제공합니다.

    *   `modules` – cinterop이 처리해야 할 프레임워크의 이름입니다.
    *   `package` – 이 선언들이 포함될 패키지의 이름입니다.

    예를 들어:

    ```none
    modules = MyFramework
    package = MyFramework
    ```

6.  프레임워크와의 상호 운용성에 대한 정보를 빌드 스크립트에 추가합니다.

    *   `.def` 파일 경로를 전달합니다. `.def` 파일이 cinterop과 이름이 같고 `src/nativeInterop/cinterop/` 디렉터리에 있는 경우 이 경로는 생략할 수 있습니다.
    *   `-framework` 옵션을 사용하여 프레임워크 이름을 컴파일러 및 링커에 전달합니다. `-F` 옵션을 사용하여 프레임워크 소스 및 바이너리 경로를 컴파일러 및 링커에 전달합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 파일 경로
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 링커에 프레임워크 위치를 알려줍니다.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 파일 경로
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 링커에 프레임워크 위치를 알려줍니다.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </tab>
    </tabs>

7.  프로젝트를 빌드합니다.

이제 Kotlin 코드에서 이 종속성을 사용할 수 있습니다. 그렇게 하려면 `.def` 파일의 package 속성에 설정한 패키지를 임포트합니다. 위 예시의 경우 다음과 같습니다.

```kotlin
import MyFramework.*
```

[Swift/Objective-C 상호 운용성](https://kotlinlang.org/docs/native-objc-interop.html) 및 [Gradle에서 cinterop 구성](multiplatform-dsl-reference.md#cinterops)에 대해 더 알아보세요.

### CocoaPods 사용

1.  [초기 CocoaPods 통합 설정](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)을 수행합니다.
2.  프로젝트의 `build.gradle(.kts)`에 `pod()` 함수 호출을 포함하여 사용하려는 CocoaPods 저장소의 Pod 라이브러리에 대한 종속성을 추가합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        cocoapods {
            version = "2.0"
            //..
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        cocoapods {
            version = '2.0'
            //..
            pod('SDWebImage') {
                version = '5.20.0'
            }
        }
    }
    ```

    </tab>
    </tabs>

    Pod 라이브러리에 다음 종속성을 추가할 수 있습니다.

    *   [CocoaPods 저장소에서](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
    *   [로컬에 저장된 라이브러리에서](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
    *   [커스텀 Git 저장소에서](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
    *   [커스텀 Podspec 저장소에서](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
    *   [커스텀 cinterop 옵션 사용](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3.  IntelliJ IDEA에서 **빌드** | **모든 Gradle 프로젝트 다시 로드**를 실행하거나(또는 Android Studio에서 **파일** | **Gradle 파일과 프로젝트 동기화**를 실행) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트합니다. 위 예시의 경우 다음과 같습니다.

```kotlin
import cocoapods.SDWebImage.*
```

> *   [Kotlin 프로젝트에 설정된 다양한 Pod 종속성 샘플 프로젝트](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)를 참조하세요.
> *   [여러 타겟을 가진 Xcode 프로젝트가 Kotlin 라이브러리에 종속되는 샘플 프로젝트](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)를 확인하세요.
>
{style="tip"}

## 다음 단계는 무엇인가요?

멀티플랫폼 프로젝트에 종속성을 추가하는 방법에 대한 다른 리소스를 확인하고 다음에 대해 더 알아보세요.

*   [플랫폼 라이브러리 연결](https://kotlinlang.org/docs/native-platform-libs.html)
*   [멀티플랫폼 라이브러리 또는 다른 멀티플랫폼 프로젝트에 종속성 추가](multiplatform-add-dependencies.md)
*   [Android 종속성 추가](multiplatform-android-dependencies.md)