[//]: # (title: 플랫폼 라이브러리)

운영 체제의 네이티브 서비스에 대한 접근을 제공하기 위해 Kotlin/Native 배포판에는 각 타겟에 특화된 미리 빌드된 라이브러리 세트가 포함되어 있습니다. 이를 *플랫폼 라이브러리*라고 합니다.

플랫폼 라이브러리의 패키지는 기본적으로 사용할 수 있습니다. 이를 사용하기 위해 추가 링크 옵션을 지정할 필요가 없습니다. Kotlin/Native 컴파일러는 어떤 플랫폼 라이브러리가 접근되는지 자동으로 감지하여 필요한 라이브러리를 링크합니다.

그러나 컴파일러 배포판의 플랫폼 라이브러리는 단순히 네이티브 라이브러리에 대한 래퍼와 바인딩입니다. 즉, 로컬 머신에 네이티브 라이브러리 자체(`.so`, `.a`, `.dylib`, `.dll` 등)를 설치해야 합니다.

## POSIX 바인딩

Kotlin은 Android 및 iOS를 포함한 모든 UNIX 및 Windows 기반 타겟에 POSIX 플랫폼 라이브러리를 제공합니다. 이 플랫폼 라이브러리에는 [POSIX 표준](https://en.wikipedia.org/wiki/POSIX)을 따르는 플랫폼 구현에 대한 바인딩이 포함되어 있습니다.

이 라이브러리를 사용하려면 프로젝트로 임포트합니다:

```kotlin
import platform.posix.*
```

> `platform.posix` 내용은 POSIX 구현의 차이로 인해 플랫폼마다 다릅니다.
>
{style="note"}

각 지원되는 플랫폼에 대한 `posix.def` 파일의 내용을 다음에서 확인할 수 있습니다:

*   [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
*   [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
*   [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
*   [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
*   [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
*   [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
*   [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 플랫폼 라이브러리는 [WebAssembly](wasm-overview.md) 타겟에서는 사용할 수 없습니다.

## 인기 있는 네이티브 라이브러리

Kotlin/Native는 OpenGL, zlib, Foundation과 같이 다양한 플랫폼에서 일반적으로 사용되는 다양하고 인기 있는 네이티브 라이브러리에 대한 바인딩을 제공합니다.

Apple 플랫폼에서는 [Objective-C와의 상호 운용성](native-objc-interop.md) API를 가능하게 하기 위해 `objc` 라이브러리가 포함되어 있습니다.

설정에 따라 컴파일러 배포판에서 Kotlin/Native 타겟에 사용 가능한 네이티브 라이브러리를 탐색할 수 있습니다:

*   [독립 실행형 Kotlin/Native 컴파일러](native-get-started.md#download-and-install-the-compiler)를 설치한 경우:

    1.  예시로, `kotlin-native-prebuilt-macos-aarch64-2.1.0`과 같이 컴파일러 배포판이 포함된 압축 해제된 아카이브로 이동합니다.
    2.  `klib/platform` 디렉터리로 이동합니다.
    3.  해당 타겟이 있는 폴더를 선택합니다.

*   IDE에서 Kotlin 플러그인을 사용하는 경우 (IntelliJ IDEA 및 Android Studio에 번들로 제공됨):

    1.  명령줄 도구에서 다음을 실행하여 `.konan` 폴더로 이동합니다:

        <tabs>
        <tab title="macOS 및 Linux">

        ```none
        ~/.konan/
        ```

        </tab>
        <tab title="Windows">

        ```none
        %\USERPROFILE%\.konan
        ```

        </tab>
        </tabs>

    2.  예시로, `kotlin-native-prebuilt-macos-aarch64-2.1.0`과 같이 Kotlin/Native 컴파일러 배포판을 엽니다.
    3.  `klib/platform` 디렉터리로 이동합니다.
    4.  해당 타겟이 있는 폴더를 선택합니다.

> 지원되는 각 플랫폼 라이브러리의 정의 파일을 탐색하려면: 컴파일러 배포 폴더에서 `konan/platformDef` 디렉터리로 이동하여 필요한 타겟을 선택하세요.
>
{style="tip"}

## 다음 단계

[Swift/Objective-C와의 상호 운용성에 대해 자세히 알아보기](native-objc-interop.md)