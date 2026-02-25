[//]: # (title: Kotlin/Native)

Kotlin/Native는 가상 머신(virtual machine) 없이 실행할 수 있는 네이티브 바이너리(native binaries)로 Kotlin 코드를 컴파일하기 위한 기술입니다.
Kotlin/Native에는 Kotlin 컴파일러를 위한 [LLVM](https://llvm.org/) 기반 백엔드와 Kotlin 표준 라이브러리의 네이티브 구현이 포함되어 있습니다.

## 왜 Kotlin/Native인가요?

Kotlin/Native는 주로 임베디드 장치나 iOS와 같이 가상 머신을 사용하기 어렵거나 사용할 수 없는 플랫폼을 위해 설계되었습니다. 추가적인 런타임이나 가상 머신이 필요 없는 자체 포함된(self-contained) 프로그램을 제작해야 하는 상황에 이상적입니다.

C, C++, Swift, Objective-C 및 기타 언어로 작성된 기존 프로젝트에 컴파일된 Kotlin 코드를 쉽게 포함할 수 있습니다. 또한 기존 네이티브 코드, 정적 또는 동적 C 라이브러리, Swift/Objective-C 프레임워크(frameworks), 그래픽 엔진 등을 Kotlin/Native에서 직접 사용할 수도 있습니다.

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="Get started with Kotlin/Native" style="block"/></a>

## 대상 플랫폼

Kotlin/Native는 다음 플랫폼을 지원합니다:

* Linux
* Windows ([MinGW](https://www.mingw-w64.org/)를 통해 지원)
* [Android NDK](https://developer.android.com/ndk)
* macOS, iOS, tvOS 및 watchOS용 Apple 대상(targets)

  > Apple 대상을 컴파일하려면 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)와 해당 명령줄 도구(command-line tools)를 설치해야 합니다.
  >
  {style="note"}

[지원되는 대상 및 호스트의 전체 목록을 확인하세요](native-target-support.md).

## 상호운용성

Kotlin/Native는 다양한 운영 체제의 네이티브 프로그래밍 언어와 양방향 상호운용성(interoperability)을 지원합니다. 컴파일러는 다양한 플랫폼을 위한 실행 파일, 정적 또는 동적 C 라이브러리, Swift/Objective-C 프레임워크를 생성할 수 있습니다.

### C와의 상호운용성

Kotlin/Native는 [C와의 상호운용성](native-c-interop.md)을 제공합니다. Kotlin 코드에서 기존 C 라이브러리를 직접 사용할 수 있습니다.

자세히 알아보려면 다음 튜토리얼을 완료하세요:

* [C/C++ 프로젝트를 위한 C 헤더가 포함된 동적 라이브러리 생성](native-dynamic-libraries.md)
* [C 타입이 Kotlin으로 매핑되는 방식 알아보기](mapping-primitive-data-types-from-c.md)
* [C 상호운용성과 libcurl을 사용하여 네이티브 HTTP 클라이언트 만들기](native-app-with-c-and-libcurl.md)

### Swift/Objective-C와의 상호운용성

Kotlin/Native는 [Objective-C를 통한 Swift와의 상호운용성](native-objc-interop.md)을 제공합니다. macOS 및 iOS의 Swift/Objective-C 애플리케이션에서 Kotlin 코드를 직접 사용할 수 있습니다.

자세히 알아보려면 [Apple 프레임워크로서의 Kotlin/Native](apple-framework.md) 튜토리얼을 완료하세요.

## 플랫폼 간 코드 공유

Kotlin/Native에는 프로젝트 간에 Kotlin 코드를 공유하는 데 도움이 되는 미리 빌드된 [플랫폼 라이브러리](native-platform-libs.md) 세트가 포함되어 있습니다. POSIX, gzip, OpenGL, Metal, Foundation 및 기타 여러 인기 라이브러리와 Apple 프레임워크가 미리 임포트되어 컴파일러 패키지에 Kotlin/Native 라이브러리로 포함되어 있습니다.

Kotlin/Native는 Android, iOS, JVM, 웹 및 네이티브를 포함한 여러 플랫폼에서 공통 코드를 공유할 수 있도록 돕는 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 기술의 일부입니다. 멀티플랫폼 라이브러리는 공통 Kotlin 코드를 위한 필수 API를 제공하며, 프로젝트의 공유 부분을 한곳에서 Kotlin으로 작성할 수 있게 해줍니다.

## 메모리 관리자

Kotlin/Native는 JVM 및 Go와 유사한 자동 [메모리 관리자](native-memory-manager.md)를 사용합니다. 자체적인 추적 가비지 컬렉터(tracing garbage collector)를 갖추고 있으며, 이는 Swift/Objective-C의 ARC와도 통합됩니다.

메모리 소비는 커스텀 메모리 할당자(memory allocator)에 의해 제어됩니다. 이는 메모리 사용을 최적화하고 메모리 할당의 갑작스러운 급증을 방지하는 데 도움을 줍니다.