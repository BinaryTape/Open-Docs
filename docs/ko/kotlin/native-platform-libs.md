---
title: "플랫폼 라이브러리"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

운영 체제의 네이티브 서비스에 대한 액세스를 제공하기 위해 Kotlin/Native 배포에는 각 대상에 특정한 미리 빌드된 라이브러리 세트가 포함되어 있습니다. 이를 _플랫폼 라이브러리(platform libraries)_라고 합니다.

플랫폼 라이브러리의 패키지는 기본적으로 사용할 수 있습니다. 이를 사용하기 위해 추가 링크 옵션을 지정할 필요가 없습니다. Kotlin/Native 컴파일러는 액세스되는 플랫폼 라이브러리를 자동으로 감지하고 필요한 라이브러리를 링크합니다.

그러나 컴파일러 배포의 플랫폼 라이브러리는 단순히 네이티브 라이브러리에 대한 래퍼 및 바인딩일 뿐입니다. 즉, 로컬 머신에 네이티브 라이브러리(`.so`, `.a`, `.dylib`, `.dll` 등) 자체를 설치해야 합니다.

## POSIX 바인딩

Kotlin은 Android 및 iOS를 포함한 모든 UNIX 및 Windows 기반 대상에 대한 POSIX 플랫폼 라이브러리를 제공합니다. 이러한 플랫폼 라이브러리에는 [POSIX 표준](https://en.wikipedia.org/wiki/POSIX)을 따르는 플랫폼 구현에 대한 바인딩이 포함되어 있습니다.

라이브러리를 사용하려면 프로젝트로 가져옵니다.

```kotlin
import platform.posix.*
```

:::note
`platform.posix`의 내용은 POSIX 구현의 차이로 인해 플랫폼마다 다릅니다.

:::

여기에서 지원되는 각 플랫폼에 대한 `posix.def` 파일의 내용을 탐색할 수 있습니다.

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 플랫폼 라이브러리는 [WebAssembly](wasm-overview) 대상에 사용할 수 없습니다.

## 인기 있는 네이티브 라이브러리

Kotlin/Native는 OpenGL, zlib, Foundation과 같이 다양한 플랫폼에서 일반적으로 사용되는 다양한 인기 네이티브 라이브러리에 대한 바인딩을 제공합니다.

Apple 플랫폼에서 `objc` 라이브러리는 [Objective-C와 상호 운용성](native-objc-interop) API를 활성화하기 위해 포함되어 있습니다.

설정에 따라 컴파일러 배포에서 Kotlin/Native 대상에 사용할 수 있는 네이티브 라이브러리를 탐색할 수 있습니다.

* [독립 실행형 Kotlin/Native 컴파일러를 설치한 경우](native-get-started#download-and-install-the-compiler):

  1. 컴파일러 배포와 함께 압축 해제된 아카이브(예: `kotlin-native-prebuilt-macos-aarch64-2.1.0`)로 이동합니다.
  2. `klib/platform` 디렉토리로 이동합니다.
  3. 해당 대상이 있는 폴더를 선택합니다.

* IDE(IntelliJ IDEA 및 Android Studio와 함께 번들로 제공)에서 Kotlin 플러그인을 사용하는 경우:

  1. 명령줄 도구에서 다음을 실행하여 `.konan` 폴더로 이동합니다.

     <Tabs>
     <TabItem value="macOS and Linux" label="macOS and Linux">

     ```none
     ~/.konan/
     ```

     </TabItem>
     <TabItem value="Windows" label="Windows">

     ```none
     %\USERPROFILE%\.konan
     ```

     </TabItem>
     </Tabs>

  2. Kotlin/Native 컴파일러 배포(예: `kotlin-native-prebuilt-macos-aarch64-2.1.0`)를 엽니다.
  3. `klib/platform` 디렉토리로 이동합니다.
  4. 해당 대상이 있는 폴더를 선택합니다.

:::tip
지원되는 각 플랫폼 라이브러리에 대한 정의 파일을 탐색하려면 컴파일러 배포 폴더에서
`konan/platformDef` 디렉토리로 이동하여 필요한 대상을 선택합니다.

:::

## 다음 단계

[Swift/Objective-C와의 상호 운용성에 대해 자세히 알아보세요](native-objc-interop)