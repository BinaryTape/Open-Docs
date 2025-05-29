[//]: # (title: Kotlin/Native)

Kotlin/Native는 Kotlin 코드를 가상 머신 없이 실행될 수 있는 네이티브 바이너리로 컴파일하는 기술입니다. Kotlin/Native는 Kotlin 컴파일러를 위한 [LLVM](https://llvm.org/) 기반 백엔드와 Kotlin 표준 라이브러리의 네이티브 구현을 포함합니다.

## Kotlin/Native를 사용하는 이유

Kotlin/Native는 주로 임베디드 장치나 iOS와 같이 _가상 머신_이 바람직하지 않거나 불가능한 플랫폼을 위해 컴파일을 허용하도록 설계되었습니다. 추가 런타임이나 가상 머신을 필요로 하지 않는 자체 포함된 프로그램을 생성해야 하는 상황에 이상적입니다.

C, C++, Swift, Objective-C 및 다른 언어로 작성된 기존 프로젝트에 컴파일된 Kotlin 코드를 쉽게 포함할 수 있습니다. 또한 기존 네이티브 코드, 정적 또는 동적 C 라이브러리, Swift/Objective-C 프레임워크, 그래픽 엔진 등 모든 것을 Kotlin/Native에서 직접 사용할 수 있습니다.

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="Kotlin/Native 시작하기" style="block"/></a>

## 대상 플랫폼

Kotlin/Native는 다음 플랫폼을 지원합니다:

*   Linux
*   Windows ([MinGW](https://www.mingw-w64.org/)를 통해)
*   [Android NDK](https://developer.android.com/ndk)
*   macOS, iOS, tvOS, watchOS용 Apple 대상

  > Apple 대상을 컴파일하려면 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)와 해당 명령줄 도구를 설치해야 합니다.
  >
  {style="note"}

[지원되는 대상의 전체 목록 보기](native-target-support.md).

## 상호 운용성

Kotlin/Native는 다양한 운영 체제를 위한 네이티브 프로그래밍 언어와의 양방향 상호 운용성을 지원합니다. 컴파일러는 다양한 플랫폼을 위한 실행 파일, 정적 또는 동적 C 라이브러리, 그리고 Swift/Objective-C 프레임워크를 생성할 수 있습니다.

### C와의 상호 운용성

Kotlin/Native는 [C와의 상호 운용성](native-c-interop.md)을 제공합니다. 기존 C 라이브러리를 Kotlin 코드에서 직접 사용할 수 있습니다.

자세한 내용은 다음 튜토리얼을 완료하세요:

*   [C/C++ 프로젝트용 C 헤더를 포함하는 동적 라이브러리 생성](native-dynamic-libraries.md)
*   [C 타입이 Kotlin으로 어떻게 매핑되는지 알아보기](mapping-primitive-data-types-from-c.md)
*   [C 상호 운용성과 libcurl을 사용하여 네이티브 HTTP 클라이언트 생성](native-app-with-c-and-libcurl.md)

### Swift/Objective-C와의 상호 운용성

Kotlin/Native는 [Objective-C를 통한 Swift와의 상호 운용성](native-objc-interop.md)을 제공합니다. macOS 및 iOS에서 Swift/Objective-C 애플리케이션에서 Kotlin 코드를 직접 사용할 수 있습니다.

자세한 내용은 [Apple 프레임워크로서의 Kotlin/Native](apple-framework.md) 튜토리얼을 완료하세요.

## 플랫폼 간 코드 공유

Kotlin/Native는 프로젝트 간에 Kotlin 코드를 공유하는 데 도움이 되는 미리 빌드된 일련의 [플랫폼 라이브러리](native-platform-libs.md)를 포함합니다. POSIX, gzip, OpenGL, Metal, Foundation 및 기타 여러 인기 라이브러리와 Apple 프레임워크는 미리 임포트되고 컴파일러 패키지에 Kotlin/Native 라이브러리로 포함되어 있습니다.

Kotlin/Native는 Android, iOS, JVM, 웹 및 네이티브를 포함한 여러 플랫폼에서 공통 코드를 공유하는 데 도움을 주는 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 기술의 일부입니다. 멀티플랫폼 라이브러리는 공통 Kotlin 코드를 위한 필요한 API를 제공하며, 프로젝트의 공유 부분을 Kotlin으로 한곳에서 모두 작성할 수 있도록 합니다.

## 메모리 관리자

Kotlin/Native는 JVM 및 Go와 유사한 자동 [메모리 관리자](native-memory-manager.md)를 사용합니다. 자체적인 트레이싱 가비지 컬렉터(tracing garbage collector)를 가지고 있으며, 이는 Swift/Objective-C의 ARC와도 통합되어 있습니다.

메모리 사용량은 사용자 지정 메모리 할당자에 의해 제어됩니다. 이는 메모리 사용량을 최적화하고 메모리 할당의 갑작스러운 급증을 방지하는 데 도움이 됩니다.