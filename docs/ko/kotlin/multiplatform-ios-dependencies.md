---
title: "iOS 종속성 추가"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Apple SDK 종속성(예: Foundation 또는 Core Bluetooth)은 Kotlin Multiplatform 프로젝트에서 미리 빌드된 라이브러리 세트로 사용할 수 있습니다. 추가 구성은 필요하지 않습니다.

iOS 소스 세트에서 iOS 에코시스템의 다른 라이브러리 및 프레임워크를 재사용할 수도 있습니다. Kotlin은 `@objc` 속성으로 해당 API가 Objective-C로 내보내지는 경우 Objective-C 종속성 및 Swift 종속성과의 상호 운용성을 지원합니다. 순수 Swift 종속성은 아직 지원되지 않습니다.

Kotlin Multiplatform 프로젝트에서 iOS 종속성을 처리하기 위해 [cinterop 도구](#with-cinterop)를 사용하여 관리하거나 [CocoaPods 종속성 관리자](#with-cocoapods)를 사용할 수 있습니다(순수 Swift pod는 지원되지 않음).

### cinterop 사용

cinterop 도구를 사용하여 Objective-C 또는 Swift 선언에 대한 Kotlin 바인딩을 생성할 수 있습니다. 이렇게 하면 Kotlin 코드에서 이를 호출할 수 있습니다.

단계는 [라이브러리](#add-a-library)와 [프레임워크](#add-a-framework)에 따라 약간 다르지만 일반적인 워크플로는 다음과 같습니다.

1. 종속성을 다운로드합니다.
2. 종속성을 빌드하여 해당 바이너리를 가져옵니다.
3. cinterop에 이 종속성을 설명하는 특수한 `.def` [정의 파일](native-definition-file)을 만듭니다.
4. 빌드 중에 바인딩을 생성하도록 빌드 스크립트를 조정합니다.

#### 라이브러리 추가

1. 라이브러리 소스 코드를 다운로드하여 프로젝트에서 참조할 수 있는 위치에 놓습니다.
2. 라이브러리를 빌드하고(라이브러리 작성자는 일반적으로 이 작업을 수행하는 방법에 대한 가이드를 제공함) 바이너리 경로를 가져옵니다.
3. 프로젝트에서 `.def` 파일(예: `DateTools.def`)을 만듭니다.
4. 이 파일에 첫 번째 문자열 `language = Objective-C`를 추가합니다. 순수 C 종속성을 사용하려면 language 속성을 생략합니다.
5. 두 개의 필수 속성에 대한 값을 제공합니다.

    * `headers`는 cinterop에서 처리할 헤더를 설명합니다.
    * `package`는 이러한 선언을 넣을 패키지 이름을 설정합니다.

   예시:

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. 이 라이브러리와의 상호 운용성에 대한 정보를 빌드 스크립트에 추가합니다.

    * `.def` 파일의 경로를 전달합니다. `.def` 파일의 이름이 cinterop와 같고 `src/nativeInterop/cinterop/` 디렉터리에 있는 경우 이 경로는 생략할 수 있습니다.
    * `includeDirs` 옵션을 사용하여 cinterop에 헤더 파일을 찾을 위치를 알려줍니다.
    * 라이브러리 바이너리에 대한 링크를 구성합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to the .def file
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // Directories for header search (an analogue of the -I<path> compiler option)
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to the .def file
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // Directories for header search (an analogue of the -I<path> compiler option)
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 프로젝트를 빌드합니다.

이제 Kotlin 코드에서 이 종속성을 사용할 수 있습니다. 이렇게 하려면 `.def` 파일의 `package` 속성에서 설정한 패키지를 가져옵니다. 위의 예에서는 다음과 같습니다.

```kotlin
import DateTools.*
```

#### 프레임워크 추가

1. 프레임워크 소스 코드를 다운로드하여 프로젝트에서 참조할 수 있는 위치에 놓습니다.
2. 프레임워크를 빌드하고(프레임워크 작성자는 일반적으로 이 작업을 수행하는 방법에 대한 가이드를 제공함) 바이너리 경로를 가져옵니다.
3. 프로젝트에서 `.def` 파일(예: `MyFramework.def`)을 만듭니다.
4. 이 파일에 첫 번째 문자열 `language = Objective-C`를 추가합니다. 순수 C 종속성을 사용하려면 language 속성을 생략합니다.
5. 다음 두 개의 필수 속성에 대한 값을 제공합니다.

    * `modules` – cinterop에서 처리해야 하는 프레임워크의 이름입니다.
    * `package` – 이러한 선언을 넣을 패키지의 이름입니다.

    예시:
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. 프레임워크와의 상호 운용성에 대한 정보를 빌드 스크립트에 추가합니다.

    * .def 파일의 경로를 전달합니다. 이 경로는 .def 파일의 이름이 cinterop와 같고 `src/nativeInterop/cinterop/` 디렉터리에 있는 경우 생략할 수 있습니다.
    * `-framework` 옵션을 사용하여 프레임워크 이름을 컴파일러 및 링커에 전달합니다. `-F` 옵션을 사용하여 프레임워크 소스 및 바이너리 경로를 컴파일러 및 링커에 전달합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to the .def file
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to the .def file
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 프로젝트를 빌드합니다.

이제 Kotlin 코드에서 이 종속성을 사용할 수 있습니다. 이를 위해 package 속성에서 설정한 패키지를 가져옵니다. 위의 예에서는 다음과 같습니다.

```kotlin
import MyFramework.*
```

[Objective-C 및 Swift interop](native-objc-interop) 및 [Gradle에서 cinterop 구성](multiplatform-dsl-reference#cinterops)에 대해 자세히 알아보세요.

### CocoaPods 사용

1. [초기 CocoaPods 통합 설정](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)을 수행합니다.
2. 프로젝트의 `build.gradle(.kts)`에 `pod()` 함수 호출을 포함하여 사용하려는 CocoaPods 리포지토리에서 Pod 라이브러리에 대한 종속성을 추가합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

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

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

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

    </TabItem>
    </Tabs>

   Pod 라이브러리에 대해 다음과 같은 종속성을 추가할 수 있습니다.

   * [CocoaPods 리포지토리에서](native-cocoapods-libraries#from-the-cocoapods-repository)
   * [로컬에 저장된 라이브러리에서](native-cocoapods-libraries#on-a-locally-stored-library)
   * [사용자 지정 Git 리포지토리에서](native-cocoapods-libraries#from-a-custom-git-repository)
   * [사용자 지정 Podspec 리포지토리에서](native-cocoapods-libraries#from-a-custom-podspec-repository)
   * [사용자 지정 cinterop 옵션으로](native-cocoapods-libraries#with-custom-cinterop-options)

3. IntelliJ IDEA에서 **Reload All Gradle Projects**(또는 Android Studio에서 **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 가져옵니다. 위의 예에서는 다음과 같습니다.

```kotlin
import cocoapods.SDWebImage.*
```

## 다음 단계

멀티플랫폼 프로젝트에서 종속성 추가에 대한 다른 리소스를 확인하고 다음에 대해 자세히 알아보세요.

* [플랫폼 라이브러리 연결](native-platform-libs)
* [멀티플랫폼 라이브러리 또는 다른 멀티플랫폼 프로젝트에 종속성 추가](multiplatform-add-dependencies)
* [Android 종속성 추가](multiplatform-android-dependencies)