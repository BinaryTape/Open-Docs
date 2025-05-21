---
title: "C Interop 및 libcurl을 사용하여 앱 만들기 - 튜토리얼"
---
IntelliJ IDEA를 사용하여 명령줄 애플리케이션을 만드는 방법을 설명합니다. Kotlin/Native와 libcurl 라이브러리를 사용하여 지정된 플랫폼에서 기본적으로 실행할 수 있는 간단한 HTTP 클라이언트를 만드는 방법을 배우게 됩니다.

이 튜토리얼의 결과물은 macOS 및 Linux에서 실행하고 간단한 HTTP GET 요청을 수행할 수 있는 실행 가능한 명령줄 앱입니다.

명령줄을 사용하여 Kotlin 라이브러리를 직접 또는 스크립트 파일(.sh 또는 .bat 파일 등)을 사용하여 생성할 수 있습니다.
그러나 이 방법은 파일과 라이브러리가 수백 개에 달하는 대규모 프로젝트에는 적합하지 않습니다.
빌드 시스템을 사용하면 Kotlin/Native 컴파일러 바이너리 및 전이 종속성이 있는 라이브러리를 다운로드 및 캐싱하고 컴파일러 및 테스트를 실행하여 프로세스를 간소화할 수 있습니다.
Kotlin/Native는 [Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms)을 통해 [Gradle](https://gradle.gradle) 빌드 시스템을 사용할 수 있습니다.

## 시작하기 전에

1. 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 다운로드하여 설치합니다.
2. IntelliJ IDEA에서 **File** | **New** | **Project from Version Control**을 선택하고 다음 URL을 사용하여 [프로젝트 템플릿](https://github.com/Kotlin/kmp-native-wizard)을 복제합니다.

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```

3. 프로젝트 구조를 살펴봅니다.

   <img src="/img/native-project-structure.png" alt="Native application project structure" width="700" style={{verticalAlign: 'middle'}}/>

   템플릿에는 시작하는 데 필요한 파일과 폴더가 포함된 프로젝트가 포함되어 있습니다. Kotlin/Native로 작성된 애플리케이션은 코드에 플랫폼별 요구 사항이 없는 경우 여러 플랫폼을 대상으로 지정할 수 있다는 점을 이해하는 것이 중요합니다. 코드는 해당 `nativeTest`와 함께 `nativeMain` 디렉토리에 배치됩니다. 이 튜토리얼에서는 폴더 구조를 그대로 유지합니다.

4. 프로젝트 설정이 포함된 빌드 스크립트인 `build.gradle.kts` 파일을 엽니다. 빌드 파일에서 다음에 특히 주의하십시오.

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 `->` macosX64("native")
            hostOs == "Linux" && isArm64 `->` linuxArm64("native")
            hostOs == "Linux" && !isArm64 `->` linuxX64("native")
            isMingwX64 `->` mingwX64("native")
            else `->` throw GradleException("Host OS is not supported in Kotlin/Native.")
        }
    
        nativeTarget.apply {
            binaries {
                executable {
                    entryPoint = "main"
                }
            }
        }
    }
    
    ```

   * 대상은 macOS, Linux 및 Windows에 대해 `macosArm64`, `macosX64`, `linuxArm64`, `linuxX64` 및 `mingwX64`를 사용하여 정의됩니다. [지원되는 플랫폼](native-target-support)의 전체 목록을 참조하십시오.
   * 항목 자체는 바이너리가 생성되는 방식과 애플리케이션의 진입점을 나타내는 일련의 속성을 정의합니다. 이러한 값은 기본값으로 유지할 수 있습니다.
   * C 상호 운용성은 빌드의 추가 단계로 구성됩니다. 기본적으로 C의 모든 기호는 `interop` 패키지로 가져옵니다. `.kt` 파일에서 전체 패키지를 가져올 수 있습니다. [구성 방법](gradle-configure-project#targeting-multiple-platforms)에 대해 자세히 알아보세요.

## 정의 파일 만들기

기본 애플리케이션을 작성할 때 HTTP 요청, 디스크에서 읽고 쓰기 등 [Kotlin 표준 라이브러리](https://kotlinlang.org/api/latest/jvm/stdlib/)에 포함되지 않은 특정 기능에 액세스해야 하는 경우가 많습니다.

Kotlin/Native는 표준 C 라이브러리를 소비하는 데 도움이 되므로 필요한 거의 모든 기능에 대해 존재하는 전체 기능 생태계를 열어줍니다. Kotlin/Native는 이미 미리 빌드된 [플랫폼 라이브러리](native-platform-libs) 세트와 함께 제공되어 표준 라이브러리에 몇 가지 추가적인 일반 기능을 제공합니다.

상호 운용성을 위한 이상적인 시나리오는 동일한 서명과 규칙을 따르는 Kotlin 함수를 호출하는 것처럼 C 함수를 호출하는 것입니다. cinterop 도구가 편리하게 사용되는 시점입니다. C 라이브러리를 가져와서 해당 Kotlin 바인딩을 생성하므로 라이브러리를 Kotlin 코드인 것처럼 사용할 수 있습니다.

이러한 바인딩을 생성하려면 각 라이브러리에 정의 파일이 필요하며, 일반적으로 라이브러리와 동일한 이름을 사용합니다.
이는 라이브러리를 정확히 사용하는 방법을 설명하는 속성 파일입니다.

이 앱에서는 일부 HTTP 호출을 수행하려면 libcurl 라이브러리가 필요합니다. 정의 파일을 만들려면 다음을 수행합니다.

1. `src` 폴더를 선택하고 **File | New | Directory**를 사용하여 새 디렉토리를 만듭니다.
2. 새 디렉토리 이름을 **nativeInterop/cinterop**로 지정합니다. 이는 헤더 파일 위치에 대한 기본 규칙이지만 다른 위치를 사용하는 경우 `build.gradle.kts` 파일에서 재정의할 수 있습니다.
3. 이 새 하위 폴더를 선택하고 **File | New | File**을 사용하여 새 `libcurl.def` 파일을 만듭니다.
4. 다음 코드로 파일을 업데이트합니다.

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers`는 Kotlin 스텁을 생성할 헤더 파일 목록입니다. 이 항목에 여러 파일을 추가할 수 있으며 각 파일은 공백으로 구분됩니다. 이 경우 `curl.h`만 해당됩니다. 참조된 파일은 지정된 경로(이 경우 `/usr/include/curl`)에서 사용할 수 있어야 합니다.
   * `headerFilter`는 정확히 무엇이 포함되는지 보여줍니다. C에서 모든 헤더는 `#include` 지시문으로 하나의 파일이 다른 파일을 참조할 때도 포함됩니다. 때로는 필요하지 않으며 [glob 패턴 사용](https://en.wikipedia.org/wiki/Glob_(programming)) 이 매개 변수를 추가하여 조정할 수 있습니다.

     외부 종속성(예: 시스템 `stdint.h` 헤더)을 interop 라이브러리로 가져오고 싶지 않은 경우 `headerFilter`를 사용할 수 있습니다. 또한 라이브러리 크기 최적화와 시스템과 제공된 Kotlin/Native 컴파일 환경 간의 잠재적 충돌을 수정하는 데 유용할 수 있습니다.

   * 특정 플랫폼에 대한 동작을 수정해야 하는 경우 `compilerOpts.osx` 또는 `compilerOpts.linux`와 같은 형식을 사용하여 옵션에 플랫폼별 값을 제공할 수 있습니다. 이 경우 macOS(`.osx` 접미사) 및 Linux(`.linux` 접미사)입니다. 접미사가 없는 매개 변수(예: `linkerOpts=`)도 가능하며 모든 플랫폼에 적용됩니다.

   사용 가능한 옵션의 전체 목록은 [정의 파일](native-definition-file#properties)을 참조하십시오.

:::note
샘플이 작동하려면 시스템에 `curl` 라이브러리 바이너리가 있어야 합니다. macOS 및 Linux에서는 일반적으로 포함됩니다. Windows에서는 [소스](https://curl.se/download.html)에서 빌드할 수 있습니다(Microsoft Visual Studio 또는 Windows SDK 명령줄 도구가 필요함). 자세한 내용은 [관련 블로그 게시물](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)을 참조하십시오.
또는 [MinGW/MSYS2](https://www.msys2.org/) `curl` 바이너리를 고려할 수도 있습니다.

:::

## 빌드 프로세스에 상호 운용성 추가

헤더 파일을 사용하려면 빌드 프로세스의 일부로 생성되었는지 확인하십시오. 이를 위해 다음 항목을 `build.gradle.kts` 파일에 추가합니다.

```kotlin
nativeTarget.apply {
    compilations.getByName("main") {
        cinterops {
            val libcurl by creating
        }
    }
    binaries {
        executable {
            entryPoint = "main"
        }
    }
}
```

먼저 `cinterops`가 추가된 다음 정의 파일에 대한 항목이 추가됩니다. 기본적으로 파일 이름이 사용됩니다. 추가 매개 변수로 이를 재정의할 수 있습니다.

```kotlin
cinterops {
    val libcurl by creating {
        definitionFile.set(project.file("src/nativeInterop/cinterop/libcurl.def"))
        packageName("com.jetbrains.handson.http")
        compilerOpts("-I/path")
        includeDirs.allHeaders("path")
    }
}
```

## 애플리케이션 코드 작성

이제 라이브러리와 해당 Kotlin 스텁이 있으므로 애플리케이션에서 사용할 수 있습니다.
이 튜토리얼에서는 [simple.c](https://curl.se/libcurl/c/simple.html) 예제를 Kotlin으로 변환합니다.

`src/nativeMain/kotlin/` 폴더에서 다음 코드로 `Main.kt` 파일을 업데이트합니다.

```kotlin
import kotlinx.cinterop.*
import libcurl.*

@OptIn(ExperimentalForeignApi::class)
fun main(args: Array<String>) {
    val curl = curl_easy_init()
    if (curl != null) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://example.com")
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L)
        val res = curl_easy_perform(curl)
        if (res != CURLE_OK) {
            println("curl_easy_perform() failed ${curl_easy_strerror(res)?.toKString()}")
        }
        curl_easy_cleanup(curl)
    }
}
```

보시다시피 Kotlin 버전에서는 명시적 변수 선언이 제거되었지만 다른 모든 것은 C 버전과 거의 같습니다. libcurl 라이브러리에서 예상되는 모든 호출은 Kotlin에 해당하는 항목에서 사용할 수 있습니다.

:::note
이것은 라인별 문자 그대로의 번역입니다. 보다 Kotlin 관용적인 방식으로 작성할 수도 있습니다.

:::

## 애플리케이션 컴파일 및 실행

1. 애플리케이션을 컴파일합니다. 이렇게 하려면 작업 목록에서 `runDebugExecutableNative` Gradle 작업을 실행하거나 터미널에서 다음 명령을 사용합니다.
 
   ```bash
   ./gradlew runDebugExecutableNative
   ```

   이 경우 cinterop 도구에서 생성된 부분은 빌드에 암시적으로 포함됩니다.

2. 컴파일 중에 오류가 없으면 `main()` 함수 옆의 여백에 있는 녹색 **실행** 아이콘을 클릭하거나 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 바로 가기를 사용합니다.

   IntelliJ IDEA가 **실행** 탭을 열고 [example.com](https://example.com/)의 내용인 출력을 표시합니다.

   <img src="/img/native-output.png" alt="Application output with HTML-code" width="700" style={{verticalAlign: 'middle'}}/>

`curl_easy_perform` 호출이 결과를 표준 출력에 출력하므로 실제 출력을 볼 수 있습니다. `curl_easy_setopt`을 사용하여 숨길 수 있습니다.

[GitHub 저장소](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)에서 전체 프로젝트 코드를 얻을 수 있습니다.

:::

## 다음 단계

[C와의 Kotlin 상호 운용성](native-c-interop)에 대해 자세히 알아보세요.