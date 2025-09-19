[//]: # (title: C 상호 운용 및 libcurl을 사용하여 앱 생성하기 – 튜토리얼)

> C 라이브러리 임포트는 [베타](native-c-interop-stability.md) 단계입니다. C 라이브러리에서 cinterop 도구로 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="note"}

이 튜토리얼은 IntelliJ IDEA를 사용하여 커맨드라인 애플리케이션을 생성하는 방법을 보여줍니다. Kotlin/Native와 libcurl 라이브러리를 사용하여 지정된 플랫폼에서 네이티브로 실행할 수 있는 간단한 HTTP 클라이언트를 만드는 방법을 배울 것입니다.

결과물은 macOS 및 Linux에서 실행하여 간단한 HTTP GET 요청을 할 수 있는 실행 가능한 커맨드라인 앱입니다.

커맨드라인을 사용하여 Kotlin 라이브러리를 직접 생성하거나 스크립트 파일(예: `.sh` 또는 `.bat` 파일)로 생성할 수 있습니다. 하지만 이 접근 방식은 수백 개의 파일과 라이브러리가 있는 대규모 프로젝트에는 적합하지 않습니다. 빌드 시스템을 사용하면 Kotlin/Native 컴파일러 바이너리와 전이적 의존성을 가진 라이브러리를 다운로드하고 캐싱하며, 컴파일러와 테스트를 실행함으로써 프로세스가 단순해집니다. Kotlin/Native는 [Kotlin 멀티플랫폼 플러그인](gradle-configure-project.md#targeting-multiple-platforms)을 통해 [Gradle](https://gradle.org) 빌드 시스템을 사용할 수 있습니다.

## 시작하기 전에

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/) 최신 버전을 다운로드하고 설치합니다.
2.  IntelliJ IDEA에서 **File** | **New** | **Project from Version Control**을 선택하고 다음 URL을 사용하여 [프로젝트 템플릿](https://github.com/Kotlin/kmp-native-wizard)을 클론합니다.

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```

3.  프로젝트 구조를 살펴봅니다.

    ![Native application project structure](native-project-structure.png){width=700}

    템플릿에는 시작하는 데 필요한 파일과 폴더가 포함된 프로젝트가 있습니다. Kotlin/Native로 작성된 애플리케이션은 코드에 플랫폼별 요구 사항이 없으면 다양한 플랫폼을 대상으로 할 수 있다는 점을 이해하는 것이 중요합니다. 코드는 `nativeMain` 디렉토리에 해당 `nativeTest`와 함께 배치됩니다. 이 튜토리얼에서는 폴더 구조를 그대로 유지합니다.

4.  프로젝트 설정이 포함된 빌드 스크립트인 `build.gradle.kts` 파일을 엽니다. 빌드 파일에서 다음 사항에 특히 주의하십시오.

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 -> macosX64("native")
            hostOs == "Linux" && isArm64 -> linuxArm64("native")
            hostOs == "Linux" && !isArm64 -> linuxX64("native")
            isMingwX64 -> mingwX64("native")
            else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
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

   *   대상은 macOS, Linux 및 Windows용 `macosArm64`, `macosX64`, `linuxArm64`, `linuxX64`, `mingwX64`를 사용하여 정의됩니다. [지원되는 플랫폼](native-target-support.md)의 전체 목록을 참조하십시오.
   *   `binaries {}` 블록은 바이너리가 생성되는 방식과 애플리케이션의 진입점을 정의합니다. 이 값들은 기본값으로 유지할 수 있습니다.
   *   C 상호 운용은 빌드에서 추가 단계로 구성됩니다. 기본적으로 C의 모든 심볼은 `interop` 패키지로 임포트됩니다. `.kt` 파일에서 전체 패키지를 임포트할 수도 있습니다. [구성 방법](gradle-configure-project.md#targeting-multiple-platforms)에 대해 자세히 알아보세요.

## 정의 파일 생성

네이티브 애플리케이션을 작성할 때, HTTP 요청 생성, 디스크 읽기 및 쓰기 등 [Kotlin 표준 라이브러리](https://kotlinlang.org/api/latest/jvm/stdlib/)에 포함되지 않은 특정 기능에 접근해야 하는 경우가 많습니다.

Kotlin/Native는 표준 C 라이브러리를 소비하는 데 도움을 주어, 필요한 거의 모든 기능에 대한 전체 생태계를 열어줍니다. Kotlin/Native는 이미 사전 빌드된 [플랫폼 라이브러리](native-platform-libs.md) 세트와 함께 제공되며, 이는 표준 라이브러리에 일부 추가적인 공통 기능을 제공합니다.

상호 운용의 이상적인 시나리오는 C 함수를 Kotlin 함수를 호출하는 것처럼 동일한 시그니처와 컨벤션을 따라 호출하는 것입니다. 이때 cinterop 도구가 유용하게 사용됩니다. 이 도구는 C 라이브러리를 가져와 해당 Kotlin 바인딩을 생성하여 라이브러리가 Kotlin 코드처럼 사용될 수 있도록 합니다.

이러한 바인딩을 생성하려면 각 라이브러리에 정의 파일이 필요하며, 일반적으로 라이브러리와 동일한 이름을 가집니다. 이는 라이브러리가 정확히 어떻게 사용되어야 하는지를 설명하는 속성 파일입니다.

이 앱에서는 HTTP 호출을 위해 libcurl 라이브러리가 필요합니다. 정의 파일을 생성하려면:

1.  `src` 폴더를 선택하고 **File | New | Directory**로 새 디렉토리를 생성합니다.
2.  새 디렉토리 이름을 **nativeInterop/cinterop**으로 지정합니다. 이는 헤더 파일 위치에 대한 기본 규칙이지만, 다른 위치를 사용하는 경우 `build.gradle.kts` 파일에서 재정의할 수 있습니다.
3.  이 새 하위 폴더를 선택하고 **File | New | File**로 새 `libcurl.def` 파일을 생성합니다.
4.  파일에 다음 코드를 업데이트합니다.

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   *   `headers`는 Kotlin 스텁을 생성할 헤더 파일 목록입니다. 여기에 여러 파일을 공백으로 구분하여 추가할 수 있습니다. 이 경우 `curl.h`만 해당됩니다. 참조된 파일은 지정된 경로(이 경우 `/usr/include/curl`)에 있어야 합니다.
   *   `headerFilter`는 정확히 무엇이 포함되는지 보여줍니다. C에서는 하나의 파일이 `#include` 지시어를 사용하여 다른 파일을 참조할 때 모든 헤더도 포함됩니다. 때로는 필요하지 않은 경우도 있으며, [glob 패턴](https://en.wikipedia.org/wiki/Glob_(programming))을 사용하여 이 매개변수를 추가하여 조정할 수 있습니다.

    `headerFilter`는 (시스템 `stdint.h` 헤더와 같은) 외부 의존성을 상호 운용 라이브러리로 가져오고 싶지 않을 때 사용할 수 있습니다. 또한 라이브러리 크기 최적화 및 시스템과 제공된 Kotlin/Native 컴파일 환경 간의 잠재적 충돌을 해결하는 데 유용할 수 있습니다.

   *   특정 플랫폼에 대한 동작을 수정해야 하는 경우, `compilerOpts.osx` 또는 `compilerOpts.linux`와 같은 형식을 사용하여 옵션에 플랫폼별 값을 제공할 수 있습니다. 이 경우 macOS(`.osx` 접미사) 및 Linux(`.linux` 접미사)에 해당합니다. 접미사가 없는 매개변수(예: `linkerOpts=`)도 가능하며 모든 플랫폼에 적용됩니다.

    사용 가능한 옵션의 전체 목록은 [정의 파일](native-definition-file.md#properties)을 참조하십시오.

> 샘플이 작동하려면 시스템에 `curl` 라이브러리 바이너리가 있어야 합니다. macOS 및 Linux에서는 일반적으로 포함되어 있습니다. Windows에서는 [소스](https://curl.se/download.html)에서 빌드할 수 있습니다(Microsoft Visual Studio 또는 Windows SDK 커맨드라인 도구가 필요합니다). 자세한 내용은 [관련 블로그 게시물](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)을 참조하십시오. 또는 [MinGW/MSYS2](https://www.msys2.org/) `curl` 바이너리를 고려할 수도 있습니다.
>
{style="note"}

## 빌드 프로세스에 상호 운용성 추가

헤더 파일을 사용하려면 빌드 프로세스의 일부로 생성되도록 해야 합니다. 이를 위해 `build.gradle.kts` 파일에 다음 `compilations {}` 블록을 추가합니다.

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

먼저 `cinterops`가 추가되고, 그 다음 정의 파일에 대한 항목이 추가됩니다. 기본적으로 파일 이름이 사용됩니다. 추가 매개변수로 이를 재정의할 수 있습니다.

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

이제 라이브러리와 해당 Kotlin 스텁이 있으므로 애플리케이션에서 이를 사용할 수 있습니다. 이 튜토리얼에서는 [simple.c](https://curl.se/libcurl/c/simple.html) 예제를 Kotlin으로 변환합니다.

`src/nativeMain/kotlin/` 폴더에서 `Main.kt` 파일을 다음 코드로 업데이트합니다.

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

보시다시피, Kotlin 버전에서는 명시적인 변수 선언이 제거되었지만, 그 외의 모든 것은 C 버전과 거의 동일합니다. libcurl 라이브러리에서 예상할 수 있는 모든 호출은 Kotlin에서도 동일하게 사용할 수 있습니다.

> 이것은 한 줄씩 직역한 것입니다. 더 Kotlin스러운 방식으로 작성할 수도 있습니다.
>
{type="tip"}

## 애플리케이션 컴파일 및 실행

1.  애플리케이션을 컴파일합니다. 이를 위해 작업 목록에서 `runDebugExecutableNative` Gradle 작업을 실행하거나 터미널에서 다음 명령을 사용합니다.

    ```bash
    ./gradlew runDebugExecutableNative
    ```

    이 경우 cinterop 도구에 의해 생성된 부분이 빌드에 암묵적으로 포함됩니다.

2.  컴파일 중 오류가 없으면 `main()` 함수 옆의 여백에 있는 녹색 **Run** 아이콘을 클릭하거나 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 단축키를 사용합니다.

    IntelliJ IDEA가 **Run** 탭을 열고 [example.com](https://example.com/)의 내용을 출력으로 보여줍니다.

    ![Application output with HTML-code](native-output.png){width=700}

`curl_easy_perform` 호출이 결과를 표준 출력으로 인쇄하기 때문에 실제 출력을 볼 수 있습니다. `curl_easy_setopt`를 사용하여 이를 숨길 수 있습니다.

> 전체 프로젝트 코드는 [GitHub 저장소](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)에서 얻을 수 있습니다.
>
{style="note"}

## 다음 단계

[Kotlin의 C 상호 운용성](native-c-interop.md)에 대해 자세히 알아보세요.